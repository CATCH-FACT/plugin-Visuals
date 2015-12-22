$ = jQuery;

window.onload = function () {
    
    var vm = new ViewModel();
    ko.applyBindings(vm);

    var mapman = new MapViewer(vm);
    mapman.init();

    var waitman = new WaitViewer(vm);
    waitman.init();

    var menuman = new MenuViewer(vm);
    menuman.init();
    
    var popover = new Popover(vm);
    popover.init();
    
    // Get the `query` GET parameter
    var q = getUrlParameter("q");
    // Get the `facet` GET parameter
    var facet = getUrlParameter("facet");
    // Get the `free` GET parameter
    var free = getUrlParameter("free");
    
    if (typeof facet !== 'undefined'){
        facet = decodeURI(facet).replace(/%3A/g, ':').replace(/\+/g, ' ');
    }
    else{
        facet = "";
    }
    
    if (typeof free !== 'undefined'){
        free = decodeURI(free).replace(/%3A/g, ':').replace(/\+/g, ' ');
    }
    else{
        free = "";
    }
    
    var final_query = '';
    var and = '';
    
    if ((typeof q == 'undefined') || (q == '')) {
    }
    else{
        final_query = q.replace(':', ' ').replace('[', "").replace(']', "");
        and = " AND "
    }
    if ((typeof facet == 'undefined') || (facet == '')){
    }
    else{
        final_query += and + "(" + facet.replace(/"/g, '\\"') + ")";
        and = " AND "
    }
    if ((typeof free == 'undefined') || (free == '')){
    }
    else{
        //remove {} here for proper return URL
        final_query += and + "(" + free.replace(/\{/g, '').replace(/\}/g, '').replace(/"/g, '\\"').replace(/-/g, ' ') + ")";
    }
    
    vm.location_q(q);
    vm.location_facet(facet);
    vm.location_free(free);

    vm.location_query(final_query);
    
    vm.doSearch();
}

var show_info_windows = true;
var show_help_windows = true;

var bubble_sizes_multiplier = 1.0;

var bubbles_same_size = false;
var bubbles_color_intensity = false;

var opacity_provinces = 0;
var opacity_counties = 0;
var opacity_locations = 0.65;
var opacity_collectors = 0.65;
var opacity_creators = 0.65;
var opacity_ne_locations = 0.65;

var show_provinces = false;
var show_counties = false;

var show_locations = true;
var show_collectors = false;
var show_creators = false;
var show_ne_locations = false;

var show_collectors_locations = false; //not used
var show_collectors_creators = false; //not used

var cloud_view = false;

var get_proxy = 'proxy'

var show_facets = ["subgenre", "type", "language", "tags", "collector", "creator", "subject", "literary", "extreme", "text_length_group", "named_entity", "administrative_area_level_1"]
var facet_addition = "&facet=true&facet.mincount=1&wt=json&rows=0&facet.field=" + show_facets.join("&facet.field=")

var province_coordinate_data = "http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wfs?service=WFS&version=2.0.0&request=GetFeature&outputformat=json&typename=provincies"
var county_coordinate_data = "http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wfs?service=WFS&version=2.0.0&request=GetFeature&outputformat=json&typename=gemeentes"

var waiting = true;

var initial_location_query = "";
var initial_facet_query = initial_location_query;

var collection_folktales = "collection_id:1";
var collection_collectors = "collection_id:9";
var collection_creators = "collection_id:4";
var collection_main_locations = "collection_id:202";
var collection_ne_locations = "collection_id:201";

var menu_locationtype = [   {key: "narration",			title: "Vertellocatie",			icon: "",	    	checked: false},
                            {key: "action",	    		title: "Plaats van handelen",	icon: "",	    	checked: false}];

var menu_subgenre = [ {key: "sage",						title: "Sage",					icon: "icon-Sage",		checked: false},
					  {key: "mop",						title: "Mop",  					icon: "icon-Mop",		checked: false},
					  {key: "broodjeaapverhaal",		title: "Broodjeaapverhaal", 	icon: "icon-Broodjeaap",checked: false},
					  {key: "raadsel",					title: "Raadsel", 		 		icon: "icon-Raadsel",	checked: false},
                      {key: "sprookje",					title: "Sprookje", 		 		icon: "icon-Sprookje", 	checked: false},
					  {key: "personal narrative",		title: "Personal narrative", 	icon: "icon-Personal_narrative",	checked: false},
					  {key: "legende",					title: "Legende", 		 		icon: "icon-Legende",	checked: false},
					  {key: "exempel",					title: "Exempel", 		 		icon: "icon-Exempel",	checked: false},
					  {key: "kwispel",					title: "Kwispel", 		 		icon: "icon-Kwispel",	checked: false},
					  {key: "lied",				    	title: "Lied", 	    	        icon: "icon-Lied",	    checked: false},
					  {key: "personal",					title: "Personal", 		 		icon: "icon-Personal",	checked: false},
					  {key: "mythe",					title: "Mythe", 		 		icon: "icon-Mythe",	    checked: false},
					  {key: "limerick",					title: "Limerick", 		 		icon: "icon-Limerick",	checked: false}];


var menu_type = [ {key: "mondeling",	                title: "Mondeling",	            icon: "",   checked: false},
				  {key: "boek",		                    title: "Boek", 	                icon: "",   checked: false},
				  {key: "internet",		                title: "Internet", 	            icon: "",   checked: false},
				  {key: "e-mail",		                title: "E-mail", 	            icon: "",   checked: false},
				  {key: "vragenlijst",		            title: "Vragenlijst", 	        icon: "",   checked: false},
				  {key: "brief",		                title: "Brief", 	            icon: "",   checked: false},
				  {key: "krant",		                title: "Krant", 	            icon: "",   checked: false},
				  {key: "tijdschriftartikel",           title: "Tijdschriftartikel", 	icon: "",   checked: false},
			      {key: "manuscript",		            title: "Manuscript", 	        icon: "",   checked: false}];

var menu_language = [ {key: "Standaardnederlands",		title: "Standaardnederlands",	icon: "",	checked: false},
					  {key: "Fries (Woudfries)",		title: "Fries (Woudfries)",  	icon: "",	checked: false},
					  {key: "17e-eeuws Nederlands",		title: "17e-eeuws Nederlands", 	icon: "",	checked: false},
					  {key: "Gronings",					title: "Gronings", 	        	icon: "",   checked: false},
					  {key: "Vlaams",           		title: "Vlaams",                icon: "",	checked: false},
				      {key: "Middelnederlands",			title: "Middelnederlands", 	    icon: "",	checked: false},
				      {key: "Fries",					title: "Fries", 		 	    icon: "",	checked: false},
				      {key: "Noord-Brabants",			title: "Noord-Brabants", 		icon: "",	checked: false},
				      {key: "Gendts (Achterhoeks)",		title: "Gendts (Achterhoeks)", 	icon: "",	checked: false},
//				      {key: "",		title: "Overige Dialecten", 	icon: "",	checked: false}, //Hoe?
					  ];

var menu_tags = [ {    key: "dood",		title: "dood",      icon: "",	checked: false},
					  {key: "man",		title: "man",	    icon: "",	checked: false},
					  {key: "vrouw",	title: "vrouw", 	icon: "",	checked: false},
					  {key: "sterven",	title: "sterven",   icon: "",   checked: false},
					  {key: "huis",     title: "huis",      icon: "",	checked: false},
				      {key: "nacht",	title: "nacht",     icon: "",	checked: false},
				      {key: "duivel",	title: "duivel",    icon: "",	checked: false},
				      {key: "heks",		title: "heks",      icon: "",	checked: false},
				      {key: "zien",		title: "zien", 	    icon: "",	checked: false},
				      {key: "voorteken",title: "voorteken", icon: "",	checked: false}
					  ];

var menu_collectors = [ {  key: "A.A. Jaarsma",		        title: "A.A. Jaarsma",      icon: "",	checked: false},
    					  {key: "Theo Meder",		        title: "Theo Meder",	    icon: "",	checked: false},
    					  {key: "Overbeke, Aernout van",	title: "Overbeke, Aernout van", 	icon: "",	checked: false},
    					  {key: "Ruben A. Koman",	        title: "Ruben A. Koman",   icon: "",   checked: false},
    					  {key: "Henk Kooijman",            title: "Henk Kooijman",      icon: "",	checked: false},
    				      {key: "Wever, F.",	            title: "Wever, F.",     icon: "",	checked: false},
    				      {key: "C. Bakker",	            title: "C. Bakker",    icon: "",	checked: false},
    				      {key: "Ype Poortinga",		    title: "Ype Poortinga",      icon: "",	checked: false},
    				      {key: "Kusters, C.",		        title: "Kusters, C.", 	    icon: "",	checked: false},
    				      {key: "Giselinde Kuipers",        title: "Giselinde Kuipers", icon: "",	checked: false}
    					  ];

/*
*   Getting URL parameters and returning them in a for loop
*
*/
function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}

/*
*   The knockout model
*   Keeps track of data, settings, menu items, and selections
*/
function ViewModel() {
    
    var self = this;
    
    self.waiting = ko.observable(waiting);

    self.locationtypeChecked = ko.observable(false);
    self.switchLocationtypeChecked = ko.pureComputed({
            read: function () {
                return this.locationtypeChecked;
            },
            write: function (value) {
                self.locationtypeChecked(!self.locationtypeChecked());
                self.subgenreChecked(false);
                self.typeChecked(false);
                self.languageChecked(false);
                self.tagChecked(false);
                self.collectorChecked(false);
            },
            owner: self
        });
    
    self.subgenreChecked = ko.observable(false);
    self.switchSubgenreChecked = ko.pureComputed({
            read: function () {
                return this.subgenreChecked;
            },
            write: function (value) {
                self.subgenreChecked(!self.subgenreChecked());
                self.typeChecked(false);
                self.languageChecked(false);
                self.tagChecked(false);
                self.collectorChecked(false);
            },
            owner: self
        });
        
    self.typeChecked = ko.observable(false);
    self.switchTypeChecked = ko.pureComputed({
            read: function () {
                return self.typeChecked;
            },
            write: function (value) {
                self.subgenreChecked(false);
                self.typeChecked(!self.typeChecked());
                self.languageChecked(false);
                self.tagChecked(false);
                self.collectorChecked(false);
            },
            owner: self
        });
        
    self.languageChecked = ko.observable(false);
    self.switchLanguageChecked = ko.pureComputed({
            read: function () {
                return self.languageChecked;
            },
            write: function (value) {
                self.subgenreChecked(false);
                self.typeChecked(false);
                self.languageChecked(!self.languageChecked());
                self.tagChecked(false);
                self.collectorChecked(false);

            },
            owner: self
        });
        
    self.tagChecked = ko.observable(false);
    self.switchTagChecked = ko.pureComputed({
            read: function () {
                return self.tagChecked;
            },
            write: function (value) {
                self.subgenreChecked(false);
                self.typeChecked(false);
                self.languageChecked(false);
                self.tagChecked(!this.tagChecked());
                self.collectorChecked(false);
            },
            owner: self
        });
        
    self.collectorChecked = ko.observable(false);
    self.switchCollectorChecked = ko.pureComputed({
            read: function () {
                return self.collectorChecked;
            },
            write: function (value) {
                self.subgenreChecked(false);
                self.typeChecked(false);
                self.languageChecked(false);
                self.tagChecked(false);
                self.collectorChecked(!self.collectorChecked());
            },
            owner: self
        });

    self.menu_locationtype = ko.observableArray(menu_locationtype);
    self.menu_subgenre = ko.observableArray(menu_subgenre);
    self.menu_type = ko.observableArray(menu_type);
    self.menu_language = ko.observableArray(menu_language);
    self.menu_tags = ko.observableArray(menu_tags);
    self.menu_collectors = ko.observableArray(menu_collectors);
    
    self.locationtypesChecked = ko.observableArray([]);
    self.subgenresChecked = ko.observableArray([]);
    self.typesChecked = ko.observableArray([]);
    self.languagesChecked = ko.observableArray([]);
    self.tagsChecked = ko.observableArray([]);
    self.collectorsChecked = ko.observableArray([]);
    
    ko.utils.arrayForEach(menu_subgenre, function(select){
		select.checked = ko.observable(select.checked);
		select.icon = ko.observable(select.icon);
    });
    
    ko.utils.arrayForEach(menu_type, function(select){
		select.checked = ko.observable(select.checked);
    });
    
    self.menu_subgenre = ko.observable(menu_subgenre);
    self.menu_type = ko.observable(menu_type);
    
    self.show_help_windows = ko.observable(show_help_windows);
    self.show_info_windows = ko.observable(show_info_windows);
    self.bubble_size = ko.observable(bubble_sizes_multiplier);
    
    self.bubbles_same_size = ko.observable(bubbles_same_size);
    self.bubbles_color_intensity = ko.observable(bubbles_color_intensity);
    
    self.opacity_locations = ko.observable(opacity_locations);
    self.opacity_provinces = ko.observable(opacity_provinces);
    self.opacity_counties = ko.observable(opacity_counties);
    self.opacity_collectors = ko.observable(opacity_collectors);
    self.opacity_creators = ko.observable(opacity_creators);
    self.opacity_ne_locations = ko.observable(opacity_ne_locations);

    //checkboxes for showing objects
    self.show_provinces = ko.observable(show_provinces);
    self.show_counties = ko.observable(show_counties);
    self.show_locations = ko.observable(show_locations);
    self.show_collectors = ko.observable(show_collectors);
    self.show_creators = ko.observable(show_creators);
    self.show_ne_locations = ko.observable(show_ne_locations);
        
    //lines / connections
    self.show_collectors_locations = ko.observable(show_collectors_locations);
    self.show_collectors_creators = ko.observable(show_collectors_creators);
    
    self.cloud_view = ko.observable(cloud_view);
    
    self.show_facets = ko.observableArray(show_facets);
    
    //observable arrays for containing search/browse results
    self.facets_results = ko.observableArray([]);
    self.location_results = ko.observableArray([]);
    self.creator_results = ko.observableArray([]);
    self.collector_results = ko.observableArray([]);
    self.ne_location_results = ko.observableArray([]);

    //keeping track of selected objects
//    self.selected_location = ko.observableArray([]);
    self.selected_location = ko.observable("");
//    self.selected_province = ko.observableArray([]);
//    self.selected_county = ko.observableArray([]);
//    self.selected_collector = ko.observableArray([]);
//    self.selected_creator = ko.observableArray([]);
//    self.selected_ne_location = ko.observableArray([]);
    
    self.get_proxy = ko.observable(get_proxy);
    
    self.location_query = ko.observable(initial_location_query);
    self.location_q = ko.observable("");
    self.location_facet = ko.observable("");
    self.location_free = ko.observable("");
    
    self.current_query = ko.observable("");
    
    self.itemdescription = ko.observable("");
    self.itemtitle = ko.observable("");
    self.itemurl = ko.observable("");
    
    self.doFacetRetrieve = function(){
        self.location_query = proxy + self.initial_facet_query();
    }
    
    //helpsearches
    self.hs1 = function (hq) {
        self.location_query($("#hs1").val());
        self.doSearch();
    }

    self.exitLink = ko.computed(function() {
            urlPath = location.origin + location.pathname 
                        + "?q=" + self.location_q()
                        + "&facet=" + self.location_facet().replace(/\)/g, '').replace(/\(/g, '').replace(/\\/g, '')
                        + "&free=" + self.location_free();
            return urlPath.replace("visuals/map", "solr-search");
        }, this);

    //!! TODO make distinction between q and facet !!
    
    self.doSearch = function () {
        
        if (self.show_locations()){
            
            setTimeout(function(){ //easy now!
                var qry = self.location_query()
                if (self.location_query() == ''){
                    qry = '*:*';
                }
                theUltimateQuery = '(' + qry + ')' + ' AND public:\\"true\\"';
                
                UpdateLocationData(theUltimateQuery, self);
                
            },10);
        }
        
    }

    self.emptySearchbox = function(){
        self.location_query("");
    }

    self.addSearch = function (added_search) {
        self.location_query(self.location_query() + added_search);
        self.doSearch();
    }

    self.searchKeyboardCmd = function (data, event) {
        if (event.keyCode == 13) self.doSearch();
        return true;
    };
    
    self.getDescription = function(id){
        var query = "(" + "id:" + id + ")";
        query_object = create_search_arguments_and_return_everything(query)
        arg = {"rj": stringify(query_object)};
        $.ajax({
            url: this.get_proxy(),
            data: arg,
            method: 'POST',
            dataType: "json",
            success: function(response) {
                self.itemdescription(response.response.docs[0].description);
                self.itemtitle(response.response.docs[0].title);
                self.itemurl("http://www.verhalenbank.nl/items/show/" + response.response.docs[0].modelid + "#volksverhaal-item-type-metadata-text");
            }
        });
    }
};

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
    $.getJSON(facet_query, function(response) {
//        var this_facets_results = vm.facets_results;
        formatted_response = d3_format_facets(response.facet_counts.facet_fields);
        vm.facets_results(formatted_response);
        vm.facets_results.valueHasMutated();
    });
}

