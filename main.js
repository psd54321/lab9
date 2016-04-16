var margin = {top: 20, right: 20, bottom: 40, left: 50},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category10();
  
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xg = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
xg
  .append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end");
      
var yg = svg.append("g")
      .attr("class", "y axis");
yg
  .append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end");
      
var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });


function update(){
    var xVar = d3.select('#sel-x').node().value;
    var yVar = d3.select('#sel-y').node().value;
    
    var mpg_min = $('#mpg-min').val();
    var mpg_max = $('#mpg-max').val();
    
    dataf = data.filter(function(d,i){
    return d.mpg>=mpg_min && d.mpg<=mpg_max;
    });
    
    x.domain([0,d3.max(dataf, function(d) { return d[xVar]; })]).nice();
    y.domain([0,d3.max(dataf, function(d) { return d[yVar]; })]).nice();
    
    xg.call(xAxis);
    yg.call(yAxis);
  
    xg.select("text").text(xVar);
    yg.select("text").text(yVar);
    
    var circles = svg.selectAll(".dot")
    .data(dataf);
    
  circles.enter()
    .append("circle")
    .attr("class", "dot");
    
  circles.exit().remove();

  circles.attr("cx", function(d) { return x(d[xVar]); })
    .attr("cy", function(d) { return y(d[yVar]); })
  .attr("r", 3.2)
  .on("mouseover", function (d) {
            d3.select('#hovered')
                .text(d["name"])
                });
}

var data = null;

d3.csv('car.csv', function(csv) {
    var headers = d3.keys(csv[0]);
    $('#sel-x').empty();
    $('#sel-y').empty();
    $.each(headers, function(i, p) {
        if(p == 'name' || p == 'origin'){ return;}
        $('#sel-x').append($('<option></option>').val(p).html(p));
        $('#sel-y').append($('<option></option>').val(p).html(p));
   });
    
    csv.forEach(function(row) {
        row.name = row.name;
        row.origin = row.origin;
        row["model.year"] = +row["model.year"];
        row.mpg = +row.mpg;
        row.cylinders = +row.cylinders;
        row.displacement = +row.displacement;
        row.horsepower = +row.horsepower;
        row.weight = +row.weight;
        row.acceleration = +row.acceleration;
    });
    
    data = csv;
    
    update("mpg","weight");
    
});

d3.selectAll('select').on('change',function(){
  update();
});

d3.select('#update').on('click',function(){
  update();
});