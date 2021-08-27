/**
 * @file
 * Attaches the behaviors for the indicator module.
 */

(function ($) {
  Drupal.behaviors.sym_indicator = {
    attach:function(context, settings) {
      var opacity = $('.indicator-content').css('opacity');

      $(document).bind('mousemove', function(event) {
        if($('.indicator-content').hasClass('top-left')) {
          if((event.pageY - window.pageYOffset) < ($('.indicator-content').outerHeight() + (15 - $('.indicator-content').css('border-width').replace('px',''))) && event.pageX < $('.indicator-content').outerWidth() + 100) {
            $('.indicator-content').css('top', (event.pageY - window.pageYOffset) - ($('.indicator-content').outerHeight() + 15) + 'px');
            $('.indicator-content').css('opacity', opacity - (Math.abs($('.indicator-content').css('top').replace('px','')) / $('.indicator-content').outerHeight()) * opacity);
          } else {
            $('.indicator-content').css('top', '-' + $('.indicator-content').css('border-width'));
            $('.indicator-content').css('opacity', opacity);
          }
        } else if($('.indicator-content').hasClass('top-right')) {
          if((event.pageY - window.pageYOffset) < ($('.indicator-content').outerHeight() + (15 - $('.indicator-content').css('border-width').replace('px',''))) && event.pageX > ($(window).width() + window.pageXOffset - $('.indicator-content').outerWidth() - 100)) {
            $('.indicator-content').css('top', (event.pageY - window.pageYOffset) - ($('.indicator-content').outerHeight() + 15) + 'px');
            $('.indicator-content').css('opacity', opacity - (Math.abs($('.indicator-content').css('top').replace('px','')) / $('.indicator-content').outerHeight()) * opacity);
          } else {
            $('.indicator-content').css('top', '-' + $('.indicator-content').css('border-width'));
            $('.indicator-content').css('opacity', opacity);
          }
        } else if($('.indicator-content').hasClass('bottom-left')) {
          if(event.pageY > ($(window).height() + window.pageYOffset - $('.indicator-content').outerHeight() - 15) && event.pageX < $('.indicator-content').outerWidth() + 100) {
            $('.indicator-content').css('bottom', 0 - (event.pageY - ($(window).height() + window.pageYOffset - $('.indicator-content').outerHeight())) - $('.indicator-content').css('border-width').replace('px','') - 15 + 'px');
            $('.indicator-content').css('opacity', opacity - (Math.abs($('.indicator-content').css('bottom').replace('px','')) / $('.indicator-content').outerHeight()) * opacity);
          } else {
            $('.indicator-content').css('bottom', '-' + $('.indicator-content').css('border-width'));
            $('.indicator-content').css('opacity', opacity);
          }
        } else if($('.indicator-content').hasClass('bottom-right')) {
          if(event.pageY > ($(window).height() + window.pageYOffset - $('.indicator-content').outerHeight() - 15) && event.pageX > ($(window).width() + window.pageXOffset - $('.indicator-content').outerWidth() - 100)) {
            $('.indicator-content').css('bottom', 0 - (event.pageY - ($(window).height() + window.pageYOffset - $('.indicator-content').outerHeight())) - $('.indicator-content').css('border-width').replace('px','') - 15 + 'px');
            $('.indicator-content').css('opacity', opacity - (Math.abs($('.indicator-content').css('bottom').replace('px','')) / $('.indicator-content').outerHeight()) * opacity);
          } else {
            $('.indicator-content').css('bottom', '-' + $('.indicator-content').css('border-width'));
            $('.indicator-content').css('opacity', opacity);
          }
        }
      });

      if($('#indicator-picker').length) {
        var farbtastic = $.farbtastic($('#indicator-picker'));

        $('#edit-indicator-text, #edit-indicator-background').each(function() {
          farbtastic.linkTo($(this));
        });

        $('#edit-indicator-text, #edit-indicator-background').bind('focus',function() {
          farbtastic.linkTo($(this));
        });

        farbtastic.linkTo($('#edit-indicator-background'));
      }

      if($('#edit-indicator-default-enabled:checked').length > 0) {
        $('#edit-indicator-display, #edit-indicator-apparence').hide();
      }

      if($('#edit-indicator-default-disabled:checked').length > 0) {
        $('#edit-indicator-display, #edit-indicator-apparence').show();
      }

      $('#edit-indicator-default-enabled').bind('change', function() {
        if($(this).is(':checked')) {
          $('#edit-indicator-display, #edit-indicator-apparence').hide();
        }
      });

      $('#edit-indicator-default-disabled').bind('change', function() {
        if($(this).is(':checked')) {
          $('#edit-indicator-display, #edit-indicator-apparence').show();
        }
      });
    }
  };
})(jQuery);
