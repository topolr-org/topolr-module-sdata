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
    name: "traditionlist",
    extend: "@.simplelist",
    layout: "@listtemp.traditionlist",
    style: "@liststyle",
    className: "traditionlist",
    option: {
        cols: [],
        tools: [],
        deals: [],
        parsefn:null
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
        if(this.option.parsefn){
            data=this.option.parsefn(data);
        }
        $.extend(data, this.option);
        this.update(data);
    }
});