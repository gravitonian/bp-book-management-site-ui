/*
Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Aikau Dashlet displaying Best Publishing book events in a vertical layout.
 *
 * @module bestpub/dashlets/BookEventsDashlet
 * @extends alfresco/dashlets/Dashlet
 * @author martin.bergljung@marversolutions.org
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/I18nUtils",
        "alfresco/dashlets/Dashlet"],
    function(declare, AlfCore, I18nUtils, Dashlet) {

        return declare([Dashlet], {
            /*
             * Add padding to the body.
             * smallpad (4px padding), mediumpad (10px padding - recommended) and largepad (16px padding)
             */
            additionalCssClasses: "mediumpad",

            /**
             * Explicit height in pixels of the Dashlet body.
             */
            bodyHeight: 200,

            /**
             * Id that will be used to store properties for this Dashlet.
             * i.e. the Dashlet height when using the resizer.
             */
            componentId: "component.bookevents-dashlet",

            /**
             * The i18n scope to use for this Dashlet.
             */
            i18nScope: "bestpub.dashlets.BookEventsDashlet",

            /**
             * An array of the i18n files to use with this Dashlet.
             */
            i18nRequirements: [{i18nFile: "./i18n/BookEventsDashlet.properties"}],

            /**
             * The widgets to be acting as title bar actions.
             */
            widgetsForTitleBarActions: [
                {
                    id: "BOOKEVENTS_DASHLET_ACTIONS",
                    name: "alfresco/html/Label",
                    config: {
                        label: "Title-bar actions"
                    }
                }
            ],

            /**
             * The widgets to be placed in the top toolbar.
             */
            widgetsForToolbar: [
                {
                    id: "BOOKEVENTS_DASHLET_TOOLBAR",
                    name: "alfresco/html/Label",
                    config: {
                        label: "Toolbar"
                    }
                }
            ],

            /**
             * The widgets to be placed in the second toolbar.
             */
            widgetsForToolbar2: [
                {
                    id: "BOOKEVENTS_DASHLET_TOOLBAR2",
                    name: "alfresco/html/Label",
                    config: {
                        label: "Toolbar2"
                    }
                }
            ],

            /**
             * The widgets to be placed in the body of the dashlet.
             */
            widgetsForBody: [
                {
                    id: "BOOKEVENTS_DASHLET_VERTICAL_LAYOUT",
                    name: "alfresco/layout/VerticalWidgets",
                    config: {
                        widgetWidth: 50,
                        widgets: [
                            {
                                id: "BOOKEVENTS_DASHLET_ALFRESCO_LOGO_WIDGET",
                                name: "alfresco/logo/Logo",
                                config: {
                                    logoClasses: "alfresco-logo-only"
                                }
                            },
                            {
                                id: "BOOKEVENTS_DASHLET_WIDGET",
                                name: "bestpubwidgets/BookEventsWidget"
                            }
                        ]
                    }
                }
            ]

        });
    });