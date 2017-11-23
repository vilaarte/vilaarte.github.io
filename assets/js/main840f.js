var trigged=[],scrollTimeout;
jQuery(function ($) {

    $('#about-us .bar').attr('style', '')
    //Trigger rotate
    // --------------------
    var rotateCycle = setInterval(function () {
        var thumbs = $('#header .thumb:not(.active)');
        var thumb_act = $('#header .active');
        if ($('html').hasClass('csstransforms3d')) {
            $(thumbs[getRandomInt(0, thumbs.length)]).addClass('active');
            $(thumb_act[getRandomInt(0, thumb_act.length)]).removeClass('active');
        }
        else {
            $(thumbs[getRandomInt(0, thumbs.length)]).addClass('active').find('img:last').fadeOut();
            $(thumb_act[getRandomInt(0, thumb_act.length)]).removeClass('active').find('img:last').fadeIn();
        }

    }, 3000);

    function triggerEvent(elem, fn, offset) {
        if (!elem.offset()) return;
        var top = elem.offset().top;
        if ((top - offset) < $(window).scrollTop()) {
            fn(elem);
        }
    }

    //Window on scroll event
    //-------------------------------
    $(window).scroll(function () {
        var wtop = $(window).scrollTop();
        var header_heigh = $('#header').height();
        if (wtop < header_heigh) {
            $('#navbar').removeClass('navbar-fixed-top');
            $('#header').css('margin-bottom', 0);
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {

            triggerEvent($('#portfolio'), function () {
                if (trigged['portfolio']) return;
                $('.isotope .item').addClass('active');
                trigged['portfolio'] = true;
            }, 100);

            triggerEvent($('#about-us'), function () {
                if (trigged['about-us']) return;
                $('.progress .bar').each(function () {
                    var $this = $(this);
                    $this.css('width', $this.data('width') + '%');
                });
                trigged['about-us'] = true;
            }, 200);

        }, 50);

        triggerEvent($('#navbar'), function (elem) {
            if (elem.hasClass('navbar-fixed-top')) return;
            elem.addClass('navbar-fixed-top');
            $('#header').css('margin-bottom', $('#navbar').height());
        }, 0)
    });

    //Window on resize event
    //------------------------------------------------
    $(window).resize(function () {
        var metro = $('#header .container.visible-phone:visible');
        var bricks = metro.find('.brick1');
        var size = metro.width() / 2
        bricks.css({ width: size, height: size });


    });

    $(window).trigger('resize');

    //Vertical scroll for blog section
    //------------------------------------------
    $(".blog_container").mCustomScrollbar({
        horizontalScroll: true,
        advanced: {
            autoExpandHorizontalScroll: true
        }
    });


    // Nav button click 
    // -------------------------------------------------------

    $('#navbar .nav a:not(.external) , #header a.nav-item:not(.external) , #navbar .brand:not(.external),#btn_up, #btn_contact a:not(.external)').click(function (e) {
        e.preventDefault();
        var des = '#' + $(this).attr('href').split('#')[1];
        if ($('.navbar .nav-collapse').hasClass('in')) {
            $('.navbar .btn-navbar').trigger('click');
        }
        goToSectionID(des);
    })

    /**
    * Isotope filter
    */
    // cache container
    var $container = $('.isotope');
    // initialize isotope
    $container.isotope({
        // options...
    });

    // filter items when filter link is clicked
    $('.filter a').click(function () {
        var selector = $(this).attr('data-filter');
        $container.isotope({ filter: selector });
        $('.filter a.active').removeClass('active');
        $(this).addClass('active');
        return false;
    });

    /**
    * Portfolio hover effect 
    */
    $('#modalbox').on('show', function () {
        $('.modal-backdrop:first').fadeOut(function () { $(this).remove(); })
        $('.rotate_container').fadeOut();
        $(this).css({ position: 'absolute', top: $(window).scrollTop() })
    })
		.on('hidden', function () {
		    $(this).find('.modal-body').html('');
		});
    $(' .isotope > li ').each(function () {
        var $this = $(this);
        $(this).hoverdir({
            hoverDelay: 0
        });
        $this.find('a').on('click', function (e) {
            e.preventDefault();
            $('body').append('<div class="modal-backdrop fade in"></div>');
            $('.rotate_container').show();
            $.get($(this).attr('href'), function (resutl) {
                $('#modalbox .modal-body').html(resutl);
                $('#modalbox').modal('show');
            })

        });
    });

    /**
    * Init carousel
    */
    $('.testimonial').carousel({ interval: 5000 });



    /**
    * Detect IE 10
    */

    if (/*@cc_on!@*/false) {
        $("html").addClass("ie10");

    }
    // if ($.browser.msie && $.browser.version == 10) {
    // 	  $("html").addClass("ie10");
    // 	}
})

jQuery(window).load(function($){

	// Trigger window scroll event when page loaded
	// -------------------------------------------------------
	jQuery(window).trigger('scroll');

})

//Custom functions 

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Scroll to section
 * @param  string des HTML identity of section block
 * @return void
 */
onanimate = false;
function goToSectionID(des){
	onanimate = true;
	var pos = (jQuery(des).length>0 )?jQuery(des).offset().top:0;
	jQuery('html,body').animate({scrollTop:pos},1000,function(){
		if(history.pushState){
			history.pushState(null,null,des);
		}else		window.location.hash = des;
		jQuery(window).scrollTop(pos);
		onanimate=false
	});
}