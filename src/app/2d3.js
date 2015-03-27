import d3 from "../../node_modules/d3/d3.min";
import { requestAnimationFunction } from "ext/requestAnimationFunction.c";
const $force = Symbol();
const $svg = Symbol();
const $dom_svg = Symbol();
const $circle_data = Symbol();
const $path_data = Symbol();
const $graph = Symbol();
const $resize = Symbol();
/**
 * @class User interface
 * Displays the data of the given graph.
 * */
export class D3SVG {
    constructor(svg, graph) {
        if (!svg) throw Error("No svg element specified");
        if (!graph) throw Error("No graph specified");
        const force = d3.layout.force();
        this[$resize] = requestAnimationFunction(() => {
            const {width, height} = getComputedStyle(svg);
            force.size([parseInt(width), parseInt(height)]);
            force.alpha(0.1);
        });
        this[$graph] = graph;
        this[$dom_svg] = svg;
        this[$force] = force;
        this[$svg] = window.svg = d3.select(svg);
        this[$force].on("tick", () => {
            this[$circle_data].attr("transform", node => ("translate(" + node.x + "," + node.y + ")"));
            this[$path_data].attr("d", ([source, intermediate, target]) => ("M" + source.x + "," + source.y + "S" + intermediate.x + "," + intermediate.y + " " + target.x + "," + target.y));
        });
        this.update();
    }
    update() {
        this.resize();
        const nodes = [];
        const edges = [];
        const intermediates = [];
        const links = [];
        const node_map = new Map;
        for (let node of this[$graph].nodes.keys()) {
            const wrap = {
                value: node
                //x: Math.random() * width,
                //y: height / 2
            };
            node_map.set(node, wrap);
            nodes.push(wrap);
        }
        for (let [source, target] of this[$graph].edges) {
            const source_wrap = node_map.get(source);
            const target_wrap = node_map.get(target);
            const intermediate = {};
            intermediates.push(intermediate);
            links.push({
                source: source_wrap,
                target: intermediate
            }, {
                source: intermediate,
                target: target_wrap
            });
            edges.push([source_wrap, intermediate, target_wrap]);
        }
        this[$force].nodes(nodes.concat(intermediates)).links(links);
        this[$circle_data] = this[$svg].selectAll("circle").data(nodes);
        this[$path_data] = this[$svg].selectAll("path").data(edges);
        this[$circle_data].enter().append("circle").attr("r", 5).call(this[$force].drag);
        this[$path_data].enter().append("path");
        this[$circle_data].exit().remove();
        this[$path_data].exit().remove();
    }
    resize() {
        this[$resize]();
    }
    get graph() {
        return this[$graph];
    }
    get force() {
        return this[$force];
    }
};