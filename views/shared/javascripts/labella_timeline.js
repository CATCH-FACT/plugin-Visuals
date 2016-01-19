// ---------------------------------------------------
// Fetch real data
// ---------------------------------------------------

var select_width = jQuery("#labellatimeline").width();
var w = select_width, //start dimensions

fetcher = d3.select("#alldates").property("value");
var data = JSON.parse(fetcher);

var h = Math.max(data.length * 15, 200);
var margins = {left: 50, right: 20, top: 20, bottom: 50};

var innerHeight = h - margins.top - margins.bottom;
var innerWidth = w - margins.left - margins.right;

rounds = Math.max(10, 600 - data.length);

data.forEach(function(part, index) {
    part.time = new Date(part.date);
//    part.name = part.title;
});

var chart = new d3Kit.Timeline('#labellatimeline', {
  direction: 'right',
  margin: margins,
  initialWidth: w,
  initialHeight: h,
  layerGap: 130,
//  nodeHeight: 40,
//  nodeWidth: 60, 
  maxRound: rounds,
  textFn: function(d){
      return (d.subgenre ? d.subgenre : "verhaal") + " " + d.time.getFullYear() + "";
//      return (d.subgenre ? d.subgenre : "verhaal") + " uit " + d.time.toLocaleDateString('nl-NL') + (d.title ? ': '+d.title : "");
  },
  labella: {
      maxPos: innerHeight,
      density: 1,
      minPos: 20
  }
});

chart.data(data);

chart.on("labelClick", function(d,i){
    redirect("http://www.verhalenbank.nl/items/show/" + d.modelid);
});

chart.on("labelMouseover", function(d,i){
    jQuery('html,body').css('cursor','pointer');
});

chart.on("labelMouseout", function(d,i){
    jQuery('html,body').css('cursor', "");
});

function redirect (url) {
    var ua        = navigator.userAgent.toLowerCase(),
        isIE      = ua.indexOf('msie') !== -1,
        version   = parseInt(ua.substr(4, 2), 10);

    // Internet Explorer 8 and lower
    if (isIE && version < 9) {
        var link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
    }

    // All other browsers can use the standard window.location.href (they don't lose HTTP_REFERER like IE8 & lower does)
    else { 
        window.location.href = url; 
    }
}
/*console.log(taledata);

var layergap = 75;
var labelheight = 15;
var height = taledata.length * labelheight;

console.log(height);

var options =   {
  margin: {left: 20, right: 20, top: 20, bottom: 20},
  initialWidth: 600,
  initialHeight: height
};

var innerWidth =  options.initialWidth - options.margin.left - options.margin.right;
var innerHeight = options.initialHeight - options.margin.top - options.margin.bottom;
var colorScale = d3.scale.category10();

var vis = d3.select('#labellatimeline')
  .append('svg')
    .attr('width',  options.initialWidth)
    .attr('height', options.initialHeight)
  .append('g')
    .attr('transform', 'translate('+(options.margin.left)+','+(options.margin.top)+')');

function labelText(d){
  return (d.subgenre ? d.subgenre : "verhaal") + " uit " + d.date.toLocaleDateString('nl-NL') + (d.title ? ': '+d.title : "");
}

// compute labels dimension
var dummyText = vis.append('text');

var timeScale = d3.time.scale()
  .domain(d3.extent(taledata, function(d){return d.date;}))
  .range([0, innerHeight])
  .nice();

var nodes = taledata.map(function(tale){
  var bbox = dummyText.text(labelText(tale))[0][0].getBBox();
  tale.h = bbox.height;
  tale.w = bbox.width;
  console.log(new labella.Node(timeScale(tale.date), tale.h + 2, tale));
  return new labella.Node(timeScale(tale.date), tale.h + 2, tale);
});

dummyText.remove();

// ---------------------------------------------------
// Draw dots on the timeline
// ---------------------------------------------------

vis.append('line')
  .classed('timeline', true)
  .attr('y2', innerHeight);

var linkLayer = vis.append('g');
var labelLayer = vis.append('g');
var dotLayer = vis.append('g');

dotLayer.selectAll('circle.dot')
  .data(nodes)
.enter().append('circle')
  .classed('dot', true)
  .attr('r', 3)
  .attr('cy', function(d){return d.getRoot().idealPos;});

function color(d,i){
  return '#888';
}

//---------------------------------------------------
// Labella has utility to help rendering
//---------------------------------------------------

console.log(nodes[0].width);

var renderer = new labella.Renderer({
  layerGap: layergap,
  nodeHeight: nodes[0].width,
  direction: 'right'
});

function draw(nodes){
  // Add x,y,dx,dy to node
  renderer.layout(nodes);

  // Draw label rectangles
  var sEnter = labelLayer.selectAll('rect.flag')
    .data(nodes)
  .enter().append('g')
    .attr('transform', function(d){
            console.log(d);
            return 'translate('+(d.x)+','+(d.y-d.dy/2)+')';
        });

  sEnter
    .append('rect')
    .classed('flag', true)
    .attr('width', function(d){ return d.data.w + 9; })
    .attr('height', function(d){ return d.dy; })
    .attr('rx', 2)
    .attr('ry', 2)
    .style('fill', color);

  sEnter.append('text')
    .attr('x', 4)
    .attr('y', 15)
    .style('fill', '#fff')
    .text(function(d){return labelText(d.data);});

  // Draw path from point on the timeline to the label rectangle
  linkLayer.selectAll('path.link')
    .data(nodes)
  .enter().append('path')
    .classed('link', true)
    .attr('d', function(d){return renderer.generatePath(d);})
    .style('stroke', color)
    .style('stroke-width',2)
    .style('opacity', 0.6)
    .style('fill', 'none');
}

//---------------------------------------------------
// Use labella.Force to place the labels
//---------------------------------------------------

var force = new labella.Force({
  minPos: -10
})
  .nodes(nodes)
  .on('end', function(){
    draw(force.nodes());
  })
  .start(100);
  
*/