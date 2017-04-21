;
(function (window, document, $, undefined) {
    var Pagers = function (ele, option) {
        var _default = {
            recoreds: 100, //总记录数
            pagerSize: 20, //每页的记录条数
            curPager: 1, //当前页码
            // totalPage: 3, //总页数
            firstText: '首页',
            firstIcon: '', //icon-shangyiye1
            prevText: '上一页',
            prevIcon: '', //icon-shangyiye1
            nextText: '下一页',
            nextIcon: '', //icon-xiayiye
            lastText: '尾页',
            lastIcon: '', //icon-zuihouyiye
            style: {
                container: {},
                list: {}
            },
            source: ['test1', 'test2'], //数据源：【type:Arrary,function(){需返回一个数组data}】
            success: function () {
                console.log('success!')
            }
        };
        this.$ele = ele;
        this.setting = $.extend({}, _default, option);

    }
    Pagers.prototype = {
        constructor: Pagers,
        init: function () {
            //初始化总页数
            this.setting.totalPage = Math.ceil(this.setting.recoreds / this.setting.pagerSize);
            this.initInstance();
            var that = this;
            var id = 'pager' + new Date().valueOf();
            return this.$ele.each(function () {
                var $this = $(this);
                that.renderHtml($this, id);
                if(that.setting.totalPage<=1){
                    $this.find('li').addClass('disable')
                }
                //首页
                $this.find('.pager_first').on('click', function () {
                    that.setting.gotoPage = 1;
                    that.changeStyle($(this));
                })
                //上一页
                $this.find('.pager_prev').on('click', function () {
                    that.setting.gotoPage--;
                    that.changeStyle($(this));
                })
                //下一页
                $this.find('.pager_next').on('click', function () {
                    that.setting.gotoPage++;
                    that.changeStyle($(this));
                })
                //尾页
                $this.find('.pager_last').on('click', function () {
                    that.setting.gotoPage = that.setting.totalPage;
                    that.changeStyle($(this));
                })
                //跳转到指定页
                $this.find('.pager_go_btn').on('click', function () {
                    $(this).parent().siblings().removeClass('disable');
                    var val = $(this).siblings().val();
                    var num = val >= that.setting.totalPage ? that.setting.totalPage : val < 1 ? 1 : val;
                    $(this).siblings().val(num);
                    that.setting.gotoPage = num;
                    if (that.setting.gotoPage == 1) {
                        $(this).parent().siblings('.left').addClass('disable');
                    }
                    if (that.setting.gotoPage == that.setting.totalPage) {
                        $(this).parent().siblings('.right').addClass('disable');
                    }
                })
            });
        },
        renderHtml: function ($parent, id) {
                var parentHeight = $parent.height();

                var pagerHtml = "     <div id='" + id + "' class='pager_container'>" +
                    "       <ul >" +
                    "            <li class='left pager_first'><i class='iconfont " + this.setting.firstIcon + "'></i><span class='text'>" + this.setting.firstText + "</span></li>" +
                    "            <li class='left pager_prev'><i class='iconfont " + this.setting.prevIcon + "'></i><span class='text'>" + this.setting.prevText + "</span></li>" +
                    "            <li class='right pager_next'><span class='text'>" + this.setting.nextText + "</span><i class='iconfont " + this.setting.nextIcon + "'></i></li>" +
                    "            <li class='right pager_last'><span class='text'>" + this.setting.lastText + "</span><i class='iconfont " + this.setting.lastIcon + "'></i></li>" +
                    "            <li class='pager_go'>" +
                    "                <input type='text' name='' value='1'/>" +
                    "                <input class='pager_go_btn' type='button' value='GO'/>" +
                    "            </li>" +
                    "            <li class='pager_title'><span class='pager_title_curPage'>" + this.setting.curPager + "</span>&nbsp;&frasl;&nbsp;<span>" + this.setting.totalPage + "</span></li>" +
                    "        </ul>" +
                    "      </div>";
                $parent.append(pagerHtml);
            },
        initInstance: function () { //跳转到某页
            var that=this;
            Object.defineProperty(this.setting,'gotoPage',{
                get:function(){
                    return this.curPager
                },
                set:function(num){
                    this.curPager=num;
                    that.$ele.find('.pager_title_curPage').text(num);
                    this.success(that.getData());
                }
            }) 
        },
        changeStyle: function ($ele) {
            if ($ele.hasClass('disable')) return;
            $ele.parent().children().removeClass('disable');
            var direction = $ele.attr('class').split(' ')[0];
            if ((direction == 'left' && this.setting.curPager <= 1) || (direction == 'right' && this.setting.curPager >= this.setting.totalPage)) {
                $ele.parent().children('.' + direction).addClass('disable');
            }
        },
        getData: function () {
            debugger
            var data = null;
            var limit=[(this.setting.curPager-1)*this.setting.pagerSize,this.setting.curPager*this.setting.pagerSize];
            var sourceType = Object.prototype.toString.call(this.setting.source).replace(/(\[object\s)|\]/g, '');
            if (sourceType == 'Array') {
                data = this.setting.source.slice(limit[0],limit[1]);
            } else if (sourceType == 'Function') {
                data = this.setting.source(limit);
            } else {
                console.log('数据源错误，请检查！【目前支持Array/Function】')
            }
            return data;
        }
    };

    // 对接jQuery
    $.fn.Pager = function (option) {
        var pager = new Pagers(this, option);
        return pager.init();
    }
})(window, document, jQuery)