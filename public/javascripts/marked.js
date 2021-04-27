/**
 * marked - a markdown parser
 * Copyright (c) 2011-2021, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */
 ! function(e, u) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = u() : "function" == typeof define && define.amd ? define(u) : (e = "undefined" != typeof globalThis ? globalThis : e || self).marked = u()
}(this, function() {
    "use strict";

    function r(e, u) {
        for (var t = 0; t < u.length; t++) {
            var n = u[t];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
        }
    }

    function i(e, u) {
        (null == u || u > e.length) && (u = e.length);
        for (var t = 0, n = new Array(u); t < u; t++) n[t] = e[t];
        return n
    }

    function c(e, u) {
        var t;
        if ("undefined" != typeof Symbol && null != e[Symbol.iterator]) return (t = e[Symbol.iterator]()).next.bind(t);
        if (Array.isArray(e) || (t = function(e, u) {
                if (e) {
                    if ("string" == typeof e) return i(e, u);
                    var t = Object.prototype.toString.call(e).slice(8, -1);
                    return "Map" === (t = "Object" === t && e.constructor ? e.constructor.name : t) || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? i(e, u) : void 0
                }
            }(e)) || u && e && "number" == typeof e.length) {
            t && (e = t);
            var n = 0;
            return function() {
                return n >= e.length ? {
                    done: !0
                } : {
                    done: !1,
                    value: e[n++]
                }
            }
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }

    function t(e) {
        return D[e]
    }
    var e, u = (function(u) {
            function e() {
                return {
                    baseUrl: null,
                    breaks: !1,
                    gfm: !0,
                    headerIds: !0,
                    headerPrefix: "",
                    highlight: null,
                    langPrefix: "language-",
                    mangle: !0,
                    pedantic: !1,
                    renderer: null,
                    sanitize: !1,
                    sanitizer: null,
                    silent: !1,
                    smartLists: !1,
                    smartypants: !1,
                    tokenizer: null,
                    walkTokens: null,
                    xhtml: !1
                }
            }
            u.exports = {
                defaults: e(),
                getDefaults: e,
                changeDefaults: function(e) {
                    u.exports.defaults = e
                }
            }
        }(e = {
            exports: {}
        }), e.exports),
        n = /[&<>"']/,
        s = /[&<>"']/g,
        l = /[<>"']|&(?!#?\w+;)/,
        a = /[<>"']|&(?!#?\w+;)/g,
        D = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
    var o = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

    function h(e) {
        return e.replace(o, function(e, u) {
            return "colon" === (u = u.toLowerCase()) ? ":" : "#" === u.charAt(0) ? "x" === u.charAt(1) ? String.fromCharCode(parseInt(u.substring(2), 16)) : String.fromCharCode(+u.substring(1)) : ""
        })
    }
    var p = /(^|[^\[])\^/g;
    var g = /[^\w:]/g,
        f = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    var F = {},
        A = /^[^:]+:\/*[^/]*$/,
        C = /^([^:]+:)[\s\S]*$/,
        d = /^([^:]+:\/*[^/]*)[\s\S]*$/;

    function E(e, u) {
        F[" " + e] || (A.test(e) ? F[" " + e] = e + "/" : F[" " + e] = k(e, "/", !0));
        var t = -1 === (e = F[" " + e]).indexOf(":");
        return "//" === u.substring(0, 2) ? t ? u : e.replace(C, "$1") + u : "/" === u.charAt(0) ? t ? u : e.replace(d, "$1") + u : e + u
    }

    function k(e, u, t) {
        var n = e.length;
        if (0 === n) return "";
        for (var r = 0; r < n;) {
            var i = e.charAt(n - r - 1);
            if (i !== u || t) {
                if (i === u || !t) break;
                r++
            } else r++
        }
        return e.substr(0, n - r)
    }
    var m = function(e, u) {
            if (u) {
                if (n.test(e)) return e.replace(s, t)
            } else if (l.test(e)) return e.replace(a, t);
            return e
        },
        b = h,
        x = function(t, e) {
            t = t.source || t, e = e || "";
            var n = {
                replace: function(e, u) {
                    return u = (u = u.source || u).replace(p, "$1"), t = t.replace(e, u), n
                },
                getRegex: function() {
                    return new RegExp(t, e)
                }
            };
            return n
        },
        B = function(e, u, t) {
            if (e) {
                var n;
                try {
                    n = decodeURIComponent(h(t)).replace(g, "").toLowerCase()
                } catch (e) {
                    return null
                }
                if (0 === n.indexOf("javascript:") || 0 === n.indexOf("vbscript:") || 0 === n.indexOf("data:")) return null
            }
            u && !f.test(t) && (t = E(u, t));
            try {
                t = encodeURI(t).replace(/%25/g, "%")
            } catch (e) {
                return null
            }
            return t
        },
        w = {
            exec: function() {}
        },
        v = function(e) {
            for (var u, t, n = 1; n < arguments.length; n++)
                for (t in u = arguments[n]) Object.prototype.hasOwnProperty.call(u, t) && (e[t] = u[t]);
            return e
        },
        y = function(e) {
            e && e.sanitize && !e.silent && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options")
        },
        _ = function(e, u) {
            if (u < 1) return "";
            for (var t = ""; 1 < u;) 1 & u && (t += e), u >>= 1, e += e;
            return t + e
        },
        z = u.defaults,
        $ = k,
        S = function(e, u) {
            var t = e.replace(/\|/g, function(e, u, t) {
                    for (var n = !1, r = u; 0 <= --r && "\\" === t[r];) n = !n;
                    return n ? "|" : " |"
                }).split(/ \|/),
                n = 0;
            if (t.length > u) t.splice(u);
            else
                for (; t.length < u;) t.push("");
            for (; n < t.length; n++) t[n] = t[n].trim().replace(/\\\|/g, "|");
            return t
        },
        T = m,
        I = function(e, u) {
            if (-1 === e.indexOf(u[1])) return -1;
            for (var t = e.length, n = 0, r = 0; r < t; r++)
                if ("\\" === e[r]) r++;
                else if (e[r] === u[0]) n++;
            else if (e[r] === u[1] && --n < 0) return r;
            return -1
        };

    function R(e, u, t) {
        var n = u.href,
            r = u.title ? T(u.title) : null,
            u = e[1].replace(/\\([\[\]])/g, "$1");
        return "!" !== e[0].charAt(0) ? {
            type: "link",
            raw: t,
            href: n,
            title: r,
            text: u
        } : {
            type: "image",
            raw: t,
            href: n,
            title: r,
            text: T(u)
        }
    }
    var Z = function() {
            function e(e) {
                this.options = e || z
            }
            var u = e.prototype;
            return u.space = function(e) {
                e = this.rules.block.newline.exec(e);
                if (e) return 1 < e[0].length ? {
                    type: "space",
                    raw: e[0]
                } : {
                    raw: "\n"
                }
            }, u.code = function(e) {
                var u = this.rules.block.code.exec(e);
                if (u) {
                    e = u[0].replace(/^ {1,4}/gm, "");
                    return {
                        type: "code",
                        raw: u[0],
                        codeBlockStyle: "indented",
                        text: this.options.pedantic ? e : $(e, "\n")
                    }
                }
            }, u.fences = function(e) {
                var u = this.rules.block.fences.exec(e);
                if (u) {
                    var t = u[0],
                        e = function(e, u) {
                            if (null === (e = e.match(/^(\s+)(?:```)/))) return u;
                            var t = e[1];
                            return u.split("\n").map(function(e) {
                                var u = e.match(/^\s+/);
                                return null !== u && u[0].length >= t.length ? e.slice(t.length) : e
                            }).join("\n")
                        }(t, u[3] || "");
                    return {
                        type: "code",
                        raw: t,
                        lang: u[2] && u[2].trim(),
                        text: e
                    }
                }
            }, u.heading = function(e) {
                var u = this.rules.block.heading.exec(e);
                if (u) {
                    var t = u[2].trim();
                    return /#$/.test(t) && (e = $(t, "#"), !this.options.pedantic && e && !/ $/.test(e) || (t = e.trim())), {
                        type: "heading",
                        raw: u[0],
                        depth: u[1].length,
                        text: t
                    }
                }
            }, u.nptable = function(e) {
                e = this.rules.block.nptable.exec(e);
                if (e) {
                    var u = {
                        type: "table",
                        header: S(e[1].replace(/^ *| *\| *$/g, "")),
                        align: e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                        cells: e[3] ? e[3].replace(/\n$/, "").split("\n") : [],
                        raw: e[0]
                    };
                    if (u.header.length === u.align.length) {
                        for (var t = u.align.length, n = 0; n < t; n++) /^ *-+: *$/.test(u.align[n]) ? u.align[n] = "right" : /^ *:-+: *$/.test(u.align[n]) ? u.align[n] = "center" : /^ *:-+ *$/.test(u.align[n]) ? u.align[n] = "left" : u.align[n] = null;
                        for (t = u.cells.length, n = 0; n < t; n++) u.cells[n] = S(u.cells[n], u.header.length);
                        return u
                    }
                }
            }, u.hr = function(e) {
                e = this.rules.block.hr.exec(e);
                if (e) return {
                    type: "hr",
                    raw: e[0]
                }
            }, u.blockquote = function(e) {
                var u = this.rules.block.blockquote.exec(e);
                if (u) {
                    e = u[0].replace(/^ *> ?/gm, "");
                    return {
                        type: "blockquote",
                        raw: u[0],
                        text: e
                    }
                }
            }, u.list = function(e) {
                e = this.rules.block.list.exec(e);
                if (e) {
                    for (var u, t, n, r, i, s, l = e[0], a = e[2], D = 1 < a.length, o = {
                            type: "list",
                            raw: l,
                            ordered: D,
                            start: D ? +a.slice(0, -1) : "",
                            loose: !1,
                            items: []
                        }, c = e[0].match(this.rules.block.item), h = !1, p = c.length, g = this.rules.block.listItemStart.exec(c[0]), f = 0; f < p; f++) {
                        if (l = u = c[f], this.options.pedantic || (s = u.match(new RegExp("\\n\\s*\\n {0," + (g[0].length - 1) + "}\\S"))) && (t = u.length - s.index + c.slice(f + 1).join("\n").length, o.raw = o.raw.substring(0, o.raw.length - t), l = u = u.substring(0, s.index), p = f + 1), f !== p - 1) {
                            if (n = this.rules.block.listItemStart.exec(c[f + 1]), this.options.pedantic ? n[1].length > g[1].length : n[1].length >= g[0].length || 3 < n[1].length) {
                                c.splice(f, 2, c[f] + (!this.options.pedantic && n[1].length < g[0].length && !c[f].match(/\n$/) ? "" : "\n") + c[f + 1]), f--, p--;
                                continue
                            }(!this.options.pedantic || this.options.smartLists ? n[2][n[2].length - 1] !== a[a.length - 1] : D == (1 === n[2].length)) && (t = c.slice(f + 1).join("\n").length, o.raw = o.raw.substring(0, o.raw.length - t), f = p - 1), g = n
                        }
                        n = u.length, ~(u = u.replace(/^ *([*+-]|\d+[.)]) ?/, "")).indexOf("\n ") && (n -= u.length, u = this.options.pedantic ? u.replace(/^ {1,4}/gm, "") : u.replace(new RegExp("^ {1," + n + "}", "gm"), "")), u = $(u, "\n"), f !== p - 1 && (l += "\n"), n = h || /\n\n(?!\s*$)/.test(l), f !== p - 1 && (h = "\n\n" === l.slice(-2), n = n || h), n && (o.loose = !0), this.options.gfm && (i = void 0, (r = /^\[[ xX]\] /.test(u)) && (i = " " !== u[1], u = u.replace(/^\[[ xX]\] +/, ""))), o.items.push({
                            type: "list_item",
                            raw: l,
                            task: r,
                            checked: i,
                            loose: n,
                            text: u
                        })
                    }
                    return o
                }
            }, u.html = function(e) {
                e = this.rules.block.html.exec(e);
                if (e) return {
                    type: this.options.sanitize ? "paragraph" : "html",
                    raw: e[0],
                    pre: !this.options.sanitizer && ("pre" === e[1] || "script" === e[1] || "style" === e[1]),
                    text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : T(e[0]) : e[0]
                }
            }, u.def = function(e) {
                e = this.rules.block.def.exec(e);
                if (e) return e[3] && (e[3] = e[3].substring(1, e[3].length - 1)), {
                    type: "def",
                    tag: e[1].toLowerCase().replace(/\s+/g, " "),
                    raw: e[0],
                    href: e[2],
                    title: e[3]
                }
            }, u.table = function(e) {
                e = this.rules.block.table.exec(e);
                if (e) {
                    var u = {
                        type: "table",
                        header: S(e[1].replace(/^ *| *\| *$/g, "")),
                        align: e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                        cells: e[3] ? e[3].replace(/\n$/, "").split("\n") : []
                    };
                    if (u.header.length === u.align.length) {
                        u.raw = e[0];
                        for (var t = u.align.length, n = 0; n < t; n++) /^ *-+: *$/.test(u.align[n]) ? u.align[n] = "right" : /^ *:-+: *$/.test(u.align[n]) ? u.align[n] = "center" : /^ *:-+ *$/.test(u.align[n]) ? u.align[n] = "left" : u.align[n] = null;
                        for (t = u.cells.length, n = 0; n < t; n++) u.cells[n] = S(u.cells[n].replace(/^ *\| *| *\| *$/g, ""), u.header.length);
                        return u
                    }
                }
            }, u.lheading = function(e) {
                e = this.rules.block.lheading.exec(e);
                if (e) return {
                    type: "heading",
                    raw: e[0],
                    depth: "=" === e[2].charAt(0) ? 1 : 2,
                    text: e[1]
                }
            }, u.paragraph = function(e) {
                e = this.rules.block.paragraph.exec(e);
                if (e) return {
                    type: "paragraph",
                    raw: e[0],
                    text: "\n" === e[1].charAt(e[1].length - 1) ? e[1].slice(0, -1) : e[1]
                }
            }, u.text = function(e) {
                e = this.rules.block.text.exec(e);
                if (e) return {
                    type: "text",
                    raw: e[0],
                    text: e[0]
                }
            }, u.escape = function(e) {
                e = this.rules.inline.escape.exec(e);
                if (e) return {
                    type: "escape",
                    raw: e[0],
                    text: T(e[1])
                }
            }, u.tag = function(e, u, t) {
                e = this.rules.inline.tag.exec(e);
                if (e) return !u && /^<a /i.test(e[0]) ? u = !0 : u && /^<\/a>/i.test(e[0]) && (u = !1), !t && /^<(pre|code|kbd|script)(\s|>)/i.test(e[0]) ? t = !0 : t && /^<\/(pre|code|kbd|script)(\s|>)/i.test(e[0]) && (t = !1), {
                    type: this.options.sanitize ? "text" : "html",
                    raw: e[0],
                    inLink: u,
                    inRawBlock: t,
                    text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : T(e[0]) : e[0]
                }
            }, u.link = function(e) {
                var u = this.rules.inline.link.exec(e);
                if (u) {
                    var t = u[2].trim();
                    if (!this.options.pedantic && /^</.test(t)) {
                        if (!/>$/.test(t)) return;
                        e = $(t.slice(0, -1), "\\");
                        if ((t.length - e.length) % 2 == 0) return
                    } else {
                        var n = I(u[2], "()"); - 1 < n && (i = (0 === u[0].indexOf("!") ? 5 : 4) + u[1].length + n, u[2] = u[2].substring(0, n), u[0] = u[0].substring(0, i).trim(), u[3] = "")
                    }
                    var r, n = u[2],
                        i = "";
                    return this.options.pedantic ? (r = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n)) && (n = r[1], i = r[3]) : i = u[3] ? u[3].slice(1, -1) : "", n = n.trim(), R(u, {
                        href: (n = /^</.test(n) ? this.options.pedantic && !/>$/.test(t) ? n.slice(1) : n.slice(1, -1) : n) && n.replace(this.rules.inline._escapes, "$1"),
                        title: i && i.replace(this.rules.inline._escapes, "$1")
                    }, u[0])
                }
            }, u.reflink = function(e, u) {
                if ((t = this.rules.inline.reflink.exec(e)) || (t = this.rules.inline.nolink.exec(e))) {
                    e = (t[2] || t[1]).replace(/\s+/g, " ");
                    if ((e = u[e.toLowerCase()]) && e.href) return R(t, e, t[0]);
                    var t = t[0].charAt(0);
                    return {
                        type: "text",
                        raw: t,
                        text: t
                    }
                }
            }, u.emStrong = function(e, u, t) {
                void 0 === t && (t = "");
                var n = this.rules.inline.emStrong.lDelim.exec(e);
                if (n && (!n[3] || !t.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/))) {
                    var r = n[1] || n[2] || "";
                    if (!r || r && ("" === t || this.rules.inline.punctuation.exec(t))) {
                        var i, s = n[0].length - 1,
                            l = s,
                            a = 0,
                            D = "*" === n[0][0] ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
                        for (D.lastIndex = 0, u = u.slice(-1 * e.length + s); null != (n = D.exec(u));)
                            if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6])
                                if (i = i.length, n[3] || n[4]) l += i;
                                else if (!((n[5] || n[6]) && s % 3) || (s + i) % 3) {
                            if (!(0 < (l -= i))) {
                                if (l + a - i <= 0 && !u.slice(D.lastIndex).match(D) && (i = Math.min(i, i + l + a)), Math.min(s, i) % 2) return {
                                    type: "em",
                                    raw: e.slice(0, s + n.index + i + 1),
                                    text: e.slice(1, s + n.index + i)
                                };
                                if (Math.min(s, i) % 2 == 0) return {
                                    type: "strong",
                                    raw: e.slice(0, s + n.index + i + 1),
                                    text: e.slice(2, s + n.index + i - 1)
                                }
                            }
                        } else a += i
                    }
                }
            }, u.codespan = function(e) {
                var u = this.rules.inline.code.exec(e);
                if (u) {
                    var t = u[2].replace(/\n/g, " "),
                        n = /[^ ]/.test(t),
                        e = /^ /.test(t) && / $/.test(t);
                    return n && e && (t = t.substring(1, t.length - 1)), t = T(t, !0), {
                        type: "codespan",
                        raw: u[0],
                        text: t
                    }
                }
            }, u.br = function(e) {
                e = this.rules.inline.br.exec(e);
                if (e) return {
                    type: "br",
                    raw: e[0]
                }
            }, u.del = function(e) {
                e = this.rules.inline.del.exec(e);
                if (e) return {
                    type: "del",
                    raw: e[0],
                    text: e[2]
                }
            }, u.autolink = function(e, u) {
                e = this.rules.inline.autolink.exec(e);
                if (e) {
                    var t, u = "@" === e[2] ? "mailto:" + (t = T(this.options.mangle ? u(e[1]) : e[1])) : t = T(e[1]);
                    return {
                        type: "link",
                        raw: e[0],
                        text: t,
                        href: u,
                        tokens: [{
                            type: "text",
                            raw: t,
                            text: t
                        }]
                    }
                }
            }, u.url = function(e, u) {
                var t, n, r, i;
                if (t = this.rules.inline.url.exec(e)) {
                    if ("@" === t[2]) r = "mailto:" + (n = T(this.options.mangle ? u(t[0]) : t[0]));
                    else {
                        for (; i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])[0], i !== t[0];);
                        n = T(t[0]), r = "www." === t[1] ? "http://" + n : n
                    }
                    return {
                        type: "link",
                        raw: t[0],
                        text: n,
                        href: r,
                        tokens: [{
                            type: "text",
                            raw: n,
                            text: n
                        }]
                    }
                }
            }, u.inlineText = function(e, u, t) {
                e = this.rules.inline.text.exec(e);
                if (e) {
                    t = u ? this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : T(e[0]) : e[0] : T(this.options.smartypants ? t(e[0]) : e[0]);
                    return {
                        type: "text",
                        raw: e[0],
                        text: t
                    }
                }
            }, e
        }(),
        q = w,
        O = x,
        w = v,
        x = {
            newline: /^(?: *(?:\n|$))+/,
            code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
            fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
            hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
            heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
            blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
            list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
            html: "^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",
            def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
            nptable: q,
            table: q,
            lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
            _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
            text: /^[^\n]+/,
            _label: /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,
            _title: /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
        };
    x.def = O(x.def).replace("label", x._label).replace("title", x._title).getRegex(), x.bullet = /(?:[*+-]|\d{1,9}[.)])/, x.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/, x.item = O(x.item, "gm").replace(/bull/g, x.bullet).getRegex(), x.listItemStart = O(/^( *)(bull) */).replace("bull", x.bullet).getRegex(), x.list = O(x.list).replace(/bull/g, x.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + x.def.source + ")").getRegex(), x._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", x._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/, x.html = O(x.html, "i").replace("comment", x._comment).replace("tag", x._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), x.paragraph = O(x._paragraph).replace("hr", x.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", x._tag).getRegex(), x.blockquote = O(x.blockquote).replace("paragraph", x.paragraph).getRegex(), x.normal = w({}, x), x.gfm = w({}, x.normal, {
        nptable: "^ *([^|\\n ].*\\|.*)\\n {0,3}([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
        table: "^ *\\|(.+)\\n {0,3}\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
    }), x.gfm.nptable = O(x.gfm.nptable).replace("hr", x.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", x._tag).getRegex(), x.gfm.table = O(x.gfm.table).replace("hr", x.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", x._tag).getRegex(), x.pedantic = w({}, x.normal, {
        html: O("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", x._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: q,
        paragraph: O(x.normal._paragraph).replace("hr", x.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", x.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
    });
    q = {
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
        url: q,
        tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
        link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
        reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
        nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
        reflinkSearch: "reflink|nolink(?!\\()",
        emStrong: {
            lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
            rDelimAst: /\_\_[^_]*?\*[^_]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
            rDelimUnd: /\*\*[^*]*?\_[^*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
        },
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        br: /^( {2,}|\\)\n(?!\s*$)/,
        del: q,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        punctuation: /^([\spunctuation])/,
        _punctuation: "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~"
    };
    q.punctuation = O(q.punctuation).replace(/punctuation/g, q._punctuation).getRegex(), q.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g, q.escapedEmSt = /\\\*|\\_/g, q._comment = O(x._comment).replace("(?:--\x3e|$)", "--\x3e").getRegex(), q.emStrong.lDelim = O(q.emStrong.lDelim).replace(/punct/g, q._punctuation).getRegex(), q.emStrong.rDelimAst = O(q.emStrong.rDelimAst, "g").replace(/punct/g, q._punctuation).getRegex(), q.emStrong.rDelimUnd = O(q.emStrong.rDelimUnd, "g").replace(/punct/g, q._punctuation).getRegex(), q._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g, q._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/, q._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/, q.autolink = O(q.autolink).replace("scheme", q._scheme).replace("email", q._email).getRegex(), q._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/, q.tag = O(q.tag).replace("comment", q._comment).replace("attribute", q._attribute).getRegex(), q._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, q._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/, q._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/, q.link = O(q.link).replace("label", q._label).replace("href", q._href).replace("title", q._title).getRegex(), q.reflink = O(q.reflink).replace("label", q._label).getRegex(), q.reflinkSearch = O(q.reflinkSearch, "g").replace("reflink", q.reflink).replace("nolink", q.nolink).getRegex(), q.normal = w({}, q), q.pedantic = w({}, q.normal, {
        strong: {
            start: /^__|\*\*/,
            middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
            endAst: /\*\*(?!\*)/g,
            endUnd: /__(?!_)/g
        },
        em: {
            start: /^_|\*/,
            middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
            endAst: /\*(?!\*)/g,
            endUnd: /_(?!_)/g
        },
        link: O(/^!?\[(label)\]\((.*?)\)/).replace("label", q._label).getRegex(),
        reflink: O(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q._label).getRegex()
    }), q.gfm = w({}, q.normal, {
        escape: O(q.escape).replace("])", "~|])").getRegex(),
        _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
        url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
        _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
    }), q.gfm.url = O(q.gfm.url, "i").replace("email", q.gfm._extended_email).getRegex(), q.breaks = w({}, q.gfm, {
        br: O(q.br).replace("{2,}", "*").getRegex(),
        text: O(q.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    });
    var q = {
            block: x,
            inline: q
        },
        j = u.defaults,
        U = q.block,
        P = q.inline,
        L = _;

    function M(e) {
        return e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…")
    }

    function N(e) {
        for (var u, t = "", n = e.length, r = 0; r < n; r++) u = e.charCodeAt(r), t += "&#" + (u = .5 < Math.random() ? "x" + u.toString(16) : u) + ";";
        return t
    }
    var X = function() {
            function t(e) {
                this.tokens = [], this.tokens.links = Object.create(null), this.options = e || j, this.options.tokenizer = this.options.tokenizer || new Z, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options;
                e = {
                    block: U.normal,
                    inline: P.normal
                };
                this.options.pedantic ? (e.block = U.pedantic, e.inline = P.pedantic) : this.options.gfm && (e.block = U.gfm, this.options.breaks ? e.inline = P.breaks : e.inline = P.gfm), this.tokenizer.rules = e
            }
            t.lex = function(e, u) {
                return new t(u).lex(e)
            }, t.lexInline = function(e, u) {
                return new t(u).inlineTokens(e)
            };
            var e, u, n = t.prototype;
            return n.lex = function(e) {
                return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    "), this.blockTokens(e, this.tokens, !0), this.inline(this.tokens), this.tokens
            }, n.blockTokens = function(e, u, t) {
                var n, r, i, s;
                for (void 0 === u && (u = []), void 0 === t && (t = !0), this.options.pedantic && (e = e.replace(/^ +$/gm, "")); e;)
                    if (n = this.tokenizer.space(e)) e = e.substring(n.raw.length), n.type && u.push(n);
                    else if (n = this.tokenizer.code(e)) e = e.substring(n.raw.length), (s = u[u.length - 1]) && "paragraph" === s.type ? (s.raw += "\n" + n.raw, s.text += "\n" + n.text) : u.push(n);
                else if (n = this.tokenizer.fences(e)) e = e.substring(n.raw.length), u.push(n);
                else if (n = this.tokenizer.heading(e)) e = e.substring(n.raw.length), u.push(n);
                else if (n = this.tokenizer.nptable(e)) e = e.substring(n.raw.length), u.push(n);
                else if (n = this.tokenizer.hr(e)) e = e.substring(n.raw.length), u.push(n);
                else if (n = this.tokenizer.blockquote(e)) e = e.substring(n.raw.length), n.tokens = this.blockTokens(n.text, [], t), u.push(n);
                else if (n = this.tokenizer.list(e)) {
                    for (e = e.substring(n.raw.length), i = n.items.length, r = 0; r < i; r++) n.items[r].tokens = this.blockTokens(n.items[r].text, [], !1);
                    u.push(n)
                } else if (n = this.tokenizer.html(e)) e = e.substring(n.raw.length), u.push(n);
                else if (t && (n = this.tokenizer.def(e))) e = e.substring(n.raw.length), this.tokens.links[n.tag] || (this.tokens.links[n.tag] = {
                    href: n.href,
                    title: n.title
                });
                else if (n = this.tokenizer.table(e)) e = e.substring(n.raw.length), u.push(n);
                else if (n = this.tokenizer.lheading(e)) e = e.substring(n.raw.length), u.push(n);
                else if (t && (n = this.tokenizer.paragraph(e))) e = e.substring(n.raw.length), u.push(n);
                else if (n = this.tokenizer.text(e)) e = e.substring(n.raw.length), (s = u[u.length - 1]) && "text" === s.type ? (s.raw += "\n" + n.raw, s.text += "\n" + n.text) : u.push(n);
                else if (e) {
                    var l = "Infinite loop on byte: " + e.charCodeAt(0);
                    if (this.options.silent) {
                        console.error(l);
                        break
                    }
                    throw new Error(l)
                }
                return u
            }, n.inline = function(e) {
                for (var u, t, n, r, i, s = e.length, l = 0; l < s; l++) switch ((i = e[l]).type) {
                    case "paragraph":
                    case "text":
                    case "heading":
                        i.tokens = [], this.inlineTokens(i.text, i.tokens);
                        break;
                    case "table":
                        for (i.tokens = {
                                header: [],
                                cells: []
                            }, n = i.header.length, u = 0; u < n; u++) i.tokens.header[u] = [], this.inlineTokens(i.header[u], i.tokens.header[u]);
                        for (n = i.cells.length, u = 0; u < n; u++)
                            for (r = i.cells[u], i.tokens.cells[u] = [], t = 0; t < r.length; t++) i.tokens.cells[u][t] = [], this.inlineTokens(r[t], i.tokens.cells[u][t]);
                        break;
                    case "blockquote":
                        this.inline(i.tokens);
                        break;
                    case "list":
                        for (n = i.items.length, u = 0; u < n; u++) this.inline(i.items[u].tokens)
                }
                return e
            }, n.inlineTokens = function(e, u, t, n) {
                var r;
                void 0 === u && (u = []), void 0 === t && (t = !1), void 0 === n && (n = !1);
                var i, s, l, a = e;
                if (this.tokens.links) {
                    var D = Object.keys(this.tokens.links);
                    if (0 < D.length)
                        for (; null != (i = this.tokenizer.rules.inline.reflinkSearch.exec(a));) D.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) && (a = a.slice(0, i.index) + "[" + L("a", i[0].length - 2) + "]" + a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))
                }
                for (; null != (i = this.tokenizer.rules.inline.blockSkip.exec(a));) a = a.slice(0, i.index) + "[" + L("a", i[0].length - 2) + "]" + a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
                for (; null != (i = this.tokenizer.rules.inline.escapedEmSt.exec(a));) a = a.slice(0, i.index) + "++" + a.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
                for (; e;)
                    if (s || (l = ""), s = !1, r = this.tokenizer.escape(e)) e = e.substring(r.raw.length), u.push(r);
                    else if (r = this.tokenizer.tag(e, t, n)) {
                    e = e.substring(r.raw.length), t = r.inLink, n = r.inRawBlock;
                    var o = u[u.length - 1];
                    o && "text" === r.type && "text" === o.type ? (o.raw += r.raw, o.text += r.text) : u.push(r)
                } else if (r = this.tokenizer.link(e)) e = e.substring(r.raw.length), "link" === r.type && (r.tokens = this.inlineTokens(r.text, [], !0, n)), u.push(r);
                else if (r = this.tokenizer.reflink(e, this.tokens.links)) {
                    e = e.substring(r.raw.length);
                    o = u[u.length - 1];
                    "link" === r.type ? (r.tokens = this.inlineTokens(r.text, [], !0, n), u.push(r)) : o && "text" === r.type && "text" === o.type ? (o.raw += r.raw, o.text += r.text) : u.push(r)
                } else if (r = this.tokenizer.emStrong(e, a, l)) e = e.substring(r.raw.length), r.tokens = this.inlineTokens(r.text, [], t, n), u.push(r);
                else if (r = this.tokenizer.codespan(e)) e = e.substring(r.raw.length), u.push(r);
                else if (r = this.tokenizer.br(e)) e = e.substring(r.raw.length), u.push(r);
                else if (r = this.tokenizer.del(e)) e = e.substring(r.raw.length), r.tokens = this.inlineTokens(r.text, [], t, n), u.push(r);
                else if (r = this.tokenizer.autolink(e, N)) e = e.substring(r.raw.length), u.push(r);
                else if (t || !(r = this.tokenizer.url(e, N))) {
                    if (r = this.tokenizer.inlineText(e, n, M)) e = e.substring(r.raw.length), "_" !== r.raw.slice(-1) && (l = r.raw.slice(-1)), s = !0, (c = u[u.length - 1]) && "text" === c.type ? (c.raw += r.raw, c.text += r.text) : u.push(r);
                    else if (e) {
                        var c = "Infinite loop on byte: " + e.charCodeAt(0);
                        if (this.options.silent) {
                            console.error(c);
                            break
                        }
                        throw new Error(c)
                    }
                } else e = e.substring(r.raw.length), u.push(r);
                return u
            }, e = t, u = [{
                key: "rules",
                get: function() {
                    return {
                        block: U,
                        inline: P
                    }
                }
            }], (n = null) && r(e.prototype, n), u && r(e, u), t
        }(),
        G = u.defaults,
        V = B,
        H = m,
        J = function() {
            function e(e) {
                this.options = e || G
            }
            var u = e.prototype;
            return u.code = function(e, u, t) {
                var n = (u || "").match(/\S*/)[0];
                return !this.options.highlight || null != (u = this.options.highlight(e, n)) && u !== e && (t = !0, e = u), e = e.replace(/\n$/, "") + "\n", n ? '<pre><code class="' + this.options.langPrefix + H(n, !0) + '">' + (t ? e : H(e, !0)) + "</code></pre>\n" : "<pre><code>" + (t ? e : H(e, !0)) + "</code></pre>\n"
            }, u.blockquote = function(e) {
                return "<blockquote class='blockquote'>\n" + e + "</blockquote>\n"
            }, u.html = function(e) {
                return e
            }, u.heading = function(e, u, t, n) {
                return this.options.headerIds ? "<h" + u + ' id="' + this.options.headerPrefix + n.slug(t) + '">' + e + "</h" + u + ">\n" : "<h" + u + ">" + e + "</h" + u + ">\n"
            }, u.hr = function() {
                return this.options.xhtml ? "<hr/>\n" : "<hr>\n"
            }, u.list = function(e, u, t) {
                var n = u ? "ol" : "ul";
                return "<" + n + (u && 1 !== t ? ' start="' + t + '"' : "") + ">\n" + e + "</" + n + ">\n"
            }, u.listitem = function(e) {
                return "<li>" + e + "</li>\n"
            }, u.checkbox = function(e) {
                return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> "
            }, u.paragraph = function(e) {
                return "<p>" + e + "</p>\n"
            }, u.table = function(e, u) {
                return "<table>\n<thead>\n" + e + "</thead>\n" + (u = u && "<tbody>" + u + "</tbody>") + "</table>\n"
            }, u.tablerow = function(e) {
                return "<tr>\n" + e + "</tr>\n"
            }, u.tablecell = function(e, u) {
                var t = u.header ? "th" : "td";
                return (u.align ? "<" + t + ' align="' + u.align + '">' : "<" + t + ">") + e + "</" + t + ">\n"
            }, u.strong = function(e) {
                return "<strong>" + e + "</strong>"
            }, u.em = function(e) {
                return "<em>" + e + "</em>"
            }, u.codespan = function(e) {
                return "<code>" + e + "</code>"
            }, u.br = function() {
                return this.options.xhtml ? "<br/>" : "<br>"
            }, u.del = function(e) {
                return "<del>" + e + "</del>"
            }, u.link = function(e, u, t) {
                if (null === (e = V(this.options.sanitize, this.options.baseUrl, e))) return t;
                e = '<a target="_blank" href="' + H(e) + '"';
                return u && (e += ' title="' + u + '"'), e += ">" + t + "</a>"
            }, u.image = function(e, u, t) {
                if (null === (e = V(this.options.sanitize, this.options.baseUrl, e))) return t;
                t = '<img style="max-width: 530px" src="' + e + '" alt="' + t + '"';
                return u && (t += ' title="' + u + '"'), t += this.options.xhtml ? "/>" : ">"
            }, u.text = function(e) {
                return e
            }, e
        }(),
        K = function() {
            function e() {}
            var u = e.prototype;
            return u.strong = function(e) {
                return e
            }, u.em = function(e) {
                return e
            }, u.codespan = function(e) {
                return e
            }, u.del = function(e) {
                return e
            }, u.html = function(e) {
                return e
            }, u.text = function(e) {
                return e
            }, u.link = function(e, u, t) {
                return "" + t
            }, u.image = function(e, u, t) {
                return "" + t
            }, u.br = function() {
                return ""
            }, e
        }(),
        Q = function() {
            function e() {
                this.seen = {}
            }
            var u = e.prototype;
            return u.serialize = function(e) {
                return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-")
            }, u.getNextSafeSlug = function(e, u) {
                var t = e,
                    n = 0;
                if (this.seen.hasOwnProperty(t))
                    for (n = this.seen[e]; t = e + "-" + ++n, this.seen.hasOwnProperty(t););
                return u || (this.seen[e] = n, this.seen[t] = 0), t
            }, u.slug = function(e, u) {
                void 0 === u && (u = {});
                var t = this.serialize(e);
                return this.getNextSafeSlug(t, u.dryrun)
            }, e
        }(),
        W = u.defaults,
        Y = b,
        ee = function() {
            function t(e) {
                this.options = e || W, this.options.renderer = this.options.renderer || new J, this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new K, this.slugger = new Q
            }
            t.parse = function(e, u) {
                return new t(u).parse(e)
            }, t.parseInline = function(e, u) {
                return new t(u).parseInline(e)
            };
            var e = t.prototype;
            return e.parse = function(e, u) {
                void 0 === u && (u = !0);
                for (var t, n, r, i, s, l, a, D, o, c, h, p, g, f, F, A = "", C = e.length, d = 0; d < C; d++) switch ((D = e[d]).type) {
                    case "space":
                        continue;
                    case "hr":
                        A += this.renderer.hr();
                        continue;
                    case "heading":
                        A += this.renderer.heading(this.parseInline(D.tokens), D.depth, Y(this.parseInline(D.tokens, this.textRenderer)), this.slugger);
                        continue;
                    case "code":
                        A += this.renderer.code(D.text, D.lang, D.escaped);
                        continue;
                    case "table":
                        for (l = o = "", r = D.header.length, t = 0; t < r; t++) l += this.renderer.tablecell(this.parseInline(D.tokens.header[t]), {
                            header: !0,
                            align: D.align[t]
                        });
                        for (o += this.renderer.tablerow(l), a = "", r = D.cells.length, t = 0; t < r; t++) {
                            for (l = "", i = (s = D.tokens.cells[t]).length, n = 0; n < i; n++) l += this.renderer.tablecell(this.parseInline(s[n]), {
                                header: !1,
                                align: D.align[n]
                            });
                            a += this.renderer.tablerow(l)
                        }
                        A += this.renderer.table(o, a);
                        continue;
                    case "blockquote":
                        a = this.parse(D.tokens), A += this.renderer.blockquote(a);
                        continue;
                    case "list":
                        for (o = D.ordered, E = D.start, c = D.loose, r = D.items.length, a = "", t = 0; t < r; t++) g = (p = D.items[t]).checked, f = p.task, h = "", p.task && (F = this.renderer.checkbox(g), c ? 0 < p.tokens.length && "text" === p.tokens[0].type ? (p.tokens[0].text = F + " " + p.tokens[0].text, p.tokens[0].tokens && 0 < p.tokens[0].tokens.length && "text" === p.tokens[0].tokens[0].type && (p.tokens[0].tokens[0].text = F + " " + p.tokens[0].tokens[0].text)) : p.tokens.unshift({
                            type: "text",
                            text: F
                        }) : h += F), h += this.parse(p.tokens, c), a += this.renderer.listitem(h, f, g);
                        A += this.renderer.list(a, o, E);
                        continue;
                    case "html":
                        A += this.renderer.html(D.text);
                        continue;
                    case "paragraph":
                        A += this.renderer.paragraph(this.parseInline(D.tokens));
                        continue;
                    case "text":
                        for (a = D.tokens ? this.parseInline(D.tokens) : D.text; d + 1 < C && "text" === e[d + 1].type;) a += "\n" + ((D = e[++d]).tokens ? this.parseInline(D.tokens) : D.text);
                        A += u ? this.renderer.paragraph(a) : a;
                        continue;
                    default:
                        var E = 'Token with "' + D.type + '" type was not found.';
                        if (this.options.silent) return void console.error(E);
                        throw new Error(E)
                }
                return A
            }, e.parseInline = function(e, u) {
                u = u || this.renderer;
                for (var t, n = "", r = e.length, i = 0; i < r; i++) switch ((t = e[i]).type) {
                    case "escape":
                        n += u.text(t.text);
                        break;
                    case "html":
                        n += u.html(t.text);
                        break;
                    case "link":
                        n += u.link(t.href, t.title, this.parseInline(t.tokens, u));
                        break;
                    case "image":
                        n += u.image(t.href, t.title, t.text);
                        break;
                    case "strong":
                        n += u.strong(this.parseInline(t.tokens, u));
                        break;
                    case "em":
                        n += u.em(this.parseInline(t.tokens, u));
                        break;
                    case "codespan":
                        n += u.codespan(t.text);
                        break;
                    case "br":
                        n += u.br();
                        break;
                    case "del":
                        n += u.del(this.parseInline(t.tokens, u));
                        break;
                    case "text":
                        n += u.text(t.text);
                        break;
                    default:
                        var s = 'Token with "' + t.type + '" type was not found.';
                        if (this.options.silent) return void console.error(s);
                        throw new Error(s)
                }
                return n
            }, t
        }(),
        ue = v,
        te = y,
        ne = m,
        m = u.getDefaults,
        re = u.changeDefaults,
        u = u.defaults;

    function ie(e, t, n) {
        if (null == e) throw new Error("marked(): input parameter is undefined or null");
        if ("string" != typeof e) throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected");
        if ("function" == typeof t && (n = t, t = null), t = ue({}, ie.defaults, t || {}), te(t), n) {
            var r, i = t.highlight;
            try {
                r = X.lex(e, t)
            } catch (e) {
                return n(e)
            }
            var s = function(u) {
                var e;
                if (!u) try {
                    e = ee.parse(r, t)
                } catch (e) {
                    u = e
                }
                return t.highlight = i, u ? n(u) : n(null, e)
            };
            if (!i || i.length < 3) return s();
            if (delete t.highlight, !r.length) return s();
            var l = 0;
            return ie.walkTokens(r, function(t) {
                "code" === t.type && (l++, setTimeout(function() {
                    i(t.text, t.lang, function(e, u) {
                        return e ? s(e) : (null != u && u !== t.text && (t.text = u, t.escaped = !0), void(0 === --l && s()))
                    })
                }, 0))
            }), void(0 === l && s())
        }
        try {
            var u = X.lex(e, t);
            return t.walkTokens && ie.walkTokens(u, t.walkTokens), ee.parse(u, t)
        } catch (e) {
            if (e.message += "\nPlease report this to https://github.com/markedjs/marked.", t.silent) return "<p>An error occurred:</p><pre>" + ne(e.message + "", !0) + "</pre>";
            throw e
        }
    }
    return ie.options = ie.setOptions = function(e) {
        return ue(ie.defaults, e), re(ie.defaults), ie
    }, ie.getDefaults = m, ie.defaults = u, ie.use = function(l) {
        var u, t = ue({}, l);
        l.renderer && function() {
            var e, s = ie.defaults.renderer || new J;
            for (e in l.renderer) ! function(r) {
                var i = s[r];
                s[r] = function() {
                    for (var e = arguments.length, u = new Array(e), t = 0; t < e; t++) u[t] = arguments[t];
                    var n = l.renderer[r].apply(s, u);
                    return n = !1 === n ? i.apply(s, u) : n
                }
            }(e);
            t.renderer = s
        }(), l.tokenizer && function() {
            var e, s = ie.defaults.tokenizer || new Z;
            for (e in l.tokenizer) ! function(r) {
                var i = s[r];
                s[r] = function() {
                    for (var e = arguments.length, u = new Array(e), t = 0; t < e; t++) u[t] = arguments[t];
                    var n = l.tokenizer[r].apply(s, u);
                    return n = !1 === n ? i.apply(s, u) : n
                }
            }(e);
            t.tokenizer = s
        }(), l.walkTokens && (u = ie.defaults.walkTokens, t.walkTokens = function(e) {
            l.walkTokens(e), u && u(e)
        }), ie.setOptions(t)
    }, ie.walkTokens = function(e, u) {
        for (var t, n = c(e); !(t = n()).done;) {
            var r = t.value;
            switch (u(r), r.type) {
                case "table":
                    for (var i = c(r.tokens.header); !(s = i()).done;) {
                        var s = s.value;
                        ie.walkTokens(s, u)
                    }
                    for (var l, a = c(r.tokens.cells); !(l = a()).done;)
                        for (var D = c(l.value); !(o = D()).done;) {
                            var o = o.value;
                            ie.walkTokens(o, u)
                        }
                    break;
                case "list":
                    ie.walkTokens(r.items, u);
                    break;
                default:
                    r.tokens && ie.walkTokens(r.tokens, u)
            }
        }
    }, ie.parseInline = function(e, u) {
        if (null == e) throw new Error("marked.parseInline(): input parameter is undefined or null");
        if ("string" != typeof e) throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected");
        u = ue({}, ie.defaults, u || {}), te(u);
        try {
            var t = X.lexInline(e, u);
            return u.walkTokens && ie.walkTokens(t, u.walkTokens), ee.parseInline(t, u)
        } catch (e) {
            if (e.message += "\nPlease report this to https://github.com/markedjs/marked.", u.silent) return "<p>An error occurred:</p><pre>" + ne(e.message + "", !0) + "</pre>";
            throw e
        }
    }, ie.Parser = ee, ie.parser = ee.parse, ie.Renderer = J, ie.TextRenderer = K, ie.Lexer = X, ie.lexer = X.lex, ie.Tokenizer = Z, ie.Slugger = Q, ie.parse = ie
});