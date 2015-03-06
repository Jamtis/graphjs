"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ref = exports._ref = (function (global) {
    var $nodes = Symbol();
    var $dependencies = Symbol();
    var $dependents = Symbol();
    var $directed = Symbol();

    var Graph = (function () {
        function Graph() {
            var directed = arguments[0] === undefined ? false : arguments[0];

            _classCallCheck(this, Graph);

            this[$nodes] = new Map();
            this.directed = directed;
        }

        _prototypeProperties(Graph, null, {
            directed: {
                get: function () {
                    return this[$directed];
                },
                set: function (directed) {
                    this[$directed] = !!directed;
                    if (this.directed) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = this.edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var _ref;

                                var edge = _step.value;
                                (_ref = this).addEdge.apply(_ref, _toConsumableArray(edge));
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator["return"]) {
                                    _iterator["return"]();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                },
                configurable: true
            },
            nodes: {
                get: function () {
                    return new Map(this[$nodes]);
                },
                configurable: true
            },
            edges: {
                get: function () {
                    var edges = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this[$nodes][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var node = _step.value;
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = node[1].dependents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var dependent = _step2.value;
                                    edges.push([node[0], dependent[0], dependent[1]]);
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                                        _iterator2["return"]();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }

                            if (this.directed) {
                                var _iteratorNormalCompletion3 = true;
                                var _didIteratorError3 = false;
                                var _iteratorError3 = undefined;

                                try {
                                    for (var _iterator3 = node[1].dependencies[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                        var dependency = _step3.value;
                                        edges.push([dependency[0], node[0], dependency[1]]);
                                    }
                                } catch (err) {
                                    _didIteratorError3 = true;
                                    _iteratorError3 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                                            _iterator3["return"]();
                                        }
                                    } finally {
                                        if (_didIteratorError3) {
                                            throw _iteratorError3;
                                        }
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator["return"]) {
                                _iterator["return"]();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return edges;
                },
                configurable: true
            },
            addNode: {
                value: function addNode(object) {
                    var relations = Object.defineProperties({}, {
                        dependencies: {
                            get: function () {
                                return new Map(this[$dependencies]);
                            },
                            enumerable: true,
                            configurable: true
                        },
                        dependents: {
                            get: function () {
                                return new Map(this[$dependents]);
                            },
                            enumerable: true,
                            configurable: true
                        }
                    });
                    relations[$dependencies] = new Map();
                    relations[$dependents] = new Map();
                    this[$nodes].set(object, relations);
                    return true;
                },
                writable: true,
                configurable: true
            },
            removeNode: {
                value: function removeNode(object) {
                    this[$nodes]["delete"](object);
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this[$nodes][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var node = _step.value;

                            node[$dependents]["delete"](object);
                            node[$dependencies]["delete"](object);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator["return"]) {
                                _iterator["return"]();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                },
                writable: true,
                configurable: true
            },
            addEdge: {
                value: function addEdge(source, target) {
                    var weight = arguments[2] === undefined ? 1 : arguments[2];

                    if (this[$nodes].has(source) && this[$nodes].has(target)) {
                        this[$nodes].get(source)[$dependents].set(target, weight);
                        this[$nodes].get(target)[$dependencies].set(source, weight);
                        if (!this.directed) {
                            this[$nodes].get(target)[$dependents].set(source, weight);
                            this[$nodes].get(source)[$dependencies].set(target, weight);
                        }
                        return true;
                    }
                    return false;
                },
                writable: true,
                configurable: true
            },
            removeEdge: {
                value: function removeEdge(source, target) {
                    if (this[$nodes].has(source) && this[$nodes].has(target)) {
                        this[$nodes].get(source)[$dependents]["delete"](target);
                        this[$nodes].get(target)[$dependencies]["delete"](source);
                        if (!this.directed) {
                            this[$nodes].get(target)[$dependents]["delete"](source);
                            this[$nodes].get(source)[$dependencies]["delete"](target);
                        }
                        return true;
                    }
                    return false;
                },
                writable: true,
                configurable: true
            },
            hasCycle: {
                value: function hasCycle() {
                    var directed = this.directed;
                    var finished = new Set();
                    var visited = new Set();
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this[$nodes][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var node = _step.value;

                            var depth = DFS.call(this, node[1], undefined, 0);
                            if (depth) return depth;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator["return"]) {
                                _iterator["return"]();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return false;

                    function DFS(node, dependency, length) {
                        if (!finished.has(node)) {
                            if (visited.has(node)) {
                                return length;
                            }visited.add(node);
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = node[$dependents][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var dependent = _step2.value;

                                    var dependent_node = this[$nodes].get(dependent[0]);
                                    if (directed || dependent_node !== dependency) {
                                        var depth = DFS.call(this, dependent_node, node, length + 1);
                                        if (depth) return depth;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                                        _iterator2["return"]();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }

                            finished.add(node);
                        }
                    }
                },
                writable: true,
                configurable: true
            }
        });

        return Graph;
    })();

    var AcyclicGraph = (function (Graph) {
        function AcyclicGraph() {
            _classCallCheck(this, AcyclicGraph);

            if (Graph != null) {
                Graph.apply(this, arguments);
            }
        }

        _inherits(AcyclicGraph, Graph);

        _prototypeProperties(AcyclicGraph, null, {
            addEdge: {
                value: function addEdge(source, target, weight) {
                    var c = this.hasCycle();
                    var added = _get(Object.getPrototypeOf(AcyclicGraph.prototype), "addEdge", this).call(this, source, target, weight);
                    if (added && _get(Object.getPrototypeOf(AcyclicGraph.prototype), "hasCycle", this).call(this)) if (this.removeEdge(source, target)) {
                        return false;
                    } else throw Error("Cyclic node could not be removed");
                    return added;
                },
                writable: true,
                configurable: true
            },
            hasCycle: {
                value: function hasCycle() {
                    return false;
                },
                writable: true,
                configurable: true
            }
        });

        return AcyclicGraph;
    })(Graph);

    var Tree = (function (AcyclicGraph) {
        function Tree() {
            _classCallCheck(this, Tree);

            if (AcyclicGraph != null) {
                AcyclicGraph.apply(this, arguments);
            }
        }

        _inherits(Tree, AcyclicGraph);

        _prototypeProperties(Tree, null, {
            addEdge: {
                value: function addEdge(source, target, weight) {
                    if (this[$nodes].get(target)[$dependencies].size > 0) {
                        return false;
                    }return _get(Object.getPrototypeOf(Tree.prototype), "addEdge", this).call(this, source, target, weight);
                },
                writable: true,
                configurable: true
            }
        });

        return Tree;
    })(AcyclicGraph);

    return [Graph, AcyclicGraph, Tree];
})();

var _ref2 = exports._ref2 = _slicedToArray(_ref, 3);

var Graph = exports.Graph = _ref2[0];
var AcyclicGraph = exports.AcyclicGraph = _ref2[1];
var Tree = exports.Tree = _ref2[2];
Object.defineProperty(exports, "__esModule", {
    value: true
});
