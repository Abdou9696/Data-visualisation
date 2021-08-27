/**
 * @file
 * Attaches the behaviors for the Tables module.
 */

(function($) {
  Drupal.behaviors.qceco_generate_table_from_data = {
    attach: function(context, settings) {

      var $ = jQuery;

      $('.generate_table').on('click', function(e) {

        // Attempt to retrieve specific field CKEDITOR instances.
        var instances = getCKeditorInstances();

        // If CKEDITOR instances were retrieved.
        if(typeof instances['edit-field-table-data-mapping-und-0-value'] !== 'undefined') {

          // Pick specific CKEDITOR instance for further manipulations.
          var instance = instances['edit-field-table-data-mapping-und-0-value'];

          // If the field is not empty and contains markup.
          if(instance.length > 0) {

            if (!confirm(Drupal.t("Caution! This field is not empty! If you wish to continue with the prefill option, you will lose the current content of this field. Click cancel to keep your content."))) {
              return false;
            }
          }

          var markup = generateTable('.field_table_data_preview');
          CKEDITOR.instances['edit-field-table-data-mapping-und-0-value'].setData(markup);

        } else {

          // Attempt to retrieve specific field jQuery instance, instead of using CKEDITOR.
          var $instance = $('#edit-field-table-data-mapping-und-0-value');

          // If jQuery instance was retrieved.
          if($instance.length > 0) {

            // If the field is not empty and contains markup.
            if($instance.val().length > 0) {

              if (!confirm(Drupal.t("Caution! This field is not empty! If you wish to continue with the prefill option, you will lose the current content of this field. Click cancel to keep your content."))) {
                return false;
              }

            }

            var markup = generateTable('.field_table_data_preview');
            $instance.val(markup);

          }

        }

        // Prevent actual form submission and any other undesired behavior.
        return false;

      });

    }
  };

  function getCKeditorInstances() {

    var instances = [];

    for(var i in CKEDITOR.instances) {

      CKEDITOR.instances[i];
      CKEDITOR.instances[i].name;
      CKEDITOR.instances[i].value;
      CKEDITOR.instances[i].updateElement();

      instances[CKEDITOR.instances[i].name] = CKEDITOR.instances[i].getData();
    }

    return instances;

  }

  function generateTable(selector) {
    $source = $(selector);
    rowCount    = $source.find('tr').length - 1;
    columnCount = $source.find('tr:first-child td, tr:first-child th').length - 1;

    $table = $('<table>');
    $letter_range = createLetterRange();
    for (var row = 1; row <= rowCount; row++) {
      $table.append('<tr></tr>');

      for (var col = 0; col < columnCount; col++) {
        celltype = 'td';
        if(row == 1) {
          celltype = 'th';
        }

        $table.find('tr:last-child').append('<'+ celltype +'>[' + $letter_range[col] +  row.toString() + ']</'+ celltype +'>');
      }
    }

    // Add styles and classes
    $table.css('border', 1);
    $table.css('cellpadding', 1);
    $table.css('cellspacing', 1);
    $table.css('min-width', 500);

    return $table.outerHTML();
  }

  function range(start,stop) {
    var result=[];
      for (var idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
        result.push(String.fromCharCode(idx));
      }

    return result;
  }

  function createLetterRange() {
    var total_range = range('A','Z');

    for(i = 0; i < range('A','Z').length; i++) {
      for(j = 0; j < range('A','Z').length; j++) {
        total_range.push(total_range[i] + total_range[j]);
      }
    }

    return total_range;
  }

  jQuery.fn.outerHTML = function() {
      return $($('<div></div>').html(this.clone())).html();
  }

})(jQuery);
