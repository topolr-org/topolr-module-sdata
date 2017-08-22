/**
 * @packet sdata.test;
 * @require sdata.table;
 * @require sdata.tree;
 * @require sdata.list;
 */
Option({
    name:"boot",
    option:{
        override:{
            layout:"[content]",
            onendinit:function () {
                this.addChild({
                    type:"@list.traditionlist",
                    option:{
                        url:sitePath+"/test/page",
                        tools: [
                            {name:"btn-a",action:"a",icon:"mt-icon-ban"},
                            {name:"btn-a",action:"b",icon:"mt-icon-ban"}
                        ],
                        cols: [
                            {key:"id",name:"ID",width:50},
                            {key:"name",name:"Name",width:50}
                        ],
                        deals: [
                            {name:"A",action:"a",icon:"mt-icon-ban"},
                            {name:"B",action:"b",icon:"mt-icon-ban"}
                        ],
                        queryBtn:{
                            show:true,
                            keyName:"query",
                            placeholder:"搜索2"
                        },
                        override:{
                            event_tool_a:function (e) {
                                console.log("===>",e);
                            },
                            event_deal_a:function (e) {
                                console.log(e.data);
                            }
                        }
                    },
                    container:this.finders("container")
                });
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
                // this.addChild({
                //     type:"@table.simpletable",
                //     option:{
                //         url:sitePath+"/test/page",
                //         cols:[
                //             {name:"name",key:"name",width:200,disable:false},
                //             {name:"birth",key:"birth",width:200,disable:false},
                //             {name:"id",key:"id",width:200,disable:false}
                //         ],
                //         selectType:"single"
                //     },
                //     container:this.finders("container")
                // });
                // this.addChild({
                //     type:"@table.fntable",
                //     option:{
                //         url:sitePath+"/test/page",
                //         cols:[
                //             {name:"name",key:"name",width:100},
                //             {name:"birth",key:"birth",width:100},
                //             {name:"id",key:"id",width:100}
                //         ],
                //         checkbox: true,
                //         num: true,
                //         deals: [
                //             {name:"A",action:"a",icon:"t-icon-keyboard_arrow_down"},
                //             {name:"B",action:"b",icon:"t-icon-keyboard_arrow_down"},
                //             {name:"C",action:"c",icon:"t-icon-keyboard_arrow_down"}
                //         ],
                //         tools:[
                //             {name:"refresh",action:"refresh",icon:"t-icon-keyboard_arrow_down"},
                //             {name:"removeall",action:"removeall",icon:"t-icon-keyboard_arrow_down"}
                //         ]
                //     },
                //     container:this.finders("container1")
                // });
                // this.addChild({
                //     type:"@table.doublefntable",
                //     option:{
                //         url:sitePath+"/test/page",
                //         cols:[
                //             {name:"name",key:"name",width:200},
                //             {name:"birth",key:"birth",width:200},
                //             {name:"id",key:"id",width:200}
                //         ],
                //         checkbox: true,
                //         num: true,
                //         deals: [
                //             {name:"A",action:"a",icon:"t-icon-keyboard_arrow_down"},
                //             {name:"B",action:"b",icon:"t-icon-keyboard_arrow_down"},
                //             {name:"C",action:"c",icon:"t-icon-keyboard_arrow_down"}
                //         ],
                //         tools:[
                //             {name:"refresh",action:"refresh",icon:"t-icon-keyboard_arrow_down"},
                //             {name:"removeall",action:"removeall",icon:"t-icon-keyboard_arrow_down"}
                //         ]
                //     },
                //     container:this.finders("container1")
                // });
            }
        }
    }
});