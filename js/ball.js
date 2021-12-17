const level = {
  x: 0,
  y: 0,
  value: 1,
  backup: 0,
};

const stage = {
  width: 1000,
  height: 500,
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
    ball.x += ball.vx * ball.t;

    ball.y += -(ball.vy * ball.t - 0.5 * 9.81 * Math.pow(ball.t, 2));

    ball.t += 0.01;

    console.log("time", ball.t);

    if (ball.x < 0 || ball.x >= stage.width || ball.y < 0 || ball.y >= stage.height) {
      stop();
    } else {
      if (ball.x >= pig.x && ball.y >= pig.y && ball.x <= pig.x + pig.width && ball.y <= pig.y + pig.height) {
        document.getElementById("level").innerHTML = "LEVEL " + ++level.value;

        let progressbar = document.querySelector(".progress-bar");
        progressbar.style.width = level.value + "%";
        progressbar.textContent = progressbar.style.width;

        if (!audioCrash.paused || audioCrash.currentTime > 0 || !audioCrash.ended) {
          audioCrash.pause();
        }

        audioCrash.play();

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
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, stage.width, stage.height);

  // context.globalCompositeOperation = "destination-over";
  // context.fillStyle = "rgba(0, 0, 0, 0.1)";
  // context.fillRect(0, 0, canvas.width, canvas.height);

  // context.drawImage(stage.image, 0, 0);
  context.drawImage(bird.image, 0, canvas.height - bird.height);

  context.drawImage(pig.image, pig.x, pig.y);

  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, 2.0 * Math.PI, true);
  context.fillStyle = "orangeRed";
  context.closePath();
  context.fill();
}

function control(velocity, angle) {
  draw();

  let barWidth = velocity * 5;
  let barHeight = 4;
  let rect = { x: bird.width - barWidth + barWidth, y: stage.height - bird.height, width: barWidth * 2, height: barHeight };

  context.fillStyle = "rgba(255, 255, 0, 0.5)";
  context.fillRect(rect.x, rect.y - barHeight / 2, rect.width, rect.height);

  context.translate(rect.x + rect.width / 2 - barWidth, rect.y + rect.height / 2 - barHeight / 2);
  context.rotate(((180 - angle) * Math.PI) / 180);
  context.translate(-rect.x - rect.width / 2 - barWidth, -rect.y - rect.height / 2);

  context.fillStyle = "rgba(255, 255, 0, 0.75)";
  context.fillRect(rect.x, rect.y, rect.width, rect.height);

  console.log(angle, (angle * Math.PI) / 180);
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

const audioShot = document.createElement("audio");
const audioCrash = document.createElement("audio");
audioShot.src = "./res/audio/shot.wav";
audioCrash.src = "./res/audio/crash.wav";

function launch(self) {
  self.disabled = true;

  initialize();

  ball.velocity = Number(document.getElementById("inputVelocity").value);
  ball.angle = Number(document.getElementById("inputAngle").value);
  var radian = (ball.angle * Math.PI) / 180;

  ball.vx = ball.velocity * Math.cos(radian);
  ball.vy = ball.velocity * Math.sin(radian);

  draw();

  timer = setInterval(ball.run, 10);

  audioShot.currentTime = 0;
  audioShot.play();
}

function stop() {
  clearInterval(timer);

  if (!audioShot.paused || audioShot.currentTime > 0 || !audioShot.ended) {
    audioShot.pause();
  }

  document.getElementById("btnLaunch").disabled = false;

  initialize();

  console.log("stop");
}
