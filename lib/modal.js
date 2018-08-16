(function() {
    // 注册事件
    this.registerEvent();
})();

function registerEvent() {
    // 标签页菜单
    $('.sky-tab-menu li').click(function(event) {
        // 移除其他状态
        $('.sky-tab-menu li.active').removeClass('active');
        // 当前点击的标签置为活动状态
        $(this).addClass('active');
        console.log("test: "+$(this).find('a').attr('href'));
        // 隐藏标签页显示的内容
        $('div.sky-tab-list > .sky-tab-item.active').removeClass('active');
        
        $($(this).find('a').attr('href')).addClass('active');
    });

}