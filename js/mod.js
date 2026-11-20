let modInfo = {
	name: "一人做一层 One Dev One Layer",
	id: "1dev1layer-QUFB",
	author: "1 Dev 1 Layer Team",
	pointsName: "点数",
	discordName: "加入我们的QQ群",
	discordLink: "https://qm.qq.com/q/ViamMhqpqk",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 168,  // In hours
	modFiles: ["layers/layer1.js","layers/layer2.js", "layers/layer3.js", "layers/layer4.js", "layers/layer5.js", "layers/layer6.js", "layers/layer7.js", "layers/layer8.js", "layers/achievements.js", "layers/authors.js", "tree.js"]
}

// Set your version in num and name
let VERSION = {
	num: "1",
	name: "第一层级",
}

let changelog = `<h3>更新日志</h3>`
let winText = `3`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","calceff1","calceff2","calceff3","eff1adjust","eff2adjust","eff3adjust","startVoidShapeAnim","voidBigReset"]

function n(x) {
	return new Decimal(x)
}
function getStartPoints(){
	let sPExp = layers['l1'].sPExp();
	if(sPExp.gt(0)) return player.points.pow(sPExp);
    return new Decimal(modInfo.initialStartPoints);
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain=gain.mul(tmp.AC.ach1)
	
	if(hasUpgrade('l1',11))gain=gain.mul(upgradeEffect('l1',11))
	gain=gain.mul(tmp.l1.replEff1)
	if(hasUpgrade('l1',15))gain=gain.mul(upgradeEffect('l1',15))

	if(hasMilestone('l4', 0)) gain=gain.mul(layers.l4.total_bars().add(1));

	if(hasMilestone('l2',0)) gain = gain.mul(player.l8.voidShaped ? 10 : 2)
	
	gain = gain.mul(tmp.l3.ptsEff1);
	if(hasUpgrade('l3', 11)) gain = gain.mul(upgradeEffect('l3', 11));
    
	if(hasUpgrade('l4', 21)) gain = gain.mul(upgradeEffect('l4', 21));
	if(hasUpgrade('l4', 36)) gain = gain.mul(buyableEffect('l4', 33));
	if(hasUpgrade('l4', 61)) gain = gain.mul(layers.l2.coreEffect5());
	
	if(hasUpgrade('l6', 12)) gain = gain.mul(upgradeEffect('l6', 12));
	
	gain = gain.mul(tmp.l8.intEff2);
	gain = gain.mul(buyableEffect('l8', 1001));
	gain = gain.mul(buyableEffect('l8', 1003));
	gain = gain.mul(buyableEffect('l8', 1004));
	gain = gain.mul(buyableEffect('l8', 1145));
	
	if(hasMilestone('l8', 27)) gain = gain.mul(layers.l8.milestones[27].effect());
	
	if(hasUpgrade("l2",24)) gain = gain.pow(1.1)
	if(hasUpgrade('l3', 44)) gain = gain.pow(upgradeEffect('l3', 44));
	if(hasUpgrade('l3', 65)) gain = gain.pow(tmp.l3.singEff1);

	if(hasUpgrade('l6', 71)) gain = gain.pow(upgradeEffect('l6', 71));
	if(hasUpgrade('l6', 92)) gain = gain.pow(upgradeEffect('l6', 92));
	
	if(hasUpgrade('l8', 11)) gain = gain.pow(player.l8.tuning[0].div(10));
	if(hasUpgrade('l1', 71) && !hasUpgrade('l2',231)) gain = gain.pow(upgradeEffect("l1",71))
	gain = gain.pow(buyableEffect('l8', 1002));
	gain = gain.pow(buyableEffect('l8', 1005));
	gain = gain.pow(tmp.l4.levelEffect);

	if(inChallenge('l3', 11)) gain = Decimal.pow(10,gain.add(10).log10().pow(layers.l3.challenges[11].dPower()));
	if(inChallenge('l6', 11)) gain = gain.div(player.points.pow(3)).root(50)
	if(player.l7.neff1[1]) gain = gain.times(player.l7.ncalc1[1])
	// 挑战效果在软上限前面
    
    if(gain.gte('1e3500') && !(hasUpgrade("l4",42) && hasUpgrade("l4",43)))gain = gain.pow(0.2).mul('1e2800')
	if(gain.gte('1e8500000')) gain = gain.log10().div(8500).sub(999).pow(0.75 ** (hasUpgrade('l8', 92) ? 0.95 : 1)).add(999).mul(8500).pow_base(10);
	if(gain.gte('ee8')) gain = gain.log10().div(1e5).sub(999).pow(0.9).add(999).mul(1e5).pow_base(10);
	if(gain.gte('e5e8')) gain = gain.log10().div(5e5).sub(999).pow(0.75).add(999).mul(5e5).pow_base(10);
	
	if(hasUpgrade('l8', 93)) gain = gain.pow(1.05);
	gain = gain.pow(tmp.l8.milestones[21].effect);
	if(hasMilestone('l4', 38)) gain = gain.pow(tmp.l4.levelEffect.sub(1).max(1));
	
	if(gain.gte('e2e10')) gain = gain.log10().div(2e7).sub(999).pow(0.6).add(999).mul(2e7).pow_base(10);
	if(gain.gte('e5e11')) gain = gain.log10().div(5e10).log10().pow(0.4).pow_base(10).mul(5e10).pow_base(10);
	if(gain.gte('e1e15')) gain = gain.log10().div(1e14).log10().pow(0.4).pow_base(10).mul(1e14).pow_base(10);
	
	
	if(inChallenge('l8', 21) || inChallenge('l8', 22) || inChallenge('l8', 23)) gain = gain.div('ee9');
	if(inChallenge('l8', 31)) gain = gain.div('ee13');
	if(inChallenge('l8', 32)) gain = gain.div('ee14');
	if(inChallenge('l8', 33)) gain = gain.div('ee15');
	
	if(gain.gte('ee10')) player.l8.baC.unl1 = true;
	if(gain.gte('e4.8e13')) player.l8.baC.unl2 = true;
	
	// 点数获取在 ee7 之后受 log10 软上限（作用在 pointGen，不直接改库存）
	if(player.l8.voidShaped && gain.gte('ee7')) gain = gain.log10().log10().mul(1e6).add(3e6).pow_base(10) //我去你的 这直接给虚空成形前干废了
	
    return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!
var backgroundStyle = {

}


// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return 1e308
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

//e后数字开根
function expRoot(num, root) {
    return n(10).pow(num.max(1).log10().add(1).root(root).sub(1))
}

//e后数字乘方
function expPow(num, pow) {
    return n(10).pow(num.max(1).log10().add(1).pow(pow).sub(1))
}

//软上限
function Softcap(num, start, power, mode = 0, dis) {
    let x = n(num)
    start = n(start)
    if (x.gte(start) && !dis) {
        if ([0, "pow"].includes(mode)) x = x.div(start).max(1).pow(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).mul(power).add(start)
        if ([2, "exp"].includes(mode)) x = expPow(x.div(start), power).mul(start)
        if ([3, "log"].includes(mode)) x = x.div(start).log(power).add(1).mul(start)
    }
    return x
}

//反向软上限
function anti_softcap(num, start, power, mode = 0, dis) {
    let x = num
    start = n(start)
    if (x.gte(start) && !dis) {
        if ([0, "pow"].includes(mode)) x = x.div(start).max(1).root(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).div(power).add(start)
        if ([2, "exp"].includes(mode)) x = expRoot(x.div(start), power).mul(start)
        if ([3, "log"].includes(mode)) x = Decimal.pow(power, x.div(start).sub(1)).mul(start)
    }
    return x
}

//溢出软上限
function overflow(num, start, power, meta = 1) {
    if (isNaN(num.mag)) return new Decimal(0)
    start = n(start)
    if (num.gt(start)) {
        if (meta == 1) {
            let s = start.log10()
            num = num.log10().div(s).pow(power).mul(s).pow10()
        } else {
            let s = start.iteratedlog(10, meta)
            num = Decimal.iteratedexp(10, meta, num.iteratedlog(10, meta).div(s).pow(power).mul(s));
        }
    }
    return num;
}

//指数塔软上限
function tetraflow(num, start, power) {
    start = n(start)
    if (isNaN(num.mag)) return new Decimal(0)
    if (num.lte(start)) return num;
    num = num.slog(10); start = start.slog(10);
    return Decimal.tetrate(10, num.sub(start).mul(power).add(start))
}



//Decimal类的软上限
Decimal.prototype.softcap = function (start, power, mode, dis) {
    return Softcap(this, start, power, mode, dis)
}
Decimal.prototype.anti_softcap = function (start, power, mode, dis) {
    return anti_softcap(this, start, power, mode, dis)
}
Decimal.prototype.overflow = function (start, power, meta) {
    return overflow(this, start, power, meta)
}
Decimal.prototype.tetraflow = function (start, power) {
    return tetraflow(this, start, power)
}


function addTP(num, add) {
    if (isNaN(num.mag)) return new Decimal(0)
    return Decimal.tetrate(10, num.slog(10).add(add))
}

Decimal.prototype.addTP = function (power) {
    return addTP(this, power)
}

function mulTP(num, mul) {
    if (isNaN(num.mag)) return new Decimal(0)
    return Decimal.tetrate(10, num.slog(10).mul(mul))
}

Decimal.prototype.mulTP = function (power) {
    return mulTP(this, power)
}
//计算溢出软上限效果
function calcOverflow(x,y,s,height=1) { return x.gte(s) ? height === 1 ? x.max(1).log10().div(y.max(1).log10()) : x.max(1).iteratedlog(10,height).div(y.max(1).iteratedlog(10,height)) : n(1) }