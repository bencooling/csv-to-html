/*
 * grunt-csv-to-html
 * https://github.com/bencooling/csv-to-html
 *
 * Accepts Mustache or Handlebars templates
 * Register Handlebar helpers
 * As source files have a template & data file that are distinguished by their extension, can configure accepted extenstions
 * Configure csv parsing engine
 * 
 * For Array to Object see: KooiInc 
 * stackoverflow.com/questions/12199051/merge-two-arrays-of-keys-and-values-to-an-object-using-underscore
 * jsfiddle.net/KooiInc/DhzqM/
 * 
 * Copyright (c) 2014 Ben Cooling
 * Licensed under the MIT license.
 */

'use strict';

var mustache   = require('mustache')
  , Handlebars = require('handlebars')
  , _          = require('underscore')
  , csv        = require('csv')
  , markdown   = require('markdown').markdown
  ;

module.exports = function(grunt) {

  grunt.registerMultiTask('csv_to_html', 'Compile HTML with csv & mustache/handlebars template', function() {
    var done = this.async()
      , options = this.options({
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
        })
      , helpers = options.registerHelpers
      ;

    // Register custom helpers
    if (_.isArray(helpers) && helpers.length){
      _.each(helpers, function(element, index, array){
        var k = Object.keys(element).toString()
          , v = element[k]
          ;
        Handlebars.registerHelper(k, v);
      });
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      
      var html = ''
        , data
        , tpl
        , output
        , src
        ;

      if (options.dest)
        f.dest = options.dest;

      f.src.map(function(filepath) {
        var extension = _.last(filepath.split("."));
        if (_.indexOf(options.extensions.data, extension) > -1)
          data = filepath;
        else if (_.indexOf(options.extensions.tpl, extension) > -1)
          tpl = filepath;
      });

      if (options.tpl)
        tpl = options.tpl;
      if (options.data)
        data =options.data;

      // Validate file accessibility, seprate csv from tpl
      [tpl, data].filter(function(filepath) {
        grunt.log.writeln(filepath);
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      data = grunt.file.read(data); 
      tpl = grunt.file.read(tpl);

      csv.parse(data, options.csv, function(err, rows){

        var headers = rows.splice(0, 1)[0]
          , row
          ;

        // loop through csv file and compile html
        for(var i=0,l=rows.length;i<l;i++){
          row = _.object(headers, rows[i]);
          // Any column with json prefix will be parsed as JSON
          for (var key in row){
            if(/^json_/.test(key)){
              row[key.replace('json_','')] = JSON.parse(row[key]);
            }
            if(/^markdown_/.test(key)){
              row[key.replace('markdown_','')] = markdown.toHTML(row[key]);
            }
          }
          output = Handlebars.compile(tpl);

          html += output(row);
        }

        // Write the destination file.
        grunt.file.write(f.dest, html);

        // Print a success message.
        grunt.log.writeln('File "' + f.dest + '" created.');

        done();

      });

    });
  });

};
