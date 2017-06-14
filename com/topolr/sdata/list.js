/**
 * @packet sdata.list;
 * @require sdata.service.list;
 * @template sdata.template.listtemp;
 */
Module({
    name:'simplelist',
    extend:"view",
    services:{"list":"@list.nocacheservice"},
    template:"@listtemp.simplelist",
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
        this.triggerService("list.gotopage",num).then(function () {
            console.log("done")
        });
    }
});