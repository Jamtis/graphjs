"use strict";import GraphAddon from "../graph-addon/graph-addon.js";import require from "../../helper/require.js";
const style = document.createElement("style");
style.textContent = ":host{display:none;position:absolute;width:100%;height:100%;background:#4caf50;background:var(--node-color,#4caf50);padding:10px}:host>*{flex:1;opacity:0}:host(.visible){display:flex}:host(.visible)>*{opacity:1}";
export default class GraphDetailView extends GraphAddon {
  constructor() {
    super();Object.defineProperties(this, {
      __activeClone: {
        value: void 0,
        writable: !0,
        configurable: !0
      }
    });this.attachShadow({
      mode: "open"
    });this.shadowRoot.appendChild(style.cloneNode(!0));
    for (const child of this.children) {
      this.shadowRoot.appendChild(child)
    }
  }
  async hosted() {
    const host = await this.host,
      hammer = new Hammer(this);
    hammer.on("tap", event => {
      if (event.srcEvent.path[0] === this) {
        this.__tapDetailView(host)
      }
    });host.shadowRoot.addEventListener("graph-structure-change", () => {
      this.__attachTapListeners(host)
    });this.__attachTapListeners(host)
  }
  __tapNode(host, element) {
    var _Mathabs = Math.abs;
    this.activeNode = element.node;
    const active_clone = element.cloneNode(!0);
    this.__activeClone = active_clone;host.svg.appendChild(active_clone);return new Promise(resolve => {
      const keyframes = [{
        r: element.r.baseVal.value
      }, {
        r: Math.max(host.svg.width.baseVal.value / 2 + _Mathabs(this.activeNode.x), host.svg.height.baseVal.value / 2 + _Mathabs(this.activeNode.y)) * Math.SQRT2
      }];
      active_clone.animate(keyframes, {
        duration: 700,
        fill: "both"
      }).addEventListener("finish", () => {
        this.classList.add("visible");this.animate([{
          opacity: 0
        }, {
          opacity: 1
        }], 300).addEventListener("finish", () => {
          resolve()
        })
      })
    })
  }
  __tapDetailView(host) {
    var _Mathabs2 = Math.abs;
    console.log(event);
    const element = this.__activeClone;
    this.classList.remove("visible");return new Promise(resolve => {
      this.animate([{
        opacity: 1
      }, {
        opacity: 0
      }], 200).addEventListener("finish", () => {
        const keyframes = [{
          r: Math.max(host.svg.width.baseVal.value / 2 + _Mathabs2(this.activeNode.x), host.svg.height.baseVal.value / 2 + _Mathabs2(this.activeNode.y)) * Math.SQRT2
        }, {
          r: element.r.baseVal.value
        }];
        element.animate(keyframes, {
          duration: 600,
          fill: "both"
        }).addEventListener("finish", () => {
          host.svg.removeChild(element);
          this.__activeClone = void 0;
          this.activeNode = void 0;resolve()
        })
      })
    })
  }
  __attachTapListeners(host) {
    for (const [, node] of host.nodes) {
      if (!node.hammer) {
        node.hammer = new Hammer(node.element)
      }
      node.hammer.on("tap", this.__tapNode.bind(this, host, node.element))
    }
  }
}
(async() => {
  await require(["Hammer"]);await customElements.whenDefined("graph-display");customElements.define("graph-detail-view", GraphDetailView)
})();