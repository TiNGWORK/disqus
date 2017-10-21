//common.bundle.js
var requirejs, require, define;
!function(global, setTimeout) {
    function commentReplace(a, b) {
        return b || ""
    }
    function isFunction(a) {
        return "[object Function]" === ostring.call(a)
    }
    function isArray(a) {
        return "[object Array]" === ostring.call(a)
    }
    function each(a, b) {
        if (a) {
            var c;
            for (c = 0; c < a.length && (!a[c] || !b(a[c], c, a)); c += 1)
                ;
        }
    }
    function eachReverse(a, b) {
        if (a) {
            var c;
            for (c = a.length - 1; c > -1 && (!a[c] || !b(a[c], c, a)); c -= 1)
                ;
        }
    }
    function hasProp(a, b) {
        return hasOwn.call(a, b)
    }
    function getOwn(a, b) {
        return hasProp(a, b) && a[b]
    }
    function eachProp(a, b) {
        var c;
        for (c in a)
            if (hasProp(a, c) && b(a[c], c))
                break
    }
    function mixin(a, b, c, d) {
        return b && eachProp(b, function(b, e) {
            !c && hasProp(a, e) || (!d || "object" != typeof b || !b || isArray(b) || isFunction(b) || b instanceof RegExp ? a[e] = b : (a[e] || (a[e] = {}),
            mixin(a[e], b, c, d)))
        }),
        a
    }
    function bind(a, b) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    function scripts() {
        return document.getElementsByTagName("script")
    }
    function defaultOnError(a) {
        throw a
    }
    function getGlobal(a) {
        if (!a)
            return a;
        var b = global;
        return each(a.split("."), function(a) {
            b = b[a]
        }),
        b
    }
    function makeError(a, b, c, d) {
        var e = new Error(b + "\nhttp://requirejs.org/docs/errors.html#" + a);
        return e.requireType = a,
        e.requireModules = d,
        c && (e.originalError = c),
        e
    }
    function newContext(a) {
        function b(a) {
            var b, c;
            for (b = 0; b < a.length; b++)
                if (c = a[b],
                "." === c)
                    a.splice(b, 1),
                    b -= 1;
                else if (".." === c) {
                    if (0 === b || 1 === b && ".." === a[2] || ".." === a[b - 1])
                        continue;
                    b > 0 && (a.splice(b - 1, 2),
                    b -= 2)
                }
        }
        function c(a, c, d) {
            var e, f, g, h, i, j, k, l, m, n, o, p, q = c && c.split("/"), r = x.map, s = r && r["*"];
            if (a && (a = a.split("/"),
            k = a.length - 1,
            x.nodeIdCompat && jsSuffixRegExp.test(a[k]) && (a[k] = a[k].replace(jsSuffixRegExp, "")),
            "." === a[0].charAt(0) && q && (p = q.slice(0, q.length - 1),
            a = p.concat(a)),
            b(a),
            a = a.join("/")),
            d && r && (q || s)) {
                g = a.split("/");
                a: for (h = g.length; h > 0; h -= 1) {
                    if (j = g.slice(0, h).join("/"),
                    q)
                        for (i = q.length; i > 0; i -= 1)
                            if (f = getOwn(r, q.slice(0, i).join("/")),
                            f && (f = getOwn(f, j))) {
                                l = f,
                                m = h;
                                break a
                            }
                    !n && s && getOwn(s, j) && (n = getOwn(s, j),
                    o = h)
                }
                !l && n && (l = n,
                m = o),
                l && (g.splice(0, m, l),
                a = g.join("/"))
            }
            return e = getOwn(x.pkgs, a),
            e ? e : a
        }
        function d(a) {
            isBrowser && each(scripts(), function(b) {
                if (b.getAttribute("data-requiremodule") === a && b.getAttribute("data-requirecontext") === u.contextName)
                    return b.parentNode.removeChild(b),
                    !0
            })
        }
        function e(a) {
            var b = getOwn(x.paths, a);
            if (b && isArray(b) && b.length > 1)
                return b.shift(),
                u.require.undef(a),
                u.makeRequire(null, {
                    skipMap: !0
                })([a]),
                !0
        }
        function f(a) {
            var b, c = a ? a.indexOf("!") : -1;
            return c > -1 && (b = a.substring(0, c),
            a = a.substring(c + 1, a.length)),
            [b, a]
        }
        function g(a, b, d, e) {
            var g, h, i, j, k = null, l = b ? b.name : null, m = a, n = !0, o = "";
            return a || (n = !1,
            a = "_@r" + (F += 1)),
            j = f(a),
            k = j[0],
            a = j[1],
            k && (k = c(k, l, e),
            h = getOwn(C, k)),
            a && (k ? o = d ? a : h && h.normalize ? h.normalize(a, function(a) {
                return c(a, l, e)
            }) : a.indexOf("!") === -1 ? c(a, l, e) : a : (o = c(a, l, e),
            j = f(o),
            k = j[0],
            o = j[1],
            d = !0,
            g = u.nameToUrl(o))),
            i = !k || h || d ? "" : "_unnormalized" + (G += 1),
            {
                prefix: k,
                name: o,
                parentMap: b,
                unnormalized: !!i,
                url: g,
                originalName: m,
                isDefine: n,
                id: (k ? k + "!" + o : o) + i
            }
        }
        function h(a) {
            var b = a.id
              , c = getOwn(y, b);
            return c || (c = y[b] = new u.Module(a)),
            c
        }
        function i(a, b, c) {
            var d = a.id
              , e = getOwn(y, d);
            !hasProp(C, d) || e && !e.defineEmitComplete ? (e = h(a),
            e.error && "error" === b ? c(e.error) : e.on(b, c)) : "defined" === b && c(C[d])
        }
        function j(a, b) {
            var c = a.requireModules
              , d = !1;
            b ? b(a) : (each(c, function(b) {
                var c = getOwn(y, b);
                c && (c.error = a,
                c.events.error && (d = !0,
                c.emit("error", a)))
            }),
            d || req.onError(a))
        }
        function k() {
            globalDefQueue.length && (each(globalDefQueue, function(a) {
                var b = a[0];
                "string" == typeof b && (u.defQueueMap[b] = !0),
                B.push(a)
            }),
            globalDefQueue = [])
        }
        function l(a) {
            delete y[a],
            delete z[a]
        }
        function m(a, b, c) {
            var d = a.map.id;
            a.error ? a.emit("error", a.error) : (b[d] = !0,
            each(a.depMaps, function(d, e) {
                var f = d.id
                  , g = getOwn(y, f);
                !g || a.depMatched[e] || c[f] || (getOwn(b, f) ? (a.defineDep(e, C[f]),
                a.check()) : m(g, b, c))
            }),
            c[d] = !0)
        }
        function n() {
            var a, b, c = 1e3 * x.waitSeconds, f = c && u.startTime + c < (new Date).getTime(), g = [], h = [], i = !1, k = !0;
            if (!s) {
                if (s = !0,
                eachProp(z, function(a) {
                    var c = a.map
                      , j = c.id;
                    if (a.enabled && (c.isDefine || h.push(a),
                    !a.error))
                        if (!a.inited && f)
                            e(j) ? (b = !0,
                            i = !0) : (g.push(j),
                            d(j));
                        else if (!a.inited && a.fetched && c.isDefine && (i = !0,
                        !c.prefix))
                            return k = !1
                }),
                f && g.length)
                    return a = makeError("timeout", "Load timeout for modules: " + g, null, g),
                    a.contextName = u.contextName,
                    j(a);
                k && each(h, function(a) {
                    m(a, {}, {})
                }),
                f && !b || !i || !isBrowser && !isWebWorker || w || (w = setTimeout(function() {
                    w = 0,
                    n()
                }, 50)),
                s = !1
            }
        }
        function o(a) {
            hasProp(C, a[0]) || h(g(a[0], null, !0)).init(a[1], a[2])
        }
        function p(a, b, c, d) {
            a.detachEvent && !isOpera ? d && a.detachEvent(d, b) : a.removeEventListener(c, b, !1)
        }
        function q(a) {
            var b = a.currentTarget || a.srcElement;
            return p(b, u.onScriptLoad, "load", "onreadystatechange"),
            p(b, u.onScriptError, "error"),
            {
                node: b,
                id: b && b.getAttribute("data-requiremodule")
            }
        }
        function r() {
            var a;
            for (k(); B.length; ) {
                if (a = B.shift(),
                null === a[0])
                    return j(makeError("mismatch", "Mismatched anonymous define() module: " + a[a.length - 1]));
                o(a)
            }
            u.defQueueMap = {}
        }
        var s, t, u, v, w, x = {
            waitSeconds: 7,
            baseUrl: "./",
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, y = {}, z = {}, A = {}, B = [], C = {}, D = {}, E = {}, F = 1, G = 1;
        return v = {
            require: function(a) {
                return a.require ? a.require : a.require = u.makeRequire(a.map)
            },
            exports: function(a) {
                if (a.usingExports = !0,
                a.map.isDefine)
                    return a.exports ? C[a.map.id] = a.exports : a.exports = C[a.map.id] = {}
            },
            module: function(a) {
                return a.module ? a.module : a.module = {
                    id: a.map.id,
                    uri: a.map.url,
                    config: function() {
                        return getOwn(x.config, a.map.id) || {}
                    },
                    exports: a.exports || (a.exports = {})
                }
            }
        },
        t = function(a) {
            this.events = getOwn(A, a.id) || {},
            this.map = a,
            this.shim = getOwn(x.shim, a.id),
            this.depExports = [],
            this.depMaps = [],
            this.depMatched = [],
            this.pluginMaps = {},
            this.depCount = 0
        }
        ,
        t.prototype = {
            init: function(a, b, c, d) {
                d = d || {},
                this.inited || (this.factory = b,
                c ? this.on("error", c) : this.events.error && (c = bind(this, function(a) {
                    this.emit("error", a)
                })),
                this.depMaps = a && a.slice(0),
                this.errback = c,
                this.inited = !0,
                this.ignore = d.ignore,
                d.enabled || this.enabled ? this.enable() : this.check())
            },
            defineDep: function(a, b) {
                this.depMatched[a] || (this.depMatched[a] = !0,
                this.depCount -= 1,
                this.depExports[a] = b)
            },
            fetch: function() {
                if (!this.fetched) {
                    this.fetched = !0,
                    u.startTime = (new Date).getTime();
                    var a = this.map;
                    return this.shim ? void u.makeRequire(this.map, {
                        enableBuildCallback: !0
                    })(this.shim.deps || [], bind(this, function() {
                        return a.prefix ? this.callPlugin() : this.load()
                    })) : a.prefix ? this.callPlugin() : this.load()
                }
            },
            load: function() {
                var a = this.map.url;
                D[a] || (D[a] = !0,
                u.load(this.map.id, a))
            },
            check: function() {
                if (this.enabled && !this.enabling) {
                    var a, b, c = this.map.id, d = this.depExports, e = this.exports, f = this.factory;
                    if (this.inited) {
                        if (this.error)
                            this.emit("error", this.error);
                        else if (!this.defining) {
                            if (this.defining = !0,
                            this.depCount < 1 && !this.defined) {
                                if (isFunction(f)) {
                                    if (this.events.error && this.map.isDefine || req.onError !== defaultOnError)
                                        try {
                                            e = u.execCb(c, f, d, e)
                                        } catch (g) {
                                            a = g
                                        }
                                    else
                                        e = u.execCb(c, f, d, e);
                                    if (this.map.isDefine && void 0 === e && (b = this.module,
                                    b ? e = b.exports : this.usingExports && (e = this.exports)),
                                    a)
                                        return a.requireMap = this.map,
                                        a.requireModules = this.map.isDefine ? [this.map.id] : null,
                                        a.requireType = this.map.isDefine ? "define" : "require",
                                        j(this.error = a)
                                } else
                                    e = f;
                                if (this.exports = e,
                                this.map.isDefine && !this.ignore && (C[c] = e,
                                req.onResourceLoad)) {
                                    var h = [];
                                    each(this.depMaps, function(a) {
                                        h.push(a.normalizedMap || a)
                                    }),
                                    req.onResourceLoad(u, this.map, h)
                                }
                                l(c),
                                this.defined = !0
                            }
                            this.defining = !1,
                            this.defined && !this.defineEmitted && (this.defineEmitted = !0,
                            this.emit("defined", this.exports),
                            this.defineEmitComplete = !0)
                        }
                    } else
                        hasProp(u.defQueueMap, c) || this.fetch()
                }
            },
            callPlugin: function() {
                var a = this.map
                  , b = a.id
                  , d = g(a.prefix);
                this.depMaps.push(d),
                i(d, "defined", bind(this, function(d) {
                    var e, f, k, m = getOwn(E, this.map.id), n = this.map.name, o = this.map.parentMap ? this.map.parentMap.name : null, p = u.makeRequire(a.parentMap, {
                        enableBuildCallback: !0
                    });
                    return this.map.unnormalized ? (d.normalize && (n = d.normalize(n, function(a) {
                        return c(a, o, !0)
                    }) || ""),
                    f = g(a.prefix + "!" + n, this.map.parentMap, !0),
                    i(f, "defined", bind(this, function(a) {
                        this.map.normalizedMap = f,
                        this.init([], function() {
                            return a
                        }, null, {
                            enabled: !0,
                            ignore: !0
                        })
                    })),
                    k = getOwn(y, f.id),
                    void (k && (this.depMaps.push(f),
                    this.events.error && k.on("error", bind(this, function(a) {
                        this.emit("error", a)
                    })),
                    k.enable()))) : m ? (this.map.url = u.nameToUrl(m),
                    void this.load()) : (e = bind(this, function(a) {
                        this.init([], function() {
                            return a
                        }, null, {
                            enabled: !0
                        })
                    }),
                    e.error = bind(this, function(a) {
                        this.inited = !0,
                        this.error = a,
                        a.requireModules = [b],
                        eachProp(y, function(a) {
                            0 === a.map.id.indexOf(b + "_unnormalized") && l(a.map.id)
                        }),
                        j(a)
                    }),
                    e.fromText = bind(this, function(c, d) {
                        var f = a.name
                          , i = g(f)
                          , k = useInteractive;
                        d && (c = d),
                        k && (useInteractive = !1),
                        h(i),
                        hasProp(x.config, b) && (x.config[f] = x.config[b]);
                        try {
                            req.exec(c)
                        } catch (l) {
                            return j(makeError("fromtexteval", "fromText eval for " + b + " failed: " + l, l, [b]))
                        }
                        k && (useInteractive = !0),
                        this.depMaps.push(i),
                        u.completeLoad(f),
                        p([f], e)
                    }),
                    void d.load(a.name, p, e, x))
                })),
                u.enable(d, this),
                this.pluginMaps[d.id] = d
            },
            enable: function() {
                z[this.map.id] = this,
                this.enabled = !0,
                this.enabling = !0,
                each(this.depMaps, bind(this, function(a, b) {
                    var c, d, e;
                    if ("string" == typeof a) {
                        if (a = g(a, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap),
                        this.depMaps[b] = a,
                        e = getOwn(v, a.id))
                            return void (this.depExports[b] = e(this));
                        this.depCount += 1,
                        i(a, "defined", bind(this, function(a) {
                            this.undefed || (this.defineDep(b, a),
                            this.check())
                        })),
                        this.errback ? i(a, "error", bind(this, this.errback)) : this.events.error && i(a, "error", bind(this, function(a) {
                            this.emit("error", a)
                        }))
                    }
                    c = a.id,
                    d = y[c],
                    hasProp(v, c) || !d || d.enabled || u.enable(a, this)
                })),
                eachProp(this.pluginMaps, bind(this, function(a) {
                    var b = getOwn(y, a.id);
                    b && !b.enabled && u.enable(a, this)
                })),
                this.enabling = !1,
                this.check()
            },
            on: function(a, b) {
                var c = this.events[a];
                c || (c = this.events[a] = []),
                c.push(b)
            },
            emit: function(a, b) {
                each(this.events[a], function(a) {
                    a(b)
                }),
                "error" === a && delete this.events[a]
            }
        },
        u = {
            config: x,
            contextName: a,
            registry: y,
            defined: C,
            urlFetched: D,
            defQueue: B,
            defQueueMap: {},
            Module: t,
            makeModuleMap: g,
            nextTick: req.nextTick,
            onError: j,
            configure: function(a) {
                if (a.baseUrl && "/" !== a.baseUrl.charAt(a.baseUrl.length - 1) && (a.baseUrl += "/"),
                "string" == typeof a.urlArgs) {
                    var b = a.urlArgs;
                    a.urlArgs = function(a, c) {
                        return (c.indexOf("?") === -1 ? "?" : "&") + b
                    }
                }
                var c = x.shim
                  , d = {
                    paths: !0,
                    bundles: !0,
                    config: !0,
                    map: !0
                };
                eachProp(a, function(a, b) {
                    d[b] ? (x[b] || (x[b] = {}),
                    mixin(x[b], a, !0, !0)) : x[b] = a
                }),
                a.bundles && eachProp(a.bundles, function(a, b) {
                    each(a, function(a) {
                        a !== b && (E[a] = b)
                    })
                }),
                a.shim && (eachProp(a.shim, function(a, b) {
                    isArray(a) && (a = {
                        deps: a
                    }),
                    !a.exports && !a.init || a.exportsFn || (a.exportsFn = u.makeShimExports(a)),
                    c[b] = a
                }),
                x.shim = c),
                a.packages && each(a.packages, function(a) {
                    var b, c;
                    a = "string" == typeof a ? {
                        name: a
                    } : a,
                    c = a.name,
                    b = a.location,
                    b && (x.paths[c] = a.location),
                    x.pkgs[c] = a.name + "/" + (a.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
                }),
                eachProp(y, function(a, b) {
                    a.inited || a.map.unnormalized || (a.map = g(b, null, !0))
                }),
                (a.deps || a.callback) && u.require(a.deps || [], a.callback)
            },
            makeShimExports: function(a) {
                function b() {
                    var b;
                    return a.init && (b = a.init.apply(global, arguments)),
                    b || a.exports && getGlobal(a.exports)
                }
                return b
            },
            makeRequire: function(b, e) {
                function f(c, d, i) {
                    var k, l, m;
                    return e.enableBuildCallback && d && isFunction(d) && (d.__requireJsBuild = !0),
                    "string" == typeof c ? isFunction(d) ? j(makeError("requireargs", "Invalid require call"), i) : b && hasProp(v, c) ? v[c](y[b.id]) : req.get ? req.get(u, c, b, f) : (l = g(c, b, !1, !0),
                    k = l.id,
                    hasProp(C, k) ? C[k] : j(makeError("notloaded", 'Module name "' + k + '" has not been loaded yet for context: ' + a + (b ? "" : ". Use require([])")))) : (r(),
                    u.nextTick(function() {
                        r(),
                        m = h(g(null, b)),
                        m.skipMap = e.skipMap,
                        m.init(c, d, i, {
                            enabled: !0
                        }),
                        n()
                    }),
                    f)
                }
                return e = e || {},
                mixin(f, {
                    isBrowser: isBrowser,
                    toUrl: function(a) {
                        var d, e = a.lastIndexOf("."), f = a.split("/")[0], g = "." === f || ".." === f;
                        return e !== -1 && (!g || e > 1) && (d = a.substring(e, a.length),
                        a = a.substring(0, e)),
                        u.nameToUrl(c(a, b && b.id, !0), d, !0)
                    },
                    defined: function(a) {
                        return hasProp(C, g(a, b, !1, !0).id)
                    },
                    specified: function(a) {
                        return a = g(a, b, !1, !0).id,
                        hasProp(C, a) || hasProp(y, a)
                    }
                }),
                b || (f.undef = function(a) {
                    k();
                    var c = g(a, b, !0)
                      , e = getOwn(y, a);
                    e.undefed = !0,
                    d(a),
                    delete C[a],
                    delete D[c.url],
                    delete A[a],
                    eachReverse(B, function(b, c) {
                        b[0] === a && B.splice(c, 1)
                    }),
                    delete u.defQueueMap[a],
                    e && (e.events.defined && (A[a] = e.events),
                    l(a))
                }
                ),
                f
            },
            enable: function(a) {
                var b = getOwn(y, a.id);
                b && h(a).enable()
            },
            completeLoad: function(a) {
                var b, c, d, f = getOwn(x.shim, a) || {}, g = f.exports;
                for (k(); B.length; ) {
                    if (c = B.shift(),
                    null === c[0]) {
                        if (c[0] = a,
                        b)
                            break;
                        b = !0
                    } else
                        c[0] === a && (b = !0);
                    o(c)
                }
                if (u.defQueueMap = {},
                d = getOwn(y, a),
                !b && !hasProp(C, a) && d && !d.inited) {
                    if (!(!x.enforceDefine || g && getGlobal(g)))
                        return e(a) ? void 0 : j(makeError("nodefine", "No define call for " + a, null, [a]));
                    o([a, f.deps || [], f.exportsFn])
                }
                n()
            },
            nameToUrl: function(a, b, c) {
                var d, e, f, g, h, i, j, k = getOwn(x.pkgs, a);
                if (k && (a = k),
                j = getOwn(E, a))
                    return u.nameToUrl(j, b, c);
                if (req.jsExtRegExp.test(a))
                    h = a + (b || "");
                else {
                    for (d = x.paths,
                    e = a.split("/"),
                    f = e.length; f > 0; f -= 1)
                        if (g = e.slice(0, f).join("/"),
                        i = getOwn(d, g)) {
                            isArray(i) && (i = i[0]),
                            e.splice(0, f, i);
                            break
                        }
                    h = e.join("/"),
                    h += b || (/^data\:|^blob\:|\?/.test(h) || c ? "" : ".js"),
                    h = ("/" === h.charAt(0) || h.match(/^[\w\+\.\-]+:/) ? "" : x.baseUrl) + h
                }
                return x.urlArgs && !/^blob\:/.test(h) ? h + x.urlArgs(a, h) : h
            },
            load: function(a, b) {
                req.load(u, a, b)
            },
            execCb: function(a, b, c, d) {
                return b.apply(d, c)
            },
            onScriptLoad: function(a) {
                if ("load" === a.type || readyRegExp.test((a.currentTarget || a.srcElement).readyState)) {
                    interactiveScript = null;
                    var b = q(a);
                    u.completeLoad(b.id)
                }
            },
            onScriptError: function(a) {
                var b = q(a);
                if (!e(b.id)) {
                    var c = [];
                    return eachProp(y, function(a, d) {
                        0 !== d.indexOf("_@r") && each(a.depMaps, function(a) {
                            if (a.id === b.id)
                                return c.push(d),
                                !0
                        })
                    }),
                    j(makeError("scripterror", 'Script error for "' + b.id + (c.length ? '", needed by: ' + c.join(", ") : '"'), a, [b.id]))
                }
            }
        },
        u.require = u.makeRequire(),
        u
    }
    function getInteractiveScript() {
        return interactiveScript && "interactive" === interactiveScript.readyState ? interactiveScript : (eachReverse(scripts(), function(a) {
            if ("interactive" === a.readyState)
                return interactiveScript = a
        }),
        interactiveScript)
    }
    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.3.3", commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document), isWebWorker = !isBrowser && "undefined" != typeof importScripts, readyRegExp = isBrowser && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", isOpera = "undefined" != typeof opera && "[object Opera]" === opera.toString(), contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = !1;
    if ("undefined" == typeof define) {
        if ("undefined" != typeof requirejs) {
            if (isFunction(requirejs))
                return;
            cfg = requirejs,
            requirejs = void 0
        }
        "undefined" == typeof require || isFunction(require) || (cfg = require,
        require = void 0),
        req = requirejs = function(a, b, c, d) {
            var e, f, g = defContextName;
            return isArray(a) || "string" == typeof a || (f = a,
            isArray(b) ? (a = b,
            b = c,
            c = d) : a = []),
            f && f.context && (g = f.context),
            e = getOwn(contexts, g),
            e || (e = contexts[g] = req.s.newContext(g)),
            f && e.configure(f),
            e.require(a, b, c)
        }
        ,
        req.config = function(a) {
            return req(a)
        }
        ,
        req.nextTick = "undefined" != typeof setTimeout ? function(a) {
            setTimeout(a, 4)
        }
        : function(a) {
            a()
        }
        ,
        require || (require = req),
        req.version = version,
        req.jsExtRegExp = /^\/|:|\?|\.js$/,
        req.isBrowser = isBrowser,
        s = req.s = {
            contexts: contexts,
            newContext: newContext
        },
        req({}),
        each(["toUrl", "undef", "defined", "specified"], function(a) {
            req[a] = function() {
                var b = contexts[defContextName];
                return b.require[a].apply(b, arguments)
            }
        }),
        isBrowser && (head = s.head = document.getElementsByTagName("head")[0],
        baseElement = document.getElementsByTagName("base")[0],
        baseElement && (head = s.head = baseElement.parentNode)),
        req.onError = defaultOnError,
        req.createNode = function(a, b, c) {
            var d = a.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
            return d.type = a.scriptType || "text/javascript",
            d.charset = "utf-8",
            d.async = !0,
            d
        }
        ,
        req.load = function(a, b, c) {
            var d, e = a && a.config || {};
            if (isBrowser)
                return d = req.createNode(e, b, c),
                d.setAttribute("data-requirecontext", a.contextName),
                d.setAttribute("data-requiremodule", b),
                !d.attachEvent || d.attachEvent.toString && d.attachEvent.toString().indexOf("[native code") < 0 || isOpera ? (d.addEventListener("load", a.onScriptLoad, !1),
                d.addEventListener("error", a.onScriptError, !1)) : (useInteractive = !0,
                d.attachEvent("onreadystatechange", a.onScriptLoad)),
                d.src = c,
                e.onNodeCreated && e.onNodeCreated(d, e, b, c),
                currentlyAddingScript = d,
                baseElement ? head.insertBefore(d, baseElement) : head.appendChild(d),
                currentlyAddingScript = null,
                d;
            if (isWebWorker)
                try {
                    setTimeout(function() {}, 0),
                    importScripts(c),
                    a.completeLoad(b)
                } catch (f) {
                    a.onError(makeError("importscripts", "importScripts failed for " + b + " at " + c, f, [b]))
                }
        }
        ,
        isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function(a) {
            if (head || (head = a.parentNode),
            dataMain = a.getAttribute("data-main"))
                return mainScript = dataMain,
                cfg.baseUrl || mainScript.indexOf("!") !== -1 || (src = mainScript.split("/"),
                mainScript = src.pop(),
                subPath = src.length ? src.join("/") + "/" : "./",
                cfg.baseUrl = subPath),
                mainScript = mainScript.replace(jsSuffixRegExp, ""),
                req.jsExtRegExp.test(mainScript) && (mainScript = dataMain),
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript],
                !0
        }),
        define = function(a, b, c) {
            var d, e;
            "string" != typeof a && (c = b,
            b = a,
            a = null),
            isArray(b) || (c = b,
            b = null),
            !b && isFunction(c) && (b = [],
            c.length && (c.toString().replace(commentRegExp, commentReplace).replace(cjsRequireRegExp, function(a, c) {
                b.push(c)
            }),
            b = (1 === c.length ? ["require"] : ["require", "exports", "module"]).concat(b))),
            useInteractive && (d = currentlyAddingScript || getInteractiveScript(),
            d && (a || (a = d.getAttribute("data-requiremodule")),
            e = contexts[d.getAttribute("data-requirecontext")])),
            e ? (e.defQueue.push([a, b, c]),
            e.defQueueMap[a] = !0) : globalDefQueue.push([a, b, c])
        }
        ,
        define.amd = {
            jQuery: !0
        },
        req.exec = function(text) {
            return eval(text)
        }
        ,
        req(cfg)
    }
}(this, "undefined" == typeof setTimeout ? void 0 : setTimeout),
define("../../../node_modules/requirejs/require", function() {}),
define("core/utils/object/has", [], function() {
    "use strict";
    return function(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }
}),
define("core/utils/collection/each", ["core/utils/object/has"], function(a) {
    "use strict";
    return function(b, c) {
        var d = b.length
          , e = Array.prototype.forEach;
        if (isNaN(d))
            for (var f in b)
                a(b, f) && c(b[f], f, b);
        else if (e)
            e.call(b, c);
        else
            for (var g = 0; g < d; g++)
                c(b[g], g, b)
    }
}),
define("core/utils/object/extend", ["core/utils/collection/each", "core/utils/object/has"], function(a, b) {
    "use strict";
    return function(c) {
        return a(Array.prototype.slice.call(arguments, 1), function(a) {
            for (var d in a)
                b(a, d) && (c[d] = a[d])
        }),
        c
    }
}),
define("core/utils/url/serializeArgs", ["require", "exports", "module", "core/utils/collection/each"], function(a, b, c) {
    "use strict";
    var d = a("core/utils/collection/each");
    c.exports = function(a) {
        var b = [];
        return d(a, function(a, c) {
            void 0 !== a && b.push(encodeURIComponent(c) + (null === a ? "" : "=" + encodeURIComponent(a)))
        }),
        b.join("&")
    }
}),
define("core/utils/url/serialize", ["require", "exports", "module", "core/utils/url/serializeArgs"], function(a, b, c) {
    "use strict";
    var d = a("core/utils/url/serializeArgs");
    c.exports = function e(a, b, c) {
        if (b && (a.indexOf("?") === -1 ? a += "?" : "&" !== a.charAt(a.length - 1) && (a += "&"),
        a += d(b)),
        c) {
            var f = {};
            return f[(new Date).getTime()] = null,
            e(a, f)
        }
        var g = a.length;
        return "&" === a.charAt(g - 1) ? a.slice(0, g - 1) : a
    }
}),
define("shared/urls", ["require", "core/utils/object/extend", "core/utils/url/serialize", "core/utils/url/serializeArgs"], function(a) {
    "use strict";
    var b = a("core/utils/object/extend")
      , c = a("core/utils/url/serialize")
      , d = a("core/utils/url/serializeArgs")
      , e = "default"
      , f = {
        lounge: "https://cdn.jsdelivr.net/gh/tingwork/disqus@2.01/embed/comments.html",
        home: "https://disquscom.b0.upaiyun.com/home/".replace("home/", "")
    }
      , g = function(a) {
        return "https://" + a.replace(/^\s*(\w+:)?\/\//, "")
    }
      , h = function(a, h, i) {
        var j = f[a];
        if (!j)
            throw new Error("Unknown app: " + a);
        var k = g(j)
          , l = b({
            base: e
        }, h || {})
          , m = i ? "#" + d(i) : "";
        return c(k, l) + m
    };
    return {
        BASE: e,
        apps: f,
        get: h,
        ensureHTTPSProtocol: g
    }
}),
function(a, b, c) {
    b[a] = b[a] || c(),
    "undefined" != typeof module && module.exports ? module.exports = b[a] : "function" == typeof define && define.amd && define("native-promise-only", [], function() {
        return b[a]
    })
}("Promise", "undefined" != typeof global ? global : this, function() {
    "use strict";
    function a(a, b) {
        m.add(a, b),
        l || (l = o(m.drain))
    }
    function b(a) {
        var b, c = typeof a;
        return null == a || "object" != c && "function" != c || (b = a.then),
        "function" == typeof b && b
    }
    function c() {
        for (var a = 0; a < this.chain.length; a++)
            d(this, 1 === this.state ? this.chain[a].success : this.chain[a].failure, this.chain[a]);
        this.chain.length = 0
    }
    function d(a, c, d) {
        var e, f;
        try {
            c === !1 ? d.reject(a.msg) : (e = c === !0 ? a.msg : c.call(void 0, a.msg),
            e === d.promise ? d.reject(TypeError("Promise-chain cycle")) : (f = b(e)) ? f.call(e, d.resolve, d.reject) : d.resolve(e))
        } catch (g) {
            d.reject(g)
        }
    }
    function e(d) {
        var g, i = this;
        if (!i.triggered) {
            i.triggered = !0,
            i.def && (i = i.def);
            try {
                (g = b(d)) ? a(function() {
                    var a = new h(i);
                    try {
                        g.call(d, function() {
                            e.apply(a, arguments)
                        }, function() {
                            f.apply(a, arguments)
                        })
                    } catch (b) {
                        f.call(a, b)
                    }
                }) : (i.msg = d,
                i.state = 1,
                i.chain.length > 0 && a(c, i))
            } catch (j) {
                f.call(new h(i), j)
            }
        }
    }
    function f(b) {
        var d = this;
        d.triggered || (d.triggered = !0,
        d.def && (d = d.def),
        d.msg = b,
        d.state = 2,
        d.chain.length > 0 && a(c, d))
    }
    function g(a, b, c, d) {
        for (var e = 0; e < b.length; e++)
            !function(e) {
                a.resolve(b[e]).then(function(a) {
                    c(e, a)
                }, d)
            }(e)
    }
    function h(a) {
        this.def = a,
        this.triggered = !1
    }
    function i(a) {
        this.promise = a,
        this.state = 0,
        this.triggered = !1,
        this.chain = [],
        this.msg = void 0
    }
    function j(b) {
        if ("function" != typeof b)
            throw TypeError("Not a function");
        if (0 !== this.__NPO__)
            throw TypeError("Not a promise");
        this.__NPO__ = 1;
        var d = new i(this);
        this.then = function(b, e) {
            var f = {
                success: "function" != typeof b || b,
                failure: "function" == typeof e && e
            };
            return f.promise = new this.constructor(function(a, b) {
                if ("function" != typeof a || "function" != typeof b)
                    throw TypeError("Not a function");
                f.resolve = a,
                f.reject = b
            }
            ),
            d.chain.push(f),
            0 !== d.state && a(c, d),
            f.promise
        }
        ,
        this["catch"] = function(a) {
            return this.then(void 0, a)
        }
        ;
        try {
            b.call(void 0, function(a) {
                e.call(d, a)
            }, function(a) {
                f.call(d, a)
            })
        } catch (g) {
            f.call(d, g)
        }
    }
    var k, l, m, n = Object.prototype.toString, o = "undefined" != typeof setImmediate ? function(a) {
        return setImmediate(a)
    }
    : setTimeout;
    try {
        Object.defineProperty({}, "x", {}),
        k = function(a, b, c, d) {
            return Object.defineProperty(a, b, {
                value: c,
                writable: !0,
                configurable: d !== !1
            })
        }
    } catch (p) {
        k = function(a, b, c) {
            return a[b] = c,
            a
        }
    }
    m = function() {
        function a(a, b) {
            this.fn = a,
            this.self = b,
            this.next = void 0
        }
        var b, c, d;
        return {
            add: function(e, f) {
                d = new a(e,f),
                c ? c.next = d : b = d,
                c = d,
                d = void 0
            },
            drain: function() {
                var a = b;
                for (b = c = l = void 0; a; )
                    a.fn.call(a.self),
                    a = a.next
            }
        }
    }();
    var q = k({}, "constructor", j, !1);
    return j.prototype = q,
    k(q, "__NPO__", 0, !1),
    k(j, "resolve", function(a) {
        var b = this;
        return a && "object" == typeof a && 1 === a.__NPO__ ? a : new b(function(b, c) {
            if ("function" != typeof b || "function" != typeof c)
                throw TypeError("Not a function");
            b(a)
        }
        )
    }),
    k(j, "reject", function(a) {
        return new this(function(b, c) {
            if ("function" != typeof b || "function" != typeof c)
                throw TypeError("Not a function");
            c(a)
        }
        )
    }),
    k(j, "all", function(a) {
        var b = this;
        return "[object Array]" != n.call(a) ? b.reject(TypeError("Not an array")) : 0 === a.length ? b.resolve([]) : new b(function(c, d) {
            if ("function" != typeof c || "function" != typeof d)
                throw TypeError("Not a function");
            var e = a.length
              , f = Array(e)
              , h = 0;
            g(b, a, function(a, b) {
                f[a] = b,
                ++h === e && c(f)
            }, d)
        }
        )
    }),
    k(j, "race", function(a) {
        var b = this;
        return "[object Array]" != n.call(a) ? b.reject(TypeError("Not an array")) : new b(function(c, d) {
            if ("function" != typeof c || "function" != typeof d)
                throw TypeError("Not a function");
            g(b, a, function(a, b) {
                c(b)
            }, d)
        }
        )
    }),
    j
}),
function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document)
            throw new Error("jQuery requires a window with a document");
        return b(a)
    }
    : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
    function c(a) {
        var b = !!a && "length"in a && a.length
          , c = fa.type(a);
        return "function" !== c && !fa.isWindow(a) && ("array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a)
    }
    function d(a, b, c) {
        if (fa.isFunction(b))
            return fa.grep(a, function(a, d) {
                return !!b.call(a, d, a) !== c
            });
        if (b.nodeType)
            return fa.grep(a, function(a) {
                return a === b !== c
            });
        if ("string" == typeof b) {
            if (pa.test(b))
                return fa.filter(b, a, c);
            b = fa.filter(b, a)
        }
        return fa.grep(a, function(a) {
            return _.call(b, a) > -1 !== c
        })
    }
    function e(a, b) {
        for (; (a = a[b]) && 1 !== a.nodeType; )
            ;
        return a
    }
    function f(a) {
        var b = {};
        return fa.each(a.match(va) || [], function(a, c) {
            b[c] = !0
        }),
        b
    }
    function g() {
        X.removeEventListener("DOMContentLoaded", g),
        a.removeEventListener("load", g),
        fa.ready()
    }
    function h() {
        this.expando = fa.expando + h.uid++
    }
    function i(a, b, c) {
        var d;
        if (void 0 === c && 1 === a.nodeType)
            if (d = "data-" + b.replace(Ca, "-$&").toLowerCase(),
            c = a.getAttribute(d),
            "string" == typeof c) {
                try {
                    c = "true" === c || "false" !== c && ("null" === c ? null : +c + "" === c ? +c : Ba.test(c) ? fa.parseJSON(c) : c)
                } catch (e) {}
                Aa.set(a, b, c)
            } else
                c = void 0;
        return c
    }
    function j(a, b, c, d) {
        var e, f = 1, g = 20, h = d ? function() {
            return d.cur()
        }
        : function() {
            return fa.css(a, b, "")
        }
        , i = h(), j = c && c[3] || (fa.cssNumber[b] ? "" : "px"), k = (fa.cssNumber[b] || "px" !== j && +i) && Ea.exec(fa.css(a, b));
        if (k && k[3] !== j) {
            j = j || k[3],
            c = c || [],
            k = +i || 1;
            do
                f = f || ".5",
                k /= f,
                fa.style(a, b, k + j);
            while (f !== (f = h() / i) && 1 !== f && --g)
        }
        return c && (k = +k || +i || 0,
        e = c[1] ? k + (c[1] + 1) * c[2] : +c[2],
        d && (d.unit = j,
        d.start = k,
        d.end = e)),
        e
    }
    function k(a, b) {
        var c = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : [];
        return void 0 === b || b && fa.nodeName(a, b) ? fa.merge([a], c) : c
    }
    function l(a, b) {
        for (var c = 0, d = a.length; c < d; c++)
            za.set(a[c], "globalEval", !b || za.get(b[c], "globalEval"))
    }
    function m(a, b, c, d, e) {
        for (var f, g, h, i, j, m, n = b.createDocumentFragment(), o = [], p = 0, q = a.length; p < q; p++)
            if (f = a[p],
            f || 0 === f)
                if ("object" === fa.type(f))
                    fa.merge(o, f.nodeType ? [f] : f);
                else if (La.test(f)) {
                    for (g = g || n.appendChild(b.createElement("div")),
                    h = (Ia.exec(f) || ["", ""])[1].toLowerCase(),
                    i = Ka[h] || Ka._default,
                    g.innerHTML = i[1] + fa.htmlPrefilter(f) + i[2],
                    m = i[0]; m--; )
                        g = g.lastChild;
                    fa.merge(o, g.childNodes),
                    g = n.firstChild,
                    g.textContent = ""
                } else
                    o.push(b.createTextNode(f));
        for (n.textContent = "",
        p = 0; f = o[p++]; )
            if (d && fa.inArray(f, d) > -1)
                e && e.push(f);
            else if (j = fa.contains(f.ownerDocument, f),
            g = k(n.appendChild(f), "script"),
            j && l(g),
            c)
                for (m = 0; f = g[m++]; )
                    Ja.test(f.type || "") && c.push(f);
        return n
    }
    function n() {
        return !0
    }
    function o() {
        return !1
    }
    function p() {
        try {
            return X.activeElement
        } catch (a) {}
    }
    function q(a, b, c, d, e, f) {
        var g, h;
        if ("object" == typeof b) {
            "string" != typeof c && (d = d || c,
            c = void 0);
            for (h in b)
                q(a, h, c, d, b[h], f);
            return a
        }
        if (null == d && null == e ? (e = c,
        d = c = void 0) : null == e && ("string" == typeof c ? (e = d,
        d = void 0) : (e = d,
        d = c,
        c = void 0)),
        e === !1)
            e = o;
        else if (!e)
            return a;
        return 1 === f && (g = e,
        e = function(a) {
            return fa().off(a),
            g.apply(this, arguments)
        }
        ,
        e.guid = g.guid || (g.guid = fa.guid++)),
        a.each(function() {
            fa.event.add(this, b, e, d, c)
        })
    }
    function r(a, b) {
        return fa.nodeName(a, "table") && fa.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }
    function s(a) {
        return a.type = (null !== a.getAttribute("type")) + "/" + a.type,
        a
    }
    function t(a) {
        var b = Sa.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"),
        a
    }
    function u(a, b) {
        var c, d, e, f, g, h, i, j;
        if (1 === b.nodeType) {
            if (za.hasData(a) && (f = za.access(a),
            g = za.set(b, f),
            j = f.events)) {
                delete g.handle,
                g.events = {};
                for (e in j)
                    for (c = 0,
                    d = j[e].length; c < d; c++)
                        fa.event.add(b, e, j[e][c])
            }
            Aa.hasData(a) && (h = Aa.access(a),
            i = fa.extend({}, h),
            Aa.set(b, i))
        }
    }
    function v(a, b) {
        var c = b.nodeName.toLowerCase();
        "input" === c && Ha.test(a.type) ? b.checked = a.checked : "input" !== c && "textarea" !== c || (b.defaultValue = a.defaultValue)
    }
    function w(a, b, c, d) {
        b = Z.apply([], b);
        var e, f, g, h, i, j, l = 0, n = a.length, o = n - 1, p = b[0], q = fa.isFunction(p);
        if (q || n > 1 && "string" == typeof p && !da.checkClone && Ra.test(p))
            return a.each(function(e) {
                var f = a.eq(e);
                q && (b[0] = p.call(this, e, f.html())),
                w(f, b, c, d)
            });
        if (n && (e = m(b, a[0].ownerDocument, !1, a, d),
        f = e.firstChild,
        1 === e.childNodes.length && (e = f),
        f || d)) {
            for (g = fa.map(k(e, "script"), s),
            h = g.length; l < n; l++)
                i = e,
                l !== o && (i = fa.clone(i, !0, !0),
                h && fa.merge(g, k(i, "script"))),
                c.call(a[l], i, l);
            if (h)
                for (j = g[g.length - 1].ownerDocument,
                fa.map(g, t),
                l = 0; l < h; l++)
                    i = g[l],
                    Ja.test(i.type || "") && !za.access(i, "globalEval") && fa.contains(j, i) && (i.src ? fa._evalUrl && fa._evalUrl(i.src) : fa.globalEval(i.textContent.replace(Ta, "")))
        }
        return a
    }
    function x(a, b, c) {
        for (var d, e = b ? fa.filter(b, a) : a, f = 0; null != (d = e[f]); f++)
            c || 1 !== d.nodeType || fa.cleanData(k(d)),
            d.parentNode && (c && fa.contains(d.ownerDocument, d) && l(k(d, "script")),
            d.parentNode.removeChild(d));
        return a
    }
    function y(a, b) {
        var c = fa(b.createElement(a)).appendTo(b.body)
          , d = fa.css(c[0], "display");
        return c.detach(),
        d
    }
    function z(a) {
        var b = X
          , c = Va[a];
        return c || (c = y(a, b),
        "none" !== c && c || (Ua = (Ua || fa("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),
        b = Ua[0].contentDocument,
        b.write(),
        b.close(),
        c = y(a, b),
        Ua.detach()),
        Va[a] = c),
        c
    }
    function A(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ya(a),
        g = c ? c.getPropertyValue(b) || c[b] : void 0,
        "" !== g && void 0 !== g || fa.contains(a.ownerDocument, a) || (g = fa.style(a, b)),
        c && !da.pixelMarginRight() && Xa.test(g) && Wa.test(b) && (d = h.width,
        e = h.minWidth,
        f = h.maxWidth,
        h.minWidth = h.maxWidth = h.width = g,
        g = c.width,
        h.width = d,
        h.minWidth = e,
        h.maxWidth = f),
        void 0 !== g ? g + "" : g
    }
    function B(a, b) {
        return {
            get: function() {
                return a() ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }
    function C(a) {
        if (a in db)
            return a;
        for (var b = a[0].toUpperCase() + a.slice(1), c = cb.length; c--; )
            if (a = cb[c] + b,
            a in db)
                return a
    }
    function D(a, b, c) {
        var d = Ea.exec(b);
        return d ? Math.max(0, d[2] - (c || 0)) + (d[3] || "px") : b
    }
    function E(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; f < 4; f += 2)
            "margin" === c && (g += fa.css(a, c + Fa[f], !0, e)),
            d ? ("content" === c && (g -= fa.css(a, "padding" + Fa[f], !0, e)),
            "margin" !== c && (g -= fa.css(a, "border" + Fa[f] + "Width", !0, e))) : (g += fa.css(a, "padding" + Fa[f], !0, e),
            "padding" !== c && (g += fa.css(a, "border" + Fa[f] + "Width", !0, e)));
        return g
    }
    function F(a, b, c) {
        var d = !0
          , e = "width" === b ? a.offsetWidth : a.offsetHeight
          , f = Ya(a)
          , g = "border-box" === fa.css(a, "boxSizing", !1, f);
        if (e <= 0 || null == e) {
            if (e = A(a, b, f),
            (e < 0 || null == e) && (e = a.style[b]),
            Xa.test(e))
                return e;
            d = g && (da.boxSizingReliable() || e === a.style[b]),
            e = parseFloat(e) || 0
        }
        return e + E(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }
    function G(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; g < h; g++)
            d = a[g],
            d.style && (f[g] = za.get(d, "olddisplay"),
            c = d.style.display,
            b ? (f[g] || "none" !== c || (d.style.display = ""),
            "" === d.style.display && Ga(d) && (f[g] = za.access(d, "olddisplay", z(d.nodeName)))) : (e = Ga(d),
            "none" === c && e || za.set(d, "olddisplay", e ? c : fa.css(d, "display"))));
        for (g = 0; g < h; g++)
            d = a[g],
            d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }
    function H(a, b, c, d, e) {
        return new H.prototype.init(a,b,c,d,e)
    }
    function I() {
        return a.setTimeout(function() {
            eb = void 0
        }),
        eb = fa.now()
    }
    function J(a, b) {
        var c, d = 0, e = {
            height: a
        };
        for (b = b ? 1 : 0; d < 4; d += 2 - b)
            c = Fa[d],
            e["margin" + c] = e["padding" + c] = a;
        return b && (e.opacity = e.width = a),
        e
    }
    function K(a, b, c) {
        for (var d, e = (N.tweeners[b] || []).concat(N.tweeners["*"]), f = 0, g = e.length; f < g; f++)
            if (d = e[f].call(c, b, a))
                return d
    }
    function L(a, b, c) {
        var d, e, f, g, h, i, j, k, l = this, m = {}, n = a.style, o = a.nodeType && Ga(a), p = za.get(a, "fxshow");
        c.queue || (h = fa._queueHooks(a, "fx"),
        null == h.unqueued && (h.unqueued = 0,
        i = h.empty.fire,
        h.empty.fire = function() {
            h.unqueued || i()
        }
        ),
        h.unqueued++,
        l.always(function() {
            l.always(function() {
                h.unqueued--,
                fa.queue(a, "fx").length || h.empty.fire()
            })
        })),
        1 === a.nodeType && ("height"in b || "width"in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY],
        j = fa.css(a, "display"),
        k = "none" === j ? za.get(a, "olddisplay") || z(a.nodeName) : j,
        "inline" === k && "none" === fa.css(a, "float") && (n.display = "inline-block")),
        c.overflow && (n.overflow = "hidden",
        l.always(function() {
            n.overflow = c.overflow[0],
            n.overflowX = c.overflow[1],
            n.overflowY = c.overflow[2]
        }));
        for (d in b)
            if (e = b[d],
            gb.exec(e)) {
                if (delete b[d],
                f = f || "toggle" === e,
                e === (o ? "hide" : "show")) {
                    if ("show" !== e || !p || void 0 === p[d])
                        continue;
                    o = !0
                }
                m[d] = p && p[d] || fa.style(a, d)
            } else
                j = void 0;
        if (fa.isEmptyObject(m))
            "inline" === ("none" === j ? z(a.nodeName) : j) && (n.display = j);
        else {
            p ? "hidden"in p && (o = p.hidden) : p = za.access(a, "fxshow", {}),
            f && (p.hidden = !o),
            o ? fa(a).show() : l.done(function() {
                fa(a).hide()
            }),
            l.done(function() {
                var b;
                za.remove(a, "fxshow");
                for (b in m)
                    fa.style(a, b, m[b])
            });
            for (d in m)
                g = K(o ? p[d] : 0, d, l),
                d in p || (p[d] = g.start,
                o && (g.end = g.start,
                g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }
    function M(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = fa.camelCase(c),
            e = b[d],
            f = a[c],
            fa.isArray(f) && (e = f[1],
            f = a[c] = f[0]),
            c !== d && (a[d] = f,
            delete a[c]),
            g = fa.cssHooks[d],
            g && "expand"in g) {
                f = g.expand(f),
                delete a[d];
                for (c in f)
                    c in a || (a[c] = f[c],
                    b[c] = e)
            } else
                b[d] = e
    }
    function N(a, b, c) {
        var d, e, f = 0, g = N.prefilters.length, h = fa.Deferred().always(function() {
            delete i.elem
        }), i = function() {
            if (e)
                return !1;
            for (var b = eb || I(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; g < i; g++)
                j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]),
            f < 1 && i ? c : (h.resolveWith(a, [j]),
            !1)
        }, j = h.promise({
            elem: a,
            props: fa.extend({}, b),
            opts: fa.extend(!0, {
                specialEasing: {},
                easing: fa.easing._default
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: eb || I(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = fa.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d),
                d
            },
            stop: function(b) {
                var c = 0
                  , d = b ? j.tweens.length : 0;
                if (e)
                    return this;
                for (e = !0; c < d; c++)
                    j.tweens[c].run(1);
                return b ? (h.notifyWith(a, [j, 1, 0]),
                h.resolveWith(a, [j, b])) : h.rejectWith(a, [j, b]),
                this
            }
        }), k = j.props;
        for (M(k, j.opts.specialEasing); f < g; f++)
            if (d = N.prefilters[f].call(j, a, k, j.opts))
                return fa.isFunction(d.stop) && (fa._queueHooks(j.elem, j.opts.queue).stop = fa.proxy(d.stop, d)),
                d;
        return fa.map(k, K, j),
        fa.isFunction(j.opts.start) && j.opts.start.call(a, j),
        fa.fx.timer(fa.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })),
        j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    function O(a) {
        return a.getAttribute && a.getAttribute("class") || ""
    }
    function P(a) {
        return function(b, c) {
            "string" != typeof b && (c = b,
            b = "*");
            var d, e = 0, f = b.toLowerCase().match(va) || [];
            if (fa.isFunction(c))
                for (; d = f[e++]; )
                    "+" === d[0] ? (d = d.slice(1) || "*",
                    (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }
    function Q(a, b, c, d) {
        function e(h) {
            var i;
            return f[h] = !0,
            fa.each(a[h] || [], function(a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j),
                e(j),
                !1)
            }),
            i
        }
        var f = {}
          , g = a === Ab;
        return e(b.dataTypes[0]) || !f["*"] && e("*")
    }
    function R(a, b) {
        var c, d, e = fa.ajaxSettings.flatOptions || {};
        for (c in b)
            void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]);
        return d && fa.extend(!0, a, d),
        a
    }
    function S(a, b, c) {
        for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0]; )
            i.shift(),
            void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"));
        if (d)
            for (e in h)
                if (h[e] && h[e].test(d)) {
                    i.unshift(e);
                    break
                }
        if (i[0]in c)
            f = i[0];
        else {
            for (e in c) {
                if (!i[0] || a.converters[e + " " + i[0]]) {
                    f = e;
                    break
                }
                g || (g = e)
            }
            f = f || g
        }
        if (f)
            return f !== i[0] && i.unshift(f),
            c[f]
    }
    function T(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters)
                j[g.toLowerCase()] = a.converters[g];
        for (f = k.shift(); f; )
            if (a.responseFields[f] && (c[a.responseFields[f]] = b),
            !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
            i = f,
            f = k.shift())
                if ("*" === f)
                    f = i;
                else if ("*" !== i && i !== f) {
                    if (g = j[i + " " + f] || j["* " + f],
                    !g)
                        for (e in j)
                            if (h = e.split(" "),
                            h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0],
                                k.unshift(h[1]));
                                break
                            }
                    if (g !== !0)
                        if (g && a["throws"])
                            b = g(b);
                        else
                            try {
                                b = g(b)
                            } catch (l) {
                                return {
                                    state: "parsererror",
                                    error: g ? l : "No conversion from " + i + " to " + f
                                }
                            }
                }
        return {
            state: "success",
            data: b
        }
    }
    function U(a, b, c, d) {
        var e;
        if (fa.isArray(b))
            fa.each(b, function(b, e) {
                c || Eb.test(a) ? d(a, e) : U(a + "[" + ("object" == typeof e && null != e ? b : "") + "]", e, c, d)
            });
        else if (c || "object" !== fa.type(b))
            d(a, b);
        else
            for (e in b)
                U(a + "[" + e + "]", b[e], c, d)
    }
    function V(a) {
        return fa.isWindow(a) ? a : 9 === a.nodeType && a.defaultView
    }
    var W = []
      , X = a.document
      , Y = W.slice
      , Z = W.concat
      , $ = W.push
      , _ = W.indexOf
      , aa = {}
      , ba = aa.toString
      , ca = aa.hasOwnProperty
      , da = {}
      , ea = "2.2.4"
      , fa = function(a, b) {
        return new fa.fn.init(a,b)
    }
      , ga = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      , ha = /^-ms-/
      , ia = /-([\da-z])/gi
      , ja = function(a, b) {
        return b.toUpperCase()
    };
    fa.fn = fa.prototype = {
        jquery: ea,
        constructor: fa,
        selector: "",
        length: 0,
        toArray: function() {
            return Y.call(this)
        },
        get: function(a) {
            return null != a ? a < 0 ? this[a + this.length] : this[a] : Y.call(this)
        },
        pushStack: function(a) {
            var b = fa.merge(this.constructor(), a);
            return b.prevObject = this,
            b.context = this.context,
            b
        },
        each: function(a) {
            return fa.each(this, a)
        },
        map: function(a) {
            return this.pushStack(fa.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(Y.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length
              , c = +a + (a < 0 ? b : 0);
            return this.pushStack(c >= 0 && c < b ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: $,
        sort: W.sort,
        splice: W.splice
    },
    fa.extend = fa.fn.extend = function() {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g,
        g = arguments[h] || {},
        h++),
        "object" == typeof g || fa.isFunction(g) || (g = {}),
        h === i && (g = this,
        h--); h < i; h++)
            if (null != (a = arguments[h]))
                for (b in a)
                    c = g[b],
                    d = a[b],
                    g !== d && (j && d && (fa.isPlainObject(d) || (e = fa.isArray(d))) ? (e ? (e = !1,
                    f = c && fa.isArray(c) ? c : []) : f = c && fa.isPlainObject(c) ? c : {},
                    g[b] = fa.extend(j, f, d)) : void 0 !== d && (g[b] = d));
        return g
    }
    ,
    fa.extend({
        expando: "jQuery" + (ea + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw new Error(a)
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === fa.type(a)
        },
        isArray: Array.isArray,
        isWindow: function(a) {
            return null != a && a === a.window
        },
        isNumeric: function(a) {
            var b = a && a.toString();
            return !fa.isArray(a) && b - parseFloat(b) + 1 >= 0
        },
        isPlainObject: function(a) {
            var b;
            if ("object" !== fa.type(a) || a.nodeType || fa.isWindow(a))
                return !1;
            if (a.constructor && !ca.call(a, "constructor") && !ca.call(a.constructor.prototype || {}, "isPrototypeOf"))
                return !1;
            for (b in a)
                ;
            return void 0 === b || ca.call(a, b)
        },
        isEmptyObject: function(a) {
            var b;
            for (b in a)
                return !1;
            return !0
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? aa[ba.call(a)] || "object" : typeof a
        },
        globalEval: function(a) {
            var b, c = eval;
            a = fa.trim(a),
            a && (1 === a.indexOf("use strict") ? (b = X.createElement("script"),
            b.text = a,
            X.head.appendChild(b).parentNode.removeChild(b)) : c(a))
        },
        camelCase: function(a) {
            return a.replace(ha, "ms-").replace(ia, ja)
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function(a, b) {
            var d, e = 0;
            if (c(a))
                for (d = a.length; e < d && b.call(a[e], e, a[e]) !== !1; e++)
                    ;
            else
                for (e in a)
                    if (b.call(a[e], e, a[e]) === !1)
                        break;
            return a
        },
        trim: function(a) {
            return null == a ? "" : (a + "").replace(ga, "")
        },
        makeArray: function(a, b) {
            var d = b || [];
            return null != a && (c(Object(a)) ? fa.merge(d, "string" == typeof a ? [a] : a) : $.call(d, a)),
            d
        },
        inArray: function(a, b, c) {
            return null == b ? -1 : _.call(b, a, c)
        },
        merge: function(a, b) {
            for (var c = +b.length, d = 0, e = a.length; d < c; d++)
                a[e++] = b[d];
            return a.length = e,
            a
        },
        grep: function(a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; f < g; f++)
                d = !b(a[f], f),
                d !== h && e.push(a[f]);
            return e
        },
        map: function(a, b, d) {
            var e, f, g = 0, h = [];
            if (c(a))
                for (e = a.length; g < e; g++)
                    f = b(a[g], g, d),
                    null != f && h.push(f);
            else
                for (g in a)
                    f = b(a[g], g, d),
                    null != f && h.push(f);
            return Z.apply([], h)
        },
        guid: 1,
        proxy: function(a, b) {
            var c, d, e;
            if ("string" == typeof b && (c = a[b],
            b = a,
            a = c),
            fa.isFunction(a))
                return d = Y.call(arguments, 2),
                e = function() {
                    return a.apply(b || this, d.concat(Y.call(arguments)))
                }
                ,
                e.guid = a.guid = a.guid || fa.guid++,
                e
        },
        now: Date.now,
        support: da
    }),
    "function" == typeof Symbol && (fa.fn[Symbol.iterator] = W[Symbol.iterator]),
    fa.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(a, b) {
        aa["[object " + b + "]"] = b.toLowerCase()
    });
    var ka = function(a) {
        function b(a, b, c, d) {
            var e, f, g, h, i, j, l, n, o = b && b.ownerDocument, p = b ? b.nodeType : 9;
            if (c = c || [],
            "string" != typeof a || !a || 1 !== p && 9 !== p && 11 !== p)
                return c;
            if (!d && ((b ? b.ownerDocument || b : O) !== G && F(b),
            b = b || G,
            I)) {
                if (11 !== p && (j = ra.exec(a)))
                    if (e = j[1]) {
                        if (9 === p) {
                            if (!(g = b.getElementById(e)))
                                return c;
                            if (g.id === e)
                                return c.push(g),
                                c
                        } else if (o && (g = o.getElementById(e)) && M(b, g) && g.id === e)
                            return c.push(g),
                            c
                    } else {
                        if (j[2])
                            return $.apply(c, b.getElementsByTagName(a)),
                            c;
                        if ((e = j[3]) && v.getElementsByClassName && b.getElementsByClassName)
                            return $.apply(c, b.getElementsByClassName(e)),
                            c
                    }
                if (v.qsa && !T[a + " "] && (!J || !J.test(a))) {
                    if (1 !== p)
                        o = b,
                        n = a;
                    else if ("object" !== b.nodeName.toLowerCase()) {
                        for ((h = b.getAttribute("id")) ? h = h.replace(ta, "\\$&") : b.setAttribute("id", h = N),
                        l = z(a),
                        f = l.length,
                        i = ma.test(h) ? "#" + h : "[id='" + h + "']"; f--; )
                            l[f] = i + " " + m(l[f]);
                        n = l.join(","),
                        o = sa.test(a) && k(b.parentNode) || b
                    }
                    if (n)
                        try {
                            return $.apply(c, o.querySelectorAll(n)),
                            c
                        } catch (q) {} finally {
                            h === N && b.removeAttribute("id")
                        }
                }
            }
            return B(a.replace(ha, "$1"), b, c, d)
        }
        function c() {
            function a(c, d) {
                return b.push(c + " ") > w.cacheLength && delete a[b.shift()],
                a[c + " "] = d
            }
            var b = [];
            return a
        }
        function d(a) {
            return a[N] = !0,
            a
        }
        function e(a) {
            var b = G.createElement("div");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b),
                b = null
            }
        }
        function f(a, b) {
            for (var c = a.split("|"), d = c.length; d--; )
                w.attrHandle[c[d]] = b
        }
        function g(a, b) {
            var c = b && a
              , d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V);
            if (d)
                return d;
            if (c)
                for (; c = c.nextSibling; )
                    if (c === b)
                        return -1;
            return a ? 1 : -1
        }
        function h(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }
        function i(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }
        function j(a) {
            return d(function(b) {
                return b = +b,
                d(function(c, d) {
                    for (var e, f = a([], c.length, b), g = f.length; g--; )
                        c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }
        function k(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }
        function l() {}
        function m(a) {
            for (var b = 0, c = a.length, d = ""; b < c; b++)
                d += a[b].value;
            return d
        }
        function n(a, b, c) {
            var d = b.dir
              , e = c && "parentNode" === d
              , f = Q++;
            return b.first ? function(b, c, f) {
                for (; b = b[d]; )
                    if (1 === b.nodeType || e)
                        return a(b, c, f)
            }
            : function(b, c, g) {
                var h, i, j, k = [P, f];
                if (g) {
                    for (; b = b[d]; )
                        if ((1 === b.nodeType || e) && a(b, c, g))
                            return !0
                } else
                    for (; b = b[d]; )
                        if (1 === b.nodeType || e) {
                            if (j = b[N] || (b[N] = {}),
                            i = j[b.uniqueID] || (j[b.uniqueID] = {}),
                            (h = i[d]) && h[0] === P && h[1] === f)
                                return k[2] = h[2];
                            if (i[d] = k,
                            k[2] = a(b, c, g))
                                return !0
                        }
            }
        }
        function o(a) {
            return a.length > 1 ? function(b, c, d) {
                for (var e = a.length; e--; )
                    if (!a[e](b, c, d))
                        return !1;
                return !0
            }
            : a[0]
        }
        function p(a, c, d) {
            for (var e = 0, f = c.length; e < f; e++)
                b(a, c[e], d);
            return d
        }
        function q(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++)
                (f = a[h]) && (c && !c(f, d, e) || (g.push(f),
                j && b.push(h)));
            return g
        }
        function r(a, b, c, e, f, g) {
            return e && !e[N] && (e = r(e)),
            f && !f[N] && (f = r(f, g)),
            d(function(d, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, r = d || p(b || "*", h.nodeType ? [h] : h, []), s = !a || !d && b ? r : q(r, m, a, h, i), t = c ? f || (d ? a : o || e) ? [] : g : s;
                if (c && c(s, t, h, i),
                e)
                    for (j = q(t, n),
                    e(j, [], h, i),
                    k = j.length; k--; )
                        (l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                if (d) {
                    if (f || a) {
                        if (f) {
                            for (j = [],
                            k = t.length; k--; )
                                (l = t[k]) && j.push(s[k] = l);
                            f(null, t = [], j, i)
                        }
                        for (k = t.length; k--; )
                            (l = t[k]) && (j = f ? aa(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                    }
                } else
                    t = q(t === g ? t.splice(o, t.length) : t),
                    f ? f(null, g, t, i) : $.apply(g, t)
            })
        }
        function s(a) {
            for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function(a) {
                return a === b
            }, g, !0), j = n(function(a) {
                return aa(b, a) > -1
            }, g, !0), k = [function(a, c, d) {
                var e = !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                return b = null,
                e
            }
            ]; h < e; h++)
                if (c = w.relative[a[h].type])
                    k = [n(o(k), c)];
                else {
                    if (c = w.filter[a[h].type].apply(null, a[h].matches),
                    c[N]) {
                        for (d = ++h; d < e && !w.relative[a[d].type]; d++)
                            ;
                        return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                            value: " " === a[h - 2].type ? "*" : ""
                        })).replace(ha, "$1"), c, h < d && s(a.slice(h, d)), d < e && s(a = a.slice(d)), d < e && m(a))
                    }
                    k.push(c)
                }
            return o(k)
        }
        function t(a, c) {
            var e = c.length > 0
              , f = a.length > 0
              , g = function(d, g, h, i, j) {
                var k, l, m, n = 0, o = "0", p = d && [], r = [], s = C, t = d || f && w.find.TAG("*", j), u = P += null == s ? 1 : Math.random() || .1, v = t.length;
                for (j && (C = g === G || g || j); o !== v && null != (k = t[o]); o++) {
                    if (f && k) {
                        for (l = 0,
                        g || k.ownerDocument === G || (F(k),
                        h = !I); m = a[l++]; )
                            if (m(k, g || G, h)) {
                                i.push(k);
                                break
                            }
                        j && (P = u)
                    }
                    e && ((k = !m && k) && n--,
                    d && p.push(k))
                }
                if (n += o,
                e && o !== n) {
                    for (l = 0; m = c[l++]; )
                        m(p, r, g, h);
                    if (d) {
                        if (n > 0)
                            for (; o--; )
                                p[o] || r[o] || (r[o] = Y.call(i));
                        r = q(r)
                    }
                    $.apply(i, r),
                    j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
                }
                return j && (P = u,
                C = s),
                p
            };
            return e ? d(g) : g
        }
        var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + 1 * new Date, O = a.document, P = 0, Q = 0, R = c(), S = c(), T = c(), U = function(a, b) {
            return a === b && (E = !0),
            0
        }, V = 1 << 31, W = {}.hasOwnProperty, X = [], Y = X.pop, Z = X.push, $ = X.push, _ = X.slice, aa = function(a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] === b)
                    return c;
            return -1
        }, ba = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ca = "[\\x20\\t\\r\\n\\f]", da = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", ea = "\\[" + ca + "*(" + da + ")(?:" + ca + "*([*^$|!~]?=)" + ca + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + da + "))|)" + ca + "*\\]", fa = ":(" + da + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ea + ")*)|.*)\\)|)", ga = new RegExp(ca + "+","g"), ha = new RegExp("^" + ca + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ca + "+$","g"), ia = new RegExp("^" + ca + "*," + ca + "*"), ja = new RegExp("^" + ca + "*([>+~]|" + ca + ")" + ca + "*"), ka = new RegExp("=" + ca + "*([^\\]'\"]*?)" + ca + "*\\]","g"), la = new RegExp(fa), ma = new RegExp("^" + da + "$"), na = {
            ID: new RegExp("^#(" + da + ")"),
            CLASS: new RegExp("^\\.(" + da + ")"),
            TAG: new RegExp("^(" + da + "|[*])"),
            ATTR: new RegExp("^" + ea),
            PSEUDO: new RegExp("^" + fa),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ca + "*(even|odd|(([+-]|)(\\d*)n|)" + ca + "*(?:([+-]|)" + ca + "*(\\d+)|))" + ca + "*\\)|)","i"),
            bool: new RegExp("^(?:" + ba + ")$","i"),
            needsContext: new RegExp("^" + ca + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ca + "*((?:-\\d)?\\d*)" + ca + "*\\)|)(?=[^-]|$)","i")
        }, oa = /^(?:input|select|textarea|button)$/i, pa = /^h\d$/i, qa = /^[^{]+\{\s*\[native \w/, ra = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, sa = /[+~]/, ta = /'|\\/g, ua = new RegExp("\\\\([\\da-f]{1,6}" + ca + "?|(" + ca + ")|.)","ig"), va = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : d < 0 ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        }, wa = function() {
            F()
        };
        try {
            $.apply(X = _.call(O.childNodes), O.childNodes),
            X[O.childNodes.length].nodeType
        } catch (xa) {
            $ = {
                apply: X.length ? function(a, b) {
                    Z.apply(a, _.call(b))
                }
                : function(a, b) {
                    for (var c = a.length, d = 0; a[c++] = b[d++]; )
                        ;
                    a.length = c - 1
                }
            }
        }
        v = b.support = {},
        y = b.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return !!b && "HTML" !== b.nodeName
        }
        ,
        F = b.setDocument = function(a) {
            var b, c, d = a ? a.ownerDocument || a : O;
            return d !== G && 9 === d.nodeType && d.documentElement ? (G = d,
            H = G.documentElement,
            I = !y(G),
            (c = G.defaultView) && c.top !== c && (c.addEventListener ? c.addEventListener("unload", wa, !1) : c.attachEvent && c.attachEvent("onunload", wa)),
            v.attributes = e(function(a) {
                return a.className = "i",
                !a.getAttribute("className")
            }),
            v.getElementsByTagName = e(function(a) {
                return a.appendChild(G.createComment("")),
                !a.getElementsByTagName("*").length
            }),
            v.getElementsByClassName = qa.test(G.getElementsByClassName),
            v.getById = e(function(a) {
                return H.appendChild(a).id = N,
                !G.getElementsByName || !G.getElementsByName(N).length
            }),
            v.getById ? (w.find.ID = function(a, b) {
                if ("undefined" != typeof b.getElementById && I) {
                    var c = b.getElementById(a);
                    return c ? [c] : []
                }
            }
            ,
            w.filter.ID = function(a) {
                var b = a.replace(ua, va);
                return function(a) {
                    return a.getAttribute("id") === b
                }
            }
            ) : (delete w.find.ID,
            w.filter.ID = function(a) {
                var b = a.replace(ua, va);
                return function(a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }
            ),
            w.find.TAG = v.getElementsByTagName ? function(a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0
            }
            : function(a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    for (; c = f[e++]; )
                        1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }
            ,
            w.find.CLASS = v.getElementsByClassName && function(a, b) {
                if ("undefined" != typeof b.getElementsByClassName && I)
                    return b.getElementsByClassName(a)
            }
            ,
            K = [],
            J = [],
            (v.qsa = qa.test(G.querySelectorAll)) && (e(function(a) {
                H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + ca + "*(?:''|\"\")"),
                a.querySelectorAll("[selected]").length || J.push("\\[" + ca + "*(?:value|" + ba + ")"),
                a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="),
                a.querySelectorAll(":checked").length || J.push(":checked"),
                a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]")
            }),
            e(function(a) {
                var b = G.createElement("input");
                b.setAttribute("type", "hidden"),
                a.appendChild(b).setAttribute("name", "D"),
                a.querySelectorAll("[name=d]").length && J.push("name" + ca + "*[*^$|!~]?="),
                a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"),
                a.querySelectorAll("*,:x"),
                J.push(",.*:")
            })),
            (v.matchesSelector = qa.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function(a) {
                v.disconnectedMatch = L.call(a, "div"),
                L.call(a, "[s!='']:x"),
                K.push("!=", fa)
            }),
            J = J.length && new RegExp(J.join("|")),
            K = K.length && new RegExp(K.join("|")),
            b = qa.test(H.compareDocumentPosition),
            M = b || qa.test(H.contains) ? function(a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a
                  , d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            }
            : function(a, b) {
                if (b)
                    for (; b = b.parentNode; )
                        if (b === a)
                            return !0;
                return !1
            }
            ,
            U = b ? function(a, b) {
                if (a === b)
                    return E = !0,
                    0;
                var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1,
                1 & c || !v.sortDetached && b.compareDocumentPosition(a) === c ? a === G || a.ownerDocument === O && M(O, a) ? -1 : b === G || b.ownerDocument === O && M(O, b) ? 1 : D ? aa(D, a) - aa(D, b) : 0 : 4 & c ? -1 : 1)
            }
            : function(a, b) {
                if (a === b)
                    return E = !0,
                    0;
                var c, d = 0, e = a.parentNode, f = b.parentNode, h = [a], i = [b];
                if (!e || !f)
                    return a === G ? -1 : b === G ? 1 : e ? -1 : f ? 1 : D ? aa(D, a) - aa(D, b) : 0;
                if (e === f)
                    return g(a, b);
                for (c = a; c = c.parentNode; )
                    h.unshift(c);
                for (c = b; c = c.parentNode; )
                    i.unshift(c);
                for (; h[d] === i[d]; )
                    d++;
                return d ? g(h[d], i[d]) : h[d] === O ? -1 : i[d] === O ? 1 : 0
            }
            ,
            G) : G
        }
        ,
        b.matches = function(a, c) {
            return b(a, null, null, c)
        }
        ,
        b.matchesSelector = function(a, c) {
            if ((a.ownerDocument || a) !== G && F(a),
            c = c.replace(ka, "='$1']"),
            v.matchesSelector && I && !T[c + " "] && (!K || !K.test(c)) && (!J || !J.test(c)))
                try {
                    var d = L.call(a, c);
                    if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                        return d
                } catch (e) {}
            return b(c, G, null, [a]).length > 0
        }
        ,
        b.contains = function(a, b) {
            return (a.ownerDocument || a) !== G && F(a),
            M(a, b)
        }
        ,
        b.attr = function(a, b) {
            (a.ownerDocument || a) !== G && F(a);
            var c = w.attrHandle[b.toLowerCase()]
              , d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
            return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }
        ,
        b.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }
        ,
        b.uniqueSort = function(a) {
            var b, c = [], d = 0, e = 0;
            if (E = !v.detectDuplicates,
            D = !v.sortStable && a.slice(0),
            a.sort(U),
            E) {
                for (; b = a[e++]; )
                    b === a[e] && (d = c.push(e));
                for (; d--; )
                    a.splice(c[d], 1)
            }
            return D = null,
            a
        }
        ,
        x = b.getText = function(a) {
            var b, c = "", d = 0, e = a.nodeType;
            if (e) {
                if (1 === e || 9 === e || 11 === e) {
                    if ("string" == typeof a.textContent)
                        return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)
                        c += x(a)
                } else if (3 === e || 4 === e)
                    return a.nodeValue
            } else
                for (; b = a[d++]; )
                    c += x(b);
            return c
        }
        ,
        w = b.selectors = {
            cacheLength: 50,
            createPseudo: d,
            match: na,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(ua, va),
                    a[3] = (a[3] || a[4] || a[5] || "").replace(ua, va),
                    "~=" === a[2] && (a[3] = " " + a[3] + " "),
                    a.slice(0, 4)
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(),
                    "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]),
                    a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])),
                    a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]),
                    a
                },
                PSEUDO: function(a) {
                    var b, c = !a[6] && a[2];
                    return na.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && la.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b),
                    a[2] = c.slice(0, b)),
                    a.slice(0, 3))
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(ua, va).toLowerCase();
                    return "*" === a ? function() {
                        return !0
                    }
                    : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function(a) {
                    var b = R[a + " "];
                    return b || (b = new RegExp("(^|" + ca + ")" + a + "(" + ca + "|$)")) && R(a, function(a) {
                        return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                    })
                },
                ATTR: function(a, c, d) {
                    return function(e) {
                        var f = b.attr(e, a);
                        return null == f ? "!=" === c : !c || (f += "",
                        "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f.replace(ga, " ") + " ").indexOf(d) > -1 : "|=" === c && (f === d || f.slice(0, d.length + 1) === d + "-"))
                    }
                },
                CHILD: function(a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3)
                      , g = "last" !== a.slice(-4)
                      , h = "of-type" === b;
                    return 1 === d && 0 === e ? function(a) {
                        return !!a.parentNode
                    }
                    : function(b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h, t = !1;
                        if (q) {
                            if (f) {
                                for (; p; ) {
                                    for (m = b; m = m[p]; )
                                        if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType)
                                            return !1;
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild],
                            g && s) {
                                for (m = q,
                                l = m[N] || (m[N] = {}),
                                k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                                j = k[a] || [],
                                n = j[0] === P && j[1],
                                t = n && j[2],
                                m = n && q.childNodes[n]; m = ++n && m && m[p] || (t = n = 0) || o.pop(); )
                                    if (1 === m.nodeType && ++t && m === b) {
                                        k[a] = [P, n, t];
                                        break
                                    }
                            } else if (s && (m = b,
                            l = m[N] || (m[N] = {}),
                            k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                            j = k[a] || [],
                            n = j[0] === P && j[1],
                            t = n),
                            t === !1)
                                for (; (m = ++n && m && m[p] || (t = n = 0) || o.pop()) && ((h ? m.nodeName.toLowerCase() !== r : 1 !== m.nodeType) || !++t || (s && (l = m[N] || (m[N] = {}),
                                k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                                k[a] = [P, t]),
                                m !== b)); )
                                    ;
                            return t -= e,
                            t === d || t % d === 0 && t / d >= 0
                        }
                    }
                },
                PSEUDO: function(a, c) {
                    var e, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                    return f[N] ? f(c) : f.length > 1 ? (e = [a, a, "", c],
                    w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                        for (var d, e = f(a, c), g = e.length; g--; )
                            d = aa(a, e[g]),
                            a[d] = !(b[d] = e[g])
                    }) : function(a) {
                        return f(a, 0, e)
                    }
                    ) : f
                }
            },
            pseudos: {
                not: d(function(a) {
                    var b = []
                      , c = []
                      , e = A(a.replace(ha, "$1"));
                    return e[N] ? d(function(a, b, c, d) {
                        for (var f, g = e(a, null, d, []), h = a.length; h--; )
                            (f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function(a, d, f) {
                        return b[0] = a,
                        e(b, null, f, c),
                        b[0] = null,
                        !c.pop()
                    }
                }),
                has: d(function(a) {
                    return function(c) {
                        return b(a, c).length > 0
                    }
                }),
                contains: d(function(a) {
                    return a = a.replace(ua, va),
                    function(b) {
                        return (b.textContent || b.innerText || x(b)).indexOf(a) > -1
                    }
                }),
                lang: d(function(a) {
                    return ma.test(a || "") || b.error("unsupported lang: " + a),
                    a = a.replace(ua, va).toLowerCase(),
                    function(b) {
                        var c;
                        do
                            if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                                return c = c.toLowerCase(),
                                c === a || 0 === c.indexOf(a + "-");
                        while ((b = b.parentNode) && 1 === b.nodeType);return !1
                    }
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function(a) {
                    return a === H
                },
                focus: function(a) {
                    return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: function(a) {
                    return a.disabled === !1
                },
                disabled: function(a) {
                    return a.disabled === !0
                },
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex,
                    a.selected === !0
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (a.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(a) {
                    return !w.pseudos.empty(a)
                },
                header: function(a) {
                    return pa.test(a.nodeName)
                },
                input: function(a) {
                    return oa.test(a.nodeName)
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: j(function() {
                    return [0]
                }),
                last: j(function(a, b) {
                    return [b - 1]
                }),
                eq: j(function(a, b, c) {
                    return [c < 0 ? c + b : c]
                }),
                even: j(function(a, b) {
                    for (var c = 0; c < b; c += 2)
                        a.push(c);
                    return a
                }),
                odd: j(function(a, b) {
                    for (var c = 1; c < b; c += 2)
                        a.push(c);
                    return a
                }),
                lt: j(function(a, b, c) {
                    for (var d = c < 0 ? c + b : c; --d >= 0; )
                        a.push(d);
                    return a
                }),
                gt: j(function(a, b, c) {
                    for (var d = c < 0 ? c + b : c; ++d < b; )
                        a.push(d);
                    return a
                })
            }
        },
        w.pseudos.nth = w.pseudos.eq;
        for (u in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            w.pseudos[u] = h(u);
        for (u in {
            submit: !0,
            reset: !0
        })
            w.pseudos[u] = i(u);
        return l.prototype = w.filters = w.pseudos,
        w.setFilters = new l,
        z = b.tokenize = function(a, c) {
            var d, e, f, g, h, i, j, k = S[a + " "];
            if (k)
                return c ? 0 : k.slice(0);
            for (h = a,
            i = [],
            j = w.preFilter; h; ) {
                d && !(e = ia.exec(h)) || (e && (h = h.slice(e[0].length) || h),
                i.push(f = [])),
                d = !1,
                (e = ja.exec(h)) && (d = e.shift(),
                f.push({
                    value: d,
                    type: e[0].replace(ha, " ")
                }),
                h = h.slice(d.length));
                for (g in w.filter)
                    !(e = na[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(),
                    f.push({
                        value: d,
                        type: g,
                        matches: e
                    }),
                    h = h.slice(d.length));
                if (!d)
                    break
            }
            return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
        }
        ,
        A = b.compile = function(a, b) {
            var c, d = [], e = [], f = T[a + " "];
            if (!f) {
                for (b || (b = z(a)),
                c = b.length; c--; )
                    f = s(b[c]),
                    f[N] ? d.push(f) : e.push(f);
                f = T(a, t(e, d)),
                f.selector = a
            }
            return f
        }
        ,
        B = b.select = function(a, b, c, d) {
            var e, f, g, h, i, j = "function" == typeof a && a, l = !d && z(a = j.selector || a);
            if (c = c || [],
            1 === l.length) {
                if (f = l[0] = l[0].slice(0),
                f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                    if (b = (w.find.ID(g.matches[0].replace(ua, va), b) || [])[0],
                    !b)
                        return c;
                    j && (b = b.parentNode),
                    a = a.slice(f.shift().value.length)
                }
                for (e = na.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e],
                !w.relative[h = g.type]); )
                    if ((i = w.find[h]) && (d = i(g.matches[0].replace(ua, va), sa.test(f[0].type) && k(b.parentNode) || b))) {
                        if (f.splice(e, 1),
                        a = d.length && m(f),
                        !a)
                            return $.apply(c, d),
                            c;
                        break
                    }
            }
            return (j || A(a, l))(d, b, !I, c, !b || sa.test(a) && k(b.parentNode) || b),
            c
        }
        ,
        v.sortStable = N.split("").sort(U).join("") === N,
        v.detectDuplicates = !!E,
        F(),
        v.sortDetached = e(function(a) {
            return 1 & a.compareDocumentPosition(G.createElement("div"))
        }),
        e(function(a) {
            return a.innerHTML = "<a href='#'></a>",
            "#" === a.firstChild.getAttribute("href")
        }) || f("type|href|height|width", function(a, b, c) {
            if (!c)
                return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }),
        v.attributes && e(function(a) {
            return a.innerHTML = "<input/>",
            a.firstChild.setAttribute("value", ""),
            "" === a.firstChild.getAttribute("value")
        }) || f("value", function(a, b, c) {
            if (!c && "input" === a.nodeName.toLowerCase())
                return a.defaultValue
        }),
        e(function(a) {
            return null == a.getAttribute("disabled")
        }) || f(ba, function(a, b, c) {
            var d;
            if (!c)
                return a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }),
        b
    }(a);
    fa.find = ka,
    fa.expr = ka.selectors,
    fa.expr[":"] = fa.expr.pseudos,
    fa.uniqueSort = fa.unique = ka.uniqueSort,
    fa.text = ka.getText,
    fa.isXMLDoc = ka.isXML,
    fa.contains = ka.contains;
    var la = function(a, b, c) {
        for (var d = [], e = void 0 !== c; (a = a[b]) && 9 !== a.nodeType; )
            if (1 === a.nodeType) {
                if (e && fa(a).is(c))
                    break;
                d.push(a)
            }
        return d
    }
      , ma = function(a, b) {
        for (var c = []; a; a = a.nextSibling)
            1 === a.nodeType && a !== b && c.push(a);
        return c
    }
      , na = fa.expr.match.needsContext
      , oa = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/
      , pa = /^.[^:#\[\.,]*$/;
    fa.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"),
        1 === b.length && 1 === d.nodeType ? fa.find.matchesSelector(d, a) ? [d] : [] : fa.find.matches(a, fa.grep(b, function(a) {
            return 1 === a.nodeType
        }))
    }
    ,
    fa.fn.extend({
        find: function(a) {
            var b, c = this.length, d = [], e = this;
            if ("string" != typeof a)
                return this.pushStack(fa(a).filter(function() {
                    for (b = 0; b < c; b++)
                        if (fa.contains(e[b], this))
                            return !0
                }));
            for (b = 0; b < c; b++)
                fa.find(a, e[b], d);
            return d = this.pushStack(c > 1 ? fa.unique(d) : d),
            d.selector = this.selector ? this.selector + " " + a : a,
            d
        },
        filter: function(a) {
            return this.pushStack(d(this, a || [], !1))
        },
        not: function(a) {
            return this.pushStack(d(this, a || [], !0))
        },
        is: function(a) {
            return !!d(this, "string" == typeof a && na.test(a) ? fa(a) : a || [], !1).length
        }
    });
    var qa, ra = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, sa = fa.fn.init = function(a, b, c) {
        var d, e;
        if (!a)
            return this;
        if (c = c || qa,
        "string" == typeof a) {
            if (d = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : ra.exec(a),
            !d || !d[1] && b)
                return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);
            if (d[1]) {
                if (b = b instanceof fa ? b[0] : b,
                fa.merge(this, fa.parseHTML(d[1], b && b.nodeType ? b.ownerDocument || b : X, !0)),
                oa.test(d[1]) && fa.isPlainObject(b))
                    for (d in b)
                        fa.isFunction(this[d]) ? this[d](b[d]) : this.attr(d, b[d]);
                return this
            }
            return e = X.getElementById(d[2]),
            e && e.parentNode && (this.length = 1,
            this[0] = e),
            this.context = X,
            this.selector = a,
            this
        }
        return a.nodeType ? (this.context = this[0] = a,
        this.length = 1,
        this) : fa.isFunction(a) ? void 0 !== c.ready ? c.ready(a) : a(fa) : (void 0 !== a.selector && (this.selector = a.selector,
        this.context = a.context),
        fa.makeArray(a, this))
    }
    ;
    sa.prototype = fa.fn,
    qa = fa(X);
    var ta = /^(?:parents|prev(?:Until|All))/
      , ua = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    fa.fn.extend({
        has: function(a) {
            var b = fa(a, this)
              , c = b.length;
            return this.filter(function() {
                for (var a = 0; a < c; a++)
                    if (fa.contains(this, b[a]))
                        return !0
            })
        },
        closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = na.test(a) || "string" != typeof a ? fa(a, b || this.context) : 0; d < e; d++)
                for (c = this[d]; c && c !== b; c = c.parentNode)
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && fa.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
            return this.pushStack(f.length > 1 ? fa.uniqueSort(f) : f)
        },
        index: function(a) {
            return a ? "string" == typeof a ? _.call(fa(a), this[0]) : _.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, b) {
            return this.pushStack(fa.uniqueSort(fa.merge(this.get(), fa(a, b))))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    }),
    fa.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return la(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return la(a, "parentNode", c)
        },
        next: function(a) {
            return e(a, "nextSibling")
        },
        prev: function(a) {
            return e(a, "previousSibling")
        },
        nextAll: function(a) {
            return la(a, "nextSibling")
        },
        prevAll: function(a) {
            return la(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return la(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return la(a, "previousSibling", c)
        },
        siblings: function(a) {
            return ma((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return ma(a.firstChild)
        },
        contents: function(a) {
            return a.contentDocument || fa.merge([], a.childNodes)
        }
    }, function(a, b) {
        fa.fn[a] = function(c, d) {
            var e = fa.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c),
            d && "string" == typeof d && (e = fa.filter(d, e)),
            this.length > 1 && (ua[a] || fa.uniqueSort(e),
            ta.test(a) && e.reverse()),
            this.pushStack(e)
        }
    });
    var va = /\S+/g;
    fa.Callbacks = function(a) {
        a = "string" == typeof a ? f(a) : fa.extend({}, a);
        var b, c, d, e, g = [], h = [], i = -1, j = function() {
            for (e = a.once,
            d = b = !0; h.length; i = -1)
                for (c = h.shift(); ++i < g.length; )
                    g[i].apply(c[0], c[1]) === !1 && a.stopOnFalse && (i = g.length,
                    c = !1);
            a.memory || (c = !1),
            b = !1,
            e && (g = c ? [] : "")
        }, k = {
            add: function() {
                return g && (c && !b && (i = g.length - 1,
                h.push(c)),
                function d(b) {
                    fa.each(b, function(b, c) {
                        fa.isFunction(c) ? a.unique && k.has(c) || g.push(c) : c && c.length && "string" !== fa.type(c) && d(c)
                    })
                }(arguments),
                c && !b && j()),
                this
            },
            remove: function() {
                return fa.each(arguments, function(a, b) {
                    for (var c; (c = fa.inArray(b, g, c)) > -1; )
                        g.splice(c, 1),
                        c <= i && i--
                }),
                this
            },
            has: function(a) {
                return a ? fa.inArray(a, g) > -1 : g.length > 0
            },
            empty: function() {
                return g && (g = []),
                this
            },
            disable: function() {
                return e = h = [],
                g = c = "",
                this
            },
            disabled: function() {
                return !g
            },
            lock: function() {
                return e = h = [],
                c || (g = c = ""),
                this
            },
            locked: function() {
                return !!e
            },
            fireWith: function(a, c) {
                return e || (c = c || [],
                c = [a, c.slice ? c.slice() : c],
                h.push(c),
                b || j()),
                this
            },
            fire: function() {
                return k.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!d
            }
        };
        return k
    }
    ,
    fa.extend({
        Deferred: function(a) {
            var b = [["resolve", "done", fa.Callbacks("once memory"), "resolved"], ["reject", "fail", fa.Callbacks("once memory"), "rejected"], ["notify", "progress", fa.Callbacks("memory")]]
              , c = "pending"
              , d = {
                state: function() {
                    return c
                },
                always: function() {
                    return e.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var a = arguments;
                    return fa.Deferred(function(c) {
                        fa.each(b, function(b, f) {
                            var g = fa.isFunction(a[b]) && a[b];
                            e[f[1]](function() {
                                var a = g && g.apply(this, arguments);
                                a && fa.isFunction(a.promise) ? a.promise().progress(c.notify).done(c.resolve).fail(c.reject) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                            })
                        }),
                        a = null
                    }).promise()
                },
                promise: function(a) {
                    return null != a ? fa.extend(a, d) : d
                }
            }
              , e = {};
            return d.pipe = d.then,
            fa.each(b, function(a, f) {
                var g = f[2]
                  , h = f[3];
                d[f[1]] = g.add,
                h && g.add(function() {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock),
                e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments),
                    this
                }
                ,
                e[f[0] + "With"] = g.fireWith
            }),
            d.promise(e),
            a && a.call(e, e),
            e
        },
        when: function(a) {
            var b, c, d, e = 0, f = Y.call(arguments), g = f.length, h = 1 !== g || a && fa.isFunction(a.promise) ? g : 0, i = 1 === h ? a : fa.Deferred(), j = function(a, c, d) {
                return function(e) {
                    c[a] = this,
                    d[a] = arguments.length > 1 ? Y.call(arguments) : e,
                    d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                }
            };
            if (g > 1)
                for (b = new Array(g),
                c = new Array(g),
                d = new Array(g); e < g; e++)
                    f[e] && fa.isFunction(f[e].promise) ? f[e].promise().progress(j(e, c, b)).done(j(e, d, f)).fail(i.reject) : --h;
            return h || i.resolveWith(d, f),
            i.promise()
        }
    });
    var wa;
    fa.fn.ready = function(a) {
        return fa.ready.promise().done(a),
        this
    }
    ,
    fa.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? fa.readyWait++ : fa.ready(!0)
        },
        ready: function(a) {
            (a === !0 ? --fa.readyWait : fa.isReady) || (fa.isReady = !0,
            a !== !0 && --fa.readyWait > 0 || (wa.resolveWith(X, [fa]),
            fa.fn.triggerHandler && (fa(X).triggerHandler("ready"),
            fa(X).off("ready"))))
        }
    }),
    fa.ready.promise = function(b) {
        return wa || (wa = fa.Deferred(),
        "complete" === X.readyState || "loading" !== X.readyState && !X.documentElement.doScroll ? a.setTimeout(fa.ready) : (X.addEventListener("DOMContentLoaded", g),
        a.addEventListener("load", g))),
        wa.promise(b)
    }
    ,
    fa.ready.promise();
    var xa = function(a, b, c, d, e, f, g) {
        var h = 0
          , i = a.length
          , j = null == c;
        if ("object" === fa.type(c)) {
            e = !0;
            for (h in c)
                xa(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0,
        fa.isFunction(d) || (g = !0),
        j && (g ? (b.call(a, d),
        b = null) : (j = b,
        b = function(a, b, c) {
            return j.call(fa(a), c)
        }
        )),
        b))
            for (; h < i; h++)
                b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    }
      , ya = function(a) {
        return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType
    };
    h.uid = 1,
    h.prototype = {
        register: function(a, b) {
            var c = b || {};
            return a.nodeType ? a[this.expando] = c : Object.defineProperty(a, this.expando, {
                value: c,
                writable: !0,
                configurable: !0
            }),
            a[this.expando]
        },
        cache: function(a) {
            if (!ya(a))
                return {};
            var b = a[this.expando];
            return b || (b = {},
            ya(a) && (a.nodeType ? a[this.expando] = b : Object.defineProperty(a, this.expando, {
                value: b,
                configurable: !0
            }))),
            b
        },
        set: function(a, b, c) {
            var d, e = this.cache(a);
            if ("string" == typeof b)
                e[b] = c;
            else
                for (d in b)
                    e[d] = b[d];
            return e
        },
        get: function(a, b) {
            return void 0 === b ? this.cache(a) : a[this.expando] && a[this.expando][b]
        },
        access: function(a, b, c) {
            var d;
            return void 0 === b || b && "string" == typeof b && void 0 === c ? (d = this.get(a, b),
            void 0 !== d ? d : this.get(a, fa.camelCase(b))) : (this.set(a, b, c),
            void 0 !== c ? c : b)
        },
        remove: function(a, b) {
            var c, d, e, f = a[this.expando];
            if (void 0 !== f) {
                if (void 0 === b)
                    this.register(a);
                else {
                    fa.isArray(b) ? d = b.concat(b.map(fa.camelCase)) : (e = fa.camelCase(b),
                    b in f ? d = [b, e] : (d = e,
                    d = d in f ? [d] : d.match(va) || [])),
                    c = d.length;
                    for (; c--; )
                        delete f[d[c]]
                }
                (void 0 === b || fa.isEmptyObject(f)) && (a.nodeType ? a[this.expando] = void 0 : delete a[this.expando])
            }
        },
        hasData: function(a) {
            var b = a[this.expando];
            return void 0 !== b && !fa.isEmptyObject(b)
        }
    };
    var za = new h
      , Aa = new h
      , Ba = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Ca = /[A-Z]/g;
    fa.extend({
        hasData: function(a) {
            return Aa.hasData(a) || za.hasData(a)
        },
        data: function(a, b, c) {
            return Aa.access(a, b, c)
        },
        removeData: function(a, b) {
            Aa.remove(a, b)
        },
        _data: function(a, b, c) {
            return za.access(a, b, c)
        },
        _removeData: function(a, b) {
            za.remove(a, b)
        }
    }),
    fa.fn.extend({
        data: function(a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = Aa.get(f),
                1 === f.nodeType && !za.get(f, "hasDataAttrs"))) {
                    for (c = g.length; c--; )
                        g[c] && (d = g[c].name,
                        0 === d.indexOf("data-") && (d = fa.camelCase(d.slice(5)),
                        i(f, d, e[d])));
                    za.set(f, "hasDataAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function() {
                Aa.set(this, a)
            }) : xa(this, function(b) {
                var c, d;
                if (f && void 0 === b) {
                    if (c = Aa.get(f, a) || Aa.get(f, a.replace(Ca, "-$&").toLowerCase()),
                    void 0 !== c)
                        return c;
                    if (d = fa.camelCase(a),
                    c = Aa.get(f, d),
                    void 0 !== c)
                        return c;
                    if (c = i(f, d, void 0),
                    void 0 !== c)
                        return c
                } else
                    d = fa.camelCase(a),
                    this.each(function() {
                        var c = Aa.get(this, d);
                        Aa.set(this, d, b),
                        a.indexOf("-") > -1 && void 0 !== c && Aa.set(this, a, b)
                    })
            }, null, b, arguments.length > 1, null, !0)
        },
        removeData: function(a) {
            return this.each(function() {
                Aa.remove(this, a)
            })
        }
    }),
    fa.extend({
        queue: function(a, b, c) {
            var d;
            if (a)
                return b = (b || "fx") + "queue",
                d = za.get(a, b),
                c && (!d || fa.isArray(c) ? d = za.access(a, b, fa.makeArray(c)) : d.push(c)),
                d || []
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = fa.queue(a, b)
              , d = c.length
              , e = c.shift()
              , f = fa._queueHooks(a, b)
              , g = function() {
                fa.dequeue(a, b)
            };
            "inprogress" === e && (e = c.shift(),
            d--),
            e && ("fx" === b && c.unshift("inprogress"),
            delete f.stop,
            e.call(a, g, f)),
            !d && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return za.get(a, c) || za.access(a, c, {
                empty: fa.Callbacks("once memory").add(function() {
                    za.remove(a, [b + "queue", c])
                })
            })
        }
    }),
    fa.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a,
            a = "fx",
            c--),
            arguments.length < c ? fa.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = fa.queue(this, a, b);
                fa._queueHooks(this, a),
                "fx" === a && "inprogress" !== c[0] && fa.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                fa.dequeue(this, a)
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, b) {
            var c, d = 1, e = fa.Deferred(), f = this, g = this.length, h = function() {
                --d || e.resolveWith(f, [f])
            };
            for ("string" != typeof a && (b = a,
            a = void 0),
            a = a || "fx"; g--; )
                c = za.get(f[g], a + "queueHooks"),
                c && c.empty && (d++,
                c.empty.add(h));
            return h(),
            e.promise(b)
        }
    });
    var Da = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , Ea = new RegExp("^(?:([+-])=|)(" + Da + ")([a-z%]*)$","i")
      , Fa = ["Top", "Right", "Bottom", "Left"]
      , Ga = function(a, b) {
        return a = b || a,
        "none" === fa.css(a, "display") || !fa.contains(a.ownerDocument, a)
    }
      , Ha = /^(?:checkbox|radio)$/i
      , Ia = /<([\w:-]+)/
      , Ja = /^$|\/(?:java|ecma)script/i
      , Ka = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    Ka.optgroup = Ka.option,
    Ka.tbody = Ka.tfoot = Ka.colgroup = Ka.caption = Ka.thead,
    Ka.th = Ka.td;
    var La = /<|&#?\w+;/;
    !function() {
        var a = X.createDocumentFragment()
          , b = a.appendChild(X.createElement("div"))
          , c = X.createElement("input");
        c.setAttribute("type", "radio"),
        c.setAttribute("checked", "checked"),
        c.setAttribute("name", "t"),
        b.appendChild(c),
        da.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked,
        b.innerHTML = "<textarea>x</textarea>",
        da.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue
    }();
    var Ma = /^key/
      , Na = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
      , Oa = /^([^.]*)(?:\.(.+)|)/;
    fa.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = za.get(a);
            if (q)
                for (c.handler && (f = c,
                c = f.handler,
                e = f.selector),
                c.guid || (c.guid = fa.guid++),
                (i = q.events) || (i = q.events = {}),
                (g = q.handle) || (g = q.handle = function(b) {
                    return "undefined" != typeof fa && fa.event.triggered !== b.type ? fa.event.dispatch.apply(a, arguments) : void 0
                }
                ),
                b = (b || "").match(va) || [""],
                j = b.length; j--; )
                    h = Oa.exec(b[j]) || [],
                    n = p = h[1],
                    o = (h[2] || "").split(".").sort(),
                    n && (l = fa.event.special[n] || {},
                    n = (e ? l.delegateType : l.bindType) || n,
                    l = fa.event.special[n] || {},
                    k = fa.extend({
                        type: n,
                        origType: p,
                        data: d,
                        handler: c,
                        guid: c.guid,
                        selector: e,
                        needsContext: e && fa.expr.match.needsContext.test(e),
                        namespace: o.join(".")
                    }, f),
                    (m = i[n]) || (m = i[n] = [],
                    m.delegateCount = 0,
                    l.setup && l.setup.call(a, d, o, g) !== !1 || a.addEventListener && a.addEventListener(n, g)),
                    l.add && (l.add.call(a, k),
                    k.handler.guid || (k.handler.guid = c.guid)),
                    e ? m.splice(m.delegateCount++, 0, k) : m.push(k),
                    fa.event.global[n] = !0)
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = za.hasData(a) && za.get(a);
            if (q && (i = q.events)) {
                for (b = (b || "").match(va) || [""],
                j = b.length; j--; )
                    if (h = Oa.exec(b[j]) || [],
                    n = p = h[1],
                    o = (h[2] || "").split(".").sort(),
                    n) {
                        for (l = fa.event.special[n] || {},
                        n = (d ? l.delegateType : l.bindType) || n,
                        m = i[n] || [],
                        h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        g = f = m.length; f--; )
                            k = m[f],
                            !e && p !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1),
                            k.selector && m.delegateCount--,
                            l.remove && l.remove.call(a, k));
                        g && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || fa.removeEvent(a, n, q.handle),
                        delete i[n])
                    } else
                        for (n in i)
                            fa.event.remove(a, n + b[j], c, d, !0);
                fa.isEmptyObject(i) && za.remove(a, "handle events")
            }
        },
        dispatch: function(a) {
            a = fa.event.fix(a);
            var b, c, d, e, f, g = [], h = Y.call(arguments), i = (za.get(this, "events") || {})[a.type] || [], j = fa.event.special[a.type] || {};
            if (h[0] = a,
            a.delegateTarget = this,
            !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                for (g = fa.event.handlers.call(this, a, i),
                b = 0; (e = g[b++]) && !a.isPropagationStopped(); )
                    for (a.currentTarget = e.elem,
                    c = 0; (f = e.handlers[c++]) && !a.isImmediatePropagationStopped(); )
                        a.rnamespace && !a.rnamespace.test(f.namespace) || (a.handleObj = f,
                        a.data = f.data,
                        d = ((fa.event.special[f.origType] || {}).handle || f.handler).apply(e.elem, h),
                        void 0 !== d && (a.result = d) === !1 && (a.preventDefault(),
                        a.stopPropagation()));
                return j.postDispatch && j.postDispatch.call(this, a),
                a.result
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && ("click" !== a.type || isNaN(a.button) || a.button < 1))
                for (; i !== this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (d = [],
                        c = 0; c < h; c++)
                            f = b[c],
                            e = f.selector + " ",
                            void 0 === d[e] && (d[e] = f.needsContext ? fa(e, this).index(i) > -1 : fa.find(e, this, null, [i]).length),
                            d[e] && d.push(f);
                        d.length && g.push({
                            elem: i,
                            handlers: d
                        })
                    }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }),
            g
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode),
                a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, d, e, f = b.button;
                return null == a.pageX && null != b.clientX && (c = a.target.ownerDocument || X,
                d = c.documentElement,
                e = c.body,
                a.pageX = b.clientX + (d && d.scrollLeft || e && e.scrollLeft || 0) - (d && d.clientLeft || e && e.clientLeft || 0),
                a.pageY = b.clientY + (d && d.scrollTop || e && e.scrollTop || 0) - (d && d.clientTop || e && e.clientTop || 0)),
                a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
                a
            }
        },
        fix: function(a) {
            if (a[fa.expando])
                return a;
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            for (g || (this.fixHooks[e] = g = Na.test(e) ? this.mouseHooks : Ma.test(e) ? this.keyHooks : {}),
            d = g.props ? this.props.concat(g.props) : this.props,
            a = new fa.Event(f),
            b = d.length; b--; )
                c = d[b],
                a[c] = f[c];
            return a.target || (a.target = X),
            3 === a.target.nodeType && (a.target = a.target.parentNode),
            g.filter ? g.filter(a, f) : a
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== p() && this.focus)
                        return this.focus(),
                        !1
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === p() && this.blur)
                        return this.blur(),
                        !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if ("checkbox" === this.type && this.click && fa.nodeName(this, "input"))
                        return this.click(),
                        !1
                },
                _default: function(a) {
                    return fa.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        }
    },
    fa.removeEvent = function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c)
    }
    ,
    fa.Event = function(a, b) {
        return this instanceof fa.Event ? (a && a.type ? (this.originalEvent = a,
        this.type = a.type,
        this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? n : o) : this.type = a,
        b && fa.extend(this, b),
        this.timeStamp = a && a.timeStamp || fa.now(),
        void (this[fa.expando] = !0)) : new fa.Event(a,b)
    }
    ,
    fa.Event.prototype = {
        constructor: fa.Event,
        isDefaultPrevented: o,
        isPropagationStopped: o,
        isImmediatePropagationStopped: o,
        isSimulated: !1,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = n,
            a && !this.isSimulated && a.preventDefault()
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = n,
            a && !this.isSimulated && a.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = n,
            a && !this.isSimulated && a.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    fa.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(a, b) {
        fa.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return e && (e === d || fa.contains(d, e)) || (a.type = f.origType,
                c = f.handler.apply(this, arguments),
                a.type = b),
                c
            }
        }
    }),
    fa.fn.extend({
        on: function(a, b, c, d) {
            return q(this, a, b, c, d)
        },
        one: function(a, b, c, d) {
            return q(this, a, b, c, d, 1)
        },
        off: function(a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj)
                return d = a.handleObj,
                fa(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler),
                this;
            if ("object" == typeof a) {
                for (e in a)
                    this.off(e, b, a[e]);
                return this
            }
            return b !== !1 && "function" != typeof b || (c = b,
            b = void 0),
            c === !1 && (c = o),
            this.each(function() {
                fa.event.remove(this, a, c, b)
            })
        }
    });
    var Pa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi
      , Qa = /<script|<style|<link/i
      , Ra = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Sa = /^true\/(.*)/
      , Ta = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    fa.extend({
        htmlPrefilter: function(a) {
            return a.replace(Pa, "<$1></$2>")
        },
        clone: function(a, b, c) {
            var d, e, f, g, h = a.cloneNode(!0), i = fa.contains(a.ownerDocument, a);
            if (!(da.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || fa.isXMLDoc(a)))
                for (g = k(h),
                f = k(a),
                d = 0,
                e = f.length; d < e; d++)
                    v(f[d], g[d]);
            if (b)
                if (c)
                    for (f = f || k(a),
                    g = g || k(h),
                    d = 0,
                    e = f.length; d < e; d++)
                        u(f[d], g[d]);
                else
                    u(a, h);
            return g = k(h, "script"),
            g.length > 0 && l(g, !i && k(a, "script")),
            h
        },
        cleanData: function(a) {
            for (var b, c, d, e = fa.event.special, f = 0; void 0 !== (c = a[f]); f++)
                if (ya(c)) {
                    if (b = c[za.expando]) {
                        if (b.events)
                            for (d in b.events)
                                e[d] ? fa.event.remove(c, d) : fa.removeEvent(c, d, b.handle);
                        c[za.expando] = void 0
                    }
                    c[Aa.expando] && (c[Aa.expando] = void 0)
                }
        }
    }),
    fa.fn.extend({
        domManip: w,
        detach: function(a) {
            return x(this, a, !0)
        },
        remove: function(a) {
            return x(this, a)
        },
        text: function(a) {
            return xa(this, function(a) {
                return void 0 === a ? fa.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = a)
                })
            }, null, a, arguments.length)
        },
        append: function() {
            return w(this, arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = r(this, a);
                    b.appendChild(a)
                }
            })
        },
        prepend: function() {
            return w(this, arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = r(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function() {
            return w(this, arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return w(this, arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++)
                1 === a.nodeType && (fa.cleanData(k(a, !1)),
                a.textContent = "");
            return this
        },
        clone: function(a, b) {
            return a = null != a && a,
            b = null == b ? a : b,
            this.map(function() {
                return fa.clone(this, a, b)
            })
        },
        html: function(a) {
            return xa(this, function(a) {
                var b = this[0] || {}
                  , c = 0
                  , d = this.length;
                if (void 0 === a && 1 === b.nodeType)
                    return b.innerHTML;
                if ("string" == typeof a && !Qa.test(a) && !Ka[(Ia.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = fa.htmlPrefilter(a);
                    try {
                        for (; c < d; c++)
                            b = this[c] || {},
                            1 === b.nodeType && (fa.cleanData(k(b, !1)),
                            b.innerHTML = a);
                        b = 0
                    } catch (e) {}
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a = [];
            return w(this, arguments, function(b) {
                var c = this.parentNode;
                fa.inArray(this, a) < 0 && (fa.cleanData(k(this)),
                c && c.replaceChild(b, this))
            }, a)
        }
    }),
    fa.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        fa.fn[a] = function(a) {
            for (var c, d = [], e = fa(a), f = e.length - 1, g = 0; g <= f; g++)
                c = g === f ? this : this.clone(!0),
                fa(e[g])[b](c),
                $.apply(d, c.get());
            return this.pushStack(d)
        }
    });
    var Ua, Va = {
        HTML: "block",
        BODY: "block"
    }, Wa = /^margin/, Xa = new RegExp("^(" + Da + ")(?!px)[a-z%]+$","i"), Ya = function(b) {
        var c = b.ownerDocument.defaultView;
        return c && c.opener || (c = a),
        c.getComputedStyle(b)
    }, Za = function(a, b, c, d) {
        var e, f, g = {};
        for (f in b)
            g[f] = a.style[f],
            a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b)
            a.style[f] = g[f];
        return e
    }, $a = X.documentElement;
    !function() {
        function b() {
            h.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",
            h.innerHTML = "",
            $a.appendChild(g);
            var b = a.getComputedStyle(h);
            c = "1%" !== b.top,
            f = "2px" === b.marginLeft,
            d = "4px" === b.width,
            h.style.marginRight = "50%",
            e = "4px" === b.marginRight,
            $a.removeChild(g)
        }
        var c, d, e, f, g = X.createElement("div"), h = X.createElement("div");
        h.style && (h.style.backgroundClip = "content-box",
        h.cloneNode(!0).style.backgroundClip = "",
        da.clearCloneStyle = "content-box" === h.style.backgroundClip,
        g.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",
        g.appendChild(h),
        fa.extend(da, {
            pixelPosition: function() {
                return b(),
                c
            },
            boxSizingReliable: function() {
                return null == d && b(),
                d
            },
            pixelMarginRight: function() {
                return null == d && b(),
                e
            },
            reliableMarginLeft: function() {
                return null == d && b(),
                f
            },
            reliableMarginRight: function() {
                var b, c = h.appendChild(X.createElement("div"));
                return c.style.cssText = h.style.cssText = "-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                c.style.marginRight = c.style.width = "0",
                h.style.width = "1px",
                $a.appendChild(g),
                b = !parseFloat(a.getComputedStyle(c).marginRight),
                $a.removeChild(g),
                h.removeChild(c),
                b
            }
        }))
    }();
    var _a = /^(none|table(?!-c[ea]).+)/
      , ab = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , bb = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , cb = ["Webkit", "O", "Moz", "ms"]
      , db = X.createElement("div").style;
    fa.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = A(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = fa.camelCase(b), i = a.style;
                return b = fa.cssProps[h] || (fa.cssProps[h] = C(h) || h),
                g = fa.cssHooks[b] || fa.cssHooks[h],
                void 0 === c ? g && "get"in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = typeof c,
                "string" === f && (e = Ea.exec(c)) && e[1] && (c = j(a, b, e),
                f = "number"),
                null != c && c === c && ("number" === f && (c += e && e[3] || (fa.cssNumber[h] ? "" : "px")),
                da.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"),
                g && "set"in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c)),
                void 0)
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = fa.camelCase(b);
            return b = fa.cssProps[h] || (fa.cssProps[h] = C(h) || h),
            g = fa.cssHooks[b] || fa.cssHooks[h],
            g && "get"in g && (e = g.get(a, !0, c)),
            void 0 === e && (e = A(a, b, d)),
            "normal" === e && b in bb && (e = bb[b]),
            "" === c || c ? (f = parseFloat(e),
            c === !0 || isFinite(f) ? f || 0 : e) : e
        }
    }),
    fa.each(["height", "width"], function(a, b) {
        fa.cssHooks[b] = {
            get: function(a, c, d) {
                if (c)
                    return _a.test(fa.css(a, "display")) && 0 === a.offsetWidth ? Za(a, ab, function() {
                        return F(a, b, d)
                    }) : F(a, b, d)
            },
            set: function(a, c, d) {
                var e, f = d && Ya(a), g = d && E(a, b, d, "border-box" === fa.css(a, "boxSizing", !1, f), f);
                return g && (e = Ea.exec(c)) && "px" !== (e[3] || "px") && (a.style[b] = c,
                c = fa.css(a, b)),
                D(a, c, g)
            }
        }
    }),
    fa.cssHooks.marginLeft = B(da.reliableMarginLeft, function(a, b) {
        if (b)
            return (parseFloat(A(a, "marginLeft")) || a.getBoundingClientRect().left - Za(a, {
                marginLeft: 0
            }, function() {
                return a.getBoundingClientRect().left
            })) + "px"
    }),
    fa.cssHooks.marginRight = B(da.reliableMarginRight, function(a, b) {
        if (b)
            return Za(a, {
                display: "inline-block"
            }, A, [a, "marginRight"])
    }),
    fa.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        fa.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; d < 4; d++)
                    e[a + Fa[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        },
        Wa.test(a) || (fa.cssHooks[a + b].set = D)
    }),
    fa.fn.extend({
        css: function(a, b) {
            return xa(this, function(a, b, c) {
                var d, e, f = {}, g = 0;
                if (fa.isArray(b)) {
                    for (d = Ya(a),
                    e = b.length; g < e; g++)
                        f[b[g]] = fa.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? fa.style(a, b, c) : fa.css(a, b)
            }, a, b, arguments.length > 1)
        },
        show: function() {
            return G(this, !0)
        },
        hide: function() {
            return G(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                Ga(this) ? fa(this).show() : fa(this).hide()
            })
        }
    }),
    fa.Tween = H,
    H.prototype = {
        constructor: H,
        init: function(a, b, c, d, e, f) {
            this.elem = a,
            this.prop = c,
            this.easing = e || fa.easing._default,
            this.options = b,
            this.start = this.now = this.cur(),
            this.end = d,
            this.unit = f || (fa.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var a = H.propHooks[this.prop];
            return a && a.get ? a.get(this) : H.propHooks._default.get(this)
        },
        run: function(a) {
            var b, c = H.propHooks[this.prop];
            return this.options.duration ? this.pos = b = fa.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a,
            this.now = (this.end - this.start) * b + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            c && c.set ? c.set(this) : H.propHooks._default.set(this),
            this
        }
    },
    H.prototype.init.prototype = H.prototype,
    H.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return 1 !== a.elem.nodeType || null != a.elem[a.prop] && null == a.elem.style[a.prop] ? a.elem[a.prop] : (b = fa.css(a.elem, a.prop, ""),
                b && "auto" !== b ? b : 0)
            },
            set: function(a) {
                fa.fx.step[a.prop] ? fa.fx.step[a.prop](a) : 1 !== a.elem.nodeType || null == a.elem.style[fa.cssProps[a.prop]] && !fa.cssHooks[a.prop] ? a.elem[a.prop] = a.now : fa.style(a.elem, a.prop, a.now + a.unit)
            }
        }
    },
    H.propHooks.scrollTop = H.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    },
    fa.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        },
        _default: "swing"
    },
    fa.fx = H.prototype.init,
    fa.fx.step = {};
    var eb, fb, gb = /^(?:toggle|show|hide)$/, hb = /queueHooks$/;
    fa.Animation = fa.extend(N, {
        tweeners: {
            "*": [function(a, b) {
                var c = this.createTween(a, b);
                return j(c.elem, a, Ea.exec(b), c),
                c
            }
            ]
        },
        tweener: function(a, b) {
            fa.isFunction(a) ? (b = a,
            a = ["*"]) : a = a.match(va);
            for (var c, d = 0, e = a.length; d < e; d++)
                c = a[d],
                N.tweeners[c] = N.tweeners[c] || [],
                N.tweeners[c].unshift(b)
        },
        prefilters: [L],
        prefilter: function(a, b) {
            b ? N.prefilters.unshift(a) : N.prefilters.push(a)
        }
    }),
    fa.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? fa.extend({}, a) : {
            complete: c || !c && b || fa.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !fa.isFunction(b) && b
        };
        return d.duration = fa.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in fa.fx.speeds ? fa.fx.speeds[d.duration] : fa.fx.speeds._default,
        null != d.queue && d.queue !== !0 || (d.queue = "fx"),
        d.old = d.complete,
        d.complete = function() {
            fa.isFunction(d.old) && d.old.call(this),
            d.queue && fa.dequeue(this, d.queue)
        }
        ,
        d
    }
    ,
    fa.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(Ga).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            var e = fa.isEmptyObject(a)
              , f = fa.speed(b, c, d)
              , g = function() {
                var b = N(this, fa.extend({}, a), f);
                (e || za.get(this, "finish")) && b.stop(!0)
            };
            return g.finish = g,
            e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop,
                b(c)
            };
            return "string" != typeof a && (c = b,
            b = a,
            a = void 0),
            b && a !== !1 && this.queue(a || "fx", []),
            this.each(function() {
                var b = !0
                  , e = null != a && a + "queueHooks"
                  , f = fa.timers
                  , g = za.get(this);
                if (e)
                    g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g)
                        g[e] && g[e].stop && hb.test(e) && d(g[e]);
                for (e = f.length; e--; )
                    f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c),
                    b = !1,
                    f.splice(e, 1));
                !b && c || fa.dequeue(this, a)
            })
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"),
            this.each(function() {
                var b, c = za.get(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = fa.timers, g = d ? d.length : 0;
                for (c.finish = !0,
                fa.queue(this, a, []),
                e && e.stop && e.stop.call(this, !0),
                b = f.length; b--; )
                    f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0),
                    f.splice(b, 1));
                for (b = 0; b < g; b++)
                    d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }),
    fa.each(["toggle", "show", "hide"], function(a, b) {
        var c = fa.fn[b];
        fa.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(J(b, !0), a, d, e)
        }
    }),
    fa.each({
        slideDown: J("show"),
        slideUp: J("hide"),
        slideToggle: J("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        fa.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }),
    fa.timers = [],
    fa.fx.tick = function() {
        var a, b = 0, c = fa.timers;
        for (eb = fa.now(); b < c.length; b++)
            a = c[b],
            a() || c[b] !== a || c.splice(b--, 1);
        c.length || fa.fx.stop(),
        eb = void 0
    }
    ,
    fa.fx.timer = function(a) {
        fa.timers.push(a),
        a() ? fa.fx.start() : fa.timers.pop()
    }
    ,
    fa.fx.interval = 13,
    fa.fx.start = function() {
        fb || (fb = a.setInterval(fa.fx.tick, fa.fx.interval))
    }
    ,
    fa.fx.stop = function() {
        a.clearInterval(fb),
        fb = null
    }
    ,
    fa.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    fa.fn.delay = function(b, c) {
        return b = fa.fx ? fa.fx.speeds[b] || b : b,
        c = c || "fx",
        this.queue(c, function(c, d) {
            var e = a.setTimeout(c, b);
            d.stop = function() {
                a.clearTimeout(e)
            }
        })
    }
    ,
    function() {
        var a = X.createElement("input")
          , b = X.createElement("select")
          , c = b.appendChild(X.createElement("option"));
        a.type = "checkbox",
        da.checkOn = "" !== a.value,
        da.optSelected = c.selected,
        b.disabled = !0,
        da.optDisabled = !c.disabled,
        a = X.createElement("input"),
        a.value = "t",
        a.type = "radio",
        da.radioValue = "t" === a.value
    }();
    var ib, jb = fa.expr.attrHandle;
    fa.fn.extend({
        attr: function(a, b) {
            return xa(this, fa.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                fa.removeAttr(this, a)
            })
        }
    }),
    fa.extend({
        attr: function(a, b, c) {
            var d, e, f = a.nodeType;
            if (3 !== f && 8 !== f && 2 !== f)
                return "undefined" == typeof a.getAttribute ? fa.prop(a, b, c) : (1 === f && fa.isXMLDoc(a) || (b = b.toLowerCase(),
                e = fa.attrHooks[b] || (fa.expr.match.bool.test(b) ? ib : void 0)),
                void 0 !== c ? null === c ? void fa.removeAttr(a, b) : e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : (a.setAttribute(b, c + ""),
                c) : e && "get"in e && null !== (d = e.get(a, b)) ? d : (d = fa.find.attr(a, b),
                null == d ? void 0 : d))
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!da.radioValue && "radio" === b && fa.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b),
                        c && (a.value = c),
                        b
                    }
                }
            }
        },
        removeAttr: function(a, b) {
            var c, d, e = 0, f = b && b.match(va);
            if (f && 1 === a.nodeType)
                for (; c = f[e++]; )
                    d = fa.propFix[c] || c,
                    fa.expr.match.bool.test(c) && (a[d] = !1),
                    a.removeAttribute(c)
        }
    }),
    ib = {
        set: function(a, b, c) {
            return b === !1 ? fa.removeAttr(a, c) : a.setAttribute(c, c),
            c
        }
    },
    fa.each(fa.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = jb[b] || fa.find.attr;
        jb[b] = function(a, b, d) {
            var e, f;
            return d || (f = jb[b],
            jb[b] = e,
            e = null != c(a, b, d) ? b.toLowerCase() : null,
            jb[b] = f),
            e
        }
    });
    var kb = /^(?:input|select|textarea|button)$/i
      , lb = /^(?:a|area)$/i;
    fa.fn.extend({
        prop: function(a, b) {
            return xa(this, fa.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return this.each(function() {
                delete this[fa.propFix[a] || a]
            })
        }
    }),
    fa.extend({
        prop: function(a, b, c) {
            var d, e, f = a.nodeType;
            if (3 !== f && 8 !== f && 2 !== f)
                return 1 === f && fa.isXMLDoc(a) || (b = fa.propFix[b] || b,
                e = fa.propHooks[b]),
                void 0 !== c ? e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get"in e && null !== (d = e.get(a, b)) ? d : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = fa.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : kb.test(a.nodeName) || lb.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }),
    da.optSelected || (fa.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && b.parentNode && b.parentNode.selectedIndex,
            null
        },
        set: function(a) {
            var b = a.parentNode;
            b && (b.selectedIndex,
            b.parentNode && b.parentNode.selectedIndex)
        }
    }),
    fa.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        fa.propFix[this.toLowerCase()] = this
    });
    var mb = /[\t\r\n\f]/g;
    fa.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h, i = 0;
            if (fa.isFunction(a))
                return this.each(function(b) {
                    fa(this).addClass(a.call(this, b, O(this)))
                });
            if ("string" == typeof a && a)
                for (b = a.match(va) || []; c = this[i++]; )
                    if (e = O(c),
                    d = 1 === c.nodeType && (" " + e + " ").replace(mb, " ")) {
                        for (g = 0; f = b[g++]; )
                            d.indexOf(" " + f + " ") < 0 && (d += f + " ");
                        h = fa.trim(d),
                        e !== h && c.setAttribute("class", h)
                    }
            return this
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h, i = 0;
            if (fa.isFunction(a))
                return this.each(function(b) {
                    fa(this).removeClass(a.call(this, b, O(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ("string" == typeof a && a)
                for (b = a.match(va) || []; c = this[i++]; )
                    if (e = O(c),
                    d = 1 === c.nodeType && (" " + e + " ").replace(mb, " ")) {
                        for (g = 0; f = b[g++]; )
                            for (; d.indexOf(" " + f + " ") > -1; )
                                d = d.replace(" " + f + " ", " ");
                        h = fa.trim(d),
                        e !== h && c.setAttribute("class", h)
                    }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : fa.isFunction(a) ? this.each(function(c) {
                fa(this).toggleClass(a.call(this, c, O(this), b), b)
            }) : this.each(function() {
                var b, d, e, f;
                if ("string" === c)
                    for (d = 0,
                    e = fa(this),
                    f = a.match(va) || []; b = f[d++]; )
                        e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                else
                    void 0 !== a && "boolean" !== c || (b = O(this),
                    b && za.set(this, "__className__", b),
                    this.setAttribute && this.setAttribute("class", b || a === !1 ? "" : za.get(this, "__className__") || ""))
            })
        },
        hasClass: function(a) {
            var b, c, d = 0;
            for (b = " " + a + " "; c = this[d++]; )
                if (1 === c.nodeType && (" " + O(c) + " ").replace(mb, " ").indexOf(b) > -1)
                    return !0;
            return !1
        }
    });
    var nb = /\r/g
      , ob = /[\x20\t\r\n\f]+/g;
    fa.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0];
            {
                if (arguments.length)
                    return d = fa.isFunction(a),
                    this.each(function(c) {
                        var e;
                        1 === this.nodeType && (e = d ? a.call(this, c, fa(this).val()) : a,
                        null == e ? e = "" : "number" == typeof e ? e += "" : fa.isArray(e) && (e = fa.map(e, function(a) {
                            return null == a ? "" : a + ""
                        })),
                        b = fa.valHooks[this.type] || fa.valHooks[this.nodeName.toLowerCase()],
                        b && "set"in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                    });
                if (e)
                    return b = fa.valHooks[e.type] || fa.valHooks[e.nodeName.toLowerCase()],
                    b && "get"in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value,
                    "string" == typeof c ? c.replace(nb, "") : null == c ? "" : c)
            }
        }
    }),
    fa.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = fa.find.attr(a, "value");
                    return null != b ? b : fa.trim(fa.text(a)).replace(ob, " ")
                }
            },
            select: {
                get: function(a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || e < 0, g = f ? null : [], h = f ? e + 1 : d.length, i = e < 0 ? h : f ? e : 0; i < h; i++)
                        if (c = d[i],
                        (c.selected || i === e) && (da.optDisabled ? !c.disabled : null === c.getAttribute("disabled")) && (!c.parentNode.disabled || !fa.nodeName(c.parentNode, "optgroup"))) {
                            if (b = fa(c).val(),
                            f)
                                return b;
                            g.push(b)
                        }
                    return g
                },
                set: function(a, b) {
                    for (var c, d, e = a.options, f = fa.makeArray(b), g = e.length; g--; )
                        d = e[g],
                        (d.selected = fa.inArray(fa.valHooks.option.get(d), f) > -1) && (c = !0);
                    return c || (a.selectedIndex = -1),
                    f
                }
            }
        }
    }),
    fa.each(["radio", "checkbox"], function() {
        fa.valHooks[this] = {
            set: function(a, b) {
                if (fa.isArray(b))
                    return a.checked = fa.inArray(fa(a).val(), b) > -1
            }
        },
        da.checkOn || (fa.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        }
        )
    });
    var pb = /^(?:focusinfocus|focusoutblur)$/;
    fa.extend(fa.event, {
        trigger: function(b, c, d, e) {
            var f, g, h, i, j, k, l, m = [d || X], n = ca.call(b, "type") ? b.type : b, o = ca.call(b, "namespace") ? b.namespace.split(".") : [];
            if (g = h = d = d || X,
            3 !== d.nodeType && 8 !== d.nodeType && !pb.test(n + fa.event.triggered) && (n.indexOf(".") > -1 && (o = n.split("."),
            n = o.shift(),
            o.sort()),
            j = n.indexOf(":") < 0 && "on" + n,
            b = b[fa.expando] ? b : new fa.Event(n,"object" == typeof b && b),
            b.isTrigger = e ? 2 : 3,
            b.namespace = o.join("."),
            b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            b.result = void 0,
            b.target || (b.target = d),
            c = null == c ? [b] : fa.makeArray(c, [b]),
            l = fa.event.special[n] || {},
            e || !l.trigger || l.trigger.apply(d, c) !== !1)) {
                if (!e && !l.noBubble && !fa.isWindow(d)) {
                    for (i = l.delegateType || n,
                    pb.test(i + n) || (g = g.parentNode); g; g = g.parentNode)
                        m.push(g),
                        h = g;
                    h === (d.ownerDocument || X) && m.push(h.defaultView || h.parentWindow || a)
                }
                for (f = 0; (g = m[f++]) && !b.isPropagationStopped(); )
                    b.type = f > 1 ? i : l.bindType || n,
                    k = (za.get(g, "events") || {})[b.type] && za.get(g, "handle"),
                    k && k.apply(g, c),
                    k = j && g[j],
                    k && k.apply && ya(g) && (b.result = k.apply(g, c),
                    b.result === !1 && b.preventDefault());
                return b.type = n,
                e || b.isDefaultPrevented() || l._default && l._default.apply(m.pop(), c) !== !1 || !ya(d) || j && fa.isFunction(d[n]) && !fa.isWindow(d) && (h = d[j],
                h && (d[j] = null),
                fa.event.triggered = n,
                d[n](),
                fa.event.triggered = void 0,
                h && (d[j] = h)),
                b.result
            }
        },
        simulate: function(a, b, c) {
            var d = fa.extend(new fa.Event, c, {
                type: a,
                isSimulated: !0
            });
            fa.event.trigger(d, null, b)
        }
    }),
    fa.fn.extend({
        trigger: function(a, b) {
            return this.each(function() {
                fa.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            if (c)
                return fa.event.trigger(a, b, c, !0)
        }
    }),
    fa.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        fa.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }),
    fa.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }
    }),
    da.focusin = "onfocusin"in a,
    da.focusin || fa.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            fa.event.simulate(b, a.target, fa.event.fix(a))
        };
        fa.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this
                  , e = za.access(d, b);
                e || d.addEventListener(a, c, !0),
                za.access(d, b, (e || 0) + 1)
            },
            teardown: function() {
                var d = this.ownerDocument || this
                  , e = za.access(d, b) - 1;
                e ? za.access(d, b, e) : (d.removeEventListener(a, c, !0),
                za.remove(d, b))
            }
        }
    });
    var qb = a.location
      , rb = fa.now()
      , sb = /\?/;
    fa.parseJSON = function(a) {
        return JSON.parse(a + "")
    }
    ,
    fa.parseXML = function(b) {
        var c;
        if (!b || "string" != typeof b)
            return null;
        try {
            c = (new a.DOMParser).parseFromString(b, "text/xml")
        } catch (d) {
            c = void 0
        }
        return c && !c.getElementsByTagName("parsererror").length || fa.error("Invalid XML: " + b),
        c
    }
    ;
    var tb = /#.*$/
      , ub = /([?&])_=[^&]*/
      , vb = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , wb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
      , xb = /^(?:GET|HEAD)$/
      , yb = /^\/\//
      , zb = {}
      , Ab = {}
      , Bb = "*/".concat("*")
      , Cb = X.createElement("a");
    Cb.href = qb.href,
    fa.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: qb.href,
            type: "GET",
            isLocal: wb.test(qb.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Bb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": fa.parseJSON,
                "text xml": fa.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? R(R(a, fa.ajaxSettings), b) : R(fa.ajaxSettings, a)
        },
        ajaxPrefilter: P(zb),
        ajaxTransport: P(Ab),
        ajax: function(b, c) {
            function d(b, c, d, h) {
                var j, l, s, t, v, x = c;
                2 !== u && (u = 2,
                i && a.clearTimeout(i),
                e = void 0,
                g = h || "",
                w.readyState = b > 0 ? 4 : 0,
                j = b >= 200 && b < 300 || 304 === b,
                d && (t = S(m, w, d)),
                t = T(m, t, w, j),
                j ? (m.ifModified && (v = w.getResponseHeader("Last-Modified"),
                v && (fa.lastModified[f] = v),
                v = w.getResponseHeader("etag"),
                v && (fa.etag[f] = v)),
                204 === b || "HEAD" === m.type ? x = "nocontent" : 304 === b ? x = "notmodified" : (x = t.state,
                l = t.data,
                s = t.error,
                j = !s)) : (s = x,
                !b && x || (x = "error",
                b < 0 && (b = 0))),
                w.status = b,
                w.statusText = (c || x) + "",
                j ? p.resolveWith(n, [l, x, w]) : p.rejectWith(n, [w, x, s]),
                w.statusCode(r),
                r = void 0,
                k && o.trigger(j ? "ajaxSuccess" : "ajaxError", [w, m, j ? l : s]),
                q.fireWith(n, [w, x]),
                k && (o.trigger("ajaxComplete", [w, m]),
                --fa.active || fa.event.trigger("ajaxStop")))
            }
            "object" == typeof b && (c = b,
            b = void 0),
            c = c || {};
            var e, f, g, h, i, j, k, l, m = fa.ajaxSetup({}, c), n = m.context || m, o = m.context && (n.nodeType || n.jquery) ? fa(n) : fa.event, p = fa.Deferred(), q = fa.Callbacks("once memory"), r = m.statusCode || {}, s = {}, t = {}, u = 0, v = "canceled", w = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === u) {
                        if (!h)
                            for (h = {}; b = vb.exec(g); )
                                h[b[1].toLowerCase()] = b[2];
                        b = h[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function() {
                    return 2 === u ? g : null
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return u || (a = t[c] = t[c] || a,
                    s[a] = b),
                    this
                },
                overrideMimeType: function(a) {
                    return u || (m.mimeType = a),
                    this
                },
                statusCode: function(a) {
                    var b;
                    if (a)
                        if (u < 2)
                            for (b in a)
                                r[b] = [r[b], a[b]];
                        else
                            w.always(a[w.status]);
                    return this
                },
                abort: function(a) {
                    var b = a || v;
                    return e && e.abort(b),
                    d(0, b),
                    this
                }
            };
            if (p.promise(w).complete = q.add,
            w.success = w.done,
            w.error = w.fail,
            m.url = ((b || m.url || qb.href) + "").replace(tb, "").replace(yb, qb.protocol + "//"),
            m.type = c.method || c.type || m.method || m.type,
            m.dataTypes = fa.trim(m.dataType || "*").toLowerCase().match(va) || [""],
            null == m.crossDomain) {
                j = X.createElement("a");
                try {
                    j.href = m.url,
                    j.href = j.href,
                    m.crossDomain = Cb.protocol + "//" + Cb.host != j.protocol + "//" + j.host
                } catch (x) {
                    m.crossDomain = !0
                }
            }
            if (m.data && m.processData && "string" != typeof m.data && (m.data = fa.param(m.data, m.traditional)),
            Q(zb, m, c, w),
            2 === u)
                return w;
            k = fa.event && m.global,
            k && 0 === fa.active++ && fa.event.trigger("ajaxStart"),
            m.type = m.type.toUpperCase(),
            m.hasContent = !xb.test(m.type),
            f = m.url,
            m.hasContent || (m.data && (f = m.url += (sb.test(f) ? "&" : "?") + m.data,
            delete m.data),
            m.cache === !1 && (m.url = ub.test(f) ? f.replace(ub, "$1_=" + rb++) : f + (sb.test(f) ? "&" : "?") + "_=" + rb++)),
            m.ifModified && (fa.lastModified[f] && w.setRequestHeader("If-Modified-Since", fa.lastModified[f]),
            fa.etag[f] && w.setRequestHeader("If-None-Match", fa.etag[f])),
            (m.data && m.hasContent && m.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", m.contentType),
            w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + Bb + "; q=0.01" : "") : m.accepts["*"]);
            for (l in m.headers)
                w.setRequestHeader(l, m.headers[l]);
            if (m.beforeSend && (m.beforeSend.call(n, w, m) === !1 || 2 === u))
                return w.abort();
            v = "abort";
            for (l in {
                success: 1,
                error: 1,
                complete: 1
            })
                w[l](m[l]);
            if (e = Q(Ab, m, c, w)) {
                if (w.readyState = 1,
                k && o.trigger("ajaxSend", [w, m]),
                2 === u)
                    return w;
                m.async && m.timeout > 0 && (i = a.setTimeout(function() {
                    w.abort("timeout")
                }, m.timeout));
                try {
                    u = 1,
                    e.send(s, d)
                } catch (x) {
                    if (!(u < 2))
                        throw x;
                    d(-1, x)
                }
            } else
                d(-1, "No Transport");
            return w
        },
        getJSON: function(a, b, c) {
            return fa.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return fa.get(a, void 0, b, "script")
        }
    }),
    fa.each(["get", "post"], function(a, b) {
        fa[b] = function(a, c, d, e) {
            return fa.isFunction(c) && (e = e || d,
            d = c,
            c = void 0),
            fa.ajax(fa.extend({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            }, fa.isPlainObject(a) && a))
        }
    }),
    fa._evalUrl = function(a) {
        return fa.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }
    ,
    fa.fn.extend({
        wrapAll: function(a) {
            var b;
            return fa.isFunction(a) ? this.each(function(b) {
                fa(this).wrapAll(a.call(this, b))
            }) : (this[0] && (b = fa(a, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && b.insertBefore(this[0]),
            b.map(function() {
                for (var a = this; a.firstElementChild; )
                    a = a.firstElementChild;
                return a
            }).append(this)),
            this)
        },
        wrapInner: function(a) {
            return fa.isFunction(a) ? this.each(function(b) {
                fa(this).wrapInner(a.call(this, b))
            }) : this.each(function() {
                var b = fa(this)
                  , c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = fa.isFunction(a);
            return this.each(function(c) {
                fa(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                fa.nodeName(this, "body") || fa(this).replaceWith(this.childNodes)
            }).end()
        }
    }),
    fa.expr.filters.hidden = function(a) {
        return !fa.expr.filters.visible(a)
    }
    ,
    fa.expr.filters.visible = function(a) {
        return a.offsetWidth > 0 || a.offsetHeight > 0 || a.getClientRects().length > 0
    }
    ;
    var Db = /%20/g
      , Eb = /\[\]$/
      , Fb = /\r?\n/g
      , Gb = /^(?:submit|button|image|reset|file)$/i
      , Hb = /^(?:input|select|textarea|keygen)/i;
    fa.param = function(a, b) {
        var c, d = [], e = function(a, b) {
            b = fa.isFunction(b) ? b() : null == b ? "" : b,
            d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        if (void 0 === b && (b = fa.ajaxSettings && fa.ajaxSettings.traditional),
        fa.isArray(a) || a.jquery && !fa.isPlainObject(a))
            fa.each(a, function() {
                e(this.name, this.value)
            });
        else
            for (c in a)
                U(c, a[c], b, e);
        return d.join("&").replace(Db, "+")
    }
    ,
    fa.fn.extend({
        serialize: function() {
            return fa.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = fa.prop(this, "elements");
                return a ? fa.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !fa(this).is(":disabled") && Hb.test(this.nodeName) && !Gb.test(a) && (this.checked || !Ha.test(a))
            }).map(function(a, b) {
                var c = fa(this).val();
                return null == c ? null : fa.isArray(c) ? fa.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(Fb, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(Fb, "\r\n")
                }
            }).get()
        }
    }),
    fa.ajaxSettings.xhr = function() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }
    ;
    var Ib = {
        0: 200,
        1223: 204
    }
      , Jb = fa.ajaxSettings.xhr();
    da.cors = !!Jb && "withCredentials"in Jb,
    da.ajax = Jb = !!Jb,
    fa.ajaxTransport(function(b) {
        var c, d;
        if (da.cors || Jb && !b.crossDomain)
            return {
                send: function(e, f) {
                    var g, h = b.xhr();
                    if (h.open(b.type, b.url, b.async, b.username, b.password),
                    b.xhrFields)
                        for (g in b.xhrFields)
                            h[g] = b.xhrFields[g];
                    b.mimeType && h.overrideMimeType && h.overrideMimeType(b.mimeType),
                    b.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest");
                    for (g in e)
                        h.setRequestHeader(g, e[g]);
                    c = function(a) {
                        return function() {
                            c && (c = d = h.onload = h.onerror = h.onabort = h.onreadystatechange = null,
                            "abort" === a ? h.abort() : "error" === a ? "number" != typeof h.status ? f(0, "error") : f(h.status, h.statusText) : f(Ib[h.status] || h.status, h.statusText, "text" !== (h.responseType || "text") || "string" != typeof h.responseText ? {
                                binary: h.response
                            } : {
                                text: h.responseText
                            }, h.getAllResponseHeaders()))
                        }
                    }
                    ,
                    h.onload = c(),
                    d = h.onerror = c("error"),
                    void 0 !== h.onabort ? h.onabort = d : h.onreadystatechange = function() {
                        4 === h.readyState && a.setTimeout(function() {
                            c && d()
                        })
                    }
                    ,
                    c = c("abort");
                    try {
                        h.send(b.hasContent && b.data || null)
                    } catch (i) {
                        if (c)
                            throw i
                    }
                },
                abort: function() {
                    c && c()
                }
            }
    }),
    fa.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(a) {
                return fa.globalEval(a),
                a
            }
        }
    }),
    fa.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1),
        a.crossDomain && (a.type = "GET")
    }),
    fa.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c;
            return {
                send: function(d, e) {
                    b = fa("<script>").prop({
                        charset: a.scriptCharset,
                        src: a.url
                    }).on("load error", c = function(a) {
                        b.remove(),
                        c = null,
                        a && e("error" === a.type ? 404 : 200, a.type)
                    }
                    ),
                    X.head.appendChild(b[0])
                },
                abort: function() {
                    c && c()
                }
            }
        }
    });
    var Kb = []
      , Lb = /(=)\?(?=&|$)|\?\?/;
    fa.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = Kb.pop() || fa.expando + "_" + rb++;
            return this[a] = !0,
            a
        }
    }),
    fa.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (Lb.test(b.url) ? "url" : "string" == typeof b.data && 0 === (b.contentType || "").indexOf("application/x-www-form-urlencoded") && Lb.test(b.data) && "data");
        if (h || "jsonp" === b.dataTypes[0])
            return e = b.jsonpCallback = fa.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
            h ? b[h] = b[h].replace(Lb, "$1" + e) : b.jsonp !== !1 && (b.url += (sb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
            b.converters["script json"] = function() {
                return g || fa.error(e + " was not called"),
                g[0]
            }
            ,
            b.dataTypes[0] = "json",
            f = a[e],
            a[e] = function() {
                g = arguments
            }
            ,
            d.always(function() {
                void 0 === f ? fa(a).removeProp(e) : a[e] = f,
                b[e] && (b.jsonpCallback = c.jsonpCallback,
                Kb.push(e)),
                g && fa.isFunction(f) && f(g[0]),
                g = f = void 0
            }),
            "script"
    }),
    fa.parseHTML = function(a, b, c) {
        if (!a || "string" != typeof a)
            return null;
        "boolean" == typeof b && (c = b,
        b = !1),
        b = b || X;
        var d = oa.exec(a)
          , e = !c && [];
        return d ? [b.createElement(d[1])] : (d = m([a], b, e),
        e && e.length && fa(e).remove(),
        fa.merge([], d.childNodes))
    }
    ;
    var Mb = fa.fn.load;
    fa.fn.load = function(a, b, c) {
        if ("string" != typeof a && Mb)
            return Mb.apply(this, arguments);
        var d, e, f, g = this, h = a.indexOf(" ");
        return h > -1 && (d = fa.trim(a.slice(h)),
        a = a.slice(0, h)),
        fa.isFunction(b) ? (c = b,
        b = void 0) : b && "object" == typeof b && (e = "POST"),
        g.length > 0 && fa.ajax({
            url: a,
            type: e || "GET",
            dataType: "html",
            data: b
        }).done(function(a) {
            f = arguments,
            g.html(d ? fa("<div>").append(fa.parseHTML(a)).find(d) : a)
        }).always(c && function(a, b) {
            g.each(function() {
                c.apply(this, f || [a.responseText, b, a])
            })
        }
        ),
        this
    }
    ,
    fa.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
        fa.fn[b] = function(a) {
            return this.on(b, a)
        }
    }),
    fa.expr.filters.animated = function(a) {
        return fa.grep(fa.timers, function(b) {
            return a === b.elem
        }).length
    }
    ,
    fa.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = fa.css(a, "position"), l = fa(a), m = {};
            "static" === k && (a.style.position = "relative"),
            h = l.offset(),
            f = fa.css(a, "top"),
            i = fa.css(a, "left"),
            j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1,
            j ? (d = l.position(),
            g = d.top,
            e = d.left) : (g = parseFloat(f) || 0,
            e = parseFloat(i) || 0),
            fa.isFunction(b) && (b = b.call(a, c, fa.extend({}, h))),
            null != b.top && (m.top = b.top - h.top + g),
            null != b.left && (m.left = b.left - h.left + e),
            "using"in b ? b.using.call(a, m) : l.css(m)
        }
    },
    fa.fn.extend({
        offset: function(a) {
            if (arguments.length)
                return void 0 === a ? this : this.each(function(b) {
                    fa.offset.setOffset(this, a, b)
                });
            var b, c, d = this[0], e = {
                top: 0,
                left: 0
            }, f = d && d.ownerDocument;
            if (f)
                return b = f.documentElement,
                fa.contains(b, d) ? (e = d.getBoundingClientRect(),
                c = V(f),
                {
                    top: e.top + c.pageYOffset - b.clientTop,
                    left: e.left + c.pageXOffset - b.clientLeft
                }) : e
        },
        position: function() {
            if (this[0]) {
                var a, b, c = this[0], d = {
                    top: 0,
                    left: 0
                };
                return "fixed" === fa.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(),
                b = this.offset(),
                fa.nodeName(a[0], "html") || (d = a.offset()),
                d.top += fa.css(a[0], "borderTopWidth", !0),
                d.left += fa.css(a[0], "borderLeftWidth", !0)),
                {
                    top: b.top - d.top - fa.css(c, "marginTop", !0),
                    left: b.left - d.left - fa.css(c, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent; a && "static" === fa.css(a, "position"); )
                    a = a.offsetParent;
                return a || $a
            })
        }
    }),
    fa.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = "pageYOffset" === b;
        fa.fn[a] = function(d) {
            return xa(this, function(a, d, e) {
                var f = V(a);
                return void 0 === e ? f ? f[b] : a[d] : void (f ? f.scrollTo(c ? f.pageXOffset : e, c ? e : f.pageYOffset) : a[d] = e)
            }, a, d, arguments.length)
        }
    }),
    fa.each(["top", "left"], function(a, b) {
        fa.cssHooks[b] = B(da.pixelPosition, function(a, c) {
            if (c)
                return c = A(a, b),
                Xa.test(c) ? fa(a).position()[b] + "px" : c
        })
    }),
    fa.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        fa.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, d) {
            fa.fn[d] = function(d, e) {
                var f = arguments.length && (c || "boolean" != typeof d)
                  , g = c || (d === !0 || e === !0 ? "margin" : "border");
                return xa(this, function(b, c, d) {
                    var e;
                    return fa.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement,
                    Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? fa.css(b, c, g) : fa.style(b, c, d, g)
                }, b, f ? d : void 0, f, null)
            }
        })
    }),
    fa.fn.extend({
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        },
        size: function() {
            return this.length
        }
    }),
    fa.fn.andSelf = fa.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return fa
    });
    var Nb = a.jQuery
      , Ob = a.$;
    return fa.noConflict = function(b) {
        return a.$ === fa && (a.$ = Ob),
        b && a.jQuery === fa && (a.jQuery = Nb),
        fa
    }
    ,
    b || (a.jQuery = a.$ = fa),
    fa
}),
function() {
    function a(a) {
        function b(b, c, d, e, f, g) {
            for (; f >= 0 && f < g; f += a) {
                var h = e ? e[f] : f;
                d = c(d, b[h], h, b)
            }
            return d
        }
        return function(c, d, e, f) {
            d = t(d, f, 4);
            var g = !A(c) && s.keys(c)
              , h = (g || c).length
              , i = a > 0 ? 0 : h - 1;
            return arguments.length < 3 && (e = c[g ? g[i] : i],
            i += a),
            b(c, d, e, g, i, h)
        }
    }
    function b(a) {
        return function(b, c, d) {
            c = u(c, d);
            for (var e = z(b), f = a > 0 ? 0 : e - 1; f >= 0 && f < e; f += a)
                if (c(b[f], f, b))
                    return f;
            return -1
        }
    }
    function c(a, b, c) {
        return function(d, e, f) {
            var g = 0
              , h = z(d);
            if ("number" == typeof f)
                a > 0 ? g = f >= 0 ? f : Math.max(f + h, g) : h = f >= 0 ? Math.min(f + 1, h) : f + h + 1;
            else if (c && f && h)
                return f = c(d, e),
                d[f] === e ? f : -1;
            if (e !== e)
                return f = b(k.call(d, g, h), s.isNaN),
                f >= 0 ? f + g : -1;
            for (f = a > 0 ? g : h - 1; f >= 0 && f < h; f += a)
                if (d[f] === e)
                    return f;
            return -1
        }
    }
    function d(a, b) {
        var c = F.length
          , d = a.constructor
          , e = s.isFunction(d) && d.prototype || h
          , f = "constructor";
        for (s.has(a, f) && !s.contains(b, f) && b.push(f); c--; )
            f = F[c],
            f in a && a[f] !== e[f] && !s.contains(b, f) && b.push(f)
    }
    var e = this
      , f = e._
      , g = Array.prototype
      , h = Object.prototype
      , i = Function.prototype
      , j = g.push
      , k = g.slice
      , l = h.toString
      , m = h.hasOwnProperty
      , n = Array.isArray
      , o = Object.keys
      , p = i.bind
      , q = Object.create
      , r = function() {}
      , s = function(a) {
        return a instanceof s ? a : this instanceof s ? void (this._wrapped = a) : new s(a)
    };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = s),
    exports._ = s) : e._ = s,
    s.VERSION = "1.8.3";
    var t = function(a, b, c) {
        if (void 0 === b)
            return a;
        switch (null == c ? 3 : c) {
        case 1:
            return function(c) {
                return a.call(b, c)
            }
            ;
        case 2:
            return function(c, d) {
                return a.call(b, c, d)
            }
            ;
        case 3:
            return function(c, d, e) {
                return a.call(b, c, d, e)
            }
            ;
        case 4:
            return function(c, d, e, f) {
                return a.call(b, c, d, e, f)
            }
        }
        return function() {
            return a.apply(b, arguments)
        }
    }
      , u = function(a, b, c) {
        return null == a ? s.identity : s.isFunction(a) ? t(a, b, c) : s.isObject(a) ? s.matcher(a) : s.property(a)
    };
    s.iteratee = function(a, b) {
        return u(a, b, 1 / 0)
    }
    ;
    var v = function(a, b) {
        return function(c) {
            var d = arguments.length;
            if (d < 2 || null == c)
                return c;
            for (var e = 1; e < d; e++)
                for (var f = arguments[e], g = a(f), h = g.length, i = 0; i < h; i++) {
                    var j = g[i];
                    b && void 0 !== c[j] || (c[j] = f[j])
                }
            return c
        }
    }
      , w = function(a) {
        if (!s.isObject(a))
            return {};
        if (q)
            return q(a);
        r.prototype = a;
        var b = new r;
        return r.prototype = null,
        b
    }
      , x = function(a) {
        return function(b) {
            return null == b ? void 0 : b[a]
        }
    }
      , y = Math.pow(2, 53) - 1
      , z = x("length")
      , A = function(a) {
        var b = z(a);
        return "number" == typeof b && b >= 0 && b <= y
    };
    s.each = s.forEach = function(a, b, c) {
        b = t(b, c);
        var d, e;
        if (A(a))
            for (d = 0,
            e = a.length; d < e; d++)
                b(a[d], d, a);
        else {
            var f = s.keys(a);
            for (d = 0,
            e = f.length; d < e; d++)
                b(a[f[d]], f[d], a)
        }
        return a
    }
    ,
    s.map = s.collect = function(a, b, c) {
        b = u(b, c);
        for (var d = !A(a) && s.keys(a), e = (d || a).length, f = Array(e), g = 0; g < e; g++) {
            var h = d ? d[g] : g;
            f[g] = b(a[h], h, a)
        }
        return f
    }
    ,
    s.reduce = s.foldl = s.inject = a(1),
    s.reduceRight = s.foldr = a(-1),
    s.find = s.detect = function(a, b, c) {
        var d;
        if (d = A(a) ? s.findIndex(a, b, c) : s.findKey(a, b, c),
        void 0 !== d && d !== -1)
            return a[d]
    }
    ,
    s.filter = s.select = function(a, b, c) {
        var d = [];
        return b = u(b, c),
        s.each(a, function(a, c, e) {
            b(a, c, e) && d.push(a)
        }),
        d
    }
    ,
    s.reject = function(a, b, c) {
        return s.filter(a, s.negate(u(b)), c)
    }
    ,
    s.every = s.all = function(a, b, c) {
        b = u(b, c);
        for (var d = !A(a) && s.keys(a), e = (d || a).length, f = 0; f < e; f++) {
            var g = d ? d[f] : f;
            if (!b(a[g], g, a))
                return !1
        }
        return !0
    }
    ,
    s.some = s.any = function(a, b, c) {
        b = u(b, c);
        for (var d = !A(a) && s.keys(a), e = (d || a).length, f = 0; f < e; f++) {
            var g = d ? d[f] : f;
            if (b(a[g], g, a))
                return !0
        }
        return !1
    }
    ,
    s.contains = s.includes = s.include = function(a, b, c, d) {
        return A(a) || (a = s.values(a)),
        ("number" != typeof c || d) && (c = 0),
        s.indexOf(a, b, c) >= 0
    }
    ,
    s.invoke = function(a, b) {
        var c = k.call(arguments, 2)
          , d = s.isFunction(b);
        return s.map(a, function(a) {
            var e = d ? b : a[b];
            return null == e ? e : e.apply(a, c)
        })
    }
    ,
    s.pluck = function(a, b) {
        return s.map(a, s.property(b))
    }
    ,
    s.where = function(a, b) {
        return s.filter(a, s.matcher(b))
    }
    ,
    s.findWhere = function(a, b) {
        return s.find(a, s.matcher(b))
    }
    ,
    s.max = function(a, b, c) {
        var d, e, f = -(1 / 0), g = -(1 / 0);
        if (null == b && null != a) {
            a = A(a) ? a : s.values(a);
            for (var h = 0, i = a.length; h < i; h++)
                d = a[h],
                d > f && (f = d)
        } else
            b = u(b, c),
            s.each(a, function(a, c, d) {
                e = b(a, c, d),
                (e > g || e === -(1 / 0) && f === -(1 / 0)) && (f = a,
                g = e)
            });
        return f
    }
    ,
    s.min = function(a, b, c) {
        var d, e, f = 1 / 0, g = 1 / 0;
        if (null == b && null != a) {
            a = A(a) ? a : s.values(a);
            for (var h = 0, i = a.length; h < i; h++)
                d = a[h],
                d < f && (f = d)
        } else
            b = u(b, c),
            s.each(a, function(a, c, d) {
                e = b(a, c, d),
                (e < g || e === 1 / 0 && f === 1 / 0) && (f = a,
                g = e)
            });
        return f
    }
    ,
    s.shuffle = function(a) {
        for (var b, c = A(a) ? a : s.values(a), d = c.length, e = Array(d), f = 0; f < d; f++)
            b = s.random(0, f),
            b !== f && (e[f] = e[b]),
            e[b] = c[f];
        return e
    }
    ,
    s.sample = function(a, b, c) {
        return null == b || c ? (A(a) || (a = s.values(a)),
        a[s.random(a.length - 1)]) : s.shuffle(a).slice(0, Math.max(0, b))
    }
    ,
    s.sortBy = function(a, b, c) {
        return b = u(b, c),
        s.pluck(s.map(a, function(a, c, d) {
            return {
                value: a,
                index: c,
                criteria: b(a, c, d)
            }
        }).sort(function(a, b) {
            var c = a.criteria
              , d = b.criteria;
            if (c !== d) {
                if (c > d || void 0 === c)
                    return 1;
                if (c < d || void 0 === d)
                    return -1
            }
            return a.index - b.index
        }), "value")
    }
    ;
    var B = function(a) {
        return function(b, c, d) {
            var e = {};
            return c = u(c, d),
            s.each(b, function(d, f) {
                var g = c(d, f, b);
                a(e, d, g)
            }),
            e
        }
    };
    s.groupBy = B(function(a, b, c) {
        s.has(a, c) ? a[c].push(b) : a[c] = [b]
    }),
    s.indexBy = B(function(a, b, c) {
        a[c] = b
    }),
    s.countBy = B(function(a, b, c) {
        s.has(a, c) ? a[c]++ : a[c] = 1
    }),
    s.toArray = function(a) {
        return a ? s.isArray(a) ? k.call(a) : A(a) ? s.map(a, s.identity) : s.values(a) : []
    }
    ,
    s.size = function(a) {
        return null == a ? 0 : A(a) ? a.length : s.keys(a).length
    }
    ,
    s.partition = function(a, b, c) {
        b = u(b, c);
        var d = []
          , e = [];
        return s.each(a, function(a, c, f) {
            (b(a, c, f) ? d : e).push(a)
        }),
        [d, e]
    }
    ,
    s.first = s.head = s.take = function(a, b, c) {
        if (null != a)
            return null == b || c ? a[0] : s.initial(a, a.length - b)
    }
    ,
    s.initial = function(a, b, c) {
        return k.call(a, 0, Math.max(0, a.length - (null == b || c ? 1 : b)))
    }
    ,
    s.last = function(a, b, c) {
        if (null != a)
            return null == b || c ? a[a.length - 1] : s.rest(a, Math.max(0, a.length - b))
    }
    ,
    s.rest = s.tail = s.drop = function(a, b, c) {
        return k.call(a, null == b || c ? 1 : b)
    }
    ,
    s.compact = function(a) {
        return s.filter(a, s.identity)
    }
    ;
    var C = function(a, b, c, d) {
        for (var e = [], f = 0, g = d || 0, h = z(a); g < h; g++) {
            var i = a[g];
            if (A(i) && (s.isArray(i) || s.isArguments(i))) {
                b || (i = C(i, b, c));
                var j = 0
                  , k = i.length;
                for (e.length += k; j < k; )
                    e[f++] = i[j++]
            } else
                c || (e[f++] = i)
        }
        return e
    };
    s.flatten = function(a, b) {
        return C(a, b, !1)
    }
    ,
    s.without = function(a) {
        return s.difference(a, k.call(arguments, 1))
    }
    ,
    s.uniq = s.unique = function(a, b, c, d) {
        s.isBoolean(b) || (d = c,
        c = b,
        b = !1),
        null != c && (c = u(c, d));
        for (var e = [], f = [], g = 0, h = z(a); g < h; g++) {
            var i = a[g]
              , j = c ? c(i, g, a) : i;
            b ? (g && f === j || e.push(i),
            f = j) : c ? s.contains(f, j) || (f.push(j),
            e.push(i)) : s.contains(e, i) || e.push(i)
        }
        return e
    }
    ,
    s.union = function() {
        return s.uniq(C(arguments, !0, !0))
    }
    ,
    s.intersection = function(a) {
        for (var b = [], c = arguments.length, d = 0, e = z(a); d < e; d++) {
            var f = a[d];
            if (!s.contains(b, f)) {
                for (var g = 1; g < c && s.contains(arguments[g], f); g++)
                    ;
                g === c && b.push(f)
            }
        }
        return b
    }
    ,
    s.difference = function(a) {
        var b = C(arguments, !0, !0, 1);
        return s.filter(a, function(a) {
            return !s.contains(b, a)
        })
    }
    ,
    s.zip = function() {
        return s.unzip(arguments)
    }
    ,
    s.unzip = function(a) {
        for (var b = a && s.max(a, z).length || 0, c = Array(b), d = 0; d < b; d++)
            c[d] = s.pluck(a, d);
        return c
    }
    ,
    s.object = function(a, b) {
        for (var c = {}, d = 0, e = z(a); d < e; d++)
            b ? c[a[d]] = b[d] : c[a[d][0]] = a[d][1];
        return c
    }
    ,
    s.findIndex = b(1),
    s.findLastIndex = b(-1),
    s.sortedIndex = function(a, b, c, d) {
        c = u(c, d, 1);
        for (var e = c(b), f = 0, g = z(a); f < g; ) {
            var h = Math.floor((f + g) / 2);
            c(a[h]) < e ? f = h + 1 : g = h
        }
        return f
    }
    ,
    s.indexOf = c(1, s.findIndex, s.sortedIndex),
    s.lastIndexOf = c(-1, s.findLastIndex),
    s.range = function(a, b, c) {
        null == b && (b = a || 0,
        a = 0),
        c = c || 1;
        for (var d = Math.max(Math.ceil((b - a) / c), 0), e = Array(d), f = 0; f < d; f++,
        a += c)
            e[f] = a;
        return e
    }
    ;
    var D = function(a, b, c, d, e) {
        if (!(d instanceof b))
            return a.apply(c, e);
        var f = w(a.prototype)
          , g = a.apply(f, e);
        return s.isObject(g) ? g : f
    };
    s.bind = function(a, b) {
        if (p && a.bind === p)
            return p.apply(a, k.call(arguments, 1));
        if (!s.isFunction(a))
            throw new TypeError("Bind must be called on a function");
        var c = k.call(arguments, 2)
          , d = function() {
            return D(a, d, b, this, c.concat(k.call(arguments)))
        };
        return d
    }
    ,
    s.partial = function(a) {
        var b = k.call(arguments, 1)
          , c = function() {
            for (var d = 0, e = b.length, f = Array(e), g = 0; g < e; g++)
                f[g] = b[g] === s ? arguments[d++] : b[g];
            for (; d < arguments.length; )
                f.push(arguments[d++]);
            return D(a, c, this, this, f)
        };
        return c
    }
    ,
    s.bindAll = function(a) {
        var b, c, d = arguments.length;
        if (d <= 1)
            throw new Error("bindAll must be passed function names");
        for (b = 1; b < d; b++)
            c = arguments[b],
            a[c] = s.bind(a[c], a);
        return a
    }
    ,
    s.memoize = function(a, b) {
        var c = function(d) {
            var e = c.cache
              , f = "" + (b ? b.apply(this, arguments) : d);
            return s.has(e, f) || (e[f] = a.apply(this, arguments)),
            e[f]
        };
        return c.cache = {},
        c
    }
    ,
    s.delay = function(a, b) {
        var c = k.call(arguments, 2);
        return setTimeout(function() {
            return a.apply(null, c)
        }, b)
    }
    ,
    s.defer = s.partial(s.delay, s, 1),
    s.throttle = function(a, b, c) {
        var d, e, f, g = null, h = 0;
        c || (c = {});
        var i = function() {
            h = c.leading === !1 ? 0 : s.now(),
            g = null,
            f = a.apply(d, e),
            g || (d = e = null)
        };
        return function() {
            var j = s.now();
            h || c.leading !== !1 || (h = j);
            var k = b - (j - h);
            return d = this,
            e = arguments,
            k <= 0 || k > b ? (g && (clearTimeout(g),
            g = null),
            h = j,
            f = a.apply(d, e),
            g || (d = e = null)) : g || c.trailing === !1 || (g = setTimeout(i, k)),
            f
        }
    }
    ,
    s.debounce = function(a, b, c) {
        var d, e, f, g, h, i = function() {
            var j = s.now() - g;
            j < b && j >= 0 ? d = setTimeout(i, b - j) : (d = null,
            c || (h = a.apply(f, e),
            d || (f = e = null)))
        };
        return function() {
            f = this,
            e = arguments,
            g = s.now();
            var j = c && !d;
            return d || (d = setTimeout(i, b)),
            j && (h = a.apply(f, e),
            f = e = null),
            h
        }
    }
    ,
    s.wrap = function(a, b) {
        return s.partial(b, a)
    }
    ,
    s.negate = function(a) {
        return function() {
            return !a.apply(this, arguments)
        }
    }
    ,
    s.compose = function() {
        var a = arguments
          , b = a.length - 1;
        return function() {
            for (var c = b, d = a[b].apply(this, arguments); c--; )
                d = a[c].call(this, d);
            return d
        }
    }
    ,
    s.after = function(a, b) {
        return function() {
            if (--a < 1)
                return b.apply(this, arguments)
        }
    }
    ,
    s.before = function(a, b) {
        var c;
        return function() {
            return --a > 0 && (c = b.apply(this, arguments)),
            a <= 1 && (b = null),
            c
        }
    }
    ,
    s.once = s.partial(s.before, 2);
    var E = !{
        toString: null
    }.propertyIsEnumerable("toString")
      , F = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
    s.keys = function(a) {
        if (!s.isObject(a))
            return [];
        if (o)
            return o(a);
        var b = [];
        for (var c in a)
            s.has(a, c) && b.push(c);
        return E && d(a, b),
        b
    }
    ,
    s.allKeys = function(a) {
        if (!s.isObject(a))
            return [];
        var b = [];
        for (var c in a)
            b.push(c);
        return E && d(a, b),
        b
    }
    ,
    s.values = function(a) {
        for (var b = s.keys(a), c = b.length, d = Array(c), e = 0; e < c; e++)
            d[e] = a[b[e]];
        return d
    }
    ,
    s.mapObject = function(a, b, c) {
        b = u(b, c);
        for (var d, e = s.keys(a), f = e.length, g = {}, h = 0; h < f; h++)
            d = e[h],
            g[d] = b(a[d], d, a);
        return g
    }
    ,
    s.pairs = function(a) {
        for (var b = s.keys(a), c = b.length, d = Array(c), e = 0; e < c; e++)
            d[e] = [b[e], a[b[e]]];
        return d
    }
    ,
    s.invert = function(a) {
        for (var b = {}, c = s.keys(a), d = 0, e = c.length; d < e; d++)
            b[a[c[d]]] = c[d];
        return b
    }
    ,
    s.functions = s.methods = function(a) {
        var b = [];
        for (var c in a)
            s.isFunction(a[c]) && b.push(c);
        return b.sort()
    }
    ,
    s.extend = v(s.allKeys),
    s.extendOwn = s.assign = v(s.keys),
    s.findKey = function(a, b, c) {
        b = u(b, c);
        for (var d, e = s.keys(a), f = 0, g = e.length; f < g; f++)
            if (d = e[f],
            b(a[d], d, a))
                return d
    }
    ,
    s.pick = function(a, b, c) {
        var d, e, f = {}, g = a;
        if (null == g)
            return f;
        s.isFunction(b) ? (e = s.allKeys(g),
        d = t(b, c)) : (e = C(arguments, !1, !1, 1),
        d = function(a, b, c) {
            return b in c
        }
        ,
        g = Object(g));
        for (var h = 0, i = e.length; h < i; h++) {
            var j = e[h]
              , k = g[j];
            d(k, j, g) && (f[j] = k)
        }
        return f
    }
    ,
    s.omit = function(a, b, c) {
        if (s.isFunction(b))
            b = s.negate(b);
        else {
            var d = s.map(C(arguments, !1, !1, 1), String);
            b = function(a, b) {
                return !s.contains(d, b)
            }
        }
        return s.pick(a, b, c)
    }
    ,
    s.defaults = v(s.allKeys, !0),
    s.create = function(a, b) {
        var c = w(a);
        return b && s.extendOwn(c, b),
        c
    }
    ,
    s.clone = function(a) {
        return s.isObject(a) ? s.isArray(a) ? a.slice() : s.extend({}, a) : a
    }
    ,
    s.tap = function(a, b) {
        return b(a),
        a
    }
    ,
    s.isMatch = function(a, b) {
        var c = s.keys(b)
          , d = c.length;
        if (null == a)
            return !d;
        for (var e = Object(a), f = 0; f < d; f++) {
            var g = c[f];
            if (b[g] !== e[g] || !(g in e))
                return !1
        }
        return !0
    }
    ;
    var G = function(a, b, c, d) {
        if (a === b)
            return 0 !== a || 1 / a === 1 / b;
        if (null == a || null == b)
            return a === b;
        a instanceof s && (a = a._wrapped),
        b instanceof s && (b = b._wrapped);
        var e = l.call(a);
        if (e !== l.call(b))
            return !1;
        switch (e) {
        case "[object RegExp]":
        case "[object String]":
            return "" + a == "" + b;
        case "[object Number]":
            return +a !== +a ? +b !== +b : 0 === +a ? 1 / +a === 1 / b : +a === +b;
        case "[object Date]":
        case "[object Boolean]":
            return +a === +b
        }
        var f = "[object Array]" === e;
        if (!f) {
            if ("object" != typeof a || "object" != typeof b)
                return !1;
            var g = a.constructor
              , h = b.constructor;
            if (g !== h && !(s.isFunction(g) && g instanceof g && s.isFunction(h) && h instanceof h) && "constructor"in a && "constructor"in b)
                return !1
        }
        c = c || [],
        d = d || [];
        for (var i = c.length; i--; )
            if (c[i] === a)
                return d[i] === b;
        if (c.push(a),
        d.push(b),
        f) {
            if (i = a.length,
            i !== b.length)
                return !1;
            for (; i--; )
                if (!G(a[i], b[i], c, d))
                    return !1
        } else {
            var j, k = s.keys(a);
            if (i = k.length,
            s.keys(b).length !== i)
                return !1;
            for (; i--; )
                if (j = k[i],
                !s.has(b, j) || !G(a[j], b[j], c, d))
                    return !1
        }
        return c.pop(),
        d.pop(),
        !0
    };
    s.isEqual = function(a, b) {
        return G(a, b)
    }
    ,
    s.isEmpty = function(a) {
        return null == a || (A(a) && (s.isArray(a) || s.isString(a) || s.isArguments(a)) ? 0 === a.length : 0 === s.keys(a).length)
    }
    ,
    s.isElement = function(a) {
        return !(!a || 1 !== a.nodeType)
    }
    ,
    s.isArray = n || function(a) {
        return "[object Array]" === l.call(a)
    }
    ,
    s.isObject = function(a) {
        var b = typeof a;
        return "function" === b || "object" === b && !!a
    }
    ,
    s.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(a) {
        s["is" + a] = function(b) {
            return l.call(b) === "[object " + a + "]"
        }
    }),
    s.isArguments(arguments) || (s.isArguments = function(a) {
        return s.has(a, "callee")
    }
    ),
    "function" != typeof /./ && "object" != typeof Int8Array && (s.isFunction = function(a) {
        return "function" == typeof a || !1
    }
    ),
    s.isFinite = function(a) {
        return isFinite(a) && !isNaN(parseFloat(a))
    }
    ,
    s.isNaN = function(a) {
        return s.isNumber(a) && a !== +a
    }
    ,
    s.isBoolean = function(a) {
        return a === !0 || a === !1 || "[object Boolean]" === l.call(a)
    }
    ,
    s.isNull = function(a) {
        return null === a
    }
    ,
    s.isUndefined = function(a) {
        return void 0 === a
    }
    ,
    s.has = function(a, b) {
        return null != a && m.call(a, b)
    }
    ,
    s.noConflict = function() {
        return e._ = f,
        this
    }
    ,
    s.identity = function(a) {
        return a
    }
    ,
    s.constant = function(a) {
        return function() {
            return a
        }
    }
    ,
    s.noop = function() {}
    ,
    s.property = x,
    s.propertyOf = function(a) {
        return null == a ? function() {}
        : function(b) {
            return a[b]
        }
    }
    ,
    s.matcher = s.matches = function(a) {
        return a = s.extendOwn({}, a),
        function(b) {
            return s.isMatch(b, a)
        }
    }
    ,
    s.times = function(a, b, c) {
        var d = Array(Math.max(0, a));
        b = t(b, c, 1);
        for (var e = 0; e < a; e++)
            d[e] = b(e);
        return d
    }
    ,
    s.random = function(a, b) {
        return null == b && (b = a,
        a = 0),
        a + Math.floor(Math.random() * (b - a + 1))
    }
    ,
    s.now = Date.now || function() {
        return (new Date).getTime()
    }
    ;
    var H = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    }
      , I = s.invert(H)
      , J = function(a) {
        var b = function(b) {
            return a[b]
        }
          , c = "(?:" + s.keys(a).join("|") + ")"
          , d = RegExp(c)
          , e = RegExp(c, "g");
        return function(a) {
            return a = null == a ? "" : "" + a,
            d.test(a) ? a.replace(e, b) : a
        }
    };
    s.escape = J(H),
    s.unescape = J(I),
    s.result = function(a, b, c) {
        var d = null == a ? void 0 : a[b];
        return void 0 === d && (d = c),
        s.isFunction(d) ? d.call(a) : d
    }
    ;
    var K = 0;
    s.uniqueId = function(a) {
        var b = ++K + "";
        return a ? a + b : b
    }
    ,
    s.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var L = /(.)^/
      , M = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }
      , N = /\\|'|\r|\n|\u2028|\u2029/g
      , O = function(a) {
        return "\\" + M[a]
    };
    s.template = function(a, b, c) {
        !b && c && (b = c),
        b = s.defaults({}, b, s.templateSettings);
        var d = RegExp([(b.escape || L).source, (b.interpolate || L).source, (b.evaluate || L).source].join("|") + "|$", "g")
          , e = 0
          , f = "__p+='";
        a.replace(d, function(b, c, d, g, h) {
            return f += a.slice(e, h).replace(N, O),
            e = h + b.length,
            c ? f += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'" : d ? f += "'+\n((__t=(" + d + "))==null?'':__t)+\n'" : g && (f += "';\n" + g + "\n__p+='"),
            b
        }),
        f += "';\n",
        b.variable || (f = "with(obj||{}){\n" + f + "}\n"),
        f = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + f + "return __p;\n";
        try {
            var g = new Function(b.variable || "obj","_",f)
        } catch (h) {
            throw h.source = f,
            h
        }
        var i = function(a) {
            return g.call(this, a, s)
        }
          , j = b.variable || "obj";
        return i.source = "function(" + j + "){\n" + f + "}",
        i
    }
    ,
    s.chain = function(a) {
        var b = s(a);
        return b._chain = !0,
        b
    }
    ;
    var P = function(a, b) {
        return a._chain ? s(b).chain() : b
    };
    s.mixin = function(a) {
        s.each(s.functions(a), function(b) {
            var c = s[b] = a[b];
            s.prototype[b] = function() {
                var a = [this._wrapped];
                return j.apply(a, arguments),
                P(this, c.apply(s, a))
            }
        })
    }
    ,
    s.mixin(s),
    s.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(a) {
        var b = g[a];
        s.prototype[a] = function() {
            var c = this._wrapped;
            return b.apply(c, arguments),
            "shift" !== a && "splice" !== a || 0 !== c.length || delete c[0],
            P(this, c)
        }
    }),
    s.each(["concat", "join", "slice"], function(a) {
        var b = g[a];
        s.prototype[a] = function() {
            return P(this, b.apply(this._wrapped, arguments))
        }
    }),
    s.prototype.value = function() {
        return this._wrapped
    }
    ,
    s.prototype.valueOf = s.prototype.toJSON = s.prototype.value,
    s.prototype.toString = function() {
        return "" + this._wrapped
    }
    ,
    "function" == typeof define && define.amd && define("underscore", [], function() {
        return s
    })
}
.call(this),
function(a, b) {
    if ("function" == typeof define && define.amd)
        define("backbone.original", ["underscore", "jquery", "exports"], function(c, d, e) {
            a.Backbone = b(a, e, c, d)
        });
    else if ("undefined" != typeof exports) {
        var c = require("underscore");
        b(a, exports, c)
    } else
        a.Backbone = b(a, {}, a._, a.jQuery || a.Zepto || a.ender || a.$)
}(this, function(a, b, c, d) {
    var e = a.Backbone
      , f = []
      , g = (f.push,
    f.slice);
    f.splice;
    b.VERSION = "1.1.2",
    b.$ = d,
    b.noConflict = function() {
        return a.Backbone = e,
        this
    }
    ,
    b.emulateHTTP = !1,
    b.emulateJSON = !1;
    var h = b.Events = {
        on: function(a, b, c) {
            if (!j(this, "on", a, [b, c]) || !b)
                return this;
            this._events || (this._events = {});
            var d = this._events[a] || (this._events[a] = []);
            return d.push({
                callback: b,
                context: c,
                ctx: c || this
            }),
            this
        },
        once: function(a, b, d) {
            if (!j(this, "once", a, [b, d]) || !b)
                return this;
            var e = this
              , f = c.once(function() {
                e.off(a, f),
                b.apply(this, arguments)
            });
            return f._callback = b,
            this.on(a, f, d)
        },
        off: function(a, b, d) {
            var e, f, g, h, i, k, l, m;
            if (!this._events || !j(this, "off", a, [b, d]))
                return this;
            if (!a && !b && !d)
                return this._events = void 0,
                this;
            for (h = a ? [a] : c.keys(this._events),
            i = 0,
            k = h.length; i < k; i++)
                if (a = h[i],
                g = this._events[a]) {
                    if (this._events[a] = e = [],
                    b || d)
                        for (l = 0,
                        m = g.length; l < m; l++)
                            f = g[l],
                            (b && b !== f.callback && b !== f.callback._callback || d && d !== f.context) && e.push(f);
                    e.length || delete this._events[a]
                }
            return this
        },
        trigger: function(a) {
            if (!this._events)
                return this;
            var b = g.call(arguments, 1);
            if (!j(this, "trigger", a, b))
                return this;
            var c = this._events[a]
              , d = this._events.all;
            return c && k(c, b),
            d && k(d, arguments),
            this
        },
        stopListening: function(a, b, d) {
            var e = this._listeningTo;
            if (!e)
                return this;
            var f = !b && !d;
            d || "object" != typeof b || (d = this),
            a && ((e = {})[a._listenId] = a);
            for (var g in e)
                a = e[g],
                a.off(b, d, this),
                (f || c.isEmpty(a._events)) && delete this._listeningTo[g];
            return this
        }
    }
      , i = /\s+/
      , j = function(a, b, c, d) {
        if (!c)
            return !0;
        if ("object" == typeof c) {
            for (var e in c)
                a[b].apply(a, [e, c[e]].concat(d));
            return !1
        }
        if (i.test(c)) {
            for (var f = c.split(i), g = 0, h = f.length; g < h; g++)
                a[b].apply(a, [f[g]].concat(d));
            return !1
        }
        return !0
    }
      , k = function(a, b) {
        var c, d = -1, e = a.length, f = b[0], g = b[1], h = b[2];
        switch (b.length) {
        case 0:
            for (; ++d < e; )
                (c = a[d]).callback.call(c.ctx);
            return;
        case 1:
            for (; ++d < e; )
                (c = a[d]).callback.call(c.ctx, f);
            return;
        case 2:
            for (; ++d < e; )
                (c = a[d]).callback.call(c.ctx, f, g);
            return;
        case 3:
            for (; ++d < e; )
                (c = a[d]).callback.call(c.ctx, f, g, h);
            return;
        default:
            for (; ++d < e; )
                (c = a[d]).callback.apply(c.ctx, b);
            return
        }
    }
      , l = {
        listenTo: "on",
        listenToOnce: "once"
    };
    c.each(l, function(a, b) {
        h[b] = function(b, d, e) {
            var f = this._listeningTo || (this._listeningTo = {})
              , g = b._listenId || (b._listenId = c.uniqueId("l"));
            return f[g] = b,
            e || "object" != typeof d || (e = this),
            b[a](d, e, this),
            this
        }
    }),
    h.bind = h.on,
    h.unbind = h.off,
    c.extend(b, h);
    var m = b.Model = function(a, b) {
        var d = a || {};
        b || (b = {}),
        this.cid = c.uniqueId("c"),
        this.attributes = {},
        b.collection && (this.collection = b.collection),
        b.parse && (d = this.parse(d, b) || {}),
        d = c.defaults({}, d, c.result(this, "defaults")),
        this.set(d, b),
        this.changed = {},
        this.initialize.apply(this, arguments)
    }
    ;
    c.extend(m.prototype, h, {
        changed: null,
        validationError: null,
        idAttribute: "id",
        initialize: function() {},
        toJSON: function(a) {
            return c.clone(this.attributes)
        },
        sync: function() {
            return b.sync.apply(this, arguments)
        },
        get: function(a) {
            return this.attributes[a]
        },
        escape: function(a) {
            return c.escape(this.get(a))
        },
        has: function(a) {
            return null != this.get(a)
        },
        set: function(a, b, d) {
            var e, f, g, h, i, j, k, l;
            if (null == a)
                return this;
            if ("object" == typeof a ? (f = a,
            d = b) : (f = {})[a] = b,
            d || (d = {}),
            !this._validate(f, d))
                return !1;
            g = d.unset,
            i = d.silent,
            h = [],
            j = this._changing,
            this._changing = !0,
            j || (this._previousAttributes = c.clone(this.attributes),
            this.changed = {}),
            l = this.attributes,
            k = this._previousAttributes,
            this.idAttribute in f && (this.id = f[this.idAttribute]);
            for (e in f)
                b = f[e],
                c.isEqual(l[e], b) || h.push(e),
                c.isEqual(k[e], b) ? delete this.changed[e] : this.changed[e] = b,
                g ? delete l[e] : l[e] = b;
            if (!i) {
                h.length && (this._pending = d);
                for (var m = 0, n = h.length; m < n; m++)
                    this.trigger("change:" + h[m], this, l[h[m]], d)
            }
            if (j)
                return this;
            if (!i)
                for (; this._pending; )
                    d = this._pending,
                    this._pending = !1,
                    this.trigger("change", this, d);
            return this._pending = !1,
            this._changing = !1,
            this
        },
        unset: function(a, b) {
            return this.set(a, void 0, c.extend({}, b, {
                unset: !0
            }))
        },
        clear: function(a) {
            var b = {};
            for (var d in this.attributes)
                b[d] = void 0;
            return this.set(b, c.extend({}, a, {
                unset: !0
            }))
        },
        hasChanged: function(a) {
            return null == a ? !c.isEmpty(this.changed) : c.has(this.changed, a)
        },
        changedAttributes: function(a) {
            if (!a)
                return !!this.hasChanged() && c.clone(this.changed);
            var b, d = !1, e = this._changing ? this._previousAttributes : this.attributes;
            for (var f in a)
                c.isEqual(e[f], b = a[f]) || ((d || (d = {}))[f] = b);
            return d
        },
        previous: function(a) {
            return null != a && this._previousAttributes ? this._previousAttributes[a] : null
        },
        previousAttributes: function() {
            return c.clone(this._previousAttributes)
        },
        fetch: function(a) {
            a = a ? c.clone(a) : {},
            void 0 === a.parse && (a.parse = !0);
            var b = this
              , d = a.success;
            return a.success = function(c) {
                return !!b.set(b.parse(c, a), a) && (d && d(b, c, a),
                void b.trigger("sync", b, c, a))
            }
            ,
            L(this, a),
            this.sync("read", this, a)
        },
        save: function(a, b, d) {
            var e, f, g, h = this.attributes;
            if (null == a || "object" == typeof a ? (e = a,
            d = b) : (e = {})[a] = b,
            d = c.extend({
                validate: !0
            }, d),
            e && !d.wait) {
                if (!this.set(e, d))
                    return !1
            } else if (!this._validate(e, d))
                return !1;
            e && d.wait && (this.attributes = c.extend({}, h, e)),
            void 0 === d.parse && (d.parse = !0);
            var i = this
              , j = d.success;
            return d.success = function(a) {
                i.attributes = h;
                var b = i.parse(a, d);
                return d.wait && (b = c.extend(e || {}, b)),
                !(c.isObject(b) && !i.set(b, d)) && (j && j(i, a, d),
                void i.trigger("sync", i, a, d))
            }
            ,
            L(this, d),
            f = this.isNew() ? "create" : d.patch ? "patch" : "update",
            "patch" === f && (d.attrs = e),
            g = this.sync(f, this, d),
            e && d.wait && (this.attributes = h),
            g
        },
        destroy: function(a) {
            a = a ? c.clone(a) : {};
            var b = this
              , d = a.success
              , e = function() {
                b.trigger("destroy", b, b.collection, a)
            };
            if (a.success = function(c) {
                (a.wait || b.isNew()) && e(),
                d && d(b, c, a),
                b.isNew() || b.trigger("sync", b, c, a)
            }
            ,
            this.isNew())
                return a.success(),
                !1;
            L(this, a);
            var f = this.sync("delete", this, a);
            return a.wait || e(),
            f
        },
        url: function() {
            var a = c.result(this, "urlRoot") || c.result(this.collection, "url") || K();
            return this.isNew() ? a : a.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id)
        },
        parse: function(a, b) {
            return a
        },
        clone: function() {
            return new this.constructor(this.attributes)
        },
        isNew: function() {
            return !this.has(this.idAttribute)
        },
        isValid: function(a) {
            return this._validate({}, c.extend(a || {}, {
                validate: !0
            }))
        },
        _validate: function(a, b) {
            if (!b.validate || !this.validate)
                return !0;
            a = c.extend({}, this.attributes, a);
            var d = this.validationError = this.validate(a, b) || null;
            return !d || (this.trigger("invalid", this, d, c.extend(b, {
                validationError: d
            })),
            !1)
        }
    });
    var n = ["keys", "values", "pairs", "invert", "pick", "omit"];
    c.each(n, function(a) {
        m.prototype[a] = function() {
            var b = g.call(arguments);
            return b.unshift(this.attributes),
            c[a].apply(c, b)
        }
    });
    var o = b.Collection = function(a, b) {
        b || (b = {}),
        b.model && (this.model = b.model),
        void 0 !== b.comparator && (this.comparator = b.comparator),
        this._reset(),
        this.initialize.apply(this, arguments),
        a && this.reset(a, c.extend({
            silent: !0
        }, b))
    }
      , p = {
        add: !0,
        remove: !0,
        merge: !0
    }
      , q = {
        add: !0,
        remove: !1
    };
    c.extend(o.prototype, h, {
        model: m,
        initialize: function() {},
        toJSON: function(a) {
            return this.map(function(b) {
                return b.toJSON(a)
            })
        },
        sync: function() {
            return b.sync.apply(this, arguments)
        },
        add: function(a, b) {
            return this.set(a, c.extend({
                merge: !1
            }, b, q))
        },
        remove: function(a, b) {
            var d = !c.isArray(a);
            a = d ? [a] : c.clone(a),
            b || (b = {});
            var e, f, g, h;
            for (e = 0,
            f = a.length; e < f; e++)
                h = a[e] = this.get(a[e]),
                h && (delete this._byId[h.id],
                delete this._byId[h.cid],
                g = this.indexOf(h),
                this.models.splice(g, 1),
                this.length--,
                b.silent || (b.index = g,
                h.trigger("remove", h, this, b)),
                this._removeReference(h, b));
            return d ? a[0] : a
        },
        set: function(a, b) {
            b = c.defaults({}, b, p),
            b.parse && (a = this.parse(a, b));
            var d = !c.isArray(a);
            a = d ? a ? [a] : [] : c.clone(a);
            var e, f, g, h, i, j, k, l = b.at, n = this.model, o = this.comparator && null == l && b.sort !== !1, q = c.isString(this.comparator) ? this.comparator : null, r = [], s = [], t = {}, u = b.add, v = b.merge, w = b.remove, x = !(o || !u || !w) && [];
            for (e = 0,
            f = a.length; e < f; e++) {
                if (i = a[e] || {},
                g = i instanceof m ? h = i : i[n.prototype.idAttribute || "id"],
                j = this.get(g))
                    w && (t[j.cid] = !0),
                    v && (i = i === h ? h.attributes : i,
                    b.parse && (i = j.parse(i, b)),
                    j.set(i, b),
                    o && !k && j.hasChanged(q) && (k = !0)),
                    a[e] = j;
                else if (u) {
                    if (h = a[e] = this._prepareModel(i, b),
                    !h)
                        continue;
                    r.push(h),
                    this._addReference(h, b)
                }
                h = j || h,
                !x || !h.isNew() && t[h.id] || x.push(h),
                t[h.id] = !0
            }
            if (w) {
                for (e = 0,
                f = this.length; e < f; ++e)
                    t[(h = this.models[e]).cid] || s.push(h);
                s.length && this.remove(s, b)
            }
            if (r.length || x && x.length)
                if (o && (k = !0),
                this.length += r.length,
                null != l)
                    for (e = 0,
                    f = r.length; e < f; e++)
                        this.models.splice(l + e, 0, r[e]);
                else {
                    x && (this.models.length = 0);
                    var y = x || r;
                    for (e = 0,
                    f = y.length; e < f; e++)
                        this.models.push(y[e])
                }
            if (k && this.sort({
                silent: !0
            }),
            !b.silent) {
                for (e = 0,
                f = r.length; e < f; e++)
                    (h = r[e]).trigger("add", h, this, b);
                (k || x && x.length) && this.trigger("sort", this, b)
            }
            return d ? a[0] : a
        },
        reset: function(a, b) {
            b || (b = {});
            for (var d = 0, e = this.models.length; d < e; d++)
                this._removeReference(this.models[d], b);
            return b.previousModels = this.models,
            this._reset(),
            a = this.add(a, c.extend({
                silent: !0
            }, b)),
            b.silent || this.trigger("reset", this, b),
            a
        },
        push: function(a, b) {
            return this.add(a, c.extend({
                at: this.length
            }, b))
        },
        pop: function(a) {
            var b = this.at(this.length - 1);
            return this.remove(b, a),
            b
        },
        unshift: function(a, b) {
            return this.add(a, c.extend({
                at: 0
            }, b))
        },
        shift: function(a) {
            var b = this.at(0);
            return this.remove(b, a),
            b
        },
        slice: function() {
            return g.apply(this.models, arguments)
        },
        get: function(a) {
            if (null != a)
                return this._byId[a] || this._byId[a.id] || this._byId[a.cid]
        },
        at: function(a) {
            return this.models[a]
        },
        where: function(a, b) {
            return c.isEmpty(a) ? b ? void 0 : [] : this[b ? "find" : "filter"](function(b) {
                for (var c in a)
                    if (a[c] !== b.get(c))
                        return !1;
                return !0
            })
        },
        findWhere: function(a) {
            return this.where(a, !0)
        },
        sort: function(a) {
            if (!this.comparator)
                throw new Error("Cannot sort a set without a comparator");
            return a || (a = {}),
            c.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(c.bind(this.comparator, this)),
            a.silent || this.trigger("sort", this, a),
            this
        },
        pluck: function(a) {
            return c.invoke(this.models, "get", a)
        },
        fetch: function(a) {
            a = a ? c.clone(a) : {},
            void 0 === a.parse && (a.parse = !0);
            var b = a.success
              , d = this;
            return a.success = function(c) {
                var e = a.reset ? "reset" : "set";
                d[e](c, a),
                b && b(d, c, a),
                d.trigger("sync", d, c, a)
            }
            ,
            L(this, a),
            this.sync("read", this, a)
        },
        create: function(a, b) {
            if (b = b ? c.clone(b) : {},
            !(a = this._prepareModel(a, b)))
                return !1;
            b.wait || this.add(a, b);
            var d = this
              , e = b.success;
            return b.success = function(a, c) {
                b.wait && d.add(a, b),
                e && e(a, c, b)
            }
            ,
            a.save(null, b),
            a
        },
        parse: function(a, b) {
            return a
        },
        clone: function() {
            return new this.constructor(this.models)
        },
        _reset: function() {
            this.length = 0,
            this.models = [],
            this._byId = {}
        },
        _prepareModel: function(a, b) {
            if (a instanceof m)
                return a;
            b = b ? c.clone(b) : {},
            b.collection = this;
            var d = new this.model(a,b);
            return d.validationError ? (this.trigger("invalid", this, d.validationError, b),
            !1) : d
        },
        _addReference: function(a, b) {
            this._byId[a.cid] = a,
            null != a.id && (this._byId[a.id] = a),
            a.collection || (a.collection = this),
            a.on("all", this._onModelEvent, this)
        },
        _removeReference: function(a, b) {
            this === a.collection && delete a.collection,
            a.off("all", this._onModelEvent, this)
        },
        _onModelEvent: function(a, b, c, d) {
            ("add" !== a && "remove" !== a || c === this) && ("destroy" === a && this.remove(b, d),
            b && a === "change:" + b.idAttribute && (delete this._byId[b.previous(b.idAttribute)],
            null != b.id && (this._byId[b.id] = b)),
            this.trigger.apply(this, arguments))
        }
    });
    var r = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain", "sample"];
    c.each(r, function(a) {
        o.prototype[a] = function() {
            var b = g.call(arguments);
            return b.unshift(this.models),
            c[a].apply(c, b)
        }
    });
    var s = ["groupBy", "countBy", "sortBy", "indexBy"];
    c.each(s, function(a) {
        o.prototype[a] = function(b, d) {
            var e = c.isFunction(b) ? b : function(a) {
                return a.get(b)
            }
            ;
            return c[a](this.models, e, d)
        }
    });
    var t = b.View = function(a) {
        this.cid = c.uniqueId("view"),
        a || (a = {}),
        c.extend(this, c.pick(a, v)),
        this._ensureElement(),
        this.initialize.apply(this, arguments),
        this.delegateEvents()
    }
      , u = /^(\S+)\s*(.*)$/
      , v = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
    c.extend(t.prototype, h, {
        tagName: "div",
        $: function(a) {
            return this.$el.find(a)
        },
        initialize: function() {},
        render: function() {
            return this
        },
        remove: function() {
            return this.$el.remove(),
            this.stopListening(),
            this
        },
        setElement: function(a, c) {
            return this.$el && this.undelegateEvents(),
            this.$el = a instanceof b.$ ? a : b.$(a),
            this.el = this.$el[0],
            c !== !1 && this.delegateEvents(),
            this
        },
        delegateEvents: function(a) {
            if (!a && !(a = c.result(this, "events")))
                return this;
            this.undelegateEvents();
            for (var b in a) {
                var d = a[b];
                if (c.isFunction(d) || (d = this[a[b]]),
                d) {
                    var e = b.match(u)
                      , f = e[1]
                      , g = e[2];
                    d = c.bind(d, this),
                    f += ".delegateEvents" + this.cid,
                    "" === g ? this.$el.on(f, d) : this.$el.on(f, g, d)
                }
            }
            return this
        },
        undelegateEvents: function() {
            return this.$el.off(".delegateEvents" + this.cid),
            this
        },
        _ensureElement: function() {
            if (this.el)
                this.setElement(c.result(this, "el"), !1);
            else {
                var a = c.extend({}, c.result(this, "attributes"));
                this.id && (a.id = c.result(this, "id")),
                this.className && (a["class"] = c.result(this, "className"));
                var d = b.$("<" + c.result(this, "tagName") + ">").attr(a);
                this.setElement(d, !1)
            }
        }
    }),
    b.sync = function(a, d, e) {
        var f = x[a];
        c.defaults(e || (e = {}), {
            emulateHTTP: b.emulateHTTP,
            emulateJSON: b.emulateJSON
        });
        var g = {
            type: f,
            dataType: "json"
        };
        if (e.url || (g.url = c.result(d, "url") || K()),
        null != e.data || !d || "create" !== a && "update" !== a && "patch" !== a || (g.contentType = "application/json",
        g.data = JSON.stringify(e.attrs || d.toJSON(e))),
        e.emulateJSON && (g.contentType = "application/x-www-form-urlencoded",
        g.data = g.data ? {
            model: g.data
        } : {}),
        e.emulateHTTP && ("PUT" === f || "DELETE" === f || "PATCH" === f)) {
            g.type = "POST",
            e.emulateJSON && (g.data._method = f);
            var h = e.beforeSend;
            e.beforeSend = function(a) {
                if (a.setRequestHeader("X-HTTP-Method-Override", f),
                h)
                    return h.apply(this, arguments)
            }
        }
        "GET" === g.type || e.emulateJSON || (g.processData = !1),
        "PATCH" === g.type && w && (g.xhr = function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }
        );
        var i = e.xhr = b.ajax(c.extend(g, e));
        return d.trigger("request", d, i, e),
        i
    }
    ;
    var w = !("undefined" == typeof window || !window.ActiveXObject || window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent)
      , x = {
        create: "POST",
        update: "PUT",
        patch: "PATCH",
        "delete": "DELETE",
        read: "GET"
    };
    b.ajax = function() {
        return b.$.ajax.apply(b.$, arguments)
    }
    ;
    var y = b.Router = function(a) {
        a || (a = {}),
        a.routes && (this.routes = a.routes),
        this._bindRoutes(),
        this.initialize.apply(this, arguments)
    }
      , z = /\((.*?)\)/g
      , A = /(\(\?)?:\w+/g
      , B = /\*\w+/g
      , C = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    c.extend(y.prototype, h, {
        initialize: function() {},
        route: function(a, d, e) {
            c.isRegExp(a) || (a = this._routeToRegExp(a)),
            c.isFunction(d) && (e = d,
            d = ""),
            e || (e = this[d]);
            var f = this;
            return b.history.route(a, function(c) {
                var g = f._extractParameters(a, c);
                f.execute(e, g),
                f.trigger.apply(f, ["route:" + d].concat(g)),
                f.trigger("route", d, g),
                b.history.trigger("route", f, d, g)
            }),
            this
        },
        execute: function(a, b) {
            a && a.apply(this, b)
        },
        navigate: function(a, c) {
            return b.history.navigate(a, c),
            this
        },
        _bindRoutes: function() {
            if (this.routes) {
                this.routes = c.result(this, "routes");
                for (var a, b = c.keys(this.routes); null != (a = b.pop()); )
                    this.route(a, this.routes[a])
            }
        },
        _routeToRegExp: function(a) {
            return a = a.replace(C, "\\$&").replace(z, "(?:$1)?").replace(A, function(a, b) {
                return b ? a : "([^/?]+)"
            }).replace(B, "([^?]*?)"),
            new RegExp("^" + a + "(?:\\?([\\s\\S]*))?$")
        },
        _extractParameters: function(a, b) {
            var d = a.exec(b).slice(1);
            return c.map(d, function(a, b) {
                return b === d.length - 1 ? a || null : a ? decodeURIComponent(a) : null
            })
        }
    });
    var D = b.History = function() {
        this.handlers = [],
        c.bindAll(this, "checkUrl"),
        "undefined" != typeof window && (this.location = window.location,
        this.history = window.history)
    }
      , E = /^[#\/]|\s+$/g
      , F = /^\/+|\/+$/g
      , G = /msie [\w.]+/
      , H = /\/$/
      , I = /#.*$/;
    D.started = !1,
    c.extend(D.prototype, h, {
        interval: 50,
        atRoot: function() {
            return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root
        },
        getHash: function(a) {
            var b = (a || this).location.href.match(/#(.*)$/);
            return b ? b[1] : ""
        },
        getFragment: function(a, b) {
            if (null == a)
                if (this._hasPushState || !this._wantsHashChange || b) {
                    a = decodeURI(this.location.pathname + this.location.search);
                    var c = this.root.replace(H, "");
                    a.indexOf(c) || (a = a.slice(c.length))
                } else
                    a = this.getHash();
            return a.replace(E, "")
        },
        start: function(a) {
            if (D.started)
                throw new Error("Backbone.history has already been started");
            D.started = !0,
            this.options = c.extend({
                root: "/"
            }, this.options, a),
            this.root = this.options.root,
            this._wantsHashChange = this.options.hashChange !== !1,
            this._wantsPushState = !!this.options.pushState,
            this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
            var d = this.getFragment()
              , e = document.documentMode
              , f = G.exec(navigator.userAgent.toLowerCase()) && (!e || e <= 7);
            if (this.root = ("/" + this.root + "/").replace(F, "/"),
            f && this._wantsHashChange) {
                var g = b.$('<iframe src="javascript:0" tabindex="-1">');
                this.iframe = g.hide().appendTo("body")[0].contentWindow,
                this.navigate(d)
            }
            this._hasPushState ? b.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange"in window && !f ? b.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)),
            this.fragment = d;
            var h = this.location;
            if (this._wantsHashChange && this._wantsPushState) {
                if (!this._hasPushState && !this.atRoot())
                    return this.fragment = this.getFragment(null, !0),
                    this.location.replace(this.root + "#" + this.fragment),
                    !0;
                this._hasPushState && this.atRoot() && h.hash && (this.fragment = this.getHash().replace(E, ""),
                this.history.replaceState({}, document.title, this.root + this.fragment))
            }
            if (!this.options.silent)
                return this.loadUrl()
        },
        stop: function() {
            b.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl),
            this._checkUrlInterval && clearInterval(this._checkUrlInterval),
            D.started = !1
        },
        route: function(a, b) {
            this.handlers.unshift({
                route: a,
                callback: b
            })
        },
        checkUrl: function(a) {
            var b = this.getFragment();
            return b === this.fragment && this.iframe && (b = this.getFragment(this.getHash(this.iframe))),
            b !== this.fragment && (this.iframe && this.navigate(b),
            void this.loadUrl())
        },
        loadUrl: function(a) {
            return a = this.fragment = this.getFragment(a),
            c.any(this.handlers, function(b) {
                if (b.route.test(a))
                    return b.callback(a),
                    !0
            })
        },
        navigate: function(a, b) {
            if (!D.started)
                return !1;
            b && b !== !0 || (b = {
                trigger: !!b
            });
            var c = this.root + (a = this.getFragment(a || ""));
            if (a = a.replace(I, ""),
            this.fragment !== a) {
                if (this.fragment = a,
                "" === a && "/" !== c && (c = c.slice(0, -1)),
                this._hasPushState)
                    this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, c);
                else {
                    if (!this._wantsHashChange)
                        return this.location.assign(c);
                    this._updateHash(this.location, a, b.replace),
                    this.iframe && a !== this.getFragment(this.getHash(this.iframe)) && (b.replace || this.iframe.document.open().close(),
                    this._updateHash(this.iframe.location, a, b.replace))
                }
                return b.trigger ? this.loadUrl(a) : void 0
            }
        },
        _updateHash: function(a, b, c) {
            if (c) {
                var d = a.href.replace(/(javascript:|#).*$/, "");
                a.replace(d + "#" + b)
            } else
                a.hash = "#" + b
        }
    }),
    b.history = new D;
    var J = function(a, b) {
        var d, e = this;
        d = a && c.has(a, "constructor") ? a.constructor : function() {
            return e.apply(this, arguments)
        }
        ,
        c.extend(d, e, b);
        var f = function() {
            this.constructor = d
        };
        return f.prototype = e.prototype,
        d.prototype = new f,
        a && c.extend(d.prototype, a),
        d.__super__ = e.prototype,
        d
    };
    m.extend = o.extend = y.extend = t.extend = D.extend = J;
    var K = function() {
        throw new Error('A "url" property or function must be specified')
    }
      , L = function(a, b) {
        var c = b.error;
        b.error = function(d) {
            c && c(a, d, b),
            a.trigger("error", a, d, b)
        }
    };
    return b
}),
define("common/vendor_extensions/backbone.overrides", ["backbone.original"], function(a) {
    "use strict";
    return a.ajax = function(a) {
        return "jsonp" === a.dataType && (a.cache = !0),
        require("core/api").ajax(a)
    }
    ,
    a.Collection.prototype.parse = function(a) {
        return a.response
    }
    ,
    a
});
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
    return typeof a
}
: function(a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
}
;
define("common/vendor_extensions/backbone.extensions", ["backbone.original", "underscore"], function(a, b) {
    "use strict";
    return a.collectionAddNormalizer = function(a, c) {
        return function(d) {
            return function(e, f, g) {
                var h;
                if (e instanceof a)
                    g = f,
                    f = e,
                    h = f.models;
                else if (e instanceof c)
                    h = [e];
                else {
                    if (!b.isArray(e))
                        throw new Error("Unknown model: " + ("undefined" == typeof e ? "undefined" : _typeof(e)));
                    h = e
                }
                return d.call(this, h, f, g || {})
            }
        }
    }
    ,
    a
}),
define("backbone", ["backbone.original", "common/vendor_extensions/backbone.overrides", "common/vendor_extensions/backbone.extensions"], function(a) {
    "use strict";
    return a
}),
function(a, b) {
    if ("function" == typeof define && define.amd)
        define("backbone.uniquemodel", ["backbone"], function(a) {
            a.UniqueModel = b(a)
        });
    else if ("undefined" != typeof exports) {
        var c = require("backbone");
        c.UniqueModel = b(c)
    } else
        a.Backbone.UniqueModel = b(a.Backbone)
}(this, function(a) {
    "use strict";
    function b(a, c, d) {
        c = c || _.uniqueId("UniqueModel_"),
        d = d || b.STORAGE_DEFAULT_ADAPTER;
        var e = b.addModel(a, c, d);
        return e.modelConstructor
    }
    function c(b, c, e) {
        var f = this;
        this.instances = {},
        this.Model = b,
        this.modelName = c,
        this.storage = null,
        "localStorage" === e ? this.storage = new d(this.modelName,localStorage) : "sessionStorage" === e && (this.storage = new d(this.modelName,sessionStorage)),
        this.storage && (this.storage.on("sync", this.storageSync, this),
        this.storage.on("destroy", this.storageDestroy, this));
        var g = function(a, b) {
            return f.get(a, b)
        };
        _.extend(g, b),
        _.extend(g, a.Events),
        g.prototype = this.Model.prototype,
        this.modelConstructor = g
    }
    function d(a, b) {
        this.modelName = a,
        this.store = b,
        d.instances[a] = this,
        d.listener || (d.listener = window.addEventListener ? window.addEventListener("storage", d.onStorage, !1) : window.attachEvent("onstorage", d.onStorage))
    }
    var e = {};
    return b.STORAGE_DEFAULT_ADAPTER = "memory",
    b.STORAGE_KEY_DELIMETER = ".",
    b.STORAGE_NAMESPACE = "UniqueModel",
    b.getModelCache = function(a) {
        var b = e[a];
        if (!b)
            throw "Unrecognized model: " + a;
        return b
    }
    ,
    b.addModel = function(a, b, d) {
        if (e[b])
            return e[b];
        var f = new c(a,b,d);
        return e[b] = f,
        f
    }
    ,
    b.clear = function() {
        for (var a in e)
            e.hasOwnProperty(a) && delete e[a]
    }
    ,
    _.extend(c.prototype, {
        newModel: function(a, b) {
            var c = new this.Model(a,b);
            return c.id || c.once("change:" + c.idAttribute, function() {
                this.instances[c.id] || (this.instances[c.id] = c)
            }, this),
            this.storage && c.id && this.storage.save(c.id, c.attributes),
            c.on("sync", this.instanceSync, this),
            c.on("destroy", this.instanceDestroy, this),
            c
        },
        instanceSync: function(a) {
            this.storage && this.storage.save(a.id, a.attributes)
        },
        instanceDestroy: function(a) {
            var b = a.id;
            this.storage && this.storage.remove(b),
            this.instances[b] && delete this.instances[b]
        },
        storageSync: function(a, b) {
            this.get(b, {
                fromStorage: !0
            })
        },
        storageDestroy: function(a) {
            var b = this.instances[a];
            b && (b.trigger("destroy", b),
            delete this.instances[a])
        },
        add: function(a, b, c) {
            var d = this.newModel(b, c);
            return this.instances[a] = d,
            d
        },
        get: function(a, b) {
            b = b || {};
            var c = this.Model
              , d = a && a[c.prototype.idAttribute];
            if (!d)
                return this.newModel(a, b);
            var e = this.instances[d];
            if (this.storage && !b.fromStorage && !e) {
                var f = this.storage.getFromStorage(this.storage.getStorageKey(d));
                f && (e = this.add(d, f, b))
            }
            return e ? (e.set(a),
            b.fromStorage || this.instanceSync(e)) : (e = this.add(d, a, b),
            b.fromStorage && this.modelConstructor.trigger("uniquemodel.add", e)),
            e
        }
    }),
    d.instances = {},
    d.listener = null,
    d.onStorage = function(a) {
        var c = a.key
          , e = new RegExp([b.STORAGE_NAMESPACE, "(\\w+)", "(.+)"].join("\\" + b.STORAGE_KEY_DELIMETER))
          , f = c.match(e);
        if (f) {
            var g = f[1]
              , h = f[2]
              , i = d.instances[g];
            i && i.handleStorageEvent(c, h)
        }
    }
    ,
    _.extend(d.prototype, {
        handleStorageEvent: function(a, b) {
            var c = this.getFromStorage(a);
            c ? this.trigger("sync", b, c) : this.trigger("destroy", b)
        },
        getFromStorage: function(a) {
            try {
                return JSON.parse(this.store.getItem(a))
            } catch (b) {
                return
            }
        },
        getStorageKey: function(a) {
            var c = [b.STORAGE_NAMESPACE, this.modelName, a].join(b.STORAGE_KEY_DELIMETER);
            return c
        },
        save: function(a, b) {
            if (!a)
                throw "Cannot save without id";
            var c = JSON.stringify(b);
            this.store.setItem(this.getStorageKey(a), c)
        },
        remove: function(a) {
            if (!a)
                throw "Cannot remove without id";
            this.store.removeItem(this.getStorageKey(a))
        }
    }, a.Events),
    _.extend(b, {
        ModelCache: c,
        StorageAdapter: d
    }),
    b
}),
function(a) {
    function b(a, b, c) {
        switch (arguments.length) {
        case 2:
            return null != a ? a : b;
        case 3:
            return null != a ? a : null != b ? b : c;
        default:
            throw new Error("Implement me")
        }
    }
    function c() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }
    function d(a) {
        ra.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + a)
    }
    function e(a, b) {
        var c = !0;
        return l(function() {
            return c && (d(a),
            c = !1),
            b.apply(this, arguments)
        }, b)
    }
    function f(a, b) {
        nb[a] || (d(b),
        nb[a] = !0)
    }
    function g(a, b) {
        return function(c) {
            return o(a.call(this, c), b)
        }
    }
    function h(a, b) {
        return function(c) {
            return this.localeData().ordinal(a.call(this, c), b)
        }
    }
    function i() {}
    function j(a, b) {
        b !== !1 && E(a),
        m(this, a),
        this._d = new Date((+a._d))
    }
    function k(a) {
        var b = x(a)
          , c = b.year || 0
          , d = b.quarter || 0
          , e = b.month || 0
          , f = b.week || 0
          , g = b.day || 0
          , h = b.hour || 0
          , i = b.minute || 0
          , j = b.second || 0
          , k = b.millisecond || 0;
        this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h,
        this._days = +g + 7 * f,
        this._months = +e + 3 * d + 12 * c,
        this._data = {},
        this._locale = ra.localeData(),
        this._bubble()
    }
    function l(a, b) {
        for (var c in b)
            b.hasOwnProperty(c) && (a[c] = b[c]);
        return b.hasOwnProperty("toString") && (a.toString = b.toString),
        b.hasOwnProperty("valueOf") && (a.valueOf = b.valueOf),
        a
    }
    function m(a, b) {
        var c, d, e;
        if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject),
        "undefined" != typeof b._i && (a._i = b._i),
        "undefined" != typeof b._f && (a._f = b._f),
        "undefined" != typeof b._l && (a._l = b._l),
        "undefined" != typeof b._strict && (a._strict = b._strict),
        "undefined" != typeof b._tzm && (a._tzm = b._tzm),
        "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC),
        "undefined" != typeof b._offset && (a._offset = b._offset),
        "undefined" != typeof b._pf && (a._pf = b._pf),
        "undefined" != typeof b._locale && (a._locale = b._locale),
        Fa.length > 0)
            for (c in Fa)
                d = Fa[c],
                e = b[d],
                "undefined" != typeof e && (a[d] = e);
        return a
    }
    function n(a) {
        return a < 0 ? Math.ceil(a) : Math.floor(a)
    }
    function o(a, b, c) {
        for (var d = "" + Math.abs(a), e = a >= 0; d.length < b; )
            d = "0" + d;
        return (e ? c ? "+" : "" : "-") + d
    }
    function p(a, b) {
        var c = {
            milliseconds: 0,
            months: 0
        };
        return c.months = b.month() - a.month() + 12 * (b.year() - a.year()),
        a.clone().add(c.months, "M").isAfter(b) && --c.months,
        c.milliseconds = +b - +a.clone().add(c.months, "M"),
        c
    }
    function q(a, b) {
        var c;
        return b = J(b, a),
        a.isBefore(b) ? c = p(a, b) : (c = p(b, a),
        c.milliseconds = -c.milliseconds,
        c.months = -c.months),
        c
    }
    function r(a, b) {
        return function(c, d) {
            var e, g;
            return null === d || isNaN(+d) || (f(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."),
            g = c,
            c = d,
            d = g),
            c = "string" == typeof c ? +c : c,
            e = ra.duration(c, d),
            s(this, e, a),
            this
        }
    }
    function s(a, b, c, d) {
        var e = b._milliseconds
          , f = b._days
          , g = b._months;
        d = null == d || d,
        e && a._d.setTime(+a._d + e * c),
        f && la(a, "Date", ka(a, "Date") + f * c),
        g && ja(a, ka(a, "Month") + g * c),
        d && ra.updateOffset(a, f || g)
    }
    function t(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }
    function u(a) {
        return "[object Date]" === Object.prototype.toString.call(a) || a instanceof Date
    }
    function v(a, b, c) {
        var d, e = Math.min(a.length, b.length), f = Math.abs(a.length - b.length), g = 0;
        for (d = 0; d < e; d++)
            (c && a[d] !== b[d] || !c && z(a[d]) !== z(b[d])) && g++;
        return g + f
    }
    function w(a) {
        if (a) {
            var b = a.toLowerCase().replace(/(.)s$/, "$1");
            a = gb[a] || hb[b] || b
        }
        return a
    }
    function x(a) {
        var b, c, d = {};
        for (c in a)
            a.hasOwnProperty(c) && (b = w(c),
            b && (d[b] = a[c]));
        return d
    }
    function y(b) {
        var c, d;
        if (0 === b.indexOf("week"))
            c = 7,
            d = "day";
        else {
            if (0 !== b.indexOf("month"))
                return;
            c = 12,
            d = "month"
        }
        ra[b] = function(e, f) {
            var g, h, i = ra._locale[b], j = [];
            if ("number" == typeof e && (f = e,
            e = a),
            h = function(a) {
                var b = ra().utc().set(d, a);
                return i.call(ra._locale, b, e || "")
            }
            ,
            null != f)
                return h(f);
            for (g = 0; g < c; g++)
                j.push(h(g));
            return j
        }
    }
    function z(a) {
        var b = +a
          , c = 0;
        return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)),
        c
    }
    function A(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }
    function B(a, b, c) {
        return fa(ra([a, 11, 31 + b - c]), b, c).week
    }
    function C(a) {
        return D(a) ? 366 : 365
    }
    function D(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }
    function E(a) {
        var b;
        a._a && a._pf.overflow === -2 && (b = a._a[ya] < 0 || a._a[ya] > 11 ? ya : a._a[za] < 1 || a._a[za] > A(a._a[xa], a._a[ya]) ? za : a._a[Aa] < 0 || a._a[Aa] > 23 ? Aa : a._a[Ba] < 0 || a._a[Ba] > 59 ? Ba : a._a[Ca] < 0 || a._a[Ca] > 59 ? Ca : a._a[Da] < 0 || a._a[Da] > 999 ? Da : -1,
        a._pf._overflowDayOfYear && (b < xa || b > za) && (b = za),
        a._pf.overflow = b)
    }
    function F(a) {
        return null == a._isValid && (a._isValid = !isNaN(a._d.getTime()) && a._pf.overflow < 0 && !a._pf.empty && !a._pf.invalidMonth && !a._pf.nullInput && !a._pf.invalidFormat && !a._pf.userInvalidated,
        a._strict && (a._isValid = a._isValid && 0 === a._pf.charsLeftOver && 0 === a._pf.unusedTokens.length)),
        a._isValid
    }
    function G(a) {
        return a ? a.toLowerCase().replace("_", "-") : a
    }
    function H(a) {
        for (var b, c, d, e, f = 0; f < a.length; ) {
            for (e = G(a[f]).split("-"),
            b = e.length,
            c = G(a[f + 1]),
            c = c ? c.split("-") : null; b > 0; ) {
                if (d = I(e.slice(0, b).join("-")))
                    return d;
                if (c && c.length >= b && v(e, c, !0) >= b - 1)
                    break;
                b--
            }
            f++
        }
        return null
    }
    function I(a) {
        var b = null;
        if (!Ea[a] && Ga)
            try {
                b = ra.locale(),
                require("./locale/" + a),
                ra.locale(b)
            } catch (c) {}
        return Ea[a]
    }
    function J(a, b) {
        return b._isUTC ? ra(a).zone(b._offset || 0) : ra(a).local()
    }
    function K(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }
    function L(a) {
        var b, c, d = a.match(Ka);
        for (b = 0,
        c = d.length; b < c; b++)
            mb[d[b]] ? d[b] = mb[d[b]] : d[b] = K(d[b]);
        return function(e) {
            var f = "";
            for (b = 0; b < c; b++)
                f += d[b]instanceof Function ? d[b].call(e, a) : d[b];
            return f
        }
    }
    function M(a, b) {
        return a.isValid() ? (b = N(b, a.localeData()),
        ib[b] || (ib[b] = L(b)),
        ib[b](a)) : a.localeData().invalidDate()
    }
    function N(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }
        var d = 5;
        for (La.lastIndex = 0; d >= 0 && La.test(a); )
            a = a.replace(La, c),
            La.lastIndex = 0,
            d -= 1;
        return a
    }
    function O(a, b) {
        var c, d = b._strict;
        switch (a) {
        case "Q":
            return Wa;
        case "DDDD":
            return Ya;
        case "YYYY":
        case "GGGG":
        case "gggg":
            return d ? Za : Oa;
        case "Y":
        case "G":
        case "g":
            return _a;
        case "YYYYYY":
        case "YYYYY":
        case "GGGGG":
        case "ggggg":
            return d ? $a : Pa;
        case "S":
            if (d)
                return Wa;
        case "SS":
            if (d)
                return Xa;
        case "SSS":
            if (d)
                return Ya;
        case "DDD":
            return Na;
        case "MMM":
        case "MMMM":
        case "dd":
        case "ddd":
        case "dddd":
            return Ra;
        case "a":
        case "A":
            return b._locale._meridiemParse;
        case "X":
            return Ua;
        case "Z":
        case "ZZ":
            return Sa;
        case "T":
            return Ta;
        case "SSSS":
            return Qa;
        case "MM":
        case "DD":
        case "YY":
        case "GG":
        case "gg":
        case "HH":
        case "hh":
        case "mm":
        case "ss":
        case "ww":
        case "WW":
            return d ? Xa : Ma;
        case "M":
        case "D":
        case "d":
        case "H":
        case "h":
        case "m":
        case "s":
        case "w":
        case "W":
        case "e":
        case "E":
            return Ma;
        case "Do":
            return Va;
        default:
            return c = new RegExp(X(W(a.replace("\\", "")), "i"))
        }
    }
    function P(a) {
        a = a || "";
        var b = a.match(Sa) || []
          , c = b[b.length - 1] || []
          , d = (c + "").match(eb) || ["-", 0, 0]
          , e = +(60 * d[1]) + z(d[2]);
        return "+" === d[0] ? -e : e
    }
    function Q(a, b, c) {
        var d, e = c._a;
        switch (a) {
        case "Q":
            null != b && (e[ya] = 3 * (z(b) - 1));
            break;
        case "M":
        case "MM":
            null != b && (e[ya] = z(b) - 1);
            break;
        case "MMM":
        case "MMMM":
            d = c._locale.monthsParse(b),
            null != d ? e[ya] = d : c._pf.invalidMonth = b;
            break;
        case "D":
        case "DD":
            null != b && (e[za] = z(b));
            break;
        case "Do":
            null != b && (e[za] = z(parseInt(b, 10)));
            break;
        case "DDD":
        case "DDDD":
            null != b && (c._dayOfYear = z(b));
            break;
        case "YY":
            e[xa] = ra.parseTwoDigitYear(b);
            break;
        case "YYYY":
        case "YYYYY":
        case "YYYYYY":
            e[xa] = z(b);
            break;
        case "a":
        case "A":
            c._isPm = c._locale.isPM(b);
            break;
        case "H":
        case "HH":
        case "h":
        case "hh":
            e[Aa] = z(b);
            break;
        case "m":
        case "mm":
            e[Ba] = z(b);
            break;
        case "s":
        case "ss":
            e[Ca] = z(b);
            break;
        case "S":
        case "SS":
        case "SSS":
        case "SSSS":
            e[Da] = z(1e3 * ("0." + b));
            break;
        case "X":
            c._d = new Date(1e3 * parseFloat(b));
            break;
        case "Z":
        case "ZZ":
            c._useUTC = !0,
            c._tzm = P(b);
            break;
        case "dd":
        case "ddd":
        case "dddd":
            d = c._locale.weekdaysParse(b),
            null != d ? (c._w = c._w || {},
            c._w.d = d) : c._pf.invalidWeekday = b;
            break;
        case "w":
        case "ww":
        case "W":
        case "WW":
        case "d":
        case "e":
        case "E":
            a = a.substr(0, 1);
        case "gggg":
        case "GGGG":
        case "GGGGG":
            a = a.substr(0, 2),
            b && (c._w = c._w || {},
            c._w[a] = z(b));
            break;
        case "gg":
        case "GG":
            c._w = c._w || {},
            c._w[a] = ra.parseTwoDigitYear(b)
        }
    }
    function R(a) {
        var c, d, e, f, g, h, i;
        c = a._w,
        null != c.GG || null != c.W || null != c.E ? (g = 1,
        h = 4,
        d = b(c.GG, a._a[xa], fa(ra(), 1, 4).year),
        e = b(c.W, 1),
        f = b(c.E, 1)) : (g = a._locale._week.dow,
        h = a._locale._week.doy,
        d = b(c.gg, a._a[xa], fa(ra(), g, h).year),
        e = b(c.w, 1),
        null != c.d ? (f = c.d,
        f < g && ++e) : f = null != c.e ? c.e + g : g),
        i = ga(d, e, f, h, g),
        a._a[xa] = i.year,
        a._dayOfYear = i.dayOfYear
    }
    function S(a) {
        var c, d, e, f, g = [];
        if (!a._d) {
            for (e = U(a),
            a._w && null == a._a[za] && null == a._a[ya] && R(a),
            a._dayOfYear && (f = b(a._a[xa], e[xa]),
            a._dayOfYear > C(f) && (a._pf._overflowDayOfYear = !0),
            d = ba(f, 0, a._dayOfYear),
            a._a[ya] = d.getUTCMonth(),
            a._a[za] = d.getUTCDate()),
            c = 0; c < 3 && null == a._a[c]; ++c)
                a._a[c] = g[c] = e[c];
            for (; c < 7; c++)
                a._a[c] = g[c] = null == a._a[c] ? 2 === c ? 1 : 0 : a._a[c];
            a._d = (a._useUTC ? ba : aa).apply(null, g),
            null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() + a._tzm)
        }
    }
    function T(a) {
        var b;
        a._d || (b = x(a._i),
        a._a = [b.year, b.month, b.day, b.hour, b.minute, b.second, b.millisecond],
        S(a))
    }
    function U(a) {
        var b = new Date;
        return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
    }
    function V(a) {
        if (a._f === ra.ISO_8601)
            return void Z(a);
        a._a = [],
        a._pf.empty = !0;
        var b, c, d, e, f, g = "" + a._i, h = g.length, i = 0;
        for (d = N(a._f, a._locale).match(Ka) || [],
        b = 0; b < d.length; b++)
            e = d[b],
            c = (g.match(O(e, a)) || [])[0],
            c && (f = g.substr(0, g.indexOf(c)),
            f.length > 0 && a._pf.unusedInput.push(f),
            g = g.slice(g.indexOf(c) + c.length),
            i += c.length),
            mb[e] ? (c ? a._pf.empty = !1 : a._pf.unusedTokens.push(e),
            Q(e, c, a)) : a._strict && !c && a._pf.unusedTokens.push(e);
        a._pf.charsLeftOver = h - i,
        g.length > 0 && a._pf.unusedInput.push(g),
        a._isPm && a._a[Aa] < 12 && (a._a[Aa] += 12),
        a._isPm === !1 && 12 === a._a[Aa] && (a._a[Aa] = 0),
        S(a),
        E(a)
    }
    function W(a) {
        return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(a, b, c, d, e) {
            return b || c || d || e
        })
    }
    function X(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }
    function Y(a) {
        var b, d, e, f, g;
        if (0 === a._f.length)
            return a._pf.invalidFormat = !0,
            void (a._d = new Date(NaN));
        for (f = 0; f < a._f.length; f++)
            g = 0,
            b = m({}, a),
            b._pf = c(),
            b._f = a._f[f],
            V(b),
            F(b) && (g += b._pf.charsLeftOver,
            g += 10 * b._pf.unusedTokens.length,
            b._pf.score = g,
            (null == e || g < e) && (e = g,
            d = b));
        l(a, d || b)
    }
    function Z(a) {
        var b, c, d = a._i, e = ab.exec(d);
        if (e) {
            for (a._pf.iso = !0,
            b = 0,
            c = cb.length; b < c; b++)
                if (cb[b][1].exec(d)) {
                    a._f = cb[b][0] + (e[6] || " ");
                    break
                }
            for (b = 0,
            c = db.length; b < c; b++)
                if (db[b][1].exec(d)) {
                    a._f += db[b][0];
                    break
                }
            d.match(Sa) && (a._f += "Z"),
            V(a)
        } else
            a._isValid = !1
    }
    function $(a) {
        Z(a),
        a._isValid === !1 && (delete a._isValid,
        ra.createFromInputFallback(a))
    }
    function _(b) {
        var c, d = b._i;
        d === a ? b._d = new Date : u(d) ? b._d = new Date((+d)) : null !== (c = Ha.exec(d)) ? b._d = new Date((+c[1])) : "string" == typeof d ? $(b) : t(d) ? (b._a = d.slice(0),
        S(b)) : "object" == typeof d ? T(b) : "number" == typeof d ? b._d = new Date(d) : ra.createFromInputFallback(b)
    }
    function aa(a, b, c, d, e, f, g) {
        var h = new Date(a,b,c,d,e,f,g);
        return a < 1970 && h.setFullYear(a),
        h
    }
    function ba(a) {
        var b = new Date(Date.UTC.apply(null, arguments));
        return a < 1970 && b.setUTCFullYear(a),
        b
    }
    function ca(a, b) {
        if ("string" == typeof a)
            if (isNaN(a)) {
                if (a = b.weekdaysParse(a),
                "number" != typeof a)
                    return null
            } else
                a = parseInt(a, 10);
        return a
    }
    function da(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }
    function ea(a, b, c) {
        var d = ra.duration(a).abs()
          , e = wa(d.as("s"))
          , f = wa(d.as("m"))
          , g = wa(d.as("h"))
          , h = wa(d.as("d"))
          , i = wa(d.as("M"))
          , j = wa(d.as("y"))
          , k = e < jb.s && ["s", e] || 1 === f && ["m"] || f < jb.m && ["mm", f] || 1 === g && ["h"] || g < jb.h && ["hh", g] || 1 === h && ["d"] || h < jb.d && ["dd", h] || 1 === i && ["M"] || i < jb.M && ["MM", i] || 1 === j && ["y"] || ["yy", j];
        return k[2] = b,
        k[3] = +a > 0,
        k[4] = c,
        da.apply({}, k)
    }
    function fa(a, b, c) {
        var d, e = c - b, f = c - a.day();
        return f > e && (f -= 7),
        f < e - 7 && (f += 7),
        d = ra(a).add(f, "d"),
        {
            week: Math.ceil(d.dayOfYear() / 7),
            year: d.year()
        }
    }
    function ga(a, b, c, d, e) {
        var f, g, h = ba(a, 0, 1).getUTCDay();
        return h = 0 === h ? 7 : h,
        c = null != c ? c : e,
        f = e - h + (h > d ? 7 : 0) - (h < e ? 7 : 0),
        g = 7 * (b - 1) + (c - e) + f + 1,
        {
            year: g > 0 ? a : a - 1,
            dayOfYear: g > 0 ? g : C(a - 1) + g
        }
    }
    function ha(b) {
        var c = b._i
          , d = b._f;
        return b._locale = b._locale || ra.localeData(b._l),
        null === c || d === a && "" === c ? ra.invalid({
            nullInput: !0
        }) : ("string" == typeof c && (b._i = c = b._locale.preparse(c)),
        ra.isMoment(c) ? new j(c,(!0)) : (d ? t(d) ? Y(b) : V(b) : _(b),
        new j(b)))
    }
    function ia(a, b) {
        var c, d;
        if (1 === b.length && t(b[0]) && (b = b[0]),
        !b.length)
            return ra();
        for (c = b[0],
        d = 1; d < b.length; ++d)
            b[d][a](c) && (c = b[d]);
        return c
    }
    function ja(a, b) {
        var c;
        return "string" == typeof b && (b = a.localeData().monthsParse(b),
        "number" != typeof b) ? a : (c = Math.min(a.date(), A(a.year(), b)),
        a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c),
        a)
    }
    function ka(a, b) {
        return a._d["get" + (a._isUTC ? "UTC" : "") + b]()
    }
    function la(a, b, c) {
        return "Month" === b ? ja(a, c) : a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
    }
    function ma(a, b) {
        return function(c) {
            return null != c ? (la(this, a, c),
            ra.updateOffset(this, b),
            this) : ka(this, a)
        }
    }
    function na(a) {
        return 400 * a / 146097
    }
    function oa(a) {
        return 146097 * a / 400
    }
    function pa(a) {
        ra.duration.fn[a] = function() {
            return this._data[a]
        }
    }
    function qa(a) {
        "undefined" == typeof ender && (sa = va.moment,
        a ? va.moment = e("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.", ra) : va.moment = ra)
    }
    for (var ra, sa, ta, ua = "2.8.1", va = "undefined" != typeof global ? global : this, wa = Math.round, xa = 0, ya = 1, za = 2, Aa = 3, Ba = 4, Ca = 5, Da = 6, Ea = {}, Fa = [], Ga = "undefined" != typeof module && module.exports, Ha = /^\/?Date\((\-?\d+)/i, Ia = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, Ja = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, Ka = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, La = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, Ma = /\d\d?/, Na = /\d{1,3}/, Oa = /\d{1,4}/, Pa = /[+\-]?\d{1,6}/, Qa = /\d+/, Ra = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Sa = /Z|[\+\-]\d\d:?\d\d/gi, Ta = /T/i, Ua = /[\+\-]?\d+(\.\d{1,3})?/, Va = /\d{1,2}/, Wa = /\d/, Xa = /\d\d/, Ya = /\d{3}/, Za = /\d{4}/, $a = /[+-]?\d{6}/, _a = /[+-]?\d+/, ab = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, bb = "YYYY-MM-DDTHH:mm:ssZ", cb = [["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/], ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/], ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/], ["GGGG-[W]WW", /\d{4}-W\d{2}/], ["YYYY-DDD", /\d{4}-\d{3}/]], db = [["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], eb = /([\+\-]|\d\d)/gi, fb = ("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),
    {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }), gb = {
        ms: "millisecond",
        s: "second",
        m: "minute",
        h: "hour",
        d: "day",
        D: "date",
        w: "week",
        W: "isoWeek",
        M: "month",
        Q: "quarter",
        y: "year",
        DDD: "dayOfYear",
        e: "weekday",
        E: "isoWeekday",
        gg: "weekYear",
        GG: "isoWeekYear"
    }, hb = {
        dayofyear: "dayOfYear",
        isoweekday: "isoWeekday",
        isoweek: "isoWeek",
        weekyear: "weekYear",
        isoweekyear: "isoWeekYear"
    }, ib = {}, jb = {
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
    }, kb = "DDD w W M D d".split(" "), lb = "M D H h m s w W".split(" "), mb = {
        M: function() {
            return this.month() + 1
        },
        MMM: function(a) {
            return this.localeData().monthsShort(this, a)
        },
        MMMM: function(a) {
            return this.localeData().months(this, a)
        },
        D: function() {
            return this.date()
        },
        DDD: function() {
            return this.dayOfYear()
        },
        d: function() {
            return this.day()
        },
        dd: function(a) {
            return this.localeData().weekdaysMin(this, a)
        },
        ddd: function(a) {
            return this.localeData().weekdaysShort(this, a)
        },
        dddd: function(a) {
            return this.localeData().weekdays(this, a)
        },
        w: function() {
            return this.week()
        },
        W: function() {
            return this.isoWeek()
        },
        YY: function() {
            return o(this.year() % 100, 2)
        },
        YYYY: function() {
            return o(this.year(), 4)
        },
        YYYYY: function() {
            return o(this.year(), 5)
        },
        YYYYYY: function() {
            var a = this.year()
              , b = a >= 0 ? "+" : "-";
            return b + o(Math.abs(a), 6)
        },
        gg: function() {
            return o(this.weekYear() % 100, 2)
        },
        gggg: function() {
            return o(this.weekYear(), 4)
        },
        ggggg: function() {
            return o(this.weekYear(), 5)
        },
        GG: function() {
            return o(this.isoWeekYear() % 100, 2)
        },
        GGGG: function() {
            return o(this.isoWeekYear(), 4)
        },
        GGGGG: function() {
            return o(this.isoWeekYear(), 5)
        },
        e: function() {
            return this.weekday()
        },
        E: function() {
            return this.isoWeekday()
        },
        a: function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), !0)
        },
        A: function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), !1)
        },
        H: function() {
            return this.hours()
        },
        h: function() {
            return this.hours() % 12 || 12
        },
        m: function() {
            return this.minutes()
        },
        s: function() {
            return this.seconds()
        },
        S: function() {
            return z(this.milliseconds() / 100)
        },
        SS: function() {
            return o(z(this.milliseconds() / 10), 2)
        },
        SSS: function() {
            return o(this.milliseconds(), 3)
        },
        SSSS: function() {
            return o(this.milliseconds(), 3)
        },
        Z: function() {
            var a = -this.zone()
              , b = "+";
            return a < 0 && (a = -a,
            b = "-"),
            b + o(z(a / 60), 2) + ":" + o(z(a) % 60, 2)
        },
        ZZ: function() {
            var a = -this.zone()
              , b = "+";
            return a < 0 && (a = -a,
            b = "-"),
            b + o(z(a / 60), 2) + o(z(a) % 60, 2)
        },
        z: function() {
            return this.zoneAbbr()
        },
        zz: function() {
            return this.zoneName()
        },
        X: function() {
            return this.unix()
        },
        Q: function() {
            return this.quarter()
        }
    }, nb = {}, ob = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"]; kb.length; )
        ta = kb.pop(),
        mb[ta + "o"] = h(mb[ta], ta);
    for (; lb.length; )
        ta = lb.pop(),
        mb[ta + ta] = g(mb[ta], 2);
    mb.DDDD = g(mb.DDD, 3),
    l(i.prototype, {
        set: function(a) {
            var b, c;
            for (c in a)
                b = a[c],
                "function" == typeof b ? this[c] = b : this["_" + c] = b
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function(a) {
            return this._months[a.month()]
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function(a) {
            return this._monthsShort[a.month()]
        },
        monthsParse: function(a) {
            var b, c, d;
            for (this._monthsParse || (this._monthsParse = []),
            b = 0; b < 12; b++)
                if (this._monthsParse[b] || (c = ra.utc([2e3, b]),
                d = "^" + this.months(c, "") + "|^" + this.monthsShort(c, ""),
                this._monthsParse[b] = new RegExp(d.replace(".", ""),"i")),
                this._monthsParse[b].test(a))
                    return b
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function(a) {
            return this._weekdays[a.day()]
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function(a) {
            return this._weekdaysShort[a.day()]
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function(a) {
            return this._weekdaysMin[a.day()]
        },
        weekdaysParse: function(a) {
            var b, c, d;
            for (this._weekdaysParse || (this._weekdaysParse = []),
            b = 0; b < 7; b++)
                if (this._weekdaysParse[b] || (c = ra([2e3, 1]).day(b),
                d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""),
                this._weekdaysParse[b] = new RegExp(d.replace(".", ""),"i")),
                this._weekdaysParse[b].test(a))
                    return b
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY LT",
            LLLL: "dddd, MMMM D, YYYY LT"
        },
        longDateFormat: function(a) {
            var b = this._longDateFormat[a];
            return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(a) {
                return a.slice(1)
            }),
            this._longDateFormat[a] = b),
            b
        },
        isPM: function(a) {
            return "p" === (a + "").toLowerCase().charAt(0)
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function(a, b, c) {
            return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(a, b) {
            var c = this._calendar[a];
            return "function" == typeof c ? c.apply(b) : c
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(a, b, c, d) {
            var e = this._relativeTime[c];
            return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
        },
        pastFuture: function(a, b) {
            var c = this._relativeTime[a > 0 ? "future" : "past"];
            return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
        },
        ordinal: function(a) {
            return this._ordinal.replace("%d", a)
        },
        _ordinal: "%d",
        preparse: function(a) {
            return a
        },
        postformat: function(a) {
            return a
        },
        week: function(a) {
            return fa(a, this._week.dow, this._week.doy).week
        },
        _week: {
            dow: 0,
            doy: 6
        },
        _invalidDate: "Invalid date",
        invalidDate: function() {
            return this._invalidDate
        }
    }),
    ra = function(b, d, e, f) {
        var g;
        return "boolean" == typeof e && (f = e,
        e = a),
        g = {},
        g._isAMomentObject = !0,
        g._i = b,
        g._f = d,
        g._l = e,
        g._strict = f,
        g._isUTC = !1,
        g._pf = c(),
        ha(g)
    }
    ,
    ra.suppressDeprecationWarnings = !1,
    ra.createFromInputFallback = e("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(a) {
        a._d = new Date(a._i)
    }),
    ra.min = function() {
        var a = [].slice.call(arguments, 0);
        return ia("isBefore", a)
    }
    ,
    ra.max = function() {
        var a = [].slice.call(arguments, 0);
        return ia("isAfter", a)
    }
    ,
    ra.utc = function(b, d, e, f) {
        var g;
        return "boolean" == typeof e && (f = e,
        e = a),
        g = {},
        g._isAMomentObject = !0,
        g._useUTC = !0,
        g._isUTC = !0,
        g._l = e,
        g._i = b,
        g._f = d,
        g._strict = f,
        g._pf = c(),
        ha(g).utc()
    }
    ,
    ra.unix = function(a) {
        return ra(1e3 * a)
    }
    ,
    ra.duration = function(a, b) {
        var c, d, e, f, g = a, h = null;
        return ra.isDuration(a) ? g = {
            ms: a._milliseconds,
            d: a._days,
            M: a._months
        } : "number" == typeof a ? (g = {},
        b ? g[b] = a : g.milliseconds = a) : (h = Ia.exec(a)) ? (c = "-" === h[1] ? -1 : 1,
        g = {
            y: 0,
            d: z(h[za]) * c,
            h: z(h[Aa]) * c,
            m: z(h[Ba]) * c,
            s: z(h[Ca]) * c,
            ms: z(h[Da]) * c
        }) : (h = Ja.exec(a)) ? (c = "-" === h[1] ? -1 : 1,
        e = function(a) {
            var b = a && parseFloat(a.replace(",", "."));
            return (isNaN(b) ? 0 : b) * c
        }
        ,
        g = {
            y: e(h[2]),
            M: e(h[3]),
            d: e(h[4]),
            h: e(h[5]),
            m: e(h[6]),
            s: e(h[7]),
            w: e(h[8])
        }) : "object" == typeof g && ("from"in g || "to"in g) && (f = q(ra(g.from), ra(g.to)),
        g = {},
        g.ms = f.milliseconds,
        g.M = f.months),
        d = new k(g),
        ra.isDuration(a) && a.hasOwnProperty("_locale") && (d._locale = a._locale),
        d
    }
    ,
    ra.version = ua,
    ra.defaultFormat = bb,
    ra.ISO_8601 = function() {}
    ,
    ra.momentProperties = Fa,
    ra.updateOffset = function() {}
    ,
    ra.relativeTimeThreshold = function(b, c) {
        return jb[b] !== a && (c === a ? jb[b] : (jb[b] = c,
        !0))
    }
    ,
    ra.lang = e("moment.lang is deprecated. Use moment.locale instead.", function(a, b) {
        return ra.locale(a, b)
    }),
    ra.locale = function(a, b) {
        var c;
        return a && (c = "undefined" != typeof b ? ra.defineLocale(a, b) : ra.localeData(a),
        c && (ra.duration._locale = ra._locale = c)),
        ra._locale._abbr
    }
    ,
    ra.defineLocale = function(a, b) {
        return null !== b ? (b.abbr = a,
        Ea[a] || (Ea[a] = new i),
        Ea[a].set(b),
        ra.locale(a),
        Ea[a]) : (delete Ea[a],
        null)
    }
    ,
    ra.langData = e("moment.langData is deprecated. Use moment.localeData instead.", function(a) {
        return ra.localeData(a)
    }),
    ra.localeData = function(a) {
        var b;
        if (a && a._locale && a._locale._abbr && (a = a._locale._abbr),
        !a)
            return ra._locale;
        if (!t(a)) {
            if (b = I(a))
                return b;
            a = [a]
        }
        return H(a)
    }
    ,
    ra.isMoment = function(a) {
        return a instanceof j || null != a && a.hasOwnProperty("_isAMomentObject")
    }
    ,
    ra.isDuration = function(a) {
        return a instanceof k
    }
    ;
    for (ta = ob.length - 1; ta >= 0; --ta)
        y(ob[ta]);
    ra.normalizeUnits = function(a) {
        return w(a)
    }
    ,
    ra.invalid = function(a) {
        var b = ra.utc(NaN);
        return null != a ? l(b._pf, a) : b._pf.userInvalidated = !0,
        b
    }
    ,
    ra.parseZone = function() {
        return ra.apply(null, arguments).parseZone()
    }
    ,
    ra.parseTwoDigitYear = function(a) {
        return z(a) + (z(a) > 68 ? 1900 : 2e3)
    }
    ,
    l(ra.fn = j.prototype, {
        clone: function() {
            return ra(this)
        },
        valueOf: function() {
            return +this._d + 6e4 * (this._offset || 0)
        },
        unix: function() {
            return Math.floor(+this / 1e3)
        },
        toString: function() {
            return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        },
        toDate: function() {
            return this._offset ? new Date((+this)) : this._d
        },
        toISOString: function() {
            var a = ra(this).utc();
            return 0 < a.year() && a.year() <= 9999 ? M(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : M(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        },
        toArray: function() {
            var a = this;
            return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
        },
        isValid: function() {
            return F(this)
        },
        isDSTShifted: function() {
            return !!this._a && (this.isValid() && v(this._a, (this._isUTC ? ra.utc(this._a) : ra(this._a)).toArray()) > 0)
        },
        parsingFlags: function() {
            return l({}, this._pf)
        },
        invalidAt: function() {
            return this._pf.overflow
        },
        utc: function(a) {
            return this.zone(0, a)
        },
        local: function(a) {
            return this._isUTC && (this.zone(0, a),
            this._isUTC = !1,
            a && this.add(this._d.getTimezoneOffset(), "m")),
            this
        },
        format: function(a) {
            var b = M(this, a || ra.defaultFormat);
            return this.localeData().postformat(b)
        },
        add: r(1, "add"),
        subtract: r(-1, "subtract"),
        diff: function(a, b, c) {
            var d, e, f = J(a, this), g = 6e4 * (this.zone() - f.zone());
            return b = w(b),
            "year" === b || "month" === b ? (d = 432e5 * (this.daysInMonth() + f.daysInMonth()),
            e = 12 * (this.year() - f.year()) + (this.month() - f.month()),
            e += (this - ra(this).startOf("month") - (f - ra(f).startOf("month"))) / d,
            e -= 6e4 * (this.zone() - ra(this).startOf("month").zone() - (f.zone() - ra(f).startOf("month").zone())) / d,
            "year" === b && (e /= 12)) : (d = this - f,
            e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d),
            c ? e : n(e)
        },
        from: function(a, b) {
            return ra.duration({
                to: this,
                from: a
            }).locale(this.locale()).humanize(!b)
        },
        fromNow: function(a) {
            return this.from(ra(), a)
        },
        calendar: function(a) {
            var b = a || ra()
              , c = J(b, this).startOf("day")
              , d = this.diff(c, "days", !0)
              , e = d < -6 ? "sameElse" : d < -1 ? "lastWeek" : d < 0 ? "lastDay" : d < 1 ? "sameDay" : d < 2 ? "nextDay" : d < 7 ? "nextWeek" : "sameElse";
            return this.format(this.localeData().calendar(e, this))
        },
        isLeapYear: function() {
            return D(this.year())
        },
        isDST: function() {
            return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
        },
        day: function(a) {
            var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != a ? (a = ca(a, this.localeData()),
            this.add(a - b, "d")) : b
        },
        month: ma("Month", !0),
        startOf: function(a) {
            switch (a = w(a)) {
            case "year":
                this.month(0);
            case "quarter":
            case "month":
                this.date(1);
            case "week":
            case "isoWeek":
            case "day":
                this.hours(0);
            case "hour":
                this.minutes(0);
            case "minute":
                this.seconds(0);
            case "second":
                this.milliseconds(0)
            }
            return "week" === a ? this.weekday(0) : "isoWeek" === a && this.isoWeekday(1),
            "quarter" === a && this.month(3 * Math.floor(this.month() / 3)),
            this
        },
        endOf: function(a) {
            return a = w(a),
            this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms")
        },
        isAfter: function(a, b) {
            return b = "undefined" != typeof b ? b : "millisecond",
            +this.clone().startOf(b) > +ra(a).startOf(b)
        },
        isBefore: function(a, b) {
            return b = "undefined" != typeof b ? b : "millisecond",
            +this.clone().startOf(b) < +ra(a).startOf(b)
        },
        isSame: function(a, b) {
            return b = b || "ms",
            +this.clone().startOf(b) === +J(a, this).startOf(b)
        },
        min: e("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function(a) {
            return a = ra.apply(null, arguments),
            a < this ? this : a
        }),
        max: e("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function(a) {
            return a = ra.apply(null, arguments),
            a > this ? this : a
        }),
        zone: function(a, b) {
            var c, d = this._offset || 0;
            return null == a ? this._isUTC ? d : this._d.getTimezoneOffset() : ("string" == typeof a && (a = P(a)),
            Math.abs(a) < 16 && (a = 60 * a),
            !this._isUTC && b && (c = this._d.getTimezoneOffset()),
            this._offset = a,
            this._isUTC = !0,
            null != c && this.subtract(c, "m"),
            d !== a && (!b || this._changeInProgress ? s(this, ra.duration(d - a, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0,
            ra.updateOffset(this, !0),
            this._changeInProgress = null)),
            this)
        },
        zoneAbbr: function() {
            return this._isUTC ? "UTC" : ""
        },
        zoneName: function() {
            return this._isUTC ? "Coordinated Universal Time" : ""
        },
        parseZone: function() {
            return this._tzm ? this.zone(this._tzm) : "string" == typeof this._i && this.zone(this._i),
            this
        },
        hasAlignedHourOffset: function(a) {
            return a = a ? ra(a).zone() : 0,
            (this.zone() - a) % 60 === 0
        },
        daysInMonth: function() {
            return A(this.year(), this.month())
        },
        dayOfYear: function(a) {
            var b = wa((ra(this).startOf("day") - ra(this).startOf("year")) / 864e5) + 1;
            return null == a ? b : this.add(a - b, "d")
        },
        quarter: function(a) {
            return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
        },
        weekYear: function(a) {
            var b = fa(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return null == a ? b : this.add(a - b, "y")
        },
        isoWeekYear: function(a) {
            var b = fa(this, 1, 4).year;
            return null == a ? b : this.add(a - b, "y")
        },
        week: function(a) {
            var b = this.localeData().week(this);
            return null == a ? b : this.add(7 * (a - b), "d")
        },
        isoWeek: function(a) {
            var b = fa(this, 1, 4).week;
            return null == a ? b : this.add(7 * (a - b), "d")
        },
        weekday: function(a) {
            var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return null == a ? b : this.add(a - b, "d")
        },
        isoWeekday: function(a) {
            return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
        },
        isoWeeksInYear: function() {
            return B(this.year(), 1, 4)
        },
        weeksInYear: function() {
            var a = this.localeData()._week;
            return B(this.year(), a.dow, a.doy)
        },
        get: function(a) {
            return a = w(a),
            this[a]()
        },
        set: function(a, b) {
            return a = w(a),
            "function" == typeof this[a] && this[a](b),
            this
        },
        locale: function(b) {
            return b === a ? this._locale._abbr : (this._locale = ra.localeData(b),
            this)
        },
        lang: e("moment().lang() is deprecated. Use moment().localeData() instead.", function(b) {
            return b === a ? this.localeData() : (this._locale = ra.localeData(b),
            this)
        }),
        localeData: function() {
            return this._locale
        }
    }),
    ra.fn.millisecond = ra.fn.milliseconds = ma("Milliseconds", !1),
    ra.fn.second = ra.fn.seconds = ma("Seconds", !1),
    ra.fn.minute = ra.fn.minutes = ma("Minutes", !1),
    ra.fn.hour = ra.fn.hours = ma("Hours", !0),
    ra.fn.date = ma("Date", !0),
    ra.fn.dates = e("dates accessor is deprecated. Use date instead.", ma("Date", !0)),
    ra.fn.year = ma("FullYear", !0),
    ra.fn.years = e("years accessor is deprecated. Use year instead.", ma("FullYear", !0)),
    ra.fn.days = ra.fn.day,
    ra.fn.months = ra.fn.month,
    ra.fn.weeks = ra.fn.week,
    ra.fn.isoWeeks = ra.fn.isoWeek,
    ra.fn.quarters = ra.fn.quarter,
    ra.fn.toJSON = ra.fn.toISOString,
    l(ra.duration.fn = k.prototype, {
        _bubble: function() {
            var a, b, c, d = this._milliseconds, e = this._days, f = this._months, g = this._data, h = 0;
            g.milliseconds = d % 1e3,
            a = n(d / 1e3),
            g.seconds = a % 60,
            b = n(a / 60),
            g.minutes = b % 60,
            c = n(b / 60),
            g.hours = c % 24,
            e += n(c / 24),
            h = n(na(e)),
            e -= n(oa(h)),
            f += n(e / 30),
            e %= 30,
            h += n(f / 12),
            f %= 12,
            g.days = e,
            g.months = f,
            g.years = h
        },
        abs: function() {
            return this._milliseconds = Math.abs(this._milliseconds),
            this._days = Math.abs(this._days),
            this._months = Math.abs(this._months),
            this._data.milliseconds = Math.abs(this._data.milliseconds),
            this._data.seconds = Math.abs(this._data.seconds),
            this._data.minutes = Math.abs(this._data.minutes),
            this._data.hours = Math.abs(this._data.hours),
            this._data.months = Math.abs(this._data.months),
            this._data.years = Math.abs(this._data.years),
            this
        },
        weeks: function() {
            return n(this.days() / 7)
        },
        valueOf: function() {
            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * z(this._months / 12)
        },
        humanize: function(a) {
            var b = ea(this, !a, this.localeData());
            return a && (b = this.localeData().pastFuture(+this, b)),
            this.localeData().postformat(b)
        },
        add: function(a, b) {
            var c = ra.duration(a, b);
            return this._milliseconds += c._milliseconds,
            this._days += c._days,
            this._months += c._months,
            this._bubble(),
            this
        },
        subtract: function(a, b) {
            var c = ra.duration(a, b);
            return this._milliseconds -= c._milliseconds,
            this._days -= c._days,
            this._months -= c._months,
            this._bubble(),
            this
        },
        get: function(a) {
            return a = w(a),
            this[a.toLowerCase() + "s"]()
        },
        as: function(a) {
            var b, c;
            if (a = w(a),
            b = this._days + this._milliseconds / 864e5,
            "month" === a || "year" === a)
                return c = this._months + 12 * na(b),
                "month" === a ? c : c / 12;
            switch (b += oa(this._months / 12),
            a) {
            case "week":
                return b / 7;
            case "day":
                return b;
            case "hour":
                return 24 * b;
            case "minute":
                return 24 * b * 60;
            case "second":
                return 24 * b * 60 * 60;
            case "millisecond":
                return 24 * b * 60 * 60 * 1e3;
            default:
                throw new Error("Unknown unit " + a)
            }
        },
        lang: ra.fn.lang,
        locale: ra.fn.locale,
        toIsoString: e("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", function() {
            return this.toISOString()
        }),
        toISOString: function() {
            var a = Math.abs(this.years())
              , b = Math.abs(this.months())
              , c = Math.abs(this.days())
              , d = Math.abs(this.hours())
              , e = Math.abs(this.minutes())
              , f = Math.abs(this.seconds() + this.milliseconds() / 1e3);
            return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D"
        },
        localeData: function() {
            return this._locale
        }
    });
    for (ta in fb)
        fb.hasOwnProperty(ta) && pa(ta.toLowerCase());
    ra.duration.fn.asMilliseconds = function() {
        return this.as("ms")
    }
    ,
    ra.duration.fn.asSeconds = function() {
        return this.as("s")
    }
    ,
    ra.duration.fn.asMinutes = function() {
        return this.as("m")
    }
    ,
    ra.duration.fn.asHours = function() {
        return this.as("h")
    }
    ,
    ra.duration.fn.asDays = function() {
        return this.as("d")
    }
    ,
    ra.duration.fn.asWeeks = function() {
        return this.as("weeks")
    }
    ,
    ra.duration.fn.asMonths = function() {
        return this.as("M")
    }
    ,
    ra.duration.fn.asYears = function() {
        return this.as("y")
    }
    ,
    ra.locale("en", {
        ordinal: function(a) {
            var b = a % 10
              , c = 1 === z(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }),
    Ga ? module.exports = ra : "function" == typeof define && define.amd ? (define("moment", ["require", "exports", "module"], function(a, b, c) {
        return c.config && c.config() && c.config().noGlobal === !0 && (va.moment = sa),
        ra
    }),
    qa(!0)) : qa()
}
.call(this),
function(a, b) {
    "use strict";
    "object" == typeof module && module.exports && "function" == typeof require ? module.exports = b() : "function" == typeof define && "object" == typeof define.amd ? define("loglevel", b) : a.log = b()
}(this, function() {
    "use strict";
    function a(a) {
        return typeof console !== h && (void 0 !== console[a] ? b(console, a) : void 0 !== console.log ? b(console, "log") : g)
    }
    function b(a, b) {
        var c = a[b];
        if ("function" == typeof c.bind)
            return c.bind(a);
        try {
            return Function.prototype.bind.call(c, a)
        } catch (d) {
            return function() {
                return Function.prototype.apply.apply(c, [a, arguments])
            }
        }
    }
    function c(a, b, c) {
        return function() {
            typeof console !== h && (d.call(this, b, c),
            this[a].apply(this, arguments))
        }
    }
    function d(a, b) {
        for (var c = 0; c < i.length; c++) {
            var d = i[c];
            this[d] = c < a ? g : this.methodFactory(d, a, b)
        }
    }
    function e(b, d, e) {
        return a(b) || c.apply(this, arguments)
    }
    function f(a, b, c) {
        function f(a) {
            var b = (i[a] || "silent").toUpperCase();
            try {
                return void (window.localStorage[l] = b)
            } catch (c) {}
            try {
                window.document.cookie = encodeURIComponent(l) + "=" + b + ";"
            } catch (c) {}
        }
        function g() {
            var a;
            try {
                a = window.localStorage[l]
            } catch (b) {}
            if (typeof a === h)
                try {
                    var c = window.document.cookie
                      , d = c.indexOf(encodeURIComponent(l) + "=");
                    d && (a = /^([^;]+)/.exec(c.slice(d))[1])
                } catch (b) {}
            return void 0 === k.levels[a] && (a = void 0),
            a
        }
        var j, k = this, l = "loglevel";
        a && (l += ":" + a),
        k.levels = {
            TRACE: 0,
            DEBUG: 1,
            INFO: 2,
            WARN: 3,
            ERROR: 4,
            SILENT: 5
        },
        k.methodFactory = c || e,
        k.getLevel = function() {
            return j
        }
        ,
        k.setLevel = function(b, c) {
            if ("string" == typeof b && void 0 !== k.levels[b.toUpperCase()] && (b = k.levels[b.toUpperCase()]),
            !("number" == typeof b && b >= 0 && b <= k.levels.SILENT))
                throw "log.setLevel() called with invalid level: " + b;
            if (j = b,
            c !== !1 && f(b),
            d.call(k, b, a),
            typeof console === h && b < k.levels.SILENT)
                return "No console available for logging"
        }
        ,
        k.setDefaultLevel = function(a) {
            g() || k.setLevel(a, !1)
        }
        ,
        k.enableAll = function(a) {
            k.setLevel(k.levels.TRACE, a)
        }
        ,
        k.disableAll = function(a) {
            k.setLevel(k.levels.SILENT, a)
        }
        ;
        var m = g();
        null == m && (m = null == b ? "WARN" : b),
        k.setLevel(m, !1)
    }
    var g = function() {}
      , h = "undefined"
      , i = ["trace", "debug", "info", "warn", "error"]
      , j = new f
      , k = {};
    j.getLogger = function(a) {
        if ("string" != typeof a || "" === a)
            throw new TypeError("You must supply a name when creating a logger.");
        var b = k[a];
        return b || (b = k[a] = new f(a,j.getLevel(),j.methodFactory)),
        b
    }
    ;
    var l = typeof window !== h ? window.log : void 0;
    return j.noConflict = function() {
        return typeof window !== h && window.log === j && (window.log = l),
        j
    }
    ,
    j
}),
window.Modernizr = function(a, b, c) {
    function d(a) {
        o.cssText = a
    }
    function e(a, b) {
        return typeof a === b
    }
    var f, g, h, i = "2.6.2", j = {}, k = !0, l = b.documentElement, m = "modernizr", n = b.createElement(m), o = n.style, p = ({}.toString,
    " -webkit- -moz- -o- -ms- ".split(" ")), q = {}, r = [], s = r.slice, t = function(a, c, d, e) {
        var f, g, h, i, j = b.createElement("div"), k = b.body, n = k || b.createElement("body");
        if (parseInt(d, 10))
            for (; d--; )
                h = b.createElement("div"),
                h.id = e ? e[d] : m + (d + 1),
                j.appendChild(h);
        return f = ["&#173;", '<style id="s', m, '">', a, "</style>"].join(""),
        j.id = m,
        (k ? j : n).innerHTML += f,
        n.appendChild(j),
        k || (n.style.background = "",
        n.style.overflow = "hidden",
        i = l.style.overflow,
        l.style.overflow = "hidden",
        l.appendChild(n)),
        g = c(j, a),
        k ? j.parentNode.removeChild(j) : (n.parentNode.removeChild(n),
        l.style.overflow = i),
        !!g
    }, u = {}.hasOwnProperty;
    h = e(u, "undefined") || e(u.call, "undefined") ? function(a, b) {
        return b in a && e(a.constructor.prototype[b], "undefined")
    }
    : function(a, b) {
        return u.call(a, b)
    }
    ,
    Function.prototype.bind || (Function.prototype.bind = function(a) {
        var b = this;
        if ("function" != typeof b)
            throw new TypeError;
        var c = s.call(arguments, 1)
          , d = function() {
            if (this instanceof d) {
                var e = function() {};
                e.prototype = b.prototype;
                var f = new e
                  , g = b.apply(f, c.concat(s.call(arguments)));
                return Object(g) === g ? g : f
            }
            return b.apply(a, c.concat(s.call(arguments)))
        };
        return d
    }
    ),
    q.touch = function() {
        var c;
        return "ontouchstart"in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : t(["@media (", p.join("touch-enabled),("), m, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
            c = 9 === a.offsetTop
        }),
        c
    }
    ,
    q.localstorage = function() {
        try {
            return localStorage.setItem(m, m),
            localStorage.removeItem(m),
            !0
        } catch (a) {
            return !1
        }
    }
    ,
    q.sessionstorage = function() {
        try {
            return sessionStorage.setItem(m, m),
            sessionStorage.removeItem(m),
            !0
        } catch (a) {
            return !1
        }
    }
    ;
    for (var v in q)
        h(q, v) && (g = v.toLowerCase(),
        j[g] = q[v](),
        r.push((j[g] ? "" : "no-") + g));
    return j.addTest = function(a, b) {
        if ("object" == typeof a)
            for (var d in a)
                h(a, d) && j.addTest(d, a[d]);
        else {
            if (a = a.toLowerCase(),
            j[a] !== c)
                return j;
            b = "function" == typeof b ? b() : b,
            "undefined" != typeof k && k && (l.className += " " + (b ? "" : "no-") + a),
            j[a] = b
        }
        return j
    }
    ,
    d(""),
    n = f = null,
    j._version = i,
    j._prefixes = p,
    j.testStyles = t,
    l.className = l.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (k ? " js " + r.join(" ") : ""),
    j
}(this, this.document),
Modernizr.addTest("contenteditable", "contentEditable"in document.documentElement),
define("modernizr", function(a) {
    return function() {
        var b;
        return b || a.Modernizr
    }
}(this)),
function(a, b) {
    "object" == typeof exports && "object" == typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define("handlebars", [], b) : "object" == typeof exports ? exports.Handlebars = b() : a.Handlebars = b()
}(this, function() {
    return function(a) {
        function b(d) {
            if (c[d])
                return c[d].exports;
            var e = c[d] = {
                exports: {},
                id: d,
                loaded: !1
            };
            return a[d].call(e.exports, e, e.exports, b),
            e.loaded = !0,
            e.exports
        }
        var c = {};
        return b.m = a,
        b.c = c,
        b.p = "",
        b(0)
    }([function(a, b, c) {
        "use strict";
        function d() {
            var a = new h.HandlebarsEnvironment;
            return n.extend(a, h),
            a.SafeString = j["default"],
            a.Exception = l["default"],
            a.Utils = n,
            a.escapeExpression = n.escapeExpression,
            a.VM = p,
            a.template = function(b) {
                return p.template(b, a)
            }
            ,
            a
        }
        var e = c(1)["default"]
          , f = c(2)["default"];
        b.__esModule = !0;
        var g = c(3)
          , h = e(g)
          , i = c(17)
          , j = f(i)
          , k = c(5)
          , l = f(k)
          , m = c(4)
          , n = e(m)
          , o = c(18)
          , p = e(o)
          , q = c(19)
          , r = f(q)
          , s = d();
        s.create = d,
        r["default"](s),
        s["default"] = s,
        b["default"] = s,
        a.exports = b["default"]
    }
    , function(a, b) {
        "use strict";
        b["default"] = function(a) {
            if (a && a.__esModule)
                return a;
            var b = {};
            if (null != a)
                for (var c in a)
                    Object.prototype.hasOwnProperty.call(a, c) && (b[c] = a[c]);
            return b["default"] = a,
            b
        }
        ,
        b.__esModule = !0
    }
    , function(a, b) {
        "use strict";
        b["default"] = function(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }
        ,
        b.__esModule = !0
    }
    , function(a, b, c) {
        "use strict";
        function d(a, b, c) {
            this.helpers = a || {},
            this.partials = b || {},
            this.decorators = c || {},
            i.registerDefaultHelpers(this),
            j.registerDefaultDecorators(this)
        }
        var e = c(2)["default"];
        b.__esModule = !0,
        b.HandlebarsEnvironment = d;
        var f = c(4)
          , g = c(5)
          , h = e(g)
          , i = c(6)
          , j = c(14)
          , k = c(16)
          , l = e(k)
          , m = "4.0.5";
        b.VERSION = m;
        var n = 7;
        b.COMPILER_REVISION = n;
        var o = {
            1: "<= 1.0.rc.2",
            2: "== 1.0.0-rc.3",
            3: "== 1.0.0-rc.4",
            4: "== 1.x.x",
            5: "== 2.0.0-alpha.x",
            6: ">= 2.0.0-beta.1",
            7: ">= 4.0.0"
        };
        b.REVISION_CHANGES = o;
        var p = "[object Object]";
        d.prototype = {
            constructor: d,
            logger: l["default"],
            log: l["default"].log,
            registerHelper: function(a, b) {
                if (f.toString.call(a) === p) {
                    if (b)
                        throw new h["default"]("Arg not supported with multiple helpers");
                    f.extend(this.helpers, a)
                } else
                    this.helpers[a] = b
            },
            unregisterHelper: function(a) {
                delete this.helpers[a]
            },
            registerPartial: function(a, b) {
                if (f.toString.call(a) === p)
                    f.extend(this.partials, a);
                else {
                    if ("undefined" == typeof b)
                        throw new h["default"]('Attempting to register a partial called "' + a + '" as undefined');
                    this.partials[a] = b
                }
            },
            unregisterPartial: function(a) {
                delete this.partials[a]
            },
            registerDecorator: function(a, b) {
                if (f.toString.call(a) === p) {
                    if (b)
                        throw new h["default"]("Arg not supported with multiple decorators");
                    f.extend(this.decorators, a)
                } else
                    this.decorators[a] = b
            },
            unregisterDecorator: function(a) {
                delete this.decorators[a]
            }
        };
        var q = l["default"].log;
        b.log = q,
        b.createFrame = f.createFrame,
        b.logger = l["default"]
    }
    , function(a, b) {
        "use strict";
        function c(a) {
            return k[a]
        }
        function d(a) {
            for (var b = 1; b < arguments.length; b++)
                for (var c in arguments[b])
                    Object.prototype.hasOwnProperty.call(arguments[b], c) && (a[c] = arguments[b][c]);
            return a
        }
        function e(a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] === b)
                    return c;
            return -1
        }
        function f(a) {
            if ("string" != typeof a) {
                if (a && a.toHTML)
                    return a.toHTML();
                if (null == a)
                    return "";
                if (!a)
                    return a + "";
                a = "" + a
            }
            return m.test(a) ? a.replace(l, c) : a
        }
        function g(a) {
            return !a && 0 !== a || !(!p(a) || 0 !== a.length)
        }
        function h(a) {
            var b = d({}, a);
            return b._parent = a,
            b
        }
        function i(a, b) {
            return a.path = b,
            a
        }
        function j(a, b) {
            return (a ? a + "." : "") + b
        }
        b.__esModule = !0,
        b.extend = d,
        b.indexOf = e,
        b.escapeExpression = f,
        b.isEmpty = g,
        b.createFrame = h,
        b.blockParams = i,
        b.appendContextPath = j;
        var k = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;",
            "=": "&#x3D;"
        }
          , l = /[&<>"'`=]/g
          , m = /[&<>"'`=]/
          , n = Object.prototype.toString;
        b.toString = n;
        var o = function(a) {
            return "function" == typeof a
        };
        o(/x/) && (b.isFunction = o = function(a) {
            return "function" == typeof a && "[object Function]" === n.call(a)
        }
        ),
        b.isFunction = o;
        var p = Array.isArray || function(a) {
            return !(!a || "object" != typeof a) && "[object Array]" === n.call(a)
        }
        ;
        b.isArray = p
    }
    , function(a, b) {
        "use strict";
        function c(a, b) {
            var e = b && b.loc
              , f = void 0
              , g = void 0;
            e && (f = e.start.line,
            g = e.start.column,
            a += " - " + f + ":" + g);
            for (var h = Error.prototype.constructor.call(this, a), i = 0; i < d.length; i++)
                this[d[i]] = h[d[i]];
            Error.captureStackTrace && Error.captureStackTrace(this, c),
            e && (this.lineNumber = f,
            this.column = g)
        }
        b.__esModule = !0;
        var d = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
        c.prototype = new Error,
        b["default"] = c,
        a.exports = b["default"]
    }
    , function(a, b, c) {
        "use strict";
        function d(a) {
            g["default"](a),
            i["default"](a),
            k["default"](a),
            m["default"](a),
            o["default"](a),
            q["default"](a),
            s["default"](a)
        }
        var e = c(2)["default"];
        b.__esModule = !0,
        b.registerDefaultHelpers = d;
        var f = c(7)
          , g = e(f)
          , h = c(8)
          , i = e(h)
          , j = c(9)
          , k = e(j)
          , l = c(10)
          , m = e(l)
          , n = c(11)
          , o = e(n)
          , p = c(12)
          , q = e(p)
          , r = c(13)
          , s = e(r)
    }
    , function(a, b, c) {
        "use strict";
        b.__esModule = !0;
        var d = c(4);
        b["default"] = function(a) {
            a.registerHelper("blockHelperMissing", function(b, c) {
                var e = c.inverse
                  , f = c.fn;
                if (b === !0)
                    return f(this);
                if (b === !1 || null == b)
                    return e(this);
                if (d.isArray(b))
                    return b.length > 0 ? (c.ids && (c.ids = [c.name]),
                    a.helpers.each(b, c)) : e(this);
                if (c.data && c.ids) {
                    var g = d.createFrame(c.data);
                    g.contextPath = d.appendContextPath(c.data.contextPath, c.name),
                    c = {
                        data: g
                    }
                }
                return f(b, c)
            })
        }
        ,
        a.exports = b["default"]
    }
    , function(a, b, c) {
        "use strict";
        var d = c(2)["default"];
        b.__esModule = !0;
        var e = c(4)
          , f = c(5)
          , g = d(f);
        b["default"] = function(a) {
            a.registerHelper("each", function(a, b) {
                function c(b, c, f) {
                    j && (j.key = b,
                    j.index = c,
                    j.first = 0 === c,
                    j.last = !!f,
                    k && (j.contextPath = k + b)),
                    i += d(a[b], {
                        data: j,
                        blockParams: e.blockParams([a[b], b], [k + b, null])
                    })
                }
                if (!b)
                    throw new g["default"]("Must pass iterator to #each");
                var d = b.fn
                  , f = b.inverse
                  , h = 0
                  , i = ""
                  , j = void 0
                  , k = void 0;
                if (b.data && b.ids && (k = e.appendContextPath(b.data.contextPath, b.ids[0]) + "."),
                e.isFunction(a) && (a = a.call(this)),
                b.data && (j = e.createFrame(b.data)),
                a && "object" == typeof a)
                    if (e.isArray(a))
                        for (var l = a.length; h < l; h++)
                            h in a && c(h, h, h === a.length - 1);
                    else {
                        var m = void 0;
                        for (var n in a)
                            a.hasOwnProperty(n) && (void 0 !== m && c(m, h - 1),
                            m = n,
                            h++);
                        void 0 !== m && c(m, h - 1, !0)
                    }
                return 0 === h && (i = f(this)),
                i
            })
        }
        ,
        a.exports = b["default"]
    }
    , function(a, b, c) {
        "use strict";
        var d = c(2)["default"];
        b.__esModule = !0;
        var e = c(5)
          , f = d(e);
        b["default"] = function(a) {
            a.registerHelper("helperMissing", function() {
                if (1 !== arguments.length)
                    throw new f["default"]('Missing helper: "' + arguments[arguments.length - 1].name + '"')
            })
        }
        ,
        a.exports = b["default"]
    }
    , function(a, b, c) {
        "use strict";
        b.__esModule = !0;
        var d = c(4);
        b["default"] = function(a) {
            a.registerHelper("if", function(a, b) {
                return d.isFunction(a) && (a = a.call(this)),
                !b.hash.includeZero && !a || d.isEmpty(a) ? b.inverse(this) : b.fn(this)
            }),
            a.registerHelper("unless", function(b, c) {
                return a.helpers["if"].call(this, b, {
                    fn: c.inverse,
                    inverse: c.fn,
                    hash: c.hash
                })
            })
        }
        ,
        a.exports = b["default"];
    }
    , function(a, b) {
        "use strict";
        b.__esModule = !0,
        b["default"] = function(a) {
            a.registerHelper("log", function() {
                for (var b = [void 0], c = arguments[arguments.length - 1], d = 0; d < arguments.length - 1; d++)
                    b.push(arguments[d]);
                var e = 1;
                null != c.hash.level ? e = c.hash.level : c.data && null != c.data.level && (e = c.data.level),
                b[0] = e,
                a.log.apply(a, b)
            })
        }
        ,
        a.exports = b["default"]
    }
    , function(a, b) {
        "use strict";
        b.__esModule = !0,
        b["default"] = function(a) {
            a.registerHelper("lookup", function(a, b) {
                return a && a[b]
            })
        }
        ,
        a.exports = b["default"]
    }
    , function(a, b, c) {
        "use strict";
        b.__esModule = !0;
        var d = c(4);
        b["default"] = function(a) {
            a.registerHelper("with", function(a, b) {
                d.isFunction(a) && (a = a.call(this));
                var c = b.fn;
                if (d.isEmpty(a))
                    return b.inverse(this);
                var e = b.data;
                return b.data && b.ids && (e = d.createFrame(b.data),
                e.contextPath = d.appendContextPath(b.data.contextPath, b.ids[0])),
                c(a, {
                    data: e,
                    blockParams: d.blockParams([a], [e && e.contextPath])
                })
            })
        }
        ,
        a.exports = b["default"]
    }
    , function(a, b, c) {
        "use strict";
        function d(a) {
            g["default"](a)
        }
        var e = c(2)["default"];
        b.__esModule = !0,
        b.registerDefaultDecorators = d;
        var f = c(15)
          , g = e(f)
    }
    , function(a, b, c) {
        "use strict";
        b.__esModule = !0;
        var d = c(4);
        b["default"] = function(a) {
            a.registerDecorator("inline", function(a, b, c, e) {
                var f = a;
                return b.partials || (b.partials = {},
                f = function(e, f) {
                    var g = c.partials;
                    c.partials = d.extend({}, g, b.partials);
                    var h = a(e, f);
                    return c.partials = g,
                    h
                }
                ),
                b.partials[e.args[0]] = e.fn,
                f
            })
        }
        ,
        a.exports = b["default"]
    }
    , function(a, b, c) {
        "use strict";
        b.__esModule = !0;
        var d = c(4)
          , e = {
            methodMap: ["debug", "info", "warn", "error"],
            level: "info",
            lookupLevel: function(a) {
                if ("string" == typeof a) {
                    var b = d.indexOf(e.methodMap, a.toLowerCase());
                    a = b >= 0 ? b : parseInt(a, 10)
                }
                return a
            },
            log: function(a) {
                if (a = e.lookupLevel(a),
                "undefined" != typeof console && e.lookupLevel(e.level) <= a) {
                    var b = e.methodMap[a];
                    console[b] || (b = "log");
                    for (var c = arguments.length, d = Array(c > 1 ? c - 1 : 0), f = 1; f < c; f++)
                        d[f - 1] = arguments[f];
                    console[b].apply(console, d)
                }
            }
        };
        b["default"] = e,
        a.exports = b["default"]
    }
    , function(a, b) {
        "use strict";
        function c(a) {
            this.string = a
        }
        b.__esModule = !0,
        c.prototype.toString = c.prototype.toHTML = function() {
            return "" + this.string
        }
        ,
        b["default"] = c,
        a.exports = b["default"]
    }
    , function(a, b, c) {
        "use strict";
        function d(a) {
            var b = a && a[0] || 1
              , c = r.COMPILER_REVISION;
            if (b !== c) {
                if (b < c) {
                    var d = r.REVISION_CHANGES[c]
                      , e = r.REVISION_CHANGES[b];
                    throw new q["default"]("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + d + ") or downgrade your runtime to an older version (" + e + ").")
                }
                throw new q["default"]("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + a[1] + ").")
            }
        }
        function e(a, b) {
            function c(c, d, e) {
                e.hash && (d = o.extend({}, d, e.hash),
                e.ids && (e.ids[0] = !0)),
                c = b.VM.resolvePartial.call(this, c, d, e);
                var f = b.VM.invokePartial.call(this, c, d, e);
                if (null == f && b.compile && (e.partials[e.name] = b.compile(c, a.compilerOptions, b),
                f = e.partials[e.name](d, e)),
                null != f) {
                    if (e.indent) {
                        for (var g = f.split("\n"), h = 0, i = g.length; h < i && (g[h] || h + 1 !== i); h++)
                            g[h] = e.indent + g[h];
                        f = g.join("\n")
                    }
                    return f
                }
                throw new q["default"]("The partial " + e.name + " could not be compiled when running in runtime-only mode")
            }
            function d(b) {
                function c(b) {
                    return "" + a.main(e, b, e.helpers, e.partials, g, i, h)
                }
                var f = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1]
                  , g = f.data;
                d._setup(f),
                !f.partial && a.useData && (g = j(b, g));
                var h = void 0
                  , i = a.useBlockParams ? [] : void 0;
                return a.useDepths && (h = f.depths ? b !== f.depths[0] ? [b].concat(f.depths) : f.depths : [b]),
                (c = k(a.main, c, e, f.depths || [], g, i))(b, f)
            }
            if (!b)
                throw new q["default"]("No environment passed to template");
            if (!a || !a.main)
                throw new q["default"]("Unknown template object: " + typeof a);
            a.main.decorator = a.main_d,
            b.VM.checkRevision(a.compiler);
            var e = {
                strict: function(a, b) {
                    if (!(b in a))
                        throw new q["default"]('"' + b + '" not defined in ' + a);
                    return a[b]
                },
                lookup: function(a, b) {
                    for (var c = a.length, d = 0; d < c; d++)
                        if (a[d] && null != a[d][b])
                            return a[d][b]
                },
                lambda: function(a, b) {
                    return "function" == typeof a ? a.call(b) : a
                },
                escapeExpression: o.escapeExpression,
                invokePartial: c,
                fn: function(b) {
                    var c = a[b];
                    return c.decorator = a[b + "_d"],
                    c
                },
                programs: [],
                program: function(a, b, c, d, e) {
                    var g = this.programs[a]
                      , h = this.fn(a);
                    return b || e || d || c ? g = f(this, a, h, b, c, d, e) : g || (g = this.programs[a] = f(this, a, h)),
                    g
                },
                data: function(a, b) {
                    for (; a && b--; )
                        a = a._parent;
                    return a
                },
                merge: function(a, b) {
                    var c = a || b;
                    return a && b && a !== b && (c = o.extend({}, b, a)),
                    c
                },
                noop: b.VM.noop,
                compilerInfo: a.compiler
            };
            return d.isTop = !0,
            d._setup = function(c) {
                c.partial ? (e.helpers = c.helpers,
                e.partials = c.partials,
                e.decorators = c.decorators) : (e.helpers = e.merge(c.helpers, b.helpers),
                a.usePartial && (e.partials = e.merge(c.partials, b.partials)),
                (a.usePartial || a.useDecorators) && (e.decorators = e.merge(c.decorators, b.decorators)))
            }
            ,
            d._child = function(b, c, d, g) {
                if (a.useBlockParams && !d)
                    throw new q["default"]("must pass block params");
                if (a.useDepths && !g)
                    throw new q["default"]("must pass parent depths");
                return f(e, b, a[b], c, 0, d, g)
            }
            ,
            d
        }
        function f(a, b, c, d, e, f, g) {
            function h(b) {
                var e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1]
                  , h = g;
                return g && b !== g[0] && (h = [b].concat(g)),
                c(a, b, a.helpers, a.partials, e.data || d, f && [e.blockParams].concat(f), h)
            }
            return h = k(c, h, a, g, d, f),
            h.program = b,
            h.depth = g ? g.length : 0,
            h.blockParams = e || 0,
            h
        }
        function g(a, b, c) {
            return a ? a.call || c.name || (c.name = a,
            a = c.partials[a]) : a = "@partial-block" === c.name ? c.data["partial-block"] : c.partials[c.name],
            a
        }
        function h(a, b, c) {
            c.partial = !0,
            c.ids && (c.data.contextPath = c.ids[0] || c.data.contextPath);
            var d = void 0;
            if (c.fn && c.fn !== i && (c.data = r.createFrame(c.data),
            d = c.data["partial-block"] = c.fn,
            d.partials && (c.partials = o.extend({}, c.partials, d.partials))),
            void 0 === a && d && (a = d),
            void 0 === a)
                throw new q["default"]("The partial " + c.name + " could not be found");
            if (a instanceof Function)
                return a(b, c)
        }
        function i() {
            return ""
        }
        function j(a, b) {
            return b && "root"in b || (b = b ? r.createFrame(b) : {},
            b.root = a),
            b
        }
        function k(a, b, c, d, e, f) {
            if (a.decorator) {
                var g = {};
                b = a.decorator(b, g, c, d && d[0], e, f, d),
                o.extend(b, g)
            }
            return b
        }
        var l = c(1)["default"]
          , m = c(2)["default"];
        b.__esModule = !0,
        b.checkRevision = d,
        b.template = e,
        b.wrapProgram = f,
        b.resolvePartial = g,
        b.invokePartial = h,
        b.noop = i;
        var n = c(4)
          , o = l(n)
          , p = c(5)
          , q = m(p)
          , r = c(3)
    }
    , function(a, b) {
        (function(c) {
            "use strict";
            b.__esModule = !0,
            b["default"] = function(a) {
                var b = "undefined" != typeof c ? c : window
                  , d = b.Handlebars;
                a.noConflict = function() {
                    return b.Handlebars === a && (b.Handlebars = d),
                    a
                }
            }
            ,
            a.exports = b["default"]
        }
        ).call(b, function() {
            return this
        }())
    }
    ])
}),
function(a, b) {
    "use strict";
    function c(a, b) {
        var c, d;
        b = b || {},
        a = "raven" + a.substr(0, 1).toUpperCase() + a.substr(1),
        document.createEvent ? (c = document.createEvent("HTMLEvents"),
        c.initEvent(a, !0, !0)) : (c = document.createEventObject(),
        c.eventType = a);
        for (d in b)
            l(b, d) && (c[d] = b[d]);
        if (document.createEvent)
            document.dispatchEvent(c);
        else
            try {
                document.fireEvent("on" + c.eventType.toLowerCase(), c)
            } catch (e) {}
    }
    function d(a) {
        this.name = "RavenConfigError",
        this.message = a
    }
    function e(a) {
        var b = Y.exec(a)
          , c = {}
          , e = 7;
        try {
            for (; e--; )
                c[X[e]] = b[e] || ""
        } catch (f) {
            throw new d("Invalid DSN: " + a)
        }
        if (c.pass)
            throw new d("Do not specify your private key in the DSN!");
        return c
    }
    function f(a) {
        return void 0 === a
    }
    function g(a) {
        return "function" == typeof a
    }
    function h(a) {
        return "[object String]" === R.toString.call(a)
    }
    function i(a) {
        return "object" == typeof a && null !== a
    }
    function j(a) {
        for (var b in a)
            return !1;
        return !0
    }
    function k(a) {
        return i(a) && "[object Error]" === R.toString.call(a) || a instanceof Error
    }
    function l(a, b) {
        return R.hasOwnProperty.call(a, b)
    }
    function m(a, b) {
        var c, d;
        if (f(a.length))
            for (c in a)
                l(a, c) && b.call(null, c, a[c]);
        else if (d = a.length)
            for (c = 0; c < d; c++)
                b.call(null, c, a[c])
    }
    function n(a, b) {
        var d = [];
        a.stack && a.stack.length && m(a.stack, function(a, b) {
            var c = o(b);
            c && d.push(c)
        }),
        c("handle", {
            stackInfo: a,
            options: b
        }),
        q(a.name, a.message, a.url, a.lineno, d, b)
    }
    function o(a) {
        if (a.url) {
            var b, c = {
                filename: a.url,
                lineno: a.line,
                colno: a.column,
                "function": a.func || "?"
            }, d = p(a);
            if (d) {
                var e = ["pre_context", "context_line", "post_context"];
                for (b = 3; b--; )
                    c[e[b]] = d[b]
            }
            return c.in_app = !(P.includePaths.test && !P.includePaths.test(c.filename) || /(Raven|TraceKit)\./.test(c["function"]) || /raven\.(min\.)?js$/.test(c.filename)),
            c
        }
    }
    function p(a) {
        if (a.context && P.fetchContext) {
            for (var b = a.context, c = ~~(b.length / 2), d = b.length, e = !1; d--; )
                if (b[d].length > 300) {
                    e = !0;
                    break
                }
            if (e) {
                if (f(a.column))
                    return;
                return [[], b[c].substr(a.column, 50), []]
            }
            return [b.slice(0, c), b[c], b.slice(c + 1)]
        }
    }
    function q(a, b, c, d, e, f) {
        var g, h;
        P.ignoreErrors.test && P.ignoreErrors.test(b) || (b += "",
        b = s(b, P.maxMessageLength),
        h = a + ": " + b,
        h = s(h, P.maxMessageLength),
        e && e.length ? (c = e[0].filename || c,
        e.reverse(),
        g = {
            frames: e
        }) : c && (g = {
            frames: [{
                filename: c,
                lineno: d,
                in_app: !0
            }]
        }),
        P.ignoreUrls.test && P.ignoreUrls.test(c) || P.whitelistUrls.test && !P.whitelistUrls.test(c) || v(r({
            exception: {
                type: a,
                value: b
            },
            stacktrace: g,
            culprit: c,
            message: h
        }, f)))
    }
    function r(a, b) {
        return b ? (m(b, function(b, c) {
            a[b] = c
        }),
        a) : a
    }
    function s(a, b) {
        return a.length <= b ? a : a.substr(0, b) + "…"
    }
    function t() {
        return +new Date
    }
    function u() {
        if (document.location && document.location.href) {
            var a = {
                headers: {
                    "User-Agent": navigator.userAgent
                }
            };
            return a.url = document.location.href,
            document.referrer && (a.headers.Referer = document.referrer),
            a
        }
    }
    function v(a) {
        var b = {
            project: M,
            logger: P.logger,
            platform: "javascript"
        }
          , d = u();
        d && (b.request = d),
        a = r(b, a),
        a.tags = r(r({}, P.tags), a.tags),
        a.extra = r(r({}, P.extra), a.extra),
        a.extra = r({
            "session:duration": t() - U
        }, a.extra),
        j(a.tags) && delete a.tags,
        K && (a.user = K),
        P.release && (a.release = P.release),
        g(P.dataCallback) && (a = P.dataCallback(a) || a),
        a && !j(a) && (g(P.shouldSendCallback) && !P.shouldSendCallback(a) || (I = a.event_id || (a.event_id = A()),
        B("debug", "Raven about to send:", a),
        y() && (P.transport || w)({
            url: J,
            auth: {
                sentry_version: "4",
                sentry_client: "raven-js/" + W.VERSION,
                sentry_key: L
            },
            data: a,
            options: P,
            onSuccess: function() {
                c("success", {
                    data: a,
                    src: J
                })
            },
            onError: function() {
                c("failure", {
                    data: a,
                    src: J
                })
            }
        })))
    }
    function w(a) {
        a.auth.sentry_data = JSON.stringify(a.data);
        var b = x()
          , c = a.url + "?" + D(a.auth);
        (a.options.crossOrigin || "" === a.options.crossOrigin) && (b.crossOrigin = a.options.crossOrigin),
        b.onload = a.onSuccess,
        b.onerror = b.onabort = a.onError,
        b.src = c
    }
    function x() {
        return document.createElement("img")
    }
    function y() {
        return !!O && (!!J || (Z || B("error", "Error: Raven has not been configured."),
        Z = !0,
        !1))
    }
    function z(a) {
        for (var b, c = [], d = 0, e = a.length; d < e; d++)
            b = a[d],
            h(b) ? c.push(b.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")) : b && b.source && c.push(b.source);
        return new RegExp(c.join("|"),"i")
    }
    function A() {
        var b = a.crypto || a.msCrypto;
        if (!f(b) && b.getRandomValues) {
            var c = new Uint16Array(8);
            b.getRandomValues(c),
            c[3] = 4095 & c[3] | 16384,
            c[4] = 16383 & c[4] | 32768;
            var d = function(a) {
                for (var b = a.toString(16); b.length < 4; )
                    b = "0" + b;
                return b
            };
            return d(c[0]) + d(c[1]) + d(c[2]) + d(c[3]) + d(c[4]) + d(c[5]) + d(c[6]) + d(c[7])
        }
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(a) {
            var b = 16 * Math.random() | 0
              , c = "x" == a ? b : 3 & b | 8;
            return c.toString(16)
        })
    }
    function B(a) {
        T[a] && W.debug && T[a].apply(S, F.call(arguments, 1))
    }
    function C() {
        var b = a.RavenConfig;
        b && W.config(b.dsn, b.config).install()
    }
    function D(a) {
        var b = [];
        return m(a, function(a, c) {
            b.push(encodeURIComponent(a) + "=" + encodeURIComponent(c))
        }),
        b.join("&")
    }
    var E = {
        remoteFetching: !1,
        collectWindowErrors: !0,
        linesOfContext: 7,
        debug: !1
    }
      , F = [].slice
      , G = "?";
    E.wrap = function(a) {
        function b() {
            try {
                return a.apply(this, arguments)
            } catch (b) {
                throw E.report(b),
                b
            }
        }
        return b
    }
    ,
    E.report = function() {
        function c(a) {
            h(),
            o.push(a)
        }
        function d(a) {
            for (var b = o.length - 1; b >= 0; --b)
                o[b] === a && o.splice(b, 1)
        }
        function e() {
            i(),
            o = []
        }
        function f(a, b) {
            var c = null;
            if (!b || E.collectWindowErrors) {
                for (var d in o)
                    if (l(o, d))
                        try {
                            o[d].apply(null, [a].concat(F.call(arguments, 2)))
                        } catch (e) {
                            c = e
                        }
                if (c)
                    throw c
            }
        }
        function g(a, b, c, d, e) {
            var g = null;
            if (r)
                E.computeStackTrace.augmentStackTraceWithInitialElement(r, b, c, a),
                j();
            else if (e)
                g = E.computeStackTrace(e),
                f(g, !0);
            else {
                var h = {
                    url: b,
                    line: c,
                    column: d
                };
                h.func = E.computeStackTrace.guessFunctionName(h.url, h.line),
                h.context = E.computeStackTrace.gatherContext(h.url, h.line),
                g = {
                    message: a,
                    url: document.location.href,
                    stack: [h]
                },
                f(g, !0)
            }
            return !!m && m.apply(this, arguments)
        }
        function h() {
            n || (m = a.onerror,
            a.onerror = g,
            n = !0)
        }
        function i() {
            n && (a.onerror = m,
            n = !1,
            m = b)
        }
        function j() {
            var a = r
              , b = p;
            p = null,
            r = null,
            q = null,
            f.apply(null, [a, !1].concat(b))
        }
        function k(b, c) {
            var d = F.call(arguments, 1);
            if (r) {
                if (q === b)
                    return;
                j()
            }
            var e = E.computeStackTrace(b);
            if (r = e,
            q = b,
            p = d,
            a.setTimeout(function() {
                q === b && j()
            }, e.incomplete ? 2e3 : 0),
            c !== !1)
                throw b
        }
        var m, n, o = [], p = null, q = null, r = null;
        return k.subscribe = c,
        k.unsubscribe = d,
        k.uninstall = e,
        k
    }(),
    E.computeStackTrace = function() {
        function b(b) {
            if (!E.remoteFetching)
                return "";
            try {
                var c = function() {
                    try {
                        return new a.XMLHttpRequest
                    } catch (b) {
                        return new a.ActiveXObject("Microsoft.XMLHTTP")
                    }
                }
                  , d = c();
                return d.open("GET", b, !1),
                d.send(""),
                d.responseText
            } catch (e) {
                return ""
            }
        }
        function c(a) {
            if (!h(a))
                return [];
            if (!l(t, a)) {
                var c = ""
                  , d = "";
                try {
                    d = document.domain
                } catch (e) {}
                a.indexOf(d) !== -1 && (c = b(a)),
                t[a] = c ? c.split("\n") : []
            }
            return t[a]
        }
        function d(a, b) {
            var d, e = /function ([^(]*)\(([^)]*)\)/, g = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/, h = "", i = 10, j = c(a);
            if (!j.length)
                return G;
            for (var k = 0; k < i; ++k)
                if (h = j[b - k] + h,
                !f(h)) {
                    if (d = g.exec(h))
                        return d[1];
                    if (d = e.exec(h))
                        return d[1]
                }
            return G
        }
        function e(a, b) {
            var d = c(a);
            if (!d.length)
                return null;
            var e = []
              , g = Math.floor(E.linesOfContext / 2)
              , h = g + E.linesOfContext % 2
              , i = Math.max(0, b - g - 1)
              , j = Math.min(d.length, b + h - 1);
            b -= 1;
            for (var k = i; k < j; ++k)
                f(d[k]) || e.push(d[k]);
            return e.length > 0 ? e : null
        }
        function g(a) {
            return a.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&")
        }
        function i(a) {
            return g(a).replace("<", "(?:<|&lt;)").replace(">", "(?:>|&gt;)").replace("&", "(?:&|&amp;)").replace('"', '(?:"|&quot;)').replace(/\s+/g, "\\s+")
        }
        function j(a, b) {
            for (var d, e, f = 0, g = b.length; f < g; ++f)
                if ((d = c(b[f])).length && (d = d.join("\n"),
                e = a.exec(d)))
                    return {
                        url: b[f],
                        line: d.substring(0, e.index).split("\n").length,
                        column: e.index - d.lastIndexOf("\n", e.index) - 1
                    };
            return null
        }
        function k(a, b, d) {
            var e, f = c(b), h = new RegExp("\\b" + g(a) + "\\b");
            return d -= 1,
            f && f.length > d && (e = h.exec(f[d])) ? e.index : null
        }
        function m(b) {
            for (var c, d, e, f, h = [a.location.href], k = document.getElementsByTagName("script"), l = "" + b, m = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/, n = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/, o = 0; o < k.length; ++o) {
                var p = k[o];
                p.src && h.push(p.src)
            }
            if (e = m.exec(l)) {
                var q = e[1] ? "\\s+" + e[1] : ""
                  , r = e[2].split(",").join("\\s*,\\s*");
                c = g(e[3]).replace(/;$/, ";?"),
                d = new RegExp("function" + q + "\\s*\\(\\s*" + r + "\\s*\\)\\s*{\\s*" + c + "\\s*}")
            } else
                d = new RegExp(g(l).replace(/\s+/g, "\\s+"));
            if (f = j(d, h))
                return f;
            if (e = n.exec(l)) {
                var s = e[1];
                if (c = i(e[2]),
                d = new RegExp("on" + s + "=[\\'\"]\\s*" + c + "\\s*[\\'\"]","i"),
                f = j(d, h[0]))
                    return f;
                if (d = new RegExp(c),
                f = j(d, h))
                    return f
            }
            return null
        }
        function n(a) {
            if (!f(a.stack) && a.stack) {
                for (var b, c, g = /^\s*at (.*?) ?\(?((?:(?:file|https?|chrome-extension):.*?)|<anonymous>):(\d+)(?::(\d+))?\)?\s*$/i, h = /^\s*(.*?)(?:\((.*?)\))?@((?:file|https?|chrome).*?):(\d+)(?::(\d+))?\s*$/i, i = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:ms-appx|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i, j = a.stack.split("\n"), l = [], m = /^(.*) is undefined$/.exec(a.message), n = 0, o = j.length; n < o; ++n) {
                    if (b = h.exec(j[n]))
                        c = {
                            url: b[3],
                            func: b[1] || G,
                            args: b[2] ? b[2].split(",") : "",
                            line: +b[4],
                            column: b[5] ? +b[5] : null
                        };
                    else if (b = g.exec(j[n]))
                        c = {
                            url: b[2],
                            func: b[1] || G,
                            line: +b[3],
                            column: b[4] ? +b[4] : null
                        };
                    else {
                        if (!(b = i.exec(j[n])))
                            continue;
                        c = {
                            url: b[2],
                            func: b[1] || G,
                            line: +b[3],
                            column: b[4] ? +b[4] : null
                        }
                    }
                    !c.func && c.line && (c.func = d(c.url, c.line)),
                    c.line && (c.context = e(c.url, c.line)),
                    l.push(c)
                }
                return l.length ? (l[0].line && !l[0].column && m ? l[0].column = k(m[1], l[0].url, l[0].line) : l[0].column || f(a.columnNumber) || (l[0].column = a.columnNumber + 1),
                {
                    name: a.name,
                    message: a.message,
                    url: document.location.href,
                    stack: l
                }) : null
            }
        }
        function o(a) {
            var b = a.stacktrace;
            if (!f(a.stacktrace) && a.stacktrace) {
                for (var c, g = / line (\d+), column (\d+) in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\) in (.*):\s*$/i, h = b.split("\n"), i = [], j = 0, k = h.length; j < k; j += 2)
                    if (c = g.exec(h[j])) {
                        var l = {
                            line: +c[1],
                            column: +c[2],
                            func: c[3] || c[4],
                            args: c[5] ? c[5].split(",") : [],
                            url: c[6]
                        };
                        if (!l.func && l.line && (l.func = d(l.url, l.line)),
                        l.line)
                            try {
                                l.context = e(l.url, l.line)
                            } catch (m) {}
                        l.context || (l.context = [h[j + 1]]),
                        i.push(l)
                    }
                return i.length ? {
                    name: a.name,
                    message: a.message,
                    url: document.location.href,
                    stack: i
                } : null
            }
        }
        function p(b) {
            var f = b.message.split("\n");
            if (f.length < 4)
                return null;
            var g, h, k, m, n = /^\s*Line (\d+) of linked script ((?:file|https?)\S+)(?:: in function (\S+))?\s*$/i, o = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?)\S+)(?:: in function (\S+))?\s*$/i, p = /^\s*Line (\d+) of function script\s*$/i, q = [], r = document.getElementsByTagName("script"), s = [];
            for (h in r)
                l(r, h) && !r[h].src && s.push(r[h]);
            for (h = 2,
            k = f.length; h < k; h += 2) {
                var t = null;
                if (g = n.exec(f[h]))
                    t = {
                        url: g[2],
                        func: g[3],
                        line: +g[1]
                    };
                else if (g = o.exec(f[h])) {
                    t = {
                        url: g[3],
                        func: g[4]
                    };
                    var u = +g[1]
                      , v = s[g[2] - 1];
                    if (v && (m = c(t.url))) {
                        m = m.join("\n");
                        var w = m.indexOf(v.innerText);
                        w >= 0 && (t.line = u + m.substring(0, w).split("\n").length)
                    }
                } else if (g = p.exec(f[h])) {
                    var x = a.location.href.replace(/#.*$/, "")
                      , y = g[1]
                      , z = new RegExp(i(f[h + 1]));
                    m = j(z, [x]),
                    t = {
                        url: x,
                        line: m ? m.line : y,
                        func: ""
                    }
                }
                if (t) {
                    t.func || (t.func = d(t.url, t.line));
                    var A = e(t.url, t.line)
                      , B = A ? A[Math.floor(A.length / 2)] : null;
                    A && B.replace(/^\s*/, "") === f[h + 1].replace(/^\s*/, "") ? t.context = A : t.context = [f[h + 1]],
                    q.push(t)
                }
            }
            return q.length ? {
                name: b.name,
                message: f[0],
                url: document.location.href,
                stack: q
            } : null
        }
        function q(a, b, c, f) {
            var g = {
                url: b,
                line: c
            };
            if (g.url && g.line) {
                a.incomplete = !1,
                g.func || (g.func = d(g.url, g.line)),
                g.context || (g.context = e(g.url, g.line));
                var h = / '([^']+)' /.exec(f);
                if (h && (g.column = k(h[1], g.url, g.line)),
                a.stack.length > 0 && a.stack[0].url === g.url) {
                    if (a.stack[0].line === g.line)
                        return !1;
                    if (!a.stack[0].line && a.stack[0].func === g.func)
                        return a.stack[0].line = g.line,
                        a.stack[0].context = g.context,
                        !1
                }
                return a.stack.unshift(g),
                a.partial = !0,
                !0
            }
            return a.incomplete = !0,
            !1
        }
        function r(a, b) {
            for (var c, e, f, g = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, h = [], i = {}, j = !1, l = r.caller; l && !j; l = l.caller)
                if (l !== s && l !== E.report) {
                    if (e = {
                        url: null,
                        func: G,
                        line: null,
                        column: null
                    },
                    l.name ? e.func = l.name : (c = g.exec(l.toString())) && (e.func = c[1]),
                    "undefined" == typeof e.func)
                        try {
                            e.func = c.input.substring(0, c.input.indexOf("{"))
                        } catch (n) {}
                    if (f = m(l)) {
                        e.url = f.url,
                        e.line = f.line,
                        e.func === G && (e.func = d(e.url, e.line));
                        var o = / '([^']+)' /.exec(a.message || a.description);
                        o && (e.column = k(o[1], f.url, f.line))
                    }
                    i["" + l] ? j = !0 : i["" + l] = !0,
                    h.push(e)
                }
            b && h.splice(0, b);
            var p = {
                name: a.name,
                message: a.message,
                url: document.location.href,
                stack: h
            };
            return q(p, a.sourceURL || a.fileName, a.line || a.lineNumber, a.message || a.description),
            p
        }
        function s(a, b) {
            var c = null;
            b = null == b ? 0 : +b;
            try {
                if (c = o(a))
                    return c
            } catch (d) {
                if (E.debug)
                    throw d
            }
            try {
                if (c = n(a))
                    return c
            } catch (d) {
                if (E.debug)
                    throw d
            }
            try {
                if (c = p(a))
                    return c
            } catch (d) {
                if (E.debug)
                    throw d
            }
            try {
                if (c = r(a, b + 1))
                    return c
            } catch (d) {
                if (E.debug)
                    throw d
            }
            return {
                name: a.name,
                message: a.message,
                url: document.location.href
            }
        }
        var t = {};
        return s.augmentStackTraceWithInitialElement = q,
        s.computeStackTraceFromStackProp = n,
        s.guessFunctionName = d,
        s.gatherContext = e,
        s
    }();
    var H, I, J, K, L, M, N = a.Raven, O = !("object" != typeof JSON || !JSON.stringify), P = {
        logger: "javascript",
        ignoreErrors: [],
        ignoreUrls: [],
        whitelistUrls: [],
        includePaths: [],
        crossOrigin: "anonymous",
        collectWindowErrors: !0,
        tags: {},
        maxMessageLength: 100,
        extra: {}
    }, Q = !1, R = Object.prototype, S = a.console || {}, T = {}, U = t();
    for (var V in S)
        T[V] = S[V];
    var W = {
        VERSION: "1.1.22",
        debug: !0,
        noConflict: function() {
            return a.Raven = N,
            W
        },
        config: function(a, b) {
            if (J)
                return B("error", "Error: Raven has already been configured"),
                W;
            if (!a)
                return W;
            var c = e(a)
              , d = c.path.lastIndexOf("/")
              , f = c.path.substr(1, d);
            return b && m(b, function(a, b) {
                P[a] = b
            }),
            P.ignoreErrors.push(/^Script error\.?$/),
            P.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/),
            P.ignoreErrors = z(P.ignoreErrors),
            P.ignoreUrls = !!P.ignoreUrls.length && z(P.ignoreUrls),
            P.whitelistUrls = !!P.whitelistUrls.length && z(P.whitelistUrls),
            P.includePaths = z(P.includePaths),
            L = c.user,
            M = c.path.substr(d + 1),
            J = "//" + c.host + (c.port ? ":" + c.port : "") + "/" + f + "api/" + M + "/store/",
            c.protocol && (J = c.protocol + ":" + J),
            P.fetchContext && (E.remoteFetching = !0),
            P.linesOfContext && (E.linesOfContext = P.linesOfContext),
            E.collectWindowErrors = !!P.collectWindowErrors,
            W
        },
        install: function() {
            return y() && !Q && (E.report.subscribe(n),
            Q = !0),
            W
        },
        context: function(a, c, d) {
            return g(a) && (d = c || [],
            c = a,
            a = b),
            W.wrap(a, c).apply(this, d)
        },
        wrap: function(a, c) {
            function d() {
                for (var b = [], d = arguments.length, e = !a || a && a.deep !== !1; d--; )
                    b[d] = e ? W.wrap(a, arguments[d]) : arguments[d];
                try {
                    return c.apply(this, b)
                } catch (f) {
                    throw W.captureException(f, a),
                    f
                }
            }
            if (f(c) && !g(a))
                return a;
            if (g(a) && (c = a,
            a = b),
            !g(c))
                return c;
            if (c.__raven__)
                return c;
            for (var e in c)
                l(c, e) && (d[e] = c[e]);
            return d.__raven__ = !0,
            d.__inner__ = c,
            d
        },
        uninstall: function() {
            return E.report.uninstall(),
            Q = !1,
            W
        },
        captureException: function(a, b) {
            if (!k(a))
                return W.captureMessage(a, b);
            H = a;
            try {
                var c = E.computeStackTrace(a);
                n(c, b)
            } catch (d) {
                if (a !== d)
                    throw d
            }
            return W
        },
        captureMessage: function(a, b) {
            if (!P.ignoreErrors.test || !P.ignoreErrors.test(a))
                return v(r({
                    message: a + ""
                }, b)),
                W
        },
        setUserContext: function(a) {
            return K = a,
            W
        },
        setExtraContext: function(a) {
            return P.extra = a || {},
            W
        },
        setTagsContext: function(a) {
            return P.tags = a || {},
            W
        },
        setReleaseContext: function(a) {
            return P.release = a,
            W
        },
        setDataCallback: function(a) {
            return P.dataCallback = a,
            W
        },
        setShouldSendCallback: function(a) {
            return P.shouldSendCallback = a,
            W
        },
        lastException: function() {
            return H
        },
        lastEventId: function() {
            return I
        },
        isSetup: function() {
            return y()
        }
    };
    W.setUser = W.setUserContext;
    var X = "source protocol user pass host port path".split(" ")
      , Y = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;
    d.prototype = new Error,
    d.prototype.constructor = d;
    var Z;
    C(),
    "function" == typeof define && define.amd ? (a.Raven = W,
    define("raven", [], function() {
        return W
    })) : "object" == typeof module ? module.exports = W : "object" == typeof exports ? exports = W : a.Raven = W
}("undefined" != typeof window ? window : this),
define("core/utils/uniqueId", [], function() {
    "use strict";
    var a = 1e4
      , b = Math.floor(Math.random() * a + 1);
    return function(a) {
        b += 1;
        var c = String(b);
        return a ? a + c : c
    }
}),
define("core/Events", ["require", "core/utils/collection/each", "core/utils/object/has", "core/utils/uniqueId"], function(a) {
    "use strict";
    var b = a("core/utils/collection/each")
      , c = a("core/utils/object/has")
      , d = a("core/utils/uniqueId")
      , e = function(a) {
        var b, c = !1;
        return function() {
            return c ? b : (c = !0,
            b = a.apply(this, arguments),
            a = null,
            b)
        }
    }
      , f = Object.keys || function(a) {
        if (a !== Object(a))
            throw new TypeError("Invalid object");
        var b = [];
        for (var d in a)
            c(a, d) && (b[b.length] = d);
        return b
    }
      , g = [].slice
      , h = {
        on: function(a, b, c) {
            if (!j(this, "on", a, [b, c]) || !b)
                return this;
            this._events = this._events || {};
            var d = this._events[a] || (this._events[a] = []);
            return d.push({
                callback: b,
                context: c,
                ctx: c || this
            }),
            this
        },
        once: function(a, b, c) {
            if (!j(this, "once", a, [b, c]) || !b)
                return this;
            var d = this
              , f = e(function() {
                d.off(a, f),
                b.apply(this, arguments)
            });
            return f._callback = b,
            this.on(a, f, c)
        },
        off: function(a, b, c) {
            var d, e, g, h, i, k, l, m;
            if (!this._events || !j(this, "off", a, [b, c]))
                return this;
            if (!a && !b && !c)
                return this._events = {},
                this;
            for (h = a ? [a] : f(this._events),
            i = 0,
            k = h.length; i < k; i++)
                if (a = h[i],
                g = this._events[a]) {
                    if (this._events[a] = d = [],
                    b || c)
                        for (l = 0,
                        m = g.length; l < m; l++)
                            e = g[l],
                            (c && c !== e.context || b && b !== e.callback && b !== e.callback._callback) && d.push(e);
                    d.length || delete this._events[a]
                }
            return this
        },
        trigger: function(a) {
            if (!this._events)
                return this;
            var b = g.call(arguments, 1);
            if (!j(this, "trigger", a, b))
                return this;
            var c = this._events[a]
              , d = this._events.all;
            return c && k(c, b),
            d && k(d, arguments),
            this
        },
        stopListening: function(a, b, c) {
            var d = this._listeners;
            if (!d)
                return this;
            var e = !b && !c;
            "object" == typeof b && (c = this),
            a && ((d = {})[a._listenerId] = a);
            for (var f in d)
                d[f].off(b, c, this),
                e && delete this._listeners[f];
            return this
        }
    }
      , i = /\s+/
      , j = function(a, b, c, d) {
        if (!c)
            return !0;
        if ("object" == typeof c) {
            for (var e in c)
                a[b].apply(a, [e, c[e]].concat(d));
            return !1
        }
        if (i.test(c)) {
            for (var f = c.split(i), g = 0, h = f.length; g < h; g++)
                a[b].apply(a, [f[g]].concat(d));
            return !1
        }
        return !0
    }
      , k = function(a, b) {
        var c, d, e = a.length, f = b[0], g = b[1], h = b[2];
        switch (b.length) {
        case 0:
            for (d = 0; d < e; d++)
                (c = a[d]).callback.call(c.ctx);
            return;
        case 1:
            for (d = 0; d < e; d++)
                (c = a[d]).callback.call(c.ctx, f);
            return;
        case 2:
            for (d = 0; d < e; d++)
                (c = a[d]).callback.call(c.ctx, f, g);
            return;
        case 3:
            for (d = 0; d < e; d++)
                (c = a[d]).callback.call(c.ctx, f, g, h);
            return;
        default:
            for (d = 0; d < e; d++)
                (c = a[d]).callback.apply(c.ctx, b)
        }
    }
      , l = {
        listenTo: "on",
        listenToOnce: "once"
    };
    return b(l, function(a, b) {
        h[b] = function(b, c, e) {
            var f = this._listeners || (this._listeners = {})
              , g = b._listenerId || (b._listenerId = d("l"));
            return f[g] = b,
            "object" == typeof c && (e = this),
            b[a](c, e, this),
            this
        }
    }),
    h.bind = h.on,
    h.unbind = h.off,
    h
}),
define("core/utils/function/debounce", [], function() {
    "use strict";
    return function(a, b, c) {
        var d, e, f, g, h, i = function() {
            var j = (new Date).getTime() - g;
            j < b && j >= 0 ? d = setTimeout(i, b - j) : (d = null,
            c || (h = a.apply(f, e),
            d || (f = e = null)))
        };
        return function() {
            f = this,
            e = arguments,
            g = (new Date).getTime();
            var j = c && !d;
            return d || (d = setTimeout(i, b)),
            j && (h = a.apply(f, e),
            f = e = null),
            h
        }
    }
}),
define("core/utils/function/throttle", [], function() {
    "use strict";
    return function(a, b, c) {
        c || (c = 0);
        var d, e, f, g, h = 0, i = function() {
            h = new Date,
            f = null,
            g = a.apply(d, e)
        };
        return function() {
            var j = new Date
              , k = b - (j - h);
            return d = this,
            e = arguments,
            k <= 0 ? (clearTimeout(f),
            f = null,
            h = j,
            g = a.apply(d, e)) : f || (f = setTimeout(i, k + c)),
            g
        }
    }
}),
define("core/utils/array/indexOf", [], function() {
    "use strict";
    return function(a, b) {
        for (var c = 0; c < a.length; ++c)
            if (a[c] === b)
                return c;
        return -1
    }
}),
define("core/utils/array/some", [], function() {
    "use strict";
    return function(a, b, c) {
        for (var d = 0; d < a.length; ++d)
            if (b.call(c, a[d], d, a))
                return !0;
        return !1
    }
}),
define("core/utils/html/getCurrentStyle", [], function() {
    "use strict";
    return window.getComputedStyle ? function(a, b, c) {
        try {
            return window.document.defaultView.getComputedStyle(a, null).getPropertyValue(b)
        } catch (d) {
            return null
        }
    }
    : function(a, b, c) {
        return a.currentStyle[b] || a.currentStyle[c]
    }
}),
define("core/utils/html/isVisible", ["core/utils/html/getCurrentStyle"], function(a) {
    "use strict";
    return function(b) {
        return Boolean(b && (b.offsetWidth || b.offsetHeight || b.getClientRects().length) && "hidden" !== a(b, "visibility"))
    }
}),
define("core/utils/lang/isFunction", [], function() {
    "use strict";
    return function(a) {
        return "[object Function]" === Object.prototype.toString.call(a)
    }
}),
define("core/utils/object/result", ["core/utils/lang/isFunction"], function(a) {
    "use strict";
    return function(b, c, d) {
        var e = null === b || void 0 === b ? void 0 : b[c];
        return void 0 === e && (e = d),
        a(e) ? e.call(b) : e
    }
}),
define("core/utils/lang/isElement", [], function() {
    "use strict";
    return function(a) {
        return Boolean(a && 1 === a.nodeType)
    }
}),
define("stance/utils", ["exports", "core/utils/lang/isElement", "core/utils/uniqueId"], function(a, b, c) {
    "use strict";
    a.getElement = function(a) {
        return b(a) ? a : a && a.el
    }
    ,
    a.EL_ID_ATTR = "data-visibility-id",
    a.OBJ_ID_PROP = "_visibility_id",
    a.getId = function(d) {
        var e = null;
        return b(d) ? (e = d.getAttribute(a.EL_ID_ATTR) || null,
        e || (e = c(),
        d.setAttribute(a.EL_ID_ATTR, e))) : d && (e = d[a.OBJ_ID_PROP] || null,
        e || (e = d[a.OBJ_ID_PROP] = c())),
        e
    }
    ,
    a.visiblePercent = function(a, b) {
        var c = 0;
        if (!b)
            return c;
        var d = a.top
          , e = d + a.height
          , f = b.visibleTop < d
          , g = b.visibleBottom > e;
        return !f && !g || f && g ? c = 1 : f ? c = (b.height - (d - b.visibleTop)) / b.height : g && (c = (e - b.visibleTop) / b.height),
        Math.round(100 * c)
    }
}),
define("stance/tracking", ["core/utils/array/indexOf", "core/utils/array/some", "core/utils/html/isVisible", "core/utils/object/result", "./utils", "exports"], function(a, b, c, d, e, f) {
    "use strict";
    f.events = [],
    f.lastPos = null,
    f.clearCache = function(a) {
        if (void 0 === a)
            f.getElementOffset.cache = {};
        else {
            var b = e.getId(a);
            b && (f.getElementOffset.cache[b] = null)
        }
    }
    ,
    f.calculateOffset = function(a) {
        if (!a)
            return null;
        if (!c(a))
            return null;
        var b = a.ownerDocument.documentElement;
        return {
            height: a.offsetHeight,
            top: a.getBoundingClientRect().top + window.pageYOffset - (b.clientTop || 0)
        }
    }
    ,
    f._getElementOffset = function(a) {
        var b = e.getElement(a);
        if (!b)
            return null;
        var c = f.calculateOffset(b);
        return c ? {
            visibleTop: c.top + (d(a, "topEdgeOffset") || 0),
            visibleBottom: c.top + c.height - (d(a, "bottomEdgeOffset") || 0),
            offsetTop: c.top,
            height: c.height
        } : null
    }
    ,
    f.getElementOffset = function() {
        var a = function(b) {
            var c = a.cache
              , d = e.getId(b);
            if (d && c[d])
                return c[d];
            var g = f._getElementOffset(b);
            return d && g && (c[d] = g),
            g
        };
        return a.cache = {},
        a
    }(),
    f.EVENT_NAMES = ["enter", "exit", "visible", "invisible", "all"],
    f.updateTracking = function(c) {
        var d, e = function(a) {
            return a ? function(b) {
                return a[b]
            }
            : function() {}
        };
        b(f.EVENT_NAMES, e(c._events)) ? (d = a(f.events, c),
        d === -1 && f.events.push(c)) : (d = a(f.events, c),
        d !== -1 && f.events.splice(d, 1))
    }
    ,
    f.processEvents = function(a) {
        f.lastPos = a;
        var b = f.events;
        if (b.length)
            for (var c = b.length - 1; c >= 0; --c) {
                var d = b[c]
                  , e = d.isVisible(a);
                null !== e && (e !== d.lastVisible && d.trigger(e ? "enter" : "exit", d, a),
                d.trigger(e ? "visible" : "invisible", d, a),
                d.lastVisible = e)
            }
    }
}),
define("stance/main", ["core/Events", "core/utils/function/debounce", "core/utils/function/throttle", "core/utils/object/extend", "./tracking"], function(a, b, c, d, e) {
    "use strict";
    function f(a) {
        return this instanceof f ? (this.obj = a,
        void (this.lastVisible = !1)) : new f(a)
    }
    var g = b(function() {
        e.processEvents(e.lastPos)
    }, 250);
    return d(f.prototype, a, {
        on: function(b) {
            var c = !(this._events && this._events[b])
              , d = a.on.apply(this, arguments);
            return c && e.updateTracking(this),
            g(),
            d
        },
        off: function(b) {
            var c = a.off.apply(this, arguments);
            return this._events && this._events[b] || e.updateTracking(this),
            c
        },
        offset: function() {
            return e.getElementOffset(this.obj)
        },
        isVisible: function(a) {
            if (a = a || e.lastPos,
            !a)
                return null;
            var b = a.top
              , c = b + a.height
              , d = this.offset();
            return !!d && (d.offsetTop >= b && d.visibleTop < c || d.offsetTop + d.height <= c && d.visibleBottom > b)
        },
        invalidate: function() {
            return e.clearCache(this.obj),
            this
        }
    }),
    d(f, {
        invalidate: e.clearCache,
        scroll: e.processEvents,
        _windowScrollHandlerBound: !1,
        _ignoreCache: !1,
        _windowScrollHandler: c(function() {
            f._ignoreCache && f.invalidate(),
            e.processEvents({
                top: window.pageYOffset,
                height: window.document.documentElement.clientHeight
            })
        }, 250),
        bindWindowEvents: function(a) {
            this._windowScrollHandlerBound || ("undefined" != typeof a && (f._ignoreCache = a),
            window.addEventListener("scroll", this._windowScrollHandler),
            window.addEventListener("resize", this._windowScrollHandler),
            this._windowScrollHandlerBound = !0,
            this._windowScrollHandler())
        },
        unbindWindowEvents: function() {
            f._ignoreCache = !1,
            window.removeEventListener("scroll", this._windowScrollHandler),
            window.removeEventListener("resize", this._windowScrollHandler),
            this._windowScrollHandlerBound = !1
        }
    }),
    f
}),
define("stance", ["stance/main"], function(a) {
    return a
}),
define("core/strings", ["loglevel", "translations"], function(a, b) {
    "use strict";
    var c = {
        translations: b
    };
    return c.get = function(a) {
        var b = c.translations[a];
        return void 0 === b ? a : b
    }
    ,
    c.interpolate = function(b, c) {
        function d(d) {
            var e = "";
            return d in c ? e = void 0 !== c[d] && null !== c[d] ? c[d].toString() : "" : a.error("Key `" + d + "` not found in context for: ", b),
            e
        }
        return b.replace(/%\(\w+\)s/g, function(a) {
            return d(a.slice(2, -2))
        })
    }
    ,
    c.gettext = function(b, d) {
        return b = c.get(b),
        d = d || {},
        b.split(/(%\(\w+\)s)/g).map(function(c) {
            var e = c.match(/%\((\w+)\)s/);
            return e && (e[1]in d ? c = d[e[1]] : a.error("Key `" + e[1] + "` not found in context for: " + b)),
            "" === c ? null : c
        })
    }
    ,
    c
}),
define("core/UniqueModel", ["underscore"], function(a) {
    "use strict";
    function b(a, c, d) {
        var e = b.pool(a)
          , f = c && c[a.prototype.idAttribute];
        if (!f)
            return new a(c,d);
        var g = b.get(a, f);
        return g ? e[f].set(c) : e[f] = new a(c,d),
        e[f]
    }
    return b.pool = {},
    b.pool = function(a) {
        var c = b.pool[a.__type__];
        if (!c)
            throw new Error("Model not registered. Use UniqueModel.addType");
        return c
    }
    ,
    b.get = function(a, c) {
        return b.pool(a)[c]
    }
    ,
    b.set = function(a, c) {
        var d = b.pool(a)
          , e = c && c.get(a.prototype.idAttribute);
        if (!e)
            return c;
        var f = b.get(a, e);
        return f ? f.set(c.attributes) : f = d[e] = c,
        f
    }
    ,
    b.addType = function(a, c) {
        c.__type__ && b.pool[a] || (c.__type__ = a,
        b.pool[a] = {})
    }
    ,
    b.boundModel = function(c) {
        var d = a.bind(b, b, c);
        return d.prototype = c.prototype,
        d
    }
    ,
    b.wrap = b.boundModel,
    b
}),
define("common/urls", ["core/utils/object/extend"], function(a) {
    "use strict";
    var b = "https:" === window.location.protocol
      , c = {
        root: "https://disquscom.b0.upaiyun.com/",
        shortener: "http://disq.us",
        media: "https://c.disquscdn.com/next/current/embed",
        realertime: "//localhost",
        jester: "https://02ccf211-e321-4db4-89f5-8cd651104b09.coding.io/juggler",
        glitter: "https://glitter.services.disqus.com/urls/",
        login: "https://disquscom.b0.upaiyun.com/next/login/",
        dotcomLogin: "https://disquscom.b0.upaiyun.com/profile/login/",
        api: "https://disquscom.b0.upaiyun.com/api/3.0/",
        logout: "http://disqus.com/logout/",
        editProfile: "https://disquscom.b0.upaiyun.com/home/settings/account/",
        verifyEmail: "https://disquscom.b0.upaiyun.com/next/verify/",
        authorize: "https://disquscom.b0.upaiyun.com/api/oauth/2.0/authorize/",
        home: "https://disquscom.b0.upaiyun.com/home/",
        homeInbox: "https://disquscom.b0.upaiyun.com/home/inbox/",
        moderate: "https://disquscom.b0.upaiyun.com/admin/moderate/",
        oauth: {
            twitter: "https://disquscom.b0.upaiyun.com/_ax/twitter/begin/",
            google: "https://disquscom.b0.upaiyun.com/_ax/google/begin/",
            facebook: "https://disquscom.b0.upaiyun.com/_ax/facebook/begin/",
            amazon: "https://disquscom.b0.upaiyun.com/_ax/amazon/begin/"
        },
        avatar: {
            generic: "https://c.disquscdn.com/next/embed/assets/img/noavatar92.7b2fde640943965cc88df0cdee365907.png"
        },
        linkAffiliatorClient: "https://c.disquscdn.com/next/embed/alfie.f51946af45e0b561c60f768335c9eb79.js",
        linkAffiliatorClientV2: "https://c.disquscdn.com/next/embed/alfalfa.4a5fcca1fe50a757044dfd331b660625.js",
        linkAffiliatorAPI: "https://links.services.disqus.com/api"
    };
    return b && (c = a(c, {
        logout: "https://disquscom.b0.upaiyun.com/logout/",
        editProfile: "https://disquscom.b0.upaiyun.com/home/settings/account/",
        moderate: "https://disquscom.b0.upaiyun.com/admin/moderate/"
    })),
    c
}),
define("common/keys", [], function() {
    "use strict";
    var a = {
        embedAPI: "E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F",
        viglinkAPI: "cfdfcf52dffd0a702a61bad27507376d",
        googleAnalytics: "UA-1410476-6",
        facebook: "52254943976",
        google: "508198334196-bgmagrg0a2rub674g0shidj8fnd50dji.apps.googleusercontent.com"
    };
    return a
}),
define("common/defines", [], function() {
    "use strict";
    return {
        debug: !1
    }
}),
define("core/config", ["common/urls", "common/keys", "common/defines"], function(a, b, c) {
    "use strict";
    return {
        urls: {
            avatar: {
                generic: a.avatar.generic
            },
            api: a.api,
            media: a.media,
            verifyEmail: a.verifyEmail,
            login: a.login,
            oauth: a.oauth
        },
        keys: {
            api: b.embedAPI,
            segmentIO: "WskYYFRdZvvOmLhuFN9r7ZygELBNKkvH"
        },
        TLDS: "aaa|aarp|abarth|abb|abbott|abbvie|abc|able|abogado|abudhabi|ac|academy|accenture|accountant|accountants|aco|active|actor|ad|adac|ads|adult|ae|aeg|aero|aetna|af|afamilycompany|afl|africa|ag|agakhan|agency|ai|aig|aigo|airbus|airforce|airtel|akdn|al|alfaromeo|alibaba|alipay|allfinanz|allstate|ally|alsace|alstom|am|americanexpress|americanfamily|amex|amfam|amica|amsterdam|analytics|android|anquan|anz|ao|aol|apartments|app|apple|aq|aquarelle|ar|arab|aramco|archi|army|arpa|art|arte|as|asda|asia|associates|at|athleta|attorney|au|auction|audi|audible|audio|auspost|author|auto|autos|avianca|aw|aws|ax|axa|az|azure|ba|baby|baidu|banamex|bananarepublic|band|bank|bar|barcelona|barclaycard|barclays|barefoot|bargains|baseball|basketball|bauhaus|bayern|bb|bbc|bbt|bbva|bcg|bcn|bd|be|beats|beauty|beer|bentley|berlin|best|bestbuy|bet|bf|bg|bh|bharti|bi|bible|bid|bike|bing|bingo|bio|biz|bj|black|blackfriday|blanco|blockbuster|blog|bloomberg|blue|bm|bms|bmw|bn|bnl|bnpparibas|bo|boats|boehringer|bofa|bom|bond|boo|book|booking|boots|bosch|bostik|boston|bot|boutique|box|br|bradesco|bridgestone|broadway|broker|brother|brussels|bs|bt|budapest|bugatti|build|builders|business|buy|buzz|bv|bw|by|bz|bzh|ca|cab|cafe|cal|call|calvinklein|cam|camera|camp|cancerresearch|canon|capetown|capital|capitalone|car|caravan|cards|care|career|careers|cars|cartier|casa|case|caseih|cash|casino|cat|catering|catholic|cba|cbn|cbre|cbs|cc|cd|ceb|center|ceo|cern|cf|cfa|cfd|cg|ch|chanel|channel|chase|chat|cheap|chintai|christmas|chrome|chrysler|church|ci|cipriani|circle|cisco|citadel|citi|citic|city|cityeats|ck|cl|claims|cleaning|click|clinic|clinique|clothing|cloud|club|clubmed|cm|cn|co|coach|codes|coffee|college|cologne|com|comcast|commbank|community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|cookingchannel|cool|coop|corsica|country|coupon|coupons|courses|cr|credit|creditcard|creditunion|cricket|crown|crs|cruise|cruises|csc|cu|cuisinella|cv|cw|cx|cy|cymru|cyou|cz|dabur|dad|dance|data|date|dating|datsun|day|dclk|dds|de|deal|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|discover|dish|diy|dj|dk|dm|dnp|do|docs|doctor|dodge|dog|doha|domains|dot|download|drive|dtv|dubai|duck|dunlop|duns|dupont|durban|dvag|dvr|dz|earth|eat|ec|eco|edeka|edu|education|ee|eg|email|emerck|energy|engineer|engineering|enterprises|epost|epson|equipment|er|ericsson|erni|es|esq|estate|esurance|et|etisalat|eu|eurovision|eus|events|everbank|exchange|expert|exposed|express|extraspace|fage|fail|fairwinds|faith|family|fan|fans|farm|farmers|fashion|fast|fedex|feedback|ferrari|ferrero|fi|fiat|fidelity|fido|film|final|finance|financial|fire|firestone|firmdale|fish|fishing|fit|fitness|fj|fk|flickr|flights|flir|florist|flowers|fly|fm|fo|foo|food|foodnetwork|football|ford|forex|forsale|forum|foundation|fox|fr|free|fresenius|frl|frogans|frontdoor|frontier|ftr|fujitsu|fujixerox|fun|fund|furniture|futbol|fyi|ga|gal|gallery|gallo|gallup|game|games|gap|garden|gb|gbiz|gd|gdn|ge|gea|gent|genting|george|gf|gg|ggee|gh|gi|gift|gifts|gives|giving|gl|glade|glass|gle|global|globo|gm|gmail|gmbh|gmo|gmx|gn|godaddy|gold|goldpoint|golf|goo|goodhands|goodyear|goog|google|gop|got|gov|gp|gq|gr|grainger|graphics|gratis|green|gripe|grocery|group|gs|gt|gu|guardian|gucci|guge|guide|guitars|guru|gw|gy|hair|hamburg|hangout|haus|hbo|hdfc|hdfcbank|health|healthcare|help|helsinki|here|hermes|hgtv|hiphop|hisamitsu|hitachi|hiv|hk|hkt|hm|hn|hockey|holdings|holiday|homedepot|homegoods|homes|homesense|honda|honeywell|horse|hospital|host|hosting|hot|hoteles|hotels|hotmail|house|how|hr|hsbc|ht|htc|hu|hughes|hyatt|hyundai|ibm|icbc|ice|icu|id|ie|ieee|ifm|ikano|il|im|imamat|imdb|immo|immobilien|in|industries|infiniti|info|ing|ink|institute|insurance|insure|int|intel|international|intuit|investments|io|ipiranga|iq|ir|irish|is|iselect|ismaili|ist|istanbul|it|itau|itv|iveco|iwc|jaguar|java|jcb|jcp|je|jeep|jetzt|jewelry|jio|jlc|jll|jm|jmp|jnj|jo|jobs|joburg|jot|joy|jp|jpmorgan|jprs|juegos|juniper|kaufen|kddi|ke|kerryhotels|kerrylogistics|kerryproperties|kfh|kg|kh|ki|kia|kim|kinder|kindle|kitchen|kiwi|km|kn|koeln|komatsu|kosher|kp|kpmg|kpn|kr|krd|kred|kuokgroup|kw|ky|kyoto|kz|la|lacaixa|ladbrokes|lamborghini|lamer|lancaster|lancia|lancome|land|landrover|lanxess|lasalle|lat|latino|latrobe|law|lawyer|lb|lc|lds|lease|leclerc|lefrak|legal|lego|lexus|lgbt|li|liaison|lidl|life|lifeinsurance|lifestyle|lighting|like|lilly|limited|limo|lincoln|linde|link|lipsy|live|living|lixil|lk|loan|loans|locker|locus|loft|lol|london|lotte|lotto|love|lpl|lplfinancial|lr|ls|lt|ltd|ltda|lu|lundbeck|lupin|luxe|luxury|lv|ly|ma|macys|madrid|maif|maison|makeup|man|management|mango|map|market|marketing|markets|marriott|marshalls|maserati|mattel|mba|mc|mckinsey|md|me|med|media|meet|melbourne|meme|memorial|men|menu|meo|merckmsd|metlife|mg|mh|miami|microsoft|mil|mini|mint|mit|mitsubishi|mk|ml|mlb|mls|mm|mma|mn|mo|mobi|mobile|mobily|moda|moe|moi|mom|monash|money|monster|mopar|mormon|mortgage|moscow|moto|motorcycles|mov|movie|movistar|mp|mq|mr|ms|msd|mt|mtn|mtr|mu|museum|mutual|mv|mw|mx|my|mz|na|nab|nadex|nagoya|name|nationwide|natura|navy|nba|nc|ne|nec|net|netbank|netflix|network|neustar|new|newholland|news|next|nextdirect|nexus|nf|nfl|ng|ngo|nhk|ni|nico|nike|nikon|ninja|nissan|nissay|nl|no|nokia|northwesternmutual|norton|now|nowruz|nowtv|np|nr|nra|nrw|ntt|nu|nyc|nz|obi|observer|off|office|okinawa|olayan|olayangroup|oldnavy|ollo|om|omega|one|ong|onl|online|onyourside|ooo|open|oracle|orange|org|organic|origins|osaka|otsuka|ott|ovh|pa|page|panasonic|panerai|paris|pars|partners|parts|party|passagens|pay|pccw|pe|pet|pf|pfizer|pg|ph|pharmacy|phd|philips|phone|photo|photography|photos|physio|piaget|pics|pictet|pictures|pid|pin|ping|pink|pioneer|pizza|pk|pl|place|play|playstation|plumbing|plus|pm|pn|pnc|pohl|poker|politie|porn|post|pr|pramerica|praxi|press|prime|pro|prod|productions|prof|progressive|promo|properties|property|protection|pru|prudential|ps|pt|pub|pw|pwc|py|qa|qpon|quebec|quest|qvc|racing|radio|raid|re|read|realestate|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|reliance|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|richardli|ricoh|rightathome|ril|rio|rip|rmit|ro|rocher|rocks|rodeo|rogers|room|rs|rsvp|ru|rugby|ruhr|run|rw|rwe|ryukyu|sa|saarland|safe|safety|sakura|sale|salon|samsclub|samsung|sandvik|sandvikcoromant|sanofi|sap|sapo|sarl|sas|save|saxo|sb|sbi|sbs|sc|sca|scb|schaeffler|schmidt|scholarships|school|schule|schwarz|science|scjohnson|scor|scot|sd|se|search|seat|secure|security|seek|select|sener|services|ses|seven|sew|sex|sexy|sfr|sg|sh|shangrila|sharp|shaw|shell|shia|shiksha|shoes|shop|shopping|shouji|show|showtime|shriram|si|silk|sina|singles|site|sj|sk|ski|skin|sky|skype|sl|sling|sm|smart|smile|sn|sncf|so|soccer|social|softbank|software|sohu|solar|solutions|song|sony|soy|space|spiegel|spot|spreadbetting|sr|srl|srt|st|stada|staples|star|starhub|statebank|statefarm|statoil|stc|stcgroup|stockholm|storage|store|stream|studio|study|style|su|sucks|supplies|supply|support|surf|surgery|suzuki|sv|swatch|swiftcover|swiss|sx|sy|sydney|symantec|systems|sz|tab|taipei|talk|taobao|target|tatamotors|tatar|tattoo|tax|taxi|tc|tci|td|tdk|team|tech|technology|tel|telecity|telefonica|temasek|tennis|teva|tf|tg|th|thd|theater|theatre|tiaa|tickets|tienda|tiffany|tips|tires|tirol|tj|tjmaxx|tjx|tk|tkmaxx|tl|tm|tmall|tn|to|today|tokyo|tools|top|toray|toshiba|total|tours|town|toyota|toys|tr|trade|trading|training|travel|travelchannel|travelers|travelersinsurance|trust|trv|tt|tube|tui|tunes|tushu|tv|tvs|tw|tz|ua|ubank|ubs|uconnect|ug|uk|unicom|university|uno|uol|ups|us|uy|uz|va|vacations|vana|vanguard|vc|ve|vegas|ventures|verisign|versicherung|vet|vg|vi|viajes|video|vig|viking|villas|vin|vip|virgin|visa|vision|vista|vistaprint|viva|vivo|vlaanderen|vn|vodka|volkswagen|volvo|vote|voting|voto|voyage|vu|vuelos|wales|walmart|walter|wang|wanggou|warman|watch|watches|weather|weatherchannel|webcam|weber|website|wed|wedding|weibo|weir|wf|whoswho|wien|wiki|williamhill|win|windows|wine|winners|wme|wolterskluwer|woodside|work|works|world|wow|ws|wtc|wtf|xbox|xerox|xfinity|xihuan|xin|xn--11b4c3d|xn--1ck2e1b|xn--1qqw23a|xn--2scrj9c|xn--30rr7y|xn--3bst00m|xn--3ds443g|xn--3e0b707e|xn--3hcrj9c|xn--3oq18vl8pn36a|xn--3pxu8k|xn--42c2d9a|xn--45br5cyl|xn--45brj9c|xn--45q11c|xn--4gbrim|xn--54b7fta0cc|xn--55qw42g|xn--55qx5d|xn--5su34j936bgsg|xn--5tzm5g|xn--6frz82g|xn--6qq986b3xl|xn--80adxhks|xn--80ao21a|xn--80aqecdr1a|xn--80asehdb|xn--80aswg|xn--8y0a063a|xn--90a3ac|xn--90ae|xn--90ais|xn--9dbq2a|xn--9et52u|xn--9krt00a|xn--b4w605ferd|xn--bck1b9a5dre4c|xn--c1avg|xn--c2br7g|xn--cck2b3b|xn--cg4bki|xn--clchc0ea0b2g2a9gcd|xn--czr694b|xn--czrs0t|xn--czru2d|xn--d1acj3b|xn--d1alf|xn--e1a4c|xn--eckvdtc9d|xn--efvy88h|xn--estv75g|xn--fct429k|xn--fhbei|xn--fiq228c5hs|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--fjq720a|xn--flw351e|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--fzys8d69uvgm|xn--g2xx48c|xn--gckr3f0f|xn--gecrj9c|xn--gk3at1e|xn--h2breg3eve|xn--h2brj9c|xn--h2brj9c8c|xn--hxt814e|xn--i1b6b1a6a2e|xn--imr513n|xn--io0a7i|xn--j1aef|xn--j1amh|xn--j6w193g|xn--jlq61u9w7b|xn--jvr189m|xn--kcrx77d1x4a|xn--kprw13d|xn--kpry57d|xn--kpu716f|xn--kput3i|xn--l1acc|xn--lgbbat1ad8j|xn--mgb9awbf|xn--mgba3a3ejt|xn--mgba3a4f16a|xn--mgba7c0bbn0a|xn--mgbaakc7dvf|xn--mgbaam7a8h|xn--mgbab2bd|xn--mgbai9azgqp6j|xn--mgbayh7gpa|xn--mgbb9fbpob|xn--mgbbh1a|xn--mgbbh1a71e|xn--mgbc0a9azcg|xn--mgbca7dzdo|xn--mgberp4a5d4ar|xn--mgbgu82a|xn--mgbi4ecexp|xn--mgbpl2fh|xn--mgbt3dhd|xn--mgbtx2b|xn--mgbx4cd0ab|xn--mix891f|xn--mk1bu44c|xn--mxtq1m|xn--ngbc5azd|xn--ngbe9e0a|xn--ngbrx|xn--node|xn--nqv7f|xn--nqv7fs00ema|xn--nyqy26a|xn--o3cw4h|xn--ogbpf8fl|xn--p1acf|xn--p1ai|xn--pbt977c|xn--pgbs0dh|xn--pssy2u|xn--q9jyb4c|xn--qcka1pmc|xn--qxam|xn--rhqv96g|xn--rovu88b|xn--rvc1e0am3e|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--tckwe|xn--tiq49xqyj|xn--unup4y|xn--vermgensberater-ctb|xn--vermgensberatung-pwb|xn--vhquv|xn--vuq861b|xn--w4r85el8fhu5dnra|xn--w4rs40l|xn--wgbh1c|xn--wgbl6a|xn--xhq521b|xn--xkc2al3hye2a|xn--xkc2dl3a5ee0h|xn--y9a3aq|xn--yfro4i67o|xn--ygbi2ammx|xn--zfr164b|xperia|xxx|xyz|yachts|yahoo|yamaxun|yandex|ye|yodobashi|yoga|yokohama|you|youtube|yt|yun|za|zappos|zara|zero|zip|zippo|zm|zone|zuerich|zw",
        feedApiVersion: 12,
        debug: c.debug
    }
}),
define("core/utils", ["jquery", "underscore", "core/config"], function(a, b, c) {
    "use strict";
    function d(a) {
        return function(b) {
            return b && b.preventDefault && b.preventDefault(),
            a.apply(this, arguments)
        }
    }
    function e(a) {
        return function(b) {
            return b && b.stopPropagation && b.stopPropagation(),
            a.apply(this, arguments)
        }
    }
    function f(a) {
        return d(e(a))
    }
    function g(a) {
        if (!a)
            return "";
        a = "http://" + a.replace(/^([a-z+.-]+:)?\/+/i, "");
        var b = l.createElement("a");
        b.href = a;
        var c = b.hostname.replace(/^www\d*\./i, "");
        return c = c.toLowerCase()
    }
    function h(a) {
        var c = [];
        return b.each(a, function(a, b) {
            void 0 !== a && c.push(b + (null === a ? "" : "=" + encodeURIComponent(a)))
        }),
        c.join("&")
    }
    function i(a, b, c) {
        if (b && (a.indexOf("?") === -1 ? a += "?" : "&" !== a.charAt(a.length - 1) && (a += "&"),
        a += this.serializeArgs(b)),
        c) {
            var d = {};
            return d[(new Date).getTime()] = null,
            this.serialize(a, d)
        }
        var e = a.length;
        return "&" === a.charAt(e - 1) ? a.slice(0, e - 1) : a
    }
    function j(a, c, d) {
        d ? b.extend(d, {
            location: 1,
            status: 1,
            resizable: 1,
            scrollbars: 1
        }) : d = {},
        d.width && d.height && b.defaults(d, {
            left: window.screen.width / 2 - d.width / 2,
            top: window.screen.height / 2 - d.height / 2
        });
        var e = b.map(d, function(a, b) {
            return b + "=" + a
        }).join(",");
        return window.open(a, c, e)
    }
    function k(a, b, c) {
        b < 0 && (b = 0);
        var d = a.substring(0, b)
          , e = a.substring(b);
        return d.length && !/\s$/.test(d) && (d += " "),
        /^\s/.test(e) || (e = " " + e),
        d + c + e
    }
    var l = window.document
      , m = /^[a-zA-Z0-9.!#$%&'*+-\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      , n = function(a) {
        return m.test(a)
    }
      , o = c.TLDS || "zw|zuerich|zone|zm|zip|za|yt|youtube|yokohama|yoga|yodobashi|ye|yandex|yachts|xyz|xxx|xin|xerox|wtf|wtc|ws|world|works|work|wme|win|williamhill|wiki|wien|whoswho|wf|weir|wedding|wed|website|webcam|watch|wang|wales|vu|voyage|voto|voting|vote|vodka|vn|vlaanderen|vision|villas|video|viajes|vi|vg|vet|versicherung|ventures|vegas|ve|vc|vacations|va|uz|uy|us|uol|uno|university|uk|ug|ua|tz|tw|tv|tui|tt|trust|travel|training|trading|trade|tr|toys|town|tours|toshiba|toray|top|tools|tokyo|today|to|tn|tm|tl|tk|tj|tirol|tires|tips|tienda|tickets|theater|th|tg|tf|tennis|temasek|tel|technology|tech|team|td|tc|taxi|tax|tattoo|tatar|taipei|sz|systems|sydney|sy|sx|swiss|sv|suzuki|surgery|surf|support|supply|supplies|sucks|su|style|study|st|sr|spreadbetting|spiegel|space|soy|sony|solutions|solar|sohu|software|social|so|sn|sm|sl|sky|sk|sj|site|singles|si|shriram|show|shoes|shiksha|sh|sg|sexy|sex|sew|services|sener|seat|se|sd|scot|science|schwarz|schule|school|scholarships|schmidt|scb|sca|sc|sb|saxo|sarl|sap|samsung|sale|saarland|sa|ryukyu|rw|run|ruhr|ru|rsvp|rs|rodeo|rocks|ro|rip|rio|rich|reviews|review|restaurant|rest|republican|report|repair|rentals|rent|ren|reit|reisen|reise|rehab|redstone|red|recipes|realtor|re|racing|quebec|qpon|qa|py|pw|pub|pt|ps|property|properties|prof|productions|prod|pro|press|praxi|pr|post|porn|poker|pohl|pn|pm|plus|plumbing|place|pl|pk|pizza|pink|pictures|pictet|pics|piaget|physio|photos|photography|photo|philips|pharmacy|ph|pg|pf|pe|party|parts|partners|paris|panerai|page|pa|ovh|otsuka|osaka|organic|org|oracle|ooo|online|onl|ong|one|om|okinawa|nz|nyc|nu|ntt|nrw|nra|nr|np|no|nl|nissan|ninja|nico|ni|nhk|ngo|ng|nf|nexus|news|new|neustar|network|net|nec|ne|nc|navy|name|nagoya|nadex|na|mz|my|mx|mw|mv|museum|mu|mtpc|mtn|mt|ms|mr|mq|mp|movie|mov|motorcycles|moscow|mortgage|mormon|money|monash|moe|moda|mobi|mo|mn|mma|mm|ml|mk|mini|mil|miami|mh|mg|menu|memorial|meme|melbourne|meet|media|me|md|mc|marriott|markets|marketing|market|mango|management|maison|maif|madrid|ma|ly|lv|luxury|luxe|lu|ltda|lt|ls|lr|love|lotto|lotte|london|lol|loans|loan|lk|link|limo|limited|lighting|life|lidl|liaison|li|lgbt|legal|leclerc|lease|lds|lc|lb|lawyer|latrobe|lat|land|lacaixa|la|kz|kyoto|ky|kw|kred|krd|kr|kp|komatsu|koeln|kn|km|kiwi|kitchen|kim|ki|kh|kg|ke|kddi|kaufen|juegos|jp|joburg|jobs|jo|jm|jewelry|jetzt|je|jcb|java|iwc|it|is|irish|ir|iq|io|investments|international|int|insure|institute|ink|ing|info|infiniti|industries|in|immobilien|immo|im|il|ifm|ie|id|icu|ibm|hu|ht|hr|how|house|hosting|host|horse|honda|homes|holiday|holdings|hockey|hn|hm|hk|hiv|hitachi|hiphop|hermes|here|help|healthcare|haus|hangout|hamburg|gy|gw|guru|guitars|guide|guge|gu|gt|gs|gripe|green|gratis|graphics|gr|gq|gp|gov|gop|google|goog|goo|golf|goldpoint|gold|gn|gmx|gmo|gmail|gm|globo|global|gle|glass|gl|gives|gifts|gift|gi|gh|ggee|gg|gf|gent|ge|gdn|gd|gbiz|gb|garden|gallery|gal|ga|futbol|furniture|fund|frogans|frl|fr|foundation|forsale|forex|football|foo|fo|fm|fly|flsmidth|flowers|florist|flights|fk|fj|fitness|fit|fishing|fish|firmdale|financial|finance|film|fi|feedback|fashion|farm|fans|fan|faith|fail|express|exposed|expert|exchange|everbank|events|eus|eurovision|eu|et|estate|esq|es|erni|er|equipment|epson|enterprises|engineering|engineer|energy|emerck|email|eg|ee|education|edu|ec|eat|dz|dvag|durban|download|doosan|domains|doha|dog|docs|do|dnp|dm|dk|dj|discount|directory|direct|digital|diet|diamonds|dev|design|desi|dentist|dental|democrat|delivery|degree|deals|de|dclk|day|datsun|dating|date|dance|dad|dabur|cz|cyou|cymru|cy|cx|cw|cv|cuisinella|cu|cruises|crs|cricket|creditcard|credit|cr|courses|country|coop|cool|cooking|contractors|consulting|construction|condos|computer|company|community|com|cologne|college|coffee|codes|coach|co|cn|cm|club|clothing|clinic|click|cleaning|claims|cl|ck|city|citic|ci|church|chrome|christmas|chloe|cheap|chat|channel|ch|cg|cfd|cfa|cf|cern|ceo|center|cd|cc|cbn|catering|cat|casino|cash|casa|cartier|cars|careers|career|care|cards|caravan|capital|capetown|canon|cancerresearch|camp|camera|cal|cafe|cab|ca|bzh|bz|by|bw|bv|buzz|business|builders|build|budapest|bt|bs|brussels|brother|broker|bridgestone|br|boutique|boo|bond|boats|bo|bnpparibas|bn|bmw|bm|blue|bloomberg|blackfriday|black|bj|biz|bio|bingo|bike|bid|bi|bh|bg|bf|best|berlin|beer|be|bd|bbc|bb|bayern|bauhaus|bargains|barclays|barclaycard|bar|bank|band|ba|az|axa|ax|aw|autos|auto|audio|auction|au|attorney|at|associates|asia|as|arpa|army|archi|ar|aquarelle|aq|apartments|ao|android|an|amsterdam|am|alsace|allfinanz|al|airforce|aig|ai|agency|ag|afl|af|aero|ae|adult|ads|ad|actor|active|accountants|accountant|accenture|academy|ac|abogado|abbott|abb"
      , p = new RegExp("([^@.]|^)\\b(?:\\w[\\w-]*:/{0,3}(?:(?:\\w+:)?\\w+@)?)?([\\w-]+\\.)+(?:" + o + ')(?!\\.\\w)\\b(?::\\d+)?(?:[/?][^\\s\\{\\}\\|\\\\\\^\\[\\]`<>"\\x80-\\xFF\\x00-\\x1F\\x7F]*)?',"g")
      , q = function(a) {
        return Boolean(a.match(p))
    }
      , r = /^[\w-]+:\/{0,3}/
      , s = /([.,]+)$/g
      , t = function(a) {
        var b, c, d, e, f, g = [];
        if (!a)
            return g;
        for (; b = p.exec(a); ) {
            c = b[0],
            f = b[1],
            c = c.slice(f.length),
            s.lastIndex = 0,
            d = s.exec(c),
            d && (c = c.slice(0, c.length - d[0].length)),
            e = r.test(c) ? c : "http://" + c;
            var h = b.index + f.length;
            g.push({
                text: c,
                url: e,
                index: h,
                endIndex: h + c.length
            })
        }
        return g
    }
      , u = new RegExp("[\\u0021-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E\\u00A1-\\u00BF\\u2010-\\u2027\\u2030-\\u205E\\u2300-\\u23FF\\u2E00-\\u2E7F\\u3001-\\u303F\\uFE10-\\uFE19\\uFE30-\\uFE4F\\uFE50-\\uFE6B\\uFF01-\\uFF0F\\uFF1A-\\uFF20\\uFF3B-\\uFF40\\uFF5B-\\uFF60\\uFF5F-\\uFF64]+$")
      , v = .5
      , w = function(a, b) {
        if (a.length <= b)
            return a;
        a = a.slice(0, b - 1);
        var c = a
          , d = /(^.*\S)\s/.exec(a);
        d && (a = d[1]);
        var e = u.exec(a);
        return e && (a = a.slice(0, a.length - e[0].length)),
        a.length < v * c.length && (a = c),
        a + "…"
    }
      , x = function() {
        var a = l.createElement("fakeelement");
        return function(b, c) {
            return void 0 !== a.style[c]
        }
    }()
      , y = function() {
        var a = {
            transition: "transitionend",
            OTransition: "otransitionend",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
        return b.find(a, x) || null
    }()
      , z = function() {
        var a = {
            animation: "animationend",
            OAnimation: "oAnimationEnd",
            MozAnimation: "animationend",
            WebkitAnimation: "webkitAnimationEnd"
        };
        return b.find(a, x) || null
    }()
      , A = function(a) {
        return a = a || window,
        /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(a.navigator.userAgent || a.navigator.vendor || a.opera)
    }
      , B = function(b, c) {
        return c || (c = a(b.currentTarget)),
        "_blank" === c.attr("target") || b.ctrlKey || b.metaKey || b.shiftKey || b.altKey
    }
      , C = 500
      , D = function() {
        var a = {}
          , c = /#.*$/
          , d = function(a) {
            var c = a.attr("data-tid");
            return c || (c = b.uniqueId(),
            a.attr("data-tid", c)),
            c
        };
        return function(b, e) {
            if (b.isDefaultPrevented())
                return !1;
            if (!e.is("a"))
                return !1;
            var f = (e.attr("href") || "").replace(c, "");
            if (!f)
                return !1;
            var g = d(e)
              , h = (new Date).getTime();
            return !(a[g] && h - a[g] < C) && (a[g] = h,
            !0)
        }
    }();
    return {
        validateEmail: n,
        isUrl: q,
        bleachFindUrls: t,
        niceTruncate: w,
        transitionEndEvent: y,
        animationEndEvent: z,
        isMobileUserAgent: A,
        preventDefaultHandler: d,
        stopPropagationHandler: e,
        stopEventHandler: f,
        getDomain: g,
        serializeArgs: h,
        serialize: i,
        openWindow: j,
        insertWithWhitespace: k,
        willOpenNewWindow: B,
        clickShouldBeLogged: D
    }
}),
require.config({
    waitSeconds: 0,
    enforceDefine: !0,
    paths: {
        ga: "https://ssl.google-analytics.com/ga",
        "ga-debug": "https://ssl.google-analytics.com/u/ga_debug",
        fb: "https://connect.facebook.net/en_US/sdk",
        gapi: "https://apis.google.com/js/api"
    },
    shim: {
        ga: {
            exports: "_gat"
        },
        "ga-debug": {
            exports: "_gat"
        },
        fb: {
            exports: "FB"
        },
        gapi: {
            exports: "gapi"
        }
    }
}),
define("require/config", function() {}),
define("common/main", ["require", "exports"], function(a, b) {
    "use strict";
    var c = function() {
        return Number(new Date)
    }
      , d = window.document;
    b.ready = !1,
    b.timings = {};
    var e = function(a) {
        for (var b = {}, c = a.substr(1).split("&"), d = c.length - 1; d >= 0; d--) {
            var e = c[d].split("=");
            b[e[0]] = decodeURIComponent((e[1] || "").replace(/\+/g, "%20"))
        }
        return b
    }(window.location.search);
    b.params = e,
    b.version = e.version,
    b.loadCss = function(a) {
        var b = d.createElement("link");
        return b.rel = "stylesheet",
        b.href = a,
        d.getElementsByTagName("head")[0].appendChild(b),
        b
    }
    ,
    b.setReady = function() {
        a(["core/bus"], function(a) {
            a.frame.sendHostMessage("ready"),
            b.ready = !0
        })
    }
    ,
    b.setFailure = function(b) {
        var c = d.getElementById("error");
        c && (c.style.display = "block");
        var e = window.opener || window.parent;
        e && (a.defined("core/bus") ? a("core/bus").frame.sendHostMessage("fail", b) : e.postMessage(JSON.stringify({
            scope: "host",
            name: "fail",
            data: b,
            sender: window.name
        }), "*"))
    }
    ,
    b.init = function(f, g) {
        function h(a, e, f, g, h) {
            b.timings.downloadEnd = c(),
            d.body.style.display = "",
            f.setDefaultLevel("SILENT");
            var i = h.lounge.sentry_rate_limit || 0
              , j = "//c27c205e742645ce987ed5ba2ef88af9@sentry.services.disqus.com/35";
            g.debug = !1;
            var k = d.documentMode && d.documentMode < 10;
            j && !k && g.config(j, {
                whitelistUrls: ["https://c.disquscdn.com/next/embed"],
                release: b.version,
                shouldSendCallback: function() {
                    return i > 0 && Math.random() <= 1 / i
                }
            }).install();
            var l;
            try {
                l = (e.init || a.noop)(b)
            } catch (m) {
                j && g.captureException(m),
                l = {
                    code: "js_exception"
                }
            }
            l ? b.setFailure(l) : b.setReady()
        }
        function i(b, c) {
            require.undef(b),
            define(b, c),
            a([b])
        }
        function j(a) {
            "undefined" != typeof console && "function" == typeof console.log && console.log(a.toString());
            for (var c, d, e = a.requireModules || [], f = 0; f < e.length; ++f)
                c = e[f],
                d = l[c],
                "undefined" == typeof d ? b.setFailure({
                    code: "module_load_error." + c.replace(/\W/g, "_")
                }) : i(c, d)
        }
        if (e.n_s)
            return void (d.documentElement.className += " not-supported type-" + e.n_s);
        b.timings.initStart = c();
        var k = d.documentElement.lang;
        require.config({
            paths: {
                translations: "lang/" + k
            }
        }),
        k && "en" !== k || define("translations", {}),
        b.loadCss(g["rtl" === d.documentElement.dir ? "RTL_STYLES" : "STYLES"]);
        var l = {
            translations: {},
            "remote/config": {
                lounge: {},
                discovery: {},
                experiments: {}
            }
        };
        a(["jquery", f + "/main", "loglevel", "raven", "remote/config"], h, j)
    }
}),
define("common.bundle", function() {});
