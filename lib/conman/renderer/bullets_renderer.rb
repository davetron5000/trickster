module Conman
  module Renderer
    class BulletsRenderer
      def render(io,content,options)
        io.puts "<h1>#{content[0]}</h1>"
        io.puts "<ul>"
        io.puts((content[1..-1].map { |_| "<li>" + _.gsub(/^[*+-o] /,'') + "</li>\n" }).join(""))
        io.puts "</ul>"
      end
    end
  end
end
