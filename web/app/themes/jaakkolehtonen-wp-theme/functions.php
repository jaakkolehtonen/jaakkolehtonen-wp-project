<?php
/**
 * Theme functions.
 */

namespace Jaakko\Lehtonen\WP\Theme;

// Enable DustPress.
if ( function_exists( 'dustpress' ) ) {
    \DustPress();
} else {
    wp_die( 'DustPress must be installed when using the DustPress Starter Theme!' );
}

// Define some constants.
if ( ! defined( 'ASSETS_DIR' ) ) {
    define( 'ASSETS_DIR', get_template_directory_uri() . '/assets' );
}

if ( ! defined( 'THEME_DIR' ) ) {
    define( 'THEME_DIR', get_template_directory_uri() );
}

/**
 * Theme setup
 */
function setup() {
    // Make theme available for translation
    \load_theme_textdomain( 'jaakkolehtonen-wp-theme', get_template_directory() . '/languages' );
    // Enable plugins to manage the document title
    // http://codex.wordpress.org/Function_Reference/add_theme_support#Title_Tag
    \add_theme_support( 'title-tag' );
    // Enable HTML5 markup support
    // http://codex.wordpress.org/Function_Reference/add_theme_support#HTML5
    \add_theme_support(
        'html5',
        [ 'caption', 'comment-form', 'comment-list', 'gallery', 'search-form' ]
    );
}

\add_action( 'after_setup_theme', __NAMESPACE__ . '\\setup' );

/**
 * Add theme scripts and styles.
 */
function scripts_and_styles() {
    $theme   = \wp_get_theme();
    $version = $theme->get( 'Version' );

    /**
     * If WP is in script debug, or we pass ?script_debug in a URL - set debug to true.
     */
    $debug = ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) || ( isset( $_GET['script_debug'] ) ) ? true : false; // WPCS: CSRF OK.

    /**
     * Should we load minified files?
     */
    $suffix = ( true === $debug ) ? '' : '.min';

    \wp_enqueue_script( 'theme-scripts', ASSETS_DIR . '/scripts/global' . $suffix . '.js', [ 'jquery' ], $version, true );
    \wp_enqueue_style( 'theme-style', THEME_DIR . '/style' . $suffix . '.css', [], $version );
}

\add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\scripts_and_styles' );

/**
 * Remove menu pages.
 */
function remove_menu_pages() {
	\remove_menu_page( 'edit.php' );
}

\add_action( 'admin_menu', __NAMESPACE__ . '\\remove_menu_pages' );

/**
 * Remove admin bar links.
 */
function remove_admin_bar_links() {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu( 'new-post' );
}

\add_action( 'wp_before_admin_bar_render', __NAMESPACE__ . '\\remove_admin_bar_links' );

/**
 * Disable new post.
 */
function disable_new_post() {
    if ( \get_current_screen()->post_type === 'post' ) {
        wp_die( "You ain't allowed to do that!" );
    }
}
\add_action( 'load-post-new.php', __NAMESPACE__ . '\\disable_new_post' );

/**
 * Registers the `event` post type.
 */
