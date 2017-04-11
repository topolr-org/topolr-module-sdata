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
    getRowData:function (data) {
        var r={};
        for(var i=0;i<this.option.cols.length;i++){
            var a=this.option.cols[i];
            r[a.key]=data[a.key];
            Object.defineProperty(r, "__width__", {
                enumerable: false,
                configurable: false,
                writable: false,
                value: a.width
            });
            Object.defineProperty(r, "__height__", {
                enumerable: false,
                configurable: false,
                writable: false,
                value: this.option.rowHeight
            });
        }
        return r;
    },
    getPagesData:function (current,total) {
        var r=[];
        var prevpage = {
            name:"prev"
        },nextpage = {
            name:"next"
        },dots1 = {
            name:"dot",
            none:false
        },dots2 = {
            name:"dot",
            none:false
        };
        var btns = {
            page0: {
                name:"btn",
                num:1
            },
            page1: {
                name:"btn",
                num:2
            },
            page2: {
                name:"btn",
                num:3
            },
            page3: {
                name:"btn",
                num:4
            },
            page4: {
                name:"btn",
                num:5
            }
        };
        var num = current, total = total;
        if (total <= 5) {
            dots1.none=true;
            dots2.none=true;
            for (var i = 0; i < 5; i++) {
                if (i < total) {
                    btns["page" + i].none=false;
                    btns["page" + i].num=(i + 1);
                } else {
                    btns["page" + i].none=true;
                }
            }
        } else {
            btns.page4.num=total;
        }
        for (var i = 0; i < 5; i++) {
            btns["page" + i].iscurrent=false;
        }
        if (num < 4) {
            if (total > 5) {
                dots1.none=true;
                dots2.none=false;
            }
            btns["page"+(num-1)].iscurrent=true;
            btns.page1.num=2;
            btns.page2.num=3;
            btns.page3.num=4;
        } else {
            if (num <= total - 3) {
                dots1.none=false;
                dots2.none=false;
                btns.page1.num=(num - 1);
                btns.page2.num=(num);
                btns.page3.num=(num + 1);
                btns.page2.iscurrent=true;
            } else {
                if (total > 5) {
                    dots1.none=false;
                    dots2.none=true;
                }
                btns.page1.num=(total - 3);
                btns.page2.num=(total - 2);
                btns.page3.num=(total - 1);
                btns["page" + (4 - (total - num))].addClass("success");
            }
        }
        if (num === 1) {
            if (total === 1) {
                prevpage.disabled=true;
                nextpage.disabled=true;
            } else {
                prevpage.disabled=true;
                nextpage.disabled=false;
            }
        } else if (num === total) {
            prevpage.disabled=false;
            nextpage.disabled=true;
        } else {
            prevpage.disabled=false;
            nextpage.disabled=false
        }
        return [prevpage,btns.page0,dots1,btns.page1,btns.page2,btns.page3,dots2,btns.page4,nextpage];
    },
    action_set:function (option) {
        this.option=$.extend(true,{},this.option,option);
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
        this.start();
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
            ths.data.footer=ths.getPagesData(data.current,data.total);
            ths.trigger();
        },function () {
            this.start();
        })
    },
    service_nextpage:function () {
        return this.nextPage();
    },
    service_prevpage:function () {
        return this.prevPage();
    }
});