/**
 * @packet sdata.list;
 * @require sdata.service.list;
 * @template sdata.template.listtemp;
 * @require icon.direct;
 * @require baseui.loading;
 */
Module({
    name:'simplelist',
    extend:"viewgroup",
    services:{"list":"@list.nocacheservice"},
    layout:"@listtemp.simplelist",
    autodom:true,
    option:{
        pageSize: 10,
        from: 0,
        fromName: "page",
        sizeName: "pagesize",
        url: ""
    },
    init:function () {
        this.excuteService("list.set",this.option);
        this.gotoPage(1);
    },
    gotoPage:function (num) {
        this.addChild({
            type:"@loading.area",
            container:this.dom
        }).then(function (area) {
            area.showLoading("loading...");
            this.triggerService("list.gotopage", num).then(function () {
                area.remove();
            },function (a) {
                console.log(a);
                area.remove();
            });
        });
    },
    nextPage:function () {
        this.addChild({
            type:"@loading.area",
            container:this.dom
        }).then(function (area) {
            area.showLoading("loading...");
            this.triggerService("list.next").then(function () {
                area.remove();
            },function () {
                area.remove();
            });
        });
    },
    prevPage:function () {
        this.addChild({
            type:"@loading.area",
            container:this.dom
        }).then(function (area) {
            area.showLoading("loading...");
            this.triggerService("list.prev").then(function () {
                area.remove();
            },function () {
                area.remove();
            });
        });
    },
    bind_prev:function () {
        this.prevPage();
    },
    bind_next:function () {
        this.nextPage();
    },
    bind_goto:function (dom) {
        this.gotoPage(dom.cache().num);
    }
});