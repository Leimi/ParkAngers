L.Control.About = L.Control.extend({
	options: {
		position: 'topright'
	},

	includes: L.Mixin.Events,

	initialize: function (options) {
		L.Util.setOptions(this, options);
		this.el = (options.el) ? options.el : null;
	},

	onAdd: function (map) {
		this.map = map;
		this.className = 'leaflet-control-about';
		this.container = L.DomUtil.create('div', this.className);
		this.container.innerHTML = "&nbsp;?&nbsp;";

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(this.container);
		} else {
			L.DomEvent.addListener(this.container, 'click', L.DomEvent.stopPropagation);
		}

		L.DomEvent.addListener(this.container, 'click', this.toggle, this);
		L.DomEvent.addListener(this.el, 'click', this.toggle, this);

		return this.container;
	},

	toggle: function(e) {
		if (L.DomUtil.hasClass(this.el, 'hidden'))
			L.DomUtil.removeClass(this.el, 'hidden');
		else
			L.DomUtil.addClass(this.el, 'hidden');
		L.DomEvent.preventDefault(e);
	}
});