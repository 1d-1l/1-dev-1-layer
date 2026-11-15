"use strict";
//不要删掉上面这行
//passiveGeneration返回的数是普通的数，不用加Decimal/Decimal/PowiainaNum，因为超过1e308之后照样炸
addLayer("ath", {
    name: "ath",
    symbol: "#",
    startData() {
        return {
            unlocked: true,
            points: n(0),
            pause: 0,
            resetTime: n(0),
        }
    },
    tabFormat:[
        ["display-text", function () { return `<h1>本游戏的作者们</h1>`}],
        "blank",
        ["display-text", function () { return player.l1.points.gt(0)?`<b style = "color:white;text-shadow:0 0 3px white">Layer 1-新的开始:aCwAtLe308</b><br>`:``}],
        ["display-text", function () { return player.l2.points.gt(0)?`<b style = "color:rgb(255, 0, 195);text-shadow:0 0 3px rgb(255, 0, 195)">Layer 2-来世再见:User Incremental</b><br>`:``}],
        ["display-text", function () { return player.l3.points.gt(0)?`<b style = "color:rgb(0, 210, 224);text-shadow:0 0 3px rgb(0, 210, 224)">Layer 3-致密压缩:Seanxlx</b><br>`:``}],
        ["display-text", function () { return player.l4.points.gt(0)?`<b style = "color:rgb(255, 153, 17);text-shadow:0 0 3px rgb(255, 153, 17)">Layer 4-战斗意志:Loader3229</b><br>`:``}],
        ["display-text", function () { return player.l5.points.gt(0)?`<b style = "color:rgb(255, 255, 0);text-shadow:0 0 3px rgb(255, 255, 0)">Layer 5-蒙此飞升:kanaenagi</b><br>`:``}],
        ["display-text", function () { return player.l6.points.gt(0)?`<b style = "color: #006903;text-shadow:0 0 3px #006903)">Layer 6-遗留往事:RAXH</b><br>`:``}],
        ["display-text", function () { return player.l7.points.gt(0)?`<b style = "color: #5a5a5a;text-shadow:0 0 3px #5a5a5a">Layer 7-中子轰鸣:User Incremental</b><br>`:``}],
        ["display-text", function () { return player.l8.points.gt(0)?`<b style = "color: red;text-shadow:0 0 3px red">Layer 8-触及高天:Seanxlx</b><br>`:``}],
        ["display-text", function () { return player.l8.voidShaped?`<b class="voidResource2">Layer Void-无人虚空:User Incremental</b><br>`:``}],
        "blank",
        ["display-text", function () { return player.l1.points.gt(0)?`<b style="color:#00000000">Tree tab-tree.js:473362</b><br>`:``}],
    ],
    color: "#FFFFFF",
    resource: "???",
    row: "side",
},
)