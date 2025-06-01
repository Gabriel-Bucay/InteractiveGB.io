let img; // Where we store our beautiful image
let particles = []; // An array for all our little particles
let particleSize = 7; // How big each particle should be
let maxSpeed = 20; // Maximum zoomies speed for particles
let returnSpeed = 0.8; // How fast they come back to their spots
let repelForce = 20; // How much they run away from mouse
let hoverRadius = 60; // Mouse influence zone size
let hoverEdgeSharpness = 0.5; // How sharp the edge effect is
let showHoverRadius = false; // Toggle for showing the hover circle
let soundEffect; // Placeholder for our sound
let isPlaying = false; // Sound playing status

// List of scrolling names 
let names = ["Danielle Gatan", "Taher Abdalla", "Angel Gala", "Romila Faheem", "Gabriel Bucay"];
let namePositions = []; // Stores positions for our name animation

function preload() {
    img = loadImage('bathspa.jpeg'); // Loading our aesthetic image
    soundEffect = loadSound('springroll.mp3'); // Preloading the sound effect
}

function setup() {
    createCanvas(windowWidth, windowHeight); // Making our canvas full size
    noStroke(); // No outlines 
    textSize(26); // Perfect text size
    textFont("Arial"); // Classic font choice

    // Calculate spacing for names 
    let spacing = width / names.length; // Equal space for each name

    for (let i = 0; i < names.length; i++) {
        namePositions.push({
            x: spacing * i + spacing / 2, // Centering each name in its space
            y: height - 40, // Positioning near the bottom
            speed: 2, // Consistent scrolling speed
            alpha: 255 // Fully visible
        });
    }

    // Setting up image scaling to fit perfectly
    let scaleX = width / img.width;
    let scaleY = height / img.height;
    let imgScale = max(scaleX, scaleY); // Using larger scale to fill
    let imgOffsetX = (width - img.width * imgScale) / 2; // Centering X
    let imgOffsetY = (height - img.height * imgScale) / 2; // Centering Y

    img.loadPixels(); // Loading pixel data for processing

    // Creating particles from image pixels
    for (let y = 0; y < img.height; y += particleSize) {
        for (let x = 0; x < img.width; x += particleSize) {
            let index = (x + y * img.width) * 4;
            let r = img.pixels[index]; // Red channel
            let g = img.pixels[index + 1]; // Green channel
            let b = img.pixels[index + 2]; // Blue channel
            let a = img.pixels[index + 3]; // Alpha channel

            if (a > 0) { // Only create particles where image isn't transparent
                particles.push({
                    x: x * imgScale + imgOffsetX, // Scaled X position
                    y: y * imgScale + imgOffsetY, // Scaled Y position
                    originalX: x * imgScale + imgOffsetX, // Home position X
                    originalY: y * imgScale + imgOffsetY, // Home position Y
                    color: [r, g, b, a], // Keeping original color
                    size: particleSize * 0.8 * imgScale, // Slightly smaller than grid
                    speed: random(1, maxSpeed), // Random speed for variety
                    vx: 0, // X velocity
                    vy: 0  // Y velocity
                });
            }
        }
    }
}

function draw() {
    background(0); // Black background for contrast

    // Show hover radius if enabled (debug feature)
    if (showHoverRadius) {
        fill(255, 50); // Semi-transparent white
        noStroke(); // No outline
        circle(mouseX, mouseY, hoverRadius * 2); // Draw influence area
    }

    // Update and draw all particles
    particles.forEach(p => {
        let d = dist(mouseX, mouseY, p.x, p.y); // Distance to mouse

        if (d < hoverRadius) {
            // If mouse is close, make particles swirl away
            let normalizedDist = pow(d / hoverRadius, hoverEdgeSharpness);
            let force = map(normalizedDist, 0, 1, repelForce, 0);

            let baseAngle = atan2(p.y - mouseY, p.x - mouseX);
            let swirlAngle = baseAngle + HALF_PI; // Perpendicular angle
            let swirlStrength = force * 0.2; // Slightly less than main force

            p.vx += cos(swirlAngle) * swirlStrength; // Add swirl X
            p.vy += sin(swirlAngle) * swirlStrength; // Add swirl Y
        } else {
            // Otherwise, gently return home
            p.vx += (p.originalX - p.x) * returnSpeed * 0.1;
            p.vy += (p.originalY - p.y) * returnSpeed * 0.1;
        }

        // Update position with velocity
        p.x += p.vx;
        p.y += p.vy;
        // Apply friction to slow down over time
        p.vx *= 0.85;
        p.vy *= 0.85;

        // Draw the particle with its color
        fill(p.color);
        circle(p.x, p.y, p.size);
    });

    // Update & Draw Scrolling Names - they're like a credits sequence
    for (let i = 0; i < names.length; i++) {
        let pos = namePositions[i];

        // Move left for that scrolling effect
        pos.x -= pos.speed;

        // Reset position when off-screen (like a loop)
        if (pos.x < -100) {
            pos.x = width + 100; // Comes back from the right
        }

        // Rainbow color effect - so pretty!
        let r = sin(frameCount * 0.05 + i) * 127 + 128;
        let g = cos(frameCount * 0.03 + i) * 127 + 128;
        let b = sin(frameCount * 0.07 + i) * 127 + 128;

        fill(r, g, b, pos.alpha);
        text(names[i], pos.x, pos.y); // Draw the name
    }
}

// 🔊 Toggle music on mouse click
function mousePressed() {
    if (soundEffect.isLoaded()) { // Make sure sound is ready
        if (!isPlaying) {
            soundEffect.play(); // Play if not playing
            isPlaying = true;
        } else {
            soundEffect.stop(); // Stop if playing
            isPlaying = false;
        }
    }
}

function keyPressed() {
    if (key === ' ') {
        // Spacebar makes particles explode outward - so dramatic!
        particles.forEach(p => {
            let angle = atan2(p.y - height / 2, p.x - width / 2);
            p.vx += cos(angle) * 20;
            p.vy += sin(angle) * 20;
        });
    }
    if (key === 'h') showHoverRadius = !showHoverRadius; // Toggle debug view
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // Handle window resize

    // Recalculate image scaling for new size
    let scaleX = width / img.width;
    let scaleY = height / img.height;
    let imgScale = max(scaleX, scaleY);
    let imgOffsetX = (width - img.width * imgScale) / 2;
    let imgOffsetY = (height - img.height * imgScale) / 2;

    // Update particle home positions
    particles.forEach((p, i) => {
        let y = floor(i / (img.width / particleSize));
        let x = (i % (img.width / particleSize)) * particleSize;
        p.originalX = x * imgScale + imgOffsetX;
        p.originalY = y * imgScale + imgOffsetY;
        // Gently move toward new positions
        p.vx = (p.originalX - p.x) * 0.1;
        p.vy = (p.originalY - p.y) * 0.1;
    });
}