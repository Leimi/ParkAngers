module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-mincss');

	grunt.initConfig({
		concat: {
			dist: {
				src: [ 'js/microajax.js', 'js/Toast.js', 'js/geolocation.js', 'leaflet/leaflet.js', 'js/Leaflet.Control.Geolocation.js', 'js/Leaflet.Control.About.js', 'js/script.js'],
				dest: 'dist/scripts.js'
			}
		},
		min: {
			dist: {
				src: ['dist/scripts.js'],
				dest: 'dist/scripts.min.js'
			}
		},
		mincss: {
			dist: {
				files: {
					'dist/styles.min.css': ['leaflet/leaflet.css', 'css/style.css']
				}
			}
		}
	});
	grunt.registerTask('default', 'concat min mincss');
};