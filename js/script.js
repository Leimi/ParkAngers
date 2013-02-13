(function() {
	var layer,
		map,
		maxZoom = 15,
		angers = new L.LatLngBounds(new L.LatLng(47.4, -0.68), new L.LatLng(47.53, -0.43)),
		zoomControl,
		geolocationControl,
		toast = new Toast();

	layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; OpenStreetMap, CC-BY-SA',
		maxZoom: maxZoom
	});

	map = new L.Map("parking-map", {
		center: new L.LatLng(47.468891656982414, -0.5517196655273438),
		zoom: maxZoom-2,
		layers: layer,
		zoomControl: false,
		maxBounds: angers
	});

	zoomControl = new L.Control.Zoom({position: 'bottomleft'}).addTo(map);

	geolocationControl = new L.Control.Geolocation({position: 'topleft', bounds: angers }).addTo(map);
	geolocationControl.on('message', function(message) {
		toast.show(message.text, message.state);
	});
})();