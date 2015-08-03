// 继承属性
function limitDrag(id) {
    Drag.call(this, id);
}

// 继承方法
for (var i in Drag.prototype) {
    limitDrag.prototype[i] = Drag.prototype[i];
}

limitDrag.prototype.mouseMove = function (ev) {
    var oEvent = ev || event;

    var l = this.getPos(oEvent).x - this.disX;
    var t = this.getPos(oEvent).y - this.disY;

    if (l < 0) {
        l = 0;
    } else if (l > document.documentElement.clientWidth - this.oDiv.offsetWidth) {
        l = document.documentElement.clientWidth - this.oDiv.offsetWidth;
    }   

    if (t < 0) {
        t = 0;
    } else if (t > document.documentElement.clientHeight - this.oDiv.offsetHeight) {
        t = document.documentElement.clientHeight - this.oDiv.offsetHeight;
    }  

    this.oDiv.style.left = l + 'px';
    this.oDiv.style.top = t + 'px';
}