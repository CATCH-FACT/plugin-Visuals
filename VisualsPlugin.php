<?php
define('VISUAL_RESTRICT_RESULTS', 10000);
define('VISUALS_MAX_ITEMS_PER_PAGE', 1000);
define('VISUALS_DEFAULT_ITEMS_PER_PAGE', 50);
if (!defined('VISUALS_PLUGIN_DIR')) {
    define('VISUALS_PLUGIN_DIR', dirname(__FILE__));
}

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
            'public_items_show',
#            'public_items_search',
#            'items_browse_sql',
            'public_head',
            );



    public function hookPublicItemsShow($args){
//        get_view()->addHelperPath(dirname(__FILE__) . '/helpers', 'Visuals_View_Helper_');
#        $view = $args['view'];
#        $view->addHelperPath(VISUALS_PLUGIN_DIR . '/helpers', 'Visuals_View_Helper_');
    }

    public function hookPublicHead($args){
        get_view()->addHelperPath(dirname(__FILE__) . '/helpers', 'Visuals_View_Helper_');
#        $view = $args['view'];
#        $view->addHelperPath(VISUALS_PLUGIN_DIR . '/helpers', 'Visuals_View_Helper_');
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