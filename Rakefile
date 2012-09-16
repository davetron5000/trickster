require 'rake/clean'
require 'bundler'
require 'rdoc/task'
require 'cucumber'
require 'cucumber/rake/task'

Bundler::GemHelper.install_tasks

CLEAN << "test/slideshow/index.html"

Rake::RDocTask.new do |rd|
  rd.main = "README.rdoc"
  rd.rdoc_files.include("README.rdoc","lib/**/*.rb","bin/**/*")
  rd.title = 'Your application title'
end

CUKE_RESULTS = 'results.html'
CLEAN << CUKE_RESULTS
CLOBBER << 'tmp/aruba'
desc 'Run features'
Cucumber::Rake::Task.new(:features) do |t|
  opts = "features --format html -o #{CUKE_RESULTS} --format progress -x"
  opts += " --tags #{ENV['TAGS']}" if ENV['TAGS']
  t.cucumber_opts =  opts
  t.fork = false
end

desc 'Run features tagged as work-in-progress (@wip)'
Cucumber::Rake::Task.new('features:wip') do |t|
  tag_opts = ' --tags ~@pending'
  tag_opts = ' --tags @wip'
  t.cucumber_opts = "features --format html -o #{CUKE_RESULTS} --format pretty -x -s#{tag_opts}"
  t.fork = false
end

task :cucumber => :features
task 'cucumber:wip' => 'features:wip'
task :wip => 'features:wip'

task :jasmine do |t|
  unless system("jasmine-headless-webkit -j test/jasmine.yml")
    exit -1
  end
end
CLOBBER << ".jhw-cache"

require 'rake/testtask'
Rake::TestTask.new do |t|
  t.libs << "test"
  t.test_files = FileList['test/*_test.rb']
end

desc 'Add CSS markup to the theme files for callouts'
task 'patch_css' do
  Dir["css/themes-orig/*.css"].each do |original_css_file|
    new_css_file = "css/themes/" + File.basename(original_css_file)
    background = nil
    opacity = nil
    look_for_background = false
    File.open(new_css_file,'w') do |new_file|
      File.open(original_css_file).readlines.each do |line|
        new_file.puts line

        if look_for_background
          if line =~ /background-color: (.*);/
            background = $1;
            look_for_background = false
          elsif line =~ /background: (.*);/
            background = $1;
            look_for_background = false
          elsif line =~ /opacity: (.*);/
            opacity = $1;
            look_for_background = false
          end
        end

        if line =~ /^pre .tex .formula {/
          look_for_background = true
        end
      end
      string = <<EOS
pre {
  counter-reset: lines;
}
pre .line {
  counter-increment: lines;
}
pre .line::before {
  content: counter(lines); text-align: right;
  display: inline-block; width: 2em;
  padding-right: 0.5em; margin-right: 0.5em;
  color: #eee8d5;
}

pre .line-callout::before {
  content: '\\2192'; text-align: right;
  display: inline-block; width: 2em;
  padding-right: 0.5em; margin-right: 0.5em;
  color: #002b36;
}

.lines-callout {
  border-radius: 0.25em;
  padding-top: 0.15em;
  padding-bottom: 0.15em;
}

.lines-callout {
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  #{background.nil? ? opacity.nil? ? '/* Could not determine background for callouts */' : ("opacity: " + opacity + ";") : ("background: " + background + ";")}
}
EOS
      new_file.puts string
    end
    puts "Migrated #{original_css_file}"
  end
end

task :default => [:test,:jasmine,:features]
