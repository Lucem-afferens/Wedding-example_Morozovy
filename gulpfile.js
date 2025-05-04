const gulp = require('gulp'); // плагин самого галпа

const browserSync = require('browser-sync'); //плагин для запуска браузера
const sass = require('gulp-sass')(require('sass')); // плагин для компиляции sacc в css
const sassGlob = require('gulp-sass-glob'); // плагин для сборки всех файлов sass/scss в один файл sass/scss через @import...
const rename = require("gulp-rename"); //плагин для переименования файлов
const cleanCSS = require('gulp-clean-css');
const autoprefixer  =  require ( 'gulp-autoprefixer' ) ; // плагин для автопрефикса (8 вресии, т.к. новая версия требует перехода всего галпа на систему ES модулей (import вместо requier), иначе таск не отработает)

const sourceMaps = require('gulp-sourcemaps'); // плагин для отслеживания реального место положения элементов в девтулс (не css а файл scss). Будет ломаться при использовании плагина груп-медиа
const groupMedia = require('gulp-group-css-media-queries'); // плагин для группирования медиа-запросов (объединяет медиа-запросы на одно значение). При этом он ломает исходные карты.

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const webpack = require('webpack-stream');

const babel = require('gulp-babel');

const imagemin = require('gulp-imagemin');



const changed = require('gulp-changed');  // --> разобраться с подключением . ошибка пока TypeError: changed is not a function





const clean = require('gulp-clean'); // плагин для удаления к-л папки/файла
const fs = require('fs'); // плагин установленный дефолтно с node.js для отслеживания файловой системы. Нужен для удаления папки по плагину gulp-clean



// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "dist" // запуск браузера через папку dist
        }
    });
});


const plumberNotify = (title) => { // объявляем в константе стрелочную функцию с настройкой для плагинов notify и plumber (выявление ошибки, выведение на экран, но продолжение работы сборки)
    return {
        errorHandler: notify.onError({ // 
            title: title, // при выявлении ошибки покажет заголовок с параметром title 
            message: 'Error <%= error.message %>', // выведение сообщения об ошибке (ее описание , по документации notify)
            sound: false // отключение звука уведомления при появлении экрана с ошибкой
        }),
    };
}

   
gulp.task('styles', function() {
    return gulp
        .src("src/sass/**/**/*.+(sass|scss)")
        .pipe(plumber(plumberNotify('Styles')))
        .pipe(sourceMaps.init()) // запоминает место
        .pipe(sassGlob())
        .pipe(sass({style: 'compressed'}).on('error', sass.logError))
        //.pipe(groupMedia())     -->   ВКЛЮЧИТЬ ПЕРЕД ПРОДАКШЕНОМ ДЛЯ ОПТИМИЗАЦИИ В КОНЦЕ РАБОТЫ!!!
        .pipe(rename({
            prefix: "",
            suffix: ".min", // добавление суфикса к файлу
            }))  
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'})) // совместимость: ie8 
        .pipe(sourceMaps.write()) // возвращает запомнившееся место
        // .pipe(changed ("./src/css"))
        .pipe(gulp.dest("./src/css")) // перенос результата в папку "./src/css"
        .pipe(browserSync.stream())   
});

gulp.task('clean', function(done){
    if (fs.existsSync('./dist/')) {
        return gulp
        .src('./dist/', { read: false }) // { read: false} позволяет не нагружать при переносе плагин чтением файлов, а только делать задачу (ускоряет плагин)
        .pipe(clean({ force: true }));   // { force: true} позволяет удалять файл форсированно(принудительно), не запрашивая разрешения в некоторых файлах
    }
    done(); // позволяет завершить функцию и не выдать ошибку при отсутствии папки dist, которую надо удалить этим таском
    
})

gulp.task('copyCss', function(){ // таск копирует файлы в др место
    return gulp
    .src('./src/css/**/*')
    .pipe(gulp.dest('./dist/css/'))
})
gulp.task('copyIcons', function(){
    return gulp
    .src('./src/icons/**/*')
    .pipe(gulp.dest('./dist/icons/'))
})
gulp.task('copyImg', function(){
    return gulp
    .src('./src/img/**/*', { encoding: false })
//  .pipe(changed('./dist/img/', {hasChanged: changed.compareContents})) 
    .pipe(imagemin({ verbose: true })) // плагин для сжатие изображений (также не последней версии, но работает норм). { verbose: true} - настройка для вывода инфы о том, что и в каком объеме оптимизировано
    .pipe(gulp.dest('./dist/img/'))
})
gulp.task('copyHtml', function(){
    return gulp
    .src('./src/*.html')
    .pipe(gulp.dest('./dist/'))
})
gulp.task('copyPhp', function(){
    return gulp
    .src('./src/*.php')
    .pipe(gulp.dest('./dist/'))
})
gulp.task('copyAudio', function () {
    return gulp
    .src('./src/audio/*', { encoding: false })
    .pipe(gulp.dest('./dist/audio/'))
})
gulp.task('copyVideo', function () {
    return gulp
    .src('./src/video/*')
    .pipe(gulp.dest('./dist/video/'))
})

gulp.task('watch', function() { // таск следит за изменениями в указанным местах и выполняет указанный таск при замеченных изменениях (не работает при удалении файлов и изображений)
    gulp.watch("./src/sass/**/*.+(sass|scss)", gulp.parallel("styles"));
    gulp.watch("./src/css/**/*", gulp.parallel("copyCss"));
    gulp.watch("./src/icons/**/*", gulp.parallel("copyIcons"));
    gulp.watch("./src/img/**/*", gulp.parallel("copyImg"));
    gulp.watch("./src/audio/*", gulp.parallel("copyAudio"));
    gulp.watch("./src/video/*", gulp.parallel("copyVideo"));
    gulp.watch("./src/*.html", gulp.parallel("copyHtml"));
    gulp.watch("./src/*.php", gulp.parallel("copyPhp"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("js"));
    gulp.watch("./src/**/*.html").on("change", browserSync.reload);

})


gulp.task('js', function(){
    return gulp
        .src('./src/js/*.js')
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('./webpack.config')))
        .pipe(gulp.dest('./dist/js'))
})


gulp.task('copyFiles', gulp.parallel('copyCss', 'copyIcons', 'copyImg', 'copyAudio', 'copyVideo', 'copyHtml', 'copyPhp'));

gulp.task('default', gulp.series( // первый аргумент галпа , являющийся именем таска, default, это значит, что имя = gulp
    'clean',
    gulp.parallel('copyFiles', 'styles', 'js'),
    gulp.parallel('watch','server')
));

