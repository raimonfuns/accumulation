var can1,
	can2,
	ctx1,
	ctx2,
	lastTime,
	deltaTime,
	bgPic = new Image(),
	canWidth,
	canHeight,
	ane,
	fruit,
	mom,
	mouseX,
	mouseY,
	baby;

window.onload = game;

function log(value) {
	console.log(value);
}

function game() {
	init();
	lastTime = Date.now();
	gameLoop();
}

function init() {
	can1 = document.getElementById('canvas1');
	can2 = document.getElementById('canvas2');
	ctx1 = can1.getContext('2d'); // fishes, dust, UI, circle
	ctx2 = can2.getContext('2d'); // background, ane, fruits

	can1.addEventListener('mousemove', mouseMove, false);

	bgPic.src = './src/background.jpg';

	canWidth = can1.width;
	canHeight = can1.height;

	ane = new aneObj();
	ane.init();
	
	fruit = new fruitObj();
	fruit.init();
	
	mom = new momObj();
	mom.init();

	mouseX = canWidth / 2;
	mouseY = canHeight / 2;

	baby = new babyObj();
	baby.init();
}

function gameLoop() {
	window.requestAnimFrame(gameLoop);
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;
	// chrome定时器优化
	if (deltaTime > 40) deltaTime = 40;

	drawBackground();
	ane.draw();
	fruit.fruitMonitor();
	fruit.draw();
	ctx1.clearRect(0, 0, canWidth,canHeight);
	mom.draw();
	monFruitsCollision();
	baby.draw();
}

function mouseMove(e) {
	if (e.offsetX || e.layerX) {
		mouseX = e.offsetX ? e.offsetX : e.layerX;
		mouseY = e.offsetY ? e.offsetY : e.layerY;
	}
}