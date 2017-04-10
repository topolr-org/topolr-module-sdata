/**
 * @sdata.table;
 * @template sdata.template.tabletemp;
 * @css sdata.style.tablestyle;
 * @require sdata.service.table;
 */
Module({
    name:"basetable",
    extend:"viewgroup"
});
Module({
    name:"simpletable",
    extend:"@.basetable",
    className:"table-simpletable",
    template:"@tablestyle.base",
    option:{
        url:"",
        rowHeight: 40,
        checkbox: true,
        num: true,
        tools: [],
        deals: [],
        cols: [{
            key:"",
            width:100
        }]
    }
});