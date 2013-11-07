require 'test_helper.rb'

class SlideRendererTest < Clean::Test::TestCase
  def setup
    @renderer = Trickster::SlideRenderer.new
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

  test_that "a free-form slide just passes through the HTML" do
    Given {
      @html = %{<h1>This is some stuff</h1>
      <table>
        <thead><tr><th>Name</th><th>Age</th></tr></thead>
        <tbody>
          <tr><td>Bob</td><td>24</td></tr>
          <tr><td>Rudy</td><td>13</td></tr>
        </tbody>
      </table>}
    }
    When {
      @renderer.render_slide("FREEFORM",@html.split("\n"))
    }
    Then {
      assert_content("FREEFORM",@html,@renderer.content)
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
          "<pre><code class='no-highlight'><span class='cli-prompt'>&gt;</span> <span class='cli-element cli-command cli-line'>#{@command1}</span>",
          "<span class='cli-element cli-result'><span class='cli-line'>#{@result1}</span></span>",
          "<span class='cli-prompt'>%</span> <span class='cli-element cli-command cli-line'>#{@command2}</span>",
          "<span class='cli-element cli-result'><span class='cli-line'>#{@result2}</span></span>",
          "</code></pre>",
        ],
        @renderer.content)
    }
  end

  test_that "COMMANDLINE groups commands and responses together" do
    Given {
      @command1 = any_string :max => 10
      @result1a = any_string :max => 10
      @result1b = any_string :max => 10
      @command2 = any_string :max => 10
      @result2 = any_string :max => 10
      @command3 = any_string :max => 10
      @content = [
        ">" + @command1,
        @result1a,
        @result1b,
        "%" + @command2,
        @result2,
        ">" + @command3,
      ]
    }
    When {
      @renderer.render_slide("COMMANDLINE",@content)
    }
    Then {
      assert_content(
        "COMMANDLINE",
        [
          "<pre><code class='no-highlight'><span class='cli-prompt'>&gt;</span> <span class='cli-element cli-command cli-line'>#{@command1}</span>",
          "<span class='cli-element cli-result'><span class='cli-line'>#{@result1a}</span>",
          "<span class='cli-line'>#{@result1b}</span></span>",
          "<span class='cli-prompt'>%</span> <span class='cli-element cli-command cli-line'>#{@command2}</span>",
          "<span class='cli-element cli-result'><span class='cli-line'>#{@result2}</span></span>",
          "<span class='cli-prompt'>&gt;</span> <span class='cli-element cli-command cli-line'>#{@command3}</span>",
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
          "<pre><code data-strikeouts='' data-callout-lines=''>#{wrap_line(@code[0],1)}",
          wrap_line(@code[1],2),
          wrap_line(@code[2],3),
          "#{wrap_line(@code[3],4)}</code></pre>",
        ],
        @renderer.content)
    }
  end
  test_that "CODE uses the language specified in the options" do
    Given {
      @code = [
        "#{any_string}",
        "  #{any_string}",
        "    #{any_string} #{any_string}",
        "#{any_string}",
      ]
      @language = any_string
    }
    When {
      @renderer.render_slide("CODE: language=#{@language}",@code)
    }
    Then {
      assert_content(
        "CODE",
        [
          "<pre><code class='#{@language}' data-strikeouts='' data-callout-lines=''>#{wrap_line(@code[0],1)}",
          wrap_line(@code[1],2),
          wrap_line(@code[2],3),
          "#{wrap_line(@code[3],4)}</code></pre>",
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
          "<pre><code data-strikeouts='2' data-callout-lines='1,2,3'><div class='lines-callout'>#{wrap_line(@code[0],1,true)}",
          wrap_line(@code[1],2,true),
          wrap_line(@code[2],3,true),
          "</div>#{wrap_line(@code[3],4)}</code></pre>",
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
          "<pre><code data-strikeouts='' data-callout-lines=''>#{wrap_line(@code[0],1)}",
          wrap_line(@code[1],2),
          wrap_line(@code[2],3),
          "#{wrap_line(@code[3],4)}</code></pre>",
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

  def wrap_line(line,index,callout=false)
    "<span class='line line-#{index} #{callout ? 'line-callout' : ''}' >#{line}</span>"
  end
end
