module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';\n',
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                src: ['src/core.js', 'src/enumerable.js', 'src/class.js', 'src/promise.js'],
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        karma: {
            options: {
                frameworks: ['mocha'],
                files: [
                    'node_modules/expect.js/expect.js',
                    'build/x.js',
                    'test/**/*.js'
                ],

                exclude: [
                    'test/promise/*.js'
                ],

                preprocessors: {
                    'build/x.js': ['coverage']
                },

                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/'
                },
                singleRun: true,
                port: 9999,
                reporters: ['spec', 'coverage'],
                browsers: ['PhantomJS']
            },
            continuous: {
                browsers: ['Chrome', 'Firefox', 'Safari', 'Opera']
            },
            dev: {
                reporters: ['spec', 'coverage']
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-karma')

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'karma:continuous'])
    grunt.registerTask('dev', ['concat', 'uglify', 'karma:dev'])
    grunt.registerTask('build', ['concat', 'uglify'])
    grunt.registerTask('test', ['karma:dev'])
}