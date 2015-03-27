"use strict";

var _buildGraphMC = require("build/graph.m.c"), Graph = _buildGraphMC.Graph, AcyclicGraph = _buildGraphMC.AcyclicGraph, Tree = _buildGraphMC.Tree, D3SVG = require("build/app/2d3.m.c").D3SVG, requestAnimationFunction = require("build/app/requestAnimationFunction.m.c").requestAnimationFunction;

!function() {
    console.log("init");
    var a = document.querySelector("svg");
    window.graph = new graphjs.Graph(!0);
    for (var b = 200, c = 0; b > c; ++c) graph.addNode(c);
    for (var c = 0; .8 * b > c; ++c) graph.addEdge(c % b, Math.floor(Math.random() * b));
    window.d3svg = new _2d3.D3SVG(a, graph);
    var d = d3svg.force;
    setTimeout(function() {
        d.friction(.7);
    }, 200), setTimeout(function() {
        a.classList.add("resolved");
    }, 700), setTimeout(function() {
        d.friction(.9), d.gravity(.08), d.charge(-200), d.alpha(.25);
    }, 2e3), d.gravity(.8), d.friction(0), d.linkDistance(5), d.theta(.6), d.alpha(.5), 
    d.start(), addEventListener("resize", function() {
        d3svg.resize();
    });
}();