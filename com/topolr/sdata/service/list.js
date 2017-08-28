/**
 * @packet sdata.service.list;
 * @require sdata.service.page;
 */
Module({
    name: "listservice",
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
    service_retry: function () {
        return this.service_gotopage(this._current);
    },
    service_prev: function () {
        var ths = this;
        this.stop();
        return this.prevPage().then(function (info) {
            return ths.then(info);
        }, function () {
            ths.start();
        });
    },
    service_next: function () {
        var ths = this;
        this.stop();
        return this.nextPage().then(function (info) {
            return ths.then(info);
        }, function (a) {
            ths.start();
        });
    },
    service_gotopage: function (num) {
        var ths = this;
        this.stop();
        return this.gotoPage(num).then(function (info) {
            return ths.then(info);
        }, function (a) {
            ths.start();
            console.log(a)
        });
    },
    action_setparameters:function (data) {
        this.setParameters(data);
    },
    service_refresh:function () {
        this.refresh();
    }
});
Module({
    name: "nocacheservice",
    extend: ["@page.pageservice", "@.listservice"],
    then: function (info) {
        try {
            this.data = {
                list: info.list,
                total: info.total,
                current: info.current,
                totalsize:info.totalsize,
                pages: this.getPagesData(info.current, info.total)
            };
            this.start();
            this.trigger();
        } catch (e) {
            this.trigger();
        }
    }
});
Module({
    name: "cacheservice",
    extend: ["@page.totalservice", "@.listservice"],
    action_clean: function () {
        this.data.list = [];
        this.data.current = 1;
        this._end = false;
    },
    then: function (info) {
        try {
            this.data = {
                list: this.data.list.concat(info.list),
                total: info.total,
                current: info.current,
                totalsize:info.totalsize,
                isend: info.isend
            };
            this.start();
            this.trigger();
        } catch (e) {
            this.trigger();
        }
    },
    action_reset: function () {
        this._end = false;
    }
});