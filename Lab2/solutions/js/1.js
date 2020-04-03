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
.style('transition', '0.05s')
.style('background-color', 'salmon');

function X(year, obj){
    $('.active').toggleClass('active')
    $(obj).addClass('active')
    svg.select('*').remove();
    var x='X'+year
    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("First.csv", function(error, data){
        if(error){
            throw error;
        }
        
        var top5 = data.sort(function(a, b){
            return d3.descending(a[x], b[x])
        }).slice(0, 5)
        
        var mean = d3.mean(top5, function(d){return d[x]})
        document.getElementById('t').innerHTML = mean
        
        xScale.domain(top5.map(function(d){return d.Name}))
        yScale.domain([0, d3.max(top5, function(d){return d[x]})])

        g.append('g')
        .attr('transform', 'translate(0,'+height+')')
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "grey")
        .attr('fill', 'grey')
        .attr('font-size', '15px')
        .text("Name")
        .transition()
        .duration('0.05s')

        g.append("g")
        // .filter(function(d, i) { return i < 5})
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d;
        }).ticks(10))
        .attr('id', 'leftAxis')
        .append("text")
        .attr("y", 6)
        .attr("transform", "rotate(-90)")
        .attr("dy", "-3.1em")
        .attr("text-anchor", "end")
        .attr('stroke', 'grey')
        .attr('fill', 'grey')
        .attr('font-size', '15px')
        .text(x)
        .transition()
        .duration('0.05s')
        
        var gg = g.selectAll('.bar-box')
        .data(top5)
        .enter()
        .append("g")
        .attr('class', 'bar-box')

        gg.append("rect")
        .attr('class', 'bar')
        .attr('x', function(d){return xScale(d.Name)})
        .attr('y', function(d){return yScale(d[x])})
        .attr('width', xScale.bandwidth())
        .attr('height', function(d){return height - yScale(d[x])})
        .transition()
        .attr('fill', '#e31b40')
        gg.on('mouseover', function(d){
            if(d[x] > mean){
                d3.select(this)
                .select('rect')
                .style('fill', '#134071')
            }
            else{
                d3.select(this)
                .select('rect')
                .style('fill', 'grey')
            }
            tooltip.style('visibility', 'visible').text('Name: '+xScale(d.Name)+', X: '+yScale(d[x]))
        })
        .on('mousemove', function(d){
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text('Name: '+d.Name+', X: '+d[x])
        })
        .on('mouseout', function(){
            d3.select(this)
            .select('rect')
            .style('fill', '#e31b40')
            tooltip.style('visibility', "hidden")
        })
        .on('click', function(d){
            gg.selectAll('.bar').remove()
            t = parseInt(d[x])
            d[x] = t + 5
            console.log(d[x])
            gg.append("rect")
            .attr('class', 'bar')
            .attr('x', function(d){return xScale(d.Name)})
            .attr('y', function(d){return yScale(d[x])})
            .attr('width', xScale.bandwidth())
            .attr('height', function(d){return height - yScale(d[x])})
            .transition()
            .attr('fill', '#e31b40')
            // d3.select(this)
            // .select('rect')
            // .attr('height', function(d){t = parseInt(d[x]); d[x] = t + 5; return height - yScale(d[x])})
            // .attr('y', function(d){return yScale(d[x])})
            console.log(d3.max(top5, function(d){return d[x]}))
            yScale.domain([0, d3.max(top5, function(d){return d[x]})])
            d3.select('#leftAxis')
            .call(d3.axisLeft(yScale).tickFormat(d => d)
            )
        })
    })
}
X(2011, $('.active'))