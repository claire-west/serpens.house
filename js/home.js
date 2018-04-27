(function(dynCore) {
    dynCore.when(dynCore.require([ 'serpens.appCore', 'lib.globalModel' ])).done(function(modules, appCore, globalModel) {
        var url = dynCore.getResource('node');

        appCore('home', {
            model: {},

            onInit: function() {
                var self = this;
                this.model.onSubmitMessage = function() {
                    self.submitMessage();
                }
            },

            submitMessage: function() {
                var name = this.model.contactName;
                var body = this.model.contactMessage;

                this.model._set('contactNameError', !!!name);
                this.model._set('contactMessageError', !!!body);

                if (!name || !body) {
                    return;
                }

                var self = this;
                $.ajax({
                    url: url + "/serpens/contact",
                    method: "POST",
                    data: JSON.stringify({
                        value1: name,
                        value2: body
                    }),
                    contentType: 'application/json'
                }).done(function() {
                    globalModel.openModal('home-contactsent', self.model);
                    self.model._set('contactName', '');
                    self.model._set('contactMessage', '');
                }).fail(function() {
                    globalModel.openModal('home-contacterror', self.model);
                });
            }
        });
    });
})(window.dynCore);