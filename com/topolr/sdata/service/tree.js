/**
 * @packet sdata.service.tree;
 */
var setProp = function (obj, key, value) {
    Object.defineProperty(obj, key, {
        enumerable: false,
        configurable: false,
        writable: true,
        value: value
    });
};
Module({
    name:"treeservice",
    extend:"localservice",
    option:{
        url:"",
        parameter:null
    },
    init:function () {
        this.start();
    },
    service_set:function (option) {
        this.stop();
        this.option.url=option.url;
        this.option.parameter=option.parameter;
        return this.getData().scope(this).then(function (data) {
            this.setData(data);
            this.start();
            this.trigger();
        });
    },
    getData:function () {
        return this.postRequest(this.option.url,this.option.parameter);
    },
    setData:function (data) {
        var r={};
        var scan=function (list) {
            for(var i=0;i<list.length;i++){
                var item=list[i];
                setProp(item,"__state__",{
                    select:false,
                    open:true,
                    active:false,
                    num:undefined
                });
                r[item.id]=item;
                scan(item.list);
            }
        };
        scan(data);
        this.data=data;
        this._map=r;
    },
    action_toggleopen:function (item) {
        item["__state__"].open=item["__state__"].open?false:true;
        this.trigger();
    },
    action_toggleselect:function (item) {
        item["__state__"].select=item["__state__"].select?false:true;
        this.trigger();
    },
    action_toggleselectcascade:function (item) {
        var setallsub=function (item,state) {
            item["__state__"].select=state;
            for (var i = 0; i < item.list.length; i++) {
                var a = item.list[i];
                a["__state__"].select = state;
                setallsub(a,state);
            }
        };
        if(!item["__state__"].select) {
            setallsub(item,true);
            var parent=this._map[item.pid];
            while(parent){
                parent["__state__"].select=true;
                parent=this._map[parent.pid];
            };
        }else{
            setallsub(item,false);
            var parent=this._map[item.pid];
            while(parent) {
                var has=false
                for (var n = 0; n < parent.list.length; n++) {
                    if(parent.list[n]["__state__"].select){
                        has=true;
                        break;
                    }
                }
                parent["__state__"].select=has;
                parent=this._map[parent.pid];
            }
        }
        this.trigger();
    },
    action_active:function (item) {
        for(var i in this._map){
            this._map[i]["__state__"].active=false;
        }
        item["__state__"].active=true;
        this.trigger();
    },
    action_setnum:function (id,num) {
        if(this._map[id]){
            this._map[id]["__state__"].num=num;
        }
        this.trigger();
    }
});