model.jsonModel = {
    widgets: [{
        id: "SET_PAGE_TITLE",
        name: "alfresco/header/SetTitle",
        config: {
            title: "Book Management - Status"
        }
    },
        {
            id: "BOOKSTATUS_PAGE_HORIZONTAL_WIDGET_LAYOUT",
            name: "alfresco/layout/HorizontalWidgets",
            config: {
                widgetWidth: 50,
                widgets: [
                    {
                        id: "BOOKSTATUS_PAGE_LOGO",
                        name: "alfresco/logo/Logo",
                        config: {
                            logoClasses: "alfresco-logo-only"
                        }
                    },
                    {
                        id: "BOOKSTATUS_PAGE_WIDGET",
                        name: "bestpubwidgets/BookStatusWidget"
                    }
                ]
            }
        }]
};