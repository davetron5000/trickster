module Trickster
  class SlideParser
    attr_reader :title
    def initialize(lines,renderer)
      @lines = lines
      @renderer = renderer
      @title = @lines.shift
    end

    def body
      each_slide do |slide_type,content|
        @renderer.render_slide(slide_type,content)
      end
      @renderer.content
    end

  private

    def each_slide(&block)
      content = []
      slide_type = nil
      @lines.each do |line|
        next if line =~ /^-- /
        if line =~/^!(.*)$/
          block.call(slide_type,content) unless slide_type.nil?
          slide_type = $1
          content = []
        else
          content << line
        end
      end
      block.call(slide_type,content)
    end
  end
end
