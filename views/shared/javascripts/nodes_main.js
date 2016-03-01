var metadatas_to_query = [  {key: "title",          score_value: 1,     selected: false},
                            {key: "subject",        score_value: 20,     selected: true},
                            {key: "creator",	    score_value: 1,     selected: false},
                            {key: "contributor",	score_value: 1,     selected: false},
                            {key: "collector",	    score_value: 1,     selected: false},
                            {key: "language",	    score_value: 1,     selected: false},
                            {key: "source",	        score_value: 1,     selected: false},
                            {key: "date",	        score_value: 1,     selected: false},
                            {key: "format",	        score_value: 1,     selected: false},
                            {key: "type",	        score_value: 1,     selected: false},
                            {key: "subgenre",	    score_value: 1,     selected: true},
                            {key: "motif",	        score_value: 1,     selected: true},
                            {key: "literary",	    score_value: 1,     selected: true},
                            {key: "extreme",	    score_value: 1,     selected: true},
                            {key: "named_entity",	score_value: 1,     selected: true},
                            {key: "named_entity_location",	score_value: 1,     selected: true},
                            {key: "place_of_action",   score_value: 1,     selected: true},
                            {key: "corpus",	        score_value: 1,     selected: false},
                            {key: "word_count",	    score_value: 1,     selected: false},      //NEW
                            {key: "word_count_group",   score_value: 1,     selected: false},      //NEW
                            {key: "tag",            score_value: 0.7,     selected: true},
                            {key: "location",	    score_value: 1,     selected: false},
                            {key: "sublocality",	score_value: 1,     selected: false},
                            {key: "locality",	    score_value: 1,     selected: false},
                            {key: "administrative_area_level_1",	score_value: 1,     selected: false},
                            {key: "administrative_area_level_2",	score_value: 1,     selected: false},
                            {key: "administrative_area_level_3",	score_value: 1,     selected: false},
                            {key: "country",        score_value: 1,     selected: false},
                            {key: "main_text",           score_value: 1,     selected: false}
                        ];


