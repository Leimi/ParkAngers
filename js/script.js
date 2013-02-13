/**
 * A L ARAAAAAAAACHEEUUUH
 */
(function() {
	var microAjax = function(url,callbackFunction){this.bindFunction=function(caller,object){return function(){return caller.apply(object,[object])}};this.stateChange=function(object){if(this.request.readyState==4)this.callbackFunction(this.request)};this.getRequest=function(){if(window.ActiveXObject)return new ActiveXObject("Microsoft.XMLHTTP");else if(window.XMLHttpRequest)return new XMLHttpRequest;return false};this.postBody=arguments[2]||"";this.callbackFunction=callbackFunction;this.url=url;
	this.request=this.getRequest();if(this.request){var req=this.request;req.onreadystatechange=this.bindFunction(this.stateChange,this);if(this.postBody!==""){req.open("POST",url,true);req.setRequestHeader("X-Requested-With","XMLHttpRequest");req.setRequestHeader("Content-type","application/x-www-form-urlencoded");req.setRequestHeader("Connection","close")}else req.open("GET",url,true);req.send(this.postBody)}};

	var layer,
		map,
		angers = new L.LatLngBounds(new L.LatLng(47.4, -0.68), new L.LatLng(47.53, -0.43)),
		zoomControl,
		geolocationControl,
		toast = new Toast(),
		interval = null;
		parkings = {
			"Parking Saint Laud": { places: '', coords: new L.LatLng(47.46467, -0.55926) },
			"Parking Marengo": { places: '', coords: new L.LatLng(47.46519, -0.55481) },
			"Parking Haras": { places: '', coords: new L.LatLng(47.46511, -0.55413) },
			"Parking Bressigny": { places: '', coords: new L.LatLng(47.46725, -0.54935) },
			"Parking Ralliement": { places: '', coords: new L.LatLng(47.47114, -0.55175) },
			"Parking Leclerc": { places: '', coords: new L.LatLng(47.471858, -0.545253) },
			"Parking Du Mail": { places: '', coords: new L.LatLng(47.471129, -0.546117) },
			"Parking Poissonnerie": { places: '', coords: new L.LatLng(47.47309, -0.55625) },
			"Parking République": { places: '', coords: new L.LatLng(47.47259, -0.55495) },
			"Parking Molière": { places: '', coords: new L.LatLng(47.47462, -0.55436) },
			"Parking Mitterrand": { places: '', coords: new L.LatLng(47.47743, -0.5495) },
			"Parking CHU": { places: '', coords: new L.LatLng(47.48094, -0.55434) },
			"Parking Berges de Maine": { places: '', coords: new L.LatLng(47.47925, -0.55015) }
		};


	//http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
	layer = new L.TileLayer('http://{s}.tile.cloudmade.com/706e5df4d2b249d7b13db6f130b5ec8a/998/256/{z}/{x}/{y}.png', {
		attribution: '&copy; OpenStreetMap, CC-BY-SA'
	});

	map = new L.Map("parking-map", {
		center: new L.LatLng(47.468891656982414, -0.5517196655273438),
		zoom: 15,
		layers: layer,
		zoomControl: false,
		maxBounds: angers
	});

	zoomControl = new L.Control.Zoom({position: 'bottomleft'}).addTo(map);

	geolocationControl = new L.Control.Geolocation({position: 'topleft', bounds: angers }).addTo(map);
	geolocationControl.on('message', function(message) {
		toast.show(message.text, message.state);
	});

	var getParkingPlaces = function(data) {
		var links = data || null,
			name = null,
			count = null;
		if (!links)
			return false;
		for (var i = links.length - 1; i >= 0; i--) {
			if (!links[i].content)
				break;
			name = links[i].content.replace(/^\s+|\s+$/g, '') || null;
			count = links[i].small.content || null;
			if (name && name in parkings && count)
				parkings[name]['places'] = count*1;
		}
		updateMarkers();
	};

	var updateMarkers = function() {
		if (!parkings)
			return false;
		var icon = null;
		for (var parking in parkings) {
			parkingData = parkings[parking];
			if (parkingData.places !== '') {
				icon = getPlacesIcon(parkingData.places);
				if (parkingData.marker) {
					parkingData.marker.setIcon(icon);
				} else {
					parkingData.marker = new L.Marker(parkingData.coords, {
						icon: icon
					});
					parkingData.marker.bindPopup("<p>" + parking + "</p>", { closeButton: false});
					parkingData.marker.addTo(map);
				}
			}
		}
	};

	var getPlacesIcon = function(places) {
		var iconClass = ' marker-cluster-';
		if (places <= 5) {
			iconClass += 'large';
		} else if (places <= 30) {
			iconClass += 'medium';
		} else {
			iconClass += 'small';
		}
		return new L.DivIcon({ html: '<div><span>' + places + '</span></div>', className: 'marker-cluster' + iconClass, iconSize: new L.Point(40, 40) });
	};

	var check = function() {
		microAjax('php/places.php', function(res) {
			if (res.status == 200) {
				getParkingPlaces(JSON.parse(res.responseText));
			}
		});
	};

	var startChecking = function() {
		check();
		interval = setInterval(function() { check(); }, 30000);
	};

	var stopChecking = function() {
		clearInterval(interval);
		interval = null;
	};

	startChecking();
})();