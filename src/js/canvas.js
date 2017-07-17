/* jshint esversion: 6 */
/* jshint expr: true */
;(function() {
	'use strict';

	const coords = [
		{x:  150,  y: 30,  r: 20},
		{x1: 150, y1: 50, x2: 150, y2: 100},
		{x1: 150, y1: 55, x2: 120, y2: 80},
		{x1: 150, y1: 55, x2: 180, y2: 80},
		{x1: 150, y1: 100, x2: 180, y2: 125},
		{x1: 150, y1: 100, x2: 120, y2: 125}
	];
	
	class Canvas {
		constructor() {
			this.counter = 0;
			this.c = document.querySelector(".game-canvas");
			this.ctx = this.c.getContext("2d");
		}

		Clear() {
			this.ctx.clearRect(0, 0, 350, 170);
			this.counter = 0;
		}

		Draw() {
			this.ctx.beginPath();
			if (++this.counter === 1) {
				this.ctx.arc(coords[0].x, coords[0].y, coords[0].r, 0, 2 * Math.PI, false);
			} else if (this.counter === 5) {
				this.Kill();
			}
			this.ctx.moveTo(coords[this.counter].x1, coords[this.counter].y1);
			this.ctx.lineTo(coords[this.counter].x2, coords[this.counter].y2);
			this.ctx.stroke();
		}

		Kill() {
			this.ctx.moveTo(155, 22);
			this.ctx.lineTo(162, 28);
			this.ctx.moveTo(162, 22);
			this.ctx.lineTo(155, 28);

			this.ctx.moveTo(137, 22);
			this.ctx.lineTo(145, 28);
			this.ctx.moveTo(145, 22);
			this.ctx.lineTo(137, 28);
		}
	}

	window.Canvas = Canvas;
})();