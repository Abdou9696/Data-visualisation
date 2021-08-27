"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier JSON.
 */


/**
 * Précise le domaine de l'échelle de couleurs qui est utilisée pour distinguer chacune des stations de BIXI.
 *
 * @param color   Échelle de couleurs.
 * @param data    Données provenant du fichier JSON.
 */
function domainColor(color, data) {
  // TODO: Préciser le domaine de l'échelle de couleurs en y associant les stations de BIXI utilisées.
  var nom = []
  data.forEach(function(d) { nom.push(d.name); });
  color.domain(nom);
  
}

/**
 * Précise le domaine de l'échelle utilisée pour l'axe X du diagramme à bandes.
 *
 * @param x       Échelle X à utiliser.
 * @param data    Données provenant du fichier JSON.
 */
function domainX(x, data) {
  // TODO: Préciser le domaine pour la variable "x" en y associant les stations de BIXI utilisées.
  var nom = []
  data.forEach(function(d) {nom.push(d.name)});
  x.domain(nom);
}

/**
 * Précise le domaine de l'échelle utilisée pour l'axe Y du diagramme à bandes.
 *
 * @param y             Échelle Y à
 * @param currentData   Les données qui sont actuellement utilisées par le diagramme.
 */
function domainY(y, currentData) {
  // TODO: Préciser le domaine pour la variable "y" en prenant comme minimum et maximum le nombre de trajets vers une station de BIXI.
  var nombre = []
  currentData.destinations.forEach(function(d) {nombre.push(d.count)});
  var min = d3.min(nombre);
  var max = d3.max(nombre);
  y.domain([min, max]);
}

/**
 * Obtient la matrice d'adjacence à partir des données spécifiées pour créer le diagramme à cordes.
 *
 * @param data        Données provenant du fichier JSON.
 * @return {Array}    Une matrice de 10 x 10 indiquant le nombre de trajets partant et se dirigeant vers une station précise.
 */
function getMatrix(data) {
  // TODO: Calculer la matrice d'adjacence pour créer le diagramme à cordes.
  var matrice = [];
  var i=0;
  
  data.forEach(function(d) {
    matrice[i] = [];
    
    for (var j = 0; j<d.destinations.length; j ++) {   
      matrice[i][j] = d.destinations[j].count;
    }

    i++;
  });

  return matrice;
} 

/**
 * Obtient le nombre total de trajets réalisés pour le mois d'août 2015.
 *
 * @param data    Données provenant du fichier JSON.
 */
function getTotal(data) {

  // TODO: Calculer le nombre total de trajets réalisés pour le mois d'août 2015.
  var total = []
  var countList = []
  data.forEach(
    function (d) {
      countList.push(getCount(d.destinations))
    }
  )

  countList.forEach(element => {
    var res = element.reduce(
      (sum, el) => sum + el, 0
    )
    total.push(res)
  });

  return total;
}

function getCount(destination) {
  var counts = destination.map(a => a.count);
  return counts;
}