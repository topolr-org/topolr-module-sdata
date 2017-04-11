/**
 * @packet sdata.test;
 * @require sdata.table;
 */
Option({
    name:"boot",
    option:{
        override:{
            onendinit:function () {
                this.addChild({
                    type:"@table.simpletable",
                    option:{
                        url:sitePath+"/test/page",
                        cols:[
                            {name:"name",key:"name",width:100},
                            {name:"birth",key:"birth",width:100},
                            {name:"id",key:"id",width:100}
                        ]
                    },
                    container:this.finders("container")
                });
            }
        }
    }
});