// Définition des dépendances dont on a besoin pour exécuter les tâches
var
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin'), // Minifier for png, jpg, svg
    destclean = require('gulp-dest-clean'),
    newer = require('gulp-newer'),
    size = require('gulp-size'), // Connaître la taille d'un fichier
    imacss = require('gulp-imacss'), // Convert image to DATAuri
    stylus = require('gulp-stylus'), // Preprocesseur stylus
    htmlclean = require('gulp-htmlclean'),
    preprocess = require('gulp-preprocess'),
    pkg = require('./package.json'),
    browserSync = require('browser-sync'),
    pug = require('gulp-pug'), // Préprocesseur html
    del = require('del');

// Définition de quelques variables générales pour notre gulpfile
var
    devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),
    // export NODE_ENV=production pour définir la variable
    // echo $NODE_ENV pour afficher la valeur de la variable
    source = 'source/',
    dest = 'build/';

// Définition de quelques variables liées à nos tâches (options de tâches)
var
    imagesOpts = {
        in: source + 'images/*.*',
        out: dest + 'images/',
        watch: source + 'images/*.*'
    },
    imageUriOpts = {
        in: source + 'images/inline/*.*',
        out: source + 'scss/images/',
        filename: '_datauri.styl',
        namespace: 'img'
    },
    cssStylus = {
      in: source + 'stylus/main.styl',
      watch: [source + 'stylus/**/*'],
      out: dest + 'css/'
    },

    pugOpts = {
        in: source + '*.pug',
        watch: [source + '*.pug', source + 'template/**/*'],
        out: dest,
        context: {
            devBuild: devBuild,
            author: pkg.author
        }
    },

    syncOptions = {
      server: {
        baseDir: dest,
        index: 'index.html'
      },
      open: true,
      notify: true
    };


// Définition des tâches
gulp.task('clean', function () {
    del([dest + '*']);
});

gulp.task('images', function () {
    return gulp.src(imagesOpts.in)
        .pipe(destclean(imagesOpts.out))
        .pipe(newer(imagesOpts.out))
        .pipe(size({title: 'Images size before compression: ', showFiles: true}))
        .pipe(imagemin())
        .pipe(size({title: 'Images size after compression: ', showFiles: true}))
        .pipe(gulp.dest(imagesOpts.out));
});

gulp.task('imageuri', function () {
    return gulp.src(imageUriOpts.in)
        .pipe(imagemin())
        .pipe(imacss(imageUriOpts.filename, imageUriOpts.namespace))
        .pipe(gulp.dest(imageUriOpts.out));
});


gulp.task('stylus', function () {
   return gulp.src(cssStylus.in)
        .pipe(stylus())
        .pipe(gulp.dest(cssStylus.out))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('pug', function () {
    var page = gulp.src(pugOpts.in)
                .pipe(pug({pretty: true}))
                .pipe(preprocess({context: pugOpts.context}));

        if (!devBuild) {
            page = page
                .pipe(size({title:'HTML avant minification:'}))
                .pipe(htmlclean())
                .pipe(size({title:'HTML après minification:'}));
        }
        return page.pipe(gulp.dest(pugOpts.out));
})

gulp.task('browserSync', function() {
  browserSync(syncOptions);
});

// Tâche par défaut exécutée lorsqu’on tape juste *gulp* dans le terminal
gulp.task('default', ['images', 'stylus', 'pug', 'browserSync'], function () {
    gulp.watch(pugOpts.watch, ['pug', browserSync.reload]);
    gulp.watch(imagesOpts.watch, ['images']);
    gulp.watch(cssStylus.watch, ['stylus']);
});