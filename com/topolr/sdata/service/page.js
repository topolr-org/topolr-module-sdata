/**
 * @packet sdata.service.page;
 */
Module({
    name:"baseservice",
    extend:"privateservice",
    option:{
        pageSize:10,
        from:0,
        fromName:"page",
        sizeName:"size",
        url:""
    },
    init:function () {
        this._current=0;
        this._end=false;
    },
    gotoPage:function (page) {
        if(page<=0){
            page=1;
        }
        var paras={},ths=this;
        paras[this.option.fromName]=this.option.from+(page-1)*this.option.pageSize;
        paras[this.option.sizeName]=this.option.pageSize;
        this._current=page;
        return this.postRequest(this.option.url,paras).then(function (data) {
            if(data.list){
                if(data.list.length>=ths.option.pageSize){
                    ths._end=false;
                }else{
                    ths._end=true;
                }
            }else{
                ths._end=true;
            }
            return {
                current:ths._current,
                list:data.list
            };
        });
    },
    nextPage:function () {
        var a=this._current+1;
        return this.gotoPage(a);
    },
    prevPage:function () {
        var a=this._current-1;
        return this.gotoPage(a);
    },
    isEnd:function () {
        return this._end;
    },
    getCurrent:function() {
        return this._current;
    }
});
Module({
    name:"totalservice",
    extend:"@.baseservice",
    init:function () {
        this.superClass("init");
        this._total=0;
        this._totalPage=0;
    },
    gotoPage:function (page) {
        if(page<=0){
            page=1;
        }
        var paras={},ths=this;
        paras[this.option.fromName]=this.option.from+(page-1)*this.option.pageSize;
        paras[this.option.sizeName]=this.option.pageSize;
        this._current=page;
        return this.postRequest(this.option.url,paras).then(function (data) {
            if(data.total){
                ths._total=data.total;
                var a=data.total%ths.option.pageSize;
                if(a===0){
                    ths._totalPage=data.total/ths.option.pageSize;
                }else{
                    ths._totalPage=parseInt(data.total/ths.option.pageSize)+1;
                }
            }
            if(data.list){
                if(data.list.length>=ths.option.pageSize){
                    ths._end=false;
                }else{
                    ths._end=true;
                }
            }else{
                ths._end=true;
            }
            return {
                list:data.list,
                total:ths._totalPage,
                current:ths._current
            };
        });
    }
});