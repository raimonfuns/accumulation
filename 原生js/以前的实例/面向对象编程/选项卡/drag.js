function Drag(id) {
    var _this = this;
    this.oDiv = document.getElementById(id);
    this.disX = 0;
    this.disY = 0;

    this.getPos = function (oEvent) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        return {
            x: oEvent.clientX - scrollLeft,
            y: oEvent.clientY - scrollTop
        }
    }

    this.oDiv.onmousedown = function (ev) {
        _this.mouseDown(ev);
    }
}

Drag.prototype.mouseDown = function (ev) {
    var _this = this;
    var oEvent = ev || event;

    this.disX = this.getPos(oEvent).x - this.oDiv.offsetLeft;
    this.disY = this.getPos(oEvent).y - this.oDiv.offsetTop;

    document.onmousemove = function (ev) {
        _this.mouseMove(ev);
    }

    document.onmouseup = function (ev) {
        _this.mouseUp(ev);
    }

    return false;
}

Drag.prototype.mouseMove = function (ev) {
    var oEvent = ev || event;

    this.oDiv.style.left = this.getPos(oEvent).x - this.disX + 'px';
    this.oDiv.style.top = this.getPos(oEvent).y - this.disY + 'px';
}

Drag.prototype.mouseUp = function () {
    document.onmousemove = null;
    document.onmouseup = null;
}