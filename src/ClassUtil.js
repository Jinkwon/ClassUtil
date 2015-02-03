(function(){

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    var ClassUtil = function () {

    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = ClassUtil;
        }
        exports.ClassUtil = ClassUtil;
    } else {
        root.ClassUtil = ClassUtil;
    }

    // Current version.
    ClassUtil.VERSION = '0.1.0';

    ClassUtil.extend = function (props) {
        var create = Object.create || (function () {
                function F() {
                }

                return function (proto) {
                    F.prototype = proto;
                    return new F();
                };
            })();

        var extend = function (dest) {
            var i, j, len, src;

            for (j = 1, len = arguments.length; j < len; j++) {
                src = arguments[j];
                for (i in src) {
                    dest[i] = src[i];
                }
            }
            return dest;
        };

        var Child = function () {
            var defaults;
            if (this.__super__ && this.__super__.defaults) {
                defaults = this.__super__.defaults;
                for (var prop in defaults) {
                    this[prop] = defaults[prop];
                }
            }
            if (this.defaults) {
                defaults = this.defaults;
                for (var prop in defaults) {
                    this[prop] = defaults[prop];
                }
            }

            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }
        };

        var parentProto = Child.__super__ = this.prototype;

        var proto = create(parentProto);
        proto.constructor = Child;

        Child.prototype = proto;
        Child.prototype.__super__ = parentProto;

        if (!parentProto.initialize) {
            Child.prototype.__super__.initialize = function () {
            };
        }

        //inherit parent's statics
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'prototype') {
                Child[i] = this[i];
            }
        }

        // mix static properties into the class
        if (props.statics) {
            extend(Child, props.statics);
            delete props.statics;
        }

        // mix includes into the prototype
        if (props.includes) {
            extend.apply(null, [proto].concat(props.includes));
            delete props.includes;
        }

        // merge options
        if (proto.options) {
            props.options = extend(create(proto.options), props.options);
        }

        extend(proto, props);

        return Child;
    };

}.call(this));