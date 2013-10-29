<?php

class Visuals_View_Helper_ItemCloud extends Zend_View_Helper_Abstract
{    
    
    public function itemCloud($field = "Item Type Metadata,Text", $separator = " ")
    {   
#        print_r($this->view->items);
        $fields = explode(",", $field);
        $html = "";
        foreach($this->view->items as $item){
            if ($field == "Tag"){
                $html .= $separator . tag_string($item, $link=null, $delimiter=', ');
            }
            elseif (metadata($item, array($fields[0], $fields[1]))){
                $html .= $separator . metadata($item, array($fields[0], $fields[1]));
            }
        }
         return $html;   
    }    
}