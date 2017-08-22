/**
 * @packet sdata.list;
 * @require sdata.service.list;
 * @template sdata.template.listtemp;
 * @require baseui.loading;
 * @style sdata.style.liststyle;
 * @style sdata.style.listcon;
 * @icon sdata.icons;
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
        parsefn: null,
        queryBtn: {
            show: true,
            keyName: "query",
            placeholder: "搜索"
        }
    },
    init: function () {
        this.excuteService("list.set", this.option);
        if (this.option.queryBtn && this.option.queryBtn.show) {
            var a = {};
            a[this.option.queryBtn.keyName || "query"] = "";
            this.excuteService("list.setparameters", a);
        }
        this.gotoPage(1);
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
    bind_rowclick: function (dom) {
        this.dispatchEvent("rowclick", dom.cache());
    },
    bind_query: function (dom, e) {
        var isquery = false;
        if (e.type === "keyup" && e.keyCode === 13) {
            isquery = true;
        } else if (e.type === "click") {
            isquery = true;
        }
        if (isquery) {
            var val = this.finders("queryinput").val();
            var data = {};
            data[this.option.queryBtn.keyName || "query"] = val;
            this.excuteService("list.setparameters", data);
            this.gotoPage(1);
        }
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
        scrollTop: true,
        queryBtn: {
            show: false,
            keyName: "query",
            placeholder: "搜索"
        }
    },
    init: function () {
        this.excuteService("list.set", this.option);
        if (this.option.queryBtn && this.option.queryBtn.show) {
            var a = {};
            a[this.option.queryBtn.keyName || "query"] = "";
            this.excuteService("list.setparameters", a);
        }
        this.gotoPage(1);
        var ths = this;
        this._end = false;
        this._size = 0;
        this._loading = false;
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
        if (!this._loading) {
            this._loading = true;
            this.dispatchEvent("startloading");
            this.triggerService("list.next").scope(this).then(function () {
                this._loading = false;
                this.dispatchEvent("endloading", {
                    size: this._size,
                    isend: this._end
                });
            }, function () {
                this._loading = false;
                this.dispatchEvent("errorloading");
            });
        }
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
    bind_rowclick: function (dom) {
        this.dispatchEvent("rowclick", dom.cache());
    },
    bind_query: function (dom, e) {
        var isquery = false;
        if (e.type === "keyup" && e.keyCode === 13) {
            isquery = true;
        } else if (e.type === "click") {
            isquery = true;
        }
        if (isquery) {
            var val = this.finders("queryinput").val();
            var data = {};
            data[this.option.queryBtn.keyName || "query"] = val;
            this.excuteService("list.setparameters", data);
            this.gotoPage(1);
        }
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