function event_init() {
    \register_post_type(
        'event',
        array(
            'labels'                => array(
                'name'                  => __( 'Events', 'jaakkolehtonen-wp-theme' ),
                'singular_name'         => __( 'Event', 'jaakkolehtonen-wp-theme' ),
                'all_items'             => __( 'All Events', 'jaakkolehtonen-wp-theme' ),
                'archives'              => __( 'Event Archives', 'jaakkolehtonen-wp-theme' ),
                'attributes'            => __( 'Event Attributes', 'jaakkolehtonen-wp-theme' ),
                'insert_into_item'      => __( 'Insert into Event', 'jaakkolehtonen-wp-theme' ),
                'uploaded_to_this_item' => __( 'Uploaded to this Event', 'jaakkolehtonen-wp-theme' ),
                'featured_image'        => _x( 'Featured Image', 'event', 'jaakkolehtonen-wp-theme' ),
                'set_featured_image'    => _x( 'Set featured image', 'event', 'jaakkolehtonen-wp-theme' ),
                'remove_featured_image' => _x( 'Remove featured image', 'event', 'jaakkolehtonen-wp-theme' ),
                'use_featured_image'    => _x( 'Use as featured image', 'event', 'jaakkolehtonen-wp-theme' ),
                'filter_items_list'     => __( 'Filter Events list', 'jaakkolehtonen-wp-theme' ),
                'items_list_navigation' => __( 'Events list navigation', 'jaakkolehtonen-wp-theme' ),
                'items_list'            => __( 'Events list', 'jaakkolehtonen-wp-theme' ),
                'new_item'              => __( 'New Event', 'jaakkolehtonen-wp-theme' ),
                'add_new'               => __( 'Add New', 'jaakkolehtonen-wp-theme' ),
                'add_new_item'          => __( 'Add New Event', 'jaakkolehtonen-wp-theme' ),
                'edit_item'             => __( 'Edit Event', 'jaakkolehtonen-wp-theme' ),
                'view_item'             => __( 'View Event', 'jaakkolehtonen-wp-theme' ),
                'view_items'            => __( 'View Events', 'jaakkolehtonen-wp-theme' ),
                'search_items'          => __( 'Search Events', 'jaakkolehtonen-wp-theme' ),
                'not_found'             => __( 'No Events found', 'jaakkolehtonen-wp-theme' ),
                'not_found_in_trash'    => __( 'No Events found in trash', 'jaakkolehtonen-wp-theme' ),
                'parent_item_colon'     => __( 'Parent Event:', 'jaakkolehtonen-wp-theme' ),
                'menu_name'             => __( 'Events', 'jaakkolehtonen-wp-theme' ),
            ),
            'public'                => true,
            'hierarchical'          => false,
            'show_ui'               => true,
            'show_in_nav_menus'     => true,
            'supports'              => array( 'title', 'editor', 'excerpt' ),
            'has_archive'           => false,
            'rewrite'               => true,
            'query_var'             => true,
            'menu_icon'             => 'dashicons-calendar',
            'show_in_rest'          => true,
            'rest_base'             => 'event',
            'rest_controller_class' => 'WP_REST_Posts_Controller',
        )
    );

}

add_action( 'init', __NAMESPACE__ . '\\event_init' );

/**
 * Sets the post updated messages for the `event` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `event` post type.
 */
function event_updated_messages( $messages ) {
    global $post;

    $permalink = \get_permalink( $post );

    $messages['event'] = array(
        0  => '', // Unused. Messages start at index 1.
        /* translators: %s: post permalink */
        1  => sprintf( __( 'Event updated. <a target="_blank" href="%s">View Event</a>', 'jaakkolehtonen-wp-theme' ), esc_url( $permalink ) ),
        2  => __( 'Custom field updated.', 'jaakkolehtonen-wp-theme' ),
        3  => __( 'Custom field deleted.', 'jaakkolehtonen-wp-theme' ),
        4  => __( 'Event updated.', 'jaakkolehtonen-wp-theme' ),
        /* translators: %s: date and time of the revision */
        5  => isset( $_GET['revision'] ) ? sprintf( __( 'Event restored to revision from %s', 'jaakkolehtonen-wp-theme' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false, // WPCS: CSRF OK.
        /* translators: %s: post permalink */
        6  => sprintf( __( 'Event published. <a href="%s">View Event</a>', 'jaakkolehtonen-wp-theme' ), esc_url( $permalink ) ),
        7  => __( 'Event saved.', 'jaakkolehtonen-wp-theme' ),
        /* translators: %s: post permalink */
        8  => sprintf( __( 'Event submitted. <a target="_blank" href="%s">Preview Event</a>', 'jaakkolehtonen-wp-theme' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
        /* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
        9  => sprintf(
            __( 'Event scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview Event</a>', 'jaakkolehtonen-wp-theme' ),
            date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) ),
            esc_url( $permalink )
        ),
        /* translators: %s: post permalink */
        10 => sprintf( __( 'Event draft updated. <a target="_blank" href="%s">Preview Event</a>', 'jaakkolehtonen-wp-theme' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
    );

    return $messages;
}

add_filter( 'post_updated_messages', __NAMESPACE__ . '\\event_updated_messages' );
