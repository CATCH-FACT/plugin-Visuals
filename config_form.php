<div class="field">
    <div class="two columns alpha">
        <label for="visuals_per_page">Maximum number of Items Per Page:</label>    
    </div>    
    <div class="inputs five columns omega">
        <p class="explanation">The number of items displayed in a list. (Maximum is <?php echo VISUALS_MAX_ITEMS_PER_PAGE; ?>).</p>
        <div class="input-block">        
        <input type="text" class="textinput"  name="visuals_per_page" size="4" value="<?php echo get_option('visuals_per_page'); ?>" id="visuals_per_page"/>
        </div>
    </div>
</div>

<div class="field">
    <div class="two columns alpha">
        <label for="visuals_restrict_results">Maximum number of Items Per visualization:</label>    
    </div>    
    <div class="inputs five columns omega">
        <p class="explanation">The number of items used for a visualization. (Maximum is <?php echo VISUAL_RESTRICT_RESULTS; ?>). Setting high numbers might significantly slow down or crash your server.</p>
        <div class="input-block">        
        <input type="text" class="textinput"  name="visuals_restrict_results" size="4" value="<?php echo get_option('visuals_restrict_results'); ?>" id="visuals_restrict_results"/>
        </div>
    </div>
</div>

<div class="field">
    <div class="two columns alpha">
        <label for="visuals_wordle_browse"><?php echo __('Show wordcloud in search results'); ?></label>    
    </div>    
    <div class="inputs five columns omega">
        <p class="explanation"><?php echo __('Show a link to make a wordcloud in the search results.'); ?></p>
        <div class="input-block">        
        <?php echo get_view()->formCheckbox('visuals_wordle_browse', true, 
         array('checked'=>(boolean)get_option('visuals_wordle_browse'))); ?>        
        </div>
    </div>
</div>

<div class="field">
    <div class="two columns alpha">
        <label for="visuals_wordle_show"><?php echo __('Show wordcloud in show Item'); ?></label>    
    </div>    
    <div class="inputs five columns omega">
        <p class="explanation"><?php echo __('Show a link to make a wordcloud for a single Item.'); ?></p>
        <div class="input-block">        
        <?php echo get_view()->formCheckbox('visuals_wordle_show', true, 
         array('checked'=>(boolean)get_option('visuals_wordle_show'))); ?>        
        </div>
    </div>
</div>