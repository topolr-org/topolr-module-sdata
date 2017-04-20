/**
 * @packet sdata.service.table;
 * @require sdata.service.page;
 */
Module({
    name:"nocacheservice",
    extend:"@page.totalservice",
    option:{
        cols:[],
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
    then:function (ps) {
        var ths=this;
        return ps.then(function (data) {
            ths.start();
            var _body=[];
            var _list=data.list;
            for(var i=0;i<_list.length;i++){
                _body.push(ths.getRowData(_list[i]));
            }
            ths.data.body=_body;
            console.log("==> "+_list.length+" -- "+_body.length);
            ths.data.footer=ths.getPagesData(data.current,data.total);
            ths.trigger();
        },function () {
            ths.start();
            ths.trigger();
        });
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
        this.stop();
        return this.then(this.gotoPage(num));
    },
    service_nextpage:function () {
        return this.then(this.nextPage());
    },
    service_prevpage:function () {
        return this.then(this.prevPage());
    }
});
Module({
    name:"fnnocacheservice",
    extend:"@.nocacheservice",
    option:{
        tools:[],
        deals:[],
        checkbox: true,
        num: true
    },
    action_set:function (option) {
        this.superClass("action_set",option);
        var et=[];
        if(this.option.num){
            et.push({
                width:30,
                name:"",
                height:this.option.rowHeight
            });
        }
        if(this.option.checkbox){
            et.push({
                width:30,
                name:"",
                height:this.option.rowHeight
            });
        }
        et.push({
            width:35*this.option.deals.length,
            name:"tools",
            height:this.option.rowHeight
        });
        this.data.header=et.concat(this.data.header);
    },
    then:function (ps) {
        var ths=this;
        return ps.then(function (data) {
            ths.start();
            var _body=[];
            var _list=data.list;
            for(var i=0;i<_list.length;i++){
                _body.push(ths.getRowData(_list[i]));
            }
            for(var i=0;i<_body.length;i++){
                var r=_body[i];
                if(ths.option.num){
                    Object.defineProperty(r, "__num__", {
                        enumerable: false,
                        configurable: false,
                        writable: false,
                        value: {
                            width:30,
                            height:r["__height__"]
                        }
                    });
                }
                if(ths.option.checkbox){
                    Object.defineProperty(r, "__checkbox__", {
                        enumerable: false,
                        configurable: false,
                        writable: false,
                        value: {
                            width:30,
                            height:r["__height__"]
                        }
                    });
                }
                var q=[];
                for(var m=0;m<ths.option.deals.length;m++){
                    var cd=ths.option.deals[m];
                    cd.width=35;
                    cd.height=r["__height__"];
                    q.push(cd);
                }
                Object.defineProperty(r, "__deals__", {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: q
                });
            }
            ths.data.body=_body;
            ths.data.footer=ths.getPagesData(data.current,data.total);
            ths.trigger();
        },function () {
            ths.start();
            ths.trigger();
        });
    }
});
Module({
    name:"doublefnnocacheservice",
    extend:"@.fnnocacheservice",
    action_set:function (option) {
        this.superClass("action_set",option);
        var et=[],_width=0;
        if(this.option.num){
            et.push({
                width:30,
                name:"",
                height:this.option.rowHeight
            });
            _width+=30;
        }
        if(this.option.checkbox){
            et.push({
                width:30,
                name:"",
                height:this.option.rowHeight
            });
            _width+=30;
        }
        et.push({
            width:35*this.option.deals.length,
            name:"tools",
            height:this.option.rowHeight
        });
        _width+=35*this.option.deals.length;
        this.data.header={
            left:et,
            right:this.data.header,
            leftWidth:_width,
            leftHeight:this.option.rowHeight
        }
    },
    then:function (ps) {
        var ths=this;
        return ps.then(function (data) {
            ths.start();
            var _body=[];
            var _list=data.list;
            for(var i=0;i<_list.length;i++){
                _body.push(ths.getRowData(_list[i]));
            }
            var _left=[];
            for(var i=0;i<_body.length;i++){
                var r={},rr=_body[i];
                if(ths.option.num){
                    r["__num__"]={
                        width:30,
                        height:rr["__height__"]
                    };
                }
                if(ths.option.checkbox){
                    r["__checkbox__"]={
                        width:30,
                        height:rr["__height__"]
                    };
                }
                var q=[];
                for(var m=0;m<ths.option.deals.length;m++){
                    var cd=ths.option.deals[m];
                    cd.width=35;
                    cd.height=rr["__height__"];
                    q.push(cd);
                }
                r["__deals__"]=q;
                _left.push(r);
            }
            ths.data.body={
                left:_left,
                right:_body,
                leftWidth:ths.data.header.leftWidth,
                leftHeight:ths.data.header.leftHeight
            };
            ths.data.footer=ths.getPagesData(data.current,data.total);
            console.log(ths.data)
            ths.trigger();
        },function () {
            ths.start();
            ths.trigger();
        });
    }
});