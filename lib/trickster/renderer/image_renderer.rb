module Trickster
  module Renderer
    class ImageRenderer
      def render(io,content,options)
        io.puts "<img src='#{content[0]}'>"
      end
    end
  end
end
