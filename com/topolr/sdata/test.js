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
                            {name:"name",key:"name",width:100,disable:false},
                            {name:"birth",key:"birth",width:100,disable:false},
                            {name:"id",key:"id",width:100,disable:true}
                        ]
                    },
                    container:this.finders("container")
                });
                this.addChild({
                    type:"@table.fntable",
                    option:{
                        url:sitePath+"/test/page",
                        cols:[
                            {name:"name",key:"name",width:100},
                            {name:"birth",key:"birth",width:100},
                            {name:"id",key:"id",width:100}
                        ],
                        checkbox: true,
                        num: true,
                        deals: [
                            {name:"A",action:"a",icon:"icon-image"},
                            {name:"B",action:"b",icon:"icon-image"},
                            {name:"C",action:"c",icon:"icon-image"}
                        ],
                        tools:[
                            {name:"AA",action:"aa"}
                        ]
                    },
                    container:this.finders("container1")
                });
                this.addChild({
                    type:"@table.doublefntable",
                    option:{
                        url:sitePath+"/test/page",
                        cols:[
                            {name:"name",key:"name",width:200},
                            {name:"birth",key:"birth",width:200},
                            {name:"id",key:"id",width:200}
                        ],
                        checkbox: true,
                        num: true,
                        deals: [
                            {name:"A",action:"a",icon:"icon-eye"},
                            {name:"B",action:"b",icon:"icon-eye"},
                            {name:"C",action:"c",icon:"icon-eye"}
                        ],
                        tools:[
                            {name:"AA",action:"aa"}
                        ]
                    },
                    container:this.finders("container2")
                });
            }
        }
    }
});