"use strict";
//不要删掉上面这行
//passiveGeneration返回的数是普通的数，不用加Decimal/Decimal/PowiainaNum，因为超过1e308之后照样炸
addLayer("AC", {
    name: "ach",
    symbol: "Ac",
    startData() {
        return {
            unlocked: true,
            points: n(0),
            pause: 0,
            resetTime: n(0),
        }
    },
    color: "#ffdd33",
    resource: "成就",
    row: "side",
    devSpeedCal() {
        let dev = n(1)
        if(player.AC.pause==1)return n(0);
        if(inChallenge("l6",11)&&(!hasUpgrade("l6",101)))return n(0.001)
		if(player.l8.baC.chal4cache)
		{
			player.l8.baC.chal4cache = false;
			player.l8.baC.lastInjuredTime = n(0);
			return n(0.5);
		}
		if(inChallenge('l8', 22) && player.l8.baC.lastInjuredTime.lt(1)) return n(0.5);
        if(hasMilestone('l8', 11) && (inChallenge('l5', 31) || inChallenge('l5', 32))) return n(1);
        if(hasUpgrade("l6",101)) dev=dev.mul(10)
        if(hasUpgrade("l6",121)) dev=dev.mul(2)
        if(player.l7.neff2[13]) dev = dev.times(player.l7.ncalc2[13])
		if(hasUpgrade('l8', 14)) dev = dev.mul(tmp['l8'].bhEff);
		if(hasUpgrade('l8', 111)) dev = dev.mul(5);
        if(hasUpgrade("l1", 35)) dev = dev.mul(100)
		return dev.softcap(1e10, 0.1).min(1e100)
   },
    effectDescription() {
        return "使点数获取x" + format(tmp.AC.ach1)
    },
    ach1() {
        return n(1.025).pow(player.AC.points)
    },
    hotkeys:[
        { key: "p", description: "P：暂停游戏", onPress() { player.AC.pause=1-player.AC.pause} },
    ],
    achievementPopups: true,
    achievements: {
        11: {
            name: "复制器可以复制一切",
            done() { return hasUpgrade('l1', 12) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: "解锁复制器。",
            textStyle: { 'color': '#ffffff' },
        },
        12: {
            name: "来世再见",
            done() { return player.l2.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: "进行一次转生重置。",
            textStyle: { 'color': '#ff33eb' },
        },
        13: {
            name: '无违引力',
            done() { return player.l3.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '进行一次致密重置。',
            textStyle: { 'color': '#33f8ff' },
        },
        14: {
            name: '最后的压缩',
            done() { return player.l3.sing.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '获得奇点。',
            textStyle: { 'color': '#33f8ff' },
        },
        15: {
            name: '开始攻击',
            done() { return player.l4.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '进行一次攻击力重置。',
            textStyle: { 'color': '#ff8833' },
        },
        16: {
            name: '攻击提升',
            done() { return hasUpgrade("l4", 15) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '解锁武器。',
            textStyle: { 'color': '#ff8833' },
        },
        21: {
            name: '攻防结合',
            done() { return hasUpgrade("l4", 16) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '解锁防具。',
            textStyle: { 'color': '#FF8833' },
        },
        22: {
            name: '飞升天堂',
            done() { return player.l5.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '进行一次飞升重置。',
            textStyle: { 'color': '#FFDD33' },
        },
        23: {
            name: '提纯飞升',
            done() { return player.l5.essence.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '解锁飞升精华。',
            textStyle: { 'color': '#FFDD33' },
        },
        24: {
            name: '劫后余生',
            done() { return player.l6.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '进行一次遗迹重置。',
            textStyle: { 'color': '#006903' },
        },
        25: {
            name: '重力的秘密',
            done() { return player.l7.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '将大量奇点压缩成中子素尘埃，真的很重!',
            textStyle: { 'color': '#5a5a5a' },
        },
        26: {
            name: `<p class="infBlossom">世界于我手中</p>`,
            done() { return hasMilestone("l7",11) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '解锁无尽催化剂,很快天穹会被轰出一个大洞!',
        },
		31: {
			name: '触及高天',
			done() { return player.l8.total.gt(0) },
			onComplete() { player.AC.points = player.AC.points.add(1) },
			tooltip: '你已到达世界最远处，请立即原路返回。',
			textStyle: { 'color': 'red' },
		},
		32: {
			name: '统合智慧的意义',
			done() { return hasUpgrade('l8', 13) },
			onComplete() { player.AC.points = player.AC.points.add(1) },
			tooltip: '完成对世界本质的统合。',
			textStyle: { 'color': 'orange' },
		},
		33: {
			name: '神秘领域',
			done() { return hasUpgrade('l8', 15) },
			onComplete() { player.AC.points = player.AC.points.add(1) },
			tooltip: '超越生死的禁锢，打破时空的牢笼。',
			textStyle: { 'color': 'lightgreen' },
		},
		34: {
			name: '添砖加瓦',
			done() { return player.l8.brick.unlocked },
			onComplete() { player.AC.points = player.AC.points.add(1) },
			tooltip: '直面侵蚀。第二次砖重置的难度更高。<br>奖励：中子素锭被动获取x3',
			textStyle: { 'color': 'brown' },
		},
        35: {
			name: '虚空成形',
			done() { return player.l8.voidShaped },
			onComplete() { player.AC.points = player.AC.points.add(1) },
			tooltip: '你的到来是个错误',
			textStyle: { 'color': '#000000', 'text-shadow':'0px 0px 3px white' },
		},
    },
},
)