function NodeViewer(vm, selectString){

    this.init = function(){

//        setLegendList();
        
//        var pinging = [];
//        var pinging_link = [];

        var w = 300, //start dimensions
            h = 300,
            lw = 0, 
            lh = 0;

        var zoom = d3.behavior.zoom()
            .scale(100)
            .scaleExtent([-500, 10000])
            .on("zoom", zoomed);

        var force = d3.layout.force()
            .linkDistance(10)
            .linkStrength(1)
            .distance(0)
            .charge(-200)
            .gravity(0.1)
            .friction(0.8)
            .theta(0.5)
            .size([w, h]);
//            .on("tick", tick);


/*        var force = d3.layout.force()
            .linkDistance(vm.node_params()["linkDistance"].value())
//            .linkStrength(vm.node_params()["linkStrength"].value())
            .distance(vm.node_params()["distance"].value())
            .charge(vm.node_params()["charge"].value())
            .gravity(vm.node_params()["gravity"].value())
            .friction(vm.node_params()["friction"].value())
            .theta(vm.node_params()["theta"].value())
            .size([w, h]);
//            .on("tick", tick);
*/

        var x = d3.scale.identity().domain([0, w])
        var y = d3.scale.identity().domain([0, h])

        var svg = d3.select(selectString)
            .attr("tabindex", 1)
            .each(function() { this.focus(); })        
            .append("svg")
            .attr("width", 350)
            .attr("height", 300)
            .call(zoom);
        
        var link = svg.append("g")
                      .attr("class", "links")
                      .selectAll(".link");
                        
        var node = svg.append("g")
                        .attr("class", "nodes")
                        .selectAll(".node");


//        updateWindow();
//        window.onresize = updateWindow;
/*
        function keyflip_down() {
            shiftKey = d3.event.shiftKey || d3.event.metaKey;
        }

        function keyflip_up() {
            shiftKey = d3.event.shiftKey || d3.event.metaKey;
            vm.doFacetSearch();
        }
*/
/*
        function updateWindow(){
            w = window.innerWidth || window.documentElement.clientWidth || window.getElementsByTagName('body')[0].clientWidth;
            h = window.innerHeight|| window.documentElement.clientHeight|| window.getElementsByTagName('body')[0].clientHeight;
            x.domain([0, w]);
            y.domain([0, h]); //reset the domains for the selectionbox
            svg.attr("width", w).attr("height", h); //reset the main svg
        }
*/
        function zoomed() {
            vm.node_params()["gravity"].value(Math.min((d3.event.scale + 600)/6000), 0.2);
            vm.node_params()["charge"].value(-(d3.event.scale));
            vm.node_params.valueHasMutated();
        }

        function ping_link(){
            if (pinging_link.length > 0){
                var link_ping = svg.selectAll("line.ping").data(pinging_link)
                    .enter().append("svg:line", "g")
                    .classed("ping", true)
                    .attr("x1", function(d) { return Math.max(0, Math.min(w, d.source.x)); })
                    .attr("y1", function(d) { return Math.max(20, Math.min(h, d.source.y)); })
                    .attr("x2", function(d) { return Math.max(0, Math.min(w, d.target.x)); })
                    .attr("y2", function(d) { return Math.max(20, Math.min(h, d.target.y)); })
                    .style("stroke-width", stroke_width);
                link_ping.transition().duration(600)
                    .ease("quad-out")
                    .style("stroke-width", 40)
                    .style("stroke-opacity", 0.1)
                    .remove();
                setTimeout(ping_link, 1600);
            }
        }

        function ping() {
            if (pinging.length > 0) {
        		var pings = svg.selectAll("circle.ping").data(pinging)
        			.enter().append("svg:circle", "g")
        			.classed("ping", true)
        			.attr("cx", function(d) { return d.x; })
        			.attr("cy", function(d) { return d.y; })
        			.attr("r", 20);
        		pings.transition().duration(600)
        			.ease("quad-out")
        			.attr("r", 60)
        			.style("stroke-opacity", 0.1)
        			.style("stroke-width", 0.5)
        			.remove();
        		setTimeout(ping, 1600);
        	}
	    }

        function stroke_width(d){
            if (vm.links_same_size()){
                return vm.links_width();
            }
            else {
                return (vm.links_width()/10) * Math.max(d.score, 1.0) || 3;
            }
        }
    
        function node_size(d){
            if (vm.nodes_same_size()){
                return vm.nodes_size();
            }
            else {
                return (vm.nodes_size()/10) * Math.min(Math.max(Math.sqrt(d.text_length), 10), vm.max_nodes_size()) || 5;
            }
        }

        function node_size_mouse_over(d){
            if (vm.nodes_same_size()){
                return vm.nodes_size();
            }
            else {
                return (vm.nodes_size()/8) * Math.min(Math.max(Math.sqrt(d.text_length), 15), vm.max_nodes_size()) || 12;
            }
        }

        function node_class(d) {
            var re = /[ \(\)\<\>?\.,-]/g;
            if (vm.selectedLegendOptionValue() == "subgenre"){
                return (d.subgenre ? "node " + legend_colors[vm.selectedLegendOptionValue()][d.subgenre].class_code : "node other");
//                return (d.subgenre ? "node " + d.subgenre[0].replace(re, "_") : "node other");
            }
            else if (vm.selectedLegendOptionValue() == "type"){
                return (d.type ? "node " + legend_colors[vm.selectedLegendOptionValue()][d.type[0]].class_code : "node other");
            }
            else if (vm.selectedLegendOptionValue() == "item_type"){
                return (d.item_type ? "node " + legend_colors[vm.selectedLegendOptionValue()][d.item_type].class_code : "node other");
            }
            else if (vm.selectedLegendOptionValue() == "literary"){
                return (d.literary ? "node " + legend_colors[vm.selectedLegendOptionValue()][d.literary].class_code : "node other");
            }
            else if (vm.selectedLegendOptionValue() == "extreme"){
                return (d.extreme ? "node " + legend_colors[vm.selectedLegendOptionValue()][d.extreme].class_code : "node other");
            }
            else if (vm.selectedLegendOptionValue() == "language"){
                return (d.language ? "node " + legend_colors[vm.selectedLegendOptionValue()][d.language[0]].class_code : "node other");
            }
            else if (vm.selectedLegendOptionValue() == "text_length_group"){
                return (d.text_length_group ? "node " + legend_colors[vm.selectedLegendOptionValue()][d.text_length_group].class_code : "node other");
            }
            else return "node other"; //none
        }
        
        function node_text(d) {
            //make this react to metadata show choice in index
            if (vm.info_in_node()){
//                return "<a target=\"folktale\" href=\"http://www.verhalenbank.nl/items/show/" + d.id + "\">" + (d.language ? d.language : "") + " " + (d.subgenre ? d.subgenre : "") + "</a>";
                return (d.language ? d.language : "") + " " + (d.subgenre ? d.subgenre : ""); 
            }
            if (vm.title_in_node()){
                return (d.title ? d.title : ""); 
            }
            if (vm.id_in_node()){
                return (d.identifier ? d.identifier : ""); 
            }
            if (vm.genre_in_node()){
                return (d.subgenre ? d.subgenre : ""); 
            }
            else{
                return "";
            }
        }

        function stroke_color(d){
            if (vm.link_colors_by_score_strength()){
                color_return = d3.hsl(d.score, d.score / 10, (1 - d.score / 40) - 0.2).toString();
            }
            else {
                color_return = "#9ecae1";
            }
            return color_return;
        }

        function node_color(d) {
            var re = /[ \(\)\<\>?\.,-]/g;
            if (vm.selectedLegendOptionValue() == "subgenre"){
                if (d.subgenre){
//                    console.log(legend_colors[vm.selectedLegendOptionValue()][d.subgenre]);
                    return legend_colors[vm.selectedLegendOptionValue()][d.subgenre].color;
                }
            }
            if (vm.selectedLegendOptionValue() == "type"){
                if (d.type){
                    return legend_colors[vm.selectedLegendOptionValue()][d.type].color;
                }
            }
            if (vm.selectedLegendOptionValue() == "item_type"){
                if (d.item_type){
                    console.log(d.item_type);
                    return legend_colors[vm.selectedLegendOptionValue()][d.item_type].color;
                }
            }
            if (vm.selectedLegendOptionValue() == "literary"){
                if (d.literary){
                    return legend_colors[vm.selectedLegendOptionValue()][d.literary].color;
                }
            }
            if (vm.selectedLegendOptionValue() == "extreme"){
                if (d.extreme){
                    return legend_colors[vm.selectedLegendOptionValue()][d.extreme].color;
                }
            }
            if (vm.selectedLegendOptionValue() == "language"){
                if (d.language){
                    return legend_colors[vm.selectedLegendOptionValue()][d.language[0]].color;
                }
            }
            if (vm.selectedLegendOptionValue() == "text_length_group"){
                if (d.text_length_group){
                    return legend_colors[vm.selectedLegendOptionValue()][d.text_length_group].color;
                }
            }
            return subgenre_colors["none"]; //none
        }

        function update() {
            
            var graph = vm.network_graph();

            // Restart the force layout.
            force.nodes(graph.nodes)
                .links(graph.links)
                .start();

            force.linkStrength(function(link) {
                    return link.score / 15;
                });

            force_drag = force.drag().on("dragstart", dragstart); //interferes with doubleclick!! AARGGH

            // Update links.
            link = link.data(graph.links);

            link.exit().transition().remove();

            link.transition()
/*                .attr("opacity", function(d) { 
                    return Math.max(d.score, 1.0) * 0.2;
                })*/
                .attr("stroke-width", stroke_width)
                .attr("stroke", stroke_color);

            link.enter()
                .append("line", ".node")
                .attr("class", "link")
/*                .attr("opacity", function(d) { 
                    return Math.max(d.score, 1.0) * 0.15;
                })*/
                .attr("stroke-width", stroke_width)
                .attr("stroke", stroke_color);
                
            link.on("mouseover", function(d){
                    d3.select(this)
                        .transition()
                        .ease("elastic")
                        .attr("opacity", 1)
                        .attr("stroke", "orange")
                        .attr("stroke-width", function(d) { 
                            return Math.max(d.score, 5.0) * 2;
                        });
                        
                })
                .on("mouseout", function(d){
                    d3.select(this)
                        .transition()
                        .ease("elastic")
/*                        .attr("opacity", function(d) { 
                            return Math.max(d.score, 1.0) * 0.2;
                        })*/
                        .attr("stroke-width", stroke_width)
                        .attr("stroke", stroke_color);
                })
                .on("click", left_click_link)
                .on("dblclick", remove_link_click);
                    
            // Update nodes.
            node = node.data(graph.nodes);

            node.exit()
                .transition()
                .delay(400)
                .duration(1000)
                .select("circle")
                .attr("r", 1)
                .remove();
            
            node.exit()
                .transition()
                .delay(1000)
                .remove();

            var nodeEnter = node.enter()
                .append("g")
                .attr("class", node_class) //determine color based on genre
                .on("click", left_click_node_wait)
                .on("contextmenu", context_menu)
                .on("dblclick", dbl_click)
                .call(force_drag);
            
            nodeEnter
                .append("circle")
                .attr("r", node_size);

            nodeEnter.append("text")
                .attr("dy", ".35em")
                .text(node_text); //html no function with transition?
//                .html(function(d) { return d.identifier + (d.title ? ": " + d.title : ""); });
            
            node.transition()
                .attr("class", node_class);
            
            node.select("circle").transition()
                .attr("r", node_size);

            node.select("text").transition()
                .text(node_text); //html no function with transition?
            
            node.select("circle")
                .style("fill", node_color)
                .on("mouseover", function(d){
                    d3.select(this)
                        .transition()
                        .ease("elastic")
                        .attr("r", node_size_mouse_over);
                })
                .on("mouseout", function(d){
                    d3.select(this)
                        .transition()
                        .ease("elastic")
                        .attr("r", node_size);
                });
                
                  
//#########################################################

            force.on("tick", function() {

                node.attr("transform", function(d) { 
                    return "translate(" + Math.max(0, Math.min(w+50, d.x)) + "," + Math.max(20, Math.min(h-20, d.y)) + ")"; });

                link.attr("x1", function(d) { return Math.max(0, Math.min(w+50, d.source.x)); })
                    .attr("y1", function(d) { return Math.max(20, Math.min(h, d.source.y)); })
                    .attr("x2", function(d) { return Math.max(0, Math.min(w+50, d.target.x)); })
                    .attr("y2", function(d) { return Math.max(20, Math.min(h, d.target.y)); });
            //  faster but not so good.
/*                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });*/
            });
        }

        function right_click_node(item_data, index) {
            //handle right click
            console.log("right_clicking: " + index);
            //stop showing browser menu            
            d3.event.preventDefault();
//            dragstop(item_data);
//            vm.removeNode(index);
         }

        function collect_neighbors(d){
//            console.log(d);
            vm.doNeighborSearch(d);
            // tell VM to retrieve more nodes to attach to the tree
        }

        //removing links?
        function remove_link_click() {
            
        }

        // Toggle children on click.
        function left_click_link(item_data) {
            d3.event.preventDefault();
            console.log(item_data);
            
            var even = true;
            
            //make link ping, not nodes
/*
            pinging[0] = item_data.source;
            pinging[1] = item_data.target;
            ping();
            pinging_link[0] = item_data
            ping_link();
*/            
            var list = d3.select("#tabs-1");
            
            list.selectAll("li").remove();
            
            list.append("li")
                .attr("class", "linkTypeLabel")
                .html("<b>Score:</b> " + item_data.score);
            
            $.each(vm.metadatas_to_query(), function(metaindex, metavalue){
                even = !even;
                var print_this = [];
                if ((item_data["source"][metavalue.key]) || (item_data["target"][metavalue.key])){
                    same = [];
                    source = [];
                    target = [];
                    if (item_data["source"][metavalue.key] instanceof Array && item_data["target"][metavalue.key] instanceof Array){
                        source = jQuery.extend(true, [], item_data["source"][metavalue.key]);
                        target = jQuery.extend(true, [], item_data["target"][metavalue.key]);
                        for (item_s in item_data["source"][metavalue.key]){
                            for (item_t in item_data["target"][metavalue.key]){
                                if (item_data["source"][metavalue.key][item_s] == item_data["target"][metavalue.key][item_t]){
                                    same.push(item_data["source"][metavalue.key][item_s]);
                                    source.splice($.inArray(item_data["source"][metavalue.key][item_s], source), 1);
                                    target.splice($.inArray(item_data["target"][metavalue.key][item_t], target), 1);
                                }
                            }
                        }
                    }
                    else{
                        if (item_data["source"][metavalue.key] == item_data["target"][metavalue.key]){
                            same.push(item_data["source"][metavalue.key]);
                        }
                        else{
                            source.push(item_data["source"][metavalue.key]);
                            target.push(item_data["target"][metavalue.key]);
                        }
                    }
                    print_this = "<b>" + metavalue.key + ":</b>"
                    if (same.length > 0){   print_this += " <p style=\"color:green\">" + same.join(" | ") + "</p><hr>"; }
                    if (source.length > 0){ print_this += "<p style=\"color:red\">" + source.join(" | ") + "</p>"; }
                    if (target.length > 0){ print_this += "<hr><p style=\"color:red\">" + target.join(" | ") + "</p><hr>"; }
                    list.append("li")
                        .attr("class", "linkTypeLabel")
                        .html(print_this);
                }
            });
        }

        // Toggle children on click.
        function left_click_node(item_data) {

/*            pinging_link = [];
            pinging = [];
            pinging[0] = item_data;
            
            ping();
*/            
            var list = d3.select("#tabs-1");
            
            list.selectAll("li").remove();

            list.append("li").attr("class", "linkTypeLabel").html("<b>calculate all links: <button>" + item_data.id + "</button>");
            
            list.append("li").attr("class", "linkTypeLabel").html("<button class=\"cons_search_button\">New search</button>");

            list.append("li").attr("class", "linkTypeLabel").html("<b>URL: </b> " + "<a target=\"folktale\" href=\"http://www.verhalenbank.nl/items/show/" + item_data.id + "\">" + item_data.id + " - " + item_data.identifier + " - " + item_data.title + "</a>");
            
            d3.select('.cons_search_button')
                .on('click', function() {
                    vm.ConsSearch(item_data.id);
            });
            
            var even = true;

            for (meta in vm.metadatas_to_show()){
//            for (meta in item_data){
                even = !even;
                meta = vm.metadatas_to_show()[meta];
                print_this = "";
                if (!item_data[meta]){
                     print_this = "<b style='text-decoration: line-through;'>" + meta + "</b>";
                }
                else if (item_data[meta] instanceof Array){
                    print_this = "<b>" + meta + ":</b> " + item_data[meta].join(" | ");
                }
                else{
                    print_this = "<b>" + meta + ":</b> " + item_data[meta];
                }
                list.append("li")
                    .attr("class", "linkTypeLabel")
                    .style("background-color", function(){
                        if (even) { return "white"; }
                        else { return "lightgray"; }
                    })
                    .html(print_this);
            }
        }

        function left_click_node_wait(d){
            if (d3.event.defaultPrevented) return; // click suppressed
            if (!d.selected){
                d3.selectAll("text").attr("text-decoration", "null");
                d3.select(this).select("text")
                    .attr("text-decoration", "underline");
            }
            if (d.selected){
                window.open("http://www.verhalenbank.nl/items/show/" + d.id, '_blank', '');
                d3.select(this).classed("visited", true);
/*                console.log("selected");
                d3.select(this)
                .append("text")
                   .attr("text-anchor", "left")
                   .append("a")
                   .attr("target", "_blank") //set the link to open in an unnamed tab
                    .attr("xlink:show", "new")
                    .attr("xlink:href", function(d) {return "http://www.verhalenbank.nl/items/show/" + d.id})
                    .text(function (d) {
                              return (d.language ? d.language : "") + " " + (d.subgenre ? d.subgenre : ""); //link text content
                          });
//                .append("li").attr("class", "linkTypeLabel").html("<a target=\"folktale\" href=\"http://www.verhalenbank.nl/items/show/" + d.id + "\">" + (d.language ? d.language : "") + " " + (d.subgenre ? d.subgenre : "") + "</a>");
*/
            }
            if (d.fixed) d3.select(this).classed("fixed", d.fixed = false);
            else d3.select(this).classed("fixed", d.fixed = true);
            
            node.classed("selected", function(p) {
                return p.selected = d === p; 
            });
            
            setTimeout(function(){
//                left_click_node(d)
            }, 200);
        }

        function dbl_click(d) {
            console.log("dblclick");
            d3.event.preventDefault();
//            d3.select(this).classed("fixed", d.fixed = false);
        }

        function context_menu(d) {
            d3.event.preventDefault();
            d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragstart(d) {
//            d3.event.preventDefault();
            console.log("dragstart");
            d3.select(this).classed("fixed", d.fixed = true);
        }

        function setParents(d, p){
            d._parent = p;
            if (d.children) {
                d.children.forEach(function(e){ setParents(e,d);});
            } else if (d._children) {
                d._children.forEach(function(e){ setParents(e,d);});
            }
        }

        function setLegendList() {
            d3.select("#legendList").selectAll("li").remove();
            
            var list = d3.select("#legendList").selectAll("li")
                .data(d3.entries(vm.legend_colors()[vm.selectedLegendOptionValue()]))
                .enter().append("li")
                .style("background-color", function(d) {
                    return d.value.color;
                })
                .html(function(d) { 
                    return "<b>" + d.key + "</b>";
                })
                .on("mouseover", function(d){
                    d3.selectAll("." + legend_colors[vm.selectedLegendOptionValue()][d.key].class_code).select("circle")
//                    d3.selectAll("." + d.key.replace(re, "_")).select("circle")
                        .transition()
                        .ease("elastic")
                        .style("stroke-width", 8)
                        .style("stroke", "#64FE2E");
                })
                .on("mouseout", function(d){
                    d3.selectAll("." + legend_colors[vm.selectedLegendOptionValue()][d.key].class_code).select("circle")
                        .transition()
                        .ease("elastic")
                        .style("stroke-width", 1.5)
                        .style("stroke", null);
                });
        }


        vm.node_params.subscribe( function(){
            force.linkDistance(vm.node_params()["linkDistance"].value())
//                .(vm.node_params()["linkStrength"].value())
                .distance(vm.node_params()["distance"].value())
                .charge(vm.node_params()["charge"].value())
                .gravity(vm.node_params()["gravity"].value())
                .friction(vm.node_params()["friction"].value())
                .theta(vm.node_params()["theta"].value())
                .size([w, h]);
            force.start();
            
        });

        vm.link_colors_by_score_strength.subscribe( function (){
            update();
        });

        vm.nodes_same_size.subscribe( function (){
            update();
        });

        vm.links_same_size.subscribe( function (){
            update();
        });

        vm.network_graph.subscribe( function (){
            update();
            force.start()
        });

        vm.title_in_node.subscribe( function (){
            update();
        });
        vm.info_in_node.subscribe( function (){
            update();
        });
        vm.genre_in_node.subscribe( function (){
            update();
        });

        vm.genre_in_node.subscribe( function (){
            update();
        });

        vm.nodes_size.subscribe( function (){
            update();
        });

        vm.links_width.subscribe( function (){
            update();
        });

        vm.metadatas_to_query()[0].selected.subscribe( function (){
            console.log("UPTED");
        });

        vm.selectedLegendOptionValue.subscribe( function (){
            update();
//            setLegendList();
        });
        

    }
}