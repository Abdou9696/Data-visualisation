"use strict";

function DisplayControl() {
    var that = this;
    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 80
    };
    
    this.width = 1200 - margin.left - margin.right;
    this.height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#block-system-main")
        .append("svg")
        .attr("id", "svg_scatterplot")
        .attr("width", this.width + margin.left + margin.right)
        .attr("height", this.height + margin.top + margin.bottom);
    
    this.gScatterPlot = svg.append("g");
    
    this.gScatterPlot
        .attr("id", "scatter_plot")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var timeControlbuttonPanel = d3.select("#block-system-main")
                                    .append("div")
                                    .classed("scatter_plot_anim_ctrl", true);
    
    this.btnPrevious = timeControlbuttonPanel.append("button")
        .text("previous")
        .attr("id", "btn_previous")
        .classed("btn_scatter_plt", true);

    this.btnPlay = timeControlbuttonPanel.append("button")
        .text("play")
        .attr("id", "btn_play")
        .classed("btn_scatter_plt", true)

    this.btnPause = timeControlbuttonPanel.append("button")
        .text("pause")
        .attr("id", "btn_pause")
        .classed("btn_scatter_plt", true)
        .attr("display", "none");
    
    this.btnNext = timeControlbuttonPanel.append("button")
        .text("next")
        .attr("id", "btn_next")
        .classed("btn_scatter_plt", true);

    this.initializeAxes = function(xScale, yScale) {
        that.xAxis = d3.axisBottom(xScale);
        that.yAxis = d3.axisLeft(yScale)/*.tickFormat(localization.getFormattedNumber)*/;
    };

    this.toggleControlDisabled = function(uiElement, setDisabled) {
        uiElement.classed("disabled_ctrl", setDisabled);
    };

    this.toggleControlHidden = function(uiElement, setHidden) {
        if(setHidden)
            uiElement.classed("hidden_ctrl", setHidden);
    };
    
    this.createAxes = function(xAxisLabel, yAxisLabel) {
        var DEFAULT_FONT_SIZE = 10;
    
        that.gScatterPlot.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.height + ")")
            .call(that.xAxis)
    
        that.gScatterPlot.append("text")
            .attr("text-anchor", "end")
            .attr("x", that.width / 2 + (xAxisLabel.length * DEFAULT_FONT_SIZE / 2))
            .attr("y", that.height + 35 )
            .text(xAxisLabel);
        
        that.yAxis.ticks(7);
    
        that.gScatterPlot.append("g")
            .attr("class", "y axis")
            .call(that.yAxis);
    
        that.gScatterPlot.append("text")
            .attr("transform","rotate(-90)")
            .attr("text-anchor", "end")
            .attr("x", -yAxisLabel.length * DEFAULT_FONT_SIZE / 2)
            .attr("y", -50 )
            .text(yAxisLabel)
            .attr("text-anchor", "start");
    };
        
    this.createScatterPlot = function(displayedData, timeUnit, colorScale, xScale, yScale) {

        that.gScatterPlot.append("text")
        .attr("text-anchor", "end")
        .attr("x", that.width)
        .attr("y", that.height-5 )
        .text(timeUnit);

        that.gScatterPlot.selectAll("circle")
            .data(displayedData)
            .enter()
            .append("circle")
            .style("fill", function(d) { return colorScale(d.id); })
            .attr("id", function(d) { return d.id; })
            .attr("r", 3)
            .attr('cx',  function(d) { return xScale(d.xAxisSingleData); })
            .attr('cy', function(d) { return yScale(d.yAxisSingleData); });
    };
            
    this.transition = function(displayedData, timeUnit, duration, xScale, yScale) {
        //"linear", "quad", "cubic", "sin", "exp", "circle", "elastic", "back", "bounce"
        
        that.gScatterPlot
            .selectAll("circle")
                .transition()
                .duration(duration)
                .ease(d3.easeSinInOut)
                .attr("r",  3)
                .attr('cx',  function(d,i) {return xScale(displayedData[i].xAxisSingleData); })
                .attr('cy', function(d,i) {return yScale(displayedData[i].yAxisSingleData); });

        that.gScatterPlot.selectAll("text")
            .data([timeUnit])
            .text(function(d) { return d; });
    };
}



