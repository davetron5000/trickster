module Conman
  module Renderer
    class CodeRenderer
      def render(io,content,options)
        content = read_file_if_content_is_filename(content)
        io.puts "<pre><code #{language(options)}data-strikeouts='#{strikes(options)}' data-callout-lines='#{callouts(options)}'>#{content[0]}"
        content[1..-2].each { |line| io.puts line }
        io.puts "#{content[-1]}</code></pre>"
      end

    private

    def read_file_if_content_is_filename(content)
      if content[0] =~ /file:\/\/(.*$)/
        File.open($1).readlines.map(&:chomp)
      else
        content
      end
    end
    
      def language(options)
        language = ''
        if options =~/language=([^\s]+)/
          language = "class='#{$1}' "
        end
        language
      end

      def callout_option(options)
        if options =~ /callout=([^\s]+)/
          callouts = $1
          callouts.split(/,/).map(&:to_i)
        else
          []
        end
      end

      def callouts(options)
        callout_option(options).map(&:abs).join(',')
      end

      def strikes(options)
        callout_option(options).select { |_| _ < 0 }.map(&:abs).join(',')
      end
    end
  end
end
