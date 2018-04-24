(function(dynCore) {
    dynCore.declare('serpens.uuid', 
        dynCore.require('lib.uuid'),
        function(modules, uuid) {
            return function() {
                return uuid().substring(0, 8);
            };
        }
    );
})(window.dynCore);