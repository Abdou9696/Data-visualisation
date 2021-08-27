"use strict";

/**
* Fichier permettant de traiter les données provenant des fichier CSVs.
*/


/**
* Précise le domaine et la plage de couleurs pour l'échelle qui est utilisées pour distinguer les régions administratives.
*
* @param color     Échelle de couleurs.
* @param parties   Les informations à utiliser sur les différentes régions.
*/
function colorScale(color, regions) {
  // TODO: Préciser le domaine de l'échelle en y associant chacun des partis politique de la liste spécifiée en paramètre.
  //       De plus, préciser la gamme de couleurs en spécifiant les couleurs utilisées par chacun des partis.

  // Associer noms des régions
  var names = d3.map(regions, function (d){ return d.name; }).keys();
  color.domain(names);

  // Associer gamme de couleurs
  var colors = d3.map(regions, function (d){ return d.color; }).keys();
  color.range(colors);
}

/**
* Convertit chacun des nombres provenant du fichier CSV en type "number".
*
* @param data      Données provenant du fichier CSV.
*/
function createSources(data) {
  // TODO: Convertir les propriétés "id" et "votes" en type "number" pour chacun des éléments de la liste.
  var filteredData = data.filter(function(row) {
    return row['type_territoire'] == 'province' || row['type_territoire'] == 'region administrative';
  });

   var organizedData = filteredData.map(function(d){
     return {
       region: d.region,
       taux_activite_2016: +d.taux_activite_2016,
       taux_emploi_2016: +d.taux_emploi_2016,
       taux_chomage_2016: +d.taux_chomage_2016
     };
   });
   return organizedData;
}



/**
* 
* @param data      Données provenant du fichier CSV.
*/
function createSourcesEmplois(data) {

  // selectionner les memes années pour toutes les données
  var filteredData = data.filter(function(row) {
    return  row["GÉO"].includes('Québec')& (row.Secteur=="Secteur de la production de biens"
                                              || row.Secteur=="Secteur des services")
            & +row.année>2006 & +row.année<2018;
  });
  

// changer les lignes "Secteur de la production de biens" et "Secteur de la production des services" en colonnes
var organizedData = new Array;
var data2 = new Array;
filteredData.forEach(function row(d){
    if (d.Secteur=="Secteur de la production de biens")
    {
      organizedData.push({
    region: d["GÉO"],
    année:d.année,
    "Emplois secteur des biens":+d["VALEUR"]*1000
    });
    }
    else if (d.Secteur=="Secteur des services")
    {
    data2.push({
      region: d["GÉO"],
      année:d.année,
    "Emplois secteur des services":+d["VALEUR"]*1000
    });
    } 
  
})

// ajout de la colonne "secteur des services" à organizedData
for (var i=0;i<organizedData.length;i++){
  if(organizedData[i]["region"]=="Québec"){
    organizedData[i]["region"]="Le Québec"}
    else {
    organizedData[i]["region"]=organizedData[i]["region"].substring(0, organizedData[i]["region"].indexOf(',', 2))}
  organizedData[i]["Emplois secteur des services"]=data2[i]["Emplois secteur des services"];
}
// trier les données pour faire la fusion avec les données provenant des autres csv
triCroissant(organizedData,"region")
triCroissant(organizedData,"année")
return organizedData;

}

