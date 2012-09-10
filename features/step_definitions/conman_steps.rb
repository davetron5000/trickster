require 'fileutils'

When /^I get help for "([^"]*)"$/ do |app_name|
  @app_name = app_name
  step %(I run `#{app_name} help`)
end

Given /^there is no directory named "(.*?)"$/ do |dir|
  FileUtils.rm_rf(dir)
end

Then /^the file "(.*?)" should contain:$/ do |file, partial_content|
  check_file_content(file, partial_content, true)
end

Then /^the directory "(.*?)" should contain all the conman JavaScript files and support libs$/ do |dir|
  dir = dir.gsub(/\/js\/?/,'')
  Dir["js/*.js"].each do |js_file|
    step %{a file named "#{dir}/#{js_file}" should exist}
  end
  Dir["js/lib/*.js"].each do |js_file|
    step %{a file named "#{dir}/#{js_file}" should exist}
  end
end

Then /^the directory "(.*?)" should contain all the conman CSS files and support stylesheets$/ do |dir|
  dir = dir.gsub(/\/css\/?/,'')
  Dir["css/*.css"].each do |css_file|
    step %{a file named "#{dir}/#{css_file}" should exist}
  end
end
