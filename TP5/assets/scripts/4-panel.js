"use strict";

/**
 * Fichier permettant de gérer l'affichage du panneau d'informations pour une circonscription.
 */


/**
 * Met à jour les domaines X et Y utilisés par le diagramme à bandes horizontales lorsque les données sont modifiées.
 *
 * @param districtSource    Les données associées à une circonscription.
 * @param x                 L'échelle X.
 * @param y                 L'échelle Y.
 */
function updateDomains(districtSource, x, y) {
  /* TODO: Mettre à jour les domaines selon les spécifications suivantes:
       - Le domaine X varie entre le minimum et le maximum de votes obtenus pour les candidats de la circonscription;
       - Le domaine Y correspond au nom des partis politiques associés aux candidats qui se sont présentés. Assurez-vous
         que les partis sont triés en ordre décroissant de votes obtenus (le parti du candidat gagnant doit se retrouver
         en premier).
   */

        x.domain([districtSource.results[districtSource.results.length - 1].votes
                  ,districtSource.results[0].votes])

        y.domain(d3.map(districtSource.results,function(d){return d.party;}).keys());

          
}

/**
 * Met à jour les informations textuelles se trouvant dans le panneau à partir des nouvelles données fournies.
 *
 * @param panel             L'élément D3 correspondant au panneau.
 * @param districtSource    Les données associées à une circonscription.
 * @param formatNumber      Fonction permettant de formater correctement des nombres.
 */
function updatePanelInfo(panel, districtSource, formatNumber) {
  /* TODO: Mettre à jour les informations textuelles suivantes:
       - Le nom de la circonscription ainsi que le numéro;
       - La nom du candidat gagnant ainsi que son parti;
       - Le nombre total de votes pour tous les candidats (utilisez la fonction "formatNumber" pour formater le nombre).
   */
  panel.select("h1").text(districtSource.name + " ["+districtSource.id+"]");
  panel.select("p").text(districtSource.results[0].candidate + " (" + districtSource.results[0].party + ")");
  panel.select("span").text(formatNumber(d3.sum(districtSource.results,function(d){return d.votes;}))+ " votes");

}

/**
 * Met à jour le diagramme à bandes horizontales à partir des nouvelles données de la circonscription sélectionnée.
 *
 * @param gBars             Le groupe dans lequel les barres du graphique doivent être créées.
 * @param gAxis             Le groupe dans lequel l'axe des Y du graphique doit être créé.
 * @param districtSource    Les données associées à une circonscription.
 * @param x                 L'échelle X.
 * @param y                 L'échelle Y.
 * @param yAxis             L'axe des Y.
 * @param color             L'échelle de couleurs qui est associée à chacun des partis politiques.
 * @param parties           Les informations à utiliser sur les différents partis.
 *
 * @see https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3
 */
function updatePanelBarChart(gBars, gAxis, districtSource, x, y, yAxis, color, parties) {
  /* TODO: Créer ou mettre à jour le graphique selon les spécifications suivantes:
       - Le nombre de votes des candidats doit être affiché en ordre décroissant;
       - Le pourcentage obtenu par chacun des candidat doit être affiché à droite de le barre;
       - La couleur de la barre doit correspondre à la couleur du parti du candidat. Si le parti du candidat n'est pas
         dans le domaine de l'échelle de couleurs, la barre doit être coloriée en gris;
       - Le nom des partis doit être affiché sous la forme abrégée. Il est possible d'obtenir la forme abrégée d'un parti
         via la liste "parties" passée en paramètre. Il est à noter que si le parti ne se trouve pas dans la liste "parties",
         vous devez indiquer "Autre" comme forme abrégée.
   */

  var abbreviation_map = {};
  
  parties.forEach(function(party) { abbreviation_map[party.name] = party.abbreviation });

  yAxis
    .tickValues(districtSource.results.map(function(result) { return result.party; }))
    .tickFormat(x => x in abbreviation_map ? abbreviation_map[x] : "Autre");

  gBars.selectAll("g").remove();  

  gBars.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  
  var bars=gBars.selectAll(".bar")
    .data(districtSource.results)
    .enter()
    .append("g")
  
  bars.append("rect")
    .attr("y", function(d) { return y(d.party); })
    .attr("class", "bar")
    .attr("height", y.bandwidth())
    .attr("style", function(d) { return "fill:"+color(d.party); })
    .attr("x", 1)
    .attr("width", function (d) {return x(d.votes);})
  
 
  var totalVotes = d3.sum(districtSource.results,function(d){return d.votes;})
  
  //add a value label to the right of each bar
  bars.append("text")
    .attr("class", "label")
    .attr("y", function(d) { return y(d.party)+  y.bandwidth() / 2 + 4;})
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        return  x(d.votes)+3
    })
    .text(function (d) {
        return d3.format(".1%")(d.votes/totalVotes)
    });
}

/**
 * Réinitialise l'affichage de la carte lorsque la panneau d'informations est fermé.
 *
 * @param g     Le groupe dans lequel les tracés des circonscriptions ont été créés.
 */
function reset(g) {
  // TODO: Réinitialiser l'affichage de la carte en retirant la classe "selected" de tous les éléments.
  g.selectAll("path")
    .attr("class","district")
}
