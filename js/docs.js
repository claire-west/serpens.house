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
                        doc_id: uuid(),
                        title: model.title,
                        content: self.editor.val()
                    };
                    cors({
                        url: url + '/serpens/doc',
                        method: 'POST',
                        data: JSON.stringify(requestBody),
                        contentType: 'application/json'
                    }).done(function(resp) {
                        model._set('title', '');
                        self.editor.val('');
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