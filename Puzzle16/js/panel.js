"use strict";

var Panel = WinJS.Class.define(function (field, imageData, order) {
    var x, y, size, ctx, that;

    this.order = order;
    this.position = {
        x: order % 4,
        y: ~~(order / 4)
    };
    this.size = imageData.width / 4;

    this._domElement = field.appendChild(document.createElement("canvas"));
    this._domElement.classList.add("panel");
    this._domElement.width = this.size;
    this._domElement.height = this.size;

    x = this.size * this.position.x;
    y = this.size * this.position.y;

    ctx = this._domElement.getContext("2d");
    ctx.putImageData(imageData, -x, -y, x, y, this.size, this.size);
    this.update();
    that = this;
    this._domElement.addEventListener("MSPointerDown", function () {
        that.dispatchEvent("touchbegin");
    });
}, {
    update: function () {
        this._domElement.style.top = this.size * this.position.y + "px";
        this._domElement.style.left = this.size * this.position.x + "px";
    },
    space: function () {
        this._domElement.classList.add("space");
    },
    unspace: function () {
        this._domElement.classList.remove("space");
    },
    isMovableTo: function (pos) {
        return Math.abs(this.position.x - pos.x) + Math.abs(this.position.y - pos.y) == 1
    },
    moveTo: function (pos) {
        this.position = pos;
        this.order = pos.y * 4 + pos.x;
        this.update();
    }
});
WinJS.Class.mix(Panel, WinJS.Utilities.eventMixin);