/**
 * Created by Prashant on 07/22/2016.
 */
(function (E, d) {
    'use strict';
    function y(t, l, g) {
        return {
            restrict: "ECA", terminal: !0, priority: 400, transclude: "element", link: function (b, e, a, c, k) {
                function p() {
                    m && (g.cancel(m), m = null);
                    h && (h.$destroy(), h = null);
                    n && (m = g.leave(n), m.then(function () {
                        m = null
                    }), n = null)
                }

                function B() {
                    var a = t.current && t.current.locals;
                    if (d.isDefined(a && a.$template)) {
                        var a = b.$new(), c = t.current;
                        n = k(a, function (a) {
                            g.enter(a, null, n || e).then(function () {
                                !d.isDefined(A) || A && !b.$eval(A) || l()
                            });
                            p()
                        });
                        h = c.scope = a;
                        h.$emit("$viewContentLoaded");
                        h.$eval(s)
                    } else p()
                }

                var h, n, m, A = a.autoscroll, s = a.onload || "";
                b.$on("$routeChangeSuccess", B);
                B()
            }
        }
    }

    function w(d, l, g) {
        return {
            restrict: "ECA", priority: -400, link: function (b, e) {
                var a = g.current, c = a.locals;
                e.html(c.$template);
                var k = d(e.contents());
                if (a.controller) {
                    c.$scope = b;
                    var p = l(a.controller, c);
                    a.controllerAs && (b[a.controllerAs] = p);
                    e.data("$ngControllerController", p);
                    e.children().data("$ngControllerController", p)
                }
                b[a.resolveAs || "$resolve"] = c;
                k(b)
            }
        }
    }

    var x, C, s = d.module("ngRoute", ["ng"]).provider("$route",
        function () {
            function t(b, e) {
                return d.extend(Object.create(b), e)
            }

            function l(b, d) {
                var a = d.caseInsensitiveMatch, c = {originalPath: b, regexp: b}, g = c.keys = [];
                b = b.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g, function (b, a, d, c) {
                    b = "?" === c || "*?" === c ? "?" : null;
                    c = "*" === c || "*?" === c ? "*" : null;
                    g.push({name: d, optional: !!b});
                    a = a || "";
                    return "" + (b ? "" : a) + "(?:" + (b ? a : "") + (c && "(.+?)" || "([^/]+)") + (b || "") + ")" + (b || "")
                }).replace(/([\/$\*])/g, "\\$1");
                c.regexp = new RegExp("^" + b + "$", a ? "i" : "");
                return c
            }

            x = d.isArray;
            C =
                d.isObject;
            var g = {};
            this.when = function (b, e) {
                var a;
                a = void 0;
                if (x(e)) {
                    a = a || [];
                    for (var c = 0, k = e.length; c < k; c++)a[c] = e[c]
                } else if (C(e))for (c in a = a || {}, e)if ("$" !== c.charAt(0) || "$" !== c.charAt(1))a[c] = e[c];
                a = a || e;
                d.isUndefined(a.reloadOnSearch) && (a.reloadOnSearch = !0);
                d.isUndefined(a.caseInsensitiveMatch) && (a.caseInsensitiveMatch = this.caseInsensitiveMatch);
                g[b] = d.extend(a, b && l(b, a));
                b && (c = "/" == b[b.length - 1] ? b.substr(0, b.length - 1) : b + "/", g[c] = d.extend({redirectTo: b}, l(c, a)));
                return this
            };
            this.caseInsensitiveMatch = !1;
            this.otherwise = function (b) {
                "string" === typeof b && (b = {redirectTo: b});
                this.when(null, b);
                return this
            };
            this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$templateRequest", "$sce", function (b, e, a, c, k, p, l) {
                function h(a) {
                    var f = v.current;
                    (x = (r = y()) && f && r.$$route === f.$$route && d.equals(r.pathParams, f.pathParams) && !r.reloadOnSearch && !z) || !f && !r || b.$broadcast("$routeChangeStart", r, f).defaultPrevented && a && a.preventDefault()
                }

                function n() {
                    var u = v.current, f = r;
                    if (x)u.params = f.params, d.copy(u.params,
                        a), b.$broadcast("$routeUpdate", u); else if (f || u)z = !1, (v.current = f) && f.redirectTo && (d.isString(f.redirectTo) ? e.path(w(f.redirectTo, f.params)).search(f.params).replace() : e.url(f.redirectTo(f.pathParams, e.path(), e.search())).replace()), c.when(f).then(m).then(function (c) {
                        f == v.current && (f && (f.locals = c, d.copy(f.params, a)), b.$broadcast("$routeChangeSuccess", f, u))
                    }, function (a) {
                        f == v.current && b.$broadcast("$routeChangeError", f, u, a)
                    })
                }

                function m(a) {
                    if (a) {
                        var b = d.extend({}, a.resolve);
                        d.forEach(b, function (a, c) {
                            b[c] =
                                d.isString(a) ? k.get(a) : k.invoke(a, null, null, c)
                        });
                        a = s(a);
                        d.isDefined(a) && (b.$template = a);
                        return c.all(b)
                    }
                }

                function s(a) {
                    var b, c;
                    d.isDefined(b = a.template) ? d.isFunction(b) && (b = b(a.params)) : d.isDefined(c = a.templateUrl) && (d.isFunction(c) && (c = c(a.params)), d.isDefined(c) && (a.loadedTemplateUrl = l.valueOf(c), b = p(c)));
                    return b
                }

                function y() {
                    var a, b;
                    d.forEach(g, function (c, g) {
                        var q;
                        if (q = !b) {
                            var h = e.path();
                            q = c.keys;
                            var l = {};
                            if (c.regexp)if (h = c.regexp.exec(h)) {
                                for (var k = 1, p = h.length; k < p; ++k) {
                                    var m = q[k - 1], n = h[k];
                                    m &&
                                    n && (l[m.name] = n)
                                }
                                q = l
                            } else q = null; else q = null;
                            q = a = q
                        }
                        q && (b = t(c, {params: d.extend({}, e.search(), a), pathParams: a}), b.$$route = c)
                    });
                    return b || g[null] && t(g[null], {params: {}, pathParams: {}})
                }

                function w(a, b) {
                    var c = [];
                    d.forEach((a || "").split(":"), function (a, d) {
                        if (0 === d)c.push(a); else {
                            var e = a.match(/(\w+)(?:[?*])?(.*)/), g = e[1];
                            c.push(b[g]);
                            c.push(e[2] || "");
                            delete b[g]
                        }
                    });
                    return c.join("")
                }

                var z = !1, r, x, v = {
                    routes: g, reload: function () {
                        z = !0;
                        var a = {
                            defaultPrevented: !1, preventDefault: function () {
                                this.defaultPrevented = !0;
                                z = !1
                            }
                        };
                        b.$evalAsync(function () {
                            h(a);
                            a.defaultPrevented || n()
                        })
                    }, updateParams: function (a) {
                        if (this.current && this.current.$$route)a = d.extend({}, this.current.params, a), e.path(w(this.current.$$route.originalPath, a)), e.search(a); else throw D("norout");
                    }
                };
                b.$on("$locationChangeStart", h);
                b.$on("$locationChangeSuccess", n);
                return v
            }]
        }), D = d.$$minErr("ngRoute");
    s.provider("$routeParams", function () {
        this.$get = function () {
            return {}
        }
    });
    s.directive("ngView", y);
    s.directive("ngView", w);
    y.$inject = ["$route", "$anchorScroll",
        "$animate"];
    w.$inject = ["$compile", "$controller", "$route"]
})(window, window.angular);
var app = angular.module("triptrego", ['ngRoute']);
app.controller("productDisplayCtrl", function ($scope) {
    $scope.packages = [{
        "id": "1",
        "name": "Shimla 3N/4D",
        "subtitle": "Holiday",
        "img": "shimla-tour-package.JPG",
        "img1": "shimla-tour-package2.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "day": "4",
        "night": "3",
        "cost": "4,999",
        "places": ["Shimla"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "2",
        "name": "Hill station special",
        "subtitle": "Kasuali Holiday ",
        "img": "kasauli-tour-package1.jpg",
        "img1": "kasauli-tour-package3.jpg",
        "img2": "kasauli-tour-package1.jpg",
        "img3": "kasauli-tour-package2.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Kasuali",
        "day": "3",
        "night": "2",
        "cost": "4,999",
        "places": ["Kasauli"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "3",
        "name": "Special Himachal ",
        "subtitle": "Exotic",
        "img": "Dalhousie-tour-package1.jpg",
        "img1": "Dalhousie-tour-package.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Manali",
        "day": "9",
        "night": "8",
        "cost": "20,999",
        "places": ["Dharamshala", "Mcleod Ganj", "Dalhousie", "Khajjiar", "Kullu Manali"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "4",
        "name": "Manali 3N/4D",
        "subtitle": "Holiday",
        "img": "dharamshala-tour-package.jpg",
        "img1": "dharamshala-tour-package1.jpg",
        "img2": "dharamshala-tour-package2.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Manali",
        "end": "Manikarh",
        "day": "4",
        "night": "3",
        "cost": "6,999",
        "places": ["Dharamshala", "Kasol", "Manikaran"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "5",
        "name": "Monsoon Special",
        "subtitle": "Exotic Himachal",
        "img": "dharamshala-tour-package2.jpg",
        "img1": "shimla-tour-package2.jpg",
        "img2": "dharamshala-tour-package1.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Khajjiar",
        "day": "7",
        "night": "6",
        "cost": "11,999",
        "places": ["Shimla", "Dharamshala", "Mcleod Ganj", "Dalhousie", "Khajjiar"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "6",
        "name": "Hill station special",
        "subtitle": "Kasol Holiday ",
        "img": "kasol-tour-package2.jpg",
        "img1": "kasol-tour-package1.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "kasol-tour-package.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Kasol",
        "end": "Manikaran",
        "day": "3",
        "night": "2",
        "cost": "4,999",
        "places": ["Kasol", "Manikaran"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "11",
        "name": "Summer Holiday Special Exotic",
        "subtitle": "Kullu Manali ",
        "img": "manali-tour-package2.jpg",
        "img1": "manali-package-tour1.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "manali-package-tour.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Kullu",
        "end": "Manali",
        "day": "5",
        "night": "4",
        "cost": "8,999",
        "places": ["Kullu", "Manali"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {
            "name": "Sightseeing",
            "img": "forest.png"
        }, {"name": "River Crossing", "img": "stick-man-with-helm.png"}, {"name": "Rafting", "img": "canoe.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "7",
        "name": "Summer Holiday Special",
        "subtitle": "Shimla, Kasuali",
        "img": "shimla-tour-package3.jpg",
        "img1": "shimla-tour-package2.jpg",
        "img2": "kasauli-tour-package1.jpg",
        "img3": "dharamshala-tour-package1.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Kasuali",
        "day": "5",
        "night": "4",
        "cost": "6,999",
        "places": ["Shimla", "Kasauli"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "8",
        "name": "Summer Holiday Special",
        "subtitle": "Shimla, Dharamshala",
        "img": "mcleodganj-tour-package1.jpg",
        "img1": "mcleodganj-tour-package.jpg",
        "img2": "dharamshala-tour-package2.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Mcleod Ganj",
        "day": "5",
        "night": "4",
        "cost": "7,999",
        "places": ["Shimla", "Dharamshala", "Mcleod Ganj"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "9",
        "name": "Summer Holiday Special",
        "subtitle": " Shimla, Kullu Manali ",
        "img": "manali-tour-package1.jpg",
        "img1": "manali-tour-package.jpg",
        "img2": "manali-tour-package.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Kullu Manali",
        "day": "5",
        "night": "4",
        "cost": "8,999",
        "places": ["Shimla", "Kullu Manali"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "10",
        "name": "Summer Holiday Special",
        "subtitle": "Dharamshala, Dalhousie",
        "img": "Dalhousie-tour-package1.jpg",
        "img1": "shimla-tour-package2.jpg",
        "img2": "shimla-tour-package.JPG",
        "img3": "dharamshala-tour-package2.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Dharamshala",
        "end": "Khajjiar",
        "day": "6",
        "night": "5",
        "cost": "9,999",
        "places": ["Dharamshala", "Mcleod Ganj", "Dalhousie", "Khajjiar"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "14",
        "name": "Manali 4N/5D",
        "subtitle": "Campfire",
        "img": "manali-tour-package3.jpg",
        "img1": "manali-tour-package1.jpg",
        "img2": "manali-tour-package2.jpg",
        "img3": "manali-tour-package.jpg",
        "category": "Adventure Tour Package",
        "cat": true,
        "start": "Manali",
        "end": "Kullu",
        "day": "4",
        "night": "5",
        "cost": "6,500",
        "places": ["Manali", "Kullu"],
        "activities": [{"name": "Rafting", "img": "canoe.png"}, {
            "name": "River Crossing",
            "img": "stick-man-with-helm.png"
        }, {"name": "Transfers", "img": "car.png"}, {
            "name": "Sightseeing",
            "img": "forest.png"
        }, {"name": "Paragliding", "img": "parachutist.png"}, {"name": "Campfire", "img": "campfire.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "13",
        "name": "Summer Holiday Special",
        "subtitle": "Kullu Manali ",
        "img": "kasol-tour-package1.jpg",
        "img1": "manali-package-tour3.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "manali-package-tour.jpg",
        "category": "Adventure Tour Package",
        "cat": true,
        "start": "Manali",
        "end": "Kasol",
        "day": "7",
        "night": "6",
        "cost": "12,999",
        "places": ["Manali", "Kullu", "Kasol"],
        "activities": [{"name": "Rafting", "img": "canoe.png"}, {
            "name": "River Crossing",
            "img": "stick-man-with-helm.png"
        }, {"name": "Transfers", "img": "car.png"}, {
            "name": "Sightseeing",
            "img": "forest.png"
        }, {"name": "Paragliding", "img": "parachutist.png"}, {"name": "Campfire*", "img": "campfire.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "12",
        "name": "Summer Holiday Special",
        "subtitle": "Shimla, Kullu Manali ",
        "img": "manali-package-tour3.jpg",
        "img1": "manali-package-tour.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "manali-package-tour1.jpg",
        "category": "Adventure Tour Package",
        "cat": true,
        "start": "Shimla",
        "end": "Manali",
        "day": "7",
        "night": "6",
        "cost": "13,999",
        "places": ["Kullu", "Manali"],
        "activities": [{"name": "Rafting", "img": "canoe.png"}, {
            "name": "River Crossing",
            "img": "stick-man-with-helm.png"
        }, {"name": "Transfers", "img": "car.png"}, {
            "name": "Sightseeing",
            "img": "forest.png"
        }, {"name": "Paragliding", "img": "parachutist.png"}, {"name": "Campfire*", "img": "campfire.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }];
    $scope.values = [{
        "title": "Destination specialists",
        "img": "img/customized%20tours-why%20us.jpg",
        "desc": "Our core mantra for long lasting customer relationship is our uncompromising quality services."
    }, {
        "title": "Customized Tours",
        "img": "img/desti%20expert-why%20us.jpg",
        "desc": "Our repeating customers is the key to attest our steadfastness and devotion to serve your Dream Holidays."
    }, {
        "title": "Highly trained tour leaders",
        "img": "img/trained%20-why%20us.jpg",
        "desc": "Live with memories lingering and not with leftover dreams ! Pick the offbeat, with experience journeys ! Let's go off the regular sight-seeings !"
    }, {
        "title": "Great Value for Money",
        "img": "img/value%20for%20money-why%20us.jpg",
        "desc": "Time is money; the underlying principle drives us to prompt our responses for your Dream Holidays, not only pre-tour, but on the tour as well as post tour services."
    }];
    $scope.viewWidth = window.innerWidth;
});
app.controller('productCtrl', function ($scope, $routeParams) {
    $scope.cid = $routeParams.id;
    $scope.packages = [{
        "id": "1",
        "name": "Shimla 3N/4D",
        "subtitle": "Holiday",
        "img": "shimla-tour-package.JPG",
        "img1": "shimla-tour-package2.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "day": "4",
        "night": "3",
        "cost": "4,999",
        "places": ["Shimla"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "2",
        "name": "Hill station special",
        "subtitle": "Kasuali Holiday ",
        "img": "kasauli-tour-package1.jpg",
        "img1": "kasauli-tour-package3.jpg",
        "img2": "kasauli-tour-package1.jpg",
        "img3": "kasauli-tour-package2.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Kasuali",
        "day": "3",
        "night": "2",
        "cost": "4,999",
        "places": ["Kasauli"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "3",
        "name": "Special Himachal ",
        "subtitle": "Exotic",
        "img": "Dalhousie-tour-package1.jpg",
        "img1": "Dalhousie-tour-package.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Manali",
        "day": "9",
        "night": "8",
        "cost": "20,999",
        "places": ["Dharamshala", "Mcleod Ganj", "Dalhousie", "Khajjiar", "Kullu Manali"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "4",
        "name": "Manali 3N/4D",
        "subtitle": "Holiday",
        "img": "dharamshala-tour-package.jpg",
        "img1": "dharamshala-tour-package1.jpg",
        "img2": "dharamshala-tour-package2.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Manali",
        "end": "Manikarh",
        "day": "4",
        "night": "3",
        "cost": "6,999",
        "places": ["Dharamshala", "Kasol", "Manikaran"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "5",
        "name": "Monsoon Special",
        "subtitle": "Exotic Himachal",
        "img": "dharamshala-tour-package2.jpg",
        "img1": "shimla-tour-package2.jpg",
        "img2": "dharamshala-tour-package1.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Khajjiar",
        "day": "7",
        "night": "6",
        "cost": "11,999",
        "places": ["Shimla", "Dharamshala", "Mcleod Ganj", "Dalhousie", "Khajjiar"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "6",
        "name": "Hill station special",
        "subtitle": "Kasol Holiday ",
        "img": "kasol-tour-package2.jpg",
        "img1": "kasol-tour-package1.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "kasol-tour-package.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Kasol",
        "end": "Manikaran",
        "day": "3",
        "night": "2",
        "cost": "4,999",
        "places": ["Kasol", "Manikaran"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "7",
        "name": "Summer Holiday Special",
        "subtitle": "Shimla, Kasuali",
        "img": "shimla-tour-package3.jpg",
        "img1": "shimla-tour-package2.jpg",
        "img2": "kasauli-tour-package1.jpg",
        "img3": "dharamshala-tour-package1.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Kasuali",
        "day": "5",
        "night": "4",
        "cost": "6,999",
        "places": ["Shimla", "Kasauli"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "8",
        "name": "Summer Holiday Special",
        "subtitle": "Shimla, Dharamshala",
        "img": "mcleodganj-tour-package1.jpg",
        "img1": "mcleodganj-tour-package.jpg",
        "img2": "dharamshala-tour-package2.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Mcleod Ganj",
        "day": "5",
        "night": "4",
        "cost": "7,999",
        "places": ["Shimla", "Dharamshala", "Mcleod Ganj"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "9",
        "name": "Summer Holiday Special",
        "subtitle": " Shimla, Kullu Manali ",
        "img": "manali-tour-package1.jpg",
        "img1": "manali-tour-package.jpg",
        "img2": "manali-tour-package.jpg",
        "img3": "shimla-tour-package3.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Shimla",
        "end": "Kullu Manali",
        "day": "5",
        "night": "4",
        "cost": "8,999",
        "places": ["Shimla", "Kullu Manali"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "10",
        "name": "Summer Holiday Special",
        "subtitle": "Dharamshala,Dalhousie",
        "img": "Dalhousie-tour-package1.jpg",
        "img1": "shimla-tour-package2.jpg",
        "img2": "shimla-tour-package.JPG",
        "img3": "dharamshala-tour-package2.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Dharamshala",
        "end": "Khajjiar",
        "day": "6",
        "night": "5",
        "cost": "9,999",
        "places": ["Dharamshala", "Mcleod Ganj", "Dalhousie", "Khajjiar"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {"name": "Sightseeing", "img": "forest.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "11",
        "name": "Summer Holiday Special Exotic",
        "subtitle": "Kullu Manali ",
        "img": "manali-tour-package2.jpg",
        "img1": "manali-package-tour1.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "manali-package-tour.jpg",
        "category": "Tour Package",
        "cat": false,
        "start": "Kullu",
        "end": "Manali",
        "day": "5",
        "night": "4",
        "cost": "8,999",
        "places": ["Kullu", "Manali"],
        "activities": [{"name": "Transfers", "img": "car.png"}, {
            "name": "Sightseeing",
            "img": "forest.png"
        }, {"name": "River Crossing", "img": "stick-man-with-helm.png"}, {"name": "Rafting", "img": "canoe.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "14",
        "name": "Manali 4N/5D",
        "subtitle": "Campfire",
        "img": "manali-tour-package3.jpg",
        "img1": "manali-tour-package1.jpg",
        "img2": "manali-tour-package2.jpg",
        "img3": "manali-tour-package.jpg",
        "category": "Adventure Tour Package",
        "cat": true,
        "start": "Manali",
        "end": "Kullu",
        "day": "4",
        "night": "5",
        "cost": "6,500",
        "places": ["Manali", "Kullu"],
        "activities": [{"name": "Rafting", "img": "canoe.png"}, {
            "name": "River Crossing",
            "img": "stick-man-with-helm.png"
        }, {"name": "Transfers", "img": "car.png"}, {
            "name": "Sightseeing",
            "img": "forest.png"
        }, {"name": "Paragliding", "img": "parachutist.png"}, {"name": "Campfire", "img": "campfire.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "13",
        "name": "Summer Holiday Special",
        "subtitle": "Kullu Manali ",
        "img": "kasol-tour-package1.jpg",
        "img1": "manali-package-tour3.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "manali-package-tour.jpg",
        "category": "Adventure Tour Package",
        "cat": true,
        "start": "Manali",
        "end": "Kasol",
        "day": "7",
        "night": "6",
        "cost": "12,999",
        "places": ["Manali", "Kullu", "Kasol"],
        "activities": [{"name": "Rafting", "img": "canoe.png"}, {
            "name": "River Crossing",
            "img": "stick-man-with-helm.png"
        }, {"name": "Transfers", "img": "car.png"}, {
            "name": "Sightseeing",
            "img": "forest.png"
        }, {"name": "Paragliding", "img": "parachutist.png"}, {"name": "Campfire*", "img": "campfire.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }, {
        "id": "12",
        "name": "Summer Holiday Special",
        "subtitle": "Shimla, Kullu Manali ",
        "img": "manali-package-tour3.jpg",
        "img1": "manali-package-tour.jpg",
        "img2": "shimla-tour-package1.jpg",
        "img3": "manali-package-tour1.jpg",
        "category": "Adventure Tour Package",
        "cat": true,
        "start": "Shimla",
        "end": "Manali",
        "day": "7",
        "night": "6",
        "cost": "13,999",
        "places": ["Kullu", "Manali"],
        "activities": [{"name": "Rafting", "img": "canoe.png"}, {
            "name": "River Crossing",
            "img": "stick-man-with-helm.png"
        }, {"name": "Transfers", "img": "car.png"}, {
            "name": "Sightseeing",
            "img": "forest.png"
        }, {"name": "Paragliding", "img": "parachutist.png"}, {"name": "Campfire*", "img": "campfire.png"}],
        "boarding": true,
        "accommodation": true,
        "sharingRoom": true,
        "meal": true
    }];
});
app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "home.html",
        controller: "productDisplayCtrl"
    }).when("/tourpackage", {templateUrl: "tourpackage.html"}).when("/adventuretourpackage", {templateUrl: "adventure-tourpackage.html"}).when("/product/:id", {
        templateUrl: "product.html",
        controller: "productCtrl"
    }).when("/about", {templateUrl: "about.html"}).when("/contact", {templateUrl: "contact.html"}).when("/cmgsoon", {templateUrl: "coming-soon.html"}).otherwise({redirectTo: '/'});
});
jQuery(document).ready(function ($) {
    var scrollArrow = $('.scroll-down');
    scrollArrow.on('click', function (event) {
        event.preventDefault();
        smoothScroll($(this.hash));
    });
});
var fixNavOnScroll = function (Nav, NavTopPosition) {
    if ($(window).scrollTop() > NavTopPosition) {
        Nav.addClass('is-fixed');
        setTimeout(function () {
            Nav.addClass('animate-children');
        }, 50);
    } else {
        Nav.removeClass('is-fixed');
        setTimeout(function () {
            Nav.removeClass('animate-children');
        }, 50);
    }
};
function smoothScroll(target) {
    $('body,html').animate({'scrollTop': target.offset().top}, 300);
}