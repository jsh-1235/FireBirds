const stage = {
  width: 820,
  height: 344,
  image: new Image(),
  src: "res/images/bg.png",
  score: 0,
};

const bird = {
  width: 50,
  height: 49,
  image: new Image(),
  src: "res/images/bird.png",
};

const pig = {
  width: 200,
  height: 157,
  image: new Image(),
  src: "res/images/pig.png",
};

const ball = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  t: 0,
  velocity: 0,
  angle: 0,
  radius: 10,
  run: function () {
    let factor = 1;

    ball.x += ball.vx * ball.t;

    ball.y += -(ball.vy * ball.t - 0.5 * 9.81 * Math.pow(ball.t, 2));

    ball.t += 0.01;

    console.log("time", ball.t);

    if (ball.x >= stage.width - pig.width && ball.x <= stage.width && ball.y >= stage.height - pig.height && ball.y <= stage.height) {
      stage.score++;
      document.getElementById("score").innerHTML = "Score : " + stage.score;
      clearInterval(timer);
    }

    if (ball.y >= stage.height || ball.y < 0) {
      clearInterval(timer);
      console.log("stop", timer);
    }

    draw();
  },
};

let context;
let timer;

stage.image.src = stage.src;
bird.image.src = bird.src;
pig.image.src = pig.src;

function draw() {
  context.clearRect(0, 0, stage.width, stage.height);

  context.drawImage(stage.image, 0, 0);
  context.drawImage(bird.image, 0, 295);
  context.drawImage(pig.image, 620, 187);

  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, 2.0 * Math.PI, true);
  context.fillStyle = "orangeRed";
  context.fill();
}

function initialize() {
  ball.t = 0;

  ball.x = bird.width;

  ball.y = stage.height - bird.height;

  ball.radius = 10;

  context = document.getElementById("canvas").getContext("2d");

  draw();
}

function launch() {
  initialize();

  ball.velocity = Number(document.getElementById("velocity").value);
  ball.angle = Number(document.getElementById("angle").value);
  var radian = (ball.angle * Math.PI) / 180;

  ball.vx = ball.velocity * Math.cos(radian);
  ball.vy = ball.velocity * Math.sin(radian);

  draw();

  timer = setInterval(ball.run, 10);
}
