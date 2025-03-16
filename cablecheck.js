function colorNameToRGB(colorName, a) {
    const colorMap = {
        "black": `rgba(0,0,0,${a})`,
        "white": `rgba(255,255,255,${a})`,
        "red": `rgba(255,0,0,${a})`,
        "darkred": `rgba(139,0,0,${a})`,
        "saddlebrown": `rgba(139,69,19,${a})`,
        "blue": `rgba(0,0,255,${a})`,
        "green": `rgba(0,128,0,${a})`,
        "darkorange": `rgba(255,140,0,${a})`
    };
    const lowerColorName = colorName.toLowerCase();
    return colorMap[lowerColorName] || `rgba(0,0,0,${a})`;
}

const drawIt = function (w, h, x, y, color, a) {
    color = colorNameToRGB(color, a);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
};

const drawWire = function (startX, color, error) {
    console.log(`drawWire(${startX}, ${color})`)
    const leftBorderW = wireBorder;
    const leftBorderH = bgH
    const leftBorderX = startX;
    const borderY = bgY;
    const borderColor = (error === "") ? boxC : 'red';
    const rightBorderX = leftBorderX + wireW + wireBorder;
    drawIt(leftBorderW, leftBorderH, leftBorderX, borderY, borderColor, a);
    drawIt(leftBorderW, leftBorderH, rightBorderX, borderY, borderColor, a);

    if (color.indexOf("White") > 0) {
        // draw striped wire
        color = color.replace('/White', '');
        const Height = bgH / 20;
        for (let i = 0; i < 20; i++) {
            const X = leftBorderX + wireBorder;
            const Y = borderY + (Height * i);
            const currentColor = (i % 2 === 0) ? color : 'white';
            drawIt(wireW, Height, X, Y, currentColor, a);
        }
    }
    else {
        // draw solid wire
        drawIt(wireW, bgH, leftBorderX + wireBorder, borderY, color, a);
    }

    if (error !== "") {
        drawIt(wireW, bgH, leftBorderX + wireBorder, borderY, 'red', 0.8);
    }
};

const colors = ["DarkOrange/White", "DarkOrange", "Green/White", "Blue", "Blue/White", "Green", "SaddleBrown/White", "SaddleBrown"];

let errors = []; // Define errors as an empty array initially

const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
const maxWH = Math.max(width, height);

canvas.width = width;
canvas.height = height;

const border = 10;
const spacer = 40;
const wireW = 18;
const wireBorder = 1;
const a = 1;
const boxW = 400;
const boxH = 400;
const boxX = 100;
const boxY = 100;
const boxC = "black";
const bgW = boxW - (border * 2);
const bgH = boxH - (border * 2);
const bgX = 100 + border;
const bgY = 100 + border;
const bgC = "white";
const firstSpacerX = bgX + spacer;
const spacerGap = 2 + wireW + spacer;

// Function to load the JSON data
function loadErrorsFromJson(callback) {
    fetch('output.json') // Path to your JSON file
        .then(response => response.json())
        .then(data => {
            // Extract error information from the "pins" object
            errors = Object.keys(data.pins).sort().map(key => {
                return data.pins[key].correct ? "" : "error";
            });
            callback(); // Call the callback function after loading the data
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            errors = ["", "", "", "", "", "", "", ""]; // Default errors in case of failure
            callback(); // Still call the callback to proceed with default errors
        });
}

// Call the loadErrorsFromJson function before drawing
loadErrorsFromJson(function () {
    drawIt(boxW, boxH, boxX, boxY, boxC, a);
    drawIt(bgW, bgH, bgX, bgY, bgC, a);

    let currentX = bgX;

    for (let i = 0; i < 8; i++) {
        var thisSpacerX = currentX + spacer;
        drawWire(thisSpacerX, colors[i], errors[i]);
        currentX = thisSpacerX;
    }
});
