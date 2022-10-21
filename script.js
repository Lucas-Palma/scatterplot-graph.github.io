let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req = new XMLHttpRequest()

let values = []

let xScale
let yScale

let width = 1100;
let height = 500;
let padding = 70;

//section and heading
let section = d3.select('body').append('section');

let heading = section.append('heading');
  heading
        .append('h1')
        .attr('id', 'title')
        .text('DOPING IN PROFESSIONAL BICYCLE RACING');
    heading
        .append('h3')
        .attr('id', 'description')
        .html("35 FASTEST TIMES UP ALPE D'HUEZ");

//create tip
let tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .attr('id', 'tooltip')
    .html(d => {
        return d;
    })
    .direction('e')
    .offset([0, 5]);

//create svg
let svg = section
    .append('svg')
    .attr('width', width + padding * 2)
    .attr('height', height + padding * 2)
    .call(tip)

let drawCanvas = () => {
    
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    xScale = d3.scaleLinear()
                .domain([
                    d3.min(values, (item) => {
                    return item['Year']
                    }) - 1,
                    d3.max(values, (item) => {
                    return item['Year']
                    }) + 1])
                .range([padding, width - padding])
    
    yScale = d3.scaleTime()
                .domain([
                    d3.min(values, (item) => {
                    return new Date(item['Seconds'] * 1000)
                    }),
                    d3.max(values, (item) => {
                    return new Date(item['Seconds'] * 1000)
                    })])
                .range([padding, height - padding])

}

let drawPoints = () => {

    svg.selectAll('dot')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', (item) => {
            return item['Year']
        })
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds']* 1000)
        })
        .attr('r', '7')
        .attr('cx', (item) => {
            return xScale(item['Year'])
        })
        .attr('cy', (item) => {
            return yScale(new Date(item['Seconds'] * 1000))
        })
        .attr('fill', (item) => {
            return item['Doping'] === "" ? "orange" : "blue"
        })
        .on('mouseover', function(event, d) {
            let str =
                `<span class='name'> 
                    Name: ${d.Name} 
                </span>
                <br />
                <span class='nationality'>
                   Nationality: ${d.Nationality} 
                </span>
                <br />
                <span class='year'>
                   Year: ${d.Year} 
                </span>
                <br />
                <span class='time'>
                   Time: ${d.Time} 
                </span>
                <br />
                ${d.Doping ?
                    `<span class='doping'>
                        Doping: ${d.Doping} 
                     </span>` 
                    : ''
                }`
                
            tip.attr('data-year', d.Year);
            tip.show(str, this);
          })
          .on('mouseout', tip.hide);

        let legend = svg
            .append('text')
            .attr('id', 'legend')
            .attr('class', 'legend')
            .attr('y', height / 4)
            .attr('x', width / 1.5)
            .text("Doping Allegation")

        let rect1 = svg
            .append('rect')
            .attr('class', 'rect')
            .attr('id', 'rect1')
            .attr('y', height / 4.4)
            .attr('x', width / 1.55)

        let legend2 = svg
            .append('text')
            .attr('class', 'legend')
            .attr('id', 'legend2')
            .attr('y', height / 4.6)
            .attr('x', width / 1.5)
            .text("No Doping Allegation")

        let rect2 = svg
            .append('rect')
            .attr('class', 'rect')
            .attr('id', 'rect2')
            .attr('y', height / 5.1)
            .attr('x', width / 1.55)

}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yScale)    
                    .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .append('text')
        .text('Years')
        .style('text-anchor', 'middle')
        .style('fill', 'black')
        .attr('transform', `translate(${width / 2}, ${40})`)

    svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)')
    .append('text')
    .text('Minutes')
    .style('text-anchor', 'middle')
    .attr(
        'transform',
        `translate(${- 50}, ${height / 2 }) rotate(-90)`
      )
    .attr('fill', 'black');
}

req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
}

req.send()