require 'test_helper.rb'

class SlideRendererTest < Clean::Test::TestCase
  def setup
    @renderer = Conman::SlideRenderer.new
  end

  NORMAL_TYPES = ["TITLE","SECTION","NORMAL"]
  NORMAL_TYPES.each do |slide_type|
    test_that "a #{slide_type} slide gets first three lines rendered in HTML" do
      Given {
        @content = [
          any_string,
          any_string,
          any_string,
          any_string,
        ]
      }
      When {
        @renderer.render_slide(slide_type,@content)
      }
      Then {
        assert_content(
          slide_type,
          [
            "<h1>#{@content[0]}</h1>",
            "<h2>#{@content[1]}</h2>",
            "<h3>#{@content[2]}</h3>",
          ],
          @renderer.content)
      }
    end
    test_that "a #{slide_type} slide gets first line rendered in HTML if there aren't three lines" do
      Given {
        @content = [
          any_string,
        ]
      }
      When {
        @renderer.render_slide(slide_type,@content)
      }
      Then {
        assert_content(slide_type,"<h1>#{@content[0]}</h1>",@renderer.content)
      }
    end
    test_that "a #{slide_type} slide a background data element if specified in the options" do
      Given {
        @content = [
          any_string,
        ]
        @background = any_string
      }
      When {
        @renderer.render_slide(slide_type + ": background=#{@background}",@content)
      }
      Then {
        assert_content(slide_type,"<h1>#{@content[0]}</h1>",@renderer.content,@background)
      }
    end
    test_that "a #{slide_type} slide a transition time data element if specified in the options" do
      Given {
        @content = [
          any_string,
        ]
        @transition = any_int
      }
      When {
        @renderer.render_slide(slide_type + ": transition=#{@transition}",@content)
      }
      Then {
        assert_content(slide_type,"<h1>#{@content[0]}</h1>",@renderer.content,nil,@transition)
      }
    end
  end

  test_that "an image just has its first line rendered in an img tag" do
    Given {
      @image_url = any_string
    }
    When {
      @renderer.render_slide("IMAGE",[@image_url])
    }
    Then {
      assert_content("IMAGE","<img src='#{@image_url}'>",@renderer.content)
    }
  end

  test_that "bullets get the first line as title, remainder as bullets, removing the bullet char" do
    Given {
      @title = any_string
      @bullet1 = any_string
      @bullet2 = any_string
      @bullet3 = any_string
      @bullet4 = any_string
      @content = [
        @title,
        "* #{@bullet1}",
        "+ #{@bullet2}",
        "- #{@bullet3}",
        "#{@bullet4}",
      ];
    }
    When {
      @renderer.render_slide("BULLETS",@content)
    }
    Then {
      assert_content(
        "BULLETS",
        [
          "<h1>#{@title}</h1>",
          "<ul>",
          "<li>#{@bullet1}</li>",
          "<li>#{@bullet2}</li>",
          "<li>#{@bullet3}</li>",
          "<li>#{@bullet4}</li>",
          "</ul>",
        ],
        @renderer.content)
    }
  end

  test_that "COMMANDLINE puts every other line as a command" do
    Given {
      @command1 = any_string
      @result1 = any_string
      @command2 = any_string
      @result2 = any_string
      @content = [
        ">" + @command1,
        @result1,
        "%" + @command2,
        @result2,
      ]
    }
    When {
      @renderer.render_slide("COMMANDLINE",@content)
    }
    Then {
      assert_content(
        "COMMANDLINE",
        [
          "<pre><code class='no-highlight'><span class='cli-prompt'>&gt;</span> <span class='cli-element cli-command'>#{@command1}</span>",
          "<span class='cli-element cli-result'>#{@result1}</span>",
          "<span class='cli-prompt'>%</span> <span class='cli-element cli-command'>#{@command2}</span>",
          "<span class='cli-element cli-result'>#{@result2}</span>",
          "</code></pre>",
        ],
        @renderer.content)
    }
  end

  test_that "CODE wraps the code in a pre/code block" do
    Given {
      @code = [
        "#{any_string}",
        "  #{any_string}",
        "    #{any_string} #{any_string}",
        "#{any_string}",
      ]
    }
    When {
      @renderer.render_slide("CODE",@code)
    }
    Then {
      assert_content(
        "CODE",
        [
          "<pre><code class='ruby' data-strikeouts='' data-callout-lines=''>#{@code[0]}",
          @code[1],
          @code[2],
          "#{@code[3]}</code></pre>",
        ],
        @renderer.content)
    }
  end
  test_that "CODE that has callouts, with strikouts, as those added to the proper data attributes" do
    Given {
      @code = [
        "#{any_string}",
        "  #{any_string}",
        "    #{any_string} #{any_string}",
        "#{any_string}",
      ]
    }
    When {
      @renderer.render_slide("CODE: callout=1,-2,3",@code)
    }
    Then {
      assert_content(
        "CODE",
        [
          "<pre><code class='ruby' data-strikeouts='2' data-callout-lines='1,2,3'>#{@code[0]}",
          @code[1],
          @code[2],
          "#{@code[3]}</code></pre>",
        ],
        @renderer.content)
    }
  end

  test_that "CODE can be read from a file" do
    Given {
      @code = [
        "#{any_string}",
        "  #{any_string}",
        "    #{any_string} #{any_string}",
        "#{any_string}",
      ]
      @filename = "/tmp/#{$$}.code"
      File.open(@filename,'w') do |file|
        @code.each do |line|
          file.puts line
        end
      end
    }
    When {
      @renderer.render_slide("CODE",["file://" + @filename])
    }
    Then {
      assert_content(
        "CODE",
        [
          "<pre><code class='ruby' data-strikeouts='' data-callout-lines=''>#{@code[0]}",
          @code[1],
          @code[2],
          "#{@code[3]}</code></pre>",
        ],
        @renderer.content)
    }
  end

private

  def assert_content(slide_type,lines,content,background_attribute=nil,transition_attribute=nil)
    expected_content = [
      "<section class='#{slide_type}'#{extra_attributes(background_attribute,transition_attribute)}>",
      lines,
      "</section>",
      "",
    ].flatten.join("\n")
    assert_equal expected_content,content
  end

  def extra_attributes(background_attribute,transition_attribute)
    background = background_attribute.nil? ? '' : " data-background='#{background_attribute}'"
    transition = transition_attribute.nil? ? '' : " data-transition='#{transition_attribute}'"

    return background + transition
  end
end
