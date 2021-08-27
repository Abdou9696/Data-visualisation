"use strict";

/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */


/**
 * Crée une ligne SVG en utilisant les domaines X et Y spécifiés.
 * Cette fonction est utilisée par les graphiques "focus" et "contexte".
 *
 * @param x               Le domaine X.
 * @param y               Le domaine Y.
 * @return d3.svg.line    Une ligne SVG.
 *
 * @see https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89      (voir line generator)
 */
function createLine(x, y) {
  // TODO: Retourner une ligne SVG (voir "d3.line"). Pour l'option curve, utiliser un curveBasisOpen.
  var line = d3.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.count); })
  .curve(d3.curveBasisOpen);

  return d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); });

  // var xdomain = x.domain()
  // var ydomain = y.domain()

  // var coordinates = [];

  // for(var i = 0; i < xdomain.length; i++)
  // {
  //   coordinates.push([x(xdomain[i]), y(ydomain[i])]);
  // }

  // return d3.line(coordinates);
  
}

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createFocusLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique focus dans le groupe "g".
  // Pour chacun des "path" que vous allez dessiner, spécifier l'attribut suivant: .attr("clip-path", "url(#clip)").
  sources.forEach(function(source){
    
    g.append("path")
    .data([source.values])
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return source.name === "Moyenne"? "black" :color(source.name)
    })
    .attr("stroke-width", function (d) {
      return source.name === "Moyenne"? 2.2 :1.5
    })
    .attr("d", line)
    .attr('id',source.name )
    .attr('data-legend',source.name)
    .attr("clip-path", "url(#clip)");
  });
}

/**
 * Crée le graphique contexte.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createContextLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique contexte dans le groupe "g".

  sources.forEach(function(source){
    
    g.append("path")
    .data([source.values])
    .attr("fill", "none")
    .attr("stroke", color(source.name))
    .attr("stroke-width", 1.5)
    .attr("id",source.name)
    .attr("d", line);
    
  });

}
