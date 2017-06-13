/**
 * @packet sdata.test;
 * @require sdata.table;
 * @require sdata.tree;
 */
Option({
    name:"boot",
    option:{
        override:{
            onendinit:function () {
                // this.addChild({
                //     type:"@tree.simpletree",
                //     option:{
                //         url:sitePath+"mock/tree"
                //     },
                //     container:this.finders("container")
                // });
                // this.addChild({
                //     type:"@tree.selecttree",
                //     option:{
                //         url:sitePath+"mock/tree",
                //         override:{
                //             event_itemclick:function (e) {
                //                 this.setNum(e.data.id,10);
                //             }
                //         }
                //     },
                //     container:this.finders("container1")
                // });
                // this.postRequest({
                //     url:sitePath+"mock/tree"
                // }).then(function (a) {
                //     console.log(a)
                // });
                this.addChild({
                    type:"@table.simpletable",
                    option:{
                        url:sitePath+"/test/page",
                        cols:[
                            {name:"name",key:"name",width:200,disable:false},
                            {name:"birth",key:"birth",width:200,disable:false},
                            {name:"id",key:"id",width:200,disable:true}
                        ],
                        selectType:"single"
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
                            {name:"refresh",action:"refresh",icon:"icon-loop2"},
                            {name:"removeall",action:"removeall",icon:"icon-cross"}
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
                            {name:"refresh",action:"refresh",icon:"icon-loop2"},
                            {name:"removeall",action:"removeall",icon:"icon-cross"}
                        ]
                    },
                    container:this.finders("container2")
                });
            }
        }
    }
});