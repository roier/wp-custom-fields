<?php

class Settings {

  public function __construct($name, $icon = 'admin-generic') {
    $this->name = $name;
    $this->icon = $icon;

    add_action('admin_init', array($this, 'settings_init'));
    add_action('admin_menu', array($this, 'settings_page'));
    add_action('rest_api_init', array($this, 'settings_routes'));
  }

  protected function get_normalized_name($name = '') {
    return ucwords(preg_replace('/\-/', ' ', ($name != '') ? $name : $this->name));
  }

  public function settings_routes() {
    register_rest_route($this->name, 'settings', array(
			'methods' => WP_REST_Server::READABLE,
			'callback' => function($data) {
        return get_option($this->name.'_settings');
			},
			'permission_callback' => function() {
        return true;
				return is_user_logged_in();
			}
		));
  }

  public function settings_page() {
    add_menu_page(
      $this->get_normalized_name().' Settings', // Title
      $this->get_normalized_name(), // Menu Title
      'manage_options', // Capability
      $this->name.'-settings', // Menu Slug
      array($this, 'options_page'), // Callable
      'dashicons-'.$this->icon, // Icon
    );
  }

  public function options_page() {
    if (isset($_GET['settings-updated'])) {
      add_settings_error('cae_messages', 'cae_message', __('Settings Saved', 'CAE'), 'updated');
    }
    settings_errors('cae_messages');
    if (WP_DEBUG) {
      wp_enqueue_script('livereload', 'http://localhost:35729/livereload.js', [], '');
    }
    wp_enqueue_script('wordpress', plugin_dir_url( __FILE__ ) . '/../../build/index.js' , ['wp-element', 'wp-blocks', 'wp-components', 'wp-editor', 'wp-i18n', 'wp-api-fetch'], time());
    wp_localize_script('wordpress', 'wordpress', [
      'current_user_id' => get_current_user_id(),
      'user_application_passwords' => WP_Application_Passwords::get_user_application_passwords(get_current_user_id())
    ]);

    ?>
      <div class="mt-4">
        <div class="container">
          <div class="row">
            <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
          </div>
        </div>
        <form action="options.php" method="post">
          <?php settings_fields( $this->name.'-settings' ); ?>
          <div id="<?= $this->name ?>-Settings"></div>
          <?php // submit_button( 'Save Settings', 'btn btn-primary' ); ?>
        </form>
      </div>
    <?php
  }

  function settings_init() {
    register_setting( $this->name.'-settings', $this->name.'_settings' );
  }

}