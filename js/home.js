(function(dynCore) {
    dynCore.when(dynCore.require([ 'serpens.appCore', 'lib.globalModel', 'lib.bind' ])).done(function(modules, appCore, globalModel, bind) {
        appCore('home', {
            model: {
                test: "test data binding"
            },

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
                    url: "https://node.claire-west.ca/serpens/contact",
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