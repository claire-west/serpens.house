(function(dynCore) {
    dynCore.when(dynCore.require('serpens.appCore'),
        dynCore.require('lib', [
            'globalModel',
            'centralAuth',
            'cors'
        ])
    ).done(function(modules, appCore, globalModel, centralAuth, cors) {
        var url = dynCore.getResource('node');
        
        appCore('doc', {
            model: {
                promptLabel: 'Briefly summarize your changes:',

                toView: function(model) {
                    window.location.hash = '#doc-view/' + model.docId;
                },

                toEdit: function(model) {
                    window.location.hash = '#doc-edit/' + model.docId;
                },

                toComments: function(model) {
                    window.location.hash = '#doc-comments/' + model.docId;
                },

                toHistory: function(model) {
                    window.location.hash = '#doc-history/' + model.docId;
                }
            },

            onInit: function() {
                this.editor = new wysihtml.Editor('docs-edit-editor', {
                    toolbar: 'docs-edit-toolbar',
                    parserRules: wysihtmlParserRules
                });

                var self = this;
                this.model._set('saveDoc', function(model) {
                    self.model._set('promptValue', '');
                    globalModel.openModal('textprompt', self.model);
                });

                this.model._set('confirmPrompt', function() {
                    var model = self.model;
                    var requestBody = {
                        doc_id: model.doc.doc_id,
                        title: model.doc.title_new,
                        summary: model.promptValue,
                        content: self.editor.getValue()
                    };

                    var element = this;
                    cors({
                        url: url + '/serpens/doc',
                        method: 'PUT',
                        data: JSON.stringify(requestBody),
                        contentType: 'application/json'
                    }).done(function(resp) {
                        self.onDocLoad(resp);
                        globalModel.closeModal.call(element);
                        window.location.hash = '#doc-view/' + resp.doc_id;
                    }).fail(function() {
                        self.model._set('errorMessage', 'Unable to save document.');
                        globalModel.openModal('error', self.model);
                    });
                });
            },

            onNavTo: function(app, section, args) {
                if (args.length < 1) {
                    window.location.replace('#');
                    return;
                }

                var self = this;
                if (centralAuth.discord.info) {
                    if (globalModel.isSerpens(centralAuth.discord.info.roles)) {
                        if (self.model.docId !== args[0]) {
                            self.model._set('docId', args[0]);
                            self.loadDoc();
                        }
                    } else {
                        window.location.replace('#');
                    }
                } else {
                    centralAuth.discord.checkLogin().done(function(info) {
                        if (globalModel.isSerpens(info.roles)) {
                            if (self.model.docId !== args[0]) {
                                self.model._set('docId', args[0]);
                                self.loadDoc();
                            }
                        } else {
                            window.location.replace('#');
                        }
                    }).fail(function() {
                        window.location.replace('#');
                    });
                }
            },

            onNav: {
                edit: function(docId) {
                    
                }
            },

            loadDoc: function() {
                var self = this;
                centralAuth.discord.onLogin().done(function() {
                    cors(url + '/serpens/doc/' + self.model.docId).done(function(resp) {
                        self.onDocLoad(resp);
                    }).fail(function() {
                        self.model._set('errorMessage', 'Unable to load document.');
                        globalModel.openModal('error', self.model);
                        //window.location.hash = '#docs-list';
                    });
                });
            },

            onDocLoad: function(doc) {
                doc.title_new = doc.title;
                this.model._set('doc', doc);
                this.$app.find('.doc-content').html(doc.content);
                this.editor.setValue(doc.content);
            }
        });
    });
})(window.dynCore);