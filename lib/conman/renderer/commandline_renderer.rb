module Conman
  module Renderer
    class CommandlineRenderer
      def render(io,content,options)
        io.print "<pre><code class='no-highlight'>"
        content.each do |line|
          if line =~ /^([>%])/
            prompt = $1.gsub(">","&gt;")
            io.puts "<span class='cli-prompt'>#{prompt}</span> <span class='cli-element cli-command'>#{line[1..-1].gsub(">","&gt;")}</span>"
          else
            io.puts "<span class='cli-element cli-result'>#{line}</span>"
          end
        end
        io.puts "</code></pre>"
      end
    end
  end
end
