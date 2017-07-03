/**
 * @packet sdata.list;
 * @require sdata.service.list;
 * @template sdata.template.listtemp;
 * @require icon.action;
 * @require baseui.loading;
 * @style sdata.style.liststyle;
 * @style sdata.style.listcon;
 */
Module({
    name: 'simplelist',
    extend: "viewgroup",
    services: {"list": "@list.nocacheservice"},
    layout: "@listtemp.simplelist",
    autodom: true,
    option: {
        pageSize: 10,
        from: 0,
        fromName: "page",
        sizeName: "pagesize",
        url: ""
    },
    init: function () {
        this.excuteService("list.set", this.option);
        this.gotoPage(1);
    },
    gotoPage: function (num) {
        this.addChild({
            type: "@loading.area",
            container: this.dom
        }).then(function (area) {
            area.showLoading("loading...");
            this.triggerService("list.gotopage", num).then(function () {
                area.remove();
            }, function (a) {
                console.log(a);
                area.remove();
            });
        });
    },
    nextPage: function () {
        this.addChild({
            type: "@loading.area",
            container: this.dom
        }).then(function (area) {
            area.showLoading("loading...");
            this.triggerService("list.next").then(function () {
                area.remove();
            }, function () {
                area.remove();
            });
        });
    },
    prevPage: function () {
        this.addChild({
            type: "@loading.area",
            container: this.dom
        }).then(function (area) {
            area.showLoading("loading...");
            this.triggerService("list.prev").then(function () {
                area.remove();
            }, function () {
                area.remove();
            });
        });
    },
    bind_prev: function () {
        this.prevPage();
    },
    bind_next: function () {
        this.nextPage();
    },
    bind_goto: function (dom) {
        this.gotoPage(dom.cache().num);
    }
});
Module({
    name: "tablelist",
    extend: "@.simplelist",
    layout: "@listtemp.traditionlist",
    style: "@liststyle",
    className: "traditionlist",
    option: {
        cols: [],
        tools: [],
        deals: [],
        parsefn: null
    },
    init: function () {
        this.superClass("init");
    },
    bind_tool: function (dom) {
        var data = dom.cache();
        this.dispatchEvent("tool_" + data.action);
    },
    bind_deal: function (dom) {
        var deal = dom.cache();
        var data = dom.parent().cache();
        console.log(deal)
        this.dispatchEvent("deal_" + deal.action, data);
    },
    service_schange: function (data) {
        if (this.option.parsefn) {
            data = this.option.parsefn(data);
        }
        $.extend(data, this.option, {winwidth: $(window).width() > 480});
        this.update(data);
    }
});
Module({
    name: 'appendlistinner',
    extend: "viewgroup",
    services: {"list": "@list.cacheservice"},
    layout: "@listtemp.appendlistinner",
    style: "@liststyle",
    className: "appendlist",
    autodom: true,
    option: {
        pageSize: 10,
        from: 0,
        fromName: "page",
        sizeName: "pagesize",
        url: "",
        cols: [],
        tools: [],
        deals: [],
        parsefn: null,
        offsetHeight: 0,
        scrollTop: true
    },
    init: function () {
        this.excuteService("list.set", this.option);
        this.gotoPage(1);
        var ths = this;
        this._end = false;
        this._size = 0;
        var et = function () {
            if (!ths._end) {
                var b = ths.dom.get(0).getBoundingClientRect().bottom;
                if (b <= $(window).height() - ths.option.offsetHeight) {
                    ths.nextPage();
                }
            }
        };
        this.dom.parent().parent().get(0).addEventListener("scroll", et);
        this.onunload = function () {
            ths.dom.parent().parent().get(0).removeEventListener("scroll", et);
        }
    },
    gotoPage: function (num) {
        this._end = false;
        if (this.option.scrollTop) {
            $(window).scrollTop(0);
        }
        this.excuteService("list.clean");
        this.dispatchEvent("startloading");
        this.triggerService("list.gotopage", num).scope(this).then(function () {
            this.dispatchEvent("endloading", {
                size: this._size,
                isend: this._end
            });
        }, function () {
            this.dispatchEvent("errorloading");
        });
    },
    nextPage: function () {
        this.dispatchEvent("startloading");
        this.triggerService("list.next").scope(this).then(function () {
            this.dispatchEvent("endloading", {
                size: this._size,
                isend: this._end
            });
        }, function () {
            this.dispatchEvent("errorloading");
        });
    },
    retry: function () {
        this.dispatchEvent("startloading");
        this.triggerService("list.retry").scope(this).then(function () {
            this.dispatchEvent("endloading", {
                size: this._size,
                isend: this._end
            });
        }, function () {
            this.dispatchEvent("errorloading");
        });
    },
    bind_tool: function (dom) {
        var data = dom.cache();
        this.dispatchEvent("tool_" + data.action);
    },
    bind_deal: function (dom) {
        var deal = dom.cache();
        var data = dom.parent().cache();
        this.dispatchEvent("deal_" + deal.action, data);
    },
    service_schange: function (data) {
        if (this.option.parsefn) {
            data = this.option.parsefn(data);
        }
        $.extend(data, this.option, {winwidth: $(window).width() > 480});
        this._end = data.isend;
        this._size += data.list.length;
        this.update(data);
    }
});
Module({
    name: "appendlist",
    extend: "viewgroup",
    autodom: true,
    layout: "@listtemp.appendlist",
    className: "appendlistcon",
    style: "@listcon",
    option: {},
    init: function () {
        this.addChild({
            type: "@.appendlistinner",
            option: this.option,
            container: this.finders("list")
        });
    },
    bind_refresh: function () {
        this.getChildAt(0).retry(1);
    },
    event_startloading: function (e) {
        this.update({state: "loading"});
        e.stopPropagation();
    },
    event_endloading: function (e) {
        if (e.data.isend) {
            this.update({state: "nomore", size: e.data.size});
        }
        e.stopPropagation();
    },
    event_errorloading: function (e) {
        this.update({state: "error"});
        e.stopPropagation();
    },
    gotoPage: function (num) {
        this.getChildAt(0).gotoPage(num);
    }
});
Module({
    name: "traditionlist",
    extend: "viewgroup",
    option: {
        cols: [],
        tools: [],
        deals: [],
        parsefn: null
    },
    init: function () {
        if ($(window).width() <= 480) {
            this.addChild({
                type: "@.appendlist",
                option: this.option,
                container: this.dom
            });
        } else {
            this.addChild({
                type: "@.tablelist",
                option: this.option,
                container: this.dom
            });
        }
    },
    gotoPage: function (num) {
        this.getChildAt(0).gotoPage(num);
    }
});