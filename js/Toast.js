/**
 * ultra simple "toasts" notifications like on android, without queue, but with "states" (success, warning, error...)
 *
 * style your #toast as you wish and add at least a little
 *		#toast[data-toast-state="hidden"] { display: none; }
 * so that it doesn't display when not wanted
 */
var Toast = function(options) {
	options = options || {};
	this.opts = {};
	this.opts.id = options.id || 'toast';
	this.opts.dataAttribute = options.dataAttribute || 'toast-state';
	this.opts.duration = options.duration || 4000;
	
	this.el = document.getElementById(this.opts.id);
	this.hide(true);
};
Toast.prototype = {
	show: function(string, state) {
		var that = this;
		state = state || 'visible';
		this.hide(true);
		this.el.setAttribute('data-' + this.opts.dataAttribute, state);
		this.el.innerHTML = string;
		this.timeout = setTimeout(function() {
			that.hide();
		}, this.opts.duration);
	},
	hide: function(full) {
		if (full) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		this.el.setAttribute('data-' + this.opts.dataAttribute, 'hidden');
	}
};