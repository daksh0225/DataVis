var svg = d3.select("#svg"),
    margin = 200
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;
// var svg = d3.select("#svg");
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

var type = 0
var year = '2011'

function changeType(t){
    type = t
    graph()
}

function X(y, obj){
    year = y
    $('.active').toggleClass('active')
    $(obj).addClass('active')
    svg.select('*').remove();
    svg.select('*').remove();
    graph()
}
function graph(){
    var x = 'X' + year
    var y = 'Y' + year
    var x0Scale = d3.scaleBand().rangeRound([0, width]),
        yScale = d3.scaleLinear().rangeRound([height, 0]),
        x1Scale = d3.scaleBand(),
        color = d3.scaleOrdinal().range(['#e31b40', '#134071'])

    svg.select('*').remove()
    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("First.csv", function(d, i, columns){
            for(var i = 1, n = columns.length; i < n; i++) {
                d[columns[i]] = +d[columns[i]];
            }
            return d;
        }, function(error, data){
            if(error){
                throw error;
            }
            var keys = []
            for(i in data.columns){
                if(data.columns[i] === x || data.columns[i] === y){
                    keys.push(data.columns[i])
                }
            }

            series = d3.stack()
            .keys(keys)(data)
            .map(d => (d.forEach(v => v.key = d.key), d))
            // console.log(series)
            var y1 = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
            .rangeRound([height, 0])

            var x1 = d3.scaleBand().rangeRound([0, width]).domain(data.map(function(d){return d.Name})).padding(0.05)
            
            x0Scale.domain(data.map(function(d){return d.Name})).padding(0.05)
            x1Scale.domain(keys).rangeRound([0, x0Scale.bandwidth()])
            yScale.domain([0, height/3])

            if(type == 0){
                g.append('g')
                .attr('transform', 'translate(0,'+height+')')
                .call(d3.axisBottom(x0Scale))
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
                .text(x+' | '+y)
                .transition()
                .duration('0.05s')
                
                var gg = g.selectAll('.bar-box')
                .data(data)
                .enter()
                .append("g")
                .attr('class', 'bar-box')
                .attr('transform', function(d){ return 'translate('+x0Scale(d.Name)+', 0)'})
                
                gg.selectAll('.bar-grouped')
                .data(function(d){return keys.map(function(key){return {key: key, value: d[key]}; }); })
                .enter()
                .append("rect")
                .attr('class', 'bar-grouped')
                .attr('x', function(d){return x1Scale(d.key)})
                .attr('y', function(d){return yScale(d.value)})
                .attr('width', x1Scale.bandwidth())
                .attr('height', function(d){return (height - yScale(d.value))})
                .attr("fill", function(d) { return color(d.key); })
                .on('mouseover', function(d){
                    d3.select(this).style('fill', 'grey')
                    tooltip.style('visibility', 'visible').text('Key: '+d.key+', Value: '+d.value)
                })
                .on('mousemove', function(d){
                    return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text('Name: '+keys(d)+', Value: '+d.value)
                })
                .on('mouseout', function(d){
                    d3.select(this).style('fill', color(d.key))
                    tooltip.style('visibility', "hidden")
                })
            }
            else{
                g.append('g')
                .attr('transform', 'translate(0,'+height+')')
                .call(d3.axisBottom(x1))
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
                .call(d3.axisLeft(y1).tickFormat(function(d){
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
                .text(x+' | '+y)
                .transition()
                .duration('0.05s')

                var gg = g.selectAll('.bar-box')
                .data(series)
                .enter()
                .append("g")
                .attr('class', 'bar-box')

                gg.selectAll('.bar-stacked')
                .data(d => d)
                .enter()
                .append('rect')
                .attr('class', 'bar-stacked')
                .attr('x', function(d){return x1(d.data.Name)})
                .attr('y', function(d){return y1(d[1])})
                .attr('height', function(d){return height - y1(d[1] - d[0])})
                .attr('width', x1.bandwidth())
                .attr('fill', function(d){return color(d.key)})
                .on('mouseover', function(d){
                    d3.select(this).style('fill', 'grey')
                    tooltip.style('visibility', 'visible').text('Key: '+d.key+', Value: '+(d[1]-d[0]))
                })
                .on('mousemove', function(d){
                    return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text('Key: '+d.key+', Value: '+(d[1]-d[0]))
                })
                .on('mouseout', function(d){
                    d3.select(this).style('fill', color(d.key))
                    tooltip.style('visibility', "hidden")
                })
            }

            var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
            .attr("x", width + 30)
            .attr("width", 19)
            .attr("height", 19)
            .attr('margin', '2px')
            .attr("fill", color);
      
            legend.append("text")
            .attr("x", width + 24)
            .attr("y", 9.5)
            .attr("dy", "0.5em")
            .attr('font-size', '15px')
            .text(function(d) { return d; });
    })
}
X(2011, $('.active'))