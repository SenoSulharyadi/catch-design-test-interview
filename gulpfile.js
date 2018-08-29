/***************************
*																										*
* Seno Sulharyadi Workflow	*
*																										*
****************************/
var gulp = require('gulp'),
				jade = require('gulp-jade'), // jade
				sass = require('gulp-ruby-sass'), // sass
				autoprefixer = require('gulp-autoprefixer'), // css autoprefixer
				minifyCss = require('gulp-minify-css'), // css minify
				imagemin = require('gulp-imagemin'), // images minify
			 pngquant = require('imagemin-pngquant'), // plugin for minify images
			 spritesmith = require('gulp.spritesmith'), // CSS Sprite
			 uglify = require('gulp-uglify'), // JS Uglify
			 concat = require('gulp-concat'), // Concating files
			 notify = require('gulp-notify'), // notify
			 gutil = require('gulp-util'), // loging on error
			 filter = require('gulp-filter'), // filtering sources
			 rename = require('gulp-rename'), // rename
				watch = require('gulp-watch'), // watch files for changes
				bs = require('browser-sync'), // browser sync
				reload = bs.reload;

/****************************
*																											*
* Environment Configuration
*																											*
*****************************/
var env = {

	dev: 'dev/',
	build: 'build/'

};

/****************************************************
*																																																			*
* Target (configuration for Source and Destination)
*																																																			*
*****************************************************/
var target = {
	/* JADE */
	jadeSrc: env.dev + 'jade/*.jade',
	jadeWatch: env.dev + 'jade/**/*.jade',
	jadeDest: env.build,
	/* SASS */
	sassSrc : env.dev + 'sass',
	sassWatch : env.dev + 'sass/**/*.scss',
	sassDest : env.build + 'css',
	/* JS */
	jsSrc : env.dev + 'js/*.js',
	jsWatch : env.dev + 'js/**/*.js',
	jsDest : env.build + 'js',
	/* IMAGES */
	imageSrc: env.dev + 'images/*',
	imageDest: env.build + 'images',
	/* SPRITE */
	spriteSrc: env.dev + 'images/*',
	spriteDest: env.build + 'images',
	spriteCssDest: env.dev + 'sass/partials',
	/* Filter */
	sassFilter: env.build + 'css/*.css'
	
};

/*******************
*																		*
* JADE
*																		*
********************/
gulp.task('jade', function() {
 // jade configuration
 var jadeConfig = {
 	pretty: true
 //	compileDebug: 'true'
};

return gulp.src(target.jadeSrc)
.pipe(jade(jadeConfig))
.on('error', function(err) {
	gutil.log(gutil.colors.red(err.message));
	gutil.beep();
})
.pipe(gulp.dest(target.jadeDest))
.pipe(notify('!====== JADE Done ======!'));
});


/* Rename Config */
var renameConf = {
 // dirname: "main/text/ciao",
 // basename: "aloha",
 // prefix: "bonjour-",
 suffix: '.min'
 // extname: ".md"
}

/****************************
*																											*
* Sass, Susy & Autoprefixer
*																											*
****************************/
gulp.task('sass', function() {
	var sassConfig = {
		require: ['susy'], // include grid systems
		style: 'expanded',
		lineNumbers: true, // Source line, comment this line on Production
		"sourcemap=none": true
	};

	var autoprefixerConfig = {
		browsers: ['last 5 versions'],
		cascade: false // Changes the CSS indentation to create a nice visual cascade of prefixes.
	};


	return sass(target.sassSrc, sassConfig)
	.on('error', function(err) {
	gutil.log(gutil.colors.red(err.message)); // log the error
	gutil.beep();
})
 .pipe(autoprefixer(autoprefixerConfig)) // autoprefix for other browsers
 .pipe(gulp.dest(target.sassDest))
 .pipe(minifyCss()) // minify
	.pipe(rename(renameConf)) // rename to .min
	.pipe(gulp.dest(target.sassDest))
 .pipe(reload({stream:true})) // injected new compiled sass
 .pipe(notify('!====== CSS Done ======!'));
});

/*******************
*																		*
* 							JS
*																		*
********************/
gulp.task('js', function() {
	return gulp.src(target.jsSrc)
 // .pipe(concat('main.js'))
 .pipe(uglify())
	.pipe(rename(renameConf)) // rename to .min
	.pipe(gulp.dest(target.jsDest));
});

/*******************
*																		*
* Imagemin
*																		*
********************/
gulp.task('image', function () {
	return gulp.src(target.imageSrc)
	.pipe(imagemin({
		optimizationLevel : 6,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest(target.imageDest));
});

/*******************
*																		*
* CSS Sprite
*																		*
********************/
gulp.task('sprite', function () {
	var spriteConf = {
  imgName: 'sprite.png', // New name of the sprite
  cssName: '_sprite.scss' // New name of the css for the sprite
};

var spriteData = gulp.src(target.spriteSrc)
.pipe(spritesmith(spriteConf));
  // Pipe image stream through image optimizer and onto disk
  spriteData.img
  .pipe(imagemin())
  .pipe(gulp.dest(target.spriteDest));
  // Pipe CSS stream through CSS optimizer and onto disk
  spriteData.css
  .pipe(gulp.dest(target.spriteCssDest));
});

/*******************
*																		*
* Browser Sync
*																		*
********************/
gulp.task('bs', function() {
	bs({
		server: {
			baseDir: env.build
		}
	});
});

// Reload all Browsers
gulp.task('bs-reload', function () {
	bs.reload();
});

/*******************
*																		*
* Default task
*																		*
********************/
gulp.task('default',['jade', 'sass', 'bs'], function() {
	gulp.watch(target.sassSrc, ['sass',reload]);
	gulp.watch(target.sassWatch, ['sass',reload]);
	gulp.watch(target.jadeSrc, ['jade', reload]);
	gulp.watch(target.jadeWatch, ['jade', reload]);
});
