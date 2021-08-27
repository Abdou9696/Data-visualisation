/**
 * @file
 * Attaches the behaviors for the Statistical Data module.
 */

(function($) {
  Drupal.behaviors.qceco_statistical_data_update_fieldset_summaries = {
    attach: function(context, settings) {

      // Check if the drupalSetSummary function exists in the current context.
      if(typeof $.fn.drupalSetSummary !== 'undefined' && $.isFunction($.fn.drupalSetSummary)) {

        // Adjust summary for the group_update_info vertical tab.
        $('fieldset.node-update-info', context).drupalSetSummary(function(context) {

          // Retrieve date field value.
          var date = $('.field-name-field-next-content-update input', context).val();

          // Format summary.
          var summaryToReturn = Drupal.t('Mettre à jour le @date', { '@date': date });

          // Return summary.
          return summaryToReturn;

        });

      }

    }
  };

})(jQuery);
