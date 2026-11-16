// ============================================================
// 虚空成形后的全屏背景动效（仅在 body.voidShapedUI 时运行）
//
// 1. 黑点：从屏幕底部随机横向位置、随机速度升起，接近屏幕中线时逐渐消融，
//    不再使用 background-position 造成的固定网格循环刷新。
// 2. 黑色细线：模拟老电影胶片上的竖向划痕，随机出现、闪烁、轻微横移后消失，
//    取代原先贯穿全屏的 45° 斜线。
//
// 画布位于所有游戏内容之后（z-index: -1000），不拦截鼠标事件。
// body 的 voidShapedUI class 被移除时会自动清理画布与监听器。
// ============================================================
(function () {
	'use strict';

	const TAU = Math.PI * 2;
	const rand = (min, max) => min + Math.random() * (max - min);
	const smoothstep = p => p * p * (3 - 2 * p);

	// 屏幕高度比例：黑点从这里开始消融，到中线完全消失
	const FADE_BEGIN = 0.63;
	const FADE_END = 0.50;

	// 进入虚空背景时的整体淡入时长（秒）
	const INTRO_TIME = 2.4;

	const MAX_SCRATCHES = 7;

	let canvas = null;
	let ctx = null;
	let dotSprite = null;
	let resizeListener = null;
	let rafId = 0;
	let running = false;

	let elapsed = 0; // 动画时间（秒），只在实际绘制时推进
	let lastFrame = 0;
	let width = 0;
	let height = 0;
	let pixelRatio = 1;

	let dots = [];
	let scratches = [];
	let nextScratchAt = 0;

	/* ---------------- 画布与黑点 ---------------- */

	function makeDotSprite() {
		const size = 32;
		const c = document.createElement('canvas');
		c.width = size;
		c.height = size;
		const g = c.getContext('2d');
		const half = size / 2;
		const grad = g.createRadialGradient(half, half, 0, half, half, half);
		grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
		grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.85)');
		grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
		g.fillStyle = grad;
		g.beginPath();
		g.arc(half, half, half, 0, TAU);
		g.fill();
		return c;
	}

	function ensureCanvas() {
		if (canvas !== null) return;
		canvas = document.createElement('canvas');
		canvas.id = 'voidBgCanvas';
		canvas.setAttribute('aria-hidden', 'true');
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		dotSprite = makeDotSprite();
		resizeListener = function () { resize(); };
		window.addEventListener('resize', resizeListener);
		resize();
	}

	function resize() {
		if (canvas === null) return;
		pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = Math.max(1, Math.round(width * pixelRatio));
		canvas.height = Math.max(1, Math.round(height * pixelRatio));
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		seedDots();
	}

	function dotCount() {
		return Math.max(36, Math.min(220, Math.round((width * height) / 15000)));
	}

	function resetDot(dot, onScreen) {
		dot.baseX = rand(-6, width + 6);
		dot.y = onScreen ? rand(height * (FADE_BEGIN - 0.06), height + 24) : height + rand(4, 120);
		dot.radius = 0.8 + Math.pow(Math.random(), 1.6) * 1.8;
		dot.speed = rand(13, 46);
		dot.drift = rand(-3.5, 3.5);
		dot.sway = rand(0.3, 1.5);
		dot.phase = rand(0, TAU);
		dot.alpha = rand(0.16, 0.42);
		return dot;
	}

	function seedDots() {
		const count = dotCount();
		dots = [];
		for (let i = 0; i < count; i++) dots.push(resetDot({}, true));
	}

	function dissolveFactor(y) {
		const begin = height * FADE_BEGIN;
		const end = height * FADE_END;
		if (y >= begin) return 1;
		if (y <= end) return 0;
		return smoothstep((y - end) / (begin - end));
	}

	function introFactor() {
		return smoothstep(Math.min(1, elapsed / INTRO_TIME));
	}

	function updateDots(dt) {
		for (let i = 0; i < dots.length; i++) {
			const dot = dots[i];
			dot.y -= dot.speed * dt;
			dot.baseX += dot.drift * dt;
			if (dot.baseX < -12) dot.baseX += width + 24;
			else if (dot.baseX > width + 12) dot.baseX -= width + 24;
			// 升到屏幕中线、完全消融后，从底部另一个随机位置重新开始
			if (dot.y <= height * FADE_END) resetDot(dot, false);
		}
	}

	function drawDots(t) {
		const intro = introFactor();
		for (let i = 0; i < dots.length; i++) {
			const dot = dots[i];
			const fade = dissolveFactor(dot.y);
			if (fade <= 0.004) continue;
			const x = dot.baseX + Math.sin(t * 0.9 + dot.phase) * dot.sway;
			const half = dot.radius * 2.6 * (0.68 + 0.32 * fade);
			ctx.globalAlpha = Math.min(1, dot.alpha * fade * intro);
			ctx.drawImage(dotSprite, x - half, dot.y - half, half * 2, half * 2);
		}
		ctx.globalAlpha = 1;
	}

	/* ---------------- 老电影式黑色细划痕 ---------------- */

	function newScratch() {
		const strong = Math.random() < 0.24;
		let top;
		let bottom;
		if (Math.random() < 0.28) {
			// 短促的局部划痕
			top = rand(height * 0.04, height * 0.66);
			bottom = top + rand(46, Math.min(240, height * 0.36));
		} else {
			// 贯穿画面上下的长划痕
			top = Math.random() < 0.45 ? -20 : rand(-10, height * 0.28);
			bottom = Math.random() < 0.35 ? height + 20 : rand(height * 0.58, height + 20);
		}
		return {
			x: rand(0, width),
			width: strong ? rand(1.4, 2.3) : rand(0.7, 1.2),
			alpha: strong ? rand(0.30, 0.50) : rand(0.12, 0.28),
			life: rand(0.9, 3.4),
			born: elapsed,
			top: top,
			bottom: Math.max(bottom, top + 40),
			drift: rand(-1.2, 1.2),
			wobble: rand(0.3, 1.1),
			wobbleSpeed: rand(3, 9),
			flickerSpeed: rand(8, 20),
			phase: rand(0, TAU),
			twin: Math.random() < 0.3,
			unstable: Math.random() < 0.25,
		};
	}

	function seedScratches() {
		scratches = [];
		const count = 2 + Math.floor(Math.random() * 2);
		for (let i = 0; i < count; i++) {
			const scratch = newScratch();
			scratch.born = elapsed - rand(0.1, scratch.life * 0.7);
			scratches.push(scratch);
		}
		nextScratchAt = elapsed + rand(0.3, 1.2);
	}

	function updateScratches() {
		if (elapsed >= nextScratchAt) {
			if (scratches.length < MAX_SCRATCHES) scratches.push(newScratch());
			nextScratchAt = elapsed + rand(0.22, 0.95);
		}
		for (let i = scratches.length - 1; i >= 0; i--) {
			if (elapsed - scratches[i].born > scratches[i].life) scratches.splice(i, 1);
		}
	}

	function drawScratches(t) {
		const intro = introFactor();
		ctx.fillStyle = '#000';
		for (let i = 0; i < scratches.length; i++) {
			const s = scratches[i];
			const age = t - s.born;
			if (age < 0 || age > s.life) continue;
			let fade = 1;
			if (age < 0.1) fade = age / 0.1;
			else if (s.life - age < 0.3) fade = Math.max(0, (s.life - age) / 0.3);
			const flicker = 0.55 + 0.45 * Math.sin(t * s.flickerSpeed + s.phase);
			let alpha = s.alpha * fade * flicker * intro;
			if (s.unstable && Math.random() < 0.18) alpha *= 0.25; // 偶发的胶片闪帧
			if (alpha <= 0.006) continue;
			const x = s.x + s.drift * age + Math.sin(t * s.wobbleSpeed + s.phase) * s.wobble + (Math.random() - 0.5) * 0.7;
			ctx.globalAlpha = Math.min(1, alpha);
			ctx.fillRect(x, s.top, s.width, s.bottom - s.top);
			if (s.twin) {
				const len = s.bottom - s.top;
				ctx.globalAlpha = Math.min(1, alpha * 0.45);
				ctx.fillRect(x + s.width + 0.7, s.top + len * 0.08, Math.max(0.6, s.width * 0.45), len * 0.82);
			}
		}
		ctx.globalAlpha = 1;
	}

	/* ---------------- 帧循环与启停 ---------------- */

	function frame(now) {
		if (!running) return;
		let dt = lastFrame === 0 ? 0 : (now - lastFrame) / 1000;
		lastFrame = now;
		if (!(dt > 0)) dt = 0;
		if (dt > 0.1) dt = 0.1; // 切后台回来时不要瞬移
		elapsed += dt;

		ctx.clearRect(0, 0, width, height);
		updateScratches();
		drawScratches(elapsed);
		updateDots(dt);
		drawDots(elapsed);
		ctx.globalAlpha = 1;

		rafId = requestAnimationFrame(frame);
	}

	function start() {
		if (running) return;
		ensureCanvas();
		running = true;
		elapsed = 0;
		lastFrame = 0;
		seedScratches();
		rafId = requestAnimationFrame(frame);
	}

	function stop() {
		if (!running) return;
		running = false;
		if (rafId) cancelAnimationFrame(rafId);
		rafId = 0;
		if (resizeListener !== null) window.removeEventListener('resize', resizeListener);
		resizeListener = null;
		if (canvas !== null && canvas.parentNode) canvas.parentNode.removeChild(canvas);
		canvas = null;
		ctx = null;
		dotSprite = null;
		dots = [];
		scratches = [];
	}

	function sync() {
		if (!document.body) return;
		if (document.body.classList.contains('voidShapedUI')) start();
		else stop();
	}

	function boot() {
		if (!document.body) return;
		sync();
		new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
	else boot();
})();
