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
                var editor = this.$app.find('.doc-editor').get(0);
                sceditor.create(editor, {
                    format: 'bbcode',
                    toolbar: 'bold,italic|size|left,center,right|bulletlist,orderedlist|image,link',
                    emoticonsEnabled: false,
                    height: '500',
                    bbcodeTrim: true,
                    resizeWidth: false,
                    style: 'http://lib.claire-west.ca/vend/sceditor/minified/themes/default.min.css'
                });
                this.editor = sceditor.instance(editor);

                var self = this;
                this.model._set('saveDoc', function(model) {
                    var requestBody = {
                        doc_id: model.doc.doc_id,
                        title: model.doc.title_new,
                        content: self.editor.val()
                    };
                    cors({
                        url: url + '/serpens/doc',
                        method: 'PUT',
                        data: JSON.stringify(requestBody),
                        contentType: 'application/json'
                    }).done(function(resp) {
                        self.onDocLoad(resp);
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
                this.$app.find('.doc-content').html(doc.html);
                this.editor.val(doc.content);
            }
        });
    });
})(window.dynCore);