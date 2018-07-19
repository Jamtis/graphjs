import GraphAddon from "../graph-addon/graph-addon.js";
import require from "../../helper/require.js";
import requestAnimationFunction from "https://rawgit.com/Jamtis/7ea0bb0d2d5c43968c4a/raw/910d7332a10b2549088dc34f386fbcfa9cdd8387/requestAnimationFunction.js";
export default
class GraphTracker extends GraphAddon {
    constructor() {
        super();
        let _tracking_mode;
        let _tracking_count;
        let _tracking_initial_time;
        Object.defineProperties(this, {
            trackingMode: {
                get() {
                    return _tracking_mode;
                },
                set(tracking_mode) {
                    switch (tracking_mode) {
                        case "hiding":
                            _tracking_mode = "hiding";
                            break;
                        case "normal":
                            _tracking_mode = "normal";
                            break;
                        default:
                            _tracking_mode = "adaptive";
                    }
                },
                configurable: true,
                enumerable: true
            },
            trackingCount: {
                get() {
                    return _tracking_count;
                },
                set(tracking_count) {
                    const parsed = parseFloat(tracking_count);
                    if (!isNaN(parsed)) {
                        _tracking_count = parsed;
                    }
                },
                configurable: true,
                enumerable: true
            },
            trackingInitialTime: {
                get() {
                    return _tracking_initial_time;
                },
                set(tracking_initial_time) {
                    const parsed = parseFloat(tracking_initial_time);
                    if (!isNaN(parsed)) {
                        _tracking_initial_time = parsed;
                    }
                },
                configurable: true,
                enumerable: true
            }
        })
        this.trackingMode = this.getAttribute("tracking-mode");
        this.trackingCount = 30;
        this.trackingInitialTime = 10;
        this.__requestTime = requestAnimationFunction(time => time);
    }
    async hosted() {
        console.log("graph-tracker: attach link in to host");
        const host = await this.host;
        host.shadowRoot.addEventListener("graph-structure-change", async event => {
            try {
                await this.__bindNodes();
            } catch (error) {
                console.error(error);
            }
        });
        await this.__bindNodes();
    }
    async __bindNodes() {
        console.log("graph-tracker: bind tracker to nodes");
        const host = await this.host;
        for (const [key, node] of host.nodes) {
            if (!node.hammer) {
                node.hammer = new Hammer(node.element);
            }
            node.hammer.on("pan", this.__trackElement.bind(this, host, key, node));
            node.hammer.on("panstart", this.__trackStart.bind(this, host, key, node));
            node.hammer.on("panend", this.__trackEnd.bind(this, host, key, node));
            node.hammer.on("pancancel", this.__trackEnd.bind(this, host, key, node));
        }
    }
    async __trackElement(host, node_key, node, event) {
        try {
            // console.log("graph-tracker: node track event", event);
            // event.srcEvent.stopPropagation();
            node.x += event.deltaX - (node.__deltaX || 0);
            node.y += event.deltaY - (node.__deltaY || 0);
            node.__deltaX = event.isFinal ? 0 : event.deltaX;
            node.__deltaY = event.isFinal ? 0 : event.deltaY;
            // notify host of change
            await host.__requestBroadcast("graph-update");
            // adaptively hide links
            if (this.trackingMode == "adaptive" && !node.links_hidden) {
                // console.time("timediff");
                const time_difference = await this.__requestTimeDifference();
                node.trackingTime = (node.trackingTime * (this.trackingCount - 1) + time_difference) / this.trackingCount;
                // console.timeEnd("timediff");
                // console.log("graph-tracker: time difference", time_difference);
                // console.log("graph-tracker: node.trackingTime", node.trackingTime);
                if (node.trackingTime > 17 && node.tracking) {
                    console.log("graph-tracker: adaptively hiding links", time_difference);
                    this.__hideLinks(host, node_key, node);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    __trackStart(host, node_key, node) {
        node.tracking = true;
        node.trackingTime = this.trackingInitialTime;
        if (this.trackingMode == "hiding") {
            console.log("graph-tracker: normally hiding links");
            this.__hideLinks(host, node_key, node);
        }
    }
    __trackEnd(host, node_key, node) {
        node.tracking = false;
        this.__unhideLinks(host, node_key, node);
    }
    __hideLinks(host, node_key, node) {
        console.log("graph-tracker: hide links");
        node.links_hidden = true;
        for (const [source, target, link] of host.graph.edges()) {
            if (source == node_key || target == node_key) {
                if (link.element) {
                    link.element.animate([{
                        opacity: getComputedStyle(link.element).opacity
                    }, {
                        opacity: 0
                    }], 250).addEventListener("finish", () => {
                        link.element.style.visibility = "hidden";
                    });
                }
            }
        }
    }
    __unhideLinks(host, node_key, node) {
        if (node.links_hidden) {
            node.links_hidden = false;
            console.log("graph-tracker: unhiding links");
            for (const [source, target, link] of host.graph.edges()) {
                if (source == node_key || target == node_key) {
                    link.element.style.visibility = "";
                    if (link.element) {
                        link.element.animate([{
                            opacity: 0
                        }, {
                            opacity: getComputedStyle(link.element).opacity
                        }], 500);
                    }
                }
            }
        }
    }
    async __requestTimeDifference() {
        const time = performance.now();
        return await this.__requestTime() - time;
    }
}
(async () => {
    try {
        // ensure requirements
        await require(["Hammer"]);
        await customElements.whenDefined("graph-display");
        customElements.define("graph-tracker", GraphTracker);
    } catch (error) {
        console.error(error);
    }
})();