window.EventTabs = ( function( window, document, $ ) {

    var app = {};

    app.cache = function() {
        app.$mainContainer    = $( '#main' );
        app.$eventTabsLink    = app.$mainContainer.find( '.event-tabs__link' );
        app.$eventTabsContent = app.$mainContainer.find( '.event-tabs__content' );
    };

    app.init = function() {
        app.cache();

        app.$eventTabsLink.first().addClass( 'event-tabs__link--active' );
        app.$eventTabsContent.first().addClass( 'event-tabs__content--active' );
        app.$eventTabsLink.on( 'click', app.switchEventsTab );
    };

    app.switchEventsTab = function() {
        var tabId = $( this ).attr( 'data-tab' );

        app.$eventTabsLink .removeClass( 'event-tabs__link--active' );
        app.$eventTabsContent.removeClass( 'event-tabs__content--active' );

        $( this ).addClass( 'event-tabs__link--active' );
        $( '#' + tabId ).addClass( 'event-tabs__content--active' );
    };

    app.init();

    return app;

}( window, document, jQuery ) );
