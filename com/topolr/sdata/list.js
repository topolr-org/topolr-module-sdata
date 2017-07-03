/**
 * @packet sdata.list;
 * @require sdata.service.list;
 * @template sdata.template.listtemp;
 * @require icon.action;
 * @require baseui.loading;
 * @style sdata.style.liststyle;
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
    name: 'appendlist',
    extend: "viewgroup",
    services: {"list": "@list.cacheservice"},
    layout: "@listtemp.appendlist",
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
        scrollTop:true
    },
    init: function () {
        this.excuteService("list.set", this.option);
        this.gotoPage(1);
        var ths = this;
        var et = function () {
            var b = ths.dom.get(0).getBoundingClientRect().bottom;
            if (b <= $(window).height() - ths.option.offsetHeight) {
                ths.nextPage();
            }
        };
        window.addEventListener("scroll", et);
        this.onunload = function () {
            window.removeEventListener("scroll", et);
        }
    },
    gotoPage: function (num) {
        if(this.option.scrollTop) {
            $(window).scrollTop(0);
        }
        this.excuteService("list.clean");
        this.triggerService("list.gotopage", num);
    },
    nextPage: function () {
        this.triggerService("list.next");
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
    }
});