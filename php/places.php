<?php
//vive yql !
function getYqlResults($query) {
	if (!extension_loaded('curl')) {
		throw new Exception('curl extension is not available');
	}
	$url = "http://query.yahooapis.com/v1/public/yql?format=json&q=".urlencode($query);
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_HEADER, 0);
	curl_setopt($curl, CURLOPT_URL, $url);
	$response = curl_exec($curl);
	$infos = curl_getinfo($curl);
	curl_close($curl);
	if ($infos['http_code'] == 200) {
		$response = json_decode($response);
		$response = $response->query->results;
	}
	return array('code' => $infos['http_code'], 'response' => $response);
}

$cachedFile = __DIR__ . '/places.json';
if (file_exists($cachedFile) && filemtime($cachedFile) > (time()-29))
	echo file_get_contents($cachedFile); 
else {
	$places = getYqlResults("select * from html where url='http://www.sara-angers.fr/mobile' and xpath='//li/a[contains(@href,\"#\")]'");

	if ($places['code'] == 200) {
		$places = $places['response']->a;
		foreach ($places as &$place) {
			$place->content = trim($place->content);
		}
		$data = json_encode($places);
		echo $data;
		file_put_contents($cachedFile, $data);
	}
}
?>