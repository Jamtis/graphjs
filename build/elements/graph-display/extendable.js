"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import console from "../../helper/console.js";
import __try from "../../helper/try.js";
export default class Extendable extends HTMLElement {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "extensions", new Set());
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    const {
      extensions
    } = this.constructor;

    if (extensions) {
      for (const extension of extensions) {
        if (!this.extensions.has(extension)) {
          this.extensions.add(extension);
          extension(this);
        }
      }
    }
  }

  static extend(extend) {
    if (!this.extensions.has(extend)) {
      this.extensions.add(extend);
      return extendExistingElements(extend);
    }
  }

}

_defineProperty(Extendable, "extensions", new Set());

function extendExistingElements(extend) {
  // upgrade all graph-displays directly in the document (no shadow DOM)
  // @REMARK: upgrading "hidden" graph-displays is impossible because no handle on them is available
  const all_elements = getAllElements(document.documentElement);
  const graph_displays = new Set(all_elements.filter(element => element instanceof Extendable));
  const promises = new Set();

  for (const graph_display of graph_displays) {
    console.log("extend existing host");
    promises.add(extend(graph_display));
  }

  return Promise.all(promises);
}

function getAllElements(root) {
  const elements = new Set([root, ...root.querySelectorAll("*")]);

  for (const element of elements) {
    if (element.shadowRoot) {
      for (const shadow_element of element.shadowRoot.querySelectorAll("*")) {
        elements.add(shadow_element);
      }
    }
  }

  return [...elements];
}