<?php

class Visuals_OriginalmapController extends Omeka_Controller_AbstractActionController
{
    public function init()
    {
        $this->_helper->db->setDefaultModelName('Item');
    }
    
    public function indexAction()
    {        
        $this->view->addHelperPath(VISUALS_PLUGIN_DIR . '/helpers', 'Visuals_View_Helper_');

        $pluralName = $this->view->pluralize($this->_helper->db->getDefaultModelName());
        
        $table = $this->_helper->db->getTable();
        
        $params = $this->getAllParams();
    }
}