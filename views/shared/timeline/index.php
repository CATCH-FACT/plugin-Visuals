<?php

/**
 * @package     omeka
 * @subpackage  solr-search
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */
 
queue_js_file('d3.min');
queue_js_file('labella.min');
queue_js_file('d3kit.min');
queue_js_file('d3kit-timeline.min');
queue_js_file('verhalen_timeline');

queue_css_file('labella');
queue_css_file('verhalen_timeline');
if (!is_admin_theme()) { 
    queue_css_file('results');
}

echo head(array('title' => __('Browse Timeline'),
                'bodyid'=>'timeline',
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
    			<?php $url = SolrSearch_Helpers_Facet::removeFreeSearch($free[0], $free[1], "/visuals/timeline"); ?>
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
    			<?php $url = SolrSearch_Helpers_Facet::removeFacet($fac[0], $fac[1], "/visuals/timeline"); ?>
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
}?>

<div id="solr-facets">

  <h2><?php echo __('Limit your search'); ?></h2>
  <!-- In order from the settings -->
  <?php foreach ($order as $facet_name): ?>
   <?php foreach ($results->facet_counts->facet_fields as $name => $facets): ?>
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
                <?php $url = SolrSearch_Helpers_Facet::addFacet($name, $value, "/visuals/timeline"); ?>

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
    $uri = apply_filters('items_search_default_url', url('visuals/timeline'));
//    $href = $uri . (!empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : '');
//    $href .= !isset($_GET['timelinesource']) ? "&timelinesource=tag" : "";
//    $cloudsource = isset($_GET['cloudsource']) ? $_GET['cloudsource'] : "tag";
    #print $href;
    ?>

  <!-- Number found. -->
  <h2 id="num-found">
    <?php echo $results->response->numFound . " " . __("results for") . " \"" . (array_key_exists('q', $_GET) ? $_GET['q'] : '') . "\""; ?>
  </h2>

  <div class="chart-container">
      <h2>Decennium timeline</h2>
      <div id="decenniumtimeline"></div>
      <br>
      <h2>Volksverhaal timeline (maximaal 1000)</h2>
      <div id="labellatimeline"></div>
  </div>

  <!-- Prepare results to be digestable by labella -->
  <textarea id="alldates" style="visibility:hidden;">
[<?php $separator = "";?>
<?php foreach ($results->response->docs as $doc):?>
<?php echo $separator; ?>{"date":<?php echo json_encode($doc->date_start); ?>, "subgenre":<?php echo json_encode($doc->subgenre); ?>, "title":<?php echo json_encode($doc->title); ?>, "modelid":<?php echo json_encode($doc->modelid); ?>}
<?php $separator = ","; ?>
<?php endforeach; ?>]
  </textarea>

<!-- Prepare decennium results to be digestable by decennium timeline -->
  <textarea id="alldecennia" style="visibility:hidden;">
<?php echo json_encode($results->facet_counts->facet_fields->decennium_group); ?>
  </textarea>

  <script type="text/javascript" src="<?php echo src("decennium_timeline", "javascripts", 'js'); ?>"></script>
  <script type="text/javascript" src="<?php echo src("labella_timeline", "javascripts", 'js'); ?>"></script>
  
</div>

<?php //echo pagination_links(); ?>
<?php echo foot();
