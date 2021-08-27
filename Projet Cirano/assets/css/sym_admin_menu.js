Drupal.behaviors.sym_admin_menu = {
  attach: function(context, settings) {
    var $ = jQuery;
    
    var height = $('#sym-admin-menu .sym-admin-menu-content').outerHeight() - $('#sym-admin-menu .sym-admin-menu-content h2').outerHeight();
    var opacity = $('#sym-admin-menu').css('opacity');
    
    if($('#sym-admin-menu').css('bottom') == '0px') {
      $('#sym-admin-menu').css('bottom', '-' + height + 'px');
    }
    
    $('#sym-admin-menu h2').click(function() {
      if($('#sym-admin-menu').css('bottom') == '0px') {
        $('#sym-admin-menu').animate({
          bottom: -1 * height + 'px',
          opacity: opacity,
        }, 500);
      } else {
        $('#sym-admin-menu').animate({
          bottom: 0,
          opacity: 1,
        }, 500);
      }
    });

    $('#block-sym-admin-menu-visits #sym-admin-menu-block-visits-auth a').bind('click', function(event) {
      $('#sym-admin-menu-block-visits-auth').submit();

      event.preventDefault();
    });

    if ($('#sym-admin-menu-color-picker').length) {
      var farbtastic = $.farbtastic($('#sym-admin-menu-color-picker'));

      $('#edit-sym-admin-menu-color-primary, #edit-sym-admin-menu-color-secondary, #edit-sym-admin-menu-color-tertiary, #edit-sym-admin-menu-color-quaternary').each(function() {
        farbtastic.linkTo($(this));
      });

      $('#edit-sym-admin-menu-color-primary, #edit-sym-admin-menu-color-secondary, #edit-sym-admin-menu-color-tertiary, #edit-sym-admin-menu-color-quaternary').bind('focus', function() {
        farbtastic.linkTo($(this));
      });

      farbtastic.linkTo($('#edit-sym-admin-menu-color-primary'));
    }
  }
};
