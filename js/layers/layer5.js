addLayer("l5", {
    infoboxes: {
        introBox: {
            title: "Layer 5",
            body() { return "本层由 kanaenagi 制作。" },
        },
    },
    position: 1,
    symbol: 'T',
    name: "第五层 制作：kanaenagi",
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            total: new Decimal(0),
            chalcomp: [null, n(0), n(0), n(0), n(0), n(0), n(0)],
            essence: new Decimal(0),
            crystal: new Decimal(0),
            c6punishment: new Decimal(0),
            resetTime: n(0),
        };
    },
    row: 3,
    branches: ['l2'],
    hotkeys: [
        { key: "5", description: "5：进行第五层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    color: "#FFFF00",
    requires: new Decimal('1e2620'),
    resource: "飞升点数",
    baseResource: "转生点数",
    baseAmount() { return player.l2.points },
    type: "static",
    base: 1e40,
    exponent: 1.35,
    gainMult() {
        let mult = new Decimal(1)
        if(player.l7.neff1[11]) mult = mult.div(player.l7.ncalc1[11])
		return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        exp = exp.div(layers.l5.essenceeff()[0])
        if (player.l7.neff3[2]) exp = exp.mul(player.l7.ncalc3[2])
        if (!hasUpgrade('l8', 85) && player.l5.points.gte(3666)) exp = exp.div('10^^9e15');
        return exp
    },
	directMult() {
		let mult = n(1);
		mult = mult.mul(buyableEffect('l8', 1131));
		if(hasUpgrade('l8', 11)) mult = mult.mul(player.l8.tuning[5].div(10));
        return mult;
	},
    passiveGeneration() {
        let mult = 0
        return mult
    },
    doReset(a) {
        let keep = []
        if (layers[a].row > this.row) layerDataReset("l5", keep);
        player.points = new Decimal(0);
		if(!hasUpgrade('l8', 85)) player.l5.points = player.l5.points.min(3666);
    },
    layerShown() { return hasUpgrade('l4', 66) || player.l5.unlocked },
    canBuyMax() { return hasUpgrade('l5', 24) || hasMilestone('l8', 4) },
	autoUpgrade() { return hasMilestone('l8', 5) },
    effectDescription() {
        return '转生点数x' + format(tmp.l5.effect)
    },
    effect() {
        let eff = n(1e10).pow(player.l5.points)
		eff = eff.pow(buyableEffect('l8', 1142));
        return eff
    },
    essencegain() {
        let gain = player.l5.points.sub(17).pow_base(2).max(0)
        if (hasUpgrade('l5', 33)) gain = gain.mul(4)
        gain = gain.mul(buyableEffect('l5', 11))
        gain = gain.mul(buyableEffect('l5', 12))
        gain = gain.mul(buyableEffect('l5', 13))
        gain = gain.mul(upgradeEffect('l6', 102))
        gain = gain.mul(upgradeEffect('l6', 113))
        gain = gain.mul(tmp.l3.ptsEff5)
        if(player.l7.neff1[12]) gain = gain.mul(player.l7.ncalc1[12])
		gain = gain.mul(buyableEffect('l8', 1141));
	
		if(player.l8.erosion.run[4]) gain = gain.max(1).log10().pow(layers.l8.erosionEff(4)).pow_base(10);
        return gain
    },
    essenceeff() {
        let eff = player.l5.essence.max(10).log10().pow(0.1).softcap(2, 10, 3).recip()
        return [eff]
    },
    crystalgain() {
        let effcnt = player.l5.essence
        if(player.l7.nseed2 == 11) effcnt = effcnt.times(player.l7.ncalc2)
        let gain = effcnt.div(1e9).max(1).log10().div(2).root(1.2).floor()
        gain = gain.sub(player.l5.crystal).max(0)
        return gain
    },
    getnextcrystal() {
        let effcnt = n(1)
        if(player.l7.nseed2 == 11) effcnt = effcnt.times(player.l7.ncalc2)
        let next = player.l5.crystal.add(1).pow(1.2).mul(2).pow_base(10).mul(1e9).div(effcnt)
        return next
    },
    crystaleff() {
        let eff = player.l5.crystal.mul(0.05).add(1).recip()
        return eff
    },
    tabFormat: {
        "主页": {
            "content": [["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ['display-text', () => (player.l5.points.gte(3666) ? `来自天穹的神秘力量将飞升点数限制在3666!` : ``)],
                "blank",
                "upgrades"
            ]
        },
        "挑战": {
            unlocked:() => hasUpgrade("l5", 15),
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "challenges"
            ]
        },
        "飞升精华": {
            unlocked:() => hasUpgrade('l5', 25),
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ['display-text', () => '你有<h2 style="color: #FFFF00; text-shadow: 0px 0px 12px #FFFF00">' + format(player.l5.essence) + '</h2>飞升精华，飞升点数价格^<h2 style="color: #FFFF00; text-shadow: 0px 0px 12px #FFFF00">' + format(tmp.l5.essenceeff[0]) + '</h2>'],
                ['display-text', () => '你每秒获取<h2 style="color: #FFFF00; text-shadow: 0px 0px 12px #FFFF00">' + format(tmp.l5.essencegain) + '</h2>飞升精华'],
                ["buyables", [1]],
                'blank',
                ['display-text', function () { if (hasUpgrade('l5',33)) return '你有<h2 style="color: #FFFF00; text-shadow: 0px 0px 12px #FFFF00">' + format(player.l5.crystal) + '</h2>飞升之晶，核心价格^<h2 style="color: #FFFF00; text-shadow: 0px 0px 12px #FFFF00">' + format(tmp.l5.crystaleff) + '</h2><br>下一个在' + format(tmp.l5.getnextcrystal) + '飞升精华' }],
            ]
        },
    },
    clickables: {
    },
    update(diff) {
		if(player.l8.baC.chal7doomed[4] > 0) return;
		
        if (hasUpgrade("l5", 25)) player.l5.essence = player.l5.essence.add(layers.l5.essencegain().mul(diff))
        if (hasUpgrade('l5', 33)) player.l5.crystal = player.l5.crystal.add(layers.l5.crystalgain())
        if (inChallenge("l5", 31)) player.points = player.points.pow(n(0.9).pow(diff))
        if (inChallenge("l5", 31)) player.l4.points = player.l4.points.pow(n(0.9).pow(diff))
        if (inChallenge("l5", 32)) player.l5.c6punishment = player.l5.c6punishment.add(10*diff)
        if (!hasUpgrade('l8', 85) && player.l5.points.gt(3666)) player.l5.points = n(3666)
		if (hasMilestone('l8', 9) && player.l8.activeChallenge == null)
		{
			if(!hasUpgrade('l8', 85)) player.l5.points = n(3666);
			else player.l5.points = player.l5.points.max(3666);
		}
        if (hasMilestone('l7', 11)) {
            layers.l5.buyables[11].BuyMax()
            layers.l5.buyables[12].BuyMax()
            layers.l5.buyables[13].BuyMax()
        }
		if(hasMilestone('l8', 18))
		{
			player.l5.chalcomp[1] = tmp.l5.challenges[11].countcalc.floor().max(player.l5.chalcomp[1])
			player.l5.chalcomp[2] = tmp.l5.challenges[12].countcalc.floor().max(player.l5.chalcomp[2])
			player.l5.chalcomp[3] = tmp.l5.challenges[21].countcalc.floor().max(player.l5.chalcomp[3])
			player.l5.chalcomp[4] = tmp.l5.challenges[22].countcalc.floor().max(player.l5.chalcomp[4])
		}
		if(hasMilestone('l8', 24))
		{
			player.l5.chalcomp[5] = tmp.l5.challenges[31].countcalc.floor().max(player.l5.chalcomp[5])
			player.l5.chalcomp[6] = tmp.l5.challenges[32].countcalc.floor().max(player.l5.chalcomp[6])	
		}
		if(hasMilestone('l8', 28) && hasUpgrade('l8', 85) && player.l2.points.gte(tmp.l5.nextAt)) player.l5.points = player.l5.points.add(tmp.l5.resetGain);
	},
    milestones: [
    ],
    upgrades: {
        11: {
            title: "核心重构",
            description: "你可以同时购买第五行增幅器，并自动化",
            cost: new Decimal(2),
            unlocked() { return true },
        },
        12: {
            title: "压缩飞升",
            description: "飞升点数加成致密点数",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("l5", 11) },
            effect() {
                if (!hasUpgrade('l5', 12)) return n(1)
                let eff = Decimal.pow(100, player.l5.points);
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        //currencyDisplayName: "转生点数",
        //currencyInternalName: "points",
        //currencyLayer: "l2" 
        13: {
            title: "攻防优化",
            description: "攻击冷却x0.2，解锁新防具",
            cost: new Decimal(4),
            unlocked() { return hasUpgrade("l5", 12) },
        },
        14: {
            title: "递归递归递归递归递归递归递归",
            description: `升级"递归递归递归递归递归"效果变得更好`,
            cost: new Decimal('1e3135'),
            currencyDisplayName: "转生点数",
            currencyInternalName: "points",
            currencyLayer: "l2",
            unlocked() { return hasUpgrade("l5", 13) },
        },
        15: {
            title: "挑战？！",
            description: "解锁挑战",
            cost: new Decimal(8),
            unlocked() { return hasUpgrade("l5", 14) },
        },
        21: {
            title: "又又来了",
            description: "升级又来了的第二个软上限更弱",
            cost: new Decimal(12),
            unlocked() { return hasUpgrade("l5", 15) },
        },
        22: {
            title: "奇点自动",
            description: "自动获取奇点,但你无法再进入奇点压缩",
            cost: new Decimal(14),
            unlocked() { return hasUpgrade("l5", 21) },
        },
        23: {
            title: "核心重组 IV",
            description: "飞升点数加成第五行增幅器",
            cost: new Decimal(15),
            unlocked() { return hasUpgrade("l5", 22) },
            effect() {
                if (!hasUpgrade('l5', 12)) return n(1)
                let eff = player.l5.points.min(3666).pow(hasUpgrade('l4', 76)? 1 : 0.75).mul(0.1).add(1);
                if(eff.gte(360)) eff = eff.div(360).pow(0.25).times(360)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        24: {
            title: "最大飞升",
            description: "你可以购买最大飞升点数",
            cost: new Decimal(16),
            unlocked() { return hasUpgrade("l5", 23) },
        },
        25: {
            title: "继续飞升",
            description: "解锁飞升精华",
            cost: new Decimal(17),
            unlocked() { return hasUpgrade("l5", 24) },
        },
        31: {
            title: "攻击飞升",
            description: "飞升精华加成攻击力",
            
            cost: new Decimal(20),
            unlocked() { return hasUpgrade("l5", 25) },
            effect() {
                if (!hasUpgrade('l5', 31)) return n(1)
                let eff = expPow(player.l5.essence.add(1), 0.9);
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        32: {
            title: "致密增益",
            description: "解锁致密点数总量第五效果",
            cost: new Decimal(21),
            unlocked() { return hasUpgrade("l5", 31) },
        },
        33: {
            title: "结晶飞升",
            description: "解锁飞升之晶，飞升精华x4",
            cost: new Decimal(22),
            unlocked() { return hasUpgrade("l5", 32) },
        },
        34: {
            title: "结晶攻击",
            description: "基于飞升之晶，加成攻击力",
            cost: new Decimal(23),
            unlocked() { return hasUpgrade("l5", 33) },
            effect() {
                if (!hasUpgrade('l5', 34)) return n(1)
                let eff = player.l5.crystal.pow_base(100);
                return eff
            },
            effectDisplay() { let a = "*" + format(this.effect()); return a; },
        },
        35: {
            title: "终焉飞升",
            description: "解锁下一层",
            cost: new Decimal(24),
            unlocked() { return hasUpgrade("l5", 34) },
        },
    },
    buyables: {
        11: {
            title() {
                return "奇点精华";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "飞升精华获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "奇点";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5)).mul(1e32);
                return a;
            },
            canAfford() {
                return player.l3.sing.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2, player[this.layer].buyables[this.id]);
                eff = eff.pow(buyableEffect('l8', 1143));
				return eff;
            },
            style() {
                if (player.l3.sing.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l3.color };
                }
            },
            unlocked() { return hasUpgrade("l5", 25) },
            BuyMax() {
                let amt = player.l3.sing
                let target = amt.div(1e32).log(2).root(1.5)
                target = target.floor().add(1)
                player.l5.buyables[this.id] = player.l5.buyables[this.id].max(target)
            },
        },
        12: {
            title() {
                return "攻击精华";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "飞升精华获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "攻击力";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(10, a.pow(1.5)).mul(1e196);
                return a;
            },
            canAfford() {
                return player.l4.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2, player[this.layer].buyables[this.id]);
                eff = eff.pow(buyableEffect('l8', 1125));
				return eff;
            },
            style() {
                if (player.l4.points.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l4.color };
                }
            },
            unlocked() { return hasUpgrade("l5", 25) },
            BuyMax() {
                let amt = player.l4.points
                let target = amt.div(1e196).log(10).root(1.5)
                target = target.floor().add(1)
                player.l5.buyables[this.id] = player.l5.buyables[this.id].max(target)
            },
        },
        13: {
            title() {
                return "点数精华";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "飞升精华获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "点数";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(1e100, a.pow(1.5)).mul("e20800");
                return a;
            },
            canAfford() {
                return player.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2, player[this.layer].buyables[this.id]);
                eff = eff.pow(buyableEffect('l8', 1144));
				return eff;
            },
            style() {
                if (player.points.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l4.color };
                }
            },
            unlocked() { return hasUpgrade("l5", 25) },
            BuyMax() {
                let amt = player.points
                let target = amt.div('1e20800').log(1e100).root(1.5)
                target = target.floor().add(1)
                player.l5.buyables[this.id] = player.l5.buyables[this.id].max(target)
            },
        },
    },
    challenges: {
        11: {
            name: "反-复制器",
            challengeDescription() { return "你不能获得复制器" },
            unlocked() { return hasUpgrade('l5', 15); },
            canComplete() {
                return false
            },
            goal() {
                let amt = player.l5.chalcomp[1]
                let next = Decimal.pow('1e100', amt.pow(1.5)).mul('1e10700')
                return next
            },
            rewardDescription() { let a = inChallenge("l5", this.id) ? "<br>+" + formatWhole(tmp.l5.challenges[11].countcalc.sub(player.l5.chalcomp[1]).max(0)) + " 完成次数<br>下一次在" + format(layers.l5.challenges[this.id].getNextAt()) + "点数" : ""; return "攻击力x" + format(this.effect()) + "<br>完成次数：" + formatWhole(player.l5.chalcomp[1]) + a },
            effect() { return player.l5.chalcomp[1].pow_base(10).pow(buyableEffect('l8', 1132)) },
            countcalc() {
                let x = player.points.div('1e10700').max(1).log('1e100').max(0).root(1.5).add(1)
                if (player.points.lte('1e10700')) return n(0)
                return x.floor()
            },
            getNextAt() {
                let amt = tmp.l5.challenges[this.id].countcalc.max(player.l5.chalcomp[1])
                let next = Decimal.pow('1e100', amt.pow(1.5)).mul('1e10700')
                return next
            },
            onExit() {
                player.l5.chalcomp[1] = tmp.l5.challenges[this.id].countcalc.floor().max(player.l5.chalcomp[1])
            },
            onEnter() {
                player.points = n(0);
                player.l1.points = n(0);
                player.l1.repl = n(0);
                updateTemp()
            },
            style() {
                return { 'border-color': 'white', 'background-color': inChallenge('l5', this.id) ? '#FFFFFF20' : 'black', 'color': 'white', 'shadow': inChallenge('l5', this.id) ? '0px 0px 24px silver' : '' };
            },
        },
        12: {
            name: "数据溢出",
            challengeDescription() { return "数据获取^0.1" },
            unlocked() { return hasUpgrade("l5", 15); },
            canComplete() {
                return false
            },
            goal() {
                let amt = player.l5.chalcomp[2]
                let next = Decimal.pow('1e200', amt.pow(1.5)).mul('1e9000')
                return next
            },
            rewardDescription() { let a = inChallenge("l5", this.id) ? "<br>+" + formatWhole(tmp.l5.challenges[this.id].countcalc.sub(player.l5.chalcomp[2]).max(0)) + " 完成次数<br>下一次在" + format(tmp.l5.challenges[this.id].getNextAt) + "点数" : ""; return "奇点x" + format(this.effect()) + "<br>完成次数：" + formatWhole(player.l5.chalcomp[2]) + a },
            effect() { return player.l5.chalcomp[2].pow_base(2).pow(buyableEffect('l8', 1133)) },
            countcalc() {
                let x = player.points.div('1e9000').max(1).log('1e200').max(0).root(1.5).add(1)
                if (player.points.lte('1e9000')) return n(0)
                return x.floor()
            },
            getNextAt() {
                let amt = tmp.l5.challenges[this.id].countcalc.max(player.l5.chalcomp[2])
                let next = Decimal.pow('1e200', amt.pow(1.5)).mul('1e9000')
                return next
            },
            onExit() {
                player.l5.chalcomp[2] = tmp.l5.challenges[this.id].countcalc.floor().max(player.l5.chalcomp[2])
            },
            onEnter() {
                player.points = n(0);
                player.l1.points = n(0);
                player.l1.repl = n(0);
                updateTemp()
            },
            style() {
                return { 'border-color': 'white', 'background-color': inChallenge('l5', this.id) ? '#FFFFFF20' : 'black', 'color': 'white', 'shadow': inChallenge('l5', this.id) ? '0px 0px 24px silver' : '' };
            },
        },
        21: {
            name: "核心崩坏",
            challengeDescription() { return "你不能获取核心" },
            unlocked() { return hasUpgrade("l5", 15); },
            canComplete() {
                return false
            },
            goal() {
                let amt = player.l5.chalcomp[3]
                let next = Decimal.pow('1e250', amt.pow(1.5)).mul('1e17250')
                return next
            },
            rewardDescription() { let a = inChallenge("l5", this.id) ? "<br>+" + formatWhole(tmp.l5.challenges[this.id].countcalc.sub(player.l5.chalcomp[3]).max(0)) + " 完成次数<br>下一次在" + format(tmp.l5.challenges[this.id].getNextAt) + "点数" : ""; return "增幅器IV-B效果x" + format(this.effect()) + "<br>完成次数：" + formatWhole(player.l5.chalcomp[3]) + a },
            effect() { return player.l5.chalcomp[3].add(1).pow(buyableEffect('l8', 1134)) },
            countcalc() {
                let x = player.points.div('1e17250').max(1).log('1e250').max(0).root(1.5).add(1)
                if (player.points.lte('1e17250')) return n(0)
                return x.floor()
            },
            getNextAt() {
                let amt = tmp.l5.challenges[this.id].countcalc.max(player.l5.chalcomp[3])
                let next = Decimal.pow('1e250', amt.pow(1.5)).mul('1e17250')
                return next
            },
            onExit() {
                player.l5.chalcomp[3] = tmp.l5.challenges[this.id].countcalc.floor().max(player.l5.chalcomp[3])
            },
            onEnter() {
                player.points = n(0);
                player.l1.points = n(0);
                player.l1.repl = n(0);
                updateTemp()
            },
            style() {
                return { 'border-color': 'white', 'background-color': inChallenge('l5', this.id) ? '#FFFFFF20' : 'black', 'color': 'white', 'shadow': inChallenge('l5', this.id) ? '0px 0px 24px silver' : '' };
            },
        },
        22: {
            name: "压缩失效",
            challengeDescription() { return "你不能获取致密点数" },
            unlocked() { return hasUpgrade("l5", 15); },
            canComplete() {
                return false
            },
            goal() {
                let amt = player.l5.chalcomp[4]
                let next = Decimal.pow('1e300', amt.pow(1.5)).mul('1e8900')
                return next
            },
            rewardDescription() { let a = inChallenge("l5", this.id) ? "<br>+" + formatWhole(tmp.l5.challenges[this.id].countcalc.sub(player.l5.chalcomp[4]).max(0)) + " 完成次数<br>下一次在" + format(tmp.l5.challenges[this.id].getNextAt) + "点数" : ""; return "致密点数x" + format(this.effect()) + "<br>完成次数：" + formatWhole(player.l5.chalcomp[4]) + a },
            effect() { return player.l5.chalcomp[4].pow_base(1000).pow(buyableEffect('l8', 1135)) },
            countcalc() {
                let x = player.points.div('1e8900').max(1).log('1e300').max(0).root(1.5).add(1)
                if (player.points.lte('1e8900')) return n(0)
                return x.floor()
            },
            getNextAt() {
                let amt = tmp.l5.challenges[this.id].countcalc.max(player.l5.chalcomp[4])
                let next = Decimal.pow('1e300', amt.pow(1.5)).mul('1e8900')
                return next
            },
            onExit() {
                player.l5.chalcomp[4] = tmp.l5.challenges[this.id].countcalc.floor().max(player.l5.chalcomp[4])
            },
            onEnter() {
                player.points = n(0);
                player.l1.points = n(0);
                player.l1.repl = n(0);
                updateTemp()
            },
            style() {
                return { 'border-color': 'white', 'background-color': inChallenge('l5', this.id) ? '#FFFFFF20' : 'black', 'color': 'white', 'shadow': inChallenge('l5', this.id) ? '0px 0px 24px silver' : '' };
            },
        },
        31: {
            name: "地狱之门扉",
            challengeDescription() { return "进行一次<b>毫无保留</b>的第四行重置,且攻击力和点数每游戏秒衰减为原来的^0.9,请选择正确的天使和Chal-tree!" },
            unlocked() { return hasMilestone("l4",36)||layers.l4.total_bars().gte(3666); },
            canComplete() {
                return false
            },
            goal() {
                let amt = player.l5.chalcomp[5]
                let next = Decimal.pow('1e5000', amt.pow(1.5)).mul('1e180000')
                return next
            },
            rewardDescription() { let a = inChallenge("l5", this.id) ? "<br>+" + formatWhole(tmp.l5.challenges[this.id].countcalc.sub(player.l5.chalcomp[5]).max(0)) + " 完成次数<br>下一次在" + format(tmp.l5.challenges[this.id].getNextAt) + "点数" : ""; return "中子素粒获取x" + format(this.effect()) + "<br>完成次数：" + formatWhole(player.l5.chalcomp[5]) + a },
            effect() {
                let eff = player.l5.chalcomp[5].pow_base(3)
                if(player.l5.chalcomp[5].gte(50)) eff = eff.div(Decimal.pow(3,50)).cbrt().mul(Decimal.pow(3,50))
                eff = eff.pow(buyableEffect('l8', 1164));
				return eff
            },
            countcalc() {
                let x = player.points.div('1e180000').max(1).log('1e5000').max(0).root(1.5).add(1)
                if (player.points.lte('1e180000')) return n(0)
                return x.floor()
            },
            getNextAt() {
                let amt = tmp.l5.challenges[this.id].countcalc.max(player.l5.chalcomp[5])
                let next = Decimal.pow('1e5000', amt.pow(1.5)).mul('1e180000')
                return next
            },
            onExit() {
                player.l5.chalcomp[5] = tmp.l5.challenges[this.id].countcalc.floor().max(player.l5.chalcomp[5])
            },
            onEnter() {
                updateTemp()
                layerDataReset("l3",true)
                updateTemp()
                layerDataReset("l2",true)
                updateTemp()
                layerDataReset("l1",true)
                updateTemp()
            },
            style() {
                return { 'border-color': inChallenge('l5', this.id) ? '#ff0000' : '#ff9c9c', 'background-color': inChallenge('l5', this.id) ? '#ff000070' : 'black', 'color': inChallenge('l5', this.id) ? '#ff0000':"#ff9c9c", 'shadow': inChallenge('l5', this.id) ? '0px 0px 24px #ff0000' : '' };
            },
            canEnter() {
                return !player.l8.voidShaped
            },
        },
        32: {
            name: "最终试炼?",
            challengeDescription() { return "进行一次<b>毫无保留</b>的第四行重置, 核心等级将每游戏秒减少10, 当核心等级为负数时其效果为对应正数等级的倒数(二阶核心将进一步降低它), 数据获取^0.001" },
            unlocked() { return hasMilestone("l7",9); },
            canComplete() {
                return false
            },
            goal() {
                let amt = player.l5.chalcomp[6]
                let next = Decimal.pow('1e125000',amt.pow(3)).mul('e944944')
                return next
            },
            rewardDescription() { let a = inChallenge("l5", this.id) ? "<br>+" + formatWhole(tmp.l5.challenges[this.id].countcalc.sub(player.l5.chalcomp[6]).max(0)) + " 完成次数<br>下一次在" + format(tmp.l5.challenges[this.id].getNextAt) + "点数" : ""; return "中子素锭获取x" + format(this.effect()) + "<br>完成次数：" + formatWhole(player.l5.chalcomp[6]) + a },
            effect() { return player.l5.chalcomp[6].pow_base(3).pow(buyableEffect('l8', 1165)) },
            countcalc() {
                let x = player.points.div('e944944').max(1).log('1e125000').max(0).root(3).add(1)
                if (player.points.lte('e944944')) return n(0)
                return x.floor()
            },
            getNextAt() {
                let amt = tmp.l5.challenges[this.id].countcalc.max(player.l5.chalcomp[6])
                let next = Decimal.pow('1e125000', amt.pow(3)).mul('e944944')
                return next
            },
            onExit(){ 
                player.l5.chalcomp[6] = tmp.l5.challenges[this.id].countcalc.floor().max(player.l5.chalcomp[6])
                player.l5.c6punishment = n(0)
            },
            onEnter() {
                updateTemp()
                layerDataReset("l3",true)
                updateTemp()
                layerDataReset("l2",true)
                updateTemp()
                layerDataReset("l1",true)
                updateTemp()
            },
            style() {
                return { 'border-color': inChallenge('l5', this.id) ? '#ff0000' : '#ff9c9c', 'background-color': inChallenge('l5', this.id) ? '#ff000070' : 'black', 'color': inChallenge('l5', this.id) ? '#ff0000':"#ff9c9c", 'shadow': inChallenge('l5', this.id) ? '0px 0px 24px #ff0000' : '' };
            },
            canEnter() {
                return !player.l8.voidShaped
            },
        },
    },
	unlocked() {return !(player.l8.baC.chal7doomed[4] > 0);},
});
