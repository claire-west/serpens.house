(function(dynCore) {
    dynCore.when(dynCore.require('serpens', [
            'appCore',
            'uuid'
        ]),
        dynCore.require('lib', [
            'globalModel',
            'centralAuth',
            'cors'
        ])
    ).done(function(modules, appCore, uuid, globalModel, centralAuth, cors) {
        var url = dynCore.getResource('node');

        appCore('docs', {
            model: {
                getDocHref: function(doc_id) {
                    return '#doc-view/' + doc_id;
                }
            },

            onInit: function() {
                var editor = new wysihtml.Editor('docs-create-editor', {
                    toolbar: 'docs-create-toolbar',
                    parserRules: wysihtmlParserRules
                });

                var self = this;
                this.model._set('saveDoc', function(model) {
                    var requestBody = {
                        doc_id: uuid(),
                        title: model.title,
                        content: editor.getValue()
                    };
                    cors({
                        url: url + '/serpens/doc',
                        method: 'POST',
                        data: JSON.stringify(requestBody),
                        contentType: 'application/json'
                    }).done(function(resp) {
                        model._set('title', '');
                        editor.setValue('');
                        window.location.hash = '#doc-view/' + resp.doc_id;
                    }).fail(function() {
                        self.model._set('errorMessage', 'Unable to save document.');
                        globalModel.openModal('error', self.model);
                    });
                });
            },

            refresh: function() {
                var self = this;
                if (centralAuth.discord.info) {
                    if (globalModel.isSerpens(centralAuth.discord.info.roles)) {
                        self.loadList();
                    } else {
                        window.location.replace('#');
                    }
                } else {
                    centralAuth.discord.checkLogin().done(function(info) {
                        if (globalModel.isSerpens(info.roles)) {
                            self.loadList();
                        } else {
                            window.location.replace('#');
                        }
                    }).fail(function() {
                        window.location.replace('#');
                    });
                }
            },

            loadList: function() {
                var self = this;
                self.model._set('list', []);
                return cors(url + '/serpens/doc').done(function(resp) {
                    self.model._set('list', resp);
                }).fail(function() {
                    window.location.replace('#');
                });
            },

            onNav: {
                '': function() {
                    this.onNav.list.call(this);
                },

                list: function() {
                    this.refresh();
                }
            }
        });
    });
})(window.dynCore);