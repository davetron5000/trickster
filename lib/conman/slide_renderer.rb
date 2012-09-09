require 'stringio'
module Conman
  class SlideRenderer
    def initialize
      @body_io = StringIO.new
    end

    def render_slide(slide_type,content)
      write_slide(slide_type,content,@body_io)
    end

    def content
      @body_io.string
    end

  private
    RENDERERS = Hash.new { 
      Renderer::NormalRenderer.new
    }.tap { |hash|
      hash["IMAGE"] = Renderer::ImageRenderer.new
      hash["COMMANDLINE"] = Renderer::CommandlineRenderer.new
      hash["BULLETS"] = Renderer::BulletsRenderer.new
      hash["CODE"] = Renderer::CodeRenderer.new
    }.freeze

    def write_slide(slide_type,content,slide)
      slide_type,options = slide_type.split(/:/)

      content = content[0..-2] if content[-1] =~ /^\s*$/
      slide.puts "<section class='#{slide_type}'#{background_data(options)}>"
      RENDERERS[slide_type].render(slide,content,options)
      slide.puts "</section>"
    end

    def background_data(options)
      background = ''
      if options =~ /background=([^\s]+)/
        background = " data-background='#{$1}'"
      end
      background
    end
  end
end
