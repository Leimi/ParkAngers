/**
 * ultra simple "toasts" notifications like on android, without queue, but with "states" (success, warning, error...)
 *
 * style your #toast as you wish and add at least a little 
 * 		#toast[data-toast-state="hidden"] { display: none; } 
 * so that it doesn't display when not wanted 
 */
var Toast = function(options) {
	this.opts = $.extend({
		selector: '#toast',
		dataAttribute: 'toast-state',
		duration: 4000
	}, options);
	this.hide(true);
};
Toast.prototype = {
	show: function(string, state) {
		var that = this,
			$el = $(this.opts.selector),
			state = state ? state : 'visible';
		this.hide(true);
		$el.attr('data-' + this.opts.dataAttribute, state).html(string);
		this.timeout = setTimeout(function() { 
			that.hide();
		}, this.opts.duration);
	},
	hide: function(full) {
		if (full) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		$(this.opts.selector).attr('data-' + this.opts.dataAttribute, 'hidden');
	}
}