/**
 * Created by chenmingkang on 16/3/1.
 */
module.exports = function(grunt) {
    var jsPath="dist/js/";
    grunt.initConfig({
        jsVersion: grunt.file.readJSON('package.json'),
        concat: {
            options:{
                separator:';\n'
            },
            dist: {
                files: {
                    'src/js/czMobile.all.js':[
                        jsPath + '**/**.js'
                    ]
                }
            }
        },
        //cssmin: {
        //    options: {
        //        banner: '/* kk by zhefengle */',
        //        rebase:false
        //    },
        //    compress: {
        //        files: {
        //            'css/all.min.css': [
        //                'css/reset.css',
        //                'css/animate.min.css',
        //                'css/iconfont.css',
        //                'css/angular-carousel.css',
        //                'css/loading.css',
        //                'css/baseAnimate.css',
        //                'css/base.css'
        //            ]
        //        }
        //    }
        //},
        uglify: {
            options: {
                compress: {
                    drop_console: false
                }
            },
            build: {
                files:{
                    'src/js/czMobile.all.min.js': ["src/js/czMobile.all.js"]
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.task.loadTasks("../../../node_modules/grunt-contrib-concat/tasks");
    // grunt.task.loadTasks("../../../node_modules/grunt-contrib-uglify/tasks");
    //grunt.task.loadTasks("../node_modules/grunt-contrib-cssmin/tasks");

    grunt.registerTask('default', [ 'concat', 'uglify']);

};