(function(dynCore) {
    dynCore.when(dynCore.require([ 'serpens.appCore', 'lib.globalModel', 'lib.centralAuth' ])).done(function(modules, appCore, globalModel, centralAuth) {
        appCore('docs', {
            model: {
                
            },

            onInit: function() {
                var editor = this.$app.find('.doc-editor').get(0);
                sceditor.create(editor, {
                    format: 'bbcode',
                    toolbar: 'bold,italic,underline,strike|left,center,right|size|bulletlist,orderedlist,table|image,link,code,quote',
                    emoticonsEnabled: false,
                    height: '800',
                    bbcodeTrim: true,
                    style: 'http://lib.claire-west.ca/vend/sceditor/minified/themes/default.min.css'
                });
                this.editor = sceditor.instance(editor);

                var self = this;
                this.model._set('saveDoc', function(model) {
                    console.log(self.editor.val());
                });
            }
        });
    });
})(window.dynCore);