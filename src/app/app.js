Promise.all(["build/graph.m.c", "build/app/2d3.m.c"].map(name => System.import(name))).then(([graphjs, _2d3]) => {
    console.log("init");
    const svg = document.querySelector("svg");
    window.graph = new graphjs.Tree(true);
    const length = 200;
    for (let i = 0; i < length; ++i) graph.addNode(i);
    for (let i = 0; i < length * 10; ++i) graph.addEdge(i % length, Math.floor(Math.random() * length));
    window.d3svg = new _2d3.D3SVG(svg, graph);
    const force = d3svg.force;
    setTimeout(() => {
        force.friction(0.7);
    }, 200);
    setTimeout(() => {
        force.friction(0.9);
        force.gravity(0.08);
        force.charge(-20000);
        force.alpha(0.5);
    }, 2000);
    setTimeout(() => {
        force.alpha(1);
    }, 5000);
    force.gravity(0.6);
    force.friction(0);
    //force.charge(-40);
    force.linkDistance(5);
    force.theta(0.6);
    force.alpha(0.5);
    force.start();
}).catch(e => {
    console.error(e);
});