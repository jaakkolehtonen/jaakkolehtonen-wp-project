// Require our dependencies
const autoprefixer = require( 'autoprefixer' );
const babel = require( 'gulp-babel' );
const browserSync = require( 'browser-sync' );
const concat = require( 'gulp-concat' );
const cssnano = require( 'gulp-cssnano' );
const del = require( 'del' );
const eslint = require( 'gulp-eslint' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const mqpacker = require( 'css-mqpacker' );
const notify = require( 'gulp-notify' );
const plumber = require( 'gulp-plumber' );
const postcss = require( 'gulp-postcss' );
const rename = require( 'gulp-rename' );
const replace = require( 'gulp-replace' );
const sass = require( 'gulp-sass' );
const sassLint = require( 'gulp-sass-lint' );
const sort = require( 'gulp-sort' );
const sourcemaps = require( 'gulp-sourcemaps' );
const uglify = require( 'gulp-uglify' );
const wpPot = require( 'gulp-wp-pot' );

// Set assets paths.
const paths = {
	'css': [ './*.css', '!*.min.css' ],
	'php': [ './*.php', './**/*.php' ],
	'dust': [ './*.dust', './**/*.dust' ],
	'sass': 'assets/sass/**/*.scss',
	'concat_scripts': 'assets/scripts/concat/*.js',
	'scripts': [ 'assets/scripts/*.js', '!assets/scripts/*.min.js' ]
};

/**
 * Handle errors and alert the user.
 */
function handleErrors() {
	const args = Array.prototype.slice.call( arguments );

	notify.onError({
		'title': 'Task Failed [<%= error.message %>',
		'message': 'See console.',
		'sound': 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).apply( this, args );

	gutil.beep(); // Beep 'sosumi' again.

	// Prevent the 'watch' task from stopping.
	this.emit( 'end' );
}

/**
 * Delete style.css and style.min.css before we minify and optimize
 */
gulp.task( 'clean:styles', () =>
	del([ 'style.css', 'style.min.css' ])
);

/**
 * Compile Sass and run stylesheet through PostCSS.
 *
 * https://www.npmjs.com/package/gulp-sass
 * https://www.npmjs.com/package/gulp-postcss
 * https://www.npmjs.com/package/gulp-autoprefixer
 * https://www.npmjs.com/package/css-mqpacker
 */
gulp.task( 'postcss', [ 'clean:styles' ], () =>
	gulp.src( 'assets/sass/*.scss', paths.css )

		// Deal with errors.
		.pipe( plumber({'errorHandler': handleErrors}) )

		// Wrap tasks in a sourcemap.
		.pipe( sourcemaps.init() )

			// Compile Sass using LibSass.
			.pipe( sass({
				'errLogToConsole': true,
				'outputStyle': 'expanded' // Options: nested, expanded, compact, compressed
			}) )

			// Parse with PostCSS plugins.
			.pipe( postcss([
				autoprefixer({
					'browsers': [ 'last 2 version' ]
				}),
				mqpacker({
					'sort': true
				})
			]) )

		// Create sourcemap.
		.pipe( sourcemaps.write() )

		// Create style.css.
		.pipe( gulp.dest( './' ) )
		.pipe( browserSync.stream() )
);

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 */
gulp.task( 'cssnano', [ 'postcss' ], () =>
	gulp.src( 'style.css' )
		.pipe( plumber({'errorHandler': handleErrors}) )
		.pipe( cssnano({
			'safe': true // Use safe optimizations.
		}) )
		.pipe( rename( 'style.min.css' ) )
		.pipe( gulp.dest( './' ) )
);

/**
 * Concatenate and transform JavaScript.
 *
 * https://www.npmjs.com/package/gulp-concat
 * https://github.com/babel/gulp-babel
 * https://www.npmjs.com/package/gulp-sourcemaps
 */
gulp.task( 'concat', () =>
	gulp.src( paths.concat_scripts )

		// Deal with errors.
		.pipe( plumber(
			{'errorHandler': handleErrors}
		) )

		// Start a sourcemap.
		.pipe( sourcemaps.init() )

		// Convert ES6+ to ES2015.
		.pipe( babel({
			'presets': [
				[ 'env', {
					'targets': {
						'browsers': [ 'last 2 versions' ]
					}
				} ]
			]
		}) )

		// Concatenate partials into a single script.
		.pipe( concat( 'global.js' ) )

		// Append the sourcemap to global.js.
		.pipe( sourcemaps.write() )

		.pipe( replace( '    ', '\t' ) )

		// Save global.js
		.pipe( gulp.dest( 'assets/scripts' ) )
		.pipe( browserSync.stream() )
);

/**
  * Minify compiled JavaScript.
  *
  * https://www.npmjs.com/package/gulp-uglify
  */
gulp.task( 'uglify', [ 'concat' ], () =>
	gulp.src( paths.scripts )
		.pipe( plumber({'errorHandler': handleErrors}) )
		.pipe( rename({'suffix': '.min'}) )
		.pipe( babel({
			'presets': [
				[ 'env', {
					'targets': {
						'browsers': [ 'last 2 versions' ]
					}
				} ]
			]
		}) )
		.pipe( uglify({
			'mangle': false
		}) )
		.pipe( gulp.dest( 'assets/scripts' ) )
);

/**
 * Delete the theme's .pot before we create a new one.
 */
gulp.task( 'clean:pot', () =>
	del([ 'languages/jaakkolehtonen-wp-theme.pot' ])
);

/**
 * Scan the theme and create a POT file.
 *
 * https://www.npmjs.com/package/gulp-wp-pot
 */
gulp.task( 'wp-pot', [ 'clean:pot' ], () =>
	gulp.src( paths.php )
		.pipe( plumber({'errorHandler': handleErrors}) )
		.pipe( sort() )
		.pipe( wpPot({
			'domain': 'jaakkolehtonen-wp-theme',
			'package': 'Jaakko Lehtonen WP Theme'
		}) )
		.pipe( gulp.dest( 'languages/jaakkolehtonen-wp-theme.pot' ) )
);

/**
 * Sass linting.
 *
 * https://www.npmjs.com/package/sass-lint
 */
gulp.task( 'sass:lint', () =>
	gulp.src([
		'assets/sass/**/*.scss',
		'!assets/sass/_normalize.scss',
		'!node_modules/**'
	])
		.pipe( sassLint() )
		.pipe( sassLint.format() )
		.pipe( sassLint.failOnError() )
);

/**
 * JavaScript linting.
 *
 * https://www.npmjs.com/package/gulp-eslint
 */
gulp.task( 'js:lint', () =>
	gulp.src([
		'assets/scripts/concat/*.js',
		'assets/scripts/*.js',
		'!assets/scripts/global.js',
		'!assets/scripts/*.min.js',
		'!gulpfile.js',
		'!node_modules/**'
	])
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() )
);

/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task( 'watch', function() {

	// Kick off BrowserSync.
	browserSync({
		'open': false, // Open project in a new tab?
		'injectChanges': true, // Auto inject changes instead of full reload.
		'proxy': 'http://localhost:5000', // Use http://localhost:3000 to use BrowserSync.
		'watchOptions': {
			'debounceDelay': 500 // Wait 500ms second before injecting.
		}
	});

	// Run tasks when files change.
	gulp.watch( paths.sass, [ 'styles' ]);
	gulp.watch( paths.scripts, [ 'scripts' ]);
	gulp.watch( paths.concat_scripts, [ 'scripts' ]);
	gulp.watch([ paths.php, paths.dust ], [ 'markup' ]);
});

/**
 * Create individual tasks.
 */
gulp.task( 'markup', browserSync.reload );
gulp.task( 'i18n', [ 'wp-pot' ]);
gulp.task( 'scripts', [ 'uglify' ]);
gulp.task( 'styles', [ 'cssnano' ]);
gulp.task( 'lint', [ 'sass:lint', 'js:lint' ]);
gulp.task( 'default', [ 'i18n', 'styles', 'scripts' ]);
