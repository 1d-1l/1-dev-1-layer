(()=>{
const voiddataupg = {
    cost: n(1),
	color: 'white',
	background: 'black',
	canAfford() {
		return player.l1.voidMine.gte(this.cost)
	},
	pay() {
		player.l1.voidMine = player.l1.voidMine.sub(this.cost);
	},
	style() {
		return {
			'border-radius': '0px',
			'border': hasUpgrade(this.layer, this.id) ? '2px solid ' + this.color : '1px solid grey',
			'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 5px 4px ' + this.background : '0px 0px 2px 2px ' + this.background,
			'background': hasUpgrade(this.layer, this.id) ? this.backgroundImage !== undefined ? this.backgroundImage : this.background : (this.canAfford() ? 'white' : null),
			'color': hasUpgrade(this.layer, this.id) ? this.color : (this.canAfford() ? 'black' : null),
			'height': '125px',
			'width': '125px',
			'transform': 'scale(0.85)',
			'font-size': '12px',
		};
	},
	currencyDisplayName: '虚空矿石',
}
// 自动采集效率：初始 10%，自动化MK.II~V 分别为 25% / 50% / 75% / 100%
function voidMineEfficiency() {
	if(hasUpgrade("l2",225)) return 1
	if(hasUpgrade("l2",224)) return 0.75
	if(hasUpgrade("l2",223)) return 0.5
	if(hasUpgrade("l2",222)) return 0.25
	if(hasUpgrade("l1",65)) return 1
	if(hasUpgrade("l1",64)) return 0.75
	if(hasUpgrade("l1",63)) return 0.5
	if(hasUpgrade("l1",62)) return 0.25
	return 0.1
}
function hasRefiner(id) {
	return hasUpgrade("l1", id) || hasUpgrade("l2", id + 160)
}
function refiner53Effect() {
	return player.l1.voidMine.add(1).log10().add(10).log10().max(1)
}
// 丢次采集的完整结算（手动单次自动共用）
// yieldMult：自动采集时按效率折算产量，手动为 1
function voidMineOnce(yieldMult = 1) {
	if(!hasUpgrade("l1",31)) return false
	if(chooseWeightInArray([[1,player.l1.minechance],[0,100-(player.l1.minechance)]])){
		let g = n(1)
		if(hasUpgrade("l1",44)||hasUpgrade("l2",204)) g = g.div(Math.min(player.l1.minechance/100,1))
		if(hasUpgrade("l1",32)) g = g.mul(upgradeEffect("l1",32))
		if(hasRefiner(52)) g = g.mul(player.l1.datamine.pow((hasUpgrade("l1",62)||hasUpgrade("l2",222))?3:1))
		if(hasUpgrade("l1",73)&&!hasUpgrade("l2",233)) g = g.mul(upgradeEffect("l1",73))
		if(hasUpgrade("l2",233)) g = g.mul(upgradeEffect("l2",233))
		if(hasRefiner(53)) g = g.pow(refiner53Effect())
		if(hasUpgrade("l1",34)) g = g.pow(1.25)
		if(hasUpgrade("l1",35)) g = g.pow(1.5)
		if(hasUpgrade("l2",91)) g = g.pow(buyableEffect("l2",21)[1])
		// 核心虚空增益I：虚空矿石获取?1+核心等级)，不受常的核心增益I影响
		if(player.l8.voidShaped) g = g.mul(getBuyableAmount("l2", 11).add(1))
		// 虚空共鸣（L2 buyable 31）：虚空矿石获取×2^等级
		if(player.l8.voidShaped && layers.l2) g = g.mul(buyableEffect('l2', 31))
		if(yieldMult !== 1) g = g.mul(yieldMult)
		// 擢升器：每次采集为虚空矿石获取率累加×+
		let ascend = layers.l1.ascendIncrement()
		if(ascend > 0){
			player.l1.ascendBoost = player.l1.ascendBoost.add(ascend)
			let ascendMult = (player.l8.voidShaped && layers.l2) ? buyableEffect('l2', 33) : n(1)
			g = g.mul(player.l1.ascendBoost.mul(ascendMult))
		}
		player.l1.voidMine = player.l1.voidMine.add(g)
		let mkviChance = 10
		if(hasUpgrade("l1",63)||hasUpgrade("l2",223)) mkviChance = 100
		if((hasUpgrade("l1",45)||hasUpgrade("l2",205))&&chooseWeightInArray([[1,mkviChance],[0,100-mkviChance]])){
			addPoints("l1", tmp.l1.resetGain.mul(hasUpgrade("l2",205)?0.15:0.1))
		}
		// 共鸣器：自动复读一部分冲击效果，不消耗虚空矿石
		let resonance = layers.l1.resonanceFraction()
		if(resonance > 0){
			let echo = layers.l1.impactGain().mul(resonance)
			if(echo.gt(0)) player.l1.datamine = player.l1.datamine.add(echo)
		}
	}
	let k = 10
	if(hasRefiner(52)) k = 60
	if(hasRefiner(55)) k = Math.max(k, 50)
	if(hasUpgrade("l2",203)) k += 15
	if((hasUpgrade("l1",43)||hasUpgrade("l2",203))&&chooseWeightInArray([[1,k],[0,100-k]])){
		player.l1.datadupe = player.l1.datadupe.add(player.l1.datamine.times(hasUpgrade("l2",93)?buyableEffect("l2",21)[4]:1))
		if((hasUpgrade("l1",74)||hasUpgrade("l2",234)) && chooseWeightInArray([[1,5],[0,95]])){
			player.l1.datadupe = player.l1.datadupe.add(player.l1.datamine.times(199))
		}
	}
	return true
}
addLayer("l1", {
    infoboxes: {
        introBox: {
            title: "一人做一层 1 Dev 1 Layer",
            body() { return "欢迎游玩游戏，本游戏特色为每一层都是一个人制作而成，且每15层不会出现相同的作者，这意味着你可以玩到很多不同的风格<br>本层由 aCwAtLe308 制作！<br>欢迎加交流群：657445803" },
        },
    },
    tabFormat: {
        "主页": {
            content: [["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "resource-display",
                ["upgrades",[1,2,3]],
            ],
        },
        "复制器": {
            content: [
                "main-display", "blank",
                ["display-text", function () { return "<h3>你有" + format(n(2).pow(player.l1.repl)) + "复制器 (x" + format(n(2).pow(tmp.l1.replGain)) + "/s)</h3>" + (player.l1.repl.gte(10) ? "<br><p style=\"color:yellow;\">由于复制器溢出，你的复制器增长被开" + format(tmp.l1.replBaseGain.div(tmp.l1.replGain)) + "次根！" : "") + (player.l1.repl.gte(5e5) ? "<br><p style=\"color:orange;\">由于复制器溢出^2，你的复制器增长更慢了！" : "") + (player.l1.repl.gte('ee100') ? "<br><p style=\"color:red;\">由于复制器溢出^3，你的复制器增长更慢了！" : "") }],
                "blank",
                ["display-text", function () { return "<h4>复制器效果: </h4>"; }],
                "blank",
                ["display-text", function () { return hasUpgrade('l1', 12) ? "1. 点数获取x" + format(tmp.l1.replEff1) : ""; }],
                ["display-text", function () { return hasUpgrade('l1', 14) ? "2. 数据获取x" + format(tmp.l1.replEff2) : ""; }],
                ["display-text", function () { return hasUpgrade('l2', 13) ? "3. 复制器溢出开始延后x" + format(tmp.l1.replEff3) : ""; }],
                ["display-text", function () { return hasMilestone('l4', 2) ? "4. 对loader3229造成的伤害x" + format(tmp.l1.replEff4) : ""; }],
                ["display-text", function () { return hasMilestone('l4', 25) ? "5. 奇点获取x" + format(tmp.l1.replEff5) : ""; }],
            ],
            unlocked() { return hasUpgrade('l1', 12) }
        },
        "虚空采集器": {
            content: [
                "main-display", "blank",
                ["display-text", function () { return `你有 <h2 class="voidResource">${format(player.l1.voidMine)}</h2> 虚空矿石<br>`}],
                ["display-text", function () { return (player.l8.voidShaped ? `数据侵蚀已常驻生效:<b style="color:purple">无周期重置</b><br>` : `当前数据侵蚀剩余时间:<b style="color:purple">${format(run(layers.l8.erosionInterval(0)).sub(player.l8.erosion.lastCycle[0]).max(0))}</b><br>`)+`从现在开始,推荐单页面游玩` }],
                ["display-text", function () { return (hasUpgrade("l1",43)||hasUpgrade("l2",203))?`每次获得采集器MK.IV加成使数据获取^${format(player.l1.datamine.pow_base(2))},折算^2次数为${format(player.l1.datadupe)},共计^${format(layers.l1.getdupe())}(超过2^${layers.l1.dupeSoftcapStart()}后有软上限)`:`` }],
                ["display-text", function () { return `擢升效果：×${format(player.l1.ascendBoost ?? 1)}` }],
                "blank",
                ['bar', 'mineBar'],
                "blank",
                ['clickables',[1,2]],
                "blank",
                ['upgrades',[4,5,6,7,8,9]]
            ],
            unlocked() { return hasUpgrade('l1', 31) }
        },
    },
    name: "第一层 制作：[author]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "\\/", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            repl: new Decimal(0),
            resetTime: n(0),
            voidMine: n(0),
            minechance: 10,
            datadupe: n(0),
            datamine: n(1),
            softcaplv1: n(0),
            mining: false,
            mineTimer: n(0),
            ascendBoost: n(1),
            resonanceJump: 0,
            autoReset: false,
            autoImpact: false,
            impactTimer: n(0),
        }
    },
    sPExp() {
        let base = n(0);
        if (hasUpgrade('l3', 33)) base = base.add(upgradeEffect('l3', 33));
        return base;
    },
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone("l2", 2)) keep.push("repl")
        if (hasMilestone("l2", 5)) keep.push("points")
        if (hasMilestone("l4", 5)) keep.push("upgrades")
        if (player.l1.autoReset) keep.push("autoReset")
        if (player.l1.autoImpact) keep.push("autoImpact")
        if (layers[resettingLayer].row > this.row) layerDataReset("l1", keep)
    },
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "数据", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1 / 3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('l1', 13)) mult = mult.mul(upgradeEffect('l1', 13))
        if (hasUpgrade("l1", 21)) mult = mult.mul(upgradeEffect("l1", 21))
        mult = mult.mul(tmp.l1.replEff2)
        if (hasUpgrade("l2", 11)) mult = mult.mul(upgradeEffect("l2", 11))
        if (hasUpgrade("l2", 12)) mult = mult.mul(upgradeEffect("l2", 12))
        if (hasUpgrade('l3', 12)) mult = mult.mul(upgradeEffect('l3', 12));
        if (hasMilestone('l4', 1)) mult = mult.mul(layers.l4.total_bars().add(1));
        if (hasUpgrade('l4', 22)) mult = mult.mul(upgradeEffect('l4', 22));
        if (hasUpgrade('l4', 16)) mult = mult.mul(buyableEffect('l4', 31));
        if(player.l7.neff1[2]) mult = mult.mul(player.l7.ncalc1[2])
		mult = mult.mul(buyableEffect('l8', 1031));
	
		if(mult.gte('e4e8')) mult = mult.log10().div(4e7).sub(9).pow(0.8).add(9).mul(4e7).pow_base(10);
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let base = new Decimal(1);
        if (hasUpgrade('l3', 43)) base = base.mul(upgradeEffect('l3', 43));
		if(hasUpgradeCharged('l1', 13)) base = base.mul(run(layers.l1.upgrades[13].charged.effect, layers.l1.upgrades[13]));
        if (hasUpgrade('l6', 93)) base = base.mul(upgradeEffect('l6', 93));
        if(hasUpgrade("l1",43)||hasUpgrade("l2",203)) base = base.mul(layers.l1.getdupe())
        if (player.l7.neff3[1]) base = base.mul(player.l7.ncalc3[1])
        if (inChallenge("l5", 12)) base = base.mul(0.1)
        if (inChallenge("l6", 11)) base = base.mul(layers.l6.challenges[11].dPower())
        if (inChallenge("l5", 32)) base = base.mul(0.001)
	
		if(hasUpgrade('l8', 11)) base = base.mul(player.l8.tuning[1].div(10));
		base = base.mul(buyableEffect('l8', 1032));
		base = base.mul(buyableEffect('l8', 1033));
		base = base.mul(buyableEffect('l8', 1085));
		base = base.mul(buyableEffect('l8', 51));
		
		return base;
    },
	getGainBeforeErosionSoftcap() {
		let layer = 'l1';
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).mul(tmp[layer].gainMult).pow(tmp[layer].gainExp)
		if (gain.gte(tmp[layer].softcap)) gain = gain.pow(tmp[layer].softcapPower).mul(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower)))
		gain = gain.mul(tmp[layer].directMult)
		if(player.l8.erosion.run[0]) gain = gain.max(1).log10().pow(layers.l8.erosionEff(0)).pow_base(10);
        //33号升级：数据获取在侵蚢之后^1.5
        if(hasUpgrade("l1",33)) gain = gain.pow(1.5)
        if(hasUpgrade("l1",53) && !hasUpgrade("l2",213)) gain = gain.pow(2)
        return gain
	},
	getResetGain() {
		let gain = layers.l1.getGainBeforeErosionSoftcap()
        // 谐振跃迁：永久弱化数据软上限（不改库存）
        if(player.l1.resonanceJump > 0 && gain.gte(1e100)){
            let p = [0, 1e5, 2e5, 5e5, 1e6][player.l1.resonanceJump]
            gain = gain.div(1e100).max(1).log10().pow(p).mul(1e100)
        }
        //侵蚀软上限
        else if(player.l8.voidShaped && gain.gte(1e100)) gain = gain.div(1e100).max(1).log10().pow(gain.pow(gain.max(10).log10().max(10).log10().max(10).log10().max(1).pow_base(2)).max(10).log10().max(10).log10().pow(0.2).max(0).pow_base(0.3)).pow_base(10).times(1e100);
        // 协同机MK.V：侵蚀之后，基于虚空矿石提高转生点数
        // 已移?layer2 ?getResetGain()
        // 核心虚空增益II：虚空成形后，数据在侵蚀之后×2^核心等级
        if(layers.l2 && layers.l2.coreVoidGain2) gain = gain.mul(layers.l2.coreVoidGain2())
        // 数据回响（l2-2）：数据在侵蚢之后×(1+核心等级)
        if(layers.l2 && layers.l2.coreEchoData) gain = gain.mul(layers.l2.coreEchoData())
        // 数据层自动化里程碑：数据获取 ×10
        if(player.l8.voidShaped && hasMilestone('l2', 6)) gain = gain.mul(10)
        // 固化精炼器MK.III：数据获取^2，放在侵蚢软上限之?
        if(hasUpgrade("l2",213)) gain = gain.pow(2)
        // 固化协同机MK.I：对侵蚀之后的数据有?
        if(hasUpgrade("l2",231)) gain = gain.pow(upgradeEffect("l2",231))
		return gain.floor().max(0);
	},
	erosionSoftcapActive() {
		return player.l8.voidShaped && layers.l1.getGainBeforeErosionSoftcap().gte(1e100)
	},
	mainDisplayNote() {
		if(!layers.l1.erosionSoftcapActive()) return ''
		return '<br><span style="color: black; text-shadow: 0 0 6px white, 0 0 12px white, 0 0 18px white;">当前已触发额外侵蚀软上限</span>'
	},
    passiveGeneration() {
        let mult = 0
        if (hasMilestone("l2", 4)) mult = 0.2
        if (hasMilestone("l2", 5)) mult = 2
        if (hasMilestone("l4", 3)) mult = 1000
        return mult
    },
    replBaseGain() {
        let a = n(1)
        // 虚空成形后核心增益I改为核心虚空增益I，不再提供复制器加成
        if (!player.l8.voidShaped) a = a.times(buyableEffect("l2", 11)[0])
        if (hasUpgrade("l2", 51)) a = a.times(2)
        if (hasUpgrade('l3', 21)) a = a.mul(upgradeEffect('l3', 21));
        if (hasUpgrade('l3', 54)) a = a.mul(2);
        if (hasUpgrade('l4', 46)) a = a.mul(buyableEffect('l4', 41));
        if (hasUpgrade('l4', 62)) a = a.mul(upgradeEffect('l4', 62));
		a = a.mul(buyableEffect('l8', 1051));
		return a
    },
    newRepl(diff) {
        if (inChallenge('l5', 11)) return n(0)
        if (inChallenge('l6', 11)) return n(0)
        let a = player.l1.repl;
        let st = n(10), str = n(1 / 0.8);
        st = Decimal.pow(2, st).times(tmp.l1.replEff3).log2();
        if (hasUpgrade('l3', 22)) st = st.mul(upgradeEffect('l3', 22));
        if (hasUpgrade('l3', 23)) str = str.pow(upgradeEffect('l3', 23));
        let str2 = n(1 / 0.1);
        if (hasUpgrade('l3', 72)) str2 = str2.pow(upgradeEffect('l3', 72));
        a = a.overflow('ee100', 2)
        if (hasMilestone("l4", 4)) {
            if (a.gte(layers.l1.replEff3().log2().add(5e5)) && !hasMilestone('l4', 29)) a = a.div(layers.l1.replEff3().log2().add(5e5)).pow(str2).mul(layers.l1.replEff3().log2().add(5e5));
        } else {
            if (a.gte(5e5)) a = a.div(5e5).pow(str2).mul(5e5);
            if (a.gte(st)) a = a.div(st).pow(str).mul(st);
        }
        //挑战效果在软上限前面
        if (inChallenge('l3', 11)) a = Decimal.pow(10, a.add(10).log10().root(layers.l3.challenges[11].dPower())).sub(10);
        a = a.add(tmp.l1.replBaseGain.mul(diff))
        if (inChallenge('l3', 11)) a = Decimal.pow(10, a.add(10).log10().pow(layers.l3.challenges[11].dPower())).sub(10);
        a = a.overflow('ee100', 0.5)
        if (hasMilestone("l4", 4)) {
            if (a.gte(layers.l1.replEff3().log2().add(5e5)) && !hasMilestone('l4', 29)) a = a.div(layers.l1.replEff3().log2().add(5e5)).root(str2).mul(layers.l1.replEff3().log2().add(5e5));
        } else {
            if (a.gte(st)) a = a.div(st).root(str).mul(st)
            if (a.gte(5e5)) a = a.div(5e5).root(str2).mul(5e5)
        }

        return a
    },
    replGain() {
        let a = layers.l1.newRepl(1).sub(player.l1.repl);
        return a
    },
    replEff1() {
        if (!hasUpgrade('l1', 12)) return n(1)
        if (hasUpgrade('l4', 34)) {
            let a = player.l1.repl.pow(0.6).add(1).pow(hasUpgrade('l2', 71) ? upgradeEffect('l2', 71) : 1);
            if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
            if (a.gte("ee750000")) a = a.div("ee750000").log10().pow(0.5).pow_base(10).mul('ee750000');
            return a;
        }
        let a = player.l1.repl.pow(0.65).add(1)
        if (hasUpgrade("l2", 31)) a = player.l1.repl.pow(a).add(1).ln().pow(1.5).add(1)
        a = a.min(1e50)
        if (hasUpgrade('l2', 71)) a = a.pow(upgradeEffect('l2', 71));
		a = a.pow(buyableEffect('l8', 1012));
		if (a.gte(1e5)) a = a.div(1e5).pow(0.35).mul(1e5)
        if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
        return a
    },
    replEff2() {
        if (!hasUpgrade('l1', 14)) return n(1)
        let a = player.l1.repl.div(50).max(1).pow(1.35).add(1)
        if (hasUpgrade("l2", 15)) a = a.pow(upgradeEffect("l2", 15))
		a = a.pow(buyableEffect('l8', 1042));	
		if (a.gte(100)) a = a.div(100).pow(0.55).mul(100)
        if (a.gte(1e7)) a = a.div(1e7).pow(0.35).mul(1e7)
        if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
        if (a.gte('1e500')) a = a.pow(0.1).mul('1e450')
        return a//.overflow('ee100', 0.5)
    },
    replEff3() {
        if (!hasUpgrade("l2", 13)) return n(1)
        if (hasMilestone("l4", 4)) {
            let base = Decimal.pow(2, player.l1.repl.div(1000));
			if(hasUpgrade('l8', 1052)) base = base.pow(upgradeEffect('l8', 1052));
			return base;
        }
        let a = Decimal.pow(100, player.l1.repl.div(40)).add(1)
		a = a.pow(buyableEffect('l8', 1052));
		if (a.gte(1e20)) a = a.div(1e10).pow(0.75).mul(1e20)
        if (a.gte(1e80)) a = a.div(1e20).pow(0.5).mul(1e80)
        return a
    },
    replEff4() {
        if (!hasMilestone("l4", 2)) return n(1)
        let a = player.l1.repl.add(1).pow(0.5);
        return a.min("e1e10")
    },
    replEff5() {
        if (!hasMilestone("l4", 25)) return n(1)
        let a = player.l1.repl.add(10).log10();
        return a
    },
    update(diff) {
		if(player.l8.baC.chal7doomed[0] > 0) return;
        if (hasUpgrade('l1', 12)) player.l1.repl = layers.l1.newRepl(diff);
        player.l1.resetTime = player.l1.resetTime.add((1 / 4) * diff)
        player.l1.minechance=layers.l1.calcminechance()
        // QoL：第二层转生后第丢层数据为 0 时，自动做一次第丢层重置，把主点数转成数据
        let autoQoL = player.l8.voidShaped && hasMilestone('l2', 6)
        if((autoQoL || (player.l8.voidShaped && hasUpgrade("l2", 4) && player.l1.autoReset)) && player.l1.points.lt(1) && player.points.gt(0) && canReset('l1')) doReset('l1')
        // QoL：自动采?+ 自动冲击（需要先在第二层购买对应协议?
        if(player.l8.voidShaped){
            if((autoQoL || (hasUpgrade("l2", 4) && player.l1.autoReset) || (hasUpgrade("l2", 5) && player.l1.autoImpact)) && !player.l1.mining) Vue.set(player.l1, "mining", true)
            player.l1.impactTimer = player.l1.impactTimer.sub(diff).max(0)
            if((autoQoL || (hasUpgrade("l2", 5) && player.l1.autoImpact)) && player.l1.impactTimer.lte(0) && layers.l1.autoImpactReady() && layers.l1.clickables[12].canClick()){
                layers.l1.clickables[12].onClick()
                player.l1.impactTimer = n(0.5)
            }
        }
        // 数据洪流（l2-26）：每秒获得 1e10% 重置数据
        if(hasUpgrade("l2",26)) addPoints("l1", tmp.l1.resetGain.mul(1e8).mul(diff))
        // 自动谐振（l2-36）：谐振跃迁解锁后自动完?
        if(player.l8.voidShaped && hasUpgrade("l2",36) && player.l1.resonanceJump < 4 && layers.l1.clickables[21].canClick()) layers.l1.clickables[21].onClick()
        // 自动采集：按当前自动采集速度结算，度越高间隔越短
        if(player.l1.mining)
        {
            let interval = layers.l1.autoMineInterval()
            player.l1.mineTimer = player.l1.mineTimer.add(diff)
            if(player.l1.mineTimer.gte(interval))
            {
                // 单帧朢多补?000次，避免离线回来卡死；余量留在计时器?
                let times = player.l1.mineTimer.div(interval).floor().min(3000)
                player.l1.mineTimer = player.l1.mineTimer.sub(times.mul(interval))
                for(let i = 0;i < times.toNumber();i++) voidMineOnce(voidMineEfficiency())
            }
        }
    },
    autoMineSpeed() {
        let speed = n(1)
        if(hasUpgrade("l1", 33)) speed = speed.mul(2)
        if(hasUpgrade("l1", 61)||hasUpgrade("l2", 221)) speed = speed.mul(2)
        if(hasUpgrade("l1", 83)&&!hasUpgrade("l2", 243)) speed = speed.mul(3)
  if(hasUpgrade("l2", 243)) speed = speed.mul(3)
        if(player.l8.voidShaped && hasUpgrade("l2", 202)) speed = speed.mul(4)
        return speed
    },
    ascendIncrement() {
        let base = 0
        if(hasUpgrade("l1", 85)||hasUpgrade("l2", 245)) base = 0.15
        else if(hasUpgrade("l1", 84)||hasUpgrade("l2", 244)) base = 0.1
        else if(hasUpgrade("l1", 83)||hasUpgrade("l2", 243)) base = 0.05
        else if(hasUpgrade("l1", 82)||hasUpgrade("l2", 242)) base = 0.01
        else if(hasUpgrade("l1", 81)||hasUpgrade("l2", 241)) base = 0.001
        const solidCount = [241,242,243,244,245].filter(id => hasUpgrade("l2", id)).length
        return n(base).mul(Decimal.pow(1.5, solidCount))
    },
    resonanceFraction() {
        if(hasUpgrade("l1", 95)) return 2
        if(hasUpgrade("l1", 94)) return 1
        if(hasUpgrade("l1", 93)) return 0.5
        if(hasUpgrade("l1", 92)) return 0.25
        if(hasUpgrade("l1", 91)) return 0.1
        return 0
    },
    autoImpactReady() {
        const ids = [41,42,43,44,45,51,52,53,54,55,61,62,63,64,65,71,72,73,74,75,81,82,83,84,85,91,92,93,94,95]
        return ids.every(id => hasUpgrade("l1", id))
    },
    frozenStyle(l1id, l2id) {
        if(l1id === undefined) return {}
        const bought = hasUpgrade("l1", l1id)
        const frozen = hasUpgrade("l2", l2id)
        const showBought = bought || frozen
        const afford = player.l1.voidMine.gte(layers.l1.upgrades[l1id].cost)
        const base = {
            'border-radius': '0px',
            'border': showBought ? '2px solid white' : '1px solid grey',
            'box-shadow': showBought ? '0px 0px 5px 4px black' : '0px 0px 2px 2px black',
            'height': '125px',
            'width': '125px',
            'transform': 'scale(0.85)',
            'font-size': '12px',
        }
        if(frozen) base['box-shadow'] = '0px 0px 5px 4px #ff00c3'
        if(!frozen) return {
            ...base,
            'background': bought ? 'black' : (afford ? 'white' : null),
            'color': bought ? 'white' : (afford ? 'black' : null),
        }
        return {
            ...base,
            'background': '#ff00c3',
            'color': 'white',
        }
    },
    autoMineInterval() {
        return n(1).div(layers.l1.autoMineSpeed())
    },
    calcminechance(){
        let m = 10
        if(hasUpgrade("l2",201)) m=25
        else if(hasUpgrade("l1",41)) m=20
        if(hasUpgrade("l2",202)) m=50
        else if(hasUpgrade("l1",42)) m=40
        if(hasRefiner(55)) m=70
        if(hasUpgrade("l1",65)||hasUpgrade("l2",225)) m=100
        if(hasUpgrade("l2",204)) m+=player.l1.points.add(1).log10().min(25).max(0).toNumber()
        else if(hasUpgrade("l1",44)) m+=upgradeEffect("l1",44).toNumber()
        if(player.l1.minechance>=100) return 100
        return m
    },
    calcDmineboost(){
        let b = n(4)
        b = b.times(player.l1.voidMine.div(1000).max(1).log10().pow(0.5).add(1))
        if(hasRefiner(54)) b = b.times(player.l1.datadupe.pow_base(2).add(10).log10().add(10).log10().max(1))
        if(hasUpgrade("l2",91)) b = b.times(buyableEffect("l2",21)[1])
        if(hasUpgrade("l2",91)) b = b.times(buyableEffect("l2",21)[1])//没重?不要?
        if(hasUpgrade("l2",102)) b = b.pow(1.2)
        b = b.div(player.l1.datamine)
        // 冲击效果整体开10次方根后再作为乘法系数使用
        b = b.root(10)
        return b
    },
    impactGain(){
        let gain = layers.l1.calcDmineboost().sub(1)
        if(hasUpgrade("l1",34)) gain = gain.mul(3)
        if(hasUpgrade("l1",72)&&!hasUpgrade("l2",232)) gain = gain.mul(upgradeEffect("l1",72))
        if(hasUpgrade("l2",232)) gain = gain.mul(upgradeEffect("l2",232))
        if(player.l8.voidShaped && layers.l2) gain = gain.mul(buyableEffect('l2', 32))
        if(player.l8.voidShaped && hasUpgrade("l2",91) && layers.l2) gain = gain.mul(buyableEffect('l2', 21)[2])
        if(player.l8.voidShaped && hasUpgrade("l2",92)) gain = gain.pow(1.25)
        return gain
    },
    dupeSoftcapStart(){
        return hasUpgrade("l1",35) ? 7332 : 3666
    },
    getdupe(){
            let cap = layers.l1.dupeSoftcapStart()
            if(player.l1.datadupe.gte(cap)){
                let base = n(2)
                base = base.root(player.l1.datadupe.sub(cap).add(1).pow(0.25))
                return Decimal.pow(2,cap).times(player.l1.datadupe.sub(cap).max(0).pow_base(base))
            }
            return Decimal.pow(2,player.l1.datadupe)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
{ key: "1", description: "1：进行第一层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    milestones: {
        0: {
            requirementDescription: "",
            effectDescription: "",
            done() { return false },
        },
    },
    upgrades: {
        11: {
            title: "重复了无数遍的开始",
            description: "数据增加点数获取。",
            effect() {
                if (!hasUpgrade('l1', 11)) return n(1)
                let eff = player.l1.points.add(1).pow(0.5).add(1)
                if (eff.gte(100) && !hasUpgrade("l4", 64)) eff = eff.div(100).pow(0.5).mul(100)
                if (eff.gte(1e66)) eff = eff.div(1e66).pow(0.125).mul(1e66)
                if (eff.gte('1e333')) eff = eff.div('1e333').pow(0.6).mul('1e333')
                if (hasUpgrade("l2", 14)) eff = eff.pow(3)
				eff = eff.pow(buyableEffect('l8', 1011));
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return true },
			charged: {
				text: '数据增加本质获取',
				cost: n(1e200),
				effect() {
					let eff = player.l1.points.add(1).ln().add(Math.E).ln();
					if(hasUpgradeCharged('l2', 14)) eff = eff.pow(3);
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        12: {
            title: "或许完全不同？",
            description: "解锁复制器。",
            cost: new Decimal(8),
            unlocked() { return hasUpgrade('l1', 11) },
			charged: {
				text: '复制器增加本质获取',
				cost: n(1e205),
				effect() {
					let eff = player.l1.repl.add(1).ln().add(1).ln().add(Math.E).ln();
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        13: {
            title: "又来了",
            description: "点数增加数据获取。",
            effect() {
                if (!hasUpgrade('l1', 13)) return n(1)
                let eff = player.points.add(1).pow(0.15).add(1)
                eff = eff.pow(buyableEffect('l8', 1034));
				if (eff.gte(100) && (!hasUpgrade("l2", 41))) eff = eff.div(100).pow(0.3).mul(100)
                if (eff.gte(1e13)) eff = eff.div(1e13).pow(hasUpgrade("l5", 21)? 0.25 : 0.125).mul(1e13)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(150),
            unlocked() { return hasUpgrade('l1', 12) },
			charged: {
				text: '点数增加数据获取',
				cost: n(1e210),
				effect() {
					let eff = player.points.add(1).ln().add(1).ln().div(10).add(1);
					if(hasUpgradeCharged('l2', 41)) eff = eff.mul(run(layers.l2.upgrades[41].charged.effect, layers.l2.upgrades[41]));
					return eff;
				},
				effectDescription() { return "^" + format(this.charged.effect()); },
			},
        },
        14: {
            title: "时间墙是这样的",
            description: "解锁复制器的第二个效果（大约1e15复制器开始）。",
            cost: new Decimal(700),
            unlocked() { return hasUpgrade('l1', 13) },
			charged: {
				text: '复制器的第二个效果增强（以第二效果的倍率增幅黑洞质量获取并延长所有侵蚀的循环时间）',
				cost: n(1e212),
				effect() {
					let x = tmp.l1.replEff2;
					let eff = x.ln().add(1).ln().div(30).add(1);
					if(hasUpgradeCharged('l2', 15)) eff = eff.pow(4);
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        15: {
            title: "就这内容吗？",
            description: "点数增加点数获取。",
            effect() {
                if (!hasUpgrade('l1', 15)) return n(1)
                let eff = player.points.add(1).pow(0.24).add(1)
                if (eff.gte(1e4) && !hasUpgrade("l2", 42)) eff = eff.div(1e4).pow(0.5).mul(1e4)
                if (eff.gte(1e32) && !hasUpgrade("l4", 42)) eff = eff.div(1e32).pow(0.16).mul(1e32)
                eff = eff.softcap('1e4000', 0.25)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade('l1', 14) },
			charged: {
				text: '点数增加砖维度倍率,并降低暗物质对侵蚀的加速作用',
				cost: n(1e214),
				effect() {
					let eff = player.points.add(1).ln().add(1).ln().add(1).ln().div(10).add(1);
					if(hasUpgradeCharged('l2', 42)) eff = eff.pow(run(layers.l2.upgrades[42].charged.effect, layers.l2.upgrades[42]));
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        16: {
            title: "另一个世界",
            description: "解锁下一层。",
            cost: new Decimal(2e4),
            unlocked() { return hasUpgrade('l1', 15) },
			charged: {
				text: '解锁第二层的升级充能',
				cost: n(1e235),
				effect() { return n(1); },
			},
        },
        21: {
            title: "递归",
            description: "数据增强自身获取",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(1)
                let b = upgradeEffect("l1", 22).add(0.2)
                let eff = player.l1.points.add(1).pow(b)
                eff = eff.pow(buyableEffect('l8', 1035));
				if (hasUpgrade("l4", 31)) {
                    if (eff.gte('1e500') && !hasUpgrade("l1", 16)) eff = eff.pow(0.5).mul(1e250)
                    if (eff.gte('1e1500')) eff = eff.pow(0.1).mul('1e1350')
                } else {
                    if (eff.gte(1e10)) eff = eff.div(1e10).pow(0.1).times(1e10)
                    if (eff.gte(1e250)) eff = eff.pow(0.1).mul(1e225)
                }
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(2e11),
            unlocked() { return hasUpgrade('l2', 21) },
			charged: {
				text: '本质增强本质获取',
				cost: n(1e238),
				effect() {
					let eff = player.l8.points.add(1).ln();
					if(hasUpgradeCharged('l1', 22)) eff = eff.pow(run(layers.l1.upgrades[22].charged.effect, layers.l1.upgrades[22]));
					eff = eff.div(10).add(1);
					if(hasUpgradeCharged('l1', 26)) eff = eff.pow(1.5);
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        22: {            title: "递归递归",
            description: "数据增强上一个升级的指数",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(0)
                let b = upgradeEffect("l1", 23).add(0.3)
                let eff = player.l1.points.add(1).pow(b).log10().div(100)
                eff = eff.mul(buyableEffect('l8', 1041));
				if (eff.gte(0.2)) eff = eff.minus(0.2).div(3).pow(1.1).add(0.2)
                eff = eff.min(0.5)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            cost: new Decimal(1e23),
            unlocked() { return hasUpgrade('l2', 21) },
			charged: {
				text: '本质增强上一个升级的充能效果指数',
				cost: n(1e250),
				effect() {
					let eff = player.l8.points.add(1).ln().add(1).ln().div(10).add(1);
					if(hasUpgradeCharged('l2', 21)) eff = eff.mul(1.25);
					if(hasUpgradeCharged('l1', 23)) eff = eff.pow(run(layers.l1.upgrades[23].charged.effect, layers.l1.upgrades[23]));
					return eff;
				},
				effectDescription() { return "^" + format(this.charged.effect()); },
			},
        },
        23: {
            title: "递归递归递归",
            description: "数据增强上一个升级的指数",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(0)
                let eff = player.l1.points.add(1).pow(0.1).log10().div(50)
                if (eff.gte(0.2)) eff = eff.minus(0.2).div(5).pow(1.1).add(0.2)
                eff = eff.min(0.5)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            cost: new Decimal(1e38),
            unlocked() { return hasUpgrade('l2', 21) },
			charged: {
				text: '本质增强上一个升级的充能效果指数',
				cost: n(1e264),
				effect() {
					let eff = player.l8.points.add(1).ln().add(1).ln().add(1).ln().div(20).add(1);
					if(hasUpgradeCharged('l2', 21)) eff = eff.mul(1.25);
					return eff;
				},
				effectDescription() { return "^" + format(this.charged.effect()); },
			},
        },
        24: {
            title: "递归递归递归递归",
            description: "本行第一个升级以更弱(^0.05)的效果对转生点数有效",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(1)
                let b = upgradeEffect("l1", 25).add(0.05)
                let eff = upgradeEffect("l1", 21).pow(b)
                if (eff.gte(1e50)) eff = eff.div(1e50).pow(0.01).times(1e50)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1e50),
            unlocked() { return hasUpgrade('l2', 21) },
			charged: {
				text: '本行第一个升级以^0.3的充能效果对砖有效',
				cost: n(1e271),
				effect() {
					let eff = n(1);
					if(hasUpgradeCharged('l1', 21)) eff = run(layers.l1.upgrades[21].charged.effect, layers.l1.upgrades[21]).pow(0.3);
					if(hasUpgradeCharged('l1', 25)) eff = eff.pow(run(layers.l1.upgrades[25].charged.effect, layers.l1.upgrades[25]));
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        25: {
            title: "递归递归递归递归递归",
            description: "基于数据加成上一个升级的指数",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(0)
                let eff = player.l1.points.add(1).ln().add(1).ln().pow(2).div(600)
                if (hasUpgrade('l5', 14)) eff = eff.add(player.l1.points.add(1).log10().div(150000)).min(0.3)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            cost: new Decimal(1e80),
            unlocked() { return hasUpgrade('l2', 21) },
			charged: {
				text: '基于砖加成上一个升级的充能效果',
				cost: n(1e280),
				effect() {
					let eff = player.l8.brick.value.add(1).ln().add(1).ln().div(2.5).add(1);
					return eff;
				},
				effectDescription() { return "^" + format(this.charged.effect()); },
			},
        },
        26: {
            title: "无穷递归",
            description(){ return `转生点数增强侵蚀后的转生点数获取<br>当前:×${format(this.effect())}` },
            effect(){ return n(1).add(player.l2.points.add(1).log10().pow(2)) },
            cost: new Decimal('e1.111e11'),
            unlocked() { return hasUpgrade("l1",25) },
        },
        31: {
            title: "重复了无数加一次的开始",
            description: "解锁虚空采集器",
            cost: new Decimal(666),
            unlocked() { return player.l8.voidShaped},
        },
        32: {
            title: "再等一会,然后.....",
            description() {return `数据加成虚空矿石获取<br>当前:x${format(this.effect())}`},
            cost: new Decimal(1e10),
            effect(){ 
                let b = player.l1.points.pow(0.5).add(1).log10()
                if(b.gte(100)){
                    b=b.sub(100)
                    b=b.pow(b.gte(1)?0.4:2.5)
                    b=b.add(100)
                }
                return b
            },
            unlocked() { return hasUpgrade("l1",31)},
        },
        33: {
            title: "感觉要回到从前?",
            description: "数据获取在侵蚀之后^1.5，且自动采集速度×2",
            cost: new Decimal("1e125"),
            unlocked() { return hasUpgrade("l1",32)},
        },
        34: {
            title: "虚无永存",
            description: "虚空矿石获取^1.25，且冲击效果×3",
            cost: new Decimal("1e2000"),
            unlocked() { return hasUpgrade("l1",33)},
        },
        35: {
            title: "何日能回到从前",
            description: "虚空矿石获取^1.5，且采集器MK.IV的软上限延迟^2",
            cost: new Decimal("1e8000"),
            unlocked() { return hasUpgrade("l1",34)},
        },
        36: {
            title: "数据终结",
            description(){ return `转生点数获取^4（侵蚀之后）`},
            cost: new Decimal("e1.2e9"),
            unlocked() { return hasUpgrade("l1",35)},
        },
        41: {
            ...voiddataupg,
            title: "采集器MK.II",
            description: "采集成功率提升至20%",
            cost: new Decimal(10),
            unlocked() {return player.l8.voidShaped},
            canAfford() {return !hasUpgrade("l2",201) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(41,201)},
        },
        42: {
            ...voiddataupg,
            title: "采集器MK.III",
            description: "采集成功率提升至40%",
            cost: new Decimal(30),
            unlocked() {return player.l8.voidShaped},
            canAfford() {return !hasUpgrade("l2",202) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(42,202)},
        },
        43: {
            ...voiddataupg,
            title: "采集器MK.IV",
            description: "每次采集有10%概率使数据获取^2",
            cost: new Decimal(50),
            unlocked() {return player.l8.voidShaped},
            canAfford() {return !hasUpgrade("l2",203) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(43,203)},
        },
        44: {
            ...voiddataupg,
            title: "采集器MK.V",
            description(){return `基于数据增加采集成功率,但使矿石获取量除以成功概率<br>当前:+${format(this.effect())}%`},
            cost: new Decimal(50),
            effect(){
                return player.l1.points.add(1).log10().min(20).max(0)
            },
            unlocked() {return player.l8.voidShaped},
            canAfford() {return !hasUpgrade("l2",204) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(44,204)},
        },
        45: {
            ...voiddataupg,
            title: "采集器MK.VI",
            description(){return `每次获取虚空矿石时,有10%概率获得10%当前重置时可获取的数据`},
            cost: new Decimal(450),
            unlocked() {return player.l8.voidShaped},
            canAfford() {return !hasUpgrade("l2",205) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(45,205)},
        },
        51: {
            ...voiddataupg,
            title: "精炼器MK.I",
            description(){return `你可以冲击虚空采集器了`},
            cost: new Decimal(1000),
            unlocked() {return hasUpgrade("l1",32)},
            canAfford() {return !hasUpgrade("l2",211) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(51,211)},
        },
        52: {
            ...voiddataupg,
            title: "精炼器MK.II",
            description(){return `冲击以数加成虚空矿石获取,采集器MK.IV的概率提升到30%`},
            cost: new Decimal(5000),
            unlocked() {return hasUpgrade("l1",32)},
            canAfford() {return !hasUpgrade("l2",212) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(52,212)},
        },
        53: {
            ...voiddataupg,
            title: "精炼器MK.III",
            description(){return `矿石加成自身获取<br>当前:^${format(this.effect())}`},
            effect(){
                return player.l1.voidMine.add(1).log10().add(10).log10().max(1)
            },
            cost: new Decimal(250000),
            unlocked() {return hasUpgrade("l1",32)},
            canAfford() {return !hasUpgrade("l2",213) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(53,213)},
        },
        54: {
            ...voiddataupg,
            title: "精炼器MK.IV",
            description(){return `MK.IV加成次数计入冲击加成公式`},
            cost: new Decimal(2e6),
            unlocked() {return hasUpgrade("l1",32)},
            canAfford() {return !hasUpgrade("l2",214) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(54,214)},
        },
        55: {
            ...voiddataupg,
            title: "精炼器MK.V",
            description(){return `采集成功率+30%,采集器MK.IV的概率提升到50%`},
            cost: new Decimal(4e6),
            unlocked() {return hasUpgrade("l1",32)},
            canAfford() {return !hasUpgrade("l2",215) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(55,215)},
        },
        61: {
            ...voiddataupg,
            title: "自动化MK.I",
            description: "自动采集速度×2",
            cost: new Decimal(2e6),
            unlocked() {return hasUpgrade("l1",33)},
            canAfford() {return !hasUpgrade("l2",221) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(61,221)},
        },
        62: {
            ...voiddataupg,
            title: "自动化MK.II",
            description(){return `精炼器MK.II的效果^3,自动采集效率变为25%`},
            cost: new Decimal(8e6),
            unlocked() {return hasUpgrade("l1",33)},
            canAfford() {return !hasUpgrade("l2",222) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(62,222)},
        },
        63: {
            ...voiddataupg,
            title: "自动化MK.III",
            description(){return `自动采集效率变为50%,采集器MK.VI的概率提升到100%`},
            cost: new Decimal(5e8),
            unlocked() {return hasUpgrade("l1",33)},
            canAfford() {return !hasUpgrade("l2",223) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(63,223)},
        },
        64: {
            ...voiddataupg,
            title: "自动化MK.IV",
            description(){return `冲击不再重置MK.IV加成,自动采集效率变为75%`},
            cost: new Decimal(2e10),
            unlocked() {return hasUpgrade("l1",33)},
            canAfford() {return !hasUpgrade("l2",224) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(64,224)},
        },
        65: {
            ...voiddataupg,
            title: "自动化MK.V",
            description(){return `采集成功概率和自动采集效率都为100%`},
            cost: new Decimal(1e14),
            unlocked() {return hasUpgrade("l1",33)},
            canAfford() {return !hasUpgrade("l2",225) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(65,225)},
        },
        71: {
            ...voiddataupg,
            title: "协同机MK.I",
            description(){return `MK.IV加成以较弱的方式对点数有效<br>当前:^${format(this.effect())}`},
            effect(){
                let eff =  player.l1.datadupe.add(1).log10().pow_base(2)
                if(eff.gte(2500)) eff = eff.div(2500).pow(0.3).mul(2500)
                if(eff.gte(4800)) eff = eff.div(4800).pow(0.02).mul(4800)
                //额外再开4次方根
                eff = eff.root(4)
                return eff
            },
            cost: new Decimal(1e15),
            unlocked() {return hasUpgrade("l1",34)},
            canAfford() {return !hasUpgrade("l2",231) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(71,231)},
        },
        72: {
            ...voiddataupg,
            title: "协同机MK.II",
            description(){return `MK.IV加成以较弱的方式对冲击效果有效<br>当前:x${format(this.effect())}`},
            effect(){
                let eff =  player.l1.datadupe.add(1).pow(0.45).add(366.6).pow_base(1.25)
                if(eff.gte('e250000')) eff = eff.div('e250000').pow(0.2).mul('e250000')
                if(eff.gte('e2e6')) eff = eff.div('e2e6').max(1).log10().pow(0.8).pow_base(10).mul('e2e6')
                //对冲击效果使用前先套丢层log10和?.05
                eff = eff.log10().mul(0.05)
                return eff
            },
            cost: new Decimal("1e24"),
            unlocked() {return hasUpgrade("l1",34)},
            canAfford() {return !hasUpgrade("l2",232) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(72,232)},
        },
        73: {
            ...voiddataupg,
            title: "协同机MK.III",
            description(){return `基于点数加成虚空矿石获取<br>当前:x${format(this.effect())}`},
            effect(){
                return player.points.add(1).log10().add(1).log10().add(1)
            },
            cost: new Decimal("1e32"),
            unlocked() {return hasUpgrade("l1",34)},
            canAfford() {return !hasUpgrade("l2",233) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(73,233)},
        },
        74: {
            ...voiddataupg,
            title: "协同机MK.IV",
            description(){return `每次获得MK.IV加成时有5%概率获得200倍次数`},
            cost: new Decimal("2e43"),
            unlocked() {return hasUpgrade("l1",34)},
            canAfford() {return !hasUpgrade("l2",234) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(74,234)},
        },
        75: {
            ...voiddataupg,
            title: "协同机MK.V",
            description(){return `基于虚空矿石，在侵蚀之后获得更多转生点数<br>当前:x${format(this.effect())}`},
            effect(){
                return player.l1.voidMine.max(1).log10().div(30).add(1)
            },
            cost: new Decimal(1e47),
            unlocked() {return hasUpgrade("l1",34)},
            canAfford() {return !hasUpgrade("l2",235) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(75,235)},
        },
        81: {
            ...voiddataupg,
            title: "擢升器MK.I",
            description(){return `每次采集使虚空矿石获取×+0.001（累加）`},
            cost: new Decimal("1e27"),
            unlocked() {return hasUpgrade("l1",35)},
            canAfford() {return !hasUpgrade("l2",241) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(81,241)},
        },
        82: {
            ...voiddataupg,
            title: "擢升器MK.II",
            description(){return `每次采集使虚空矿石获取×+0.01（累加）`},
            cost: new Decimal("1e29"),
            unlocked() {return hasUpgrade("l1",35)},
            canAfford() {return !hasUpgrade("l2",242) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(82,242)},
        },
        83: {
            ...voiddataupg,
            title: "擢升器MK.III",
            description(){return `每次采集使虚空矿石获取×+0.05（累加）,自动采集速度×3`},
            cost: new Decimal("1e31"),
            unlocked() {return hasUpgrade("l1",35)},
            canAfford() {return !hasUpgrade("l2",243) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(83,243)},
        },
        84: {
            ...voiddataupg,
            title: "擢升器MK.IV",
            description(){return `每次采集使虚空矿石获取×+0.1（累加）`},
            cost: new Decimal("1e33"),
            unlocked() {return hasUpgrade("l1",35)},
            canAfford() {return !hasUpgrade("l2",244) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(84,244)},
        },
        85: {
            ...voiddataupg,
            title: "擢升器MK.V",
            description(){return `每次采集使虚空矿石获取×+0.15（累加）`},
            cost: new Decimal("1e35"),
            unlocked() {return hasUpgrade("l1",35)},
            canAfford() {return !hasUpgrade("l2",245) && player.l1.voidMine.gte(this.cost)},
            style() {return layers.l1.frozenStyle(85,245)},
        },
        91: {
            ...voiddataupg,
            title: "共鸣器MK.I",
            description(){return `每次采集自动复读10%的冲击效果（不消耗虚空矿石）`},
            cost: new Decimal("1e39"),
            unlocked() {return hasUpgrade("l1",85)||hasUpgrade("l2",245)},
        },
        92: {
            ...voiddataupg,
            title: "共鸣器MK.II",
            description(){return `每次采集自动复读25%的冲击效果（不消耗虚空矿石）`},
            cost: new Decimal("1e40"),
            unlocked() {return hasUpgrade("l1",85)||hasUpgrade("l2",245)},
        },
        93: {
            ...voiddataupg,
            title: "共鸣器MK.III",
            description(){return `每次采集自动复读50%的冲击效果（不消耗虚空矿石）`},
            cost: new Decimal("1e41"),
            unlocked() {return hasUpgrade("l1",85)||hasUpgrade("l2",245)},
        },
        94: {
            ...voiddataupg,
            title: "共鸣器MK.IV",
            description(){return `每次采集自动复读100%的冲击效果（不消耗虚空矿石）`},
            cost: new Decimal("1e42"),
            unlocked() {return hasUpgrade("l1",85)||hasUpgrade("l2",245)},
        },
        95: {
            ...voiddataupg,
            title: "共鸣器MK.V",
            description(){return `每次采集自动复读200%的冲击效果（不消耗虚空矿石）`},
            cost: new Decimal("1e43"),
            unlocked() {return hasUpgrade("l1",85)||hasUpgrade("l2",245)},
        },
    },
    clickables:{
        11:{
        	display(){
                return `<h3>${player.l1.mining ? "结束采集" : "开始采集"}</h3>每${format(layers.l1.autoMineInterval(), 2)}秒自动采集一次(x${format(layers.l1.autoMineSpeed())})<br>自动采集效率:${formatWhole(voidMineEfficiency()*100)}%`
			},
			onClick(){
				Vue.set(player.l1, "mining", !player.l1.mining)
				player.l1.mineTimer = n(0)
			},
			style(){
				return {"min-height":"0px","height":"100px","width":"100px","background-color":"#00000000","border-color": player.l1.mining ? "lime" : "white"};
			},
			canClick(){
                return true
			},
			unlocked(){
				return hasUpgrade("l1",31)
			},
        },
        13:{
        	display(){
                return `<h3>执行一次采集</h3>立刻结算一次完整采集<br>成功率:${formatWhole(player.l1.minechance)}%`
			},
			onClick(){
				voidMineOnce()
			},
			style(){
				return {"min-height":"0px","height":"100px","width":"100px","background-color":"#00000000","border-color":"white"};
			},
			canClick(){
                return true
			},
			unlocked(){
				return hasUpgrade("l1",31)
			},
        },
        12:{
        	display(){
                if(!this.canClick()) return  `需要${format(player.l1.datamine.div(hasUpgrade("l2",91)?buyableEffect("l2",21)[1]:1).div(hasUpgrade("l2",91)?buyableEffect("l2",21)[1]:1).div(hasRefiner(54)?player.l1.datadupe.pow_base(2).add(10).log10().add(10).log10().max(1):1).div(4).sub(1).pow(2).max(0).pow_base(10).max(1).times(1000))}矿石`
                return `使用所有虚空矿石和采集器MK.IV加成冲击虚空采集器<br>
                MK.IV单次加成效果×+${format(layers.l1.impactGain())}`
			},
			onClick(){
                player.l1.datamine = player.l1.datamine.add(layers.l1.impactGain())
                if(!(hasUpgrade("l1",64)||hasUpgrade("l2",224))) player.l1.datadupe = n(0)
                player.l1.voidMine = n(0)
			},
			style(){
				return layers.l1.clickables[12].canClick()?{"min-height":"0px","height":"100px","width":"100px","background-color":"#00000000","border-color":"white"}:{"min-height":"0px","height":"100px","width":"100px","background-color":"#000000","border-color":"white","color":"white"};
			},
			canClick(){
                return layers.l1.calcDmineboost().gt(1) && player.l1.voidMine.gt(1000)
			},
			unlocked(){
				return hasRefiner(51)
			},
        },
        21:{
            display(){
                let costs = ["2e42","4e42","6e42","8e42"]
                if(player.l1.resonanceJump >= 4) return `<h3>谐振跃迁：已完成4次</h3>数据软上限已完成全部弱化`
                return `<h3>谐振跃迁 ${player.l1.resonanceJump + 1}/4</h3>消耗 ${format(n(costs[player.l1.resonanceJump]))} 虚空矿石<br>效果：永久弱化数据软上限（第${player.l1.resonanceJump + 1}级）`
            },
            onClick(){
                let costs = ["2e42","4e42","6e42","8e42"]
                if(player.l1.resonanceJump >= 4) return
                let cost = n(costs[player.l1.resonanceJump])
                if(player.l1.voidMine.lt(cost)) return
                player.l1.voidMine = player.l1.voidMine.sub(cost)
                player.l1.resonanceJump += 1
                updateTemp()
            },
            style(){
                return {"min-height":"0px","height":"100px","width":"100px","background-color":"#00000000","border-color":"white"};
            },
            canClick(){
                let costs = ["2e42","4e42","6e42","8e42"]
                return player.l1.resonanceJump < 4 && player.l1.voidMine.gte(costs[player.l1.resonanceJump])
            },
            unlocked(){
                return hasUpgrade("l1",94)
            },
        },
        22:{
            display(){
                return `<h3>自动重置：${player.l1.autoReset ? "开" : "关"}</h3>`
            },
            onClick(){
                Vue.set(player.l1, "autoReset", !player.l1.autoReset)
            },
            style(){
                return {"min-height":"0px","height":"100px","width":"100px","background-color":"#00000000","border-color": player.l1.autoReset ? "lime" : "white"};
            },
            canClick(){
                return true
            },
            unlocked(){
                return player.l8.voidShaped && hasUpgrade("l2", 4)
            },
        },
        23:{
            display(){
                return `<h3>自动冲击：${player.l1.autoImpact ? "开" : "关"}</h3>`
            },
            onClick(){
                Vue.set(player.l1, "autoImpact", !player.l1.autoImpact)
            },
            style(){
                return {"min-height":"0px","height":"100px","width":"100px","background-color":"#00000000","border-color": player.l1.autoImpact ? "lime" : "white"};
            },
            canClick(){
                return true
            },
            unlocked(){
                return player.l8.voidShaped && hasUpgrade("l2", 5)
            },
        }
    },
    bars: {
        mineBar: {
            direction: RIGHT,
            width: 360,
            height: 28,
            instant: true,
            progress() { return player.l1.mineTimer.max(0).div(layers.l1.autoMineInterval()).min(1).toNumber() },
            display() {
                if(!player.l1.mining) return "采集已停止"
                let pct = player.l1.mineTimer.max(0).div(layers.l1.autoMineInterval()).min(1).mul(100)
                return "下一次自动采集 " + format(pct, 1) + "%（自动采集速度:x" + format(layers.l1.autoMineSpeed()) + "）"
            },
            unlocked() { return hasUpgrade("l1",31) },
            baseStyle: {"background-color": "#101010", "border-color": "white"},
            fillStyle() { return {"background-color": player.l1.mining ? "#9be7ff" : "#555555"} },
            textStyle: {"color": "white", "text-shadow": "0 0 3px black"},
        },
    },
    layerShown() { return true },
    autoUpgrade() { return hasMilestone("l2", 1) || (player.l3.total.gte(1) && player.l2.points.gte(tmp.l3.ptsEff3)); },
    resetsNothing() { return hasMilestone("l2", 3) },
    softcap() { if (hasUpgrade("l4", 31) && hasUpgrade("l4", 32)) return new Decimal("F9e15"); return new Decimal("1e3500"); },
    softcapPower() { return new Decimal(0.2); },
	unlocked() {return !(player.l8.baC.chal7doomed[0] > 0);},
})
// l2-16：虚空采集器全解锁；已固化的采集器升级仍然保持失?
const voidUpgradeIds = [41,42,43,44,45,51,52,53,54,55,61,62,63,64,65,71,72,73,74,75,81,82,83,84,85,91,92,93,94,95]
const solidifiedPair = {41:201,42:202,43:203,44:204,45:205,51:211,52:212,53:213,54:214,55:215,61:221,62:222,63:223,64:224,65:225,71:231,72:232,73:233,74:234,75:235,81:241,82:242,83:243,84:244,85:245}
for (const id of voidUpgradeIds) {
    const u = layers.l1.upgrades[id]
    const orig = u.unlocked
    u.unlocked = function() {
        if (solidifiedPair[id] && hasUpgrade("l2", solidifiedPair[id])) return true
        if (hasUpgrade("l2", 16)) return true
        return orig.call(this)
    }
}
})()
