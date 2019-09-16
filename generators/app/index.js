'use strict';

const yeoman = require('yeoman-generator');
const axios = require('axios');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    const done = this.async();
    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your WordPress Plugin name:',
        default: this.appname
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: '1.0.0'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        default: ''
      },
      {
        type: 'list',
        name: 'license',
        message: 'License:',
        choices: ['gpl-3.0', 'gpl-2.0', 'MIT']
      },
      {
        type: 'checkbox',
        name: 'assets',
        message: 'Which type of assets would you like to include?',
        choices: [
          {
            value: 'styles',
            name: 'Styles (Sass)'
          },
          {
            value: 'scripts',
            name: 'Scripts (JavaScript)'
          },
          {
            value: 'images',
            name: 'Images'
          },
          {
            value: 'fonts',
            name: 'Fonts'
          }
        ],
        default: 0
      },
      {
        type: 'checkbox',
        name: 'classes',
        message: 'Any additional PHP Class to add?',
        choices: [
          {
            value: 'admin',
            name: 'Admin'
          },
          {
            value: 'woocommerce',
            name: 'WooCommerce'
          },
          {
            value: 'clicommand',
            name: 'CliCommand'
          }
        ],
        default: 0
      }
    ], function (answers) {
      this.props = answers;

      axios.get(`https://api.github.com/licenses/${answers.license}`)
        .then(function (response) {
          this.licenseBody = response.data.body;
          this.licenseType = response.data.spdx_id;
          this.licenseURL = response.data.html_url;
          done();
        }.bind(this));

      var assets = (answers.assets.length > 0) ? answers.assets : false;
      function hasAssets (asset) {
        return assets && assets.indexOf(asset) !== -1;
      }
      this.includeAssets = assets;
      this.includeStyles = hasAssets('styles');
      this.includeScripts = hasAssets('scripts');

      var phpClasses = answers.classes;
      function hasClasses (phpClass) {
        return phpClasses && phpClasses.indexOf(phpClass) !== -1;
      }
      this.includeAdmin = hasClasses('admin');
      this.includeCliCommand = hasClasses('clicommand');

      function camelize (string) {
        return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return word.toUpperCase();
        }).replace(/\s+/g, '');
      }
      this.namespace = camelize(answers.name);
    }.bind(this));
  },
  writing: {
    config: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), {
          name: this.props.name.replace(/\s+/g, '-').toLowerCase(),
          title: this.props.name,
          version: this.props.version,
          description: this.props.description,
          licenseType: this.licenseType,
          includeAssets: this.includeAssets,
          includeStyles: this.includeStyles,
          includeScripts: this.includeScripts
        }
      );
      this.fs.copy(
        this.templatePath('.github/'),
        this.destinationPath('.github')
      );
      this.fs.copyTpl(
        this.templatePath('_LICENSE'),
        this.destinationPath('LICENSE'), {
          licenseBody: this.licenseBody
        }
      )
      this.fs.copyTpl(
        this.templatePath('_README.md'),
        this.destinationPath('README.md')
      );
      this.fs.copyTpl(
        this.templatePath('_.gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath('_.editorconfig'),
        this.destinationPath('.editorconfig')
      );
      if (this.props.assets) {
        this.fs.copyTpl(
          this.templatePath('_gulpfile.js'),
          this.destinationPath('gulpfile.js')
        );
      }
      if (this.props.assets) {
        this.fs.copyTpl(
          this.templatePath('_.travis.yml'),
          this.destinationPath('.travis.yml'), {
            includeStyles: this.includeStyles,
            includeScripts: this.includeScripts
          }
        );
      }
    },
    linters: function () {
      this.fs.copyTpl(
        this.templatePath('_phpcs.ruleset.xml'),
        this.destinationPath('phpcs.ruleset.xml')
      );
      if (this.props.assets.indexOf('styles') > -1) {
        this.fs.copyTpl(
          this.templatePath('_.stylelintrc'),
          this.destinationPath('.stylelintrc')
        );
      }
      if (this.props.assets.indexOf('scripts') > -1) {
        this.fs.copyTpl(
          this.templatePath('_.eslintrc.json'),
          this.destinationPath('.eslintrc.json')
        );
      }
    },
    assetsfFolders: function () {
      if (this.props.assets.indexOf('styles') > -1) {
        this.fs.copy(
          this.templatePath('assets/styles/.gitkeep'),
          this.destinationPath('assets/styles/.gitkeep')
        );
      }
      if (this.props.assets.indexOf('scripts') > -1) {
        this.fs.copy(
          this.templatePath('assets/scripts/.gitkeep'),
          this.destinationPath('assets/scripts/.gitkeep')
        );
      }
      if (this.props.assets.indexOf('images') > -1) {
        this.fs.copy(
          this.templatePath('assets/imgs/.gitkeep'),
          this.destinationPath('assets/imgs/.gitkeep')
        );
      }
      if (this.props.assets.indexOf('fonts') > -1) {
        this.fs.copy(
          this.templatePath('assets/fonts/.gitkeep'),
          this.destinationPath('assets/fonts/.gitkeep')
        );
      }
    },
    phpFiles: function () {
      this.fs.copyTpl(
        this.templatePath('_plugin.php'),
        this.destinationPath('plugin.php'), {
          name: this.props.name,
          version: this.props.version,
          text_domain: this.props.name.replace(/\s+/g, '-').toLowerCase(),
          description: this.props.description,
          namespace: this.namespace,
          licenseType: this.licenseType,
          licenseURL: this.licenseURL,
          includeAdmin: this.includeAdmin
        }
      );
      this.fs.copyTpl(
        this.templatePath('languages/_plugin.pot'),
        this.destinationPath('languages/' + this.props.name.replace(/\s+/g, '-').toLowerCase() + '.pot'), {
          name: this.props.name.replace(/\s+/g, '-').toLowerCase()
        }
      );
      this.fs.copyTpl(
        this.templatePath('src/_Plugin.php'),
        this.destinationPath('src/Plugin.php'), {
          text_domain: this.props.name.replace(/\s+/g, '-').toLowerCase(),
          namespace: this.namespace
        }
      );
      this.fs.copyTpl(
        this.templatePath('src/_Schema.php'),
        this.destinationPath('src/Schema.php'), {
          namespace: this.namespace
        }
      );
      if (this.props.classes.indexOf('admin') > -1) {
        this.fs.copyTpl(
          this.templatePath('src/_Admin.php'),
          this.destinationPath('src/Admin.php'), {
            namespace: this.namespace
          }
        );
      }
      if (this.props.classes.indexOf('clicommand') > -1) {
        this.fs.copyTpl(
          this.templatePath('src/_CliCommand.php'),
          this.destinationPath('src/CliCommand.php'), {
            namespace: this.namespace
          }
        );
      }
      if (this.props.classes.indexOf('woocommerce') > -1) {
        this.fs.copyTpl(
          this.templatePath('src/_WooCommerce.php'),
          this.destinationPath('src/WooCommerce.php'), {
            namespace: this.namespace
          }
        );
      }
    }
  },
  install: function () {
    this.installDependencies({
      bower: false
    });
  }
});
