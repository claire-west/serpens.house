(function(dynCore) {
    dynCore.declare('serpens.appCore', dynCore.require([
        'lib.hashNav',
        'lib.centralAuth',
        'lib.bind',
        'lib.globalModel'
    ]), function(modules, hashNav, centralAuth, bind, globalModel) {
        var apps = {};
        var pending = {};
        var lib = modules.lib;

        var appCore = {
            init: function(title, app, $app) {
                dynCore.when(dynCore.require('lib.baseApp')).done(function(modules, baseApp) {
                    baseApp({
                        title: title,
                        namespace: 'serpens',
                        app: app,
                        $app: $app || $('#app-' + title)
                    }).done(function(app) {
                        apps[app.title] = app;
                        var appPath = app.namespace + '.' + app.title;
                        if (pending[appPath]) {
                            pending[appPath].resolve();
                        }
                        hashNav.rehash(true);
                    });
                });
            },
            loadApp: function(namespace, title) {
                if (typeof(title) === 'undefined') {
                    title = 'serpens.' + namespace;
                } else {
                    title = namespace + '.' + title;
                }
                dynCore.js(title);
            },
            getPending: function(title) {
                return pending[title];
            },
            getApp: function(title) {
                return apps[title];
            }
        };

        bind($('body'), globalModel);

        globalModel._set('onLoginPress', centralAuth.discord.toLogin);

        if (window.location.hash.startsWith('#access_token=')) {
            var search = location.hash.substring(1);
            var auth = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            auth.state = decodeURIComponent(auth.state);
            location.hash = auth.state;
            centralAuth.discord.doLogin(auth.access_token).done(function(info) {
                globalModel._set('userInfo', info);
            });
        } else {
            centralAuth.discord.checkLogin().done(function(info) {
                globalModel._set('userInfo', info);
            });
        }

        $(window).scroll(function() {
            var $header = $('div.top-bar, div.top-bar-spacer');
            if ($(document).scrollTop() > 0) {
                $header.addClass('shrink');
            } else {
                $header.removeClass('shrink');
            }
        });

        $('.modal .dialog button').click(function() {
            $('.modal').hide();
        });

        hashNav.bindNavApp(function(app, section, args) {
            var $app;
            if (app) {
                $app = $('#app-' + app);
            } else {
                app = $('body .defaultApp').get(0).id.split('-')[1];
                window.location.replace('#' + app);
                return;
            }

            if (typeof(apps[app]) === 'undefined') {
                appCore.loadApp(app);
                return;
            }
            $('.app').hide();
            $app.show();

            dynCore.favicon(apps[app].favicon);
            $('title').text($app.data('app'));

            
        });

        hashNav.bindNavSection(function(app, section, args) {
            var $app = $('#app-' + app);
            var sectionSelector;
            if (app && section) {
                sectionSelector = '#' + app + '-' + section;
            } else {
                sectionSelector = '.defaultSection';
            }

            $app.find('.contentSection').hide();
            $app.find(sectionSelector).show();
        });

        hashNav.rehash();

        return appCore.init;
    });
})(window.dynCore);