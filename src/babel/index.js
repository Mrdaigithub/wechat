"use strict";
!function(e, t) {
    var r = e.body,
        n = (e.querySelector("main"), e.querySelector("footer")),
        i = function(e) {
            return Array.prototype.sort.call(e, function() {
                return Math.random() > .5 ? 1 : -1
            }), e
        },
        o = function() {
            n.addEventListener("mouseover", function() {
                n.className = "hover"
            }, !1), n.addEventListener("mouseout", function() {
                n.className = ""
            }, !1)
        },
        l = function() {
            var t = e.querySelector("#indexBtn");
            t.addEventListener("click", function() {}, !1)
        },
        c = function() {
            var t = "",
                r = e.querySelector(".signIn header i"),
                n = e.querySelector(".signIn ul"),
                i = function o(e) {
                    $.getJSON(e, function(e) {
                        if (t !== JSON.stringify(e)) {
                            var i = "";
                            t = JSON.stringify(e), r.innerHTML = e.length, e.forEach(function(e) {
                                i += "<li><img src=" + e.headimgurl + ' alt="headImg"><p>' + e.nickname + "</p></li>"
                            }), n.innerHTML = i
                        }
                    }), setTimeout(function() {
                        o(e)
                    }, 5e3)
                };
            e.querySelector("#SignBtn").addEventListener("click", function() {
                e.querySelector(".signIn").className = "signIn show", i("http://120.26.53.25/wechat/api/userActive/")
            }, !1)
        },
        a = function() {
            var r = e.querySelector("#timeBtn");
            r.addEventListener("click", function() {
                var r = e.querySelector(".time"),
                    n = e.querySelector("#timeText"),
                    i = e.querySelector(".time button");
                r.className = "time show";
                var o = echarts.init(document.getElementById("timeBox")),
                    l = {
                        total: 60,
                        used: 0
                    };
                n.innerHTML = l.total - l.used, n.style.marginLeft = -parseInt(t.getComputedStyle(n, null).width) / 2 + "px", n.style.marginTop = -parseInt(t.getComputedStyle(n, null).height) / 2 + "px";
                var c = {
                    series: [{
                        type: "pie",
                        radius: ["50%", "70%"],
                        label: {
                            normal: {
                                show: !1,
                                position: "center"
                            },
                            emphasis: {
                                show: !1
                            }
                        },
                        data: [{
                            value: l.used,
                            name: ""
                        }, {
                            value: l.total - l.used,
                            name: ""
                        }]
                    }]
                };
                o.setOption(c);
                var a = function u() {
                    if (l.used >= 60) return n.innerHTML = "时间到", n.style.marginLeft = -parseInt(t.getComputedStyle(n, null).width) / 2 + "px", n.style.marginTop = -parseInt(t.getComputedStyle(n, null).height) / 2 + "px", i.removeAttribute("disabled"), !0;
                    l.used++, n.style.marginLeft = -parseInt(t.getComputedStyle(n, null).width) / 2 + "px", n.style.marginTop = -parseInt(t.getComputedStyle(n, null).height) / 2 + "px";
                    var e = {
                        series: [{
                            type: "pie",
                            radius: ["50%", "70%"],
                            label: {
                                normal: {
                                    show: !1,
                                    position: "center"
                                },
                                emphasis: {
                                    show: !1
                                }
                            },
                            data: [{
                                value: l.used,
                                name: ""
                            }, {
                                value: l.total - l.used,
                                name: ""
                            }]
                        }]
                    };
                    o.setOption(e), n.innerHTML = l.total - l.used, setTimeout(u, 50)
                };
                i.addEventListener("click", function() {
                    i.setAttribute("disabled", "disabled"), a()
                }, !1)
            }, !1)
        },
        u = function() {
            var r = e.querySelector(".prizeLevel ul"),
                n = (e.querySelector(".prizeNum"), !1);
            $.getJSON("http://120.26.53.25/wechat/api/prize/", function(o) {
                var l = "";
                o.forEach(function(e) {
                    l += "<li>" + e.level + "</li>"
                }), r.innerHTML = l, e.querySelector(".prizeLevel p i").innerHTML = r.firstChild.innerHTML, $.getJSON("http://120.26.53.25/wechat/api/userActive/", function(l) {
                    var c = function a(e, t, r) {
                        for (var c = arguments.length <= 3 || void 0 === arguments[3] ? 0 : arguments[3], u = [], p = 0; p < e.length; p++) {
                            for (var s = [], d = 0; d < t.length; d++) s.push(d);
                            u.push(i(s))
                        }
                        c >= u[0].length && (c = 0);
                        for (var h = 0; h < e.length; h++) t[u[h][c]].headimgurl || (t[u[h][c]].headimgurl = "http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png"), e[h].querySelector("img").src = t[u[h][c]].headimgurl, e[h].querySelector("p").innerHTML = t[u[h][c]].nickname;
                        setTimeout(function() {
                            if (!n) {
                                var u = function() {
                                    for (var r = [], n = 0; n < e.length; n++) r.push(n);
                                    r = i(r);
                                    for (var c = 0; c < e.length; c++) e[c].querySelector("img").src = t[r[c]].headimgurl, e[c].querySelector("p").innerHTML = t[r[c]].nickname;
                                    var a = [];
                                    return e.forEach(function(e) {
                                        var t = {};
                                        t.openid = l, l.forEach(function(r) {
                                            e.querySelector("p").innerHTML === r.nickname && (t.openid = r.openid, t.prizeid = o[0].id)
                                        }), a.push(t)
                                    }), $.ajax({
                                        type: "POST",
                                        url: "http://120.26.53.25/wechat/api/getPrizeUser/",
                                        data: JSON.stringify(a),
                                        success: function(e) {}
                                    }), {
                                        v: 0
                                    }
                                }();
                                if ("object" === ("undefined" == typeof u ? "undefined" : _typeof(u))) return u.v
                            }
                            a(e, t, r, ++c)
                        }, r)
                    };
                    o.forEach(function(t) {
                        t.level === e.querySelector(".prizeLevel p i").innerHTML && (e.querySelector(".prizePic img").src = t.picUrl)
                    }), r.addEventListener("click", function(n) {
                        var i = t.event || n;
                        "LI" === i.target.nodeName && (e.querySelector(".prizeLevel p i").innerHTML = i.target.innerHTML, r.className = "hide", e.querySelector(".prizeLevel p span").className = "caret", o.forEach(function(t) {
                            if (t.level === e.querySelector(".prizeLevel p i").innerHTML && (e.querySelector(".prizePic img").src = t.picUrl, parseInt(e.querySelector(".prizeNum span").innerHTML) > parseInt(t.num))) {
                                e.querySelector(".prizeNum span").innerHTML = t.num, e.querySelector(".prize .pull-left ul").innerHTML = "";
                                for (var r = 0; r < parseInt(t.num); r++) e.querySelector(".prize .pull-left ul").innerHTML += '<li><img src="http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png"><p>...</p></li>';
                                e.querySelector(".prizeBtn").addEventListener("click", function() {}, !1)
                            }
                        }))
                    }, !1), e.querySelector(".prizeLevel p").addEventListener("click", function() {
                        "hide" === r.className ? (r.className = "show", e.querySelector(".prizeLevel p span").className = "caret toTop") : (r.className = "hide", e.querySelector(".prizeLevel p span").className = "caret")
                    }, !1), e.querySelector(".lessBtn ").addEventListener("click", function() {
                        var t = parseInt(e.querySelector(".prizeNum span").innerHTML);
                        t > 0 && (e.querySelector(".prizeNum span").innerHTML = --t, e.querySelector(".prize .pull-left ul").innerHTML = e.querySelector(".prize .pull-left ul").innerHTML.replace(/<li><img.+?\/li>/i, ""))
                    }, !1), e.querySelector(".addBtn ").addEventListener("click", function() {
                        var t = l.length,
                            r = 0;
                        o.forEach(function(t) {
                            t.level === e.querySelector(".prizeLevel i").innerHTML && (r = t.num)
                        });
                        var n = parseInt(e.querySelector(".prizeNum span").innerHTML);
                        n < Math.min(t, r) && (e.querySelector(".prizeNum span").innerHTML = ++n, e.querySelector(".prize .pull-left ul").innerHTML += '<li><img src="http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png"><p>...</p></li>')
                    }, !1), e.querySelector(".prizeBtn").addEventListener("click", function() {
                        "start" === e.querySelector(".prizeBtn").innerHTML ? (e.querySelector(".prizeBtn").innerHTML = "stop", n = !0, c(e.querySelectorAll(".prize .pull-left li"), l, 100)) : (e.querySelector(".prizeBtn").innerHTML = "start", n = !1)
                    }, !1)
                })
            })
        },
        p = function() {
            var t = e.querySelector("#voteBtn");
            t.addEventListener("click", function() {
                var t = e.querySelector(".vote"),
                    r = "";
                t.className = "vote show";
                var n = echarts.init(e.querySelector(".voteMain")),
                    i = e.querySelector(".vote i"),
                    o = function l(e) {
                        $.getJSON(e, function(e) {
                            if (r !== JSON.stringify(e)) {
                                var t = 0;
                                e.forEach(function(e) {
                                    t += parseInt(e.num)
                                }), i.innerHTML = t;
                                var o = {
                                    color: ["#3398DB"],
                                    tooltip: {
                                        trigger: "axis",
                                        axisPointer: {
                                            type: "shadow"
                                        }
                                    },
                                    grid: {
                                        left: "3%",
                                        right: "4%",
                                        bottom: "3%",
                                        containLabel: !0
                                    },
                                    xAxis: [{
                                        type: "category",
                                        data: [e[0].lead, e[1].lead, e[2].lead, e[3].lead],
                                        axisTick: {
                                            alignWithLabel: !0
                                        },
                                        axisLabel: {
                                            textStyle: {
                                                color: "#fff"
                                            }
                                        }
                                    }],
                                    yAxis: [{
                                        type: "value",
                                        axisLabel: {
                                            textStyle: {
                                                color: "#fff"
                                            }
                                        }
                                    }],
                                    series: [{
                                        name: "票数",
                                        type: "bar",
                                        barWidth: "60%",
                                        data: [e[0].num, e[1].num, e[2].num, e[3].num]
                                    }]
                                };
                                n.setOption(o), r = JSON.stringify(e)
                            }
                        }), setTimeout(function() {
                            l(e)
                        }, 5e3)
                    };
                o("http://120.26.53.25/wechat/api/vote/")
            }, !1)
        },
        s = function() {
            var n = e.querySelector("#setCloseBtn"),
                i = e.querySelector("#setBtn"),
                o = {
                    bg1Url: "http://o7qephszd.bkt.clouddn.com/wechatBg1.jpg",
                    bg2Url: "http://o7qephszd.bkt.clouddn.com/wechatBg2.jpg",
                    bg3Url: "http://o7qephszd.bkt.clouddn.com/wechatBg3.jpg",
                    bg4Url: "http://o7qephszd.bkt.clouddn.com/wechatBg4.jpg",
                    bg5Url: "http://o7qephszd.bkt.clouddn.com/wechatBg5.jpg",
                    bg6Url: "http://o7qephszd.bkt.clouddn.com/wechatBg6.jpg",
                    bg7Url: "http://o7qephszd.bkt.clouddn.com/wechatBg7.jpg",
                    bg8Url: "http://o7qephszd.bkt.clouddn.com/wechatBg8.jpg",
                    bg9Url: "http://o7qephszd.bkt.clouddn.com/wechatBg9.jpg",
                    bg10Url: "http://o7qephszd.bkt.clouddn.com/wechatBg10.jpg",
                    bg11Url: "http://o7qephszd.bkt.clouddn.com/wechatBg11.jpg",
                    bg12Url: "http://o7qephszd.bkt.clouddn.com/wechatBg12.jpg"
                };
            i.addEventListener("click", function() {
                n.parentNode.parentNode.className = "show", setTimeout(function() {
                    n.parentNode.parentNode.style = "opacity:1"
                }, 1)
            }, !1), n.addEventListener("click", function() {
                n.parentNode.parentNode.style = "opacity:0", setTimeout(function() {
                    n.parentNode.parentNode.className = "hide"
                }, 500)
            }, !1), e.querySelector("#setBgBox ul").addEventListener("click", function(e) {
                var n = t.event || e;
                "IMG" === n.target.nodeName && (r.style.background = "url(" + o[n.target.dataset.flag] + ") center no-repeat")
            }, !1)
        };
    o(), l(), c(), a(), u(), p(), s()
}(document, window);