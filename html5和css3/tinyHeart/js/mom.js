function momObj() {
	this.x = 0;
	this.y = 0;
	this.angle = 0;
	this.bigEye = new Image();
	this.bigBody = new Image();
	this.bigTail = new Image();
}

momObj.prototype.init = function () {
	this.x = canWidth / 2;
	this.y = canHeight / 2;
	this.bigEye.src = 'src/bigEye0.png';
	this.bigBody.src = 'src/bigSwim0.png';
	this.bigTail.src = 'src/bigTail0.png';
}

momObj.prototype.draw = function () {
	// 大鱼跟随鼠标移动
	this.x = lerpDistance(mouseX, this.x, 0.99);
	this.y = lerpDistance(mouseY, this.y, 0.99);

	// 大鱼跟随鼠标旋转
	var deltaY = mouseY - this.y;
	var deltaX = mouseX - this.x;
	var beta = Math.atan2(deltaY, deltaX) + Math.PI; // -PI, PI

	this.angle = lerpAngle(beta, this.angle, 0.6);

	ctx1.save();
	ctx1.translate(this.x, this.y);
	ctx1.rotate(this.angle);
	ctx1.drawImage(this.bigEye, -this.bigEye.width / 2, -this.bigEye.height / 2);
	ctx1.drawImage(this.bigBody, -this.bigBody.width / 2, -this.bigBody.height / 2);
	ctx1.drawImage(this.bigTail, -this.bigTail.width / 2 + 30, -this.bigTail.height / 2);
	ctx1.restore();
}