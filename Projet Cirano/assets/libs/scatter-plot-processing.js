"use strict";

function DataControl(width, height) {
  var that = this;
  this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  this.xScale = d3.scaleLinear().range([0, width]);
  this.yScale = d3.scaleLinear().range([height, 0]);
  this.data;
  this.timeUnits = [];

  this.initializeData = function(filesContent) {

      var filters = { "type_territoire" : "Région administrative" };

      that.data = filesContent[0].map(function(result) {
      var dataObject = {
        yAxisSingleData : parseFloat(result["PIB_par_habitant"]),
        xAxisSingleData : parseFloat(result["taux_chomage"]),
        timeSingleData : parseInt(result["annee"]),
        id : result["region"],
        filterValues : {}
      }

      if(!that.timeUnits.includes(dataObject.timeSingleData))
        that.timeUnits.push(dataObject.timeSingleData);

      that.timeUnits.sort();
      
      for (var filterKey in filters) {
        dataObject.filterValues[filterKey] = result[filterKey];
      };

      return dataObject;
    });

    for (var filterKey in filters) {
      that.data = that.data.filter(function(d) { return d.filterValues[filterKey] == filters[filterKey]; });
    };

    that.data = that.data.filter(function(d) { 
      return d.xAxisSingleData !== undefined && d.xAxisSingleData != null && !isNaN(d.xAxisSingleData); 
    });

    that.data = that.data.filter(function(d) { 
      return d.yAxisSingleData !== undefined && d.yAxisSingleData != null && !isNaN(d.yAxisSingleData); 
    });

    var remainingTimeUnits = that.data.map((d) => d.timeSingleData);

    that.timeUnits = that.timeUnits.filter(function(timeUnit) {
      return remainingTimeUnits.includes(timeUnit); 
    });

    that.data.sort(function(a, b) {
      return d3.ascending(a.id, b.id);
    });

    that.data.sort(function(a, b) {
        return d3.ascending(a.timeSingleData, b.timeSingleData);
    });
  };

  this.setDomainXAxis = function() {
      var xAxisValues = this.data.map(function(d) { return d.xAxisSingleData; });

      var minXAxisValue = d3.min(xAxisValues);
      var maxXAxisValue = d3.max(xAxisValues);

      that.xScale.domain([minXAxisValue, maxXAxisValue]);
  };

  this.setDomainYAxis = function() {
      var yAxisValues = that.data.map(function(d) { return d.yAxisSingleData; });

      var minYAxisValue = d3.min(yAxisValues);
      var maxYAxisValue = d3.max(yAxisValues);
    
      that.yScale.domain([minYAxisValue, maxYAxisValue]);
  };

  this.setDomainColor = function() {
      var uniqueIds = [];

      that.data.forEach(line => {
          if (!uniqueIds.includes(line.id)) {
              uniqueIds.push(line.id);
          }
      });

      that.colorScale.domain(uniqueIds);
  };

  this.getFilteredTimeData = function(timeIndex) {
      return that.data.slice().filter((d) => d.timeSingleData == that.timeUnits[timeIndex]);
  };
}
