

var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    fsExtra = require('fs-extra'),
    plugins = require('gulp-load-plugins')(),
    gutil = require('gulp-util'),
    autoprefixer = require('autoprefixer'),
    del = require('del'),
    runSequence = require('run-sequence'),
    through = require('through2'),
    RSVP = require('rsvp');

var notify = require('gulp-notify');


// ====================
// ERROR HANDLING
// ====================

var errorHandler = function(err) {
    
    // console.log(err);
    
    var errorHeader = '===== ERROR: ===========================================================================\n';
    var errorMessage = err.message;
    var errorFile = '';
    
    if (err.relativePath) {
        var errFile = path.resolve(err.relativePath);
        if (err.line) {
            errFile += ':'+err.line;
        }
        if (err.column) {
            errFile += ':'+err.column;
        }
        errorFile = '\n\nat ('+errFile+')';
    }
    
    
    var stack = err.stack;
    if (err.stack) {
        var stack = err.stack;
        if (stack.substr(0,7) == 'Error: ') {
            stack = stack.substr(7);
        }
        stack = stack.replace(err.message, '');
        
        stack = stack.split('\n');
        if (stack[0] && stack[0] == err) {
            stack.shift();
        }
        stack = stack.join('\n');
    }
    
    gutil.log(gutil.colors.red(errorHeader), errorMessage, stack, errorFile);
    gutil.beep();
    
    if (this.emit) { // sind wir ein Stream?
        this.emit('end');
    }
    
    return false;
};

Promise = RSVP.Promise;
RSVP.on('error', errorHandler);

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);

var plumberErrorHandler = { errorHandler: errorHandler };


// ====================
// Utility/Helper Functions
// ====================


var promisifyStream = function(stream) {
    return new Promise( (resolve, reject) => {
            stream
            .pipe(plugins.plumber(plumberErrorHandler))
            .on('error', reject)
            .on('end', resolve);
});
};



var execCommand = function(cmd, callback) {
    
    var exec = require('child_process').exec;
    
    exec(cmd, function(err) {
        if (err) return callback(err); // return error
        callback(); // finished task
    });
};


// ====================
// Default / Utility Tasks
// ====================

// print available tasks to std output
function listTasks () {
    console.log('Available tasks: ' + Object.keys(gulp.tasks).join(', '));
}



// watch for scss file changes to regenerate files
function watch () {
    
    var watches = {};
    watches['generate.css']     = ['src/**/*.scss'];
    
    plugins.livereload.listen(35733);
    
    var taskNames = [];
    for (var taskName in watches) {
        if (watches.hasOwnProperty(taskName)) {
            taskNames.push(taskName);
        }
    }
    
    runSequence(taskNames, function onFinished() {
        
        var sInfo = 'Watching:\n';
        for (var taskName in watches) {
            if (watches.hasOwnProperty(taskName)) {
                var filler = new Array(30-taskName.length).join(' '); //fügt die passende Anzahl Leerzeichen ein
                sInfo += '   '+taskName+filler+' < '+JSON.stringify(watches[taskName])+'\n';
            }
        }
        gutil.log(gutil.colors.yellow(sInfo));
        
        for (var taskName in watches) {
            if (watches.hasOwnProperty(taskName)) {
                
                gulp.watch(watches[taskName], [taskName]);
            }
        }
        
    });
    
}

function doLivereload() {
    plugins.livereload.reload('Everything');
}




// ====================
// CSS/SASS
// ====================


var postCssProcessors = [
    autoprefixer({browsers: ['last 2 versions', 'ie 9', 'ios 8']})
];

var sassImportOnce = require('node-sass-import-once'); // https://github.com/at-import/node-sass-import-once


//
//  Sass-Optionen
//    - gulp-sass: https://github.com/dlmanning/gulp-sass
//    - man kann Optionen von node-sass verwenden: https://github.com/sass/node-sass#options
//
var sassOptions = {
    outputStyle: 'nested',
    precision: 8, // Bootstrap braucht das
    importer: sassImportOnce
};




var generateCss = function() {
    var sSrc = 'src/theme.scss';
    var sDest = 'dist/';
    
    return gulp.src(sSrc)
            .pipe(plugins.plumber(plumberErrorHandler))
            
            .pipe(plugins.sassGlob())
            .pipe(plugins.sass( Object.assign({
                /* weitere Sass-Optionen */
            }, sassOptions) ))
            .pipe(plugins.postcss(postCssProcessors))
            .pipe(plugins.cleanCss())
            
            .pipe(plugins.stringReplace("\'", "\""))
            
            .pipe(gulp.dest(sDest))
            
            .pipe(plugins.filter('**/*.css')) // verhindern, dass Sourcemaps auch einen Livereload triggern
           // .pipe(plugins.livereload())
            
            .on('end', () => gutil.log(gutil.colors.green('Compiled '+sSrc+' to '+sDest+'')));
};




// ====================
// TASK DEFINITIONS
// ====================

gulp.task('default', listTasks);

gulp.task('watch', watch);

gulp.task('livereload',  doLivereload);

gulp.task('generate.css',  generateCss);


