/**
 * @packet sdata.table;
 * @template sdata.template.tabletemp;
 * @css sdata.style.tablestyle;
 * @require sdata.service.table;
 */
Module({
    name:"basetable",
    extend:"viewgroup"
});
Module({
    name:'tabletools',
    extend:"view",
    className:"table-tabletools",
    template:"@tabletemp.tools",
    option:{
        tools:[]
    },
    autodom:true
});
Module({
    name:"tableheader",
    extend:"view",
    className:"table-tableheader",
    template:"@tabletemp.header",
    option:{
        cols:[]
    },
    autodom:true
});
Module({
    name:"doubletableheader",
    extend:"@.tableheader",
    template:"@tabletemp.doubleheader"
});
Module({
    name:"tablebody",
    extend:"view",
    className:"table-tablebody",
    template:"@tabletemp.body",
    option:{
        rows:[]
    },
    autodom:true,
    bind_row:function (dom) {
        this.dispatchEvent("rowclick",dom.cache());
    }
});
Module({
    name:"tablebodyfn",
    extend:"@.tablebody",
    option:{
        deals:[]
    },
    template:"@tabletemp.bodyfn"
});
Module({
    name:"doublebodyfn",
    extend:'@.tablebody',
    className:"doublebodyfn",
    template:"@tabletemp.doublebodyfn"
});
Module({
    name:"tablefooter",
    extend:"view",
    className:"table-tablefooter",
    template:"@tabletemp.footer",
    option:{
        pages:[]
    },
    autodom:true,
    bind_prev:function () {
        this.dispatchEvent("prevPage");
        console.log("prev")
    },
    bind_next:function () {
        this.dispatchEvent("nextPage");
        console.log("next")
    },
    bind_goto:function (dom) {
        this.dispatchEvent("gotoPage",dom.cache().num);
    }
});
Module({
    name:"simpletable",
    extend:"@.basetable",
    className:"table-simple",
    layout:"@tabletemp.table",
    services:{"table":"@table.nocacheservice"},
    autodom:true,
    option:{
        url:"",
        cols: [{
            key:"",
            width:100
        }],
        rowHeight: 40,
        headType:"@.tableheader",
        bodyType:"@.tablebody",
        footType:"@.tablefooter"
    },
    init:function () {
        this.getService("table").action('set',this.option);
        this.getService("table").trigger("gotopage",1);
    },
    update:function (a) {
        this.getChildByType(this.option.headType).update({
            cols:a.header
        });
        this.getChildByType(this.option.bodyType).update({
            rows:a.body
        });
        this.getChildByType(this.option.footType).update({
            pages:a.footer
        });
    },
    gotoPage:function (num) {
        this.getService("table").trigger("gotopage",num).then(function () {
            console.log("---ok----")
        },function () {
            console.log("----error---")
        });
    },
    nextPage:function () {
        this.getService("table").trigger("nextpage");
    },
    prevPage:function () {
        this.getService("table").trigger("prevpage");
    },
    event_gotoPage:function (e) {
        this.gotoPage(e.data);
    },
    event_nextPage:function () {
        this.nextPage();
    },
    event_prevPage:function () {
        this.prevPage();
    },
    event_rowclick:function (e) {
        this.getService("table").action("toggleSelected",e.data.id);
    }
});
Module({
    name:"fntable",
    extend:"@.simpletable",
    className:"table-fntable",
    option:{
        checkbox: true,
        num: true,
        deals: [],
        tools:[],
        toolType:"@.tabletools",
        bodyType:"@.tablebodyfn"
    },
    services:{"table":"@table.fnnocacheservice"},
    layout:"@tabletemp.fntable",
    init:function () {
        this.superClass("init");
        this.getChildByType(this.option.toolType).update(this.option.tools);
    }
});
Module({
    name:"doublefntable",
    extend:"@.fntable",
    className:"table-doublefntable",
    layout:"@tabletemp.doublefntable",
    option:{
        bodyType:"@.doublebodyfn",
        headType:"@.doubletableheader"
    },
    services:{"table":"@table.doublefnnocacheservice"}
});