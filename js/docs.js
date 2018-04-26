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
            }
        });
    });
})(window.dynCore);