/**
 * @packet sdata.table;
 * @template sdata.template.tabletemp;
 * @require sdata.service.table;
 * @require icon.action;
 * @css sdata.style.tablestyle;
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
    autodom:true,
    bind_btnclick:function (dom,e) {
        this.dispatchEvent("btnclick",dom.cache());
        e.stopPropagation();
    }
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
        this.dispatchEvent("checkall",dom.cache());
    },
    bind_itemclick:function (dom) {
        this.dispatchEvent("itemclick",dom.cache());
    }
});
Module({
    name:"doubletableheader",
    extend:"@.tableheader",
    className:"table-doubletableheader",
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
    template:"@tabletemp.bodyfn",
    bind_deal:function (dom,e) {
        this.dispatchEvent("dealclick",dom.cache());
        e.stopPropagation();
    }
});
Module({
    name:"doublebodyfn",
    extend:'@.tablebodyfn',
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
    },
    bind_pagesize:function (dom) {
        this.dispatchEvent("pagesize",dom.cache());
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
            name:"key",
            key:"key",
            width:100,
            disable:false,
            textAlign:"left",
            hook:null
        }],
        headerHeight:35,
        rowHeight: 30,
        headType:"@.tableheader",
        bodyType:"@.tablebody",
        footType:"@.tablefooter",
        pageSizes:[10,20,30,40],
        selectType:"multi"//single,multi
    },
    init:function () {
        this.getService("table").action('set',this.option);
        this.getService("table").trigger("gotopage",1);
    },
    update:function (a) {
        this.getChildByType(this.option.headType).update(a.header);
        this.getChildByType(this.option.bodyType).update(a.body);
        this.getChildByType(this.option.footType).update(a.footer);
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
        if(this.option.selectType==="single"){
            this.getService("table").action("singleSelected", e.data.id);
        }else {
            this.getService("table").action("toggleSelected", e.data.id);
        }
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
    },
    event_itemclick:function (e) {
        if(e.data.state){
            this.getService("table").action("unhidecol",e.data.key);
        }else{
            this.getService("table").action("hidecol",e.data.key);
        }
    },
    event_pagesize:function (e) {
        this.getService("table").trigger("setpagesize",e.data);
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
            this.unselectAllRows();
        }else{
            this.selectAllRows();
        }
    },
    event_dealclick:function (e) {
        console.log(e.data);
    },
    event_btnclick:function (e) {
        console.log(e.data);
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