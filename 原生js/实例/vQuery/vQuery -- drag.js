$().extent('drag', function () {

    var i = 0;
    for (i = 0;i < this.elements.length; i++) {
        drag(this.elements[i]);
    }

    function drag(oDiv) {
        var disX = 0;
        var disY = 0;
        oDiv.onmousedown = function (ev) {
            var oEvent = ev || event;

            disX = getPos(oEvent).x - this.offsetLeft;
            disY = getPos(oEvent).y - this.offsetTop;

            document.onmousemove = function (ev) {
                var oEvent = ev || event;
                
                var l = getPos(oEvent).x - disX;
                var t = getPos(oEvent).y - disY;

                if (l < 0) {
                    l = 0;
                } else if (l > document.documentElement.clientWidth - oDiv.offsetWidth) {
                    l = document.documentElement.clientWidth - oDiv.offsetWidth;
                }

                if (t < 0) {
                    t = 0;
                } else if (t > document.documentElement.clientHeight - oDiv.offsetHeight) {
                    t = document.documentElement.clientHeight - oDiv.offsetHeight;
                }

                oDiv.style.left = l + 'px';
                oDiv.style.top = t + 'px';
            }

            document.onmouseup = function () {
                document.onmouseup = null;
                document.onmousemove = null;
            }

            return false;
        }

        function getPos(oEvent) {
            var scrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft;
            var scrollTop = document.documentElement.scrollTop + document.body.scrollTop;

            return {
                x: oEvent.clientX + scrollLeft,
                y: oEvent.clientY + scrollTop
            };
        }
    }
        
});