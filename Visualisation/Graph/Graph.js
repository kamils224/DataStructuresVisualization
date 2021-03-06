const graphExample = {
    "type": "graph",
    "subtype": "undirected",
    "nodes": [
        {
            "id": 0,
            "label": "label0",
            "data":55
        },
        {
            "id": 1,
            "label": "label2",
            "data":987
        },
        {
            "id": 2,
            "label": "label3",
            "data":364
        },
        {
            "id": 3,
            "label": "label4",
            "data":123
        },
        {
            "id": 4,
            "label": "label5",
            "data":364
        },
        {
            "id": 5,
            "label": "label6",
            "data":1211
        }
    ],
    "edges": [
        {
            "source": 0,
            "target": 1,
            "label": "edge0",
            "data":null
        },
        {
            "source": 1,
            "target": 2,
            "label": "edge1",
            "data":null
        },
        {
            "source": 0,
            "target": 3,
            "label": "edge2",
            "data":null
        }
    ]
};


function StartVisualization() {

    var textBoxValue = document.getElementById("JsonInput").value;

    try {
        Visualize(JSON.parse(textBoxValue));
    }catch (e) {
        alert(e.message);
    }


}



function RunExample() {

    let textBox = document.getElementById("JsonInput");
    let jsonText=textBox.value= JSON.stringify(graphExample);

    Visualize(JSON.parse(jsonText));

}

function ResetSvg() {

    var node = document.getElementById("svgDiv");
    node.removeChild(node.firstChild);

    node.innerHTML="<svg transform=\"translate(0,0)\" width=\"1000\" height=\"600\"></svg>";


}

function Visualize(JsonFormat) {

    ResetSvg();

    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.selectAll("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        node,
        link;

    svg.append('defs').append('marker')
        .attrs({'id':'arrowhead',
            'viewBox':'-0 -5 10 10',
            'refX':13,
            'refY':0,
            'orient':'auto',
            'markerWidth':13,
            'markerHeight':13,
            'xoverflow':'visible'})
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(200).strength(0.5))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    update(JsonFormat.edges, JsonFormat.nodes);

    function update(links, nodes) {
        link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end','url(#arrowhead)')

        link.append("title")
            .text(function (d) {return d.type;});

        edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'id': function (d, i) {return 'edgepath' + i}
            })
            .style("pointer-events", "none");

        edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
                'class': 'edgelabel',
                'id': function (d, i) {return 'edgelabel' + i},
                'font-size': 10,
                'fill': '#aaa'
            });

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return d.type});

        node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                //.on("end", dragended)
            );

        node.append("circle")
            .attr("class","DataCircle");

        node.append("title")
            .text(function (d) {return d.id;});

        node.append("text")
            .attr("dy", -30)
            .attr("dx",0)
            .text(function (d) {return d.label});

        node.append("text")
            .attr("dy", 5)
            .attr("dx",0)
            .text(function (d) {return d.data});

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);
    }

    function ticked() {
        link
            .attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x;})
            .attr("y2", function (d) {return d.target.y;});

        node
            .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

        edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });

        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();

                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }



}