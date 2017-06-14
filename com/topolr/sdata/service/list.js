/**
 * @packet sdata.service.list;
 * @require sdata.service.page;
 */
Module({
    name: "nocacheservice",
    extend: "@page.totalservice",
    action_set: function (option) {
        this.option = $.extend(true, {}, this.option, option);
        this.data = {
            list: [],
            total: 0,
            current: 1,
            pages: {}
        };
        this.start();
        this.trigger();
    },
    then: function (info) {
        try {
            this.data = {
                list: info.list,
                total: info.total,
                current: info.current,
                pages: this.getPagesData(info.current, info.total)
            };
            this.start();
            this.trigger();
        }catch (e){
            this.trigger();
        }
    },
    service_gotopage: function (num) {
        var ths = this;
        this.stop();
        return this.gotoPage(num).then(function (info) {
            return ths.then(info);
        },function (a) {
            ths.start();
            console.log(a)
        });
    },
    service_prev: function () {
        var ths=this;
        this.stop();
        return this.prevPage().then(function (info) {
            return ths.then(info);
        },function () {
            ths.start();
        });
    },
    service_next: function () {
        var ths=this;
        this.stop();
        return this.nextPage().then(function (info) {
            return ths.then(info);
        },function (a) {
            ths.start();
        });
    }
});