/**
 * Fichier principal permettant de dessiner les graphiques .
 */

(function () {
  "use strict";

  /***** Configuration *****/
  var regions = [
      {name: "Le Québec", color: "#000000", abbreviation: "QC"},
      {name: "Abitibi-Témiscamingue", color: "#c9080a", abbreviation: "Ab.-T."},
      {name: "Bas-Saint-Laurent", color: "#fec7f8", abbreviation: "B.-St-L."},
      {name: "Capitale-Nationale", color: "#0b7b3e", abbreviation: "Cap.-N."},
      {name: "Centre-du-Québec", color: "0bf0e9", abbreviation: "C.-Qc"},
      {name: "Chaudière-Appalaches", color: "#c203c8", abbreviation: "Ch.-App."},
      {name: "Côte-Nord et Nord-du-Québec", color: "#fd9b39", abbreviation: "C.-N."},
      {name: "Estrie", color: "#", abbreviation: "Estr."},
      {name: "Gaspésie–Îles-de-la-Madeleine", color: "#194f99", abbreviation: "G.–Î.-M."},
      {name: "Lanaudière", color: "#888593", abbreviation: "Lan."},
      {name: "Laurentides", color: "#98ba7f", abbreviation: "Laur."},
      {name: "Laval", color: "#fe6794", abbreviation: "Lav."},
      {name: "Mauricie", color: "#10b0ff", abbreviation: "Maur."},
      {name: "Montérégie", color: "#ac7bff", abbreviation: "Mgie"},
      {name: "Montréal", color: "#0ad811", abbreviation: "Mtl"},
      {name: "Outaouais", color: "#964c63", abbreviation: "Out."},
      {name: "Saguenay-Lac-Saint-Jean", color: "#fe6cfe", abbreviation: "S.–L.-St-J."}
    ];

    var color = d3.scaleOrdinal();

  // Graphique principal (focus)
  var marginMain = {
    top: 50,
    right: 100,
    bottom: 100,
    left: 5
  },
  widthMain = 1200 - marginMain.left - marginMain.right,
  heightMain = 500 - marginMain.top - marginMain.bottom;

  var xScaleParallel = d3.scalePoint()
                    .range([0, widthMain])
                    .padding(1);

  var yScaleParallel = {},
      dragging = {};

  var line = d3.line(),
      axis = d3.axisLeft(),
      background,
      foreground;

  /***** Création des éléments *****/
   var svg = d3.select("#block-system-main") 
     .append("svg")
     .attr("width", widthMain + marginMain.left + marginMain.right)
     .attr("height", heightMain + marginMain.top + marginMain.bottom)
     .attr("id", "svg-viz");


     var svg3 = d3.select("#block-system-main")
     .append("svg")
     .attr("width", widthMain + marginMain.left + marginMain.right)
     .attr("height", heightMain +100+ marginMain.top + marginMain.bottom)
     .attr("id", "svg-viz3");

  // Groupe affichant le graphique parallel-coordinates.
  var gParallel = svg.append("g")
                      .attr("transform", "translate(" + marginMain.left + "," + marginMain.top + ")")
                      .attr("class", "parallel");

  var gParallelWidth = 500 - marginMain.left - marginMain.right;
  var gParallelHeight = 500 - marginMain.top - marginMain.bottom;

  /***** Création des éléments des stacked bar chart  *****/
 
  /***** Configuration *****/

  var barChartWidth = 500 - marginMain.left - marginMain.right;
  var barChartHeight = 550 - marginMain.top - marginMain.bottom;

// Groupe affichant le graphique stacked bar chart 1
var barChartGroup1 = svg3.append("g")
  .attr("transform", "translate(" + (marginMain.left+100) + "," + (marginMain.top) + ")");

// Groupe affichant le graphique stacked bar chart 2
var barChartGroup2 = svg3.append("g")
  .attr("transform", "translate(" + (marginMain.left+600) + "," + (marginMain.top) + ")");   
  
  
  var optionBar = svg3.append("g")
  .attr("transform", "translate(" + (marginMain.left+100) + "," + (marginMain.top+200) + ")")
  
  optionBar.append("div")
  .classed("scatter_plot_anim_ctrl", true);

  
    /***** Chargement des données *****/

    d3.csv("assets/data/ind_emploi_2016.csv")
      .then(function(data){
        // Prétraitement des données
        colorScale(color, regions);
        var sources = createSources(data);
        createParallelGraph(gParallel, xScaleParallel, yScaleParallel, axis, gParallelWidth, gParallelHeight, color, sources);
      });

          /***** Chargement des données des stacked bar chart *****/      
    d3.csv("assets/data/pib_industrie(1).csv")
      .then(data=>{
        // Prétraitement et fusion des données
        var pibData= createSourcesPIB(data)  
        d3.csv("assets/data/emploi_industrie.csv")
        .then(function(data){
          var emploiData = createSourcesEmplois(data);
          d3.csv("assets/data/population.csv")
      .then(data=>{
          var pibH_Data =createSourcesPopulation(pibData,data)
          var finalData=pibH_Data.map((item, i) => Object.assign({}, item, emploiData[i]));
          // créer le graphique
          createGraph(barChartGroup1,barChartGroup2, barChartWidth, barChartHeight, finalData);
        })
    });
        })
        aff(svg3)
        function aff(g) {
         
          var margin = {
              top: 50,
              right: 50,
              bottom: 50,
              left: 80
          };
          
          g.width = 1200 - margin.left - margin.right;
          g.height = 500 - margin.top - margin.bottom;
      
        
          
       
      
          var timeControlbuttonPanel = d3.select("#block-system-main")
                                          .append("div")
                                          .classed("scatter_plot_anim_ctrl", true);
          
         
            }
})();
