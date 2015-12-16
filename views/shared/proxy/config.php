<?php

// FOR EXAMPLE:
//    $config['query_location'] = "http://127.0.0.1:8080/solr/collection2/select";
//    $config['query_location'] = "http://localhost:8080/solr/collection2/select";
//    $config['query_location'] = "http://bookstore.ewi.utwente.nl:8080/solr/collection2/select";
    
//    $config['SOLR_SERVER_HOSTNAME'] = "http://bookstore.ewi.utwente.nl";

$config['SOLR_SERVER_HOSTNAME'] = get_option('solr_search_host') ? "http://" . get_option('solr_search_host') : "http://127.0.0.1";
$config['SOLR_SERVER_USERNAME'] = "";
$config['SOLR_SERVER_PASSWORD'] = "";
$config['SOLR_SERVER_PORT'] = get_option('solr_search_port') ? get_option('solr_search_port') : "8080";
$config['SOLR_SERVER_CORE'] = get_option('solr_search_core') ? get_option('solr_search_core') . "select" : "/solr/omeka/select";
$config['SOLR_SERVER_CORE_POST'] = get_option('solr_search_core') ? get_option('solr_search_core') . "query" : "/solr/omeka/query";

/*
    $config['SOLR_SERVER_HOSTNAME'] = "http://127.0.0.1";
    $config['SOLR_SERVER_USERNAME'] = "";
    $config['SOLR_SERVER_PASSWORD'] = "";
    $config['SOLR_SERVER_PORT'] = "8080";
    $config['SOLR_SERVER_CORE'] = "/solr/omeka/select";
    $config['SOLR_SERVER_CORE_POST'] = "/solr/omeka/query";
*/

?>
