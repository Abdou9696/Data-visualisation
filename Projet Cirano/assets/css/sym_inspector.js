/**
 * @file
 * Attaches the behaviors for the inspector.
 */

(function ($) {
  Drupal.behaviors.sym_inspector = {
    attach: function(context, settings) {
      var $ = jQuery;

      if($('#inspector-picker').length) {
        var farbtastic = $.farbtastic($('#inspector-picker'));

        $('#edit-inspector-background, #edit-inspector-collapsed, #edit-inspector-expanded, #edit-inspector-key, #edit-inspector-operator, #edit-inspector-type, #edit-inspector-text, #edit-inspector-boolean, #edit-inspector-integer, #edit-inspector-float, #edit-inspector-string, #edit-inspector-null').each(function() {
          farbtastic.linkTo($(this));
        });

        $('#edit-inspector-background, #edit-inspector-collapsed, #edit-inspector-expanded, #edit-inspector-key, #edit-inspector-operator, #edit-inspector-type, #edit-inspector-text, #edit-inspector-boolean, #edit-inspector-integer, #edit-inspector-float, #edit-inspector-string, #edit-inspector-null').bind('focus',function() {
          farbtastic.linkTo($(this));
        });

        farbtastic.linkTo($('#edit-inspector-background'));
      }

      $('.inspector-content .toogle').bind('click', function() {
        expand_or_collapse($(this));
      });

      $('.inspector-content.collapsed > .toogle').each(function() {
        expand_or_collapse($(this));
      });

      $('.inspector-content.expanded .toogle').each(function() {
        expand_or_collapse($(this));
      });

      function expand_or_collapse(element) {
        element.next('.array, .object').toggleClass('visible').next('.spaces').toggle();
        element.toggleClass('expanded').toggleClass('collapsed');
        element.html(element.html() == ' - ' ? ' + ' : ' - ');
      }
    }
  };
})(jQuery);
