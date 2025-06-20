window.renderGravityPlot = (gravityVector) => {
    const norm = Math.sqrt(gravityVector[0] ** 2 + gravityVector[1] ** 2 + gravityVector[2] ** 2);
    const g = gravityVector.map(v => v / norm);
    const zAxis = g.map(v => -v);

    // Compute orthogonal basis
    let arbitrary = [1, 0, 0];
    if (Math.abs(zAxis[0]) === 1 && zAxis[1] === 0 && zAxis[2] === 0) arbitrary = [0, 1, 0];

    const cross = (a, b) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
    const normalize = v => {
        const len = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
        return v.map(x => x / len);
    };

    const xAxis = normalize(cross(arbitrary, zAxis));
    const yAxis = normalize(cross(zAxis, xAxis));

    const scale = 100;
    const origin = [0, 0, 0];

    const vectorToLine = (dir, color, name) => ({
        type: 'scatter3d',
        mode: 'lines',
        x: [0, dir[0] * scale],
        y: [0, dir[1] * scale],
        z: [0, dir[2] * scale],
        line: { color, width: 6, dash: 'dash' },
        name
    });

    const layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            aspectmode: 'cube',
            camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' },
            zaxis: { title: 'Z' },
        }
    };

    const data = [
        // Gravity vector
        {
            type: 'scatter3d',
            mode: 'lines',
            x: [0, gravityVector[0] * scale],
            y: [0, gravityVector[1] * scale],
            z: [0, gravityVector[2] * scale],
            line: { color: 'blue', width: 8 },
            name: 'Gravity Vector'
        },
        // Local axes
        vectorToLine(xAxis, 'red', 'X (Device)'),
        vectorToLine(yAxis, 'green', 'Y (Device)'),
        vectorToLine(zAxis, 'blue', 'Z (Device)')
    ];

    Plotly.newPlot('plotly-container', data, layout);
};
