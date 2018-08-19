module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON('./package.json')

    jshint:
      options:
        jshintrc: '.jshintrc'

      all: [
        'Standards/**/*.js'
        'Contrib/PhantomJS/*.js'
      ]

    concat:
      options:
        sourceMap: true
      js:
        src: [
          'Translations/*.js'
          'Standards/**/*.js'
          './HTMLCS.js'
          './HTMLCS.Util.js'
          './HTMLCS.Analyzer.js'
          './HTMLCS.Analyzer.Img.js'
          './HTMLCS.Provider.GoogleCloudVision.js'
          'Contrib/PhantomJS/runner.js'
          'Auditor/HTMLCSAuditor.js'
        ],
        dest: 'build/HTMLCS.merged.js'

    babel:
      dist:
        options:
          sourceMap: true,
          inputSourceMap: grunt.file.readJSON('build/HTMLCS.merged.js.map')
        src: ['build/HTMLCS.merged.js'],
        dest: 'build/HTMLCS.js'

    uglify:
      debug:
        options:
          compress: false
          mangle: false
          beautify: true
          preserveComments: true
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n' + grunt.file.read('Contrib/Build/umd-header.js')
          footer: grunt.file.read('Contrib/Build/umd-footer.js')
        files:
          'build/HTMLCS.js': [
            'Translations/*.js'
            'Standards/**/*.js'
            'HTMLCS.js'
            'HTMLCS.Util.js'
            'HTMLCS.Analyzer.js'
            'HTMLCS.Analyzer.Img.js'
            'HTMLCS.Provider.GoogleCloudVision.js'
            'Contrib/PhantomJS/runner.js'
            'Auditor/HTMLCSAuditor.js'
          ]
      dist:
        options:
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n' + grunt.file.read('Contrib/Build/umd-header.js')
          footer: grunt.file.read('Contrib/Build/umd-footer.js')
        files:
          'build/HTMLCS.js': [
            'Translations/*.js'
            'Standards/**/*.js'
            'HTMLCS.js'
            'HTMLCS.Util.js'
            'HTMLCS.Analyzer.js'
            'HTMLCS.Analyzer.Img.js'
            'HTMLCS.Provider.GoogleCloudVision.js'
            'Contrib/PhantomJS/runner.js'
            'Auditor/HTMLCSAuditor.js'
          ],
      bookmarklet:
        options:
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n' + grunt.file.read('Contrib/Build/header-bookmarklet.js')
          footer: grunt.file.read('Contrib/Build/umd-footer.js')
        files:
          'build/HTMLCS.js': [
            'Translations/*.js'
            'Standards/**/*.js'
            'HTMLCS.js'
            'Contrib/PhantomJS/runner.js'
            'HTMLCS.Util.js'
            'HTMLCS.Analyzer.js'
            'HTMLCS.Analyzer.Img.js'
            'HTMLCS.Provider.GoogleCloudVision.js'
            'Auditor/Auditor_with_beacon.js'
          ],

    copy:
      dist:
        files: [
          {
            expand: true
            flatten: true,
            src: 'Auditor/HTMLCSAuditor.css'
            rename: (dest, src) -> dest + '/HTMLCS.css'
            dest: 'build'
            filter: 'isFile'
          },
          {
            expand: true
            flatten: true,
            src: 'Auditor/Images/*'
            dest: 'build/Images'
            filter: 'isFile'
          },
          {
            expand: true
            flatten: true,
            src: 'licence.txt'
            dest: 'build'
            filter: 'isFile'
          }
        ]
    watch:
      jade:
        files: ['<%= jshint.all %>']
        tasks: ['jshint:all']

  grunt.file.setBase './'
  require('load-grunt-tasks') grunt

  grunt.registerTask 'default', ['jshint']
  grunt.registerTask 'build', ['uglify:dist', 'copy:dist']
  grunt.registerTask 'build-bookmarklet', ['uglify:bookmarklet', 'copy:dist']
  grunt.registerTask 'build-debug', ['uglify:debug', 'copy:dist']
  grunt.registerTask 'build-babel', ['concat','babel', 'copy:dist']


#a.HTMLCS.providers.gcv.isSimilarAlt("car", "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?cs=srgb&dl=car-vehicle-luxury-112460.jpg&fm=jpg", true, a.HTMLCS.analyzer.img.isSimilarTagsToAlt)
#a.HTMLCS.analyzer.img.isSimilarAlt("car", "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?cs=srgb&dl=car-vehicle-luxury-112460.jpg&fm=jpg")
