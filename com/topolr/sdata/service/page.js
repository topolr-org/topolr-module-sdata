/**
 * @packet sdata.service.page;
 */
Module({
    name: "baseservice",
    extend: "privateservice",
    option: {
        pageSize: 10,
        from: 0,
        fromName: "page",
        sizeName: "pagesize",
        url: ""
    },
    init: function () {
        this._current = 1;
        this._end = false;
        this._parameters={};
    },
    getParameter: function (page) {
        if (page <= 0) {
            page = 1;
        }
        var paras = {}, ths = this;
        paras[this.option.fromName] = this.option.from + (page - 1) * this.option.pageSize;
        paras[this.option.sizeName] = this.option.pageSize;
        return $.extend(paras,this._parameters);
    },
    gotoPage: function (page) {
        var ths = this;
        return this.postRequest(this.option.url, this.getParameter(page)).then(function (data) {
            ths._current = (page <= 0 ? 1 : page);
            if (data.list) {
                if (data.list.length >= ths.option.pageSize) {
                    ths._end = false;
                } else {
                    ths._end = true;
                }
            } else {
                ths._end = true;
            }
            return {
                current: ths._current,
                list: data.list
            };
        });
    },
    nextPage: function () {
        var a = this._current + 1;
        return this.gotoPage(a);
    },
    prevPage: function () {
        var a = this._current - 1;
        return this.gotoPage(a);
    },
    isEnd: function () {
        return this._end;
    },
    getCurrent: function () {
        return this._current;
    },
    resetPageSize: function (size) {
        this.option.pageSize = size;
        return this.gotoPage(1);
    },
    setParameters:function (data) {
        $.extend(this._parameters,data);
    },
    refresh:function () {
        this.gotoPage(1);
    }
});
Module({
    name: "pageservice",
    extend: "@.baseservice",
    init: function () {
        this.superClass("init");
        this._total = 0;
        this._totalPage = 0;
    },
    gotoPage: function (page) {
        var ths = this;
        return this.postRequest(this.option.url, this.getParameter(page)).then(function (data) {
            ths._current = (page <= 0 ? 1 : page);
            if (data.total) {
                ths._total = data.total;
                var a = data.total % ths.option.pageSize;
                if (a === 0) {
                    ths._totalPage = data.total / ths.option.pageSize;
                } else {
                    ths._totalPage = parseInt(data.total / ths.option.pageSize) + 1;
                }
            }
            if (data.list) {
                if (data.list.length >= ths.option.pageSize) {
                    ths._end = false;
                } else {
                    ths._end = true;
                }
            } else {
                ths._end = true;
            }
            return {
                list: data.list,
                total: ths._totalPage,
                current: ths._current,
                isend:ths._end
            };
        });
    },
    getPagesData: function (current, total) {
        var r = [];
        var prevpage = {
            name: "prev"
        }, nextpage = {
            name: "next"
        }, dots1 = {
            name: "dot",
            none: false
        }, dots2 = {
            name: "dot",
            none: false
        };
        var btns = {
            page0: {
                name: "btn",
                num: 1
            },
            page1: {
                name: "btn",
                num: 2
            },
            page2: {
                name: "btn",
                num: 3
            },
            page3: {
                name: "btn",
                num: 4
            },
            page4: {
                name: "btn",
                num: 5
            }
        };
        var num = current, total = total;
        if (total <= 5) {
            dots1.none = true;
            dots2.none = true;
            for (var i = 0; i < 5; i++) {
                if (i < total) {
                    btns["page" + i].none = false;
                    btns["page" + i].num = (i + 1);
                } else {
                    btns["page" + i].none = true;
                }
            }
        } else {
            btns.page4.num = total;
        }
        for (var i = 0; i < 5; i++) {
            btns["page" + i].iscurrent = false;
        }
        if (num < 4) {
            if (total > 5) {
                dots1.none = true;
                dots2.none = false;
            }
            btns["page" + (num - 1)].iscurrent = true;
            btns.page1.num = 2;
            btns.page2.num = 3;
            btns.page3.num = 4;
        } else {
            if (num <= total - 3) {
                dots1.none = false;
                dots2.none = false;
                btns.page1.num = (num - 1);
                btns.page2.num = (num);
                btns.page3.num = (num + 1);
                btns.page2.iscurrent = true;
            } else {
                if (total > 5) {
                    dots1.none = false;
                    dots2.none = true;
                }
                btns.page1.num = (total - 3);
                btns.page2.num = (total - 2);
                btns.page3.num = (total - 1);
                btns.page4.iscurrent=true;
            }
        }
        if (num === 1) {
            if (total === 1) {
                prevpage.disabled = true;
                nextpage.disabled = true;
            } else {
                prevpage.disabled = true;
                nextpage.disabled = false;
            }
        } else if (num === total) {
            prevpage.disabled = false;
            nextpage.disabled = true;
        } else {
            prevpage.disabled = false;
            nextpage.disabled = false
        }
        return [prevpage, btns.page0, dots1, btns.page1, btns.page2, btns.page3, dots2, btns.page4, nextpage];
    }
});
Module({
    name: "totalservice",
    extend: "@.pageservice",
    init: function () {
        this.superClass("init");
        this._total = 0;
        this._totalPage = 0;
    },
    gotoPage: function (page) {
        var ths = this;
        if(!this._end) {
            return this.postRequest(this.option.url, this.getParameter(page)).then(function (data) {
                ths._current = (page <= 0 ? 1 : page);
                if (data.total) {
                    ths._total = data.total;
                    var a = data.total % ths.option.pageSize;
                    if (a === 0) {
                        ths._totalPage = data.total / ths.option.pageSize;
                    } else {
                        ths._totalPage = parseInt(data.total / ths.option.pageSize) + 1;
                    }
                }
                if (data.list) {
                    if (data.list.length >= ths.option.pageSize) {
                        ths._end = false;
                    } else {
                        ths._end = true;
                    }
                } else {
                    ths._end = true;
                }
                return {
                    list: data.list,
                    total: ths._totalPage,
                    current: ths._current,
                    isend:ths._end
                };
            });
        }else{
            return $.promise(function (a) {
                a({
                    list: [],
                    total: ths._totalPage,
                    current: ths._current,
                    isend:ths._end
                });
            });
        }
    }
});