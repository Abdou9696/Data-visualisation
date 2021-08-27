"use strict";

 
/**
 * Fichier permettant de créer le back to back stacked bar chart 
 */

 /**
  * Crée les le graphique.
  *
  * @param g1      Le groupe dans lequel le stacked bar chart 1 doit être dessiné.
  * @param g2      Le groupe dans lequel le stacked bar chart 2 doit être dessiné.
  * @param width   La largeur du graphique.
  * @param height  La hauteur du graphique.
  * @param csv Les données
  */


 function createGraph(g,g2, width, height, csv) {
  //getOptions()
  
  var sources=csv.filter(function(d) { return d.region != "Le Québec"});

  var keystemp = d3.keys(sources[0]).filter(function(d) {return d == "pib/h secteur des services" || d == "pib/h secteur des biens" });
  var keys2 = d3.keys(sources[0]).filter(function(d) {return d == "Emplois secteur des services" || d == "Emplois secteur des biens" });
  var keys=[keystemp[1],keystemp[0]] 

  var année   = [...new Set(sources.map(d => d.année))]
  var regions = [...new Set(sources.map(d => d.region))]
  

  // ajouter les années dans la liste déroulantes
  d3.select("#year_Chart").selectAll("option")
  .data(année)
  .enter().append("option")
  .text(d => d)

// les axes
  var y = d3.scaleBand()
  .range([0,height])
  .padding(0.1)
  .paddingOuter(0.2)
  .paddingInner(0.2)

  var x = d3.scaleLinear()
      .range([width,0]);

 g.append("g")
      .attr("class", "y-axis")
  
 g.append("g")
    .attr("transform", "translate(0," + height + ")")
      .attr("class", "x-axis")
      
      
      var colorSecteur = d3.scaleOrdinal()
		.range([ "#4639AF","#F7D229"])
    .domain(keys);


  var y2 = d3.scaleBand()
  .range([0,height])
  .padding(0.1)
  .paddingOuter(0.2)
  .paddingInner(0.2)

  var x2 = d3.scaleLinear()
      .range([0,width]);
      

      g2.append("g")
      .attr("transform", "translate("+width+", 0 )")
      .attr("class", "y-axis")
  
    g2.append("g")
    .attr("transform", "translate(0," + height + ")")
      .attr("class", "x-axis")

    var colorSecteur2 = d3.scaleOrdinal()
		.range(["#4639AF","#F7D229"])
    .domain(keys2);

    // les tooltip
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
    var tip2 = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

    // Mettre à jour les graphiques pour l'année sélectionnée
    var select = d3.select("#year_Chart")
		.on("change", function() {
			update(this.value, 750)
		})

    /*
     Mettre à jour les graphiques selon l'ordre sélectionné
    */
   // tri selon le pib/h décroissant
    var checkbox = d3.select("#sort_Chart1")
		.on("click", function() {
      document.getElementById("sort_Chart2").checked = false
			update(select.property("value"), 750)
		})

    //tri selon le nombre d'emploi décroissant
	var checkbox = d3.select("#sort_Chart2")
		.on("click", function() {
      document.getElementById("sort_Chart1").checked = false
			update(select.property("value"), 750)
		})


  
    update(d3.select("#year_Chart").property("value"), 0)

    // fonction pour Mettre à jour les graphiques
    function update(input, speed) {
      
      // data de l'année sélectionnée
      var data = sources.filter(f => f.année == input)

      // ajouter les sommes dans les données
      data.forEach(function(d) {
        d.total = d3.sum(keys, k => +d[k]) 
        d.total2 = d3.sum(keys2, k => +d[k])        
        return d
      })

      // trier selon l'ordre sélectionné
      if (d3.select("#sort_Chart2").property("checked")){
        (triDecroissant(data,"total2"))
        }
        if (d3.select("#sort_Chart1").property("checked")){
          (triDecroissant(data,"total"))
          }

      // Mettre à jour les axes
      x2.domain([0, d3.max(data, d => d.total2)]).nice();
      g2.selectAll(".x-axis").transition().duration(speed)
      .call(d3.axisBottom(x2).ticks(5).tickFormat(function(d) { return parseInt(d / 1000) + "K"; }).tickSizeInner([-height]))
      .style('opacity', 0.5)
      
      x.domain([0, d3.max(data, d => d.total)]).nice();
      g.selectAll(".x-axis").transition().duration(speed)
      .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d / 1000) + "K"; }).tickSizeInner([-height]))
      .style('opacity', 0.5)
    
  


y.domain(data.map(d => d.region));
g.selectAll(".y-axis").transition().duration(speed)
.call(d3.axisLeft(y).tickSizeOuter(0))

y2.domain(data.map(d => d.region));
g2.selectAll(".y-axis").transition().duration(speed)
.call(d3.axisRight(y2).tickSizeOuter(0))

// créer le stacked bar chart 1(à gauche)
var group = g.selectAll("g.layer")
.data(d3.stack().keys(keys)(data), d => d.key)
group.exit().remove()

group.enter().insert("g", ".y-axis").append("g")
.classed("layer", true)
.attr("fill", d => colorSecteur(d.key));

var bars = g.selectAll("g.layer").selectAll("rect")
.data(d => d, e => e.data.region);

bars.exit().remove()

bars.enter().append("rect")
.attr("height", y.bandwidth())
.on("mouseover",  tip.show)
.on("mouseout", function(){d3.select(this).style('opacity', 1)})
.merge(bars)
.transition().duration(speed)
.attr("y", d => y(d.data.region))
.attr("x", d => x(d[1]))
.attr("width", d => (x(d[0]) - x(d[1])))

