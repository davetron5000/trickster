require 'fileutils'

When /^I get help for "([^"]*)"$/ do |app_name|
  @app_name = app_name
  step %(I run `#{app_name} help`)
end

Given /^there is no directory named "(.*?)"$/ do |dir|
  FileUtils.rm_rf(dir)
end

def setup_slideshow_dir(src_dir,dest_dir)
  FileUtils.rm_rf("tmp/aruba/#{dest_dir}")
  FileUtils.mkdir_p("tmp/aruba") unless File.exists?("tmp/aruba")
  FileUtils.cp_r("test/#{src_dir}","tmp/aruba/#{dest_dir}")
end
Given /^a slideshow in "(.*?)"$/ do |dir|
  setup_slideshow_dir('slideshow',dir)
end

Given /^a slideshow in "(.*?)" that uses sass$/ do |dir|
  setup_slideshow_dir('slideshow-with-sass',dir)
end



Then /^the file "(.*?)" should contain:$/ do |file, partial_content|
  check_file_content(file, partial_content, true)
end

Then /^the directory "(.*?)" should contain all the trickster JavaScript files and support libs$/ do |dir|
  dir = dir.gsub(/\/js\/?/,'')
  Dir["js/*.js"].each do |js_file|
    step %{a file named "#{dir}/#{js_file}" should exist}
  end
  Dir["js/lib/*.js"].each do |js_file|
    step %{a file named "#{dir}/#{js_file}" should exist}
  end
end

Then /^the directory "(.*?)" should contain all the trickster CSS files and support stylesheets$/ do |dir|
  dir = dir.gsub(/\/css\/?/,'')
  Dir["css/*.css"].each do |css_file|
    step %{a file named "#{dir}/#{css_file}" should exist}
  end
end

Given /^the JS files and CSS files in "(.*?)" are out\-of\-date$/ do |dir|
  FileUtils.rm("tmp/aruba/#{dir}/js/trickster.js")
  FileUtils.rm("tmp/aruba/#{dir}/js/sizer.js")
  FileUtils.rm("tmp/aruba/#{dir}/js/bullets.js")
  FileUtils.rm("tmp/aruba/#{dir}/css/normalize.css")
end

Then /^the JS files and CSS files in "(.*?)" should be up\-to\-date$/ do |dir|
  Dir["js/*.js"].each do |js_file|
    File.exist?("tmp/aruba/#{dir}/#{js_file}").should == true
  end
  Dir["js/lib/*.js"].each do |js_file|
    File.exist?("tmp/aruba/#{dir}/#{js_file}").should == true
  end
  Dir["css/*.css"].each do |css_file|
    File.exist?("tmp/aruba/#{dir}/#{css_file}").should == true
  end
end

Then /^"(.*?)" in "(.*?)" should not have been touched$/ do |file,dir|
  original = File.read(file)
  in_slideshow = File.read("tmp/aruba/#{dir}/#{file}")
  original.should_not == in_slideshow
end
