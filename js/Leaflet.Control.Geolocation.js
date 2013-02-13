L.Control.Geolocation = L.Control.extend({
	options: {
		position: 'topleft'
	},

	includes: L.Mixin.Events,

	initialize: function (options) {
		L.Util.setOptions(this, options);
		this.bounds = (options.bounds) ? options.bounds : null;
	},

	onAdd: function (map) {
		this.map = map;
		this.watching = false;
		this.marker = null;
		this.circle = null;
		this.className = 'leaflet-control-geolocation';
		this.container = L.DomUtil.create('div', this.className);
		var focusToggle = L.DomUtil.create('a', this.className + '-focus');
		focusToggle.href = "#";
		this.container.appendChild(focusToggle);

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(this.container);
		} else {
			L.DomEvent.addListener(this.container, 'click', L.DomEvent.stopPropagation);
		}

		L.DomEvent.addListener(this.container, 'click', this.toggleFocus, this);
		this.map.on('dragstart', this.stopFocus, this);
		this.map.on('locationfound', this.updateLocation, this);
		this.map.on('locationerror', this.onLocationError, this);

		this.startFocus();

		return this.container;
	},

	toggleWatch: function() {
		if (this.watching)
			this.stopWatching();
		else
			this.startWatching();
	},

	toggleFocus: function(e) {
		if (this.focus)
			this.stopFocus();
		else
			this.startFocus();
		L.DomEvent.preventDefault(e);
	},

	startFocus: function() {
		L.DomUtil.removeClass(this.container, this.className + '-off');
		L.DomUtil.addClass(this.container, this.className + '-on');
		this.focus = true;
		if (this.pos && this.zoom)
			this.map.setView(this.pos, this.zoom);
		if (!this.watching)
			this.startWatching();
	},

	stopFocus: function() {
		L.DomUtil.removeClass(this.container, this.className + '-on');
		L.DomUtil.addClass(this.container, this.className + '-off');
		this.focus = false;
	},

	startWatching: function() {
		this.watching = true;
		this.map.locate({ watch: true, setView: false, timeout: 20000, enableHighAccuracy: true });
	},

	stopWatching: function() {
		this.watching = false;
		this.map.stopLocate();
	},

	updateLocation: function(data) {
		//on vérifie qu'on a bien this.watching à vrai avant de commencer,
		//car il se peut que juste après avoir appelé this.stopWatching(), une dernière position gps soit envoyée à l'évènement locationfound
		if (!this.watching) return;
		var pos = data.latlng,
			acc = data.accuracy,
			zoom = this.map.getZoom();
		if (acc < 1000) {
			if (this.bounds.contains(pos)) {
				this.pos = pos;
				this.zoom = zoom;
				if (this.focus)
					this.map.setView(pos, zoom);
				if (this.marker instanceof L.Marker)
					this.marker.setLatLng(pos);
				else {
					this.marker = new L.Marker(pos, {
						icon: new L.Icon({
							iconUrl: 'img/dot.png',
							iconSize: [40, 40],
							popupAnchor: [0, -3]
						})
					});
					this.marker.bindPopup("<p>Vous êtes ici !</p>", { closeButton: false});
					this.marker.addTo(this.map);
				}

				if (acc >= 150) {
					if (this.circle instanceof L.Circle) {
						this.circle.setLatLng(pos);
						this.circle.setRadius(acc);
					}
					else {
						this.circle = new L.Circle(pos, acc, {
							stroke: true,
							color: "#0077D2",
							weight: 0.5,
							opacity: 0.6,
							fill: true,
							fillColor: "#0077D2",
							fillOpacity: 0.15,
							clickable: false
						}).addTo(this.map);
					}
				} else if (this.circle instanceof L.Circle) {
					this.circle.removeFrom(this.map);
					this.circle = null;
				}
			} else {
				this.stopFocus();
				this.stopWatching();
				this.fire('message', { text: "Vous n'êtes pas dans Angers...<br> Je ne peux pas vous montrer où vous êtes sur le plan !", state: "info"});
			}
		}
	},

	onLocationError: function(data) {
		var text;
		switch(data.code) {
			case 1: text = "Ok, ok, vous voulez pas me dire où vous êtes ! Merci !"; break;
			case 2: text = "Et si vous activiez le GPS pour que je vous trouve facilement ?"; break;
			case 3: text = "J'ai beau essayer de vous trouver. Bah j'vous trouve pas."; break;
			case 4:case 0: text = "Désolé, il y a un truc qui cloche mais je ne sais vraiment pas quoi sur ce coup...";
		}
		this.stopWatching();
		this.fire('message', {text: text, state: "error"});
	}
});