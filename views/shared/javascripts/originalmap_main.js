$ = jQuery;
window.onload = function () {
    var vm = new ViewModel();
    ko.applyBindings(vm);

    var mapman = new MapViewer(vm);
    mapman.init();

    var pieman = new PieViewer(vm);
    pieman.init();

    var timeman = new TimelineViewer(vm);
    timeman.init();

    var waitman = new WaitViewer(vm);
    waitman.init();

    var menuman = new MenuViewer(vm);
    menuman.init();

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
    
//    vm.location_q(q);
//    vm.location_facet(facet);
//    vm.location_free(free);
//    vm.location_query(final_query);
    
    vm.location_query(q);
    
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

var omni_proxy = 'proxy';
var location_proxy = 'proxy/proxy_get.php?l&q=';
var creator_proxy = 'proxy/proxy_get.php?c&q=';
var collector_proxy = 'proxy/proxy_get.php?o&q=';
var ne_location_proxy = 'proxy/proxy_get.php?ne&q=';

var facet_proxy = 'proxy/data_proxy_get.php?f&q=';

var show_facets = ["subgenre", "type", "language", "tag", "collector", "creator", "subject", "literary", "extreme", "word_count_group", "named_entity", "administrative_area_level_1"]
var facet_addition = "&facet=true&facet.mincount=1&wt=json&rows=0&facet.field=" + show_facets.join("&facet.field=")

var province_coordinate_data = "http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wfs?service=WFS&version=2.0.0&request=GetFeature&outputformat=json&typename=provincies"
var county_coordinate_data = "http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wfs?service=WFS&version=2.0.0&request=GetFeature&outputformat=json&typename=gemeentes"

var waiting = true;

var initial_location_query = "*:*";
var initial_creator_query = "*:*";
var initial_collector_query = "*:*";
var initial_ne_location_query = "*:*";
var initial_facet_query = initial_location_query;

var collection_folktales = "collection_id:1";
var collection_collectors = "collection_id:9";
var collection_creators = "collection_id:4";
var collection_main_locations = "collection_id:202";
var collection_ne_locations = "collection_id:201";

var search_query = location_proxy + initial_location_query;

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

function ViewModel() {
    
    var self = this;
    
    self.waiting = ko.observable(waiting);
    
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
    self.selected_location = ko.observableArray([]);
    self.selected_province = ko.observableArray([]);
    self.selected_county = ko.observableArray([]);
    self.selected_collector = ko.observableArray([]);
    self.selected_creator = ko.observableArray([]);
    self.selected_ne_location = ko.observableArray([]);
    
    self.location_query = ko.observable(initial_location_query);
    self.creator_query = ko.observable(initial_creator_query);
    self.collector_query = ko.observable(initial_collector_query);
    self.facet_query = ko.observable(initial_facet_query);
    self.ne_location_query = ko.observable(initial_ne_location_query);
    
    self.current_query = ko.observable("");
    
    self.doFacetRetrieve = function(){
        self.location_query = proxy + self.initial_facet_query();
    }
    
    //helpsearches
    self.hs1 = function (hq) {
        self.location_query($("#hs1").val());
        self.doSearch();
    }
    self.hs2 = function (hq) {
        self.location_query($("#hs2").val());
        self.doSearch();
    }
    self.hs3 = function (hq) {
        self.location_query($("#hs3").val());
        self.doSearch();
    }
    self.hs4 = function (hq) {
        self.location_query($("#hs4").val());
        self.doSearch();
    }
    self.hs5 = function (hq) {
        self.location_query($("#hs5").val());
        self.doSearch();
    }
    self.hs6 = function (hq) {
        self.location_query($("#hs6").val());
        self.doSearch();
    }
    self.hs7 = function (hq) {
        self.location_query($("#hs7").val());
        self.doSearch();
    }
    self.hs8 = function (hq) {
        self.location_query($("#hs8").val());
        self.doSearch();
    }
    self.hs9 = function (hq) {
        self.location_query($("#hs9").val());
        self.doSearch();
    }
    self.hs10 = function (hq) {
        self.location_query($("#hs10").val());
        self.doSearch();
    }
    self.hs11 = function (hq) {
        self.location_query($("#hs11").val());
        self.doSearch();
    }
    self.hs12 = function (hq) {
        self.location_query($("#hs12").val());
        self.doSearch();
    }


    self.doLocationSearch = function(){
        UpdateLocationData(omni_proxy, self.location_query() + " AND" + collection_folktales, self);
    }

    self.doSearch = function () {
        if (self.location_query() == ""){
            self.location_query("*:*");
        }
        if (self.show_locations()){
            setTimeout(function(){ //easy now!
                console.log("location update");
                UpdateLocationData(omni_proxy, self.location_query() + " AND " + collection_folktales, self);
            },10);
        }
/*        if (self.show_collectors){
            setTimeout(function(){
                UpdateCollectorData(collector_proxy + self.collector_query() + " AND " + collection_collectors, self);
            },20);
        }*/
        if (self.show_creators){
            setTimeout(function(){
                console.log("creator update");
                UpdateCreatorData(omni_proxy, self.creator_query() + " AND " + collection_creators, self);
            },30);
        }
/*        if (self.show_ne_locations){ //the future comes soon
            setTimeout(function(){
                UpdateNELocationData(ne_location_proxy + self.ne_location_query() + " AND " + collection_ne_locations, self);
            },40);
        }*/
//        UpdateLocationData(location_proxy + self.location_query(), self);
        UpdateFacetData(omni_proxy, self.location_query() + " AND " + collection_folktales, facet_addition, self);
//        UpdateFacetData(omni_proxy, self.location_query() + " AND " + collection_folktales + facet_addition, self);
    }

    self.doLocationSearch = function() {
        $.ajax({
            url: location_proxy,
            type: 'POST',
            dataType: 'JSON',
            data: {
                q: self.location_query() + " AND" + collection_folktales
            }
        }).done(function(data) {
            if (data.status == 'OK') {
                var a = [];
                k = data.annotation.keywords;
                for (var i = 0; i < k.length; i++) {
                    a.push(
                        {keyword: k[i].keyword, score: k[i].score, checked: ko.observable(k[i].score > 10)}
                    );
                }
                self.automatickeywords(a);
            }
        }.bind(self)
            ).fail(function(data) {
                alert('Error detecting keywords')
            });
    }.bind(self);


    self.emptySearchbox = function(){
        self.location_query("*:*");
    }

    self.addSearch = function (added_search) {
        self.location_query(self.location_query() + added_search);
        self.doSearch();
    }

    self.searchKeyboardCmd = function (data, event) {
        if (event.keyCode == 13) self.doSearch();
        return true;
    };
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


function create_search_arguments_and_return_facets(query){
    var args = {
        wt: "json",
        rows: 0,
        "facet.mincount": 1,
        facet: "true",
        q: query
    }
    return args;
}


function UpdateFacetData(proxy, facet_query, facet_addition, vm){
//    console.log("facet_query");
//    console.log(facet_query);

    facet_query = facet_query.replace(/"/g, '\\"');
    arg = create_search_arguments_and_return_facets(facet_query);
    arg = {"rj": stringify(arg)};
    
    proxy = proxy + "?facet.field=" + show_facets.join("&facet.field=");
    
//    console.log(proxy);
//    console.log(arg);
    
    jQuery.ajax({
        url: proxy,
        data: arg,
        method: 'POST',
        async: true, // meh
        dataType: "json",
        success: function(response) {
//            console.log("facet_query");
//            console.log(response);
            formatted_response = d3_format_facets(response.facet_counts.facet_fields);
            vm.facets_results(formatted_response);
            vm.facets_results.valueHasMutated();

        }
    });
}


function UpdateNELocationData(ne_location_query, vm){
//    console.log("NE LOCATION:" + ne_location_query);
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

function create_search_arguments_and_return_locationdata(query){
    var args = {
        ns: "",
        start: 0,
        wt: "json",
        rows: 999999,
        fl: "locality,subgenre,longitude,latitude,modelid,date,title",
        q: query
    }
    return args;
}

function UpdateLocationData(proxy, location_query, vm){
//    console.log("LOCATION_QUERY: " + location_query);
    vm.waiting(true);
    vm.waiting.valueHasMutated();
    
    location_query = location_query.replace(/"/g, '\\"');
    arg = create_search_arguments_and_return_locationdata(location_query);
    arg = {"rj": stringify(arg)};

//    console.log(arg);
//    console.log(proxy);
    
    jQuery.ajax({
        url: proxy,
        data: arg,
        method: 'POST',
        async: true, // meh
        dataType: "json",
        success: function(response) {
//            console.log(response);
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

function UpdateCreatorData(proxy, creator_query, vm){
        vm.waiting(true);
        vm.waiting.valueHasMutated();

        creator_query = creator_query.replace(/"/g, '\\"');
        arg = create_search_arguments_and_return_locationdata(creator_query);
        arg = {"rj": stringify(arg)};

        console.log(arg);
        console.log(proxy);

        jQuery.ajax({
            url: proxy,
            data: arg,
            method: 'POST',
            async: true, // meh
            dataType: "json",
            success: function(response) {
                console.log(response);
                nested_results = d3.nest()
                    .key(function(d) { return [d.latitude, d.longitude]; })
                    .entries(response.response.docs);
                vm.creator_results(nested_results);
                vm.creator_results.valueHasMutated();
                vm.waiting(false);
                vm.waiting.valueHasMutated();
            }
        });
}

function UpdateCreatorDataOLD(creator_query, vm){
//    console.log("CREATORS:" + creator_query);
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
//    console.log("COLLECTOTS:" + collector_query);
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