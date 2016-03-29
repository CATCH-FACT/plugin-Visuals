<?php
define('VISUAL_RESTRICT_RESULTS', 10000);
define('VISUALS_MAX_ITEMS_PER_PAGE', 1000);
define('VISUALS_DEFAULT_ITEMS_PER_PAGE', 50);
if (!defined('VISUALS_PLUGIN_DIR')) {
    define('VISUALS_PLUGIN_DIR', dirname(__FILE__));
}

if (!defined('VISUALS_DIR')) define('VISUALS_DIR', dirname(__FILE__));

require_once VISUALS_DIR.'/helpers/VisualsHelpersFacet.php';

class VisualsPlugin extends Omeka_Plugin_AbstractPlugin
{
    protected $_hooks = array(
#            'install',
            'initialize',
            'uninstall',
            'config_form',
            'config',
#            'define_acl',
#            'define_routes',
//            'public_items_show',
            'public_items_show_sidebar_ultimate_top',
            'admin_items_show',
#            'public_items_search',
#            'items_browse_sql',
            'public_head',
            'admin_head',
            );

    private function itemShowNetwork(){

        $view = get_view();
        if(isset($view->item)) {
            $recordid = $view->item->id;
        }

        $nodenetwork_url = url(array('module'=>'visuals','controller'=>'nodes'), 
                                'default',
                                array(  "ids" => $recordid,
//                                        "reconnect" => true,
                                        "minscore" => "1.2",
                                        "depth" => 2)
                                );
        
        $return_html = '     <h2 style="margin:0px">' . __("Vergelijkbare verhalen") . '</h2>';
        $return_html .= '     <a href="' . $nodenetwork_url . '" target="network">Naar geavanceerde netwerkvisualisatie</a>';

        return $return_html;
    }

    public function hookAdminItemsShow($args){
        print '<div id="item-nodes" class="element" style="border-style:solid;border-width:5px;">';
        print $this->itemShowNetwork();
        print "</div>";
    }

    public function hookPublicItemsShowSidebarUltimateTop($args){
        print '<div id="item-nodes" class="element" style="padding:0px">';
        print $this->itemShowNetwork();
        print "</div>";
    }


    public function hookPublicHead($args){
        $this->_headCode($args);
    }

    public function hookAdminHead($args){
        $this->_headCode($args);
    }        

    public function _headCode($args){
        
        $view = get_view();
        
        $view->addHelperPath(dirname(__FILE__) . '/helpers', 'Visuals_View_Helper_');
        
        $data_proxy =  js_escape(url('/visuals/proxy'));
        
        $request = Zend_Controller_Front::getInstance()->getRequest();
        $module = $request->getModuleName();
        $controller = $request->getControllerName();
        $action = $request->getActionName();
        
        //only queue when in item-show view AND when Item present:
        if (($controller == 'items' && $action == 'show') && (isset($view->item))) {
            
            $js_code = "window.onload = function () {

                var search_proxy = " . $data_proxy . ";

                var waiting_time = 50;

                var item_id =\"" . $view->item->id . "\";

                var vm = new ViewModel(item_id, search_proxy);
                ko.applyBindings(vm);

                var nodeman = new NodeViewer(vm, '#item-nodes');
                nodeman.init();

            // initial search in solr db
                vm.id_search_query(item_id);
                vm.doIdSearch();

            // search with a depth of 1
                setTimeout(function(){
                    NeighborNeighbor(1, 50, 1.4, vm);
                }, waiting_time);
            }";
            queue_js_file('knockout');
            queue_js_file('d3.min');
            queue_js_file('nodes_main');
            queue_js_file('nodes');
            queue_css_file('nodes');
            queue_js_string($js_code);
        }
    }
            
    protected $_filters = array(
#            'response_contexts',
#            'action_contexts',
#            'admin_items_form_tabs',
            'public_navigation_items',
            );

    public function hookInitialize(){
        $lang = "nl";
        add_translation_source(dirname(__FILE__) . '/languages');
    }

    public function hookInstall()
    {
        set_option('visuals_restrict_results', VISUAL_RESTRICT_RESULTS);
        set_option('visuals_wordle_browse', "1");
        set_option('visuals_wordle_show', "1");
        set_option('visuals_per_page', VISUALS_DEFAULT_ITEMS_PER_PAGE);
    }

    public function hookUninstall()
    {
        // Delete the plugin options
        delete_option('visuals_restrict_results');
        delete_option('visuals_wordle_browse');
        delete_option('visuals_wordle_show');
        delete_option('visuals_per_page');
    }

    public function hookConfig($args)
    {
        // Use the form to set a bunch of default options in the db
        set_option('visuals_wordle_browse', $_POST['visuals_wordle_browse']);
        set_option('visuals_wordle_show', $_POST['visuals_wordle_show']);
        set_option('visuals_restrict_results', $_POST['visuals_restrict_results']);
        $perPage = (int)$_POST['visuals_per_page'];
        if ($perPage <= 0) {
            $perPage = VISUALS_DEFAULT_ITEMS_PER_PAGE;
        } else if ($perPage > VISUALS_DEFAULT_ITEMS_PER_PAGE) {
            $perPage = VISUALS_MAX_ITEMS_PER_PAGE;
        }
        set_option('visuals_per_page', $perPage);
    }
    
    public function hookConfigForm()
    {
        include 'config_form.php';
    }
        
    /**
     * Return HTML for a link to the same search visualized on a map
     *
     * @return string
     */
    function link_to_wordcloud()
    {
//        if ($user = current_user()){
            $uri = 'visuals/cloud';
            $props = $uri . (!empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : '');
            return $props;
//        }
    }

    public function filterPublicNavigationItems($navArray){
        $navArray['Wordcloud'] = array(
                                        'label'=>__('Resultaten visueel'),
                                        'uri' => url($this->link_to_wordcloud())
                                        );
        return $navArray;        
    }
}