<?php

class Visuals_TimelineController extends Omeka_Controller_AbstractActionController
{
    
    /**
     * Cache the facets table.
     */
    public function init()
    {
        $this->_fields = $this->_helper->db->getTable('SolrSearchField');
        $this->session = new Zend_Session_Namespace();
    }
    
    /**
     * Display Solr results.
     */
    public function indexAction()
    {
        $this->view->addHelperPath(VISUALS_PLUGIN_DIR . '/helpers', 'Visuals_View_Helper_');
        
        // Get pagination settings.
//        $limit = get_option('per_page_public');
//        $page  = $this->_request->page ? $this->_request->page : 1;
//        $start = ($page-1) * $limit;
        $limit = 1000;
        $start = 0;
        $page  = 1;
        


        // determine whether to display private items or not
        // items will only be displayed if:
        // solr_search_display_private_items has been enabled in the Solr Search admin panel
        // user is logged in
        // user_role has sufficient permissions

        $user = current_user();
        if(get_option('solr_search_display_private_items')
            && $user
            && is_allowed('Items','showNotPublic')) {
            // limit to public items
            $limitToPublicItems = false;
        } else {
            $limitToPublicItems = true;
        }

        // Execute the query.
        $results = $this->_search($start, $limit, $limitToPublicItems);
        
        $facets = $this->_search_facets(1000, $limitToPublicItems);

        // Push results to the view.
        $this->view->results = $results;
        $this->view->all_facets = $facets;
    }
    

    /**
     * Pass setting to Solr search
     *
     * @param int $offset Results offset
     * @param int $limit  Limit per page
     * @return SolrResultDoc Solr results
     */
    protected function _search_facets($facet_limit, $limitToPublicItems = true)
    {

        // Connect to Solr.
        $solr = SolrSearch_Helpers_Index::connect();

        // Get the parameters.
        $params = $this->_getParameters();
        $params["facet.limit"] = $facet_limit;

        // Construct the query.
        $query = $this->_getQuery($limitToPublicItems);

        // Execute the query.
        return $solr->search($query, 0, 1, $params);

    }


    /**
     * Pass setting to Solr search
     *
     * @param int $offset Results offset
     * @param int $limit  Limit per page
     * @return SolrResultDoc Solr results
     */
    protected function _search($offset, $limit, $limitToPublicItems = true)
    {

        // Connect to Solr.
        $solr = SolrSearch_Helpers_Index::connect();

        // Get the parameters.
        $params = $this->_getParameters();
        $params['fl'] = "date_start, subgenre, title, modelid"; //OMZETTEN NAAR OMEKA CODES!
        
        // Construct the query.
        $query = $this->_getQuery($limitToPublicItems);

        // Execute the query.
        return $solr->search($query, $offset, $limit, $params);

    }


    /**
     * Form the complete Solr query.
     *
     * @return string The Solr query.
     */
    protected function _getQuery($limitToPublicItems = true)
    {

        // Get the `q` GET parameter.
        $query = $this->_request->q;

        // If defined, replace `:`; otherwise, revert to `*:*`.
        // Also, clean it up some.
        if (!empty($query)) {
            $query = str_replace(':', ' ', $query);
            $to_remove = array('[', ']');
            foreach ($to_remove as $c) {
                $query = str_replace($c, '', $query);
            }
        } else {
            $query = '*:*';
        }

        // Get the `facet` GET parameter
        $facet = $this->_request->facet;

        // Form the composite Solr query.
        if (!empty($facet)) $query .= " AND {$facet}";

        // Limit the query to public items if required
        if($limitToPublicItems) {
           $query .= ' AND public:"true"';
        }

        // Get the `free` search GET parameter (pre-turned into string)
        $free = "{$this->_request->free}";

        $to_remove_free = array('{', '}');
        foreach ($to_remove_free as $c) {
            $free = str_replace($c, '', $free);
        }

        // Form the composite Solr query.
        if (!empty($free)) $query .= " AND $free";

        $this->session->query = $query;
        $this->view->query = $this->_request->q;
        $this->view->facet = $this->_request->facet;
        $this->view->free = $this->_request->free;
        return $query;
    }


    /**
     * Construct the Solr search parameters.
     *
     * @return array Array of fields to pass to Solr
     */
    protected function _getParameters()
    {

        // Get a list of active facets.
        $facets = $this->_fields->getActiveFacetKeys();

        return array(

            'facet'               => 'true',
            'facet.field'         => $facets,
            'facet.mincount'      => 1,
            'facet.limit'         => get_option('solr_search_facet_limit'),
            'facet.sort'          => get_option('solr_search_facet_sort'),
            'hl'                  => get_option('solr_search_hl')?'true':'false',
            'hl.snippets'         => get_option('solr_search_hl_snippets'),
            'hl.fragsize'         => get_option('solr_search_hl_fragsize'),
            'hl.maxAnalyzedChars' => get_option('solr_search_hl_max_analyzed_chars'),
            'hl.fl'               => '*_t'

        );

    }

}