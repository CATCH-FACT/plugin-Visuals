<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes">

    <title><?php echo option('site_title'); echo isset($title) ? ' | ' . strip_formatting($title) : ''; ?></title>
    
    <?php 
    queue_js_file('knockout-3.3.0');
    queue_js_file('d3.min');
    queue_js_file('dynamic_pie_charts');
    queue_js_file('verhalen_timeline');
    queue_js_file('originalmap_objects');
//    queue_js_file('bootstrap.min');
    queue_js_file('originalmap_main');

    queue_css_file('jquery-ui');
    queue_css_file('originalmap_style');
    queue_css_file('accordeon_style');
//    queue_css_file('style_desktop', "screen and (min-device-width: 800px)");
//    queue_css_file('style_mobile', "screen and (max-device-width: 799px)");

    queue_js_string('
          jQuery( document ).ready(function() {
              console.log("doc ready");
              jQuery("input[name=show_hide_stats]").on("change", function () {
                  jQuery(".viewer").toggle("explode");
              });
          });
    ');

    queue_css_file(array('iconfonts','style', 'skeleton', 'jquery-ui'));
    queue_css_file('media/960min', 'only screen and (min-width: 960px)');
    queue_css_file('media/768min', 'only screen and (min-width: 768px) and (max-width: 959px)');
    queue_css_file('media/767max', 'only screen and (max-width: 767px)');
    queue_css_file('media/479max', 'only screen and (max-width: 479px)');
    queue_css_url('//fonts.googleapis.com/css?family=Arvo:400,700,400italic,700italic|Cabin:400,700,400italic,700italic');

    queue_js_file(array('vendor/respond', 'vendor/modernizr'));
    queue_js_file('vendor/selectivizr', 'javascripts', array('conditional' => '(gte IE 6)&(lte IE 8)'));
    queue_js_file('globals');

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

    <header style="">
        <div class="container">
            <div id="site-title" class="two columns">
                <?php echo link_to_home_page(option('site_title'), array('target' => '_blank')); ?>
            </div>

            <nav>
                <?php #echo common('global-nav'); ?>

                <ul id="user-nav">
                <?php if ($user = current_user()): ?>
                    <?php
                        $name = html_escape($user->name);
                        if (is_allowed($user, 'edit')) {
                            $userLink = '<a href="' . html_escape(url('users/edit/' . $user->id)) . '">' . $name . '</a>';
                        } else {
                            $userLink = $name;
                        }
                    ?>
                    <li><?php echo __('Welcome, %s', $userLink); ?></li>
                    <li><a href="<?php echo html_escape(url('users/logout'));?>" id="logout"><?php echo __('Log Out'); ?></a></li>
                <?php endif; ?>
                </ul>
            </nav>
        </div>
    </header>    
    
    <div id="accordion-resizer" class="ui-widget-content">
        <div id="accordion">

            <h3>Visuele opties</h3>
            <div class="control">
                <div class="control">
<!--                <input type="checkbox" name="show_provinces" data-bind="checked: show_provinces" checked>
                    Provincies <br>
                    <input type="checkbox" name="show_counties" data-bind="checked: show_counties" checked>
                    Gemeenten <br>-->
                    <input type="checkbox" name="show_locations" data-bind="checked: show_locations" checked>
                    <input type="range" name="opacity_locations" min="0" max="1" step="0.05" data-bind="value: opacity_locations">
                    <svg height="10" width="10">
                      <circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="red" />
                    </svg>
                    Volksverhalen <br>
                    <input type="checkbox" name="show_collectors" data-bind="checked: show_collectors">
                    <input type="range" name="opacity_collectors" min="0" max="1" step="0.1" data-bind="value: opacity_collectors"> 
                    <svg height="10" width="10">
                      <polygon fill="blue" stroke="black" stroke-width="1" points="5,0 10,5 5,10 0,5 5,0" />
                    </svg>
                    Verzamelaars <br>
                    <input type="checkbox" name="show_creators" data-bind="checked: show_creators">
                    <input type="range" name="opacity_creators" min="0" max="1" step="0.05" data-bind="value: opacity_creators"> 
                    <svg height="10" width="10">
                        <polygon fill="lime" stroke="green" stroke-width="1" points="4,8 8,0 0,0 4,8" />
                    </svg>
                    Vertellers <br>
                    <input type="checkbox" name="show_ne_locations" data-bind="checked: show_ne_locations">
                    <input type="range" name="opacity_ne_locations" min="0" max="1" step="0.05" data-bind="value: opacity_ne_locations"> 
                    <svg height="10" width="10">
                        <ellipse cx="5" cy="5" rx="5" ry="3" style="fill:yellow;stroke:purple;stroke-width:1" />
                    </svg>
                    Actielocaties <br>

<!--                    <input type="checkbox" name="lines">
                    <svg height="10" width="20">
                      <line x1="0" y1="2" x2="20" y2="8" style="stroke:rgb(0,0,0);stroke-width:2" />
                    </svg>
                    Verzamelaars -> Verhalen<br>

                    <input type="checkbox" name="lines">
                    <svg height="10" width="20">
                      <line x1="0" y1="2" x2="20" y2="8" style="stroke:rgb(0,0,255);stroke-width:2" />
                    </svg>
                    Verzamelaars -> Vertellers<br>
                    <input type="checkbox" name="show_info_windows" data-bind="checked: show_help_windows">Gebruikshulp<br>-->
                    <br>
                    <input type="checkbox" name="show_info_windows" data-bind="checked: show_info_windows">Informatie schermen<br>
                    <input type="checkbox" name="bubbles_same_size" data-bind="checked: bubbles_same_size">Zelfde grootte<br>
                    <input type="checkbox" name="bubbles_color_intensity" data-bind="checked: bubbles_color_intensity">Op kleur<br>
                    <input type="checkbox" name="item_cloud" data-bind="checked: cloud_view">Cloud (experim.)<br>
                </div>
            </div>

            <h3>Gebruikshulp</h3>
            <div class="control">
                <div class="control" style="direction: ltr; padding: 3px;">
                    <h4>Verhalen zoekveld</h4>
                    Zoeken kan met de <a href="http://www.solrtutorial.com/solr-query-syntax.html">SolR query syntax</a>. Een aantal voorbeeld zoektermen:<br>

                    Alles:
                    <input id="hs10" class="input-search" value="*:*" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs10">Search</button><br>

                    Alle sprookjes:
                    <input id="hs1" class="input-search" value="subgenre:sprookje" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs1">Search</button><br>

                    <input id="hs8" class="input-search" value='subgenre:"sprookje" AND NOT type:"boek"' style='width:190px'/>
                    <button class="search_button" data-bind="click:hs8">Search</button><br>

                    <input id="hs2" class="input-search" value="type:mondeling" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs2">Search</button><br>

                    <input id="hs3" class="input-search" value="administrative_area_level_1:Friesland" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs3">Search</button><br>

                    <input id="hs4" class="input-search" value='language:"Standaardnederlands"' style='width:190px'/>
                    <button class="search_button" data-bind="click:hs4">Search</button><br>

                    <input id="hs5" class="input-search" value="locality:*land" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs5">Search</button><br>

                    <input id="hs6" class="input-search" value="literary:*bewerkt*" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs6">Search</button><br>

                    <input id="hs7" class="input-search" value="NOT administrative_area_level_1:*land" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs7">Search</button><br>

                    <input id="hs9" class="input-search" value="date:2001*" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs9">Search</button><br>

                    <input id="hs11" class="input-search" value="NOT country:* AND latitude:*" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs11">Search</button><br>

                    <input id="hs12" class="input-search" value="date_start:[1800-03-06T23:59:59.999Z TO 1850-03-06T23:59:59.999Z]" style='width:190px'/>
                    <button class="search_button" data-bind="click:hs12">Search</button><br>

                    <br>

                    <h4>Zoekresultaten</h4>
                    De zoekresultaten worden weergegeven in rode bollen. U kunt nog wat spelen met de kleuren, en de bollen allemaal even groot maken, bijvoorbeeld om overlap te voorkomen. Ook kunt u de transparantie veranderen zodat er een soort "heatmap" ontstaat. Door op het checkboxje ervoor te klikken kunt u de resultaten geheel weghalen van de kaart.
                    Items die geen locatie hebben komen naast Nederland in zee terecht.
                    <br>
                    <br>

                    <h4>Facetten (taartdiagrammen rechts)</h4>
                    Deze diagrammen geven aan welke metadata voorkomt in de resultaten. De waarden hoeven niet per se op te tellen naar het aantal zoekresultaten, omdat sommige verhalen bijvoorbeeld meerdere subgenres hebben.<br>
                    De facetten zijn aan te klikken. Hierbij wordt de zoekactie uitgebreid met het facet dat u aangeklikt heeft.
                    <br>
                    <br>

                    <h4>Tijdlijn</h4>
                    De tijdlijn is er alleen om een indicatie te geven van wanneer de verhalen in de zoekresultaten zijn gehoord, of ingevoerd.
                    <br>
                    <br>

                    Meer volgt...
                </div>
            </div>
        </div>
    </div>

    <div class="toplayer" id="search_container">
        <input id="searchBox" class="input-search" data-bind="value:location_query, valueUpdate: 'afterkeydown', event: { keypress: searchKeyboardCmd}" style='min-width:100px; width:90%'/>
        <center>
        <button class="search_button" data-bind="click:doSearch">Search</button>
        <button class="reset_button" data-bind="click:emptySearchbox">Reset</button>
        </center>
    </div>

    <div class="toplayer viewer" id="timeWindowBG"></div>
    <div class="toplayer viewer" id="timeWindow"></div>

    <div class="toplayer viewer" id="infoWindowBG"></div>
    <div class="toplayer viewer" id="infoWindow" style="overflow-y:scroll; overflow-x:hidden;">
        <center><h4 id="statistieken_titel">Statistieken</h4></center>
        <div class="div_RootBody" id="pie_chart_2">
            <div class="chart"></div>
        </div>
    </div>

    <div class="toplayer viewer" id="waitWindow"><br><center>Please <br> wait..</center></div>

</html>
