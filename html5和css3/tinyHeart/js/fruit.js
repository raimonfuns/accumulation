var fruitObj = function () {
	this.alive = [];
	this.x = [];
	this.y = [];
	this.picWidth = [];
	this.speed = [];
	this.fruitType = [];
	this.orange = new Image();
	this.blue = new Image();
}
fruitObj.prototype.num = 30;
fruitObj.prototype.init = function () {
	for (var i = 0; i < this.num; i++) {
		this.alive[i] = false;
		this.x[i] = 0;
		this.y[i] = 0;
		this.speed[i] = Math.random() * 0.017 + 0.003 // [0.003, 0.02]
		this.born(i);
	}
	this.orange.src = "src/fruit.png";
	this.blue.src = "src/blue.png";
}
fruitObj.prototype.draw = function () {
	for (var i = 0; i < this.num; i++) {
		if (this.alive[i]) {
			var pic = this.fruitType[i] == 'blue' ? this.blue : this.orange;
			if (this.picWidth[i] <= 14) {
				this.picWidth[i] += this.speed[i] * deltaTime;
			} else {
				this.y[i] += -this.speed[i] * 7 * deltaTime;
			}
			ctx2.drawImage(pic, this.x[i] - this.picWidth[i] / 2, this.y[i] - this.picWidth[i] / 2, this.picWidth[i], this.picWidth[i]);
			if (this.y[i] < 10) {
				this.alive[i] = false;
			}
		}
	}
}
fruitObj.prototype.born = function (i) {
	var aneID = Math.floor(Math.random() * ane.num);
	this.x[i] = ane.x[aneID];
	this.y[i] = canHeight - ane.height[aneID];
	this.picWidth[i] = 0;
	this.alive[i] = true;
	this.fruitType[i] = Math.random() < 0.2 ? 'blue' : 'orange';
}
fruitObj.prototype.dead = function (i) {
	this.alive[i] = false;
}
fruitObj.prototype.fruitMonitor = function () {
	var num = 0;
	for (var i = 0;i < fruit.num; i++) {
		if (fruit.alive[i]) num++;
	}
	if (num < 15) {
		this.sendFruit();
	}
}

fruitObj.prototype.sendFruit = function () {
	for (var i = 0; i < fruit.num; i++) {
		if (!fruit.alive[i]) {
			fruit.born(i);
			return false;
		}
	}
}