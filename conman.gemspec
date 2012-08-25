# Ensure we require the local version and not one we might have installed already
require File.join([File.dirname(__FILE__),'lib','conman','version.rb'])
spec = Gem::Specification.new do |s|
  s.name = 'conman'
  s.version = Conman::VERSION
  s.author = 'David Copeland'
  s.email = 'davetron5000@gmail.com'
  s.homepage = 'http://your.website.com'
  s.platform = Gem::Platform::RUBY
  s.summary = 'Generate and manage in-browser presentation-slides'
# Add your other files here if you make them
  s.files = %w(
bin/conman
lib/conman/version.rb
lib/conman.rb
css/highlight-solarized_light.min.css
css/normalize.css
css/styles.css
js/conman.js
js/lib/highlight-7.1.min.js
js/lib/jquery-1.8.0.min.js
erb/index.html.erb
  )
  s.require_paths << 'lib'
  s.has_rdoc = true
  s.extra_rdoc_files = ['README.rdoc','conman.rdoc']
  s.rdoc_options << '--title' << 'conman' << '--main' << 'README.rdoc' << '-ri'
  s.bindir = 'bin'
  s.executables << 'conman'
  s.add_development_dependency('rake')
  s.add_development_dependency('rdoc')
  s.add_development_dependency('aruba')
  s.add_development_dependency('jasmine-headless-webkit')
  s.add_runtime_dependency('gli','2.0.0')
  s.add_runtime_dependency('kramdown')
end
