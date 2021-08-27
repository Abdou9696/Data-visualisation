"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */


/**
 * Précise le domaine en associant un nom de rue à une couleur précise.
 *
 * @param color   Échelle de 10 couleurs.
 * @param data    Données provenant du fichier CSV.
 */
function domainColor(color, data) {
  // TODO: Définir le domaine de la variable "color" en associant un nom de rue à une couleur.

  var temp = data.columns.filter(
    function (column) {
      return column!== "Date"
    }
  )
  color.domain(temp);
}

var parseTime = d3.timeParse("%d/%m/%y");

/**
 * Convertit les dates se trouvant dans le fichier CSV en objet de type Date.
 *
 * @param data    Données provenant du fichier CSV.
 * @see https://www.w3schools.com/jsref/jsref_obj_date.asp
 */
function parseDate(data) {
  // TODO: Convertir les dates du fichier CSV en objet de type Date.
  data.forEach(row => {
    row.Date = parseTime(row.Date);
  });
}



/**
 * Trie les données par nom de rue puis par date.
 *
 * @param color     Échelle de 10 couleurs (son domaine contient les noms de rues).
 * @param data      Données provenant du fichier CSV.
 *
 * @return Array    Les données triées qui seront utilisées pour générer les graphiques.
 *                  L'élément retourné doit être un tableau d'objets comptant 10 entrées, une pour chaque rue
 *                  et une pour la moyenne. L'objet retourné doit être de la forme suivante:
 *
 *                  [
 *                    {
 *                      name: string      // Le nom de la rue,
 *                      values: [        // Le tableau compte 365 entrées, pour les 365 jours de l'année.
 *                        date: Date,     // La date du jour.
 *                        count: number   // Le nombre de vélos compté ce jour là (effectuer une conversion avec parseInt)
 *                      ]
 *                    },
 *                     ...
 *                  ]
 */
function createSources(color, data) 
{
  

  // TODO: Retourner l'objet ayant le format demandé.
  var roadNames = Object.keys(data[0]).filter(function(key) 
  {
    return key != "Date";
  });

  var roadPerDate = [];
  const dateIndex = 0;

  roadNames.forEach(function(roadName, roadNameIndex){
    var roadInfo = 
    {
      name: roadName,
      values : []
    };

    data.forEach(function(d) {
      var value = 
      {
        date: d.Date,
        count: parseInt(d[roadName])
      }
      roadInfo.values.push(value);
    });

    roadPerDate.push(roadInfo);
  });
  
  return roadPerDate;
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe X.
 *
 * @param xFocus      Échelle en X utilisée avec le graphique "focus".
 * @param xContext    Échelle en X utilisée avec le graphique "contexte".
 * @param data        Données provenant du fichier CSV.
 * @see https://observablehq.com/@d3/d3-scaletime
 */
function domainX(xFocus, xContext, data) {
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  var minDate = d3.min(data, function(d) {return d.Date; });
  var maxDate = d3.max(data, function(d) {return d.Date; });
  
  xFocus.domain([minDate, maxDate]);
  xContext.domain([minDate, maxDate]);
}

/**
 * Retourne toutes les date du fichier en string.
 *
 * @param data Données provenant du fichier CSV.
 * @returns  un tableau contenant toutes les dates
 */
function getStringDates(data) {
  var result = []
  data.forEach(row => {
    result.push(row.Date.toDateString())
    
  });
  return result

}
/**
 * Retourne toutes le maximum et minimum d'un tableau de numerique.
 *
 * @param data Données provenant du fichier CSV.
 * @returns  un tableau contenant toutes les dates
 */
function getExtrema(array) {
  var result = []
  result.push(Math.max.apply(Math,array))
  result.push(Math.min.apply(Math,array))
  return result

}


/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe Y.
 *
 * @param yFocus      Échelle en Y utilisée avec le graphique "focus".
 * @param yContext    Échelle en Y utilisée avec le graphique "contexte".
 * @param sources     Données triées par nom de rue et par date (voir fonction "createSources").
 * @see https://observablehq.com/@d3/d3-scalelinear

 */
function domainY(yFocus, yContext, sources) {
  // TODO: Préciser les domaines pour les variables "yFocus" et "yContext" pour l'axe Y.
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  var minValue = d3.min(sources, function(d) 
  {
    return d3.min(d.values, function(value) { return value.count; });
  });

  var maxValue = d3.max(sources, function(d) 
  {
    return d3.max(d.values, function(value) { return value.count; });
  });
  
  yFocus.domain([minValue, maxValue]);
  yContext.domain([minValue, maxValue]);
}

