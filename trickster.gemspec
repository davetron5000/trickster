# Ensure we require the local version and not one we might have installed already
require File.join([File.dirname(__FILE__),'lib','trickster','version.rb'])
spec = Gem::Specification.new do |s|
  s.name = 'trickster'
  s.version = Trickster::VERSION
  s.author = 'David Copeland'
  s.email = 'davetron5000@gmail.com'
  s.homepage = 'http://your.website.com'
  s.platform = Gem::Platform::RUBY
  s.summary = 'Generate and manage in-browser presentation-slides'
# Add your other files here if you make them
  s.files = %w(
bin/trickster
js/bullets.js
js/lib/highlight-7.1.min.js
js/lib/jquery-1.8.0.min.js
js/lib/jquerytypewriter.js
js/lib/underscore-1.3.3.min.js
js/sizer.js
js/trickster.js
js/utils.js
js/custom.js
erb/index.html.erb
css/highlight-solarized_light.min.css
css/normalize.css
css/styles.css
lib/trickster/file_copier.rb
lib/trickster/renderer/bullets_renderer.rb
lib/trickster/renderer/code_renderer.rb
lib/trickster/renderer/commandline_renderer.rb
lib/trickster/renderer/image_renderer.rb
lib/trickster/renderer/normal_renderer.rb
lib/trickster/slide_parser.rb
lib/trickster/slide_renderer.rb
lib/trickster/version.rb
lib/trickster.rb
  )
  s.require_paths << 'lib'
  s.has_rdoc = true
  s.extra_rdoc_files = ['README.rdoc','trickster.rdoc']
  s.rdoc_options << '--title' << 'trickster' << '--main' << 'README.rdoc' << '-ri'
  s.bindir = 'bin'
  s.executables << 'trickster'
  s.add_development_dependency('rake')
  s.add_development_dependency('rdoc')
  s.add_development_dependency('aruba')
  s.add_development_dependency('jasmine-headless-webkit')
  s.add_development_dependency('clean_test')
  s.add_runtime_dependency('gli','2.0.0')
  s.add_runtime_dependency('sass')
end
