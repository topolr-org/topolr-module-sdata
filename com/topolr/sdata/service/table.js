/**
 * @packet sdata.service.table;
 * @require sdata.service.page;
 */
Module({
    name:"nocacheservice",
    extend:"@page.totalservice",
    option:{
        cols:[],
        tools:[],
        deals:[],
        rowHeight: 40,
        checkbox: true,
        num: true
    },
    init:function () {
    },
    getRowData:function (data) {
        var r={};
        for(var i=0;i<this.option.cols.length;i++){
            var a=this.option.cols[i];
            r[a.key]=data[a.key];
            r["__width__"]=a.width;
            r["__height__"]=this.option.rowHeight;
        }
        return r;
    },
    action_set:function (option) {
        this.option=$.extend(true,{},option);
        var _header=[];
        for(var i=0;i<this.option.cols.length;i++){
            _header.push({
                width:this.option.cols[i].width,
                name:this.option.cols[i].name,
                height:this.option.rowHeight
            });
        }
        this.data={
            header:_header,
            body:null,
            footer:null
        };
    },
    service_gotopage:function (num) {
        var ths=this;
        this.stop();
        return this.gotoPage(num).then(function (data) {
            this.start();
            var _body=[];
            var _list=data.list;
            for(var i=0;i<_list.length;i++){
               _body.push(ths.getRowData(_list[i]));
            }
            ths.data.body=_body;
        })
    }
});