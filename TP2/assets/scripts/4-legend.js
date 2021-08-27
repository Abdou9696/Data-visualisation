"use strict";

/**
 * Fichier permettant de générer la légende et de gérer les interactions de celle-ci.
 */


/**
 * Crée une légende à partir de la source.
 *
 * @param svg       L'élément SVG à utiliser pour créer la légende.
 * @param sources   Données triées par nom de rue et par date.
 * @param color     Échelle de 10 couleurs.
 */
function legend(svg, sources, color) {
  // TODO: Créer la légende accompagnant le graphique.
  var width = 70;
  var keys=[];
    sources.forEach(source=>{
      keys.push(source.name)
    })
    var legend = svg.selectAll('.text')
            .data(keys)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                    return 'translate(' + width + ',' + (i*20)+ ')';
            });
  
            legend.append("text").text(function (d) {return d;})
    .attr("transform", "translate(15,9)")
  .attr('font-size', 13);
  
      legend.append("rect")
      .attr("fill", function (d) {return d==="Moyenne"? "black": color(d); })
      .attr("width", 10).attr("height", 10)
        .attr("border", 1)
        .attr("id", function (d) { return d })
        .style('stroke', 'black')
      .on("click", function () {
          displayLine(this, color)
          
        })
  
}

/**
 * Permet d'afficher ou non la ligne correspondant au carré qui a été cliqué.
 *
 * En cliquant sur un carré, on fait disparaitre/réapparaitre la ligne correspondant et l'intérieur du carré
 * devient blanc/redevient de la couleur d'origine.
 *
 * @param element   Le carré qui a été cliqué.
 * @param color     Échelle de 10 couleurs.
 */
function displayLine(element, color) {
  
  // TODO: Compléter le code pour faire afficher ou disparaître une ligne en fonction de l'élément cliqué.
  var d3_element = d3.select(element)
  var id = d3_element.attr('id')
  var lines =  d3.selectAll("#"+id)

  if (d3_element.attr("fill") !== "#0000") {
    lines.each(
      function (d) {
        var elt = d3.select(this)
        if (elt.attr("fill")=="none") {
          elt.attr("stroke","#0000")
        } else {
          elt.attr("fill","#0000")
        }
      }
    )
  } else {
    lines.each(
      function (d) {
        var elt = d3.select(this)
        if (elt.attr("fill")=="none") {
          elt.attr("stroke",function (d) {return id==="Moyenne"? "black": color(id); })
        } else {
          elt.attr("fill",function (d) {return id==="Moyenne"? "black": color(id); })
        }
      }
    )


  }

}
