<?php
/**
 * This is the default model class for our theme.
 */

/**
 * Class Index
 */
class Index extends MiddleModel {
    /**
     * Fetch recent posts.
     *
     * @return WP_Query
     */
    public function Query() {
        return $this->get_all_posts();
    }
}
