/**
 * @file
 * Attaches the behaviors for the Chart module.
 */

(function($) {
  Drupal.behaviors.qceco_chart_update_fieldset_summaries = {
    attach: function(context, settings) {

      // Check if the drupalSetSummary function exists in the current context.
      if(typeof $.fn.drupalSetSummary !== 'undefined' && $.isFunction($.fn.drupalSetSummary)) {

        // Adjust summary for the group_migration_notes vertical tab.
        $('fieldset.node-migration-notes', context).drupalSetSummary(function(context) {

          // Retrieve source chart type values.
          var sourceChartTypes = '';
          var sourceChartTypesValuesLength = $('.field-name-field-source-chart-type select option:selected', context).length;
          var sourceChartTypesValues = $('.field-name-field-source-chart-type select option:selected', context).each(function(index) {

            // Format text properly if item is not the last loop iteration.
            if(index < sourceChartTypesValuesLength - 1) {
              sourceChartTypes += $(this).text() + ', ';
            } else {
              sourceChartTypes += $(this).text();
            }

          });

          // Retrieve source chart bar type value.
          var sourceChartBarType = $('.field-name-field-source-chart-bar-type select option:selected', context).text();

          // Format summary.
          var summaryToReturn = Drupal.t(
            'Source : Type (de tracé): @sourceChartTypes<br /><br />Source : Type de barres : @sourceChartBarType',
            {
              '@sourceChartTypes': sourceChartTypes,
              '@sourceChartBarType': sourceChartBarType
            }
          );

          // Return summary.
          return summaryToReturn;

        });

      }

    }
  };

})(jQuery);