function makeid(n){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function array_color_generator_darker(arrr, base_color){
    var re = /[ \(\)\<\>?\.,-]/g;
    color = d3.rgb(base_color);
    group_colors = {};
    for (param in arrr){
        group_colors[arrr[param]] = {class_code: makeid(8), color: color.toString()};
        color = color.darker(0.5);
    }
    return group_colors;
}

function array_color_generator(arr){
    scale_one = d3.scale.category20();
    group_colors = {};
    i = 0;
    for (param in arr){
        i++;
        if (i>=38){
            group_colors[arr[param]] = {class_code: makeid(8), color: d3.rgb(scale_one(i)).darker().toString()};
        }
        else if (i>=19){
            group_colors[arr[param]] = {class_code: makeid(8), color: d3.rgb(scale_one(i)).brighter().toString()};
        }
        else{
            group_colors[arr[param]] = {class_code: makeid(8), color: d3.rgb(scale_one(i)).toString()};
        }
    };
    return group_colors;
}

word_count_groups =["<25",
                    "25-100",
                    "100-250",
                    "250-500",
                    "500-1000",
                    ">1000",
                    "other"];

word_count_group_colors = array_color_generator_darker(word_count_groups, "orangered");

languages = ["Standaardnederlands",
            "Fries (Woudfries)",
            "17e-eeuws Nederlands",
            "Gronings",
            "Fries (woudfries)",
            "Vlaams",
            "Middelnederlands",
            "Noord-Brabants",
            "Fries",
            "Gendts (Achterhoeks)",
            "Brabants",
            "Liemers",
            "Engels",
            "Zuid-Hollands",
            "Waterlands",
            "Drents",
            "Utrechts",
            "Zeeuws",
            "Liempds",
            "Overijssels",
            "Limburgs",
            "Duits",
            "n.v.t.",
            "Standaardnederlands (allochtoon)",
            "Dordts",
            "Latijn",
            "Frans",
            "18e-eeuws Nederlands",
            "Gelders",
            "Alblasserwaards",
            "Helmonds",
            "Turks",
            "Ambachts",
            "Bleskensgraafs",
            "Rijsoords",
            "Brandwijks",
            "Bergambachts",
            "Noord-Hollands",
            "Marokkaans_Berbers",
            "Heenvliets",
            "Twents",
            "Marokkaans",
            "Engels (Amerikaans)",
            "Arabisch",
            "Capels",
            "Nedersaksisch",
            "Zaans",
            "Barendrechts",
            "Marokkaans Arabisch",
            "Spaans",
            "Hoeksewaards",
            "Amsterdams",
            "Gouderaks",
            "Mijnsheerenlands",
            "Hoornaars",
            "Slikkerveers",
            "Italiaans",
            "Nederlands, Brabants",
            "Nederlands-Indisch",
            "Simonshavens",
            "Sliedrechts",
            "Veluws",
            "Deens",
            "Surinaams",
            "Antwerps",
            "15e-eeuws Nederlands",
            "dialect",
            "16e-eeuws Nederlands",
            "'s-Gravendeels",
            "quasi-Arabisch",
            "pseudo-Duits",
            "Zuid-Afrikaans",
            "Heicops",
            "Indonesisch",
            "Sranan Tongo",
            "Hekelings",
            "Brabants?",
            "Sallands",
            "Rockanjes",
            "Arkels",
            "Oud-Grieks",
            "Noordbrabants",
            "Korendijks",
            "Nieuwlands",
            "Lexmonds",
            "jongerentaal",
            "jiddisch",
            "Lekkerlands",
            "Zweeds",
            "Zuidafrikaans",
            "Lekkerkerks",
            "Latijn (potjeslatijn)",
            "Zuid-Beijerlands",
            "Krimpens",
            "ZEEUWS",
            "Wijngaards",
            "Westfries",
            "Joods-Amsterdams",
            "Deventers",
            "Westfaals",
            "Waals",
            "Vlaams accent",
            "Valkenburgs",
            "Hoogduits",
            "Tsjechisch",
            "Tilburgs",
            "Bunschoten-Spakenburgs",
            "Aalsmeers",
            "Schiermonnikoogs",
            "Gulpens",
            "Piershils",
            "Oud-Beijerlands",
            "Goerees",
            "Nijmeegs (Gelders)",
            "Brab ants",
            "Amersfoorts",
            "Nederduits?",
            "Nederduits",
            "Moluks",
            "Zuidlands",
            "Frans_(uitdrukking)",
            "bargoens",
            "Barnevelds",
            "Middelnederlands?",
            "quasi-allochtoon Nederlands",
            "Flakkees",
            "quasi-Marokkaans",
            "quasi-Haags",
            "quasi-Engels",
            "quasi-Duits",
            "pseudo-Latijn",
            "Engels (Canadees)",
            "Bargoens",
            "quasi-Marrokaans",
            "Afrikaans",
            "17e-eeuws Nederlands?",
            "other"];

language_colors = array_color_generator(languages);

types = ["almanak",
        "artikel",
        "boek",
        "brief",
        "cd",
        "centsprent",
        "drama",
        "e-mail",
        "elpee",
        "fax",
        "handschrift",
        "internet",
        "kluchtboek",
        "krant",
        "manuscript",
        "lp",
        "mondeling",
        "televisie",
        "tijdschriftartikel",
        "vragenlijst",
        "informatiebord",
        "other"];

type_colors = array_color_generator(types);

subgenres = ["broodjeaapverhaal",
                "sprookje",
                "mop",
                "sage",
                "raadsel",
                "personal narrative",
                "legende",
                "exempel",
                "mythe",
                "lied",
                "kwispel",
                "personal",
                "other"];

subgenre_colors = array_color_generator(subgenres);

item_types = [  "Volksverhaal",
                "Volksverhaaltype",
                "Lexicon item",
                "Persoon",
                "other" ];
item_type_colors = array_color_generator(item_types);

extreme_colors = { "ja": {class_code: "ABCDEFGH", color: "#FF0000"},
                    "nee": {class_code: "BCDEFGHI", color: "#00FF00"},
                    "ja (bewerkt)": {class_code: "CDEFGHIJ", color: "#FFAAAA"},
                    "nee (bewerkt)": {class_code: "DEFGHIJK", color: "#AAFFAA"},
                    "other": {class_code: "EFGHIJKL", color: "#FFFFE0"}};

literary_colors = { "ja": {class_code: "XABCDEFGH", color: "#FF0000"},
                    "nee": {class_code: "XBCDEFGHI", color: "#00FF00"},
                    "ja (bewerkt)": {class_code: "XCDEFGHIJ", color: "#FFAAAA"},
                    "nee (bewerkt)": {class_code: "XDEFGHIJK", color: "#AAFFAA"},
                    "other": {class_code: "XEFGHIJKL", color: "#FFFFE0"}};

legendOptionValues = ["subgenre", "type", "language", "literary", "extreme", "word_count_group", "item_type"];
selectedLegendOptionValue = ["subgenre"];

legend_colors = {"subgenre":        subgenre_colors, 
                "type":             type_colors, 
                "language":         language_colors, 
                "literary":         literary_colors, 
                "extreme":          extreme_colors, 
                "word_count_group": word_count_groups,
                "item_type":        item_type_colors};

///this should all be generated on the fly, with the languages present in the retrieved set of items

//var initial_id_search = "19199"; //nederlandermop

//var id_search_query = item_id;

//var id_search_command = id_search_proxy + id_search_query;

var id_search_command = "";

var vb_search_link = "";

var solr_search_command = "";

var network_graph = {"nodes" : [], "links": []};
var network_nodes = [];
var network_links = [];
var network_special_links = [];

var interconnect_minimum_score = 1.0; //solr score
var max_nodes_size = 25;
var max_nodes_to_load = 800;

var max_neighbor_results = 55;
var min_neighbor_score = 1.1;

//some view settings
var links_same_size = false;
var links_width = 18;

var nodes_same_size = false;
var nodes_size = 12;

var info_in_node = true;
var title_in_node = false;
var genre_in_node = false;
var id_in_node = false;

var link_colors_by_score_strength = true;

var node_params = {
    charge: { min: -10000, max: 500, step: 5, value: -200 },
    linkDistance: { min: 0, max: 100, step: 5, value: 50 },
    distance: { min: 0, max: 1000, step: 5, value: 50 },
    linkStrength: { min: 0, max: 1, step: 0.05, value: 1 },
    gravity: { min: -0.0, max: 0.8, step: 0.01, value: 0.04 },
    friction: { min: 0, max: 1, step: 0.05, value: 0.8 },
    theta: { min: 0, max: 1, step: 0.05, value: 0.5 },
};

function ViewModel(item_id, search_proxy) {
    
//    console.log("viewmodel started!");
//    console.log(item_id);
    
    var self = this;
    
    self.search_proxy = ko.observable(search_proxy);
    
    //view settings
    self.interconnect_minimum_score = ko.observable(interconnect_minimum_score);

    self.link_colors_by_score_strength = ko.observable(link_colors_by_score_strength);
    self.links_same_size = ko.observable(links_same_size);
    self.nodes_same_size = ko.observable(nodes_same_size); //if false, size according to word_count. if number, node size

    self.title_in_node = ko.observable(title_in_node);
    self.id_in_node = ko.observable(id_in_node);
    self.genre_in_node = ko.observable(genre_in_node);
    self.info_in_node = ko.observable(info_in_node);
    
    self.links_width = ko.observable(links_width);
    self.nodes_size = ko.observable(nodes_size);
    self.max_nodes_size = ko.observable(max_nodes_size);

    self.selectedLegendOptionValue = ko.observableArray(selectedLegendOptionValue);

    self.legend_colors = ko.observable(legend_colors);

    self.node_params = ko.observable(node_params);

    for (param in self.node_params()){
//        console.log(param);
        self.node_params()[param].value = ko.observable(self.node_params()[param].value);
    }; //replace all values with observables

    //data settings
    ko.utils.arrayForEach(metadatas_to_query, function(select) {
        select.selected = ko.observable(select.selected);
        select.score_value = ko.observable(select.score_value);
    }); //replace all selected with observables

    self.metadatas_to_query = ko.observable(metadatas_to_query);

    self.subgenre_colors = ko.observable(subgenre_colors);

    //observable arrays for containing search/browse results
    self.facets_results = ko.observableArray([]);
    self.id_search_result = ko.observableArray([]);
    self.neighbor_search_results = ko.observableArray([]);
    
    self.network_graph = ko.observable(network_graph); //use this one for full refresh
    self.network_special_links = ko.observableArray([]);

    self.max_nodes_to_load = ko.observable(max_nodes_to_load); //set in app. danger for overload

    //queries
    self.vb_search_link = ko.observable(vb_search_link);
    self.solr_search_command = ko.observable(solr_search_command);
    
    self.id_search_query = ko.observable(item_id);
    self.id_search_command = ko.observable(id_search_command);

    self.neighbor_search_query = ko.observable("");
    
    self.facet_search_query = ko.observable("");

    self.max_neighbor_results = ko.observable(max_neighbor_results);
    self.min_neighbor_score = ko.observable(min_neighbor_score);
    
    //internal check variables
    
    self.neighborsExpand = function(item){
        NeighborNeighbor(1, self.max_neighbor_results(), self.min_neighbor_score(), self);
    };

    self.neighborsExpandSelected = function(item){
        NeighborNeighborSelected(1, self.max_neighbor_results(), self.min_neighbor_score(), self);
    };


    self.doNeighborSearch = function(item){
//        console.log(item);
        NeighborSearch(item, self.max_neighbor_results(), self.min_neighbor_score(), self);
    };
    
    self.connectNeighbors = function(item){
        setTimeout(function(){
            ConnectNeighbors(self)
//            ConnectNeighborsEXPENSIVE(self) //exhaustive search
        }, 200);
        setTimeout(function(){
        }, self.network_graph()["nodes"].length * 40);
        
    };

    self.ConsSearch = function (id) {
        self.clearData();
        self.id_search_query(id);
        self.doIdSearch();
    };

    self.doSolrSearch = function () {
        self.clearData();
        
        var collection = "collection_id:1";
        var return_fields = "fl=modelid,identifier";
        
        var args = {collection_id : 1,
                    fl : "modelid,identifier",
                    q : self.solr_search_command(),
                    "rows": self.max_nodes_to_load()
                    }
        
        search_these = get_solr_id_list(solr_search_proxy, args);
        
        self.id_search_query(search_these);

        self.doIdSearch();
    };

    self.doIdSearch = function () {
//        console.log(self.id_search_query());
        
        self.clearData();
        ids = self.id_search_query().split(/,[ \n]*/);
        for (id in ids){
            var arguments = {
                "fl": "score,*",
                "q": "modelid:" + ids[id],
                "rows": self.max_nodes_to_load()
            };
            setTimeout(UpdateNetworkDataPOST(search_proxy, arguments , true, self), 500);
        }
    };

    self.updateLegendInfo = function (){
        legend_colors = self.legend_colors();
        var subjects = []; //get the subjects from the data
        legend_colors["Subject"] = array_color_generator(subjects);
        self.legend_colors(legend_colors);
    }

    self.doIdAdd = function () {
//        console.log("searching id number");
        UpdateNetworkData(search_proxy + self.id_search_query(), true, self);
    };

    self.emptySolrSearchbox = function(){
        self.vb_search_link("");
    };

    self.emptyVBSearchbox = function(){
        self.vb_search_link("");
    };
    
    self.emptySearchbox = function(){
        self.id_search_query("");
    };

    self.searchKeyboardCmdVB = function (data, event) {
        if (event.keyCode == 13) self.doVBSearch();
        return true;
    };

    self.searchKeyboardCmdSolR = function (data, event) {
        if (event.keyCode == 13) self.doSolrSearch();
        return true;
    };

    self.searchKeyboardCmd = function (data, event) {
        if (event.keyCode == 13) self.doIdSearch();
        return true;
    };
    
    self.clearData = function (){
        self.network_graph({"nodes": [], "links": []});
        self.network_special_links([]);
    };
    
    self.all_checked = ko.computed({
        read: function() {
        },
        write: function(value) {
            ko.utils.arrayForEach(self.metadatas_to_query(), function(item) {
                item.selected(value);
            });
        }
    });
    
    self.location_checked = ko.computed({
        read: function() {
        },
        write: function(value) {
            location_metas = ["locality"];
            ko.utils.arrayForEach(self.metadatas_to_query(), function(item) {
                if (jQuery.inArray(item.key, location_metas)){ 
                    item.selected(true);
                }
            });
        }
    });
    
    self.content_checked = ko.computed({
        read: function() {
        },
        write: function(value) {
            ko.utils.arrayForEach(self.metadatas_to_query(), function(item) {
                item.selected(value);
            });
        }
    });
    
    self.involved_checked = ko.computed({
        read: function() {
        },
        write: function(value) {
            ko.utils.arrayForEach(self.metadatas_to_query(), function(item) {
                item.selected(value);
            });
        }
    });
    
};


function removeLinks(item, vm){
//    console.log("removing links: " + item.node_id);
    for (link in vm.network_graph().links){
//        console.log(vm.network_graph().links[link]);
        if ((vm.network_graph().links[link].source.modelid == item.modelid) || (vm.network_graph().links[link].target.modelid == item.modelid)) {
            vm.network_graph().links.splice(link, 1);
        }
    }
}

function get_solr_id_list(url, solr_params){
    var search_ids = [];
    var search_string = "";
    jQuery.ajax({
        url: url,
        data: solr_params,
        async: false, // meh
        dataType: "json",
        success: function(response) {
            if (response.response.docs.length > 0){ //if there is a response
                found_nodes = response.response.docs;
                for (node in found_nodes){
                    search_ids.push(found_nodes[node].modelid);
                }
                search_string = search_ids.join(",");
            }
        },
    });
    return search_string;
}

function search(_for, _in) {
    var r;
    for (var p in _in) {
        if ( p === _for ) {
            return _in[p];
        }
        if ( typeof _in[p] === 'object' ) {
            if ( (r = search(_for, _in[p])) !== null ) {
                return r;
            }
        }
    }
    return null;
}

function search_id(needle, haystack) {
    // iterate over each element in the array
    if (haystack.modelid == needle){ //start at the root
        // we found it
        return haystack;
    }
    for (var child in haystack.children){
        // look for the entry with a matching `code` value
//        console.log(haystack.children[child].modelid);
        if (haystack.children[child].modelid == needle){
            // we found it
            return haystack.children[child];
        }      
        if (haystack.children[child].children) {
            if ( (r = search(needle, haystack.children[child])) !== null ) {
                return r;
            }
        }
    }
//    console.log(needle + " not found");
    return null; //nope
}

function NeighborNeighborSelected(n, max_neighbor_results, min_neighbor_score, vm){
    if (vm.network_graph().nodes.length < 500){ //saving your computer
        existing_network_graph = vm.network_graph();
        selected_nodes = vm.selected_nodes();
        for (var i = 0; i < n ; i++) {
//            console.log("expanding all nodes - " + i);
            for (item in selected_nodes){
//                console.log(item);
                NeighborSearch(existing_network_graph.nodes[item], max_neighbor_results, min_neighbor_score, vm)
            }
        }
    }
}


function NeighborNeighbor(n, max_neighbor_results, min_neighbor_score, vm){
    if (vm.network_graph().nodes.length < 150){ //saving your computer
        existing_network_graph = vm.network_graph();
        for (var i = 0; i < n ; i++) {
//            console.log("expanding all nodes - " + i);
//            console.log(existing_network_graph);
            for (item in existing_network_graph.nodes){
//                console.log("rummaging...");
                NeighborSearch(existing_network_graph.nodes[item], max_neighbor_results, min_neighbor_score, vm)
            }
        }
    }
}

function generate_item_query(item, metadatas_to_query){
    var or_pre_query = [];
    queryable = [];
    scores = [];
    jQuery.each(item, function(index, value) {
        jQuery.each(metadatas_to_query, function(metaindex, metavalue){
            if ((metavalue.key == index) && (metavalue.selected() == true)){
                if (jQuery.isArray(value)){
                    jQuery.each(value, function(subindex, subvalue){
                        or_pre_query.push(index + ':\\"' + subvalue + '\\"' + "^" + metavalue.score_value());
                    });
                }
                else{
                    or_pre_query.push(index + ':\\"' + value + '\\"' + "^" + metavalue.score_value());
                }
            }
        });
    });
//    console.log(or_pre_query);
    return or_pre_query;
}

function retrieve_existing_ids_from_pool(vm){
    search_ids = [];
    if (vm.network_graph().nodes.length > 0){ //if there is a network
        nodes = vm.network_graph().nodes;
        for (node in nodes){
            search_ids.push(nodes[node].modelid);
        }
    }
    search_string = search_ids.join(" OR id:");
//    console.log(search_string);
    return search_string;
}

function create_search_arguments_from_item_id_return(item, max_neighbor_results, vm){
    var or_pre_query = generate_item_query(item);
    // add extra search parameters to search in existing pool
    var neighbor_search_query = or_pre_query.join(" OR ");// + counter_identical_return;

    var args = {
        ns: "",
        start: 0,
//        fq: "id:" + retrieve_existing_ids_from_pool(vm),
        rows: max_neighbor_results,
        fl: "score,modelid",
        q: neighbor_search_query
    }

    return args;
}


function create_search_arguments_from_item(item, max_neighbor_results, vm){
//    console.log("create_search_command_from_item");
    var or_pre_query = generate_item_query(item, vm.metadatas_to_query());
//    var counter_identical_return = " AND -id:" + item.id; //never find the same back directly
    var neighbor_search_query = or_pre_query.join(" OR ");// + counter_identical_return;
//    console.log(neighbor_search_command);
    var neighbor_search_arguments = {
                ns: "",
                start: 0,
        //        fq: "id:" + retrieve_existing_ids_from_pool(vm),
                rows: max_neighbor_results,
                fl: "score,*",
                q: neighbor_search_query
    };
    return neighbor_search_arguments;
}

function create_comparison_search_argument_from_item(item, id, vm){
    var or_pre_query = generate_item_query(item);
    var neighbor_search_query = or_pre_query.join(" OR ");// + counter_identical_return;
    var neighbor_search_arguments = {
        q: neighbor_search_query,
        fq: "modelid:" + id,
        
    };
    return neighbor_search_arguments;
}

function ConnectNeighbors(vm){
//    console.log("connecting nodes");
    existing_network_graph = vm.network_graph();
    node_ids = returnNodeIds(existing_network_graph.nodes);
    existing_network_graph.links = []; //complete refresh
    changed = false
    for (var i = 0; i < existing_network_graph.nodes.length; i++) {

        var neighbor_search_arguments = create_search_arguments_from_item_id_return(existing_network_graph.nodes[i], 100, vm);

        jQuery.ajax({
            url: neighbor_search_proxy,
            data: neighbor_search_arguments,
            async: false, // meh
            dataType: "json",
            success: function(response) {
                if (response.response.docs.length > 0){ //if there is a response
                    changed = true;
                    found_nodes = response.response.docs;
                    for (node in found_nodes){
                        if (existing_network_graph.nodes[i].modelid == found_nodes[node].modelid){ } //when the id's are the same (link to itself) do nothing
                        else if (jQuery.inArray(found_nodes[node].modelid, node_ids)){ 
                            if (found_nodes[node].score > vm.min_neighbor_score() ){ //if the document score is high enough
                                found_node_internal_id = returnInternalNodeIdById(found_nodes[node].modelid, existing_network_graph.nodes);
                                if (found_node_internal_id){ //extra check
                                    //ADD!!: try to search for reverse link. if found, take highest scoring link.
                                    var push_link = {"source": existing_network_graph.nodes[i].node_id, "target": found_node_internal_id, "score": found_nodes[node].score};
                                    existing_network_graph.links.push(push_link);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    if (changed){ vm.network_graph(existing_network_graph); }
}

function RemoveLonelyNodes(vm){
    existing_network_graph = vm.network_graph();
    lonely_nodes = [];
    //first identify:
    for (var i = 0; i < existing_network_graph.nodes.length; i++) {
        if (!singleNodeinLinkList(existing_network_graph.nodes[i], existing_network_graph.links)){
//            console.log("removing node " + i)
            lonely_nodes.push(i);
            existing_network_graph.nodes.splice(i, 1);
        }
    }
    //reset the node_ids?
    for (var i = 0; i < existing_network_graph.nodes.length; i++) {
        existing_network_graph.nodes[i].node_id = i;
    }
    vm.network_graph(existing_network_graph);
    vm.network_graph.valueHasMutated();
    //then remove:
    //            existing_network_graph.nodes.splice(i, 1);
    
}

function RemoveSelectedNodes(vm){
    existing_network_graph = vm.network_graph();

    //first identify:
//    console.log(existing_network_graph);
    for (var q = 0; q < selected_nodes.length; q++) { //not surewhy, but this has to be repeated a bunch of times
        for (var i = 0; i < existing_network_graph.nodes.length; i++) {
            for (var j = 0; j < selected_nodes.length; j++) {
                if (selected_nodes[j] == existing_network_graph.nodes[i])
                    existing_network_graph.nodes.splice(i, 1);
            }
        }
        for (var i = 0; i < existing_network_graph.links.length; i++) {    
            for (var j = 0; j < selected_nodes.length; j++) {
                if (selected_nodes[j] == existing_network_graph.links[i].source)
                    existing_network_graph.links.splice(i, 1);
            }
        }
        for (var i = 0; i < existing_network_graph.links.length; i++) {    
            for (var j = 0; j < selected_nodes.length; j++) {
                if (selected_nodes[j] == existing_network_graph.links[i].target)
                    existing_network_graph.links.splice(i, 1);
            }
        }
    }

    //reset the node_ids?
    for (var i = 0; i < existing_network_graph.nodes.length; i++) {
        existing_network_graph.nodes[i].node_id = i;
    }
    //remove unconnected links
    
    
    vm.network_graph(existing_network_graph);
    vm.network_graph.valueHasMutated();
}


function returnNodeIds(nodes){
    node_ids = [];
    for (node in nodes){
        node_ids.push(nodes[node].modelid);
    }
    return node_ids;
}

function returnInternalNodeIdById(id, nodes){
    for (nodeid in nodes){
        if (nodes[nodeid].modelid == id){
            return nodes[nodeid].node_id; //of gewoon node?
        }
    }
    return false;
}

function singleNodeinLinkList(i, linkList){ //only one way searching
    for (l in linkList){
        if (i.modelid == linkList[l].source.modelid){
            return i.modelid;
        }
        if (i.modelid == linkList[l].target.modelid){
            return i.modelid;
        }
    }
    return false;
}

function inLinkList(i, i2, linkList){ //only one way searching
    for (l in linkList){
        if ((i.modelid in linkList[l].source) && (i2.modelid in linkList[l].target)){
            return true;
        }
        if ((i2.modelid in linkList[l].source) && (i.modelid in linkList[l].target)){
            return true;
        }
    }
    return false;
}

function inNodesList(item, list){
    for (l in list){
        if (item.modelid == list[l].modelid){
            return true;
        }
    }
    return false;
}

function d3_format_facets(raw_facets){
    var formatted_facets = {}
    for(var index in raw_facets) { 
        var attr = raw_facets[index];
        var list = {};
        for (var val in raw_facets[index]){
            if (typeof attr[val] == "string"){
                list[attr[val]] = attr[parseInt(val) + 1];
            }
        }
        formatted_facets[index] = d3.entries(list);
    }
    return d3.entries(formatted_facets);
}


function UpdateFacetData(facet_query, vm){
//    console.log(facet_query);
    jQuery.getJSON(facet_query, function(response) {
//        var this_facets_results = vm.facets_results;
        formatted_response = d3_format_facets(response.facet_counts.facet_fields);
        vm.facets_results(formatted_response);
        vm.facets_results.valueHasMutated();
    });
}

function stringify(arr){
    stringed = "{";
    concat = "";
    for(var index in arr) {
        stringed += concat + "\"" + index + "\":" + "\"" + arr[index] + "\""
        concat = ",";
    }
    stringed += "}"
    return stringed;
}

//search for al the neighbors of a specific item and create a link
function NeighborSearch(item, max_neighbor_results, min_neighbor_score, vm){
    
        var arg = create_search_arguments_from_item(item, max_neighbor_results, vm);

        arg = {"rj": stringify(arg)};

//        console.log(arg);
//        console.log(vm.search_proxy());

        existing_network_graph = vm.network_graph();
        amount_nodes = existing_network_graph.nodes.length;

        jQuery.ajax({
            url: vm.search_proxy(),
            data: arg,
            method: 'POST',
            async: false, // meh
            dataType: "json",
            complete: function(resp){
            },
            success: function(response) {
//                console.log("success!!!!!!!!!!!");
//                console.log(response);
                for (i in response.response.docs){
//                    console.log(response.response.docs[i]);
                    if ((!inNodesList(response.response.docs[i], existing_network_graph.nodes)) && (response.response.docs[i].score > vm.min_neighbor_score())){
//                        console.log(response.response.docs[i]);
                        pre_node = response.response.docs[i];
                        pre_node["node_id"] = amount_nodes; //extra id for flattening
                        existing_network_graph.nodes.push(pre_node);
                        var push_link = {"source": item.node_id, "target": pre_node.node_id, "score": pre_node.score};
                        existing_network_graph.links.push(push_link);
                        amount_nodes += 1;
                    }
                }
//                console.log(existing_network_graph);
                vm.network_graph(existing_network_graph);
            }
        });
}

function UpdateNetworkDataPOST(url, arg, add, vm){
    var existing_network_graph = vm.network_graph();
    arg = {"rj": stringify(arg)};
    jQuery.ajax({
        url: url,
        data: arg,
        method: 'POST',
        async: false, // meh
        dataType: "json",
        success: function(response) {
            pre_node = response.response.docs[0];
            if (add && !inNodesList(pre_node, existing_network_graph.nodes)){
                pre_node["node_id"] = existing_network_graph.nodes.length; //extra id for flattening
                existing_network_graph.nodes.push(pre_node)
            }
            else if (add && inNodesList(pre_node, existing_network_graph.nodes)){
                //do nothing
            }
            else{
                pre_node["node_id"] = 0; //extra id for flattening
                base_node = {"nodes" : [pre_node], "links": []};
                vm.network_graph(base_node);
            }
            vm.network_graph.valueHasMutated();
        }
    });
}


function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

