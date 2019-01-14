<?php

/**
 * This is the model for singular events.
 */
class SingleEvent extends MiddleModel {

    /**
     * This returns the current event.
     *
     * @return array|null|WP_Post
     */
    // public function Content() {
    //     return get_post( get_the_ID() );
    // }

    /**
     * Query upcoming events for the events page.
     * This function also handles pagination.
     *
     * @return array|bool|WP_Query
     */
    public function Content() {
        $args = $this->get_args();

        // Ajax requests set the page parameter.
        $page = isset( $args->page ) ? $args->page : 1;

        return $this->get_single_event( $page );
    }
}
