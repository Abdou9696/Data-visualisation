(function (d3/*, localization*/) {
    "use strict";

    var displayControl = new DisplayControl();
    
    var dataControl = new DataControl(displayControl.width, displayControl.height);
    
    displayControl.initializeAxes(dataControl.xScale, dataControl.yScale);

    var files = ["assets/data/regions_par_annee.csv"];

    Promise.all(files.map(url => d3.csv(url))).then(function(results) {

      var yAxisLabel = "PIB par habitant ($)";
      var xAxisLabel = "Taux de chômage (%)";

      dataControl.initializeData(results);
      dataControl.setDomainXAxis();
      dataControl.setDomainYAxis();
      dataControl.setDomainColor();

      var timeControl = new TimeControl(dataControl.timeUnits.length);

      timeControl.onTimeUnitChange = function() {
          displayControl.transition(dataControl.getFilteredTimeData(timeControl.timeIndex),
                                    dataControl.timeUnits[timeControl.timeIndex], 
                                    timeControl.duration, 
                                    dataControl.xScale, 
                                    dataControl.yScale);
        };

      displayControl.btnPrevious.on('click', function() {
        displayControl.toggleControlDisabled(displayControl.btnNext, true);
        displayControl.toggleControlDisabled(displayControl.btnPrevious, true);
        displayControl.toggleControlDisabled(displayControl.btnPlay, true);

        timeControl.previousTime();

        displayControl.toggleControlDisabled(displayControl.btnNext, false);
        displayControl.toggleControlDisabled(displayControl.btnPlay, false);

        if(!timeControl.isMinTime())
          displayControl.toggleControlDisabled(displayControl.btnPrevious, false);
      });

      displayControl.btnPlay.on('click', function() {
        displayControl.toggleControlDisabled(displayControl.btnNext, true);
        displayControl.toggleControlDisabled(displayControl.btnPrevious, true);

        displayControl.toggleControlHidden(displayControl.btnPlay, true);
        displayControl.toggleControlHidden(displayControl.btnPause, false);

        timeControl.playTime();
      });

      displayControl.btnPause.on('click', function() {
        timeControl.pauseTime();

        displayControl.toggleControlHidden(displayControl.btnPause, true);
        displayControl.toggleControlHidden(displayControl.btnPlay, false);

        if(!timeControl.isMinTime())
          displayControl.toggleControlDisabled(displayControl.btnPrevious, false);

        if(!timeControl.isMaxTime())
          displayControl.toggleControlDisabled(displayControl.btnNext, false);
      });

      displayControl.btnNext.on('click', function() {
        displayControl.toggleControlDisabled(displayControl.btnNext, true);
        displayControl.toggleControlDisabled(displayControl.btnPrevious, true);
        displayControl.toggleControlDisabled(displayControl.btnPlay, true);

        timeControl.nextTime();

        displayControl.toggleControlDisabled(displayControl.btnPrevious, false);
        displayControl.toggleControlDisabled(displayControl.btnPlay, false);

        if(!timeControl.isMaxTime())
          displayControl.toggleControlDisabled(displayControl.btnNext, false);
      });

      displayControl.createAxes(xAxisLabel, yAxisLabel);
      displayControl.createScatterPlot(function() { return dataControl.getFilteredTimeData(timeControl.timeIndex); },
                                       dataControl.timeUnits[timeControl.timeIndex], 
                                       dataControl.colorScale, 
                                       dataControl.xScale, 
                                       dataControl.yScale);
    });

      /***** Transition entre les données des années 2000 et 2014 *****/
      // var toggleButtons = d3.selectAll(".toggle-buttons > button");
      // toggleButtons.on("click", function(d, i) {
      //     currentYear = d3.select(this).text();
      //     currentData = results[i];
      //     toggleButtons.classed("active", function() {
      //       return currentYear === d3.select(this).text();
      //     });

      //     domainRadius(r, currentData);
      //     transition(chartGroup, currentData, x, y, r);
      //   });

      /***** Gestion de la barre de recherche *****/

      // // Initialisation de l'auto-complétion
      // new autoComplete({
      //   selector: "#search-bar input",
      //   minChars: 1,
      //   source: function(term, suggest) {
      //     term = term.toLowerCase();
      //     var matches = [];
      //     currentData.forEach(function(d) {
      //       if (~d.name.toLowerCase().indexOf(term)) {
      //         matches.push(d);
      //       }
      //     });
      //     suggest(matches);
      //   },
      //   renderItem: function(item, search) {
      //     search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      //     var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
      //     return "<div class='autocomplete-suggestion' data-val='"
      //       + item.name + "'>" + item.name.replace(re, "<b>$1</b>") + "</div>";
      //   },
      //   onSelect: function(e, term, item) {
      //     search(item.getAttribute("data-val"), bubbleChartGroup);
      //   }
      // });

      // Ajout d'évènements sur la barre de recherche et le bouton.
      // var searchBarInput = d3.select("#search-bar input");
      // searchBarInput.on("keydown", function () {
      //   if (d3.event.key === "Enter") {
      //     validateInput();
      //   } else {
      //     reset(bubbleChartGroup);
      //     searchBarInput.classed("error", false);
      //   }
      // });
      // d3.select("#search-bar button")
      //   .on("click", validateInput);

      // /**
      //  * Valide la valeur entrée dans la barre et réalise une recherche.
      //  */
      // function validateInput() {
      //   function normalize(str) {
      //     return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      //   }
      //   var value = searchBarInput.node().value.toLowerCase();
      //   if (!value) {
      //     return;
      //   }
      //   var currentValue = normalize(value);
      //   const countryFound = currentData.find(function(zone) {
      //     return normalize(zone.name.toLowerCase()) === currentValue;
      //   });
      //   if (countryFound) {
      //     search(countryFound.name, bubbleChartGroup);
      //   } else {
      //     reset(bubbleChartGroup);
      //     searchBarInput.classed("error", true);
      //   }
      // }

      // /***** Création de l'infobulle *****/
      // tip.html(function(d) {
      //   return getToolTipText.call(this, d, localization.getFormattedNumber)
      // });
      // bubbleChartGroup.call(tip);
    // });
  })(d3/*, localization*/);
  