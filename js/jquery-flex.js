/*
 * Copyright (c) 2016. reserved.
 * Prashant Pandey.
 * Created by Prashant on 07/27/2016.
 */

jQuery(document).ready(function ($) {

    var scrollArrow = $('.scroll-down');
    scrollArrow.on('click', function (event) {
        event.preventDefault();
        smoothScroll($(this.hash));
    });

});

var fixNavOnScroll = function (Nav, NavTopPosition) {
    if ($(window).scrollTop() > NavTopPosition) {
        Nav.addClass('is-fixed');
        setTimeout(function () {
            Nav.addClass('animate-children');
        }, 50);
    } else {
        Nav.removeClass('is-fixed');
        setTimeout(function () {
            Nav.removeClass('animate-children');
        }, 50);
    }
}

function smoothScroll(target) {
    $('body,html').animate({'scrollTop': target.offset().top}, 300);
}

