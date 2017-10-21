//lounge.bundle.js

function _objectWithoutProperties(a, b) {
    var c = {};
    for (var d in a)
        b.indexOf(d) >= 0 || Object.prototype.hasOwnProperty.call(a, d) && (c[d] = a[d]);
    return c
}
define("core/utils/getEmbeddedData", [], function() {
    "use strict";
    return function(a) {
        var b = window.document.getElementById("disqus-" + a);
        try {
            return b && JSON.parse(b.textContent || b.innerHTML)
        } catch (c) {
            return null
        }
    }
}),
define("core/utils/cookies", ["underscore"], function(a) {
    "use strict";
    var b = window.document
      , c = {
        create: function(c, d, e) {
            e || (e = {});
            var f = c + "=" + d + "; path=" + (e.path || "/")
              , g = e.domain
              , h = e.expiresIn;
            if (g && (f += "; domain=." + g),
            a.isNumber(h)) {
                var i = new Date((new Date).getTime() + h);
                f += "; expires=" + i.toGMTString()
            }
            "https:" === b.location.protocol && (f += "; secure"),
            b.cookie = f
        },
        read: function(a) {
            for (var c, d = a + "=", e = b.cookie.split(";"), f = 0; f < e.length; f++)
                if (c = e[f].replace(/^\s+/, ""),
                0 === c.indexOf(d))
                    return c.substring(d.length);
            return null
        },
        erase: function(b, d) {
            return c.create(b, "", a.extend({}, d, {
                expiresIn: -1
            }))
        }
    };
    return c
}),
define("core/utils/fingerprint", [], function() {
    "use strict";
    function a(a) {
        a = a || {};
        var b = a.Math || window.Math
          , c = a.Date || window.Date;
        try {
            var d = (new c).getTimezoneOffset()
              , e = 1
              , f = window.screen;
            f && f.availWidth ? e = f.availWidth * f.availHeight + f.colorDepth : f && f.width && (e = f.width * f.height);
            var g = window.document.documentElement
              , h = g.clientWidth * g.clientHeight;
            return b.abs(17 * d + 25 * e - h)
        } catch (i) {
            return 1
        }
    }
    return {
        get: a
    }
}),
define("core/utils/guid", ["core/utils/fingerprint"], function(a) {
    "use strict";
    function b(a) {
        a = a || {};
        var b = a.Uint32Array || window.Uint32Array
          , c = a.crypto || window.crypto
          , d = a.Math || window.Math;
        try {
            var e = new b(1);
            return c.getRandomValues(e),
            e[0]
        } catch (f) {
            return d.floor(1e9 * d.random())
        }
    }
    function c() {
        var a = window.performance
          , b = a && a.timing;
        if (!b)
            return 1e5;
        var c = b.domainLookupEnd - b.domainLookupStart
          , d = b.connectEnd - b.connectStart
          , e = b.responseStart - b.navigationStart;
        return 11 * c + 13 * d + 17 * e
    }
    function d(d) {
        d = d || {};
        var e = d.Math || window.Math
          , f = Number((new Date).getTime().toString().substring(3))
          , g = e.abs(f + c() - a.get()).toString(32);
        return g += b(d).toString(32)
    }
    return {
        generate: d
    }
}),
define("core/utils/hash", [], function() {
    "use strict";
    var a = function(a) {
        var b, c, d, e = 0;
        if (0 === a.length)
            return e;
        for (b = 0,
        c = a.length; b < c; b++)
            d = a.charCodeAt(b),
            e = (e << 5) - e + d,
            e |= 0;
        return e
    };
    return {
        calculate: a
    }
}),
define("core/analytics/identity", ["exports", "core/utils/cookies", "core/utils/guid", "core/utils/hash", "core/utils/fingerprint"], function(a, b, c, d, e) {
    "use strict";
    var f = a.ImpressionManager = function() {
        this.prevImp = b.read(this.COOKIE_NAME),
        this.setImpressionId(c.generate())
    }
    ;
    f.prototype.COOKIE_NAME = "__jid",
    f.prototype.TTL = 18e5,
    f.prototype.setImpressionId = function(a) {
        this.impId = a,
        this.persist()
    }
    ,
    f.prototype.persist = function() {
        b.create(this.COOKIE_NAME, this.impId, {
            expiresIn: this.TTL
        })
    }
    ,
    a.impression = new f;
    var g = a.UniqueManager = function() {
        var a = b.read(this.COOKIE_NAME) || c.generate();
        b.create(this.COOKIE_NAME, a, {
            domain: window.location.host.split(":")[0],
            expiresIn: this.TTL
        }),
        this.value = a
    }
    ;
    g.prototype.COOKIE_NAME = "disqus_unique",
    g.prototype.TTL = 31536e6,
    g.prototype.isPersistent = function() {
        return b.read(this.COOKIE_NAME) === this.value
    }
    ,
    a.unique = new g,
    a.clientId = function() {
        var b, c = a.unique;
        return c.isPersistent() && (b = c.value),
        b || e.get().toString()
    }
    ,
    a.getPercentBucketForString = function(a) {
        return Math.abs(d.calculate(a) % 100)
    }
    ,
    a.clientPercent = function() {
        return a.getPercentBucketForString(a.clientId())
    }
}),
define("core/config/urls", ["common/urls"], function(a) {
    "use strict";
    return a
}),
define("core/analytics/jester", ["jquery", "underscore", "backbone", "core/analytics/identity", "core/config/urls"], function(a, b, c, d, e) {
    "use strict";
    var f = c.Model.extend({
        url: e.jester + "/event.js",
        defaults: {
            experiment: "default",
            variant: "control"
        },
        setHostReferrer: function(a) {
            a ? a.indexOf("http") === -1 || this.set("page_referrer", a) : this.set("page_referrer", "direct")
        },
        decoratePayload: function(c) {
            c.event || (c.event = "activity"),
            c = b.extend(this.toJSON(), c),
            b.extend(c, {
                imp: d.impression.impId,
                prev_imp: d.impression.prevImp
            }),
            c.section || (c.section = "default"),
            c.area || (c.area = "n/a");
            var e = a.param(c).length;
            if (e > 2048 && this.has("page_referrer")) {
                var f = window.document.createElement("a");
                f.href = this.get("page_referrer");
                var g = f.hostname;
                g && (c.page_referrer_domain = g),
                delete c.page_referrer
            }
            return c
        },
        emit: function(c) {
            return a.ajax({
                url: b.result(this, "url"),
                data: this.decoratePayload(c),
                dataType: "script",
                cache: !0
            })
        }
    })
      , g = function(b) {
        var c = new window.Image;
        return c.src = e.jester + "/stat.gif?" + a.param({
            event: b
        }),
        c
    }
      , h = function(c, d) {
        if (!b.any(d, function(a) {
            return a < 0
        })) {
            b.each(d, function(a, b) {
                d[b] = Math.round(a)
            });
            var f = new window.Image;
            return f.src = e.jester + "/telemetry/" + c + ".gif?" + a.param(d),
            f
        }
    }
      , i = new f;
    return i.setHostReferrer(window.document.referrer),
    {
        ActivityClient: f,
        client: i,
        logStat: g,
        telemetry: h
    }
}),
define("core/utils/urls", [], function() {
    "use strict";
    var a = {}
      , b = window.document.createElement("a");
    return a.getOrigin = function(a) {
        b.href = a;
        var c = b.href.split("/");
        return c[0] + "//" + c[2]
    }
    ,
    a.getHostName = function(a) {
        return b.href = a,
        b.hostname
    }
    ,
    a.getDomainPart = function(b, c) {
        "undefined" == typeof c && (c = 0);
        var d = a.getHostName(b)
          , e = d.split(".").reverse();
        return e[c]
    }
    ,
    a.getQuery = function(a) {
        return b.href = a,
        b.search
    }
    ,
    a.getPathname = function(a) {
        return b.href = a,
        b.pathname
    }
    ,
    a
}),
define("core/frameBus", ["jquery", "underscore", "backbone", "core/utils/urls"], function(a, b, c, d) {
    "use strict";
    var e = window.opener || window.parent
      , f = window.name
      , g = window.document.referrer
      , h = {};
    h.client = d.getOrigin(window.document.location.href),
    h.secureClient = h.client.replace(/^\w+:\/\//, "https://"),
    h.host = g ? d.getOrigin(g) : h.client;
    var i = {
        origins: h,
        messageHandler: function(a) {
            a = a.originalEvent;
            var b;
            try {
                b = JSON.parse(a.data)
            } catch (c) {
                return
            }
            b.name && "!" === b.name[0] && a.origin !== h.client && a.origin !== h.secureClient || "client" === b.scope && i.trigger(b.name, b.data)
        },
        postMessage: function(a) {
            a = JSON.stringify(a),
            e.postMessage(a, "*")
        },
        sendHostMessage: function(a, b) {
            b = b || [],
            i.postMessage({
                scope: "host",
                sender: f,
                name: a,
                data: b
            })
        }
    };
    return b.extend(i, c.Events),
    a(window).on("message", i.messageHandler),
    a(window).on("unload", function() {
        i.sendHostMessage("die")
    }),
    window.DISQUS = window.DISQUS || {},
    window.DISQUS.Bus = i,
    i
}),
define("core/bus", ["backbone", "underscore", "core/frameBus"], function(a, b, c) {
    "use strict";
    var d = b.extend({}, a.Events);
    return d.frame = c,
    d
}),
define("core/utils/storage", [], function() {
    "use strict";
    var a = function(a) {
        var b = "_dsqstorage_";
        try {
            return a.localStorage.setItem(b, b),
            a.localStorage.getItem(b),
            a.localStorage.removeItem(b),
            !0
        } catch (c) {
            return !1
        }
    }(window)
      , b = function() {
        var a = {};
        return {
            getItem: function(b) {
                return a.hasOwnProperty(b) ? a[b] : null
            },
            setItem: function(b, c) {
                a[b] = String(c)
            },
            removeItem: function(b) {
                delete a[b]
            },
            clear: function() {
                a = {}
            }
        }
    }();
    return {
        get: function(a) {
            var b = null;
            try {
                return b = this.backend.getItem(a),
                JSON.parse(b)
            } catch (c) {
                return b
            }
        },
        set: function(a, b) {
            try {
                this.backend.setItem(a, JSON.stringify(b))
            } catch (c) {}
        },
        remove: function(a) {
            try {
                this.backend.removeItem(a)
            } catch (b) {}
        },
        clear: function() {
            try {
                this.backend.clear()
            } catch (a) {}
        },
        backend: a ? window.localStorage : b,
        isPersistent: a
    }
}),
define("core/utils/auth", ["core/utils/cookies"], function(a) {
    "use strict";
    var b = {}
      , c = "disqusauth";
    return b.getFromCookie = function() {
        var b = (a.read(c) || "").replace(/"/g, "").split("|");
        !b || b[1] && b[6] || (b = [],
        a.erase(c, {}));
        var d = parseInt(b[6] || "0", 10);
        return {
            avatarUrl: b[7] ? decodeURIComponent(b[7]) : void 0,
            datetimeFormatting: parseInt(b[4], 10) ? "absolute" : "relative",
            id: d,
            isModerator: parseInt(b[8], 10) > 0,
            staff: Boolean(parseInt(b[2], 10)),
            tzOffset: b[5],
            username: b[1],
            isAuthenticated: Boolean(d && "0" !== d)
        }
    }
    ,
    b
}),
define("core/switches", ["underscore", "remote/config", "core/analytics/identity", "core/utils/storage", "core/utils/auth"], function(a, b, c, d, e) {
    "use strict";
    var f = "switch:"
      , g = {}
      , h = {};
    return h._getKey = function(a) {
        return f + a
    }
    ,
    h.disableFeature = function(a) {
        g[a] = !1
    }
    ,
    h.resetFeature = function(a) {
        g[a] = null
    }
    ,
    h.forceFeature = function(a) {
        g[a] = !0
    }
    ,
    h.getSwitchContext = function(a) {
        var c = d.get(this._getKey(a));
        if (null !== c)
            return c;
        var e = g[a];
        return null != e ? e : (b.lounge && b.lounge.switches || {})[a]
    }
    ,
    h.isFeatureActive = function(b, d) {
        var f = h.getSwitchContext(b);
        if (a.isBoolean(f))
            return f;
        if (!f)
            return !1;
        var g = e.getFromCookie()
          , i = {
            percent: c.clientPercent(),
            user_id: g.id,
            username: g.username,
            is_staff: g.staff,
            is_moderator: g.isModerator
        }
          , j = a.defaults(d || {}, i);
        return a.any(f, function(b, d) {
            var e = j[d];
            return /percent$/.test(d) && a.isNumber(b) ? a.isNumber(e) ? b > e : !!a.isString(e) && b > c.getPercentBucketForString(e) : a.isArray(b) ? a.contains(b, e) : b === e
        })
    }
    ,
    h
}),
define("core/utils/isAdBlockEnabled", [], function() {
    "use strict";
    var a = "adsbox"
      , b = 100
      , c = window.document;
    return function(d) {
        if (d) {
            var e = c.createElement("div");
            e.innerHTML = "&nbsp;",
            e.className = a,
            c.body.appendChild(e),
            setTimeout(function() {
                d(0 === e.offsetHeight),
                c.body.removeChild(e)
            }, b)
        }
    }
}),
define("core/utils/html/toRGBColorString", [], function() {
    "use strict";
    var a = "Color components should be numbers.";
    return function(b) {
        var c = Number(b.red)
          , d = Number(b.green)
          , e = Number(b.blue);
        if (isNaN(c) || isNaN(d) || isNaN(e))
            throw new Error(a);
        var f = "rgb"
          , g = [c, d, e]
          , h = b.alpha;
        if (h) {
            if (h = Number(h),
            isNaN(h))
                throw new Error(a);
            f += "a",
            g.push(h)
        }
        return f + "(" + g + ")"
    }
}),
define("common/analytics/google", ["require", "common/keys", "common/defines"], function(a, b, c) {
    "use strict";
    var d, e = function(a) {
        d = a
    }, f = function(a) {
        d ? d(a) : window._gaq.push(a)
    }, g = function() {
        var d = "";
        if (!c.debug || d) {
            l(b.googleAnalytics),
            m(".disqus.com");
            var e = function() {};
            a([d ? "ga-debug" : "ga"], e, e)
        }
    }, h = {
        component: 1,
        "package": 2,
        forum: 3,
        version: 4,
        userType: 5
    }, i = function(a, b) {
        f(["_setCustomVar", h[a], a, b])
    }, j = function() {
        f(["_trackPageview"])
    }, k = function(a, b, c) {
        f(["_trackEvent", b, a, c, 1])
    }, l = function(a) {
        f(["_setAccount", a])
    }, m = function(a) {
        f(["_setDomainName", a])
    };
    return window._gaq || (window._gaq = []),
    g(),
    {
        setCaller: e,
        setAccount: l,
        setCustomVar: i,
        trackPageview: j,
        trackEvent: k,
        setDomainName: m
    }
}),
define("common/intelligence", ["underscore", "common/analytics/google"], function(a, b) {
    "use strict";
    function c(a) {
        return a.has("remote") ? a.get("remote").domain : a.id ? "disqus" : "not_logged_in"
    }
    function d() {
        b.trackPageview()
    }
    function e(a, c) {
        b.setCustomVar(a, c)
    }
    function f() {
        this.version = "next",
        this.forum = null,
        this.userType = null
    }
    return f.prototype.init = function(a) {
        a = a || {},
        e("component", "embed"),
        a.version && (this.version = a.version),
        e("version", this.version),
        a.forum && (this.forum = a.forum,
        e("forum", a.forum)),
        this.setSession(a.session || "not_logged_in"),
        d()
    }
    ,
    f.prototype.setSession = function(b) {
        var d = a.isString(b) ? b : c(b);
        d !== this.userType && (this.userType = d,
        e("userType", d))
    }
    ,
    f.prototype.trackEvent = function(a) {
        b.trackEvent(a, this.version, this.forum)
    }
    ,
    {
        Intelligence: f,
        setCustomVar: e,
        trackPageview: d,
        getUserType: c
    }
}),
define("common/utils", ["jquery", "underscore", "loglevel", "common/main", "common/urls", "core/utils/cookies"], function(a, b, c, d, e, f) {
    "use strict";
    var g = window.document
      , h = {};
    h.globalUniqueId = function(a) {
        return b.uniqueId(a) + "_" + Number(new Date)
    }
    ,
    h.addStylesheetRules = function(a) {
        function c() {
            var e = b.find(g.styleSheets, function(a) {
                var b = a.ownerNode || a.owningElement;
                return b.id === d
            });
            if (!e)
                return void setTimeout(c, 50);
            for (var f = 0, h = a.length; f < h; f++) {
                var i = 1
                  , j = a[f]
                  , k = j[0]
                  , l = "";
                "[object Array]" === Object.prototype.toString.call(j[1][0]) && (j = j[1],
                i = 0);
                for (var m = j.length; i < m; i++) {
                    var n = j[i];
                    l += n[0] + ":" + n[1] + (n[2] ? " !important" : "") + ";\n"
                }
                e.insertRule ? e.insertRule(k + "{" + l + "}", e.cssRules.length) : e.addRule(k, l, -1)
            }
        }
        var d = "css_" + (new Date).getTime()
          , e = g.createElement("style");
        e.id = d,
        g.getElementsByTagName("head")[0].appendChild(e),
        window.createPopup || e.appendChild(g.createTextNode("")),
        c()
    }
    ;
    var i = h.CORS = {
        handler: function(a, b, c) {
            a && c >= 200 && c < 300 ? a() : b && (c < 200 || c >= 300) && b()
        },
        XHR2: function(a, b, c, d) {
            var e = i.handler
              , f = new window.XMLHttpRequest;
            return f.open(a, b, !0),
            f.onreadystatechange = function() {
                f.readyState === window.XMLHttpRequest.DONE && e(c, d, f.status)
            }
            ,
            f
        }
    };
    i.request = function() {
        return "withCredentials"in new window.XMLHttpRequest ? i.XHR2 : function() {
            return null
        }
    }(),
    h.isWindowClosed = function(a) {
        if (!a)
            return !0;
        try {
            return a.closed || void 0 === a.closed
        } catch (b) {
            return !0
        }
    }
    ,
    h.truncate = function(a, b, c) {
        return c = c || "...",
        a.length > b ? a.slice(0, b) + c : a
    }
    ,
    h.extractDomainForCookies = function(a) {
        return a.split("/")[2].replace(/:[0-9]+/, "")
    }
    ,
    h.cookies = {
        domain: h.extractDomainForCookies(e.root),
        create: function(a, b) {
            var c = 31536e6;
            f.create(a, b, {
                domain: h.cookies.domain,
                expiresIn: c
            })
        },
        read: f.read,
        erase: function(a) {
            f.erase(a, {
                domain: h.cookies.domain
            })
        }
    },
    h.updateURL = function(a, c) {
        var d, e = g.createElement("a");
        return c = c || {},
        e.href = a,
        c.hostname && c.hostname.match(/\.$/) && (c.hostname += e.hostname),
        d = b.extend({
            protocol: e.protocol,
            hostname: e.hostname,
            pathname: e.pathname,
            search: e.search
        }, c),
        d.pathname.match(/^\//) || (d.pathname = "/" + d.pathname),
        d.protocol + "//" + d.hostname + d.pathname + d.search
    }
    ,
    h.injectBaseElement = function(a, b) {
        b = b || g;
        var c = b.getElementsByTagName("base")[0] || b.createElement("base");
        c.target = "_parent",
        a ? c.href = a : c.removeAttribute("href"),
        c.parentNode || (b.head || b.getElementsByTagName("head")[0]).appendChild(c)
    }
    ,
    h.syntaxHighlighter = function() {
        var c = 1
          , e = 2
          , f = null
          , g = null
          , h = []
          , i = {
            highlight: function(a) {
                null === g && i._load(),
                h.push(a),
                g === e && i.scheduleHighlight()
            },
            _highlight: function(b) {
                var c = a(b).html();
                a(b).html(c.replace(/^<br>/, "")),
                f.highlightBlock(b),
                i.scheduleHighlight()
            },
            scheduleHighlight: function() {
                var a = h.shift();
                a && window.requestAnimationFrame(b.bind(i._highlight, i, a))
            },
            _load: function() {
                g = c,
                d.loadCss("https://c.disquscdn.com/next/embed/styles/highlight.3128dd90ecaebd8542ac3442033f3f00.css"),
                require(["common/vendor_extensions/highlight"], function(a) {
                    g = e,
                    f = a,
                    i.scheduleHighlight()
                })
            }
        };
        return i
    }();
    var j = a("html");
    h.getPageHeight = function() {
        return j.height()
    }
    ,
    h.calculatePositionFullscreen = function() {
        return {
            pageOffset: a(window).scrollTop(),
            height: g.documentElement.clientHeight,
            frameOffset: {
                left: 0,
                top: 0
            }
        }
    }
    ,
    h.triggerClick = function(a, b) {
        var c, d, e = a[0], f = {
            altKey: !1,
            button: 0,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1
        };
        if (g.createEvent) {
            if (c = g.createEvent("MouseEvents"),
            b)
                for (d in f)
                    f.hasOwnProperty(d) && b.hasOwnProperty(d) && (f[d] = b[d]);
            c.initMouseEvent("click", !0, !0, window, 0, 0, 0, 0, 0, f.ctrlKey, f.altKey, f.shiftKey, f.metaKey, 0, null),
            e.dispatchEvent && e.dispatchEvent(c)
        } else if (g.createEventObject) {
            if (c = g.createEventObject(),
            c.eventType = "click",
            b)
                for (d in f)
                    f.hasOwnProperty(d) && b.hasOwnProperty(d) && (c[d] = b[d]);
            e.fireEvent("onclick", c)
        }
    }
    ,
    h.delayLinkClick = function(a, c) {
        a.preventDefault(),
        b.delay(b.bind(h.triggerClick, this, c, a.originalEvent), 100)
    }
    ,
    h.mixin = function(a, c, d) {
        var e = a.prototype
          , f = b.extend({}, c, d);
        if (b.defaults(e, f),
        b.defaults(e.events, f.events),
        void 0 !== e.initialize && void 0 !== f.initialize) {
            var g = e.initialize;
            e.initialize = function() {
                var a = g.apply(this, arguments);
                return f.initialize.apply(this, arguments),
                a
            }
        }
        return a
    }
    ,
    h.extractService = function(b, c) {
        var d = "[data-action^=" + c + "]"
          , e = a(b);
        e = e.is(d) && e || e.closest(d);
        var f = e.attr("data-action") || ":"
          , g = f.split(":")[1];
        return g
    }
    ,
    h.getConfigFromHash = function(a) {
        var d, e = a.location.hash;
        try {
            d = JSON.parse(decodeURIComponent(String(e).substr(1)))
        } catch (f) {
            c.debug("Failed to parse config from URL hash", f)
        }
        return b.isObject(d) ? d : {}
    }
    ;
    var k = /[<>]|:\/\//;
    return h.isPlainText = function(a) {
        return !a.match(k)
    }
    ,
    h.isDNTEnabled = function(a) {
        return a || (a = window),
        "1" === a.navigator.doNotTrack || "yes" === a.navigator.doNotTrack || "1" === a.navigator.msDoNotTrack
    }
    ,
    h.shouldSample = function(a) {
        var b = parseInt(a, 10);
        return !!b && (!(b > 100) && Math.random() < b / 100)
    }
    ,
    h.decorate = function() {
        var a, c = b.toArray(arguments), d = c.pop();
        return b.isFunction(d) || (a = d,
        d = c.pop()),
        b.reduceRight(c, function(b, c) {
            return c.call(a || this, b)
        }, function() {
            return d.apply(a || this, arguments)
        })
    }
    ,
    h
}),
define("lounge/tracking", ["jquery", "underscore", "raven", "core/analytics/identity", "core/analytics/jester", "core/bus", "core/switches", "core/utils/url/serialize", "core/utils/isAdBlockEnabled", "core/utils/html/toRGBColorString", "remote/config", "common/intelligence", "common/urls", "common/utils", "common/main"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    "use strict";
    function p(c, k) {
        function p(a, f, i) {
            var j = {
                abe: i ? "1" : "0",
                embed_hidden: k.config.isBehindClick ? "1" : "0",
                integration: k.config.integration
            };
            if (g.isFeatureActive("init_embed_activity"))
                b.extend(j, {
                    verb: "load",
                    object_type: "product",
                    object_id: "embed"
                }),
                e.client.emit(j);
            else {
                var l = a.user.id
                  , o = n.isDNTEnabled();
                b.extend(j, {
                    event: "init_embed",
                    thread: w,
                    forum: t,
                    forum_id: u,
                    imp: d.impression.impId,
                    prev_imp: d.impression.prevImp,
                    thread_slug: v.get("slug"),
                    user_type: a.user.get("user_type") || "anon",
                    referrer: c.document.referrer,
                    theme: "next",
                    dnt: o ? "1" : "0",
                    tracking_enabled: f ? "1" : "0"
                }, k.config.experiment),
                l && "0" !== l && (j.user_id = l);
                var p = s.get("settings");
                p && b.has(p, "adsProductLinksEnabled") && b.extend(j, {
                    promoted_enabled: p.adsProductLinksEnabled,
                    max_enabled: p.adsPositionTopEnabled
                }),
                (new c.Image).src = h(m.jester + "/event.gif", j, !1)
            }
            if (v.isModerator(a.user)) {
                var q = c.document.createElement("iframe");
                q.src = "https://disqusads.com/enable-logging",
                q.style.display = "none",
                c.document.body.appendChild(q)
            }
        }
        var r = new l.Intelligence
          , s = k.forum
          , t = s.id
          , u = s.get("pk")
          , v = k.thread
          , w = v.id;
        k.session.on("change:id", function(a) {
            e.client.set("user_id", a.id)
        }),
        k.session.once("change:id", function() {
            var a = this
              , b = q.shouldTrack(s, this.user);
            b && q.load3rdParties(v, k),
            r.init({
                version: "next",
                forum: t,
                session: a.user
            }),
            k.session.on("change:id", function(a) {
                r.setSession(a),
                r.trackEvent(a.id ? "login" : "logout")
            }),
            i(function(c) {
                p(a, b, c)
            })
        }),
        e.client.set({
            product: "embed",
            thread: w,
            thread_id: w,
            forum: t,
            forum_id: u,
            zone: "thread",
            version: o.version
        }),
        k.once("bootstrap:complete", function() {
            e.client.set({
                page_url: k.config.referrer
            });
            var a = k.config.experiment;
            a && e.client.set({
                experiment: a.experiment,
                variant: a.variant,
                service: a.service
            }),
            e.client.setHostReferrer(k.config.hostReferrer)
        });
        var x = {
            inViewport: function() {
                var d = k.config;
                r.trackEvent("view_embed");
                var f = {
                    color_scheme: d.colorScheme,
                    anchor_color: j(d.anchorColor),
                    typeface: d.typeface,
                    width: a(c.document).width()
                };
                f = b.pick(f, function(a, c) {
                    switch (c) {
                    case "width":
                        return b.isNumber(a);
                    default:
                        return b.isString(a) && "" !== a
                    }
                }),
                e.client.emit({
                    verb: "view",
                    object_type: "product",
                    object_id: "embed",
                    extra_data: JSON.stringify(f)
                }),
                k.off("inViewport")
            },
            "uiAction:createPost": function(a) {
                k.session.user.id || r.setSession("guest"),
                a.get("parent") ? r.trackEvent("post_comment_reply") : r.trackEvent("post_comment")
            },
            "uiCallback:postCreated": function(a, c) {
                c = c || {},
                b.extend(c, {
                    object_type: "post",
                    object_id: a.id,
                    verb: "post"
                }),
                a.has("parent") && (c.target_type = "post",
                c.target_id = a.get("parent")),
                e.client.emit(c)
            },
            "uiAction:seeMore": function(a) {
                e.client.emit({
                    verb: "open",
                    object_type: "section",
                    object_id: "thread/page-" + a
                })
            },
            "uiAction:postUpvote": function(a, b) {
                r.trackEvent("like_comment"),
                e.client.emit({
                    verb: "like",
                    object_type: "post",
                    object_id: a.id,
                    area: q.getEventTrackingArea(b)
                })
            },
            "uiAction:postUnvote": function(a, b) {
                e.client.emit({
                    verb: "unlike",
                    object_type: "post",
                    object_id: a.id,
                    area: q.getEventTrackingArea(b)
                })
            },
            "uiAction:postDownvote": function(a, b) {
                r.trackEvent("dislike_comment"),
                e.client.emit({
                    verb: "dislike",
                    object_type: "post",
                    object_id: a.id,
                    area: q.getEventTrackingArea(b)
                })
            },
            "uiAction:upvotersCardShow": function() {
                r.trackEvent("upvoters_card_shown")
            },
            "uiAction:showProfileFromUpvotes": function() {
                r.trackEvent("upvoters_profile_click")
            },
            "uiAction:threadUnlike": function() {
                e.client.emit({
                    verb: "unlike",
                    object_type: "thread",
                    zone: "thread"
                })
            },
            "uiAction:threadLike": function() {
                r.trackEvent("like_thread"),
                e.client.emit({
                    verb: "like",
                    object_type: "thread"
                })
            },
            "uiAction:postShare": function(a, b) {
                r.trackEvent("share_comment_" + b),
                e.client.emit({
                    verb: "share",
                    object_type: "post",
                    object_id: a.id,
                    target_type: "service",
                    target_id: b
                })
            },
            "uiAction:threadShare": function(a) {
                r.trackEvent("share_thread_" + a),
                e.client.emit({
                    verb: "share",
                    object_type: "thread",
                    target_type: "service",
                    target_id: a
                })
            },
            "uiAction:clickLink": function(a, b) {
                e.client.emit({
                    verb: "click",
                    object_type: "link",
                    object_id: a[0].href,
                    area: q.getEventTrackingArea(b)
                })
            },
            "uiAction:followUser": function(a) {
                r.trackEvent("follow_user"),
                e.client.emit({
                    verb: "follow",
                    object_type: "user",
                    object_id: a.id
                })
            },
            "uiAction:unfollowUser": function(a) {
                e.client.emit({
                    verb: "stop-following",
                    object_type: "user",
                    object_id: a.id
                })
            },
            "uiAction:openLogin": function(a) {
                r.trackEvent("open_login_" + a),
                e.client.emit({
                    verb: "open",
                    object_type: "login",
                    object_id: a
                })
            },
            "uiAction:finishRegistrationEmbed": function() {
                r.trackEvent("finish_registration_embed")
            },
            "uiAction:finishAccountComplete": function() {
                r.trackEvent("finish_account_complete")
            },
            "uiAction:onboardAlertShow": function() {
                e.client.emit({
                    verb: "view",
                    object_type: "area",
                    object_id: "onboard_alert"
                })
            },
            "uiAction:onboardAlertDismiss": function() {
                e.client.emit({
                    verb: "close",
                    object_type: "area",
                    object_id: "onboard_alert"
                })
            },
            "uiAction:openHome": function(a) {
                e.client.emit({
                    verb: "open",
                    object_type: "product",
                    object_id: "bridge",
                    section: a
                })
            },
            "uiAction:viewBanUser": function() {
                e.client.emit({
                    verb: "view",
                    object_type: "area",
                    object_id: "ban_user"
                })
            },
            "uiAction:clickBanUser": function() {
                e.client.emit({
                    verb: "click",
                    object_type: "button",
                    object_id: "ban_user"
                })
            },
            "uiAction:viewFlagPost": function() {
                e.client.emit({
                    verb: "view",
                    object_type: "area",
                    object_id: "flag_post"
                })
            },
            "uiAction:clickFlagPost": function() {
                e.client.emit({
                    verb: "click",
                    object_type: "button",
                    object_id: "flag_post"
                })
            },
            "uiAction:viewBlockUser": function() {
                e.client.emit({
                    verb: "view",
                    object_type: "area",
                    object_id: "block_user"
                })
            },
            "uiAction:clickBlockUser": function() {
                e.client.emit({
                    verb: "click",
                    object_type: "button",
                    object_id: "block_user"
                })
            },
            "uiAction:viewUpgradeCard": function() {
                e.client.emit({
                    verb: "hover",
                    object_type: "icon",
                    object_id: "disqus_pro",
                    organization_id: s.get("organizationId")
                })
            },
            "uiAction:clickUpgrade": function() {
                e.client.emit({
                    verb: "click",
                    object_type: "button",
                    object_id: "subscriptions",
                    organization_id: s.get("organizationId")
                })
            },
            "uiAction:clickCommentPolicy": function(a) {
                e.client.emit({
                    verb: "click",
                    object_type: "link",
                    section: "comment_policy",
                    object_id: a
                })
            },
            "uiAction:clickThreadPremoderate": function() {
                e.client.emit({
                    verb: "click",
                    object_type: "button",
                    object_id: "premoderate_thread"
                })
            },
            viewActivity: function(a, b) {
                var c = {
                    verb: "view",
                    object_type: a,
                    object_id: b
                };
                e.client.emit(c)
            }
        };
        k.on(x),
        f.on(x)
    }
    var q = {};
    return q.init = function(a) {
        p(window, a)
    }
    ,
    q.getEventTrackingArea = function(b) {
        return a(b.currentTarget).closest("[data-tracking-area]").attr("data-tracking-area")
    }
    ,
    q.load3rdParties = function(d, e) {
        if (m.glitter) {
            var f = k.lounge.tracking || {}
              , g = f.iframe_limit || 0
              , h = {
                postCount: d.get("posts") || 0,
                likeCount: d.get("likes") || 0,
                postVoteCount: b.reduce(d.posts.pluck("likes"), function(a, b) {
                    return a + b
                }, 0)
            };
            a.ajax({
                dataType: "jsonp",
                cache: !0,
                url: m.glitter,
                data: {
                    forum_shortname: d.forum.id,
                    thread_id: d.id,
                    referer: e.config.hostReferrer
                },
                jsonpCallback: "dsqGlitterResponseHandler",
                success: function(d) {
                    var e = a("body");
                    b.each(d, function(d) {
                        if (!("img" !== d.type && "iframe" !== d.type || "iframe" === d.type && (g -= 1,
                        g < 0))) {
                            var f;
                            try {
                                f = d.url.replace(/\{\{(.+?)\}\}/g, function(a, c) {
                                    var d = c.trim();
                                    if (!h.hasOwnProperty(d))
                                        throw new Error("Unknown template variable in tracker URL: " + d);
                                    return b.escape(h[d])
                                }),
                                e.append(a("<" + d.type + ">").hide().attr("src", f))
                            } catch (i) {
                                c.captureException(i)
                            }
                        }
                    })
                }
            })
        }
    }
    ,
    q.shouldTrack = function(a, b) {
        return !(a && a.get("settings").disable3rdPartyTrackers || b && b.get("disable3rdPartyTrackers") || "1" === n.cookies.read("disqus_tracking_optout") || n.isDNTEnabled())
    }
    ,
    q
}),
define("common/jsxUtils", ["underscore"], function(a) {
    "use strict";
    return {
        append: function(b, c) {
            var d = function e(c) {
                if (null !== c)
                    return a.isArray(c) ? void c.forEach(e) : a.isElement(c) || c && c.nodeType === window.Node.DOCUMENT_FRAGMENT_NODE ? void b.appendChild(c) : void b.appendChild(window.document.createTextNode(c))
            };
            d(c)
        }
    }
});
var _extends = Object.assign || function(a) {
    for (var b = 1; b < arguments.length; b++) {
        var c = arguments[b];
        for (var d in c)
            Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
    }
    return a
}
;
define("react", ["jquery", "underscore", "common/jsxUtils"], function(a, b, c) {
    "use strict";
    var d = window.document;
    return {
        createElement: function(e, f) {
            for (var g = arguments.length, h = Array(g > 2 ? g - 2 : 0), i = 2; i < g; i++)
                h[i - 2] = arguments[i];
            if ("function" == typeof e) {
                h.length > 0 && (f = _extends({
                    children: 1 === h.length ? h[0] : h
                }, f));
                var j = e(f);
                if (b.isArray(j)) {
                    var k = d.createDocumentFragment();
                    return c.append(k, j),
                    k
                }
                return j
            }
            if ("string" != typeof e)
                throw new Error("Unknown type");
            var l = d.createElement(e)
              , m = !1;
            return f && Object.keys(f).forEach(function(b) {
                var c = f[b];
                if (/^(?:data-|aria-|role$)/.test(b))
                    null !== c && l.setAttribute(b, c);
                else if ("dangerouslySetInnerHTML" === b)
                    m = !0,
                    l.innerHTML = c && c.__html || "";
                else if ("style" === b)
                    Object.keys(c).forEach(function(a) {
                        l.style[a] = c[a]
                    });
                else if (/^on[A-Z]/.test(b))
                    c && a(l).on(b.slice(2).toLowerCase(), c);
                else if ("key" === b)
                    ;
                else
                    try {
                        l[b] = c
                    } catch (d) {}
            }),
            m || c.append(l, h),
            l
        }
    }
}),
define("react-dom", ["common/jsxUtils"], function(a) {
    "use strict";
    return {
        render: function(b, c, d) {
            return c.innerHTML = "",
            a.append(c, b),
            d && d(),
            null
        }
    }
}),
define("core/api", ["jquery", "underscore", "backbone", "core/config", "core/utils"], function(a, b, c, d, e) {
    "use strict";
    function f(a) {
        return l.href = a,
        l.origin || l.protocol + "//" + l.hostname + (l.port ? ":" + l.port : "")
    }
    function g(a) {
        return a.replace(/^(http:)?\/\//, "https://")
    }
    function h(c) {
        c = b.defaults(c, m),
        c.traditional = !0,
        f(window.location.href) !== f(c.url) && (c.xhrFields = {
            withCredentials: !0
        }),
        c.omitDisqusApiKey || (c.data = c.data || {},
        window.FormData && c.data instanceof window.FormData ? c.url = e.serialize(c.url, {
            api_key: d.keys.api
        }) : c.data.api_key = d.keys.api);
        var g = c.error;
        return c.error = function(a) {
            n.trigger("error", a),
            b.isFunction(g) && g(a)
        }
        ,
        a.ajax(c)
    }
    function i(a, c) {
        return c = c || {},
        c.url = j(a),
        c.omitDisqusApiKey || (c.data = b.extend(c.data || {}, {
            api_key: d.keys.api
        })),
        n.trigger("call", c),
        h(c).always(b.bind(this.trigger, this, "complete", c))
    }
    function j(a) {
        return /(https?:)?\/\//.test(a) ? g(a) : d.urls.api + a
    }
    var k = window.document
      , l = k.createElement("a")
      , m = {}
      , n = {
        ERROR_CODES: {
            OBJ_NOT_FOUND: 8,
            MAX_ITEMS_REACHED: 24
        },
        ajax: h,
        call: i,
        getURL: j,
        defaults: function(a) {
            Object.keys(a).forEach(function(c) {
                var d = a[c]
                  , e = m[c];
                b.isObject(d) && b.isObject(e) ? b.extend(e, d) : m[c] = d
            })
        },
        headers: function(a) {
            var c = b.extend({}, m.headers, a);
            return m.headers = b.pick(c, Boolean),
            m.headers
        },
        makeHttps: g
    };
    return b.extend(n, c.Events),
    n
}),
define("core/templates/handlebars.partials", ["handlebars"], function(a) {
    a.registerPartial("cardGuestUpvoterText", a.template({
        1: function(a, b, c, d, e) {
            return " " + a.escapeExpression(c.gettext.call(null != b ? b : {}, "%(guestCount)s Guest Votes", {
                name: "gettext",
                hash: {
                    guestCount: null != b ? b.guestCount : b
                },
                data: e
            })) + " "
        },
        3: function(a, b, c, d, e) {
            return " " + a.escapeExpression(c.gettext.call(null != b ? b : {}, "1 Guest Vote", {
                name: "gettext",
                hash: {},
                data: e
            })) + " "
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f, g = null != b ? b : {};
            return (null != (f = c["if"].call(g, c.gt.call(g, null != b ? b.guestCount : b, 1, {
                name: "gt",
                hash: {},
                data: e
            }), {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.program(3, e, 0),
                data: e
            })) ? f : "") + "\n"
        },
        useData: !0
    })),
    a.registerPartial("cardGuestUser", a.template({
        1: function(a, b, c, d, e) {
            var f, g = null != b ? b : {}, h = a.lambda, i = a.escapeExpression;
            return '<li class="user ' + (null != (f = c["if"].call(g, null != b ? b.highlight : b, {
                name: "if",
                hash: {},
                fn: a.program(2, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + '" data-role="guest">\n<span class="avatar" title="' + i(h(null != b ? b.guestText : b, b)) + '">\n<img src="' + i(h(null != b ? b.guestAvatarUrl : b, b)) + '" alt="' + i(c.gettext.call(g, "Avatar", {
                name: "gettext",
                hash: {},
                data: e
            })) + '" />\n</span>\n<span class="username" title="' + i(h(null != b ? b.guestText : b, b)) + '">\n' + i(h(null != b ? b.guestText : b, b)) + "\n</span>\n</li>\n"
        },
        2: function(a, b, c, d, e) {
            return "highlight"
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f;
            return null != (f = c["if"].call(null != b ? b : {}, null != b ? b.guestCount : b, {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : ""
        },
        useData: !0
    })),
    a.registerPartial("cardOtherUserText", a.template({
        1: function(a, b, c, d, e) {
            return " " + a.escapeExpression(c.gettext.call(null != b ? b : {}, "%(guestCount)s Others", {
                name: "gettext",
                hash: {
                    guestCount: null != b ? b.guestCount : b
                },
                data: e
            })) + " "
        },
        3: function(a, b, c, d, e) {
            return " " + a.escapeExpression(c.gettext.call(null != b ? b : {}, "1 Other", {
                name: "gettext",
                hash: {},
                data: e
            })) + " "
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f, g = null != b ? b : {};
            return (null != (f = c["if"].call(g, c.gt.call(g, null != b ? b.guestCount : b, 1, {
                name: "gt",
                hash: {},
                data: e
            }), {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.program(3, e, 0),
                data: e
            })) ? f : "") + "\n"
        },
        useData: !0
    })),
    a.registerPartial("cardUser", a.template({
        1: function(a, b, c, d, e) {
            return "highlight"
        },
        3: function(a, b, c, d, e) {
            return 'data-action="profile"'
        },
        5: function(a, b, c, d, e) {
            var f, g = a.lambda, h = a.escapeExpression;
            return '<span class="avatar">\n<img src="' + h(g(null != (f = null != b ? b.avatar : b) ? f.cache : f, b)) + '" alt="' + h(c.gettext.call(null != b ? b : {}, "Avatar", {
                name: "gettext",
                hash: {},
                data: e
            })) + '" />\n</span>\n<span class="username">\n' + h(g(null != b ? b.name : b, b)) + "\n</span>\n"
        },
        7: function(a, b, c, d, e) {
            var f, g = a.lambda, h = a.escapeExpression;
            return '<a class="avatar" href="' + h(g(null != b ? b.profileUrl : b, b)) + '" title="' + h(g(null != b ? b.name : b, b)) + '" target="_blank" rel="noopener noreferrer">\n<img src="' + h(g(null != (f = null != b ? b.avatar : b) ? f.cache : f, b)) + '" alt="' + h(c.gettext.call(null != b ? b : {}, "Avatar", {
                name: "gettext",
                hash: {},
                data: e
            })) + '" />\n</a>\n<a class="username" href="' + h(g(null != b ? b.profileUrl : b, b)) + '" title="' + h(g(null != b ? b.name : b, b)) + '" target="_blank" rel="noopener noreferrer">\n' + h(g(null != b ? b.name : b, b)) + "\n</a>\n"
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f, g = null != b ? b : {};
            return '<li class="user ' + (null != (f = c["if"].call(g, null != b ? b.highlight : b, {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + '" ' + (null != (f = c.unless.call(g, c["switch"].call(g, "sso_less_branding", {
                name: "switch",
                hash: {
                    forum: null != b ? b.forumId : b
                },
                data: e
            }), {
                name: "unless",
                hash: {},
                fn: a.program(3, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + ' data-username="' + a.escapeExpression(a.lambda(null != b ? b.username : b, b)) + '">\n' + (null != (f = c.if_all.call(g, c["switch"].call(g, "sso_less_branding", {
                name: "switch",
                hash: {
                    forum: null != b ? b.forumId : b
                },
                data: e
            }), c.ne.call(g, null != b ? b.isSSOProfileUrl : b, !0, {
                name: "ne",
                hash: {},
                data: e
            }), {
                name: "if_all",
                hash: {},
                fn: a.program(5, e, 0),
                inverse: a.program(7, e, 0),
                data: e
            })) ? f : "") + "</li>\n"
        },
        useData: !0
    })),
    a.registerPartial("carouselArrowLeft", a.template({
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            return '<button class="carousel-control carousel-control__previous"><span class="icon icon-right-bracket icon-flipped"></span></button>\n'
        },
        useData: !0
    })),
    a.registerPartial("carouselArrowRight", a.template({
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            return '<button class="carousel-control carousel-control__next"><span class="icon icon-right-bracket"></span></button>\n'
        },
        useData: !0
    })),
    a.registerPartial("channelsHeader", a.template({
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f = null != b ? b : {}
              , g = a.escapeExpression;
            return '<div class="align-inline spacing-top">\n<div class="module-header__icon icon-colorful spacing-right">\n<svg class="icon-discover" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 18 18" enable-background="new 0 0 18 18" xml:space="preserve" width="26" height="26"><rect x="14" width="4" height="4" class="dot"/><rect x="14" y="7" width="4" height="4" class="dot"/><rect x="14" y="14" width="4" height="4" class="dot"/><rect x="7" width="4" height="4" class="dot"/><rect x="7" y="7" width="4" height="4" class="dot"/><rect x="7" y="14" width="4" height="4" class="dot"/><rect width="4" height="4" class="dot"/><rect y="7" width="4" height="4" class="dot"/><rect y="14" width="4" height="4" class="dot"/></g></svg>\n</div>\n<div class="module-header__title">\n<h1 class="text-larger text-darker">' + g(c.gettext.call(f, "Channels", {
                name: "gettext",
                hash: {},
                data: e
            })) + '</h1>\n</div>\n</div>\n<p class="text-medium text-gray spacing-bottom-narrow">' + g(c.gettext.call(f, "Places to start your own discussions.", {
                name: "gettext",
                hash: {},
                data: e
            })) + "</p>\n"
        },
        useData: !0
    })),
    a.registerPartial("genericFollowButton", a.template({
        1: function(a, b, c, d, e) {
            return " active"
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f, g = null != b ? b : {}, h = a.escapeExpression;
            return '<button class="btn-follow' + (null != (f = c["if"].call(g, null != b ? b.isFollowing : b, {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + '" data-action="toggle-follow">\n<span class="symbol-default"><span class="icon-plus"></span></span><span class="text-default">' + h(c.gettext.call(g, "Follow", {
                name: "gettext",
                hash: {},
                data: e
            })) + '</span><span class="symbol-following"><span class="icon-checkmark"></span></span><span class="text-following">' + h(c.gettext.call(g, "Following", {
                name: "gettext",
                hash: {},
                data: e
            })) + "</span>\n</button>\n"
        },
        useData: !0
    }))
}),
define("core/extensions/helpers/eq", [], function() {
    "use strict";
    return function(a, b) {
        return a === b
    }
}),
define("core/extensions/helpers/ne", [], function() {
    "use strict";
    return function(a, b) {
        return a !== b
    }
}),
define("core/extensions/helpers/gt", [], function() {
    "use strict";
    return function(a, b) {
        return a > b
    }
}),
define("core/extensions/helpers/lt", [], function() {
    "use strict";
    return function(a, b) {
        return a < b
    }
}),
define("core/extensions/helpers/ge", [], function() {
    "use strict";
    return function(a, b) {
        return a >= b
    }
}),
define("core/extensions/helpers/le", [], function() {
    "use strict";
    return function(a, b) {
        return a <= b
    }
}),
define("core/extensions/helpers/typeof", [], function() {
    "use strict";
    return function(a, b) {
        return typeof a === b
    }
}),
define("core/extensions/helpers/notNull", [], function() {
    "use strict";
    return function(a) {
        return null !== a
    }
}),
define("core/extensions/helpers/any", [], function() {
    "use strict";
    return function() {
        for (var a = arguments.length, b = 0; b < a - 1; b++)
            if (arguments[b])
                return arguments[b]
    }
}),
define("core/extensions/helpers/if_any", [], function() {
    "use strict";
    return function() {
        for (var a = arguments.length, b = arguments[a - 1], c = 0; c < a - 1; c++)
            if (arguments[c])
                return b.fn(this);
        return b.inverse(this)
    }
}),
define("core/extensions/helpers/if_all", [], function() {
    "use strict";
    return function() {
        for (var a = arguments.length, b = arguments[a - 1], c = 0; c < a - 1; c++)
            if (!arguments[c])
                return b.inverse(this);
        return b.fn(this)
    }
}),
define("core/extensions/helpers/switch", ["core/switches", "core/utils/object/extend"], function(a, b) {
    "use strict";
    return function(c, d) {
        return a.isFeatureActive(c, b({}, d.hash))
    }
}),
define("core/extensions/helpers/partial", ["handlebars"], function(a) {
    "use strict";
    return function(b, c) {
        a.registerPartial(b, c.fn)
    }
}),
define("core/extensions/helpers/getPartial", ["handlebars"], function(a) {
    "use strict";
    return function(b, c, d) {
        return "undefined" == typeof d && (d = c,
        c = this,
        a.Utils.extend(c, d.hash)),
        new a.SafeString(a.partials[b](c, d))
    }
}),
define("core/extensions/helpers/gettext", ["handlebars", "core/strings"], function(a, b) {
    "use strict";
    return function() {
        var c, d, e, f, g = arguments.length, h = arguments[g - 1], i = h.hash, j = arguments[0], k = a.partials;
        j = a.Utils.escapeExpression(b.get(j));
        for (e in i)
            i.hasOwnProperty(e) && (d = new RegExp("%\\((" + e + ")\\)s","gm"),
            c = i[e],
            f = c && c.executePartial,
            f && (c = k[c.partial].call(this, c.context, h)),
            void 0 === c || null === c || "number" == typeof c && isNaN(c) ? c = "" : f || (c = a.Utils.escapeExpression(c)),
            j = j.replace(d, c.toString()));
        return new a.SafeString(j)
    }
}),
define("core/utils/object/get", [], function() {
    "use strict";
    return function(a, b, c) {
        for (var d = 0, e = b.length; a && d < e; )
            a = a[b[d]],
            d += 1;
        return d < e || void 0 === a ? c : a
    }
}),
define("core/extensions/helpers/urlfor", ["core/config/urls", "core/utils/object/get"], function(a, b) {
    "use strict";
    return function(c) {
        return b(a, c.split("."))
    }
}),
define("core/extensions/helpers/html", ["handlebars"], function(a) {
    "use strict";
    return function(b) {
        return new a.SafeString(b || "")
    }
}),
define("core/extensions/helpers/with", [], function() {
    "use strict";
    return function() {
        var a = arguments.length
          , b = arguments[a - 1]
          , c = arguments[0];
        return 3 === a ? (c = {},
        c[arguments[0]] = arguments[1]) : "_window_" === c && (c = window),
        b.fn(c)
    }
}),
define("core/extensions/helpers/each", ["handlebars"], function(a) {
    "use strict";
    return function(b, c) {
        var d, e, f, g = c.fn, h = c.inverse, i = 0, j = "";
        if (c.data && (d = a.createFrame(c.data)),
        b && "object" == typeof b)
            if ("[object Array]" === Object.prototype.toString.call(b))
                for (f = b.length; i < f; i++)
                    d && (d.index = i,
                    d.length = b.length),
                    j += g(b[i], {
                        data: d
                    });
            else
                for (e in b)
                    b.hasOwnProperty(e) && (d && (d.key = e),
                    j += g(b[e], {
                        data: d
                    }),
                    i += 1);
        return 0 === i && (j = h(this)),
        j
    }
}),
define("core/extensions/helpers/log", [], function() {
    "use strict";
    return function(a) {
        console.log(a, this)
    }
}),
define("core/extensions/helpers/debug", [], function() {
    "use strict";
    return function() {}
}),
define("core/extensions/helpers/geturl", [], function() {
    "use strict";
    return window.geturl || function(a) {
        return a
    }
}),
define("core/extensions/helpers/tag", ["handlebars"], function(a) {
    "use strict";
    return function(b, c) {
        var d = ["<" + b]
          , e = c.hash.text;
        delete c.hash.text;
        for (var f in c.hash)
            c.hash.hasOwnProperty(f) && d.push(" " + f + '="' + a.escapeExpression(c.hash[f]) + '"');
        return d.push(">" + a.escapeExpression(e) + "</" + b + ">"),
        new a.SafeString(d.join(""))
    }
}),
define("core/extensions/helpers/now", ["moment"], function(a) {
    "use strict";
    return function(b) {
        return a().format(b)
    }
}),
define("core/extensions/handlebars.helpers", ["require", "handlebars", "./helpers/eq", "./helpers/ne", "./helpers/gt", "./helpers/lt", "./helpers/ge", "./helpers/le", "./helpers/typeof", "./helpers/notNull", "./helpers/any", "./helpers/if_any", "./helpers/if_all", "./helpers/switch", "./helpers/partial", "./helpers/getPartial", "./helpers/gettext", "./helpers/urlfor", "./helpers/html", "./helpers/with", "./helpers/each", "./helpers/log", "./helpers/debug", "./helpers/geturl", "./helpers/tag", "./helpers/now"], function(a) {
    "use strict";
    var b = a("handlebars");
    return b.registerHelper("eq", a("./helpers/eq")),
    b.registerHelper("ne", a("./helpers/ne")),
    b.registerHelper("gt", a("./helpers/gt")),
    b.registerHelper("lt", a("./helpers/lt")),
    b.registerHelper("ge", a("./helpers/ge")),
    b.registerHelper("le", a("./helpers/le")),
    b.registerHelper("typeof", a("./helpers/typeof")),
    b.registerHelper("notNull", a("./helpers/notNull")),
    b.registerHelper("any", a("./helpers/any")),
    b.registerHelper("if_any", a("./helpers/if_any")),
    b.registerHelper("if_all", a("./helpers/if_all")),
    b.registerHelper("switch", a("./helpers/switch")),
    b.registerHelper("partial", a("./helpers/partial")),
    b.registerHelper("getPartial", a("./helpers/getPartial")),
    b.registerHelper("gettext", a("./helpers/gettext")),
    b.registerHelper("urlfor", a("./helpers/urlfor")),
    b.registerHelper("html", a("./helpers/html")),
    b.registerHelper("with", a("./helpers/with")),
    b.registerHelper("each", a("./helpers/each")),
    b.registerHelper("log", a("./helpers/log")),
    b.registerHelper("debug", a("./helpers/debug")),
    b.registerHelper("geturl", a("./helpers/geturl")),
    b.registerHelper("tag", a("./helpers/tag")),
    b.registerHelper("now", a("./helpers/now")),
    b
}),
define("core/templates/alert", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        1: function(a, b, c, d, e) {
            return '<span class="icon icon-warning"></span>\n'
        },
        3: function(a, b, c, d, e) {
            var f;
            return (null != (f = a.lambda(null != b ? b.message : b, b)) ? f : "") + "\n"
        },
        5: function(a, b, c, d, e) {
            return a.escapeExpression(a.lambda(null != b ? b.message : b, b)) + "\n"
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f, g = null != b ? b : {};
            return '<a class="close" data-action="dismiss" title="' + a.escapeExpression(c.gettext.call(g, "Dismiss", {
                name: "gettext",
                hash: {},
                data: e
            })) + '">×</a>\n<span>\n' + (null != (f = c["if"].call(g, null != b ? b.icon : b, {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + (null != (f = c["if"].call(g, null != b ? b.safe : b, {
                name: "if",
                hash: {},
                fn: a.program(3, e, 0),
                inverse: a.program(5, e, 0),
                data: e
            })) ? f : "") + "</span>\n"
        },
        useData: !0
    })
}),
define("core/views/AlertView", ["backbone", "core/templates/alert"], function(a, b) {
    "use strict";
    var c = a.View.extend({
        className: "alert",
        events: {
            "click [data-action=dismiss]": "dismiss"
        },
        initialize: function(a) {
            this.options = a,
            this.message = a.message,
            this.safe = a.safe,
            this.type = a.type
        },
        render: function() {
            var a = this.$el;
            return a.html(b({
                message: this.message,
                safe: this.safe,
                icon: "error" === this.type
            })),
            a.attr("class", this.className),
            this.type && a.addClass(this.type),
            this
        },
        dismiss: function(a) {
            a && a.preventDefault && a.preventDefault(),
            this.remove(),
            this.trigger("dismiss")
        }
    });
    return c
}),
define("core/mixins/withAlert", ["underscore", "core/views/AlertView"], function(a, b) {
    "use strict";
    var c = {
        alert: function(c, d) {
            a.isObject(d) || (d = {});
            var e = d.target || this._alertSelector;
            this.dismissAlert();
            var f = this._alert = new b(a.extend({
                message: c
            }, d));
            return this.listenToOnce(this._alert, "dismiss", function() {
                this._alert = null
            }),
            f.render(),
            e ? this.$el.find(e).prepend(f.el) : this.el.parentNode && this.el.parentNode.insertBefore(f.el, this.el),
            f
        },
        dismissAlert: function(a) {
            this._alert && (a && !a(this._alert) || (this.stopListening(this._alert),
            this._alert.dismiss(),
            this._alert = null))
        },
        getAlert: function() {
            return this._alert || null
        },
        setAlertSelector: function(a) {
            this._alertSelector = a
        }
    }
      , d = function() {
        return a.extend(this, c)
    };
    return d
}),
define("core/models/ThreadVote", ["backbone"], function(a) {
    "use strict";
    var b = a.Model.extend({
        defaults: {
            score: 0
        }
    });
    return b
}),
define("core/models/Vote", ["backbone"], function(a) {
    "use strict";
    var b = a.Model.extend({
        defaults: {
            score: 0
        }
    });
    return b
}),
define("core/time", [], function() {
    "use strict";
    function a(a) {
        return a.indexOf("+") >= 0 ? a : a + "+00:00"
    }
    var b = "YYYY-MM-DDTHH:mm:ssZ";
    return {
        ISO_8601: b,
        assureTzOffset: a
    }
}),
define("core/models/BaseUser", ["backbone", "core/config"], function(a, b) {
    "use strict";
    var c = a.Model.extend({
        defaults: {
            about: null,
            avatar: {
                cache: b.urls.avatar.generic,
                permalink: b.urls.avatar.generic
            },
            connections: {},
            email: null,
            isAnonymous: !0,
            isFollowedBy: null,
            isFollowing: null,
            joinedAt: null,
            name: null,
            profileUrl: null,
            url: null,
            username: null,
            numPosts: null,
            numFollowing: null,
            numForumsFollowing: null,
            numFollowers: null,
            numLikesReceived: null,
            isFlagged: null
        },
        hasValidAvatar: function(a) {
            var b = a ? a.avatar : this.get("avatar");
            return b && b.cache
        },
        isAnonymous: function() {
            return !this.get("id")
        },
        isRegistered: function() {
            return !this.isAnonymous()
        },
        validate: function(a) {
            if (!this.hasValidAvatar(a))
                return "None of the avatar related properties can be null, undefined or empty on User models."
        },
        toJSON: function() {
            var b = a.Model.prototype.toJSON.apply(this, arguments);
            return b.thread = {},
            this.hasValidAvatar() || (b.avatar = this.defaults.avatar),
            b.isRegistered = this.isRegistered(),
            b
        }
    });
    return c
}),
define("core/models/User", ["jquery", "underscore", "moment", "core/config", "core/time", "core/utils", "core/strings", "core/api", "core/models/BaseUser"], function(a, b, c, d, e, f, g, h, i) {
    "use strict";
    function j(a, b, c) {
        a[b] = a[b] || [],
        a[b].push(c)
    }
    var k = g.get
      , l = i.extend({
        url: h.getURL("users/details"),
        validate: function(c) {
            var d = {};
            if (c.display_name && (c.display_name = a.trim(c.display_name)),
            c.display_name || j(d, "display_name", k("Please enter your name.")),
            c.email || j(d, "email", k("Please enter your email address.")),
            f.validateEmail(c.email) || j(d, "email", k("Invalid email address.")),
            this.isNew() && (c.password ? c.password.length < l.MIN_PASSWORD_LEN && j(d, "password", k("Password must have at least 6 characters.")) : j(d, "password", k("Please enter a password."))),
            c.name && (c.name.length < l.MIN_NAME_LEN && j(d, "name", g.interpolate(k("Name must have at least %(minLength)s characters."), {
                minLength: l.MIN_NAME_LEN
            })),
            c.name.length > l.MAX_NAME_LEN && j(d, "name", g.interpolate(k("Name must have less than %(maxLength)s characters."), {
                maxLength: l.MAX_NAME_LEN
            }))),
            c.location && c.location.length > l.MAX_LOCATION_LEN && j(d, "location", g.interpolate(k("Location must have less than %(maxLength)s characters."), {
                maxLength: l.MAX_LOCATION_LEN
            })),
            c.url && (c.url.length > l.MAX_URL_LEN && j(d, "url", g.interpolate(k("Site must have less than %(maxLength)s characters."), {
                maxLength: l.MAX_URL_LEN
            })),
            f.isUrl(c.url) || j(d, "url", k("Please enter a valid site."))),
            !b.isEmpty(d))
                return d
        },
        prepareFetchOptions: function(a) {
            a = a ? b.clone(a) : {};
            var c = {};
            return this.get("id") ? c.user = this.get("id") : this.get("username") && (c.user = "username:" + this.get("username")),
            b.extend(c, a.data),
            a.data = c,
            a
        },
        fetch: function(a) {
            return a = this.prepareFetchOptions(a),
            i.prototype.fetch.call(this, a)
        },
        parse: function(a) {
            return a.response || a
        },
        register: function(a) {
            var b = this;
            return a = a || {},
            h.call("internal/users/register.json", {
                data: this.toRegisterJSON(),
                method: "POST",
                success: function(c) {
                    b.set(c.response),
                    a.success && a.success(c)
                },
                error: a.error
            })
        },
        saveAvatar: function(a) {
            var b = new window.FormData;
            return b.append("avatar_file", a),
            b.append("api_key", d.keys.api),
            h.call("internal/users/updateAvatar.json", {
                method: "post",
                data: b,
                cache: !1,
                contentType: !1,
                processData: !1
            })
        },
        saveProfile: function() {
            return h.call("users/updateProfile.json", {
                method: "POST",
                data: {
                    name: this.get("name"),
                    about: this.get("about"),
                    location: this.get("location"),
                    url: this.get("url")
                }
            })
        },
        toRegisterJSON: function() {
            return b.pick(this.toJSON(), "display_name", "email", "password")
        },
        isSession: function(a) {
            return a.user.id && a.user.id === this.id
        },
        isEditable: function(a) {
            return this.isSession(a) && !this.get("remote")
        },
        toJSON: function(a) {
            a = a || {};
            var b = i.prototype.toJSON.call(this)
              , c = this.collection && this.collection.thread;
            return b.thread.canModerate = Boolean(c && c.isModerator(this)),
            a.session && (b.isSession = this.isSession(a.session),
            b.isEditable = this.isEditable(a.session)),
            b
        },
        _changeFollowState: function(a) {
            this.set({
                isFollowing: a,
                numFollowers: Math.max(0, this.get("numFollowers") + (a ? 1 : -1))
            });
            var b = "users/" + (a ? "follow" : "unfollow")
              , c = this;
            return h.call(b + ".json", {
                data: {
                    target: this.get("id")
                },
                method: "POST",
                success: function(a) {
                    c.trigger("sync", c, a, {})
                }
            })
        },
        follow: function() {
            return this._changeFollowState(!0)
        },
        unfollow: function() {
            return this._changeFollowState(!1)
        },
        _changeBlockState: function(a) {
            var b = "users/block/" + (a ? "create" : "delete")
              , c = this;
            return h.call(b + ".json", {
                data: {
                    user: this.get("id")
                },
                method: "POST",
                success: function(a) {
                    c.set(a.response)
                }
            })
        },
        block: function() {
            return this._changeBlockState(!0)
        },
        unblock: function() {
            return this._changeBlockState(!1)
        },
        report: function(a) {
            var b = this;
            return h.call("users/report.json", {
                data: {
                    reason: a,
                    user: this.get("id")
                },
                method: "POST",
                success: function() {
                    b.set("isFlagged", !0)
                }
            })
        },
        toggleFollowState: function() {
            return this._changeFollowState(!this.get("isFollowing"))
        },
        registeredLessThan: function(a, b) {
            var d = e.assureTzOffset(this.get("joinedAt"))
              , f = c().subtract(a, b);
            return c(d).isAfter(f)
        },
        registeredToday: function() {
            return this.registeredLessThan(1, "day")
        },
        registeredThisWeek: function() {
            return this.registeredLessThan(1, "week")
        },
        shouldHomeOnboard: function() {
            return !this.get("homeOnboardingComplete")
        },
        setHomeOnboardComplete: function(a) {
            this.updateFlags({
                homeOnboardingComplete: a
            }),
            a && this.listenTo(this, "change:homeOnboardingComplete", b.bind(this.set, this, "homeOnboardingComplete", a, {
                silent: !0
            }))
        },
        updateFlags: function(a) {
            return this.set(a),
            h.call("internal/users/updateFlags.json", {
                data: b.mapObject(a, function(a) {
                    return a ? 1 : 0
                }),
                method: "POST"
            })
        }
    }, {
        MIN_PASSWORD_LEN: 6,
        MIN_NAME_LEN: 2,
        MAX_NAME_LEN: 30,
        MAX_LOCATION_LEN: 255,
        MAX_URL_LEN: 200
    });
    return l
}),
define("core/utils/html", [], function() {
    "use strict";
    var a = "..."
      , b = a.length
      , c = function(a) {
        var b;
        try {
            b = (new window.DOMParser).parseFromString("<!doctype html><meta charset=utf-8><title> </title>", "text/html")
        } catch (c) {}
        return b || (b = window.document.implementation.createHTMLDocument("")),
        b.body.innerHTML = a,
        b
    };
    return {
        stripTags: function(a) {
            var b = c(a).body;
            return (b.textContent || b.innerText).replace(/\r?\n/g, " ")
        },
        replaceAnchors: function(a, d) {
            var e = c(a);
            return [].forEach.call(e.querySelectorAll("a"), function(a) {
                var c = a.getAttribute("href") || ""
                  , e = a.innerHTML
                  , f = d(a);
                0 === c.indexOf(e.slice(0, -b)) ? e = f : c.length && e.indexOf(c) !== -1 ? e = e.replace(c, f) : e += " " + f,
                a.insertAdjacentHTML("afterend", e),
                a.parentNode.removeChild(a)
            }),
            e.body.innerHTML.trim()
        }
    }
}),
define("core/advice", ["underscore"], function(a) {
    "use strict";
    function b() {
        a.each(["before", "after", "around"], function(a) {
            this[a] = function(b, d) {
                return "function" == typeof this[b] ? this[b] = c[a](this[b], d) : this[b] = d,
                this[b]
            }
        }, this)
    }
    var c = {
        around: function(b, c) {
            return function() {
                var d = a.toArray(arguments);
                return c.apply(this, [a.bind(b, this)].concat(d))
            }
        },
        before: function(b, d) {
            return c.around(b, function() {
                var b = a.toArray(arguments)
                  , c = b.shift();
                return d.apply(this, b),
                c.apply(this, b)
            })
        },
        after: function(b, d) {
            return c.around(b, function() {
                var b = a.toArray(arguments)
                  , c = b.shift()
                  , e = c.apply(this, b);
                return d.apply(this, b),
                e
            })
        }
    };
    return {
        withAdvice: b
    }
}),
define("core/models/mixins", ["underscore", "moment", "core/time"], function(a, b, c) {
    "use strict";
    function d() {
        this._getCreatedMoment = a.memoize(function() {
            var a = this.get("createdAt");
            if (a)
                return b(c.assureTzOffset(a), c.ISO_8601)
        }, function() {
            return this.get("createdAt")
        }),
        this.getRelativeCreatedAt = function() {
            var a = this._getCreatedMoment();
            return a && a.from(Number(new Date))
        }
        ,
        this.getFormattedCreatedAt = a.memoize(function() {
            var a = this._getCreatedMoment();
            return a && a.format("LLLL")
        }, function() {
            return this.get("createdAt")
        })
    }
    return {
        withCreatedAt: d
    }
}),
define("core/collections/UserCollection", ["jquery", "backbone", "core/models/User"], function(a, b, c) {
    "use strict";
    var d = b.Collection.extend({
        model: c,
        initialize: function(a, c) {
            b.Collection.prototype.initialize.apply(this, arguments),
            this.thread = c && c.thread
        },
        fetch: function() {
            return a.when(!0)
        }
    });
    return d
}),
define("core/collections/UpvotersUserCollection", ["underscore", "backbone", "core/api", "core/collections/UserCollection"], function(a, b, c, d) {
    "use strict";
    var e = d.extend({
        LIMIT: 50,
        url: function() {
            return c.getURL("posts/listUsersVotedPost")
        },
        initialize: function(a, b) {
            this.postId = b.postId,
            this.threadId = b.threadId
        },
        fetch: function(c) {
            return b.Collection.prototype.fetch.call(this, a.extend({
                data: {
                    post: this.postId,
                    thread: this.threadId,
                    vote: 1,
                    limit: this.LIMIT
                }
            }, c))
        }
    });
    return e
}),
define("core/collections/VoteCollection", ["backbone", "core/models/Vote"], function(a, b) {
    "use strict";
    var c = a.Collection.extend({
        model: b
    });
    return c
}),
define("core/models/Post", ["jquery", "underscore", "backbone", "moment", "core/config/urls", "core/api", "core/strings", "core/time", "core/utils", "core/utils/html", "core/advice", "core/models/mixins", "core/collections/UpvotersUserCollection", "core/collections/VoteCollection"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    "use strict";
    var o = 1e3
      , p = 0
      , q = function() {
        var b = a.now();
        return !(b - p < o) && (p = b,
        !0)
    }
      , r = g.get
      , s = c.Model.extend({
        upvotersCollectionClass: m,
        defaults: function() {
            return {
                createdAt: d().format(h.ISO_8601),
                dislikes: 0,
                isApproved: !0,
                isDeleted: !1,
                isEdited: !1,
                isFlagged: !1,
                isFlaggedByUser: !1,
                isHighlighted: !1,
                isRealtime: !1,
                isImmediateReply: !1,
                isMinimized: null,
                hasMedia: !1,
                message: null,
                raw_message: null,
                likes: 0,
                media: [],
                parent: null,
                points: 0,
                depth: 0,
                userScore: 0
            }
        },
        initialize: function() {
            this.votes = new n
        },
        messageText: function() {
            var a = this.get("message");
            return a && j.stripTags(a)
        },
        permalink: function(a, b) {
            var c = this.id;
            if (!c || !a)
                return "";
            var d = b !== !1 && a.currentUrl || a.permalink()
              , e = window.document.createElement("a");
            return e.href = d,
            e.hash = "#comment-" + c,
            e.href
        },
        shortLink: function() {
            return e.shortener + "/p/" + Number(this.id).toString(36)
        },
        twitterText: function(a) {
            var b = 140
              , c = this.author.get("name") || this.author.get("username");
            b -= c.length + 3,
            b -= a.length + 1,
            b -= 2;
            var d = i.niceTruncate(this.messageText(), b);
            return '"' + d + '" — ' + c
        },
        toJSON: function(a) {
            var b = c.Model.prototype.toJSON.call(this);
            if (a) {
                var d = a.session
                  , e = a.thread;
                b.canBeEdited = this.canBeEdited(d, e),
                b.canBeRepliedTo = this.canBeRepliedTo(d, e),
                b.canBeShared = this.canBeShared(),
                b.permalink = this.permalink(e)
            }
            return b.shortLink = this.shortLink(),
            b.isMinimized = this.isMinimized(),
            b.plaintext = this.messageText(),
            b.relativeCreatedAt = this.getRelativeCreatedAt(),
            b.formattedCreatedAt = this.getFormattedCreatedAt(),
            b.cid = this.cid,
            b
        },
        isPublic: function() {
            return !(!this.get("isHighlighted") && !this.get("isSponsored")) || !this.get("isDeleted") && this.get("isApproved")
        },
        isMinimized: function() {
            return !this.get("isHighlighted") && (this.get("isMinimized") !== !1 && !this.get("isApproved"))
        },
        isAuthorSessionUser: function() {
            return !1
        },
        canBeEdited: function() {
            return !1
        },
        canBeRepliedTo: function() {
            return !1
        },
        canBeShared: function() {
            return !1
        },
        validateMessage: function(a) {
            if (b.isString(a.raw_message)) {
                if ("" === a.raw_message)
                    return r("Comments can't be blank.");
                if (a.raw_message.length < 2)
                    return r("Comments must have at least 2 characters.")
            }
        },
        validate: function(c) {
            if (!this.id && !c.id) {
                var d = this.validateMessage(c);
                return d ? d : (c.author_email && (c.author_email = a.trim(c.author_email)),
                c.author_name && (c.author_name = a.trim(c.author_name)),
                "" === c.author_email && "" === c.author_name ? r("Please sign in or enter a name and email address.") : "" === c.author_email || "" === c.author_name ? r("Please enter both a name and email address.") : b.isString(c.author_email) && !this.validateEmail(c.author_email) ? r("Invalid email address format.") : void 0)
            }
        },
        validateEmail: function(a) {
            return i.validateEmail(a)
        },
        report: function(a) {
            this.set("isFlagged", !0);
            var b = {
                post: this.id
            };
            a && (b.reason = a),
            f.call("posts/report.json", {
                data: b,
                method: "POST"
            })
        },
        _highlight: function(a) {
            this.set("isHighlighted", a),
            f.call("posts/" + (a ? "highlight" : "unhighlight") + ".json", {
                data: {
                    post: this.id
                },
                method: "POST"
            })
        },
        highlight: function() {
            this._highlight(!0)
        },
        unhighlight: function() {
            this._highlight(!1)
        },
        getThreadId: function() {
            return this.get("thread")
        },
        getUpvotersUserCollection: b.memoize(function() {
            var a = this.upvotersCollectionClass;
            return new a((void 0),{
                postId: this.id,
                threadId: this.getThreadId()
            })
        }, function() {
            return this.id
        }),
        _vote: function(a, b, c) {
            var d = a - b
              , e = {
                likes: this.get("likes"),
                dislikes: this.get("dislikes"),
                points: this.get("points")
            };
            return 0 === d ? d : (a > 0 ? (e.likes += a,
            e.dislikes += b) : a < 0 ? (e.dislikes -= a,
            e.likes -= b) : b > 0 ? e.likes -= b : e.dislikes += b,
            e.points += d,
            c && this.getUpvotersUserCollection()[a > 0 ? "add" : "remove"](c),
            this.set(e),
            d)
        },
        vote: function(a) {
            if (!q())
                return 0;
            var b = this
              , c = b._vote(a, b.get("userScore"));
            0 !== c && (b.set("userScore", a),
            f.call("posts/vote.json", {
                data: {
                    post: b.id,
                    vote: a
                },
                method: "POST",
                success: function(c) {
                    b.votes.add({
                        id: c.response.id,
                        score: a
                    }, {
                        merge: !0
                    })
                }
            }))
        },
        _delete: function() {
            return this.set({
                isApproved: !1,
                isDeleted: !0
            }),
            f.call("posts/remove.json", {
                data: {
                    post: this.id
                },
                method: "POST"
            })
        },
        spam: function() {
            this.set({
                isApproved: !1,
                isDeleted: !0,
                isSpam: !0
            }),
            this.trigger("spam"),
            f.call("posts/spam.json", {
                data: {
                    post: this.id
                },
                method: "POST"
            })
        },
        _create: function(a, b) {
            var c = this
              , d = a.attributes
              , e = {
                thread: d.thread,
                message: d.raw_message
            };
            return d.parent && (e.parent = d.parent),
            d.author_name && (e.author_name = d.author_name,
            e.author_email = d.author_email),
            f.call("posts/create.json", {
                data: e,
                method: "POST",
                success: function(a) {
                    c.set(a.response),
                    b.success && b.success()
                },
                error: b.error
            })
        },
        _update: function(a, b) {
            var c = this
              , d = a.attributes
              , e = {
                post: d.id,
                message: d.raw_message
            };
            return f.call("posts/update.json", {
                data: e,
                method: "POST",
                success: function(a) {
                    c.set(a.response),
                    b.success && b.success()
                },
                error: b.error
            })
        },
        _read: function(a, b) {
            var c = this;
            return b = b || {},
            f.call("posts/details.json", {
                data: {
                    post: c.id
                },
                method: "GET",
                success: function(a) {
                    c.set(a.response),
                    b.success && b.success()
                },
                error: b.error
            })
        },
        sync: function(a, b, c) {
            c = c || {};
            var d = c.error;
            switch (d && (c.error = function(a) {
                var b = {};
                try {
                    b = JSON.parse(a.responseText)
                } catch (c) {}
                d(b)
            }
            ),
            a) {
            case "create":
                return this._create(b, c);
            case "update":
                return this._update(b, c);
            case "delete":
                return this._delete();
            case "read":
                return this._read(b, c)
            }
        },
        storageKey: function() {
            if (this.isNew() && this.getThreadId())
                return ["drafts", "thread", this.getThreadId(), "parent", this.get("parent") || 0].join(":")
        }
    }, {
        formatMessage: function() {
            var a = /(?:\r\n|\r|\n){2,}/
              , c = /\r\n|\r|\n/;
            return function(d) {
                var e = b.chain(d.split(a)).compact().value()
                  , f = b.map(e, function(a) {
                    return b.chain(a.split(c)).compact().map(b.escape).join("<br>").value()
                }).join("</p><p>");
                return "<p>" + f + "</p>"
            }
        }()
    });
    return l.withCreatedAt.call(s.prototype),
    k.withAdvice.call(s.prototype),
    s.withAuthor = function(a) {
        this.around("set", function(c, d, e, f) {
            var g;
            if (null == d)
                return this;
            "object" == typeof d ? (g = d,
            f = e) : (g = {},
            g[d] = e);
            var h = g.author;
            if (h) {
                if (b.isString(h) || b.isNumber(h)) {
                    var i = h;
                    h = {},
                    h[a.prototype.idAttribute || "id"] = i
                }
                this.author = new a(h),
                this.trigger("changeRelated:author"),
                delete g.author
            }
            return c.call(this, g, f)
        }),
        this.around("toJSON", function(a) {
            var c = a.apply(this, b.rest(arguments));
            return this.author && (c.author = this.author.toJSON()),
            c
        })
    }
    ,
    s.withMediaCollection = function(a) {
        this.after("set", function(c) {
            c && "string" != typeof c && (b.isUndefined(c.media) || (this.media ? this.media.reset(c.media) : this.media = new a(c.media),
            delete c.media))
        }),
        this.around("toJSON", function(a) {
            var c = a.apply(this, b.rest(arguments));
            return this.media && (c.media = this.media.toJSON()),
            c
        })
    }
    ,
    s
}),
define("core/models/Thread", ["underscore", "backbone", "loglevel", "core/config/urls", "core/utils", "core/api", "core/config", "core/advice", "core/UniqueModel", "core/models/User"], function(a, b, c, d, e, f, g, h, i, j) {
    "use strict";
    var k = b.Model
      , l = k.prototype
      , m = k.extend({
        defaults: {
            author: null,
            category: null,
            createdAt: null,
            forum: null,
            identifiers: [],
            ipAddress: null,
            isClosed: !1,
            isDeleted: !1,
            hasStreaming: !1,
            link: null,
            message: null,
            slug: null,
            title: null,
            userSubscription: !1,
            posts: 0,
            likes: 0,
            dislikes: 0,
            userScore: 0
        },
        initialize: function(a, b) {
            b = b || {},
            this.moderators = b.moderators,
            this.forum = b.forum,
            this.on("change:userScore", function() {
                var a = this.get("userScore");
                a > 0 && 0 === this.get("likes") && this.set("likes", a)
            }, this)
        },
        _vote: function(a, b) {
            var c = a - b;
            return 0 === c ? c : (this.set("likes", this.get("likes") + c),
            c)
        },
        vote: function(a) {
            var b = this
              , c = b._vote(a, b.get("userScore"));
            0 !== c && (this.set("userScore", a),
            f.call("threads/vote.json", {
                data: {
                    thread: this.id,
                    vote: a
                },
                method: "POST",
                success: function(a) {
                    a.response.id && b.trigger("vote:success", a)
                }
            }))
        },
        fetch: function(a) {
            var b, d = this, e = d.attributes;
            a = a || {},
            b = e.identifier ? "ident:" + e.identifier : "link:" + e.url,
            f.call("threads/details.json", {
                data: {
                    thread: b,
                    forum: e.forum
                },
                success: function(b) {
                    d.set(b.response),
                    a.success && a.success()
                },
                error: function() {
                    g.debug ? d.save({}, {
                        success: a.success
                    }) : c.info("Couldn't find thread; not creating in production.")
                }
            })
        },
        _toggleState: function(a, b) {
            b || (b = {});
            var c = a ? "open.json" : "close.json";
            return this.set("isClosed", !a),
            f.call("threads/" + c, {
                method: "POST",
                data: {
                    thread: this.id
                },
                success: b.success,
                error: b.error
            })
        },
        open: function(a) {
            return this._toggleState(!0, a)
        },
        close: function(a) {
            return this._toggleState(!1, a)
        },
        premoderate: function(b, c) {
            return this.set("validateAllPosts", b),
            f.call("threads/update", a.extend({}, c, {
                method: "POST",
                data: a.extend({
                    thread: this.id,
                    validateAllPosts: b ? 1 : 0
                }, c && c.data)
            }))
        },
        sync: function() {
            var a = this
              , b = a.attributes;
            f.call("threads/create.json", {
                data: {
                    title: b.title,
                    forum: b.forum,
                    identifier: b.identifier,
                    url: b.url
                },
                method: "POST",
                success: function(b) {
                    a.set(b.response)
                }
            })
        },
        incrementPostCount: function(a) {
            var b = this.get("posts") + a;
            this.set("posts", b > 0 ? b : 0)
        },
        isModerator: function(b) {
            var c;
            if (this.moderators)
                return c = b instanceof j || a.isObject(b) ? b.id : b,
                c = parseInt(c, 10),
                a(this.moderators).contains(c)
        },
        subscribe: function(a) {
            a = a !== !1;
            var b = this.get("userSubscription");
            if (b !== a) {
                this.set("userSubscription", a);
                var c = a ? "subscribe.json" : "unsubscribe.json"
                  , d = {
                    thread: this.id
                };
                return f.call("threads/" + c, {
                    data: d,
                    method: "POST"
                })
            }
        },
        twitterText: function(a) {
            var b = 140 - (a.length + 1)
              , c = this.get("clean_title");
            return c = e.niceTruncate(c, b)
        },
        permalink: function() {
            return this.get("url") || this.get("link") || this.currentUrl
        },
        shortLink: function() {
            return d.shortener + "/t/" + Number(this.id).toString(36)
        },
        toJSON: function() {
            var a = l.toJSON.call(this);
            return a.permalink = this.permalink(),
            a.shortLink = this.shortLink(),
            a
        },
        getDiscussionRoute: function(a) {
            var b = ["", "home", "discussion", this.forum.id, this.get("slug"), ""];
            return a = a || this.forum.channel,
            a && (a = a.attributes || a,
            b.splice(2, 0, "channel", a.slug)),
            b.join("/")
        }
    });
    return h.withAdvice.call(m.prototype),
    m.withThreadVoteCollection = function(a) {
        this.after("initialize", function() {
            this.votes = new a,
            this.on("vote:success", function(a) {
                this.votes.get(a.response.id) || this.votes.add({
                    id: a.response.id,
                    score: a.response.vote,
                    currentUser: !0
                })
            }, this)
        })
    }
    ,
    m.withPostCollection = function(b) {
        this.after("initialize", function(c) {
            c = c || {},
            this.posts = new b(c.posts,{
                thread: this,
                cursor: c.postCursor,
                order: c.order,
                perPage: this.postsPerPage
            }),
            this.listenTo(this.posts, "add reset", function(b) {
                b = b.models ? b.models : [b],
                this.users && a.each(b, function(a) {
                    this.users.get(a.author.id) || this.users.add(a.author)
                }),
                this.recalculatePostCount()
            }),
            this.listenTo(this.posts, "change:isDeleted change:isFlagged", function(a, b) {
                b && this.incrementPostCount(-1)
            })
        }),
        this.recalculatePostCount = function() {
            var a = this.get("posts");
            a > 50 || (a = this.posts.reduce(function(a, b) {
                return b.isPublic() ? a + 1 : a
            }, 0),
            this.set("posts", a))
        }
    }
    ,
    i.addType("Thread", m),
    m
}),
define("core/models/Forum", ["backbone", "core/UniqueModel", "core/api"], function(a, b, c) {
    "use strict";
    var d = a.Model.extend({
        defaults: {
            settings: {},
            followUrl: "forums/follow",
            unfollowUrl: "forums/unfollow",
            isFollowing: !1
        },
        initialize: function(a, b) {
            b && b.channel && (this.channel = b.channel)
        },
        _changeFollowingState: function(a) {
            return c.call(a, {
                method: "POST",
                data: {
                    target: this.get("id")
                }
            })
        },
        follow: function() {
            return this.set("isFollowing", !0),
            this._changeFollowingState(this.get("followUrl"))
        },
        unfollow: function() {
            return this.set("isFollowing", !1),
            this._changeFollowingState(this.get("unfollowUrl"))
        },
        toggleFollowed: function() {
            if (this.channel && this.channel.get("options").isCurationOnlyChannel)
                return this.channel.toggleFollowed();
            var a = this.get("isFollowing") ? this.unfollow() : this.follow();
            return this.trigger("toggled:isFollowing"),
            a
        }
    });
    return b.addType("Forum", d),
    d
}),
define("core/models/Media", ["underscore", "backbone", "core/api", "core/UniqueModel"], function(a, b, c, d) {
    "use strict";
    var e = b.Model.extend({
        idAttribute: "url",
        defaults: {
            mediaType: null,
            html: "",
            htmlWidth: null,
            htmlHeight: null,
            thumbnailUrl: "",
            thumbnailWidth: null,
            thumbnailHeight: null,
            url: "",
            urlRedirect: "",
            resolvedUrl: "",
            resolvedUrlRedirect: "",
            title: "",
            description: "",
            providerName: ""
        },
        parse: function(a) {
            return a.response
        },
        sync: function(b, d, e) {
            if ("read" !== b)
                throw new Error('Media models do not support methods other than "read".');
            return c.call("media/details.json", a.extend({
                method: "POST",
                data: {
                    url: this.get("url")
                }
            }, e))
        }
    }, {
        MEDIA_TYPES: {
            IMAGE: "1",
            IMAGE_UPLOAD: "2",
            YOUTUBE_VIDEO: "3",
            WEBPAGE: "4",
            TWITTER_STATUS: "5",
            FACEBOOK_PAGE: "6",
            FACEBOOK_POST: "7",
            FACEBOOK_PHOTO: "8",
            FACEBOOK_VIDEO: "9",
            SOUNDCLOUD_SOUND: "10",
            GOOGLE_MAP: "11",
            VIMEO_VIDEO: "12",
            VINE_VIDEO: "14",
            GIF_VIDEO: "15"
        },
        WEBPAGE_TYPES: ["4", "6", "7"]
    });
    return d.addType("Media", e),
    e
}),
define("core/collections/MediaCollection", ["backbone", "core/models/Media"], function(a, b) {
    "use strict";
    var c = a.Collection.extend({
        model: b
    });
    return c
}),
define("common/models", ["require", "jquery", "underscore", "backbone", "modernizr", "core/api", "core/UniqueModel", "core/models/User", "core/models/Post", "core/models/Thread", "core/models/Forum", "core/collections/MediaCollection", "core/utils/object/get", "core/utils/url/serialize", "core/utils/guid", "common/utils", "core/utils", "common/urls", "shared/urls", "backbone.uniquemodel"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
    "use strict";
    var t = k.extend({
        defaults: {
            settings: {}
        },
        toJSON: function() {
            return c.extend(d.Model.prototype.toJSON.apply(this, arguments), {
                homeUrl: s.apps.home + "home/forums/" + this.id + "/"
            })
        }
    })
      , u = j.extend({
        initialize: function(b, d) {
            j.prototype.initialize.apply(this, arguments),
            d = d || {};
            var e = this
              , f = a("common/collections");
            e.users = new f.UserCollection(d.users,{
                thread: e
            }),
            e.forum && (e.moderatorList = new f.ModeratorCollection(null,{
                forum: e.forum.get("id")
            })),
            e.posts = new f.SubpaginatedPostCollection(d.posts,{
                thread: e,
                cursor: d.postCursor,
                order: d.order,
                perPage: q.isMobileUserAgent() ? 20 : 50
            }),
            e.votes = new f.ThreadVoteCollection,
            e.posts.on("add reset", function(a) {
                a = a.models ? a.models : [a],
                c.each(a, function(a) {
                    e.users.get(a.author.id) || e.users.add(a.author)
                }),
                e.recalculatePostCount()
            }),
            e.listenTo(e.posts, "change:isDeleted change:isFlagged", function(a, b) {
                b && e.incrementPostCount(-1)
            }),
            e.queue = new f.QueuedPostCollection(null,{
                thread: e
            })
        },
        recalculatePostCount: function() {
            var a = this.get("posts");
            a > 50 || (a = this.posts.buffer.reduce(function(a, b) {
                var c = b.isPublic() && (!b.get("sb") || b.isAuthorSessionUser());
                return c ? a + 1 : a
            }, 0),
            this.set("posts", a))
        },
        toJSON: function() {
            var a = this.get("forum")
              , b = c.isObject(a) ? a.id : a;
            return c.extend(j.prototype.toJSON.apply(this, arguments), {
                homeUrl: s.apps.home + "home/discussions/" + b + "/" + this.get("slug") + "/"
            })
        }
    });
    j.withThreadVoteCollection.call(u.prototype, d.Collection);
    var v = i.extend({
        initialize: function() {
            i.prototype.initialize.apply(this, arguments);
            var b = a("common/collections");
            this.usersTyping = new b.TypingUserCollection
        },
        isAuthorSessionUser: function(b) {
            var c = a("common/Session")
              , d = m(b, ["user", "id"]) || c.fromCookie().id;
            return !!(d && this.author && this.author.id) && this.author.id.toString() === d.toString()
        },
        canBeEdited: function(a, b) {
            return !b.get("isClosed") && !this.get("isDeleted") && a.isLoggedIn() && this.isAuthorSessionUser(a) && this.get("raw_message") && !this.get("isHighlighted") && !this.get("isSponsored");
        },
        canBeRepliedTo: function(a, b) {
            return !b.get("isClosed") && a.get("canReply") && !this.get("isDeleted") && (this.get("isApproved") || b.isModerator(a.user))
        },
        canBeShared: function() {
            return !this.get("isDeleted") && !this.get("isSponsored")
        },
        getParent: function() {
            var a = this.get("parent");
            if (a)
                return new g(v,{
                    id: String(a)
                })
        }
    }, {
        fetchContext: function(a, d, e) {
            e = e || {};
            var h = b.Deferred();
            return f.call("posts/getContext.json", {
                method: "GET",
                data: {
                    post: a
                },
                success: function(a) {
                    var b = c.filter(a.response, function(a) {
                        return a.thread === d.get("id")
                    });
                    return b ? (c.each(b, function(a) {
                        a = new g(v,a),
                        e.requestedByPermalink && (a.requestedByPermalink = !0),
                        d.posts.add(a)
                    }),
                    void h.resolve(b)) : void h.reject()
                }
            }),
            h.promise()
        }
    });
    i.withAuthor.call(v.prototype, g.wrap(h)),
    i.withMediaCollection.call(v.prototype, l),
    g.addType("Post", v);
    var w = d.Model.extend({
        defaults: {
            user: null,
            message: null,
            parentId: null,
            immedReply: !1,
            createdAt: void 0
        },
        getVisibleParent: function(a) {
            for (var b, c = this; c.get("parentId"); ) {
                if (b = a.posts.get(c.get("parentId")))
                    return b;
                if (c = a.queue.get(c.get("parentId")),
                !c)
                    return null
            }
            return null
        },
        toPost: function(a) {
            var b = this
              , c = a.posts.get(b.get("parentId"))
              , d = c ? c.get("depth") + 1 : 0
              , e = new g(v,{
                id: b.id,
                forum: a.get("forum"),
                thread: a.id,
                message: b.get("message"),
                parent: b.get("parentId"),
                depth: d,
                createdAt: b.get("createdAt"),
                isRealtime: !0,
                media: b.get("media"),
                isImmediateReply: b.get("immedReply")
            });
            return e.author = b.get("user"),
            e
        }
    })
      , x = d.Model.extend({
        defaults: {
            user: null,
            post: null,
            thread: null,
            client_context: null,
            typing: !0
        },
        idAttribute: "client_context",
        set: function() {
            return this.lastModified = new Date,
            d.Model.prototype.set.apply(this, arguments)
        },
        sync: function() {
            var a = this.toJSON()
              , b = n(r.realertime + "/api/typing", a);
            try {
                p.CORS.request("GET", b).send()
            } catch (c) {}
        }
    }, {
        make: function(a) {
            return a.client_context || (a.client_context = o.generate()),
            new g(x,a)
        }
    });
    g.addType("TypingUser", x);
    var y = h.prototype.toJSON;
    c.extend(h.prototype, {
        getFollowing: function() {
            var b = a("common/collections/profile");
            return this.following || (this.following = new b.FollowingCollection(null,{
                user: this
            }))
        },
        toJSON: function() {
            var b = y.apply(this, arguments)
              , c = a("common/Session")
              , d = c.get()
              , e = d && d.get("sso") && d.get("sso").profile_url;
            return e && (e = String(e),
            0 === e.indexOf("//") && (e = "https:" + e),
            /https?:\/\//.test(e) || (e = null),
            /\{username\}/.test(e) && b.name || (e = null)),
            b.isSSOProfileUrl = Boolean(e),
            e && (b.profileUrl = e.replace(/\{username\}/gi, encodeURIComponent(b.name))),
            b
        }
    }),
    g.addType("User", h);
    var z = h.extend({
        defaults: c.extend({
            numPosts: 0
        }, h.prototype.defaults)
    })
      , A = e.sessionstorage ? "sessionStorage" : null
      , B = d.UniqueModel(h, "User", A)
      , C = d.UniqueModel(z, "User", A)
      , D = d.Model.extend({});
    return {
        Forum: t,
        Thread: u,
        Post: v,
        QueuedPost: w,
        TypingUser: x,
        User: h,
        TopUser: z,
        Switch: D,
        SyncedUser: B,
        SyncedTopUser: C
    }
}),
define("core/models/Session", ["jquery", "underscore", "backbone", "moment", "core/api", "core/bus", "core/config", "core/time", "core/utils", "core/utils/cookies", "core/utils/guid", "core/utils/auth", "core/models/BaseUser", "core/models/User"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    "use strict";
    var o = function() {
        return l.getFromCookie()
    }
      , p = c.Model.extend({
        initialize: function() {
            this.constructor.fromCookie = b.once(o),
            this.user = this.getAnonUserInstance()
        },
        setUser: function(a) {
            this.user && this.stopListening(this.user),
            this.user = a,
            this.setIfNewUser(),
            this.listenTo(a, "all", this.trigger),
            this.trigger("change:id", a)
        },
        isLoggedOut: function() {
            return !this.isLoggedIn()
        },
        isLoggedIn: function() {
            return Boolean(this.user.get("id"))
        },
        fetch: function(a) {
            var c = a || {};
            return e.call("users/details.json", {
                data: c.data,
                success: b.bind(function(a) {
                    a = a.response,
                    a.id && this.setUser(this.getUserInstance(a)),
                    c.success && c.success(a),
                    c.complete && c.complete(a)
                }, this),
                error: function(a) {
                    c.error && c.error(a),
                    c.complete && c.complete(a)
                }
            })
        },
        getAnonUserInstance: function(a) {
            return new m(a)
        },
        getUserInstance: function(a) {
            return new n(a)
        },
        getCsrfToken: function() {
            var a = j.read("csrftoken");
            return a || (a = k.generate().replace(/\W/g, ""),
            j.create("csrftoken", a, {
                expiresIn: 31536e6
            })),
            a
        },
        authenticate: function(c) {
            var d = this.authServices[c];
            if (d) {
                if (b.isFunction(d))
                    return d.call(this);
                f.trigger("uiAction:openLogin", c);
                var e = this.getAuthWindowArgs(d)
                  , g = d.url;
                g += (g.indexOf("?") > -1 ? "&" : "?") + a.param(e),
                this.openAuthWindow(g, d.width, d.height)
            }
        },
        authServices: {
            disqus: {
                url: g.urls.login,
                width: 460,
                height: 355,
                attachExperiment: !0
            },
            twitter: {
                url: g.urls.oauth.twitter,
                width: 650,
                height: 680,
                csrf: !0,
                attachExperiment: !0
            },
            facebook: {
                url: g.urls.oauth.facebook,
                width: 550,
                height: 300,
                csrf: !0,
                attachExperiment: !0
            },
            google: {
                url: g.urls.oauth.google,
                width: 445,
                height: 635,
                csrf: !0,
                attachExperiment: !0
            },
            amazon: {
                url: g.urls.oauth.amazon,
                width: 725,
                height: 630,
                csrf: !0,
                attachExperiment: !0
            }
        },
        getAuthWindowArgs: function(a) {
            var c = {};
            return a.csrf && (c.ctkn = this.getCsrfToken()),
            b.extend(c, a.params),
            c
        },
        openAuthWindow: function(a, b, c) {
            return i.openWindow(a, "_blank", {
                width: b,
                height: c
            })
        },
        setIfNewUser: function() {
            var a = this.user.get("joinedAt");
            if (this.user.get("isAnonymous") || !a)
                return void this.user.set("joinedRecently", !1);
            var b = h.assureTzOffset(a);
            this.user.set("joinedRecently", d().subtract(10, "seconds").isBefore(b))
        }
    });
    return p.fromCookie = o,
    p.isKnownToBeLoggedOut = function() {
        return !p.fromCookie().id
    }
    ,
    p
}),
define("core/WindowBus", ["jquery", "underscore", "backbone", "modernizr"], function(a, b, c, d) {
    "use strict";
    var e = c.Model.extend({
        initialize: function() {
            d.localstorage && a(window).on("storage", b.bind(this.onStorageEvent, this))
        },
        broadcast: function(a, b) {
            if (d.localstorage) {
                var c = JSON.stringify({
                    name: a,
                    data: b,
                    time: (new Date).getTime()
                });
                try {
                    window.localStorage.setItem(this.constructor.STORAGE_KEY, c)
                } catch (e) {}
            }
        },
        onStorageEvent: function(a) {
            var b = a.originalEvent.key
              , c = a.originalEvent.newValue;
            if (c && b === this.constructor.STORAGE_KEY)
                try {
                    c = JSON.parse(c),
                    this.trigger(c.name, c.data)
                } catch (d) {}
        }
    }, {
        STORAGE_KEY: "disqus.bus"
    });
    return e
}),
define("common/cached-storage", ["underscore", "core/utils/storage"], function(a, b) {
    "use strict";
    var c = function(a, b) {
        this.namespace = a,
        this.ttl = b || 300,
        this.cache = this.getFromStorage()
    };
    return a.extend(c.prototype, {
        getItem: function(a) {
            var b = this.cache[a];
            if (b) {
                if (!this.isExpired(b))
                    return b.value;
                delete this.cache[a]
            }
        },
        getCurrentTime: function() {
            return Math.floor((new Date).getTime() / 1e3)
        },
        persist: function() {
            b.set(this.namespace, this.cache)
        },
        getFromStorage: function() {
            var c = b.get(this.namespace);
            return a.isObject(c) ? c : {}
        },
        isExpired: function(a) {
            return this.getCurrentTime() > a.expiry
        },
        setItem: function(a, b) {
            this.cache[a] = {
                value: b,
                expiry: this.getCurrentTime() + this.ttl
            },
            this.persist()
        },
        removeItem: function(a) {
            delete this.cache[a],
            this.persist()
        },
        getAll: function() {
            var b = a.chain(this.cache).map(function(a, b) {
                return this.getItem(b)
            }, this).compact().value();
            return this.persist(),
            b
        }
    }),
    c
}),
define("templates/lounge/threadVotes", ["react", "core/config/urls", "core/strings", "core/utils/object/get"], function(a, b, c, d) {
    "use strict";
    var e = c.gettext
      , f = function(c) {
        return a.createElement("div", null, a.createElement("a", {
            href: "#",
            "data-action": "recommend",
            title: e("Recommend this discussion"),
            className: "dropdown-toggle " + (d(c.thread, ["userScore"]) ? "upvoted" : "")
        }, a.createElement("span", {
            className: "label label-default"
        }, a.createElement("span", {
            className: "recommend-icon icon-heart-empty"
        }), " ", e("Recommend")), a.createElement("span", {
            className: "label label-recommended"
        }, a.createElement("span", {
            className: "recommend-icon icon-heart"
        }), " ", e("Recommended")), " ", d(c.thread, ["likes"]) ? a.createElement("span", {
            className: "label label-count"
        }, d(c.thread, ["likes"], null)) : null), a.createElement("ul", {
            className: "dropdown-menu dropdown-menu--coachmark"
        }, a.createElement("li", null, c.loggedIn ? a.createElement("div", null, a.createElement("h2", {
            className: "coachmark__heading"
        }, e("Your 1st recommended discussion!")), a.createElement("p", {
            className: "coachmark__description"
        }, e("Recommending means this is a discussion worth sharing. It gets shared to your followers' %(Disqus)s feeds if you log in, and gives the creator kudos!", {
            Disqus: "Disqus"
        }))) : a.createElement("div", null, a.createElement("h2", {
            className: "coachmark__heading"
        }, e("Discussion Recommended!")), a.createElement("p", {
            className: "coachmark__description"
        }, e("Recommending means this is a discussion worth sharing. It gets shared to your followers' %(Disqus)s feeds, and gives the creator kudos!", {
            Disqus: "Disqus"
        }))), " ", a.createElement("a", {
            href: (b.root || "") + "/home/?utm_source=disqus_embed&utm_content=recommend_btn",
            className: "btn btn-primary coachmark__button",
            target: "_blank"
        }, e(c.loggedIn ? "See Your Feed" : "Find More Discussions")))))
    };
    return f
}),
define("lounge/views/recommend-button", ["backbone", "core/utils/storage", "templates/lounge/threadVotes"], function(a, b, c) {
    "use strict";
    var d = a.View.extend({
        className: "thread-likes",
        events: {
            "click [data-action=recommend]": "recommendHandler"
        },
        initialize: function(a) {
            this.session = a.session,
            this.thread = a.thread,
            this.loggedOutRecommendFlag = this.session.getLoggedOutUserFlags().get(d.ONBOARDING_KEY),
            this.listenTo(this.thread, "change:userScore", this.render),
            this.listenTo(this.thread, "change:likes", this.render),
            this.listenTo(this.session, "change:id", this.startRecommendOnboarding),
            this.setTooltipEnabled()
        },
        setTooltipEnabled: function() {
            this.tooltipEnabled = this.session.isLoggedIn() ? b.get(d.ONBOARDING_KEY) : !this.loggedOutRecommendFlag.isRead()
        },
        render: function() {
            return this.$el.html(c({
                thread: this.thread.toJSON(),
                user: this.session.toJSON(),
                loggedIn: this.session.isLoggedIn()
            })),
            this
        },
        startRecommendOnboarding: function() {
            this.session.user.get("joinedRecently") && b.set(d.ONBOARDING_KEY, "true"),
            this.setTooltipEnabled()
        },
        recommendHandler: function(a) {
            a.stopPropagation(),
            a.preventDefault();
            var b = 0 === this.thread.get("userScore");
            this.trigger(b ? "vote:like" : "vote:unlike"),
            this.thread.vote(b ? 1 : 0),
            this.toggleTooltip(b),
            this.tooltipEnabled && b && this.markAsSeen()
        },
        markAsSeen: function() {
            this.session.isLoggedIn() ? b.remove(d.ONBOARDING_KEY) : this.loggedOutRecommendFlag.markRead()
        },
        toggleTooltip: function(a) {
            this.tooltipEnabled && (a ? this.$el.parent().addClass("open") : this.$el.parent().removeClass("open"))
        }
    }, {
        ONBOARDING_KEY: "showRecommendOnboarding"
    });
    return d
}),
define("common/collections/LoggedOutCache", ["backbone", "common/cached-storage", "lounge/views/recommend-button"], function(a, b, c) {
    "use strict";
    var d = [{
        id: "welcome",
        title: "",
        body: ""
    }]
      , e = [{
        id: c.ONBOARDING_KEY
    }]
      , f = new b("notes",7776e3)
      , g = a.Model.extend({
        markRead: function() {
            f.setItem(this.id, !0)
        },
        isRead: function() {
            return Boolean(f.getItem(this.id))
        }
    })
      , h = a.Collection.extend({
        initialize: function(a, b) {
            this.session = b.session
        },
        model: g,
        markAllRead: function() {
            return this.each(function(a) {
                a.markRead()
            }),
            this.session.set("notificationCount", 0),
            this
        },
        getUnread: function() {
            return this.filter(function(a) {
                return !a.isRead()
            })
        }
    });
    return {
        storage: f,
        Collection: h,
        Model: g,
        LOGGED_OUT_NOTES: d,
        LOGGED_OUT_FLAGS: e
    }
}),
define("lounge/common", [], function() {
    "use strict";
    var a, b = function(b) {
        a = b
    }, c = function() {
        return a
    };
    return {
        setLounge: b,
        getLounge: c
    }
}),
define("common/Session", ["jquery", "underscore", "core/analytics/jester", "core/api", "core/bus", "core/config", "core/models/Session", "core/UniqueModel", "core/utils/cookies", "core/utils/url/serialize", "core/WindowBus", "common/collections/LoggedOutCache", "common/keys", "common/models", "common/urls", "common/utils", "lounge/common", "lounge/tracking"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    "use strict";
    var s, t = 3500, u = {}, v = new k, w = g.extend({
        _defaults: {
            canReply: !0,
            canModerate: !1,
            audienceSyncVerified: !1,
            sso: null
        },
        socialLoginProviders: {
            facebook: function() {
                var b = a.Deferred();
                return require(["fb"], b.resolve.bind(b), b.reject.bind(b)),
                b.promise().then(function() {
                    window.FB.init({
                        appId: m.facebook,
                        xfbml: !1,
                        status: !0,
                        version: "v2.8"
                    });
                    var b = a.Deferred();
                    return window.FB.getLoginStatus(function(a) {
                        "connected" === a.status ? b.resolve(a) : b.reject()
                    }),
                    b.promise()
                }).then(function(a) {
                    c.logStat("lounge.auto_login.fb");
                    var b = a.authResponse;
                    return {
                        grant_type: "urn:disqus:params:oauth:grant-type:facebook-login",
                        client_id: m.embedAPI,
                        expires: b.expiresIn,
                        fb_access_token: b.accessToken
                    }
                })
            },
            google: function() {
                var b = a.Deferred();
                return require(["gapi"], function(a) {
                    setTimeout(b.reject.bind(b), t),
                    a.load("auth2", b.resolve.bind(b, a))
                }, b.reject.bind(b)),
                b.promise().then(function(b) {
                    var c = b.auth2.init({
                        client_id: m.google,
                        fetch_basic_profile: !1,
                        scope: "profile email"
                    })
                      , d = a.Deferred();
                    return c.then(function() {
                        c.isSignedIn.get() ? d.resolve(c.currentUser.get()) : d.reject()
                    }),
                    d.promise()
                }).then(function(a) {
                    c.logStat("lounge.auto_login.google");
                    var b = a.getAuthResponse();
                    return {
                        grant_type: "urn:disqus:params:oauth:grant-type:google-login",
                        client_id: m.embedAPI,
                        expires: b.expires_in,
                        google_access_token: JSON.stringify(b)
                    }
                })
            }
        },
        defaults: function() {
            var a = new l.Collection(l.LOGGED_OUT_NOTES,{
                session: this
            });
            return b.extend(this._defaults, {
                notificationCount: a.getUnread().length
            })
        },
        start: function(b) {
            var c = b || {};
            if (this.set(c),
            this.listenTo(v, "auth:success", this.fetch),
            this.listenTo(e.frame, {
                "!auth:success": function(a) {
                    a && (a.sessionId && d.headers({
                        "X-Sessionid": a.sessionId
                    }),
                    a.message && this.trigger("alert", a.message, {
                        type: "info"
                    }),
                    a.logEvent && e.trigger("uiAction:" + a.logEvent)),
                    v.broadcast("auth:success"),
                    this.fetch()
                }
            }),
            this.bindAudienceSyncHandlers(),
            this.shouldFetchSession())
                this.fetch();
            else if (i.read("no_auto_login") || !r.shouldTrack(c.thread && c.thread.forum))
                this.loginAsAnon();
            else {
                var f = this.socialLoginProviders
                  , g = !1
                  , h = 0
                  , j = a.Deferred()
                  , k = Object.keys(f).map(function(a) {
                    return f[a].call(this)
                }, this)
                  , l = function(a) {
                    g || (g = !0,
                    j.resolve(a))
                }
                  , m = function(a) {
                    h += 1,
                    h === k.length && j.reject(a)
                };
                k.forEach(function(a) {
                    a.then(l).fail(m)
                }),
                j.promise().then(function(b) {
                    return a.post("https://disquscom.b0.upaiyun.com/api/oauth/2.0/access_token/", b)
                }).then(function(a) {
                    this.fetch({
                        data: {
                            access_token: a.access_token
                        }
                    })
                }
                .bind(this)).fail(this.loginAsAnon.bind(this))
            }
        },
        stop: function() {
            this.stopListening(),
            this.off()
        },
        loginAsAnon: function() {
            this.setUser(this.getAnonUserInstance())
        },
        shouldFetchSession: function() {
            return Boolean(this.get("remoteAuthS3") || u.fromCookie().id)
        },
        getUserInstance: function(a) {
            return new h(n.User,a)
        },
        toJSON: function() {
            var a = this.user.toJSON.apply(this.user, arguments);
            return a.thread.canReply = this.get("canReply"),
            a.thread.canModerate || (a.thread.canModerate = this.get("canModerate")),
            a
        },
        fetch: function(a) {
            var b = this
              , c = a || {};
            b.has("thread") && (c.thread = b.get("thread"));
            var d = c.thread ? b.fetchThreadDetails(c) : g.prototype.fetch.call(b, c);
            return d.done(function() {
                b.set("notificationCount", 0)
            }),
            d
        },
        fetchNotificationCount: function() {
            var b = this;
            return b.isLoggedIn() ? d.call("timelines/getUnreadCount.json", {
                data: {
                    type: "notifications",
                    routingVersion: f.feedApiVersion
                }
            }).done(function(a) {
                b.set("notificationCount", a.response)
            }) : a.Deferred().resolve()
        },
        fetchThreadDetails: function(a) {
            var c = this
              , e = a.thread;
            c._request && (c._request.abort(),
            c._request = null);
            var f = {
                thread: e.id,
                post: e.posts.pluck("id")
            };
            return c._request = d.call("embed/threadDetails.json", {
                data: f,
                success: function(a) {
                    var d = a.response
                      , f = {};
                    d.user && b.extend(f, d.user, {
                        votes: d.votes
                    }),
                    c.set(d.session),
                    f.id ? (c.setUser(new h(n.User,f)),
                    e.users.add(c.user),
                    d.thread && (e.set("userScore", d.thread.userScore),
                    e.set("userSubscription", d.thread.userSubscription))) : c.loginAsAnon(),
                    d.blockedUsers && b.each(d.blockedUsers, function(a) {
                        new h(n.User,{
                            id: a
                        }).set({
                            isBlocked: !0
                        })
                    }),
                    c.trigger("fetchThreadDetails:success")
                },
                complete: function() {
                    c._request = null
                }
            }),
            c._request
        },
        logout: function() {
            var a = this.get("sso");
            this.isSSO() && a && a.logout ? e.frame.sendHostMessage("navigate", a.logout) : this.locationReplace(j(o.logout, {
                redirect: window.location.href
            }))
        },
        locationReplace: function(a) {
            window.location.replace(a)
        },
        isSSO: function() {
            return this.user && "sso" === this.user.get("user_type")
        },
        getAuthWindowArgs: function(a) {
            var c = g.prototype.getAuthWindowArgs.call(this, a)
              , d = q.getLounge().config;
            if (a.attachExperiment && d && d.experiment) {
                var e = d.experiment;
                c.evs = window.btoa([e.experiment, e.variant, e.service].join(":"))
            }
            return b.defaults({
                forum: this.get("thread") && this.get("thread").forum.id
            }, c)
        },
        openAuthWindow: function(a, b, c) {
            try {
                var d = this.get("thread")
                  , e = d && d.currentUrl;
                window.sessionStorage && e && window.sessionStorage.setItem("discussionUrl", e)
            } catch (f) {}
            return g.prototype.openAuthWindow.call(this, a, b, c)
        },
        authServices: b.defaults({
            disqusDotcom: {
                url: o.dotcomLogin,
                width: 478,
                height: 590,
                params: {
                    next: o.login
                },
                attachExperiment: !0
            },
            sso: function x() {
                var x = this.get("sso")
                  , a = parseInt(x.width || "800", 10)
                  , c = parseInt(x.height || "500", 10)
                  , d = this.openAuthWindow(x.url, a, c);
                !function f() {
                    p.isWindowClosed(d) ? e.frame.sendHostMessage("reload") : b.delay(f, 500)
                }()
            }
        }, g.prototype.authServices),
        bindAudienceSyncHandlers: function() {
            this.listenTo(this, "change:id change:audienceSyncVerified", function() {
                this.get("audienceSyncVerified") && e.frame.sendHostMessage("session.identify", this.user.id)
            }),
            this.listenTo(e.frame, {
                "!audiencesync:grant": function() {
                    this.set("audienceSyncVerified", !0)
                }
            })
        },
        getAudienceSyncUrl: function() {
            var a = {
                client_id: this.get("apiKey"),
                response_type: "audiencesync",
                forum_id: this.get("thread").forum.id
            };
            return "https:" === window.location.protocol && (a.ssl = 1),
            j(o.authorize, a)
        },
        audienceSync: function() {
            this.openAuthWindow(this.getAudienceSyncUrl(), 460, 355)
        },
        needsAudienceSyncAuth: function(a) {
            return a.get("settings").audienceSyncEnabled && this.isLoggedIn() && !this.get("audienceSyncVerified")
        },
        getLoggedOutUserFlags: function() {
            return this._loggedOutUserFlags ? this._loggedOutUserFlags : (this._loggedOutUserFlags = new l.Collection(l.LOGGED_OUT_FLAGS,{
                session: this
            }),
            this._loggedOutUserFlags)
        }
    });
    return b.extend(u, b.chain(w).keys().map(function(a) {
        return [a, w[a]]
    }).object().value(), {
        get: function() {
            return s = s || new w
        },
        setDefaults: function(a) {
            if (s)
                throw new Error("Session defaults cannot be changed after a session instance is created!");
            return w._defaults = b.extend(w.prototype._defaults, a),
            w._defaults
        },
        forget: function() {
            s && (s.stop(),
            s = null)
        }
    }),
    u
}),
define("common/views/mixins", ["jquery", "underscore", "core/bus", "common/Session"], function(a, b, c, d) {
    "use strict";
    function e() {
        this._getStyleProperty = function(a) {
            var b = this.forum.get(a);
            return this.config.forceAutoStyles || "auto" === b ? this.config[a] : b
        }
        ,
        this.getTypeface = function() {
            return this._getStyleProperty("typeface")
        }
        ,
        this.getColorScheme = function() {
            return this._getStyleProperty("colorScheme")
        }
        ,
        this.applyPublisherClasses = function() {
            var b = a("body");
            "serif" === this.getTypeface() && b.addClass("serif"),
            "dark" === this.getColorScheme() && b.addClass("dark")
        }
    }
    var f = {
        proxyViewEvents: function(a) {
            this.listenTo(a, "all", function(a) {
                0 === a.indexOf("uiAction:") && this.trigger.apply(this, arguments)
            }, this)
        }
    }
      , g = {
        updateUserAvatarHelper: function(b, c) {
            a("img[data-user=" + b + '][data-role="user-avatar"]').attr("src", c)
        },
        updateUserNameHelper: function(c, d) {
            var e = '[data-username="' + c + '"][data-role=username]';
            a("a" + e + ", span" + e).html(b.escape(d))
        },
        bindProfileUIListeners: function(a) {
            this.listenTo(a, {
                "change:avatar": function() {
                    this.updateUserAvatarHelper(a.user.id, a.user.get("avatar").cache)
                },
                "change:name": function() {
                    this.updateUserNameHelper(a.user.get("username"), a.user.get("name"))
                }
            })
        }
    }
      , h = {
        toggleFollow: function(b) {
            b.preventDefault(),
            b.stopPropagation();
            var c = b && a(b.target).closest("a[data-user]").attr("data-user")
              , e = this.collection && c ? this.collection.get(c) : this.user
              , f = d.get();
            return f.isLoggedOut() ? (this.trigger("authenticating"),
            this.listenToOnce(f, "change:id", function() {
                f.isLoggedIn() && this.follow(e)
            }),
            void f.authenticate("disqusDotcom")) : void (e.get("isFollowing") ? this.unfollow(e) : this.follow(e))
        },
        unfollow: function(a) {
            a.unfollow(),
            c.trigger("uiAction:unfollowUser", a)
        },
        follow: function(a) {
            a.follow(),
            c.trigger("uiAction:followUser", a)
        }
    };
    return {
        FollowButtonMixin: h,
        UiActionEventProxy: f,
        appliesPublisherClasses: e,
        ProfileHtmlHelpers: g
    }
}),
define("core/utils/isIframed", [], function() {
    "use strict";
    return function(a) {
        try {
            return a.self !== a.top
        } catch (b) {
            return !0
        }
    }
}),
define("common/outboundlinkhandler", ["jquery", "underscore", "core/utils", "common/utils"], function(a, b, c, d) {
    "use strict";
    function e() {
        this.handlers = [],
        this.locked = {},
        this.timeout = 1e3
    }
    return b.extend(e.prototype, {
        handleClick: function(d) {
            var e = a(d.currentTarget)
              , f = this.getLinkTrackingId(e);
            if (this.shouldHandleClick(d, e, f)) {
                var g = b.chain(this.handlers).map(function(a) {
                    return a[0].call(a[1], d, e)
                }).compact().value();
                c.willOpenNewWindow(d, e) || (d.preventDefault(),
                this.setLatestClick(f),
                this.delayNavigation(d, e, g))
            }
        },
        delayNavigation: function(c, e, f) {
            this.lockLink(this.getLinkTrackingId(e));
            var g = b.bind(function() {
                this.isLatestClick(this.getLinkTrackingId(e)) && d.triggerClick(e, c.originalEvent)
            }, this);
            b.delay(g, this.timeout),
            a.when.apply(a, f).always(g)
        },
        registerBeforeNavigationHandler: function(a, b) {
            this.handlers.push([a, b])
        },
        getLinkTrackingId: function(a) {
            var c = a.attr("data-tid");
            return c || (c = b.uniqueId(),
            a.attr("data-tid", c)),
            c
        },
        shouldHandleClick: function(a, b) {
            if (!this.isLinkLocked(this.getLinkTrackingId(b))) {
                if (a.isDefaultPrevented())
                    return !1;
                if (!b.is("a"))
                    return !1;
                var c = /#.*/
                  , d = (b.attr("href") || "").replace(c, "");
                return !!d
            }
        },
        setLatestClick: function(a) {
            this.latestLinkId = a
        },
        isLatestClick: function(a) {
            return this.latestLinkId === a
        },
        lockLink: function(a) {
            this.locked[a] = !0
        },
        isLinkLocked: function(a) {
            return this.locked[a]
        }
    }),
    e
}),
define("core/mixins/withEmailVerifyLink", ["jquery", "underscore", "core/config", "core/utils"], function(a, b, c, d) {
    "use strict";
    var e = d.preventDefaultHandler
      , f = {
        events: {
            "click [data-action=verify-email]": "showVerifyEmailPopup"
        },
        showVerifyEmailPopup: e(function(b) {
            var e = a(b.target).attr("data-forum")
              , f = c.urls.verifyEmail;
            return e && (f = f + "?f=" + e),
            d.openWindow(f, "_blank", {
                width: 460,
                height: 355
            })
        })
    };
    return function() {
        this.events = b.defaults({}, this.events, f.events),
        b.extend(this, b.pick(f, "showVerifyEmailPopup"))
    }
}),
define("lounge/menu-handler", ["jquery", "core/bus"], function(a, b) {
    "use strict";
    return {
        init: function() {
            function c() {
                a(".dropdown").removeClass("open")
            }
            a("html").on("click", c),
            a("body").delegate("[data-toggle]", "click", function(b) {
                b.stopPropagation(),
                b.preventDefault();
                var d = a(b.currentTarget)
                  , e = d.closest("." + d.attr("data-toggle"))
                  , f = "disabled" !== e.attr("data-dropdown") && !e.hasClass("open");
                e.attr("data-dropdown", "enabled"),
                c(),
                f && e.addClass("open")
            }),
            b.frame.on("window.click", c)
        }
    }
}),
define("lounge/mixins", ["core/utils/url/serialize"], function(a) {
    "use strict";
    var b = {
        _sharePopup: function(a, b) {
            return window.open(a, "_blank", b || "width=550,height=520")
        },
        share: function(a) {
            this.sharers[a].call(this)
        },
        sharers: {
            twitter: function() {
                var b = "https://twitter.com/intent/tweet"
                  , c = this.model.shortLink();
                this._sharePopup(a(b, {
                    url: c,
                    text: this.model.twitterText(c)
                }))
            },
            facebook: function() {
                this._sharePopup(a("https://www.facebook.com/sharer.php", {
                    u: this.model.shortLink()
                }), "width=655,height=352")
            }
        }
    }
      , c = function() {
        function a() {
            return this.collapseTarget && this.collapseTarget.length || (this.collapseTarget = this.collapseTargetSelector ? this[this.collapseScope].find(this.collapseTargetSelector) : this[this.collapseScope]),
            this.collapseTarget
        }
        function b() {
            var b = this;
            if (b.isCollapseAllowed) {
                var c = a.call(b);
                c && c.length && (c.height(b.collapsedHeight),
                e.call(b))
            }
        }
        function c(a) {
            var b = this;
            if (b.collapseTarget && b.collapseTarget.length) {
                var c = b.collapseTarget;
                c.css("height", "auto"),
                c.css("maxHeight", "none"),
                f.call(b),
                a || (b.isCollapseAllowed = !1)
            }
        }
        function d() {
            return this.seeMoreButton && this.seeMoreButton.length || (this.seeMoreButton = a.call(this).siblings("[data-action=see-more]")),
            this.seeMoreButton
        }
        function e() {
            var a = this;
            d.call(this).removeClass("hidden").on("click", function() {
                a.expand()
            })
        }
        function f() {
            d.call(this).addClass("hidden").off("click")
        }
        return function(a) {
            var d = this;
            d.isCollapseAllowed = !0,
            d.collapsedHeight = a.collapsedHeight,
            d.collapseTargetSelector = a.collapseTargetSelector,
            d.collapseScope = a.collapseScope || "$el",
            d.collapse = b,
            d.expand = c
        }
    }();
    return {
        ShareMixin: b,
        asCollapsible: c
    }
}),
define("lounge/realtime", ["underscore", "backbone", "loglevel", "remote/config", "core/utils/url/serialize", "common/utils", "common/urls"], function(a, b, c, d, e, f, g) {
    "use strict";
    function h() {
        s.apply(this, arguments),
        this.marker = 0,
        this.interval = m,
        this._boundOnError = a.bind(this.onError, this),
        this._boundOnLoad = a.bind(this.onLoad, this),
        this._boundOnProgress = a.bind(this.onProgress, this)
    }
    function i() {
        s.apply(this, arguments),
        this.handshakeSuccess = null,
        this.interval = m,
        this.handshakeFails = 0,
        this._boundOnOpen = a.bind(this.onOpen, this),
        this._boundError = a.bind(this.onError, this),
        this._boundClose = a.bind(this.onClose, this),
        this._boundMessage = a.compose(a.bind(this.onMessage, this), function(a) {
            return JSON.parse(a.data)
        })
    }
    var j = d.lounge.REALTIME || {}
      , k = j.EXP_BASE || 2
      , l = j.BACKOFF_LIMIT || 300
      , m = j.BACKOFF_INTERVAL || 1
      , n = j.MAX_HANDSHAKE_FAILS || 1
      , o = j.WEBSOCKETS_ENABLED !== !1 && window.WebSocket && 2 === window.WebSocket.CLOSING
      , p = j.XHR_ENABLED !== !1
      , q = function() {}
      , r = function() {
        throw new Error("Pipe class cannot be used directly.")
    }
      , s = function(b) {
        this.channel = b,
        this.connection = null,
        this.paused = !1,
        this._msgBuffer = [],
        this._boundOpen = a.bind(this.open, this)
    };
    a.extend(s.prototype, b.Events, {
        getUrl: function(b) {
            var c = {};
            return a.extend(c, b),
            e(this.baseUrl + this.channel, c)
        },
        onMessage: function(a) {
            var b = a.message_type
              , d = a.firehose_id;
            this.lastEventId = d,
            c.debug("RT: new message:", b, d);
            var e = {
                type: b,
                data: a.message_body,
                lastEventId: d
            };
            this.trigger(b, e)
        },
        _msgToBuffer: function() {
            this._msgBuffer.push(a.toArray(arguments))
        },
        pause: function(a) {
            this.paused || (this.paused = !0,
            this._trigger = this.trigger,
            this.trigger = a === !1 ? q : this._msgToBuffer,
            c.debug("RT: paused, buffered: %s", a !== !1))
        },
        resume: function() {
            if (this.paused) {
                this.paused = !1,
                this.trigger = this._trigger,
                c.debug("RT: resumed, buffered messages: %s", this._msgBuffer.length);
                for (var a; a = this._msgBuffer.shift(); )
                    this.trigger.apply(this, a)
            }
        },
        open: r,
        close: function() {
            var a = this.connection;
            return !!a && (this.connection = null,
            a)
        }
    }),
    a.extend(h.prototype, s.prototype, {
        baseUrl: g.realertime + "/api/2/",
        onError: function() {
            this.connection && (this.connection = null,
            this.trigger("error", this),
            this.interval <= l && (this.interval *= k),
            c.info("RT: Connection error, backing off %s secs", this.interval),
            a.delay(this._boundOpen, 1e3 * this.interval))
        },
        onLoad: function() {
            this.connection && (this.connection = null,
            this.trigger("success", this),
            a.defer(this._boundOpen))
        },
        onProgress: function() {
            if (this.connection) {
                var a, b, d, e, f = this.connection.responseText, g = 0;
                if (f && !(this.marker >= f.length)) {
                    a = f.slice(this.marker).split("\n");
                    for (var h = a.length, i = 0; i < h; i++)
                        if (b = a[i],
                        g += b.length + 1,
                        d = b.replace(/^\s+|\s+$/g, "")) {
                            try {
                                e = JSON.parse(d)
                            } catch (j) {
                                if (i === h - 1) {
                                    g -= b.length + 1;
                                    break
                                }
                                c.debug("RT: unable to parse: ", d, b);
                                continue
                            }
                            this.onMessage(e)
                        } else
                            c.debug("RT: ignoring empty row...");
                    g > 0 && (this.marker += g - 1)
                }
            }
        },
        open: function() {
            this.close();
            var a = this.connection = f.CORS.request("GET", this.getUrl(), this._boundOnLoad, this._boundOnError);
            if (!a)
                return void c.debug("RT: Cannot use any cross-domain request tool with StreamPipe. Bailing out.");
            a.onprogress = this._boundOnProgress,
            this.connection = a,
            this.marker = 0;
            try {
                a.send()
            } catch (b) {
                this.connection = null,
                c.debug("RT: Attempt to send a CORS request failed.")
            }
        },
        close: function() {
            var a = s.prototype.close.apply(this);
            return a && a.abort()
        }
    }),
    a.extend(i.prototype, s.prototype, {
        baseUrl: "wss:" + g.realertime + "/ws/2/",
        onOpen: function() {
            c.debug("RT: [Socket] Connection established."),
            this.handshakeSuccess = !0
        },
        onError: function() {
            if (!this.handshakeSuccess) {
                if (this.handshakeFails >= n)
                    return c.debug("RT: [Socket] Error before open, bailing out."),
                    void this.trigger("fail");
                this.handshakeFails += 1
            }
            this.connection && (this.connection = null,
            this.trigger("error"),
            this.interval <= l && (this.interval *= k),
            c.error("RT: Connection error, backing off %s secs", this.interval),
            a.delay(this._boundOpen, 1e3 * this.interval))
        },
        onClose: function(a) {
            if (this.connection) {
                if (!a.wasClean)
                    return this.onError();
                this.connection = null,
                c.debug("RT: [Socket] Connection closed. Restarting..."),
                this.trigger("close"),
                this.open()
            }
        },
        open: function() {
            this.close();
            try {
                this.connection = new window.WebSocket(this.getUrl())
            } catch (a) {
                return this.onError()
            }
            var b = this.connection;
            b.onopen = this._boundOnOpen,
            b.onerror = this._boundError,
            b.onmessage = this._boundMessage,
            b.onclose = this._boundClose
        },
        close: function() {
            var a = s.prototype.close.apply(this);
            return a && a.close()
        }
    });
    var t = {
        _wsSupported: o,
        initialize: function(b, c, d) {
            this.close(),
            this._initArgs = [b, c, d];
            var e = this._wsSupported
              , f = e && i || p && h;
            if (f) {
                var g = this.pipe = new f(b);
                a.chain(c).pairs().each(function(a) {
                    g.on(a[0], a[1], d)
                }),
                e && g.on("fail", function() {
                    this._wsSupported = !1,
                    g.off(),
                    this.initialize.apply(this, this._initArgs)
                }, this),
                g.open()
            }
        },
        pause: function(a) {
            this.pipe && this.pipe.pause(a)
        },
        resume: function() {
            this.pipe && this.pipe.resume()
        },
        close: function() {
            this.pipe && (this.pipe.close(),
            this.pipe = null)
        }
    };
    return window.addEventListener("unload", a.bind(t.close, t)),
    {
        Pipe: s,
        StreamPipe: h,
        SocketPipe: i,
        Manager: t,
        MAX_HANDSHAKE_FAILS: n
    }
}),
define("host/common/apps/BaseApp", ["require", "core/Events", "core/utils/object/extend", "core/utils/object/has", "core/utils/uniqueId"], function(a) {
    "use strict";
    var b = a("core/Events")
      , c = a("core/utils/object/extend")
      , d = a("core/utils/object/has")
      , e = a("core/utils/uniqueId")
      , f = function(a) {
        this.uid = e("dsq-app"),
        this.settings = a || {};
        var b = []
          , c = this.constructor.prototype;
        do
            b.unshift(c),
            c = c.constructor.__super__;
        while (c);for (var f = 0, g = b.length; f < g; f++)
            c = b[f],
            d(c, "events") && this.on(c.events, this),
            d(c, "onceEvents") && this.once(c.onceEvents, this)
    };
    return c(f.prototype, b),
    f.prototype.destroy = function() {
        this.off(),
        this.stopListening()
    }
    ,
    f.extend = function(a, b) {
        var e, f = this;
        e = a && d(a, "constructor") ? a.constructor : function() {
            return f.apply(this, arguments)
        }
        ,
        c(e, f, b);
        var g = function() {
            this.constructor = e
        };
        return g.prototype = f.prototype,
        e.prototype = new g,
        a && c(e.prototype, a),
        e.__super__ = f.prototype,
        e
    }
    ,
    f
}),
define("core/utils/lang/isString", [], function() {
    "use strict";
    return function(a) {
        return "[object String]" === Object.prototype.toString.call(a)
    }
}),
define("core/utils/html/setInlineStyle", ["require", "core/utils/collection/each", "core/utils/lang/isString", "core/utils/object/extend"], function(a) {
    "use strict";
    function b(a) {
        return a.replace(/\s+/g, "").toLowerCase()
    }
    var c = a("core/utils/collection/each")
      , d = a("core/utils/lang/isString")
      , e = a("core/utils/object/extend");
    return function(a, f, g) {
        var h = {};
        d(f) ? h[f] = g : h = f;
        var i = e({}, h);
        c(i, function(a, c) {
            var d = b(c);
            d !== c && (delete i[c],
            i[d] = a),
            null === a && (i[d] = ""),
            void 0 === a && delete i[d]
        });
        var j = a.style;
        c(i, function(a, b) {
            j.setProperty(b, String(a), "important")
        })
    }
}),
define("common/kernel/utils", ["require"], function(a) {
    "use strict";
    function b(a) {
        return e.getElementById(a) || e.body || e.documentElement
    }
    function c(a) {
        return f.href = a,
        f.hostname
    }
    function d(a, b) {
        b = b || e.documentElement;
        for (var c = a, d = 0, f = 0; c && c !== b; )
            d += c.offsetLeft,
            f += c.offsetTop,
            c = c.offsetParent;
        return {
            top: f,
            left: d,
            height: a.offsetHeight,
            width: a.offsetWidth
        }
    }
    var e = window.document
      , f = e.createElement("a");
    return {
        getContainer: b,
        getHost: c,
        getOffset: d
    }
}),
define("host/common/globalFromSandbox", ["require"], function(a) {
    "use strict";
    var b = window.document
      , c = b.createElement("iframe");
    return c.style.display = "none",
    function(a, d) {
        var e = d && d[a] || null;
        try {
            return c.parentNode !== b.body && b.body.appendChild(c),
            c.contentWindow[a] || e
        } catch (f) {
            return e
        }
    }
}),
define("host/common/json", ["require", "host/common/globalFromSandbox"], function(a) {
    "use strict";
    var b, c = window, d = a("host/common/globalFromSandbox");
    return b = "[object JSON]" === c.Object.prototype.toString.call(c.JSON) ? c.JSON : d("JSON", c),
    b ? b : {}
}),
define("common/kernel/WindowBase", ["require", "core/Events", "core/utils/object/extend", "core/utils/uniqueId", "common/kernel/utils", "host/common/json"], function(a) {
    "use strict";
    var b = a("core/Events")
      , c = a("core/utils/object/extend")
      , d = a("core/utils/uniqueId")
      , e = a("common/kernel/utils")
      , f = a("host/common/json")
      , g = function h(a) {
        a = a || {},
        this.state = h.INIT,
        this.uid = a.uid || d("dsq-frame"),
        this.origin = a.origin,
        this.host = e.getHost(this.origin),
        this.target = a.target,
        this.sandbox = a.sandbox,
        this.window = null,
        h.windows[this.uid] = this,
        this.on("ready", function() {
            this.state = h.READY
        }, this),
        this.on("die", function() {
            this.state = h.KILLED
        }, this)
    };
    return c(g, {
        INIT: 0,
        READY: 1,
        KILLED: 2,
        windows: {},
        postMessage: function(a, b, c) {
            return a.postMessage(b, c)
        }
    }),
    c(g.prototype, b),
    g.prototype.requiresWindow = function(a) {
        var b = this;
        return function() {
            var c = Array.prototype.slice.call(arguments)
              , d = function e() {
                var d = b.window;
                d ? a.apply(b, c) : setTimeout(e, 500)
            };
            b.isReady() ? d() : b.on("ready", d);
        }
    }
    ,
    g.prototype.sendMessage = function(a, b) {
        var c = f.stringify({
            scope: "client",
            name: a,
            data: b
        });
        this.requiresWindow(function(a) {
            g.postMessage(this.window, a, this.origin)
        })(c)
    }
    ,
    g.prototype.hide = function() {}
    ,
    g.prototype.show = function() {}
    ,
    g.prototype.url = function() {
        return this.target
    }
    ,
    g.prototype.destroy = function() {
        this.state = g.KILLED,
        this.off()
    }
    ,
    g.prototype.isReady = function() {
        return this.state === g.READY
    }
    ,
    g.prototype.isKilled = function() {
        return this.state === g.KILLED
    }
    ,
    g
}),
define("common/kernel/Iframe", ["require", "core/utils/html/setInlineStyle", "core/utils/object/extend", "common/kernel/WindowBase", "common/kernel/utils"], function(a) {
    "use strict";
    var b = a("core/utils/html/setInlineStyle")
      , c = a("core/utils/object/extend")
      , d = a("common/kernel/WindowBase")
      , e = a("common/kernel/utils")
      , f = window.document
      , g = function(a) {
        d.call(this, a),
        this.styles = a.styles || {},
        this.tabIndex = a.tabIndex || 0,
        this.title = a.title || "Disqus",
        this.sandbox = a.sandbox,
        this.container = a.container,
        this.elem = null
    };
    return c(g.prototype, d.prototype),
    g.prototype.load = function() {
        var a = this.elem = f.createElement("iframe");
        a.setAttribute("id", this.uid),
        a.setAttribute("name", this.uid),
        a.setAttribute("allowTransparency", "true"),
        a.setAttribute("frameBorder", "0"),
        a.setAttribute("scrolling", "no"),
        this.role && a.setAttribute("role", this.role),
        a.setAttribute("tabindex", this.tabIndex),
        a.setAttribute("title", this.title),
        "string" == typeof this.sandbox && a.setAttribute("sandbox", this.sandbox),
        this.setInlineStyle(this.styles)
    }
    ,
    g.prototype.getOffset = function(a) {
        return e.getOffset(this.elem, a)
    }
    ,
    g.prototype.setInlineStyle = function(a, c) {
        return b(this.elem, a, c)
    }
    ,
    g.prototype.removeInlineStyle = function(a) {
        var b = this.elem.style;
        return "removeProperty"in b ? void b.removeProperty(a) : void (b[a] = "")
    }
    ,
    g.prototype.hide = function() {
        this.setInlineStyle("display", "none")
    }
    ,
    g.prototype.show = function() {
        this.removeInlineStyle("display")
    }
    ,
    g.prototype.destroy = function() {
        return this.elem && this.elem.parentNode && (this.elem.parentNode.removeChild(this.elem),
        this.elem = null),
        d.prototype.destroy.call(this)
    }
    ,
    g
}),
define("host/common/kernel", ["require", "exports", "module", "core/Events", "core/utils/lang/isString", "core/utils/object/has", "core/utils/object/extend", "common/kernel/Iframe", "common/kernel/WindowBase", "common/kernel/utils", "host/common/json", "core/utils/function/throttle"], function(a, b) {
    "use strict";
    var c = a("core/Events")
      , d = a("core/utils/lang/isString")
      , e = a("core/utils/object/has")
      , f = a("core/utils/object/extend")
      , g = a("common/kernel/Iframe")
      , h = a("common/kernel/WindowBase")
      , i = a("common/kernel/utils")
      , j = a("host/common/json")
      , k = window.document;
    b.throttle = a("core/utils/function/throttle"),
    window.addEventListener("message", function(a) {
        var b;
        try {
            b = j.parse(a.data)
        } catch (c) {
            return
        }
        var d = b.sender
          , f = e(h.windows, d) && h.windows[d];
        f && i.getHost(a.origin) === f.host && (a.origin !== f.origin && (f.origin = a.origin),
        "host" === b.scope && f.trigger(b.name, b.data))
    }),
    window.addEventListener("hashchange", function() {
        b.trigger("window.hashchange", {
            hash: window.location.hash
        })
    }),
    window.addEventListener("resize", b.throttle(function() {
        b.trigger("window.resize")
    }, 250, 50)),
    k.addEventListener("mousemove", b.throttle(function() {
        b.trigger("window.mousemove")
    }, 250, 50));
    var l = function() {
        b.trigger("window.scroll")
    };
    window.addEventListener("scroll", b.throttle(l, 250, 50), !1),
    k.addEventListener("click", function() {
        b.trigger("window.click")
    });
    var m = b.Popup = function(a) {
        a.uid = a.windowName,
        h.call(this, a)
    }
    ;
    f(m.prototype, h.prototype),
    m.prototype.load = function() {
        var a = this.window = window.open("", this.uid || "_blank");
        a.location = this.url()
    }
    ,
    m.prototype.isKilled = function() {
        return h.prototype.isKilled() || this.window.closed
    }
    ;
    var n = b.Channel = function(a) {
        var b = this;
        b.window = null,
        g.call(b, a),
        this.insertBeforeEl = a.insertBeforeEl,
        this.insertAfterEl = a.insertAfterEl,
        b.styles = f({
            width: "1px",
            "min-width": "100%",
            border: "none",
            overflow: "hidden",
            height: "0"
        }, a.styles || {})
    }
    ;
    f(n.prototype, g.prototype),
    n.prototype.load = function(a) {
        var b = this;
        g.prototype.load.call(b);
        var c = b.elem;
        c.setAttribute("width", "100%"),
        c.setAttribute("src", this.url()),
        c.addEventListener("load", function() {
            b.window = c.contentWindow,
            a && a()
        });
        var e = d(b.container) ? i.getContainer(b.container) : b.container
          , f = (b.insertAfterEl ? b.insertAfterEl.nextSibling : b.insertBeforeEl) || null;
        e.insertBefore(c, f)
    }
    ,
    n.prototype.destroy = function() {
        return this.window = null,
        g.prototype.destroy.call(this)
    }
    ,
    b.on = c.on,
    b.off = c.off,
    b.trigger = c.trigger
}),
define("host/common/apps/WindowedApp", ["require", "core/utils/object/extend", "shared/urls", "host/common/apps/BaseApp", "host/common/kernel"], function(a) {
    "use strict";
    var b = a("core/utils/object/extend")
      , c = a("shared/urls")
      , d = a("host/common/apps/BaseApp")
      , e = a("host/common/kernel")
      , f = window.document
      , g = d.extend({
        name: null,
        loaderVersion: null,
        frame: null,
        origin: c.ensureHTTPSProtocol("https://disquscom.b0.upaiyun.com"),
        state: null,
        getUrl: function(a, d) {
            return this.loaderVersion && (d = b({
                version: this.loaderVersion
            }, d)),
            c.ensureHTTPSProtocol(c.get(this.name, a, d))
        },
        getFrameSettings: function() {
            var a = {
                target: this.getUrl(),
                origin: this.origin,
                uid: this.uid,
                sandbox: this.sandbox
            }
              , b = this.settings;
            return b.windowName ? a.windowName = b.windowName : a.container = b.container || f.body,
            a
        },
        getFrame: function() {
            var a = this.getFrameSettings()
              , b = a.windowName ? e.Popup : e.Channel;
            return new b(a)
        },
        setState: function(a) {
            var b = this.constructor;
            return a in b.states && (this.state = b.states[a],
            void this.trigger("state:" + a))
        },
        init: function() {
            var a, b = this;
            b.frame = a = this.getFrame(),
            b.listenTo(a, "all", function(c, d) {
                b.trigger("frame:" + c, d, a)
            }),
            b.trigger("change:frame", a),
            b.frame.load(function() {
                b.setState("LOADED")
            }),
            b.setState("INIT")
        },
        destroy: function() {
            var a = this.frame;
            a && (this.stopListening(a),
            a.destroy()),
            this.setState("KILLED"),
            this.frame = null,
            d.prototype.destroy.call(this)
        },
        events: {
            "frame:ready": function() {
                this.setState("READY")
            }
        }
    }, {
        states: {
            INIT: 0,
            LOADED: 1,
            READY: 2,
            RUNNING: 3,
            KILLED: 4
        }
    });
    return g
}),
define("core/utils/OnceTimer", ["require", "exports", "module"], function(a, b, c) {
    "use strict";
    c.exports = function(a, b) {
        var c = null
          , d = !1;
        this.start = function() {
            d || (c = setTimeout(function() {
                d = !0,
                a()
            }, b))
        }
        ,
        this.clear = function() {
            clearTimeout(c)
        }
    }
}),
define("core/utils/html/toHexColorString", [], function() {
    "use strict";
    function a(a) {
        if (a = Number(a),
        isNaN(a) || a > 255)
            throw new Error("Color components should be numbers less than 256");
        return a = a.toString(16),
        1 === a.length ? "0" + a : String(a)
    }
    return function(b) {
        return "#" + a(b.red) + a(b.green) + a(b.blue)
    }
}),
define("core/utils/sandbox", [], function() {
    "use strict";
    var a = ["allow-forms", "allow-pointer-lock", "allow-popups", "allow-same-origin", "allow-scripts", "allow-top-navigation"]
      , b = function(b) {
        return b ? a.reduce(function(a, c) {
            return b[c] && (a += c + " "),
            a
        }, "").trim() : ""
    };
    return {
        getAttribute: b
    }
}),
define("core/utils/url/parseQueryString", ["core/utils/collection/each"], function(a) {
    "use strict";
    return function(b) {
        "undefined" == typeof b && (b = window.location.search);
        var c = {};
        return a(b.substr(1).split("&"), function(a) {
            var b = a.split("=").map(function(a) {
                return decodeURIComponent(a.replace(/\+/g, "%20"))
            });
            b[0] && (c[b[0]] = b[1])
        }),
        c
    }
}),
define("common/analytics/reporting", ["require", "core/utils/url/serialize"], function(a) {
    "use strict";
    function b(a) {
        var b = a.split(".")
          , c = b.length > 2 ? b[b.length - 2] : "";
        return c.match(/^[0-9a-f]{32}$/i) && c
    }
    function c(a) {
        (new window.Image).src = e(f + "/stat.gif", {
            event: a
        })
    }
    function d(a) {
        (new window.Image).src = e(f + "/event.gif", a)
    }
    var e = a("core/utils/url/serialize")
      , f = "https://referrer.disqus.com/juggler";
    return {
        getLoaderVersionFromUrl: b,
        logStat: c,
        reportJester: d
    }
}),
define("lounge/ads/ads", ["require", "host/common/apps/WindowedApp", "host/common/json", "stance/main", "stance/utils", "core/utils/OnceTimer", "core/utils/html/toHexColorString", "core/utils/object/extend", "core/utils/sandbox", "core/utils/url/parseQueryString", "core/utils/url/serialize", "core/utils/urls", "core/utils/urls", "common/main", "common/analytics/reporting", "common/kernel/WindowBase"], function(a) {
    "use strict";
    var b = a("host/common/apps/WindowedApp")
      , c = a("host/common/json")
      , d = a("stance/main")
      , e = a("stance/utils")
      , f = a("core/utils/OnceTimer")
      , g = a("core/utils/html/toHexColorString")
      , h = a("core/utils/object/extend")
      , i = a("core/utils/sandbox")
      , j = a("core/utils/url/parseQueryString")
      , k = a("core/utils/url/serialize")
      , l = a("core/utils/urls").getOrigin
      , m = a("core/utils/urls").getQuery
      , n = a("common/main")
      , o = a("common/analytics/reporting")
      , p = a("common/kernel/WindowBase")
      , q = {
        adsnative: 160465,
        prebid: 160465,
        displayonly: 160465,
        gravity: 184723,
        taboola: 184193,
        outbrain: 185359
    }
      , r = b.extend({
        name: "ads",
        origin: void 0,
        onceEvents: {
            "view:enter": function() {
                this._reportLegacy({
                    verb: "view",
                    adverb: "0ms-no50perc"
                })
            },
            "view:iab": function() {
                this._reportLegacy({
                    verb: "view",
                    adverb: "iab-scroll"
                })
            }
        },
        events: {
            "frame:ready": function(a) {
                this.forumId = a.forumId,
                this._reportOnce({
                    verb: "load",
                    extra_data: a.extraData
                }, "load"),
                this.bindViewEvents()
            },
            "frame:resize": function(a) {
                this.frame.setInlineStyle("height", a.height + "px")
            },
            "frame:click": function() {
                this._reportOnce({
                    verb: "click"
                }, "click")
            },
            "frame:hover": function() {
                this._reportOnce({
                    verb: "hover"
                }, "hover")
            },
            "frame:error-provider-not-ready": function() {
                this._reportLegacy({
                    verb: "fail",
                    object_type: "provider",
                    object_id: this.getProvider(),
                    adverb: "provider_not_ready"
                })
            },
            "frame:error-no-height": function() {
                this._reportLegacy({
                    verb: "fail",
                    object_type: "provider",
                    object_id: this.getProvider(),
                    adverb: "no_height"
                })
            },
            "frame:clearSandbox": function(a) {
                if (this.frame.elem.removeAttribute("sandbox"),
                a && a.shouldRefresh) {
                    var b = this.getUrl();
                    "meme" === a.refreshTemplate && (b = b.substring(0, b.indexOf("/ads-iframe/")) + "/ads-iframe/meme/"),
                    this.frame.window.location = b
                }
            },
            "frame:logAd": function(a) {
                this._report(a)
            }
        },
        constructor: function() {
            b.apply(this, arguments),
            this.origin = l(this.settings.adUrl),
            this._reportOnceHistory = {}
        },
        init: function() {
            if (!this.settings.isHostIframed && (this.settings.forum = j(m(this.settings.adUrl)).shortname,
            this.settings.forum)) {
                var a = this.settings.discovery
                  , c = a && (a.disable_all || a.disable_promoted);
                !this.settings.isInHome && c && this.settings.canDisableAds || (this._reportOnce({
                    verb: "call",
                    object_type: "provider",
                    object_id: this.getProvider(),
                    adjective: 1
                }, "call"),
                this.settings.sandboxAds && (this.sandbox = i.getAttribute({
                    "allow-scripts": !0,
                    "allow-same-origin": !0,
                    "allow-forms": !0,
                    "allow-popups": !0
                })),
                b.prototype.init.call(this))
            }
        },
        getProvider: function() {
            if (this._provider)
                return this._provider;
            var a = this.settings.adUrl.match(/provider=(\w+)/);
            return a && (this._provider = a[1]),
            this._provider
        },
        getUrl: function() {
            var a = this.settings;
            return k(a.adUrl, {
                anchorColor: g(a.anchorColor),
                colorScheme: a.colorScheme,
                sourceUrl: a.referrer,
                typeface: a.typeface,
                canonicalUrl: a.canonicalUrl,
                disqus_version: a.version
            })
        },
        bindViewEvents: function() {
            if (!this._viewEventsBound) {
                this._viewEventsBound = !0;
                var a = this
                  , b = function(b, c) {
                    a.postMessageDirect({
                        event: b,
                        percentViewable: c
                    })
                }
                  , c = 1e3
                  , g = new f(function() {
                    a.trigger("view:iab"),
                    b("view:iab")
                }
                ,c)
                  , h = !1;
                this.listenTo(d({
                    el: this.frame.elem
                }), {
                    enter: function() {
                        a.trigger("view:enter"),
                        b("view:enter")
                    },
                    exit: function() {
                        b("view:exit"),
                        h && (h = !1,
                        b("view:50out"),
                        g.clear())
                    },
                    visible: function(a, c) {
                        var d = e.visiblePercent(c, a.offset());
                        d >= 50 && !h ? (h = !0,
                        b("view:50in"),
                        g.start()) : d < 50 && h && (h = !1,
                        b("view:50out"),
                        g.clear()),
                        b("view", d)
                    }
                })
            }
        },
        postMessageDirect: function(a) {
            this.frame.requiresWindow(function(a) {
                var b = c.stringify(h({}, a, {
                    space: "disqus"
                }));
                p.postMessage(this.window, b, this.origin),
                p.postMessage(this.window, "disqus." + a.event, this.origin)
            })(a)
        },
        _report: function(a) {
            var b = this.settings
              , c = this.getProvider();
            a.forum_id = b.forumId || this.forumId,
            o.reportJester(h({
                imp: b.impressionId,
                experiment: b.experiment.experiment,
                variant: b.experiment.variant,
                service: b.experiment.service,
                area: b.placement,
                product: "embed",
                forum: b.forum,
                zone: "thread",
                version: n.version,
                page_url: b.referrer,
                page_referrer: b.hostReferrer,
                object_type: "advertisement",
                provider: c,
                event: "activity"
            }, a))
        },
        _reportLegacy: function(a) {
            var b = this.settings
              , c = this.getProvider();
            this._report(h({
                advertisement_id: q[c],
                ad_product_name: "iab_display",
                ad_product_layout: "iab_display",
                bin: "embed:promoted_discovery:" + b.experiment.service + ":" + b.experiment.experiment + ":" + b.experiment.variant,
                object_id: "[" + q[c] + "]",
                section: "default"
            }, a))
        },
        _reportOnce: function(a, b) {
            this._reportOnceHistory[b] || (this._reportLegacy(a),
            this._reportOnceHistory[b] = !0)
        },
        getFrameSettings: function() {
            var a = b.prototype.getFrameSettings.call(this);
            return a.insertBeforeEl = this.settings.insertBeforeEl,
            a.insertAfterEl = this.settings.insertAfterEl,
            a
        }
    })
      , s = function(a) {
        return new r(a)
    };
    return {
        Ads: s
    }
}),
define("react-dom/server", ["underscore"], function(a) {
    "use strict";
    var b = function c(b) {
        if (null === b)
            return "";
        if (a.isArray(b))
            return b.map(c).join("");
        if (a.isElement(b))
            return b.outerHTML;
        if (b && b.nodeType === window.Node.DOCUMENT_FRAGMENT_NODE) {
            var d = window.document.createElement("div");
            return d.appendChild(b),
            d.innerHTML
        }
        return a.escape(String(b))
    };
    return {
        renderToString: b,
        renderToStaticMarkup: b
    }
}),
define("core/utils/media/upload", ["underscore", "exports", "core/api", "core/models/Media", "core/UniqueModel"], function(a, b, c, d, e) {
    "use strict";
    b.uploadSupported = Boolean(window.FormData),
    b._extractFirstImageFile = function(b) {
        return a.find(b, function(a) {
            return a.type.match(/^image\//)
        })
    }
    ,
    b._uploadViaApi = function(a, b, d) {
        return Promise.resolve(c.call(a, {
            data: b,
            contentType: !1,
            processData: !1,
            method: "POST",
            xhr: function() {
                var a = new window.XMLHttpRequest
                  , b = d && d.onProgress;
                return b && a.upload.addEventListener("progress", function(a) {
                    a.total && b(100 * a.loaded / a.total)
                }),
                a
            }
        }))
    }
    ,
    b.UPLOAD_URL = "https://uploads.services.disqus.com/api/3.0/media/create.json",
    b.uploadMediaUrl = function(c, f) {
        var g, h = new window.FormData, i = b._extractFirstImageFile(c);
        return i ? (h.append("upload", i),
        h.append("permanent", 1),
        b._uploadViaApi(b.UPLOAD_URL, h, f).then(function(b) {
            var c = b.response
              , f = a.first(a.values(c));
            if (!f || !f.ok)
                throw g = new Error("Upload failed"),
                g.code = f && f["error-code"],
                g;
            return new e(d,{
                mediaType: d.MEDIA_TYPES.IMAGE_UPLOAD,
                url: f.url,
                thumbnailUrl: f.url
            })
        }, function(a) {
            if (a.responseJSON && 4 === a.responseJSON.code)
                throw g = new Error("Upload failed"),
                g.code = "not-authenticated",
                g;
            throw a
        })) : (g = new Error("No image file to upload"),
        g.code = "invalid-content-type",
        Promise.reject(g))
    }
}),
define("core/views/media/DragDropUploadView", ["underscore", "backbone", "core/utils"], function(a, b, c) {
    "use strict";
    var d = c.stopEventHandler
      , e = b.View.extend({
        events: {
            dragover: "_dragOn",
            dragenter: "_dragOn",
            dragleave: "_dragOff",
            dragexit: "_dragOff",
            drop: "_drop"
        },
        _dragOn: d(function() {
            this.trigger("uploader:dragEnter"),
            this._toggleDragPlaceholder(!0)
        }),
        _dragOff: d(function() {
            this._toggleDragPlaceholder(!1)
        }),
        _drop: d(function(a) {
            this._toggleDragPlaceholder(!1);
            var b = a.originalEvent.dataTransfer.files;
            return b.length ? void this.trigger("uploader:attachMedia", b) : void this.trigger("uploader:dropError", "No files")
        }),
        _toggleDragPlaceholder: a.throttle(function(a) {
            a ? this.trigger("uploader:showPlaceholder") : this.trigger("uploader:hidePlaceholder")
        }, 50)
    });
    return e
}),
define("core/templates/postMediaUploadButton", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f = null != b ? b : {}
              , g = a.escapeExpression;
            return '<a href="#" tabindex="-1" data-action="attach" class="attach" title="' + g(c.gettext.call(f, "Upload Images", {
                name: "gettext",
                hash: {},
                data: e
            })) + '"><span>' + g(c.gettext.call(f, "Attach", {
                name: "gettext",
                hash: {},
                data: e
            })) + '</span></a>\n<input type="file" data-role="media-upload" tabindex="-1" accept="image/*">\n'
        },
        useData: !0
    })
}),
define("core/views/media/UploadButtonView", ["jquery", "backbone", "core/templates/postMediaUploadButton", "core/utils"], function(a, b, c, d) {
    "use strict";
    var e = d.stopEventHandler
      , f = "input[type=file][data-role=media-upload]"
      , g = b.View.extend({
        events: function() {
            var a = {
                "click [data-action=attach]": "_attachMedia"
            };
            return a["change " + f] = "_selectorChange",
            a
        }(),
        initialize: function(a) {
            this.template = a && a.template || c
        },
        render: function() {
            return this.$el.html(this.template()),
            this
        },
        _attachMedia: e(function() {
            this.$(f).click()
        }),
        _selectorChange: function(b) {
            var c = b.target
              , d = c.files;
            d.length && (this.trigger("uploader:attachMedia", d),
            a(c).replaceWith(c.cloneNode()))
        }
    });
    return g
}),
define("core/templates/postMediaUploadProgress", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        1: function(a, b, c, d, e) {
            return '<li>\n<div class="media-progress-box">\n<div class="media-progress">\n<div class="bar" style="right: ' + a.escapeExpression(a.lambda(null != b ? b.remainingPerc : b, b)) + '%"></div>\n</div>\n</div>\n</li>\n'
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f;
            return null != (f = c.each.call(null != b ? b : {}, null != b ? b.collection : b, {
                name: "each",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : ""
        },
        useData: !0
    })
}),
define("core/views/media/UploadsProgressSubView", ["backbone", "core/templates/postMediaUploadProgress"], function(a, b) {
    "use strict";
    var c = a.View.extend({
        initialize: function() {
            this.collection = new a.Collection,
            this.listenTo(this.collection, "add remove change", this.render)
        },
        hasVisible: function() {
            return Boolean(this.collection.length)
        },
        render: function() {
            return this.$el.html(b({
                collection: this.collection.toJSON()
            })),
            this
        }
    });
    return c
}),
define("core/templates/postMediaUploadRich", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        1: function(a, b, c, d, e) {
            var f;
            return a.escapeExpression(a.lambda(null != (f = null != b ? b.media : b) ? f.title : f, b))
        },
        3: function(a, b, c, d, e) {
            return a.escapeExpression(c.gettext.call(null != b ? b : {}, "Media attachment", {
                name: "gettext",
                hash: {},
                data: e
            }))
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f, g = a.lambda, h = a.escapeExpression;
            return '<li class="publisher-border-color">\n<div class="media-box">\n<div class="media-ct">\n<div class="media-surface">\n<a href="' + h(g(null != (f = null != b ? b.media : b) ? f.url : f, b)) + '" target="_blank">\n<img src="' + h(g(null != (f = null != b ? b.media : b) ? f.thumbnailUrl : f, b)) + '" alt="' + (null != (f = c["if"].call(null != b ? b : {}, null != (f = null != b ? b.media : b) ? f.title : f, {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.program(3, e, 0),
                data: e
            })) ? f : "") + '">\n</a>\n</div>\n</div>\n</div>\n</li>\n'
        },
        useData: !0
    })
}),
define("core/views/media/UploadsRichSubView", ["underscore", "backbone", "core/models/Media", "core/UniqueModel", "core/utils", "core/templates/postMediaUploadRich"], function(a, b, c, d, e, f) {
    "use strict";
    var g = b.View.extend({
        initialize: function() {
            this._hasVisible = !1,
            this.collection = new b.Collection([],{
                model: c,
                comparator: "index"
            }),
            this.listenTo(this.collection, "add remove reset sort change:thumbnailUrl change:mediaType change:editsFinished", this.render),
            this.listenTo(this.collection, "change:index", a.bind(this.collection.sort, this.collection))
        },
        render: function() {
            return this.$el.empty(),
            this._hasVisible = !1,
            this.collection.each(function(b) {
                b.get("thumbnailUrl") && (a.contains(c.WEBPAGE_TYPES, b.get("mediaType")) || b.get("editsFinished") && (this.$el.append(f({
                    media: b.toJSON()
                })),
                this._hasVisible = !0))
            }, this),
            this
        },
        hasVisible: function() {
            return this._hasVisible
        },
        addMedia: function(a) {
            var b = d.get(c, a.url);
            if (b)
                b.set(a);
            else {
                if (!a.editsFinished)
                    return;
                b = new d(c,a),
                b.fetch()
            }
            return this.collection.add(b),
            b
        },
        updateFromText: function(b, c, d) {
            if (!b)
                return void this.collection.reset();
            var f = e.bleachFindUrls(b);
            f = a.uniq(f, !1, function(a) {
                return a.url
            });
            var g = {};
            a.each(f, function(e) {
                g[e.url] = !0;
                var f = a.pick(e, "index", "url")
                  , h = e.index < c && c <= e.endIndex || "." === b[e.endIndex];
                h && !d.isPasteEvent || (f.editsFinished = !0),
                this.addMedia(f)
            }, this);
            var h = this.collection.pluck("url");
            g = a.keys(g);
            var i = a.difference(h, g);
            this.collection.remove(this.collection.filter(function(b) {
                return a.contains(i, b.get("url"))
            }))
        }
    });
    return g
}),
define("core/templates/postMediaUploads", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            return '<ul data-role="media-progress-list"></ul>\n<ul data-role="media-rich-list"></ul>\n<div class="media-expanded empty" data-role="media-preview-expanded">\n<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="\ndata-role="media-preview-expanded-image" alt="' + a.escapeExpression(c.gettext.call(null != b ? b : {}, "Media preview placeholder", {
                name: "gettext",
                hash: {},
                data: e
            })) + '">\n</div>\n'
        },
        useData: !0
    })
}),
define("core/views/media/UploadsView", ["backbone", "core/views/media/UploadsProgressSubView", "core/views/media/UploadsRichSubView", "core/templates/postMediaUploads"], function(a, b, c, d) {
    "use strict";
    var e = a.View.extend({
        initialize: function() {
            this.richView = new c,
            this.rich = this.richView.collection,
            this.uploadProgressView = new b,
            this.uploadProgress = this.uploadProgressView.collection,
            this.listenTo(this.rich, "all", this._updateEmpty),
            this.listenTo(this.uploadProgress, "all", this._updateEmpty)
        },
        render: function() {
            return this.richView.$el.detach(),
            this.uploadProgressView.$el.detach(),
            this.$el.html(d()),
            this._updateEmpty(),
            this.richView.setElement(this.$("[data-role=media-rich-list]")[0]),
            this.uploadProgressView.setElement(this.$("[data-role=media-progress-list]")[0]),
            this
        },
        clear: function() {
            this.rich.reset(),
            this.uploadProgress.reset()
        },
        _updateEmpty: function() {
            this.richView.hasVisible() || this.uploadProgressView.hasVisible() ? this.$el.removeClass("empty") : this.$el.addClass("empty")
        }
    });
    return e
}),
define("core/mixins/withUploadForm", ["underscore", "backbone", "core/strings", "core/utils", "core/utils/media/upload", "core/utils/storage", "core/views/media/DragDropUploadView", "core/views/media/UploadButtonView", "core/views/media/UploadsView"], function(a, b, c, d, e, f, g, h, i) {
    "use strict";
    var j = c.get
      , k = function() {
        a.defaults(this, k.bothProto, k.uploadsProto, k.previewsProto)
    }
      , l = {
        "invalid-image-file": j("Unfortunately your image upload failed. Please verify that the file is valid and in a supported format (JPEG, PNG, or GIF)."),
        "invalid-content-type": j("Unfortunately your image upload failed. Please verify that the file is in a supported format (JPEG, PNG, or GIF)."),
        "file-too-large": j("Unfortunately your image upload failed. Please verify that your image is under 5MB."),
        "not-authenticated": j("You must be logged in to upload an image.")
    }
      , m = j("Unfortunately your image upload failed. Please verify that your image is in a supported format (JPEG, PNG, or GIF) and under 5MB. If you continue seeing this error, please try again later.");
    return k.previewsProto = {
        initMediaPreviews: function(b, c) {
            this.mediaUploadsView = new i({
                el: b[0]
            }),
            this.mediaUploadsView.render(),
            this.updateLiveMediaDebounced = a.partial(a.debounce(this.updateLiveMedia, 500), c, !1),
            this.listenTo(c, {
                keychange: this.updateLiveMediaDebounced,
                paste: function(b, d) {
                    d && d.fake || a.defer(a.bind(this.updateLiveMedia, this, c, !0))
                }
            }),
            this.updateLiveMedia(c, !0)
        },
        clearMediaPreviews: function() {
            this.mediaUploadsView && this.mediaUploadsView.clear()
        },
        updateLiveMedia: function(a, b) {
            if (this.mediaUploadsView) {
                var c = a.get()
                  , d = a.offset();
                this.mediaUploadsView.richView.updateFromText(c, d, {
                    isPasteEvent: b
                })
            }
        }
    },
    k.uploadsProto = {
        initMediaUploads: function(a, b, c) {
            this.mediaDragDropView = new g({
                el: b[0]
            }),
            this.listenTo(this.mediaDragDropView, {
                "uploader:attachMedia": function() {
                    f.set("usedDragDrop", 1),
                    this.handleAttachMedia.apply(this, arguments)
                },
                "uploader:dragEnter": function() {
                    this.$el.addClass("expanded")
                },
                "uploader:showPlaceholder": function() {
                    a.show()
                },
                "uploader:hidePlaceholder": function() {
                    a.hide()
                },
                "uploader:dropError": function() {
                    var a = j("Sorry we didn't catch that. Try again?");
                    this.alert(a, {
                        type: "error",
                        isUploadError: !0
                    })
                }
            }),
            this.mediaUploadButtonView = new h({
                el: c[0]
            }),
            this.listenTo(this.mediaUploadButtonView, {
                "uploader:attachMedia": this.handleUploadViaButton
            }),
            this.mediaUploadButtonView.render()
        },
        handleUploadViaButton: function(a) {
            if (a && f.isPersistent && !f.get("usedDragDrop") && !d.isMobileUserAgent()) {
                var b = this.alert(j("Did you know you can drag and drop images too? Try it now!"));
                this.listenToOnce(b, "dismiss", function() {
                    f.set("usedDragDrop", 1)
                })
            }
            this.handleAttachMedia.apply(this, arguments)
        },
        handleAttachMedia: function(c, d) {
            var f = this
              , g = new b.Model({
                remainingPerc: 100
            });
            f.mediaUploadsView.uploadProgress.add(g),
            d = a.extend(d || {}, {
                onProgress: function(a) {
                    g.set("remainingPerc", 100 - a)
                }
            });
            var h = function() {
                f.mediaUploadsView.uploadProgress.remove(g)
            };
            e.uploadMediaUrl(c, d).then(function(a) {
                a.fetch(),
                f.textarea.insertAtCursor(a.get("url")),
                f.updateLiveMedia(f.textarea, !0),
                f.dismissUploadError()
            })["catch"](function(a) {
                var b;
                a && a.code && (b = l[a.code]),
                b || (b = m),
                f.alert(b, {
                    type: "error",
                    isUploadError: !0
                })
            }).then(h, h)
        },
        dismissUploadError: function() {
            this.dismissAlert(function(a) {
                return a.options && a.options.isUploadError
            })
        },
        uploadSupported: e.uploadSupported,
        isUploadInProgress: function() {
            return this.mediaUploadsView && this.mediaUploadsView.uploadProgress.length
        }
    },
    k.bothProto = {
        initMediaViews: function(a) {
            a.allowMedia && this.initMediaPreviews(this.$("[data-role=media-preview]"), a.textarea),
            a.allowUploads && this.initMediaUploads(this.$("[data-role=drag-drop-placeholder]"), this.$("[data-role=textarea]"), this.$("[data-role=media-uploader]"))
        }
    },
    k
}),
define("core/editable", [], function() {
    "use strict";
    function a(a) {
        return a.replace(e, " ")
    }
    function b(c, d, e) {
        var f, h, i, j, k = "", l = [];
        for ("string" != typeof e && (e = "\n\n"),
        j = 0; j < c.length; ++j)
            h = c[j],
            f = h.nodeName.toLowerCase(),
            1 === h.nodeType ? (i = d && d(h),
            i ? k += i : g.hasOwnProperty(f) ? (k && l.push(k),
            k = b(h.childNodes, d, e)) : k += "br" === f ? "\n" : b(h.childNodes, d, e)) : 3 === h.nodeType && (k += a(h.nodeValue));
        return l.push(k),
        l.join(e)
    }
    var c = window.document
      , d = "character"
      , e = new RegExp(String.fromCharCode(160),"gi")
      , f = "h1 h2 h3 h4 h5 h6 p pre blockquote address ul ol dir menu li dl div form".split(" ")
      , g = {}
      , h = 0;
    for (h = 0; h < f.length; h++)
        g[f[h]] = !0;
    var i = function(a, b, c) {
        var d = this;
        if (!a || !a.contentEditable)
            throw new Error("First argument must be contentEditable");
        this.elem = a,
        this.emulateTextarea = a.getAttribute("plaintext-only") || b,
        this.emulateTextarea && (this.pasteHandler = function() {
            var a = d.plainTextReformat
              , b = function() {
                a.timeout = null,
                a.call(d)
            };
            a.timeout && clearTimeout(a.timeout),
            a.timeout = setTimeout(b, 0)
        }
        ,
        a.addEventListener("paste", this.pasteHandler));
        for (var e in c)
            c.hasOwnProperty(e) && (this[e] = c[e])
    };
    return i.prototype = {
        insertHTML: function(a) {
            if (c.all) {
                var b = c.selection.createRange();
                return b.pasteHTML(a),
                b.collapse(!1),
                b.select()
            }
            return c.execCommand("insertHTML", !1, a)
        },
        insertNode: function(a) {
            var b, d, e;
            window.getSelection ? (b = window.getSelection(),
            b.getRangeAt && b.rangeCount && (d = b.getRangeAt(0),
            d.deleteContents(),
            d.insertNode(a),
            d.collapse(!1),
            b.removeAllRanges(),
            b.addRange(d))) : c.selection && c.selection.createRange && (d = c.selection.createRange(),
            e = 3 === a.nodeType ? a.data : a.outerHTML,
            d.pasteHTML(e),
            d.collapse(!1))
        },
        getTextNodes: function(a) {
            var b = this.elem;
            a && a.nodeType ? a = [a] : a || (a = b.childNodes);
            for (var c, d = [], e = 0; e < a.length; ++e)
                if (c = a[e])
                    switch (c.nodeType) {
                    case 1:
                        d = d.concat(this.getTextNodes(c.childNodes));
                        break;
                    case 3:
                        /^\n\s+/.test(c.nodeValue) || d.push(c)
                    }
            return d
        },
        text: function(a) {
            var c, d, e, f = this.elem;
            try {
                d = Array.prototype.slice.call(f.childNodes)
            } catch (g) {
                for (d = [],
                e = 0; e < f.childNodes.length; ++e)
                    d.push(f.childNodes[e])
            }
            return c = b(d, a, this.emulateTextarea && "\n"),
            c.replace(/^\s+|\s+$/g, "")
        },
        setText: function(a) {
            a = a || "";
            var b, d, e, f = c.createDocumentFragment(), g = this.emulateTextarea ? [a.replace(/(?:\r\n|\r|\n){2,}/g, "\n\n")] : a.split(/(?:\r\n|\r|\n){2,}/), h = g && g.length;
            for (b = 0; b < h; b++)
                d = g[b],
                e = this.createParagraph(d),
                f.appendChild(e);
            if (f.lastChild.appendChild(c.createElement("br")),
            this.elem.innerHTML = "",
            this.elem.appendChild(f),
            "WebkitAppearance"in c.documentElement.style) {
                var i = window.getSelection && window.getSelection();
                i && i.anchorNode === this.elem && i.modify && i.modify("move", "forward", "line")
            }
        },
        createParagraph: function(a) {
            var b, d, e, f, g, h, i, j = c.createElement("p");
            for (e = a.split(/\r\n|\r|\n/),
            d = 0,
            g = e.length; d < g; d++) {
                for (f = e[d],
                i = this.getHtmlElements(f),
                b = 0,
                h = i.length; b < h; b++)
                    j.appendChild(i[b]);
                j.appendChild(c.createElement("br"))
            }
            return j.lastChild && j.removeChild(j.lastChild),
            j
        },
        getHtmlElements: function(a) {
            return [c.createTextNode(a)]
        },
        plainTextReformat: function() {
            if (!(this.elem.getElementsByTagName("p").length <= 1)) {
                this.emulateTextarea = !1;
                var a = this.text();
                this.emulateTextarea = !0,
                this.setText(a)
            }
        },
        removeNode: function(a) {
            var b, d, e;
            window.getSelection ? (b = a.previousSibling,
            a.parentNode.removeChild(a),
            d = window.getSelection(),
            e = c.createRange(),
            b && (e.setStart(b, b.length),
            e.setEnd(b, b.length)),
            d.addRange(e)) : a.parentNode.removeChild(a)
        },
        selectedTextNode: function() {
            var b, e, f, g, h, i, j, k, l, m = this.elem;
            if (window.getSelection)
                return b = window.getSelection(),
                b.anchorNode;
            if (c.selection.createRange) {
                for (e = c.selection.createRange().duplicate(); e.moveStart(d, -1e3) === -1e3; )
                    continue;
                var n = e.text;
                for (k = 0; k < m.childNodes.length; ++k)
                    for (f = m.childNodes[k],
                    h = this.getTextNodes(f),
                    l = 0; l < h.length; ++l)
                        if (g = h[l],
                        j = a(g.nodeValue),
                        n.indexOf(j) > -1)
                            i = g,
                            n = n.replace(j, "");
                        else if (j.indexOf(n) > -1)
                            return g;
                return i
            }
        },
        selectedTextNodeOffset: function(b) {
            var e, f, g;
            if (window.getSelection) {
                var h = window.getSelection();
                h && h.anchorOffset && (g = h.anchorOffset)
            } else if (b && c.selection.createRange) {
                var i = a(b.nodeValue);
                e = c.selection.createRange();
                var j = e.duplicate()
                  , k = j.parentElement();
                for (f = 0; 0 !== e.moveStart(d, -1) && (0 !== i.indexOf(a(e.text)) && k === e.parentElement()); f++)
                    j = e.duplicate(),
                    k = j.parentElement();
                g = f
            }
            return isNaN(g) ? 0 : g
        },
        offset: function() {
            function b(d, e) {
                function f(a) {
                    i += a[0];
                    for (var b = 1; b < a.length; ++b)
                        h.push(i),
                        i = a[b]
                }
                "string" != typeof e && (e = "\n\n");
                for (var h = [], i = "", j = 0; j < d.length; ++j) {
                    var k = d[j]
                      , l = k.nodeName.toLowerCase();
                    1 === k.nodeType ? g.hasOwnProperty(l) ? (i && (i += e),
                    f(b(k.childNodes, e))) : "br" === l ? i += "\n" : f(b(k.childNodes, e)) : 3 === k.nodeType && (k === c.anchorNode ? (i += a(k.nodeValue.slice(0, c.anchorOffset)),
                    h.push(i),
                    i = a(k.nodeValue.slice(c.anchorOffset))) : i += a(k.nodeValue))
                }
                return h.push(i),
                h
            }
            var c = window.getSelection();
            if (!c || !c.anchorNode || 3 !== c.anchorNode.nodeType)
                return 0;
            var d, e = this.elem;
            try {
                d = Array.prototype.slice.call(e.childNodes)
            } catch (f) {
                d = [];
                for (var h = 0; h < e.childNodes.length; ++h)
                    d.push(e.childNodes[h])
            }
            var i = b(d, this.emulateTextarea && "\n");
            if (1 === i.length)
                return 0;
            var j = i[0].length
              , k = i.join("")
              , l = k.match(/\s+$/);
            if (l) {
                var m = l[0].length;
                j = Math.min(j, k.length - m)
            }
            var n = k.match(/^\s+/);
            if (n) {
                var o = n[0].length;
                j -= o
            }
            return j
        },
        selectNodeText: function(b, e, f) {
            var g, h, i = this.elem;
            if (window.getSelection)
                return g = window.getSelection(),
                g.removeAllRanges(),
                h = c.createRange(),
                h.setStart(b, e),
                h.setEnd(b, f),
                g.addRange(h),
                g;
            if (c.selection.createRange) {
                h = c.selection.createRange();
                var j = a(b.nodeValue);
                if ("body" === h.parentElement().nodeName.toLowerCase()) {
                    for (i.focus(),
                    h = c.selection.createRange(); h.moveStart(d, -1e3) === -1e3; )
                        continue;
                    for (; 1e3 === h.moveEnd(d, 1e3); )
                        continue;
                    var k = a(h.text)
                      , l = k.indexOf(j);
                    l > 0 && h.moveStart(d, l + 2),
                    h.collapse()
                }
                for (; h.moveStart(d, -1) === -1 && 0 !== j.indexOf(a(h.text)); )
                    continue;
                for (; 1 === h.moveEnd(d, 1) && j !== a(h.text); )
                    continue;
                return h.moveStart(d, e),
                h.moveEnd(d, -1 * (f - e - h.text.length)),
                h.select(),
                h
            }
        }
    },
    i.normalizeSpace = a,
    i
}),
define("core/CappedStorage", ["core/utils/storage"], function(a) {
    "use strict";
    var b = function(a, b) {
        this.max = a || 10,
        this.queueKey = b || "__queue",
        this.getQueue() || this.setQueue([])
    };
    return b.prototype.set = function(b, c) {
        var d = this.getQueue() || this.setQueue([]);
        d.length === this.max && a.remove(d.shift()),
        a.set(b, c),
        d.push(b),
        this.setQueue(d)
    }
    ,
    b.prototype.get = function(b) {
        return a.get(b)
    }
    ,
    b.prototype.remove = function(b) {
        a.remove(b);
        for (var c = this.getQueue() || [], d = 0; d < c.length; d++)
            if (c[d] === b) {
                c.splice(d, 1);
                break
            }
        this.setQueue(c)
    }
    ,
    b.prototype.clear = function() {
        a.clear(),
        this.setQueue([])
    }
    ,
    b.prototype.getQueue = function() {
        return a.get(this.queueKey)
    }
    ,
    b.prototype.setQueue = function(b) {
        return a.set(this.queueKey, b),
        b
    }
    ,
    b
}),
define("core/extensions/jquery.autoresize", ["jquery", "underscore"], function(a, b) {
    "use strict";
    return a.fn.autoresize = function(c) {
        var d = b.extend({
            extraSpace: 0,
            maxHeight: 1e3
        }, c);
        return this.each(function() {
            var c = a(this).css({
                resize: "none",
                overflow: "hidden"
            })
              , e = "true" === String(c[0].contentEditable) ? "html" : "val"
              , f = "html" === e ? "<br>" : "\n"
              , g = c.height()
              , h = function() {
                var d = {};
                b.each(d, function(a, b) {
                    d[b] = c.css(b)
                });
                var e = a(c[0].cloneNode(!0));
                return e.removeAttr("id").removeAttr("name").css({
                    visibility: "hidden",
                    position: "absolute",
                    top: "-9999px",
                    left: "-9999px",
                    contentEditable: !1
                }).css(d).attr("tabIndex", "-1"),
                e.insertAfter(c[0]),
                e
            }()
              , i = null
              , j = function() {
                h[0].style.height = 0,
                h[e](c[e]() + f),
                h.scrollTop(h[0].scrollHeight);
                var a = Math.max(h[0].scrollHeight, g) + parseInt(d.extraSpace, 10);
                d.maxHeight && (a >= d.maxHeight ? (c.css("overflow", ""),
                a = d.maxHeight) : c.css("overflow", "hidden")),
                i !== a && (i = a,
                c.height(a),
                c.trigger && c.trigger("resize"))
            }
              , k = b.throttle(j, 500)
              , l = function(a) {
                13 === a.keyCode ? j() : k()
            };
            c.bind("keyup", l).bind("paste", j).css("overflow", "hidden"),
            j()
        })
    }
    ,
    a
}),
define("core/views/TextareaView", ["underscore", "jquery", "backbone", "core/utils", "core/CappedStorage", "core/extensions/jquery.autoresize"], function(a, b, c, d, e) {
    "use strict";
    var f = c.View.extend({
        events: {
            "keydown  [data-role=editable]": "handleKeyDown",
            "keyup    [data-role=editable]": "handleKeyUp",
            "paste    [data-role=editable]": "handlePaste",
            "focusin  [data-role=editable]": "handleFocusIn",
            "blur     [data-role=editable]": "handleBlur"
        },
        initialize: function(b) {
            b = b || {},
            this.storageKey = b.storageKey,
            this.value = b.value || this.getDraft()[0],
            this.placeholder = b.placeholder,
            this.listenTo(this, "keychange", a.debounce(this.saveDraft, this.constructor.SAVE_DRAFT_INTERVAL))
        },
        render: function() {
            return this.$input = this.createInput(),
            this.set(this.value),
            this.$el.append(this.$input),
            this.$input.autoresize({
                maxHeight: this.constructor.MAX_TEXTAREA_HEIGHT
            }),
            this
        },
        createInput: function() {
            return b("<textarea>").attr({
                "class": "textarea",
                placeholder: this.placeholder,
                "data-role": "editable"
            })
        },
        resize: function() {
            this.$input.trigger("paste", {
                fake: !0
            })
        },
        get: function() {
            return this.$input.val().replace(/^\s+|\s+$/g, "")
        },
        getSelected: function() {
            var a = this.$input[0];
            return "number" == typeof a.selectionStart ? this.$input.val().substring(a.selectionStart, a.selectionEnd) : ""
        },
        offset: function() {
            var a = this.$input[0]
              , b = this.$input.val()
              , c = "number" == typeof a.selectionStart ? a.selectionStart : 0
              , d = b.match(/\s+$/);
            if (d) {
                var e = d[0].length;
                c = Math.min(c, b.length - e)
            }
            var f = b.match(/^\s+/);
            if (f) {
                var g = f[0].length;
                c = Math.max(c - g, 0)
            }
            return c
        },
        insertAtCursor: function(a) {
            this.focus();
            var b = this.get()
              , c = this.offset()
              , e = d.insertWithWhitespace(b, c, a)
              , f = this.$input[0];
            if (this.set(e),
            f.setSelectionRange) {
                var g = e.indexOf(a, c) + a.length + 1;
                f.setSelectionRange(g, g)
            }
        },
        insertAroundSelection: function(a, b) {
            this.focus();
            var c, d, e = this.$input[0];
            "number" == typeof e.selectionStart ? (c = e.selectionStart,
            d = e.selectionEnd) : c = d = 0;
            var f = this.get()
              , g = f.substring(0, c) + a + f.substring(c, d) + b + f.substring(d);
            this.set(g),
            e.setSelectionRange && e.setSelectionRange(c + a.length, d + a.length)
        },
        set: function(a) {
            this.$input.val(a)
        },
        clear: function() {
            this.set("")
        },
        focus: function() {
            this.$input.focus()
        },
        handleKeyDown: function(a) {
            this.trigger("keydown", a)
        },
        handleKeyUp: function(a) {
            this.trigger("keychange", a)
        },
        handlePaste: function(a, b) {
            b = b || {},
            this.trigger(b.fake ? "paste" : "paste keychange"),
            this.$input.trigger("resize")
        },
        handleFocusIn: function() {
            this.trigger("focus")
        },
        handleBlur: function() {
            this.trigger("blur")
        },
        saveDraft: function() {
            if (this.storageKey)
                return b.trim(this.get()) ? void this.constructor.storage.set(this.storageKey, this.toJSON()) : void this.removeDraft()
        },
        toJSON: function() {
            return [this.get(), b.now()]
        },
        getDraft: function() {
            var a = [""];
            if (!this.storageKey)
                return a;
            var c = this.constructor.storage.get(this.storageKey);
            if (!c)
                return a;
            if (a = c,
            !a.length)
                return [""];
            var d = b.now() - a[1] >= this.constructor.DRAFT_MAX_AGE;
            return d ? (this.removeDraft(),
            [""]) : a
        },
        removeDraft: function() {
            this.storageKey && this.constructor.storage.remove(this.storageKey)
        }
    }, {
        MAX_TEXTAREA_HEIGHT: 350,
        SAVE_DRAFT_INTERVAL: 500,
        DRAFT_MAX_AGE: 864e5,
        storage: new e(5,"drafts.queue")
    });
    return f
}),
define("core/views/ContentEditableView", ["jquery", "underscore", "core/editable", "core/views/TextareaView"], function(a, b, c, d) {
    "use strict";
    var e = window.document
      , f = d
      , g = f.prototype
      , h = f.extend({
        events: function() {
            return b.extend({}, g.events, {
                "focusout [data-role=editable]": "handleFocusOut",
                "click .placeholder": "handlePlaceholderClick"
            })
        },
        initialize: function() {
            g.initialize.apply(this, arguments),
            this.hasFocus = !1,
            this._selectionRange = null
        },
        saveSelection: function() {
            var a = window.getSelection();
            this._selectionRange = a && a.rangeCount && a.getRangeAt(0)
        },
        restoreSelection: function() {
            if (this._selectionRange) {
                var a = window.getSelection();
                a.removeAllRanges(),
                a.addRange(this._selectionRange),
                this._selectionRange = null
            }
        },
        render: function() {
            return this.$input = this.createInput(),
            this.$el.append(this.$input),
            this.set(this.value),
            this.renderPlaceholder(),
            this
        },
        createInput: function() {
            var b = a("<div>").attr({
                "class": "textarea",
                tabIndex: 0,
                role: "textbox",
                "aria-multiline": "true",
                contenteditable: "PLAINTEXT-ONLY",
                "data-role": "editable"
            }).css({
                overflow: "auto",
                "word-wrap": "break-word",
                "max-height": this.constructor.MAX_TEXTAREA_HEIGHT + "px"
            })
              , d = b[0];
            return "plaintext-only" !== d.contentEditable && (d.contentEditable = "true"),
            this.content = new c(d,(!0)),
            b
        },
        renderPlaceholder: function() {
            var b = this.placeholder;
            b && (this.$input.attr("aria-label", b),
            this.$placeholder = a('<span class="placeholder">' + b + "</span>"),
            this.updatePlaceholderDisplay())
        },
        updatePlaceholderDisplay: function() {
            this.$placeholder && (this.hasFocus || this.content.text() ? this.$placeholder.remove() : this.$el.prepend(this.$placeholder))
        },
        handlePlaceholderClick: function() {
            this.$input.focus()
        },
        handleFocusIn: function() {
            g.handleFocusIn.call(this),
            this.restoreSelection(),
            this.hasFocus = !0,
            this.updatePlaceholderDisplay()
        },
        handleFocusOut: function() {
            this.saveSelection(),
            this.hasFocus = !1,
            this.updatePlaceholderDisplay()
        },
        get: function() {
            return this.content.text()
        },
        getSelected: function() {
            return this.hasFocus && window.getSelection ? window.getSelection().toString() : this._selectionRange ? this._selectionRange.toString() : ""
        },
        offset: function() {
            return this.content.offset()
        },
        set: function(a) {
            this.content.setText(a),
            this.resize(),
            this.updatePlaceholderDisplay()
        },
        insertAtCursor: function(a) {
            this.focus();
            var b = " " + a + " ";
            e.queryCommandSupported && e.queryCommandSupported("insertText") && e.execCommand("insertText", !1, b) || this.content.insertNode(e.createTextNode(b))
        },
        clear: function() {
            g.clear.call(this),
            b.defer(function(a) {
                a.$input.blur()
            }, this)
        },
        insertAroundSelection: function(a, b) {
            this.focus();
            var c = window.getSelection();
            if (c.rangeCount) {
                var d = c.getRangeAt(0)
                  , f = d.cloneRange();
                f.collapse(!1);
                var g = e.createTextNode(b);
                f.insertNode(g);
                var h = d.cloneRange();
                h.collapse(!0);
                var i = e.createTextNode(a);
                h.insertNode(i),
                d.setStart(i, a.length),
                d.setEnd(g, 0),
                c.removeAllRanges(),
                c.addRange(d)
            }
        }
    });
    return h
}),
define("core/views/PostReplyView", ["jquery", "underscore", "backbone", "modernizr", "moment", "core/UniqueModel", "core/mixins/withAlert", "core/mixins/withUploadForm", "core/models/Post", "core/models/User", "core/time", "core/utils", "core/views/ContentEditableView", "core/views/TextareaView", "core/strings"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    "use strict";
    var p = o.get
      , q = l.preventDefaultHandler
      , r = c.View.extend({
        tagName: "form",
        className: "reply",
        events: {
            submit: "submitForm"
        },
        postboxAlertSelector: "[role=postbox-alert]",
        initialize: function(a) {
            this.session = a.session,
            this.parent = a.parent,
            this.thread = a.thread,
            this.post = this.makePostInstance(),
            this.setAlertSelector("[role=alert]"),
            this.shouldShowEmailAlertInForm = a.shouldShowEmailAlertInForm,
            this.parentView = a.parentView,
            this._isHidden = !1,
            this.parent && (r.open[this.parent.cid] = this),
            this.allowMedia = this.thread.forum.get("settings").allowMedia,
            this.allowUploads = this.allowMedia && this.uploadSupported,
            this.listenTo(this.session, "change:id", this.redraw)
        },
        redraw: function() {
            var b = this.$el.hasClass("expanded")
              , c = this.el
              , d = this.$el.find("textarea").val();
            this.render(),
            this.$el.find("textarea").val(d),
            b && this.$el.addClass("expanded"),
            0 !== a(c).parent().length && c.parentNode.replaceChild(this.el, c)
        },
        getPlaceholderText: function() {
            return p(this.thread.get("posts") ? "Join the discussion…" : "Start the discussion…")
        },
        getTemplateData: function() {
            return {
                user: this.session.toJSON(),
                displayMediaPreviews: this.allowMedia,
                displayMediaUploadButton: this.allowUploads
            }
        },
        render: function() {
            return this.$el.html(this.template(this.getTemplateData())),
            this.parent ? this.$el.addClass("expanded") : this.$el.removeClass("expanded"),
            this.initTextarea(),
            this.initMediaViews({
                allowMedia: this.allowMedia,
                allowUploads: this.allowUploads,
                textarea: this.textarea
            }),
            this.constructor.mustVerifyEmailToPost(this.session.user, this.thread.forum) && this._alertMustVerify(this.shouldShowEmailAlertInForm),
            this._isHidden && this.$el.addClass("hidden"),
            this
        },
        createTextarea: function() {
            var a = {
                placeholder: this.getPlaceholderText(),
                storageKey: this.post.storageKey()
            };
            return this.constructor.canUseContentEditable ? new this.constructor.ContentEditableView(a) : new this.constructor.TextareaView(a)
        },
        initTextarea: function() {
            var a = this.textarea = this.createTextarea();
            this.$("[data-role=textarea]").prepend(a.render().el),
            this.listenTo(a, {
                keydown: function(a) {
                    !a || !a.ctrlKey && !a.metaKey || 13 !== a.keyCode && 10 !== a.keyCode || this.submitForm(),
                    this.session.get("banned") && this.alertBannedError()
                },
                focus: function() {
                    this.$el.hasClass("expanded") || this.$el.addClass("expanded")
                }
            })
        },
        resize: function() {
            this.textarea.resize()
        },
        focus: function() {
            this.textarea.focus()
        },
        clear: function() {
            var a = this;
            a.textarea.clear(),
            a.clearMediaPreviews(),
            a.$el.removeClass("expanded"),
            b.delay(function() {
                a.resize()
            }, 200),
            a.parent && a.hide()
        },
        restore: function(a) {
            var c = this;
            c.textarea.set(a.get("raw_message")),
            c.textarea.handleFocusIn(),
            b.delay(function() {
                c.resize()
            }, 200),
            c.parent && c.show()
        },
        _alertMustVerify: function(a) {
            var b = this.emailVerifyAlertTemplate({
                user: this.session.user.toJSON(),
                forumName: this.thread.forum.get("name"),
                forumId: this.thread.forum.id
            });
            this.alert(b, {
                safe: !0,
                type: a ? "error" : "warn",
                target: a ? this.postboxAlertSelector : null
            })
        },
        submitForm: q(function() {
            return this.dismissAlert(),
            this.initiatePost()
        }),
        makePostInstance: function() {
            return new f(this.constructor.Post,{
                thread: this.thread.id,
                depth: this.parent ? this.parent.get("depth") + 1 : 0,
                parent: this.parent ? this.parent.id : null
            })
        },
        getPostParams: function() {
            var a = {
                raw_message: this.textarea.get()
            };
            b.extend(a, this.getAuthorParams());
            var c = this.mediaUploadsView;
            return c && (a.media = c.rich.invoke("toJSON")),
            a
        },
        getAuthorParams: function() {
            return {
                author_id: this.session.user.id
            }
        },
        initiatePost: function() {
            this.createPost(this.getPostParams())
        },
        createPost: function(c) {
            var d = this.post;
            this.dismissAlert();
            var e = a.now();
            if (!this.shouldAbortCreatePost(d, c))
                return this.listenTo(d, {
                    error: this._onCreateError,
                    sync: b.partial(this._onCreateSync, e)
                }),
                d.save(c),
                this.attachAuthorToPost(d, c),
                d.created = !0,
                this.addPostToThread(d),
                this.clear(),
                this.trigger("uiAction:createPost", d),
                d
        },
        shouldAbortCreatePost: function(a, b) {
            return this.isUploadInProgress() ? (this.alert(p("Please wait until your images finish uploading."), {
                type: "error",
                target: this.postboxAlertSelector
            }),
            !0) : !a.set(b, {
                validate: !0
            }) && (this.alert(a.validationError, {
                type: "error",
                target: this.postboxAlertSelector
            }),
            !0)
        },
        alertBannedError: function() {
            var a = {
                blocker: this.session.user.get("isOnGlobalBlacklist") ? "Disqus" : this.thread.forum.get("name")
            };
            if (this.session.get("banExpires")) {
                var b = e(k.assureTzOffset(this.session.get("banExpires")), k.ISO_8601);
                if (b.isBefore(e()))
                    return;
                a.expirationRelative = b.fromNow()
            }
            this.alert(this.blacklistErrorMessageTemplate(a), {
                type: "error",
                target: this.postboxAlertSelector,
                safe: !0
            })
        },
        _onCreateError: function(a, c) {
            12 === c.code && /not have permission to post on this thread/.test(c.response) ? this.alertBannedError() : 12 === c.code && /verify/.test(c.response) ? this._alertMustVerify(!0) : b.isString(c.response) ? this.alert(c.response, {
                type: "error",
                target: this.postboxAlertSelector
            }) : this.alert(p("Oops! We're having trouble posting your comment. Check your internet connection and try again."), {
                type: "error",
                target: this.postboxAlertSelector
            }),
            this.thread.posts.remove(a),
            this.restore(a)
        },
        _onCreateSync: function(b, c) {
            this.textarea.removeDraft(),
            this.thread.trigger("create", c),
            this.trigger("uiCallback:postCreated", c, {
                duration: a.now() - b
            }),
            this.parentView && this.parentView.toggleReplyLink(!1),
            this.stopListening(c, "error", this._onCreateError),
            this.stopListening(c, "sync", this._onCreateSync),
            this.post = this.makePostInstance(),
            this.trigger("domReflow")
        },
        attachAuthorToPost: function(a, b) {
            this.session.isLoggedIn() ? a.author = this.session.user : a.author = new f(this.constructor.User,{
                name: b.author_name,
                email: b.author_email
            })
        },
        addPostToThread: function(a) {
            this.thread.posts.add(a)
        },
        remove: function() {
            this.parent && delete r.open[this.parent.cid],
            c.View.prototype.remove.call(this)
        },
        toggle: function() {
            this.isOpen() ? this.hide() : this.show()
        },
        show: function() {
            var a = this;
            a._isHidden = !1,
            a.$el.removeClass("hidden"),
            a.trigger("show")
        },
        hide: function() {
            var a = this;
            a._isHidden = !0,
            a.dismissAlert(),
            a.$el.addClass("hidden"),
            a.trigger("hide")
        },
        isOpen: function() {
            return !this._isHidden
        }
    }, {
        mustVerifyEmailToPost: function(a, b) {
            if (a.isAnonymous())
                return !1;
            var c = b.get("settings").mustVerifyEmail
              , d = a.get("isVerified");
            return c && !d
        },
        canUseContentEditable: d.contenteditable && !l.isMobileUserAgent() && !(window.opera && window.opera.version),
        TextareaView: n,
        ContentEditableView: m,
        User: j,
        Post: i,
        open: {}
    });
    return g.call(r.prototype),
    h.call(r.prototype),
    r
}),
define("lounge/mixins/post-reply", ["underscore", "common/models", "lounge/common"], function(a, b, c) {
    "use strict";
    var d = {
        initialize: function() {
            this.canBindTypingHandlers() && this.bindTypingHandlers()
        },
        canBindTypingHandlers: function() {
            return this.parent && c.getLounge().isRealtimeEnabled() && this.session && this.thread && this.thread.forum
        },
        bindTypingHandlers: function() {
            return a.map([[this, "show", this.typingStart], [this, "hide", this.typingStop]], function(a) {
                return this.listenTo.apply(this, a),
                a
            }, this)
        },
        syncTyping: function(a) {
            this.typingUser && (void 0 !== a && this.typingUser.set("typing", a),
            this.typingUser.sync())
        },
        typingStart: function() {
            var a = this.parent;
            this.typingUser || (this.typingUser = b.TypingUser.make({
                user: this.session.user.id,
                post: a.id,
                thread: this.thread.id,
                forum: this.thread.forum.id
            }),
            a.usersTyping.add(this.typingUser)),
            this.syncTyping(!0)
        },
        typingStop: function() {
            this.syncTyping(!1)
        }
    }
      , e = function(b) {
        var c = b.initialize
          , e = b.remove;
        a.extend(b, d),
        b.initialize = function() {
            c.apply(this, arguments),
            d.initialize.call(this)
        }
        ,
        b.remove = function() {
            return this.parent && this.typingStop(),
            e.call(this)
        }
    };
    return {
        asRealtimeTyping: e
    }
}),
define("core/models/Channel", ["underscore", "backbone", "core/UniqueModel", "core/api", "core/models/Forum", "core/strings"], function(a, b, c, d, e, f) {
    "use strict";
    var g = f.get
      , h = b.Model.extend({
        defaults: {
            primaryForum: {},
            slug: null,
            name: null,
            options: {},
            followUrl: "channels/follow",
            unfollowUrl: "channels/unfollow"
        },
        idAttribute: "slug",
        initialize: function(a, b) {
            this.buildPrimaryForum(b),
            this.listenTo(this, "change:primaryForum", this.updatePrimaryForum),
            this.listenTo(this, "change:primaryCategory", this.updatePrimaryCategory)
        },
        buildPrimaryForum: function() {
            if (!this.primaryForum) {
                var a = this.get("primaryForum");
                a && (this.primaryForum = new c(e,a,{
                    channel: this
                }),
                this.unset("primaryForum"))
            }
        },
        updatePrimaryForum: function() {
            var a = this.get("primaryForum");
            a && (this.primaryForum || this.buildPrimaryForum(),
            this.primaryForum.set(a),
            this.unset("primaryForum"))
        },
        updatePrimaryCategory: function() {
            var a = this.get("primaryCategory")
              , b = this.primaryCategory;
            null === a ? this.primaryCategory = void 0 : b ? b.set(a) : this.primaryCategory = new c(h,a),
            this.unset("primaryCategory"),
            this.trigger("changeRelated:primaryCategory")
        },
        fetch: function(c) {
            return c = c ? a.clone(c) : {},
            c.data = this.buildFetchData(c.data),
            b.Model.prototype.fetch.call(this, c)
        },
        buildFetchData: function(b) {
            var c = b ? a.clone(b) : {};
            return this.id && (c.channel = this.id),
            c
        },
        url: function(a) {
            return d.getURL(this.constructor.URLS[a] || this.constructor.URLS.read)
        },
        sync: function(c, d, e) {
            var f = d.attributes;
            e = a.extend({
                url: this.url(c),
                emulateHTTP: !0
            }, e);
            var g = {
                bannerColor: f.bannerColor,
                description: f.description,
                primaryCategory: d.primaryCategory && d.primaryCategory.get("slug") || ""
            };
            switch ("default" === e.avatarType ? g.avatar = "" : f.avatar && !a.isString(f.avatar) && (g.avatar = f.avatar),
            "file" !== e.bannerType ? g.banner = "" : f.banner && !a.isString(f.banner) && (g.banner = f.banner),
            c) {
            case "create":
                e.processData = !1,
                e.contentType = !1,
                g.name = f.name,
                e.data = this.toFormData(a.extend({}, g, e.data));
                break;
            case "update":
                e.processData = !1,
                e.contentType = !1,
                g.channel = f.slug,
                e.data = this.toFormData(a.extend({}, g, e.data))
            }
            return b.sync(c, d, e)
        },
        toFormData: function(b) {
            return a.reduce(b, function(b, c, d) {
                return b.append(d, a.isString(c) ? c.trim() : c),
                b
            }, new window.FormData)
        },
        parse: function(a) {
            return a.response || a
        },
        shouldFetch: function() {
            return !this.get("name") || !this.get("dateAdded")
        },
        ensureFetched: function() {
            this.shouldFetch() && this.fetch()
        },
        validate: function(b) {
            var c = []
              , d = b.name.trim();
            d.length < this.constructor.MIN_NAME_LENGTH ? c.push({
                attrName: "name",
                message: f.interpolate(g("Name must have at least %(minLength)s characters."), {
                    minLength: this.constructor.MIN_NAME_LENGTH
                })
            }) : d.length > this.constructor.MAX_NAME_LENGTH && c.push({
                attrName: "name",
                message: f.interpolate(g("Name must have less than %(maxLength)s characters."), {
                    maxLength: this.constructor.MAX_NAME_LENGTH
                })
            });
            var e = b.description.trim();
            if (e.length < this.constructor.MIN_DESCRIPTION_LENGTH ? c.push({
                attrName: "description",
                message: f.interpolate(g("Description must have at least %(minLength)s characters."), {
                    minLength: this.constructor.MIN_DESCRIPTION_LENGTH
                })
            }) : e.length > this.constructor.MAX_DESCRIPTION_LENGTH && c.push({
                attrName: "description",
                message: f.interpolate(g("Description must have less than %(maxLength)s characters."), {
                    maxLength: this.constructor.MAX_DESCRIPTION_LENGTH
                })
            }),
            this.constructor.BANNER_COLORS[b.bannerColor] || c.push({
                attrName: "bannerColor",
                message: f.interpolate(g("Banner color must be one of " + a.invoke(a.values(this.constructor.BANNER_COLORS), "toLowerCase").join(", ")) + ".")
            }),
            !a.isEmpty(c))
                return c
        },
        _changeFollowingState: function(b, c) {
            return c = c || {},
            c.type = "POST",
            c.data = a.extend({
                target: this.get("slug")
            }, c.data),
            d.call(b, c)
        },
        follow: function(a) {
            return this.primaryForum.set("isFollowing", !0),
            this._changeFollowingState(this.get("followUrl"), a)
        },
        unfollow: function(a) {
            return this.primaryForum.set("isFollowing", !1),
            this._changeFollowingState(this.get("unfollowUrl"), a)
        },
        toggleFollowed: function() {
            if (this.get("options").isCurationOnlyChannel && this.primaryForum) {
                var a = this.primaryForum.get("isFollowing") ? this.unfollow() : this.follow();
                return this.primaryForum.trigger("toggled:isFollowing"),
                a
            }
        },
        toJSON: function() {
            var c = b.Model.prototype.toJSON.call(this);
            return a.defaults({
                primaryCategory: this.primaryCategory ? this.primaryCategory.toJSON() : {}
            }, c)
        }
    }, {
        URLS: {
            read: "channels/details",
            create: "channels/create",
            update: "channels/update"
        },
        BANNER_COLORS: {
            gray: g("Gray"),
            blue: g("Blue"),
            green: g("Green"),
            yellow: g("Yellow"),
            orange: g("Orange"),
            red: g("Red"),
            purple: g("Purple")
        },
        MIN_NAME_LENGTH: 3,
        MAX_NAME_LENGTH: 100,
        MIN_DESCRIPTION_LENGTH: 5,
        MAX_DESCRIPTION_LENGTH: 200
    });
    return c.addType("Channel", h),
    h
}),
define("core/utils/objectExpander", ["underscore", "core/UniqueModel", "core/models/Channel", "core/models/Thread"], function(a, b, c, d) {
    "use strict";
    return {
        Channel: c,
        Thread: d,
        parseObject: function(b, c) {
            return a.isString(c) ? b[c] : c
        },
        buildThread: function(c, d) {
            if (d instanceof this.Thread)
                return d;
            if (d = this.parseObject(c, d),
            a.isString(d.author)) {
                var e = d.author.replace("auth.User?id=", "");
                d.author = c["auth.User?id=" + e] || e
            }
            return new b(this.Thread,d,{
                forum: this.parseObject(c, d.forum),
                author: d.author
            })
        },
        buildChannel: function(a, c) {
            return c instanceof this.Channel ? c : (c = this.parseObject(a, c),
            new b(this.Channel,c))
        }
    }
}),
define("core/collections/PaginatedCollection", ["underscore", "backbone"], function(a, b) {
    "use strict";
    var c = b.Collection.extend({
        PER_PAGE: 30,
        initialize: function(b, c) {
            this.cid = a.uniqueId("collection"),
            c = c || {},
            this.cursor = c.cursor || {}
        },
        ensureFetched: a.memoize(function() {
            return this.fetch()
        }, function() {
            return this.cid
        }),
        fetch: function(c) {
            return c = c || {},
            c.data = a.defaults(c.data || {}, {
                cursor: c.cursor || "",
                limit: c.PER_PAGE || this.PER_PAGE
            }),
            b.Collection.prototype.fetch.call(this, c)
        },
        hasPrev: function() {
            return this.cursor.hasPrev
        },
        hasNext: function() {
            return this.cursor.hasNext
        },
        next: function(b) {
            return this.cursor.hasNext ? this.fetch(a.extend({}, b, {
                add: !0,
                remove: !0,
                cursor: this.cursor.next
            })) : void this.trigger("nodata")
        },
        prev: function(b) {
            return this.cursor.hasPrev ? this.fetch(a.extend({}, b, {
                add: !0,
                remove: !0,
                cursor: this.cursor.prev
            })) : void this.trigger("nodata")
        },
        more: function(b) {
            function c(a) {
                e.push(a)
            }
            var d = this;
            if (b = b || {},
            !this.cursor.hasNext)
                return void d.trigger("nodata");
            var e = [];
            return this.on("add", c),
            this.fetch(a.extend({}, b, {
                add: !0,
                remove: !1,
                cursor: this.cursor.next,
                limit: this.PER_PAGE,
                success: function() {
                    d.trigger("add:many", e, d, b),
                    d.off("add", c),
                    b.success && b.success.apply(this, arguments)
                }
            }))
        },
        parse: function(a) {
            return this.cursor = a.cursor || {
                hasNext: !1
            },
            a.response
        },
        getLength: function() {
            return this.length
        }
    });
    return c
}),
define("core/collections/ChannelCollection", ["underscore", "core/collections/PaginatedCollection", "core/UniqueModel", "core/api", "core/models/Channel", "core/utils/objectExpander"], function(a, b, c, d, e, f) {
    "use strict";
    var g = b.extend({
        url: d.getURL("channels/list"),
        model: c.boundModel(e),
        initialize: function(a, c) {
            b.prototype.initialize.call(this, a, c),
            c = c || {},
            this.listName = c.listName
        },
        fetch: function(c) {
            return c = c || {},
            this.listName && (c.data = a.extend({
                listName: this.listName
            }, c.data)),
            b.prototype.fetch.call(this, c)
        },
        parse: function(c) {
            return c = b.prototype.parse.call(this, c),
            c.items ? a.map(c.items, function(a) {
                return f.buildChannel(c.objects, a.reference)
            }) : c
        }
    });
    return g
}),
define("common/collections", ["underscore", "backbone", "moment", "core/api", "core/utils/objectExpander", "core/collections/UserCollection", "core/collections/PaginatedCollection", "core/collections/ChannelCollection", "core/models/ThreadVote", "core/UniqueModel", "common/models", "common/cached-storage"], function(a, b, c, d, e, f, g, h, i, j, k, l) {
    "use strict";
    var m = b.Collection.extend({
        model: i
    })
      , n = g.extend({
        PER_PAGE: 50,
        model: j.wrap(k.Post),
        url: d.getURL("threads/listPostsThreaded"),
        initialize: function(a, b) {
            g.prototype.initialize.apply(this, arguments),
            b = b || {},
            this.thread = b.thread,
            this.setOrder(b.order)
        },
        fetch: function(b) {
            return b = b || {},
            a.extend(b, {
                data: {
                    limit: this.PER_PAGE,
                    thread: this.thread.id,
                    forum: this.thread.get("forum"),
                    order: this.getOrder()
                }
            }),
            g.prototype.fetch.call(this, b)
        },
        getOrder: function() {
            return this.order
        },
        setOrder: function(a) {
            this.order = a
        }
    })
      , o = b.Collection.extend({
        collection: b.Collection,
        initialize: function(a, b) {
            this.thread = b.thread,
            this.perPage = b.perPage || 20,
            this.buffer = new this.collection(a,b),
            this.resetPage(),
            this.listenTo(this.buffer, "reset", this.resetPage)
        },
        resetPage: function(a, c, d) {
            return c = this.buffer.slice(0, this.perPage),
            b.Collection.prototype.reset.call(this, c, d)
        },
        currentPage: function() {
            var a = Math.floor(this.length / this.perPage);
            return this.length % this.perPage && (a += 1),
            a
        },
        setPageFor: function(a, b) {
            var c = this.buffer.get(a)
              , d = this.perPage;
            c && (d = this.perPage * Math.floor(this.buffer.indexOf(c) / this.perPage + 1)),
            this.add(this.buffer.slice(0, d), b)
        },
        hasNext: function() {
            return this.buffer.length > this.length || this.buffer.hasNext()
        },
        more: function(a) {
            a = a || {};
            var b = this
              , c = b.length + this.perPage
              , d = a.success;
            a.success = function() {
                b.add(b.buffer.slice(0, c)),
                d && d()
            }
            ,
            b.buffer.length < b.length + this.perPage && b.buffer.hasNext() ? (b.add(b.buffer.slice(0, c)),
            b.buffer.more(a)) : a.success()
        }
    });
    a.each(["setOrder", "getOrder", "fetch", "reset"], function(a) {
        o.prototype[a] = function() {
            return this.buffer[a].apply(this.buffer, arguments)
        }
    }),
    a.each(["add", "remove"], function(a) {
        o.prototype[a] = function() {
            return this.buffer[a].apply(this.buffer, arguments),
            b.Collection.prototype[a].apply(this, arguments)
        }
    });
    var p = o.extend({
        model: n.prototype.model,
        collection: n,
        initialize: function() {
            o.prototype.initialize.apply(this, arguments),
            this.submittedPostsCache = new l("submitted_posts_cache")
        },
        restoreFromCache: function() {
            var b = this.submittedPostsCache.getAll()
              , c = this;
            this.add(a.chain(b).reject(function(a) {
                return c.thread.get("id") !== a.thread || a.parent && !c.get(a.parent)
            }).map(function(a) {
                return a.isCached = !0,
                a
            }).value())
        },
        removeFromCache: function(a) {
            this.submittedPostsCache.removeItem(a.id)
        },
        saveToCache: function(a) {
            this.submittedPostsCache.setItem(a.id, a.toJSON())
        }
    })
      , q = b.Collection.extend({
        model: k.QueuedPost,
        initialize: function(a, b) {
            var c = this;
            c.thread = b.thread,
            c.counters = {
                comments: 0,
                replies: {}
            },
            c.on("add", function(a) {
                var b = a.getVisibleParent(c.thread)
                  , d = c.counters.replies;
                b ? (d[b.id] = (d[b.id] || 0) + 1,
                b.id === a.get("parentId") && a.set("immedReply", !0)) : c.counters.comments += 1
            })
        },
        comparator: function(a) {
            return parseInt(a.id, 10)
        },
        isDescendant: function(b, c) {
            var d = b.get("parentId")
              , e = d ? this.get(d) : null
              , f = {};
            for (a.each(c, function(a) {
                f[a] = !0
            }); e; ) {
                if (f[e.get("id")] === !0)
                    return !0;
                d = e.get("parentId"),
                e = d ? this.get(d) : null
            }
            return !1
        },
        drain: function w(b) {
            function c(a) {
                var b = [];
                e.each(function(a) {
                    null === a.get("parentId") && b.push(a.get("id"))
                }),
                e.reset(e.filter(function(c) {
                    return null === c.get("parentId") || e.isDescendant(c, b) ? void a(c) : c
                })),
                e.counters.comments = 0
            }
            function d(c) {
                var d, f = [];
                d = e.filter(function(a) {
                    var c = a.getVisibleParent(e.thread);
                    return c && c.get("id") === b ? void f.push(a) : a
                }),
                f = a.sortBy(f, function(a) {
                    return parseInt(a.get("id"), 10)
                }),
                a.each(f, function(a) {
                    c(a)
                }),
                e.reset(d),
                e.counters.replies[b] = 0
            }
            var e = this
              , w = b ? d : c;
            return w(function(a) {
                e.thread.posts.add(a.toPost(e.thread))
            })
        }
    })
      , r = b.Collection.extend({
        models: k.TypingUser,
        initialize: function() {
            var b = this;
            b.gc = null,
            b.on("add remove reset", function() {
                var c = b.count();
                return c > 0 && null === b.gc ? void (b.gc = setInterval(a.bind(b.cleanup, b), 6e4)) : void (c <= 0 && null !== b.gc && (clearInterval(b.gc),
                b.gc = null))
            }, b)
        },
        count: function(a) {
            var b = this.filter(function(b) {
                return !(a && b.id === a) && b.get("typing")
            });
            return b.length
        },
        cleanup: function() {
            var a = c();
            this.reset(this.filter(function(b) {
                return a.diff(b.lastModified, "minutes") < 5
            }))
        }
    })
      , s = g.extend({
        model: j.wrap(k.Post),
        url: d.getURL("users/listPostActivity")
    })
      , t = g.extend({
        model: k.Thread,
        url: d.getURL("timelines/ranked"),
        initialize: function(a, b) {
            b = b || {},
            this.type = b.type,
            this.target = b.target
        },
        fetch: function(b) {
            return b = b || {},
            b.data = a.extend({
                type: this.type,
                target: this.target
            }, b.data),
            g.prototype.fetch.call(this, b)
        },
        parse: function(b) {
            return b = g.prototype.parse.call(this, b),
            a.map(b.activities, function(a) {
                return e.buildThread(b.objects, a.items[0].object)
            })
        }
    })
      , u = b.Collection.extend({
        model: k.SyncedTopUser,
        url: d.getURL("forums/listMostActiveUsers"),
        initialize: function(a, b) {
            this.forum = b.forum,
            this.limit = b.limit
        },
        fetch: function(c) {
            return b.Collection.prototype.fetch.call(this, a.extend({
                data: {
                    forum: this.forum,
                    limit: this.limit
                }
            }, c))
        },
        parse: function(b) {
            return a.filter(b.response, function(a) {
                if (parseFloat(a.rep) > .7)
                    return a
            })
        }
    });
    f.prototype.model = j.wrap(k.User);
    var v = b.Collection.extend({
        model: k.SyncedUser,
        url: d.getURL("forums/listModerators"),
        initialize: function(a, b) {
            this.forum = b.forum
        },
        fetch: function(c) {
            return b.Collection.prototype.fetch.call(this, a.extend({
                data: {
                    forum: this.forum
                }
            }, c))
        },
        parse: function(b) {
            return a.map(b.response, function(a) {
                return a.user
            })
        }
    });
    return {
        PaginatedCollection: g,
        UserCollection: f,
        ChannelCollection: h,
        PostCollection: n,
        SubpaginatedPostCollection: p,
        TypingUserCollection: r,
        TopUserCollection: u,
        RankedThreadCollection: t,
        ThreadVoteCollection: m,
        PostActivityCollection: s,
        QueuedPostCollection: q,
        ModeratorCollection: v
    }
}),
define("templates/lounge/suggestions", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function() {
        return a.createElement("ul", {
            className: "user-mention__list"
        }, a.createElement("li", {
            className: "header user-mention__header"
        }, a.createElement("h5", null, c("in this conversation"))))
    };
    return d
}),
define("templates/lounge/suggestedUser", ["react", "core/strings", "core/utils/object/get"], function(a, b, c) {
    "use strict";
    var d = b.gettext
      , e = function(b) {
        return a.createElement("li", {
            className: "user-mention__item",
            "data-cid": b.cid || ""
        }, a.createElement("img", {
            src: c(b.avatar, ["cache"], ""),
            className: "avatar",
            alt: d("Avatar")
        }), a.createElement("span", null, b.name || b.username || null))
    };
    return e
}),
define("lounge/views/posts/SuggestionView", ["jquery", "underscore", "backbone", "templates/lounge/suggestions", "templates/lounge/suggestedUser"], function(a, b, c, d, e) {
    "use strict";
    var f = c.View.extend({
        events: {
            "click li": "handleClick"
        },
        initialize: function(a) {
            this.active = !1,
            this.mentionsCache = a.mentions,
            this.userSuggestions = a.userSuggestions,
            this.userHtmlCache = {}
        },
        suggest: function(a) {
            var b = this.userSuggestions.find(a, this.mentionsCache);
            return b && b.length ? (this.renderUsers(b),
            this.active = !0,
            void this.$el.show()) : void this.clear()
        },
        render: function() {
            return this.$el.html(d()),
            this.active || this.$el.hide(),
            this
        },
        renderUsers: function(c) {
            var d = b.reduce(c, function(b, c) {
                var d = this.userHtmlCache[c.cid];
                return void 0 === d && (this.userHtmlCache[c.cid] = d = a(this.renderSingleUser(c))),
                b.appendChild(d[0]),
                b
            }, window.document.createDocumentFragment(), this);
            this.$(".header").siblings().remove().end().after(d).siblings().removeClass("active").first().addClass("active")
        },
        renderSingleUser: function(a) {
            var b = a.toJSON();
            return b.cid = a.cid,
            e(b)
        },
        clear: function() {
            this.active = !1,
            this.$el.hide()
        },
        handleClick: function(b) {
            var c = a(b.currentTarget);
            this.select(c.attr("data-cid"))
        },
        select: function(a) {
            this.active && (a || (a = this.$el.find(".active").attr("data-cid")),
            this.trigger("select", a),
            this.clear())
        },
        move: function(a) {
            if (this.active) {
                var b = this.$el.find(".active")
                  , c = "up" === a ? "prev" : "next"
                  , d = b[c]();
                d.length && d.attr("data-cid") && (b.removeClass("active"),
                d.addClass("active"))
            }
        }
    }, {
        MAX_SUGGESTIONS: 5
    });
    return f
}),
define("lounge/views/posts/ContentEditableView", ["jquery", "underscore", "core/editable", "core/views/ContentEditableView", "common/collections", "common/Session", "lounge/views/posts/SuggestionView"], function(a, b, c, d, e, f, g) {
    "use strict";
    var h = window.document
      , i = d
      , j = i.prototype
      , k = i.extend({
        initialize: function(a) {
            j.initialize.call(this, a),
            a = a || {},
            this.userSuggestions = a.userSuggestions,
            this.mentionsCache = new e.UserCollection,
            this.restoreMentionedUsers(),
            this.suggestions = new g({
                userSuggestions: this.userSuggestions,
                mentions: this.mentionsCache
            }),
            this.listenTo(this.suggestions, "select", this.insertMention),
            this.reset(),
            this.$input = null
        },
        restoreMentionedUsers: function() {
            var a = this.getDraft()[2];
            a && !b.isEmpty(a) && this.userSuggestions.addRemote(new e.UserCollection(a))
        },
        reset: function() {
            this.anchorNode = null,
            this.anchorOffset = null,
            this.anchorLength = 0,
            this.suggestions.clear()
        },
        render: function() {
            return d.prototype.render.call(this),
            this.$el.append(this.suggestions.render().el),
            this
        },
        createInput: function() {
            var a = d.prototype.createInput.call(this);
            return this.content.getHtmlElements = b.bind(this.getHtmlElements, this),
            a
        },
        getHtmlElements: function(a) {
            if (!a)
                return a;
            var c = [a]
              , d = this.getMentionNodes(a);
            return b.each(d, function(a, d) {
                for (var e = 0; e < c.length; e++) {
                    var f, g = c[e], h = e;
                    if (b.isString(g)) {
                        for (; (f = g.indexOf(d)) > -1; )
                            f > 0 && (c.splice(e, 0, g.substring(0, f)),
                            e += 1),
                            c.splice(e, 0, a.cloneNode(!0)),
                            e += 1,
                            g = g.substring(f + d.length);
                        g && g !== c[h] && (c.splice(e, 0, g),
                        e += 1),
                        h !== e && c.splice(e, 1)
                    }
                }
            }),
            c = b.map(c, function(a) {
                return b.isString(a) ? h.createTextNode(a) : a
            })
        },
        getMentionNodes: function(a) {
            var b = k.MENTIONS_RE_GROUPED
              , c = {};
            b.lastIndex = 0;
            for (var d = b.exec(a); d; ) {
                var e = d[1]
                  , f = this.userSuggestions.all().findWhere({
                    username: e
                });
                if (f) {
                    var g = k.getMentionDom(f)
                      , h = d[0];
                    c[h] = g,
                    this.updateCache(f, f.cid)
                }
                d = b.exec(a)
            }
            return c
        },
        handleKeyDown: function(a) {
            switch (d.prototype.handleKeyDown.call(this, a),
            a.keyCode) {
            case 9:
                this.suggestions.active && (this.suggestions.select(),
                a.preventDefault(),
                a.stopPropagation());
                break;
            case 10:
            case 13:
            case 38:
            case 40:
                this.suggestions.active && (a.preventDefault(),
                a.stopPropagation())
            }
        },
        handleKeyUp: function(a) {
            switch (d.prototype.handleKeyUp.call(this, a),
            a.preventDefault(),
            a.stopPropagation(),
            this.checkExistingMentions(),
            f.get().isLoggedIn() && this.userSuggestions.fetch(),
            a.keyCode) {
            case 10:
            case 13:
                this.suggestions.select();
                break;
            case 27:
                this.reset(a);
                break;
            case 38:
                this.suggestions.move("up");
                break;
            case 40:
                this.suggestions.move("down");
                break;
            default:
                this.throttledSuggest(a)
            }
        },
        suggest: function() {
            var a = this.parseSearchTerms();
            this.suggestions.suggest(a)
        },
        throttledSuggest: b.throttle(function() {
            this.suggest()
        }, 250),
        insertMention: function(a) {
            var c = this.userSuggestions.get(a);
            if (c) {
                this.selectSearchString(c),
                this.updateCache(c, a);
                var d = k.getMentionDom(c);
                this.content.insertNode(d);
                var e = this.$el.find("span[data-cid]");
                b.each(e, function(a) {
                    a.contentEditable !== !1 && (a.contentEditable = !1)
                })
            }
        },
        updateCache: function(a, b) {
            this.mentionsCache.get(b) || this.mentionsCache.add(a)
        },
        selectSearchString: function() {
            this.content.selectNodeText(this.anchorNode, this.anchorOffset - 1, this.anchorOffset + this.anchorLength)
        },
        get: function() {
            function a(a) {
                return c(a, !0) ? b.mentionToText(a) : null
            }
            var b = this
              , c = k.isMention;
            return this.content.text(a)
        },
        parseSearchTerms: function() {
            var a = this.content.selectedTextNode()
              , b = a ? a.nodeValue : ""
              , d = c.normalizeSpace;
            if (b) {
                var e = this.content.selectedTextNodeOffset(a)
                  , f = c.normalizeSpace(b.slice(0, e).split("").reverse().join(""))
                  , g = f.indexOf("@");
                if (g === -1)
                    return null;
                this.anchorNode = a,
                this.anchorOffset = e - g,
                this.anchorLength = g;
                var h = d(b.slice(this.anchorOffset - 1, e)).match(k.MENTIONS_RE);
                return h ? h[0].slice(1).split(" ") : 0 === g ? [""] : void 0
            }
        },
        checkExistingMentions: function() {
            var d = c.normalizeSpace
              , e = this.$el.find("span")
              , f = b.filter(e, k.isMention)
              , g = this.mentionsCache
              , h = {};
            b.each(f, function(c) {
                var e = a(c).attr("data-cid")
                  , f = b.reduce(this.content.getTextNodes(c), function(a, b) {
                    return a + d(b.nodeValue)
                }, "")
                  , i = g.get(e);
                i && i.get("name") !== f ? (this.mentionsCache.remove(i),
                this.content.removeNode(c),
                this.content.insertHTML(" "),
                this.reset()) : h[e] = c
            }, this),
            g.each(function(a) {
                h[a.cid] || g.remove(a)
            })
        },
        mentionToText: function(b) {
            var c = a(b).attr("data-cid")
              , d = this.mentionsCache.get(c)
              , e = b.innerText || b.textContent;
            return d && d.get("username") && (e = d.get("username")),
            ["@", e, ":", "disqus"].join("")
        },
        toJSON: function() {
            var a = d.prototype.toJSON.call(this);
            return a.push(this.mentionsCache.models),
            a
        }
    }, {
        MENTIONS_RE: new RegExp("@\\w+\\s?(?:\\w+\\s?){0,5}(?:\\w+)?$"),
        MENTIONS_RE_GROUPED: /@([\d\w]+)\s?(:\s?(\w+))?/gi,
        isMention: function(b, c) {
            var d;
            do {
                if (d = a(b),
                d.hasClass("mention") && d.attr("data-cid"))
                    return !0;
                b = b.parentElement
            } while (c && b);return !1
        },
        getMentionDom: function(a) {
            var b = h.createDocumentFragment()
              , c = h.createElement("span")
              , d = h.createElement("span")
              , e = h.createTextNode(a.get("name") || a.get("username"));
            return c.setAttribute("contenteditable", !0),
            d.setAttribute("contenteditable", !1),
            d.setAttribute("data-cid", a.cid),
            d.className = "mention",
            d.appendChild(e),
            c.appendChild(d),
            b.appendChild(c),
            b.appendChild(h.createTextNode(" ")),
            b
        }
    });
    return k
}),
define("core/views/common/LoginFormView", ["underscore", "backbone", "core/strings"], function(a, b, c) {
    "use strict";
    var d = c.get
      , e = b.View.extend({
        initialize: function() {
            this.model = new this.User
        },
        parseRegistrationErrorResponse: function(a) {
            if (a.responseJSON) {
                var b = a.responseJSON.response;
                return /Unable to create user/i.test(b) ? {
                    email: [d("That email address is already registered with a Disqus account. Log in or enter another email.")]
                } : /The e-mail address you specified is already in use./i.test(b) ? {
                    email: [d("The e-mail address you specified is already in use.") + '<br><a class="link" href="#" data-action="auth:disqus">' + d("Try logging in.") + "</a>"]
                } : {
                    all: [b]
                }
            }
        },
        getPassword: function() {
            var a = this.$el.find("input[name=password]");
            return a.length ? a.val() : null
        },
        getDisplayName: function() {
            return this.$el.find("input[name=display_name]").val()
        },
        getEmail: function() {
            return this.$el.find("input[name=email]").val()
        },
        disableForm: function() {
            this.$("[data-role=submit-btn-container]").addClass("is-submitting")
        },
        enableForm: function() {
            this.$("[data-role=submit-btn-container]").removeClass("is-submitting")
        },
        handleRegistrationErrorResponse: function(a) {
            this.handleRegistrationError(this.parseRegistrationErrorResponse(a))
        },
        registerUser: function() {
            return this.model.set({
                display_name: this.$el.find("input[name=display_name]").val(),
                email: this.$el.find("input[name=email]").val(),
                password: this.getPassword()
            }),
            this.model.isValid() ? (this.disableForm(),
            void this.model.register({
                error: a.bind(this.handleRegistrationErrorResponse, this),
                success: a.bind(this.handleRegistrationSuccess, this)
            }).always(a.bind(this.enableForm, this))) : void this.handleRegistrationError(this.model.validationError)
        }
    });
    return e
}),
define("templates/lounge/partials/audienceSync", ["react", "core/config/urls", "core/strings"], function(a, b, c) {
    "use strict";
    var d = c.gettext
      , e = function(c) {
        return a.createElement("div", {
            className: "audiencesync"
        }, a.createElement("h6", null, d("Connect with %(forumName)s", {
            forumName: c.forumName
        })), a.createElement("div", {
            className: "services"
        }, a.createElement("div", {
            className: "audiencesync__icons"
        }, a.createElement("img", {
            className: "icon",
            alt: "Disqus",
            src: "https://c.disquscdn.com/next/embed/assets/img/audiencesync/sync-icon.6569cc4fd4bb29f2cd6568f663ed1009.png"
        }), a.createElement("i", {
            className: "icon icon-proceed"
        }), a.createElement("img", {
            className: "icon",
            alt: c.forumName,
            src: (b.root || "") + "/api/applications/icons/" + (c.apiKey || "") + ".png"
        })), a.createElement("p", null, d("%(forumName)s needs permission to access your account.", {
            forumName: c.forumName
        }))), a.createElement("button", {
            type: "button",
            "data-action": "audiencesync",
            className: "proceed btn submit"
        }, d("Next")))
    };
    return e
}),
define("templates/lounge/partials/guestForm", ["react", "core/strings", "core/utils/object/get"], function(a, b, c) {
    "use strict";
    var d = b.gettext
      , e = function(b) {
        return a.createElement("div", {
            className: "guest"
        }, a.createElement("h6", {
            className: "guest-form-title"
        }, a.createElement("span", {
            className: "register-text"
        }, " ", d("or sign up with Disqus"), " "), a.createElement("span", {
            className: "guest-text"
        }, " ", d("or pick a name"), " ")), " ", a.createElement("div", {
            className: "help-tooltip__wrapper help-icon",
            tabIndex: 0
        }, a.createElement("div", {
            id: "rules",
            className: "tooltip show help-tooltip"
        }, a.createElement("h3", {
            className: "help-tooltip__heading"
        }, d("Disqus is a discussion network")), a.createElement("ul", {
            className: "help-tooltip__list"
        }, a.createElement("li", null, a.createElement("span", null, d("Disqus never moderates or censors. The rules on this community are its own."))), a.createElement("li", null, a.createElement("span", null, d("Don't be a jerk or do anything illegal. Everything is easier that way.")))), a.createElement("p", {
            className: "clearfix"
        }, a.createElement("a", {
            href: "https://docs.disqus.com/kb/terms-and-policies/",
            className: "btn btn-small help-tooltip__button",
            target: "_blank"
        }, d("Read full terms and conditions"))))), a.createElement("p", {
            className: "input-wrapper"
        }, a.createElement("input", {
            dir: "auto",
            type: "text",
            placeholder: d("Name"),
            name: "display_name",
            id: (b.cid || "") + "_display_name",
            maxLength: "30",
            className: "input--text"
        })), a.createElement("div", {
            className: "guest-details " + (c(b.sso, ["url"]) ? "expanded" : ""),
            "data-role": "guest-details"
        }, a.createElement("p", {
            className: "input-wrapper"
        }, a.createElement("input", {
            dir: "auto",
            type: "email",
            placeholder: d("Email"),
            name: "email",
            id: (b.cid || "") + "_email",
            className: "input--text"
        })), a.createElement("p", {
            className: "input-wrapper"
        }, a.createElement("input", {
            dir: "auto",
            disabled: !c(b.sso, ["url"]),
            type: c(b.sso, ["url"]) ? "password" : "text",
            className: "register-text input--text",
            placeholder: d("Password"),
            name: "password",
            id: (b.cid || "") + "_password"
        })), a.createElement("div", {
            className: "acceptance-wrapper register-text"
        }, d("By signing up, you agree to the %(Disqus)s %(basicRules)s, %(serviceTerms)s, and %(privacyPolicy)s.", {
            Disqus: "Disqus",
            basicRules: a.createElement("a", {
                href: "https://help.disqus.com/customer/portal/articles/1753105-basic-rules-for-disqus-powered-profiles-and-discussions",
                target: "_blank"
            }, d("Basic Rules")),
            serviceTerms: a.createElement("a", {
                href: "https://help.disqus.com/customer/portal/articles/466260-terms-of-service",
                target: "_blank"
            }, d("Terms of Service")),
            privacyPolicy: a.createElement("a", {
                href: "https://help.disqus.com/customer/portal/articles/466259-privacy-policy",
                target: "_blank"
            }, d("Privacy Policy"))
        })), a.createElement("div", {
            className: "acceptance-wrapper guest-text"
        }, d("By posting, you agree to the %(Disqus)s %(basicRules)s, %(serviceTerms)s, and %(privacyPolicy)s.", {
            Disqus: "Disqus",
            basicRules: a.createElement("a", {
                href: "https://help.disqus.com/customer/portal/articles/1753105-basic-rules-for-disqus-powered-profiles-and-discussions",
                target: "_blank"
            }, d("Basic Rules")),
            serviceTerms: a.createElement("a", {
                href: "https://help.disqus.com/customer/portal/articles/466260-terms-of-service",
                target: "_blank"
            }, d("Terms of Service")),
            privacyPolicy: a.createElement("a", {
                href: "https://help.disqus.com/customer/portal/articles/466259-privacy-policy",
                target: "_blank"
            }, d("Privacy Policy"))
        })), b.allowAnonPost ? a.createElement("div", {
            className: "guest-checkbox"
        }, a.createElement("label", null, a.createElement("input", {
            type: "checkbox",
            name: "author-guest"
        }), " ", d("I'd rather post as a guest"))) : a.createElement("input", {
            type: "checkbox",
            name: "author-guest",
            style: {
                display: "none"
            }
        }), a.createElement("div", {
            className: "proceed",
            "data-role": "submit-btn-container"
        }, b.allowAnonPost ? a.createElement("div", null, a.createElement("button", {
            type: "submit",
            className: "proceed__button btn submit",
            "aria-label": d("Post")
        }, a.createElement("span", {
            className: "icon-proceed"
        }), a.createElement("div", {
            className: "spinner"
        })), a.createElement("button", {
            type: "submit",
            className: "proceed__button btn next",
            "aria-label": d("Next")
        }, a.createElement("span", {
            className: "icon-proceed"
        }), a.createElement("div", {
            className: "spinner"
        }))) : a.createElement("button", {
            type: "submit",
            className: "proceed__button btn submit",
            "aria-label": d("Next")
        }, a.createElement("span", {
            className: "icon-proceed"
        }), a.createElement("div", {
            className: "spinner"
        })))))
    };
    return e
}),
define("lounge/utils", ["jquery", "remote/config", "core/api", "core/switches"], function(a, b, c, d) {
    "use strict";
    var e = {}
      , f = function(b) {
        if (e[b])
            return e[b];
        var d = a.Deferred();
        return b ? (e[b] = d.promise(),
        c.call("forums/details", {
            method: "GET",
            data: {
                forum: b,
                attach: "forumFeatures"
            }
        }).done(function(a) {
            d.resolve(a.response.features)
        }).fail(function() {
            d.reject({})
        }),
        d.promise()) : d.reject({})
    };
    f._clearCache = function() {
        e = {}
    }
    ;
    var g = function() {
        return d.isFeatureActive("experiment:add_login_option:amazon_rollout") || b.lounge.AMAZON_ENABLED_ALL && !d.isFeatureActive("experiment:add_login_option:amazon_removed")
    };
    return {
        isAmazonLoginEnabled: g,
        getSaasFeatures: f
    }
}),
define("templates/lounge/partials/loginButtons", ["react", "core/utils/object/get", "lounge/utils"], function(a, b, c) {
    "use strict";
    var d = function(d) {
        return a.createElement("ul", {
            "data-role": "login-menu",
            className: "services login-buttons"
        }, b(d.sso, ["url"]) ? a.createElement("li", {
            className: "sso"
        }, a.createElement("button", {
            type: "button",
            "data-action": "auth:sso",
            title: b(d.sso, ["name"], ""),
            className: "sso__button " + (b(d.sso, ["button"]) ? "image" : "no-image")
        }, b(d.sso, ["button"]) ? a.createElement("img", {
            alt: b(d.sso, ["name"], ""),
            src: b(d.sso, ["button"], "")
        }) : b(d.sso, ["name"], null))) : null, a.createElement("li", {
            className: "auth-disqus"
        }, a.createElement("button", {
            type: "button",
            "data-action": "auth:disqus",
            title: "Disqus",
            className: "connect__button"
        }, a.createElement("i", {
            className: "icon-disqus"
        }))), a.createElement("li", {
            className: "auth-facebook"
        }, a.createElement("button", {
            type: "button",
            "data-action": "auth:facebook",
            title: "Facebook",
            className: "connect__button"
        }, a.createElement("i", {
            className: "icon-facebook-circle"
        }))), a.createElement("li", {
            className: "auth-twitter"
        }, a.createElement("button", {
            type: "button",
            "data-action": "auth:twitter",
            title: "Twitter",
            className: "connect__button"
        }, a.createElement("i", {
            className: "icon-twitter-circle"
        }))), a.createElement("li", {
            className: "auth-google"
        }, a.createElement("button", {
            type: "button",
            "data-action": "auth:google",
            title: "Google",
            className: "connect__button"
        }, a.createElement("i", {
            className: "icon-google-plus-circle"
        }))), c.isAmazonLoginEnabled() ? a.createElement("li", {
            className: "auth-amazon"
        }, a.createElement("button", {
            type: "button",
            "data-action": "auth:amazon",
            title: "Amazon",
            className: "connect__button"
        }, a.createElement("i", {
            className: "icon-amazon-circle"
        }))) : null)
    };
    return d
}),
define("templates/lounge/loginForm", ["react", "core/strings", "core/utils/object/get", "templates/lounge/partials/audienceSync", "templates/lounge/partials/guestForm", "templates/lounge/partials/loginButtons"], function(a, b, c, d, e, f) {
    "use strict";
    var g = b.gettext
      , h = function(b) {
        return a.createElement("div", null, c(b.user, ["isAnonymous"]) ? a.createElement("section", {
            className: "auth-section logged-out"
        }, a.createElement("div", {
            className: "connect"
        }, a.createElement("h6", null, g("Log in with")), a.createElement(f, {
            sso: b.sso
        })), a.createElement(e, {
            cid: b.cid,
            sso: b.sso,
            allowAnonPost: b.allowAnonPost
        })) : null, b.audienceSyncRequired ? a.createElement("section", {
            className: "auth-section"
        }, a.createElement(d, {
            apiKey: b.apiKey,
            forumName: b.forumName
        })) : null)
    };
    return h
}),
define("lounge/views/posts/LoginFormView", ["underscore", "core/bus", "core/views/common/LoginFormView", "common/models", "lounge/common", "templates/lounge/loginForm"], function(a, b, c, d, e, f) {
    "use strict";
    var g = c.extend({
        events: {
            "click input[name=author-guest]": "updateLoginForm",
            "focusin input[name=display_name]": "expandGuestForm"
        },
        User: d.User,
        initialize: function(a) {
            c.prototype.initialize.call(this, a),
            this.thread = a.thread,
            this.session = a.session,
            this.alert = a.alert
        },
        expandGuestForm: function() {
            this.$("[data-role=guest-details]").addClass("expanded"),
            this.$("input[name=password]").attr("type", "password").removeAttr("disabled")
        },
        shouldRegisterUser: function() {
            return this.session.isLoggedOut() && !this.$("input[name=author-guest]").is(":checked")
        },
        render: function() {
            var a = e.getLounge();
            return this.$el.html(f({
                user: this.session.toJSON(),
                forumName: this.thread.forum.get("name"),
                audienceSyncRequired: this.session.needsAudienceSyncAuth(this.thread.forum),
                allowAnonPost: this.thread.forum.get("settings").allowAnonPost,
                apiKey: a.config && a.config.apiKey || "",
                sso: this.session.get("sso"),
                cid: this.cid
            })),
            this
        },
        handleRegistrationSuccess: function() {
            this.session.setUser(this.model),
            b.frame.trigger("onboardAlert.show"),
            e.getLounge().trigger("uiAction:finishRegistrationEmbed")
        },
        handleRegistrationError: function(b) {
            var c = this;
            c.clearRegistrationErrors(),
            a.isString(b) && (b = {
                all: [b]
            }),
            a.has(b, "all") && (c.alert && c.alert(b.all[0], {
                type: "error"
            }),
            b = a.omit(b, "all")),
            a.each(b, function(a, b) {
                var d = c.$("input[name=" + b + "]");
                d.attr("aria-invalid", "true").after('<label for="' + d.attr("id") + '" class="input-label">' + a[0] + "</label>").parent(".input-wrapper").addClass("has-error")
            }),
            c.$("[aria-invalid]").first().focus()
        },
        updateLoginForm: function() {
            var a = this.$el
              , b = a.find("input[name=author-guest]").is(":checked")
              , c = a.find(".guest")
              , d = a.find("input[name=password]");
            d.val(""),
            c.toggleClass("is-guest", b),
            this.clearRegistrationErrors()
        },
        clearRegistrationErrors: function() {
            this.$(".input-wrapper.has-error").removeClass("has-error").find(".input-label").remove(),
            this.$("[aria-invalid]").removeAttr("aria-invalid")
        }
    });
    return g
});
var _extends = Object.assign || function(a) {
    for (var b = 1; b < arguments.length; b++) {
        var c = arguments[b];
        for (var d in c)
            Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
    }
    return a
}
;
define("templates/lounge/partials/profileLink", ["react", "core/switches", "core/utils/object/get"], function(a, b, c) {
    "use strict";
    var d = function(d) {
        var e = d.children
          , f = d.user
          , g = d.forumId
          , h = _objectWithoutProperties(d, ["children", "user", "forumId"])
          , i = c(f, ["isSSOProfileUrl"]);
        return !i && b.isFeatureActive("sso_less_branding", {
            forum: g
        }) ? a.createElement("span", h, e) : a.createElement("a", _extends({
            href: c(f, ["profileUrl"], ""),
            "data-action": i ? null : "profile",
            "data-username": c(f, ["username"], ""),
            target: "_blank",
            rel: "noopener noreferrer"
        }, h), e)
    };
    return d
}),
define("templates/lounge/partials/userAvatar", ["react", "core/strings", "core/utils/object/get", "templates/lounge/partials/profileLink"], function(a, b, c, d) {
    "use strict";
    var e = b.gettext
      , f = function(b) {
        var f = b.defaultAvatarUrl
          , g = b.forumId
          , h = b.user
          , i = c(h, ["avatar", "cache"], "");
        return a.createElement(d, {
            user: h,
            forumId: g,
            className: "user"
        }, a.createElement("img", {
            "data-role": "user-avatar",
            "data-user": c(h, ["id"], ""),
            src: f || i,
            "data-src": f ? i : null,
            alt: e("Avatar")
        }))
    };
    return f
}),
define("templates/lounge/form", ["react", "core/strings", "core/utils/object/get", "templates/lounge/partials/userAvatar"], function(a, b, c, d) {
    "use strict";
    var e = b.gettext
      , f = function(b) {
        return a.createElement("div", {
            className: "postbox"
        }, a.createElement("div", {
            role: "alert"
        }), a.createElement("div", {
            className: "avatar"
        }, c(b.user, ["isRegistered"]) ? a.createElement(d, {
            forumId: b.forum.id,
            user: b.user
        }) : a.createElement("span", {
            className: "user"
        }, a.createElement("img", {
            "data-role": "user-avatar",
            src: c(b.user, ["avatar", "cache"], ""),
            alt: e("Avatar")
        }))), a.createElement("div", {
            className: "textarea-wrapper",
            "data-role": "textarea",
            dir: "auto"
        }, a.createElement("div", {
            "data-role": "drag-drop-placeholder",
            className: "media-drag-hover",
            style: {
                display: "none"
            }
        }, a.createElement("div", {
            className: "drag-text"
        }, "⬇ ", e("Drag and drop your images here to upload them."))), b.displayMediaPreviews ? a.createElement("div", {
            className: "media-preview empty",
            "data-role": "media-preview"
        }) : null, a.createElement("div", {
            className: "edit-alert",
            role: "postbox-alert"
        }), a.createElement("div", {
            className: "post-actions"
        }, a.createElement("ul", {
            className: "wysiwyg"
        }, b.displayMediaUploadButton ? a.createElement("li", {
            className: "wysiwyg__item",
            "data-role": "media-uploader"
        }) : null), c(b.user, ["isRegistered"]) && !b.audienceSyncRequired ? a.createElement("div", {
            className: "logged-in"
        }, a.createElement("section", null, a.createElement("div", {
            className: "temp-post",
            style: {
                textAlign: "right"
            }
        }, a.createElement("button", {
            className: "btn post-action__button"
        }, e("Post as %(name)s", {
            name: a.createElement("span", {
                "data-username": c(b.user, ["username"], ""),
                "data-role": "username"
            }, c(b.user, ["name"], null))
        }))))) : null)), a.createElement("div", {
            "data-role": "login-form"
        }))
    };
    return f
}),
define("templates/lounge/blacklistErrorMessage", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function(b) {
        return [b.expirationRelative ? c("We are unable to post your comment because %(blocker)s has placed your account in a timeout. You will be able to comment again when your timeout expires %(expirationRelative)s.", {
            blocker: b.blocker,
            expirationRelative: b.expirationRelative
        }) : c("We are unable to post your comment because you have been banned by %(blocker)s.", {
            blocker: b.blocker
        }), " ", a.createElement("a", {
            key: "error-link",
            target: "_blank",
            href: "https://help.disqus.com/customer/portal/articles/466223-who-deleted-or-removed-my-comment-"
        }, c("Find out more."))]
    };
    return d
}),
define("templates/lounge/emailVerifyAlert", ["react", "core/strings", "core/utils/object/get"], function(a, b, c) {
    "use strict";
    var d = b.gettext
      , e = function(b) {
        return [d("%(forumName)s requires you to verify your email address before posting.", {
            forumName: b.forumName
        }), " ", a.createElement("a", {
            key: "alert-link",
            "data-action": "verify-email",
            "data-forum": b.forumId,
            title: d("Verify Email"),
            href: "/verify"
        }, d("Send verification email to %(email)s", {
            email: c(b.user, ["email"], "")
        }))]
    };
    return e
}),
define("lounge/views/posts/PostReplyView", ["jquery", "underscore", "react", "react-dom/server", "core/utils", "core/bus", "core/switches", "core/views/PostReplyView", "common/models", "lounge/mixins/post-reply", "lounge/common", "lounge/views/posts/ContentEditableView", "lounge/views/posts/LoginFormView", "templates/lounge/form", "templates/lounge/blacklistErrorMessage", "templates/lounge/emailVerifyAlert"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    "use strict";
    var q = e.preventDefaultHandler
      , r = h
      , s = r.prototype
      , t = r.extend({
        initialize: function(a) {
            s.initialize.call(this, a),
            this.listenTo(this.session, "change:audienceSyncVerified", this.redraw),
            this.userSuggestions = a.userSuggestions,
            this.loginFormView = new m({
                thread: this.thread,
                session: this.session,
                alert: b.bind(this.alert, this)
            });
            var e = k.getLounge();
            b.each(["uiCallback:postCreated", "domReflow", "uiAction:createPost"], function(a) {
                this.listenTo(this, a, b.bind(e.trigger, e, a))
            }, this),
            this.template = n,
            this.blacklistErrorMessageTemplate = function(a) {
                return d.renderToStaticMarkup(c.createElement(o, a))
            }
            ,
            this.emailVerifyAlertTemplate = function(a) {
                return d.renderToStaticMarkup(c.createElement(p, a))
            }
        },
        getTemplateData: function() {
            var a = s.getTemplateData.call(this);
            return a.audienceSyncRequired = this.session.needsAudienceSyncAuth(this.thread.forum),
            a.forum = this.thread.forum.toJSON(),
            a
        },
        render: function() {
            return this.loginFormView.$el.detach(),
            s.render.call(this),
            this.loginFormView.render(),
            this.loginFormView.$el.appendTo(this.$("[data-role=login-form]")),
            this.session.user.id ? this.$el.addClass("authenticated") : this.$el.removeClass("authenticated"),
            this
        },
        createTextarea: function() {
            var a = {
                placeholder: this.getPlaceholderText(),
                storageKey: this.post.storageKey()
            };
            return this.constructor.canUseContentEditable ? (a.userSuggestions = this.userSuggestions,
            new this.constructor.ContentEditableView(a)) : new this.constructor.TextareaView(a)
        },
        getPostParams: function() {
            var b = a.Deferred()
              , c = s.getPostParams.call(this);
            return g.isFeatureActive("before_comment_callback", {
                forum: this.thread.forum.id
            }) ? (f.frame.sendHostMessage("posts.beforeCreate", {
                raw_message: c.raw_message
            }),
            this.listenToOnce(f.frame, "posts.beforeCreate.response", function(a) {
                a && (c.raw_message = a),
                b.resolve(c)
            })) : b.resolve(c),
            b.promise()
        },
        getAuthorParams: function() {
            return this.session.isLoggedIn() ? {
                author_id: this.session.user.id
            } : {
                author_name: this.loginFormView.getDisplayName(),
                author_email: this.loginFormView.getEmail()
            }
        },
        initiatePost: function() {
            var a = b.bind(this.createPost, this);
            this.getPostParams().done(a)
        },
        shouldAbortCreatePost: function(a, c) {
            return this.constructor.mustVerifyEmailToPost(this.session.user, this.thread.forum) ? (this.session.fetch().always(b.bind(function() {
                this.constructor.mustVerifyEmailToPost(this.session.user, this.thread.forum) ? this._alertMustVerify(!0) : this.createPost(c)
            }, this)),
            !0) : s.shouldAbortCreatePost.call(this, a, c)
        },
        _onCreateError: function(a, b) {
            s._onCreateError.call(this, a, b),
            this.thread.incrementPostCount(-1)
        },
        _onCreateSync: function(a, b) {
            s._onCreateSync.call(this, a, b),
            this.thread.posts.saveToCache(b)
        },
        addPostToThread: function(a) {
            this.thread.incrementPostCount(1),
            this.thread.posts.add(a)
        },
        remove: function() {
            return this.loginFormView && (this.loginFormView.remove(),
            this.loginFormView = null),
            s.remove.call(this)
        },
        submitForm: q(function() {
            return this.dismissAlert(),
            this.loginFormView.shouldRegisterUser() ? void this.loginFormView.registerUser() : this.initiatePost()
        })
    }, {
        ContentEditableView: l,
        User: i.User,
        Post: i.Post
    });
    return j.asRealtimeTyping(t.prototype),
    t
}),
define("core/models/RichMediaViewModel", ["backbone"], function(a) {
    "use strict";
    return a.Model.extend({
        defaults: {
            deferred: !0,
            showButtons: !0,
            activated: !1,
            kind: "image",
            deferredHeight: 0,
            providerExpandMessage: "",
            providerCollapseMessage: "",
            providerIcon: "icon-proceed",
            respectSettings: !0
        }
    })
}),
define("core/mediaConfig", ["underscore", "backbone"], function(a, b) {
    "use strict";
    function c() {
        var b = window.document.body.offsetWidth
          , c = d
          , e = c.length;
        return a.find(c, function(a, d) {
            return d + 1 === e || Math.abs(c[d + 1] - b) > Math.abs(c[d] - b)
        })
    }
    var d = [320, 480, 600, 800]
      , e = new b.Model({
        collapsed: !1,
        defaultIframeHeight: 300,
        mediaPersistedWidths: d,
        loadedThumbnailWidth: c()
    });
    return e.findClosestThumbnailSize = c,
    e
}),
define("core/templates/postMediaInlineLink", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        1: function(a, b, c, d, e) {
            var f;
            return null != (f = c["if"].call(null != b ? b : {}, null != b ? b.hasUserText : b, {
                name: "if",
                hash: {},
                fn: a.program(2, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : ""
        },
        2: function(a, b, c, d, e) {
            var f = a.lambda
              , g = a.escapeExpression;
            return '<a href="' + g(f(null != b ? b.href : b, b)) + '" rel="nofollow">' + g(f(null != b ? b.text : b, b)) + "</a>\n"
        },
        4: function(a, b, c, d, e) {
            var f, g = a.lambda, h = a.escapeExpression, i = null != b ? b : {};
            return '<a href="' + h(g(null != b ? b.href : b, b)) + '" class="post-media-link" data-action="expand-collapse-media" rel="nofollow">' + (null != (f = c["if"].call(i, null != (f = null != b ? b.model : b) ? f.providerIcon : f, {
                name: "if",
                hash: {},
                fn: a.program(5, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + h(g(null != b ? b.mediaLinkText : b, b)) + (null != (f = c["if"].call(i, null != b ? b.domain : b, {
                name: "if",
                hash: {},
                fn: a.program(7, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + "</a>\n"
        },
        5: function(a, b, c, d, e) {
            var f;
            return '<i class="' + a.escapeExpression(a.lambda(null != (f = null != b ? b.model : b) ? f.providerIcon : f, b)) + '"></i>'
        },
        7: function(a, b, c, d, e) {
            return '<span class="post-media-link-domain"> &mdash; ' + a.escapeExpression(a.lambda(null != b ? b.domain : b, b)) + "</span>"
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f;
            return null != (f = c["if"].call(null != b ? b : {}, null != (f = null != b ? b.model : b) ? f.deferred : f, {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.program(4, e, 0),
                data: e
            })) ? f : ""
        },
        useData: !0
    })
}),
define("core/views/RichMediaLinkView", ["backbone", "core/utils", "core/templates/postMediaInlineLink"], function(a, b, c) {
    "use strict";
    return a.View.extend({
        tagName: "span",
        events: {
            "click [data-action=expand-collapse-media]": "handleToggle"
        },
        initialize: function(a) {
            this.media = a.media;
            var c = a.$link;
            this.linkText = c.text(),
            this.linkHref = c.attr("href"),
            this.linkDomain = b.getDomain(this.linkHref),
            this.linkHasUserText = this.isUserText(c),
            this.hasGenericMessage = !1,
            this.linkHasUserText ? this.mediaLinkText = this.linkText : this.media.get("title") ? this.mediaLinkText = b.niceTruncate(this.media.get("title"), 60) : (this.hasGenericMessage = !0,
            this.mediaLinkText = this.model.get("providerExpandMessage")),
            this.listenTo(this.model, "change:deferred", this.render),
            this.listenTo(this.model, "change:activated", this.onChangeActivated)
        },
        isUserText: function(a) {
            if ("A" !== a[0].nodeName)
                return !1;
            var b = (a.text() || "").toLowerCase();
            if (!b)
                return !1;
            if (0 === b.indexOf("http") || 0 === b.indexOf("www"))
                return !1;
            b = b.replace(/\.\.\.$/, "");
            var c = (a.attr("href") || "").toLowerCase();
            return c.indexOf(b) === -1
        },
        render: function() {
            var a = this.mediaLinkText;
            return this.hasGenericMessage && this.model.get("activated") && (a = this.model.get("providerCollapseMessage")),
            this.$el.html(c({
                model: this.model.toJSON(),
                text: this.linkText,
                href: this.linkHref,
                mediaLinkText: a,
                domain: this.linkDomain,
                hasUserText: this.linkHasUserText
            })),
            this
        },
        onChangeActivated: function() {
            this.hasGenericMessage && this.render()
        },
        handleToggle: function(a) {
            this.model.get("deferred") || (this.model.set("activated", !this.model.get("activated")),
            a && a.preventDefault && a.preventDefault())
        }
    })
}),
define("core/templates/postMedia", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        1: function(a, b, c, d, e) {
            var f;
            return (null != (f = c["if"].call(null != b ? b : {}, null != (f = null != b ? b.media : b) ? f.providerName : f, {
                name: "if",
                hash: {},
                fn: a.program(2, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + a.escapeExpression(a.lambda(null != (f = null != b ? b.media : b) ? f.title : f, b))
        },
        2: function(a, b, c, d, e) {
            var f;
            return a.escapeExpression(a.lambda(null != (f = null != b ? b.media : b) ? f.providerName : f, b)) + " &ndash; "
        },
        4: function(a, b, c, d, e) {
            var f;
            return '<i class="' + a.escapeExpression(a.lambda(null != (f = null != b ? b.model : b) ? f.providerIcon : f, b)) + ' publisher-background-color"></i>'
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f, g = a.lambda, h = a.escapeExpression, i = null != b ? b : {};
            return '\n<a class="media-button media-button-expand publisher-color publisher-border-color" href="' + h(g(null != (f = null != b ? b.media : b) ? f.url : f, b)) + '" rel="nofollow" target="_blank" data-action="expand"\ntitle="' + (null != (f = c["if"].call(i, null != (f = null != b ? b.media : b) ? f.title : f, {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + '">\n' + (null != (f = c["if"].call(i, null != (f = null != b ? b.model : b) ? f.providerIcon : f, {
                name: "if",
                hash: {},
                fn: a.program(4, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + "\n" + h(g(null != (f = null != b ? b.model : b) ? f.providerExpandMessage : f, b)) + '\n</a>\n<a class="media-button media-button-contract publisher-color publisher-border-color" href="#" target="_blank" data-action="contract">\n<i class="icon-cancel publisher-background-color"></i> ' + h(g(null != (f = null != b ? b.model : b) ? f.providerCollapseMessage : f, b)) + '\n</a>\n<div class="media-content-loader" data-role="content-loader"></div>\n<div data-role="content-placeholder" class="media-content-placeholder"></div>\n'
        },
        useData: !0
    })
}),
define("core/templates/postMediaPlaceholder", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f;
            return '<a href="#" class="media-force-load" data-action="force-load"><i class="' + a.escapeExpression(a.lambda(null != (f = null != b ? b.model : b) ? f.providerIcon : f, b)) + '"></i></a>\n'
        },
        useData: !0
    })
}),
define("core/views/RichMediaView", ["jquery", "backbone", "core/utils", "core/mediaConfig", "core/views/RichMediaLinkView", "core/templates/postMedia", "core/templates/postMediaPlaceholder"], function(a, b, c, d, e, f, g) {
    "use strict";
    var h = c.preventDefaultHandler
      , i = function(a, b, c, d) {
        a[b.get(c) ? "addClass" : "removeClass"](d)
    };
    return b.View.extend({
        className: "media-container",
        events: {
            "click [data-action=expand]": "handleExpand",
            "click [data-action=contract]": "handleContract",
            "click [data-action=force-load]": "handleForceLoad"
        },
        template: f,
        initialize: function(a) {
            this.options = a,
            this.media = a.media,
            this.template = a.template || this.template,
            this.$linkEl = null,
            this.setupMode(),
            this.listenTo(this.model, "change:activated", this.applyState),
            this.listenTo(this.model, "change:deferredHeight", this.onChangeDeferredHeight),
            this.listenTo(this.model, "change:showButtons", this.updateElementClass),
            this.listenTo(this.model, "change:deferred", this.render),
            this.listenTo(d, "change:collapsed", this.setupMode)
        },
        getMediaDimensions: function() {
            return {
                width: null,
                height: null
            }
        },
        getAvailableWidth: function() {
            return this.$el.parent().width() || d.get("loadedThumbnailWidth")
        },
        updateDeferredHeight: function() {
            this.model.set("deferredHeight", this.calculateDeferredHeight())
        },
        calculateDeferredHeight: function() {
            var a = this.getMediaDimensions()
              , b = a.width
              , c = a.height;
            if (!b || !c)
                return c;
            var d = this.getAvailableWidth()
              , e = d * c / b;
            return e
        },
        convertToButton: function(a) {
            this.model.set("showButtons", !1),
            this.linkSubview && this.linkSubview.remove(),
            this.linkSubview = new e({
                model: this.model,
                media: this.media,
                $link: a
            }),
            a.replaceWith(this.linkSubview.$el),
            this.linkSubview.render()
        },
        applyContentNodeHeight: function(a) {
            this.contentNode.height(a || "auto")
        },
        shouldAutoplay: function() {
            return !this.model.get("deferred")
        },
        generateContentHtml: function() {
            return this.media.get("html")
        },
        createContentNode: function(b) {
            return a(b)
        },
        insertContentNode: function(a) {
            this.contentNode.html(a)
        },
        prepareElementEvents: function() {},
        displayContent: function() {
            this.updateDeferredHeight();
            var a = this.generateContentHtml()
              , b = this.createContentNode(a);
            this.prepareElementEvents(b),
            this.insertContentNode(b),
            this.applyContentNodeHeight(null)
        },
        configureDeferred: function() {
            this.enterViewport()
        },
        configureContentFromActivated: function() {
            this.model.get("activated") ? this.displayContent() : this.displayPlaceholder()
        },
        displayPlaceholder: function() {
            this.contentNode.html(g({
                model: this.model.toJSON()
            }))
        },
        updateElementClass: function() {
            var a = this.$el
              , b = this.model;
            i(a, b, "deferred", "media-mode-deferred"),
            i(a, b, "activated", "media-activated"),
            i(a, b, "showButtons", "media-show-buttons")
        },
        applyState: function() {
            this.configureDeferred(),
            this.configureContentFromActivated(),
            this.updateElementClass()
        },
        render: function() {
            return this.$el.html(this.template({
                model: this.model.toJSON(),
                media: this.media.toJSON()
            })),
            this.contentNode = this.$el.find("[data-role=content-placeholder]"),
            this.applyState(),
            this
        },
        remove: function() {
            this.linkSubview && this.linkSubview.remove(),
            b.View.prototype.remove.apply(this, arguments)
        },
        enterViewport: function() {
            this.model.get("deferred") && this.activate()
        },
        activate: function() {
            this.model.set("activated", !0)
        },
        setupMode: function() {
            if (this.model.get("respectSettings")) {
                this.model.set("activated", !1);
                var a = d.get("collapsed");
                a ? this.model.set("deferred", !1) : this.model.set("deferred", !0)
            }
        },
        onChangeDeferredHeight: function() {
            this.model.get("deferred") && !this.model.get("activated") && this.applyContentNodeHeight(this.model.get("deferredHeight"))
        },
        handleExpand: h(function() {
            this.model.set("activated", !0)
        }),
        handleContract: h(function() {
            this.model.set("activated", !1)
        }),
        handleForceLoad: h(function() {
            this.model.get("deferred") && this.model.set("activated", !0)
        })
    })
}),
define("core/templates/postMediaImage", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        1: function(a, b, c, d, e) {
            var f;
            return ' height="' + a.escapeExpression(a.lambda(null != (f = null != b ? b.model : b) ? f.deferredHeight : f, b)) + '" '
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f, g = a.lambda, h = a.escapeExpression, i = null != b ? b : {};
            return '<a href="' + h(g(null != b ? b.imageUrl : b, b)) + '" target="_blank" rel="nofollow">\n<img src="' + h(g(null != b ? b.thumbnailUrl : b, b)) + '" alt="' + h(c.gettext.call(i, "Thumbnail", {
                name: "gettext",
                hash: {},
                data: e
            })) + '" ' + (null != (f = c["if"].call(i, null != (f = null != b ? b.model : b) ? f.deferredHeight : f, {
                name: "if",
                hash: {},
                fn: a.program(1, e, 0),
                inverse: a.noop,
                data: e
            })) ? f : "") + ">\n</a>\n"
        },
        useData: !0
    })
}),
define("core/views/ImageRichMediaView", ["core/views/RichMediaView", "core/utils", "core/config", "core/mediaConfig", "core/templates/postMediaImage"], function(a, b, c, d, e) {
    "use strict";
    var f = new RegExp("(^|\\.)" + b.getDomain(c.urls.media).split(".").slice(-2).join("\\.") + "$");
    return a.extend({
        getMediaDimensions: function() {
            return {
                width: this.media.get("thumbnailWidth"),
                height: this.media.get("thumbnailHeight")
            }
        },
        getImageUrl: function() {
            return this.media.get("resolvedUrlRedirect") || this.media.get("urlRedirect") || this.media.get("thumbnailUrl")
        },
        getImageThumbnailUrl: function() {
            var a = this.media.get("thumbnailUrl");
            return this.constructor.isOnDisqusCDN(a) && (a = b.serialize(a, {
                w: d.get("loadedThumbnailWidth"),
                h: this.model.get("deferredHeight")
            })),
            a
        },
        generateContentHtml: function() {
            return e({
                model: this.model.toJSON(),
                media: this.media.toJSON(),
                thumbnailUrl: this.getImageThumbnailUrl(),
                imageUrl: this.getImageUrl()
            })
        },
        prepareElementEvents: function(a) {
            var b = this
              , c = a.find("img");
            c.on("load.richMediaView error.richMediaView", function(a) {
                b.trigger(a.type),
                c.off(".richMediaView")
            })
        },
        calculateDeferredHeight: function() {
            var b = Math.floor(a.prototype.calculateDeferredHeight.apply(this, arguments))
              , c = this.getMediaDimensions().height;
            return Math.min(c, b) || null
        }
    }, {
        isOnDisqusCDN: function(a) {
            var c = b.getDomain(a);
            return f.test(c)
        }
    })
}),
define("core/views/IframeRichMediaView", ["underscore", "core/mediaConfig", "core/views/RichMediaView"], function(a, b, c) {
    "use strict";
    return c.extend({
        getMediaDimensions: function() {
            return {
                width: this.media.get("htmlWidth"),
                height: this.media.get("htmlHeight")
            }
        },
        _findIframe: function(a) {
            return a.is("iframe") ? a : a.find("iframe")
        },
        configureContentFromActivated: function() {
            c.prototype.configureContentFromActivated.apply(this, arguments),
            this.model.get("activated") || this.$el.removeClass("media-loading")
        },
        createContentNode: function() {
            var a = c.prototype.createContentNode.apply(this, arguments);
            return a.attr({
                width: "100%",
                height: this.model.get("deferredHeight")
            }),
            a
        },
        insertContentNode: function(a) {
            this.loaderNode = this.$el.find("[data-role=content-loader]"),
            this.loaderHeight = this.model.get("deferredHeight") || b.get("defaultIframeHeight"),
            this.loaderNode.height(this.loaderHeight),
            this.$el.addClass("media-loading"),
            c.prototype.insertContentNode.call(this, a)
        },
        prepareElementEvents: function(b) {
            var c = this._findIframe(b);
            c.one("load", a.bind(this.finishLoad, this, c))
        },
        finishLoad: function(a) {
            this.$el.removeClass("media-loading"),
            a.height(this.loaderHeight),
            this.trigger("load")
        }
    })
}),
define("core/views/FacebookPhotoRichMediaView", ["core/views/ImageRichMediaView"], function(a) {
    "use strict";
    return a.extend({
        getImageThumbnailUrl: function() {
            return this.media.get("metadata").imageUrl || a.prototype.getImageThumbnailUrl.call(this)
        }
    })
}),
define("core/views/AutoplayRichMediaView", ["underscore", "jquery", "core/utils", "core/views/IframeRichMediaView"], function(a, b, c, d) {
    "use strict";
    return d.extend({
        createContentNode: function() {
            var a = d.prototype.createContentNode.apply(this, arguments)
              , b = a.attr("src");
            return this.shouldAutoplay() && b && !this.model.get("playerjs") && (b = c.serialize(b, {
                auto_play: !0,
                autoplay: 1
            }),
            a.attr("src", b)),
            a
        },
        insertContentNode: function(c) {
            if (this.model.get("playerjs")) {
                var e = this._findIframe(c)
                  , f = e.attr("src");
                "//" === f.substr(0, 2) && (f = window.location.protocol + f);
                var g = f.split("/");
                g = g[0] + "//" + g[2],
                this.playerjs = {
                    ready: !1,
                    queue: [],
                    origin: g,
                    $iframe: e
                },
                this.model.get("mute") && this.send("mute"),
                this.shouldAutoplay() && this.send("play");
                var h = a.once(a.bind(function() {
                    this.playerjs.ready = !0;
                    var b = this.playerjs.queue;
                    this.playerjs.queue = [],
                    a.each(b, this.send, this)
                }, this));
                b(window).on("message", function(a) {
                    if (a = a.originalEvent,
                    a.origin === g) {
                        var b;
                        try {
                            b = JSON.parse(a.data)
                        } catch (c) {
                            return
                        }
                        "ready" === b.event && b.value && b.value.src === f && h()
                    }
                })
            }
            return d.prototype.insertContentNode.apply(this, arguments)
        },
        send: function(a) {
            if (this.playerjs) {
                if (!this.playerjs.ready)
                    return void this.playerjs.queue.push(a);
                var b = {
                    context: "player.js",
                    version: "0.0.10",
                    method: a
                };
                this.playerjs.$iframe[0].contentWindow.postMessage(JSON.stringify(b), this.playerjs.origin)
            }
        }
    })
}),
define("core/views/DynamicHeightRichMediaView", ["underscore", "core/views/RichMediaView"], function(a, b) {
    "use strict";
    return b.extend({
        insertContentNode: function() {
            b.prototype.insertContentNode.apply(this, arguments),
            this.finishLoad()
        },
        finishLoad: function() {
            var b = this
              , c = 0
              , d = 150
              , e = 20
              , f = function() {
                c += 1,
                c < e ? a.delay(f, d) : b.trigger("load")
            };
            f()
        }
    })
}),
define("core/templates/postMediaTwitterContent", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e) {
            var f = a.lambda
              , g = a.escapeExpression;
            return '<meta name="twitter:widgets:csp" content="on">\n<blockquote class="twitter-tweet" data-theme="' + g(f(null != b ? b.theme : b, b)) + '" data-link-color="' + g(f(null != b ? b.linkColor : b, b)) + '" lang="' + g(f(null != b ? b.language : b, b)) + '">\n<a href="' + g(f(null != b ? b.url : b, b)) + '"></a>\n</blockquote>\n<script src="//platform.twitter.com/widgets.js"></script>\n'
        },
        useData: !0
    })
}),
define("core/views/TwitterRichMediaView", ["underscore", "core/views/DynamicHeightRichMediaView", "core/templates/postMediaTwitterContent"], function(a, b, c) {
    "use strict";
    var d = b.extend({
        generateContentHtml: function() {
            var b = window.document.documentElement.lang;
            b = b && b.substring(0, 2);
            var e = this.media.get("url");
            return this.media.get("resolvedUrl").indexOf("/status") !== -1 && (e = this.media.get("resolvedUrl")),
            c({
                url: e,
                theme: a.result(d, "theme"),
                linkColor: a.result(d, "linkColor"),
                language: b
            })
        }
    }, {
        theme: "light",
        linkColor: "#2e9fff"
    });
    return d
}),
define("core/views/SoundCloudRichMediaView", ["core/views/AutoplayRichMediaView"], function(a) {
    "use strict";
    return a.extend({
        getMediaDimensions: function() {
            return {
                width: null,
                height: this.media.get("htmlHeight")
            }
        }
    })
}),
define("core/views/VineRichMediaView", ["core/views/AutoplayRichMediaView", "core/utils"], function(a, b) {
    "use strict";
    return a.extend({
        createContentNode: function() {
            var c = a.prototype.createContentNode.apply(this, arguments)
              , d = c.attr("src");
            return this.shouldAutoplay() && d && (d = b.serialize(d, {
                audio: 1
            }),
            c.attr("src", d)),
            c
        }
    })
}),
define("core/views/IframeGifRichMediaView", ["core/views/IframeRichMediaView"], function(a) {
    "use strict";
    return a.extend({
        insertContentNode: function(b) {
            a.prototype.insertContentNode.call(this, b),
            this.loaderNode.width(this.getMediaDimensions().width)
        },
        createContentNode: function() {
            var b = a.prototype.createContentNode.apply(this, arguments);
            return b.attr(this.getMediaDimensions()),
            b
        },
        calculateDeferredHeight: function() {
            return this.getMediaDimensions().height
        },
        displayPlaceholder: function() {
            a.prototype.displayPlaceholder.call(this);
            var b = this.getMediaDimensions();
            this.contentNode.height(b.height).width(b.width)
        }
    })
}),
define("core/media", ["underscore", "core/strings", "core/models/Media", "core/models/RichMediaViewModel", "core/views/ImageRichMediaView", "core/views/IframeRichMediaView", "core/views/FacebookPhotoRichMediaView", "core/views/AutoplayRichMediaView", "core/views/TwitterRichMediaView", "core/views/SoundCloudRichMediaView", "core/views/VineRichMediaView", "core/views/IframeGifRichMediaView"], function(a, b, c, d, e, f, g, h, i, j, k, l) {
    "use strict";
    var m = b.get
      , n = {
        PLAY_HIDE: {
            kind: "html",
            providerExpandMessage: m("Play"),
            providerCollapseMessage: m("Hide")
        },
        VIEW_HIDE: {
            kind: "html",
            providerExpandMessage: m("View"),
            providerCollapseMessage: m("Hide")
        },
        VIEW_IMAGE: {
            kind: "image",
            providerIcon: "icon-images",
            providerExpandMessage: m("View"),
            providerCollapseMessage: m("Hide")
        }
    }
      , o = function(b) {
        var m = function(b, c) {
            return a.defaults({
                providerIcon: c
            }, n[b])
        }
          , o = null
          , p = null
          , q = c.MEDIA_TYPES;
        switch (b.get("mediaType")) {
        case q.IMAGE:
        case q.IMAGE_UPLOAD:
            o = n.VIEW_IMAGE;
            break;
        case q.FACEBOOK_PHOTO:
            p = g,
            o = n.VIEW_IMAGE;
            break;
        case q.GIF_VIDEO:
            p = l,
            o = n.VIEW_HIDE;
            break;
        case q.VIMEO_VIDEO:
        case q.YOUTUBE_VIDEO:
            p = h,
            o = m("PLAY_HIDE", "icon-video");
            break;
        case q.TWITTER_STATUS:
            p = i,
            o = m("VIEW_HIDE", "icon-twitter");
            break;
        case q.VINE_VIDEO:
            p = k,
            o = m("PLAY_HIDE", "icon-video");
            break;
        case q.FACEBOOK_VIDEO:
            o = m("VIEW_HIDE", "icon-video");
            break;
        case q.SOUNDCLOUD_SOUND:
            p = j,
            o = m("PLAY_HIDE", "icon-music");
            break;
        case q.GOOGLE_MAP:
            o = m("VIEW_HIDE", "icon-map");
            break;
        default:
            return null
        }
        if (null === p)
            switch (o.kind) {
            case "webpage":
                return null;
            case "html":
                p = f;
                break;
            case "image":
                p = e
            }
        var r = new d(o);
        return {
            Cls: p,
            mediaViewModel: r
        }
    }
      , p = function(a) {
        var b = o(a);
        return b ? new b.Cls({
            model: b.mediaViewModel,
            media: a
        }) : null
    }
      , q = function(a) {
        return new e({
            model: new d(n.VIEW_IMAGE),
            media: a
        })
    };
    return {
        instantiateRichMediaView: p,
        instantiateRichMediaThumbnail: q,
        getRichMediaViewConfig: o
    }
}),
define("core/mixins/withRichMedia", ["underscore", "jquery", "core/collections/MediaCollection", "core/media"], function(a, b, c, d) {
    "use strict";
    function e(a) {
        var c = {};
        return a.length ? (a.find("a").each(function(a, d) {
            var e = d.href;
            c[e] || (c[e] = b(d))
        }),
        c) : c
    }
    function f() {
        a.extend(this, g)
    }
    var g = {
        renderRichMedia: function(a, f, g) {
            return g = g || {},
            a = a instanceof c ? a : new c(a),
            a.chain().map(function(a) {
                return d.instantiateRichMediaView(a)
            }).without(null).map(function(a) {
                var c = a.media.get("urlRedirect");
                g.normalize && (c = g.normalize.call(this, c));
                var d = e(this.$("[data-role=message]"))
                  , h = d[c];
                return g.beforeRender && g.beforeRender.call(this, a),
                a.render(),
                h ? g.convertLinkToButton ? (h.after(a.$el),
                a.convertToButton(h)) : h.replaceWith(a.$el) : (f = f || this.$("[data-role=post-media-list]"),
                f.append(b("<li>").append(a.$el))),
                a
            }, this).value()
        }
    };
    return f
}),
define("core/views/common/HoverCard", ["jquery", "underscore", "backbone", "core/bus", "core/utils"], function(a, b, c, d, e) {
    "use strict";
    var f = c.View.extend({
        events: {
            mouseenter: "enter",
            mouseleave: "leave"
        },
        initialize: function() {
            this._id = b.uniqueId(),
            this._rendered = !1,
            this._hoverState = "out",
            this._visible = !1,
            this._enterTimeout = null,
            this._leaveTimeout = null,
            f.open = {},
            this.events = this.events || {},
            this.events["click [data-action=profile]"] = "handleShowProfile",
            this.listenTo(this, "authenticating", this.keepOpen)
        },
        render: function() {
            return this.hide(),
            a("body").append(this.el),
            this
        },
        target: function(a) {
            a.on("mouseenter", b.bind(this.enter, this, a)),
            a.on("mouseleave", b.bind(this.leave, this))
        },
        enter: function(a) {
            var c = this;
            a.originalEvent && (a = null),
            a && (c.$target = a),
            c._leaveTimeout && clearTimeout(c._leaveTimeout),
            "in" !== c._hoverState && (c._hoverState = "in",
            c._enterTimeout = b.delay(function() {
                "in" === c._hoverState && c.show(),
                c._enterTimeout = null
            }, f.DELAY_ENTER),
            f.open[this.uid] = this)
        },
        leave: function() {
            var a = this;
            a._enterTimeout && clearTimeout(a._enterTimeout),
            "out" !== a._hoverState && (a._hoverState = "out",
            a._leaveTimeout = b.delay(function() {
                "out" === a._hoverState && a.hide(),
                a._leaveTimeout = null
            }, f.DELAY_LEAVE),
            f.open[this.uid] && delete f.open[this.uid])
        },
        show: function() {
            var a = this;
            a._rendered || (a._rendered = !0,
            a.render()),
            a.moveTo(a.$target),
            a.$el.show(),
            a._visible = !0,
            a.trigger("show")
        },
        moveTo: function(a) {
            if (a) {
                var b = f.POSITION_OFFSET
                  , c = a.offset()
                  , d = this.$el
                  , e = d.height()
                  , g = this.getContainerPosition();
                c.top -= b;
                var h = c.top + e + g.containerOffset.top
                  , i = g.pageOffset + g.containerHeight;
                h <= i ? d.css("top", c.top) : d.css("top", c.top - e + 2 * b),
                d.css("left", c.left + b)
            }
        },
        getContainerPosition: function() {
            return {
                pageOffset: a(window).scrollTop(),
                containerOffset: {
                    top: 0,
                    height: a(window).height()
                },
                containerHeight: a(window).height()
            }
        },
        hide: function() {
            this._keepOpen || (this._enterTimeout && clearTimeout(this._enterTimeout),
            this.$el.hide(),
            this._visible = !1)
        },
        keepOpen: function() {
            this._keepOpen = !0,
            this.setupKeepOpenCanceler()
        },
        setupKeepOpenCanceler: function() {
            var c = this
              , e = function() {
                "out" === c._hoverState && (c.stopListening(d, "window.click", e),
                a("body").off("click", e),
                c._keepOpen = !1,
                c.hide())
            };
            b.delay(function() {
                c.listenTo(d, "window.click", e),
                a("body").on("click", e)
            }, 100)
        },
        isVisible: function() {
            return this._visible
        },
        handleShowProfile: e.preventDefaultHandler(function() {
            this.hide()
        })
    }, {
        open: {},
        instances: {},
        DELAY_ENTER: 350,
        DELAY_LEAVE: 175,
        POSITION_OFFSET: 20,
        exitAll: function() {
            b.invoke(f.open, "leave")
        },
        create: function(a, b, c, d) {
            var e = f.instances[c];
            e || (f.instances[c] = e = {});
            var g = e[a];
            return g || (g = new d(b),
            e[a] = g),
            b.targetElement && g.target(b.targetElement),
            g
        }
    });
    return function() {
        a(window.document).on("mouseout", b.debounce(function(a) {
            var b = a.relatedTarget || a.toElement;
            b && "HTML" !== b.nodeName || f.exitAll()
        }, 10))
    }(),
    f
}),
define("core/utils/views", ["underscore"], function(a) {
    "use strict";
    var b = function(b, c, d) {
        var e = b.prototype
          , f = a.extend({}, c, d);
        if (a.defaults(e, f),
        a.defaults(e.events, f.events),
        void 0 !== e.initialize && void 0 !== f.initialize) {
            var g = e.initialize;
            e.initialize = function() {
                var a = g.apply(this, arguments);
                return f.initialize.apply(this, arguments),
                a
            }
        }
    };
    return {
        mixin: b
    }
}),
define("core/views/common/mixins/LocalScroll", [], function() {
    "use strict";
    var a = {
        events: {
            mousewheel: "handleScrollEvent",
            wheel: "handleScrollEvent"
        },
        scrollMeasureSelector: "",
        getScrollMeasure: function() {
            return this.scrollMeasure || (this.scrollMeasure = this.$el,
            this.scrollMeasureSelector && (this.scrollMeasure = this.$el.find(this.scrollMeasureSelector))),
            this.scrollMeasure
        },
        handleScrollEvent: function(a) {
            var b = a.originalEvent
              , c = b.wheelDeltaY || -b.deltaY
              , d = this.$el
              , e = d.height()
              , f = this.getScrollMeasure()
              , g = f.height()
              , h = f.parent()[0].scrollTop
              , i = h >= g - e
              , j = 0 === h;
            (i && c < 0 || j && c > 0) && a.preventDefault()
        }
    };
    return a
}),
define("core/templates/usersCard", ["handlebars", "core/templates/handlebars.partials", "core/extensions/handlebars.helpers"], function(a) {
    return a.template({
        1: function(a, b, c, d, e) {
            return "guests-only"
        },
        3: function(a, b, c, d, e, f, g) {
            var h;
            return null != (h = c.each.call(null != b ? b : {}, null != b ? b.users : b, {
                name: "each",
                hash: {},
                fn: a.program(4, e, 0, f, g),
                inverse: a.noop,
                data: e
            })) ? h : ""
        },
        4: function(a, b, c, d, e, f, g) {
            var h;
            return null != (h = a.invokePartial(d.cardUser, b, {
                name: "cardUser",
                hash: {
                    forumId: null != g[1] ? g[1].forumId : g[1],
                    highlight: null != g[1] ? g[1].highlight : g[1]
                },
                data: e,
                helpers: c,
                partials: d,
                decorators: a.decorators
            })) ? h : ""
        },
        compiler: [7, ">= 4.0.0"],
        main: function(a, b, c, d, e, f, g) {
            var h, i = null != b ? b : {};
            return '<div class="tooltip upvoters ' + (null != (h = c.unless.call(i, null != (h = null != b ? b.users : b) ? h.length : h, {
                name: "unless",
                hash: {},
                fn: a.program(1, e, 0, f, g),
                inverse: a.noop,
                data: e
            })) ? h : "") + '">\n<ul class="scroll-measure" data-role="content">\n' + (null != (h = c["if"].call(i, null != (h = null != b ? b.users : b) ? h.length : h, {
                name: "if",
                hash: {},
                fn: a.program(3, e, 0, f, g),
                inverse: a.noop,
                data: e
            })) ? h : "") + '</ul>\n</div>\n<div class="tooltip-point hidden"></div>\n'
        },
        usePartial: !0,
        useData: !0,
        useDepths: !0
    })
}),
define("core/views/UsersCard", ["jquery", "underscore", "handlebars", "core/config", "core/bus", "core/utils/views", "core/views/common/HoverCard", "core/views/common/mixins/LocalScroll", "core/templates/usersCard"], function(a, b, c, d, e, f, g, h, i) {
    "use strict";
    var j = function(a) {
        return a.get("isAnonymous") || a.get("isBlocked")
    }
      , k = g.extend({
        guestTextPartialName: "cardOtherUserText",
        className: "tooltip-outer upvoters-outer",
        initialize: function(a) {
            g.prototype.initialize.call(this, a),
            this.collection = this.collection || a.collection,
            this.session = a.session,
            this.numUsers = a.numUsers,
            this.listenTo(this.collection, "add", this.addUser),
            this.listenTo(this.collection, "change:isBlocked", this.render),
            this.listenTo(this.collection, "remove", this.removeUser),
            this.listenTo(this.collection, "reset", this.render)
        },
        addUser: function(a) {
            j(a) ? this.updateGuests() : this.$listEl && this.$listEl.length && (this.$listEl.prepend(c.partials.cardUser(this.getUserTemplateData(a))),
            this.stopHighlightUsername())
        },
        removeUser: function(a) {
            if (j(a))
                this.updateGuests();
            else {
                var b = this.$el.find("[data-username=" + a.get("username") + "]");
                b.length && b.remove()
            }
        },
        stopHighlightUsername: b.debounce(function() {
            var a = this.$el.find(".highlight");
            a.removeClass("highlight")
        }, 1100),
        getGuestCount: function() {
            return Math.max(this.numUsers - this.collection.reject(j).length, 0)
        },
        updateGuests: function() {
            var a = this.$el.find("[data-role=guest]")
              , b = this.getGuestCount()
              , e = c.partials[this.guestTextPartialName]({
                guestCount: b
            })
              , f = {
                guestCount: b,
                guestAvatarUrl: d.urls.avatar.generic,
                highlight: a.length,
                guestText: e
            }
              , g = c.partials.cardGuestUser(f);
            a.length ? (a.replaceWith(g),
            this.stopHighlightUsername()) : this.$listEl && this.$listEl.length && this.$listEl.append(g)
        },
        getTemplateData: function() {
            return {
                users: b.invoke(this.collection.reject(j), "toJSON"),
                highlight: !1
            }
        },
        getUserTemplateData: function(a) {
            return b.extend({
                highlight: !0
            }, a.toJSON())
        },
        render: function() {
            delete this.pointEl,
            this.$el.html(i(this.getTemplateData())),
            g.prototype.render.call(this),
            this.$listEl = this.$el.find(".upvoters ul"),
            this.updateGuests()
        },
        show: function() {
            this.numUsers && !this.isVisible() && (g.prototype.show.call(this),
            e.trigger("uiAction:userCardShow"))
        },
        showPoint: function(a) {
            var c = ["tl", "bl"];
            this.pointEl || (this.pointEl = this.$el.find(".tooltip-point"),
            this.pointEl.removeClass("hidden")),
            b.each(c, function(a) {
                this.pointEl.removeClass("point-position-" + a)
            }, this),
            this.pointEl.addClass("point-position-" + a)
        },
        moveTo: function(a, b) {
            if (a) {
                var c = g.POSITION_OFFSET
                  , d = a.offset()
                  , e = this.$el
                  , f = e.height()
                  , h = this.getContainerPosition();
                b && (f += e.find("li.user").height() + 10),
                d.top - f - c >= 0 && d.top - f + h.containerOffset.top >= h.pageOffset ? (e.css({
                    bottom: h.containerOffset.height - d.top + c,
                    top: "inherit"
                }),
                this.showPoint("bl")) : (e.css({
                    bottom: "inherit",
                    top: d.top + 2 * c
                }),
                this.showPoint("tl")),
                e.css("left", d.left - c)
            }
        },
        handleShowProfile: function(b) {
            g.prototype.handleShowProfile.call(this, b);
            var c = a(b.currentTarget)
              , d = c.attr("data-username");
            e.trigger("uiCallback:showProfile", d)
        }
    }, {
        create: function(a, b) {
            return g.create(a, b, "UsersCard", k)
        }
    });
    return f.mixin(k, h, {
        scrollMeasureSelector: "[data-role=content]"
    }),
    k
}),
define("core/views/UpvotersCard", ["underscore", "core/views/common/HoverCard", "core/views/UsersCard", "core/bus", "core/utils"], function(a, b, c, d, e) {
    "use strict";
    var f = e.preventDefaultHandler
      , g = c.extend({
        guestTextPartialName: "cardGuestUpvoterText",
        initialize: function(b) {
            var d = b.model
              , e = d.getUpvotersUserCollection();
            a.extend(b, {
                collection: e,
                numUsers: d.get("likes")
            }),
            c.prototype.initialize.call(this, b),
            this.model = d,
            this.session = b.session,
            this.likes = d.get("likes"),
            this.hadLikes = Boolean(this.likes),
            this._fetched = !1,
            this._rendered = !1,
            this.listenTo(this.model, "change:userScore", this.updateUserSet),
            this.listenTo(this.model, "change:likes", this.updateGuests)
        },
        updateGuests: function() {
            this.numUsers = this.model.get("likes") || 0,
            c.prototype.updateGuests.call(this)
        },
        updateUserSet: function() {
            var a = this.session.user
              , b = this.likes
              , c = !1;
            this.likes = this.model.get("likes"),
            this.model.get("userScore") > 0 ? (this.session.isLoggedIn() && this.collection.add(a),
            this.likes && !b ? (this._rendered = !1,
            this.show()) : c = !!this.session.isLoggedOut() || Boolean(this.likes - 1 - this.collection.length)) : (this.collection.remove(a),
            this.likes || this.hide()),
            this.updateGuests(),
            this.moveTo(this.$target, c)
        },
        show: function() {
            if (this.likes && !this.isVisible()) {
                if (this.hadLikes || (this._fetched = !0),
                !this._fetched)
                    return void this.collection.fetch().done(a.bind(function() {
                        this._fetched = !0,
                        this.show()
                    }, this));
                var b = this.session.user;
                this.model.get("userScore") > 0 && this.session.isLoggedIn() && !this.collection.contains(b) && this.collection.add(b),
                c.prototype.show.call(this),
                d.trigger("uiAction:upvotersCardShow")
            }
        },
        handleShowProfile: f(function(a) {
            c.prototype.handleShowProfile.call(this, a),
            d.trigger("uiAction:showProfileFromUpvotes")
        }),
        getTemplateData: function() {
            var b = c.prototype.getTemplateData.apply(this, arguments);
            return a.extend({}, b, {
                forumId: this.model.get("forum")
            })
        },
        getUserTemplateData: function() {
            var b = c.prototype.getUserTemplateData.apply(this, arguments);
            return a.extend({}, b, {
                forumId: this.model.get("forum")
            })
        }
    }, {
        create: function(a) {
            var c = a.model;
            if (c.has("id"))
                return b.create(c.get("id"), a, "UpvotersCard", g)
        }
    });
    return g
}),
define("templates/lounge/contextCard", ["react", "core/strings", "core/utils/object/get", "templates/lounge/partials/profileLink"], function(a, b, c, d) {
    "use strict";
    var e = b.gettext
      , f = function(b) {
        return a.createElement("img", {
            src: c(b.post, ["author", "avatar", "cache"], ""),
            className: "user",
            alt: e("Avatar")
        })
    }
      , g = function(b) {
        return a.createElement("div", {
            className: "tooltip"
        }, a.createElement("div", {
            className: "notch"
        }), c(b.post, ["author", "isAnonymous"]) ? a.createElement("div", {
            className: "avatar"
        }, a.createElement(f, {
            post: b.post
        })) : a.createElement(d, {
            className: "avatar",
            user: c(b.post, ["author"]),
            forumId: b.post.forum
        }, a.createElement(f, {
            post: b.post
        })), a.createElement("div", {
            className: "tooltip__content"
        }, a.createElement("h3", null, c(b.post, ["author", "isAnonymous"]) ? a.createElement("h3", null, c(b.post, ["author", "name"], null)) : a.createElement(d, {
            user: c(b.post, ["author"]),
            forumId: b.post.forum
        }, a.createElement("h3", null, c(b.post, ["author", "name"], null)))), a.createElement("p", null, c(b.post, ["excerpt"], null))))
    };
    return g
}),
define("templates/lounge/partials/followButtonSmall", ["react", "core/config/urls", "core/strings", "core/utils/object/get"], function(a, b, c, d) {
    "use strict";
    var e = c.gettext
      , f = function(c) {
        return d(c.user, ["isSession"]) ? d(c.user, ["isEditable"]) ? a.createElement("a", {
            href: b.editProfile || "",
            target: "_blank",
            className: c.buttonAsLink ? "publisher-anchor-color follow-link" : "btn btn-small"
        }, e("Edit profile")) : null : d(c.user, ["isPrivate"]) ? a.createElement("span", {
            className: "btn btn-small follow-btn private"
        }, a.createElement("i", {
            "aria-hidden": "true",
            className: "icon-lock"
        }), " ", a.createElement("span", {
            className: "btn-text"
        }, e("Private"))) : a.createElement("a", {
            href: d(c.user, ["profileUrl"], ""),
            className: "" + (c.buttonAsLink ? "publisher-anchor-color follow-link" : "btn btn-small follow-btn") + (d(c.user, ["isFollowing"]) ? " following" : ""),
            "data-action": "toggleFollow",
            "data-user": d(c.user, ["id"], ""),
            target: "_blank",
            rel: "noopener noreferrer"
        }, a.createElement("span", {
            className: "btn-text following-text"
        }, e("Following")), a.createElement("span", {
            className: "btn-text follow-text"
        }, e("Follow")), a.createElement("i", {
            "aria-hidden": "true",
            className: "icon-checkmark"
        }))
    };
    return f
}),
define("templates/lounge/partials/hovercardActions", ["react", "core/strings", "templates/lounge/partials/followButtonSmall", "templates/lounge/partials/profileLink"], function(a, b, c, d) {
    "use strict";
    var e = b.gettext
      , f = function(b) {
        return a.createElement("div", null, a.createElement(d, {
            user: b.user,
            forumId: null,
            className: "full-profile"
        }, e("Full profile")), b.showFollowButton ? a.createElement(c, {
            user: b.user,
            buttonAsLink: b.buttonAsLink
        }) : null, " ")
    };
    return f
}),
define("templates/lounge/partials/hovercardCounters", ["react", "core/strings", "core/utils/object/get"], function(a, b, c) {
    "use strict";
    var d = b.gettext
      , e = function(b) {
        return a.createElement("div", null, 1 === c(b.user, ["numPosts"]) ? d("1 comment") : d("%(numPosts)s comments", {
            numPosts: c(b.user, ["numPosts"], "")
        }), " ", a.createElement("span", {
            className: "bullet"
        }, "•"), " ", 1 === c(b.user, ["numLikesReceived"]) ? d("1 vote") : d("%(numLikesReceived)s votes", {
            numLikesReceived: c(b.user, ["numLikesReceived"], "")
        }))
    };
    return e
}),
define("templates/lounge/hovercard", ["react", "core/strings", "core/utils/object/get", "templates/lounge/partials/hovercardActions", "templates/lounge/partials/hovercardCounters", "templates/lounge/partials/profileLink"], function(a, b, c, d, e, f) {
    "use strict";
    var g = b.gettext
      , h = function(b, c) {
        return b.length <= c ? b : a.createElement("span", null, b.slice(0, c), "…")
    }
      , i = function(b) {
        return a.createElement("div", {
            className: "tooltip"
        }, a.createElement("div", {
            className: "notch"
        }), a.createElement(f, {
            user: b.user,
            forumId: null,
            className: "avatar"
        }, a.createElement("img", {
            "data-user": c(b.user, ["id"], ""),
            "data-role": "user-avatar",
            src: c(b.user, ["avatar", "cache"], ""),
            className: "user",
            alt: g("Avatar")
        })), a.createElement("div", {
            className: "tooltip__content"
        }, a.createElement("h3", null, a.createElement(f, {
            user: b.user,
            forumId: null,
            "data-role": "username"
        }, c(b.user, ["name"], null)), " ", c(b.user, ["thread", "canModerate"]) ? a.createElement("span", {
            className: "badge moderator"
        }, g("MOD")) : null), c(b.user, ["about"]) ? a.createElement("p", {
            className: "bio"
        }, h(c(b.user, ["about"], ""), 80)) : null, a.createElement("p", {
            className: "stats",
            "data-role": "counters"
        }, null !== c(b.user, ["numPosts"], null) && null !== c(b.user, ["numLikesReceived"], null) ? a.createElement(e, {
            user: b.user
        }) : null)), a.createElement("footer", {
            className: "tooltip__footer",
            "data-role": "actions"
        }, a.createElement(d, {
            user: b.user,
            buttonAsLink: b.buttonAsLink,
            showFollowButton: b.showFollowButton
        })))
    };
    return i
}),
define("templates/lounge/upgradeCard", ["react", "core/strings", "core/utils/object/get"], function(a, b, c) {
    "use strict";
    var d = b.gettext
      , e = function(b) {
        return a.createElement("div", {
            className: "tooltip"
        }, a.createElement("div", {
            className: "notch"
        }), a.createElement("div", null, a.createElement("p", {
            className: "text-normal"
        }, d("Disqus Pro gives you access to exclusive features like auto-moderation, shadow banning, and customization options.")), a.createElement("a", {
            href: ["https://disquscom.b0.upaiyun.com/admin/", b.organization ? "orgs/" + c(b.organization, ["id"]) + "/" + c(b.organization, ["slug"], "sites") + "/" : "", "settings/subscription/"].join(""),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "btn btn-small",
            "data-role": "upgrade-link"
        }, d("Subscriptions and Billing"))))
    };
    return e
}),
define("lounge/views/cards", ["jquery", "underscore", "lounge/common", "core/utils", "common/models", "common/views/mixins", "core/views/common/HoverCard", "core/views/UpvotersCard", "templates/lounge/contextCard", "templates/lounge/hovercard", "templates/lounge/upgradeCard", "templates/lounge/partials/hovercardActions", "templates/lounge/partials/hovercardCounters"], function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    "use strict";
    g.prototype.getContainerPosition = function() {
        var a = c.getLounge().getPosition();
        return {
            pageOffset: a.pageOffset,
            containerOffset: a.frameOffset,
            containerHeight: a.height
        }
    }
    ,
    function() {
        a(window.document).on("mouseout", b.debounce(function(a) {
            var b = a.relatedTarget || a.toElement;
            b && "HTML" !== b.nodeName || g.exitAll()
        }, 10))
    }();
    var n = g.extend({
        className: "tooltip-outer profile-card",
        events: b.defaults({
            "click [data-action=toggleFollow]": "toggleFollow"
        }, g.prototype.events),
        initialize: function(a) {
            var b = this;
            g.prototype.initialize.call(b, a),
            b.session = a.session,
            b.user = a.user,
            b._fetched = !1,
            b.listenTo(b.session, "change:id", function() {
                this._rendered && this.render()
            })
        },
        onFetch: function(a) {
            this.user = new e.SyncedUser(a.attributes),
            this.updateCounters(),
            this.updateActions(),
            this.listenTo(this.user, {
                "change:numPosts change:numLikesReceived": b.debounce(function() {
                    this.updateCounters()
                }),
                "change:isFollowing": this.updateActions
            })
        },
        serialize: function() {
            var a = this.user.toJSON({
                session: this.session
            });
            return a.numLikesReceived = a.numLikesReceived || this.user.get("numVotes") || 0,
            {
                user: a,
                showFollowButton: this.user.has("isFollowing") || this.session.isLoggedOut()
            }
        },
        render: function() {
            this.$el.html(j(this.serialize())),
            g.prototype.render.call(this)
        },
        updateCounters: function() {
            this.$el.find("[data-role=counters]").html(m(this.serialize()))
        },
        updateActions: function() {
            this.$el.find("[data-role=actions]").html(l(this.serialize()))
        },
        show: function() {
            this._fetched || (this._fetched = !0,
            this.user.fetch({
                success: b.bind(this.onFetch, this)
            })),
            g.prototype.show.call(this)
        }
    }, {
        create: function(a) {
            var b = a.user;
            return g.create(b.id, a, "ProfileCard", n)
        }
    });
    b.extend(n.prototype, f.FollowButtonMixin);
    var o = g.extend({
        className: "context-card tooltip-outer",
        initialize: function(a) {
            var b = this;
            g.prototype.initialize.call(b, a),
            b.post = a.post
        },
        render: function() {
            var a = this.post
              , b = a.toJSON();
            b.excerpt = d.niceTruncate(b.plaintext, 40),
            this.$el.html(i({
                post: b
            })),
            g.prototype.render.call(this)
        }
    }, {
        create: function(a) {
            var b = a.post;
            return g.create(b.id, a, "ContextCard", o)
        }
    })
      , p = g.extend({
        className: "tooltip-outer upgrade-card",
        events: b.defaults({
            "click [data-role=upgrade-link]": "onClickUpgrade"
        }, g.prototype.events),
        initialize: function(a) {
            g.prototype.initialize.call(this, a),
            this.organization = a.organization
        },
        render: function() {
            this.$el.html(k({
                organization: this.organization
            })),
            g.prototype.render.call(this)
        },
        onClickUpgrade: function(a) {
            this.trigger("click:upgrade", a)
        }
    }, {
        create: function(a) {
            var b = a.organization;
            return g.create(b ? b.id : "upgrade", a, "UpgradeCard", p)
        }
    });
    return {
        HoverCard: g,
        ProfileCard: n,
        ContextCard: o,
        UpvotersCard: h,
        UpgradeCard: p
    }
}),
define("core/views/SourcelessIframeRichMediaView", ["jquery", "core/mediaConfig", "core/views/RichMediaView"], function(a, b, c) {
    "use strict";
    return c.extend({
        createContentNode: function(b) {
            return a("<iframe>").attr({
                frameBorder: 0,
                scrolling: "no",
                width: "100%",
                height: this.model.get("deferredHeight"),
                "data-src": b,
                src: 'javascript:window.frameElement.getAttribute("data-src");'
            })
        },
        insertContentNode: function(a) {
            c.prototype.insertContentNode.apply(this, arguments);
            var d = this.model.get("deferredHeight") || b.get("defaultIframeHeight");
            a.height(d)
        }
    })
}),
define("lounge/views/media", ["underscore", "stance", "core/utils", "core/utils/storage", "core/utils/html/toHexColorString", "core/media", "core/mediaConfig", "core/models/RichMediaViewModel", "core/views/RichMediaLinkView", "core/views/RichMediaView", "core/views/IframeRichMediaView", "core/views/SoundCloudRichMediaView", "core/views/AutoplayRichMediaView", "core/views/SourcelessIframeRichMediaView", "core/views/DynamicHeightRichMediaView", "core/views/TwitterRichMediaView", "core/views/ImageRichMediaView", "core/views/FacebookPhotoRichMediaView", "core/views/VineRichMediaView", "lounge/common"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
    "use strict";
    function u() {
        var b = d.get("disqus.collapse-media");
        return a.isBoolean(b) || (b = c.isMobileUserAgent()),
        b
    }
    return a.extend(j.prototype, {
        topEdgeOffset: function() {
            return -t.getLounge().getPosition().height
        },
        configureDeferred: function() {
            this.model.get("deferred") && !this.model.get("activated") && this.listenToOnce(b(this), "enter", function() {
                this.relatedPost && this.listenToOnce(this, "load error", function() {
                    t.getLounge().postsView.onDeferredViewReady(this.relatedPost)
                }),
                this.enterViewport()
            }),
            this.listenToOnce(t.getLounge().postsView, "render:end", this.updateDeferredHeight)
        }
    }),
    p.theme = function() {
        return t.getLounge().config.colorScheme
    }
    ,
    p.linkColor = function() {
        return e(t.getLounge().config.anchorColor)
    }
    ,
    g.set({
        collapsed: u()
    }),
    g.on("change:collapsed", function(a, b) {
        d.set("disqus.collapse-media", b)
    }),
    {
        settings: g,
        getCollapseDefault: u,
        getDomain: c.getDomain,
        RichMediaLinkView: i,
        RichMediaViewModel: h,
        RichMediaView: j,
        IframeRichMediaView: k,
        SoundCloudRichMediaView: l,
        AutoplayRichMediaView: m,
        SourcelessIframeRichMediaView: n,
        DynamicHeightRichMediaView: o,
        TwitterRichMediaView: p,
        ImageRichMediaView: q,
        FacebookPhotoRichMediaView: r,
        VineRichMediaView: s,
        instantiateRichMediaView: f.instantiateRichMediaView,
        getRichMediaViewConfig: f.getRichMediaViewConfig
    }
}),
define("core/constants/moderationUserLists", ["exports", "moment"], function(a, b) {
    "use strict";
    a.LIST_TYPES = {
        WHITELIST: "whitelist",
        BLACKLIST: "blacklist"
    },
    a.BAN_TYPES = {
        SHADOW: "shadowban",
        PERMANENT: "permanent",
        TEMP: "temp"
    },
    a.DEFAULT_FORM_VALUES = {
        durationHours: "24",
        customDurationAmount: "1",
        customDurationScale: "1"
    },
    a.STORAGE_KEY_BAN_TYPE = "defaultBan",
    a.getDateExpires = function(a) {
        return "custom" === a.durationHours && (a.durationHours = parseInt(a.customDurationAmount, 10) * parseInt(a.customDurationScale, 10)),
        b().add(a.durationHours, "hours").toISOString()
    }
    ,
    a.isBanTypeSupported = function(b, c) {
        return !!c && (b === a.BAN_TYPES.SHADOW ? c.shadowBanning : b === a.BAN_TYPES.TEMP ? c.temporaryBanning : Boolean(b))
    }
}),
define("core/templates/react/ModerationUserListsTemplate", ["react", "underscore", "core/strings", "core/constants/moderationUserLists"], function(a, b, c, d) {
    "use strict";
    var e = c.gettext
      , f = d.LIST_TYPES
      , g = d.BAN_TYPES
      , h = [{
        label: e("1 day"),
        durationHours: "24"
    }, {
        label: e("1 week"),
        durationHours: 168..toString()
    }, {
        label: e("2 weeks"),
        durationHours: 336..toString()
    }]
      , i = function(c) {
        var d = c.user
          , i = c.listName
          , j = c.ipAddress
          , k = c.formValues
          , l = c.supportsShadowBanning
          , m = c.supportsTempBanning
          , n = c.selectRetroactiveAction
          , o = c.toggleBanTypeCallback
          , p = c.toggleUserValueChecked
          , q = c.toggleIpAddressChecked
          , r = c.updateDuration
          , s = c.updateCustomDurationAmount
          , t = c.updateCustomDurationScale
          , u = c.updateReason
          , v = c.handleSubmit
          , w = c.handleCancel
          , x = c.UpgradeIcon;
        return d && i ? a.createElement("form", {
            className: i + "-form"
        }, a.createElement("div", {
            className: "embed-only ban__title"
        }, "Ban User"), a.createElement("div", {
            className: "admin-modal__content padding-bottom"
        }, a.createElement("div", null, i === f.WHITELIST ? a.createElement("p", {
            className: "spacing-default"
        }, e("Adding this person to the whitelist will automatically approve his or her new comments from now on.")) : a.createElement("div", {
            className: "align align--stretch align--wrap"
        }, a.createElement("label", {
            className: ["padding-default", "align", "align__item--grow", "align__item--equal", "align--center", "align--column", "ban__option", m ? null : "-disabled", k.type === g.TEMP ? "-selected" : null].join(" ")
        }, a.createElement("input", {
            type: "radio",
            name: "ban_type",
            value: g.TEMP,
            checked: k.type === g.TEMP,
            onChange: o,
            disabled: !m
        }), a.createElement("p", {
            className: "text-semibold text-center ban__option-text"
        }, e("Timeout"), a.createElement(x, {
            tooltipClass: "tooltip-timeout"
        }))), i === f.BLACKLIST && k.type === g.TEMP ? a.createElement("div", {
            className: "padding-default ban__description border-bottom-dark"
        }, a.createElement("p", {
            className: "text-small ban__option-subtext"
        }, a.createElement("p", null, e("Restrict a user's ability to comment for a period of time. This notifies the user of their timeout. If discussions get heated, enforce timeouts so that users cool off and improve their behavior.")), h.map(function(b) {
            return a.createElement("label", {
                className: "fieldset__block--checkbox text-medium spacing-bottom-small text-semibold text-gray-dark",
                key: b.durationHours
            }, a.createElement("input", {
                type: "radio",
                name: "duration",
                checked: k.durationHours === b.durationHours,
                onChange: r,
                value: b.durationHours,
                className: "spacing-right-small"
            }), b.label)
        }), a.createElement("section", null, a.createElement("label", {
            className: "text-medium spacing-bottom-small inline__item spacing-right text-semibold text-gray-dark"
        }, a.createElement("input", {
            type: "radio",
            name: "duration",
            checked: "custom" === k.durationHours,
            onChange: r,
            value: "custom",
            className: "spacing-right-small"
        }), e("Custom")), a.createElement("input", {
            name: "customDurationAmount",
            type: "number",
            value: k.customDurationAmount,
            onChange: s,
            onFocus: s,
            onKeyPress: s,
            className: "spacing-right-small -text-small",
            maxLength: "2",
            style: {
                width: "50px"
            }
        }), a.createElement("select", {
            value: k.customDurationScale,
            onChange: t
        }, a.createElement("option", {
            value: "1",
            selected: "1" === k.customDurationScale
        }, "Hour(s)"), a.createElement("option", {
            value: "24",
            selected: "24" === k.customDurationScale
        }, "Day(s)"), a.createElement("option", {
            value: 168..toString(),
            selected: k.customDurationScale === 168..toString()
        }, "Week(s)"))))) : null, a.createElement("label", {
            className: ["padding-default", "align", "align__item--grow", "align__item--equal", "align--center", "align--column", "ban__option", l ? null : "-disabled", k.type === g.SHADOW ? "-selected" : null].join(" ")
        }, a.createElement("input", {
            type: "radio",
            name: "ban_type",
            value: g.SHADOW,
            checked: k.type === g.SHADOW,
            onChange: o,
            disabled: !l
        }), a.createElement("p", {
            className: "text-semibold text-center ban__option-text"
        }, e("Shadow Ban"), a.createElement(x, null))), i === f.BLACKLIST && k.type === g.SHADOW ? a.createElement("div", {
            className: "ban__description border-bottom-dark"
        }, a.createElement("p", {
            className: "text-small ban__option-subtext"
        }, e("Ban a user without them knowing. The user can still comment, however, their posts will only be visible to themselves. Use it against trolls and spammers who attempt to circumvent a ban with new accounts."))) : null, a.createElement("label", {
            className: ["padding-default", "align", "align__item--grow", "align__item--equal", "align--center", "align--column", "ban__option", k.type === g.PERMANENT ? "-selected" : null].join(" ")
        }, a.createElement("input", {
            type: "radio",
            name: "ban_type",
            value: g.PERMANENT,
            checked: k.type === g.PERMANENT,
            onChange: o
        }), a.createElement("p", {
            className: "text-semibold text-center ban__option-text"
        }, "Permanent Ban")), i === f.BLACKLIST && k.type === g.PERMANENT ? a.createElement("div", {
            className: "ban__description border-bottom-dark"
        }, a.createElement("p", {
            className: "text-small ban__option-subtext"
        }, e("Permanently ban the user so they can no longer post, vote, or flag comments on your site. If the user repeatedly violates your comment policy, revoke their ability to participate."), a.createElement("label", {
            className: "fieldset__block--checkbox text-medium spacing-bottom-small"
        }, a.createElement("span", {
            className: "text-semibold text-gray-dark"
        }, e("Last 30 days of comments:"), " "), a.createElement("select", {
            value: k.retroactiveAction,
            onChange: n,
            className: "custom-select"
        }, a.createElement("option", {
            value: "",
            selected: "1" !== k.retroactiveAction && "2" !== k.retroactiveAction
        }, e("Do nothing")), a.createElement("option", {
            value: "1",
            selected: "1" === k.retroactiveAction
        }, e("Delete")), a.createElement("option", {
            value: "2",
            selected: "2" === k.retroactiveAction
        }, e("Mark as spam")))))) : null)), a.createElement("div", {
            className: "padding-default ban__config"
        }, d.isAnonymous ? null : a.createElement("div", {
            className: "align align--stretch access__block spacing-bottom embed-hidden"
        }, a.createElement("a", {
            href: d.profileUrl,
            className: "spacing-right"
        }, a.createElement("img", {
            src: d.avatar.cache,
            alt: d.name,
            className: "comment-moderate__avatar border-radius-sm"
        })), a.createElement("div", {
            className: "access__value"
        }, a.createElement("h4", null, d.name), a.createElement("p", {
            className: "text-gray text-small"
        }, d.username))), d.username ? a.createElement("label", {
            className: "fieldset__block--checkbox text-medium spacing-bottom-small"
        }, a.createElement("input", {
            type: "checkbox",
            checked: Boolean(k.username),
            onChange: b.partial(p, b, "username"),
            className: "spacing-right-small"
        }), e("User:"), " ", a.createElement("strong", null, d.username)) : null, d.email ? a.createElement("label", {
            className: "fieldset__block--checkbox text-medium spacing-bottom-small"
        }, a.createElement("input", {
            type: "checkbox",
            checked: Boolean(k.email),
            onChange: b.partial(p, b, "email"),
            className: "spacing-right-small"
        }), e("Email:"), " ", a.createElement("strong", null, d.email)) : null, i === f.BLACKLIST && j ? a.createElement("label", {
            className: "fieldset__block--checkbox text-medium spacing-bottom-small"
        }, a.createElement("input", {
            type: "checkbox",
            checked: Boolean(k.ipAddress),
            onChange: q,
            className: "spacing-right-small"
        }), e("IP Address:"), " ", a.createElement("strong", null, " ", j), a.createElement("div", {
            className: ["spacing-default-narrow", "text-small", "text-gray", "spacing-left-large", "embed-hidden"].join(" ")
        }, a.createElement("strong", null, e("Note:"), " "), e("Adding an IP address to the banned list may also unintentionally block others who may share this IP address."))) : null, i === f.BLACKLIST ? a.createElement("section", null, a.createElement("div", {
            className: "spacing-bottom-small spacing-top-narrow"
        }, a.createElement("label", {
            className: "ban__reason"
        }, e("Reason for banning:"), a.createElement("input", {
            name: "reason",
            type: "text",
            value: k.reason || "",
            onChange: u,
            className: "input--textbox -text-small border-gray-light",
            maxLength: "50"
        }))), a.createElement("p", {
            className: "text-small ban__option-subtext"
        }, e("You can remove the user from the banned list at any time."))) : null)), a.createElement("div", {
            className: "admin-modal__footer clearfix"
        }, a.createElement("div", null, a.createElement("button", {
            className: ["button", "button-fill--brand", "button-small", "text-capitalized"].join(" "),
            onClick: v
        }, e(i === f.WHITELIST ? "Add to Trusted List" : "Add to Banned List")), " ", i === f.BLACKLIST ? a.createElement("button", {
            className: ["button", "button-fill--brand", "button-small", "text-capitalized"].join(" "),
            onClick: w
        }, e("Cancel")) : null))) : null
    };
    return i
});
var _extends = Object.assign || function(a) {
    for (var b = 1; b < arguments.length; b++) {
        var c = arguments[b];
        for (var d in c)
            Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
    }
    return a
}
;
define("lounge/views/posts/BlacklistView", ["jquery", "underscore", "backbone", "react", "core/bus", "core/api", "core/utils", "core/utils/storage", "core/templates/react/ModerationUserListsTemplate", "core/constants/moderationUserLists", "lounge/utils", "lounge/views/cards"], function(a, b, c, d, e, f, g, h, i, j, k, l) {
    "use strict";
    var m = j.BAN_TYPES
      , n = j.LIST_TYPES
      , o = j.STORAGE_KEY_BAN_TYPE
      , p = j.DEFAULT_FORM_VALUES
      , q = j.getDateExpires
      , r = j.isBanTypeSupported
      , s = g.preventDefaultHandler
      , t = c.View.extend({
        className: "moderate",
        initialize: function(b) {
            this.forum = b.forum;
            var c = [k.getSaasFeatures(this.model.get("forum"))];
            this.model.get("ipAddress") && this.model.author.get("email") || c.push(this.model.fetch()),
            this.loading = a.when.apply(a, c)
        },
        render: function() {
            var a = this
              , b = this.$el;
            return b.addClass("loading"),
            e.trigger("uiAction:viewBanUser"),
            this.loading.always(function(c) {
                var e = a.model.author
                  , f = h.get(o);
                a.saasFeatures = c,
                a.formValues = _extends({}, p, {
                    type: r(f, c) ? f : m.PERMANENT,
                    username: e.get("username"),
                    email: e.get("email")
                }, a.formValues),
                b.removeClass("loading"),
                b.html(i({
                    user: e.toJSON(),
                    listName: n.BLACKLIST,
                    ipAddress: a.model.get("ipAddress"),
                    formValues: a.formValues,
                    supportsShadowBanning: r(m.SHADOW, a.saasFeatures),
                    supportsTempBanning: r(m.TEMP, a.saasFeatures),
                    selectRetroactiveAction: a.selectRetroactiveAction.bind(a),
                    toggleBanTypeCallback: a.toggleBanTypeCallback.bind(a),
                    toggleUserValueChecked: a.toggleUserValueChecked.bind(a),
                    toggleIpAddressChecked: a.toggleIpAddressChecked.bind(a),
                    updateReason: a.updateReason.bind(a),
                    updateDuration: a.updateDuration.bind(a),
                    updateCustomDurationAmount: a.updateCustomDurationAmount.bind(a),
                    updateCustomDurationScale: a.updateCustomDurationScale.bind(a),
                    handleSubmit: a.submit.bind(a),
                    handleCancel: a.cancel.bind(a),
                    UpgradeIcon: function() {
                        return d.createElement("span", {
                            className: "text-largest text-yellow icon-upgrade-arrow-pro media-middle spacing-left upgrade-card",
                            "data-role": "upgrade-card-target"
                        })
                    }
                })),
                a.initUpgradeCard()
            }),
            this.trigger("render"),
            this
        },
        initUpgradeCard: function() {
            var b = l.UpgradeCard.create({
                organization: this.forum ? {
                    id: this.forum.get("organizationId")
                } : null
            });
            this.$("[data-role=upgrade-card-target]").each(function() {
                b.target(a(this))
            }),
            this.listenToOnce(b, "show", function() {
                e.trigger("uiAction:viewUpgradeCard")
            }),
            this.listenTo(b, "click:upgrade", function(a) {
                a.stopPropagation(),
                e.trigger("uiAction:clickUpgrade")
            })
        },
        toggleBanType: function(a, b) {
            r(b, this.saasFeatures) && (this.formValues.type = b,
            h.set(o, b),
            this.render())
        },
        toggleBanTypeCallback: function(a) {
            this.toggleBanType(a, a.target.value)
        },
        selectRetroactiveAction: function(a) {
            this.formValues.retroactiveAction = a.target.value || null
        },
        toggleUserValueChecked: function(a, b) {
            this.formValues[b] = a.target.checked ? this.model.author.get(b) : null
        },
        toggleIpAddressChecked: function(a) {
            this.formValues.ipAddress = a.target.checked ? this.model.get("ipAddress") : null
        },
        updateReason: function(a) {
            this.formValues.reason = a.target.value
        },
        updateDuration: function(a) {
            this.formValues.durationHours = a.target.value
        },
        updateCustomDurationAmount: function(a) {
            var b = this;
            if ("keypress" === a.type && /[^\d]/.test(a.key))
                return void a.preventDefault();
            var c = a.target.value
              , d = "custom";
            this.formValues.customDurationAmount === c && this.formValues.durationHours === d || (this.formValues.customDurationAmount = c,
            this.formValues.durationHours = d,
            a.target === window.document.activeElement && this.once("render", function() {
                b.$("input[name=customDurationAmount]").focus()
            }),
            this.render())
        },
        updateCustomDurationScale: function(a) {
            this.formValues.customDurationScale = a.target.value,
            this.formValues.durationHours = "custom",
            this.render()
        },
        cancel: s(function() {
            this.trigger("cancel")
        }),
        submit: s(function() {
            var a = this;
            e.trigger("uiAction:clickBanUser");
            var c = {
                email: this.formValues.email,
                notes: this.formValues.reason,
                forum: this.model.get("forum"),
                shadowBan: this.formValues.type === m.SHADOW ? 1 : 0,
                dateExpires: this.formValues.type === m.TEMP ? q(this.formValues) : null
            };
            this.formValues.username && (c.user = "username:" + this.formValues.username),
            this.formValues.ipAddress && (c.ip = this.formValues.ipAddress),
            this.formValues.type === m.PERMANENT && (c.retroactiveAction = this.formValues.retroactiveAction),
            (c.user || c.ip || c.email) && f.call("blacklists/add.json", {
                method: "POST",
                data: b.omit(c, b.isNull),
                success: function() {
                    a.trigger("success")
                }
            })
        })
    }, {
        defaultFormValues: {
            username: null,
            email: null,
            ipAddress: null,
            reason: "",
            retroactiveAction: null
        }
    });
    return t
}),
define("templates/lounge/edit", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function() {
        return a.createElement("div", {
            className: "textarea-wrapper",
            "data-role": "textarea"
        }, a.createElement("div", {
            className: "edit-alert",
            role: "postbox-alert"
        }), a.createElement("div", {
            className: "post-actions"
        }, a.createElement("div", {
            className: "logged-in"
        }, a.createElement("section", null, a.createElement("div", {
            className: "temp-post"
        }, a.createElement("button", {
            className: "btn post-action__button",
            type: "submit"
        }, c("Save Edit")), a.createElement("a", {
            className: "cancel post-action__cancel",
            href: "#",
            "data-action": "edit"
        }, c("Cancel")))))))
    };
    return d
}),
define("lounge/views/posts/PostEditView", ["backbone", "core/mixins/withAlert", "core/views/TextareaView", "templates/lounge/edit"], function(a, b, c, d) {
    "use strict";
    var e = a.View.extend({
        tagName: "form",
        className: "edit",
        events: {
            submit: "submitForm",
            "click [data-action=cancel]": "cancel"
        },
        initialize: function(a) {
            this.post = a.post,
            this.session = a.session,
            this._alertSelector = "[role=postbox-alert]"
        },
        cancel: function() {
            this.trigger("cancel")
        },
        render: function() {
            var a = this.post.toJSON();
            this.$el.html(d({
                post: a,
                user: this.session.toJSON()
            }));
            var b = this.textarea = new c({
                value: a.raw_message
            });
            return this.$("[data-role=textarea]").prepend(b.render().el),
            this
        },
        resize: function() {
            this.textarea.resize()
        },
        submitForm: function(a) {
            this.dismissAlert(),
            a && a.preventDefault() && a.preventDefault();
            var b = this
              , c = {
                raw_message: this.textarea.get()
            }
              , d = b.post.validateMessage(c);
            return void 0 !== d ? this.alert(d, {
                type: "error"
            }) : (b.trigger("submitted"),
            void b.post.save(c, {
                success: function() {}
            }))
        },
        remove: function() {
            this.$el.remove()
        }
    });
    return b.call(e.prototype),
    e
}),
define("lounge/views/posts/TypingUserView", ["backbone", "core/strings"], function(a, b) {
    "use strict";
    var c = b.get
      , d = a.View.extend({
        initialize: function(a) {
            this.options = a
        },
        render: function() {
            var a, d = this.options.parentView.reply, e = d && d.typingUser, f = this.model.usersTyping.count(e && e.id);
            return f <= 0 ? void this.$el.hide() : (1 === f ? a = c("One other person is typing…") : (a = c("%(num)s other people are typing…"),
            a = b.interpolate(a, {
                num: f
            })),
            this.$el.text(a),
            this.$el.show(),
            this)
        }
    });
    return d
});
var _extends = Object.assign || function(a) {
    for (var b = 1; b < arguments.length; b++) {
        var c = arguments[b];
        for (var d in c)
            Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
    }
    return a
}
;
define("templates/lounge/flaggingReasons", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = [{
        id: 6,
        title: c("I disagree with this user")
    }, {
        id: 0,
        title: c("Targeted harassment"),
        description: c("posted or encouraged others to post harassing comments or hate speech targeting me, other individuals, or groups")
    }, {
        id: 1,
        title: c("Spam"),
        description: c("posted spam comments or discussions")
    }, {
        id: 2,
        title: c("Inappropriate profile"),
        description: c("profile contains inappropriate images or text")
    }, {
        id: 3,
        title: c("Threatening content"),
        description: c("posted directly threatening content")
    }, {
        id: 4,
        title: c("Impersonation"),
        description: c("misrepresents themselves as someone else")
    }, {
        id: 5,
        title: c("Private information"),
        description: c("posted someone else's personally identifiable information")
    }]
      , e = function(b) {
        var c = b.id
          , d = b.title
          , e = b.description
          , f = b.updateReason;
        return a.createElement("label", {
            className: ["padding-default", "flagging__reason"].join(" ")
        }, a.createElement("input", {
            type: "radio",
            name: "reason",
            value: c,
            onChange: f
        }), a.createElement("p", {
            className: "text-semibold text-center flagging__reason-text"
        }, d, e ? a.createElement("span", {
            className: "text-small text-normal"
        }, " — ", e) : null))
    }
      , f = function(b) {
        var f = b.updateReason
          , g = b.handleSubmit
          , h = b.handleCancel;
        return a.createElement("form", {
            className: "flagging-form"
        }, a.createElement("div", {
            className: "flagging__title"
        }, c("Flag Comment")), a.createElement("div", null, a.createElement("p", {
            className: "flagging__subtitle"
        }, c("Why are you flagging this comment?")), d.map(function(b) {
            return a.createElement(e, _extends({
                key: b.id,
                updateReason: f
            }, b))
        }), a.createElement("p", {
            className: "flagging__reason-subtext"
        }, c("Before flagging, please keep in mind that %(disqus)s does not moderate communities. Your username will be shown to the moderator, so you should only flag this comment for one of the reasons listed above.", {
            disqus: "Disqus"
        }))), a.createElement("div", {
            className: "admin-modal__footer -mobile clearfix"
        }, a.createElement("button", {
            className: ["button", "button-wide--footer", "button-fill--brand", "button-small"].join(" "),
            onClick: g
        }, c("Flag Comment")), " ", a.createElement("button", {
            className: ["button", "button-wide--footer", "button-fill--brand", "button-small"].join(" "),
            onClick: h
        }, c("Cancel"))))
    };
    return f
}),
define("templates/lounge/flaggingUserBlocking", ["react", "core/strings", "core/switches", "templates/lounge/partials/profileLink"], function(a, b, c, d) {
    "use strict";
    var e = b.gettext
      , f = function(b) {
        var f = b.user
          , g = b.forumId
          , h = b.handleBlock
          , i = b.handleComplete;
        return a.createElement("div", {
            className: "flagging__blocking-form"
        }, a.createElement("div", {
            className: "flagging__title"
        }, e("Thanks for your feedback!")), c.isFeatureActive("sso_less_branding", {
            forum: g
        }) ? a.createElement("div", {
            className: "admin-modal__footer -mobile clearfix"
        }, a.createElement("button", {
            className: ["button", "button-wide--footer", "button-fill--brand", "button-small"].join(" "),
            onClick: i
        }, e("Done"))) : [a.createElement("div", {
            key: "blocking-0"
        }, a.createElement("p", {
            className: "flagging__subtitle"
        }, e("Other tools for you:")), a.createElement("p", null, e("Blocking this user will hide all of their activity and comments from your %(disqus)s content, feeds, and notifications.", {
            disqus: "Disqus"
        })), a.createElement("p", {
            className: "spacing-top-bottom text-semibold"
        }, e("Would you like to block %(user)s?", {
            user: a.createElement(d, {
                user: f,
                forumId: g,
                className: "text-semibold"
            }, f.name)
        }))), a.createElement("div", {
            key: "blocking-1",
            className: "admin-modal__footer -mobile clearfix"
        }, a.createElement("div", null, a.createElement("button", {
            className: ["button", "button-wide--footer", "button-fill--brand", "button-small"].join(" "),
            onClick: h
        }, e("Block User")), " ", a.createElement("button", {
            className: ["button", "button-wide--footer", "button-fill--brand", "button-small"].join(" "),
            onClick: i
        }, e("No Thanks"))))])
    };
    return f
}),
define("templates/lounge/flaggingUserBlocked", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function(b) {
        var d = b.displayName
          , e = b.handleComplete
          , f = b.error;
        return a.createElement("div", {
            className: "flagging__blocking-complete"
        }, a.createElement("div", {
            className: "flagging__title"
        }, c("Blocked User")), a.createElement("div", null, a.createElement("img", {
            className: "flagging-pam",
            alt: "Pam",
            src: "https://c.disquscdn.com/next/embed/assets/img/PamX.d94a0777759fdfc847186ac973c791e5.svg"
        }), f ? a.createElement("p", {
            className: "spacing-top-bottom"
        }, f) : a.createElement("div", null, a.createElement("p", {
            className: "spacing-top-bottom text-semibold"
        }, c("You've blocked %(user)s.", {
            user: d
        })), a.createElement("p", {
            className: "spacing-top-bottom"
        }, c("You won't see comments from this user on %(disqus)s in discussions, notifications, and more.", {
            disqus: "Disqus"
        })))), a.createElement("div", {
            className: "admin-modal__footer -mobile clearfix"
        }, a.createElement("div", null, a.createElement("button", {
            className: ["button", "button-wide--footer", "button-fill--brand", "button-small"].join(" "),
            onClick: e
        }, c("Done")), " ", a.createElement("a", {
            className: ["button", "button-wide--footer", "button-fill--brand", "button-small"].join(" "),
            href: "https://disquscom.b0.upaiyun.com/home/settings/blocking/",
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: e
        }, c("Manage Blocked Users")))))
    };
    return d
}),
define("lounge/views/posts/FlaggingView", ["backbone", "core/api", "core/utils", "core/bus", "core/strings", "templates/lounge/flaggingReasons", "templates/lounge/flaggingUserBlocking", "templates/lounge/flaggingUserBlocked"], function(a, b, c, d, e, f, g, h) {
    "use strict";
    var i = c.preventDefaultHandler
      , j = e.gettext
      , k = a.View.extend({
        className: "moderate",
        render: function() {
            if (this.model.get("isFlaggedByUser"))
                if (this.blockComplete) {
                    var a = this.model.author;
                    this.$el.html(h({
                        displayName: a.get("name"),
                        error: this.blockError,
                        handleComplete: this.handleComplete.bind(this)
                    }))
                } else {
                    var b = this.model.author;
                    this.$el.html(g({
                        user: b.toJSON(),
                        forumId: this.model.get("forum"),
                        handleBlock: this.handleBlockUser.bind(this),
                        handleComplete: this.handleComplete.bind(this)
                    })),
                    d.trigger("uiAction:viewBlockUser")
                }
            else
                this.$el.html(f({
                    updateReason: this.updateFlaggingReason.bind(this),
                    handleSubmit: this.submitReason.bind(this),
                    handleCancel: this.cancel.bind(this)
                })),
                d.trigger("uiAction:viewFlagPost");
            return this
        },
        updateFlaggingReason: function(a) {
            this.reason = a.target.value
        },
        cancel: i(function() {
            this.trigger("cancel")
        }),
        handleComplete: function() {
            this.trigger("success")
        },
        submitReason: i(function() {
            this.reason && (d.trigger("uiAction:clickFlagPost"),
            this.model.report(this.reason),
            this.model.set("isFlaggedByUser", !0),
            this.render())
        }),
        handleBlockUser: i(function() {
            var a = this
              , c = this.model.author;
            return d.trigger("uiAction:clickBlockUser"),
            c.block().fail(function(c) {
                var d = j("Something went wrong while trying to block this user. Please try again later.")
                  , e = c && c.responseJSON && c.responseJSON.code;
                e === b.ERROR_CODES.MAX_ITEMS_REACHED && (d = j("Unfortunately this user could not be blocked; you have reached the limit for number of users blocked.")),
                a.blockError = d
            }).always(function() {
                a.blockComplete = !0,
                a.render()
            })
        })
    });
    return k
}),
define("core/views/Tooltip", ["jquery", "core/views/common/HoverCard"], function(a, b) {
    "use strict";
    var c = b.extend({
        className: "tooltip-outer message-card",
        initialize: function(a) {
            b.prototype.initialize.call(this, a),
            this.template = a.template,
            this.message = a.message
        },
        render: function() {
            if (this.template)
                this.$el.html(this.template());
            else {
                if (!this.message)
                    return;
                this.$el.html(a("<div>").addClass("tooltip").text(this.message))
            }
            b.prototype.render.call(this)
        },
        moveTo: function(a) {
            if (a) {
                var b = this.constructor.POSITION_OFFSET
                  , c = a.offset()
                  , d = this.getContainerPosition()
                  , e = this.$el.width();
                this.$el.css({
                    bottom: d.containerOffset.height - c.top + b,
                    top: "inherit",
                    left: c.left - e / 2
                })
            }
        }
    }, {
        create: function(a) {
            return b.create(a.id, a, "Tooltip", c)
        },
        POSITION_OFFSET: 10
    });
    return c
}),
define("core/views/ClickTooltip", ["underscore", "core/views/common/HoverCard", "core/views/Tooltip"], function(a, b, c) {
    "use strict";
    var d = c.extend({
        target: function(b) {
            b.on("click", a.bind(this.targetClicked, this, b)),
            b.on("mouseleave", a.bind(this.leave, this))
        },
        targetClicked: function(a) {
            a && (this.$target = a),
            "in" !== this._hoverState && (this._hoverState = "in",
            this.show(),
            c.open[this.uid] = this)
        }
    }, {
        create: function(a) {
            return b.create(a.id, a, "ClickTooltip", d)
        }
    });
    return d
}),
define("templates/lounge/partials/postVotes", ["react", "core/strings", "core/utils/object/get"], function(a, b, c) {
    "use strict";
    var d = b.gettext
      , e = function(b) {
        return a.createElement("div", null, a.createElement("a", {
            href: "#",
            className: "vote-up " + (c(b.post, ["userScore"], 0) > 0 ? "upvoted" : "") + " count-" + c(b.post, ["likes"], ""),
            "data-action": "upvote",
            title: c(b.post, ["likes"]) ? "" : d("Vote up")
        }, a.createElement("span", {
            className: "updatable count",
            "data-role": "likes"
        }, c(b.post, ["likes"], null)), " ", a.createElement("span", {
            className: "control"
        }, a.createElement("i", {
            "aria-hidden": "true",
            className: "icon icon-arrow-2"
        }))), " ", a.createElement("span", {
            role: "button",
            className: "vote-down " + (c(b.post, ["userScore"], 0) < 0 ? "downvoted" : "") + " count-" + c(b.post, ["dislikes"], ""),
            "data-action": "downvote",
            title: d("Vote down")
        }, a.createElement("span", {
            className: "control"
        }, a.createElement("i", {
            "aria-hidden": "true",
            className: "icon icon-arrow"
        }))))
    };
    return e
}),
define("templates/lounge/partials/postFooter", ["react", "core/strings", "core/switches", "core/utils/object/get", "templates/lounge/partials/postVotes"], function(a, b, c, d, e) {
    "use strict";
    var f = b.gettext
      , g = function(b) {
        return a.createElement("menu", {
            className: "comment-footer__menu"
        }, d(b.session, ["isRegistered"]) || !c.isFeatureActive("sso_less_branding", {
            forum: b.post.forum
        }) ? [a.createElement("li", {
            key: "vote-0",
            className: "voting",
            "data-role": "voting"
        }, a.createElement(e, {
            post: b.post
        })), a.createElement("li", {
            key: "vote-1",
            className: "bullet",
            "aria-hidden": "true"
        }, "•")] : null, d(b.post, ["canBeEdited"]) ? [a.createElement("li", {
            key: "edit-0",
            className: "edit",
            "data-role": "edit-link"
        }, a.createElement("a", {
            href: "#",
            "data-action": "edit"
        }, a.createElement("span", {
            className: "text"
        }, f("Edit")))), a.createElement("li", {
            key: "edit-1",
            className: "bullet",
            "aria-hidden": "true"
        }, "•")] : null, d(b.post, ["canBeRepliedTo"]) ? [a.createElement("li", {
            key: "reply-0",
            className: "reply",
            "data-role": "reply-link"
        }, a.createElement("a", {
            href: "#",
            "data-action": "reply"
        }, a.createElement("span", {
            className: "text"
        }, f("Reply")))), a.createElement("li", {
            key: "reply-1",
            className: "bullet",
            "aria-hidden": "true"
        }, "•")] : null, d(b.post, ["isSponsored"]) && !d(b.post, ["hideViewAllComments"]) ? [a.createElement("li", {
            key: "sponsored-0",
            className: "thread-link",
            "data-role": "thread-link"
        }, a.createElement("a", {
            href: d(b.post, ["permalink"], ""),
            target: "_blank",
            "data-action": "thread"
        }, a.createElement("i", {
            className: "icon icon-mobile"
        }), a.createElement("span", {
            className: "text"
        }, f("View all comments")), a.createElement("span", {
            className: "mobile-text"
        }, f("All Comments")))), a.createElement("li", {
            key: "sponsored-1",
            className: "bullet",
            "aria-hidden": "true"
        }, "•")] : null, d(b.post, ["canBeShared"]) ? a.createElement("li", {
            className: "comment__share"
        }, a.createElement("a", {
            className: "toggle",
            tabIndex: 0
        }, a.createElement("span", {
            className: "text"
        }, f("Share"), " ›")), a.createElement("ul", {
            className: "comment-share__buttons"
        }, a.createElement("li", {
            className: "twitter"
        }, a.createElement("button", {
            className: "share__button",
            "data-action": "share:twitter"
        }, "Twitter")), a.createElement("li", {
            className: "facebook"
        }, a.createElement("button", {
            className: "share__button",
            "data-action": "share:facebook"
        }, "Facebook")), a.createElement("li", {
            className: "link"
        }, a.createElement("input", {
            className: "share__button",
            value: d(b.post, ["shortLink"], ""),
            name: f("Link"),
            title: f("Click to copy post link"),
            "data-action": "copy-link",
            readOnly: !0
        })))) : null, d(b.post, ["isDeleted"]) ? null : a.createElement("li", {
            className: "realtime",
            "data-role": "realtime-notification:" + d(b.post, ["id"], "")
        }, a.createElement("span", {
            style: {
                display: "none"
            },
            className: "realtime-replies"
        }), a.createElement("a", {
            style: {
                display: "none"
            },
            href: "#",
            className: "realtime-button"
        })), d(b.post, ["isSponsored"]) ? a.createElement("li", {
            className: "feedback"
        }, a.createElement("button", {
            "data-action": "feedback"
        }, f("Leave Feedback"))) : null)
    };
    return g
}),
define("templates/lounge/partials/postMenu", ["react", "core/config/urls", "core/strings", "core/switches", "core/utils/object/get"], function(a, b, c, d, e) {
    "use strict";
    var f = c.gettext
      , g = function(c) {
        var g = null;
        return e(c.post, ["id"]) && e(c.post, ["isMinimized"]) !== !0 && e(c.post, ["isDeleted"]) !== !0 && e(c.post, ["author", "isBlocked"]) !== !0 && e(c.post, ["sb"]) !== !0 && (g = e(c.session, ["thread", "canModerate"]) ? a.createElement("div", null, a.createElement("a", {
            className: "dropdown-toggle",
            "data-toggle": "dropdown",
            href: "#"
        }, a.createElement("b", {
            className: "caret moderator-menu-options"
        })), a.createElement("ul", {
            className: "dropdown-menu"
        }, e(c.post, ["author", "id"]) === e(c.session, ["id"]) || d.isFeatureActive("sso_less_branding", {
            forum: c.post.forum
        }) ? null : a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "block-user"
        }, f("Block User"))), a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "spam"
        }, f("Mark as Spam"))), a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "delete"
        }, f("Delete")), " "), a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "blacklist"
        }, f("Ban User")), " "), a.createElement("li", null, a.createElement("a", {
            href: b.moderate + "#/approved/search/id:" + e(c.post, ["id"], ""),
            target: "_blank"
        }, f("Moderate"))), a.createElement("li", {
            className: "highlight-toggle"
        }, a.createElement("a", {
            href: "#",
            "data-action": e(c.post, ["isHighlighted"]) ? "unhighlight" : "highlight"
        }, f(e(c.post, ["isHighlighted"]) ? "Stop featuring" : "Feature this comment"))))) : e(c.session, ["isRegistered"]) && e(c.post, ["author"]) && e(c.post, ["author", "id"]) === e(c.session, ["id"]) ? a.createElement("div", null, a.createElement("a", {
            className: "dropdown-toggle",
            "data-toggle": "dropdown",
            href: "#"
        }, a.createElement("b", {
            className: "caret"
        })), a.createElement("ul", {
            className: "dropdown-menu"
        }, a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "delete"
        }, f("Delete"))), a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "flag"
        }, f(e(c.post, ["isFlaggedByUser"]) ? "Flagged" : "Flag as inappropriate"))))) : e(c.session, ["isRegistered"]) ? a.createElement("div", null, a.createElement("a", {
            className: "dropdown-toggle",
            "data-toggle": "dropdown",
            href: "#"
        }, a.createElement("b", {
            className: "caret"
        })), a.createElement("ul", {
            className: "dropdown-menu"
        }, d.isFeatureActive("sso_less_branding", {
            forum: c.post.forum
        }) ? null : a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "block-user"
        }, f("Block User"))), a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "flag"
        }, f(e(c.post, ["isFlaggedByUser"]) ? "Flagged" : "Flag as inappropriate"))))) : d.isFeatureActive("sso_less_branding", {
            forum: c.post.forum
        }) ? null : a.createElement("a", {
            className: "dropdown-toggle",
            href: "#",
            "data-action": "flag",
            "data-role": "flag",
            title: f("Flag as inappropriate")
        }, a.createElement("i", {
            "aria-hidden": "true",
            className: "icon icon-flag"
        }))),
        a.createElement("ul", {
            className: "post-menu dropdown",
            "data-role": "menu"
        }, a.createElement("li", {
            className: "collapse"
        }, a.createElement("a", {
            href: "#",
            "data-action": "collapse",
            title: f("Collapse")
        }, a.createElement("span", null, "−"))), a.createElement("li", {
            className: "expand"
        }, a.createElement("a", {
            href: "#",
            "data-action": "collapse",
            title: f("Expand")
        }, a.createElement("span", null, "+"))), null === g ? null : a.createElement("li", {
            className: e(c.session, ["thread", "canModerate"]) ? "moderator-menu-options" : "",
            role: "menu"
        }, g))
    };
    return g
}),
define("templates/lounge/partials/postUserAvatar", ["react", "core/strings", "core/utils/object/get", "templates/lounge/partials/userAvatar"], function(a, b, c, d) {
    "use strict";
    var e = b.gettext
      , f = function(b) {
        var f = void 0;
        return f = c(b.post, ["author", "isRegistered"]) && c(b.post, ["isMinimized"]) !== !0 ? a.createElement("div", {
            className: "avatar hovercard"
        }, a.createElement(d, {
            defaultAvatarUrl: b.defaultAvatarUrl,
            forumId: b.post.forum,
            user: b.post.author
        })) : c(b.post, ["author", "hasSponsoredAvatar"]) ? a.createElement("div", {
            className: "avatar"
        }, a.createElement("div", {
            className: "user"
        }, a.createElement("img", {
            src: b.defaultAvatarUrl,
            "data-src": c(b.post, ["author", "avatar", "cache"], ""),
            className: "user",
            alt: e("Avatar")
        }))) : a.createElement("div", {
            className: "avatar"
        }, a.createElement("div", {
            className: "user"
        }, a.createElement("img", {
            src: b.defaultAvatarUrl,
            className: "user",
            alt: e("Avatar")
        })))
    };
    return f
}),
define("templates/lounge/partials/postWrapper", ["react", "core/utils/object/get", "templates/lounge/partials/postMenu"], function(a, b, c) {
    "use strict";
    var d = function(d) {
        var e = ["post-content", b(d.post, ["isRealtime"]) && "new", b(d.session, ["isRegistered"]) && b(d.post, ["author", "id"]) === b(d.session, ["id"]) && "authored-by-session-user"].filter(Boolean).join(" ");
        return [a.createElement("div", {
            key: "post-wrapper-content",
            "data-role": "post-content",
            className: e
        }, a.createElement("div", {
            className: "indicator"
        }), d.children, a.createElement(c, {
            post: d.post,
            session: d.session
        }), a.createElement("div", {
            "data-role": "blacklist-form"
        }), a.createElement("div", {
            "data-role": "flagging-form"
        }), a.createElement("div", {
            className: "reply-form-container",
            "data-role": "reply-form"
        })), a.createElement("ul", {
            key: "post-wrapper-child-comments",
            "data-role": "children",
            className: "children"
        })]
    };
    return d
}),
define("templates/lounge/post", ["react", "core/strings", "core/utils/object/get", "templates/lounge/partials/postFooter", "templates/lounge/partials/postUserAvatar", "templates/lounge/partials/postWrapper", "templates/lounge/partials/profileLink"], function(a, b, c, d, e, f, g) {
    "use strict";
    var h = b.gettext
      , i = function(b) {
        return c(b.post, ["author", "badge"]) ? a.createElement("span", {
            className: "badge",
            "data-type": "tracked-badge"
        }, c(b.post, ["author", "badge"], null)) : c(b.post, ["author", "thread", "canModerate"]) ? a.createElement("span", {
            className: "badge moderator"
        }, h("Mod")) : null
    }
      , j = function(b) {
        return [a.createElement("div", {
            key: "post-alert",
            role: "alert"
        }), a.createElement(f, {
            key: "post-wrapper",
            post: b.post,
            session: b.session
        }, a.createElement(e, {
            post: b.post,
            defaultAvatarUrl: b.defaultAvatarUrl
        }), a.createElement("div", {
            className: "post-body"
        }, a.createElement("header", {
            className: "comment__header"
        }, a.createElement("span", {
            className: "post-byline"
        }, c(b.post, ["author", "isRegistered"]) ? a.createElement("span", null, b.isInHome && c(b.post, ["author", "isPowerContributor"]) ? a.createElement("a", {
            href: "#",
            className: "icon__position -inline -allstar",
            "data-toggle": "tooltip",
            "data-role": "allstar",
            title: h("All-Star")
        }, a.createElement("span", {
            className: "icon-allstar allstar__icon"
        })) : null, " ", a.createElement("span", {
            className: "author publisher-anchor-color"
        }, a.createElement(g, {
            user: c(b.post, ["author"]),
            forumId: b.post.forum
        }, c(b.post, ["author", "name"], null))), " ", a.createElement(i, {
            post: b.post
        })) : a.createElement("span", {
            className: "author"
        }, c(b.post, ["author", "name"], null)), b.parentPost ? a.createElement("span", null, " ", a.createElement("a", {
            href: c(b.parentPost, ["permalink"], ""),
            className: "parent-link",
            "data-role": "parent-link"
        }, a.createElement("i", {
            "aria-label": "in reply to",
            className: "icon-forward",
            title: "in reply to"
        }), " ", c(b.parentPost, ["author", "name"], null))) : null), " ", a.createElement("span", {
            className: "post-meta"
        }, a.createElement("span", {
            className: "bullet time-ago-bullet",
            "aria-hidden": "true"
        }, "•"), " ", c(b.post, ["id"]) ? a.createElement("a", {
            href: c(b.post, ["permalink"], ""),
            "data-role": "relative-time",
            className: "time-ago",
            title: c(b.post, ["formattedCreatedAt"], "")
        }, c(b.post, ["relativeCreatedAt"], null)) : a.createElement("span", {
            className: "time-ago",
            "data-role": "relative-time",
            title: c(b.post, ["formattedCreatedAt"], "")
        }, c(b.post, ["relativeCreatedAt"], null))), " ", b.stateByline ? a.createElement("span", {
            className: "state-byline state-byline-" + c(b.stateByline, ["style"], "")
        }, a.createElement("span", {
            className: "icon-mobile icon-" + c(b.stateByline, ["icon"], ""),
            "aria-hidden": "true"
        }), " ", a.createElement("span", {
            className: "text"
        }, c(b.stateByline, ["text"], null))) : null), a.createElement("div", {
            className: "post-body-inner"
        }, a.createElement("div", {
            className: "post-message-container",
            "data-role": "message-container"
        }, a.createElement("div", {
            className: "publisher-anchor-color",
            "data-role": "message-content"
        }, a.createElement("div", {
            className: "post-message " + (c(b.post, ["message"]) ? "" : "loading"),
            "data-role": "message",
            dir: "auto"
        }, "" === c(b.post, ["message"]) ? a.createElement("p", null, a.createElement("i", null, h("This comment has no content."))) : a.createElement("div", {
            dangerouslySetInnerHTML: {
                __html: c(b.post, ["message"], "")
            }
        })), a.createElement("span", {
            className: "post-media"
        }, a.createElement("ul", {
            "data-role": "post-media-list"
        })))), a.createElement("a", {
            className: "see-more hidden",
            title: h("see more"),
            "data-action": "see-more"
        }, h("see more"))), a.createElement("footer", {
            className: "comment__footer"
        }, a.createElement(d, {
            post: b.post,
            session: b.session
        }))))]
    };
    return j
}),
define("templates/lounge/postDeleted", ["react", "core/config/urls", "core/strings", "core/utils/object/get", "templates/lounge/partials/postMenu", "templates/lounge/partials/postWrapper"], function(a, b, c, d, e, f) {
    "use strict";
    var g = c.gettext
      , h = function(c) {
        return a.createElement(f, {
            post: c.post,
            session: c.session
        }, a.createElement("div", {
            className: "avatar"
        }, a.createElement("img", {
            "data-src": d(b, ["avatar", "generic"], ""),
            className: "user",
            alt: g("Avatar")
        })), a.createElement("div", {
            className: "post-body"
        }, a.createElement("div", {
            className: "post-message"
        }, a.createElement("p", null, g("This comment was deleted."))), a.createElement("header", null, a.createElement(e, {
            post: c.post,
            session: c.session
        }))))
    };
    return h
}),
define("templates/lounge/postBlocked", ["react", "core/config/urls", "core/strings", "core/utils/object/get", "templates/lounge/partials/postWrapper"], function(a, b, c, d, e) {
    "use strict";
    var f = c.gettext
      , g = function(c) {
        return a.createElement(e, {
            post: c.post,
            session: c.session
        }, a.createElement("div", {
            className: "avatar"
        }, a.createElement("img", {
            "data-src": d(b, ["avatar", "generic"], ""),
            className: "user",
            alt: f("Avatar")
        })), a.createElement("div", {
            className: "post-body"
        }, a.createElement("div", {
            className: "post-message"
        }, a.createElement("p", null, f("This user is blocked.")))))
    };
    return g
}),
define("templates/lounge/postMinimized", ["react", "core/strings", "core/utils/object/get", "templates/lounge/partials/postMenu", "templates/lounge/partials/postUserAvatar", "templates/lounge/partials/postWrapper"], function(a, b, c, d, e, f) {
    "use strict";
    var g = b.gettext
      , h = function(b) {
        var d = void 0;
        return d = c(b.post, ["isApproved"]) ? a.createElement("p", null, g("Comment score below threshold."), " ", a.createElement("a", {
            href: "#",
            "data-action": "reveal"
        }, g("Show comment."))) : b.created ? a.createElement("p", null, g("Your comment is awaiting moderation."), " ", a.createElement("a", {
            href: "#",
            "data-action": "reveal"
        }, g("See your comment.")), " ", a.createElement("a", {
            href: "https://help.disqus.com/customer/portal/articles/466223",
            className: "help-icon",
            title: g("Why?"),
            target: "_blank"
        }), " ") : a.createElement("p", null, g("This comment is awaiting moderation."), " ", a.createElement("a", {
            href: "#",
            "data-action": "reveal"
        }, g("Show comment.")))
    }
      , i = function(b) {
        return a.createElement(f, {
            post: b.post,
            session: b.session
        }, a.createElement(e, {
            post: b.post,
            defaultAvatarUrl: b.defaultAvatarUrl
        }), a.createElement("div", {
            className: "post-body"
        }, a.createElement("div", {
            className: "post-message publisher-anchor-color"
        }, a.createElement(h, {
            create: b.created,
            post: b.post
        })), a.createElement("header", null, a.createElement("div", {
            className: "post-meta"
        }, g("This comment is awaiting moderation.")), a.createElement(d, {
            post: b.post,
            session: b.session
        }))))
    };
    return i
}),
define("templates/lounge/anonUpvoteCard", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function() {
        return a.createElement("div", {
            className: "vote-action tooltip"
        }, c("You must sign in to up-vote this post."))
    };
    return d
}),
define("templates/lounge/anonDownvoteCard", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function() {
        return a.createElement("div", {
            className: "vote-action tooltip"
        }, c("You must sign in to down-vote this post."))
    };
    return d
}),
define("lounge/views/post", ["jquery", "underscore", "backbone", "stance", "react", "react-dom", "core/api", "core/strings", "core/switches", "core/utils", "core/mixins/withAlert", "core/mixins/withRichMedia", "core/WindowBus", "core/bus", "common/urls", "common/utils", "lounge/common", "lounge/mixins", "lounge/views/cards", "lounge/views/media", "lounge/views/posts/BlacklistView", "lounge/views/posts/PostEditView", "lounge/views/posts/PostReplyView", "lounge/views/posts/TypingUserView", "lounge/views/posts/FlaggingView", "core/views/ClickTooltip", "core/views/Tooltip", "templates/lounge/partials/postFooter", "templates/lounge/partials/postMenu", "templates/lounge/post", "templates/lounge/postDeleted", "templates/lounge/postBlocked", "templates/lounge/postMinimized", "templates/lounge/anonUpvoteCard", "templates/lounge/anonDownvoteCard"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I) {
    "use strict";
    var J = j.preventDefaultHandler
      , K = h.get
      , L = new m
      , M = c.View.extend({
        tagName: "li",
        className: "post",
        events: {
            "click > [data-role=post-content] [data-action]": function(c) {
                var d = this
                  , e = a(c.currentTarget).attr("data-action")
                  , f = d.actions[e];
                if (f)
                    return (b.isFunction(f) ? f : d[f]).call(d, c)
            },
            "click [data-role=allstar]": function() {
                L.broadcast("click:allstar")
            }
        },
        actions: {
            upvote: J(function(a) {
                this.handleVote(a, 1)
            }),
            downvote: J(function(a) {
                this.handleVote(a, -1)
            }),
            reply: "handleReply",
            flag: "handleFlag",
            "block-user": "handleBlockUser",
            edit: "handleEdit",
            "delete": "handleDelete",
            spam: "handleSpam",
            blacklist: "handleBlacklist",
            highlight: "handleHighlight",
            unhighlight: "handleUnhighlight",
            collapse: "handleCollapse",
            reveal: "handleReveal",
            "share:twitter": "_onShare",
            "share:facebook": "_onShare",
            "copy-link": "handleCopyLink"
        },
        initialize: function(a) {
            var b = this;
            this.thread = a.thread,
            this.session = a.session,
            this.created = Boolean(a.created),
            this.options = a,
            this.userSuggestions = a.userSuggestions,
            this.setAlertSelector("> [role=alert]"),
            this.listenTo(this.model, {
                "change:isDeleted spam": this.removeAsDeleted,
                "change:message": this.stopLoading,
                "change:points": this.updateVotePoints,
                "change:userScore": this.updateActiveUserVote,
                "change:isFlaggedByUser": this.updateMenu,
                "change:isHighlighted": function() {
                    this.redraw()
                },
                change: function() {
                    var a = this.model.changedAttributes();
                    (a.id || a.message) && this.redraw()
                }
            }),
            this.model.author && this.listenTo(this.model.author, "change:isBlocked", function() {
                return b.flaggingView ? void b.listenToOnce(b.flaggingView, "success cancel", b.redraw) : void b.redraw()
            }),
            this.listenTo(this.model.usersTyping, "add remove reset change", this.updateTypingCount),
            this.listenTo(this.session, "change:id", function() {
                this.updateFooter(),
                this.updateMenu(),
                this.updateSessionClass()
            }),
            this.hasVisibleChildren = !1,
            this.reply = null,
            this.edit = null,
            this.parent = a.parent,
            this.trackPosition = !1,
            this.offset = {
                top: -1,
                height: -1
            },
            this.dim = {
                height: -1,
                width: -1
            },
            this.listenTo(q.getLounge(), "domReflow", this.calcRect),
            this.isCollapseAllowed = !0,
            this.haveSubscribedToRichMediaEvents = !1
        },
        calcRect: function() {
            if (!this.trackPosition || !this.visible)
                return this.offset = {
                    top: -1,
                    height: -1
                },
                void (this.dim = {
                    height: -1,
                    width: -1
                });
            var a = this.contentNode;
            this.offset = a.offset(),
            this.dim = {
                height: a.height(),
                width: a.width()
            }
        },
        createTypingUserView: function() {
            var a = this.$el.find("[data-role=realtime-notification\\:" + this.model.id + "] .realtime-replies");
            this.typingUserView = new x({
                parentView: this,
                model: this.model,
                el: a
            })
        },
        updateTypingCount: function() {
            this.typingUserView || this.createTypingUserView(),
            this.typingUserView.render()
        },
        stopLoading: function() {
            this.contentNode.find(".loading").removeClass("loading")
        },
        updateRelativeTime: function() {
            this.contentNode.find("[data-role=relative-time]").text(this.model.getRelativeCreatedAt())
        },
        updateSessionClass: function() {
            var a = "authored-by-session-user";
            this.model.isAuthorSessionUser(this.session) ? this.contentNode.addClass(a) : this.contentNode.removeClass(a)
        },
        updateActiveUserVote: function() {
            var a = this.model
              , b = this.contentNode.find("[data-action=upvote]")
              , c = this.contentNode.find("[data-action=downvote]");
            c.removeClass("downvoted"),
            b.removeClass("upvoted"),
            a.get("userScore") > 0 ? b.addClass("upvoted") : a.get("userScore") < 0 && c.addClass("downvoted")
        },
        updateVotePoints: function() {
            var c = this.model
              , d = this.contentNode.find("[data-role=likes], [data-role=dislikes]")
              , e = this.contentNode.find("[data-action=upvote], [data-action=downvote]")
              , f = function(a) {
                b.delay(function() {
                    a.addClass("update"),
                    b.delay(function() {
                        a.removeClass("update")
                    }, 1e3)
                }, 500)
            };
            b.each(d, function(b, d) {
                b = a(b);
                var g = b.html()
                  , h = c.get(b.attr("data-role"))
                  , i = a(e[d]);
                h = Math.max(h, 0).toString(),
                g !== h && (i.removeClass("count-" + g),
                i.addClass("count-" + h),
                b.html(h),
                f(b))
            })
        },
        updateFooter: function() {
            var a = this.contentNode.find("footer")
              , b = B({
                post: this.getPostAttributes(),
                session: this.session.toJSON()
            });
            w.open[this.model.cid] && this.toggleReplyLink(!0),
            a.html(b),
            this.initUpvotersCard()
        },
        updateMenu: function() {
            var a = this.contentNode.find("[data-role=menu]")
              , b = C({
                session: this.session.toJSON(),
                post: this.getPostAttributes()
            });
            a.replaceWith(b)
        },
        updatePostStateClasses: function() {
            var a = this.model
              , b = a.get("isHighlighted") || a.get("isSponsored");
            this.$el.toggleClass("highlighted", Boolean(b)),
            this.contentNode.toggleClass("disabled", !a.id)
        },
        getMessageContent: function() {
            return this.messageContent && this.messageContent.length || (this.messageContent = this.contentNode.find("[data-role=message-content]")),
            this.messageContent
        },
        manageMessageHeight: function(a) {
            var b = this
              , c = b.getMessageContent()
              , d = 1.5 * b.collapsedHeight
              , e = c && c.length && c.height() || 0;
            e += a || 0,
            e > d && !b.$el.hasClass("collapsed") ? b.collapse() : b.expand(!0)
        },
        preventCollapsing: function(a) {
            a.get("deferred") || (this.expand(),
            this.isCollapseAllowed = !1)
        },
        markSeen: function() {
            function a() {
                c.contentNode.addClass("seen"),
                b.delay(function() {
                    c.contentNode.removeClass("seen"),
                    c.contentNode.removeClass("new")
                }, 1e4),
                c.trackPosition = !1
            }
            var c = this
              , e = d(c);
            e.isVisible() ? a() : this.listenToOnce(e, "enter", a)
        },
        renderMedia: function() {
            var a = this.model.media;
            if (a && a.length) {
                var c = this.$el.find("[data-role=post-media-list]");
                this.richMediaViews = this.renderRichMedia(a, c, {
                    convertLinkToButton: !0,
                    beforeRender: function(a) {
                        this.listenTo(a.model, "change:activated", this.preventCollapsing),
                        a.relatedPost = this.model.cid
                    },
                    normalize: function(a) {
                        var b = j.bleachFindUrls(a);
                        return b.length && (a = b[0].url),
                        a
                    }
                }),
                !this.haveSubscribedToRichMediaEvents && this.richMediaViews.length && (this.listenTo(t.settings, "change:collapsed", function(a, c) {
                    if (c)
                        this.manageMessageHeight();
                    else {
                        var d = b.reduce(this.richMediaViews, function(a, b) {
                            return a + (b.model.get("deferredHeight") || 0)
                        }, 0);
                        this.manageMessageHeight(d)
                    }
                }),
                this.haveSubscribedToRichMediaEvents = !0)
            }
        },
        renderSpoilers: function() {
            this.$el.find("spoiler").each(function() {
                a(this).attr("tabindex", "0")
            })
        },
        getStateByline: function() {
            var a, b = this.model;
            return b.get("isHighlighted") ? a = {
                icon: "trophy",
                text: K("Featured by %(forum)s"),
                style: "default"
            } : b.get("isSponsored") ? a = {
                icon: "trophy",
                text: K("Sponsored on Disqus"),
                style: "sponsored"
            } : b.isAuthorSessionUser(this.session) && (b.get("isApproved") || (a = {
                icon: "clock",
                text: K("Hold on, this is waiting to be approved by %(forum)s."),
                style: "default"
            })),
            a && (a.text = h.interpolate(a.text, {
                forum: this.thread.forum.get("name")
            })),
            a
        },
        getTemplate: function(a) {
            if (a.isDeleted)
                return E;
            var b = this.model.isAuthorSessionUser(this.session);
            return a.sb && !b ? E : this.model.author && this.model.author.get("isBlocked") ? F : b && !a.isApproved ? D : a.isMinimized ? G : D
        },
        getPostAttributes: function() {
            var a = this.model.toJSON({
                session: this.session,
                thread: this.thread
            })
              , b = this.model.getParent();
            return b && b.get("isSponsored") && (a.canBeRepliedTo = !1,
            a.hideViewAllComments = b.get("hideViewAllComments")),
            a
        },
        render: function() {
            var a = this.$el
              , b = this.getPostAttributes()
              , c = q.getLounge()
              , d = this.thread.forum.get("avatar")
              , g = this.model.getParent()
              , h = this.getTemplate(b);
            return !b.message && b.raw_message && p.isPlainText(b.raw_message) && (b.message = this.model.constructor.formatMessage(b.raw_message)),
            f.render(e.createElement(h, {
                post: b,
                forumName: this.thread.forum.get("name"),
                session: this.session.toJSON(),
                thread: this.thread.toJSON(),
                created: this.created,
                parentPost: g && g.toJSON({
                    session: this.session,
                    thread: this.thread
                }),
                defaultAvatarUrl: d ? d.large.cache : o.avatar.generic,
                stateByline: this.getStateByline(),
                isInHome: q.getLounge().isInHome()
            }), this.el),
            h === D ? a.removeClass("minimized") : a.addClass("minimized"),
            b.sb && !this.model.isAuthorSessionUser(this.session) ? this.hasVisibleChildren || a.addClass("banned") : this.parent && this.parent.markHasVisibleChildren(),
            !this.options.excludeAnchor && this.model.id && a.attr("id", "post-" + this.model.id),
            this.contentNode = a.find("[data-role=post-content]"),
            this.childrenNode = a.find("[data-role=children]"),
            this.messageNode = this.contentNode.find("[data-role=message]"),
            this.highlightSyntax(),
            this.processMentions(),
            this.initCards(),
            this.updatePostStateClasses(),
            this.renderMedia(),
            this.renderSpoilers(),
            this.model.get("isRealtime") && (this.trackPosition = !0,
            this.listenToOnce(c.postsView, "render:end", this.markSeen)),
            this.listenToOnce(c.postsView, "render:end", function() {
                this.markSeen(),
                this.manageMessageHeight()
            }),
            this
        },
        markHasVisibleChildren: function() {
            this.hasVisibleChildren = !0,
            this.model.get("sb") && (this.$el.removeClass("banned"),
            this.parent && this.parent.markHasVisibleChildren())
        },
        highlightSyntax: function() {
            var a = this.contentNode.find("pre code");
            a.length && a.each(function() {
                p.syntaxHighlighter.highlight(this)
            })
        },
        redraw: function() {
            var a = window.document.createDocumentFragment();
            this.childrenNode.children().appendTo(a),
            this.render(),
            this.childrenNode.append(a),
            this.blacklist && this.contentNode.find("[data-role=blacklist-form]").first().append(this.blacklist.el),
            q.getLounge().postsView.trigger("render:end"),
            q.getLounge().trigger("domReflow")
        },
        processMentions: function() {
            var b = this.session
              , c = b && b.get("sso") && b.get("sso").profile_url;
            c && (c = String(c),
            0 === c.indexOf("//") && (c = "https:" + c),
            /https?:\/\//.test(c) || (c = null),
            /\{username\}/.test(c) || (c = null));
            var d = i.isFeatureActive("sso_less_branding", {
                forum: this.thread.forum.id
            }) && !c;
            this.contentNode.find("[data-dsq-mention]").each(function() {
                var b = a(this);
                if (d) {
                    var e = a("<span />");
                    e.text(b.text()),
                    e.addClass("mention"),
                    b.replaceWith(e)
                } else {
                    if (c) {
                        var f = c.replace(/\{username\}/gi, encodeURIComponent(b.text()));
                        b.attr("href", f),
                        b.attr("title", f)
                    } else {
                        var g = b.attr("data-dsq-mention").split(":")[0];
                        b.attr("data-action", "profile"),
                        b.attr("data-username", g)
                    }
                    b.addClass("mention")
                }
            })
        },
        attachChild: function(a) {
            var b = a.model;
            b.created || !b.id || b.get("isImmediateReply") ? this.childrenNode.prepend(a.el) : this.childrenNode.append(a.el)
        },
        toggleReply: function() {
            this.reply && this.reply.isOpen() ? this.hideReply() : this.showReply()
        },
        toggleReplyLink: function(a) {
            this.contentNode.find("[data-role=reply-link]").toggleClass("active", a),
            this.contentNode.find("[data-role=reply-link]").toggleClass("publisher-anchor-color", a)
        },
        showReply: function() {
            this.reply ? (this.$el.find("[data-role=reply-form]").first().prepend(this.reply.$el),
            this.reply.show(),
            this.reply.focus()) : this.getReplyView(),
            this.toggleReplyLink(!0)
        },
        hideReply: function() {
            this.reply && (this.reply.hide(),
            this.toggleReplyLink(!1))
        },
        toggleEdit: function() {
            return this.contentNode.find("[data-role=edit-link]").toggleClass("active"),
            this.edit ? (this.edit.remove(),
            this.edit = null,
            void this.messageNode.show()) : void this.showEdit()
        },
        showEdit: function() {
            if (this.session.isLoggedOut())
                return void this.listenToOnce(this.session, "change:id", this.toggleEdit);
            if (this.model.canBeEdited(this.session, this.thread) && !this.edit) {
                this.edit = new v({
                    post: this.model,
                    session: this.session
                }),
                this.edit.render(),
                this.listenTo(this.edit, "submitted cancel", this.toggleEdit),
                this.expand(!0);
                var a = this.messageNode;
                a.parent().prepend(this.edit.$el),
                a.hide(),
                this.edit.resize();
                var b = q.getLounge();
                b && b.scrollToPost(this.model.id)
            }
        },
        removeAsDeleted: function() {
            this.redraw()
        },
        initCards: function() {
            var a = this;
            a.initProfileCard(),
            a.initContextCard(),
            a.initUpvotersCard(),
            a.initAnonVoteCards(),
            a.initTooltips()
        },
        initProfileCard: function() {
            if (!j.isMobileUserAgent() && !i.isFeatureActive("sso_less_branding", {
                forum: this.thread.forum.id
            })) {
                var a = this.$el.find(".hovercard");
                a.length && (this.profileCard = s.ProfileCard.create({
                    session: this.session,
                    user: this.model.author,
                    targetElement: a
                }))
            }
        },
        initContextCard: function() {
            if (!j.isMobileUserAgent()) {
                var a = this.parent && this.parent.model;
                a && !a.get("isDeleted") && (this.contextCard = s.ContextCard.create({
                    post: a,
                    targetElement: this.$el.find("[data-role=parent-link]")
                }))
            }
        },
        initUpvotersCard: function() {
            if (!j.isMobileUserAgent()) {
                var a = this.$el.find("[data-action=upvote]");
                a.length && (this.upvotersCard = s.UpvotersCard.create({
                    session: this.session,
                    model: this.model,
                    targetElement: a
                }))
            }
        },
        initAnonVoteCards: function() {
            this.session.isLoggedOut() && !this.thread.forum.get("settings").allowAnonVotes && (this.anonVoteCards = this.anonVoteCards || {},
            b.each({
                upvote: H,
                downvote: I
            }, function(a, b) {
                this.anonVoteCards[b] && (this.anonVoteCards[b].remove(),
                this.anonVoteCards[b] = null);
                var c = this.$("[data-action=" + b + "]");
                c.length && (this.anonVoteCards[b] = z.create({
                    targetElement: c,
                    template: a,
                    id: "anon" + b + this.model.id
                }))
            }, this),
            this.anonVoteCards.upvote && this.listenTo(this.anonVoteCards.upvote, "show", this.closeUpvotersCard))
        },
        initTooltips: function() {
            if (!j.isMobileUserAgent()) {
                var b = this.$el.find("[data-toggle=tooltip]");
                b.length && b.each(function(b, c) {
                    var d = a(c)
                      , e = d.attr("title");
                    d.attr("data-original-title", e).attr("title", ""),
                    A.create({
                        targetElement: d,
                        message: e,
                        id: e
                    })
                })
            }
        },
        closeUpvotersCard: function() {
            this.upvotersCard && this.upvotersCard.hide()
        },
        _onShare: J(function(a) {
            var b = p.extractService(a.target, "share");
            b && (q.getLounge().trigger("uiAction:postShare", this.model, b),
            this.share(b))
        }),
        handleBlacklist: J(function() {
            if (!this.blacklist) {
                var a = this.blacklist = new u({
                    model: this.model,
                    forum: this.thread.forum
                });
                a.render(),
                this.listenTo(a, "success cancel", function() {
                    this.blacklist.remove(),
                    this.blacklist = null
                }),
                this.contentNode.find("[data-role=blacklist-form]").first().append(a.el)
            }
        }),
        toggleCollapse: function(a) {
            this.$el.toggleClass("collapsed", a)
        },
        handleCollapse: J(function() {
            this.toggleCollapse()
        }),
        handleHighlight: J(function() {
            this.model.highlight();
            var a = K("You've featured a comment! This comment will now also appear at the top of the discussion.");
            this.alert(a, {
                safe: !0,
                type: "success"
            }),
            this.thread.set("highlightedPost", this.model);
            var b = q.getLounge();
            b && b.scrollToPost(this.model.id)
        }),
        handleUnhighlight: J(function() {
            this.model.unhighlight(),
            this.dismissAlert(),
            this.thread.unset("highlightedPost")
        }),
        handleVote: function(a, b) {
            if (!this.thread.forum.get("settings").allowAnonVotes && this.session.isLoggedOut())
                return void this.queueAuthAction(function() {
                    this.handleVote(a, b)
                }, this);
            var c = q.getLounge()
              , d = this.model.get("userScore") === b;
            d ? c.trigger("uiAction:postUnvote", this.model, a) : 1 === b ? c.trigger("uiAction:postUpvote", this.model, a) : b === -1 && c.trigger("uiAction:postDownvote", this.model, a),
            this.model.vote(d ? 0 : b)
        },
        queueAuthAction: function(a, b) {
            this.listenToOnce(this.session, "change:id", function() {
                this.session.isLoggedIn() && a.call(b)
            }),
            this.session.authenticate("disqusDotcom")
        },
        getReplyView: function() {
            return this.reply ? this.reply : (this.reply = new w({
                parentView: this,
                parent: this.model,
                thread: this.thread,
                session: this.options.session,
                userSuggestions: this.userSuggestions,
                shouldShowEmailAlertInForm: !0
            }),
            this.reply.render(),
            this.showReply(),
            this.reply)
        },
        handleReply: J(function() {
            this.toggleReply()
        }),
        handleFlag: J(function() {
            if (!this.model.get("isFlaggedByUser") && !this.flaggingView) {
                if (this.session.isLoggedOut()) {
                    var a = this;
                    return a._pendingFlagComplete = !1,
                    void a.queueAuthAction(function() {
                        a._pendingFlagComplete || (a._pendingFlagComplete = !0,
                        setTimeout(function() {
                            a.handleFlag()
                        }, 400))
                    })
                }
                var b = this.flaggingView = new y({
                    model: this.model
                });
                b.render(),
                this.listenTo(b, "cancel success", function() {
                    b.remove(),
                    this.flaggingView = null,
                    this.updateMenu()
                }),
                this.contentNode.find("[data-role=flagging-form]").first().append(b.el),
                n.frame.sendHostMessage("scrollTo", {
                    top: b.$el.offset().top - 80
                })
            }
        }),
        handleBlockUser: J(function() {
            var a = K("Are you sure you want to block this user?");
            if (window.confirm(a)) {
                this.dismissAlert(function(a) {
                    return a.options && a.options.isBlockError
                });
                var b = this;
                this.model.author.block().fail(function(a) {
                    var c = K("Something went wrong while trying to block this user. Please try again later.")
                      , d = a && a.responseJSON && a.responseJSON.code;
                    d === g.ERROR_CODES.MAX_ITEMS_REACHED && (c = K("Unfortunately this user could not be blocked; you have reached the limit for number of users blocked.")),
                    b.alert(c, {
                        type: "error",
                        isBlockError: !0
                    })
                })
            }
        }),
        handleEdit: J(function() {
            this.toggleEdit()
        }),
        handleDelete: J(function() {
            var a = K("Are you sure you want to delete this comment? You cannot undo this action.");
            (this.session.user.id !== this.model.author.id || window.confirm(a)) && (this.model.get("isHighlighted") && (this.model.set("isHighlighted", !1),
            this.thread.unset("highlightedPost")),
            this.model._delete())
        }),
        handleSpam: J(function() {
            this.model.spam()
        }),
        handleReveal: J(function() {
            this.model.set("isMinimized", !1),
            this.redraw()
        }),
        handleExpandMessage: J(function() {
            return this.expand()
        }),
        handleCopyLink: function(a) {
            a.target.select(),
            window.document.execCommand("copy")
        }
    });
    return b.extend(M.prototype, r.ShareMixin),
    k.call(M.prototype),
    r.asCollapsible.call(M.prototype, {
        collapsedHeight: 374,
        collapseTargetSelector: "[data-role=message-container]",
        collapseScope: "contentNode"
    }),
    l.call(M.prototype),
    M
}),
define("lounge/views/posts/collection", ["jquery", "underscore", "backbone", "moment", "core/bus", "core/strings", "core/switches", "common/models", "common/utils", "lounge/views/posts/PostReplyView", "lounge/views/post"], function(a, b, c, d, e, f, g, h, i, j, k) {
    "use strict";
    var l = f.get
      , m = c.View.extend({
        STREAMING_MAX_VISIBLE: 250,
        events: {
            "click [data-action=more-posts]": "handleLoadMore"
        },
        initialize: function(a) {
            this.lounge = a.lounge,
            this.thread = a.thread,
            this.userSuggestions = a.userSuggestions,
            this.posts = a.posts,
            this.postsToAppend = [],
            this.postsToPrepend = [],
            this.session = a.session,
            this.subViews = {},
            this.state = {
                nextPassTimeoutId: null,
                renderedPosts: [],
                clearDomAfterRender: !1,
                totalPostsProcessed: 0,
                totalElapsedTime: 0
            },
            this.addPostsIncremental = b.bind(this.addPostsIncremental, this),
            this.listenTo(this.posts, {
                reset: this.redrawPosts,
                add: this.addPosts,
                remove: this.removePost
            }),
            this.listenTo(this.thread, "change:highlightedPost", this.handleHasHighlightedState),
            this.listenTo(this.thread, "change:isClosed", this.toggleNoPosts),
            this.listenTo(this.session, "change:id", this.toggleNoPosts),
            this.listenTo(this.posts, "reset add", this.toggleNoPosts),
            this.listenTo(this.posts, "reset add", this.enableTimestampUpdates),
            this.listenTo(this, "render:end", this.toggleLoadMorePosts),
            this.listenTo(this, "render:end", this.handleHasHighlightedState)
        },
        handleHasHighlightedState: function() {
            this.$el.toggleClass("has-highlighted-post", this.thread.has("highlightedPost"))
        },
        getPostView: function(a) {
            return this.subViews[a]
        },
        bootstrap: function(a, c) {
            this.permalinkOptions = c,
            this.listenTo(this.posts, "reset", b.bind(this.posts.restoreFromCache, this.posts)),
            this.listenTo(this.posts, "change:isDeleted", b.bind(this.posts.removeFromCache, this.posts)),
            this.posts.reset(a.posts),
            b.invoke(this.subViews, "manageMessageHeight")
        },
        bindUIUpdateHandlers: function() {
            var c = this
              , d = a(window)
              , e = a(window.document.body)
              , f = e.width()
              , g = b.debounce(function() {
                var a = e.width();
                f !== a && c.subViews && (f = a,
                b.each(c.subViews, function(a) {
                    a.manageMessageHeight()
                }))
            }, 50);
            d.on("resize", g)
        },
        updateTimestamps: function() {
            return !(!this.subViews || b.size(this.subViews) < 1) && (b.invoke(this.subViews, "updateRelativeTime"),
            !0)
        },
        enableTimestampUpdates: function() {
            var a = this
              , c = 6e4;
            if (!a.timestampUpdateTimer) {
                var d = function e() {
                    return a.updateTimestamps() ? void (a.timestampUpdateTimer = b.delay(e, c)) : void (a.timestampUpdateTimer = null)
                };
                a.timestampUpdateTimer = b.delay(d, c)
            }
        },
        openReply: function(a) {
            var b = this.posts.get(a);
            if (b) {
                var c = this.subViews[b.cid];
                c.showReply()
            }
        },
        openEdit: function(a) {
            var b = this.posts.get(a);
            if (b) {
                var c = this.subViews[b.cid];
                c.showEdit()
            }
        },
        toggleLoadMorePosts: function() {
            var a = this.$el.find("#posts [data-role=more]")
              , b = this.posts.hasNext();
            b ? a.show() : a.hide()
        },
        handleLoadMore: function(b) {
            if (b.preventDefault(),
            g.isFeatureActive("login_prompt_more_posts") && this.session.isLoggedOut())
                return this._pendingLoadMoreComplete = !1,
                this.listenToOnce(this.session, "change:id", function() {
                    this.session.isLoggedIn() && !this._pendingLoadMoreComplete && (this._pendingLoadMoreComplete = !0,
                    this.handleLoadMore(b))
                }),
                void this.session.authenticate("disqusDotcom");
            var c = this
              , d = a(b.currentTarget)
              , f = c.posts.currentPage();
            d.addClass("busy"),
            c.posts.more({
                success: function() {
                    c.posts.restoreFromCache(),
                    c.once("render:end", function() {
                        d.removeClass("busy")
                    })
                },
                error: function() {
                    d.removeClass("busy")
                }
            }),
            c.lounge.trigger("uiAction:seeMore", f + 1),
            e.frame.sendHostMessage("posts.paginate")
        },
        renderLayout: a.noop,
        toggleNoPosts: function() {
            var b, c = a("#no-posts");
            this.posts.models.length ? c.hide() : (b = l(this.thread.get("isClosed") ? "This discussion has been closed." : this.session.get("canReply") ? "Be the first to comment." : "Nothing in this discussion yet."),
            c.text(b),
            c.show())
        },
        handleSort: function() {
            a("#posts [data-role=more]").hide(),
            a("#no-posts").hide(),
            a("#post-list").addClass("loading").empty()
        },
        redrawPosts: function() {
            var a = this;
            a.subViews = {},
            a.once("render:end", function() {
                b.each(j.open, function(b, c) {
                    var d = a.subViews[c];
                    if (d) {
                        var e = d.getReplyView();
                        e.textarea.set(b.textarea.get()),
                        b.isOpen() ? e.show() : e.hide()
                    }
                })
            }),
            a.posts.setPageFor && a.permalinkOptions && a.permalinkOptions.postId && a.posts.setPageFor(a.permalinkOptions.postId, {
                silent: !0
            }),
            a.addPosts(a.posts, {
                clearDom: !0
            })
        },
        postsShouldBePrepended: function(a) {
            var b = a.length && a[0];
            return Boolean(b && (b.created || !b.id || b.get("isRealtime") || b.get("isCached") || b.requestedByPermalink))
        },
        hasQueuedPosts: function() {
            return this.postsToAppend.length || this.postsToPrepend.length
        },
        addPosts: i.decorate(c.collectionAddNormalizer(c.Collection, h.Post), function(a, c, d) {
            var e = this;
            if (d.clearDom && (e.postsToAppend = [],
            e.postsToPrepend = [],
            e.postsShouldClearDom = !0),
            e.postsShouldBePrepended(a)) {
                var f = [];
                b.each(a, function(a) {
                    var b = a.get("parent");
                    b && e.posts.get(b) ? e.postsToPrepend.push(a) : f.push(a)
                }),
                e.postsToPrepend = f.concat(e.postsToPrepend)
            } else
                e.postsToAppend = e.postsToAppend.concat(a);
            e.state.nextPassTimeoutId || (e.state.nextPassTimeoutId = b.defer(function() {
                e.trigger("render:start"),
                e.addPostsIncremental(!0)
            }))
        }),
        onDeferredViewReady: function(a) {
            var b = this.subViews;
            b.hasOwnProperty(a) && b[a].manageMessageHeight()
        },
        removePost: function(a) {
            if (this.hasQueuedPosts())
                return void this.once("render:end", b.bind(this.removePost, this, a));
            var c = this.subViews[a.cid];
            c && (c.remove(),
            delete this.subViews[a.cid])
        },
        addPostsIncremental: function(a) {
            this.state.nextPassTimeoutId = null,
            this.discardRenderProgressIfClearDomRequested();
            var b = this.getPostModelsForThePass();
            b.length && this.renderPass(b, a ? m.FIRST_ATTEMPT_TIME_SCALE : void 0),
            this.finishPass(b),
            this.scheduleNextPass()
        },
        discardRenderProgressIfClearDomRequested: function() {
            this.postsShouldClearDom && (this.state.clearDomAfterRender = !0,
            this.postsShouldClearDom = !1,
            this.state.renderedPosts = [])
        },
        getPostModelsForThePass: function() {
            return this.postsToAppend.length ? this.postsToAppend : this.postsToPrepend
        },
        renderPass: function(a, b) {
            var c = m.TARGET_PROCESS_TIME;
            b && (c *= b);
            for (var d = this.calculatePostsForNextRun(c) || m.MINIMUM_POSTS_PER_RUN; d > 0; ) {
                var e = a.splice(0, d)
                  , f = this.timedRenderPosts(e);
                if (null === f)
                    break;
                c -= f,
                d = this.calculatePostsForNextRun(c)
            }
        },
        timedRenderPosts: function(a) {
            if (!a.length)
                return null;
            var c = Number(new Date);
            this.state.renderedPosts = this.state.renderedPosts.concat(b.map(a, this.createPostView, this));
            var d = Number(new Date) - c;
            return d < 0 && (d = 0),
            this.state.totalElapsedTime += d,
            this.state.totalPostsProcessed += a.length,
            d || null
        },
        createPostView: function(a) {
            var b, c = a.get("parent");
            c && (c = this.posts.get(c),
            b = c && this.getPostView(c.cid));
            var d = new k({
                parent: b,
                model: a,
                thread: this.thread,
                session: this.session,
                created: a.created,
                userSuggestions: this.userSuggestions
            });
            return this.subViews[a.cid] = d,
            d.render(),
            d
        },
        calculatePostsForNextRun: function(a) {
            return a <= 0 ? 0 : this.state.totalElapsedTime <= 0 ? this.state.totalPostsProcessed : Math.floor(a * this.state.totalPostsProcessed / this.state.totalElapsedTime)
        },
        finishPass: function(b) {
            if (!b.length) {
                if (this.$postList = a("#post-list"),
                this.state.clearDomAfterRender && (this.$postList.empty(),
                this.state.clearDomAfterRender = !1),
                this.state.renderedPosts.length) {
                    this.removeOldPostsIfRealtime(),
                    this.enablePostTracking(this.state.renderedPosts);
                    var c = b === this.postsToAppend;
                    this.insertPostElements(this.state.renderedPosts, c),
                    this.state.renderedPosts = []
                }
                this.$postList.removeClass("loading"),
                this.postsToPrepend.length || this.postsToAppend.length || this.trigger("render:end")
            }
        },
        removeOldPostsIfRealtime: function() {
            var a = b.any(this.state.renderedPosts, function(a) {
                return a.model.get("isRealtime")
            });
            a && this.removeOldPosts()
        },
        removeOldPosts: function() {
            var a = b.size(this.subViews) - this.STREAMING_MAX_VISIBLE;
            if (!(a <= 0))
                for (var c, e = this.posts.sortBy(function(a) {
                    return d(a.get("createdAt")).valueOf()
                }), f = 0, g = 0; f < e.length && g <= a; f++)
                    c = this.getPostView(e[f].cid),
                    c && 0 === c.childrenNode.children().length && (this.posts.remove(e[f]),
                    g += 1)
        },
        enablePostTracking: function(a) {
            b.each(a, function(a) {
                a.visible = !0
            })
        },
        insertPostElements: function(a, c) {
            var d = b.groupBy(a, function(a) {
                return Boolean(a.parent)
            });
            b.each(d["true"], function(a) {
                a.parent.attachChild(a)
            });
            var e = b.pluck(d["false"], "$el");
            c ? this.$postList.append(e) : this.$postList.prepend(e)
        },
        scheduleNextPass: function() {
            (this.postsToPrepend.length || this.postsToAppend.length) && (this.state.nextPassTimeoutId = b.defer(this.addPostsIncremental))
        }
    });
    return m.TARGET_PROCESS_TIME = 30,
    m.FIRST_ATTEMPT_TIME_SCALE = .8,
    m.MINIMUM_POSTS_PER_RUN = 2,
    {
        PostCollectionView: m
    }
}),
define("templates/lounge/onboard", ["react", "core/config/urls", "core/strings", "core/utils/object/get"], function(a, b, c, d) {
    "use strict";
    var e = c.gettext
      , f = function(c) {
        return [a.createElement("div", {
            key: "onboard-notice",
            className: "notice " + (c.showHome ? "notice--brand" : "")
        }, a.createElement("div", {
            className: "notice-wrapper"
        }, a.createElement("span", {
            className: "notice__icon icon icon-disqus"
        }), a.createElement("a", {
            "data-action": "show-home",
            href: (b.home || "") + "explore/?utm_source=embed&utm_medium=onboard_message&utm_content=see_home_msg&forum_id=" + d(c.forum, ["id"], ""),
            target: "_blank",
            className: "notice__message"
        }, e("Welcome to %(Disqus)s! Discover more great discussions just like this one. We're a lot more than comments.", {
            Disqus: "Disqus"
        })), a.createElement("a", {
            "data-action": "show-home",
            href: (b.home || "") + "explore/?utm_source=embed&utm_medium=onboard_message&utm_content=see_home_btn&forum_id=" + d(c.forum, ["id"], ""),
            target: "_blank",
            className: "btn btn-primary notice__button"
        }, e("Get Started")))), a.createElement("a", {
            key: "onboard-link",
            className: "dismiss",
            "data-action": "close",
            href: "#",
            title: e("Dismiss")
        }, "Dismiss ", a.createElement("span", {
            "aria-label": "Dismiss",
            className: "cross"
        }, "×"))]
    };
    return f
}),
define("lounge/views/onboard-alert", ["backbone", "react", "react-dom", "common/utils", "templates/lounge/onboard"], function(a, b, c, d, e) {
    "use strict";
    var f = a.View.extend({
        events: {
            "click [data-action=close]": "handleClose",
            "click [data-action=show-home]": "handleShowHome"
        },
        initialize: function(a) {
            this.session = a.session,
            this.forum = a.forum
        },
        render: function() {
            return this.session.isLoggedIn() && this.shouldShow() && (c.render(b.createElement(e, {
                forum: this.forum.toJSON()
            }), this.el),
            this.trigger("uiAction:onboardAlertShow")),
            this
        },
        shouldShow: function() {
            if (this.forum.get("settings").ssoRequired)
                return !1;
            var a = this.getCookie();
            return !!a && (this.session.user.shouldHomeOnboard() && (a === f.COOKIE_NEW_USER || a === f.COOKIE_POPUP))
        },
        getCookie: function() {
            return d.cookies.read(f.COOKIE_NAME)
        },
        setInitialCookie: function() {
            this.session.user.get("joinedRecently") && this.createCookie(f.COOKIE_NEW_USER)
        },
        createCookie: function(a) {
            d.cookies.create(f.COOKIE_NAME, a, {
                expiresIn: 2592e6
            })
        },
        eraseCookie: function() {
            d.cookies.erase(f.COOKIE_NAME)
        },
        handleShowHome: function() {
            this.remove()
        },
        handleClose: function(a) {
            a.preventDefault(),
            this.remove(),
            this.trigger("uiAction:onboardAlertDismiss")
        },
        remove: function() {
            this.eraseCookie(),
            this.session = null,
            a.View.prototype.remove.call(this)
        }
    }, {
        COOKIE_NAME: "disqus.onboarding",
        COOKIE_NEW_USER: "newUser"
    });
    return {
        OnboardAlert: f
    }
}),
define("templates/lounge/notificationMenu", ["react", "core/config/urls"], function(a, b) {
    "use strict";
    var c = function() {
        return a.createElement("a", {
            href: b.homeInbox || "",
            className: "notification-container",
            "data-action": "home",
            "data-home-path": "home/inbox/"
        }, a.createElement("span", {
            className: "notification-icon icon-comment",
            "aria-hidden": !0
        }), a.createElement("span", {
            className: "notification-count",
            "data-role": "notification-count"
        }))
    };
    return c
}),
define("lounge/views/notification-menu", ["jquery", "underscore", "backbone", "stance", "core/bus", "core/switches", "core/utils", "templates/lounge/notificationMenu"], function(a, b, c, d, e, f, g, h) {
    "use strict";
    var i = c.View.extend({
        events: {
            "click [data-action=home]": "handleShowHome"
        },
        initialize: function(c) {
            var e = a.Deferred();
            this.listenToOnce(d(this), "enter", function() {
                e.resolveWith(this)
            });
            var f = this.session = c.session;
            this.forum = c.forum,
            this.language = window.document.documentElement.lang,
            this.listenTo(f, "change:id", this.render),
            this.listenTo(f, "change:notificationCount", this.updateCount),
            this.listenTo(f, "change:id", function() {
                e.done(b.bind(f.fetchNotificationCount, f)),
                e.done(this.preloadSidebar)
            }),
            this.listenTo(this, {
                "sidebar:open:start": this.startLoadingAnimation,
                "sidebar:open:done": this.stopLoadingAnimation
            })
        },
        startLoadingAnimation: function() {
            this.$el.addClass("notification-loading")
        },
        stopLoadingAnimation: function() {
            this.$el.removeClass("notification-loading")
        },
        preloadSidebar: function() {
            e.trigger("sidebar:preload")
        },
        render: function() {
            return this.forum.get("settings").ssoRequired && this.session.isLoggedOut() || f.isFeatureActive("sso_less_branding", {
                forum: this.forum.id
            }) ? void this.$el.hide() : (this.$el.html(h({})),
            this.updateCount(),
            this.$el.show(),
            this)
        },
        handleShowHome: function(b) {
            if (this.session.set("notificationCount", 0),
            !g.willOpenNewWindow(b)) {
                b.preventDefault();
                var c = a(b.currentTarget).attr("data-home-path");
                e.trigger("sidebar:open", c, this)
            }
        },
        updateCount: function() {
            var a = this.session.get("notificationCount") || 0;
            a > 0 ? (this.$("[data-role=notification-count]").html(a > 9 ? '9<i class="icon icon-plus"></i>' : a),
            this.$el.addClass("unread")) : (this.$("[data-role=notification-count]").html(""),
            this.$el.removeClass("unread"))
        }
    });
    return {
        NotificationMenuView: i
    }
}),
define("templates/lounge/highlightedPost", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function() {
        return a.createElement("div", null, a.createElement("h2", {
            className: "highlighted-comment-header"
        }, c("Featured Comment")), a.createElement("ul", {
            className: "post-list"
        }))
    };
    return d
}),
define("lounge/views/highlighted-post", ["backbone", "underscore", "jquery", "core/UniqueModel", "common/models", "lounge/views/post", "templates/lounge/highlightedPost"], function(a, b, c, d, e, f, g) {
    "use strict";
    var h = a.View.extend({
        template: g,
        itemViewContainer: ".post-list",
        initialize: function(a) {
            b.extend(this, b.pick(a, ["thread", "session", "userSuggestions"])),
            this.listenTo(this.thread, "change:highlightedPost", this.reset)
        },
        getPost: function() {
            return this.post ? c.Deferred().resolve(this.post) : this.getHighlightedPost()
        },
        _getHighlightedPost: function() {
            var a = this.thread.get("highlightedPost");
            return a ? (a instanceof e.Post || (a = new d(e.Post,a)),
            a.get("isDeleted") ? null : a.get("sb") && !a.isAuthorSessionUser(this.session) ? null : a.get("isHighlighted") ? a : null) : null
        },
        getHighlightedPost: function() {
            var a, d = this.post = this._getHighlightedPost(), f = c.Deferred();
            return d ? (a = d.getParent()) && !a.author ? e.Post.fetchContext(a.id, this.thread).always(b.bind(f.resolve, f)) : f.resolve() : f.reject(),
            f.promise()
        },
        reset: function() {
            delete this.post,
            this.getPost().always(b.bind(this.render, this))
        },
        createPostView: function() {
            return this.post ? new i({
                model: this.post,
                thread: this.thread,
                session: this.session,
                userSuggestions: this.userSuggestions,
                excludeAnchor: !0
            }).stopListening(this.post.usersTyping) : null
        },
        render: function() {
            var a = this.createPostView();
            return a ? (a.render(),
            this.$el.html(this.template()),
            this.$(this.itemViewContainer).append(a.el),
            this.$el.show(),
            this) : (this.$el.hide(),
            this)
        }
    })
      , i = f.extend({
        getPostAttributes: function() {
            var a = f.prototype.getPostAttributes.apply(this, arguments);
            return a.canBeRepliedTo = !1,
            a
        },
        getStateByline: function() {
            return !1
        }
    });
    return {
        HighlightedPostView: h,
        FeaturedPostView: i
    }
}),
define("templates/lounge/realtimeCommentNotification", ["core/strings"], function(a) {
    "use strict";
    var b = a.gettext
      , c = function(a) {
        return 1 === a.comments ? b("Show One New Comment") : b("Show %(comments)s New Comments", {
            comments: a.comments
        })
    };
    return c
}),
define("templates/lounge/realtimeReplyNotification", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function(b) {
        return [a.createElement("span", {
            key: "indicator",
            className: "indicator"
        }), 1 === b.replies ? c("Show 1 new reply") : c("Show %(replies)s new replies", {
            replies: b.replies
        })]
    };
    return d
}),
define("lounge/views/realtime", ["underscore", "backbone", "react", "react-dom", "core/utils", "lounge/common", "templates/lounge/realtimeCommentNotification", "templates/lounge/realtimeReplyNotification"], function(a, b, c, d, e, f, g, h) {
    "use strict";
    var i = e.preventDefaultHandler
      , j = b.View.extend({
        events: {
            click: "handleDrain"
        },
        initialize: function(a) {
            this.options = a
        },
        getDirection: function(a) {
            if (this.offset && this.dim) {
                var b = a.pageOffset
                  , c = b + a.height
                  , d = this.offset.top + a.frameOffset.top
                  , e = d + this.dim.height;
                return e < b ? 1 : d > c ? -1 : 0
            }
        },
        setCount: function(a) {
            this.options.count = a
        },
        render: function() {
            return 0 === this.options.count ? void this.$el.hide() : (d.render(c.createElement(g, {
                comments: this.options.count
            }), this.el),
            this.listenTo(f.getLounge(), "domReflow", a.throttle(function() {
                0 !== this.options.count && (this.offset = this.$el.offset(),
                this.dim = {
                    height: this.$el.height(),
                    width: this.$el.width()
                })
            }, 400)),
            this.$el.show(),
            this)
        },
        handleDrain: i(function() {
            this.model.queue.drain(),
            this.setCount(this.model.queue.counters.comments),
            this.render()
        })
    })
      , k = j.extend({
        events: {
            click: "handleDrain"
        },
        getDirection: function(a) {
            if (this.options.postView.visible) {
                this.offset = this.options.postView.offset,
                this.dim = this.options.postView.dim;
                var b = j.prototype.getDirection.call(this, a);
                return delete this.offset,
                delete this.dim,
                b
            }
        },
        render: function() {
            var b = this
              , e = b.options.postView;
            return 0 === b.options.count ? (b.$el.hide(),
            void (e.trackPosition = !1)) : (e.trackPosition = !0,
            e.calcRect(),
            d.render(c.createElement(h, {
                replies: b.options.count
            }), this.el),
            b.$el.show(),
            void a.delay(function() {
                b.$el.addClass("reveal")
            }, 13))
        },
        handleDrain: i(function() {
            var a = this.model.id
              , b = this.options.postView
              , c = this.options.thread.queue;
            c.drain(a),
            this.setCount(c.counters.replies[a]),
            b.trackPosition = !1,
            this.render()
        })
    });
    return {
        QueuedPostView: j,
        QueuedReplyView: k
    }
}),
define("lounge/views/posts/UserSuggestionsManager", ["underscore", "jquery", "common/collections"], function(a, b, c) {
    "use strict";
    function d() {
        this.remotes = []
    }
    return a.extend(d.prototype, {
        fetch: function() {
            return this._fetchPromise || (this._fetchPromise = b.when.apply(b, a.chain(this.remotes).filter(function(a) {
                return !a.length
            }).map(function(a) {
                return a.fetch()
            }).value())),
            this._fetchPromise
        },
        addRemote: function(a) {
            this.remotes.push(a)
        },
        all: function() {
            var b = new c.UserCollection;
            return b.add(a.chain(this.remotes).pluck("models").flatten().value()),
            b
        },
        find: function(a, b) {
            if (a && a.length) {
                var c, d = new RegExp(a.join(" ").replace(/[^\w\s]/, ""),"i"), e = 5, f = this.all(), g = [], h = 0, i = 1 === a.length && "" === a[0] ? function() {
                    return !0
                }
                : function(a) {
                    return d.test(a.get("name")) || d.test(a.get("username"))
                }
                ;
                for (h = 0; h < f.models.length && g.length < e; h++)
                    c = f.models[h],
                    c.get("isAnonymous") || b.get(c.cid) || i(c) && g.push(c);
                return g
            }
        },
        get: function(a) {
            return this.all().get(a)
        }
    }),
    d
}),
define("lounge/views/sidebar", ["underscore", "backbone", "modernizr", "core/bus", "core/utils/url/serialize", "shared/urls", "core/utils"], function(a, b, c, d, e, f, g) {
    "use strict";
    var h = b.View.extend({
        initialize: function(a) {
            this.forum = a.forum,
            this.session = a.session,
            this.language = window.document.documentElement.lang,
            "en" === this.language && (this.language = void 0),
            this.listenTo(this.session, "change:id", this.destroyHome),
            this.listenTo(d, {
                "sidebar:open": this.open,
                "sidebar:preload": this.preload
            }),
            this.iframeAlive = !0,
            this.listenToOnce(d.frame, "home.timeout", this.handleTimeout)
        },
        isIE9: function() {
            return 9 === window.document.documentMode
        },
        shouldUseIframe: function() {
            if (this.isIE9() && !this.session.isSSO())
                return !1;
            if (!this.iframeAlive)
                return !1;
            var a = g.isMobileUserAgent();
            return !a || this.session.isSSO()
        },
        handleTimeout: function() {
            this.iframeAlive = !1
        },
        open: function(b, c) {
            if (this.shouldUseIframe()) {
                if (this.storeHomeSession(),
                d.frame.sendHostMessage("home.show", {
                    path: b,
                    language: this.language,
                    forum: this.forum && this.forum.id
                }),
                c) {
                    c.trigger("sidebar:open:start");
                    var h = a.bind(c.trigger, c, "sidebar:open:done");
                    this.listenToOnce(d.frame, {
                        "home.opened": h,
                        "home.timeout": h
                    })
                }
            } else
                g.openWindow(e(f.apps.home + b, {
                    l: this.language
                }), "disqushome");
            var i = "unknown";
            0 === b.indexOf("home/forums/") ? i = "community" : 0 === b.indexOf("by/") ? i = "profile" : "home/inbox/" === b && (i = "notifications"),
            d.trigger("uiAction:openHome", i)
        },
        destroyHome: function() {
            d.frame.sendHostMessage("home.destroy")
        },
        preload: function() {
            this.session.isLoggedOut() || this.shouldUseIframe() && (this.storeHomeSession(),
            d.frame.sendHostMessage("home.preload", {
                language: this.language
            }))
        },
        storeHomeSession: function() {
            c.sessionstorage && window.sessionStorage.setItem("home.session", JSON.stringify(this.session.user.toJSON()))
        }
    });
    return h
}),
define("templates/lounge/userMenu", ["react", "core/config/urls", "core/strings", "core/switches", "core/utils/object/get", "lounge/utils", "templates/lounge/partials/profileLink"], function(a, b, c, d, e, f, g) {
    "use strict";
    var h = c.gettext
      , i = function(c) {
        return [e(c.user, ["thread", "canReply"]) && !d.isFeatureActive("sso_less_branding", {
            forum: c.thread.forum
        }) ? a.createElement("a", {
            key: "user-menu-dropdown",
            href: "#",
            className: "dropdown-toggle",
            "data-toggle": "dropdown"
        }, a.createElement("span", {
            className: "dropdown-toggle-wrapper"
        }, e(c.user, ["isRegistered"]) ? a.createElement("span", null, a.createElement("span", {
            className: "avatar"
        }, a.createElement("img", {
            "data-role": "user-avatar",
            "data-user": e(c.user, ["id"], ""),
            "data-src": e(c.user, ["avatar", "cache"], ""),
            alt: h("Avatar")
        })), a.createElement("span", {
            className: "username",
            "data-role": "username",
            "data-username": e(c.user, ["username"], "")
        }, e(c.user, ["name"]) || e(c.user, ["username"]) || null)) : a.createElement("span", null, h("Login")), " "), " ", a.createElement("span", {
            className: "caret"
        })) : null, a.createElement("ul", {
            key: "user-menu-menu",
            className: "dropdown-menu"
        }, e(c.user, ["isRegistered"]) ? [a.createElement("li", {
            key: "menu-profile"
        }, a.createElement(g, {
            user: c.user,
            forumId: c.thread.forum
        }, h("Your Profile"))), a.createElement("li", {
            key: "menu-media"
        }, a.createElement("a", {
            href: "#",
            className: "media-toggle-on",
            "data-action": "toggle-media"
        }, h("Display Media")), a.createElement("a", {
            href: "#",
            className: "media-toggle-off",
            "data-action": "toggle-media"
        }, h("Hide Media"))), e(c.user, ["remote"]) ? null : a.createElement("li", {
            key: "menu-settings"
        }, a.createElement("a", {
            href: e(b, ["editProfile"], "")
        }, h("Edit Settings")))] : [e(c.sso, ["url"]) ? a.createElement("li", {
            key: "menu-auth-sso",
            className: "sso"
        }, a.createElement("a", {
            href: "#",
            "data-action": "auth:sso"
        }, e(c.sso, ["name"], null))) : null, a.createElement("li", {
            key: "menu-auth-disqus"
        }, a.createElement("a", {
            href: "#",
            "data-action": "auth:disqus"
        }, "Disqus")), a.createElement("li", {
            key: "menu-auth-facebook"
        }, a.createElement("a", {
            href: "#",
            "data-action": "auth:facebook"
        }, "Facebook")), a.createElement("li", {
            key: "menu-auth-twitter"
        }, a.createElement("a", {
            href: "#",
            "data-action": "auth:twitter"
        }, "Twitter")), a.createElement("li", {
            key: "menu-auth-google"
        }, a.createElement("a", {
            href: "#",
            "data-action": "auth:google"
        }, "Google")), f.isAmazonLoginEnabled() ? a.createElement("li", {
            key: "menu-auth-amazon"
        }, a.createElement("a", {
            href: "#",
            "data-action": "auth:amazon"
        }, "Amazon")) : null], e(c.user, ["thread", "canModerate"]) ? [c.forum.settings.validateAllPosts ? null : a.createElement("li", {
            key: "menu-toggle-thread-premoderate"
        }, a.createElement("a", {
            href: "#",
            "data-action": "toggle-thread-premoderate"
        }, h(c.thread.validateAllPosts ? "Don't Premoderate Thread" : "Premoderate Thread"))), a.createElement("li", {
            key: "menu-toggle-thread"
        }, a.createElement("a", {
            href: "#",
            "data-action": "toggle-thread"
        }, h(e(c.thread, ["isClosed"]) ? "Open Thread" : "Close Thread"))), e(c.user, ["isGlobalAdmin"]) ? null : a.createElement("li", {
            key: "menu-help"
        }, a.createElement("a", {
            href: "https://help.disqus.com/customer/portal/articles/2538045-commenter-launch-pad"
        }, h("Help")))] : null, e(c.user, ["isGlobalAdmin"]) ? [a.createElement("li", {
            key: "menu-debug"
        }, a.createElement("a", {
            href: "#",
            "data-action": "debug"
        }, h("Debug"))), a.createElement("li", {
            key: "menu-repair"
        }, a.createElement("a", {
            href: "#",
            "data-action": "repair"
        }, h("Repair")))] : null, e(c.user, ["isRegistered"]) && e(c.user, ["thread", "canReply"]) ? a.createElement("li", null, a.createElement("a", {
            href: "#",
            "data-action": "logout"
        }, h("Logout"))) : null)]
    };
    return i
}),
define("templates/lounge/threadShareMenu", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function() {
        return [a.createElement("a", {
            key: "thread-share-menu-link",
            href: "#",
            className: "dropdown-toggle",
            "data-toggle": "dropdown",
            title: c("Share")
        }, a.createElement("span", {
            className: "icon-export"
        }), " ", a.createElement("span", {
            className: "label"
        }, c("Share"))), a.createElement("ul", {
            key: "thread-share-menu-list",
            className: "share-menu dropdown-menu"
        }, a.createElement("li", null, a.createElement("div", {
            className: "share-menu__label"
        }, c("Share this discussion on")), a.createElement("ul", null, a.createElement("li", {
            className: "twitter"
        }, a.createElement("a", {
            "data-action": "share:twitter",
            href: "#"
        }, "Twitter")), a.createElement("li", {
            className: "facebook"
        }, a.createElement("a", {
            "data-action": "share:facebook",
            href: "#"
        }, "Facebook")))))]
    };
    return d
}),
define("templates/lounge/partials/commentPolicy", ["react", "core/strings", "core/switches", "core/bus"], function(a, b, c, d) {
    "use strict";
    var e = b.gettext
      , f = function(b) {
        var c = b.url
          , e = b.children;
        return a.createElement("a", {
            href: c,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "policy-link",
            onClick: function(a) {
                a.stopPropagation(),
                d.trigger("uiAction:clickCommentPolicy", c)
            }
        }, e)
    }
      , g = function(b) {
        var d = b.forum
          , g = c.isFeatureActive("experiment:comment_policy:button");
        if (!d.commentPolicyLink)
            return null;
        var h = e("Please read our %(commentPolicyLink)s before commenting.", {
            commentPolicyLink: g ? e("Comment Policy") : a.createElement(f, {
                url: d.commentPolicyLink
            }, e("Comment Policy"))
        });
        return g ? a.createElement(f, {
            url: d.commentPolicyLink
        }, h) : h
    }
      , h = function(b) {
        var d = b.forum;
        return d.commentPolicyText || d.commentPolicyLink ? a.createElement("div", {
            id: "comment-policy",
            className: ["comment-policy", "padding-double", c.isFeatureActive("experiment:comment_policy:button") ? "button-variant" : ""].join(" ")
        }, a.createElement("div", {
            className: "content"
        }, a.createElement("p", {
            className: "title"
        }, e("%(forumName)s Comment Policy", {
            forumName: d.name
        })), d.commentPolicyText ? a.createElement("p", null, d.commentPolicyText) : null, a.createElement(g, {
            forum: d
        })), a.createElement("i", {
            "aria-hidden": "true",
            className: "icon icon-chat-bubble"
        })) : null
    };
    return h
}),
define("templates/lounge/partials/postCount", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function(b) {
        return a.createElement("a", {
            className: "publisher-nav-color"
        }, a.createElement("span", {
            className: "comment-count"
        }, 1 === b.count ? c("1 comment") : c("%(numPosts)s comments", {
            numPosts: b.count
        })), a.createElement("span", {
            className: "comment-count-placeholder"
        }, c("Comments")))
    };
    return d
}),
define("templates/lounge/partials/topNavigation", ["react", "core/strings", "core/switches", "core/utils/object/get", "templates/lounge/partials/postCount"], function(a, b, c, d, e) {
    "use strict";
    var f = b.gettext
      , g = function(b) {
        return a.createElement("nav", {
            className: "nav nav-primary"
        }, a.createElement("ul", null, a.createElement("li", {
            className: "nav-tab nav-tab--primary tab-conversation active",
            "data-role": "post-count"
        }, b.inHome ? null : a.createElement(e, {
            count: d(b.thread, ["posts", "count"], null)
        })), b.inHome || c.isFeatureActive("sso_less_branding", {
            forum: b.forum.id
        }) ? null : a.createElement("li", {
            className: "nav-tab nav-tab--primary tab-community"
        }, a.createElement("a", {
            href: d(b.forum, ["homeUrl"], ""),
            className: "publisher-nav-color",
            "data-action": "community-sidebar",
            "data-forum": d(b.forum, ["id"], ""),
            id: "community-tab"
        }, a.createElement("span", {
            className: "community-name"
        }, a.createElement("strong", null, d(b.forum, ["name"], null))), a.createElement("strong", {
            className: "community-name-placeholder"
        }, f("Community")))), a.createElement("li", {
            className: "nav-tab nav-tab--primary dropdown user-menu",
            "data-role": "logout"
        }), a.createElement("li", {
            className: "nav-tab nav-tab--primary notification-menu",
            "data-role": "notification-menu"
        })))
    };
    return g
}),
define("templates/lounge/partials/postSort", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function(b) {
        return a.createElement("li", {
            "data-role": "post-sort",
            className: "nav-tab nav-tab--secondary dropdown sorting pull-right"
        }, a.createElement("a", {
            href: "#",
            className: "dropdown-toggle",
            "data-toggle": "dropdown"
        }, "popular" === b.order ? c("Sort by Best") : null, "desc" === b.order ? c("Sort by Newest") : null, "asc" === b.order ? c("Sort by Oldest") : null, a.createElement("span", {
            className: "caret"
        })), a.createElement("ul", {
            className: "dropdown-menu pull-right"
        }, a.createElement("li", {
            className: "popular" === b.order ? "selected" : ""
        }, a.createElement("a", {
            href: "#",
            "data-action": "sort",
            "data-sort": "popular"
        }, c("Best"), a.createElement("i", {
            "aria-hidden": "true",
            className: "icon-checkmark"
        }))), a.createElement("li", {
            className: "desc" === b.order ? "selected" : ""
        }, a.createElement("a", {
            href: "#",
            "data-action": "sort",
            "data-sort": "desc"
        }, c("Newest"), a.createElement("i", {
            "aria-hidden": "true",
            className: "icon-checkmark"
        }))), a.createElement("li", {
            className: "asc" === b.order ? "selected" : ""
        }, a.createElement("a", {
            href: "#",
            "data-action": "sort",
            "data-sort": "asc"
        }, c("Oldest"), a.createElement("i", {
            "aria-hidden": "true",
            className: "icon-checkmark"
        })))))
    };
    return d
}),
define("templates/lounge/partials/secondaryNavigation", ["react", "templates/lounge/partials/postSort"], function(a, b) {
    "use strict";
    var c = function(c) {
        return a.createElement("div", {
            className: "nav nav-secondary",
            "data-tracking-area": "secondary-nav"
        }, a.createElement("ul", null, a.createElement("li", {
            id: "recommend-button",
            className: "nav-tab nav-tab--secondary recommend dropdown"
        }), a.createElement("li", {
            id: "thread-share-menu",
            className: "nav-tab nav-tab--secondary dropdown share-menu hidden-sm"
        }), c.inHome ? null : a.createElement(b, {
            order: c.order
        })))
    };
    return c
}),
define("templates/lounge/layout", ["react", "core/strings", "core/switches", "core/utils/object/get", "templates/lounge/partials/commentPolicy", "templates/lounge/partials/topNavigation", "templates/lounge/partials/secondaryNavigation"], function(a, b, c, d, e, f, g) {
    "use strict";
    var h = b.gettext
      , i = function(b) {
        return a.createElement("div", {
            id: "layout",
            "data-tracking-area": "layout"
        }, a.createElement("div", {
            id: "onboard",
            "data-tracking-area": "onboard"
        }), a.createElement(e, {
            forum: b.forum
        }), a.createElement("div", {
            id: "highlighted-post",
            "data-tracking-area": "highlighted",
            className: "highlighted-post"
        }), a.createElement("div", {
            id: "global-alert"
        }), b.inHome ? null : a.createElement("header", {
            id: "main-nav",
            "data-tracking-area": "main-nav"
        }, a.createElement(f, {
            inHome: b.inHome,
            forum: b.forum,
            thread: b.thread
        })), a.createElement("section", {
            id: "conversation",
            "data-role": "main",
            "data-tracking-area": "main"
        }, a.createElement(g, {
            inHome: b.inHome,
            order: b.order
        }), a.createElement("div", {
            id: "posts"
        }, a.createElement("div", {
            id: "form",
            className: "textarea-wrapper--top-level"
        }), a.createElement("button", {
            className: "alert alert--realtime",
            style: {
                display: "none"
            },
            "data-role": "realtime-notification"
        }), a.createElement("div", {
            id: "no-posts",
            style: {
                display: "none"
            }
        }), a.createElement("ul", {
            id: "post-list",
            className: "post-list loading"
        }), a.createElement("div", {
            className: "load-more",
            "data-role": "more",
            style: {
                display: "none"
            }
        }, a.createElement("a", {
            href: "#",
            "data-action": "more-posts",
            className: "btn load-more__button"
        }, h("Load more comments"))))), a.createElement("div", {
            id: "placement-bottom",
            "data-tracking-area": "discovery-south"
        }), b.hideFooter ? null : a.createElement("div", {
            id: "footer",
            "data-tracking-area": "footer",
            className: "disqus-footer__wrapper"
        }, a.createElement("ul", {
            className: "disqus-footer"
        }, d(b.forum, ["disableDisqusBranding"], null) ? null : a.createElement("li", {
            className: "disqus-footer__logo"
        }, a.createElement("a", {
            href: "https://disqus.com",
            rel: "nofollow",
            title: h("Powered by Disqus"),
            className: "disqus-footer__link"
        }, h("Powered by Disqus"))), c.isFeatureActive("sso_less_branding", {
            forum: b.forum.id
        }) ? null : a.createElement("li", {
            id: "thread-subscribe-button",
            className: "email disqus-footer__item"
        }, a.createElement("div", {
            className: "default"
        }, a.createElement("a", {
            href: "#",
            rel: "nofollow",
            "data-action": "subscribe",
            title: h("Subscribe and get email updates from this discussion"),
            className: "disqus-footer__link"
        }, a.createElement("i", {
            "aria-hidden": "true",
            className: "icon icon-mail"
        }), a.createElement("span", {
            className: "clip"
        }, h("Subscribe")), a.createElement("i", {
            "aria-hidden": "true",
            className: "icon icon-checkmark"
        })))), d(b.forum, ["disableDisqusBranding"], null) ? null : a.createElement("li", {
            className: "install disqus-footer__item"
        }, a.createElement("a", {
            href: "https://publishers.disqus.com/engage?utm_source=" + d(b.forum, ["id"], "") + "&utm_medium=Disqus-Footer",
            rel: "nofollow",
            target: "_blank",
            className: "disqus-footer__link"
        }, a.createElement("i", {
            "aria-hidden": "true",
            className: "icon icon-disqus"
        }), a.createElement("span", {
            className: "clip hidden-sm"
        }, h("Add Disqus to your site")), a.createElement("span", {
            className: "clip visible-sm hidden-xs"
        }, h("Add Disqus")), a.createElement("span", {
            className: "clip visible-xs"
        }, h("Add")))), a.createElement("li", {
            className: "privacy disqus-footer__item"
        }, a.createElement("a", {
            href: "https://help.disqus.com/customer/portal/articles/466259-privacy-policy",
            rel: "nofollow",
            target: "_blank",
            className: "disqus-footer__link"
        }, a.createElement("i", {
            "aria-hidden": "true",
            className: "icon icon-lock"
        }), a.createElement("span", {
            className: "clip"
        }, h("Privacy")))))))
    };
    return i
}),
define("templates/lounge/inthreadAd", ["react", "core/strings"], function(a, b) {
    "use strict";
    var c = b.gettext
      , d = function() {
        return a.createElement("li", {
            className: "post advertisement"
        }, a.createElement("div", {
            className: "post-content",
            "data-role": "post-content"
        }, a.createElement("div", {
            className: "advertisement-comment hidden"
        }, c("Comments continue after advertisement"))))
    };
    return d
}),
define("common/collections/profile", ["core/api", "common/models", "common/collections"], function(a, b, c) {
    "use strict";
    var d = c.PaginatedCollection.extend({
        initialize: function(a, b) {
            this.user = b.user,
            c.PaginatedCollection.prototype.initialize.apply(this, arguments)
        },
        fetch: function(a) {
            return a = a || {},
            a.data = a.data || {},
            a.data.user = this.user.id,
            c.PaginatedCollection.prototype.fetch.call(this, a)
        }
    })
      , e = d.extend({
        model: b.SyncedUser,
        url: a.getURL("users/listFollowing"),
        PER_PAGE: 20
    });
    return {
        SessionPaginatedCollection: d,
        FollowingCollection: e
    }
});
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
    return typeof a
}
: function(a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
}
;
define("lounge/views", ["jquery", "underscore", "backbone", "loglevel", "stance", "moment", "react", "react-dom", "core/analytics/identity", "core/api", "core/UniqueModel", "core/mixins/withAlert", "core/models/ThreadVote", "core/models/Vote", "remote/config", "common/models", "common/utils", "core/bus", "core/strings", "common/urls", "core/analytics/jester", "common/views/mixins", "common/Session", "common/keys", "core/utils", "core/utils/isIframed", "core/utils/html/toRGBColorString", "core/switches", "core/WindowBus", "common/outboundlinkhandler", "core/mixins/withEmailVerifyLink", "shared/urls", "lounge/common", "lounge/menu-handler", "lounge/mixins", "lounge/realtime", "lounge/ads/ads", "lounge/views/posts/PostReplyView", "lounge/views/posts/collection", "lounge/views/media", "lounge/views/onboard-alert", "lounge/views/notification-menu", "lounge/views/highlighted-post", "lounge/views/realtime", "lounge/views/posts/UserSuggestionsManager", "lounge/views/sidebar", "lounge/views/recommend-button", "lounge/tracking", "templates/lounge/userMenu", "templates/lounge/threadShareMenu", "templates/lounge/layout", "templates/lounge/inthreadAd", "templates/lounge/partials/postCount", "templates/lounge/partials/postSort", "common/main", "common/collections/profile"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, $, _, aa) {
    "use strict";
    var ba = window.document
      , ca = s.get
      , da = y.preventDefaultHandler
      , ea = new C
      , fa = c.View.extend({
        events: {
            "click [data-action=subscribe]": "subscribe"
        },
        initialize: function(a) {
            this.thread = a.thread,
            this.session = a.session,
            this.listenTo(this.thread, "change:userSubscription", this.updateStatus),
            this.updateStatus()
        },
        updateStatus: function() {
            this.thread.get("userSubscription") ? this.$el.addClass("subscribed") : this.$el.removeClass("subscribed")
        },
        subscribe: da(function() {
            var a = this.thread.get("userSubscription");
            this.session.isLoggedOut() ? this.subscribeAfterAuthentication() : this.thread.subscribe(!a)
        }),
        subscribeAfterAuthentication: function() {
            this.listenToOnce(this.session, "fetchThreadDetails:success", function() {
                this.session.isLoggedIn() && this.thread.subscribe()
            }),
            this.session.authenticate("disqusDotcom")
        }
    })
      , ga = c.View.extend({
        topEdgeOffset: function() {
            return -G.getLounge().getPosition().height
        },
        initialize: function(a) {
            this.options = a,
            this.hasLoaded = null,
            this.listenToOnce(e(this), "enter", this.loadImage)
        },
        loadImage: function() {
            var a = this;
            if (!a.hasLoaded) {
                var b = function(b) {
                    return function() {
                        a.trigger(b),
                        a.$el.off(".deferredMediaView"),
                        a.relatedPost && G.getLounge().postsView.onDeferredViewReady(a.relatedPost)
                    }
                };
                a.$el.on("load.deferredMediaView", b("load")),
                a.$el.on("error.deferredMediaView", b("error")),
                a.$el.attr("src", a.options.url),
                a.hasLoaded = !0
            }
        }
    })
      , ha = c.View.extend({
        tagName: "ul",
        className: "debug",
        initialize: function(a) {
            this.values = a
        },
        render: function() {
            return this.$el.html(b.reduce(this.values, function(a, b, c) {
                return a + "<li><strong>" + c + "</strong>: " + b + "</li>"
            }, "")),
            this
        }
    })
      , ia = c.View.extend({
        initialize: function(a) {
            this.forum = a.forum,
            this.session = a.session,
            this.thread = a.thread,
            this.listenTo(this.session, "change:id", this.render),
            this.listenTo(this.thread, "change", this.render),
            this.listenTo(N.settings, "change:collapsed", this.onMediaCollapseChange)
        },
        render: function() {
            return h.render(g.createElement(W, {
                user: this.session.toJSON(),
                forum: this.forum.toJSON(),
                thread: this.thread.toJSON(),
                sso: this.session.get("sso")
            }), this.el),
            this.onMediaCollapseChange(),
            this
        },
        onMediaCollapseChange: function() {
            N.settings.get("collapsed") ? this.$el.addClass("media-collapsed") : this.$el.removeClass("media-collapsed")
        }
    })
      , ja = c.View.extend({
        events: {
            "click [data-action=share\\:twitter]": "_onShare",
            "click [data-action=share\\:facebook]": "_onShare"
        },
        _onShare: da(function(a) {
            var b = q.extractService(a.target, "share");
            b && this.sharers[b] && (G.getLounge().trigger("uiAction:threadShare", b),
            this.share(b))
        }),
        render: function() {
            return h.render(g.createElement(X, null), this.el),
            this
        }
    });
    b.extend(ja.prototype, I.ShareMixin);
    var ka = c.View.extend({
        events: {
            "click [data-action^=auth\\:]": "handleAuth",
            "click [data-action=logout]": "handleLogout",
            "click [data-action=audiencesync]": "audienceSync",
            "click [data-action=profile]": "handleShowProfile",
            "click [data-action=community-sidebar]": "handleShowCommunitySidebar",
            "click [data-action=sort]": "handleSort",
            "click [data-action=toggle-thread-premoderate]": "toggleThreadPremoderate",
            "click [data-action=toggle-thread]": "toggleThread",
            "click [data-action=debug]": "renderDebugInfo",
            "click [data-action=repair]": "repairThread",
            "click [data-action=toggle-media]": "toggleMedia",
            "click a": "handleLinkClick"
        },
        initialize: function(c) {
            G.setLounge(this),
            c = c || {};
            var d = c.jsonData || {};
            this.language = ba.documentElement.lang,
            this.initialData = d.response || {},
            this.cleanInitialData(this.initialData),
            this.onboardWindowName = q.globalUniqueId("disqus_"),
            this.initialData.forum && this.initialData.forum.id && (t.moderate = q.updateURL(t.moderate, {
                hostname: this.initialData.forum.id + "."
            })),
            this.deferredViews = [],
            this.unsortedDeferredViews = [],
            this.inthreadAdApps = [],
            this.adPromise = a.Deferred().resolve(),
            w.setDefaults(this.initialData.session),
            this.session = w.get(),
            this.forum = new p.Forum,
            this.forum.set(this.initialData.forum),
            this.thread = new p.Thread(this.initialData.thread,{
                forum: this.forum,
                postCursor: d.cursor,
                moderators: (this.initialData.thread || {}).moderators,
                order: d.order
            }),
            this.initUserSuggestionsManager(),
            this.postsView = new M.PostCollectionView({
                posts: this.thread.posts,
                thread: this.thread,
                lounge: this,
                session: this.session,
                el: this.el,
                userSuggestions: this.userSuggestions
            }),
            this.states = {
                fullyVisible: !1,
                realtimeIndicatorsCreated: !1,
                streamingPaused: !1,
                discoveryLoaded: !1,
                inViewport: !1
            },
            aa.timings.loungeStart = a.now();
            var e = b.bind(this.bootstrap, this);
            z(window) ? this.listenTo(r.frame, "init", e) : b.defer(e),
            this.setAlertSelector("#layout"),
            this.initResizeHandler(),
            this.initAlertListeners()
        },
        cleanInitialData: function(a) {
            var c = a.thread && a.thread.highlightedPost;
            c && (c.isHighlighted = !0),
            b.each(a.posts, function(a) {
                c ? a.isHighlighted = a.id === c.id : a.isHighlighted = !1
            })
        },
        initAlertListeners: function() {
            this.listenTo(this.session, "alert", this.alert)
        },
        initOnboardAlert: function() {
            var a = this.onboardAlert = new O.OnboardAlert({
                session: this.session,
                forum: this.forum
            });
            this.proxyViewEvents(this.onboardAlert),
            this.listenTo(this.session, "change:id", function() {
                a.setInitialCookie(),
                a.render().$el.appendTo("#onboard")
            })
        },
        bootstrap: function(c) {
            var d, e = this, f = {};
            e.config = c = c || q.getConfigFromHash(window),
            e.states.fullyVisible = c.startedFullyVisible,
            c.discovery || (c.discovery = {});
            var g = c.experiment;
            if (g) {
                if (g.experiment && g.variant) {
                    var h = g
                      , k = h.experiment
                      , l = h.variant;
                    k = k.replace(/_hidden$/, ""),
                    B.forceFeature(["experiment", k, l].join(":"))
                }
            } else
                c.experiment = g = {};
            c.apiKey && (f["X-Disqus-Publisher-API-Key"] = c.apiKey),
            b.isObject(c.remoteAuthS3) && b.isEmpty(c.remoteAuthS3) ? c.remoteAuthS3 = null : f["X-Disqus-Remote-Auth"] = c.remoteAuthS3,
            b.isEmpty(f) || j.headers(f),
            c.anchorColor && (d = A(c.anchorColor),
            q.addStylesheetRules([[".publisher-anchor-color a", ["color", d, !0]], ["a.publisher-anchor-color", ["color", d, !0]], [".publisher-anchor-hover a:hover", ["color", d, !0]], ["a.publisher-anchor-hover:hover", ["color", d, !0]], [".active .publisher-nav-color:after", ["background", d, !0]], [".media-preview .active.publisher-border-color", ["border-color", d, !0]], [".publisher-color", ["color", d, !1]], [".publisher-color:hover", ["color", d, !1]], [".publisher-background-color", ["background-color", d, !1]], [".publisher-border-color", ["border-color", d, !1]]])),
            c.impressionId && i.impression.setImpressionId(c.impressionId),
            q.injectBaseElement(),
            c.referrer && (e.thread.currentUrl = c.referrer),
            !this.config.inthreadLeadingCommentCount && this.config.inthreadShowAfterComment ? (this.config.inthreadMultipleAds = !1,
            this.config.inthreadLeadingCommentCount = Number(this.config.inthreadShowAfterComment),
            this.config.inthreadRepeatCommentCount = Number.MAX_VALUE,
            this.config.inthreadTrailingCommentCount = Number(this.config.inthreadMinimumCommentCount) - Number(this.config.inthreadShowAfterComment)) : this.config.inthreadLeadingCommentCount && (this.config.inthreadLeadingCommentCount = Number(this.config.inthreadLeadingCommentCount),
            this.config.inthreadRepeatCommentCount = Number(this.config.inthreadRepeatCommentCount),
            this.config.inthreadTrailingCommentCount = Number(this.config.inthreadTrailingCommentCount));
            var m = this.getPermalinkOptions(c.parentWindowHash);
            m && r.frame.once("embed.rendered", b.bind(e.scrollToPost, e, m.postId, m.options)),
            c.sso && e.session.set("sso", c.sso),
            c.initialPosition ? e.position = c.initialPosition : e.position = q.calculatePositionFullscreen(),
            e.initLinkAffiliation(),
            e.updateModeratorBadgeText(),
            e.initUI(),
            e.bindBusListeners(),
            e.initHighlightedPost(),
            e.loadDiscovery();
            var n = aa.timings;
            n.hostStart = c.timestamp || n.initStart,
            n.embedLoadTime = c.embedLoadTime,
            e.listenToOnce(e.postsView, "render:start", function() {
                n.renderStart = a.now()
            }),
            e.listenToOnce(e.postsView, "render:end", e.sendTelemetry),
            n.bootstrapStart = a.now(),
            e.postsView.bootstrap(e.initialData, m),
            e.initAfterPostCreateHandler(),
            e.initSession(),
            e.initLinkHandler(),
            e.initialized = !0,
            e.trigger("bootstrap:complete", e)
        },
        _isInHome: function(a, b) {
            var c = /^(?:https?:)?\/\/(?:www.)?/;
            return a = a.replace(c, ""),
            b = b.replace(c, ""),
            0 === a.indexOf(b)
        },
        isInHome: function() {
            var a = this.config.referrer;
            if (a)
                return this._isInHome(a, F.apps.home + "home/")
        },
        initSession: function() {
            var a = this.config
              , b = this.session
              , c = this.thread;
            b.start({
                remoteAuthS3: a.remoteAuthS3,
                sso: a.sso,
                apiKey: a.apiKey,
                thread: c
            })
        },
        initLinkAffiliation: function() {
            if (this.isLinkAffiliatorEnabled() && !this.initLinkAffiliatorCalled) {
                this.initLinkAffiliatorCalled = !0;
                var a = B.isFeatureActive("viglinkv2", {
                    forum: this.forum.id
                }) && V.shouldTrack(this.forum, this.session.user) ? t.linkAffiliatorClientV2 : t.linkAffiliatorClient;
                r.frame.sendHostMessage("viglink:init", {
                    clientUrl: a,
                    apiUrl: t.linkAffiliatorAPI,
                    key: x.viglinkAPI,
                    id: this.forum.get("pk")
                })
            }
        },
        initAfterPostCreateHandler: function() {
            this.listenTo(this.thread, "create", function(a) {
                var c = a.toJSON();
                r.frame.sendHostMessage("posts.create", c),
                ea.broadcast("posts.create", b.pick(c, "forum", "parent", "id"))
            })
        },
        sendTelemetry: function() {
            if (q.shouldSample(o.lounge.telemetry_sample_percent)) {
                var c = a.now()
                  , d = aa.timings
                  , e = {
                    embed: d.embedLoadTime,
                    frame: d.initStart - d.hostStart,
                    asset: d.downloadEnd - d.initStart,
                    render: c - d.renderStart,
                    total: c - d.hostStart - (d.renderStart - d.bootstrapStart)
                }
                  , f = window.performance;
                if (f) {
                    var g = f.timing;
                    g.responseStart && (e.frame_rtt = g.responseStart - g.navigationStart);
                    var h = b.find(f.getEntries && f.getEntries() || [], function(a) {
                        return a.name.indexOf("/next/config.js") > -1
                    });
                    h && h.responseStart && (e.config_rtt = h.responseStart - h.startTime)
                }
                var i = "lounge_" + ("static" === this.config.experiment.service ? "static" : "dynamic");
                return u.telemetry(i, e)
            }
        },
        initUI: function() {
            this.applyPublisherClasses(),
            this.renderLayout(),
            this.setAlertSelector("#global-alert"),
            this.bindUIUpdateHandlers(),
            this.initDeferredViews(),
            this.postsView.once("render:end", function() {
                var a = q.getPageHeight();
                r.frame.sendHostMessage("rendered", {
                    height: a
                }),
                this._lastHeight = a,
                this.initRealtime()
            }, this),
            b.defer(b.bind(this.initUIComponents, this))
        },
        initUIComponents: function() {
            this.initMainPostBox(),
            this.updatePostCount(),
            this.isInHome() || (this.initUserMenu(),
            this.initOnboardAlert(),
            this.initNotificationMenu(),
            this.initRecommendButton(),
            this.initThreadShareMenu()),
            this.initThreadSubscribe(),
            this.bindProfileUIListeners(this.session)
        },
        initHighlightedPost: function() {
            var b = this.thread.get("highlightedPost");
            b && this.thread.posts.add(b),
            this.highlightedPostView = new Q.HighlightedPostView({
                el: a("#highlighted-post"),
                thread: this.thread,
                session: this.session,
                userSuggestions: this.userSuggestions
            }),
            this.highlightedPostView.reset()
        },
        bindUIUpdateHandlers: function() {
            var a = this
              , b = a.thread
              , c = a.session;
            a.listenTo(b, {
                "change:posts": a.updatePostCount
            }),
            a.listenTo(b.queue, "add reset", a.toggleRealtimeNotifications),
            a.postsView.bindUIUpdateHandlers(),
            a.listenTo(c, "change:id", a.updateThreadSessionData),
            a.listenTo(a, "scrollOffViewport", function() {
                this.states.realtimeIndicatorsCreated && r.frame.sendHostMessage("indicator:hide")
            }),
            a.listenTo(a, "scroll", function(a) {
                this.position = a
            }),
            a.listenTo(a, "scroll", a.handleRealtimeScroll),
            a.listenTo(a.postsView, "render:end", function() {
                a.toggleRealtimeNotifications(),
                a.config.inthreadPlacementUrl && a.loadInthreadAd()
            })
        },
        whenFullyVisible: function() {
            var b = a.Deferred();
            return this.states.fullyVisible ? b.resolve() : this.listenTo(this, "frame.visible", function() {
                b.resolve()
            }),
            b.promise()
        },
        canShowInthreadAd: function(a, b) {
            if (!this.config.inthreadMultipleAds && a > 0)
                return !1;
            var c = this.config.inthreadLeadingCommentCount + this.config.inthreadRepeatCommentCount * a
              , d = c + this.config.inthreadTrailingCommentCount;
            return b >= d
        },
        inthreadAdInit: function(b, c) {
            var d = a.Deferred();
            return this.inthreadAdApps[b].init(),
            this.listenToOnce(this.inthreadAdApps[b], "frame:ready", function() {
                c.css("height", "auto"),
                c.find(".advertisement-comment").removeClass("hidden"),
                d.resolve()
            }),
            d.promise()
        },
        loadInthreadAd: function() {
            var c = this.postsView.$el.find("#post-list");
            if (!c.hasClass("loading"))
                for (var d = this.config.inthreadCountChildren ? c.find(".post:not(.advertisement)") : c.children(":not(.advertisement)"), e = this.inthreadAdApps.length; this.canShowInthreadAd(e, d.length); e++) {
                    var f = this.config.inthreadLeadingCommentCount + this.config.inthreadRepeatCommentCount * e
                      , g = a(Z());
                    g.insertBefore(d[f]),
                    this.inthreadAdApps[e] = K.Ads(b.extend({
                        adUrl: this.config.inthreadPlacementUrl,
                        placement: "inthread",
                        container: g.find("[data-role=post-content]")[0],
                        isInHome: this.isInHome(),
                        forumId: this.forum.get("pk"),
                        version: this.config.version
                    }, this.config));
                    var h = this.inthreadAdInit.bind(this, e, g);
                    0 === e ? this.adPromise = this.whenFullyVisible().then(h) : this.adPromise = this.adPromise.then(h)
                }
        },
        relayScrollToStance: function(a) {
            e.scroll({
                top: a.pageOffset - a.frameOffset.top,
                height: a.height
            })
        },
        initDeferredViews: function() {
            this.listenTo(this, "scroll", this.createDeferredViewsForImages),
            this.listenTo(this, "domReflow", function() {
                e.invalidate(),
                this.position && (this.createDeferredViewsForImages(),
                this.relayScrollToStance(this.position))
            })
        },
        bindBusListeners: function() {
            this.listenTo(r.frame, {
                "window.hashchange": function(a) {
                    var b = this.getPermalinkOptions(a);
                    b && this.scrollToPost(b.postId, b.options)
                },
                "window.scroll": function(a) {
                    this.trigger("scroll", a),
                    this.relayScrollToStance(a)
                },
                "window.inViewport": function() {
                    this.states.inViewport = !0,
                    this.trigger("inViewport")
                },
                "window.scrollOffViewport": function() {
                    this.states.inViewport = !1,
                    this.trigger("scrollOffViewport")
                },
                "frame.visible": function() {
                    this.states.fullyVisible = !0,
                    this.trigger("frame.visible")
                },
                "window.resize": this.resize,
                "indicator:click": this.handleRealtimeClick
            }),
            this.listenToOnce(this.session, "change:id", this.initSidebar)
        },
        isLinkAffiliatorEnabled: function() {
            return this.forum.get("settings").linkAffiliationEnabled && !this.isInHome()
        },
        initLinkHandler: function() {
            this.outboundLinkHandler = new D,
            this.outboundLinkHandler.registerBeforeNavigationHandler(this.logLinkClick, this)
        },
        handleLinkClick: function(a) {
            this.outboundLinkHandler.handleClick(a)
        },
        initRealtimeIndicators: function() {
            var a = this;
            if (!a.states.realtimeIndicatorsCreated) {
                var c = ["north", "south"].reduce(function(c, d) {
                    return c[d] = {
                        contents: '\n<!DOCTYPE html>\n<html lang="' + b.escape(a.language) + '">\n    <head>\n        <meta charset="utf-8">\n        <title>Disqus Realtime Notification</title>\n    </head>\n    <body>\n        <link rel="stylesheet" href="' + b.escape("https://c.disquscdn.com/next/embed/styles/realtime.af77184dec69e96e69aff958ae2bb738.css") + '">\n        <div class="' + b.escape(d) + '" id="message">-</div>\n    </body>\n</html>\n'
                    },
                    c
                }, {});
                r.frame.sendHostMessage("indicator:init", c),
                a.states.realtimeIndicatorsCreated = !0
            }
        },
        insertStreamingComments: b.throttle(function() {
            var a = this.thread.queue;
            a.drain(),
            b.each(a.counters.replies, function(b, c) {
                a.drain(c)
            })
        }, 1e3),
        updateModeratorBadgeText: function() {
            var a = this.forum.get("moderatorBadgeText");
            a && (s.translations.Mod = a)
        },
        logLinkClick: function(b) {
            var c = a(b.currentTarget);
            if (y.clickShouldBeLogged(b, c))
                return u.client.emit({
                    verb: "click",
                    object_type: "link",
                    object_id: c[0].href,
                    area: V.getEventTrackingArea(b)
                })
        },
        handleRealtimeScroll: function(a) {
            if (this.states.inViewport && this.states.realtimeIndicatorsCreated) {
                var c = b.union([this.queueView], b.values(this.postsView.subViews))
                  , d = 0
                  , e = 0;
                b.each(c, function(b) {
                    if (b && !b.getDirection && (b = b.queueView),
                    b && !(b.options.count <= 0)) {
                        var c = b.getDirection(a);
                        1 === c ? d += b.options.count : c === -1 && (e += b.options.count)
                    }
                });
                var f, g, h = function(a) {
                    var c = a.orientation
                      , d = a.num
                      , e = void 0;
                    return e = "north" === c ? 1 === d ? ca("One new comment above.") : s.interpolate(ca("%(num)s new comments above."), {
                        num: d
                    }) : 1 === d ? ca("One new comment below.") : s.interpolate(ca("%(num)s new comments below."), {
                        num: d
                    }),
                    "<p>" + b.escape(e) + "</p>"
                };
                g = {
                    type: "north"
                },
                d > 0 ? (f = "indicator:show",
                g.content = h({
                    num: d,
                    orientation: "north"
                })) : f = "indicator:hide",
                r.frame.sendHostMessage(f, g),
                g = {
                    type: "south"
                },
                e > 0 ? (g.content = h({
                    num: e,
                    orientation: "south"
                }),
                f = "indicator:show") : f = "indicator:hide",
                r.frame.sendHostMessage(f, g)
            }
        },
        handleRealtimeClick: function(a) {
            var c = this;
            r.frame.sendHostMessage("indicator:hide", {
                type: a
            });
            var d, e, f, g = b.union([c], b.toArray(c.postsView.subViews));
            g = b.filter(g, function(b) {
                if (b = b.queueView,
                !b || b.options.count <= 0)
                    return !1;
                var d = "north" === a ? 1 : -1;
                return b.getDirection(c.position) === d
            }),
            g = b.sortBy(g, function(a) {
                return a === c ? 0 : a.offset.top
            }),
            d = "north" === a ? b.last(g) : b.first(g),
            e = d.queueView,
            d === c ? (f = 0,
            e.handleDrain()) : (f = d.offset.top - 100,
            e.handleDrain()),
            G.getLounge().once("domReflow", b.bind(r.frame.sendHostMessage, r.frame, "scrollTo", {
                top: f
            }))
        },
        toggleRealtimeNotifications: function() {
            var c = this
              , d = c.thread.queue;
            if (b.defer(function() {
                r.frame.sendHostMessage("fakeScroll")
            }),
            !d.length)
                return void a("[data-role=realtime-notification]").hide();
            if (c.thread.get("hasStreaming"))
                return void c.insertStreamingComments();
            if (d.counters.comments) {
                var e = c.queueView || new R.QueuedPostView({
                    model: c.thread,
                    el: c.$el.find("button[data-role=realtime-notification]")
                });
                c.queueView = e,
                e.setCount(d.counters.comments),
                e.render()
            }
            b.each(d.counters.replies, function(a, b) {
                var d = c.thread.posts.get(b);
                if (d) {
                    var e = c.postsView.getPostView(d.cid);
                    if (e) {
                        var f = e.queueView;
                        f || (f = new R.QueuedReplyView({
                            thread: c.thread,
                            postView: e,
                            model: d,
                            el: e.$el.find("[data-role=realtime-notification\\:" + b + "] a")
                        }),
                        e.queueView = f),
                        f.setCount(a),
                        f.render()
                    }
                }
            })
        },
        renderDebugInfo: da(function() {
            if (this.session.user.get("isGlobalAdmin")) {
                var a = this.thread.forum.get("settings", {})
                  , b = new ha({
                    Shortname: this.thread.get("forum"),
                    "Thread ID": this.thread.get("id"),
                    "Org ID": this.forum.get("organizationId"),
                    "Thread slug": this.thread.get("slug"),
                    "Anchor color": A(this.config.anchorColor),
                    Language: this.thread.forum.get("language"),
                    "Ads enabled": a.adsEnabled,
                    "Ads top enabled": a.adsPositionTopEnabled,
                    "Ads bottom enabled": a.adsPositionBottomEnabled,
                    "Ads in-thread enabled": a.adsPositionInthreadEnabled,
                    "In iframe": this.config.isHostIframed,
                    "Behind click": this.config.isBehindClick,
                    "Height restricted": this.config.isHeightRestricted
                });
                b.render();
                var c = ba.body;
                c.insertBefore(b.el, c.firstChild)
            }
        }),
        repairThread: da(function() {
            this.session.user.get("isGlobalAdmin") && j.call("internal/threads/repair.json", {
                method: "GET",
                data: {
                    thread: this.thread.get("id")
                },
                success: b.bind(this.alert, this, "Thread repair has been queued. Refresh in a few seconds."),
                error: b.bind(this.alert, this, "An error occurred while repairing thread. Please try again.", {
                    type: "error"
                })
            })
        }),
        getPermalinkOptions: function(a) {
            var b = a && a.match(/(comment|reply|edit)-([0-9]+)/);
            if (b)
                return {
                    postId: b[2],
                    options: {
                        highlight: !0,
                        openReply: "reply" === b[1],
                        openEdit: "edit" === b[1]
                    }
                }
        },
        scrollToPost: function(a, c) {
            c = c || {},
            c.padding = c.padding || 90;
            var d = this
              , e = d.$el.find("#post-" + a);
            return e.length ? (c.highlight && (d.$el.find(".post-content.target").removeClass("target"),
            e.find(".post-content").first().addClass("target")),
            c.openReply && d.postsView.openReply(a),
            c.openEdit && d.postsView.openEdit(a),
            void r.frame.sendHostMessage("scrollTo", {
                top: e.offset().top - c.padding,
                force: c.force || null
            })) : void p.Post.fetchContext(a, d.thread, {
                requestedByPermalink: !0
            }).done(function() {
                r.frame.once("embed.resized", b.bind(d.scrollToPost, d, a, c))
            })
        },
        updateThreadSessionData: function(a) {
            if (a) {
                a.get("thread") && this.thread.set(a.get("thread"));
                var c = a.get("votes");
                c && "object" === ("undefined" == typeof c ? "undefined" : _typeof(c)) && b.each(c, function(a, b) {
                    var c = this.postsView.posts.get(b);
                    c && c.set("userScore", a)
                }, this)
            }
        },
        initSidebar: function() {
            this.sidebar = new T({
                session: this.session,
                forum: this.forum
            })
        },
        initNotificationMenu: function() {
            var a = this.notificationMenu = new P.NotificationMenuView({
                el: this.$el.find("[data-role=notification-menu]")[0],
                session: this.session,
                forum: this.forum
            });
            a.render()
        },
        initUserMenu: function() {
            var a = this.userMenu = new ia({
                el: this.$el.find("[data-role=logout]")[0],
                forum: this.forum,
                session: this.session,
                thread: this.thread
            });
            a.render()
        },
        initThreadShareMenu: function() {
            var b = this.threadShareMenu = new ja({
                el: a("#thread-share-menu")[0],
                model: this.thread
            });
            b.render()
        },
        loadDiscovery: function() {
            var a = this;
            a.config.discoveryDisabled || a.config.discovery && a.config.discovery.disable_all && (!a.forum.get("settings").discoveryLocked || a.isInHome()) || a.forum.get("settings").organicDiscoveryEnabled && (a.states.discoveryLoaded || (a.states.discoveryLoaded = !0,
            aa.loadCss("rtl" === ba.documentElement.dir ? "https://c.disquscdn.com/next/embed/styles/discovery_rtl.abfc6d5ee00d56a87fcb3d3311575f30.css" : "https://c.disquscdn.com/next/embed/styles/discovery.539723090a04fba1b162858415868357.css"),
            require(["discovery/main"], function(b) {
                a.initDiscovery(b)
            }, function() {
                u.logStat("lounge.discovery.module_load_fail")
            })))
        },
        initDiscovery: function(a) {
            var b = this.config.experiment || {}
              , c = a.init(this.thread, {
                experiment: b.experiment,
                variant: b.variant,
                service: b.service,
                homeDiscoveryEnabled: this.config.homeDiscoveryEnabled
            });
            return c ? c : void d.debug("Discovery seems not enabled. Check switches or forum settings.")
        },
        isRealtimeEnabled: function() {
            var a = o.lounge.REALTIME || {}
              , b = a.THREAD_STALE_DAYS || 7
              , c = f.unix(this.initialData.lastModified);
            return !this.thread.get("isClosed") && f().diff(c, "days") <= b
        },
        realtimeHandlers: {
            Post: function(a) {
                var b = a.data
                  , c = this.thread;
                if (!this.thread.get("hasStreaming") || !this.states.streamingPaused) {
                    if (!b.id)
                        return void d.warn("RT: no post ID");
                    if (!b.author || !b.author.id)
                        return void d.warn("RT: no author or author ID");
                    if (!b.author.name)
                        return void d.warn("RT: no author name or email hash");
                    if (!b.author.username)
                        return void d.warn("RT: no author username");
                    if (!b.post || !b.post.message)
                        return void d.warn("RT: no post message");
                    if (c.posts.get(b.id) || c.queue.get(b.id))
                        return void d.info("RT: duplicate: ", b.id);
                    if ("approved" !== b.type)
                        return void d.info("RT: unnaproved: ", b.id);
                    if (b.sb)
                        return void d.info("RT: shadowbanned: ", b.id);
                    if (b.type === b.type_prev)
                        return void d.info("RT: Post change message, ignoring for now ", b.id);
                    this.thread.incrementPostCount(1);
                    var e = b.post.parent_post.id;
                    if ("0" === e && (e = null),
                    e && !c.posts.get(e) && !c.queue.get(e))
                        return void d.info("RT: parent is not on this page: ", b.id);
                    var f = b.author.name
                      , g = b.author.username
                      , h = b.author.avatar
                      , i = b.author.id;
                    "0" === i && (i = void 0);
                    var j = new k(p.User,{
                        id: i,
                        name: f,
                        username: g,
                        profileUrl: t.root + "/by/" + g + "/",
                        isAnonymous: !i,
                        avatar: {
                            cache: h,
                            permalink: h
                        }
                    });
                    if (j.get("isBlocked"))
                        return void d.info("RT: blocked: ", b.id);
                    c.users.add(j, {
                        merge: !0
                    }),
                    c.queue.add({
                        id: b.id,
                        user: j,
                        parentId: e,
                        message: b.post.message,
                        createdAt: b.date,
                        media: b.post.media
                    })
                }
            },
            Vote: function(a) {
                var b = a.data;
                if (b.id && b.vote) {
                    var c = this.thread
                      , e = c.posts.get(b.vote.recipient_post_id);
                    if (e) {
                        d.debug("RT: Vote for post ", e.id);
                        var f = e.votes.get(b.id);
                        f || (d.debug("RT: Creating new vote with id ", b.id),
                        f = new n({
                            id: b.id
                        }),
                        e.votes.add(f));
                        var g = e._vote(b.vote.vote, f.get("score"), b.voter);
                        0 !== g && f.set("score", g)
                    }
                }
            },
            ThreadVote: function(a) {
                var b = a.data
                  , c = this.thread;
                if (b.id && b.vote && (!this.session.user.id || b.vote.voter_id !== this.session.user.id)) {
                    var d = c.votes.get(b.id);
                    if (d || (d = new m({
                        id: b.id
                    }),
                    c.votes.add(d)),
                    !d.get("currentUser")) {
                        var e = c._vote(b.vote.vote, d.get("score"));
                        0 !== e && d.set("score", e)
                    }
                }
            },
            typing: function(a) {
                var c = a.data
                  , d = this.thread
                  , e = c.typing
                  , f = c.post;
                if (c.thread === d.id && f) {
                    var g = d.posts.get(f);
                    g && (g.usersTyping.count() <= 0 && !e || g.usersTyping.add(p.TypingUser.make(b.extend({
                        client_context: a.lastEventId
                    }, c))))
                }
            }
        },
        initRealtime: function() {
            var a = J.Manager;
            if (!a.pipe && this.isRealtimeEnabled()) {
                this.initRealtimeIndicators(),
                a.initialize("thread/" + this.thread.id, this.realtimeHandlers, this);
                var b = function(a) {
                    return "POST" === a.method
                }
                  , c = 0;
                this.listenTo(j, "call", function(d) {
                    b(d) && (c += 1,
                    a.pause())
                }),
                this.listenTo(j, "complete", function(d) {
                    b(d) && (c <= 0 || (c -= 1,
                    c || a.resume()))
                })
            }
        },
        initRecommendButton: function() {
            if (this.recommendButton && this.recommendButton.remove(),
            !B.isFeatureActive("sso_less_branding", {
                forum: this.forum.id
            })) {
                var c = this.recommendButton = new U({
                    thread: this.thread,
                    session: this.session
                });
                this.listenTo(c, {
                    "vote:like": b.bind(this.trigger, this, "uiAction:threadLike"),
                    "vote:unlike": b.bind(this.trigger, this, "uiAction:threadUnlike")
                }),
                c.render(),
                a("#recommend-button").append(c.el)
            }
        },
        initThreadSubscribe: function() {
            this.threadSubscribeButton = new fa({
                session: this.session,
                thread: this.thread,
                el: a("#thread-subscribe-button")[0]
            })
        },
        updatePostCount: function() {
            var a = this.thread.get("posts");
            this.isInHome() || (this.$postCountContainer = this.$postCountContainer || this.$("li[data-role=post-count]"),
            this.$postCountContainer.html($({
                count: a
            }))),
            r.frame.sendHostMessage("posts.count", a)
        },
        renderLayout: function() {
            this.addFeatureDetectionClasses(),
            H.init();
            var b = this.isInHome()
              , c = this.config.experiment
              , d = a(Y({
                thread: this.thread.toJSON(),
                forum: this.forum.toJSON(),
                order: this.thread.posts.getOrder(),
                inHome: b,
                hideFooter: b || c && "adsapart" === c.experiment && "force_gamma_nofooter" === c.variant
            }));
            d.appendTo(this.$el),
            this.postsView.renderLayout(),
            o.readonly ? this.alert(ca("The Disqus comment system is temporarily in maintenance mode. You can still read comments during this time, however posting comments and other actions are temporarily delayed."), {
                type: "info"
            }) : this.listenToOnce(this.session, "change:id", this.showPremoderationAlert)
        },
        showPremoderationAlert: function() {
            this.thread.isModerator(this.session.user) && !this.getAlert() && (this.forum.get("settings").validateAllPosts ? this.alert(b.escape(ca("Comments on this entire site are premoderated (only moderators can see this message).")) + (' <a href="' + b.escape("https://" + this.forum.id + ".disqus.com/admin/settings/community/") + '" target="_blank" rel="noopener noreferrer">' + b.escape(ca("Change site settings.")) + "</a>"), {
                safe: !0,
                isPremoderateStatus: !0
            }) : this.thread.get("validateAllPosts") && this.alert(ca("Comments on this thread are premoderated (only moderators can see this message)."), {
                isPremoderateStatus: !0
            }))
        },
        dismissPremoderationAlert: function() {
            this.dismissAlert(function(a) {
                return a.options &
