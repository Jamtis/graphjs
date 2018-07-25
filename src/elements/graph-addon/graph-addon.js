"use strict";
import console from "../../helper/console.js";

export default
class GraphAddon extends HTMLElement {
    constructor() {
        super();
        let resolved = false;
        const host_promise = new Promise((resolve, reject) => {
            const _reject = event => {
                console.assert(false, "no valid host found");
                event.stopPropagation();
                reject(new Error("no valid host found"));
            };
            // in case there is no valid host -> reject
            this.addEventListener("addon-registry", _reject, {
                once: true,
                capture: true,
                passive: true
            });
            Object.defineProperty(this, "host", {
                get() {
                    return host_promise;
                },
                set(host) {
                    console.assert(!resolved, "host reassignment is ignored");
                    resolved = true;
                    this.removeEventListener("addon-registry", _reject);
                    resolve(host);
                },
                configurable: true
            });
        });
        (async () => {
            const host = await host_promise;
            try {
                if (typeof this.hosted == "function") {
                    await this.hosted(host);
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }
    connectedCallback() {
        this.dispatchEvent(new CustomEvent("addon-registry", {
            detail: {
                name: this.constructor.name
            },
            bubbles: true,
            composed: true
        }));
    }
}