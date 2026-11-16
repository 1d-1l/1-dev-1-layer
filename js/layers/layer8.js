(() => {
const eU = {
	style() {
		return {
			'border-radius': '0px',
			'border': hasUpgrade(this.layer, this.id) ? '2px solid red' : '',
			'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px red' : '',
			'background-color': hasUpgrade(this.layer, this.id) ? 'black' : '',
			'background-image': hasUpgrade(this.layer, this.id) ? 'repeating-linear-gradient(to bottom,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px),repeating-linear-gradient(to right,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px)' : '',
			'background-size': hasUpgrade(this.layer, this.id) ? '200% 200%' : '',
			'animation': hasUpgrade(this.layer, this.id) ? 'bgScroll 2s linear infinite' : '',
			'color': hasUpgrade(this.layer, this.id) ? 'white' : 'black',
		}; 
	},
};
const t = {
	direction: RIGHT,
	width: 300,
	height: 40,
	index: 0,
	name: '点数',
	op: '^',
	progress(){
		return player.l8.tuning[this.index].div(30).toNumber();
	},
	style()
	{
		if(player.l8.tuning[this.index].gte(30)) return {'color': 'orange'};
		if(player.l8.tuning[this.index].gte(20)) return {'color': 'green'};
		if(player.l8.tuning[this.index].gte(10)) return {'color': 'grey'};
		return {'color': 'red'};
	},
	display(){
		return '调律' + this.index + '[' + player.l8.tuning[this.index] + '](使' + this.name + '获取' + this.op + format(player.l8.tuning[this.index].div(10)) + ')';
	},
	unlocked(){
		return layers.l8.tunUnlocked(this.index);
	}
};
const tUp = {
	index: 0,
	display(){
		return '等级+1';
	},
	onClick(){
		player.l8.tuning[this.index] = player.l8.tuning[this.index].add(1).min(tmp.l8.tunMax);
	},
	style(){
		return {"min-height":"0px","height":"35px","width":"70px"};
	},
	canClick(){
		return player.l8.tuning[this.index].lt(tmp.l8.tunMax) && tmp.l8.availTunLevel.gte(1);
	},
	unlocked(){
		return layers.l8.tunUnlocked(this.index);
	}
};
const tDown = {
	index: 0,
	display(){
		return '等级-1';
	},
	onClick(){
		player.l8.tuning[this.index] = player.l8.tuning[this.index].sub(1).max(tmp.l8.tunMin);
	},
	style(){
		return {"min-height":"0px","height":"35px","width":"70px"};
	},
	canClick(){
		return player.l8.tuning[this.index].gt(tmp.l8.tunMin);
	},
	unlocked(){
		return layers.l8.tunUnlocked(this.index);
	}
};
const unityBox = {
	title: '统一盒子',
	ed: '',
	op: '+',
	cost(x) {
		let base = n(0.1), mul = n(3);
		let ans = base.mul(mul.pow(x.pow(2)));
		return ans;
	},
	maxCanBuy(x = player.l8.unityPoints) {
		if(x.lt(0.1)) return n(0);
		let ans = x.div(0.1).log(3).root(2).add(1).floor();
		return ans;
	},
	display() {
		return this.ed + '<br/>效果: ' + this.op + format(this.effect(getBuyableAmount(this.layer, this.id))) + '<br/>价格: ' + format(this.cost()) + ' 统一点数';
	},
	canAfford() {
		return player.l8.unityPoints.gte(this.cost());
	},
	buy() {
		player.l8.unityPoints = player.l8.unityPoints.sub(this.cost());
		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
	},
	effect(x) {
		let base = n(0);
		return base;
	},
	unlocked() {
		return true;
	},
	style() { return {'border-radius': "10px",height: "120px", width: "120px", 'background-color': this.canAfford() ? 'orange' : ''}},
	tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
};
const baC = {
	index: 0,
	unlindex: 0,
	name: '炼金挑战-???',
	challengeDescription() { return '???'; },
	unlocked() { return player.l8.baCU[this.index] && player.l8.baSelected === this.index; },
	canComplete() {
		return false
	},
	goal() {
		let amt = player.l8.chalcomp[this.index]
		let next = amt.add(1)
		return next
	},
    goalDescription() {return this.getNextAt() + ' loader3229等级'},
	rewardDescription() {
		let a = inChallenge("l8", this.id) ? "<br>+"
			+ formatWhole(tmp.l8.challenges[this.id].countcalc.sub(player.l8.chalcomp[this.index]).max(0))
			+ " 完成次数<br>下一次在" + format(layers.l8.challenges[this.id].getNextAt())
			+ "loader3229等级"
		: "";
		return "经验值x" + format(this.rewardEffect()) + "<br>完成次数：" + formatWhole(player.l8.chalcomp[this.index]) + a
	},
	rewardEffect() { return player.l8.chalcomp[this.index].mul(0.5).add(1) },
	countcalc() {
		if(!inChallenge('l8', this.id)) return n(0);
		let x = layers.l4.total_bars().div(1024).floor();
		return x;
	},
	getNextAt() {
		let next = tmp.l8.challenges[this.id].countcalc.max(player.l8.chalcomp[this.index]).add(1);
		return next
	},
	onExit() {
		player.l8.chalcomp[this.index] = tmp.l8.challenges[this.id].countcalc.floor().max(player.l8.chalcomp[this.index])
	},
	onEnter() {
		player.points = n(0);
		player.l1.points = n(0);
		player.l1.repl = n(0);
		if(hasUpgrade('l8', 174)) player.l4.level = player.l4.level.max(player.l8.chalcomp[this.index]);
		updateTemp()
	},
	style() {
		return {
			'border-color': 'lightgreen',
			'background-image': inChallenge('l8', this.id) ? 'radial-gradient(circle at center, red, lightgreen)' : 'radial-gradient(circle at center, black 50%, lightgreen)',
			'color': 'white',
			'shadow': inChallenge('l8', this.id) ? '0px 0px 24px green' : '',
			'border-radius': '0px',
			'width': '620px',
			'height': '320px',
		};
	},
};
const baCS = {
	index: 0,
	name: '??',
	display(){
		return this.name + '<br/>' + player.l8.chalcomp[this.index] + '/3229';
	},
	onClick(){
		player.l8.baSelected = this.index;
	},
	style(){
		return {"min-height":"0px","border-radius":"0px","height":"45px","width":"70px","border-color":player.l8.baSelected===this.index?"green":"grey","background-color":"lightgreen"};
	},
	canClick(){
		return player.l8.baCU[this.index];
	},
	unlocked(){
		return true;
	}
};
const brickUpgrade = {
	cost: n(1),
	color: 'white',
	background: 'black',
	branches: [],
	canAfford() {
		let flag = true;
		for(let i in this.branches)
		{
			if(!hasUpgrade(this.layer, this.branches[i])) flag = false;
		}
		return player.l8.brick.valid.gte(this.cost) && flag;
	},
	pay() {
		player.l8.brick.valid = player.l8.brick.valid.sub(this.cost);
	},
	style() {
		return {
			'border-radius': '0px',
			'border': hasUpgrade(this.layer, this.id) ? '2px solid ' + this.color : '1px solid grey',
			'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 5px 4px ' + this.background : '0px 0px 2px 2px ' + this.background,
			'background': hasUpgrade(this.layer, this.id) ? this.backgroundImage !== undefined ? this.backgroundImage : this.background : (this.canAfford() ? 'black' : null),
			'color': hasUpgrade(this.layer, this.id) ? this.color : (this.canAfford() ? 'white' : null),
			'height': '125px',
			'width': '125px',
			'transform': 'scale(0.85)',
			'font-size': '12px',
		};
	},
	currencyDisplayName: '可用砖',
	unlocked() {
		return player.l8.brick.unlocked;
	},
};
const brickDim = {
	index: 0,
	base: n(1),
	mul: n(2),
	title() {return '第' + (this.index + 1) + '维度x2'},
	cost(x) {
		let ans = this.base.mul(this.mul.pow(x));
		return ans;
	},
	maxCanBuy(x = player.l8.brick.valid) {
		if(x.lt(this.base)) return n(0);
		return x.div(this.base).log(this.mul).add(1).floor();
	},
	display() {
		return '价格: ' + format(this.cost()) + ' 可用砖';
	},
	canAfford() {
		return player.l8.brick.valid.gte(this.cost());
	},
	buy() {
		player.l8.brick.valid = player.l8.brick.valid.sub(this.cost());
		player.l8.brick.dim[this.index] = player.l8.brick.dim[this.index].add(1);
		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
	},
	effect(x) {
		if(x.lt(1)) return n(1);
		let base = x.pow_base(2);
		return base;
	},
	unlocked() {
		return true;
	},
	style() { return {'border-radius': "10px",height: "50px", width: "200px", backgroundColor: this.canAfford() ? 'brown' : null}},
	tooltip(){return "数量: <h2 style='color:brown;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
};
function brickDimInit() {
	let content = [];
	for(let i = 0;i <= 5;i++)
	{
		content.push(['row', [['display-text', function() {return `第${i+1}砖维度(${format(player.l8.brick.dim[i])})<br>x${format(layers.l8.brickDimMult(i))}`}], ['buyable', 71 + i]]]);
	}
	return content;
};
function predictableRandom(x) {
	let start = Math.pow(x % 97, 4.3) * 232344573;
	const a = 15485863;
	const b = 521791;
	start = (start * a) % b;
	for (let i = 0; i < ((x * x) % 90) + 90; i++) {
		start = (start * a) % b;
	}
	return start / b;
}
function skyMilestoneStyle(id) {
	if(hasMilestone('l8', id))
	{
		return {
			'border-color': 'white',
			'background-color': 'black',
			'border-radius': '5px',
			'box-shadow': '0px 0px 10px 10px white',
			'color': 'white',
			'text-shadow': '0px 0px 4px red, 0px 0px 2px red',
		};
	}
	else
	{
		return {
			'border-color': 'grey',
			'background-color': 'black',
			'border-radius': '5px',
			'box-shadow': '0px 0px 10px white',
			'color': 'red',
		};
	}
}
addLayer("l8", {
    infoboxes: {
        introBox: {
            title: 'Layer 8',
            body() { return '本层由 Seanxlx 制作。本层及其子层内的生产一般不受全局速度影响。' },
        },
        introBoxUnity: {
            title: 'Layer 8.1',
            body() { return '本子层由 Seanxlx 制作。<br>它的目的是提升玩家在前七层的Qol。' },
			style() { return {'border-color': 'orange'}; },
        },
		introBoxBioalchemy: {
			title: 'Layer 8.2',
			body() { return '本子层由 Seanxlx 制作。<br><span style="color: red">警告：当你看到这行字时，已进入高危实验区域。</span>'; },
			style() { return {'border-color': 'lightgreen'}; },
		},
		introBoxBrick: {
			title: 'Layer 8.3',
			body() { return '本子层由 Seanxlx 制作。'; },
			style() { return {'border-color': 'brown'}; },
		},
		introBoxErosion: {
			title: 'Layer 8.7',
			body() { return '本子层由 Seanxlx 制作。<br>侵蚀正在反向破坏所有层级的资源……请立即执行砖重置以躲避侵蚀。' },
			style() { return {'border-color': 'purple', 'background-image': 'radial-gradient(purple 0%, white 60%, white 100%)', 'color': 'rgb(32, 0, 64)'}; },
		},
		introBoxSky: {
			title: 'Layer 8.9',
			body() { return '本子层由 Seanxlx 制作。' },
			style() { return {'border-color': 'white'}; },
		},
    },
	devSpeedIgnore: true,
    name: "第八层 制作：Seanxlx",
    symbol: "E",
    position: 0,
    row: 4,
    branches: [],
    hotkeys: [
        { key: "8", description: "8：进行第八层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    startData() {
        return {
			seed: Math.random(),
			rEL: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			
            unlocked: false,
			points: n(0),
			total: n(0),
			intrinsic: n(0),
			intDim: [n(0), n(0), n(0), n(0), n(0), n(0)],
			tuning: [n(10), n(10), n(10), n(10), n(10), n(10), n(10), n(10), n(10)],
			unityPoints: n(0),
			unitied: false,
			bhMass: n(0),
			bhLevel: n(0),
			darkMatter: n(0),
			voidMatter: n(0),
			lastBhBoom: Date.now(),
			lastBhTerbulence: Date.now(),
			baExp: n(0),
			baLevel: 0,
			baStudyLevel: 0,
			baTime: 0,
			baCU: [false, false, false, false, false, false, false, false, false],
			chalcomp: [n(0), n(0), n(0), n(0), n(0), n(0), n(0), n(0), n(0)],
			baSelected: 0,
			baC: {
				unl1: false,
				unl2: false,
				proactiveAttackedCD: n(0),
				lastInjuredTime: n(0),
				chal4cache: false,
				chal7doomed: [0, 0, 0, 0, 0, 0, 0],
				chal7doomedCD: 5,
				reviveCD: n(0),
			},
			brick: {
				unlocked: false,
				value: n(0),
				valid: n(0),
				dim: [n(0), n(0), n(0), n(0), n(0), n(0)],
				energy: n(0),
			},
			voidShaped: false,
			voidShapeAnimRunned: false,
			erosion: {
				unlocked: false,
				run: [false, false, false, false, false, false, false],
				time: [n(0), n(0), n(0), n(0), n(0), n(0), n(0)],
				lastCycle: [n(0), n(0), n(0), n(0), n(0), n(0), n(0)],
			},
			resetTime: n(0),
        }
    },
    color: "red",
    requires: new Decimal(2 ** 100),
    resource: "本质",
    baseResource: "本质基础值",
    baseAmount() { return tmp.l8.basicAmount },
    type: "normal",
    exponent: 1 / 100,
	getResetGain() {
		if (tmp.l8.baseAmount.lt(tmp.l8.requires)) return decimalZero
		let gain = tmp.l8.baseAmount.div(tmp.l8.requires).pow(tmp.l8.exponent).mul(tmp.l8.gainMult).pow(tmp.l8.gainExp)
		if (gain.gte(tmp.l8.softcap)) gain = gain.pow(tmp.l8.softcapPower).mul(tmp.l8.softcap.pow(decimalOne.sub(tmp.l8.softcapPower)))
		gain = gain.mul(tmp.l8.directMult)
		if(gain.gte('1e256')) gain = n('1e256').mul(gain.div('1e256').log10().pow(0.5).pow_base(10))
		// 七重诅咒2：本质获取^0.5
		if(player.l8.voidShaped) gain = gain.pow(0.5);
		return gain.floor().max(0);
	},
	softcap:n("1e900"),
	softcapPower:n(0.1),
    gainMult() {
        let mult = new Decimal(1)
		if(hasMilestone('l8', 23)) mult = mult.mul(5);
		if(hasMilestone('l8', 25)) mult = mult.mul(5);
		if(hasMilestone('l8', 30)) mult = mult.mul(layers.l8.milestones[30].effect());
        mult = mult.mul(buyableEffect('l8', 17));
		if(hasUpgrade('l8', 142)) mult = mult.mul(upgradeEffect('l8', 142));
		if(hasUpgrade('l8', 141)) mult = mult.mul(upgradeEffect('l8', 141));
		if(hasUpgrade('l8', 133)) mult = mult.mul(tmp.l8.baCeff2);
		if(player.l8.darkMatter.gt(0)) mult = mult.mul((player.l8.voidShaped ? player.l8.darkMatter.pow(0.6) : player.l8.darkMatter).mul(player.l8.voidMatter.gt(0) ? player.l8.voidMatter.pow(0.3) : 1));
		if(hasUpgrade('l8', 163)) mult = mult.mul(player.l8.erosion.time[0].pow(0.75).add(1));
		if(hasUpgradeCharged('l1', 11)) mult = mult.mul(run(layers.l1.upgrades[11].charged.effect, layers.l1.upgrades[11]));
		if(hasUpgradeCharged('l1', 12)) mult = mult.mul(run(layers.l1.upgrades[12].charged.effect, layers.l1.upgrades[12]));
		if(hasUpgradeCharged('l1', 21)) mult = mult.mul(run(layers.l1.upgrades[21].charged.effect, layers.l1.upgrades[21]));
		if(player.l8.voidMatter.gt(0)) mult = mult.mul(player.l8.voidMatter.pow(1.5));
		return mult
    },
    gainExp() {
        let base = new Decimal(1)
		return base;
    },
    passiveGeneration() {
        let mult = 0
		//别在这里写，在这里写就吃全局速度了
        return mult
    },
	basicAmount() {
		let base = n(1);
		for(let i = 1;i <= 4;i++) base = base.mul(tmp.l8['baFactor' + i]);
		//别的乘数在factor4里面加
		return base;
	},
	baFactor1() {
		let base = n(1);
		base = base.mul(player.points.add(1).log10().add(1).pow(2));
		base = base.pow(tmp.l8.brickEff);
		return base;
	},
	baFactor2() {
		let base = n(1);
		base = base.mul(layers.l4.total_bars().div(1024).add(1).pow(10));
		if(hasUpgrade('l8', 143)) base = base.pow(7);
		if(hasUpgrade('l8', 125)) base = base.pow(3);
		return base;
	},
	baFactor3() {
		let base = n(1);
		base = base.mul(player.l7.points.add(1).log10().sub(125).div(100).add(1).max(1).pow(10));
		if(hasUpgrade('l8', 143)) base = base.pow(7);
		if(hasUpgrade('l8', 125)) base = base.pow(3);
		return base;
	},
	baFactor4() { //这里给乘数
		let base = n(1);
		base = base.mul(buyableEffect('l8', 11));
		base = base.mul(buyableEffect('l8', 12));
		base = base.mul(buyableEffect('l8', 13));
		base = base.mul(tmp.l8.intEff1);
		base = base.pow(buyableEffect('l8', 14));
		base = base.pow(buyableEffect('l8', 15));
		base = base.pow(buyableEffect('l8', 16));
		base = base.pow(tmp.l8.milestones[17].effect);
		if(hasUpgradeCharged('l2', 11)) base = base.mul(run(layers.l2.upgrades[11].charged.effect, layers.l2.upgrades[11]));
		return base;
	},
	intDimMult(id) {
		if(id === undefined) return n(0);
		let base = player.l8.intDim[id];
		if(id >= 0 && id <= 5) base = base.mul(buyableEffect('l8', 21 + id));
		if(hasUpgrade('l8', 101)) base = base.mul(100);
		base = base.mul(tmp.l8.brickEnergyEffect);
		
		base = base.mul(tmp.l8.intTickspeed); //不吃指数，放在pow后面
		base = base.div(10 ** id);
		
		let ss = tmp.l8.brickEnergyEffect2.mul(16).min(512);
		if(base.gte(n(2).pow(1024))) base = base.root(n(1024).div(ss)).mul(n(2).pow(n(1024).sub(ss)));
		return base;
	},
	intDimDesc(id) {
		let n = ['一', '二', '三', '四', '五', '六'];
		return '第' + n[id] + '本征维度[' + format(player.l8.intDim[id]) + ']<br />产量: ' + format(layers.l8.intDimMult(id)) + '/s';
	},
	intEff1() {
		let base = player.l8.intrinsic.add(1);
		if(base.gte(1e240)) base = base.root(3).mul(1e160);
		return base;
	},
	intEff2() {
		let base = player.l8.intrinsic.max(1).pow_base(1.003).sub(0.003);
		if(base.gte(1e250)) base = base.log10().div(5).sub(49).pow(0.5).add(49).mul(5).pow_base(10);
		if(base.gte('1e20000')) base = base.log10().div(20000).log10().add(20).mul(1000).pow_base(10);
		return base;
	},
	intTickspeed() {
		let base = n(1);
		if(hasUpgrade('l8', 155)) base = base.mul(buyableEffect('l8', 31).pow(1.2));
		else base = base.mul(buyableEffect('l8', 31));
		return base;
	},
	tunLevelMax() {
		let base = n(90);
		base = base.add(buyableEffect('l8', 41));
		base = base.add(buyableEffect('l8', 42));
		base = base.add(buyableEffect('l8', 43));
		return base;
	},
	availTunLevel() {
		let max = tmp.l8.tunLevelMax;
		for(let i = 0;i < 9;i++) max = max.sub(player.l8.tuning[i]);
		return max;
	},
	tunUnlocked(index) {
		switch(index)
		{
			case 3:
				return hasUpgrade('l8', 51);
			case 4:
				return hasUpgrade('l8', 52);
			case 5:
				return hasUpgrade('l8', 53);
			case 6:
				return hasUpgrade('l8', 54);
			case 7:
				return hasUpgrade('l8', 55);
			case 8:
				return hasUpgrade('l8', 56);
			default:
				return true;
		}
	},
	tunMin() {
		let base = n(9);
		if(hasUpgrade('l8', 61)) base = n(8);
		if(hasUpgrade('l8', 62)) base = n(7);
		if(hasUpgrade('l8', 63)) base = n(6);
		if(hasUpgrade('l8', 64)) base = n(5);
		if(hasUpgrade('l8', 65)) base = n(3);
		if(hasUpgrade('l8', 66)) base = n(0);
		return base;
	},
	tunMax() {
		let base = n(11);
		if(hasUpgrade('l8', 61)) base = n(12);
		if(hasUpgrade('l8', 62)) base = n(13);
		if(hasUpgrade('l8', 63)) base = n(15);
		if(hasUpgrade('l8', 64)) base = n(20);
		if(hasUpgrade('l8', 65)) base = n(25);
		if(hasUpgrade('l8', 66)) base = n(30);
		return base;
	},
	uPGain() {
		let base = n(0);
		if(!player.l8.unitied) base = base.add(2);
		base = base.add(player.l8.points.root(2).mul(2));
		return base.floor();
	},
	uBTL() {
		let cnt = new Decimal(0);
		for(let i = 100;i <= 116;i++)
		{
			for(let j = 1;j <= 5;j++) cnt = cnt.add(getBuyableAmount('l8', i * 10 + j));
		}
		return cnt;
	},
	bhMassGain() {
		if(!hasUpgrade('l8', 14)) return n(0);
		let base = player.l8.bhLevel.add(1).mul(player.l8.bhLevel.add(5)).div(6);
		for(let i = 21;i <= 25;i++)
		{
			if(hasUpgrade('l8', i)) base = base.add(upgradeEffect('l8', i));
		}
		if(hasUpgrade('l8', 102)) base = base.mul(10);
		if(hasUpgrade('l8', 173)) base = base.mul(upgradeEffect('l8', 173));
		if(hasUpgradeCharged('l1', 14)) base = base.mul(run(layers.l1.upgrades[14].charged.effect, layers.l1.upgrades[14]));
		if(hasUpgradeCharged('l2', 23)) base = base.mul(run(layers.l2.upgrades[23].charged.effect, layers.l2.upgrades[23]));
		if(player.l8.darkMatter.gt(0)) base = base.mul(player.l8.darkMatter.pow(0.2));
		if(player.l8.voidMatter.gt(0)) base = base.mul(player.l8.voidMatter.pow(1.5));
		return base;
	},
	bhEff() {
		let base = player.l8.bhLevel.mul(0.025).add(1);
		if(hasUpgrade('l8', 152)) base = base.pow(player.l8.bhLevel.add(1).log10().add(1));
		// 七重诅咒3：前七层速度降低1e12倍
		if(player.l8.voidShaped) base = base.div(1e12).softcap(1,0.2);
		return base;
	},
	bhDmLevelBoost() {
		if(player.l8.bhLevel.lt(2000)) return n(1);
		return player.l8.bhLevel.add(1).ln().div(5).add(1);
	},
	bhVmLevelBoost() {
		if(player.l8.bhLevel.lt(2000)) return n(1);
		return player.l8.bhLevel.sub(1999).ln().div(5).add(1);
	},
	voidShapeAnimRunning: false,
	startVoidShapeAnim() {
		if(layers.l8.voidShapeAnimRunning) return;
		if(player.l8.voidShapeAnimRunned) return;
		layers.l8.voidShapeAnimRunning = true;
		player.l8.voidShapeAnimRunned = true;
		let body = document.body;
		let overlay = document.createElement('div');
		overlay.id = 'voidAnimOverlay';
		body.appendChild(overlay);
		// 界面如水化开，拉长成丝线坠入中心
		body.classList.add('voidMelting');
		// 黑幕在化开中途渗入
		setTimeout(() => overlay.classList.add('active'), 1400);
		// 纯粹黑暗中的白线闪现
		setTimeout(() => {
			for(let i = 0;i < 26;i++)
			{
				setTimeout(() => {
					let line = document.createElement('div');
					line.className = 'voidFlashLine';
					line.style.left = (Math.random() * 100) + '%';
					line.style.top = (Math.random() * 100) + '%';
					line.style.width = (60 + Math.random() * 320) + 'px';
					line.style.setProperty('--rot', (Math.random() * 360) + 'deg');
					overlay.appendChild(line);
					setTimeout(() => line.remove(), 800);
				}, i * 130 + Math.random() * 250);
			}
		}, 2800);
		// 黑幕褪去，界面自虚空缓缓隐出并恢复色彩
		setTimeout(() => {
			overlay.classList.remove('active');
			body.classList.remove('voidMelting');
			body.classList.add('voidEmerge');
			body.classList.add('voidShapedUI');
		}, 6800);
		setTimeout(() => {
			body.classList.remove('voidEmerge');
			overlay.remove();
			layers.l8.voidShapeAnimRunning = false;
		}, 10400);
	},
	// ===== 虚空成形（虚空大重置）=====
	// 七重祝福：以 voidShaped 为凭据永久生效（1. 数据层新升级 已实装，2~7 待定）
	// 七重诅咒的实装位置：
	//   1 所有侵蚀常驻生效且固定^0.02，无周期重置 -> erosionEff() / update()
	//   2 本质获取^0.5            -> getResetGain()
	//   3 前七层速度降低1e12倍     -> bhEff()
	//   4 无法获得暗物质和砖       -> bhDark.canClick() / bR
	//   5 中子素块效果^0.3         -> 中子素块效果计算处（搜索“七重诅咒5”）
	//   6 禁用核心效果4,5          -> layers.l2.coreEffect4 / coreEffect5
	//   7 无法进行频率跃迁         -> 搜索“七重诅咒7”
	// 大重置：把第1~8层的全部内容归零，只保留虚空之印(voidShaped)与成形动画标记；
	// 成就层(AC)不在“1~8层”范围内，因此不受影响。
	voidBigReset() {
		let keepAnimRunned = player.l8.voidShapeAnimRunned;
		let resetLayers = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8'];
		for(let i = 0;i < resetLayers.length;i++)
		{
			let lr = resetLayers[i];
			layerDataReset(lr);
			// layerDataReset 不会清空空的数组字段，充能升级需要单独清掉
			player[lr].chargedUpgrades = [];
			// 中止进行中的挑战，避免残留到新一轮
			Vue.set(player[lr], 'activeChallenge', null);
		}
		player.l8.voidShaped = true;
		player.l8.voidShapeAnimRunned = keepAnimRunned;
		// 虚空成形阶段：七种侵蚀常驻生效（update 里每帧也会兜底）
		player.l8.erosion.unlocked = true;
		player.l8.erosion.run = [true, true, true, true, true, true, true];
		player.points = decimalZero;
		updateTemp();
		updateTemp();
		needCanvasUpdate = true;
	},
	bhUpCost() {
		let baseLevel = player.l8.bhLevel;
		baseLevel = baseLevel.mul(new Decimal(2).pow(baseLevel.div(50).floor()));
		return baseLevel.add(1).mul(baseLevel.add(6)).mul(2);
	},
	bhBoomCDSecond() {
		let base = n(600);
		if(hasUpgrade('l8', 161)) base = base.mul(0.5);
		for(let i = 41;i <= 45;i++)
		{
			if(hasUpgrade('l8', i)) base = base.mul(upgradeEffect('l8', i));
		}
		if(player.l8.bhLevel.gte(600)) base = base.div(player.l8.bhLevel.div(10).sub(59));
		return base;
	},
	bhBoomEffect() {
		let base = player.l8.bhLevel;
		if(hasUpgrade('l8', 11)) base = base.pow(player.l8.tuning[8].div(10));
		if(hasUpgrade('l8', 162)) base = base.mul(2);
		return base;
	},
	bhTerbulenceCDSecond() {
		let base = n(60);
		if(player.l8.bhLevel.gte(700)) base = base.div(player.l8.bhLevel.div(20).sub(34).root(1.5));
		return base;
	},
	bhTerbulenceEffect() {
		let base = player.l8.bhLevel.sub(600).max(0).mul(2).root(1.5).pow_base(2).mul(100);
		if(hasUpgradeCharged('l2', 13)) base = base.pow(run(layers.l2.upgrades[13].charged.effect, layers.l2.upgrades[13]));
		if(hasUpgradeCharged('l2', 24)) base = base.pow(run(layers.l2.upgrades[24].charged.effect, layers.l2.upgrades[24]));
		return base;
	},
	expRate() {
		let need = [50, 200, 400,
		5000, 30000, 200000,
		1e7, 1e8, 1e9,
		1e12, 1e14, 1e16,
		1e20, 1e25, 1e30,
		Infinity];
		return player.l8.baExp.div(need[player.l8.baLevel]);
	},
	baLevelName() {
		let n = ['初学者I', '初学者II', '初学者III',
		'探索者I', '探索者II', '探索者III',
		'辨析者I', '辨析者II', '辨析者III',
		'大师I', '大师II', '大师III',
		'宗师I', '宗师II', '宗师III',
		'神'];
		return n[player.l8.baLevel];
	},
	baLevelEffect() {
		let e = [1, 1.01, 1.02,
		1.1, 1.2, 1.3,
		2, 2.5, 3,
		10, 20, 30,
		1000, 2000, 3000,
		100000
		];
		return e[player.l8.baLevel];
	},
	baExpMult() {
		let base = n(1);
		for(let i = 1;i <= 3;i++)
		{
			for(let j = 1;j <= 3;j++)
			{
				let id = i * 10 + j;
				base = base.mul(challengeEffect('l8', id));
			}
		}
		return base;
	},
	basicLoaderLevel() {
		let cnt = n(0);
		for(let i = 0;i < 8;i++) cnt = cnt.add(player.l8.chalcomp[i]);
		let base = cnt.div(29061).pow(1.025).mul(3228).add(1);
		if(hasUpgrade('l8', 94))
		{
			if(cnt.lt(400))
			{
				base = cnt.div(4);
			}
			else
			{
				base = cnt.sub(400).mul(3129 / 28661).add(100);
			}
		}
		return base.ceil();
	},
	baCeff2() {
		let cnt = n(0);
		for(let i = 0;i < 8;i++) cnt = cnt.add(player.l8.chalcomp[i]);
		let base = cnt.root(2).pow_base(hasUpgradeCharged("l2",22)?1.75:1.35);
		return base;
	},
	brickGainExact() {
		if(player.l8.points.lt(2e4)) return n(0);
		if(player.points.lt(hasUpgrade('l8', 104) ? 'e1.150e9' : 'e1.250e9')) return n(0);
		let base = player.l8.points.root(10).sub(2e4 ** 0.1).add(1);
		if(hasUpgrade('l8', 131)) base = base.mul(5);
		if(hasUpgrade('l8', 183)) base = base.mul(upgradeEffect('l8', 183));
		if(hasUpgradeCharged('l1', 24)) base = base.mul(run(layers.l1.upgrades[24].charged.effect, layers.l1.upgrades[24]));
		if(hasUpgradeCharged('l2', 22)) base = base.mul(run(layers.l2.upgrades[22].charged.effect, layers.l2.upgrades[22]));
		// 七重诅咒6：砖获取^0.5
		if(player.l8.voidShaped) base = base.pow(0.5);
		return base;
	},
	brickGain() {
		return tmp.l8.brickGainExact.floor();
	},
	brickEff() {
		let base = player.l8.brick.value.add(1).log10().add(1);
		if(hasUpgrade('l8', 121)) base = base.pow(1.2);
		return base;
	},
	brickDimUnlocked() {
		return player.l8.brick.value.gte(100);
	},
	brickEnergyRate() {
		let base = n(0.5);
		return base;
	},
	brickEnergyEffect() {
		let base = player.l8.brick.energy.pow(tmp.l8.brickEnergyRate);
		return base.max(1);
	},
	brickEnergyEffect2() {
		let base = player.l8.brick.energy.add(1).log10().div(100).add(1);
		if(hasUpgrade('l8', 172)) base = base.pow(10);
		return base.max(1).min(1024);
	},
	brickDimMult(id) {
		if(id === undefined) return n(0);
		let base = player.l8.brick.dim[id];
		if(id >= 0 && id <= 5) base = base.mul(buyableEffect('l8', 71 + id));
		if(hasUpgrade('l8', 132)) base = base.mul(10);
		if(hasUpgradeCharged('l1', 15)) base = base.mul(run(layers.l1.upgrades[15].charged.effect, layers.l1.upgrades[15]));
		
		base = base.div(10 ** id);
		return base;
	},
	erosionEff(id) {
		// 七重诅咒1：所有侵蚀固定于指数^0.02
		if(player.l8.voidShaped) return n(0.02);
		let base = n(1);
		switch(id)
		{
			case 0:
				base = player.l8.erosion.time[0].root(3).pow_base(0.95).max(0.1);
				return base;
			case 1:
				base = player.l8.erosion.time[1].root(3.1).pow_base(0.951).max(0.1);
				return base;
			case 2:
				base = player.l8.erosion.time[2].root(3.2).pow_base(0.952).max(0.1);
				return base;
			case 3:
				base = player.l8.erosion.time[3].root(3.3).pow_base(0.953).max(0.1);
				if(hasUpgrade('l8', 105) && player.l8.activeChallenge >= 11 && player.l8.activeChallenge <= 33) base = n(1);
				return base;
			case 4:
				base = player.l8.erosion.time[4].root(3.4).pow_base(0.954).max(0.1);
				return base;
			case 5:
				base = player.l8.erosion.time[5].add(1).log10().pow_base(0.95).max(0.1);
				return base;
			case 6:
				base = player.l8.erosion.time[6].root(3.5).pow_base(0.955).max(0.1);
				return base;
			default:
				return base;
		}
		return base;
	},
	erosionInterval(id) {
		let base = [1, 2, 4, 6, 8, 10, 15];
		if(player.l8.voidShaped && (!player.l8.voidShapeAnimRunned)) return n(0.02)
		return n(base[id]*(hasUpgradeCharged("l1",14)?run(layers.l1.upgrades[14].charged.effect, layers.l1.upgrades[14]).min(10).toNumber():1));
	},
	isErosing() {
		for(let i = 0;i < 7;i++) if(player.l8.erosion.run[i]) return true;
		return false;
	},
    update(diff) {
		if(player.l8.voidShaped && !document.body.classList.contains('voidShapedUI')) document.body.classList.add('voidShapedUI');
		if(layers.l8.intDimMult(0).gt(0)) player.l8.intrinsic = player.l8.intrinsic.add(layers.l8.intDimMult(0).mul(diff));
		for(let i = 1;i <= 5;i++)
		{
			if(layers.l8.intDimMult(i).gt(0)) player.l8.intDim[i - 1] = player.l8.intDim[i - 1].add(layers.l8.intDimMult(i).mul(diff));
		}
		if(hasUpgrade('l8', 14)) player.l8.bhMass = player.l8.bhMass.add(tmp.l8.bhMassGain.mul(diff));
		if(hasUpgrade('l8', 181)) for(let i = 0;i < 10;i++) if(layers.l8.clickables.bhUp.canClick()) layers.l8.clickables.bhUp.onClick();
		if(hasUpgrade('l8', 15))
		{
			if(player.l8.baTime < Date.now() && player.l8.baTime > 0)
			{
				let mx = 0, mn = 0;
				if(player.l8.baStudyLevel === 1) mn = 20, mx = 40;
				else if(player.l8.baStudyLevel === 2) mn = 110, mx = 242;
				else if(player.l8.baStudyLevel === 3) mn = 363, mx = 726;
				mn *= tmp.l8.baExpMult.toNumber(), mx *= tmp.l8.baExpMult.toNumber();
				let gain = n(Math.floor(predictableRandom(player.l8.seed * player.l8.rEL[player.l8.baStudyLevel - 1]) * (mx - mn) + mn));
				player.l8.rEL[player.l8.baStudyLevel]++;
				if(player.l8.baStudyLevel === 1)
				{
					let insight = predictableRandom(player.l8.seed * player.l8.rEL[3]);
					if(insight <= 0.1) player.l8.baCU[0] = true;
					else if(insight <= 0.2) player.l8.baCU[1] = true;
					else if(insight <= 0.3) player.l8.baCU[2] = true;
					player.l8.rEL[3]++;
				}
				if(player.l8.baStudyLevel === 2)
				{
					let insight = predictableRandom(player.l8.seed * player.l8.rEL[4]);
					if(insight <= 0.1) player.l8.baCU[3] = true;
					else if(insight <= 0.2) player.l8.baCU[4] = true;
					else if(insight <= 0.3) player.l8.baCU[5] = true;
					player.l8.rEL[4]++;
				}
				if(player.l8.baStudyLevel === 3)
				{
					let insight = predictableRandom(player.l8.seed * player.l8.rEL[5]);
					if(insight <= 0.1) player.l8.baCU[6] = true;
					else if(insight <= 0.2) player.l8.baCU[7] = true;
					else if(insight <= 0.3) player.l8.baCU[8] = true;
					player.l8.rEL[5]++;
				}
				player.l8.baExp = player.l8.baExp.add(gain);
				player.l8.baStudyLevel = 0;
				player.l8.baTime = 0;
			}
			if(hasMilestone('l8', 25) && player.points.gte('e1.25e9')) player.l8.points = player.l8.points.add(tmp.l8.resetGain.mul(hasUpgrade('l8', 115) ? 2.5 : 0.25).mul(diff));
			if(hasUpgrade('l8', 91)) player.l8.points = player.l8.points.add(tmp.l8.resetGain.mul(0.025).mul(diff));
			if(hasUpgrade('l8', 124)) player.l8.points = player.l8.points.add(tmp.l8.resetGain.mul(tmp.l8.bhTerbulenceEffect.max(0)).mul(0.01).mul(diff));
			if(hasUpgrade('l8', 71) && player.l6.tp.lt(1e6)) player.l6.tp = player.l6.tp.add(n(100).mul(diff)).min(1e6);
		}
		if(tmp.l8.expRate.gte(1))
		{
			let need = [50, 200, 400,
			5000, 30000, 200000,
			1e7, 1e8, 1e9,
			1e12, 1e14, 1e16,
			1e19, 1e22, 1e25,
			Infinity];
			player.l8.baExp = player.l8.baExp.sub(need[player.l8.baLevel]);
			player.l8.baLevel = player.l8.baLevel + 1;
		}
		if(!player.l8.erosion.unlocked && hasMilestone('l8', 23)) player.l8.erosion.unlocked = true;
		// 虚空成形阶段：七种侵蚀全部强行生效
		if(player.l8.voidShaped)
		{
			player.l8.erosion.unlocked = true;
			for(let i = 0;i < 7;i++) player.l8.erosion.run[i] = true;
		}
		if(player.l8.erosion.unlocked)
		{
			if(!player.l8.erosion.run[0] && player.l1.points.gte('e1.5e10')) player.l8.erosion.run[0] = true;
			if(!player.l8.erosion.run[1] && player.l2.points.gte('e7.5e9')) player.l8.erosion.run[1] = true;
			if(!player.l8.erosion.run[2] && player.l3.points.gte('ee9')) player.l8.erosion.run[2] = true;
			if(!player.l8.erosion.run[3] && player.l4.points.gte('ee8')) player.l8.erosion.run[3] = true;
			if(!player.l8.erosion.run[4] && player.l5.essence.gte('ee6')) player.l8.erosion.run[4] = true;
			if(!player.l8.erosion.run[5] && player.l6.points.gte('30')) player.l8.erosion.run[5] = true;
			if(!player.l8.erosion.run[6] && player.l7.points.gte('ee4')) player.l8.erosion.run[6] = true;
			for(let i = 0;i < 7;i++)
			{
				if(player.l8.erosion.run[i])
				{
					let dmSpeed = n(1);
					if(player.l8.darkMatter.gt(0)) dmSpeed = player.l8.darkMatter.pow(hasUpgradeCharged("l1",15)?0.4:0.75);
					if(player.l8.voidMatter.gt(0)) dmSpeed = dmSpeed.add(player.l8.voidMatter.mul(hasUpgrade("l8",183)?1:2.5));
					player.l8.erosion.time[i] = player.l8.erosion.time[i].add(n(diff).mul(dmSpeed));
					// 虚空成形阶段：侵蚀常驻生效，但不再进行周期性重置
					if(player.l8.voidShaped) continue;
					player.l8.erosion.lastCycle[i] = player.l8.erosion.lastCycle[i].add(diff);
					if(player.l8.erosion.lastCycle[i].gte(layers.l8.erosionInterval(i)))
					{
						player.l8.erosion.lastCycle[i] = n(0);
						if(i != 4)
						{
							player['l' + (i + 1)].points = n(1);
							player['l' + (i + 1)].total = n(1);
						}
						else if(i == 4)
						{
							player.l5.essence = n(0);
						}
					}
				}
			}
		}
		if(!player.l8.brick.unlocked && (player.l8.points.gte(2e4) && hasMilestone('l8', 23))) player.l8.brick.unlocked = true;
		let mb = [];
		if(hasUpgrade('l8', 75)) mb.push(51, 52, 53);
		if(hasUpgrade('l8', 72)) mb.push(61);
		if(hasMilestone('l8', 32))
		{
			for(let i = 100;i <= 116;i++)
			{
				mb.push(i * 10 + 1, i * 10 + 2, i * 10 + 3, i * 10 + 4, i * 10 + 5);
			}
		}
		if(hasUpgrade('l8', 134)) mb.push(11, 12, 13, 14, 15, 16, 17);
		if(hasUpgrade('l8', 154)) mb.push(31, 32);
		for(let i in mb)
		{
			let id = mb[i];
			setBuyableAmount('l8', id, getBuyableAmount('l8', id).max(layers.l8.buyables[id].maxCanBuy()));
		}
		if(hasUpgrade('l8', 113))
		{
			for(let i = 21;i <= 26;i++)
			{
				let id = i - 21;
				let origin = getBuyableAmount('l8', i);
				setBuyableAmount('l8', i, getBuyableAmount('l8', i).max(layers.l8.buyables[i].maxCanBuy()));
				let now = getBuyableAmount('l8', i);
				player.l8.intDim[id] = player.l8.intDim[id].add(now.sub(origin));
			}
		}
		if(hasUpgrade('l8', 122))
		{
			for(let i = 71;i <= 76;i++)
			{
				let id = i - 71;
				let origin = getBuyableAmount('l8', i);
				setBuyableAmount('l8', i, getBuyableAmount('l8', i).max(layers.l8.buyables[i].maxCanBuy()));
				let now = getBuyableAmount('l8', i);
				player.l8.brick.dim[id] = player.l8.brick.dim[id].add(now.sub(origin));
			}
		}
		if(hasUpgrade('l8', 95) && player.l8.activeChallenge >= 11 && player.l8.activeChallenge <= 33)
		{
			let a = player.l8.activeChallenge, d = 0;
			d = (a - (a % 10)) / 10 * 3 + (a % 10) - 4;
			player.l4.level = player.l4.level.max(player.l8.chalcomp[d].mul(0.8));
		}
		if(tmp.l8.brickDimUnlocked)
		{
			if(layers.l8.brickDimMult(0).gt(0)) player.l8.brick.energy = player.l8.brick.energy.add(layers.l8.brickDimMult(0).mul(diff));
			for(let i = 1;i <= 5;i++)
			{
				if(layers.l8.brickDimMult(i).gt(0)) player.l8.brick.dim[i - 1] = player.l8.brick.dim[i - 1].add(layers.l8.brickDimMult(i).mul(diff));
			}
		}
		if(hasMilestone('l8', 31))
		{
			player.l8.unityPoints = player.l8.unityPoints.add(layers.l8.uPGain().mul(0.001 * (hasMilestone('l8', 32) ? 1000 : 1)).mul(diff));
		}
		for(let i = 0;i < 7;i++)
		{
			player.l8.baC.chal7doomed[i] -= diff;
			player.l8.baC.chal7doomed[i] = Math.max(0, player.l8.baC.chal7doomed[i]);
		}
		if(inChallenge('l8', 33)) player.l8.baC.reviveCD = player.l8.baC.reviveCD.sub(diff).max(0);
		else player.l8.baC.reviveCD = n(0);
		if(inChallenge('l8', 31))
		{
			player.l8.baC.chal7doomedCD += diff;
			if(player.l8.baC.chal7doomedCD >= 5)
			{
				let c = Math.floor(player.l8.baC.chal7doomedCD / 5);
				let s = chooseFromArray([1,2,3,4,5,6,7], Math.min(c, 7));
				for(let i in s)
				{
					player.l8.baC.chal7doomed[s[i] - 1] = 30;
					layerDataReset('l' + s[i]);
				}
				player.l8.baC.chal7doomedCD -= c * 5;
			}
		}
		if(hasUpgrade('l8', 171) && layers.l8.clickables.bhBoom.canClick()) layers.l8.clickables.bhBoom.onClick();
		if(hasUpgrade('l8', 151) && layers.l8.clickables.bhUp.canClick()) layers.l8.clickables.bhUp.onClick();
		for(let lr = 1;lr <= 7;lr++)
		{
			let L = 'l' + lr;
			if(!layers[L] || !layers[L].upgrades) continue;
			for(let id in layers[L].upgrades)
			{
				let upg = layers[L].upgrades[id];
				if(!isPlainObject(upg) || upg.charged === undefined) continue;
				if(hasUpgradeCharged(L, id)) run(upg.charged.effect, upg);
			}
		}
	},
    milestones: [
		{
            requirementDescription: '统一盒子达到25级',
            done() { return tmp.l8.uBTL.gte(25) },
            effectDescription() { return '保持转生里程碑，保持攻击力里程碑4、6、7、8、9' },
        },
		{
            requirementDescription: '统一盒子达到45级',
            done() { return tmp.l8.uBTL.gte(45) },
            effectDescription() { return '保持攻击力里程碑10、11、12、13、15、16、20' },
        },
		{
            requirementDescription: '统一盒子达到65级',
            done() { return tmp.l8.uBTL.gte(65) },
            effectDescription() { return '保持中子素里程碑1、3、7、8、9、12' },
        },
		{
            requirementDescription: '统一盒子达到85级',
            done() { return tmp.l8.uBTL.gte(85) },
            effectDescription() { return '自动购买致密、攻击力升级' },
        },
		{
            requirementDescription: '统一盒子达到90级',
            done() { return tmp.l8.uBTL.gte(90) },
            effectDescription() { return '初始解锁最大化飞升点数和遗物' },
        },
		{
			requirementDescription: '统一盒子达到95级',
			done() { return tmp.l8.uBTL.gte(95) },
			effectDescription() { return '自动购买飞升、遗迹升级' },
		},
		{
			requirementDescription: '统一盒子达到100级',
			done() { return tmp.l8.uBTL.gte(100) },
			effectDescription() { return '解锁???，保持攻击力里程碑' },
		},
		{
			requirementDescription: '达到 e1.050e7 点数',
			done() { return player.points.gte('e1.05e7'); },
			effectDescription() { return '你可以同时激活5个天使效果和3个大天使效果' },
			style() { return skyMilestoneStyle(7) },
		},
		{
			requirementDescription: '达到 e1.300e7 点数',
			done() { return player.points.gte('e1.3e7'); },
			effectDescription() { return '你可以同时激活12个天使效果，且中子素尘埃不会被烧毁' },
			style() { return skyMilestoneStyle(8) },
		},
		{
			requirementDescription: '统一盒子达到110级',
			done() { return tmp.l8.uBTL.gte(110) },
			effectDescription() { return '在第八层挑战外时，飞升点数保持在3666个' },
		},
		{
			requirementDescription: '统一盒子达到135级',
			done() { return tmp.l8.uBTL.gte(135) },
			effectDescription() { return '自动获得遗迹，保持致密里程碑' },
		},
		{
			requirementDescription: '统一盒子达到160级',
			done() { return tmp.l8.uBTL.gte(160) },
			effectDescription() { return '飞升挑战5、6中禁用全局速度' },
		},
		{
			requirementDescription: '达到 e1.400e7 点数',
			done() { return player.points.gte('e1.4e7'); },
			effectDescription() { return '你可以同时激活6个大天使效果和3个天神效果' },
			style() { return skyMilestoneStyle(12) },
		},
		{
			requirementDescription: '达到 e1.550e7 点数',
			done() { return player.points.gte('e1.55e7'); },
			effectDescription() { return '每秒自动获取重置时获取的10%中子素尘埃，且点数增幅中子素尘埃<br>当前：x' + format(this.effect()) },
			effect() { return player.points.add(1).log10().div(1e6).pow(4).add(1); },
			style() { return skyMilestoneStyle(13) },
		},
		{
			requirementDescription: '达到 e1.650e7 点数',
			done() { return player.points.gte('e1.65e7'); },
			effectDescription() { return '你可以同时激活12个大天使效果，且中子素粒不会被烧毁' },
			style() { return skyMilestoneStyle(14) },
		},
		{
			requirementDescription: '达到 e1.850e7 点数',
			done() { return player.points.gte('e1.85e7'); },
			effectDescription() { return '解锁点数购买项<br/>每秒自动获取合成时获取的1%中子素粒，且中子素尘埃增幅中子素粒<br>当前：x' + format(this.effect()) },
			effect() { return player.l7.points.add(1).log10().div(10).pow(2).add(1); },
			style() { return skyMilestoneStyle(15) },
		},
		{
			requirementDescription: '达到 e1.250e8 点数',
			done() { return player.points.gte('e1.25e8'); },
			effectDescription() { return '本质重置不重置第七层内容，你可以同时激活6个天神效果' },
			style() { return skyMilestoneStyle(16) },
		},
		{
			requirementDescription: '达到 e1.650e8 点数',
			done() { return player.points.gte('e1.65e8'); },
			effectDescription() { return '解锁长按本质重置的qol按钮<br>基于本质基础值提升本质基础值额外乘数。当前：^' + format(this.effect()) },
			effect() { return tmp.l8.basicAmount.add(1).log10().add(1).log10().mul(100).add(2500).root(2).div(100).add(1) },
			style() { return skyMilestoneStyle(17) },
		},
		{
			requirementDescription: '统一盒子达到180级',
			done() { return tmp.l8.uBTL.gte(180) },
			effectDescription() { return '在飞升挑战外自动获得飞升挑战1~4次数' },
		},
		{
			requirementDescription: '达到 e3.000e8 点数',
			done() { return player.points.gte('e3e8'); },
			effectDescription() { return '中子素锭不会被烧毁，每秒自动获取合成时获取的0.1%中子素锭' },
			style() { return skyMilestoneStyle(19) },
		},
		{
			requirementDescription: '达到 e5.000e8 点数',
			done() { return player.points.gte('e5e8'); },
			effectDescription() { return '中子素粒增幅中子素锭<br>当前：x' + format(this.effect()) },
			effect() { return player.l7.points2.add(1).log10().div(50).pow(2).add(1); },
			style() { return skyMilestoneStyle(20) },
		},
		{
			requirementDescription: '达到 e6.000e8 点数',
			done() { return player.points.gte('e6e8'); },
			effectDescription() { return `中子素锭数量提升三重软上限后的点数获取；解锁中子素块，根据中子素块决定本效果上限<br>当前：^${format(this.effect(), 3)}/${format(this.cap(), 3)}` },
			effect() { return player.l7.points3.div(1e16).max(1).log10().div(10).add(1).min(this.cap()); },
			cap() { return buyableEffect('l8', 61); },
			style() { return skyMilestoneStyle(21) },
		},
		{
			requirementDescription: '达到 e7.654e8 点数',
			done() { return player.points.gte('e7.654e8'); },
			effectDescription() { return `基于中子素块提升被动获取中子素锭的速度。当前：x${format(this.effect())}` },
			effect() { return getBuyableAmount('l8', 61).sub(10).max(0).add(1).mul(getBuyableAmount('l8', 61).sub(12).max(0).pow(1.25).pow_base(1.25)); },
			style() { return skyMilestoneStyle(22) },
		},
		{
			requirementDescription: '达到 e1.000e9 点数',
			done() { return player.points.gte('e1e9'); },
			effectDescription() { return '发现侵蚀，并解锁砖层，同时本质获取量x5' },
			style() { return skyMilestoneStyle(23) },
		},
		{
			requirementDescription: '统一盒子达到220级',
			done() { return tmp.l8.uBTL.gte(220) },
			effectDescription() { return '在飞升挑战外自动获得飞升挑战5~6次数' },
		},
		{
			requirementDescription: '达到 e1.250e9 点数',
			done() { return player.points.gte('e1.25e9'); },
			effectDescription() { return '仅在点数超过e1.250e9时每秒获得' + (hasUpgrade('l8', 115) ? '250%' : '25%') + '重置时可获得的本质，同时本质获取量x5' },
			style() { return skyMilestoneStyle(25) },
		},
		{
			requirementDescription: '达到 e2.000e9 点数',
			done() { return player.points.gte('e2e9'); },
			effectDescription() { return '中子素块不再重置中子素锭和中子素供奉，“本质基础增幅器”效果更强' },
			style() { return skyMilestoneStyle(26) },
		},
		{
			requirementDescription: '达到 e2.500e9 点数',
			done() { return player.points.gte('e2.5e9'); },
			effectDescription() { return '“本征基础增幅器”效果更强，本质增幅点数获取。当前：x' + format(this.effect()) },
			effect() {
				let base = player.l8.points.pow(player.l8.points.mul(player.l8.points.mul(100).min(1e9)).root(1.5));
				if(base.gte('ee111')) base = base.log10().log10().sub(111).add(1).ln().add(111).pow_base(10).pow_base(10);
				return base;
			},
			style() { return skyMilestoneStyle(27) },
		},
		{
			requirementDescription: '达到 e1.000e10 点数',
			done() { return player.points.gte('e1e10'); },
			effectDescription() { return '自动获取飞升点数，且飞升点数x1.2'; },
			style() { return skyMilestoneStyle(28) },
		},
		{
			requirementDescription: '统一盒子达到340级',
			done() { return tmp.l8.uBTL.gte(340) },
			effectDescription() { return '自动供奉中子素，且不消耗中子素'; },
		},
		{
			requirementDescription: '达到 e2.150e10 点数',
			done() { return player.points.gte('e2.15e10'); },
			effectDescription() { return '中子素块增幅本质获取。当前：x' + format(this.effect()); },
			effect() { return getBuyableAmount('l8', 61).pow_base(1.015); },
			style() { return skyMilestoneStyle(30) },
		},
		{
			requirementDescription: '统一盒子达到425级',
			done() { return tmp.l8.uBTL.gte(425) },
			effectDescription() { return '每秒获得0.1%重置时可获得的统一点数'; },
		},
		{
			requirementDescription: '统一盒子达到680级',
			done() { return tmp.l8.uBTL.gte(680) },
			effectDescription() { return '自动购买统一盒子，且上一个里程碑增强1000倍'; },
		},
	],
    upgrades: {
		11: {
            title: '本源利用 I',
            description: '解锁调律流形。',
            cost: n(1),
            unlocked() { return true; },
			...eU,
        },
		12: {
            title: '本源利用 II',
            description: '解锁频率跃迁。',
            cost: n(1),
            unlocked() { return true; },
			...eU,
        },
		13: {
            title: '本源利用 III',
            description: '解锁统一盒子。',
            cost: n(1),
            unlocked() { return true; },
			...eU,
        },
		14: {
            title: '本源利用 IV',
            description: '解锁原始黑洞。',
            cost: n(1),
            unlocked() { return true; },
			...eU,
        },
		15: {
            title: '本源利用 V',
            description: '解锁生物炼金。',
            cost: n(1),
            unlocked() { return true; },
			...eU,
        },
		21: {
			title: '黑洞增生 I',
			description: '黑洞增长速度+1000/s。',
			cost: n(160000),
			unlocked() { return true; },
			effect() {
				let base = n(1000);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		22: {
			title: '黑洞增生 II',
			description: '黑洞增长速度+5000/s。',
			cost: n(640000),
			unlocked() { return true; },
			effect() {
				let base = n(4000);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		23: {
			title: '黑洞增生 III',
			description: '黑洞增长速度+20000/s。',
			cost: n(2.56e6),
			unlocked() { return true; },
			effect() {
				let base = n(20000);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		24: {
			title: '黑洞增生 IV',
			description: '黑洞增长速度+60000/s。',
			cost: n(1.024e7),
			unlocked() { return true; },
			effect() {
				let base = n(60000);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		25: {
			title: '黑洞增生 V',
			description: '黑洞增长速度+120000/s。',
			cost: n(4.096e7),
			unlocked() { return true; },
			effect() {
				let base = n(120000);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		31: {
			title: '虚空裂隙 I',
			description: '全局速度x1.5。',
			cost: n(1e6),
			unlocked() { return true; },
			effect() {
				let base = n(1.5);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		32: {
			title: '虚空裂隙 II',
			description: '全局速度x1.4。',
			cost: n(3e6),
			unlocked() { return true; },
			effect() {
				let base = n(1.4);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		33: {
			title: '虚空裂隙 III',
			description: '全局速度x1.3。',
			cost: n(9e6),
			unlocked() { return true; },
			effect() {
				let base = n(1.3);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		34: {
			title: '虚空裂隙 IV',
			description: '全局速度x1.2。',
			cost: n(2.7e7),
			unlocked() { return true; },
			effect() {
				let base = n(1.2);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		35: {
			title: '虚空裂隙 V',
			description: '全局速度x1.1。',
			cost: n(8.1e7),
			unlocked() { return true; },
			effect() {
				let base = n(1.1);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		41: {
			title: '致密星系 I',
			description: '黑洞暴涨冷却x0.5。',
			cost: n(1e8),
			unlocked() { return true; },
			effect() {
				let base = n(0.5);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		42: {
			title: '致密星系 II',
			description: '黑洞暴涨冷却x0.6。',
			cost: n(2e8),
			unlocked() { return true; },
			effect() {
				let base = n(0.6);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		43: {
			title: '致密星系 III',
			description: '黑洞暴涨冷却x0.7。',
			cost: n(4e8),
			unlocked() { return true; },
			effect() {
				let base = n(0.7);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		44: {
			title: '致密星系 IV',
			description: '黑洞暴涨冷却x0.8。',
			cost: n(8e8),
			unlocked() { return true; },
			effect() {
				let base = n(0.8);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		45: {
			title: '致密星系 V',
			description: '黑洞暴涨冷却x0.9。',
			cost: n(1.6e9),
			unlocked() { return true; },
			effect() {
				let base = n(0.9);
				return base;
			},
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px white' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'silver' : '',
				};
			},
            currencyDisplayName: '黑洞质量',
            currencyInternalName: 'bhMass',
            currencyLayer: 'l8',
		},
		51: {
			title: '调律扩展 I',
			description: '解锁调律3。',
			cost: n(1),
			unlocked() { return true; },
		},
		52: {
			title: '调律扩展 II',
			description: '解锁调律4。',
			cost: n(2),
			unlocked() { return true; },
		},
		53: {
			title: '调律扩展 III',
			description: '解锁调律5。',
			cost: n(500),
			unlocked() { return true; },
		},
		54: {
			title: '调律扩展 IV',
			description: '解锁调律6。',
			cost: n(1e4),
			unlocked() { return true; },
		},
		55: {
			title: '调律扩展 V',
			description: '解锁调律7。',
			cost: n(1e11),
			unlocked() { return true; },
		},
		56: {
			title: '调律扩展 VI',
			description: '解锁调律8。',
			cost: n(1e48),
			unlocked() { return true; },
		},
		61: {
			title: '调律解限 I',
			description: '调律最低降低到8级，最高提升到12级。',
			cost: n(5),
			unlocked() { return true; },
		},
		62: {
			title: '调律解限 II',
			description: '调律最低降低到7级，最高提升到13级。',
			cost: n(1e4),
			unlocked() { return true; },
		},
		63: {
			title: '调律解限 III',
			description: '调律最低降低到6级，最高提升到15级。',
			cost: n(1e9),
			unlocked() { return true; },
		},
		64: {
			title: '调律解限 IV',
			description: '调律最低降低到5级，最高提升到20级。',
			cost: n(1e11),
			unlocked() { return true; },
		},
		65: {
			title: '调律解限 V',
			description: '调律最低降低到3级，最高提升到25级。',
			cost: n(1e45),
			unlocked() { return true; },
		},
		66: {
			title: '调律解限 VI',
			description: '调律最低降低到0级，最高提升到30级。',
			cost: n(1e59),
			unlocked() { return true; },
		},
		71: {
			...brickUpgrade,
			cost: n(4),
			branches: [72, 81],
			title: '无需试炼',
			description: '1e6试炼点数前，每秒获得100个试炼点数',
			color: 'white',
			background: 'green',
		},
		72: {
			...brickUpgrade,
			cost: n(3),
			branches: [73, 84],
			title: '中子凝聚',
			description: '自动购买中子素块',
			color: 'white',
			background: '#5a5a5a',
		},
		73: {
			...brickUpgrade,
			cost: n(2),
			branches: [83],
			title: '中子存量',
			description: '中子素锭的软上限延迟x5',
			color: 'white',
			background: '#5a5a5a',
		},
		74: {
			...brickUpgrade,
			cost: n(3),
			branches: [73, 84],
			title: '中子之心',
			description: '购买点数购买项不进行中子素重置',
			color: 'white',
			background: '#5a5a5a',
		},
		75: {
			...brickUpgrade,
			cost: n(3),
			branches: [74],
			title: '点数凝聚',
			description: '自动购买点数购买项',
			color: 'white',
			background: 'red',
		},
		81: {
			...brickUpgrade,
			cost: n(4),
			branches: [82, 92],
			title: '自主攻击',
			description: '在炼金挑战外自动攻击',
			color: 'white',
			background: 'orange',
		},
		82: {
			...brickUpgrade,
			cost: n(1),
			branches: [83],
			title: '攻击记忆',
			description: '在达到炼金挑战最高等级前自动攻击',
			color: 'white',
			background: 'orange',
		},
		83: {
			...brickUpgrade,
			cost: n(1),
			branches: [93],
			title: '中子扩张',
			description: '中子素锭被动获取x3',
			color: 'white',
			background: '#5a5a5a',
		},
		84: {
			...brickUpgrade,
			cost: n(1),
			branches: [83],
			title: '中子优化',
			description: '取消中子素块的中子素锭需求',
			color: 'white',
			background: '#5a5a5a',
		},
		85: {
			...brickUpgrade,
			cost: n(4),
			branches: [94],
			title: '超越飞升',
			description: '取消飞升点数的硬上限',
			color: 'black',
			background: 'yellow',
		},
		91: {
			...brickUpgrade,
			cost: n(1),
			branches: [92],
			title: '自明本质',
			description: '每秒自动获取2.5%重置时可获得的本质',
			color: 'white',
			background: 'red',
		},
		92: {
			...brickUpgrade,
			cost: n(1),
			branches: [93],
			title: '限制打破',
			description: '点数第二软上限减弱5%',
			color: 'white',
			background: 'red',
		},
		93: {
			...brickUpgrade,
			cost: n(1),
			branches: [],
			title: '高墙初垒',
			description: '点数在四重软上限后产能^1.05',
			color: 'white',
			background: 'red',
		},
		94: {
			...brickUpgrade,
			cost: n(1),
			branches: [93],
			title: '试剂改造',
			description: '生物炼金挑战的基础loader等级效果改进',
			color: 'black',
			background: 'lightgreen',
		},
		95: {
			...brickUpgrade,
			cost: n(3),
			branches: [94],
			title: '前人之助',
			description: '生物炼金初始拥有80%于此挑战纪录loader等级',
			color: 'black',
			background: 'lightgreen',
		},
		101: {
			...brickUpgrade,
			cost: n(2),
			branches: [91],
			title: '本征强化',
			description: '本征维度效率x100',
			color: 'white',
			background: '#f60',
		},
		102: {
			...brickUpgrade,
			cost: n(1),
			branches: [93],
			title: '超级黑洞',
			description: '黑洞质量获取x10',
			color: 'black',
			background: 'white',
		},
		103: {
			...brickUpgrade,
			cost: n(1),
			branches: [93],
			title: '维度免费',
			description: '购买本征维度不再消耗本质',
			color: 'white',
			background: '#f60',
		},
		104: {
			...brickUpgrade,
			cost: n(1),
			branches: [93],
			title: '水泥降价',
			description: '砖重置所需的点数降低至e1.150e9',
			color: 'white',
			background: 'brown',
		},
		105: {
			...brickUpgrade,
			cost: n(4),
			branches: [94],
			title: '炼金解放',
			description: '生物炼金挑战中禁用攻击力侵蚀',
			color: 'white',
			background: 'lightgreen',
			backgroundImage: 'linear-gradient(to bottom, lightgreen, purple)',
		},
		111: {
			...brickUpgrade,
			cost: n(4),
			branches: [101, 102, 112],
			title: '疯狂速度',
			description: '前七层全局速度x5',
			color: 'black',
			background: 'white',
		},
		112: {
			...brickUpgrade,
			cost: n(2),
			branches: [113],
			title: '本质保留',
			description: '砖重置后保留本质基础值的6个购买项',
			color: 'white',
			background: 'red',
		},
		113: {
			...brickUpgrade,
			cost: n(3),
			branches: [103],
			title: '本征自动',
			description: '自动化本征维度',
			color: 'white',
			background: '#f60',
		},
		114: {
			...brickUpgrade,
			cost: n(4),
			branches: [113],
			title: '频率保留',
			description: '砖重置后保留本征频率内容',
			color: 'white',
			background: '#f60',
		},
		115: {
			...brickUpgrade,
			cost: n(7),
			branches: [104, 114],
			title: '极速本质',
			description: '点数里程碑的自动本质速度提升到250%/秒',
			color: 'white',
			background: 'red',
		},
		121: {
			...brickUpgrade,
			cost: n(5e17),
			branches: [131],
			title: '砖块致密',
			description: '砖的第一效果^1.2',
			color: 'white',
			background: 'brown',
		},
		122: {
			...brickUpgrade,
			cost: n(5e12),
			branches: [132],
			title: '能量回充',
			description: '自动购买最大砖维度',
			color: 'white',
			background: 'brown',
		},
		123: {
			...brickUpgrade,
			cost: n(2e10),
			branches: [133],
			title: '炼金直觉',
			description: '生物炼金学习效率x60',
			color: 'black',
			background: 'lightgreen',
		},
		124: {
			...brickUpgrade,
			cost: n(2e13),
			branches: [134],
			title: '本质涌流',
			description: '每秒额外获得1%进行真空湍流时可获得的本质',
			color: 'white',
			background: 'red',
		},
		125: {
			...brickUpgrade,
			cost: n(1e20),
			branches: [135],
			title: '本质过载',
			description: '本质基础值第二和第三因子^3',
			color: 'white',
			background: 'red',
		},
		131: {
			...brickUpgrade,
			cost: n(1e11),
			branches: [132],
			title: '高效制砖',
			description: '砖获取x5',
			color: 'white',
			background: 'brown',
		},
		132: {
			...brickUpgrade,
			cost: n(1e9),
			branches: [142],
			title: '维度异化',
			description: '砖维度x10',
			color: 'white',
			background: 'brown',
		},
		133: {
			...brickUpgrade,
			cost: n(5e9),
			branches: [132, 134],
			title: '血肉飞升',
			description: '解锁生物炼金挑战的第二效果',
			color: 'black',
			background: 'lightgreen',
		},
		134: {
			...brickUpgrade,
			cost: n(6e7),
			branches: [144],
			title: '自动本质',
			description: '自动购买本质基础值的7个购买项',
			color: 'white',
			background: 'red',
		},
		135: {
			...brickUpgrade,
			cost: n(5e12),
			branches: [134],
			title: '基础共振',
			description: '三个基础增幅器的效果^1.25',
			color: 'white',
			background: 'red',
		},
		141: {
			...brickUpgrade,
			cost: n(2e10),
			branches: [142],
			title: '本质回馈',
			description(){return '基于累计本质提升本质获取<br>当前：' + this.effectDescription()},
			effect() {
				let base = player.l8.total.add(1).log10().add(1);
				return base;
			},
			effectDescription() {return 'x' + format(this.effect());},
			color: 'white',
			background: 'red',
		},
		142: {
			...brickUpgrade,
			cost: n(3e7),
			branches: [143],
			title: '本质充能',
			description(){return '本质增幅本质<br>当前：' + this.effectDescription()},
			effect() {
				let base = player.l8.points.add(1).log10().add(1);
				return base;
			},
			effectDescription() {return 'x' + format(this.effect());},
			color: 'white',
			background: 'red',
		},
		143: {
			...brickUpgrade,
			cost: n(1e7),
			branches: [],
			title: '本质超越',
			description: '本质基础值第二和第三因子^7',
			color: 'white',
			background: 'red',
		},
		144: {
			...brickUpgrade,
			cost: n(5e7),
			branches: [143],
			title: '中子维持',
			description: '砖重置不再重置中子素层',
			color: 'white',
			background: '#3a3a3a',
		},
		145: {
			...brickUpgrade,
			cost: n(1e17),
			branches: [144],
			title: '心之极诣',
			description: '“数据之心”、“转生之心”、“致密之心”效果不再具有软上限',
			color: 'white',
			background: '#3a3a3a',
		},
		151: {
			...brickUpgrade,
			cost: n(1e11),
			branches: [152],
			title: '黑洞自转',
			description: '自动升级黑洞',
			color: 'black',
			background: 'white',
		},
		152: {
			...brickUpgrade,
			cost: n(1e9),
			branches: [142],
			title: '宇宙吞噬',
			description: '改善原始黑洞的效果',
			color: 'black',
			background: 'white',
		},
		153: {
			...brickUpgrade,
			cost: n(5e9),
			branches: [152, 154],
			title: '深入开发',
			description: '解锁一行本质升级',
			color: 'white',
			background: 'red',
		},
		154: {
			...brickUpgrade,
			cost: n(4.5e8),
			branches: [144],
			title: '频率自动',
			description: '自动购买本质频率和本质频率强化',
			color: 'white',
			background: '#f60',
		},
		155: {
			...brickUpgrade,
			cost: n(5e11),
			branches: [154],
			title: '频率共振',
			description: '本质频率值^1.2',
			color: 'white',
			background: '#f60',
		},
		161: {
			...brickUpgrade,
			cost: n(1e19),
			branches: [151],
			title: '暴涨冷却',
			description: '黑洞暴涨冷却x0.5',
			color: 'black',
			background: 'white',
		},
		162: {
			...brickUpgrade,
			cost: n(1e13),
			branches: [152],
			title: '暴涨过载',
			description: '黑洞暴涨效果x2',
			color: 'black',
			background: 'white',
		},
		163: {
			...brickUpgrade,
			cost: n(1e16),
			branches: [153],
			title: '侵蚀受益',
			description(){return '当前的数据侵蚀时间增幅本质<br>当前：x' + format(player.l8.erosion.time[0].pow(0.75).add(1));},
			color: 'white',
			background: 'red',
		},
		164: {
			...brickUpgrade,
			cost: n(1e13),
			branches: [154],
			title: '频率免费',
			description: '购买本质频率和本质频率强化不再消耗本质',
			color: 'white',
			background: '#f60',
		},
		165: {
			...brickUpgrade,
			cost: n(1e17),
			branches: [155],
			title: '本征持久',
			description: '本征维度购买增益从x2变为x3',
			color: 'white',
			background: '#f60',
		},
		171: {
            title: '本源利用 VI',
            description: '自动执行黑洞暴涨。',
            cost: n(1e90),
            unlocked() { return hasUpgrade('l8', 153); },
			...eU,
        },
		172: {
            title: '本源利用 VII',
            description: '砖能量第二效果^10',
            cost: n(1e92),
            unlocked() { return hasUpgrade('l8', 153); },
			...eU,
        },
		173: {
            title: '本源利用 VIII',
            description(){return '基于本质提升黑洞质量获取<br>当前：x' + format(upgradeEffect('l8', this.id))},
            cost: n(1e100),
			effect() {
				let base = player.l8.points.add(Math.E).ln().pow(0.5);
				return base;
			},
            unlocked() { return hasUpgrade('l8', 153); },
			...eU,
        },
		174: {
            title: '本源利用 IX',
            description: '炼金挑战从最高纪录等级开始。',
            cost: n(1e115),
            unlocked() { return hasUpgrade('l8', 153); },
			...eU,
        },
		175: {
            title: '本源利用 X',
            description: '解锁第一层的升级充能。',
            cost: n(1e205),
            unlocked() { return hasUpgrade('l8', 153); },
			...eU,
        },
		181: {
			title: '虚空速度',
			description: '黑洞等级提升速度x10（每帧自动尝试购买10次黑洞升级）。',
			cost: n(10),
			unlocked() { return player.l8.voidMatter.gt(0); },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px dimgray' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'dimgray' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : '',
				};
			},
            currencyDisplayName: '虚空物质',
            currencyInternalName: 'voidMatter',
            currencyLayer: 'l8',
		},
		182: {
			title: '虚空扩张',
			description(){return '虚空物质再次提升暗物质获取。<br>当前：x' + format(upgradeEffect('l8', this.id))},
			cost: n(30),
			effect() {
				let base = player.l8.voidMatter.add(1).ln().add(1);
				return base;
			},
			unlocked() { return player.l8.voidMatter.gt(0); },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px dimgray' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'dimgray' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : '',
				};
			},
            currencyDisplayName: '虚空物质',
            currencyInternalName: 'voidMatter',
            currencyLayer: 'l8',
		},
		183: {
			title: '虚空构筑',
			description(){return '弱化虚空物质对侵蚀的加速作用,虚空物质提升砖获取<br>当前：x' + format(upgradeEffect('l8', this.id))},
			cost: n(70),
			effect() {
				let base = player.l8.voidMatter.pow(0.5).div(10).add(1);
				return base;
			},
			unlocked() { return player.l8.voidMatter.gt(0); },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px dimgray' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'dimgray' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : '',
				};
			},
            currencyDisplayName: '虚空物质',
            currencyInternalName: 'voidMatter',
            currencyLayer: 'l8',
		},
		184: {
			title: '虚空异变',
			description(){return '虚空物质提升虚空物质获取。<br>当前：x' + format(upgradeEffect('l8', this.id))},
			cost: n(100),
			effect() {
				let base = player.l8.voidMatter.add(1).log10().add(1).mul(2);
				return base;
			},
			unlocked() { return player.l8.voidMatter.gt(0); },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px dimgray' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'dimgray' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : '',
				};
			},
            currencyDisplayName: '虚空物质',
            currencyInternalName: 'voidMatter',
            currencyLayer: 'l8',
		},
		185: {
			title: '虚空塑造',
			description: '解锁虚空成形。',
			cost: n(1000),
			unlocked() { return player.l8.voidMatter.gt(0); },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid white' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px dimgray' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'dimgray' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : '',
				};
			},
            currencyDisplayName: '虚空物质',
            currencyInternalName: 'voidMatter',
            currencyLayer: 'l8',
		},
    },
	buyables: {
		11: {
			title: '本质基础增幅器',
			cost(x) {
				let base = n(1), mul = n(2);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(1)) return n(0);
				let base = x.div(1).log(2).add(1).floor();
				return base;
			},
			display() {
				return '增幅本质基础值。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				player.l8.points = player.l8.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1);
				if(hasMilestone('l8', 26)) base = x.pow_base(5);
				if(hasUpgrade('l8', 135)) base = base.pow(1.25);
				if(base.gte(1e65)) base = base.root(5).mul(1e52);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		12: {
			title: '点数基础增幅器',
			cost(x) {
				let base = n(1e9), mul = n(2);
				let ans = base.mul(mul.pow(x)).pow_base(10);
				return ans;
			},
			maxCanBuy(x = player.points) {
				if(x.lt('ee9')) return n(0);
				let base = x.log10().div(1e9).log(2).add(1).floor();
				return base;
			},
			display() {
				return '增幅本质基础值。<br>价格: ' + format(this.cost()) + ' 点数<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(1e5);
				if(hasUpgrade('l8', 135)) base = base.pow(1.25);
				if(base.gte(1e30)) base = base.log10().div(30).log10().add(3).mul(10).pow_base(10);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		13: {
			title: '本征基础增幅器',
			cost(x) {
				let base = n(1e10), mul = n(1e5);
				let ans = base.mul(mul.pow(x));
				if(ans.gte(1e130)) ans = ans.pow(5).div('1e520');
				return ans;
			},
			maxCanBuy(x = player.l8.intrinsic) {
				if(x.lt(1e10)) return n(0);
				if(x.gte(1e130)) x = x.mul('1e520').root(5);
				let base = x.div(1e10).log(1e5).add(1).floor();
				return base;
			},
			display() {
				return '增幅本质基础值。<br>价格: ' + format(this.cost()) + ' 本征能量<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l8.intrinsic.gte(this.cost());
			},
			buy() {
				player.l8.intrinsic = player.l8.intrinsic.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1);
				if(hasUpgrade('l8', 135)) base = base.pow(1.25);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		14: {
			title: '本质基础强化器',
			cost(x) {
				let base = n(100), mul = n(100);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(100)) return n(0);
				let base = x.div(100).log(100).add(1).floor();
				return base;
			},
			display() {
				return '增幅本质基础值乘数。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: ^' + format(this.effect());
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				player.l8.points = player.l8.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1).log10().add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		15: {
			title: '点数基础强化器',
			cost(x) {
				let base = n(2e9), mul = n(20);
				let ans = base.mul(mul.pow(x)).pow_base(10);
				return ans;
			},
			maxCanBuy(x = player.points) {
				if(x.lt('e2e9')) return n(0);
				let base = x.log10().div(2e9).log(20).add(1).floor();
				return base;
			},
			display() {
				return '增幅本质基础值乘数。<br>价格: ' + format(this.cost()) + ' 点数<br>效果: ^' + format(this.effect());
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1).log10().add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		16: {
			title: '本征基础强化器',
			cost(x) {
				let base = n(1e100), mul = n(1e50);
				let ans = base.mul(mul.pow(x));
				if(ans.gte(1e130)) ans = ans.pow(5).div('1e520');
				return ans;
			},
			maxCanBuy(x = player.l8.intrinsic) {
				if(x.lt(1e100)) return n(0);
				if(x.gte(1e130)) x = x.mul('1e520').root(5);
				let base = x.div(1e100).log(1e50).add(1).floor();
				return base;
			},
			display() {
				return '增幅本质基础值乘数。<br>价格: ' + format(this.cost()) + ' 本征能量<br>效果: ^' + format(this.effect());
			},
			canAfford() {
				return player.l8.intrinsic.gte(this.cost());
			},
			buy() {
				player.l8.intrinsic = player.l8.intrinsic.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1).log10().add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		17: {
			title: '本质强化器',
			cost(x) {
				let base = n(1e12), mul = n(4);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(1e12)) return n(0);
				let base = x.div(1e12).log(4).add(1).floor();
				return base;
			},
			display() {
				return '增幅本质乘数。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				player.l8.points = player.l8.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(1.5);
				if(base.gte(1e5)) base = base.div(1e5).pow(0.5).mul(1e5);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		21: {
			title: '第一维度增益x2',
			cost(x) {
				let base = n(1), mul = n(2);
				let ans = base.mul(mul.pow(x));
				return ans.sub(1);
			},
			maxCanBuy(x = player.l8.points) {
				if(x.add(1).lt(1)) return n(0);
				return x.add(1).div(1).log(2).add(1).floor();
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l8.points.gte(this.cost()) && player.l8.total.gt(0);
			},
			buy() {
				if(!hasUpgrade('l8', 103)) player.l8.points = player.l8.points.sub(this.cost());
				player.l8.intDim[0] = player.l8.intDim[0].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(hasUpgrade('l8', 165) ? 3 : 2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		22: {
			title: '第二维度增益x2',
			cost(x) {
				let base = n(1), mul = n(3);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(1)) return n(0);
				return x.div(1).log(3).add(1).floor();
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				if(!hasUpgrade('l8', 103)) player.l8.points = player.l8.points.sub(this.cost());
				player.l8.intDim[1] = player.l8.intDim[1].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(hasUpgrade('l8', 165) ? 3 : 2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		23: {
			title: '第三维度增益x2',
			cost(x) {
				let base = n(5), mul = n(5);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(5)) return n(0);
				return x.div(5).log(5).add(1).floor();
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				if(!hasUpgrade('l8', 103)) player.l8.points = player.l8.points.sub(this.cost());
				player.l8.intDim[2] = player.l8.intDim[2].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(hasUpgrade('l8', 165) ? 3 : 2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		24: {
			title: '第四维度增益x2',
			cost(x) {
				let base = n(100), mul = n(10);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(100)) return n(0);
				return x.div(100).log(10).add(1).floor();
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				if(!hasUpgrade('l8', 103)) player.l8.points = player.l8.points.sub(this.cost());
				player.l8.intDim[3] = player.l8.intDim[3].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(hasUpgrade('l8', 165) ? 3 : 2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		25: {
			title: '第五维度增益x2',
			cost(x) {
				let base = n(1e9), mul = n(1000);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(1e9)) return n(0);
				return x.div(1e9).log(1000).add(1).floor();
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				if(!hasUpgrade('l8', 103)) player.l8.points = player.l8.points.sub(this.cost());
				player.l8.intDim[4] = player.l8.intDim[4].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(hasUpgrade('l8', 165) ? 3 : 2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		26: {
			title: '第六维度增益x2',
			cost(x) {
				let base = n(1e20), mul = n(1e5);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(1e20)) return n(0);
				return x.div(1e20).log(1e5).add(1).floor();
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				if(!hasUpgrade('l8', 103)) player.l8.points = player.l8.points.sub(this.cost());
				player.l8.intDim[5] = player.l8.intDim[5].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(hasUpgrade('l8', 165) ? 3 : 2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		31: {
			title: '本质频率',
			cost(x) {
				let base = n(1), mul = n(10);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(1)) return n(0);
				let base = x.div(1).log(10).add(1).floor();
				return base;
			},
			base() {
				let base = n(2);
				base = base.add(buyableEffect('l8', 32));
				return base;
			},
			display() {
				return '增幅本征频率x' + format(this.base(), 1) + '。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				if(!hasUpgrade('l8', 164)) player.l8.points = player.l8.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(this.base());
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		32: {
			title: '本质频率强化',
			cost(x) {
				let base = n(1), mul = n(1e10);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			maxCanBuy(x = player.l8.points) {
				if(x.lt(1)) return n(0);
				let base = x.div(1).log(1e10).add(1).floor();
				return base;
			},
			display() {
				return '增幅本质频率底数+0.2。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: +' + format(this.effect());
			},
			canAfford() {
				return player.l8.points.gte(this.cost());
			},
			buy() {
				if(!hasUpgrade('l8', 164)) player.l8.points = player.l8.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(0);
				let base = x.mul(0.2);
				base = base.mul(buyableEffect('l8', 33));
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		33: {
			title: '频率跃迁',
			cost(x) {
				let base = n(1e10), mul = n(1e5);
				let ans = base.mul(mul.pow(x.pow(2)));
				return ans;
			},
			display() {
				return '增幅本质频率强化x1.1。<br>价格: ' + format(this.cost()) + ' 本征能量<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l8.intrinsic.gte(this.cost());
			},
			buy() {
				player.l8.intrinsic = player.l8.intrinsic.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(1.1);
				if(base.gte(3.14)) base = n(3.14).mul(base.div(3.14).ln().add(1));
				return base;
			},
			unlocked() {
				// 七重诅咒7：无法进行频率跃迁
				return hasUpgrade('l8', 12) && !player.l8.voidShaped;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		41: {
			title: '流形扩容 I',
			cost(x) {
				let base = n(1), mul = n(4);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '调律能级上限+1。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: +' + format(this.effect());
			},
			canAfford() {
				return player.l8.points.gte(this.cost()) && !getBuyableAmount(this.layer, this.id).gte(80);
			},
			buy() {
				player.l8.points = player.l8.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(0);
				let base = x;
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "/80</h2>"},
		},
		42: {
			title: '流形扩容 II',
			cost(x) {
				let base = n(1), mul = n(10);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '调律能级上限+1。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: +' + format(this.effect());
			},
			canAfford() {
				return player.l8.points.gte(this.cost()) && !getBuyableAmount(this.layer, this.id).gte(60);
			},
			buy() {
				player.l8.points = player.l8.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(0);
				let base = x;
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "/60</h2>"},
		},
		43: {
			title: '流形扩容 III',
			cost(x) {
				let base = n(5), mul = n(50);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '调律能级上限+1。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: +' + format(this.effect());
			},
			canAfford() {
				return player.l8.points.gte(this.cost()) && !getBuyableAmount(this.layer, this.id).gte(40);
			},
			buy() {
				player.l8.points = player.l8.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(0);
				let base = x;
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "/40</h2>"},
		},
		51: {
			title: '数据之心',
			cost(x) {
				let base = n(1.5e7), mul = n(1.1);
				let ans = n(10).pow(base.mul(mul.pow(x)));
				return ans;
			},
			maxCanBuy(x = player.points) {
				if(x.lt('e1.5e7')) return n(0);
				return x.log10().div(1.5e7).log(1.1).add(1).floor();
			},
			display() {
				return `数据^${format(this.effect(getBuyableAmount(this.layer, this.id)))}。` + (hasUpgrade('l8', 74) ? '' : '购买后执行中子素重置。') + `<br>价格: ${format(this.cost())} 点数`;
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			buy() {
				player.points = player.points.sub(this.cost());
				if(!hasUpgrade('l8', 74)) doReset('l7');
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = n(1).add(x.mul(0.05));
				if(base.gte(1.5) && !hasUpgrade('l8', 145)) base = base.div(1.5).pow(0.5).mul(1.5);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px", 'border-color': 'white', 'box-shadow': '0px 0px 20px 10px white', 'background-color': this.canAfford() ? 'white' : 'black', 'color': this.canAfford() ? 'black' : 'white'}},
            tooltip(){return "数量: <h2 style='color:white;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		52: {
			title: '转生之心',
			cost(x) {
				let base = n(1.9e7), mul = n(1.125);
				let ans = n(10).pow(base.mul(mul.pow(x)));
				return ans;
			},
			maxCanBuy(x = player.points) {
				if(x.lt('e1.9e7')) return n(0);
				return x.log10().div(1.9e7).log(1.125).add(1).floor();
			},
			display() {
				return `转生点数^${format(this.effect(getBuyableAmount(this.layer, this.id)))}。` + (hasUpgrade('l8', 74) ? '' : '购买后执行中子素重置。') + `<br>价格: ${format(this.cost())} 点数`;
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			buy() {
				player.points = player.points.sub(this.cost());
				if(!hasUpgrade('l8', 74)) doReset('l7');
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = n(1).add(x.mul(0.05));
				if(base.gte(1.5) && !hasUpgrade('l8', 145)) base = base.div(1.5).pow(0.5).mul(1.5);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px", 'border-color': 'white', 'box-shadow': '0px 0px 20px 10px white', 'background-color': this.canAfford() ? 'white' : 'black', 'color': this.canAfford() ? 'black' : 'white'}},
            tooltip(){return "数量: <h2 style='color:white;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		53: {
			title: '致密之心',
			cost(x) {
				let base = n(7e7), mul = n(1.5);
				let ans = n(10).pow(base.mul(mul.pow(x)));
				return ans;
			},
			maxCanBuy(x = player.points) {
				if(x.lt('e7e7')) return n(0);
				return x.log10().div(7e7).log(1.5).add(1).floor();
			},
			display() {
				return `致密点数^${format(this.effect(getBuyableAmount(this.layer, this.id)))}。` + (hasUpgrade('l8', 74) ? '' : '购买后执行中子素重置。') + `<br>价格: ${format(this.cost())} 点数`;
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			buy() {
				player.points = player.points.sub(this.cost());
				if(!hasUpgrade('l8', 74)) doReset('l7');
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = n(1).add(x.mul(0.05));
				if(base.gte(1.5) && !hasUpgrade('l8', 145)) base = base.div(1.5).pow(0.5).mul(1.5);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px", 'border-color': 'white', 'box-shadow': '0px 0px 20px 10px white', 'background-color': this.canAfford() ? 'white' : 'black', 'color': this.canAfford() ? 'black' : 'white'}},
            tooltip(){return "数量: <h2 style='color:white;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		61: {
			title() {
				return `中子素块(${format(getBuyableAmount('l8', 61), 0)})`;
			},
			cost(x) {
				let base = n(6e8), mul = n(1.025);
				let ans = n(10).pow(base.mul(mul.pow(x)));
				return ans;
			},
			maxCanBuy(x = player.points) {
				if(x.lt('e6e8')) return n(0);
				return x.log10().div(6e8).log(1.025).add(1).floor();
			},
			display() {
				return `提升e6e8点数里程碑的效果上限x<b style="color: red">${format(this.effect())}</b>` + (hasMilestone('l8', 26) ? '' : `<br>购买后将重置中子素锭和中子素锭供奉`) + `<br>价格: ${format(this.cost())} 点数${hasUpgrade('l8', 84) ? '' : ' + ' + format(n(1e18)) + ' 中子素锭'}`;
			},
			canAfford() {
				return player.points.gte(this.cost()) && (hasUpgrade('l8', 84) || player.l7.points3.gte(1e18));
			},
			buy() {
				player.points = player.points.sub(this.cost());
				if(!hasMilestone('l8', 26))
				{
					player.l7.points3 = n(0);
					player.l7.nnow3 = n(0);
					layers.l7.calceff3();
				}
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = n(1).add(x.mul(0.02));
				if(x.gte(3)) base = base.mul(x.min(8).sub(2).pow_base(1.01));
				if(x.gte(9)) base = base.mul(x.sub(8).pow_base(1.0075));
				// 七重诅咒5：中子素块效果^0.3
				if(player.l8.voidShaped) base = base.pow(0.3);
				return base;
			},
			unlocked() {
				return hasMilestone("l8",21);
			},
            style() { return {'border-radius': "10px",height: "120px", width: "275px", 'border-color': 'white', 'box-shadow': '0px 0px 20px 10px white', 'background-color': this.canAfford() ? 'white' : 'black', 'color': this.canAfford() ? 'black' : 'white','margin':"20px"}},
            tooltip(){return "数量: <h2 style='color:white;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		71: {
			...brickDim,
			index: 0,
			base: n(2),
			mul: n(2),
		},
		72: {
			...brickDim,
			index: 1,
			base: n(4),
			mul: n(4),
		},
		73: {
			...brickDim,
			index: 2,
			base: n(16),
			mul: n(8),
		},
		74: {
			...brickDim,
			index: 3,
			base: n(256),
			mul: n(16),
		},
		75: {
			...brickDim,
			index: 4,
			base: n(65536),
			mul: n(32),
		},
		76: {
			...brickDim,
			index: 5,
			base: n(2 ** 32),
			mul: n(64),
		},
		//Line 100
		1001: {
			...unityBox,
			title: '点数增益',
			ed: '倍数增幅点数',
			op: 'x',
			effect(x) {
				return x.pow_base(1e10);
			},
		},
		1002: {
			...unityBox,
			title: '点数之力',
			ed: '指数增幅点数',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1003: {
			...unityBox,
			title: '点数增强',
			ed: '点数增幅点数',
			op: 'x',
			effect(x) {
				return player.points.add(1).ln().add(1).pow(x);
			},
		},
		1004: {
			...unityBox,
			title: '点数继承',
			ed: '数据增幅点数',
			op: 'x',
			effect(x) {
				return player.l1.points.add(1).ln().add(1).pow(x);
			},
		},
		1005: {
			...unityBox,
			title: '点数本质',
			ed: '累计本质增幅点数',
			op: '^',
			effect(x) {
				return player.l8.total.add(1).ln().mul(0.001).mul(x).add(1);
			},
		},
		//Line 101
		1011: {
			...unityBox,
			title: '点数赋能',
			ed: '增强"重复了无数遍的开始"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1012: {
			...unityBox,
			title: '点数增殖',
			ed: '增强复制器第一效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1013: {
			...unityBox,
			title: '点数之心',
			ed: '增强核心增益V',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1014: {
			...unityBox,
			title: '点数密度',
			ed: '增强致密点数第一效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1015: {
			...unityBox,
			title: '点数起源',
			ed: '增强"你曾从这里开始"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 102
		1021: {
			...unityBox,
			title: '点数扩散',
			ed: '增强"回望往事"',
			op: '^',
			effect(x) {
				return x.add(1).log10().mul(0.05).add(1);
			},
		},
		1022: {
			...unityBox,
			title: '点数充能',
			ed: '在硬上限之后增强"收入囊中"',
			op: '^',
			effect(x) {
				return x.add(1).log10().mul(0.05).add(1);
			},
		},
		1023: {
			...unityBox,
			title: '点数回荡',
			ed: '增加"尘埃回荡"效果',
			op: '+',
			effect(x) {
				return x.mul(0.01);
			},
		},
		1024: {
			...unityBox,
			title: '点数突击',
			ed: '增加"两面突击"效果',
			op: '+',
			effect(x) {
				return x.mul(0.01);
			},
		},
		1025: {
			...unityBox,
			title: '点数末日',
			ed: '增强奇点第一效果',
			op: '^',
			effect(x) {
				return x.add(1).log10().mul(0.05).add(1);
			},
		},
		//Line 103
		1031: {
			...unityBox,
			title: '数据增益',
			ed: '倍数增幅数据',
			op: 'x',
			effect(x) {
				return x.pow_base(1e10);
			},
		},
		1032: {
			...unityBox,
			title: '数据之力',
			ed: '指数增幅数据',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1033: {
			...unityBox,
			title: '数据神力',
			ed: '根据点数指数增幅数据',
			op: '^',
			effect(x) {
				if(x.lt(1)) return n(1);
				return player.points.pow(x).add(10).log10().log10().div(100).add(1);
			},
		},
		1034: {
			...unityBox,
			title: '数据开辟',
			ed: '增强"又来了"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1035: {
			...unityBox,
			title: '数据递归',
			ed: '增强"递归"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 104
		1041: {
			...unityBox,
			title: '数据归并',
			ed: '增强"递归递归"',
			op: 'x',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1042: {
			...unityBox,
			title: '数据合流',
			ed: '增强复制器第二效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1043: {
			...unityBox,
			title: '数据抉择',
			ed: '硬上限之后增强"艰难的抉择"效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1044: {
			...unityBox,
			title: '数据强化',
			ed: '增强"内存升级"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1045: {
			...unityBox,
			title: '数据学习',
			ed: '增强"转生复制器"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 105
		1051: {
			...unityBox,
			title: '复制能量',
			ed: '增幅复制器获取',
			op: '^',
			effect(x) {
				return x.pow_base(10);
			},
		},
		1052: {
			...unityBox,
			title: '复制韧性',
			ed: '增强复制器第三效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1053: {
			...unityBox,
			title: '复制命格',
			ed: '增强"让生命蓬勃生长"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1054: {
			...unityBox,
			title: '复制时光',
			ed: '增强"驻足现在"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1055: {
			...unityBox,
			title: '复制防御',
			ed: '增强复制之盾',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 106
		1061: {
			...unityBox,
			title: '转生增益',
			ed: '倍数增幅转生点数',
			op: 'x',
			effect(x) {
				return x.pow_base(1e10);
			},
		},
		1062: {
			...unityBox,
			title: '转生之力',
			ed: '指数增幅转生点数',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1063: {
			...unityBox,
			title: '转生核心',
			ed: '增强核心增益II',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1064: {
			...unityBox,
			title: '转生之路',
			ed: '增强"又来这一套"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1065: {
			...unityBox,
			title: '转生增幅',
			ed: '增强"增幅器II-B"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 107
		1071: {
			...unityBox,
			title: '核心力量',
			ed: '增强核心增益I~II',
			op: '^',
			effect(x) {
				return x.mul(0.025).add(1);
			},
		},
		1072: {
			...unityBox,
			title: '核心优惠',
			ed: '增强"增幅器III-C"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1073: {
			...unityBox,
			title: '核心复制',
			ed: '增强"增幅器IV-C"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1074: {
			...unityBox,
			title: '核心压缩',
			ed: '增强"让空间压缩能量"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1075: {
			...unityBox,
			title: '核心振幅',
			ed: '增强"核心共振"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 108
		1081: {
			...unityBox,
			title: '转生攻击',
			ed: '增强"转生加成"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1082: {
			...unityBox,
			title: '转生防御',
			ed: '增强转生之盾',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1083: {
			...unityBox,
			title: '转生武器',
			ed: '增强转生之剑',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1084: {
			...unityBox,
			title: '转生连携',
			ed: '数据增强转生点数',
			op: '^',
			effect(x) {
				if(x.lt(1)) return n(1);
				return player.points.pow(x).add(10).log10().log10().mul(0.05).add(1);
			},
		},
		1085: {
			...unityBox,
			title: '转生反制',
			ed: '转生点数增强数据',
			op: '^',
			effect(x) {
				if(x.lt(1)) return n(1);
				return player.l2.points.pow(x).add(10).log10().log10().mul(0.05).add(1);
			},
		},
		//Line 109
		1091: {
			...unityBox,
			title: '致密增益',
			ed: '倍数增幅致密点数',
			op: 'x',
			effect(x) {
				return x.pow_base(1e5);
			},
		},
		1092: {
			...unityBox,
			title: '致密之力',
			ed: '指数增幅致密点数',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1093: {
			...unityBox,
			title: '致密回归',
			ed: '增强"你再次回到这里"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1094: {
			...unityBox,
			title: '致密增幅',
			ed: '增强"增幅器IV-D"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1095: {
			...unityBox,
			title: '致密锋锐',
			ed: '增强"致密加成I/II"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 110
		1101: {
			...unityBox,
			title: '奇点增益',
			ed: '倍数增幅奇点',
			op: 'x',
			effect(x) {
				return x.pow_base(3);
			},
		},
		1102: {
			...unityBox,
			title: '奇点之力',
			ed: '指数增幅奇点倍率',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1103: {
			...unityBox,
			title: '奇点过载',
			ed: '增强"QoL?"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1104: {
			...unityBox,
			title: '奇点增重',
			ed: '增强"奇点加成"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1105: {
			...unityBox,
			title: '奇点武器',
			ed: '增强奇点之剑',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 111
		1111: {
			...unityBox,
			title: '攻击增益',
			ed: '倍数增幅攻击力',
			op: 'x',
			effect(x) {
				return x.pow_base(1e5);
			},
		},
		1112: {
			...unityBox,
			title: '攻击之力',
			ed: '指数增幅攻击力',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1113: {
			...unityBox,
			title: '火力压制',
			ed: '增强所有武器',
			op: '^',
			effect(x) {
				return x.mul(0.03).add(1);
			},
		},
		1114: {
			...unityBox,
			title: '坚不可摧',
			ed: '增强所有防具',
			op: '^',
			effect(x) {
				return x.mul(0.03).add(1);
			},
		},
		1115: {
			...unityBox,
			title: '十项全能',
			ed: '增强所有武器和防具',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		//Line 112
		1121: {
			...unityBox,
			title: '超能武器',
			ed: '获得额外的终极之剑',
			op: '+',
			effect(x) {
				return x.mul(5);
			},
		},
		1122: {
			...unityBox,
			title: '超能防具',
			ed: '获得额外的终极之盾',
			op: '+',
			effect(x) {
				return x.mul(5);
			},
		},
		1123: {
			...unityBox,
			title: '全能配组',
			ed: '获得额外的终极之剑和终极之盾',
			op: '+',
			effect(x) {
				return x.mul(2);
			},
		},
		1124: {
			...unityBox,
			title: '全副武装',
			ed: '获得终极之盾倍率',
			op: 'x',
			effect(x) {
				return x.mul(0.1).add(1);
			},
		},
		1125: {
			...unityBox,
			title: '攻击飞升',
			ed: '增强攻击精华',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 113
		1131: {
			...unityBox,
			title: '飞升增益',
			ed: '倍数增幅飞升点数',
			op: 'x',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1132: {
			...unityBox,
			title: '不是挑战',
			ed: '增强"反-复制器"的奖励',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1133: {
			...unityBox,
			title: '迎难而上',
			ed: '增强"数据溢出"的奖励',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1134: {
			...unityBox,
			title: '有志竟成',
			ed: '增强"核心崩坏"的奖励',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1135: {
			...unityBox,
			title: '勇攀高峰',
			ed: '增强"压缩失效"的奖励',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 114
		1141: {
			...unityBox,
			title: '精华增益',
			ed: '倍数增幅飞升精华',
			op: 'x',
			effect(x) {
				return x.pow_base(100);
			},
		},
		1142: {
			...unityBox,
			title: '飞升飞升',
			ed: '增强飞升点数第一效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1143: {
			...unityBox,
			title: '奇点飞升',
			ed: '增强"奇点精华"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1144: {
			...unityBox,
			title: '点数飞升',
			ed: '增强"点数精华"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1145: {
			...unityBox,
			title: '飞升之魂',
			ed: '飞升点数增强点数获取',
			op: 'x',
			effect(x) {
				if(x.lt(1)) return n(1);
				let effect = player.l5.points.pow(x.add(1).log(2)).pow_base(2);
				if(effect.gte('ee10')) effect = effect.log10().log10().mul(1e9).pow_base(10);
				return effect;
			},
		},
		//Line 115
		1151: {
			...unityBox,
			title: '遗迹增益',
			ed: '倍数增幅遗迹点数',
			op: 'x',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1152: {
			...unityBox,
			title: '能量增益',
			ed: '倍数增幅维度效率',
			op: 'x',
			effect(x) {
				return x.pow_base(10);
			},
		},
		1153: {
			...unityBox,
			title: '维度升级',
			ed: '增加维度数量',
			op: '+',
			effect(x) {
				return x;
			},
		},
		1154: {
			...unityBox,
			title: '维度增益',
			ed: '倍数增益维度数量',
			op: 'x',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1155: {
			...unityBox,
			title: '维度维度',
			ed: '增幅"第一维度维度"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 116 WIP
		1161: {
			...unityBox,
			title: '中子增益',
			ed: '倍数增幅中子素尘埃',
			op: 'x',
			effect(x) {
				return x.pow_base(1e5);
			},
		},
		1162: {
			...unityBox,
			title: '合成增益',
			ed: '倍数增幅中子素合成倍率',
			op: 'x',
			effect(x) {
				return x.pow_base(10);
			},
		},
		1163: {
			...unityBox,
			title: '献祭之遗',
			ed: '献祭保留一部分消耗的中子素',
			op: 'x',
			effect(x) {
				return new Decimal(1).sub(x.mul(0.01).add(1).pow(-1));
			},
		},
		1164: {
			...unityBox,
			title: '五转金身',
			ed: '飞升挑战5效应增强',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1165: {
			...unityBox,
			title: '六转金身',
			ed: '飞升挑战6效应增强',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
	},
	clickables: {
		hold: {
            display() {
                return "长按持续本质重置";
            },
            canClick() {
                return true
            },
            onHold() {
                doReset("l8")
            },
            unlocked(){return hasMilestone('l8', 17)},
            style(){
                return {"color":"#FFFFFFCC","height":"80px","min-height":"80px","width":"80px","margin":"0px"}
            },
        },
		tu0: {...tUp,index: 0},
		tu1: {...tUp,index: 1},
		tu2: {...tUp,index: 2},
		tu3: {...tUp,index: 3},
		tu4: {...tUp,index: 4},
		tu5: {...tUp,index: 5},
		tu6: {...tUp,index: 6},
		tu7: {...tUp,index: 7},
		tu8: {...tUp,index: 8},
		td0: {...tDown,index: 0},
		td1: {...tDown,index: 1},
		td2: {...tDown,index: 2},
		td3: {...tDown,index: 3},
		td4: {...tDown,index: 4},
		td5: {...tDown,index: 5},
		td6: {...tDown,index: 6},
		td7: {...tDown,index: 7},
		td8: {...tDown,index: 8},
		uR: {
			display(){
				return '<h3>+' + format(tmp.l8.uPGain) + ' 统一点数</h3>';
			},
			onClick(){
				player.l8.unityPoints = player.l8.unityPoints.add(tmp.l8.uPGain);
				player.l8.points = n(0);
				player.l8.unitied = true;
				updateTemp();
			},
			style(){
				return {"min-height":"0px","height":"120px","width":"180px","background-color":this.canClick() ? "orange" : ""};
			},
			canClick(){
				return tmp.l8.uPGain.gte(1);
			},
			unlocked(){
				return true;
			}
		},
		bhUp: {
			display(){
				return '<h3>升级黑洞</h3><br/>价格：' + format(tmp.l8.bhUpCost) + ' 黑洞质量。';
			},
			onClick(){
				player.l8.bhMass = player.l8.bhMass.sub(tmp.l8.bhUpCost);
				player.l8.bhLevel = player.l8.bhLevel.add(1);
			},
			style(){
				return {"min-height":"0px","height":"100px","width":"160px","background-color":this.canClick() ? "grey" : "black","border-color":"white","color":"white"};
			},
			canClick(){
				return player.l8.bhMass.gte(tmp.l8.bhUpCost);
			},
			unlocked(){
				return true;
			}
		},
		bhBoom: {
			display(){
				let k = '<h3>暴涨黑洞</h3>';
				if(!this.canClick()) k += '<br>' + ((Date.now() - player.l8.lastBhBoom) / 1000).toFixed(1) + 's/' + tmp.l8.bhBoomCDSecond.toNumber().toFixed(1) + 's';
				return k;
			},
			onClick(){
				player.l8.bhMass = player.l8.bhMass.add(tmp.l8.bhMassGain.mul(tmp.l8.bhBoomEffect));
				player.l8.lastBhBoom = Date.now();
			},
			style(){
				return {"min-height":"0px","height":"100px","width":"160px","background-color":this.canClick() ? "grey" : "black","border-color":"white","color":"white"};
			},
			canClick(){
				if((Date.now() - player.l8.lastBhBoom) >= 1000 * tmp.l8.bhBoomCDSecond.toNumber()) return true;
				return false;
			},
			unlocked(){
				return player.l8.bhLevel.gte(250);
			},
		},
		bhTerbulence: {
			display(){
				let k = '<h3>执行真空湍流</h3>';
				if(!this.canClick()) k += '<br>' + ((Date.now() - player.l8.lastBhTerbulence) / 1000).toFixed(1) + 's/' + tmp.l8.bhTerbulenceCDSecond.toNumber().toFixed(1) + 's';
				return k;
			},
			onClick(){
				player.l8.points = player.l8.points.add(tmp.l8.resetGain.mul(tmp.l8.bhTerbulenceEffect));
				player.l8.lastBhTerbulence = Date.now();
			},
			style(){
				return {"min-height":"0px","height":"100px","width":"160px","background-color":this.canClick() ? "grey" : "black","border-color":"white","color":"white"};
			},
			canClick(){
				if((Date.now() - player.l8.lastBhTerbulence) >= 1000 * tmp.l8.bhTerbulenceCDSecond.toNumber()) return true;
				return false;
			},
			unlocked(){
				return player.l8.bhLevel.gte(600);
			},
		},
		bhDark: {
			display(){
				let gain = (player.l8.bhLevel.gte(1000) && player.l8.points.gte(1e120)) ? player.l8.points.add(Math.E).ln().mul(hasUpgrade('l8', 182) ? upgradeEffect('l8', 182) : 1).mul(layers.l8.bhDmLevelBoost()).sub(player.l8.darkMatter).max(0) : n(0);
				let k = '<h3>凝聚暗物质</h3><br>消耗' + format(n(1e120)) + '本质，增加' + format(gain) + '暗物质。';
				k += '<br>执行一次砖重置并额外重置黑洞质量。';
				if(player.l8.bhLevel.lt(1000)) k += '<br>需要黑洞等级达到1000级。';
				if(player.l8.voidShaped) k='你无法在虚空中获取暗物质'
				return k;
			},
			onClick(){
				player.l8.darkMatter = player.l8.points.add(Math.E).ln().mul(hasUpgrade('l8', 182) ? upgradeEffect('l8', 182) : 1).mul(layers.l8.bhDmLevelBoost());
				layers.l8.clickables.bR.onClick();
				player.l8.bhMass = n(0);
			},
			style(){
				return {"min-height":"0px","height":"100px","width":"480px","background-color":this.canClick() ? "purple" : "black","border-color":"white","color":"white"};
			},
			canClick(){
				return (!player.l8.voidShaped)&&player.l8.bhLevel.gte(1000) && player.l8.points.gte(1e120) && player.l8.points.add(Math.E).ln().mul(hasUpgrade('l8', 182) ? upgradeEffect('l8', 182) : 1).mul(layers.l8.bhDmLevelBoost()).sub(player.l8.darkMatter).gt(0);
			},
			unlocked(){
				return player.l8.bhLevel.gte(900);
			},
		},
		bhVoid: {
			display(){
				let k = '<h3>凝聚虚空物质</h3><br>消耗' + format(n('1.8e308')) + '本质，增加' + format(player.l8.darkMatter.pow(0.25).mul(hasUpgrade('l8', 184) ? upgradeEffect('l8', 184) : 1).mul(layers.l8.bhVmLevelBoost())) + '虚空物质。';
				k += '<br>执行一次暗物质凝聚并额外重置暗物质和黑洞等级。';
				if(player.l8.bhLevel.lt(1200)) k += '<br>需要黑洞等级达到1200级。';
				return k;
			},
			onClick(){
				player.l8.voidMatter = player.l8.voidMatter.add(player.l8.darkMatter.pow(0.25).mul(hasUpgrade('l8', 184) ? upgradeEffect('l8', 184) : 1).mul(layers.l8.bhVmLevelBoost()));
				layers.l8.clickables.bhDark.onClick();
				player.l8.darkMatter = n(0);
				player.l8.bhLevel = n(0);
			},
			style(){
				return {"min-height":"0px","height":"100px","width":"480px","background-color":this.canClick() ? "dimgray" : "black","border-color":"white","color":"white"};
			},
			canClick(){
				return player.l8.bhLevel.gte(1200) && player.l8.points.gte('1.8e308') && (!player.l8.voidShaped);
			},
			unlocked(){
				return player.l8.bhLevel.gte(1100);
			},
		},
		voidShape: {
			display(){
				let shaped = player.l8.voidShaped;
				let k = '<div style="position: relative; z-index: 1">' + (shaped
					? '<h2>虚空已成</h2><br>你已完成虚空成形：第1~8层的全部内容已被大重置彻底清零，你正从第1层重新攀爬。<br>虚空之印永驻，七重祝福与七重诅咒将伴随此后的每一次重置。'
					: '<h2>虚空成形 · 大重置</h2><br>启用虚空成形后，将无法关闭。<br>你将完成彻底的升变，接受天幕之外伟大存在的注视，染上虚空的色彩<br>【虚空大重置】第1~8层的全部内容（点数、升级、充能升级、购买项、里程碑、挑战记录、重置次数）将被彻底清零，你将从第1层从头开始。<br>【永久保留】成就层、虚空之印、七重祝福、七重诅咒。<br>请一定要购买完所有充能升级，它们会随大重置一同消失。');
				k += '<br><table style="width: 100%; text-align: left; font-size: 1.25em"><tr>';
				k += '<td style="width: 50%; vertical-align: top; color: green; text-shadow: 0px 0px 4px green">' + (shaped ? '七重祝福（已获得）' : '七重祝福（将获得）') + '：<br>1. 解锁数据层新升级<br>2. 解锁???<br>3. 解锁???<br>4. 解锁???<br>5. 解锁???<br>6. ?????<br>7. ?????</td>';/*1. 解锁虚空采集器<br>2. 解锁虚空降临<br>3. 解锁砖墙构筑<br>4. 解锁本质充能<br>5. 解锁半神武器<br>6. 窥探天幕，得见真实<br>7. 升华生命，行往无尽</td1. 解锁虚空采集器<br>2. 解锁虚空降临<br>3. 解锁砖墙构筑<br>4. 解锁本质充能<br>5. 解锁半神武器<br>6. 窥探天幕，得见真实<br>7. 升华生命，行往无尽*/
				k += '<td style="width: 50%; vertical-align: top; color: red; text-shadow: 0px 0px 4px red">' + (shaped ? '七重诅咒（生效中）' : '七重诅咒（将承受）') + '：<br>1. 所有侵蚀强行生效，固定于指数^0.02且不再周期性重置<br>2. 本质获取^0.5<br>3. 前七层速度降低1.00e12倍<br>4. 无法获得暗物质和砖<br>5. 中子素块效果^0.3<br>6. 禁用核心效果4,5<br>7. 无法进行频率跃迁</td>';
				k += '</tr></table></div>';
				if(player.l8.voidShaped) k += '<div class="voidShapeLines"></div><div class="voidShapeDots"></div>';
				return k;
			},
			onClick(){
				console.log('[虚空成形] onClick 触发于 ' + new Date().toLocaleTimeString());
				if(player.l8.voidShaped) return;
				// 虚空大重置：第1~8层全部归零，随后播放成形动画
				layers.l8.voidBigReset();
				layers.l8.startVoidShapeAnim();
			},
			style(){
				return {"min-height":"0px","height":"540px","width":"480px","border-color":"white","color":"black","background":"radial-gradient(circle, white 0%, gray 55%, black 100%)","position":"relative","overflow":"hidden"};
			},
			canClick(){
				return hasUpgrade('l8', 185) && !player.l8.voidShaped;
			},
			unlocked(){
				// 大重置会清空升级，但成形面板要常驻可见，用来展示虚空之印/祝福/诅咒
				return hasUpgrade('l8', 185) || player.l8.voidShaped;
			},
		},
		study1: {
			display(){
				let str = '<h3>学习1分钟</h3><br/>将获得少量经验值，可能获得低级炼金感悟。';
				if(player.l8.baCU[0]) str += '<br/>已获得感悟：生物炼金-坚固';
				if(player.l8.baCU[1]) str += '<br/>已获得感悟：生物炼金-活性';
				if(player.l8.baCU[2]) str += '<br/>已获得感悟：生物炼金-闪避';
				return str;
			},
			onClick(){
				player.l8.baTime = Date.now() + 1000 * 60 / (hasUpgrade('l8', 123) ? 60 : 1);
				player.l8.baStudyLevel = 1;
			},
			style(){
				return {"border-radius":"0px","min-height":"0px","height":"100px","width":"240px","background-color":this.canClick() ? "green" : "grey","border-color":"white","color":"white"};
			},
			canClick(){
				return player.l8.baStudyLevel === 0;
			},
			unlocked(){
				return true;
			},
		},
		study2: {
			display(){
				let str = '<h3>学习5分钟</h3><br/>将获得中量经验值，可能获得中级炼金感悟。';
				if(player.l8.baCU[3]) str += '<br/>已获得感悟：生物炼金-韧性';
				if(player.l8.baCU[4]) str += '<br/>已获得感悟：生物炼金-意志';
				if(player.l8.baCU[5]) str += '<br/>已获得感悟：生物炼金-气场';
				return str;
			},
			onClick(){
				player.l8.baTime = Date.now() + 1000 * 60 * 5 / (hasUpgrade('l8', 123) ? 60 : 1);
				player.l8.baStudyLevel = 2;
			},
			style(){
				return {"border-radius":"0px","min-height":"0px","height":"100px","width":"240px","background-color":this.canClick() ? "green" : "grey","border-color":"white","color":"white"};
			},
			canClick(){
				return player.l8.baStudyLevel === 0;
			},
			unlocked(){
				return true;
			},
		},
		study3: {
			display(){
				let str = '<h3>学习15分钟</h3><br/>将获得大量经验值，可能获得高级炼金感悟。';
				if(player.l8.baCU[6]) str += '<br/>已获得感悟：生物炼金-禁锢';
				if(player.l8.baCU[7]) str += '<br/>已获得感悟：生物炼金-反击';
				if(player.l8.baCU[8]) str += '<br/>已获得感悟：生物炼金-绝艺';
				return str;
			},
			onClick(){
				player.l8.baTime = Date.now() + 1000 * 60 * 15 / (hasUpgrade('l8', 123) ? 60 : 1);
				player.l8.baStudyLevel = 3;
			},
			style(){
				return {"border-radius":"0px","min-height":"0px","height":"100px","width":"240px","background-color":this.canClick() ? "green" : "grey","border-color":"white","color":"white"};
			},
			canClick(){
				return player.l8.baStudyLevel === 0;
			},
			unlocked(){
				return true;
			},
		},
		baCS1: {
			...baCS,
			index: 0,
			name: '坚固',
		},
		baCS2: {
			...baCS,
			index: 1,
			name: '活性',
		},
		baCS3: {
			...baCS,
			index: 2,
			name: '闪避',
		},
		baCS4: {
			...baCS,
			index: 3,
			name: '韧性',
			unlocked() {
				return player.l8.baC.unl1;
			},
		},
		baCS5: {
			...baCS,
			index: 4,
			name: '意志',
			unlocked() {
				return player.l8.baC.unl1;
			},
		},
		baCS6: {
			...baCS,
			index: 5,
			name: '气场',
			unlocked() {
				return player.l8.baC.unl1;
			},
		},
		baCS7: {
			...baCS,
			index: 6,
			name: '禁锢',
			unlocked() {
				return player.l8.baC.unl2;
			},
		},
		baCS8: {
			...baCS,
			index: 7,
			name: '反击',
			unlocked() {
				return player.l8.baC.unl2;
			},
		},
		baCS9: {
			...baCS,
			index: 8,
			name: '绝艺',
			unlocked() {
				return player.l8.baC.unl2;
			},
		},
		bR: {
			display(){
				if(player.l8.voidShaped) return "你无法在虚空中获得砖"
				if(tmp.l8.brickGain.gt(0) && tmp.l8.brickGain.lt(100))
				{
					return `<h3>+${format(tmp.l8.brickGain, 0)} (${format(tmp.l8.brickGainExact.sub(tmp.l8.brickGain).mul(100), 1)}%) 砖</h3><br>需要达到${hasUpgrade('l8', 104) ? 'e1.150e9' : 'e1.250e9'}点数或处于第一次制砖，才能在重置时获得砖`;
				}
				return '<h3>+' + format(tmp.l8.brickGain, 0) + ' 砖</h3><br>需要达到' + (hasUpgrade('l8', 104) ? 'e1.150e9' : 'e1.250e9') + '点数或处于第一次制砖，才能在重置时获得砖';
			},
			onClick(){
				let gain = tmp.l8.brickGain;
				if(player.points.gte(hasUpgrade('l8', 104) ? 'e1.15e9' : 'e1.25e9') || player.l8.brick.value.lt(1))
				{
					player.l8.brick.value = player.l8.brick.value.add(gain);
					player.l8.brick.valid = player.l8.brick.valid.add(gain);
				}
				else
				{
					if(!confirm('由于不符合条件，现在重置无法获得砖，你确定要重置吗'))
					{
						return;
					}
				}
				doReset('l8');
				if(!hasUpgrade('l8', 144)) layerDataReset('l7');
				if(!player.l8.voidShaped){
					player.l8.erosion.run = [false, false, false, false, false, false, false];
					player.l8.erosion.time = [n(0), n(0), n(0), n(0), n(0), n(0), n(0)];
					player.l8.erosion.lastCycle = [n(0), n(0), n(0), n(0), n(0), n(0), n(0)];
				}
				player.l8.points = n(0);
				player.l8.intrinsic = n(0);
				player.l8.intDim = [n(0), n(0), n(0), n(0), n(0), n(0)];
				let rb = [21, 22, 23, 24, 25, 26, 51, 52, 53, 61];
				if(!hasUpgrade('l8', 112)) rb.push(11, 12, 13, 14, 15, 16);
				if(!hasUpgrade('l8', 114)) rb.push(31, 32, 33);
				for(let i in rb) setBuyableAmount('l8', rb[i], n(0));
				updateTemp();
			},
			style(){
				return {"min-height":"0px","height":"120px","width":"180px","background-color":this.canClick() ? "brown" : ""};
			},
			canClick(){
				return (!player.l8.voidShaped) && (tmp.l8.brickGain.gte(1) || tmp.l8.isErosing);
			},
			unlocked(){
				return player.l8.brick.unlocked;
			}
		},
	},
	bars: {
		t0: {
			...t,
			index: 0,
			name: '点数',
			op: '^',
		},
		t1: {
			...t,
			index: 1,
			name: '数据',
			op: '^',
		},
		t2: {
			...t,
			index: 2,
			name: '转生点数',
			op: '^',
		},
		t3: {
			...t,
			index: 3,
			name: '致密点数',
			op: '^',
		},
		t4: {
			...t,
			index: 4,
			name: '攻击力',
			op: '^',
		},
		t5: {
			...t,
			index: 5,
			name: '飞升点数',
			op: 'x',
		},
		t6: {
			...t,
			index: 6,
			name: '遗迹',
			op: 'x',
		},
		t7: {
			...t,
			index: 7,
			name: '中子素尘埃',
			op: '^',
		},
		t8: {
			...t,
			index: 8,
			name: '黑洞暴涨等级',
			op: '^',
		},
		study: {
			direction: RIGHT,
			width: 240,
			height: 40,
			progress(){
				return tmp.l8.expRate;
			},
			style()
			{
				return {'color': 'green'};
			},
			display(){
				return '当前经验比率：' + format(tmp.l8.expRate, 2);
			},
			unlocked(){
				return true;
			},
		},
	},
	challenges: {
		11: {
			...baC,
			index: 0,
			name: '炼金挑战-坚固',
			challengeDescription(){return 'loader3229每升一级，收到伤害开次方根+0.2。'},
		},
		12: {
			...baC,
			index: 1,
			name: '炼金挑战-活性',
			challengeDescription(){return 'loader3229每30游戏秒会攻击你一次，造成一定资源损失。'},
		},
		13: {
			...baC,
			index: 2,
			name: '炼金挑战-闪避',
			challengeDescription(){return 'loader3229有90%几率闪避你的攻击，并且它们^0.25。'},
		},
		21: {
			...baC,
			index: 3,
			name: '炼金挑战-韧性',
			challengeDescription(){return '<span style="color: red">最终点数获取/e1e9</span><br>loader3229的伤害溢出效应最大值在底数0.25。'},
		},
		22: {
			...baC,
			index: 4,
			name: '炼金挑战-意志',
			challengeDescription(){return '<span style="color: red">最终点数获取/e1e9</span><br>loader3229每次受击，1游戏秒内全局速度固定为0.5x，并且溢出强度提升75%。<br><b style="color: red">禁用自动攻击。</b>'},
		},
		23: {
			...baC,
			index: 5,
			name: '炼金挑战-气场',
			challengeDescription(){return '<span style="color: red">最终点数获取/e1e9</span><br>loader3229难以接近，溢出强度提升150%，且受击会让你回到挑战页面。<br><b style="color: red">禁用自动攻击。</b>'},
		},
		31: {
			...baC,
			index: 6,
			name: '炼金挑战-禁锢',
			challengeDescription(){return '<span style="color: red">最终点数获取/e1e13</span><br>loader3229每5现实秒会随机禁用你的1~7内一个层级30秒，且伤害溢出效应最大值在底数0.2。'},
		},
		32: {
			...baC,
			index: 7,
			name: '炼金挑战-反击',
			challengeDescription(){return '<span style="color: red">最终点数获取/e1e14</span><br>loader3229受伤时对你的1~7层数值赋予等倍率削弱，且伤害溢出效应最大值在底数0.15。'},
		},
		33: {
			...baC,
			index: 8,
			name: '炼金挑战-绝艺',
			challengeDescription(){return '<span style="color: red">最终点数获取/e1e15</span><br>loader3229复活时随机禁用你一个层级，CD10现实秒，且伤害溢出效应最大值在底数0.1。'},
		},
	},
	microtabs: {
		main: {
			'本质基础值': {
				content: [
                    ['display-text', function() {return '当前本质基础值：<h2 style="color: red">' + format(tmp.l8.basicAmount) + '</h2><br />';}],
					['blank'],
					['display-text', function() {return '由点数提供了<h3 style="color: red">x' + format(tmp.l8.baFactor1) + '</h3><br />';}],
					['display-text', function() {return '由打破的loader3229血条提供了<h3 style="color: red">x' + format(tmp.l8.baFactor2) + '</h3><br />';}],
					['display-text', function() {return '由中子素尘埃提供了<h3 style="color: red">x' + format(tmp.l8.baFactor3) + '</h3><br />';}],
					['display-text', function() {return '由其它乘数提供了<h3 style="color: #900">x' + format(tmp.l8.baFactor4) + '</h3><br />';}],
					['row', [['buyable', 11], ['buyable', 12], ['buyable', 13]]],
					['row', [['buyable', 14], ['buyable', 15], ['buyable', 16]]],
					['row', [['buyable', 17]]],
				],
                unlocked() {
                    return true;
                },
			},
			'本征维度': {
				content: [
                    ['display-text', function() {return '本征能量：<h2 style="color: #f60">' + format(player.l8.intrinsic) + '</h2><br />';}],
					['display-text', function() {return '本征能量让本质基础值x' + format(tmp.l8.intEff1) + ',点数获取x' + format(tmp.l8.intEff2) + '<br />';}],
					['display-text', '需要累计本质超过0才能购买第一本征维度。'],
					['blank'],
					['row', [['display-text', function() {return layers.l8.intDimDesc(0);}], ['buyable', 21]]],
					['row', [['display-text', function() {return layers.l8.intDimDesc(1);}], ['buyable', 22]]],
					['row', [['display-text', function() {return layers.l8.intDimDesc(2);}], ['buyable', 23]]],
					['row', [['display-text', function() {return layers.l8.intDimDesc(3);}], ['buyable', 24]]],
					['row', [['display-text', function() {return layers.l8.intDimDesc(4);}], ['buyable', 25]]],
					['row', [['display-text', function() {return layers.l8.intDimDesc(5);}], ['buyable', 26]]],
				],
                unlocked() {
                    return true;
                },
			},
			'本征频率': {
				content: [
                    ['display-text', function() {return '当前本征计数频率：<h2 style="color: #f60">' + format(tmp.l8.intTickspeed) + '</h2><br />';}],
					['display-text', function() {return '计数频率会直接倍增本征能量产量，不受到乘数指数的影响。';}],
					['blank'],
					['row', [['buyable', 31], ['buyable', 32]]],
					['display-text', function() {if(hasUpgrade('l8', 12)) return '频率跃迁将消耗本征能量并提升本质频率强化的效果。';}],
					['row', [['buyable', 33]]],
				],
                unlocked() {
                    return true;
                },
			},
			'调律流形': {
				content: [
					['display-text', function() {return '调律流形中，可以调整资源获取的调律能级。初始调律能级均为10级，最低9级，最高11级。';}],
					['display-text', function() {return '调律能级低于10时，资源获取速度会被削弱。高于10时，资源获取速度会被增强。';}],
					['display-text', function() {return '当前调律能级：' + format(tmp.l8.availTunLevel) + '/' + format(tmp.l8.tunLevelMax);}],
					['row', [['buyable', 41], ['buyable', 42], ['buyable', 43]]],
					['row', [['bar', 't0'], ['clickable', 'tu0'], ['clickable', 'td0']]],
					['row', [['bar', 't1'], ['clickable', 'tu1'], ['clickable', 'td1']]],
					['row', [['bar', 't2'], ['clickable', 'tu2'], ['clickable', 'td2']]],
					['row', [['bar', 't3'], ['clickable', 'tu3'], ['clickable', 'td3']]],
					['row', [['bar', 't4'], ['clickable', 'tu4'], ['clickable', 'td4']]],
					['row', [['bar', 't5'], ['clickable', 'tu5'], ['clickable', 'td5']]],
					['row', [['bar', 't6'], ['clickable', 'tu6'], ['clickable', 'td6']]],
					['row', [['bar', 't7'], ['clickable', 'tu7'], ['clickable', 'td7']]],
					['row', [['bar', 't8'], ['clickable', 'tu8'], ['clickable', 'td8']]],
					['upgrades', [5, 6]],
				],
				unlocked() {
					return hasUpgrade('l8', 11);
				},
			},
			'原始黑洞': {
				content: [
					['display-text', function() {return '原始黑洞会随着时间缓慢增加黑洞质量。';}],
					['display-text', function() {return '黑洞质量用于提升等级或购买黑洞升级。等级提升会直接提升前7层的全局速度。';}],
					['display-text', function() {return '当前原始黑洞等级：<h1 style="color: silver">' + format(player.l8.bhLevel, 0) + '</h1>。前7层速度×<h2 style="color: gold">' + format(tmp.l8.bhEff) + '</h2>。';}],
					['display-text', function() {return '当前黑洞质量：<h2 style="color: silver">' + format(player.l8.bhMass) + '</h2>(+' + format(tmp.l8.bhMassGain) + '/s)';}],
					['display-text', function() {
						if(!player.l8.bhLevel.gte(1000)) return '';
						let dm = player.l8.darkMatter.max(1);
						let eroSpeed = dm.pow(hasUpgradeCharged("l1",15)?0.4:0.75);
						if(player.l8.voidMatter.gt(0)) eroSpeed = eroSpeed.add(player.l8.voidMatter.mul(2.5));
						return '当前暗物质：<h2 style="color: purple">' + format(player.l8.darkMatter) + '</h2>，本质获取x<code style="color: purple">' + format(dm.mul(player.l8.voidMatter.gt(0) ? player.l8.voidMatter.pow(0.3) : 1)) + '</code>，黑洞质量x<code style="color: purple">' + format(dm.pow(0.2)) + '</code>，侵蚀时间增速x<code style="color: purple">' + format(eroSpeed) + '</code>。';
					}],
					['display-text', function() {
						if(player.l8.bhLevel.gte(250))
						{
							return '黑洞暴涨：每' + format(tmp.l8.bhBoomCDSecond) + '秒可以进行一次，让黑洞立即增长' + format(tmp.l8.bhBoomEffect) + '秒的产量。';
						}
						else if(player.l8.bhLevel.gte(150))
						{
							return '达到黑洞等级250级后，解锁黑洞暴涨。';
						}
						return '';
					}],
					['display-text', function() {
						if(player.l8.bhLevel.gte(600))
						{
							return '真空湍流：每' + format(tmp.l8.bhTerbulenceCDSecond) + '秒可以进行一次，让本质立即增长' + format(tmp.l8.bhTerbulenceEffect) + '秒的产量。';
						}
						else if(player.l8.bhLevel.gte(400))
						{
							return '达到黑洞等级600级后，解锁真空湍流。';
						}
						return '';
					}],
					['display-text', '黑洞等级达到600级后，将随等级逐渐降低黑洞暴涨的冷却。'],
					['display-text', function() { return player.l8.bhLevel.gte(600) ? '黑洞等级达到700级后，将随等级逐渐降低真空湍流的冷却。' : '';}],
					['display-text', function() {
						if(!player.l8.bhLevel.gte(2000)) return '黑洞等级达到2000级后，将增幅暗物质和虚空物质获取。';
						return '黑洞等级增幅暗物质获取x<h2 style="color: gold">' + format(layers.l8.bhDmLevelBoost()) + '</h2>，虚空物质获取x<h2 style="color: gold">' + format(layers.l8.bhVmLevelBoost()) + '</h2>。';
					}],
					['row', [['clickable', 'bhUp'], ['clickable', 'bhBoom'], ['clickable', 'bhTerbulence']]],
					['upgrades', [2, 3, 4]],
					['clickable', 'bhDark'],
					['clickable', 'bhVoid'],
				],
				unlocked() {
					return hasUpgrade('l8', 14);
				},
			},
		},
		unity: {
			'统一盒子': {
				content: [
					['display-text', function() {return '使用统一点数来购买统一盒子。它们对之前的层级产生提升！';}],
					['microtabs', 'unityBox'],
					['display-text', function() {return '<br /><br /><br />';}],
				],
				buttonStyle() {return {'border-color': 'orange'};},
			},
			'里程碑': {
				content: [
					['display-text', function() {return '当前统一盒子总等级为<h1 style="color: orange">' + format(tmp.l8.uBTL, 0) + '</h1>'}],
					['milestones', [0, 1, 2, 3, 4, 5, 6, 9, 10, 11, 18, 24, 29, 31, 32]],
				],
				buttonStyle() {return {'border-color': 'orange'};},
			},
		},
		unityBox: {
			'点数': {
				content: [
					['buyables', [100, 101, 102]],
				],
				buttonStyle() {return {'border-color': 'orange'};},
			},
			'数据': {
				content: [
					['buyables', [103, 104, 105]],
				],
				buttonStyle() {return {'border-color': 'white'};},
			},
			'转生点数': {
				content: [
					['buyables', [106, 107, 108]],
				],
				buttonStyle() {return {'border-color': 'rgb(255, 0, 195)'};},
			},
			'致密点数': {
				content: [
					['buyables', [109, 110]],
				],
				buttonStyle() {return {'border-color': 'rgb(0, 210, 224)'};},
			},
			'攻击力': {
				content: [
					['buyables', [111, 112]],
				],
				buttonStyle() {return {'border-color': 'rgb(255, 153, 17)'};},
			},
			'飞升点数': {
				content: [
					['buyables', [113, 114]],
				],
				buttonStyle() {return {'border-color': 'rgb(255, 255, 0)'};},
			},
			'遗迹': {
				content: [
					['buyables', [115]],
				],
				buttonStyle() {return {'border-color': '#006903'};},
			},
			'中子素尘埃': {
				content: [
					['buyables', [116]],
				],
				buttonStyle() {return {'border-color': '#5a5a5a'};},
			},
		},
		bioalchemy: {
			'研习': {
				content: [
					['display-text', function() {return '研习理论知识。达到探索者I后，将解锁生物炼金。';}],
					['display-text', function() {return '当前等级：<h2>' + tmp.l8.baLevelName + '</h2>，经验值倍率：x' + format(tmp.l8.baExpMult);}],
					['display-text', function() {return '生物炼金等级令你对Loader3229造成伤害的作用速度提升到<h3 style="color: orange">' + tmp.l8.baLevelEffect + '</h3>倍'}],
					['display-text', function() {return '剩余时间：' + (player.l8.baTime > 0 ? (player.l8.baTime - Date.now()) / 1000 + '秒' : '0')}],
					['bar', 'study'],
					['clickable', 'study1'],
					['clickable', 'study2'],
					['clickable', 'study3'],
				],
				buttonStyle() {return {'border-color': 'lightgreen'};},
			},
			'炼金': {
				content: [
					['display-text', function() {return '获得对应炼金感悟后，可以执行炼金挑战。';}],
					['display-text', function() {return '挑战开始后，loader3229将大幅增强，你执行一次本质重置。'}],
					['display-text', function() {return '在炼金挑战中击败更高等级的loader3229以获得经验值加成。'}],
					['display-text', function() {return '<h3 style="color: orange">挑战总完成次数令普通本质重置中的基础loader3229等级为' + tmp.l8.basicLoaderLevel + '级。</h3>'}],
					['display-text', function() {if(hasUpgrade('l8', 133)) return '<h3 style="color: red">挑战总完成次数令本质获取x' + format(tmp.l8.baCeff2) + '</h3>'; else return ''}],
					['display-text', function() {return '<h4 style="color: red">挑战4~6于e1.000e10点数解锁，挑战7~9于e4.800e13点数解锁。</h4>'}],
					['row', [
						['clickable', 'baCS1'],['clickable', 'baCS2'],['clickable', 'baCS3'],
						['clickable', 'baCS4'],['clickable', 'baCS5'],['clickable', 'baCS6'],
						['clickable', 'baCS7'],['clickable', 'baCS8'],['clickable', 'baCS9'],
					]],
					['challenges', [1, 2, 3]],
				],
				buttonStyle() {return {'border-color': 'lightgreen'};},
				unlocked() {
					return player.l8.baLevel >= 3;
				},
			},
		},
		brick: {
			'升级': {
				content: [
					['microtabs', 'brickUpgrade'],
				],
				buttonStyle() {return {'border-color': 'brown'}},
			},
			'维度': {
				content: [
					['display-text', function(){
						if(!tmp.l8.brickDimUnlocked) return '达到100砖解锁';
						return `你有 <h2 style="color: brown">${format(player.l8.brick.energy)}</h2> 砖能量
						，它以 <h3 style="color: brown">^${format(tmp.l8.brickEnergyRate)}</h3> 提升了
						本征维度 <h3 style="color: brown">x${format(tmp.l8.brickEnergyEffect)}
						</h3> 且让本征维度产量软上限效果 <h3 style="color: brown">÷${format(tmp.l8.brickEnergyEffect2)}</h3>`;
					}],
					...brickDimInit(),
				],
				buttonStyle() {return {'border-color': 'brown'}},
			},
		},
		brickUpgrade: {
			'层级1': {
				content: [
					['display-text', function() { return `层级2将于 <h3 style="color: brown">${format(5e7)}</h3> 总砖解锁`; }],
					['upgrades', [7, 8, 9, 10, 11]],
				],
				buttonStyle() {return {'border-color': 'brown'}}, 
			},
			'层级2': {
				content: [
					['upgrades', [12, 13, 14, 15, 16]],
				],
				buttonStyle() {return {'border-color': 'brown', 'color': 'cyan'}},
				unlocked() {return player.l8.brick.value.gte(5e7);},
			},
		},
		erosion: {
			'状态': {
				content: [
					['display-text', function() {return '<h3 style="color: rgb(128, 0, 64)">侵蚀状态</h3>';}],
					['display-text', function() {
						let s = '<table><tbody>';
						let name = ['数据', '转生点数', '致密点数', '攻击力', '飞升精华', '遗迹', '中子素尘埃'];
						let start = ['e1.5e10', 'e7.5e9', 'ee9', 'ee8', 'ee6', '30', 'ee4'];
						let color = ['white', 'rgb(255, 0, 195)', 'rgb(0, 210, 224)', 'rgb(255, 153, 17)', 'rgb(255, 255, 0)', '#006903', '#5a5a5a'];
						for(let i = 0;i < 7;i++)
						{
							s += `<tr><td style="width: 125px"><span style="color: ${color[i]}; text-shadow: 0px 0px 5px">${name[i]}侵蚀<br>(${format(player.l8.erosion.time[i], 1)}s)</span></td>`;
							s += `<td style="width: 200px; color: ${player.l8.erosion.run[i] ? 'purple' : 'green'}">${player.l8.voidShaped ? '虚空常驻生效' : '触发于 ' + format(start[i])}<br>`;
							if(player.l8.erosion.run[i]) s += player.l8.voidShaped ? '无周期重置</td>' : `循环重置于${format(player.l8.erosion.lastCycle[i], 1)}s/${format(layers.l8.erosionInterval(i), 1)}s</td>`;
							s += `<td style="width: 200px">当前产能指数^<span style="color: ${player.l8.erosion.run[i] ? 'red' : 'green'}">${format(layers.l8.erosionEff(i))}</span></td></tr>`;
						}
						s += '</table></tbody>';
						return s;
					}],
					['display-text', function() {return `请注意,有些资源对点数获取至关重要.....`;}],
				],
				buttonStyle() {return {'border-color': 'purple'};},
			},
			'虚空': {
				content: [
					['display-text', function() {
						let vm = player.l8.voidMatter.max(0);
						let ero = vm.gt(0) ? '+' + format(vm.mul(hasUpgrade("l8",183)?1:2.5)) : '+0';
						return '当前虚空物质：<h2 style="color: dimgray">' + format(vm) + '</h2>，黑洞质量和本质x<code style="color: dimgray">' + format(vm.pow(1.5)) + '</code>，暗物质倍率x<code style="color: dimgray">' + format(vm.pow(0.3)) + '</code>，侵蚀时间增速<code style="color: dimgray">' + ero + '</code>。';
					}],
					['upgrades', [18]],
					['clickable', 'bhVoid'],
					['clickable', 'voidShape'],
				],
				unlocked() { return player.l8.voidMatter.gt(0) || player.l8.voidShaped; },
				buttonStyle() {return {'border-color': 'dimgray', 'color': 'dimgray'};},
			},
		},
		sky: {
			'里程碑': {
				content: [
					['milestones', [7, 8, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 25, 26, 27, 28, 30]],
				],
				buttonStyle() {return {'border-color': 'white', 'box-shadow': '0px 0px 30px 10px #bbb, 0px 0px 20px 10px #ddd, 0px 0px 10px 10px white'}},
			},
			'购买项': {
				content: [
					['buyables', [5, 6]],
				],
				buttonStyle() {return {'border-color': 'white', 'box-shadow': '0px 0px 30px 10px #bbb, 0px 0px 20px 10px #ddd, 0px 0px 10px 10px white'}},
			},
		},
	},
    tabFormat: {
        '主页': {
            content: [['infobox', 'introBox'],
                'main-display',
                'prestige-button',
                'resource-display',
                'blank',
				['clickable', 'hold'],
				['upgrades', [1, 17]],
				['microtabs', 'main'],
            ],
        },
		'统一': {
			content: [['infobox', 'introBoxUnity'],
				['display-text', function() {return '你有 <h2 style="color: orange; text-shadow: 0px 0px 2px orange">' + format(player.l8.unityPoints) + '</h2> 统一点数';}],
				['display-text', function() {return '统一重置会消耗全部本质。首次统一重置额外+2统一点数。<br /><br />'}],
				['clickable', 'uR'],
				['microtabs', 'unity'],
			],
			unlocked() {
				return hasUpgrade('l8', 13);
			},
			buttonStyle() {return {'border-color': 'orange'};},
		},
		'生物炼金': {
			content: [['infobox', 'introBoxBioalchemy'],
				['microtabs', 'bioalchemy'],
			],
			unlocked() {
				return hasUpgrade('l8', 15);
			},
			buttonStyle() {return {'border-color': 'lightgreen'};},
		},
		'砖': {
			content: [['infobox', 'introBoxBrick'],
				['display-text', function() {
				if(player.l8.brick.unlocked) return `你有 <h2 style="color: brown; text-shadow: 0px 0px 2px brown">${format(player.l8.brick.valid, 2)}/${format(player.l8.brick.value, 2)}</h2> 砖，让本质基础值第一因子^${format(tmp.l8.brickEff)}`;
					return '砖层将于20000本质解锁';
				}],
				['display-text', function() {
					if(player.l8.brick.unlocked) return '制砖将会重置本质、本征维度内容、点数购买项、中子素块并附加一次本质重置。<br><span style="color: pink">制砖将重置侵蚀。当存在侵蚀被触发时，可以无条件重置。</span>';
					return '';
				}],
				['clickable', 'bR'],
				['microtabs', 'brick'],
			],
			unlocked() {
				return hasMilestone('l8', 23);
			},
			buttonStyle() {return {'border-color': 'brown'};},
		},
		'侵蚀': {
			content: [['infobox', 'introBoxErosion'],
				['microtabs', 'erosion'],
			],
			unlocked() {
				// 成形后侵蚀转为常驻生效，但“虚空”页里的成形状态仍需可见
				return hasMilestone('l8', 23) || player.l8.voidShaped;
			},
			buttonStyle() {return {'border-color': 'purple'};},
		},
		'???': {
			content: [['infobox', 'introBoxSky'],
				['microtabs', 'sky'],
			],
			unlocked() {
				return hasMilestone('l8', 6);
			},
			buttonStyle() {return {'border-color': 'white', 'box-shadow': '0px 0px 5px white'}},
		},
    },
    layerShown() { return hasAchievement('AC', 26) },
    autoUpgrade() { return false },
    doReset(resettingLayer) {
        let keep = [], km = [];
		let p = n(0);
		if(hasMilestone('l8', 2)) km.push(0, 2, 6, 7, 8, 11);
        if(!hasMilestone('l8', 16)) layerDataReset("l7", keep, km);
		km = [];
		if(player.l8.voidShaped) keep.push("upgrades")
        layerDataReset("l6", keep);
        layerDataReset("l5", keep);
		keep = [], km = [];
		if(player.l8.voidShaped) keep.push("upgrades")
		if(hasMilestone('l8', 0)) km.push(3, 5, 6, 7, 8);
		if(hasMilestone('l8', 1)) km.push(9, 10, 11, 12, 14, 15, 19);
		if(hasMilestone('l8', 6)) keep.push('milestones');
        layerDataReset("l4", keep, km);
		km = [], keep = [];
		if(player.l8.voidShaped) keep.push("upgrades")
		if(hasMilestone('l8', 10)) keep.push('milestones');
        layerDataReset("l3", keep);
		keep = [];
		if(player.l8.voidShaped) keep.push("upgrades")
		if(hasMilestone('l8', 0)) keep.push('milestones');
        layerDataReset("l2", keep);
		keep = [];
		if(player.l8.voidShaped) keep.push("upgrades")
        layerDataReset("l1", keep);
    },
})
})();