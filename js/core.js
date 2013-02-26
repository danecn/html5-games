//
// Helper file with various definitions
//

//-----------------------------------------
// Cross browser compatibility for request animation frame
window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

//-----------------------------------------
// Add an erase function to the Array class
Array.prototype.erase = function(item) {
    for (var i = this.length; i--; i) {
        if (this[i] === item)
            this.splice(i, 1);
    }

    return this;
};

//-----------------------------------------
//
Function.prototype.bind = function(bind) {
    var self = this;
    return function() {
        var args = Array.prototype.slice.call(arguments);
        return self.apply(bind || null, args);
    };
};

//-----------------------------------------
//
merge = function(original, extended) {
    for (var key in extended) {
        var ext = extended[key];
        if (typeof (ext) != 'object' ||
            ext instanceof Class) {
            original[key] = ext;
        }
        else {
            if (!original[key] || typeof (original[key]) != 'object') {
                original[key] = {};
            }
            merge(original[key], ext);
        }
    }
    return original;
};

//-----------------------------------------
//
function copy(object) {
    if (!object || typeof (object) != 'object' ||
        object instanceof Class) {
        return object;
    }
    else if (object instanceof Array) {
        var c = [];
        for (var i = 0, l = object.length; i < l; i++) {
            c[i] = copy(object[i]);
        }
        return c;
    }
    else {
        var c = {};
        for (var i in object) {
            c[i] = copy(object[i]);
        }
        return c;
    }
};

//-----------------------------------------
//
function ksort(obj) {
    if (!obj || typeof (obj) != 'object') {
        return [];
    }

    var keys = [], values = [];
    for (var i in obj) {
        keys.push(i);
    }

    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        values.push(obj[keys[i]]);
    }

    return values;
};

// -----------------------------------------------------------------------------
// Class object based on John Resigs code; inspired by base2 and Prototype
// http://ejohn.org/blog/simple-javascript-inheritance/
(function() {
    var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\bparent\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function() { };

    var inject = function(prop) {
        var proto = this.prototype;
        var parent = {};
        for (var name in prop) {
            if (typeof (prop[name]) == "function" &&
                typeof (proto[name]) == "function" &&
                fnTest.test(prop[name])) {

                parent[name] = proto[name]; // save original function
                proto[name] = (function(name, fn) {
                    return function() {
                        var tmp = this.parent;
                        this.parent = parent[name];
                        var ret = fn.apply(this, arguments);
                        this.parent = tmp;
                        return ret;
                    };
                })(name, prop[name])
            }
            else {
                proto[name] = prop[name];
            }
        }
    };

    // Create a new Class that inherits from this class
    this.Class.extend = function(prop) {
        var parent = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            if (typeof (prop[name]) == "function" &&
                typeof (parent[name]) == "function" &&
                fnTest.test(prop[name])) {

                prototype[name] = (function(name, fn) {
                    return function() {
                        var tmp = this.parent;

                        // Add a new parent() method that is the same method
                        // but on the super-class
                        this.parent = parent[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this.parent = tmp;

                        return ret;
                    };
                })(name, prop[name])
            }
            else {
                prototype[name] = prop[name];
            }
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing) {

                // If this class has a staticInstantiate method, invoke it
                // and check if we got something back. If not, the normal
                // constructor (init) is called.
                if (this.staticInstantiate) {
                    var obj = this.staticInstantiate.apply(this, arguments);
                    if (obj) {
                        return obj;
                    }
                }

                for (var p in this) {
                    if (typeof (this[p]) == 'object') {
                        this[p] = copy(this[p]); // deep copy!
                    }
                }

                if (this.init) {
                    this.init.apply(this, arguments);
                }
            }

            return this;
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        // Make this class injectable
        Class.inject = inject;

        return Class;
    };

})();

newGuid_short = function() {
    var S4 = function() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
    return (S4()).toString();
};