function UpdateNELocationData(ne_location_query, vm){
    vm.waiting(true);
    vm.waiting.valueHasMutated();
    $.getJSON(ne_location_query, function(response) {
//        var jq_results = vm.location_results;
        nested_results = d3.nest()
            .key(function(d) { return [d.latitude, d.longitude]; })
            .entries(response.response.docs);
        vm.ne_location_results(nested_results);
        vm.ne_location_results.valueHasMutated();
        vm.waiting(false);
        vm.waiting.valueHasMutated();
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

function create_search_arguments_and_return_everything(query, vm){
    var args = {
        ns: "",
        start: 0,
        wt: "json",
        rows: 999999,
        fl: "*,score",
        q: query
    }
    return args;
}

function create_search_arguments_and_return_locationdata(query, vm){
    var args = {
        ns: "",
        start: 0,
        wt: "json",
        rows: 999999,
        fl: "locality,subgenre,longitude,latitude,id",
        q: query
    }
    return args;
}

function create_search_arguments_and_return_action_locationdata(query, vm){
    query = query + " AND action_longitude:[* TO *]";
    var args = {
        ns: "",
        start: 0,
        wt: "json",
        rows: 999999,
        fl: "locality:action_locality,subgenre,longitude:action_longitude,latitude:action_latitude,id",
        q: query
    }
    return args;
}


function UpdateLocationData(query, vm){
    
    locationtype = vm.locationtypesChecked();
    console.log(locationtype);
    
    if (locationtype.key == "action"){
        query_object = create_search_arguments_and_return_action_locationdata(query)
    }
    else{
        query_object = create_search_arguments_and_return_locationdata(query)
    }
    
    arg = {"rj": stringify(query_object)};
    
    vm.waiting(true);
    vm.waiting.valueHasMutated();
    
    $.ajax({
        url: vm.get_proxy(),
        data: arg,
        method: 'POST',
        dataType: "json",
        success: function(response) {
            nested_results = d3.nest()
                .key(function(d) { return [d.latitude, d.longitude]; })
                .entries(response.response.docs);
            vm.location_results(nested_results);
            vm.location_results.valueHasMutated();
            vm.waiting(false);
            vm.waiting.valueHasMutated();
        }
    });
}

function UpdateCreatorData(creator_query, vm){
    $.getJSON(creator_query, function(response) {
//        var jq_results = vm.creator_results;
        nested_results = d3.nest()
            .key(function(d) { return [d.latitude, d.longitude]; })
            .entries(response.response.docs);
        vm.creator_results(nested_results);
        vm.creator_results.valueHasMutated();
    });
}


function UpdateCollectorData(collector_query, vm){
    $.getJSON(collector_query, function(response) {
//        var jq_results = vm.creator_results;
        nested_results = d3.nest()
            .key(function(d) { return [d.latitude, d.longitude]; })
            .entries(response.response.docs);
        vm.collector_results(nested_results);
        vm.collector_results.valueHasMutated();
    });
}



function MenuViewer(vm){

    this.init = function(){
        $(function() {
            $( "#accordion" ).accordion({
                heightStyle: "fill"
            });
        });
        $(function() {
            $( "#accordion-resizer" ).resizable({
                grid: 50,
                resize: function() {
                    $( "#accordion" ).accordion( "refresh" );
                }
            });
        });
    }
}



function Popover(vm) {
	this.init = function(){
	    
	    eachAnd = function(arr, metadatatype){
            query = "";
	        if (!(arr.length == 0)){
    	        var or = "";
                query += "(";
                $.each(arr, function(i, v){
    		        query += or + metadatatype + ":\\\"" + v.key + "\\\"";
                    or = " OR ";
                });
    	        query += ")";
	        }
	        return query;
	    }

	    $('body').on('click', '.menu_radio', function(){
	        vm.doSearch();
        });
	    
	    $('body').on('click', '.menu_checkbox', function(){
	        var query = "";
	        
	        //add a free search query??
	        
            query = eachAnd(vm.subgenresChecked(), "subgenre");
            if (!(query.length == 0) && !(vm.typesChecked().length == 0)){
	            query += " AND ";
            }
            query += eachAnd(vm.typesChecked(), "type");
            if (!(query.length == 0) && !(vm.tagsChecked().length == 0)){
	            query += " AND ";
            }
            query += eachAnd(vm.tagsChecked(), "tag");
            if (!(query.length == 0) && !(vm.languagesChecked().length == 0)){
	            query += " AND ";
            }
            query += eachAnd(vm.languagesChecked(), "language");
            if (!(query.length == 0) && !(vm.collectorsChecked().length == 0)){
	            query += " AND ";
            }
            query += eachAnd(vm.collectorsChecked(), "collector");
            
	        if (query == ""){
	            query = "";
	        }
	        
	        vm.location_query(query);
	        vm.doSearch();

	    });
	    
}};