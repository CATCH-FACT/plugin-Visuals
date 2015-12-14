<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes">

    <title><?php echo option('site_title'); echo isset($title) ? ' | ' . strip_formatting($title) : ''; ?></title>
    
    <?php 
    queue_js_file('knockout-3.3.0');
    queue_js_file('d3.min');
    queue_js_file('maps_objects');
    queue_js_file('bootstrap.min');
    queue_js_file('map_main');

    #queue_js_url('https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places');
    #queue_css_url('http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800');

    queue_css_file('bootstrap.min');
    queue_css_file('accordeon_style');
    queue_css_file('style_desktop', "screen and (min-device-width: 800px)");
    queue_css_file('style_mobile', "screen and (max-device-width: 799px)");

    queue_js_string('
          jQuery( document ).ready(function() {
              console.log("doc ready");
              jQuery("input[name=show_hide_stats]").on("change", function () {
                  jQuery(".viewer").toggle("explode");
              });
          });
    ');

    echo head_css();
    echo head_js();

    ?>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-59302345-1', 'auto');
      ga('send', 'pageview');

    </script>
  </head>
  <?php echo body_tag(array('id' => @$bodyid, 'class' => @$bodyclass)); ?>
    <?php #fire_plugin_hook('public_body', array('view'=>$this)); ?>

    <div id="map"></div>
    <div class="zCanvas">
        <div class="container">
            <input id="pac-input" class="controls" type="text" placeholder="Locaties zoeken">

            <div id="map-canvas"></div>
    
            <?php 
                $q = array_key_exists("q", $_REQUEST) ? $_REQUEST["q"] : "";
                $facet = array_key_exists("facet", $_REQUEST) ? $_REQUEST["facet"] : "";
                $free = array_key_exists("free", $_REQUEST) ? $_REQUEST["free"] : "";
             ?>
             
             <div class="logowrapper">
                  <div class="logos" id="vkLogo">
              	    <span class="icon-Verhalenkaart"></span>Nederlandse Volksverhalen<strong>Kaart</strong>
                  </div>

                 <div class="logos" id="vbLogo">
                     <span class="icon-book3"></span>
                     <strong><a data-bind="attr: { href: exitLink}">Bank</a></strong>
                 </div>
             </div>

             <div class="locationtype"/>
                 <div class="popover-markup" >
                    <a href="#" class="btn btn-primary" data-bind="click: switchLocationtypeChecked" id="locButton" class="locationtype" data-placement="bottom" role="button" data-placement="bottom"> <span class="glyphicon icon-Pacman"></span></a>
                    <div data-bind="visible: locationtypeChecked, style: { display: locationtypeChecked() ? 'block' : '' }" class="popover fade bottom in" role="tooltip" id="popoverloc" style="top: 4px; display: block;">
                        <div class="arrow" style="top: -10%; left: 90%"></div>
                        <h3 class="popover-title">Locatie type</h3>
                        <div class="popover-content">
                            <!-- ko foreach: menu_locationtype -->
         	                    <label>
                                    <input type="radio" class="menu_radio" data-bind="checkedValue: $data, checked: $root.locationtypesChecked"/>&nbsp
                                    <span data-bind="css: icon"></span>&nbsp<span data-bind="text: title"></span>
         	                    </label>
         	                <!-- /ko -->
                        </div>	    
             	    </div>
                </div>
            </div>
            
            <div id="menuBar"/>
            	<div class="popover-markup" >
                	<a href="#" class="btn btn-primary" data-bind="click: switchSubgenreChecked" id="menuButton" class="subgenre" data-placement="right" role="button" data-placement="bottom"> <span class="glyphicon icon-Subgenre"></span></a>
                    <div data-bind="visible: subgenreChecked, style: { display: subgenreChecked() ? 'block' : '' }" class="popover fade right in" role="tooltip" id="popover770677" style="top: 0px; display: block;">
                        <div class="arrow" style="top: 10%;"></div>
                        <h3 class="popover-title">Genre</h3>
                        <div class="popover-content">
                            <!-- ko foreach: menu_subgenre -->
        	                    <label>
                                    <input type="checkbox" class="menu_checkbox" data-bind="checkedValue: $data, checked: $root.subgenresChecked"/>&nbsp
                                    <span data-bind="css: icon"></span>&nbsp<span data-bind="text: title"></span>
        	                    </label>
        	                <!-- /ko -->
                        </div>	    
            	    </div>
                </div>

                <br>

            	<div class="popover-markup" >
                	<a href="#" class="btn btn-primary" data-bind="click: switchTypeChecked" id="menuButton" class="type" data-placement="right" role="button" data-placement="bottom"> <span class="glyphicon icon-Type" aria-hidden="true"></span></a>
                    <div data-bind="visible: typeChecked, style: { display: typeChecked() ? 'block' : '' }" class="popover fade right in" role="tooltip" id="popover-type" style="top: 70px; display: block;">
                        <div class="arrow" style="top: 30%;"></div>
                        <h3 class="popover-title">Brontype</h3>
                        <div class="popover-content">
                            <div class="checkbox">
                            <!-- ko foreach: menu_type -->
        	                    <label>
                                    <input type="checkbox" class="menu_checkbox" data-bind="checkedValue: $data, checked: $root.typesChecked"/> 
                                    <span data-bind="css: icon"></span> <span data-bind="text: title"></span>
        	                    </label>
        	                <!-- /ko -->
                            </div>
                        </div>	    
            	    </div>
                </div>

                <br>

            	<div class="popover-markup" >
                	<a href="#" class="btn btn-primary" data-bind="click: switchTagChecked" id="menuButton" class="tag" data-placement="right" role="button" data-placement="bottom"> <span class="glyphicon icon-Tag" aria-hidden="true"></span></a>
                    <div data-bind="visible: tagChecked, style: { display: tagChecked() ? 'block' : '' }" class="popover fade right in" role="tooltip" id="popover-type" style="top: 170px; display: block;">
                        <div class="arrow" style="top: 30%;"></div>
                        <h3 class="popover-title">Trefwoord</h3>
                        <div class="popover-content">
                            <div class="checkbox">
                            <!-- ko foreach: menu_tags -->
        	                    <label>
                                    <input type="checkbox" class="menu_checkbox" data-bind="checkedValue: $data, checked: $root.tagsChecked"/> 
                                    <span data-bind="css: icon"></span> <span data-bind="text: title"></span>
        	                    </label>
        	                <!-- /ko -->
                            </div>
                        </div>	    
            	    </div>
                </div>

                <br>

            	<div class="popover-markup" >
                	<a href="#" class="btn btn-primary" data-bind="click: switchLanguageChecked" id="menuButton" class="language" data-placement="right" role="button" data-placement="bottom"> <span class="glyphicon icon-Language" aria-hidden="true"></span></a>
                    <div data-bind="visible: languageChecked, style: { display: languageChecked() ? 'block' : '' }" class="popover fade right in" role="tooltip" id="popover-type" style="top: 200px; display: block;">
                        <div class="arrow" style="top: 50%;"></div>
                        <h3 class="popover-title">Taal</h3>
                        <div class="popover-content">
                            <div class="checkbox">
                            <!-- ko foreach: menu_language -->
        	                    <label>
                                    <input type="checkbox" class="menu_checkbox" data-bind="checkedValue: $data, checked: $root.languagesChecked"/> 
                                    <span data-bind="css: icon"></span> <span data-bind="text: title"></span>
        	                    </label>
        	                <!-- /ko -->
                            </div>
                        </div>	    
            	    </div>
                </div>
        
                <br>

            	<div class="popover-markup" >
                	<a href="#" class="btn btn-primary" data-bind="click: switchCollectorChecked" id="menuButton" class="collector" data-placement="right" role="button" data-placement="bottom"> <span class="glyphicon icon-Collector" aria-hidden="true"></span></a>
                    <div data-bind="visible: collectorChecked, style: { display: collectorChecked() ? 'block' : '' }" class="popover fade right in" role="tooltip" id="popover-type" style="top: 190px; display: block;">
                        <div class="arrow" style="top: 80%;"></div>
                        <h3 class="popover-title">Verzamelaar</h3>
                        <div class="popover-content">
                            <div class="checkbox">
                            <!-- ko foreach: menu_collectors -->
        	                    <label>
                                    <input type="checkbox" class="menu_checkbox" data-bind="checkedValue: $data, checked: $root.collectorsChecked"/> 
                                    <span data-bind="css: icon"></span> <span data-bind="text: title"></span>
        	                    </label>
        	                <!-- /ko -->
                            </div>
                        </div>	    
            	    </div>
                </div>

        
            </div>
    
            <div class="toplayer viewer" id="waitWindow"><br><center>Please <br> wait..</center></div>
        	</div>
	
            <div class="popover-markup" id="tiptop" position="absolute" style="z-index:10; visibility:hidden">
                <div class="popover fade top in" role="tooltip" id="popover666" style="width: 220px; height: 220px; top: 0px; left: 50%; display: inline-block;">
                     <div class="arrow" style="left: 50%;"></div>
                     <h3 class="popover-title" data-bind="text: itemtitle" style="height:auto; min-height:0px"></h3>
                     <div class="popover-content" style="height:80%; overflow-x:hidden">
                         <a data-bind="attr: { href: itemurl}" class="btn btn-primary" id="vbButton" class="vbButton" data-placement="right" role="button" target="tothevb">Volledig verhaal</a>
                         <br>
                         <p data-bind="text: itemdescription"> </p>
                     </div>
        	    </div>
        	</div>
	
        </div><!-- end content -->

    </body>

</html>
