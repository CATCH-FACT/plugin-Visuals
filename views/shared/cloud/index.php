<?php

/**
 * @package     omeka
 * @subpackage  solr-search
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */
 
queue_js_file('d3.min');
queue_js_file('d3.layout.cloud');

queue_css_file('cloud');
queue_css_file('results');

if (!is_admin_theme()) { 
    queue_css_file('results');
}



echo head(array('title' => __('Browse Wordcloud'),
                'bodyid'=>'cloud',
                'bodyclass' => 'browse')); 
?>

<script type="text/javascript" charset="utf-8">
//<![CDATA[
    
jQuery(window).load(function () {
    //For showing less facets
    
    jQuery(function(){

    	var maxItems = 5;
    	//var fullHeight = hiddenContent.height();

    	jQuery('.facet').each(function() {
    		var ul = jQuery(this).find('ul');

    		if(ul.children('li').size() <= maxItems) return;

    		var hiddenElements = ul.find('li:gt(' + maxItems + ')').hide();

    		var showCaption = <?php echo '"[+] ' . __('Show remaining') . ' "'; ?> + hiddenElements.size();
    		
    		ul.append(
    			jQuery('<li class="facet-show-more" style="content:+"><a href="#">' + showCaption + '</a></li>').click( function(e){
    					e.preventDefault();
    					if(jQuery(this).siblings(':hidden').length > 0){
    						jQuery(this).siblings(':hidden').slideDown(200);
    						jQuery(this).find('a').text(<?php echo '"[-] ' . __('Show less') . '"'; ?>);
    					}else{
    						hiddenElements.slideUp(200);
    						jQuery(this).find('a').text(showCaption);
    						jQuery(this).show();
    					}
    				}
    			)
    		);

    	});
    });
});
//]]>
</script>

<h1><?php echo __('Search the Collection'); ?></h1>

<style>
	#content > div{
		-webkit-box-shadow: none;
		box-shadow: none;
	}
</style>

<!-- Search form. -->
  <form id="solr-search-form">
    <span class="float-wrap">
      <input style="width:350px;" type="text" title="<?php echo __('Search keywords') ?>" name="q" value="<?php
        echo array_key_exists('q', $_GET) ? $_GET['q'] : '';
      ?>" />
      <input type="submit" value="<?php echo __("Search"); ?>" />&nbsp&nbsp
      <?php echo SolrSearch_Helpers_View::link_to_advanced_search(__('Advanced Search')); ?>  
    </span>
  </form>

<br>

<!-- Applied free search. -->
<?php   

$applied_freesearch = SolrSearch_Helpers_Facet::parseFreeSearch(); 
$applied_facets = SolrSearch_Helpers_Facet::parseFacets();

?>


<div id="solr" style="border:0px">
    <!-- Applied facets. -->
    <div id="solr-applied-facets" style="float:left">
        <ul>
    		<!-- Get the applied free searches. -->
    		<?php 
    			$count = 0;
    			foreach ($applied_freesearch as $free): 
    				$count++;
    		?>
    		  <li>

    			<!-- Facet label. -->
    			<?php $label = SolrSearch_Helpers_Facet::keyToLabel($free[0]); ?>
    			<span class="applied-facet-label"><?php echo __($label) . " (vrij)"; ?>:</span>
    			<span class="applied-facet-value"><?php echo $free[1]; ?></span>

    			<!-- Remove link. -->
    			<?php $url = SolrSearch_Helpers_Facet::removeFreeSearch($free[0], $free[1], "/visuals/cloud"); ?>
    			(<a href="<?php echo $url; ?>"><?php echo __('remove'); ?></a>)

    		  </li>
    		<?php
    			endforeach;		
    		?>
    	</ul>
	    <ul>
    		<!-- Get the applied facets. -->
    		<?php 
    			foreach ($applied_facets as $fac): 
    				$count++;
    		?>
    		  <li>

    			<!-- Facet label. -->
    			<?php $label = SolrSearch_Helpers_Facet::keyToLabel($fac[0]); ?>
    			<span class="applied-facet-label"><?php echo __($label); ?>:</span>
    			<span class="applied-facet-value"><?php echo $fac[1]; ?></span>

    			<!-- Remove link. -->
    			<?php $url = SolrSearch_Helpers_Facet::removeFacet($fac[0], $fac[1], "/visuals/cloud"); ?>
    			(<a href="<?php echo $url; ?>"><?php echo __('remove'); ?></a>)

    		  </li>
    		<?php
    			endforeach;		
    		?>
    	</ul>
	
    	<?php if($count == 0) echo '<span>Geen filters geactiveerd</span>' ?>
    </div>
    
    <?php echo SolrSearch_Helpers_View::visualize_results_functions($_REQUEST); ?>
</div>


<!-- Facets. -->
<?php 

$facet_order = get_option("solr_search_display_facets_order");

if ($facet_order) {
    $order = preg_split("/[\r\n]+/", $facet_order);
} else {
    $order = array();
}

?>

