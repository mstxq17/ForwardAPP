layui.define(["element", "jquery", "layer"], function(exports) {
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;

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
        var checkTab = false;
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

});