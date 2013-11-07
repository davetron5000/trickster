module Trickster
  module Renderer
    class FreeformRenderer
      def render(io,content,options)
        content.each { |line| io.puts line }
      end
    end
  end
end