/**
* 
* @param data      Données provenant du fichier CSV.
*/
function createSourcesPIB(data) {
  var filteredData = data.filter(function(row) {
    return   (row.Secteur=="Secteur de la production de biens" 
                    || row.Secteur=="Secteur des services");
  });
  
  //créer une colonne pour chaque secteur
var organizedData = new Array;
var data2 = new Array;
filteredData.forEach(function row(d){

    if (d.Secteur=="Secteur de la production de biens")
    {
      organizedData.push({
        region: d.Territoire,
        année:d.année,
        "pib secteur des biens":+d["Valeur"]
    });
    }
    else if (d.Secteur=="Secteur des services")
    {
    data2.push({
      region: d.Territoire,
      année:d.année,
    "pib secteur des services":+d["Valeur"]
    });
    } 
  
})

var arr3 = organizedData.map((item, i) => Object.assign({}, item, data2[i]));
triCroissant(arr3,"region")


// mettre Côte-Nord et Nord-du-Québec ensemble pour la confirmité avec les données 'emploi_industrie' 
var pibData=new Array
var i=0;  var biens=0; var services=0;


arr3.forEach(function row(d){
  
    if (d.region=="Côte-Nord"||d.region=="Nord-du-Québec" ){
      i++
       biens+=d["pib secteur des biens"]
       services+=(d["pib secteur des services"])
       if (i==2){
        pibData.push({
          region: "Côte-Nord et Nord-du-Québec",
          année:d.année,
          "pib secteur des biens": biens,
          "pib secteur des services": services
         })
         i=0; biens=0; services=0;
       }
       
    }
   else 
    {
      pibData.push({
        region: d.region,
        année:d.année,
        "pib secteur des services": d["pib secteur des services"],
        "pib secteur des biens":d["pib secteur des biens"]
      });
    }
    });
  
  // Ajouter la somme de tout le Québec pour chaque année
    var regions = [...new Set(arr3.map(d => d.region))]
    var k=0;  var biensQc=0; var servicesQc=0;
    triCroissant(pibData,"année")
      
    pibData.forEach(function row(d){    
    biensQc+=d["pib secteur des biens"];
    servicesQc+=d["pib secteur des services"]
      
      if (((k+1)%(regions.length-1)) ==0){
        pibData.push({
          region: "Le Québec",
          année:d.année,
          "pib secteur des biens": biensQc,
          "pib secteur des services": servicesQc
        });
        biensQc=0;  servicesQc=0;
      }
      k++
    })
    triCroissant(pibData,"region")
    triCroissant(pibData,"année")

  return pibData
}

/**
* 
* @param data      Données provenant du fichier CSV.
*/
function createSourcesPopulation(data1,data2){

  // mettre les données sous forme: region,année,population
  triCroissant(data2,"region")
  var keys = d3.keys(data2[0]).filter(function(d) {return d != "region" });
  var organizedData=new Array;
 
  for (var i=0;i<(data2.length)*keys.length;i++){

    organizedData.push ({
      region: data2[i%(data2.length)].region,
      année:keys[Math.trunc(i/data2.length)],
      population:data2[i%(data2.length)][keys[Math.trunc(i/data2.length)]]
    })
    }

   
// // mettre Côte-Nord et Nord-du-Québec ensemble pour la confirmité avec les données 'emploi_industrie' 
var populationData=new Array
var i=0; var population=0 ;
organizedData.forEach(function row(d){
  
  if (d.region=="Côte-Nord"||d.region=="Nord-du-Québec" ){
    i++
     population+=+d.population
     if (i==2){
      populationData.push({
        region: "Côte-Nord et Nord-du-Québec",
        année:d.année,
        population:population,
       })
       i=0; population=0;  
     }
     
  }
 else 
  {
    populationData.push({
      region: d.region,
      année:d.année,
      population:+d.population,
    });
  }  
  });
  triCroissant(populationData,"region")
  triCroissant(populationData,"année")

  var mergedData = data1.map((item, i) => Object.assign({}, item, populationData[i]));


  var PibH_Data = new Array;
  var i=0; var population=0;  
  mergedData.forEach(function row(d){
        
    PibH_Data.push({
          region: d.region,
          année:d.année,
          population:d.population,
          "pib/h secteur des services": (d["pib secteur des services"]/d.population)*1000,
          "pib/h secteur des biens":(d["pib secteur des biens"]/d.population)*1000
        });
      }  )

  return PibH_Data
}

// fonction pour trier les data en ordre croissant selon la colonne choisie
function triCroissant (data, col){

  data.sort(function(a,b) 
  {      
    return a[col] > b[col]; 
  })
}