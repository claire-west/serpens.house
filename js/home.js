(function(dynCore) {
    dynCore.when(dynCore.require([ 'serpens.appCore', 'lib.isMobile' ])).done(function(modules, appCore) {
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
                    $('.modal .dialog h4').text('Message Sent');
                    $('.modal .dialog p').text('You will receive a response in a timely manner.');
                    $('.modal').show();
                    self.model._set('contactName', '');
                    self.model._set('contactMessage', '');
                }).fail(function() {
                    $('.modal .dialog h4').text('Error');
                    $('.modal .dialog p').text('Unable to deliver message.');
                    $('.modal').show();
                });
            }
        });
    });
})(window.dynCore);