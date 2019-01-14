<?php
/**
 * Template Name: Events
 */

/**
 * Class PageEvents
 */
class PageEvents extends MiddleModel {

    /**
     * Enable DustPress.js usage
     *
     * @var array
     */
    protected $api = [ 'QueryUpcomingEvents', 'QueryAllEvents' ];

    /**
     * Query upcoming events for the events page.
     * This function also handles pagination.
     *
     * @return array|bool|WP_Query
     */
    public function QueryUpcomingEvents() {
        $args = $this->get_args();

        // Ajax requests set the page parameter.
        $page = isset( $args->page ) ? $args->page : 1;

        return $this->get_upcoming_events( $page );
    }

    /**
     * Query all events for the events page.
     * This function also handles pagination.
     *
     * @return array|bool|WP_Query
     */
    public function QueryAllEvents() {
        $args = $this->get_args();

        // Ajax requests set the page parameter.
        $page = isset( $args->page ) ? $args->page : 1;

        return $this->get_all_events( $page );
    }
}
