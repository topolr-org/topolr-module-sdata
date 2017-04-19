var topolr=require("topolr-util");
module.exports={
    name:"pagecount",
    fn:function (url,parameters) {
        var ps=topolr.promise();
        try {
            var ths = this;
            var r = 0;
            var num = parameters[this.info.mock.option.num];
            var size = parameters[this.info.mock.option.size];
            var list = this.info.mock.option.list;
            var total = this.info.mock.option.total;
            var current = num;
            if (current > total) {
                r = 0;
            } else {
                if (total - current > size) {
                    r = size;
                } else {
                    r = total - current;
                }
            }
            var _aa = list.split(".");
            var _bb = _aa.pop();
            var list2 = _aa.join(".") + "[\"" + _bb + " [" + r + "]\"]";
            var e = this.info["response-success"];
            (new Function("this." + list2 + "=this." + list + ";" +
                "delete this." + list + ";")).call(e);
            this.info["response-success"] = e;
            var _cc=ths.parse(parameters);
            if(_cc) {
                ps.resolve(_cc);
            }else{
                ps.reject();
            }
        }catch (e){
            ps.reject();
        }
        return ps;
    }
};