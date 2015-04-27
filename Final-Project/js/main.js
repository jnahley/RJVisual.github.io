var width = 960,
    height = 600;

//d3.select("").style("height", height + "px");

var projection = d3.geo.albersUsa()
    .scale(1168.3535)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map-container").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

g.append( "rect" )
  .attr("width",width)
  .attr("height",height)
  .attr("fill","white")
  .attr("opacity",0)
  .on("mouseover",function(){
    hoverData = null;
    if ( probe ) probe.style("display","none");
  })

var map = g.append("g")
    .attr("id","map");

var legend = g.append("g").attr("id","legend").attr("transform","translate(560,10)");

  legend.append("circle").attr("class","gain").attr("r",5).attr("cx",5).attr("cy",10)
  legend.append("circle").attr("class","loss").attr("r",5).attr("cx",5).attr("cy",40)

  legend.append("text").text("departures increase").attr("x",15).attr("y",13);
  legend.append("text").text("departures decrease").attr("x",15).attr("y",43);

  var sizes = [ 10000, 150000, 300000 ];
  for ( var i in sizes ){
    legend.append("circle")
      .attr( "r", circleSize( sizes[i] ) )
      .attr( "cx", 150 + circleSize( sizes[sizes.length-1] ) )
      .attr( "cy", 2 * circleSize( sizes[sizes.length-1] ) - circleSize( sizes[i] ) )
      .attr("vector-effect","non-scaling-stroke")
        .attr("class","legendCirc")
        .style("fill","none")
      .style("stroke","black");
    legend.append("text")
      .text( (sizes[i] / 1000) + "K" + (i == sizes.length-1 ? " departs" : "") )
      .attr( "text-anchor", "middle" )
      .attr( "x", 150 + circleSize( sizes[sizes.length-1] ) )
      .attr( "y", 2 * ( circleSize( sizes[sizes.length-1] ) - circleSize( sizes[i] ) ) - 10 )
      .attr( "dy", 13)
    .attr("class","legendTxt")
  };
var probe,
    hoverData;

var dateScale, sliderScale, slider;

var format = d3.format(",");

var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    months_full = ["January","February","March","April","May","June","July","August","September","October","November","December"],
    orderedColumns = [],
    currentFrame = 0,
    interval,
    frameLength = 500,
    isPlaying = false;
var year=[];
var sliderMargin = 65;

function circleSize(d){
  return Math.sqrt( .004 * Math.abs(d) );
};

    
d3.json("us-states.topojson", function(error, us) {
  map.selectAll("path")
      .data(topojson.feature(us, us.objects.collection).features)
      .enter()
      .append("path")
      .attr("vector-effect","non-scaling-stroke")
      .attr("class","land")
      .attr("d", path);
    
    console.log(us);
    
   map.append("path")
       .datum(topojson.mesh(us, us.objects.collection, function(a, b) { return a !== b; }))
       .attr("class", "state-boundary")
       .attr("vector-effect","non-scaling-stroke")
       .attr("d", path);

  probe = d3.select("#map-container").append("div")
    .attr("id","probe");






d3.csv("airports.csv",function(error,data){
    console.log(data);
    var year=[2005,2006,2007,2008,2009,2010,2011,2012,2013,2014];
for(var j in year){
   for ( var i in data ){
       console.log(year[j]);
      var projected = projection([ parseFloat(data[i].LON), parseFloat(data[i].LAT) ])
      map.append("circle")
        .datum( data[i] )
        .attr("cx",projected[0])
        .attr("cy",projected[1])
        .attr("r",circleSize(parseFloat(data[i][year[j]])))
        .attr("vector-effect","non-scaling-stroke")
        .attr("class", function (d){
          return data[i][year[j]] > data[i][year[j]-1] ? "gain" : "loss";})
        .call(d3.helper.tooltip(
        function(d, j){
          return "<b>"+data[i].AIRPT_NAME + "</b><br/>Departures: "+data[i][year[j]];
        }
        ));
    console.log(parseFloat(data[i][year[j]]) + "," + data[i].AIRPT_NAME);
       
       d3.select("#nAngle").on("input", function() {
  update(j);
           });
       function update(nAngle) {

  // adjust the text on the range slider
  d3.select("#nAngle-value").text(nAngle);
  d3.select("#nAngle").property("value", nAngle);

  // rotate the text
  map.select("circle") 
    .attr("transform", "translate(300,150) rotate("+nAngle+")");
}

   }
}
});



});


