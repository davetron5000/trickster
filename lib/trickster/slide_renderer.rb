require 'stringio'
module Trickster
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
      hash["FREEFORM"] = Renderer::FreeformRenderer.new
    }.freeze

    def write_slide(slide_type,content,slide)
      slide_type,options = slide_type.split(/:/)

      content = content[0..-2] if content[-1] =~ /^\s*$/
      slide.puts "<section class='#{slide_type}'#{background_data(options)}#{transition_data(options)}>"
      RENDERERS[slide_type].render(slide,content,options)
      slide.puts "</section>"
    end

    def transition_data(options)
      data_attribute('transition',options)
    end

    def background_data(options)
      data_attribute('background',options)
    end

    def data_attribute(attribute,options)
      attribute_element = ''
      if options =~ /#{attribute}=([^\s]+)/
        attribute_element = " data-#{attribute}='#{$1}'"
      end
      attribute_element
    end
  end
end
