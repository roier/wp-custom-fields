<?php
/**
 * @package CAE
 * @version 0.0.1
 */
/*
Plugin Name: Custom API Endpoints
Plugin URI: https://roier.dev/plugins/custom-api-endpoints/
Description: Add new Endpoints to your site.
Author: Roier
Version: 0.0.1
Author URI: https://roier.dev/
*/

require_once( __DIR__ . '/inc/settings.php');

add_action('init', function() {
    new Settings('API', 'rest-api');
});
