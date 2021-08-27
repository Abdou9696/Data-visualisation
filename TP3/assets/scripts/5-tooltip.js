"use strict";

/**
 * Fichier permettant de définir le texte à afficher dans l'infobulle.
 */


/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées au cercle survollé par la souris.
 * @param formatNumber    Fonction permettant de formater correctement des nombres.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d, formatNumber) {
  // TODO: Retourner le texte à afficher dans l'infobulle selon le format demandé.
  //       Assurez-vous d'utiliser la fonction "formatNumber" pour formater les nombres correctement.

  return    "Pays : <strong>" + d.name + "</strong><br>"
            + "Espérance de vie :<strong> " + formatNumber(d.lifeExpectancy) + " </strong> ans<br>"
            + "Revenu moyen :<strong> " + formatNumber(d.income)  + " </strong> USD<br>"
            + "Population : <strong> " + formatNumber(d.population) + " </strong> habitants<br>"
            + "Zone du monde: <strong> " + d.zone + " </strong><br>";
}
