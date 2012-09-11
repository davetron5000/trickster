require 'test_helper.rb'

class SlideParserTest < Clean::Test::TestCase

  class RememberingRenderer
    attr_reader :rendered_slides
    def initialize
      @rendered_slides = []
    end
    def render_slide(slide_type,content)
      @rendered_slides << [slide_type,content]
    end
    def content
      @rendered_slides.inspect
    end
  end

  test_that "title is grabbed from the first line" do
    Given {
      @title = any_string
      @lines = [ @title, any_string, any_string ]
      @parser = Trickster::SlideParser.new(@lines,nil)
    }
    Then {
      assert_equal @title,@parser.title
    }
  end

  test_that "the renderer is called for each slide" do
    Given {
      @slides = [
        ['TITLE',[any_string,any_string]],
        ['BULLETS',[any_string,any_string]],
      ];
      lines = @slides.map { |(slide_type,content)|
        ["!#{slide_type}",content]
      }.flatten
      lines.unshift(any_string)
      @renderer = RememberingRenderer.new
      @parser = Trickster::SlideParser.new(lines,@renderer)
    }
    When {
      @resulting_content = @parser.body
    }
    Then {
      assert_equal @slides.inspect,@resulting_content
      assert_equal @slides,@renderer.rendered_slides
    }
  end
end
