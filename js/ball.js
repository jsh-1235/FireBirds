const level = {
  x: 0,
  y: 0,
  value: 1,
  backup: 0,
};

const stage = {
  width: 820,
  height: 344,
  image: new Image(),
  src: "res/images/bg.png",
};

const bird = {
  width: 50,
  height: 49,
  image: new Image(),
  src: "res/images/bird.png",
};

const pig = {
  x: 0,
  y: 0,
  width: 72,
  height: 71,
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

    if (ball.x < 0 || ball.x >= stage.width || ball.y < 0 || ball.y >= stage.height) {
      stop();
    } else {
      if (ball.x >= pig.x && ball.y >= pig.y && ball.x <= pig.x + pig.width && ball.y <= pig.y + pig.height) {
        document.getElementById("level").innerHTML = "LEVEL " + ++level.value;

        stop();
      }
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

  context.drawImage(pig.image, pig.x, pig.y);

  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, 2.0 * Math.PI, true);
  context.fillStyle = "orangeRed";
  context.fill();
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function initialize() {
  ball.t = 0;

  ball.x = bird.width;

  ball.y = stage.height - bird.height;

  ball.radius = 10;

  if (level.value === level.backup) {
    pig.x = level.x;
    pig.y = level.y;
  } else {
    level.x = getRandomArbitrary(pig.width, stage.width - pig.width);
    level.y = getRandomArbitrary(pig.height, stage.height - pig.height);

    pig.x = level.x;
    pig.y = level.y;

    level.backup = level.value;
  }

  context = document.getElementById("canvas").getContext("2d");

  draw();
}

var audio = document.createElement("audio");

function launch(self) {
  self.disabled = true;

  initialize();

  ball.velocity = Number(document.getElementById("velocity").value);
  ball.angle = Number(document.getElementById("angle").value);
  var radian = (ball.angle * Math.PI) / 180;

  ball.vx = ball.velocity * Math.cos(radian);
  ball.vy = ball.velocity * Math.sin(radian);

  draw();

  timer = setInterval(ball.run, 10);

  audio.src = "./res/audio/shoot.wav";
  audio.play();
}

function stop() {
  clearInterval(timer);

  audio.pause();

  document.getElementById("btnLaunch").disabled = false;

  initialize();

  console.log("stop");
}
