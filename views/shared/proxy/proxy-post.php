<?php

    header('Content-Type: text/html; charset=utf-8');

    include("config.php");

//    $opts = array('http' => array('header' => 'Accept-Charset: UTF-8'));
//    $context = stream_context_create($opts);

    $url = "";
    $url = $config['SOLR_SERVER_HOSTNAME'] . ":" . $config['SOLR_SERVER_PORT'] . $config['SOLR_SERVER_CORE_POST'];


    $query = isset($_REQUEST['q']) ? $_REQUEST['q'] : false;
    $results = false;
    $limit = isset($_REQUEST['rows']) ? $_REQUEST['rows'] : 10;
    $return_fields = isset($_REQUEST['fl']) ? $_REQUEST['fl'] : "score,*"; //if not specified all plus score

    $field_query = isset($_REQUEST['fq']) ? $_REQUEST['fq'] : false;

    function rebuild_query($get) { 
        $query = "";
        $and = "";
        foreach ($get as $key => $value){
            $query = $query . $and . $key . "=" . $value;
            $and = "&";
        }
        return $query; 
    }
    
    function replace_spaces_and_cancellations($url){
        return str_replace("\\", "", str_replace(" ","%20",$url));
    }
    
    
    $total_query = "";
    
    if ($query) {
        if (isset($_REQUEST['s'])) { //get a bunch of item ids
            $pre_query = replace_spaces_and_cancellations($query);
            $settings = "wt=json";
            $settings .= "&rows=" . $limit; 
            $settings .= $return_fields ? "&fl=" . $return_fields : "";
            $total_query = $url . "?q=" . $pre_query . "&" . $settings;
//            print $total_query . "<br><br>";
        }
        if (isset($_REQUEST['i'])) { //get a single ID
            $pre_query = replace_spaces_and_cancellations($query);
            $settings = "wt=json&rows=1";
            $total_query = $url . "?q=id:" . $pre_query . "&" . $return_fields . "&" . $settings;
        }
        else if (isset($_REQUEST['ns'])) { //creators (story tellers)
            $pre_query = mb_convert_encoding(replace_spaces_and_cancellations($query), "ISO-8859-1", mb_detect_encoding($query, "UTF-8, ISO-8859-1, ISO-8859-15", true));
            $settings = "wt=json";
            $settings .= "&rows=" . $limit; //ident=true off for faster results
//            $settings .= $field_query ? "&fq=" . $field_query : "";
            $settings .= $return_fields ? "&fl=" . $return_fields : "";
            $total_query = $url . "?q=" . $pre_query . "&" . $return_fields . "&" . $settings;
//            print "<br><br>";
//            print $total_query;
//            print "<br><br>";
        }
        else if (array_key_exists('f', $_REQUEST)) { //facets
            $total_query = $url . "?" . $_SERVER["QUERY_STRING"];
        }
    }

    if ('UTF-8' === mb_detect_encoding($total_query)) {
//        print "it is utf8!<br><br>";
        // hack to preserve UTF-8 characters
        $total_query = mb_convert_encoding($total_query, 'HTML-ENTITIES', "UTF-8");
//        print $total_query . "<br><br>";
//        $result = file_get_contents($total_query);
//        print "<br><br>";
    }
    else{
        $total_query = mb_convert_encoding($total_query, 'HTML-ENTITIES', "UTF-8");
    }


    print $total_query . "<br><br>";
    
    $result = file_get_contents($total_query);
    
//    print "<pre>";
    print $result;
//    print "</pre>";
?>