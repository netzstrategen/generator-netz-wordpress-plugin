<?php

/**
 * @file
 * Contains \Netzstrategen\<%= namespace %>\Plugin.
 */

namespace Netzstrategen\<%= namespace %>;

/**
 * Main front-end functionality.
 */
class Plugin {

  /**
   * Prefix for naming.
   *
   * @var string
   */
  const PREFIX = '<%= text_domain %>';

  /**
   * Gettext localization domain.
   *
   * @var string
   */
  const L10N = self::PREFIX;

  /**
   * Plugin initialization method.
   *
   * @implements init
   */
  public static function init() {
  }

  /**
   * Loads the plugin textdomain.
   */
  public static function loadTextdomain() {
    load_plugin_textdomain(static::L10N, FALSE, static::L10N . '/languages/');
  }

}
