!function() {
    "use strict";
    var a = window.document
      , b = {
        STYLES: "https://c.disquscdn.com/next/embed/styles/lounge.6320e20b57d877f77ba9dc866ff7fb10.css",
        RTL_STYLES: "https://c.disquscdn.com/next/embed/styles/lounge_rtl.79d7dc15bd16ba8a972946e598ac7202.css",
        "lounge/main": "https://cdn.jsdelivr.net/gh/tingwork/disqus@1.01/lounge.bundle.js",
        "discovery/main": "https://c.disquscdn.com/next/embed/discovery.bundle.daedd146972fc7d8dffd9be34c404865.js",
        "remote/config": "https://disquscom.b0.upaiyun.com/next/config.js",
        "common/vendor_extensions/highlight": "https://c.disquscdn.com/next/embed/highlight.6fbf348532f299e045c254c49c4dbedf.js"
    };
    window.require = {
        baseUrl: "https://c.disquscdn.com/next/current/embed",
        paths: ["lounge/main", "discovery/main", "remote/config", "common/vendor_extensions/highlight"].reduce(function(a, c) {
            return a[c] = b[c].slice(0, -3),
            a
        }, {})
    };
    var c = a.createElement("script");
    c.onload = function() {
        require(["common/main"], function(a) {
            a.init("lounge", b)
        })
    }
    ,
    c.src = "https://cdn.jsdelivr.net/gh/tingwork/disqus@1.01/common.bundle.js",
    a.body.appendChild(c)
}();
