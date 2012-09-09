module Conman
  module Renderer
    class CodeRenderer
      def render(io,content,options)
        callouts = ''
        strikes = ''
        if options =~ /callout=([^\s]+)/
          callouts = $1
          callouts = callouts.split(/,/).map(&:to_i)
          strikes = callouts.select { |_| _ < 0 }.map(&:abs).join(',')
          callouts = callouts.map(&:abs).join(',')
        end
        if content[0] =~ /file:\/\/(.*$)/
          content = File.open($1).readlines.map(&:chomp)
        end
        io.puts "<pre><code class='ruby' data-strikeouts='#{strikes}' data-callout-lines='#{callouts}'>#{content[0]}"
        content[1..-2].each { |line| io.puts line }
        io.puts "#{content[-1]}</code></pre>"
      end
    end
  end
end
