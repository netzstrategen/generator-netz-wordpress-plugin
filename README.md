# WordPress Plugin Yeoman Generator
With this Yeoman Generator, it is possible to easily scaffold a WordPress plugin
following the netzstrategen coding standards.

## Installation
```
$ npm install -g yo generator-netz-wordpress-plugin
```

## Usage
```
$ cd wp-content/plugins
$ mkdir custom
$ cd custom
$ yo netz-wordpress-plugin
```
The files are generated in the current working directory.

## Features
- If the generated plugin supports assets, the [gulp-task-collection](https://github.com/netzstrategen/gulp-task-collection)
  package is installed and the netzstrategen ESLint and Stylelint rules are included.
- Frequently used PHP classes can be automatically created (e.g. `Admin`, `WooCommerce`, `CliCommand`).
- The automatically genereated Travis configuration file makes the plugin ready to be tested.
