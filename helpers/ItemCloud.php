<?php

class Visuals_View_Helper_ItemCloud extends Zend_View_Helper_Abstract
{    
    
    public function itemCloud($field = "Text")
    {   
#        print_r($this->view->items);
        $html = "";
        foreach($this->view->items as $item){
            if (metadata($item, array('Item Type Metadata', $field))){
                $html .= " " . metadata($item, array('Item Type Metadata', $field));
            }
        }
         return $html;   
    }    
}