"use strict";

/**
 * Fichier permettant de gérer l'affichage de la carte.
 */


/**
 * Initialise le fond de carte qui doit être utilisé et la position d'affichage initial.
 *
 * @param L     Le contexte Leaflet.
 * @param map   La carte Leaflet.
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function initTileLayer(L, map) {
  /* TODO: Initialiser le "tileLayer" avec les propriétés suivantes:
       - URL du fond de carte: https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png;
       - Zoom maximum: 10;
       - Zoom minimum: 1.
     Régler l'affichage initial (view) de la carte aux valeurs suivantes:
       - Coordonnées: [57.3, -94.7];
       - Niveau de zoom: 4.
   */
  map.setView([57.3, -94.7], 4);
  var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 10,
  }).addTo(map);
}

/**
 * Initialise le contexte SVG qui devra être utilisé au-dessus de la carte Leaflet.
 *
 * @param map   La carte Leaflet.
 * @return      L'élément SVG créé.
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function initSvgLayer(map) {
  // TODO: Créer l'élément SVG en vous basant sur l'exemple fourni. Assurez-vous de créer un élément "g" dans l'élément SVG.
  var svg = d3.select(map.getPanes().overlayPane).append("svg"),
  g = svg.append("g").attr("class", "leaflet-zoom-hide");
  return svg;
}

/**
 * Crée les tracés des circonscriptions sur le contexte SVG qui se trouve au-dessus de la carte Leaflet.
 *
 * @param g             Le groupe dans lequel les tracés des circonscriptions doivent être créés.
 * @param path          La fonction qui doit être utilisée pour tracer les entités géométriques selon la bonne projection.
 * @param canada        Les entités géographiques qui doivent être utilisées pour tracer les circonscriptions.
 * @param sources       Les données contenant les informations sur chacune des circonscriptions.
 * @param color         L'échelle de couleurs qui est associée à chacun des partis politiques.
 * @param showPanel     La fonction qui doit être appelée pour afficher le panneau d'informations.
 */
function createDistricts(g, path, canada, sources, color, showPanel) {
  /* TODO: Créer les tracés des circonscriptions. Assurez-vous de respecter les spécifications suivantes:
       - La couleur de la circonscription doit correspondre à la couleur du parti du candidat gagnant;
       - L'opacité de la couleur (fill-opacity) doit être de 80%;
       - La couleur des traits doit être "#333";
       - Lorsqu'une circonscription est cliquée, celle-ci doit devenir sélectionnée (classe "selected") et le panneau
         d'informations associé à cette circonscription doit faire son apparition (utiliser la fonction "showPanel").
         Il est à noter qu'il est possible de sélectionner uniquement une circonscription à la fois.
   */
   g.selectAll("path")
    .data(canada.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("opacity", 0.8)
    .attr('fill',function(d) {
      var id = d.properties.NUMCF
      return color(getParty(id, sources))
    })
    .attr("stroke", "#333333")
    .attr("id",function(d){
      return d.properties.NUMCF
    })
    .on("click", function(d){
      clearSelection(g)
      d3.select(this).attr("class", "selected")
      showPanel(d.properties.NUMCF)
    })					
   
}

/**
 * Met à jour la position et la taille de l'élément SVG, la position du groupe "g" et l'affichage des tracés lorsque
 * la position ou le zoom de la carte est modifié.
 *
 * @param svg       L'élément SVG qui est utilisé pour tracer les éléments au-dessus de la carte Leaflet.
 * @param g         Le groupe dans lequel les tracés des circonscriptions ont été créés.
 * @param path      La fonction qui doit être utilisée pour tracer les entités géométriques selon la bonne projection.
 * @param canada    Les entités géographiques qui doivent être utilisées pour tracer les circonscriptions.
 *
 * @see https://gist.github.com/d3noob/9211665
 */
function updateMap(svg, g, path, canada) {
  // TODO: Mettre à jour l'élément SVG, la position du groupe "g" et l'affichage des tracés en vous basant sur l'exemple fourni.

  var bounds = path.bounds(canada);
  var topLeft = bounds[0],
  bottomRight = bounds[1];

  svg .attr("width", bottomRight[0] - topLeft[0])
    .attr("height", bottomRight[1] - topLeft[1])
    .style("left", topLeft[0] + "px")
    .style("top", topLeft[1] + "px");

  g .attr("transform", "translate(" + -topLeft[0] + "," 
                                    + -topLeft[1] + ")");

  // initialize the path data	
  g.selectAll("path")
      .attr("d", path)
    .style("fill-opacity", 0.8)
}

function clearSelection(g){
  g.selectAll("path")
  .classed("selected", false)
}

function getParty(id, sources){
  var districtSource = sources.find(function (e) {
    return id === e.id;
  });
  return districtSource.results[0].party;

}
