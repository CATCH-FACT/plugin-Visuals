<?php

class Visuals_CloudController extends Omeka_Controller_AbstractActionController
{
    public function init()
    {
        $this->_helper->db->setDefaultModelName('Item');
    }
    
    public function browseAction()
    {        
        $this->view->addHelperPath(VISUALS_PLUGIN_DIR . '/helpers', 'Visuals_View_Helper_');

        $pluralName = $this->view->pluralize($this->_helper->db->getDefaultModelName());
        
        $table = $this->_helper->db->getTable();
        
        $params = $this->getAllParams();
        $currentPage = $this->getParam('page', 1);
        $limit = (int)get_option('visuals_restrict_results');
        $records = $this->_helper->db->findBy($params, $limit);
        $this->view->totalItems = $table->count($params);
        $this->view->items = $records;
        
#        $params = array('page'  => $currentPage,
#                'per_page'      => $limit,
#                'total_results' => $this->view->totalItems);
        
#        Zend_Registry::set('cloud_params', $params);
        
        // Make the pagination values accessible from pagination_links().
#        Zend_Registry::set('pagination', $params);
#        parent::browseAction();
    }
}