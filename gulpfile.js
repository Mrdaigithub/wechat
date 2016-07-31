"use strict";


/**
 * 本gulp配置文
 * 件包含html、css、js 压缩
 * sass转css
 * 自动添加浏览器前缀
 * 合并css文件
 * babel es6转es5
 */

/**
 * 文件目录如下
 *
 *  # gulpfile.js
 *  # node_modules/
 *      # 各种gulp插件包
 *  # src/
 *      # *.html
 *      # images/
 *          # *.[jpg,png,gif]
 *      # sass/
 *          # *.scss
 *      # babel/
 *          # *.js
 *  # dist/
 *      # *.html
 *      # css/
 *          # *.css
 *      # js/
 *          # *.js
 */




let gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),

    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),

    htmlmin = require('gulp-html-minifier');

// css处理
gulp.task('sass', ()=>{
    return gulp.src('./src/sass/**/*.scss')
    // sass转css
        .pipe(sass().on('error', sass.logError))

        // 添加浏览器前缀
        .pipe(autoprefixer({
            browsers: ['last 2 versions','Android >= 4.0','> 1%'],
            cascade: true,
            remove:true
        }))

        // 合并css文件
        // .pipe(concatCss("index.css"))

        // css压缩
        .pipe(cleanCSS({compatibility: 'ie8'}))

        // 加 .min后缀
        .pipe(rename({suffix: '.min'}))

        // 输出
        .pipe(gulp.dest('./Project/Public/Css'));
});

// js处理
gulp.task('babel', () => {
    return gulp.src('./src/babel/**/*.js')

    // es6转js
        .pipe(babel({
            presets: ['es2015']
        }))

        // 压缩js
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./Project/Public/Js'));
});

// html处理
gulp.task('minifyHtml', ()=>{
    gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./Project/Template'))
});

// 静态服务器自动刷新
gulp.task('default',  ['sass'], function() {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/babel/**/*.js',['babel']);
    gulp.watch('./src/*.html',['minifyHtml']);
});