g.on("mouseout", tip.hide)

   
// créer le stacked bar chart 2(à droite)
 var group2 = g2.selectAll("g.layer")
   .data(d3.stack().keys(keys2)(data), d => d.key)
   group2.exit().remove()

   group2.enter().insert("g", ".y-axis").append("g")
   .classed("layer", true)
   .attr("fill", d => colorSecteur2(d.key));

 var bars2 = g2.selectAll("g.layer").selectAll("rect")
   .data(d => d, e => e.data.region);

 bars2.exit().remove()

 bars2.enter().append("rect")
 .attr("height", y2.bandwidth())
 .on("mouseover", tip2.show)
 .on("mouseout", function(){d3.select(this).style('opacity', 1)})
 .merge(bars2)
.transition().duration(speed)
 .attr("y", d => y2(d.data.region))
 .attr("x", d => x2(d[0]))
 .attr("width", d => x2(d[1]) - x2(d[0]))

 g2.on("mouseout", tip2.hide)



// ajouter tooltip pour chaque graph
        tip.html(function(d) {
          d3.select(this).style('opacity', 0.5)
          return getToolTipText(d)
        });
        tip2.html(function(d) {
          d3.select(this).style('opacity', 0.5)
          return getToolTipText2(d)
        });
        g.call(tip);
        g2.call(tip2);


 // ajouter la legende
 var legend = g2.append("g")
 .attr("font-family", "sans-serif")
 .attr("font-size", 10)
 .attr("text-anchor", "end")
.selectAll("g")
.data(["secteur des biens","secteur des services"])
.enter().append("g")
.attr("transform", function(d, i) { return "translate("+(-470+ (i * 20))+",  -35   )"; });

legend.append("rect")
 .attr("x", width - 19)
 .attr("width", 19)
 .attr("height", 19)
 .attr("fill", colorSecteur2);

legend.append("text")
 .attr("x", width - 40)
 .attr("y", 9.5)
 .attr("dy", "0.32em")
 .attr("transform", function(d, i) { return "translate("+(15+(i * 120))+",  0   )"; })
 .text(function(d) { return d; });


  // text label for the x axis (nombre d'emplois)
  g2.append("text")             
      .attr("transform",
            "translate(" + (width-20) + " ," + 
                           (height +  40) + ")")
      .style("text-anchor", "middle")
      .text("Nombre d'emplois");

       // text label for the x axis (pib/h)
  g.append("text")             
  .attr("transform",
        "translate(" + (0) + " ," + 
                       (height +  40) + ")")
  .style("text-anchor", "middle")
  .text("PIB par habitant");
}
 }
 
  
  // fonction pour trier les data en ordre décroissant selon la colonne choisie
function triDecroissant (data, col){

  data.sort(function(a,b) 
  {      
    return a[col] < b[col]; 
  })
}

/**
 * Obtient le texte associé à l'infobulle pour le stacked bar chart 1(à gauche)
 *
 * @param d               Les données associées au cercle survollé par la souris.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d) {
  var s1=("PIB total de "+d.data.region+" = "+d3.format("$,.3r")(d.data.population*d.data.total/1000000)+"M")
  var s2=("PIB/h total de "+d.data.region+" = "+d3.format("$,.4s")(d.data.total))
  var s3=""
  if (parseInt(d[1]-d[0])===parseInt(d.data["pib/h secteur des services"])){
    s3="PIB/h secteur des services"
  }
  else if ((d[1]-d[0])==d.data["pib/h secteur des biens"]){
    s3="PIB/h secteur des biens"}
return "<strong>"+ s1+"</strong><br>" +"<strong>"+s2+"</strong><br>" +
"<strong>"+s3+" = "+d3.format("$,.4s")((d[1]-d[0]))+" ("+d3.format(",.1%")((d[1]-d[0])/d.data.total)+")</strong><br>" 
}

/**
 * Obtient le texte associé à l'infobulle pour le stacked bar chart 2(à droite)
 *
 * @param d               Les données associées au cercle survollé par la souris.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText2(d) {
  var s1="Nombre d'emplois total de "+d.data.region+" = "+d3.format(",.4s")(d.data.total2)
  var s2=""
  if (parseInt(d[1]-d[0])===parseInt(d.data["Emplois secteur des services"])){
    s2="Nombre d'emploi secteur des services"
  }
  else if ((d[1]-d[0])==d.data["Emplois secteur des biens"]){
    s2="Nombre d'emploi secteur des biens"
  }
  return "<strong>" +s1+ "</strong><br>" +
    "<strong>" +s2+" = "+(d3.format(",.4s")(d[1]-d[0]))+" ("+d3.format(",.1%")((d[1]-d[0])/d.data.total2)+")</strong><br>"     
}
function getOptions(svg) {
  console.log("000000000")
 
  svg.append ("<table>"
  +"<tr>"
  +"<th width=480>"
  + " <label class='switch'>"
  +"    <input type='checkbox' id='sort_Chart1'>"
  +"    <span class='slider round'></span>"
  +"  </label> Trier par PIB/habitant      "      
  +"</th>"
  +"<th width=340  > "
  +"Année: <select id='year_Chart' style='width: 130px'></select>"
  +"</th> "
  +"<th width=380 > "
  +"  Trier par nombre d'emplois" 
  +"  <label class='switch'>"
  +"    <input type='checkbox' id='sort_Chart2'>"
  +"    <span class='slider round'></span>"
  +"  </label>"
  +"  </th>"
  +"</tr>"
  
  +"</table>")
}


  