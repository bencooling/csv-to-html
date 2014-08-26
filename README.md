# grunt-csv-to-html

> Grunt plugin that compiles HTML with csv and a mustache/handlebars template

[![NPM](https://nodei.co/npm/grunt-csv-to-html.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-csv-to-html)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

`npm install grunt-csv-to-html --save-dev`

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

`grunt.loadNpmTasks('grunt-csv-to-html');`

## The "csv_to_html" task

### Overview
This grunt plugin provides a simple task to compile a HTML file from a data source (csv file) and a template (mustache/handlebars file).

Why csv? Spreadsheets are understood by most non technical minded users who might be supplying content for a web project. 

The csv file can have two special data formats: json and markdown. To include these formats, have the columns prefixed with `json_` or `markdown_`. JSON data can represent arrays and objects which can be used in template sections, while markdown allows formatted copy to be inserted into templates.

In your project's Gruntfile, add a section named `csv_to_html` to the data object passed into `grunt.initConfig()`.

    grunt.initConfig({
      csv_to_html: {
        your_target: {
          files: {
            'tmp/compiled.html': ['test/fixtures/data.csv', 'test/fixtures/tpl.mustache']
          }
        },
      },
    });

### Options

**Default options object**

    {
        registerHelpers: false
      , tpl: false
      , data: false
      , dest: false
      , extensions : {
        tpl: ["mustache", "html", "handlebars", "hbs"]
      , data: ["csv"]
      }
      , csv : {
          rowDelimiter : null
        , delimiter : ','
        , quote : '"'
        , escape : '"'
        , columns : null
        , comment : ''
        , objname : false
        , trim : false
        , ltrim : false
        , rtrim : false
        , auto_parse : false
        }
      }

**registerHelpers**

Register helpers for Handlebars in the format of an array of objects. Each object has a key which is the name of the helper and the value is the helper function.

    registerHelpers:[{ 'lower':function(str){ return str.toLowerCase(); }}
                   , { 'upper':function(str){ return str.toUpperCase(); }}]
    }

**tpl**

Each target will now use a "global" template

    tpl : '/path/tpl.hbs'

**data**

Each target will now use a "global" data file

    data : '/path/data.csv'

**dest**

Each target will now use a "global" destination file

    data : '/path/compiled.html'

**csv**

Configure how to parse the csv data file

    csv: {
        rowDelimiter : null
      , delimiter : ','
      , quote : '"'
      , escape : '"'
      , columns : null
      , comment : ''
      , objname : false
      , trim : false
      , ltrim : false
      , rtrim : false
      , auto_parse : false
      }
    }

**extensions**

If your template or data source files have an extension that is not included by default, you can define what file extensions are accepted for your project. The extensions options key has a tpl or data key with an array of expected file extensions for each.

    // Our template files have a .myStangeExtension
    extensions : {
      tpl: ["myStrangeExtension"]
    }

#### Examples

**Register Handlebar helpers**
    
    csv_to_html: {
      example: {
        options : {
          registerHelpers:[{ 'lower':function(str){ return str.toLowerCase(); }}
                         , { 'upper':function(str){ return str.toUpperCase(); }}]
        }
        , files: {
          'tmp/compiled.html': ['test/fixtures/tpl.mustache', 'test/fixtures/data-json.csv']
        }
      }
    },

This plugin uses the excellent wdavidw/node-csv-parse library to parse csv files.
For further reference of options available see: [Parser options](https://github.com/wdavidw/node-csv-parse#parser-options)


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Changelog

See: [Changelog](https://github.com/bencooling/csv-to-html/blob/master/CHANGELOG.md)

## Release History

* 0.5.0 Fixed issue with multiple targets
* 0.4.0 Added markdown support
* 0.3.0 Added handlebars, json support, fixed async bug; refactored options object 
* 0.2.0 Added dependencies
* 0.1.0 Initial release
