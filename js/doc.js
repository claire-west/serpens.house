(function(dynCore) {
    dynCore.when(dynCore.require([ 'serpens.appCore', 'lib.globalModel', 'lib.centralAuth' ])).done(function(modules, appCore, globalModel, centralAuth) {
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
            },

            onNavTo: function(app, section, args) {
                if (args.length < 1) {
                    window.location.replace('#');
                    return;
                }

                var self = this;
                centralAuth.discord.checkLogin().done(function(info) {
                    if (globalModel.isSerpens(info.roles)) {
                        if (self.model.docId !== args[0]) {
                            self.model._set('docId', args[0]);
                            // Load new doc
                        }
                    } else {
                        window.location.replace('#');
                    }
                }).fail(function() {
                    window.location.replace('#');
                });
            },

            onNav: {
                edit: function(docId) {
                    console.log(docId);
                }
            }
        });
    });
})(window.dynCore);