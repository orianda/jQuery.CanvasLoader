/*globals module*/

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                'src/index.js'
            ]
        },
        uglify: {
            js: {
                files: {
                    'dist/index.min.js': ['src/index.js']
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'dist/index.min.css': ['src/index.css']
                }
            }
        },
        availabletasks: {
            tasks: {
                options: {
                    filter: 'exclude',
                    tasks: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-available-tasks');

    grunt.registerTask('build', 'Build project for distribution', ['jshint','uglify','cssmin']);
    grunt.registerTask('default', ['availabletasks']);
};