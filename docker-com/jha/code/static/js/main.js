/*-----------------------------------------------------------------------------------*/
/*      Mian Js Start 
/*-----------------------------------------------------------------------------------*/

$(document).ready(function($) {
    "use strict"
    /*-----------------------------------------------------------------------------------*/
    /*      STICKY NAVIGATION
    /*-----------------------------------------------------------------------------------*/
    $(".sticky").sticky({ topSpacing: 0 });
    /*-----------------------------------------------------------------------------------*/
    /*  LOADER
    /*-----------------------------------------------------------------------------------*/
    $("#loader").delay(500).fadeOut("slow");
    /*-----------------------------------------------------------------------------------*/
    /*  FULL SCREEN
    /*-----------------------------------------------------------------------------------*/
    $('.full-screen').superslides({});
    /*-----------------------------------------------------------------------------------*/
    /*    Parallax
    /*-----------------------------------------------------------------------------------*/
    jQuery.stellar({
        horizontalScrolling: false,
        scrollProperty: 'scroll',
        positionProperty: 'position',
    });
    /*-----------------------------------------------------------------------------------
        HOME SIMPLE TEXT SLIDER
    /*-----------------------------------------------------------------------------------*/
    $('.home-slide').flexslider({
        mode: 'fade',
        auto: true
    });

    

    /*-----------------------------------------------------------------------------------*/
    /*  SLIDER REVOLUTION
    /*-----------------------------------------------------------------------------------*/
    jQuery('.tp-banner').show().revolution({
        dottedOverlay: "none",
        delay: 10000,
        startwidth: 1170,
        startheight: 900,
        navigationType: "",
        navigationArrows: "solo",
        navigationStyle: "preview1",
        parallax: "mouse",
        parallaxBgFreeze: "on",
        parallaxLevels: [7, 4, 3, 2, 5, 4, 3, 2, 1, 0],
        keyboardNavigation: "on",
        shadow: 0,
        fullWidth: "on",
        fullScreen: "off",
        shuffle: "off",
        autoHeight: "off",
        forceFullWidth: "off",
        fullScreenOffsetContainer: ""
    });

    /*----
    -------------------------------------------------------------------------------*/
    /*  ISOTOPE PORTFOLIO
    /*-----------------------------------------------------------------------------------*/
    var $container = $('.port-wrap .items');
    $container.imagesLoaded(function() {
        $container.isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'masonry'
        });
    });
    $('.portfolio-filter li a').on('click', function() {
        $('.portfolio-filter li a').removeClass('active');
        $(this).addClass('active');
        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector
        });
        return false;
    });
});


function nexlunbo(){
    // 新闻轮播
    $('.shutter').shutter({
        shutterW: img1.shutterW/2, // 容器宽度
        shutterH: img1.height, // 容器高度
        isAutoPlay: true, // 是否自动播放
        playInterval: 3000, // 自动播放时间
        curDisplay: 3, // 当前显示页
        fullPage: false // 是否全屏展示
    });
    var slider = new osSlider({ //开始创建效果
        pNode:'.slider', //容器的选择器 必填
        cNode:'.slider-main li', //轮播体的选择器 必填
        speed:3000, //速度 默认3000 可不填写
        autoPlay:true //是否自动播放 默认true 可不填写
    });
    img2.height=img1.height/2;
}

nexlunbo()
