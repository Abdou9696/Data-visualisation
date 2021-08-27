/**
 * @file
 * Attaches the behaviors for the Tables module's Data Mapping feature.
 */

(function ($) {
  Drupal.behaviors.qceco_data_mapping = {
    attach: function(context, settings) {
      var $ = jQuery;

      // Only apply this code if the page is displaying a rendered table
      var $statistical_table = $('.node-table');

      if($statistical_table.length > 0) {
        var $mapping_table = $statistical_table.find('.field-name-field-table-data-mapping');
        var $data_table    = $statistical_table.find('.node-statistical-data .field-name-field-data .tablefield');

        var $mapped_table = $mapping_table.mapDataFromSource($data_table);
        $mapped_table.trimCurlyBracketsFromTable().replaceBrackets();
        $mapped_table.addClass('mapped');
      }


      // Fix cells height issue
      $('.node-table .field-name-field-table-data-mapping .field-item > table').syncSubCellsHeight();

      $(window).resize(function() {
        $('.node-table .field-name-field-table-data-mapping .field-item > table').syncSubCellsHeight();
      });
    }
  };

  jQuery.fn.mapDataFromSource = function($data) {
    return this.each(function() {
      $(this).find('td, th').each(function() {
        var code = $(this).html();

        if(isValideShortcode(code)) {

          // Keep track of what was before and after the shortcode
          var text = trimCurlyBrackets(code);
          var prefix = text.substr(0, text.indexOf('['));
          var suffix = text.substr(text.indexOf(']') + 1);

          var coordinates = getCoordinatesFromShortcode($(this).html());

          // Create an empty subtable inside the cell
          var $table = $('<table></table>');
          var dimensions  = defineTableDimensions(coordinates);

          // Create an empty subtable inside the cell
          for(var r = 0; r < dimensions.height; r++) {
            $table.append($('<tr></tr>'));
            for(var c = 0; c < dimensions.width; c++) {
              $table.find('tr').last().append($('<td></td>'));
            }
          }

          // Fill each cells
          var i = 0
          for(var c = 0; c < dimensions.width; c++) {
            for(var r = 0; r < dimensions.height; r++) {
              var $sourceCell = $data.find('tr').eq(coordinates[i].row).find('td, th').eq(coordinates[i].column);
              var format = getFormatFromShortcode(code);
              var value  = formatValue($sourceCell.html(), format);
              $table.find('tr').eq(r).find('td').eq(c).html(prefix + value + suffix);
              i++;
            }
          }

          // Add the subtable to the cell
          $(this).html($table);
          $(this).addClass('has-sub-table')
        }
      });
    });
  }

  // Replace the content between brackets in a table cell with the data type identifier.
  // For example, this turns '[Dollars | $] into ($)'.
  jQuery.fn.replaceBrackets = function() {
    return this.each(function() {
      $(this).find('td').each(function() {

        var text = $(this).html();
        // var data_type_extract = new RegExp(/[^|\[]+(?=[\]])/, 'g');
        // var data_type = text.match(data_type_extract);
        // if(!data_type) {
        //   var data_type_extract = new RegExp('[^|\[]+(?=[\]])', 'g');
        //   var data_type = text.match(data_type_extract);
        // }
        var data_type = text.match(/[^|\[]+(?=[\]])/g);

        // var brackets_rule = new RegExp(/\[[^\}]*\]/, 'g');
        // if(!text.match(brackets_rule)) {
        //   var brackets_rule = new RegExp('\[[^\}]*\]', 'g');
        // }
        // text = text.replace(brackets_rule, "");
        text = text.replace(/\[[^\}]*\]/g, "");


        // Replace the content between backets
        if(data_type) {
          text += "(" + data_type + ")";
        }
        $(this).html(text);

      });
    });
  }

  // Trim every text between curly brackets from a table
  jQuery.fn.trimCurlyBracketsFromTable = function() {
    return this.each(function() {
      $(this).find('td, th').each(function() {
        var text =  trimCurlyBrackets($(this).html());
        $(this).html(text);
      });
    });
  }

  jQuery.fn.syncSubCellsHeight = function() {

    return this.each(function() {

      // Reset each cells height
      $(this).find('.synced').css('height', '');

      // Loop through each rows that have subtables
      $(this).find('tr').each(function() {
        if($(this).find('.has-sub-table').length > 1) {

          // Check if any of the cells is higher than the others
          var heights = [];
          var rows    = [];
          $(this).find('.has-sub-table').each(function() {

            // Check the height of each subtables
            var h = $(this).find('table').height();
            if($.inArray(h, heights) == -1) {
              heights.push(h);
            }

            // Check the number of rows in each subtables
            var r = $(this).find('table tr').length;
            if($.inArray(r, rows) == -1) {
              rows.push(r);
            }
          });

          // Sync sub cells height!
          if(heights.length > 1 && rows.length == 1) {
            var rowCount   = rows[0];

            // Loop each sub rows
            for(var i = 1; i <= rowCount; i++) {
              var highest  = 0;

              $(this).find('table tr:nth-child(' + i + ') td, table tr:nth-child(' + i + ') th').each(function() {
                highest = Math.max(highest, $(this).height());
              });

              $(this).find('table tr:nth-child(' + i + ') td, table tr:nth-child(' + i + ') th').addClass('synced');
              $(this).find('table tr:nth-child(' + i + ') td, table tr:nth-child(' + i + ') th').height(highest);
            }
          }
        }
      });
    });
  }

  function trimCurlyBrackets(text) {
    if(typeof text === 'string') {
      text = text.replace(/{(.*?)}/g, "");
    } else {
      console.warn('QCECO - You can only trim curly brackets from a string')
    }

    return text;
  }

  function trimBrackets(text) {
    if(typeof text === 'string') {
      text = text.replace(/\[(.*?)\]/g, "");
    } else {
      console.warn('QCECO - You can only trim curly brackets from a string')
    }

    return text;
  }

  /**
   * Generates a range of characters
   * @param  {string} start Character from where to start
   * @param  {string} stop  Last character that should be in the list
   * @return {array}        List of single character string
   */
  function range(start,stop) {
    var result=[];
      for (var idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
        result.push(String.fromCharCode(idx));
      }

    return result;
  }

  /**
   * Generate a full range of characters from 'A' to 'ZZ'
   * @return {array} List of single character strings
   */
  function createLetterRange() {
    var total_range = range('A','Z');

    for(i = 0; i < range('A','Z').length; i++) {
      for(j = 0; j < range('A','Z').length; j++) {
        total_range.push(total_range[i] + total_range[j])
      }
    }

    return total_range;
  }

  /**
   * Change the number format of the given number
   * @param  {mixed}  value  Value to alter
   * @param  {string} format Type of formatting that we want to apply
   * @return {mixed}        [description]
   */
  function formatValue(value, format) {
    var suffix = '';

    if(format != null) {
      switch (format) {
        case 'percentage' :
          value  = (!isNaN(value) ? value * 100 : value);
          suffix = '%';
          break;
        case 'thousands' :
          value = (!isNaN(value) ? value / 1000 : value);
          suffix = 'k';
          break;
        case 'millions' :
          value = (!isNaN(value) ? value / 1000000 : value);
          suffix = 'M';
          break;
        case 'billions' :
          value = (!isNaN(value) ? value / 1000000000 : value);
          suffix = 'G';
          break;
        case 'pur' :
        default:
          // Not sure what it's supposed to do...
          break;
      }
    }

    if($.isNumeric(value) && format != 'pur') {

      // Prevent weird division results (like 59,099999999999994)
      value = parseFloat(parseFloat(value).toFixed(10));

      // Format numbers in french
      value = number_format(value, ',', ' ');
    }

    if(value == "") {
      return "&nbsp;";
    }

    return value + suffix;
  }

  /**
   * Check if the provided shortcode is valid
   * @param  {string} shortcode String with the following format [A1] or [A1-A2] or [A1:%]
   * @return {Boolean}           Whether or not the string fits the criteras
   */
  function isValideShortcode(shortcode) {
    validator = new RegExp('(\[[A-Z]+(-|[0-9]+(-[A-Z]+[0-9]+|-)?)(:[a-zA-Z%])?\])', 'g');
    return validator.test(shortcode);
  }

  /**
   * Check if the provided unit shortcode is valid
   * @param  {string} shortcode String with the following format [something long to say|slts]
   * @return {Boolean}           Whether or not the string fits the criteras
   */
  function findUnitShortcodes(string) {
    critera = new RegExp('\[[^\[\]]+\|[^\[\]]+\]', 'g');
    result  =  string.match(critera);

    return result;
  }

  /**
   * Extract the cell range inside a shortcode
   * @todo Handle the following shortcode format [A-] and [A-:%] (no range end)
   *       Validate with client the number of actual Tables that use this format.
   *       We might recommend switching to one of the supported shortcode formats.
   * @param  {string} shortcode String with the following format [A1] or [A1-A2] or [A1:%]
   * @return {mixed}            Extracted range value
   */
  function getCellRangeFromShortcode(shortcode) {
    critera = new RegExp('[A-Z]+[0-9]+(-[A-Z]+[0-9]+)?', 'g');
    result   = shortcode.match(critera);
    if(result) {
      result =  result.toString();
    }

    return result;
  }

  /**
   * Extract the format inside a shortcode
   * @param  {string} shortcode String with the following format [A1] or [A1-A2] or [A1:%]
   * @return {mixed}            Extracted range value
   */
  function getFormatFromShortcode(shortcode) {
    criteras = new RegExp(':[a-zA-Z%]', 'g');
    result   = shortcode.match(criteras);
    format = null;
    if(result) {
      var type = result.toString().replace(':', '');

      switch (type) {
        case '%': format = 'percentage'; break;
        case 'm': format = 'thousands'; break;
        case 'M': format = 'millions'; break;
        case 'G': format = 'billions'; break;
        case 'p': format = 'pur'; break;

        // Check if the user uses an unsupported format
        default :
          format = 'pur';
          console.warn('QCECO tables - The \"' + type + '\" format isn\'t supported for shortcodes yet');
        break;
      }
    }

    return format;
  }

  /**
   * Extract the coordinates inside a shortcode
   * @param  {string} shortcode String with the following format [A1] or [A1-A2] or [A1:%]
   * @return {mixed}            Extracted range value
   */
  function getCoordinatesFromShortcode(shortcode) {
    var letterRange = createLetterRange();

    // Remove the brackets form the shortcode
    var cellRange   = getCellRangeFromShortcode(shortcode);
    var cells       = [];
    var coordinates = [];

    // Unhandled ranges check ([A-], no range end).
    if(typeof cellRange === 'undefined' || !cellRange) {
      return {};
    }

    var cellRangeType = findCellRangeType(cellRange);

    switch(cellRangeType) {
      case 'cell':
        cells.push(cellRange);
        break;

      case 'cell-to-cell':
        cells = cells.concat(listCellsFromRange(cellRange));
        break;

    }

    for(var i = 0; i < cells.length; i++) {
      var letter = cells[i].match(/[a-zA-Z-]+/g).toString();
      var number = parseInt(cells[i].match(/[0-9]+/g));
      coordinates.push({
        'cell'   : cells[i],
        'row'    : number - 1,
        'column' : letterRange.indexOf(letter),
      });
    }

    return coordinates;
  }


  /**
   * Find how the profided cell range should be handled
   * @param  {string} cellRange Part of a shortcode that tells where to get the data (eg. A2-A5)
   * @return {string}           Either "cell" (A1), "cell-to-cell" (A1-A3), "cell-to-end" (A1-)
   */
  function findCellRangeType(cellRange) {
    var type = '';
    var dashIndex = cellRange.indexOf('-');

    // Is there a dash?
    if(dashIndex === -1) {
      type = 'cell';

    // Is it at the end of the string?
    } else if(dashIndex === cellRange.length - 1) {
      type = 'cell-to-end';

    // That's probably a range of cell
    } else {
      type = 'cell-to-cell'
    }

    return type;
  }

  function listCellsFromRange(cellRange) {
    lst = [];
    columns = createLetterRange();
    var start = cellRange.split('-')[0];
    var end   = cellRange.split('-')[1];

    var letters = new RegExp('[A-Z]+', 'g');
    var numbers = new RegExp('[0-9]+', 'g');

    var startCol = columns.indexOf(start.match(letters)[0]);
    var startRow = parseInt(start.match(numbers)[0]);
    var endCol   = columns.indexOf(end.match(letters)[0]);
    var endRow   = parseInt(end.match(numbers)[0]);
    var col = startCol;
    var row = startRow;

    // Check if the range is fliped in any way
    var reverse = 'none';

    if(startRow > endRow) {
      reverse = 'vertical';
    }

    if(startCol > endCol) {
      if(reverse == 'vertical') {
        reverse = 'both';
      } else {
        reverse = 'horizontal';
      }
    }

    // Fill the list depending on the orientation on the range
    switch(reverse) {

      // Loop normally through each cells (eg. [A1-B2])
      case 'none':
        while(col <= endCol) {
          lst.push(columns[col] + row.toString());
          row++;
          if(row > endRow) {
            row = startRow;
            col++;
          }
        }
        break;

      // Reverse the order of every rows (eg. [A2-B1])
      case 'vertical':
        while(col <= endCol) {
          lst.push(columns[col] + row.toString());
          row--;
          if(row < endRow) {
            row = startRow;
            col++;
          }
        }
        break;

      // Reverse the order of every column (eg. [B1-A2])
      case 'horizontal':
        while(col >= endCol) {
          lst.push(columns[col] + row.toString());
          row++;
          if(row > endRow) {
            row = startRow;
            col--;
          }
        }
        break;

      // Reverse the order of every rows and columns (eg. [B2-A1])
      case 'both':
        while(col >= endCol) {
          lst.push(columns[col] + row.toString());
          row--;
          if(row < endRow) {
            row = startRow;
            col--;
          }
        }
        break;

    }

    return lst;
  }

  function defineTableDimensions(coordinates) {
    var tableWidth  = 0;
    var tableHeight = 0;

    for(var i = 0; i < coordinates.length; i++) {
      if(coordinates[i].column != coordinates[0].column) break;
      tableHeight++;
    }

    tableWidth = coordinates.length / tableHeight;

    return {
      'width'  : tableWidth,
      'height' : tableHeight,
    }
  }

  // Force a number to have thousant separator
  function number_format(number, decPoint, thousandsSep) {
    if(!isNaN(parseFloat(number))) {
      decPoint     = (typeof decPoint !== 'undefined') ?  decPoint : '.';
      thousandsSep = (typeof thousandsSep !== 'undefined') ?  thousandsSep : '';

      // Convert decimal point
      var original_num = number;
      number             = number.toString().replace('.', decPoint);
      var formatedNumber = '';
      var integer        = Math.floor(original_num).toString();

      // Loop through each letters
      for(var i = 0; i < number.length; i++) {

        // Stop after hitting a comma
        if(number.charAt(i) == decPoint) {
          // Add the rest of the string
          formatedNumber += number.slice(i);
          break;
        }

        // Add thousand separator
        if(i != 0 && (i - (integer.length%3)) % 3 == 0) {
          formatedNumber += thousandsSep;
        }

        // Add the digit
        formatedNumber += number.charAt(i);
      }


      return formatedNumber;
    } else {
      console.warn('QCECO : You cannot set the number format of a ' + typeof number);
      return number;
    }
  }

})(jQuery);
