<?php

// phpcs:disable
/*
  Plugin Name: <%= name %>
  Version: <%= version %>
  Text Domain: <%= text_domain %>
  Description: <%= description %>
  Author: netzstrategen
  Author URI: https://netzstrategen.com
  License: <%= licenseType %>
  License URI: <%= licenseURL %>
*/
// phpcs:enable

namespace Netzstrategen\<%= namespace %>;

if (!defined('ABSPATH')) {
  header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
  exit;
}

/**
 * Loads PSR-4-style plugin classes.
 */
function classloader($class) {
  static $ns_offset;
  if (strpos($class, __NAMESPACE__ . '\\') === 0) {
    if ($ns_offset === NULL) {
      $ns_offset = strlen(__NAMESPACE__) + 1;
    }
    include __DIR__ . '/src/' . strtr(substr($class, $ns_offset), '\\', '/') . '.php';
  }
}
spl_autoload_register(__NAMESPACE__ . '\classloader');

register_activation_hook(__FILE__, __NAMESPACE__ . '\Schema::activate');
register_deactivation_hook(__FILE__, __NAMESPACE__ . '\Schema::deactivate');
register_uninstall_hook(__FILE__, __NAMESPACE__ . '\Schema::uninstall');

add_action('plugins_loaded', __NAMESPACE__ . '\Plugin::loadTextdomain');
add_action('init', __NAMESPACE__ . '\Plugin::init');
<% if (includeAdmin) { %>add_action('admin_init', __NAMESPACE__ . '\Admin::init');<% } %><% if (includeAdmin) { %>

if (defined('WP_CLI') && WP_CLI) {
  \WP_CLI::add_command('custom', __NAMESPACE__ . '\CliCommand');
}
<% } %>
