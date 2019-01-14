window.EventList = ( function( window, document, $ ) {

    var app = {
        upcomingEventsCurrentPage: 1,
        allEventsCurrentPage: 1
    };

    app.cache = function() {
        app.$mainContainer            = $( '#main' );
        app.$upcomingEventsList       = $( '#event-list__list--upcoming' );
        app.$allEventsList            = $( '#event-list__list--all' );
        app.$loadMoreUpcomingEvents   = app.$mainContainer.find( '#event-list__load-more--upcoming' );
        app.$loadMoreAllEvents        = app.$mainContainer.find( '#event-list__load-more--all' );
        app.upcomingEventsMaxNumPages = parseInt( app.$loadMoreUpcomingEvents.data( 'max-num-pages' ) );
        app.allEventsMaxNumPages      = parseInt( app.$loadMoreAllEvents.data( 'max-num-pages' ) );
    };

    app.init = function() {
        app.cache();

        app.$loadMoreUpcomingEvents.on( 'click', app.loadMoreUpcomingEvents );
        app.$loadMoreAllEvents.on( 'click', app.loadMoreAllEvents );
    };

    app.loadMoreUpcomingEvents = function( e ) {
        if ( e.preventDefault ) {
            e.preventDefault;
        }

        // Load more with DustPress.js
        dp( 'PageEvents/QueryUpcomingEvents', {
            args: {
                page: ++app.upcomingEventsCurrentPage
            },
            tidy: true,
            partial: 'event-list',
            success: function( response ) {
                app.$upcomingEventsList.append( response );
                if ( app.upcomingEventsCurrentPage === app.upcomingEventsMaxNumPages ) {
                    app.$loadMoreUpcomingEvents.hide();
                }
            },
            error: function( error ) {
                console.log( error );
            }
        });

        return false;
    };

    app.loadMoreAllEvents = function( e ) {
        if ( e.preventDefault ) {
            e.preventDefault;
        }

        // Load more with DustPress.js
        dp( 'PageEvents/QueryAllEvents', {
            args: {
                page: ++app.allEventsCurrentPage
            },
            tidy: true,
            partial: 'event-list',
            success: function( response ) {
                app.$allEventsList.append( response );
                if ( app.allEventsCurrentPage === app.allEventsMaxNumPages ) {
                    app.$loadMoreAllEvents.hide();
                }
            },
            error: function( error ) {
                console.log( error );
            }
        });

        return false;
    };

    app.init();

    return app;

}( window, document, jQuery ) );
