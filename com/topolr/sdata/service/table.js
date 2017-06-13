/**
 * @packet sdata.service.table;
 * @require sdata.service.page;
 */
Module({
    name: "nocacheservice",
    extend: "@page.totalservice",
    option: {
        cols: [],
        headerHeight:40,
        rowHeight: 35,
        checkbox: true,
        num: true,
        pageSizes:[10,20,30,40]
    },
    getRowData: function (data) {
        var r = {
            cols:[]
        };
        var width=0;
        for (var i = 0; i < this.option.cols.length; i++) {
            var rr={};
            var a = this.option.cols[i];
            rr.key=a.key;
            if(a.hook) {
                rr.value = a.hook(a.key,data,data[a.key]);
            }else{
                rr.value = data[a.key];
            }
            rr.width=a.width;
            rr.disable=a.disable||false;
            rr.textAlign=a.textAlign||"left";
            if(a.key==="id"){
                r.id=data[a.key];
            }
            r.cols.push(rr);
            if(!rr.disable){
                width+=rr.width;
            }
        }
        r.height=this.option.rowHeight;
        r.selected=false;
        r.warn=false;
        r.error=false;
        r.width=width;
        return r;
    },
    getPagesData: function (current, total) {
        var r = [];
        var prevpage = {
            name: "prev"
        }, nextpage = {
            name: "next"
        }, dots1 = {
            name: "dot",
            none: false
        }, dots2 = {
            name: "dot",
            none: false
        };
        var btns = {
            page0: {
                name: "btn",
                num: 1
            },
            page1: {
                name: "btn",
                num: 2
            },
            page2: {
                name: "btn",
                num: 3
            },
            page3: {
                name: "btn",
                num: 4
            },
            page4: {
                name: "btn",
                num: 5
            }
        };
        var num = current, total = total;
        if (total <= 5) {
            dots1.none = true;
            dots2.none = true;
            for (var i = 0; i < 5; i++) {
                if (i < total) {
                    btns["page" + i].none = false;
                    btns["page" + i].num = (i + 1);
                } else {
                    btns["page" + i].none = true;
                }
            }
        } else {
            btns.page4.num = total;
        }
        for (var i = 0; i < 5; i++) {
            btns["page" + i].iscurrent = false;
        }
        if (num < 4) {
            if (total > 5) {
                dots1.none = true;
                dots2.none = false;
            }
            btns["page" + (num - 1)].iscurrent = true;
            btns.page1.num = 2;
            btns.page2.num = 3;
            btns.page3.num = 4;
        } else {
            if (num <= total - 3) {
                dots1.none = false;
                dots2.none = false;
                btns.page1.num = (num - 1);
                btns.page2.num = (num);
                btns.page3.num = (num + 1);
                btns.page2.iscurrent = true;
            } else {
                if (total > 5) {
                    dots1.none = false;
                    dots2.none = true;
                }
                btns.page1.num = (total - 3);
                btns.page2.num = (total - 2);
                btns.page3.num = (total - 1);
                btns["page" + (4 - (total - num))].addClass("success");
            }
        }
        if (num === 1) {
            if (total === 1) {
                prevpage.disabled = true;
                nextpage.disabled = true;
            } else {
                prevpage.disabled = true;
                nextpage.disabled = false;
            }
        } else if (num === total) {
            prevpage.disabled = false;
            nextpage.disabled = true;
        } else {
            prevpage.disabled = false;
            nextpage.disabled = false
        }
        return [prevpage, btns.page0, dots1, btns.page1, btns.page2, btns.page3, dots2, btns.page4, nextpage];
    },
    then: function (ps) {
        var ths = this;
        return ps.then(function (data) {
            ths.start();
            var _body = [];
            var _list = data.list;
            for (var i = 0; i < _list.length; i++) {
                _body.push(ths.getRowData(_list[i]));
            }
            ths.data.body = _body;
            ths.data.footer = {
                pages:ths.getPagesData(data.current, data.total),
                size:{
                    map:ths.option.pageSizes,
                    current:ths.option.pageSize
                }
            };
            ths.trigger();
        }, function () {
            ths.start();
            ths.trigger();
        });
    },
    getRowProps:function(id){
        var r=null;
        for(var i=0;i<this.data.body.length;i++){
            if(this.data.body[i].id===id){
                r=this.data.body[i];
                break;
            }
        }
        return r;
    },
    setColProps:function (key,props) {
        var index=null;
        for(var i=0;i<this.data.header.cols.length;i++){
            var a=this.data.header.cols[i];
            if(a.key===key){
                index=i;
                break;
            }
        }
        if(index!==null) {
            for(var i=0;i<this.option.cols.length;i++){
                if(this.option.cols[i].key===key){
                    $.extend(this.option.cols[i],props);
                }
            }
            $.extend(this.data.header.cols[index], props);
            for (var i = 0; i < this.data.body.length; i++) {
                var row=this.data.body[i],width=0;
                for(var t=0;t<row.cols.length;t++){
                    var has=false;
                    if(row.cols[t].key===key){
                        $.extend(row.cols[t],props);
                        has=false;
                    }
                    if(!row.cols[t].disable){
                        width+=row.cols[t].width;
                    }
                    if(has){
                        break;
                    }
                }
                console.log(width)
                row.width=width;
            }
        }
    },
    setRowProps:function(id,data){
        var r=null;
        for(var i=0;i<this.data.body.length;i++){
            if(this.data.body[i].id===id){
                r=this.data.body[i];
                break;
            }
        }
        if(r){
            $.extend(r,data);
        }
    },
    setAllRowsProps:function(data){
        for(var i=0;i<this.data.body.length;i++){
            $.extend(this.data.body[i],data);
        }
    },
    checkSelectedState:function(){
        var isall=true;
        for(var i=0;i<this.data.body.length;i++){
            if(!this.data.body[i].selected){
                isall=false;
                break;
            }
        }
        for(var i=0;i<this.data.header.cols.length;i++){
            if(this.data.header.cols[i].checkbox){
                this.data.header.cols[i].isall=isall;
                break;
            }
        }
    },
    getDataFromCols:function(cols){
        var r={};
        for(var i=0;i<cols.length;i++){
            if(!cols[i].none) {
                r[cols[i].key] = cols[i].value;
            }
        }
        return r;
    },
    getRowsByPropTrue:function(key){
        var r=[];
        for(var i=0;i<this.data.body.length;i++){
            var a=this.data.body[i];
            if(a[key]===true){
                r.push(this.getDataFromCols(a.cols));
            }
        }
        return r;
    },
    getSelectedRows:function(){
        return this.getRowsByPropTrue("selected");
    },
    getWarnRows:function(){
        return this.getRowsByPropTrue("warn");
    },
    getErrorRows:function(){
        return this.getRowsByPropTrue("error");
    },
    getAllRows:function(){
        var r=[];
        for(var i=0;i<this.data.body.length;i++){
            r.push(this.getDataFromCols(this.data.body[i].cols));
        }
        return r;
    },
    hideCol:function (index) {
        this.setColProps(index,{
            disable:true
        });
    },
    unHideCol:function (index) {
        this.setColProps(index,{
            disable:false
        });
    },
    action_set: function (option) {
        this.option = $.extend(true, {}, this.option, option);
        this.option.pageSize=this.option.pageSizes[0];
        var _header = {
            height: this.option.headerHeight,
            cols: []
        };
        for (var i = 0; i < this.option.cols.length; i++) {
            _header.cols.push({
                width: this.option.cols[i].width,
                value: this.option.cols[i].name,
                key:this.option.cols[i].key||"",
                disable:this.option.cols[i].disable,
                isCol:true
            });
        }
        this.data = {
            header: _header,
            body: null,
            footer: null
        };
        this.trigger();
        this.start();
    },
    service_gotopage: function (num) {
        this.stop();
        return this.then(this.gotoPage(num));
    },
    service_nextpage: function () {
        return this.then(this.nextPage());
    },
    service_prevpage: function () {
        return this.then(this.prevPage());
    },
    service_refresh:function () {
        return this.service_gotopage(this.getCurrent());
    },
    action_rowwarned:function(id){
        this.setRowProps(id,{warn:true});
        this.trigger();
    },
    action_unrowwarned:function(id){
        this.setRowProps(id,{warn:false});
        this.trigger();
    },
    action_rowerror:function(id){
        this.setRowProps(id,{error:true});
        this.trigger();
    },
    action_unrowerror:function(id){
        this.setRowProps(id,{error:false});
        this.trigger();
    },
    action_selected:function (id) {
        this.setRowProps(id,{selected:true});
        this.checkSelectedState();
        this.trigger();
    },
    action_unselected:function (index) {
        this.setRowProps(id,{selected:false});
        this.checkSelectedState();
        this.trigger();
    },
    action_toggleSelected:function (id) {
        var a=this.getRowProps(id);
        if(a){
            this.setRowProps(id,{
                selected:a.selected?false:true
            });
            this.checkSelectedState();
            this.trigger();
        }
    },
    action_selectall:function () {
        this.setAllRowsProps({selected:true});
        this.checkSelectedState();
        this.trigger();
    },
    action_unselectall:function () {
        this.setAllRowsProps({selected:false});
        this.checkSelectedState();
        this.trigger();
    },
    action_singleSelected:function (id) {
        this.setAllRowsProps({selected:false});
        this.setRowProps(id,{selected:true});
        this.checkSelectedState();
        this.trigger();
    },
    action_getrowdata:function(id){
        return this.getRowProps(id);
    },
    action_setrowdata:function(id,data){
        this.setRowProps(id,data);
    },
    action_setallrowsdata:function(data){
        this.setAllRowsProps(data);
    },
    action_getselecteddata:function(){
        return this.getSelectedRows();
    },
    action_getwarndata:function(){
        return this.getWarnRows();
    },
    action_geterrordata:function(){
        return this.getErrorRows();
    },
    action_getallrows:function(){
        return this.getAllRows();
    },
    action_hidecol:function (key) {
        this.hideCol(key);
        this.trigger();
    },
    action_unhidecol:function (key) {
        this.unHideCol(key);
        this.trigger();
    },
    service_setpagesize:function (size) {
        this.stop();
        return this.then(this.resetPageSize(size));
    }
});
Module({
    name: "fnnocacheservice",
    extend: "@.nocacheservice",
    option: {
        tools: [],
        deals: [],
        checkbox: true,
        num: true
    },
    action_set: function (option) {
        this.superClass("action_set", option);
        var et = [];
        if (this.option.num) {
            et.push({
                width: 30,
                key:"__num__",
                value:"&nbsp;"
            });
        }
        if (this.option.checkbox) {
            et.push({
                width: 30,
                value: "",
                checkbox:true,
                isall:false
            });
        }
        et.push({
            width: 35 * this.option.deals.length,
            value: "tools"
        });
        this.data.header.cols = et.concat(this.data.header.cols);
    },
    then: function (ps) {
        var ths = this;
        return ps.then(function (data) {
            ths.start();
            var _body = [];
            var _list = data.list;
            for (var i = 0; i < _list.length; i++) {
                _body.push(ths.getRowData(_list[i]));
            }
            for (var i = 0; i < _body.length; i++) {
                var r = {cols:[]}, rr = _body[i];
                if (ths.option.num) {
                    r.cols.push({
                        width: 30,
                        key:"__num__",
                        value:"&nbsp;",
                        none:true
                    });
                }
                if (ths.option.checkbox) {
                    r.cols.push({
                        width: 30,
                        key:"__checkbox__",
                        value:false,
                        none:true
                    });
                }
                for (var m = 0; m < ths.option.deals.length; m++) {
                    r.cols.push({
                        width:35,
                        key:"__deals__",
                        value:ths.option.deals[m],
                        none:true
                    });
                }
                rr.cols=r.cols.concat(rr.cols);
            }
            ths.data.body = _body;
            ths.data.footer = {
                pages:ths.getPagesData(data.current, data.total),
                size:{
                    map:ths.option.pageSizes,
                    current:ths.option.pageSize
                }
            };
            ths.trigger();
        }, function () {
            ths.start();
            ths.trigger();
        });
    }
});
Module({
    name: "doublefnnocacheservice",
    extend: "@.fnnocacheservice",
    action_set: function (option) {
        this.superClass("action_set", option);
        var et = {cols:[],height:this.option.headerHeight}, _width = 0;
        if (this.option.num) {
            et.cols.push({
                width: 30,
                value: "&nbsp;"
            });
            _width += 30;
        }
        if (this.option.checkbox) {
            et.cols.push({
                width: 30,
                value: "",
                checkbox:true,
                isall:false
            });
            _width += 30;
        }
        et.cols.push({
            width: 35 * this.option.deals.length,
            value: "tools"
        });
        _width += 35 * this.option.deals.length;
        this.data.header = {
            left: et,
            right: this.data.header,
            leftWidth: _width,
            leftHeight: this.option.headerHeight
        }
    },
    then: function (ps) {
        var ths = this;
        return ps.then(function (data) {
            ths.start();
            var _body = [];
            var _list = data.list;
            for (var i = 0; i < _list.length; i++) {
                _body.push(ths.getRowData(_list[i]));
            }
            var _left = [];
            for (var i = 0; i < _body.length; i++) {
                var r = {cols:[]}, rr = _body[i];
                if (ths.option.num) {
                    r.cols.push({
                        width: 30,
                        key:"__num__",
                        value:"&nbsp;",
                        none:true
                    });
                }
                if (ths.option.checkbox) {
                    r.cols.push({
                        width: 30,
                        key:"__checkbox__",
                        value:false,
                        none:true
                    });
                }
                for (var m = 0; m < ths.option.deals.length; m++) {
                    r.cols.push({
                        width:35,
                        key:"__deals__",
                        value:ths.option.deals[m],
                        none:true
                    });
                }
                r.height=rr.height;
                r.selected=rr.selected;
                r.warn=rr.warn;
                r.error=rr.error;
                r.id=rr.id;
                _left.push(r);
            }
            ths.data.body = {
                left: _left,
                right: _body,
                leftWidth: ths.data.header.leftWidth,
                leftHeight: ths.data.header.leftHeight
            };
            ths.data.footer = {
                pages:ths.getPagesData(data.current, data.total),
                size:{
                    map:ths.option.pageSizes,
                    current:ths.option.pageSize
                }
            };
            ths.trigger();
        }, function () {
            ths.start();
            ths.trigger();
        });
    },
    getRowProps:function(id){
        var r=null;
        for(var i=0;i<this.data.body.right.length;i++){
            if(this.data.body.right[i].id===id){
                r=this.data.body.right[i];
                break;
            }
        }
        return r;
    },
    setRowProps:function(id,data){
        var r=null,index=null;
        for(var i=0;i<this.data.body.right.length;i++){
            if(this.data.body.right[i].id===id){
                r=this.data.body.right[i];
                index=i;
                break;
            }
        }
        if(r){
            $.extend(this.data.body.left[index],data);
            $.extend(r,data);
        }
    },
    setAllRowsProps:function(data){
        for(var i=0;i<this.data.body.right.length;i++){
            $.extend(this.data.body.right[i],data);
            $.extend(this.data.body.left[i],data);
        }
    },
    checkSelectedState:function(){
        var isall=true;
        for(var i=0;i<this.data.body.right.length;i++){
            if(!this.data.body.right[i].selected){
                isall=false;
                break;
            }
        }
        for(var i=0;i<this.data.header.left.cols.length;i++){
            if(this.data.header.left.cols[i].checkbox){
                this.data.header.left.cols[i].isall=isall;
                break;
            }
        }
    },
    getRowsByPropTrue:function(key){
        var r=[];
        for(var i=0;i<this.data.body.right.length;i++){
            var a=this.data.body.right[i];
            if(a[key]===true){
                r.push(this.getDataFromCols(a.cols));
            }
        }
        return r;
    },
    getAllRows:function(){
        var r=[];
        for(var i=0;i<this.data.body.right.length;i++){
            r.push(this.getDataFromCols(this.data.body.right[i].cols));
        }
        return r;
    },
    setColProps:function (index,props) {
        var index=null;
        for(var i=0;i<this.data.header.right.cols.length;i++){
            var a=this.data.header.right.cols[i];
            if(a.key===key){
                index=i;
                break;
            }
        }
        if(index!==null) {
            $.extend(this.data.header.right.cols[index], props);
            for (var i = 0; i < this.data.body.right.length; i++) {
                var row=this.data.body.right[i];
                for(var t=0;t<row.cols.length;t++){
                    if(row.cols[t].key===key){
                        $.extend(row.cols[t],props);
                        break;
                    }
                }
            }
        }
    }
});