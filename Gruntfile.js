/*jshint
 strict:true,
 node:true
 */
"use strict";

module.exports = function (grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                'src/**/*.js'
            ]
        },
        clean: {
            dist: 'dist'
        },
        concat: {
            dist: {
                expand: true,
                cwd: 'src',
                src: ['index.js', 'index.css'],
                dest: 'dist',
                options: {
                    banner: grunt.file.read('banner.txt')
                }
            }
        },
        'string-replace': {
            dist: {
                expand: true,
                cwd: 'dist',
                src: '**/*',
                dest: 'dist',
                options: {
                    replacements: [
                        {
                            pattern: '{{name}}',
                            replacement: pkg.name
                        },
                        {
                            pattern: '{{version}}',
                            replacement: pkg.version
                        },
                        {
                            pattern: '{{author}}',
                            replacement: pkg.author
                        },
                        {
                            pattern: '{{year}}',
                            replacement: new Date().getFullYear()
                        }
                    ]
                }
            }
        },
        uglify: {
            dist: {
                expand: true,
                cwd: 'dist',
                src: '**/*.js',
                dest: 'dist',
                ext: '.min.js',
                options: {
                    preserveComments: 'some',
                    sourceMap: true
                }
            }
        },
        cssmin: {
            dist: {
                expand: true,
                cwd: 'dist',
                src: '**/*.css',
                dest: 'dist',
                ext: '.min.css'
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

    [
        'grunt-contrib-jshint',
        'grunt-contrib-clean',
        'grunt-contrib-concat',
        'grunt-contrib-uglify',
        'grunt-contrib-cssmin',
        'grunt-string-replace',
        'grunt-available-tasks'
    ].forEach(grunt.loadNpmTasks);

    grunt.registerTask('build', 'Build project for distribution', [
        'jshint',
        'clean',
        'concat',
        'string-replace',
        'uglify',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'availabletasks'
    ]);

};