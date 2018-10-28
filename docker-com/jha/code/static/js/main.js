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

    function onScrollInit(items, trigger) {
        items.each(function() {
            var osElement = $(this),
                osAnimationClass = osElement.attr('data-animation'),
                osAnimationDelay = osElement.attr('data-animation-delay');

            osElement.css({
                '-webkit-animation-delay': osAnimationDelay,
                '-moz-animation-delay': osAnimationDelay,
                'animation-delay': osAnimationDelay
            });

            var osTrigger = (trigger) ? trigger : osElement;

            osTrigger.waypoint(function() {
                osElement.addClass('animated').addClass(osAnimationClass);
            }, {
                triggerOnce: true,
                offset: '90%'
            });
        });
    }
    onScrollInit($('.scroll-animation'));
    onScrollInit($('.staggered-animation'), $('.staggered-animation-container'));

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
    /* Carousel Index page */
    var swiper = new Swiper('#carousel', {
        slidesPerView: 4,
        autoplay:true,
        speed:2000,
        paginationClickable: false,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        breakpoints: {
            1024: {
                slidesPerView: 4,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            400: {
                slidesPerView: 1,
                spaceBetween: 10
            }
        }
    });
    

});


function nexlunbo(){
    // 新闻轮播
    $('.shutter').shutter({
        shutterW: services.offsetWidth/2, // 容器宽度
        shutterH: services.offsetHeight, // 容器高度
        isAutoPlay: true, // 是否自动播放
        playInterval: 3000, // 自动播放时间
        curDisplay: 3, // 当前显示页
        fullPage: false // 是否全屏展示
    });
    // var slider = new osSlider({ //开始创建效果
    //     pNode:'.slider', //容器的选择器 必填
    //     cNode:'.slider-main li', //轮播体的选择器 必填
    //     speed:3000, //速度 默认3000 可不填写
    //     autoPlay:true //是否自动播放 默认true 可不填写
    // });
    img2.height=services.offsetHeight/2;
    
}

nexlunbo()
window.onload = function() {
  $("#yx").height(img2.height);
  $("#yx").width(img2.width);
  var swiper = new Swiper ('#yx', {
        direction: 'vertical',
        slidesPerView : 1,
        loop: true,
        autoplay:true,
        width: window.innerWidth/4,
        height:services.offsetHeight/2,
        // 如果需要分页器
        // pagination: '.swiper-pagination',
        
        // // 如果需要前进后退按钮
        // nextButton: '.swiper-button-next',
        // prevButton: '.swiper-button-prev',
        
        // // 如果需要滚动条
        // scrollbar: '.swiper-scrollbar',
        effect : 'cube',
          cubeEffect: {
            slideShadows: true,
            shadow: true,
            shadowOffset: 100,
            shadowScale: 0.6
        },
      });

}