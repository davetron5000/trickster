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
        if content[0] =~ /file:\/\/(.*$)/
          content = File.open($1).readlines.map(&:chomp)
        end
        slide.puts "<pre><code class='ruby'>#{content[0]}"
        content[1..-2].each { |line| slide.puts line }
        slide.puts "#{content[-1]}</code></pre>"
      when "BULLETS"
        slide.puts "<h1>#{content[0]}</h1>"
        slide.puts "<ul>"
        slide.puts((content[1..-1].map { |_| "<li>" + _.gsub(/^[*+-o] /,'') + "</li>\n" }).join(""))
        slide.puts "</ul>"
      when "COMMANDLINE"
        slide.puts "<pre><code>#{content.join("\n").gsub(">","&gt;")}</code></pre>"
      when "IMAGE"
        slide.puts "<img src='#{content[0]}'>"
      else
        slide.puts content.join("\n")
      end
      slide.puts "</section>"
    end
  end
end
