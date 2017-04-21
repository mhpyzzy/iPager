var gulp=require('gulp'),
    clean=require('gulp-clean'),
     minifyCss=require('gulp-clean-css'),
     notify=require('gulp-notify'),
     rename=require('gulp-rename'),
     sass=require('gulp-sass'),
     path=require('path'),
     uglify=require("gulp-uglify"),
     runSequence = require('run-sequence');


var _={
    js:path.resolve(__dirname,'src/**/*.js'),
    css:path.resolve(__dirname,'src/**/*.css'),
    scss:path.resolve(__dirname,'src/**/*.scss'),
    build:path.resolve(__dirname,'build/')
}
gulp.task('clean',function(){
   return gulp.src(_.build,{read:false})
        .pipe(clean())
        .pipe(notify({message:'清除完成！'}))
});
gulp.task('uglify',function(){
       return gulp.src(_.js)
            .pipe(rename({suffix:'.min'}))
            .pipe(uglify())
            .pipe(gulp.dest(_.build))
            .pipe(notify({message:'js压缩完成！'}))
});

gulp.task('sass', function () {
    return gulp.src(_.scss)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(rename({suffix:'.min'}))
        .pipe(minifyCss())
        .pipe(gulp.dest(_.build))
        .pipe(notify({message:'scss编译压缩完成！'}))
});
 
gulp.task('watchScss', function () {
  gulp.watch(_.scss, ['sass']);
});

gulp.task('default',function(){
    runSequence('clean',['uglify','sass'])
})