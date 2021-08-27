"use strict";

/**
 * Fichier permettant de dessiner le diagramme à cordes.
 */

/**
 * Crée les groupes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param arc             Fonction permettant de dessiner les arcs.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://bl.ocks.org/mbostock/4062006
 */
function createGroups(g, data, layout, arc, color, total, formatPercent) {
  /* TODO:
     - Créer les groupes du diagramme qui sont associés aux stations de BIXI fournies.
     - Utiliser un "textPath" pour que les nom de stations suivent la forme des groupes.
     - Tronquer les noms des stations de BIXI qui sont trop longs (Pontiac et Métro Mont-Royal).
     - Afficher un élément "title" lorsqu'un groupe est survolé par la souris.
  */

  var arcs = g.selectAll("g")
    .data(layout.groups)
    .enter()
    .append("g")
      .attr("class", "group")

    arcs.append("path")
    .attr("id", function(d, i) { return "group" + i; })
    .attr("fill", function(d, i) {return color(data[i].name); })
    .attr("d", arc)
    .append("svg:title")
      .text(function(d, i) { return data[i].name + ": " + formatPercent(total[i] / total.reduce((a, b) => a + b)) + " des départs"; });

    
    arcs.append("text")
        .attr("x", 5)
        .attr("dy", 16)
        .attr("font-size", 12.5)
        .append("textPath")
          .attr("xlink:href", function(d, i) { return "#group" + i; })
          .text(function(d, i) 
          { 
            var text =  data[i].name;
            
            if(text == "Pontiac / Gilford")
              text = "Pontiac";
            else if(text == "Métro Mont-Royal (Rivard/Mont-Royal)")
              text = "Métro Mont-Royal";

            return text;
          })
          .append("svg:title")
            .text(function(d, i) { return data[i].name + ": " + formatPercent(total[i] / total.reduce((a, b) => a + b)) + " des départs"; });
}

/**
 * Crée les cordes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param path            Fonction permettant de dessiner les cordes.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://beta.observablehq.com/@mbostock/d3-chord-dependency-diagram
 */
function createChords(g, data, layout, path, color, total, formatPercent) {
  /* TODO:
     - Créer les cordes du diagramme avec une opacité de 80%.
     - Afficher un élément "title" lorsqu'une corde est survolée par la souris.
  */

 g.selectAll(".chord")
  .data(layout)
  .enter()
  .append("path")
    .attr("class", "chord")
    .attr("d", path)
    .style("fill", function(d, i) { return color(data[d.source.index].name); })
    .append("svg:title")
      .text(function(d, i) { 
        var text = data[d.source.index].name + " \u{2192} " + data[d.target.index].name + ": " + formatPercent(d.source.value / total.reduce((a, b) => a + b)) + "\r\n"
        + data[d.target.index].name + " \u{2192} " + data[d.source.index].name + ": " + formatPercent(d.target.value / total.reduce((a, b) => a + b))
        return text;
      });
}

/**
 * Initialise la logique qui doit être réalisée lorsqu'un groupe du diagramme est survolé par la souris.
 *
 * @param g     Le groupe SVG dans lequel le diagramme à cordes est dessiné.
 */
function initializeGroupsHovered(g) {
  /* TODO:
     - Lorsqu'un groupe est survolé par la souris, afficher les cordes entrant et sortant de ce groupe avec une
       opacité de 80%. Toutes les autres cordes doivent être affichées avec une opacité de 10%.
     - Rétablir l'affichage du diagramme par défaut lorsque la souris sort du cercle du diagramme.
  */

 g.selectAll(".group")
    .on("mouseover", function(data, index)  { g.selectAll(".chord").classed("fade", function(d) {  
        return d.source.index != data.index && d.target.index != data.index; 
      }); 
    });

};
