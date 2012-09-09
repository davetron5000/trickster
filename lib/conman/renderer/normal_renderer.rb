module Conman
  module Renderer
    class NormalRenderer
      def render(io,content,options)
        io.puts "<h1>#{content[0]}</h1>"
        io.puts "<h2>#{content[1]}</h2>" unless content[1].nil? || content[1] == ''
        io.puts "<h3>#{content[2]}</h3>" unless content[2].nil? || content[2] == ''
      end
    end
  end
end
