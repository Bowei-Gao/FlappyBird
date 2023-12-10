var Background = document.getElementById("Background");
var Head = document.getElementById("head");
var HeadBird = document.getElementById("headBird");
var StartButton = document.getElementById("StartButton");
var Banner1 = document.getElementById("Banner1");
var Banner2 = document.getElementById("Banner2");
var Score = document.getElementById("Score");
var Digit1 = document.getElementById("digit1");
var Digit2 = document.getElementById("digit2");
var Digit3 = document.getElementById("digit3");
var Bird = document.getElementById("Bird");
var GameOver = document.getElementById("GameOver");
var OKButton = document.getElementById("OKButton");

var y = 3;
var BirdArray = ["img/bird0.png","img/bird1.png"]
var index = 0;
var score = 0;
var PipeArray = [];
var pipeDistance = randomNum(120,350);

var headWaveTimer = setInterval(headWave,200);
var moveBannerTimer = setInterval(moveBanner,30);

function headWave() {
    y *= -1;
    Head.style.top = Head.offsetTop + y + "px";
    HeadBird.src = BirdArray[index++];
    if (index == 2) {
        index = 0;
    }
}

function moveBanner() {
    if (Banner1.offsetLeft <= -343) {
        Banner1.style.left = "343px";
    }
    if (Banner2.offsetLeft <= -343) {
        Banner2.style.left = "343px";
    }
    Banner1.style.left = Banner1.offsetLeft - 3 + "px";
    Banner2.style.left = Banner2.offsetLeft - 3 + "px";

    if (PipeArray.length) {
        for (var i = 0; i < PipeArray.length; i++) {
            PipeArray[i].movePipe();
            var x = Crash(PipeArray[i].downPipe, Bird);
            var y = Crash(PipeArray[i].upPipe, Bird);
            var z = Bird.offsetTop >= 390;
            if (x || y || z) {
                window.clearInterval(moveBannerTimer);
                bird.fallSpeed = 0;
                Background.onclick = null;
                Score.style.display = "none";
                GameOver.style.display = "block";
            }
        }

        if (PipeArray[PipeArray.length - 1].downPipe.offsetLeft < (450 - pipeDistance)) {
            pipeDistance = randomNum(130,250);
            var pipe = new Pipe();
            pipe.createPipe();
            PipeArray.push(pipe);
        }

        if (PipeArray[0].downPipe.offsetLeft == -12) {
            score++;
            if (score < 10) {
                Digit1.style.backgroundImage = "url(img/" + score + ".jpg)";
            } else if (score < 100) {
                Digit2.style.display = "block";
                Digit1.style.backgroundImage = "url(img/" + parseInt(score/10) + ".jpg)";
                Digit2.style.backgroundImage = "url(img/" + score%10 + ".jpg)";
            } else if (score < 1000) {
                Digit3.style.display = "block";
                Digit1.style.backgroundImage = "url(img/" + parseInt(score/100) + ".jpg)";
                Digit2.style.backgroundImage = "url(img/" + parseInt(score/10)%10 + ".jpg)";
                Digit3.style.backgroundImage = "url(img/" + score%10 + ".jpg)";
            }
            console.log(score);
        }

        if (PipeArray[0].downPipe.offsetLeft < -50) {
            Background.removeChild(PipeArray[0].downPipe);
            Background.removeChild(PipeArray[0].upPipe);
            PipeArray.shift(PipeArray[0]);
        }
    }
}

function randomNum(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function Crash(object1, object2) {
    var object1Left = object1.offsetLeft;
    var object1Right = object1.offsetLeft + object1.offsetWidth;
    var object1Top = object1.offsetTop;
    var object1Bottom = object1.offsetTop + object1.offsetHeight;

    var object2Left = object2.offsetLeft;
    var object2Right = object2.offsetLeft + object2.offsetWidth;
    var object2Top = object2.offsetTop;
    var object2Bottom = object2.offsetTop + object2.offsetHeight;

    if (!(object1Left > object2Right || object1Right < object2Left || object1Top > object2Bottom || object1Bottom < object2Top)) {
        return true;
    }

    return false;
}

function Pipe() {
    this.upHeight = randomNum(0,150);
    this.gapHeight = randomNum(150,160);
    this.downHeight = 312 - this.upHeight - this.gapHeight;
    this.upPipe = null;
    this.downPipe = null;

    this.createDiv = function(url, height, positionType, left, top) {
        var Div = document.createElement("div");
        Div.style.backgroundImage = url;
        Div.style.width = "62px";
        Div.style.height = height;
        Div.style.position = positionType;
        Div.style.left = left;
        Div.style.top = top;
        return Div;
    };

    this.createPipe = function() {
        var upDiv1 = this.createDiv("url(img/up_mod.png)", this.upHeight + "px");
        var upDiv2 = this.createDiv("url(img/up_pipe.png)", "60px");
        this.upPipe = this.createDiv(null, null, "absolute", "450px");
        this.upPipe.appendChild(upDiv1);
        this.upPipe.appendChild(upDiv2);

        var downDiv1 = this.createDiv("url(img/down_pipe.png)", "60px");
        var downDiv2 = this.createDiv("url(img/down_mod.png)", this.downHeight +"px");
        this.downPipe = this.createDiv(null, null, "absolute", "450px", 363 - this.downHeight + "px");
        this.downPipe.appendChild(downDiv1);
        this.downPipe.appendChild(downDiv2);

        Background.appendChild(this.upPipe);
        Background.appendChild(this.downPipe);
    };

    this.movePipe = function() {
        this.upPipe.style.left = this.upPipe.offsetLeft - 3 + "px";
        this.downPipe.style.left = this.downPipe.offsetLeft - 3 + "px";
    };
}

var bird = {
    flyTimer: null,
    wingTimer: null,

    fallSpeed: 0,
    flyBird: function(){
        bird.flyTimer = setInterval(fly,40);
        function fly() {
            Bird.style.top = Bird.offsetTop + bird.fallSpeed++ + "px";
            if (Bird.offsetTop < 0) {
                bird.fallSpeed = 2;
            }
            if (Bird.offsetTop >= 395) {
                bird.fallSpeed = 0;
                clearInterval(bird.flyTimer);
                clearInterval(bird.wingTimer);
            }
            if (bird.fallSpeed == 12) {
                bird.fallSpeed = 12;
            }
        }
    },

    wingWave: function() {
        var up = ["url(img/up_bird0.png)", "url(img/up_bird1.png)"];
        var down = ["url(img/down_bird0.png)", "url(img/down_bird1.png)"];
        var i = 0;
        bird.wingTimer = setInterval(wing,120);

        function wing() {
            if (bird.fallSpeed > 0) {
                Bird.style.backgroundImage = down[i++];
                if (i == 2) {i = 0}
            }

            if (bird.fallSpeed < 0) {
                Bird.style.backgroundImage = up[i++];
                if (i == 2) {i = 0}
            }
        }
    },
};

StartButton.onclick = function() {
    Head.style.display = "none";
    StartButton.style.display = "none";
    clearInterval(headWaveTimer);
    Bird.style.display = "block";
    Digit1.style.display = "block";
    bird.flyBird();
    bird.wingWave();
    Background.onclick = function(){
        bird.fallSpeed = -8;
    };
    var pipe = new Pipe();
    pipe.createPipe();
    PipeArray.push(pipe);
}

OKButton.onclick = function() {
    window.location.href = "index.html";
}
