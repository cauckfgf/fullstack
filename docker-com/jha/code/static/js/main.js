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
    jQuery('.tp-banner').revolution({
        dottedOverlay: "none",
        delay: 1000,
        startwidth: 1170,
        startheight: 900,
        navigationType: "none",
        navigationArrows: "solo",
        navigationStyle: "preview1",
        parallax: "mouse",
        parallaxBgFreeze: "on",
        parallaxLevels: [7, 4, 3, 2, 5, 4, 3, 2, 1, 0],
        keyboardNavigation: "on",
        shadow: 0,
        fullWidth: "off",
        fullScreen: "off",
        shuffle: "off",
        autoHeight: "off",
        forceFullWidth: "off",
        fullScreenOffsetContainer: ""
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
    
    // var galleryThumbs = new Swiper('.gallery-thumbs', {
    //   spaceBetween: 10,
    //   slidesPerView: 3,
    //   freeMode: true,
    //   watchSlidesVisibility: true,
    //   watchSlidesProgress: true,
    //   paginationClickable: false,
    // });
    
    var galleryLeft = new Swiper('.gallery-left', {
      direction : 'vertical',
      slidesPerView: 3,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        hideOnClick: true,
      },
      height: 200
    });
    var galleryTop = new Swiper('.gallery-top', {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        hideOnClick: true,
      },
      thumbs: {
        swiper: galleryLeft
      }
    });
    // var galleryThumbs = new Swiper('.gallery-thumbs-1', {
    //   spaceBetween: 10,
    //   slidesPerView: 3,
    //   freeMode: true,
    //   watchSlidesVisibility: true,
    //   watchSlidesProgress: true,
    //   paginationClickable: false,
    // });
    var galleryLeft1 = new Swiper('.gallery-left-1', {
      direction : 'vertical',
      slidesPerView: 3,
      spaceBetween: 10,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      paginationClickable: false,
      height: 200
    });
    var galleryTop1 = new Swiper('.gallery-top-1', {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        hideOnClick: true,
      },
      thumbs: {
        swiper: galleryLeft1
      }
    });
    
});


