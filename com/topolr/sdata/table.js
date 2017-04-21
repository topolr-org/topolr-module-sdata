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
    autodom:true,
    bind_checkall:function (dom) {
        this.dispatchEvent("checkall",dom.get(0).checked);
    }
});
Module({
    name:"doubletableheader",
    extend:"@.tableheader",
    template:"@tabletemp.doubleheader",
    setScroll:function (info) {
        this.finders("left").scrollLeft(info.left);
    }
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
    template:"@tabletemp.doublebodyfn",
    find_body:function (dom) {
        var ths=this;
        dom.bind("scroll",function(e){
            var top=$(dom).scrollTop(),left=$(dom).scrollLeft();
            ths.finders("left").scrollTop(top);
            ths.dispatchEvent("bodyscroll",{
                left:left,
                top:top
            });
        });
    }
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
    },
    selecRow:function(id){
        this.getService("table").action("selected",id);
    },
    unselectRow:function(id){
        this.getService("table").action("unselected",id);
    },
    toggleSelectRow:function(id){
        this.getService("table").action("toggleSelected",id);
    },
    selectAllRows:function(){
        this.getService("table").action("selectall");
    },
    unselectAllRows:function(){
        this.getService("table").action("unselectall");
    },
    warnRow:function(id){
        this.getService("table").action("rowwarned",id);
    },
    unwarnRow:function(id){
        this.getService("table").action("unrowwarned",id);
    },
    errorRow:function(id){
        this.getService("table").action("rowerror",id);
    },
    unerrorRow:function(id){
        this.getService("table").action("unrowerror",id);
    },
    setRowData:function(id,data){
        this.getService("table").action("setrowdata",id,data);
    },
    getRowData:function(id){
        return this.getService("table").action("getrowdata",id);
    },
    refresh:function(){
        this.getService("table").trigger("refresh");
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
    },
    event_checkall:function(e){
        var a=e.data;
        if(a){
            this.selectAllRows();
        }else{
            this.unselectAllRows();
        }
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
    services:{"table":"@table.doublefnnocacheservice"},
    event_bodyscroll:function(e){
        this.getChildByType(this.option.headType).setScroll(e.data);
    }
});