module Trickster
  module Renderer
    class CodeRenderer
      def render(io,content,options)
        content = read_file_if_content_is_filename(content)
        content = wrap_lines_with_callouts(content,options)
        io.puts "<pre><code #{language(options)}data-strikeouts='#{strikes(options)}' data-callout-lines='#{callouts(options)}'>#{content}</code></pre>"
      end

    private

      def wrap_lines_with_callouts(content,options)
        i = 0
        callout_lines = callout_option(options).map(&:abs)
        previous_line_called_out = false
        marked_up_lines = ""
        stop_callout_block = "";
        content.each_with_index do |line,i|
          callout_class = '';
          start_callout_block = "";
          stop_callout_block = "";

          if callout_lines.include?(i+1)
            callout_class = "line-callout";
            if !previous_line_called_out
              start_callout_block = "<div class='lines-callout'>";
            end
            previous_line_called_out = true
          else
            if previous_line_called_out
              stop_callout_block = "</div>";
            end
            previous_line_called_out = false;
          end
          marked_up_lines += stop_callout_block
          stop_callout_block = ""
          marked_up_lines += start_callout_block
          marked_up_lines += "<span class='line line-#{i+1} #{callout_class}' >"
          marked_up_lines += line
          marked_up_lines += "</span>\n"
        end
        if previous_line_called_out
          stop_callout_block = "</div>";
        end
        marked_up_lines = marked_up_lines.gsub(/\n$/,'')
        marked_up_lines += stop_callout_block
        marked_up_lines.gsub(/\n$/,'')
      end

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
