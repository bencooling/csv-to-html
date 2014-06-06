/*
 * grunt-csv-to-html
 * https://github.com/bencooling/csv-to-html
 *
 * For Array to Object see: KooiInc 
 * stackoverflow.com/questions/12199051/merge-two-arrays-of-keys-and-values-to-an-object-using-underscore
 * jsfiddle.net/KooiInc/DhzqM/
 * 
 * Copyright (c) 2014 Ben Cooling
 * Licensed under the MIT license.
 */

'use strict';

var mustache = require('mustache'),
    csv      = require('csv');

module.exports = function(grunt) {

  Array.prototype.toObject = function(values){
    if (values){
      if(!/array/i.test(values.constructor)){
        throw new ReferenceError('[values] argument should be an Array');
      }
      if (values.length<this.length){
        throw new RangeError('Imbalanced keys-values ratio: provide at least as much values as there are keys');
      }
    }    
    values = values || this.map(function(v){return true;}); 
    var some;
    this .map(function(v){return [v,this.shift()];},values)
         .map(function(v){this[v[0]]=v[1];},some = {});
    return some;
  };

  grunt.registerMultiTask('csv_to_html', 'Grunt plugin that takes a HTML template, csv data file & compiles HTML', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        rowDelimiter : null,
        delimiter : ',',
        quote : '"',
        escape : '"',
        columns : null,
        comment : '',
        objname : false,
        trim : false,
        ltrim : false,
        rtrim : false,
        auto_parse : false
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      
      var html = '',
          data, tpl;

      // Validate file accessibility, seprate csv from tpl
      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        if (filepath.indexOf("csv") > -1){      
          data = filepath;
        }
        else if (filepath.indexOf("mustache") > -1 || filepath.indexOf("tpl") > -1){
          tpl = grunt.file.read(filepath);
        }
      });

      csv.parse(grunt.file.read(data), options, function(err, rows){
        var headers = rows.splice(0, 1)[0],
            row;

        // loop through csv file and compile html
        for(var i=0,l=rows.length;i<l;i++){
          row = headers.toObject(rows[i]);
          html += mustache.render( tpl, row );
        }

        // Write the destination file.
        grunt.file.write(f.dest, html);

        // Print a success message.
        grunt.log.writeln('File "' + f.dest + '" created.');

      });
    });
  });

};