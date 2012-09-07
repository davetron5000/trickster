require 'stringio'
module Conman
  class SlideRenderer
    def initialize
      @body_io = StringIO.new
    end

    def render_slide(slide_type,content)
      write_slide(slide_type,content,@body_io)
    end

    def content
      @body_io.string
    end

  private

    def write_slide(slide_type,content,slide)
      slide_type,options = slide_type.split(/:/)
      content = content[0..-2] if content[-1] =~ /^\s*$/
      slide.puts "<section class='#{slide_type}'>"
      case slide_type
      when "TITLE"
        slide.puts "<h1>#{content[0]}</h1>"
        slide.puts "<h2>#{content[1]}</h2>" unless content[1].nil?
        slide.puts "<h3>#{content[2]}</h3>" unless content[2].nil?
      when "SECTION"
        slide.puts "<h1>#{content[0]}</h1>"
        slide.puts "<h2>#{content[1]}</h2>" unless content[1].nil?
        slide.puts "<h3>#{content[2]}</h3>" unless content[2].nil?
      when "CODE"
        callouts = ''
        if options =~ /callout=([^\s]+)/
          callouts = $1
        end
        if content[0] =~ /file:\/\/(.*$)/
          content = File.open($1).readlines.map(&:chomp)
        end
        slide.puts "<pre><code class='ruby' data-callout-lines='#{callouts}'>#{content[0]}"
        content[1..-2].each { |line| slide.puts line }
        slide.puts "#{content[-1]}</code></pre>"
      when "BULLETS"
        slide.puts "<h1>#{content[0]}</h1>"
        slide.puts "<ul>"
        slide.puts((content[1..-1].map { |_| "<li>" + _.gsub(/^[*+-o] /,'') + "</li>\n" }).join(""))
        slide.puts "</ul>"
      when "COMMANDLINE"
        slide.print "<pre><code class='no-highlight'>"
        content.each do |line|
          if line =~ /^([>%])/
            prompt = $1.gsub(">","&gt;")
            slide.puts "<span class='cli-prompt'>#{prompt}</span><span class='cli-element cli-command'>#{line[1..-1].gsub(">","&gt;")}</span>"
          else
            slide.puts "<span class='cli-element cli-result'>#{line}</span>"
          end
        end
        slide.puts "</code></pre>"
      when "IMAGE"
        slide.puts "<img src='#{content[0]}'>"
      else
        slide.puts content.join("\n")
      end
      slide.puts "</section>"
    end
  end
end
