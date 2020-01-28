layui.define(["element", "jquery", "layer"], function(exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;

    /**
     * 自定义一个模块
     */
    layuimini = new function () {

        /**
         * 判断窗口是否已打开
         * @param tabId
         **/
        this.checkTab = function (tabId, isIframe) {
            // 判断选项卡上是否有
            var checkTab = false;
            if (isIframe == undefined || isIframe == false) {
                $(".layui-tab-title li").each(function () {
                    checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId == tabId) {
                        checkTab = true;
                    }
                });
            } else {
                parent.layui.$(".layui-tab-title li").each(function () {
                    checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId == tabId) {
                        checkTab = true;
                    }
                });
            }
            if (checkTab == false) {
                return false;
            }

            // 判断sessionStorage是否有
            var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("myTabInfo"));
            if (layuiminiTabInfo == null) {
                layuiminiTabInfo = {};
            }
            var check = layuiminiTabInfo[tabId];
            if (check == undefined || check == null) {
                return false;
            }
            return true;
        };

        /**
         * 打开新窗口
         * @param tabId
         * @param href
         * @param title
         */
        this.addTab = function (tabId, href, title, addSession) {
            if (addSession == undefined || addSession == true) {
                var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("myTabInfo"));
                if (layuiminiTabInfo == null) {
                    layuiminiTabInfo = {};
                }
                layuiminiTabInfo[tabId] = {href: href, title: title}
                sessionStorage.setItem("myTabInfo", JSON.stringify(layuiminiTabInfo));
            }
            element.tabAdd('myTab', {
                title: title + '<i data-tab-close="" class="layui-icon layui-unselect layui-tab-close">ဆ</i>' //用于演示
                , content: '<iframe width="100%" height="100%" frameborder="0"  src="' + href + '"></iframe>'
                , id: tabId
            });
        };

        /**
         * 删除窗口
         * @param tabId
         * @param isParent
         */
        this.delTab = function (tabId, isParent) {
            var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("myTabInfo"));
            if (layuiminiTabInfo != null) {
                delete layuiminiTabInfo[tabId];
                sessionStorage.setItem("myTabInfo", JSON.stringify(layuiminiTabInfo))
            }
            if (isParent === true) {
                parent.layui.element.tabDelete('myTab', tabId);
            } else {
                element.tabDelete('myTab', tabId);
            }
        };

        /**
         * 切换选项卡
         **/
        this.changeTab = function (tabId) {
            element.tabChange('myTab', tabId);
        };
    };
    /**
     * 初始化首页
     */
    this.init = function() {
        layer.msg("success")
    }

    /**
     * 刷新子菜单
     */
    $('body').on('click', '[data-refresh]', function() {
        $(".layui-tab-item.layui-show").find("iframe")[0].contentWindow.location.reload();
        layer.msg('刷新成功', { icon: 1 });
    });
    /**
     * 在iframe子菜单上打开新窗口
     */
    $('body').on('click', '[data-iframe-tab]', function () {
        var loading = parent.layer.load(0, {shade: false, time: 2 * 1000});
        var tabId = $(this).attr('data-iframe-tab'),
            href = $(this).attr('data-iframe-tab'),
            icon = $(this).attr('data-icon'),
            title = $(this).attr('data-title'),
            target = $(this).attr('target');
        if (target == '_blank') {
            parent.layer.close(loading);
            window.open(href, "_blank");
            return false;
        }
        title = '<i class=layui-icon"' + icon + '"></i><span class="layui-left-nav"> ' + title + '</span>';
        if (tabId == null || tabId == undefined) {
            tabId = new Date().getTime();
        }
        // 判断该窗口是否已经打开过
        var checkTab = layuimini.checkTab(tabId, true);
        if (!checkTab) {
            var myTabInfo = JSON.parse(sessionStorage.getItem("myTabInfo"));
            if (myTabInfo == null) {
                myTabInfo = {};
            }
            myTabInfo[tabId] = {href: href, title: title}
            sessionStorage.setItem("myTabInfo", JSON.stringify(myTabInfo));
            parent.layui.element.tabAdd('myTab', {
                title: title + '<i data-tab-close="" class="layui-icon layui-unselect layui-tab-close">ဆ</i>' //用于演示
                , content: '<iframe width="100%" height="100%" frameborder="0"  src="' + href + '"></iframe>'
                , id: tabId
            });
        }
        // console.log(tabId);
        parent.layui.element.tabChange('myTab', tabId);
        parent.layer.close(loading);
    });
    /**
     * 关闭选项卡
     **/
    $('body').on('click', '[data-tab-close]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});
        $parent = $(this).parent();
        tabId = $parent.attr('lay-id');
        if (tabId != undefined || tabId != null) {
            layuimini.delTab(tabId);
        }
        layuimini.tabRoll();
        layer.close(loading);
    });

});