/* jshint esversion: 6 */
/* jshint expr: true */
const ShowPopup = (function() {
	'use strict';
	let self;

	function Popup(params) {
		self = this;
		this.params = params;
		
		this.overlay = document.createElement("div");
		this.overlay.className = "overlay";
		document.body.append(this.overlay);

		this.popup = document.createElement("div");
		this.popup.className = "popup";
		this.popup.innerHTML = this.params.body;

		this.closeButton = document.createElement("span");
		this.closeButton.title = "Close the popup";
		this.closeButton.className = "popup-close";
		this.popup.prepend(this.closeButton);
		document.body.append(this.popup);

		setTimeout(
			() => this.overlay.classList.add("animated"),
			100
		);

		this.popup.addEventListener("click", this.OnPopupClick.bind(this));
	}

	Popup.prototype.OnPopupClick = function(e)  {
		if (e.target.classList.contains("popup-close") || e.target.classList.contains("cancel")) {
			typeof this.params.oncancel === 'function' && this.params.oncancel();
			this.Close();
		} else if (e.target.classList.contains("confirm")) {
			typeof this.params.onconfirm === 'function' && this.params.onconfirm();
			this.Close();
		}

	};

	Popup.prototype.Close = function() {
		this.popup.removeEventListener("click", this.OnPopupClick);
		this.overlay.classList.remove("animated");
		this.popup.removeChild(this.closeButton);
		this.popup.innerHTML = "";
		document.body.removeChild(this.popup);
		document.body.removeChild(this.overlay);
		self = void 0;
	};
	
	return function(params) {
		self && self.Close();
		return new Popup(params);
	};
})();
