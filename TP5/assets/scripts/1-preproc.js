"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */


/**
 * Précise le domaine et la plage de couleurs pour l'échelle qui est utilisées pour distinguer les partis politiques.
 *
 * @param color     Échelle de couleurs.
 * @param parties   Les informations à utiliser sur les différents partis.
 */
function colorScale(color, parties) {
  // TODO: Préciser le domaine de l'échelle en y associant chacun des partis politique de la liste spécifiée en paramètre.
  //       De plus, préciser la gamme de couleurs en spécifiant les couleurs utilisées par chacun des partis.
  color.domain(parties.map(party => party.name));
  color.range(parties.map(party => party.color));
}

/**
 * Convertit chacun des nombres provenant du fichier CSV en type "number".
 *
 * @param data      Données provenant du fichier CSV.
 */
function convertNumbers(data) {
  // TODO: Convertir les propriétés "id" et "votes" en type "number" pour chacun des éléments de la liste.
  data.forEach(d => {
    d.id = parseInt(d.id);
    d.votes = parseInt(d.votes);
  });
}

/**
 * Réorganise les données afin de combiner les résultats pour une même circonsription.
 *
 * @param data      Données provenant du fichier CSV.
 * @return {Array}  Les données réorganisées qui seront utilisées. L'élément retourné doit être un tableau d'objets
 *                  comptant 338 entrées, c'est-à-dire, une entrée par circonscription. Chacune des entrées devra
 *                  présenter les résultats pour chacun des candidats triés en ordre décroissant (du candidat ayant
 *                  obtenu le plus de votes à celui en ayant reçu le moins). L'objet retourné doit avoir la forme suivante:
 *
 *                  [
 *                    {
 *                      id: number              // Le numéro de la circonscription
 *                      name: string,           // Le nom de la circonscription
 *                      results: [              // Le tableau contenant les résultats pour les candidats s'étant présentés.
 *                                              // *** Ce tableau doit être trié en ordre décroissant de votes. ***
 *                        {
 *                          candidate: string,  // Le nom du candidat
 *                          votes: number,      // Le nombre de votes obtenus pour le candidat
 *                          percent: string,    // Le pourcentage des votes obtenus par le candidat
 *                          party: string       // Le parti politique du candidat
 *                        },
 *                        ...
 *                      ]
 *                    },
 *                    ...
 *                  ]
 */
function createSources(data) {
  // TODO: Retourner l'objet ayant le format demandé. Assurez-vous de trier le tableau "results" pour chacune des entrées
  //       en ordre décroissant de votes (le candidat gagnant doit être le premier élément du tableau).
  
  var valuebycirc = data.sort(function(a,b) { 
    if(a.name == b.name)
      return a.votes < b.votes

    return a.name > b.name; 
  });

  var circonscription_name = "";
  var sorted_circonscription = [];
  var last_edited_circonscription;

  valuebycirc.forEach(function(d) {
    var new_circonscription = circonscription_name != d.name;

    if(new_circonscription) {
      circonscription_name = d.name;

      last_edited_circonscription = {
        id: d.id,
        name: circonscription_name,
        results: []
      };
    }
    else
      last_edited_circonscription = sorted_circonscription[sorted_circonscription.length - 1];

    last_edited_circonscription.results.push({
      candidate: d.candidate,
      votes: d.votes,
      percent: d.percent,
      party: d.party
    });

    if(new_circonscription)
      sorted_circonscription.push(last_edited_circonscription);
  });

  return sorted_circonscription;
}
