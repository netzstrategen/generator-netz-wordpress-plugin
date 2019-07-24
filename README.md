# WordPress Plugin Yeoman Generator
With this Yeoman Generator, it is possible to easily scaffolding a WordPress plugin
following the netzstrategen coding standards.

## Installation
- `npm install -g yo`
- `npm install -g generator-netz-wordpress-plugin`

## Use
- `yo netz-wordpress-plugin`

## Features
- The generated plugin can optionally have assets. In that case, [gulp-task-collection](https://github.com/netzstrategen/gulp-task-collection)
NPM package is installed. Also, netzstrategen ESLint and Stylelint standards are included.
- It's possible to automatically create frequently used PHP Classes (e.g. `Admin`, `WooCommerce`, `CliCommand`).
- A Travis configuration file is automatically generated. It makes the plugin ready to be tested.
