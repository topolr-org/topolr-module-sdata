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
    name:"tablebody",
    extend:"view",
    className:"table-tablebody",
    template:"@tabletemp.body",
    option:{
        rows:[]
    },
    autodom:true
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
        rowHeight: 40,
        checkbox: true,
        num: true,
        tools: [],
        deals: [],
        cols: [{
            key:"",
            width:100
        }],
        headType:"@.tableheader",
        bodyType:"@.tablebody",
        footType:"@.tablefooter"
    },
    init:function () {
        this.getService("table").action('set',this.option);
        this.getService("table").trigger("gotopage",1);
    },
    update:function (a) {
        this.getChildAt(0).update({
            cols:a.header
        });
        this.getChildAt(1).update({
            rows:a.body
        });
        this.getChildAt(2).update({
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
    }
});