module Conman
  module Renderer
    class CommandlineRenderer
      def render(io,content,options)
        io.print "<pre><code class='no-highlight'>"
        content = split_by_commands_and_results(content)
        content.each do |(prompt,command,result)|
          io.puts "<span class='cli-prompt'>#{prompt}</span> <span class='cli-element cli-command'>#{command}</span>"
          unless result.empty?
            io.puts "<span class='cli-element cli-result'>#{result.join("\n")}</span>"
          end
        end
        io.puts "</code></pre>"
      end

    private 

      def split_by_commands_and_results(content)
        results = []
        current_command_response = []
        content.each do |line|
          if line =~ /^([>%#])(.*)$/
            prompt = $1
            command = $2
            results << current_command_response unless current_command_response.empty?
            current_command_response = [prompt.gsub(">","&gt;"),command,[]]
          else
            current_command_response[2] << line
          end
        end
        results << current_command_response unless current_command_response.empty?
      end
    end
  end
end
