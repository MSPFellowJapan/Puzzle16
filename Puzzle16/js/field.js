"use strict";

var Field = WinJS.Class.define(function (element, position, size) {
    this._domElement = element;
    this.size = size;
    this.panels = null;
    this.space = null;

    this._domElement.style.position = "absolute";
    this._domElement.style.backgroundColor = "black";
    this._domElement.style.left = position.x + "px";
    this._domElement.style.top = position.y + "px";
    this._domElement.style.width = size + "px";
    this._domElement.style.height = size + "px";
}, {
    createPanels: function (image) {
        var that;
        that = this;
        function onTouchBegin(e) {
            var panel;
            panel = e.target;
            if (!that.isFinished() && panel.isMovableTo(that.space.position)) {
                that.swap(panel, that.space);
                if (that.isFinish()) {
                    setTimeout(function () {
                        that.space.unspace();
                        that.dispatchEvent("finish");
                        that.finish();
                    }, 200);
                }
            }
        }

        this.panels = [];
        for (var i = 0 ; i < 16; i++) {
            this.panels[i] = new Panel(this._domElement, image, i);
            this.panels[i].addEventListener("touchbegin", onTouchBegin, false);
        }
        this.panels[15].space();
        this.space = this.panels[15];
    },
    swap: function (panel1, panel2) {
        var pos1, pos2;
        function clone(obj) {
            var out = {};
            for (var key in obj) {
                out[key] = obj[key];
            }
            return out;
        }
        pos1 = clone(panel1.position);
        pos2 = clone(panel2.position);
        panel1.moveTo(pos2);
        panel2.moveTo(pos1);
    },
    isFinish: function () {
        for (var i = 0 ; i < 16; i++) {
            if (this.panels[i].order != i) {
                return false;
            }
        }
        return true;
    },
    isFinished: function () {
        return this._domElement.classList.contains("finish");
    },
    finish: function () {
        this._domElement.classList.add("finish");
    },
    reset: function () {
        this._domElement.classList.remove("finish");
        this.space.space();
    },
    _swappablePanels: function () {
        var swappables, x, y;
        swappables = [];
        x = this.space.position.x;
        y = this.space.position.y;
        if (x - 1 >= 0) swappables.push(this.panels[y * 4 + x - 1]);
        if (x + 1 < 4) swappables.push(this.panels[y * 4 + x + 1]);
        if (y - 1 >= 0) swappables.push(this.panels[(y - 1) * 4 + x]);
        if (y + 1 < 4) swappables.push(this.panels[(y + 1) * 4 + x]);

        return swappables;
    },
    shuffle: function (count) {
        var swappables;
        while (count--) {
            swappables = this._swappablePanels();
            this.swap(swappables[~~(Math.random() * swappables.length)], this.space);
        }
    },
    destroy: function () {
        this._domElement.parentNode.removeChild(this._domElement);
    }
});
WinJS.Class.mix(Field, WinJS.Utilities.eventMixin);