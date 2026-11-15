addLayer("l7", {
    infoboxes: {
        introBox: {
            title: "Layer 7",
            body() { return "本层由 user incremental 制作" },
        },
    },
    position: 2,
    symbol: 'N',
    name: "第七层 制作:user incremental",
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            points2: new Decimal(0),
            points3: new Decimal(0),
            infBlossom: new Decimal(0),
            total: new Decimal(0),
            neff1: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
            ncalc1: [n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0)],
            ntot1: new Decimal(0),
            nseed1: 0,
            nnow1: new Decimal(0),
            ntext1: "你还没有献出过中子素尘埃!",
            mergemode: 0,
            ntime1: new Decimal(0),
            neff2: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
            ncalc2: [n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0)],
            ntot2: new Decimal(0),
            nseed2: 0,
            nnow2: new Decimal(0),
            ntext2: "你还没有献出过中子素粒!",
            nnow3: new Decimal(0),
            neff3: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
            ncalc3: [n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0)],
            ntot3: new Decimal(0),
            nnow4: new Decimal(0),
            neff4: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
            ncalc4: [n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0)],
            ntot4: new Decimal(0),
            nseed3: 0,
            ntext3: "你还没有献出过中子素锭!",
            wg1: 1,
            wg2: 1,
            wg3: 1,
            blow3: 1,
            blowtrig: false,
            resetTime: n(0),
        };
    },
    row: 3,
    branches: ['l3'],
    hotkeys: [
        { key: "7", description: "7：进行第七层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    color: "#5a5a5a",
    requires: new Decimal(1e64),
    resource: "中子素尘埃",
    baseResource: "奇点",
    baseAmount() { return player.l3.sing },
    type: "normal",
    exponent() {
        let base = 0.15
        if (player.l7.neff3[3]) base += (player.l7.ncalc3[3].toNumber())
        return base
    },
    gainMult() {
        let mult = new Decimal(1)
        if(hasMilestone("l7",0)) mult = mult.times(player.l7.ntime1.add(1).pow(player.l7.ntime1.add(1).log10().div(5).add(0.4)))
        if(hasMilestone("l7",1)) mult = mult.times(player.l7.ntot1.add(1).log10().pow(2).max(1))
        if(player.l7.neff2[7]) mult = mult.times(player.l7.ncalc2[7])
        if(hasMilestone("l7",3)) mult = mult.times(player.l7.points2.add(1).pow(0.5).max(1))
        if(hasMilestone('l4', 37)||layers.l4.total_bars().gte(3666)) mult = mult.times(layers.l4.total_bars().div(10).add(1))
        mult = mult.mul(buyableEffect('l8', 1161));
		if(hasMilestone('l8', 13)) mult = mult.mul(tmp.l8.milestones[13].effect);
		return mult
    },
    gainExp() {
        let base = new Decimal(1);
		if(hasUpgrade('l8', 11)) base = base.mul(player.l8.tuning[7].div(10));
		return base;
    },
	getResetGain() {
		let layer = 'l7';
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).mul(tmp[layer].gainMult).pow(tmp[layer].gainExp)
		if (gain.gte(tmp[layer].softcap)) gain = gain.pow(tmp[layer].softcapPower).mul(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower)))
		gain = gain.mul(tmp[layer].directMult)
	
		if(player.l8.erosion.run[6]) gain = gain.max(1).log10().pow(layers.l8.erosionEff(6)).pow_base(10);
		return gain.floor().max(0);
	},
	softcap: n('e1300'),
	softcapPower: n(1 / 5),
    passiveGeneration() {
        let mult = 0
		if(hasMilestone('l8', 13)) mult = 0.1;
        return mult
    },
    doReset(a) {
        if (a == "l7") {
            let keepSing = player.l3.sing;
            let keepSecondCore = player.l3.storedSecondCore;
            if (hasMilestone("l4", 14)) {
                layerDataReset("l1", ["upgrades", "milestones"]);
                layerDataReset("l2", ["upgrades", "milestones"]);
                layerDataReset("l3", ["upgrades", "milestones"]);
            } else {
                if (hasMilestone("l4", 10) || player.l4.points.gte(10)) layerDataReset("l1", ["upgrades"]); else layerDataReset("l1");
                if (hasMilestone("l4", 11) || player.l4.points.gte(100)) layerDataReset("l2", ["upgrades"]); else layerDataReset("l2");
                if (hasMilestone("l4", 12) || player.l4.points.gte(1e4)) layerDataReset("l3", ["upgrades"]); else layerDataReset("l3");
            }
            if (hasUpgrade("l4", 11)) player.l3.sing = keepSing;
            if (hasMilestone("l4", 15)) setBuyableAmount('l2', 12, player.l3.storedSecondCore = keepSecondCore);
            player.points = new Decimal(0);
        }
    },
    layerShown() { return hasUpgrade('l6', 121) || player.l7.unlocked },
    tabFormat: {
        "主页": {
            "content": [
                ["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function () {
                    return `<p style="color:#5a5a5a">这太沉重了!本层级重置效果等同于攻击力重置</p>`
                }],
                "blank",
                ["clickables",[1,2]],
                "blank",
                ["display-text", function () {
                    return `<p style="font-size:25px;text-shadow: 0 0 15px #fdfdfd;">`+player.l7.ntext1+`</p>`
                }],
                "blank",
                ["display-text", function () {
                    return `天穹总共收到了<b style="color:#5a5a5a">${formatWhole(player.l7.ntot1)}</b>中子素尘埃`
                }],
                "blank",
                ["clickables",[3]]
            ]
        },
        "中子素粒": {
            "content": [
                ["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function () {
                    return `你有 <h2 style="color:#3c3c3c;background:linear-gradient(#000000,#2b2b2b);text-shadow:0 0 5px #d8d8d8;background-clip: text;-webkit-background-clip: text">${format(player.l7.points2)}</h2> 中子素粒`
                }],
                ["display-text", function () {
                    return `<p style="color:#3c3c3c;background:linear-gradient(#000000,#2b2b2b);text-shadow:0 0 2px #d8d8d8;background-clip: text;-webkit-background-clip: text">它已经开始影响到周围的时间....</p>`
                }],
                "blank",
                ["clickables",[1,2]],
                "blank",
                ["display-text", function () {
                    return `<p style="font-size:25px;text-shadow: 0 0 15px #fdfdfd;">`+player.l7.ntext2+`</p>`
                }],
                "blank",
                ["display-text", function () {
                    return `天穹总共收到了<b style="color:#5a5a5a">${formatWhole(player.l7.ntot2)}</b>中子素粒`
                }],
            ],
            unlocked(){return hasMilestone("l7",2)},
        },
        "中子素锭": {
            "content": [
                ["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function () {
                    return `你有 <h2 style="color:#000000;background:linear-gradient( #000000, #d5d5d5);text-shadow:0 0 `+`${format(player.l7.blow3)}px`+` #ffffff;background-clip: text;-webkit-background-clip: text">${format(player.l7.points3)}</h2> 中子素锭`
                }],
                ["display-text", function () {
                    return `<p style="color:#000000;background:linear-gradient( #000000, #d5d5d5);text-shadow:0 0 `+`${format(player.l7.blow3)}px`+` #ffffff;background-clip: text;-webkit-background-clip: text">它闪烁的光芒弯曲了时光</p>`
                }],
                "blank",
                ["clickables",[1,2]],
                "blank",
                ["display-text", function () {
                    return `<p style="font-size:25px;text-shadow: 0 0 15px #fdfdfd;">`+player.l7.ntext3+`</p>`
                }],
                "blank",
                ["display-text", function () {
                    return `天穹总共收到了<b style="color:#000000;text-shadow:0 0 `+`${format(player.l7.blow3)}px`+` #ffffff">${formatWhole(player.l7.ntot3)}</b>中子素锭`
                }],
            ],
            unlocked(){return hasMilestone("l7",6)},
        },
        "无尽催化剂": {
            "content": [
                ["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function () {
                    return `你有 <h2 class="infBlossom">${format(player.l7.points4)}</h2> <b class="infBlossom">无尽催化剂</b>`
                }],
                "blank",
                ["display-text", function () {
                    return `<p class="infBlossom">但天穹无法承担如此之重,所以你还合成不了它,也许以后才有用?</p>`
                }],
                "blank",
                ["display-text", function () {
                    return `天穹总共收到了 <b class="infBlossom">${format(player.l7.ntot4)}</b> <b class="infBlossom">无尽催化剂</b>`
                }],
            ],
            unlocked(){return hasMilestone("l7",11)},
        },
        "里程碑": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "blank",
                "milestones"
            ]
        },
    },
    getNuggetMult(){
        let mult = n(1)
        mult = mult.mul(layers.l5.challenges[31].effect())
		if(hasMilestone('l8', 15)) mult = mult.mul(tmp.l8.milestones[15].effect);
        return mult
    },
    getIngotMult(){
        let mult = n(1)
        mult = mult.mul(layers.l5.challenges[32].effect())
		if(hasMilestone('l8', 20)) mult = mult.mul(tmp.l8.milestones[20].effect);
        return mult
    },
    calceff1(){
        let eff = n(1)
        player.l7.neff1 = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
        player.l7.ncalc1 = [n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0)]
        let s = hasMilestone('l8', 8)
		? [1,2,3,4,5,6,7,9,10,11,12,13]
		: chooseFromArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],player.l7.wg1)
        if(s==0) return
        let t = ""
        let t1=``
        for(i = 0; i<=20; i++){
            player.l7.neff1[i] = false
            player.l7.ncalc1[i] = n(0)
        }
        for(i = 0; i<=player.l7.wg1-1; i++){
            t = layers.l7.eff1adjust(s[i])
            player.l7.neff1[s[i]] = true
            t1+=t
            t1+=`<br>`
        }
        player.l7.ntext1 = t1
    },
    calceff2(){
        let eff = n(1)
        player.l7.neff2 = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
        player.l7.ncalc2 = [n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0)]
        let s = hasMilestone('l8', 14)
		? [2,3,4,5,6,7,8,9,10,11,12,13,14]
		: chooseFromArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],player.l7.wg2)
        let t = ""
        let t2 = ``
        if(s==0) return
        for(i = 0; i<=20; i++){
            player.l7.neff2[i] = false
            player.l7.ncalc2[i] = n(0)
        }
        for(i = 0; i<=player.l7.wg2-1; i++){
            t = layers.l7.eff2adjust(s[i])
            player.l7.neff2[s[i]] = true
            t2+=t
            t2+=`<br>`
        }
        player.l7.ntext2 = t2
    },
    calceff3(){
        let eff = n(1)
        player.l7.neff3 = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
        player.l7.ncalc3 = [n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0),n(0)]
        let s = hasMilestone('l8', 19)
		? [1,2,3,4,5,6]
		: chooseFromArray([1,2,3,4,5,6,7,8,9],player.l7.wg3)
        let t = ""
        let t3 = ``
        if(s==0) return
        for(i = 0; i<=11; i++){
            player.l7.neff3[i] = false
            player.l7.ncalc3[i] = n(0)
        }
        for(i = 0; i<=player.l7.wg3-1; i++){
            t = layers.l7.eff3adjust(s[i])
            player.l7.neff3[s[i]] = true
            t3+=t
            t3+=`<br>`
        }
        player.l7.ntext3 = t3
    },
    eff1adjust(s){
        let t = ""
        let eff = n(1)
        if(s==1){
            eff = n("1e1000").pow(player.l7.nnow1.times(2).add(1).log10().pow(1.05))
            if(player.l7.neff2[14]) eff = eff.pow(player.l7.ncalc2[14])
            t = `本源天使让点数获取x${format(eff)}`
        }
        if(s==2){
            eff = n("1e400").pow(player.l7.nnow1.times(1.75).add(1).log10())
            if(player.l7.neff2[2]) eff = eff.pow(player.l7.ncalc2[2])
            t = `数据天使让数据获取x${format(eff)}`
        }
        if(s==3){
            eff = n(1e150).pow(player.l7.nnow1.times(1.5).add(1).log10().pow(0.9))
            if(player.l7.neff2[3]) eff = eff.pow(player.l7.ncalc2[3])
            t = `转生天使让转生点数获取x${format(eff)}`
        }
        if(s==4){
            eff = player.l7.nnow1.add(1).log10().pow(1.15).times(3)
            t = `核心天使赠送了${format(eff)}个免费核心等级(对于前两个效果)`
        }
        if(s==5){
            eff = player.l7.nnow1.pow(2).add(1).log10().pow(0.3).div(10).add(1)
            t = `增幅器天使让第五行增幅器效果^${format(eff)}`
        }
        if(s==6){
            eff = n(1e50).pow(player.l7.nnow1.add(1).log10().pow(0.8))
            if(player.l7.neff2[6]) eff = eff.pow(player.l7.ncalc2[6])
            t = `压缩天使让致密点数获取x${format(eff)}`
        }
        if(s==7){
            eff = n(3).pow(player.l7.nnow1.add(1).pow(1.25).log10())
            t = `奇点天使让奇点获取x${format(eff)}`
        }
        if(s==9){
            eff = n(1e5).pow(player.l7.nnow1.add(1).log10().times(2))
            if(player.l7.neff2[8]) eff = eff.pow(player.l7.ncalc2[8])
            t = `战斗天使让攻击力获取x${format(eff)}`
        }
        if(s==10){
            eff = player.l7.nnow1.add(1).log10().times(10).add(1).ln().div(100).min(0.4)
            t = `加载天使让对loader3229的伤害溢出弱化${format((n(1).minus(n(0.5).div(eff.add(0.5)))).times(100))}%`
        }
        if(s==11){
            eff = player.l7.nnow1.pow(n(100).pow(player.l7.nnow1.add(1).log10().div(100).add(1)))
            eff = eff.min('e1e6')
            if(player.l7.neff2[10]) eff = eff.pow(player.l7.ncalc2[10])
            t = `飞升天使让飞升点数价格/${format(eff)}`
        }
        if(s==12){
            eff = n(2).pow(player.l7.nnow1.times(5).pow(1.01)).add(1).log10().add(1)
            if(player.l7.neff3[5]) eff = eff.pow(player.l7.ncalc3[5])
            t = `精华天使让飞升精华获取x${format(eff)}`
        }
        if(s==13){
            eff = n(1000).pow(player.l7.nnow1.pow(0.5).add(1).log10().max(0))
            t = `次元天使让维度产量x${format(eff)}`
        }
        if(s>=14||s==8){
            t = `很抱歉,您的中子素被烧毁了`
        }
        player.l7.ncalc1[s] = eff
        return t
    },
    eff2adjust(s){
        let eff = n(1)
        let t = ""
        if(s==14){
            eff = player.l7.nnow2.add(1).log10().div(10).add(1)
            if(eff.gte(1.5)) eff = eff.minus(1.5).div(10).add(1.5)
            eff = eff.min(2.25)
            t = `本源大天使让本源天使效果^${format(eff)}`
        }
        if(s==2){
            eff = player.l7.nnow2.add(1).log10().div(15).add(1)
            if(eff.gte(1.5)) eff = eff.minus(1.5).div(10).add(1.5)
            eff = eff.min(2.25)
            t = `数据大天使让数据天使效果^${format(eff)}`
        }
        if(s==3){
            eff = player.l7.nnow2.add(1).log10().div(25).add(1)
            if(eff.gte(1.5)) eff = eff.minus(1.5).div(10).add(1.5)
            eff = eff.min(2.25)
            t = `转生大天使让转生天使效果^${format(eff)}`
        }
        if(s==4){
            eff = player.l7.nnow2.add(1).log10().add(1).pow(1.5).ln().times(1.5)
            if(eff.gte(10)) eff = eff.minus(10).div(3).add(10)
            t = `核心大天使赠送了${format(eff)}个免费二阶核心等级`
        }
        if(s==5){
            eff = player.l7.nnow2.add(1).log10().pow(0.5)
            if(eff.gte(3)) eff = eff.div(3).pow(0.5).times(3)
            t = `增幅器大天使让增幅器III-C效果^${format(eff)}`
        }
        if(s==6){
            eff = player.l7.nnow2.add(1).log10().div(50).add(1)
            if(eff.gte(1.5)) eff = eff.minus(1.5).div(10).add(1.5)
            eff = eff.min(2.25)
            t = `压缩大天使让压缩天使效果^${format(eff)}`
        }
        if(s==7){
            eff = n(1.5).pow(player.l7.nnow2.add(1).pow(0.75).log10())
            t = `奇点大天使让中子素尘埃获取x${format(eff)}`
        }
        if(s==8){
            eff = player.l7.nnow2.add(1).log10().div(100).add(1)
            if(eff.gte(1.5)) eff = eff.minus(1.5).div(10).add(1.5)
            eff = eff.min(2.25)
            t = `战斗大天使让战斗天使效果^${format(eff)}`
        }
        if(s==9){
            eff = player.l7.nnow2.add(1).log10().times(5).add(1).ln().div(100).min(0.4).add(1)
            t = `加载大天使让对loader3229的伤害指数增加${format(eff.minus(1).times(100))}%`
        }
        if(s==10){
            eff = player.l7.nnow2.add(1).pow(1.25).log10().div(50).add(1)
            if(eff.gte(1.5)) eff = eff.minus(1.5).div(10).add(1.5)
            eff = eff.min(2.25)
            t = `飞升大天使让飞升天使效果^${format(eff)}`
        }
        if(s==11){
            eff = n(1.5).pow(player.l7.nnow2.times(2).pow(1.01)).add(1).log10().add(1)
            t = `精华大天使让飞升之晶价格/${format(eff)}`
        }
        if(s==12){
            eff = n(1.01).pow(player.l7.nnow2.pow(2).add(1).log10().max(0))
            t = `次元大天使让维度数量x${format(eff)}`
        }
        if(s==13){
            eff = n(1.02).pow(player.l7.nnow2.pow(2).add(1).log10().max(0))
            if(eff.gte(10)) eff = eff.div(10).pow(0.1).times(10)
            eff = eff.min(1e10)
            if(player.l7.neff3[6]) eff = eff.pow(player.l7.ncalc3[6])
            t = `神圣大天使让游戏速度x${format(eff)}`
        }
        if(s>=15||s==1){
            t = `很抱歉,您的中子素被烧毁了`
        }
        player.l7.ncalc2[s] = eff
        return t
    },
    eff3adjust(s){
        let eff = n(1)
        let t = ""
        if(s==1){
            eff = player.l7.nnow3.add(1).log10().div(100).add(1).log10().add(1)
            if(eff.gte(1.2)) eff = eff.minus(1.2).div(330).add(1.2)
            eff = eff.min(1.5)
            t = `资源之神让前四层资源获取^${format(eff,3)}`
        }
        if(s==2){
            eff = player.l7.nnow3.add(1).ln().add(1).div(20).sqrt().add(1)
            if(eff.gte(2)) eff = eff.minus(2).div(10).add(2)
            eff = eff.min(10)
            t = `价格之神让飞升点数和遗迹价格开${format(eff)}次根`
        }
        if(s==3){
            eff = player.l7.nnow3.add(1).log10().add(1).log10().div(100)
            if(eff.gte(0.25)) eff = eff.minus(0.25).div(10).add(0.25)
            eff = eff.min(0.5)
            t = `奇点之神使中子素尘埃获取的指数+${format(eff,4)}`
        }
        if(s==4){
            eff = player.l7.nnow3.add(1).log10().add(1).div(10).add(1)
            if(eff.gte(2.5)) eff = eff.minus(2.5).add(1).log(1.5).div(5).add(2.5)
            eff = eff.min(5)
            t = `加载之神使所有攻击力加成^${format(eff)}`
        }
        if(s==5){
            eff = player.l7.nnow3.add(1).log10().add(1).pow(3).div(20).add(1)
            if(eff.gte(1.5)) eff = eff.div(1.5).pow(0.5).times(1.5)
            eff = eff.min(5)
            t = `飞升之神让精华天使效果^${format(eff)}`
        }
        if(s==6){
            eff = player.l7.nnow3.add(1).log10().div(5).add(1)
            if(eff.gte(2)) eff = eff.minus(2).div(100).add(2)
            eff = eff.min(5)
            t = `神圣之神让神圣大天使效果^${format(eff)}`
        }
        if(s>=7){
            t = `很抱歉,您的中子素被烧毁了`
        }
        player.l7.ncalc3[s] = eff
        return t
    },
    clickables: {
        11: {
            display() {
                return "1";
            },
            canClick() {
                return player.l7.mergemode != 1
            },
            onClick() {
                player.l7.mergemode = 1
            },
            unlocked(){return hasMilestone("l7",0)},
            style(){
                if(!this.canClick()) return {"background-color":"#22CC22","height":"30px","min-height":"30px","width":"30px","margin":"0px"}
                return {"color":"#FFFFFFCC","height":"30px","min-height":"30px","width":"30px","margin":"0px"}
            },
        },
        12: {
            display() {
                return "10%";
            },
            canClick() {
                return player.l7.mergemode != 2
            },
            onClick() {
                player.l7.mergemode = 2
            },
            unlocked(){return hasMilestone("l7",0)},
            style(){
                if(!this.canClick()) return {"background-color":"#22CC22","height":"30px","min-height":"30px","width":"30px","margin":"0px"}
                return {"color":"#FFFFFFCC","height":"30px","min-height":"30px","width":"30px","margin":"0px"}
            },
        },
        13: {
            display() {
                return "50%";
            },
            canClick() {
                return player.l7.mergemode != 3
            },
            onClick() {
                player.l7.mergemode = 3
            },
            unlocked(){return hasMilestone("l7",0)},
            style(){
                if(!this.canClick()) return {"background-color":"#22CC22","height":"30px","min-height":"30px","width":"30px","margin":"0px"}
                return {"color":"#FFFFFFCC","height":"30px","min-height":"30px","width":"30px","margin":"0px"}
            },
        },
        14: {
            display() {
                return "100%";
            },
            canClick() {
                return player.l7.mergemode != 4
            },
            onClick() {
                player.l7.mergemode = 4
            },
            unlocked(){return hasMilestone("l7",0)},
            style(){
                if(!this.canClick()) return {"background-color":"#22CC22","height":"30px","min-height":"30px","width":"30px","margin":"0px"}
                return {"color":"#FFFFFFCC","height":"30px","min-height":"30px","width":"30px","margin":"0px"}
            },
        },
        21: {
            display() {
                return "献上中子素"
            },
            canClick() {
                return true
            },
            onClick() {
                doReset("l7")
                let q = player.subtabs.l7.mainTabs
                let ratio = 0
                if(q == "主页"){
                    if(player.l7.points.lte(0)){
                        player.l7.points = n(0)
                        return
                    }
                    if(player.l7.mergemode==2){
                        ratio = 0.1
                    }
                    if(player.l7.mergemode==3){
                        ratio = 0.5
                    }
                    if(player.l7.mergemode==4){
                        ratio = 1
                    }
                    player.l7.ntime1 = n(300)
                    player.l7.ntot1 = player.l7.ntot1.add(player.l7.points.times(ratio))
                    player.l7.nnow1 = player.l7.points.times(ratio)
                    if(!hasMilestone('l8', 29)) player.l7.points = player.l7.points.minus(player.l7.points.times(ratio))
                    player.l7.nseed1 = chooseFromArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],1)
                    if(player.l7.mergemode==1){
                        player.l7.points = player.l7.points.minus(1)
                        player.l7.ntot1 = player.l7.ntot1.add(1)
                        player.l7.nnow1 = n(1)
                    }
                    layers.l7.calceff1()
                }
                if(q == "中子素粒"){
                    if(player.l7.points2.lte(0)){
                        player.l7.points2 = n(0)
                        return
                    }
                    if(player.l7.mergemode==2){
                        ratio = 0.1
                    }
                    if(player.l7.mergemode==3){
                        ratio = 0.5
                    }
                    if(player.l7.mergemode==4){
                        ratio = 1
                    }
                    player.l7.ntot2 = player.l7.ntot2.add(player.l7.points2.times(ratio))
                    player.l7.nnow2 = player.l7.points2.times(ratio)
					if(player.l7.nnow2.gte(1e300)) player.l7.nnow2 = player.l7.nnow2.log10().div(3).sub(99).log10().add(100).mul(3).pow_base(10);
                    if(!hasMilestone('l8', 29)) player.l7.points2 = player.l7.points2.minus(player.l7.points2.times(ratio))
                    player.l7.nseed2 = chooseFromArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],1)
                    if(player.l7.mergemode==1){
                        player.l7.points2 = player.l7.points2.minus(1)
                        player.l7.ntot2 = player.l7.ntot2.add(1)
                        player.l7.nnow2 = n(1)
                    }
                    layers.l7.calceff2()
                    for(i = 1;i<=15;i++){
                        layers.l7.eff1adjust(i)
                    }    
                }
                if(q == "中子素锭"){
                    if(player.l7.points3.lte(0)){
                        player.l7.points3 = n(0)
                        return
                    }
                    if(player.l7.mergemode==2){
                        ratio = 0.1
                    }
                    if(player.l7.mergemode==3){
                        ratio = 0.5
                    }
                    if(player.l7.mergemode==4){
                        ratio = 1
                    }
                    player.l7.ntot3 = player.l7.ntot3.add(player.l7.points3.times(ratio))
                    player.l7.nnow3 = player.l7.points3.times(ratio)
					if(player.l7.nnow3.gte(1e20)) player.l7.nnow3 = player.l7.nnow3.log10().div(2).log10().add(9).mul(2).pow_base(10);
                    if(!hasMilestone('l8', 29)) player.l7.points3 = player.l7.points3.minus(player.l7.points3.times(ratio))
                    if(player.l7.mergemode==1){
                        player.l7.points3 = player.l7.points3.minus(1)
                        player.l7.ntot3 = player.l7.ntot3.add(1)
                        player.l7.nnow3 = n(1)
                    }
                    layers.l7.calceff3()
                    for(i = 1;i<=15;i++){
                        layers.l7.eff2adjust(i)
                    }    
                    for(i = 1;i<=15;i++){
                        layers.l7.eff1adjust(i)
                    }    
                }
            },
            unlocked(){return hasMilestone("l7",0)},
            style(){
                return {"color":"#FFFFFFCC","height":"30px","min-height":"30px","width":"80px","margin-top":"15px","border-radius":"0%"}
            },
        },
        22: {
            display() {
                return "合成下一阶中子素";
            },
            canClick() {
                return true
            },
            onClick() {
                doReset("l7")
                let ratio = 0
                let q = player.subtabs.l7.mainTabs
                if(q=="主页"){
                    if(player.l7.points.lt(1e10)) return
					if(player.l7.mergemode==0) return
                    if(player.l7.mergemode==1){
                        player.l7.points = player.l7.points.minus(1)
                        return
                    }
                    if(player.l7.mergemode==2){
                        ratio = 0.1
                    }
                    if(player.l7.mergemode==3){
                        ratio = 0.5
                    }
                    if(player.l7.mergemode==4){
                        ratio = 1
                    }
                    let base = 1.25
                    if(hasMilestone("l7",4)) base = 1.15
                    if(hasMilestone("l7",5)) base = 1.05
                    if(hasMilestone("l7",10)) base = 1.02
                    player.l7.points2 = player.l7.points2.add(player.l7.points.times(ratio).div(1e10).times(1.25).log(base).times(layers.l7.getNuggetMult()).floor().max(0).mul(buyableEffect('l8', 1162)));
                    player.l7.points = player.l7.points.minus(player.l7.points.times(ratio).mul(new Decimal(1).sub(buyableEffect('l8', 1163)))).max(0)
                }
                if(q=="中子素粒"){
                    if(player.l7.points2.lt(1e10)) return
					if(player.l7.mergemode==0) return
                    if(player.l7.mergemode==1){
                        player.l7.points2 = player.l7.points2.minus(1)
                        return
                    }
                    if(player.l7.mergemode==2){
                        ratio = 0.1
                    }
                    if(player.l7.mergemode==3){
                        ratio = 0.5
                    }
                    if(player.l7.mergemode==4){
                        ratio = 1
                    }
                    let base = 1.2
                    if(hasMilestone("l7",10)) base = 1.1
					let gain = player.l7.points2.times(ratio).div(1e10).times(1.25).log(base).times(layers.l7.getIngotMult()).floor().max(0).mul(buyableEffect('l8', 1162));
					if(gain.gte(9e15 * (hasUpgrade('l8', 73) ? 5 : 1))) gain = gain.div(1e15).add(1).log10().mul(9e15);
					player.l7.points3 = player.l7.points3.add(gain);
					player.l7.points2 = player.l7.points2.minus(player.l7.points2.times(ratio).mul(new Decimal(1).sub(buyableEffect('l8', 1163)))).max(0)
                }
            },
            unlocked(){
                let q = player.subtabs.l7.mainTabs
                let flg = false
                if(q == "主页" && hasMilestone("l7",2)) flg = true
                if(q == "中子素粒" && hasMilestone("l7",6)) flg = true
                return flg
            },
            style(){
                return {"color":"#FFFFFFCC","height":"30px","min-height":"30px","width":"80px","margin-top":"15px","border-radius":"0%"}
            },
        },
        31: {
            display() {
                return "手机QoL!长按快速获得中子素尘埃";
            },
            canClick() {
                return true
            },
            onHold() {
                doReset("l7")
            },
            unlocked(){return hasMilestone("l7",0)},
            style(){
                return {"color":"#FFFFFFCC","height":"80px","min-height":"80px","width":"80px","margin":"0px"}
            },
        },
    },
    update(diff) {
		if(player.l8.baC.chal7doomed[6] > 0) return;
		
        if(hasMilestone("l7",0)) player.l7.ntime1 = player.l7.ntime1.add(diff/3)
        if(hasMilestone("l7",4)) player.l7.wg1 = 2
        if(hasMilestone("l7",5)) player.l7.wg1 = 3
        if(hasMilestone("l7",10)) player.l7.wg2 = 2
		
		if(hasMilestone('l8', 7)) player.l7.wg1 = 5, player.l7.wg2 = 3;
		if(hasMilestone('l8', 8)) player.l7.wg1 = 12;
		if(hasMilestone('l8', 12)) player.l7.wg2 = 6, player.l7.wg3 = 3;
		if(hasMilestone('l8', 14)) player.l7.wg2 = 12;
		if(hasMilestone('l8', 16)) player.l7.wg3 = 6;
		
        if(hasMilestone("l7",6)){
            if(player.l7.blowtrig) player.l7.blow3 += 0.25
            else player.l7.blow3 -= 0.25
            if(player.l7.blow3 > 8) player.l7.blowtrig = false
            if(player.l7.blow3 < 2) player.l7.blowtrig = true
        }
		
		if(hasMilestone('l8', 15) && player.l7.points.gte(1e10))
		{
			let ratio = 1;
			let base = 1.25
			if(hasMilestone("l7",4)) base = 1.15
			if(hasMilestone("l7",5)) base = 1.05
			if(hasMilestone("l7",10)) base = 1.02
			player.l7.points2 = player.l7.points2.add(player.l7.points.times(ratio).div(1e10).times(1.25).log(base).times(layers.l7.getNuggetMult()).floor().max(0).mul(buyableEffect('l8', 1162)).mul(0.01).mul(diff));
		}
		if(hasMilestone('l8', 19) && player.l7.points2.gte(1e10))
		{
			let ratio = 1;
			let base = 1.2
			if(hasMilestone("l7",10)) base = 1.1
			let gain = player.l7.points2.times(ratio).div(1e10).times(1.25).log(base).times(layers.l7.getIngotMult()).floor().max(0).mul(buyableEffect('l8', 1162));
			if(gain.gte(9e15 * (hasUpgrade('l8', 73) ? 5 : 1))) gain = gain.div(1e15).add(1).log10().mul(9e15);
			let passive = n(0.00001);
			if(hasMilestone('l8', 22)) passive = passive.mul(tmp.l8.milestones[22].effect);
			if(hasUpgrade('l8', 83)) passive = passive.mul(3);
			if(hasAchievement('AC', 34)) passive = passive.mul(3);
			if(hasUpgradeCharged('l2', 12)) passive = passive.mul(run(layers.l2.upgrades[12].charged.effect, layers.l2.upgrades[12]));
			player.l7.points3 = player.l7.points3.add(gain.mul(passive).mul(diff));
		}
		
		if(hasMilestone('l8', 29))
		{
			let g2 = player.l7.points2;
			if(g2.gte(1e300)) g2 = g2.log10().div(3).sub(99).log10().add(100).mul(3).pow_base(10);
			let g3 = player.l7.points3;
			if(g3.gte(1e20)) g3 = g3.log10().div(2).log10().add(9).mul(2).pow_base(10);
			player.l7.nnow1 = player.l7.nnow1.max(player.l7.points);
			player.l7.nnow2 = player.l7.nnow2.max(g2);
			player.l7.nnow3 = player.l7.nnow3.max(g3);
			layers.l7.calceff3();
			layers.l7.calceff2();
			layers.l7.calceff1();
		}
    },
    milestones: {
        0: {
            requirementDescription: "1 中子素尘埃",
            done() { return player.l7.points.gte(1) || hasMilestone('l8', 2) }, // Used to determine when to give the milestone
            effectDescription() { return `你可以将中子素尘埃献给天穹了(将进行中子素重置),基于上次献出中子素尘埃到现在的时间增加中子素尘埃获取<br>Currently:x${format(this.effect())}` },
            effect(){return player.l7.ntime1.add(1).pow(player.l7.ntime1.add(1).log10().div(5).add(0.4))}
        },
        1: {
            requirementDescription: "10000 中子素尘埃",
            done() { return player.l7.points.gte(1e4) }, // Used to determine when to give the milestone
            effectDescription() { return `基于天穹收到的总中子素尘埃加成中子素尘埃获取<br>Currently:x${format(this.effect())}` },
            effect(){return player.l7.ntot1.add(1).log10().pow(2).max(1)}
        },
        2: {
            requirementDescription: "1e11 中子素尘埃",
            done() { return player.l7.points.gte(1e11) || hasMilestone('l8', 2) }, // Used to determine when to give the milestone
            effectDescription() { return `解锁中子素粒(需要至少1e10中子素尘埃),是时候让它们更有用了!` },
        },
        3: {
            requirementDescription: "10 中子素粒",
            done() { return player.l7.points2.gte(10) }, // Used to determine when to give the milestone
            effectDescription() { return `你应该意识到一次合成多个中子素粒要更费劲了, 基于中子素粒增加中子素尘埃获取<br>Currently:x${format(this.effect())}` },
            effect(){return player.l7.points2.add(1).pow(0.5).max(1)}
        },
        4: {
            requirementDescription: "1e8 中子素粒",
            done() { return player.l7.points2.gte(1e8) }, // Used to determine when to give the milestone
            effectDescription() { return `合成中子素粒的底数1.25→1.15, 并可以同时激活两个天使效果` },
        },
        5: {
            requirementDescription: "1e26 中子素尘埃",
            done() { return player.l7.points.gte(1e26) }, // Used to determine when to give the milestone
            effectDescription() { return `合成中子素粒的底数1.15→1.05, 并可以同时激活三个天使效果` },
        },
        6: {
            requirementDescription: "1e11 中子素粒",
            done() { return player.l7.points2.gte(1e11) || hasMilestone('l8', 2) }, // Used to determine when to give the milestone
            effectDescription() { return `解锁中子素锭(需要至少1e10中子素粒), 每完成一次飞升挑战5就使维度数量+0.25` },
        },
        7: {
            requirementDescription: "1000 中子素锭",
            done() { return player.l7.points3.gte(1000) || hasMilestone('l8', 2) }, // Used to determine when to give the milestone
            effectDescription() { return `每秒自动获得100%重置可获取的攻击力` },
        },
        8: {
            requirementDescription: "1e20 中子素粒",
            done() { return player.l7.points2.gte(1e20) || hasMilestone('l8', 2) }, // Used to determine when to give the milestone
            effectDescription() { return `自动购买武器和防具` },
        },
        9: {
            requirementDescription: "1e50 中子素尘埃",
            done() { return player.l7.points.gte(1e50) }, // Used to determine when to give the milestone
            effectDescription() { return `解锁第六个飞升挑战` },
        },
        10: {
            requirementDescription: "1e100 中子素尘埃",
            done() { return player.l7.points.gte(1e100) }, // Used to determine when to give the milestone
            effectDescription() { return `合成中子素锭的底数1.2→1.1, 合成中子素粒的底数1.05→1.02, 你可以同时激活两个大天使效果, 终点就在眼前!` },
        },
        11: {
            requirementDescription: "1e7 中子素锭",
            done() { return player.l7.points3.gte(1e7) || hasMilestone('l8', 2) }, // Used to determine when to give the milestone
            effectDescription() { return `解锁下一层! 自动购买飞升精华可购买, 还有....<b class="infBlossom">世界于我手中</b>` },
        },
    },
	unlocked() {return !(player.l8.baC.chal7doomed[6] > 0);},
})
