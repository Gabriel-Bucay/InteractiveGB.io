let corv = 200; // Car position

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(135, 206, 235);
  

    // road
    fill(50);
    rect(0, 300, width, 100);

    // Draw the car body
    fill(255, 0, 0); // Red color
    rect(corv, 250, 100, 40, 10); // Rounded car body
    
    // Windows
    fill(200);
    rect(corv + 15, 230, 30, 20, 5);
    rect(corv + 55, 230, 30, 20, 5);

    // Wheels
    fill(0);
    ellipse(corv + 20, 290, 20, 20);
    ellipse(corv + 80, 290, 20, 20);
}