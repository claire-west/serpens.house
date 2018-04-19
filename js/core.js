(function() {
    $(window).scroll(function() {
        var $header = $('nav.top-bar, div.top-bar-spacer');
        if ($(document).scrollTop() > 0) {
            $header.addClass('shrink');
        } else {
            $header.removeClass('shrink');
        }
    });

    $('#submit').click(function() {
        var $name = $('#contactName');
        var name = $name.val();
        var $message = $('#message');
        var body = $message.val();

        var error = false;

        if (!name) {
            $name.addClass('error');
            error = true;
        } else {
            $name.removeClass('error');
        }

        if (!body) {
            $message.addClass('error');
            error = true;
        } else {
            $message.removeClass('error');
        }

        if (error) {
            return;
        }

        $.ajax({
            url: "https://node.claire-west.ca/serpens/contact",
            method: "POST",
            data: JSON.stringify({
                value1: name,
                value2: body
            })
        }).done(function() {
            $('.modal .dialog h4').text('Message Sent');
            $('.modal .dialog p').text('');
            $('.modal').show();
            $name.val('');
            $message.val('');
        }).fail(function() {
            $('.modal .dialog h4').text('Error');
            $('.modal .dialog p').text('Unable to deliver message.');
            $('.modal').show();
        });
    });

    $('.modal .dialog button').click(function() {
        $('.modal').hide();
    });
})();