<div id="solr-facets">

  <h2><?php echo __('Limit your search'); ?></h2>
  <!-- In order from the settings -->
  <?php foreach ($order as $facet_name): ?>
   <?php foreach ($results->facet_counts->facet_fields as $name => $facets): ?>
    <!-- Does the facet have any hits? -->
    <?php if (count(get_object_vars($facets)) && ($name == $facet_name )): ?>
      <!-- Facet label. -->
      <div class="facet">
          <?php $label = __(SolrSearch_Helpers_Facet::keyToLabel($name)); ?>
          <strong><?php echo $label; ?></strong>

          <?php 
          if($label == 'Date'):
            //new type of input: range
          ?>
          <?php else:
            //nothing
          ?>
          <ul>
            <!-- Facets. -->
            <?php foreach ($facets as $value => $count): ?>
              <li class="<?php echo $value; ?>">

                <!-- Facet URL. -->
                <?php $url = SolrSearch_Helpers_Facet::addFacet($name, $value, "/visuals/cloud"); ?>

                <!-- Facet link. -->
                <a href="<?php echo $url; ?>" class="facet-value">
                  <?php echo $value; ?>
                </a>

                <!-- Facet count. -->
                (<span class="facet-count"><?php echo $count; ?></span>)

              </li>
            <?php endforeach; ?>
            <?php endif; ?>
          </ul>
      </div>
    <?php endif; ?>
   <?php endforeach; ?>
  <?php endforeach; ?>
</div>


<!-- Results. -->
<div id="solr-results">

    <?php 
    $uri = apply_filters('items_search_default_url', url('visuals/cloud'));
    $href = $uri . (!empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : '');
    $href .= !isset($_GET['cloudsource']) ? "&cloudsource=tag" : "";
    $cloudsource = isset($_GET['cloudsource']) ? $_GET['cloudsource'] : "tag";
    #print $href;
    ?>

  <!-- Number found. -->
  <h2 id="num-found">
    <?php echo $results->response->numFound . " " . __("results for") . " \"" . (array_key_exists('q', $_GET) ? $_GET['q'] : '') . "\""; ?>
  </h2>

      <p><label for="cloudsource">Wordcloud gebaseerd op informatie uit:</label></p>
          <select name="cloudsource" id="cloudsource" value="<?php print $cloudsource; ?>" onchange="document.location.href = '<?php echo substr($href, 0, strpos($href, "cloudsource=")+12); ?>' + this.value">
              <option value="tag"><?php print __("Tags"); ?> </option>
              <option value="65_s"><?php print __("Named Entity Location"); ?> </option>
              <option value="63_s"><?php print __("Named Entity"); ?> </option>
              <option value="locality"><?php print __("Locality"); ?> </option>
          </select>
          <script type="text/javascript">
              document.getElementById('cloudsource').value = "<?php echo $cloudsource;?>";
          </script>
      <link rel="image_src" href="amazing.png">
      <center><div id="vis"></div></center>
      <form id="form">
        <p style="position: absolute; right: 0; top: 0" id="status"></p>
        <div style="text-align: center">
          <div id="presets"></div>
          <div id="custom-area">
              <p><textarea id="text">
                  <?php print json_encode($all_facets->facet_counts->facet_fields->{strtolower($cloudsource)}); ?>
            </textarea>
            <button type='button' id="go">HERLADEN</button>
            </div>
          </div>        
      <hr>

      <div style="float: right; text-align: right">
        <p><label for="max">Maximum aantal woorden:</label> <input type="number" value="250" min="1" id="max">
        <p><label>Download:</label>
          <a id="download-svg" href="#" target="_blank">SVG</a> |
          <a id="download-png" href="#" target="_blank">PNG</a>
      </div>

      <div style="float: left">
        <p><label>Spiral:</label>
          <label for="archimedean"><input type="radio" name="spiral" id="archimedean" value="archimedean" checked="checked"> Archimedean</label>
          <label for="rectangular"><input type="radio" name="spiral" id="rectangular" value="rectangular"> Rectangular</label>
        <p><label for="scale">Scale:</label>
          <label for="scale-log"><input type="radio" name="scale" id="scale-log" value="log"> log n</label>
          <label for="scale-sqrt"><input type="radio" name="scale" id="scale-sqrt" value="sqrt"> √n</label>
          <label for="scale-linear"><input type="radio" name="scale" id="scale-linear" value="linear" checked="checked"> n</label>
        <p><label for="font">Font:</label> 
            <select id="font" value="Impact">
              <option value="Impact">Impact</option>
              <option value="Times">Times</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Arial">Arial</option>
              <option value="Courier">Courier</option>
              <option value="Lucida Console">Lucida Console</option>
              <option value="Herculanum">Herculanum</option>
              <option value="Apple Chancery">Apple Chancery</option>
            </select>
      </div>

      <div id="angles">
        <p><input type="number" id="angle-count" value="5" min="1"> <label for="angle-count">orientaties</label>
          <label for="angle-from">van</label> <input type="number" id="angle-from" value="-30" min="-90" max="90"> °
          <label for="angle-to">tot</label> <input type="number" id="angle-to" value="30" min="-90" max="90"> °
      </div>

      <hr style="clear: both">

      </form>
      <script type="text/javascript" src="<?php echo src("cloudifier", "javascripts", 'js'); ?>"></script>

  <?php #loading wordcloud based on solr statistics ?>

  <?php #include 'result-list.php';?>

</div>

<?php //echo pagination_links(); ?>
<?php echo foot();
