addLayer("l6", {
    infoboxes: {
        introBox: {
            title: "Layer 6",
            body() { return "本层由RAXH制作" },
        },
    },
    name: "第六层 制作：RAXH", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            repl: new Decimal(0),
            resetTime: n(0),
            dimt:new Decimal(1),
            dimnum:new Decimal(2),
            rpt:new Decimal(0),
            rp:new Decimal(0),
            tp:new Decimal(0),
        }
    },
    sPExp() {
        let base = n(0);
        return base;
    },
    doReset(resettingLayer) {
        let keep = []
        if (layers[resettingLayer].row > 3) layerDataReset("l6", keep)
    },
    color: "#008833",
    requires: new Decimal("e14930"), // Can be a function that takes requirement increases into account
    resource: "遗迹", // Name of prestige currency
    baseResource: "数据", // Name of resource prestige is based on
    baseAmount() { return player.l1.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 8.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let base = new Decimal(1);
        if (player.l7.neff3[2]) base = base.mul(player.l7.ncalc3[2])
        return base;
    },
	directMult() {
		let mult = n(1);
		mult = mult.mul(buyableEffect('l8', 1151));
		if(hasUpgrade('l8', 11)) mult = mult.mul(player.l8.tuning[6].div(10));
        return mult;
	},
	getResetGain() {
		let layer = 'l6';
		if ((!tmp[layer].canBuyMax) || tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalOne
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).div(tmp[layer].gainMult).max(1).log(tmp[layer].base).mul(tmp[layer].gainExp).pow(Decimal.pow(tmp[layer].exponent, -1))
		gain = gain.mul(tmp[layer].directMult)
	
		if(player.l8.erosion.run[5]) gain = gain.max(1).log10().pow(layers.l8.erosionEff(5)).pow_base(10);
		return gain.floor().sub(player[layer].points).add(1).max(1);
	},
	canBuyMax() {return hasMilestone('l8', 3);},
    passiveGeneration() {
        let mult = 0
        return mult
    },
    update(diff){
        if(player.l6.points.gte(66)) player.l6.points = n(66)
		if(player.l8.baC.chal7doomed[5] > 0) return;
		
        let tdimnum=new Decimal(2)
        if(hasUpgrade("l6",11))player.l6.dimt=player.l6.dimt.add(layers.l6.diff(diff))
        if(hasUpgrade("l6",13)&&tdimnum.lt(new Decimal(3)))tdimnum=new Decimal(3)
        if(hasUpgrade("l6",14)&&tdimnum.lt(new Decimal(4)))tdimnum=new Decimal(4)
        if(hasUpgrade("l6",15))tdimnum=tdimnum.add(upgradeEffect('l6', 15))
        if(hasUpgrade("l6",21))tdimnum=tdimnum.add(upgradeEffect('l6', 21))
        if(hasUpgrade("l6",32))tdimnum=tdimnum.add(upgradeEffect('l6', 32))
        if(hasUpgrade("l6",33))tdimnum=tdimnum.add(upgradeEffect('l6', 33))
        if(hasUpgrade("l6",34))tdimnum=tdimnum.add(upgradeEffect('l6', 34))
        if(hasUpgrade("l6",24))tdimnum=tdimnum.add(new Decimal(1))
        if(hasMilestone("l7",6))tdimnum=tdimnum.add(player.l5.chalcomp[5].times(0.25))
        if(player.l7.neff2[12]) tdimnum=tdimnum.times(player.l7.ncalc2[12])
        tdimnum = tdimnum.add(buyableEffect('l8', 1153));
		tdimnum = tdimnum.mul(buyableEffect('l8', 1154));
		if(player.l6.dimnum.lt(tdimnum))player.l6.dimnum=tdimnum
		if(hasMilestone('l8', 10) && player.l1.points.gte(tmp.l6.nextAt)) player.l6.points = player.l6.points.add(tmp.l6.resetGain);
    },
    diff(tmpdiff){
        let diff=n(1);
        if(hasUpgrade("l6",23))diff=diff.mul(upgradeEffect('l6', 23))
        if (hasMilestone('l4', 36))diff=diff.mul(3)
        if(hasUpgrade("l6",31))diff=diff.mul(upgradeEffect('l6', 31))
        if(hasUpgrade("l6",35))diff=diff.mul(upgradeEffect('l6', 35))
        if(hasUpgrade("l6",103))diff=diff.mul(upgradeEffect('l6', 103))
        if(player.l7.neff1[13]) diff=diff.mul(player.l7.ncalc1[13])
		diff = diff.mul(buyableEffect('l8', 1152));
        tmpdiff=n(tmpdiff).mul(diff)
        return tmpdiff
    },
    getdim(x)
	{   
        if(x<0)return new Decimal(0);
		let y = new Decimal(x).add(1);
		let N = y.gamma();
		return player.l6.dimt.pow(x).div(N);
	},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "6", description: "6：进行第六层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    upgrades: {
        0:{
            title:"维度",
            description:"解锁遗迹维度",
            cost:2,
            unlocked(){return true},
        },
        1:{
            title:"树？",
            description:"解锁CT(Chal-Tree)",
            cost:3,
            unlocked(){return hasUpgrade("l6",35)},
        },
        11:{
            title:"时间",
            description:"时间开始流动",
            cost:2,
            unlocked(){return hasUpgrade("l6",0)},
        },
        12:{
            title:"能量共振",
            description:"能量增幅点数",
            cost:2,
            effect() {
                if (!hasUpgrade('l6', 12)) return n(1)
                let eff = layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).pow(100)
                eff=Softcap(eff,new Decimal("e100"),0.8,0,0)
                eff=Softcap(eff,new Decimal("e500"),0.3,0,0)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            unlocked(){return hasUpgrade("l6",11)},
        },
        13:{
            title:"第二维度",
            description:"解锁第二遗迹维度",
            cost:3,
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",12)},
        },
        14:{
            title:"第三维度",
            description:"解锁第三遗迹维度<br>需求：1000能量",
            cost:0,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(1000))
            },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",13)},
        },
        15:{
            title:"能量维度",
            description:"能量提升维度数量<br>需求：6000能量",
            cost:0,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(6000))
            },
            effect() {
                if (!hasUpgrade('l6', 15)) return n(0)
                let eff = layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).max(1).log(2).root(3).div(6)
                eff=Softcap(eff,new Decimal("2"),0.4,0,0)
                eff=Softcap(eff,new Decimal("3"),0.2,0,0)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",14)},
        },
        21:{
            title:"第一维度维度",
            description:"第一维度提升维度数量<br>需求：300000能量",
            cost:0,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(300000))
            },
            effect() {
                if (!hasUpgrade('l6', 21)) return n(0)
                let eff = layers.l6.getdim(player.l6.dimnum.sub(new Decimal(2))).max(1).log(3).root(3).div(6)
                eff = eff.pow(buyableEffect('l8', 1155));
				eff=Softcap(eff,new Decimal("2"),0.4,0,0)
                eff=Softcap(eff,new Decimal("3"),0.2,0,0)
                eff=Softcap(eff,new Decimal("1e60"),0.03,0,0)
				return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",15)},
        },
        22:{
            title:"攻击加成",
            description:"能量加成攻击力获取<br>需求：2000000能量",
            cost:3,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(2000000))
            },
            effect() {
                if (!hasUpgrade('l6', 22)) return n(1)
                let eff = layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).max(1).root(2)
                eff=Softcap(eff,new Decimal("e10"),0.8,0,0)
                eff=Softcap(eff,new Decimal("e50"),0.5,0,0)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",21)},
        },
        23:{
            title:"速度加成",
            description:"所有维度的生产速度x10<br>需求：5000000能量",
            cost:3,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(5000000))
            },
            effect() {
                if (!hasUpgrade('l6', 23)) return n(1)
                let eff = n(10)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",22)},
        },
        24:{
            title:"新维度",
            description:"额外多获得一个维度<br>需求：1e11能量",
            cost:0,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(1e11))
            },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",23)&&hasMilestone("l4",35)},
        },
        25:{
            title:"反加成",
            description:"能量加成维度生产速度<br>需求：3e12能量",
            cost:3,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(3e12))
            },
            effect() {
                if (!hasUpgrade('l6', 25)) return n(1)
                let eff = layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).max(1).log(1.4).root(1.8).div(3).add(1)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",24)},
        },
        31:{
            title:"正加成",
            description:"维度数量加成维度生产速度<br>需求：1e15能量",
            cost:3,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(1e15))
            },
            effect() {
                if (!hasUpgrade('l6', 25)) return n(1)
                let eff = player.l6.dimnum.max(1).pow(2).add(1)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",25)},
        },
        32:{
            title:"第二维度维度",
            description:"第二维度加成维度数量<br>需求：1e20能量",
            cost:3,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(1e20))
            },
            effect() {
                if (!hasUpgrade('l6', 32)) return n(0)
                let eff = layers.l6.getdim(player.l6.dimnum.sub(new Decimal(3))).max(1).log(2.5).root(3).div(5)
                eff=Softcap(eff,new Decimal("2"),0.4,0,0)
                eff=Softcap(eff,new Decimal("3"),0.2,0,0)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",31)},
        },
        33:{
            title:"第三维度维度",
            description:"第三维度加成维度数量<br>需求：1e24能量",
            cost:3,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(1e24))
            },
            effect() {
                if (!hasUpgrade('l6', 32)) return n(0)
                let eff = layers.l6.getdim(player.l6.dimnum.sub(new Decimal(4))).max(1).log(2.2).root(2.5).div(4.5)
                eff=Softcap(eff,new Decimal("2"),0.4,0,0)
                eff=Softcap(eff,new Decimal("3"),0.2,0,0)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",32)},
        },
        34:{
            title:"维度维度维度",
            description:"维度数量加成维度数量<br>需求：1e31能量",
            cost:3,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(1e31))
            },
            effect() {
                if (!hasUpgrade('l6', 32)) return n(0)
                let eff = player.l6.dimnum.div(10)
                eff=Softcap(eff,new Decimal("2"),0.6,0,0)
                eff=Softcap(eff,new Decimal("3"),0.5,0,0)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            onPurchase() {
                player.l6.dimt = new Decimal(1)
            },
            unlocked(){return hasUpgrade("l6",33)},
        },
        35:{
            title:"回主页看看",
            description:"解锁新的解锁器，并且维度生产速度x5<br>需求：1e41能量",
            cost:3,
            canAfford(){
                return layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).gte(new Decimal(1e41))
            },
            effect() {
                if (!hasUpgrade('l6', 32)) return n(0)
                return n(5)
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            unlocked(){return hasUpgrade("l6",34)},
        },
        41: {
            title: "攻击遗迹I",
            description: "获取一个遗迹碎片<br>e278攻击力",
            cost: new Decimal(0),
            canAfford() {return player.l4.points.gte(new Decimal(1e278)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[41].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 41)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 41)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        42: {
            title: "攻击遗迹II",
            description: "获取一个遗迹碎片<br>e290攻击力",
            cost: new Decimal(0),
            canAfford() {return player.l4.points.gte(new Decimal(1e290)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[42].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 42)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 42)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        43: {
            title: "试炼遗迹I",
            description: "获取一个遗迹碎片<br>74.5试炼点数",
            cost: new Decimal(0),
            canAfford() {return player.l6.tp.gte(new Decimal(74.5)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[43].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 43)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 43)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        44: {
            title: "点数遗迹I",
            description: "获取一个遗迹碎片<br>e48500点数",
            cost: new Decimal(0),
            canAfford() {return player.points.gte(new Decimal("e48500")) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[44].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 44)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 44)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        45: {
            title: "试炼遗迹II",
            description: "获取一个遗迹碎片<br>99试炼点数",
            cost: new Decimal(0),
            canAfford() {return player.l6.tp.gte(new Decimal(99)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[45].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 45)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 45)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        41.1: {
            title: "点数遗迹II",
            description: "获取一个遗迹碎片<br>e63390点数",
            cost: new Decimal(0),
            canAfford() {return player.points.gte(new Decimal("e63390")) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[41.1].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 41.1)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 41.1)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        42.1: {
            title: "飞升遗迹I",
            description: "获取一个遗迹碎片<br>88飞升点数",
            cost: new Decimal(0),
            canAfford() {return player.l5.points.gte(new Decimal("88")) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[42.1].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 42.1)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 42.1)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        43.1: {
            title: "点数遗迹III",
            description: "获取一个遗迹碎片<br>e80300点数",
            cost: new Decimal(0),
            canAfford() {return player.points.gte(new Decimal("e80300")) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[43.1].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 43.1)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 43.1)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        44.1: {
            title: "点数遗迹IV",
            description: "获取一个遗迹碎片<br>e91000点数",
            cost: new Decimal(0),
            canAfford() {return player.points.gte(new Decimal("e91000")) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[44.1].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 44.1)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 44.1)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        45.1: {
            title: "飞升遗迹II",
            description: "获取一个遗迹碎片<br>99飞升点数",
            cost: new Decimal(0),
            canAfford() {return player.l5.points.gte(new Decimal("99")) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[45.1].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 45.1)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 45.1)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        41.2: {
            title: "点数遗迹IV",
            description: "获取一个遗迹碎片<br>e114514点数",
            cost: new Decimal(0),
            canAfford() {return player.points.gte(new Decimal("e114514")) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[41.2].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 41.2)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 41.2)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        42.2: {
            title: "飞升遗迹III",
            description: "获取一个遗迹碎片<br>140飞升点数",
            cost: new Decimal(0),
            canAfford() {return player.l5.points.gte(new Decimal("140")) },
            unlocked() { return player.l7.unlocked },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[42.2].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 42.2)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 42.2)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        43.2: {
            title: "攻击遗迹III",
            description: "获取一个遗迹碎片<br>1e1500攻击力",
            cost: new Decimal(0),
            canAfford() {return player.l4.points.gte(new Decimal("1e1500")) },
            unlocked() { return player.l7.unlocked },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[43.2].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 43.2)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 43.2)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        44.2: {
            title: "攻击遗迹IV",
            description: "获取一个遗迹碎片<br>1e3000攻击力",
            cost: new Decimal(0),
            canAfford() {return player.l4.points.gte(new Decimal("1e3000")) },
            unlocked() { return player.l7.unlocked },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[44.2].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 44.2)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 44.2)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        45.2: {
            title: "飞升遗迹IV",
            description: "获取一个遗迹碎片<br>324飞升点数",
            cost: new Decimal(0),
            canAfford() {return player.l5.points.gte(new Decimal(324)) },
            unlocked() { return player.l7.unlocked },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[45.2].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 45.2)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 45.2)) cc = "#000000"
                    return cc
                }
            },
            onPurchase() {
                player.l6.rpt = player.l6.rpt.add(1)
                player.l6.rp = player.l6.rp.add(1)
            },
        },
        51: {
            title: "挑战I-I",
            description: "开启遗迹试炼",
            cost: new Decimal(1),
            
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[51].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 51)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 51)) cc = "#000000"
                    return cc
                }
            },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        61: {
            title: "挑战II-I",
            description: "基于试炼点数提升攻击力且弱化遗迹试炼效果",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&hasUpgrade("l6",51) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[61].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 61)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 61)) cc = "#000000"
                    return cc
                },
            },
            effect() {
                if (!hasUpgrade('l6', 61)) return n(0)
                let eff = player.l6.tp.max(1).pow(4)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        62: {
            title: "挑战II-II",
            description: "基于飞升点数提升攻击力乘数",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&hasUpgrade("l6",51) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[62].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 62)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 62)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 62)) return n(1)
                let eff = player.l5.points.max(1).log(4).div(10).add(1)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        71: {
            title: "挑战III-I",
            description: "基于飞升点数提升点数",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",61)||hasUpgrade("l6",62)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[71].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 71)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 71)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 71)) return n(1)
                let eff = player.l5.points.max(1).log(2).div(15).add(1)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        81: {
            title: "挑战IV-I",
            description: "解锁通向下一行的大门,嗯对",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",71)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[81].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 81)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 81)) cc = "#000000"
                    return cc
                }
            },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        91: {
            title: "挑战V-I",
            description: "基于飞升点数削弱遗迹试炼效果3底数",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",81)) },
            unlocked() { return hasUpgrade("l6", 0) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[91].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 91)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 91)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 91)) return n(0)
                let eff = player.l5.points.log(6).root(3).div(10)
                return eff
            },
            effectDisplay() { let a = "-" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        92: {
            title: "挑战V-II",
            description: "基于遗迹加成点数",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",81)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[92].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 92)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 92)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 92)) return n(1)
                let eff = player.l6.points.log(3).root(2).div(10).add(1)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        93: {
            title: "挑战V-III",
            description: "基于飞升点数加成数据",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",81)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[93].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 93)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 93)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 93)) return n(1)
                let eff = player.l5.points.max(1).log(4).root(3).div(10).add(1)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        101: {
            title: "挑战VI-I",
            description: "移除削弱试炼遗迹效果5且在遗迹试炼外全局速度x10",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",91)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[101].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 101)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 101)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 101)) return n(1)
                let eff = n(10)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        102: {
            title: "挑战VI-II",
            description: "奇点加成飞升精华获取",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",92)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[102].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 102)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 102)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 102)) return n(1)
                let eff = player.l3.sing.max(1).log(2).pow(2).add(1)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        103: {
            title: "挑战VI-III",
            description: "试炼点数加成维度获取",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",93)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[103].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 103)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 103)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 103)) return n(1)
                let eff = player.l6.tp.pow(3)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        111: {
            title: "挑战VII-I",
            description: "能量增强攻击力",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",101)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[111].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 111)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 111)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 111)) return n(1)
                let eff = layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))).root(1.5)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        112: {
            title: "挑战VII-II",
            description: "攻击力增强致密点数获取",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",102)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[112].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 112)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 112)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 112)) return n(1)
                let eff = player.l4.points.root(3)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        113: {
            title: "挑战VII-III",
            description: "致密点数增强飞升精华获取",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&(hasUpgrade("l6",103)) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[113].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 113)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 113)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 113)) return n(1)
                let eff = player.l3.points.max(1).log(1.6)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
        121: {
            title: "挑战VIII-I",
            description: "解锁下一层且游戏速度x2<br>需求：第七行至少两个升级",
            cost: new Decimal(1),
            canAfford() {return player.l6.rp.gte(1)&&((hasUpgrade("l6",111)&&hasUpgrade("l6",112))||(hasUpgrade("l6",111)&&hasUpgrade("l6",113))||(hasUpgrade("l6",112)&&hasUpgrade("l6",113))) },
            unlocked() { return hasUpgrade("l6", 1) },
            style: {
                "border-color": "#008833", "border-radius": "2%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l6.upgrades[121].canAfford) bg = "#003911"
                    if (hasUpgrade("l6", 121)) bg = "#00aa33"
                    return bg
                }, "color"() {
                    let cc = "#00ff33"
                    if (hasUpgrade("l6", 121)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l6', 121)) return n(1)
                let eff = n(2)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            currencyDisplayName: "遗迹碎片",
            currencyInternalName: "rp",
            currencyLayer: "l6",
        },
    },
    clickables:{
        11: {
            display() { return `重置Chal-Tree` },
            style: { "height": "30px", "width": "500px", "background-color": "#003311", "border-radius": "0%", "border": "2px solid", "border-color": "#00bb55", "color": "#00bb55", "text-shadow": "0 0 15px #00bb55", "font-size": "15px" },
            unlocked() { return hasUpgrade("l2", 25) },
            onClick() {
                player.l6.upgrades = player.l6.upgrades.filter(n => n < 50)
                player.l6.rp = player.l6.rpt
            },
            canClick() { return true }
        },
    },
    challenges: {
        11: {
            name: "遗迹试炼",
            completionLimit: 1,
            challengeDescription() { return (inChallenge('l6', 11) ? ('将获得的试炼点数：<h2 style="color: silver; text-shadow: 0px 0px 12px silver">' + formatWhole(player.points.log(10).root(2).mul(5).max(0)) + '</h2><br/>') : '') + "数据获取量的指数^" + format(layers.l6.challenges[11].dPower())+"<br>且你无法获得复制器<br>且弱化核心增益V<br>且点数弱化点数获取<br>且游戏速度减慢"},
            unlocked() { return hasUpgrade('l6', 51); },
            canComplete() {
                return false;
            },
            goal() {
                return n(10).pow(player.l6.tp.div(5).pow(2))
            },
            rewardDescription: "基于挑战内的点数获得试炼点数",
            onComplete() {
            },
            onEnter() {
                player.points = n(1);
                player.l1.points = n(0);
                player.l1.repl = n(0);
            },
            onExit() {
                player.l6.tp=player.l6.tp.max(player.points.log(10).root(2).mul(5).max(0))
            },
            style() {
                return { 'border-color': '#00ba37', 'background-color': 'black', 'color': 'white', 'background-image': 'radial-gradient(circle at center, black, #00ba37)', 'box-shadow': inChallenge('l6', 11) ? '0px 0px 24px silver' : '' };
            },
            dPower() {
                if(hasUpgrade("l6",61))return 0.15
                return 0.1;
            },
        },
    },
    tabFormat: {
        "解锁器": {
            content: [["infobox", "introBox"],
                "main-display",
                ["display-text", function(){return player.l6.points.gte(66)?`来自天穹的神秘力量将遗迹限制在66!`:``}],
                "prestige-button",
                "resource-display",
                ["row",[["upgrade",0],["upgrade",1]]],
            ],
        },
        "维度": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function(){return '能量：'+format(layers.l6.getdim(player.l6.dimnum.sub(new Decimal(1))))}],
                ["display-text", function(){return '第1维度：'+format(layers.l6.getdim(player.l6.dimnum.sub(new Decimal(2))))}],
                ["display-text", function(){return '第2维度：'+format(layers.l6.getdim(player.l6.dimnum.sub(new Decimal(3))))}],
                ["display-text", function(){return '第3维度：'+format(layers.l6.getdim(player.l6.dimnum.sub(new Decimal(4))))}],
                ["display-text", function(){if(player.l6.dimnum>4){return '……'}else{return ' '}}],
                ["display-text", function(){if(player.l6.dimnum>4){return '第'+format(player.l6.dimnum.sub(new Decimal(1)))+'维度：1'}else{return ' '}}],
                "blank",
                "blank",
                ["row",[["upgrade",11],["upgrade",12],["upgrade",13],["upgrade",14],["upgrade",15]]],
                ["row",[["upgrade",21],["upgrade",22],["upgrade",23],["upgrade",24],["upgrade",25]]],
                ["row",[["upgrade",31],["upgrade",32],["upgrade",33],["upgrade",34],["upgrade",35]]],
            ], unlocked() { return hasUpgrade('l6', 0) }
        },
        "CT": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function(){return '遗迹碎片获取'}],
                ["row",[["upgrade",41],["upgrade",42],["upgrade",43],["upgrade",44],["upgrade",45]]],
                ["row",[["upgrade",41.1],["upgrade",42.1],["upgrade",43.1],["upgrade",44.1],["upgrade",45.1]]],
                ["row",[["upgrade",41.2],["upgrade",42.2],["upgrade",43.2],["upgrade",44.2],["upgrade",45.2]]],
                "blank",
                ["display-text", function(){return '你共有'+format(player.l6.rpt)+'遗迹碎片'}],
                ["display-text", function(){return '你有'+format(player.l6.rp)+'遗迹碎片'}],
                "blank",
                "blank",
                ["row",[["clickable",11]]],
                "blank",
                ["row",[["upgrade",51]]],
                ["row",[["upgrade",61],["upgrade",62]]],
                ["row",[["upgrade",71]]],
                ["row",[["upgrade",81]]],
                ["row",[["upgrade",91],["upgrade",92],["upgrade",93]]],
                ["row",[["upgrade",101],["upgrade",102],["upgrade",103]]],
                ["row",[["upgrade",111],["upgrade",112],["upgrade",113]]],
                ["row",[["upgrade",121]]],
                "blank",
                ["display-text", function(){return '你有'+format(player.l6.tp)+'试炼点数'}],
                ["row",[["challenge",11]]],
            ], unlocked() { return hasUpgrade('l6', 1) }
        },
    },
    layerShown() { return hasUpgrade("l5",35) },
    autoUpgrade() { return hasMilestone('l8', 5); },
    resetsNothing() { return false },
	unlocked() {return !(player.l8.baC.chal7doomed[5] > 0);},
})