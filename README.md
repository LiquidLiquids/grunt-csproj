# grunt-csproj

> sync project assets to .csproj file

## Getting Started
This project is in dev.Do not use it.

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install git+https://github.com/pray-m/grunt-csproj.git
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-csproj');
```

## The "csproj" task
Task targets and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Overview
In your project's Gruntfile, add a section named `csproj` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  csproj: {
    options: {
      // Task-specific options go here.
      projectPath: './test/project',
      csporjLocation: 'auto',
      watch: ['Scripts/*.js', 'Content/**/*.css'],
      ignore: []
    }
  },
});
```

### Options

#### options.projectPath
Type: `String`
Default value: `./`

projectPath

#### options.csporjLocation
Type: `String`
Default value: `'auto'`

.csproj file's location, if value is 'auto' it will find first .csproj file in projectPath.

#### options.watch
Type: `Array`
Default value: `[]`

need watch files(relative from projectPath).

#### options.ignore
Type: `Array`
Default value: `[]`

ignore some files(relative from projectPath) when append to .csjproj.

### Usage Examples

```js
grunt.initConfig({
  csproj: {
    options: {
      projectPath: './test/project',
      csporjLocation: 'auto',
      watch: ['Scripts/*.js', 'Content/**/*.css'],
      ignore: ['Scripts/test-ignored.js']
    }
  },
});
```

project assets : 

	Scripts/test.js,
	
	Scripts/test-ignored.js, 
	
	Script/test-notin-csproj.js,
	
	Content/test.css,
	
	Content/test-notin-csproj.css

#### before task test.csproj

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="12.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
	<ItemGroup>
		<Content Include="Content\test.css" />
		<Content Include="Scripts\test.js" />
		<Content Include="Global.asax" />
		<Content Include="Content\test2.css" />
		<Content Include="Scripts\test2.js" />
	</ItemGroup>
</Project>
```

#### after task test.csproj

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="12.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <ItemGroup>
        <Content Include="Content\test.css" />
        <Content Include="Scripts\test.js" />
        <Content Include="Global.asax" />
        <Content Include="Scripts\test-notin-csproj.js" />
        <Content Include="Content\test-notin-csproj.css" />
    </ItemGroup>
</Project>
```

## Release History
_(Nothing yet)_
