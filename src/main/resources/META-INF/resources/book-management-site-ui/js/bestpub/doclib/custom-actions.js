(function() {
    YAHOO.Bubbling.fire("registerAction",
    {
        actionName: "onActionPublishToWeb",
        fn: function marversolutions_onActionPublishToWeb(bookFolder) {
        	
        	var progressPopup = Alfresco.util.PopupManager.displayMessage(
                    {
                       displayTime: 0,
                       effect: null,
                       text: this.msg("message.publish-web.waiting", bookFolder.displayName)
                    });
        	
        	this.modules.actions.genericAction(
            {
                webscript:
                {
                    name: "bestpub/publishBookToWeb?nodeRef={nodeRef}",
                    stem: Alfresco.constants.PROXY_URI,
                    method: Alfresco.util.Ajax.GET,
                    params:
                    {
                        nodeRef: bookFolder.nodeRef,
                        bookIsbn: bookFolder.displayName
                    }
                },
                success:
                {
                	callback: {
                        fn : function bestpub_onPublishBook_success(data) {
                        	progressPopup.destroy();
                            var resultJson = YAHOO.lang.JSON.parse(data.serverResponse.responseText);
                            var publishingInitiated = resultJson.publishingInitiated;
                            if (publishingInitiated)
                                Alfresco.util.PopupManager.displayMessage({
                                    text: this.msg("message.publish-web.success", bookFolder.displayName)
                                });
                            else
                                Alfresco.util.PopupManager.displayMessage({
                                    text: this.msg("message.publish-web.failure", bookFolder.displayName)
                                });
                        },
                        event: { name: "metadataRefresh" },
                        scope : this
                    }
                },
                failure:
                {
                	callback: {
                        fn : function bestpub_onPublishBook_failure(data) {
                        	progressPopup.destroy();
                            Alfresco.util.PopupManager.displayMessage({
                            	text: this.msg("message.publish-web.failure", bookFolder.displayName)
                            });
                            
                        },
                        event: { name: "metadataRefresh" },
                        scope : this
                    }
                }
            });
        }
    });

    YAHOO.Bubbling.fire("registerAction",
        {
            actionName: "onDeleteChapter",
            fn: function bestpub_onDeleteChapter(chapterFolder) {
                var zIndex = 0;
                var _this = this; // outer alfresco scope (with access to msg, modules etc)

                Alfresco.util.PopupManager.displayPrompt(
                    {
                        title: this.msg("message.delete-chapter-folder.confirm.title"),
                        text: this.msg("message.delete-chapter-folder.confirm.description", chapterFolder.displayName),
                        noEscape: true,
                        zIndex: zIndex,
                        buttons: [
                            {
                                text: this.msg("button.delete"),
                                handler: function bestpub_onDeleteChapter_delete()
                                {
                                    this.destroy();
                                    bestpub_onDeleteChapter_callWebScript2DeleteChapter(chapterFolder, _this);
                                }
                            },
                            {
                                text: this.msg("button.cancel"),
                                handler: function bestpub_onDeleteChapter_cancel()
                                {
                                    this.destroy();
                                },
                                isDefault: true
                            }]
                    });
            }
        });

    /**
     * This function makes the call to a web script that will delete the passed in chapter folder,
     * and re-order the other chapter folders accordingly.
     *
     * @param chapterFolder the chapter folder object that should be deleted
     * @param _this outer alfresco scope (with access to msg, modules etc)
     */
    function bestpub_onDeleteChapter_callWebScript2DeleteChapter(chapterFolder, _this)
    {
        var path = chapterFolder.location.path;
        var fileName = chapterFolder.location.file;
        var filePath = Alfresco.util.combinePaths(path, fileName);
        var displayName = chapterFolder.displayName;
        var nodeRef = chapterFolder.nodeRef;

        var progressPopup = Alfresco.util.PopupManager.displayMessage(
            {
                displayTime: 0,
                effect: null,
                text: _this.msg("message.delete-chapter-folder.waiting", displayName)
            });

        _this.modules.actions.genericAction(
            {
                webscript:
                {
                    name: "bestpub/deleteChapterFolder?nodeRef={nodeRef}",
                    stem: Alfresco.constants.PROXY_URI,
                    method: Alfresco.util.Ajax.GET,
                    params:
                    {
                        nodeRef: nodeRef
                    }
                },
                success:
                {
                    callback:
                    {
                        fn : function bestpub_onDeleteChapter_success(data) {
                            progressPopup.destroy();
                            var resultJson = YAHOO.lang.JSON.parse(data.serverResponse.responseText);
                            var success = resultJson.success;
                            if (success) {
                                Alfresco.util.PopupManager.displayMessage({
                                    text: _this.msg("message.delete-chapter-folder.success", displayName)
                                });
                            } else {
                                Alfresco.util.PopupManager.displayMessage({
                                    text: _this.msg("message.delete-chapter-folder.failure", displayName)
                                });
                            }
                        },
                        scope : _this
                    },
                    event:
                    {
                            name: "folderDeleted",
                            obj:
                            {
                                path: filePath
                            }
                    }
                },
                failure:
                {
                    callback: {
                        fn : function bestpub_onDeleteChapter_failure(data){
                            progressPopup.destroy();
                            Alfresco.util.PopupManager.displayMessage({
                                text: _this.msg("message.delete-chapter-folder.failure", displayName)
                            });
                        },
                        scope : _this
                    }
                }
            });
    };

})();