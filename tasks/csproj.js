/*
 * grunt-csproj
 * https://github.com/pray-m/grunt-csproj
 *
 * Copyright (c) 2016 pray-m
 * Licensed under the MIT license.
 */
'use strict';
var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');
var _ = require('lodash');
var beautify = require('js-beautify').html;
module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks
	var getContentTag = function (file){
		return '<Content Include="' + file + '" />';
	};
	var getFilesFromOptions = function (options, key){
		var result = [];
		options[key].forEach(function (pattern){
			var files = grunt.file.expand({
				cwd: process.cwd()
			}, path.join(options.projectPath, pattern));
			result = result.concat(files.map(function (filepath){
				return path.relative(options.projectPath, filepath);
			}));
		});
		return result;
	};
	grunt.registerMultiTask('csproj', 'sync project assets to .csproj file', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			projectPath: './',
			csporjLocation: 'auto',
			watch: [],
			ignore: []
		});
		//get csprojFile
		var csprojFile = options.csporjLocation;
		if(options.csporjLocation === 'auto'){
			csprojFile = grunt.file.expand({
				cwd: options.projectPath
			}, '*.csproj');
			if(!csprojFile[0]){
				grunt.log.error('cant find .csproj file in ' + options.projectPath);
				return false;
			}
			csprojFile = csprojFile[0];
		}
		csprojFile = path.join(options.projectPath, csprojFile);
		var csproj;
		try{
			csproj = fs.readFileSync(csprojFile).toString();
		}catch(e){
			grunt.log.error('error when read .csproj file, path:' + csprojFile);
			grunt.log.error(e);
			return false;
		}
		//load csproj XML
		var $ = cheerio.load(csproj, {normalizeWhitespace: true, xmlMode: true});
		var $assetsContainer = null;
		var $Project = $('Project');
		if(!$Project.length){
			grunt.log.error('cant find Project element in ' + csprojFile);
			return false;
		}
		$('ItemGroup').each(function (){
			var childrenLength = $(this).children().length;
			var contentLength = $(this).find('Content').length;
			if(childrenLength === contentLength){
				$assetsContainer = $(this);
				return false;
			}
			// console.log($(this).attr('include'));
		});
		if(!$assetsContainer){
			$assetsContainer = $('<ItemGroup></ItemGroup>');
			$('Project').append($assetsContainer);
		}
		var spliter = '><';
			// Concat specified files.
		var src = getFilesFromOptions(options, 'watch');
		var ignoreFiles = getFilesFromOptions(options, 'ignore');
		var existedInCsproj = [];
		if(ignoreFiles.length){
			src = _.difference(src, ignoreFiles);
		}
		var srcJoined = src.join(spliter) + spliter;
		//delete not existed <Content />
		$('Content').each(function (){
			var $this = $(this);
			var filepath = $this.attr('Include');
			if(grunt.file.isMatch(options.watch, filepath)){
				if(srcJoined.indexOf( filepath + spliter) === -1){
					$this.remove();
				}
				else{
					existedInCsproj.push(filepath);
				}
			}
		});
		// console.log(src, existedInCsproj)
		var addFiles = _.difference(src, existedInCsproj);
		var $needAddContents = '';
		addFiles.forEach(function (filepath){
			$needAddContents += getContentTag(filepath);
		});
		$assetsContainer.append($needAddContents);
		grunt.file.write(csprojFile, beautify($.root().html()));
	});

};
