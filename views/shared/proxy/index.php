<?php
    header('Content-Type: text/html; charset=utf-8');

    include("config.php");

    $request_json = isset($_POST['rj']) ? $_POST['rj'] : false;
    $get_parameters = isset($_SERVER["QUERY_STRING"]) ? $_SERVER["QUERY_STRING"] : false;

//    print $get_parameters;

    $results = false;
    
    $url = "";
    $url = $config['SOLR_SERVER_HOSTNAME'] . ":" . $config['SOLR_SERVER_PORT'] . $config['SOLR_SERVER_CORE_POST'] . (isset($_SERVER["QUERY_STRING"]) ? "?" . $_SERVER["QUERY_STRING"] : false);
//    $url = $config['SOLR_SERVER_HOSTNAME'] . ":" . $config['SOLR_SERVER_PORT'] . $config['SOLR_SERVER_CORE_POST'];
    
    if ($request_json) {
        // if magic quotes is enabled then stripslashes will be needed
        if (get_magic_quotes_gpc() == 1)
        {
            $request_json = stripslashes($request_json);
        }

        $request_json = json_decode($request_json); //turn json

        $postdata = http_build_query($request_json);

        $opts = array('http' =>
               array(
                   'method'  => 'POST',
                   'header'  => 'Content-type: application/x-www-form-urlencoded',
                   'content' => $postdata
               )
           );
           
        $context  = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);

        print $result;
    }
    else{
        $error = array("Error"=> "Post value rj empty");
        echo json_encode($error);
    }

?>