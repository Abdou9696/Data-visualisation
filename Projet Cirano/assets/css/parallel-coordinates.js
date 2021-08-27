"use strict";

/**
 * Fichier permettant de dessiner le graphique Parallel Coordinates.
 */

 /**
  * Crée les le graphique.
  *
  * @param g       Le groupe dans lequel le graphique à bandes doit être dessiné.
  * @param xAxis   L'axe X.
  * @param yAxis   L'axe Y.
  * @param height  La hauteur du graphique.
  * @param sources Les données
  */
 function createParallelGraph(g, xScale, yScales, axis, width, height, color, sources) {

   // Extraire les dimensions
   var dimensions = d3.keys(sources[0]).filter(function(d) {return d != "region" });
   xScale.domain(dimensions);

   // Créer une échelle pour chaque dimension
   dimensions.forEach(function(d,i){
     var name = dimensions[i];
     var yDomain = d3.extent(sources.map(function(e) {return +e[name];}));
     yScales[name] = d3.scaleLinear()
                      .domain(yDomain)
                      .range([height, 0]);
   });


   function path(d) {
      return d3.line()(dimensions.map(function(dd) {
        return [xScale(dd), yScales[dd](d[dd])];
        }));
   }

   // Dessiner les axes
   g.selectAll("gAxis")
     .data(dimensions)
     .enter()
     .append("g")
     .attr("class", "axis")
     .attr("transform", function(d) { return "translate(" + xScale(d) + ")"; })
     .each(function(d) {
       d3.select(this).call(axis.scale(yScales[d]));
     })
     .append("text")
     .attr("class", "y-axis-labels")
     .attr("y", -10)
     .text(function(d){ return d;})
     .attr("fill", "black");


   // Dessiner les lignes
   g.selectAll("path")
    .data(sources)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", function(d){ return "line " + d.region;})
    .attr("stroke", function(d){ return color(d.region);})
    .on("mouseover", highlight)
    .on("mouseleave", reset);

    // Mouse action
    var highlight = function(d){
      console.log("TODO");
    }

    var reset = function(d){
      console.log("TODO");
    }
 }

// Âge moyen
// Espérance de vie
// Revenu moyen (année inconnue)
// Taux de travail 2016
// Taux activité 2016
// Taux chômage 2016
// PIB par habitant (année inconnue)
