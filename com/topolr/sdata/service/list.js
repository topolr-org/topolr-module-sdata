/**
 * @packet sdata.service.list;
 * @require sdata.service.page;
 */
Module({
    name:"nocacheservice",
    extend:"@page.totalservice",
    action_set:function (option) {
        this.option = $.extend(true, {}, this.option, option);
        this.data={
            list:[],
            total:0,
            current:1,
            pages:{}
        };
        this.start();
        this.trigger();
    },
    service_gotopage:function (num) {
        var ths=this;
        this.stop();
        this.gotoPage(num).then(function (info) {
            ths.data={
                list:info.list,
                total:info.total,
                current:info.current,
                pages:ths.getPagesData(info.current,info.total)
            };
            this.start();
            this.trigger();
        });
    }
});