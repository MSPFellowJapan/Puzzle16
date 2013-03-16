"use strict";

var Game = WinJS.Class.define(function (element) {
    var that;
    this._domElement = element;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.background = this._domElement.appendChild(document.createElement("canvas"));
    this._domElement.appendChild(this.background);
    this.background.width = this.width;
    this.background.height = this.height;
    
    this.field = null;
    this.fieldSettings = {
        position: {
            x: (this.width - this.height) / 2,
            y: 0
        },
        size: this.height
    }

    this.image = new Image();
    this.imageData = null;
    that = this;
    this.image.addEventListener("load", function () {
        that._setBackgoundImage(that.image);
        if (that.field) {
            that.field.destroy();
        }
        that._createField();
        that.field.shuffle(200);
    }, false);

}, {
    initalize: function (url) {
        this.image.src = url;
    },
    reset: function () {
        this.field.reset();
        this.field.shuffle(200);
    },
    _setBackgoundImage:function (image){
        var scale, offset, dw, dh, dx, dy, sw, sh, sx, sy, ctx;
        scale = Math.min(image.width / this.width, image.height / this.height);
        dw = this.width;
        dh = this.height;
        dx = 0,
        dy = 0,
        sw = dw * scale;
        sh = dh * scale;
        sx = (image.width - sw) / 2;
        sy = (image.height - sh) / 2;
        ctx = this.background.getContext("2d");
        ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        this.imageData = ctx.getImageData(
            this.fieldSettings.position.x,
            this.fieldSettings.position.y,
            this.fieldSettings.size,
            this.fieldSettings.size);
    },
    _createField: function () {
        var element;
        element = document.createElement("div");
        this._domElement.appendChild(element);
        this.field = new Field(element, this.fieldSettings.position, this.fieldSettings.size);
        this.field.createPanels(this.imageData);
    }
});