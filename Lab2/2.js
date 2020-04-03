var svg = d3.select("svg"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;
    
var tooltip = d3.select("body")
.append("div")
.style("position", "absolute")
.style("font-family", "'Open Sans', sans-serif")
.style("font-size", "12px")
.style("z-index", "10")
.style("color" , "black")
.style("visibility", "hidden")
.style('padding', '5px')
.style('border-radius', '5px')
.style('transition', '0.2s')
.style('background-color', 'salmon');

function X(year, obj){
    $('.active').toggleClass('active')
    $(obj).addClass('active')
    svg.select('*').remove();
    var x ='X' + year
    var y = 'Y' + year
    var r = 'R' + year
    var scale = 1.5
    var xScale = d3.scaleLinear().range ([0, width]),
        yScale = d3.scaleLinear().range ([height, 0]);

    document.getElementById("scale").innerHTML = scale
    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("First.csv", function(error, data){
        if(error){
            throw error;
        }
        
        // var top5 = data.sort(function(a, b){
        //     return d3.descending(a[x], b[x])
        // }).slice(0, 5)
        
        // var mean = d3.mean(top5, function(d){return d[x]})
        // document.getElementById('t').innerHTML = mean
        
        xScale.domain([0, d3.max(data, function(d){return d[x]})])
        yScale.domain([0, d3.max(data, function(d){return d[y]})])

        g.append('g')
        .attr('transform', 'translate(0,'+height+')')
        .call(d3.axisBottom(xScale).tickFormat(function(d){
            return d
        }).ticks(10))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "grey")
        .attr('fill', 'grey')
        .attr('font-size', '15px')
        .text(x)
        .transition()
        .duration('0.2s')

        g.append("g")
        .filter(function(d, i) { return i < 5})
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d;
        }).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("transform", "rotate(-90)")
        .attr("dy", "-3.1em")
        .attr("text-anchor", "end")
        .attr('stroke', 'grey')
        .attr('fill', 'grey')
        .attr('font-size', '15px')
        .text(y)
        .transition()
        .duration('0.2s')
        
        var gg = g.selectAll('.bar-box')
        .data(data)
        .enter()
        .append("g")
        .attr('class', 'bar-box')

        gg.append("circle")
        .attr('class', 'bar')
        .attr('cx', function(d){return xScale(d[x])})
        .attr('cy', function(d){return yScale(d[y])})
        // .attr('width', xScale.bandwidth())
        // .attr('height', function(d){return height - yScale(d[x])})
        .attr('r', function(d){return d[r]*scale})
        .attr('stroke', 'red')
        .transition()
        .attr('fill', '#e31b40')
        gg.on('mouseover', function(d){
            d3.select(this)
            .select('circle')
            .style('fill', '#134071')
            .style('stroke', '#134071')
            tooltip.style('visibility', 'visible').text('Name: '+xScale(d.Name)+', X: '+yScale(d[x]))
        })
        .on('mousemove', function(d){
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text('Center: ('+d[x]+', '+ d[y] + '), Radius: '+d[r])
        })
        .on('mouseout', function(){
            d3.select(this)
            .select('circle')
            .style('fill', '#e31b40')
            .style('stroke', '#e31b40')
            tooltip.style('visibility', "hidden")
        })
    })
}
X(2011, $('.active'))