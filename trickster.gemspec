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
  s.description = 'Make aweomse technical presentation with big fonts that size to fit, and awesome syntax highlighting'
  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
  s.has_rdoc = true
  s.extra_rdoc_files = ['README.rdoc','trickster.rdoc']
  s.rdoc_options << '--title' << 'trickster' << '--main' << 'README.rdoc' << '-ri'
  s.bindir = 'bin'
  s.add_development_dependency('rake')
  s.add_development_dependency('rdoc')
  s.add_development_dependency('aruba')
  s.add_development_dependency('jasmine-headless-webkit')
  s.add_development_dependency('clean_test')
  s.add_runtime_dependency('gli','2.0.0')
  s.add_runtime_dependency('sass')
end
