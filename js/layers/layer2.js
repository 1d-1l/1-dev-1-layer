addLayer("l2", {
    infoboxes: {
        introBox: {
            title: "欢迎来到第二层",
            body() { return "本层由 UserIncremental 制作！<br>欢迎加交流群：657445803" },
        },
    },
    tabFormat: {
        "主页": {
            content: [["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
            ["display-text", function () { return `核心增益I: 复制器获取变为^${formatSmall(buyableEffect("l2", 11)[0], 3)}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(buyableEffect("l2", 12)[0])})` : ``) }],
            ["display-text", function () { return hasUpgrade("l2", 23) ? `核心增益II: 转生点数获取x${formatSmall(buyableEffect("l2", 11)[1])}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(buyableEffect("l2", 12)[1])})` : ``) : `` }],
            ["display-text", function () { return getBuyableAmount('l2', 12).gt(0) ? `核心增益III: 奇点获取x${format(buyableEffect("l2", 12)[2])}` : `` }],
            ["display-text", function () { return hasMilestone('l4', 20) ? `核心增益IV: 第5行增幅器的效果^${format(tmp.l2.coreEffect4)}` : `` }],
            ["display-text", function () { return hasUpgrade('l4', 61) ? `核心增益V: 点数获取x${format(tmp.l2.coreEffect5)}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(tmp.l2.coreEffect5b)})` : ``) : `` }],
                "blank",
                ["buyables", [1]],
                "blank",
            ["upgrades", [1, 2, 3, 9, 10]],
            ],
        },
        "里程碑": {
            content: [
                "main-display", "blank",
                "milestones"
            ],
        },
        "增幅器": {
            content: [
                "main-display", "blank",
                ["display-text", function () { return `注意你一般只能购买一行中的一个增幅器!` }],
                "blank",
                ["clickables",[2]],
                "blank",
                ["upgrades", [4, 5, 6, 7, 8]]
            ], unlocked() { return hasUpgrade('l2', 25) }
        },
        "虚空核心": {
            content: [
                "main-display", "blank",
                ["buyables",[2]],
                ["clickables",[1]],
            ], unlocked() { return hasUpgrade('l2', 91) }
        },
    },
    name: "第二层 制作：[author]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            total: new Decimal(0),
            resetTime: n(0),
            wondervoid: n(0),
        }
    },
    doReset(resettingLayer) {
        let keep = [], km = [];
        if (player.l3.total.gte(1)) km.push(0);
        if (player.l3.total.gte(2)) km.push(1);
        if (player.l3.total.gte(8)) km.push(2);
        if (player.l3.total.gte(64)) km.push(3);
        if (player.l3.total.gte(1024)) km.push(4);
        if (player.l3.total.gte(32768)) km.push(5);
        if (hasMilestone("l4", 6)) keep.push("upgrades");
        if (hasMilestone("l4", 14) || hasMilestone('l8', 0)) keep.push("milestones");
        if (layers[resettingLayer].row > this.row) layerDataReset("l2", keep, km);
    },
    color: "#ff00c3",
    requires: new Decimal(1e4), // Can be a function that takes requirement increases into account
    resource: "转生点数", // Name of prestige currency
    baseResource: "数据", // Name of resource prestige is based on
    baseAmount() { return player.l1.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1 / 6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade("l2", 22)) mult = mult.times(upgradeEffect("l2", 22))
        if (hasUpgrade("l2", 23)) mult = mult.times(buyableEffect("l2", 11)[1])
        if (hasUpgrade("l1", 24)) mult = mult.times(upgradeEffect("l1", 24))
        if (hasUpgrade('l3', 13)) mult = mult.mul(upgradeEffect('l3', 13));
        mult = mult.mul(tmp.l3.ptsEff2);
        if (hasUpgrade('l4', 23)) mult = mult.mul(upgradeEffect('l4', 23));
        if (hasUpgrade('l4', 26)) mult = mult.mul(buyableEffect('l4', 32));
        mult = mult.mul(tmp.l5.effect)
        if(player.l7.neff1[3]) mult = mult.mul(player.l7.ncalc1[3])
		mult = mult.mul(buyableEffect('l8', 1061));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let base = new Decimal(1)
        if (player.l7.neff3[1]) base = base.mul(player.l7.ncalc3[1])
        if (hasUpgrade("l1", 35)) base = base.mul(250)
        if (hasUpgrade("l2", 91)) base = base.mul(player.l2.points.add(1).log10().max(1).pow(buyableEffect("l2",21)[0]))
		
		if(hasUpgrade('l8', 11)) base = base.mul(player.l8.tuning[2].div(10));
        base = base.mul(buyableEffect('l8', 1062));
		base = base.mul(buyableEffect('l8', 1084));
		base = base.mul(buyableEffect('l8', 52));
		return base
    },
	getResetGain() {
		let layer = 'l2';
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).mul(tmp[layer].gainMult).pow(tmp[layer].gainExp)
		if (gain.gte(tmp[layer].softcap)) gain = gain.pow(tmp[layer].softcapPower).mul(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower)))
		gain = gain.mul(tmp[layer].directMult)
	
		if(player.l8.erosion.run[1]) gain = gain.max(1).log10().pow(layers.l8.erosionEff(1)).pow_base(10);
        if(hasUpgrade("l2",93)) gain = gain.pow(buyableEffect("l2",21)[3])
        if(player.l8.voidShaped && gain.gte(1e30)) gain = gain.add(1).log10().pow(30).max(0)
        if(hasUpgrade("l2",94)) gain = gain.mul(upgradeEffect("l2",94))
        if(hasUpgrade("l2",95)) gain = gain.mul(buyableEffect("l2",22)[1])
        if(hasUpgrade("l2",103)) gain = gain.pow(1.02)
		return gain.floor().max(0);
	},
    passiveGeneration() {
        let mult = 0
        if (hasUpgrade('l3', 63)) mult = 1;
        if (hasMilestone('l4', 7)) mult = 1e3;

        return mult
    },
    replBaseGain() {
        let a = n(1)
        return a
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ['l1'],
    hotkeys: [
        { key: "2", description: "2：进行第二层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() {
        return hasUpgrade("l1", 16) || player.l2.unlocked;
    },
    milestones: {
        0: {
            requirementDescription: "1 总转生点数",
            effectDescription: "解锁核心, 点数获取x2",
            done() { return player.l2.points.gte(1) },
        },
        1: {
            requirementDescription: "4 总转生点数",
            effectDescription: "自动购买数据升级",
            done() { return player.l2.total.gte(4) },
        },
        2: {
            requirementDescription: "30 总转生点数",
            effectDescription: "转生不重置复制器",
            done() { return player.l2.total.gte(30) },
        },
        3: {
            requirementDescription: "5000 总转生点数",
            effectDescription: "数据不重置任何东西",
            done() { return player.l2.total.gte(5000) },
        },
        4: {
            requirementDescription: "1e9 总转生点数",
            effectDescription: "每秒自动获取20%重置可获得的数据",
            done() { return player.l2.total.gte(1e9) },
        },
        5: {
            requirementDescription: "5e13 总转生点数",
            effectDescription: "转生不再重置数据, 上一个里程碑的效果x10",
            done() { return player.l2.total.gte(5e13) },
        },
    },
    upgrades: {
        11: {
            title: "艰难的抉择",
            description() {
                if (hasUpgrade('l4', 52)) return "基于转生时间增加数据获取,1s达到硬上限"; if (hasUpgrade('l4', 33)) return "基于转生时间增加数据获取,10s达到硬上限"; return "基于转生时间增加数据获取,1000s达到硬上限"
            },
            effect() {
                if (!hasUpgrade('l2', 11)) return n(1)
                let eff = n(player.l1.resetTime).min(1000).add(1).pow(0.1)
                if (hasUpgrade('l4', 33)) eff = Decimal.pow(10, n(player.l1.resetTime).min(10).pow(1.5));
                if (hasUpgrade('l4', 33)) eff = Decimal.pow('1e100', n(player.l1.resetTime).min(1).pow(2));
                eff = eff.pow(buyableEffect('l8', 1043));
				return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return true },
			charged: {
				text: '基于转生侵蚀时间增加本质基础值获取',
				cost: n(1e230),
				effect() {
					let eff = player.l8.erosion.time[1].pow(2).add(1);
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        12: {
            title: "内存升级",
            description: "基于总转生点数提升数据获取",
            effect() {
                if (!hasUpgrade('l2', 12)) return n(1)
                let eff = Decimal.pow(4, player.l2.total.add(1).log10())
				eff = eff.pow(buyableEffect('l8', 1044));
				if (eff.gte('1e500')) eff = eff.pow(0.1).mul('1e450');
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("l2", 11) },
			charged: {
				text: '基于核心等级提升中子素锭被动获取速度',
				cost: n(1e235),
				effect() {
					let eff = getBuyableAmount('l2', 11).minus(player.l5.c6punishment).max(0).add(1);
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        13: {
            title: "协同加成",
            description: "解锁复制器的第三个效果",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("l2", 12) },
			charged: {
				text: '复制器增幅真空湍流效果',
				cost: n(1e240),
				effect() {
					let eff = player.l1.repl.add(1).ln().add(1).ln().add(1).ln().add(1).ln().div(10).add(1);
					return eff;
				},
				effectDescription() { return "^" + format(this.charged.effect()); },
			},
        },
        14: {
            title: "永无止境的起点",
            description: "第一个数据升级的效果变为^3",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("l2", 13) },
			charged: {
				text: '第一个数据升级的充能效果^3',
				cost: n(1e255),
				effect() { return n(3); },
			},
        },
        15: {
            title: "转生复制器",
            description: "第二个复制器效果在软上限之前基于转生点数变强",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("l2", 14) },
			charged: {
				text: '“时间墙是这样的”效果增强^4',
				cost: n(1e265),
				effect() { return n(4); },
			},
            effect() {
                if (!hasUpgrade('l2', 15)) return n(1)
                let eff = player.l2.points.add(1).log10().pow(2).div(2).add(1)
				eff = eff.pow(buyableEffect('l8', 1045));
				if (eff.gte(3)) eff = eff.div(3).pow(0.33).times(3)
                return eff.softcap(1e20, 0.5)
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        21: {
            title: "更好的数据强度",
            description: "解锁更多数据升级",
            cost: new Decimal(88),
            unlocked() { return hasUpgrade("l2", 15) },
			charged: {
				text: '“递归递归”和“递归递归递归”效果各x1.25',
				cost: n(1e274),
				effect() { return n(1.1); },
			},
        },
        22: {
            title: "又来这一套",
            description: "基于点数增强转生点数获取",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade("l2", 21) },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(1)
                let eff = player.points.add(1).log10().pow(0.2).add(1)
                if (hasUpgrade("l2", 34)) eff = Decimal.pow(10, player.points.add(10).log10().root(2.5));
                if (hasUpgrade("l2", 52)) eff = eff.times(upgradeEffect("l2", 52))
                eff = eff.pow(buyableEffect('l8', 1064));
				return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
			charged: {
				text: '基于本质增强砖获取,略微提升生物炼金第二效果',
				cost: n(1e287),
				effect() {
					let eff = player.l8.points.add(1).ln().add(1);
					return eff;
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        23: {
            title: "紧密核心",
            description: "解锁第二个核心增益",
            cost: new Decimal(1e4),
            unlocked() { return hasUpgrade("l2", 22) },
			charged: {
				text: '二阶核心等级提升黑洞质量获取',
				cost: n('1e311'),
				effect() {
					let eff = getBuyableAmount('l2', 12).div(50).add(1);
					return eff.min("1e1000");
				},
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
        },
        24: {
            title: "超立方",
            description: "点数获取^1.1",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade("l2", 23) },
			charged: {
				text: '真空湍流效率^1.1',
				cost: n('1e317'),
				effect() { return n(1.1); },
				effectDescription() { return "^" + format(this.charged.effect()); },
			},
        },
        25: {
            title: "更加艰难的抉择",
            description: "解锁转生增幅器",
            cost: new Decimal(1e11),
            unlocked() { return hasUpgrade("l2", 24) },
			charged: {
				text: '解锁转生增幅器的充能',
				cost: n('1e319'),
				effect() { return n(1); },
			},
        },
        31: {
            title: "限制突破",
            description: "第一个复制器效果使用更好的公式",
            cost: new Decimal(5e13),
            unlocked() { return hasUpgrade("l2", 25) },
        },
        32: {
            title: "致密核心",
            description: "解锁第三行增幅器",
            cost: new Decimal(1e18),
            unlocked() { return hasUpgrade("l2", 31) },
        },
        33: {
            title: "更远之境",
            description: "解锁下一层",
            cost: new Decimal(1e19),
            unlocked() { return hasUpgrade("l2", 32) },
        },
        34: {
            title: "还来这一套",
            description: "转生升级“又来这一套”的效果更好。",
            cost: new Decimal('1e1200'),
            unlocked() { return hasMilestone("l4", 21) },
        },
        35: {
            title: "增幅增幅",
            description: "增幅器III-A效果更好。",
            cost: new Decimal('1e1500'),
            unlocked() { return hasMilestone("l4", 21) },
        },
        41: {
            title: "增幅器I-A",
            description: "移除第三个数据升级的一重软上限",
            cost: new Decimal(5e10),
            canAfford() { return (!hasUpgrade("l2", 42) || hasUpgrade('l3', 42)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 42),
			charged: {
				text: '第三个数据升级的充能效果x1.25',
				cost: n('1e319'),
				unlocked() { return hasUpgradeCharged('l2', 25); },
				effect() { return n(1.25); },
				effectDescription() { return "x" + format(this.charged.effect()); },
			},
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[41].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 41)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 41)) cc = "#000000"
                    return cc
                }
            }
        },
        42: {
            title: "增幅器I-B",
            description: "移除第五个数据升级的一重软上限",
            cost: new Decimal(5e10),
            canAfford() { return (!hasUpgrade("l2", 41) || hasUpgrade('l3', 42)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 42),
			charged: {
				text: '第五个数据升级的充能效果^3',
				cost: n('1e319'),
				unlocked() { return hasUpgradeCharged('l2', 25); },
				effect() { return n(3); },
				effectDescription() { return "^" + format(this.charged.effect()); },
			},
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[42].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 42)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 42)) cc = "#000000"
                    return cc
                }
            }
        },
        51: {
            title: "增幅器II-A",
            description: "复制器获取^2",
            cost: new Decimal(1e12),
            canAfford() { return (!hasUpgrade("l2", 52) && !hasUpgrade("l2", 53) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[51].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 51)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 51)) cc = "#000000"
                    return cc
                }
            }
        },
        52: {
            title: "增幅器II-B",
            description: "第二行第二个转生升级基于点数变得更好",
            cost: new Decimal(1e12),
            canAfford() { return (!hasUpgrade("l2", 51) && !hasUpgrade("l2", 53) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[52].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 52)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 52)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(1)
                let eff = player.points.add(1).ln().pow(0.1).add(1)
                if (hasUpgrade('l3', 52)) eff = eff.pow(upgradeEffect('l3', 52));
                eff = eff.pow(buyableEffect('l8', 1065));
				return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        53: {
            title: "增幅器II-C",
            description: "核心更便宜(^0.9)",
            cost: new Decimal(1e12),
            canAfford() { return (!hasUpgrade("l2", 51) && !hasUpgrade("l2", 52) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[53].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 53)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 53)) cc = "#000000"
                    return cc
                }
            },
        },
        61: {
            title: "增幅器III-A",
            description: "基于转生点数加强核心增益I",
            cost: new Decimal(1e17),
            canAfford() { return (!hasUpgrade("l2", 62) && !hasUpgrade("l2", 63) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 32) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[61].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 61)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 61)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(0)
                let eff = player.l2.points.add(1).log10().pow(0.5).div(3)
                if (eff.gte(5) && !hasUpgrade("l2", 35)) eff = eff.minus(5).div(10).add(5)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()) + "有效等级"; return a; },
        },
        62: {
            title: "增幅器III-B",
            description: "基于转生点数加强核心增益II",
            cost: new Decimal(1e17),
            canAfford() { return (!hasUpgrade("l2", 61) && !hasUpgrade("l2", 63) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 32) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[62].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 62)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 62)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(0)
                let eff = player.l2.points.add(1).log10().div(7)
                if (hasUpgrade('l2', 72)) eff = eff.mul(upgradeEffect('l2', 72));
                if (eff.gte(10)) eff = eff.minus(10).div(5).add(10)
                if (!hasUpgrade('l4', 71)) eff = eff.min(50)
                eff = eff.softcap(50, 10, 3)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()) + "有效等级"; return a; },
        },
        63: {
            title: "增幅器III-C",
            description: "基于点数,核心变得更便宜",
            cost: new Decimal(1e17),
            canAfford() { return (!hasUpgrade("l2", 61) && !hasUpgrade("l2", 62) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 32) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[63].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 63)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 63)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(1)
                let eff = player.points.add(1).pow(2).log10().add(1)
                if (hasUpgrade('l3', 53)) eff = eff.pow(upgradeEffect('l3', 53));
                eff = eff.pow(buyableEffect('l8', 1072));    
				if (eff.gte(1e20)) eff = eff.div(1e20).pow(0.25).add(1).times(1e20)
                if(player.l7.neff2[5]) eff = eff.pow(player.l7.ncalc2[5])
				return eff
            },
            effectDisplay() { let a = "/" + format(this.effect()); return a; },
        },
        71: {
            title: "增幅器IV-A",
            description: "基于致密点数，复制器第一效果更强",
            cost: new Decimal(1e60),
            canAfford() { return (!hasUpgrade("l2", 72) && !hasUpgrade("l2", 73) && !hasUpgrade("l2", 74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3", 55) },
            ignoreAutoUpgrade: () => !hasMilestone('l4', 8),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[71].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 71)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 71)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = n(2);
                base = base.add(player.l3.points.root(4).div(4));
                if (base.gte(10)) base = base.log10().pow(0.5).pow_base(10);
                if (base.gte(20)) base = base.mul(5).log10().mul(10);
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        72: {
            title: "增幅器IV-B",
            description: "基于致密点数，增幅器III-B更强",
            cost: new Decimal(1e60),
            canAfford() { return (!hasUpgrade("l2", 71) && !hasUpgrade("l2", 73) && !hasUpgrade("l2", 74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3", 55) },
            ignoreAutoUpgrade: () => !hasMilestone('l4', 8),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[72].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 72)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 72)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = n(2);
                base = base.add(player.l3.points.add(1).log10().div(4));
                if (hasUpgrade('l3', 62)) base = base.mul(2);
                base = base.mul(layers.l5.challenges[21].effect())
                if (!hasUpgrade('l4', 71)) base = base.min(50)
                base = base.softcap(50, 0.8)
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        73: {
            title: "增幅器IV-C",
            description: "复制器降低核心价格",
            cost: new Decimal(1e60),
            canAfford() { return (!hasUpgrade("l2", 71) && !hasUpgrade("l2", 72) && !hasUpgrade("l2", 74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3", 55) },
            ignoreAutoUpgrade: () => !hasMilestone('l4', 8),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[73].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 73)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 73)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = n(1);
                base = base.add(player.l1.repl.add(1).log10().div(20));
                base = base.pow(buyableEffect('l8', 1073));    
				if (base.gte(2)) base = base.div(2).log10().add(2);
                return base.pow(-1);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        74: {
            title: "增幅器IV-D",
            description: "基于核心等级和总转生点数提升致密点数获取",
            cost: new Decimal(1e60),
            canAfford() { return (!hasUpgrade("l2", 71) && !hasUpgrade("l2", 72) && !hasUpgrade("l2", 73) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3", 55) },
            ignoreAutoUpgrade: () => !hasMilestone('l4', 8),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[74].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 74)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 74)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = n(1);
                base = base.add(player.l2.total.add(1).log10().root(2).mul(getBuyableAmount('l2', 11).sub(18).max(0)).div(4));
                base = base.pow(buyableEffect('l8', 1094));    
				return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        81: {
            title: "增幅器V-A",
            description: "点数增加攻击力获取",
            cost: new Decimal('1e940'),
            canAfford() { return (!hasUpgrade("l2", 82) || hasUpgrade('l5', 11)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasMilestone("l4", 17) },
            ignoreAutoUpgrade: () => !hasUpgrade('l5', 11),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[81].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 81)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 81)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = Decimal.pow(1.01, player.points.add(10).log10().sqrt().mul(tmp.l2.coreEffect4));
                if (hasUpgrade("l5", 23)) base = base.pow(upgradeEffect('l5', 23))
                if (player.l7.neff1[5]) base = base.pow(player.l7.ncalc1[5])
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        82: {
            title: "增幅器V-B",
            description: "数据增加攻击力获取",
            cost: new Decimal('1e940'),
            canAfford() { return (!hasUpgrade("l2", 81) || hasUpgrade('l5', 11)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasMilestone("l4", 17) },
            ignoreAutoUpgrade: () => !hasUpgrade('l5', 11),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[82].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 82)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 82)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = Decimal.pow(1.01, player.l1.points.add(10).log10().sqrt().mul(tmp.l2.coreEffect4));
                if (hasUpgrade("l5", 23)) base = base.pow(upgradeEffect('l5', 23))
                if (player.l7.neff1[5]) base = base.pow(player.l7.ncalc1[5])
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        91: {
            title: "源头",
            description: "解锁虚空核心",
            cost: new Decimal('5555555'),
            unlocked() { return hasUpgrade("l1",36)},
        },
        92: {
            title: "你知道转生也有侵蚀软上限吗",
            description: "虚空核心第三效果对核心等级也生效",
            cost: new Decimal('1e50'),
            unlocked() { return hasUpgrade("l2",91) },
        },
        93: {
            title: "不是这也太无聊了",
            description: "解锁虚空核心第4,5效果和一个新按钮",
            cost: new Decimal('1e1000'),
            unlocked() { return hasUpgrade("l2",92) },
        },
        94: {
            title: "虚空统合",
            description(){return `虚空矿石加成转生点数在侵蚀软上限之后获取,改善虚空核心效果3公式<br>当前:x${format(this.effect())}`},
            cost: new Decimal('1e1800'),
            effect() {
                let eff = player.l1.voidMine.add(1).log10().pow(0.75).pow_base(5).max(1)
                return eff;
            },
            unlocked() { return hasUpgrade("l2",93) },
        },
        95: {
            title: "二阶时间墙",
            description(){return `解锁二阶虚空核心,???按钮的点击次数降低虚空核心价格`},
            cost: new Decimal('1e16500'),
            unlocked() { return hasUpgrade("l2",94) },
        },
        101: {
            title: "毫无作用",
            description(){return `解锁二阶虚空核心效果3,加强???的效果`},
            cost: new Decimal('1e210000'),
            unlocked() { return hasUpgrade("l2",95) },
        },
        102: {
            title: "采集扩张",
            description(){return `加强虚空核心效果4和5, 虚空冲击加成^1.2, 可以长按???并再次加强其效果`},
            cost: new Decimal('1e480000'),
            unlocked() { return hasUpgrade("l2",101) },
        },
        103: {
            title: "幸运核心",
            description(){return `解锁二阶核心第4,5效果,转生点数在侵蚀软上限之后获取^1.02`},
            cost: new Decimal('1e777777'),
            unlocked() { return hasUpgrade("l2",102) },
        },
        104: {
            title: "致密致密核心",
            description(){return `降低虚空核心价格`},
            cost: new Decimal('1e1666666'),
            unlocked() { return hasUpgrade("l2",103) },
        },
        105: {
            title: "转生终结",
            description(){return `自动点击???,致密点数获取^150`},
            cost: new Decimal('e2e7'),
            unlocked() { return hasUpgrade("l2",104) },
        },
    },
    clickables: {
        31: {
            display() { return `重置转生增幅器设置(这将使得你的复制器^0.5,并重置点数和转生点数!)` },
            style: { "height": "30px", "width": "500px", "background-color": "#ff00c333", "border-radius": "0%", "border": "2px solid", "border-color": "#ff00c3", "color": "#ff00c3", "text-shadow": "0 0 15px #ff00c3", "font-size": "15px" },
            unlocked() { return hasUpgrade("l2", 25) },
            onClick() {
                player.l2.upgrades = player.l2.upgrades.filter(n => n < 36)//重置编号大于36的升级
                player.l2.points = n(0)
                player.l1.repl = player.l1.repl.times(0.5)
                player.points = n(0)
            },
            canClick() { return true }
        },
    },
    coreEffect4() {
        if (!hasMilestone("l4", 20)) return new Decimal(1);
        let ret = player.l2.buyables[11].root(6);
        if (hasUpgrade("l4", 51)) ret = ret.mul(player.l2.buyables[12].root(4));
        ret = ret.add(1);
        if(player.l8.voidShaped) ret = n(1)
        return ret;
    },
    coreEffect5() {
        if (!hasUpgrade("l4", 61) || player.l8.voidShaped) return new Decimal(1);
        let ret = Decimal.pow(10, player.l2.buyables[11]);
        ret = ret.pow(layers.l2.coreEffect5b());
		ret = ret.pow(buyableEffect('l8', 1013));
		if(inChallenge("l6",11)&&(!hasUpgrade("l6",91))) ret=ret.log(1.3)
        if(inChallenge("l6",11)&&(hasUpgrade("l6",91))) ret=ret.log(n(1.3).sub(upgradeEffect("l6",91)).max(1))
        
        return ret;
    },
    coreEffect5b() {
        if (!hasUpgrade("l4", 61) || player.l8.voidShaped) return new Decimal(1);
        let ret = player.l2.buyables[12].root(2).add(1);
        return ret;
    },
    corePointScale() {
        let p = player.l2.points;
        p = p.root(layers.l5.crystaleff())
        if (hasUpgrade('l3', 73)) p = p.root(upgradeEffect('l3', 73));
        if (hasUpgrade('l3', 65)) p = p.root(0.95);
        if (hasUpgrade('l2', 73)) p = p.root(upgradeEffect('l2', 73));
        if (hasUpgrade("l2", 53)) p = p.root(0.9)
        if (hasUpgrade("l4", 24)) p = p.mul(upgradeEffect("l4", 24));
        if (hasUpgrade('l3', 24)) p = p.div(upgradeEffect('l3', 24));
        if (hasUpgrade("l2", 63)) p = p.mul(upgradeEffect("l2", 63));
        return p;
    },
    firstCoreScale() {
        let base = n(10);
        if (hasMilestone('l4', 18)) base = n(5);
        if (hasMilestone('l4', 22)) base = n(3);
        if (hasMilestone('l4', 24)) base = n(6).sub(layers.l4.total_bars().max(400).root(5).min(4));
        return base;
    },
    buyables: {
        11: {
            title() { return `核心等级${formatWhole(getBuyableAmount("l2", 11).minus(player.l5.c6punishment))}`+(player.l7.neff1[4]? `[+${formatWhole(player.l7.ncalc1[4])}]`:``) },
            cost(x) {
                if (x.gte(64)) x = x.div(64).pow(tmp.l2.firstCoreScale).mul(64);
                if ((x.gte(20) && !hasUpgrade('l3', 64)) || inChallenge('l5', 21)) return n('1F9e15');
                let ct = Decimal.pow(2, x.pow(2)).div(x.add(1));
                if (hasUpgrade('l3', 64)) ct = Decimal.pow(1.75, x.pow(2));
                if (hasUpgrade("l2", 63)) ct = ct.div(upgradeEffect("l2", 63));
                if (hasUpgrade('l3', 24)) ct = ct.mul(upgradeEffect('l3', 24));
                if (hasUpgrade("l4", 24)) ct = ct.div(upgradeEffect("l4", 24));
                if (hasUpgrade("l2", 53)) ct = ct.pow(0.9)
                if (hasUpgrade('l2', 73)) ct = ct.pow(upgradeEffect('l2', 73));
                if (hasUpgrade('l3', 65)) ct = ct.pow(0.95);
                if (hasUpgrade('l3', 73)) ct = ct.pow(upgradeEffect('l3', 73));
                ct = ct.pow(layers.l5.crystaleff())
                return ct;
            },
            effect(x) {
                let effcnt = x
                if(player.l7.neff1[4]) effcnt = effcnt.add(player.l7.ncalc1[4])
                if(inChallenge("l5", 32)) effcnt = effcnt.minus(player.l5.c6punishment)
                let eff1 = Decimal.pow(effcnt.abs().add(upgradeEffect("l2", 61)).pow(0.2).add(1), effcnt.abs().add(upgradeEffect("l2", 61)).times(0.25)).overflow('ee100', 0.5)
                eff1 = eff1.pow(buyableEffect("l2", 12)[0]);
                eff1 = eff1.pow(buyableEffect('l8', 1071));
				//if(eff1.gte(100000)) eff1 = eff1.div(100000).pow(0.25).mul(100000);
                eff1 = eff1.min('ee3666666')
                let eff2 = Decimal.pow(5, effcnt.abs().add(upgradeEffect("l2", 62)).pow(0.6)).max(1)
                eff2 = eff2.pow(buyableEffect("l2", 12)[1]);
				eff2 = eff2.pow(buyableEffect('l8', 1063));
                eff2 = eff2.pow(buyableEffect('l8', 1071));
				if(effcnt.lt(0)) return [n(1).div(eff1), n(1).div(eff2)]
                return [eff1,eff2]
            },
            display() { return `花费: ${format(this.cost())} 转生点数` },
            canAfford() { return player.l2.points.gte(this.cost()) },
            buy() {
                if (!tmp.l2.buyables[11].canAfford) return
                player.l2.points = player.l2.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasMilestone("l2", 0) },
            style: {
                "height": "150px", "width": "350px", "font-size": "12.5px", "border-color": "#ff00c3", "border-radius": "2%", "color": "#ff00c3", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.buyables[11].canAfford) bg = "#ff00c333"
                    return bg
                }
            }
        },
        12: {
            title() { return (inChallenge('l3', 11) ? '已保存' : '') + `二阶核心等级${formatWhole(getBuyableAmount("l2", 12))}` },
            cost(x) {
                let ct = n(2).pow(x.mul(0.1).add(5.0001));
                return ct.floor();
            },
            effect(x) {
                let effcnt = x
                if(player.l7.neff2[4]) effcnt = effcnt.add(player.l7.ncalc2[4])
                let eff1 = effcnt.div(2).add(1).pow(0.5);
                if (hasMilestone('l3', 3)) eff1 = eff1.pow(1.25);
                //if(eff1.gte(5)) eff1 = eff1.div(5).root(3).mul(5);
                eff1 = eff1.min('1e1366666')
                let eff2 = effcnt.mul(1.5).add(1);
                if (eff2.gte(10)) eff2 = eff2.div(10).root(2).mul(10);
                let eff3 = effcnt.add(1);
                if (hasUpgrade('l4', 41)) eff3 = x.mul(player.l2.buyables[11].root(2)).add(1);
                if (hasMilestone('l3', 2)) eff3 = eff3.pow(1.5);
                if (hasUpgrade('l3', 74)) eff3 = eff3.pow(1.25);
                return [eff1, eff2, eff3]
            },
            display() { return inChallenge('l3', 11) ? '' : `需求: ${format(this.cost(), 0)} 核心等级` },
            canAfford() { return getBuyableAmount('l2', 11).gte(this.cost()) && !inChallenge('l3', 11) },
            buy() {
                if (!tmp.l2.buyables[12].canAfford) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasMilestone("l3", 0) },
            style: {
                "height": "150px", "width": "350px", "font-size": "12.5px", "border-color": "#ffaae3", "border-radius": "2%", "color": "#ffaae3", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.buyables[12].canAfford) bg = "#ffaae333"
                    return bg
                }
            }
        },
        21: {
            title() { return `<b class = "voidResource2", style="text-shadow:0 0 3px #ff00c3">虚空核心等级</b><b class = "voidResource", style="text-shadow:0 0 3px #ff00c3">${formatWhole(getBuyableAmount("l2",21))}</b><br>` },
            cost(x) {
                let ct = n(6.5)
                if(x.lte(5)) ct = x.pow(1.25).div(4).add(6.5)
                else if(x.lte(15)) ct = x.sub(5).max(0).times(20).pow(x.sub(6).max(0).pow(0.05)).add(9.1)
                else ct = x.sub(15).pow_base(x.pow(0.01).div(10).add(1.1)).times(450)
                if(hasUpgrade("l2",104)) ct = x.pow(1.5).times(x.pow_base(1.05)).times(1000)
                if(hasUpgrade("l2",95)) ct = ct.div(player.l2.wondervoid.add(1).pow(hasUpgrade("l2",101)?3.666:2).ln().div(20).add(1).times(hasUpgrade("l2",103)?buyableEffect("l2",22)[3]:1)) 
                return ct.pow_base(10)
            },
            effect(x) {
                let eff1=n(0),eff2=n(1),eff3=n(1),eff4=n(1),eff5=n(1),effcnt=x
                if(hasUpgrade("l2",103)) effcnt = x.add(buyableEffect("l2",22)[4])
                eff1 = effcnt.pow(2)
                if(hasUpgrade("l2",95)) eff1 = eff1.times(buyableEffect("l2",22)[0])
                eff2 = effcnt.times(3).add(1).ln().pow(4).div(10).add(1).max(1)
                eff3 = effcnt.add(1).pow(10).max(1).log10().div(10).pow(hasUpgrade("l2",94)?effcnt.mul(2).add(10):10).max(1)
                if(hasUpgrade("l2",101)) eff3 = eff3.pow(buyableEffect("l2",22)[2])
                if(hasUpgrade("l2",93)) eff4 = effcnt.sub(15).max(0).pow_base(2)
                if(hasUpgrade("l2",93)) eff5 = effcnt.sub(15).max(0).add(1).ln().pow(2).max(1)
                if(hasUpgrade("l2",102)){
                    eff4 = eff4.pow(2.25)
                    eff5 = effcnt.add(1).pow_base(1.5).pow(0.25)
                }
                return [eff1,eff2,eff3,eff4,eff5]
            },
            display() { return `<b class = "voidResource2", style="text-shadow:0 0 2px #ff00c3"> 需求: ${format(this.cost())} 转生点数</b>
                                效果I:转生点数获取^${format(player.l2.points.add(1).log10().max(1).pow(this.effect()[0]))} 
                                效果II:虚空矿石获取^${format(this.effect()[1])},冲击加成按^2倍数加成
                                效果III:二阶核心等级每秒乘以${format(this.effect()[2],4)}`//转生点数数量级^${format(this.effect()[0])}
                                +(hasUpgrade("l2",93)?`<br>效果IV:转生点数在侵蚀之后^${format(this.effect()[3])}
                                效果V:MK.IV加成获取量x${format(this.effect()[4])}`:``)},
            canAfford() { return player.l2.points.max(1).gt(this.cost()) },
            buy() {
                if (!tmp.l2.buyables[21].canAfford) return
                player.l2.points = player.l2.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasUpgrade("l2", 91) },
            style: {
                "height": "150px", "width": "550px", "font-size": "15px", "border-color": "#3d002f","color":"#ff00c3","margin":"0px", "border-radius": "2%", "box-shadow": "0 0 10px #ff00c3", "background-color"(){
                    let bg = "#000000"
                    if (tmp.l2.buyables[21].canAfford) bg = "#9700656b"
                    return bg
                }
            }
        },
        22: {
            title() { return `<b class = "voidResource2", style="text-shadow:0 0 3px #cfffb9">二阶虚空核心等级</b><b class = "voidResource", style="text-shadow:0 0 3px #cfffb9">${formatWhole(getBuyableAmount("l2",22))}</b><br>` },
            cost(x) {
                let ct = n(40)
                if(x.lte(5)) ct = x.times(1.4).add(40)
                else ct = x.sub(4).pow(1.2).times(3).add(45)
                return ct.floor()
            },
            effect(x) {
                let eff1=n(1),eff2=n(1),eff3=n(1),eff4=n(1),eff5=n(0)
                eff1 = x.pow(2).div(3).add(1)
                eff2 = x.pow_base(n('1e2500').pow(x.div(5).add(0.5)))
                if(hasUpgrade("l2",101)) eff3 = x.pow_base(1.1).pow(x.sub(7).max(0).div(10).add(1)).max(1)
                if(eff3.gte(80)) eff3 =eff3.div(80).pow(0.3).mul(80)
                if(hasUpgrade("l2",103)) eff4 = x.add(1).ln().pow_base(2).div(10).add(1)
                if(hasUpgrade("l2",103)) eff5 = x.add(1).div(15).add(1).pow(1.5).max(1)
                return [eff1,eff2,eff3,eff4,eff5]
            },
            canAfford() { return getBuyableAmount("l2",21).gte(this.cost()) },
            display() { return `<b class = "voidResource2", style="text-shadow:0 0 2px #cfffb9"> 需求: ${format(this.cost())} 虚空核心等级</b>
                                效果I:虚空核心效果1^${format(this.effect()[0])}
                                效果II:转生点数在侵蚀软上限之后x${format(this.effect()[1])}`
                            +(hasUpgrade("l2",101)?`<br>效果III:虚空核心效果3变为^${format(this.effect()[2])}`:``)
                            +(hasUpgrade("l2",103)?`<br>效果IV:???效果加强x${format(this.effect()[3])}
                            效果V:赠送虚空核心等级+${format(this.effect()[4])}`:``)},
            buy() {
                if (!tmp.l2.buyables[22].canAfford) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasUpgrade("l2", 95) },
            style: {
                "height": "150px", "width": "550px", "font-size": "15px", "border-color": "#1d3d00","color":"#cfffb9", "border-radius": "2%","margin":"0px", "box-shadow": "0 0 10px #cfffb9", "background-color"(){
                    let bg = "#000000"
                    if (tmp.l2.buyables[22].canAfford) bg = "#1d3d00"
                    return bg
                }
            }
        },
    },
    clickables:{
        11:{
        	display(){
                return `很棒的虚空按钮,点击一次后可以获得一个???`+(hasUpgrade("l2",95)?`<br>虚空核心价格开${format(player.l2.wondervoid.add(1).pow(hasUpgrade("l2",101)?3.666:2).ln().div(20).add(1).times(hasUpgrade("l2",103)?buyableEffect("l2",22)[3]:1))}次方根`:``)
			},
			onClick(){
                if(hasUpgrade("l2",102)) player.l2.wondervoid = player.l2.wondervoid.add(player.l2.wondervoid.pow(0.75).div(2).add(1)).times((hasUpgrade("l2",103)?buyableEffect("l2",22)[4]:n(1)).pow_base(1.01))
                else player.l2.wondervoid = player.l2.wondervoid.add(player.l2.wondervoid.pow(hasUpgrade("l2",101)?0.75:0.5).div(10).add(1))
			},
			style(){
				return layers.l2.clickables[11].canClick()?{"min-height":"0px","height":"100px","width":"550px","background-color":"#9700656b","border-color":"#ff00c3","border-radius":"0%"}:{"min-height":"0px","height":"100px","width":"550px","background-color":"#000000","border-color":"#ff00c3","color":"#ff00c3","border-radius":"0%"};
			},
			canClick(){
                return true
			},
            onHold(){
                if(!hasUpgrade("l2",102)) return
                this.onClick()
            },
			unlocked(){
				return hasUpgrade("l1",51)
			},
        },
        21:{
            display(){return `重置转生增幅器设置(这将使得你的复制器^0.5,并重置点数和转生点数!)`},
            style:{"height":"30px","width":"550px","background-color":"#ff00c333","border-radius":"0%","border":"2px solid","border-color":"#ff00c3","color":"#ff00c3","text-shadow":"0 0 15px #ff00c3","font-size":"15px"},
            unlocked(){return hasUpgrade("l2",25)},
            onClick(){
                player.l2.upgrades = player.l2.upgrades.filter(n => n < 36 && n > 90)//重置编号大于36小于90的升级
                player.l2.points = n(0)
                player.l1.repl = player.l1.repl.times(0.5)
                player.points = n(0)
            },
            canClick(){return true},
        },
    },

    update(diff) {
		if(player.l8.baC.chal7doomed[1] > 0) return;
        if (hasUpgrade('l3', 64) && !inChallenge('l5', 21)) //注意：原本的核心价格公式无法逆向计算，因此必须有这个升级才能自动核心
        {
            let ncl = tmp.l2.corePointScale.max(1).log(1.75).root(2);
            if (ncl.gte(64)) ncl = ncl.div(64).root(tmp.l2.firstCoreScale).mul(64);
            ncl = ncl.add(1).floor();
            setBuyableAmount('l2', 11, getBuyableAmount('l2', 11).max(ncl));
        }
        let trueDiff = diff.div(layers.AC.devSpeedCal())
        if(hasUpgrade("l2",92)) setBuyableAmount("l2",11,getBuyableAmount("l2",11).times(buyableEffect("l2",21)[2].pow(trueDiff)))
        if(hasUpgrade("l2",91)) setBuyableAmount("l2",12,getBuyableAmount("l2",12).times(buyableEffect("l2",21)[2].pow(trueDiff)))
        if(hasUpgrade("l2",105)) layers.l2.clickables[11].onClick()
    },
    autoUpgrade() { return (player.l3.total.gte(1) && player.l2.total.gte(tmp.l3.ptsEff3)) },
	unlocked() {return !(player.l8.baC.chal7doomed[1] > 0);},
})