/**
 * A L ARAAAAAAAACHEEUUUH
 */
(function() {
	var layer,
		map,
		maxZoom = 15,
		angers = new L.LatLngBounds(new L.LatLng(47.4, -0.68), new L.LatLng(47.53, -0.43)),
		zoomControl,
		geolocationControl,
		toast = new Toast(),
		parkingsCoords = {
			// "Parking Ralliement": ,
			// "Parking République": ,
			// "Parking Saint Laud": ,
			// "Parking Marengo": ,
			// "Parking Haras": ,
			// "Parking Du Mail": ,
			// "Parking Leclerc": ,
			// "Parking Molière": ,
			// "Parking Mitterrand": ,
			// "Parking Bressigny": ,
			// "Parking Poissonnerie": ,
			// "Parking CHU": ,
			// "Parking Berges de Maine":
		},
		parkingsPlaces = {};

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

	getParkings = function(data) {
		var links = data.query.results.a || null,
			name = null,
			count = null;
		if (!links)
			return false;
		$.each(links, function(i, val) {
			name = $.trim(val.content) || null;
			count = val.small.content || null;
			if (name && count)
				parkingsPlaces[name] = count*1;
		});
	};

	$.ajax({ url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.sara-angers.fr%2Fmobile%22%20and%20xpath%3D'%2F%2Fli%2Fa%5Bcontains(%40href%2C%22%23%22)%5D'&format=json&callback=getParkings",
		dataType: 'jsonp'
	});
})();