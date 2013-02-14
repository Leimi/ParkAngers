<?php $debug = false; $time = time(); $cssVersion = 10; $jsVersion = 10; ?>
<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>ParkAngers : le plan qui t'indique les places de parkings disponibles en temps réel à Angers</title>
		<meta name="description" content="Le plan qui t'indique les places de parkings disponibles en temps réel à Angers. Avec un peu de géolocalisation en bonus.">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<?php if ($debug): ?>
		<link rel="stylesheet" href="leaflet/leaflet.css?v=<?php echo $time ?>">
		<link rel="stylesheet" href="css/style.css?v=<?php echo $time ?>">
		<?php else: ?>
		<link rel="stylesheet" href="dist/styles.min.css?v=<?php echo $cssVersion ?>">
		<?php endif; ?>
	</head>
	<body>
		<!--[if lte IE 8]>
			<p class="obsolete-browser">Vous utilisez un navigateur <strong>obsolète</strong>. <a href="http://browsehappy.com/">Mettez-le à jour</a> pour naviguer sur Internet de façon <strong>sécurisée</strong> !</p>
		<![endif]-->

		<noscript>Désolé, <a href="http://www.enable-javascript.com/fr/" target="_blank">JavaScript requis</a> !</noscript>
		<div id="parking-map">

		</div>

		<div id="help" class="hidden">
			<h1>Parkangers</h1>

			<p>Cette carte vous montre en un clin d'oeil, et en temps réel, le nombre de places de parking restantes sur Angers.</p>
			<p>Vous êtes même géolocalisé ! C'est pas génial ça ?</p>

			<p>Application réalisée à l'arrache par <a href="http://manu.habite.la" target="_blank">Emmanuel Pelletier</a>, données tirées de <a href="http://www.sara-angers.fr" target="_blank">sara-angers.fr.</a></p>
		</div>

		<div id="toast" data-toast-state="hidden" class="box"></div>

		<?php 
		$cachedFile = __DIR__ . '/php/places.json';
		if (file_exists($cachedFile) && filemtime($cachedFile) > (time()-(60*5))) {
			$json = file_get_contents($cachedFile);
			json_decode($json);
			if (json_last_error() == JSON_ERROR_NONE)
				echo "<script>parkAngersCachedData = ", $json, ";</script>";
		}
		?>
		<?php if ($debug): ?>
		<script src="js/microajax.js?v=<?php echo $time ?>"></script>
		<script src="js/geolocation.js?v=<?php echo $time ?>"></script>
		<script src="js/Toast.js?v=<?php echo $time ?>"></script>
		<script src="leaflet/leaflet.js?v=<?php echo $time ?>"></script>
		<script src="js/Leaflet.Control.Geolocation.js?v=<?php echo $time ?>"></script>
		<script src="js/Leaflet.Control.About.js?v=<?php echo $time ?>"></script>
		<script src="js/script.js?2v=<?php echo $time ?>"></script>
		<?php else: ?>
		<script src="dist/scripts.min.js?v=<?php echo $jsVersion ?>"></script>
		<?php endif; ?>
	</body>
</html>
