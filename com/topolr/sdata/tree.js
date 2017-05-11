/**
 * @packet sdata.tree;
 * @template sdata.template.treetemp;
 * @css sdata.style.treestyle;
 * @require sdata.service.tree;
 * @require icon.action;
 * @require icon.direct;
 * @require icon.iconpreviewer;
 */
Module({
    name:'simpletree',
    extend:"view",
    autodom:true,
    className:"mt-simpletree",
    template:"@treetemp.simpletree",
    services:{tree:"@tree.treeservice"},
    option:{
        url:"",
        paramter:null
    },
    init:function () {
        this.getService("tree").trigger("set",this.option);
    },
    bind_arrow:function (dom) {
        this.getService("tree").action("toggleopen",dom.parent().cache());
    }
});
Module({
    name:'selecttree',
    extend:"@.simpletree",
    template:"@treetemp.selecttree",
    option:{
        selectType:"cascade"//simple,cascade
    },
    bind_select:function (dom) {
        if(this.option.selectType==="simple") {
            this.getService("tree").action("toggleselect", dom.parent().cache());
        }else{
            this.getService("tree").action("toggleselectcascade", dom.parent().cache());
        }
    }
});