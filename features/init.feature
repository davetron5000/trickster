Feature: I can create a new slideshow
  In order to make an awesome slideshow
  I want to create the slideshow directory
  with everything i need

  Scenario: Can init a new slideshow
    Given there is no directory named "slideshow"
    When I successfully run `trickster init slideshow`
    Then a directory named "slideshow" should exist
    And a file named "slideshow/slides" should exist
    And the file "slideshow/slides" should contain:
    """
    slideshow
    !TITLE
    Title of your slideshow
    Subtitle
    Sub-sub title

    !SECTION: background=dddddd
    A section

    !BULLETS
    A bullet list
    * can use any
    - reasonable
    + bullet

    !CODE: callout=3,4,5
    class YourCode

      def initialize(will)
        @be_highlighted
      end

    end
    """
    And a directory named "slideshow/js" should exist
    And the directory "slideshow/js" should contain all the trickster JavaScript files and support libs
    And a directory named "slideshow/css" should exist
    And the directory "slideshow/css" should contain all the trickster CSS files and support stylesheets
    And the output should match /Your slideshow is ready/
    And "css/theme.css" in "slideshow" should be identical to "default.css"

  Scenario: Can init a new slideshow with a different theme
    Given there is no directory named "slideshow"
    When I successfully run `trickster init -t github slideshow`
    Then a directory named "slideshow" should exist
    And a file named "slideshow/slides" should exist
    And "css/theme.css" in "slideshow" should be identical to "github.css"

  Scenario: Can init a new slideshow with a custom theme
    Given there is no directory named "slideshow"
    When I successfully run `trickster init -t custom slideshow`
    Then a directory named "slideshow" should exist
    And a file named "slideshow/slides" should exist
    And "css/theme.scss" in "slideshow" should be identical to "custom.scss"
    But a file named "slideshow/css/theme.css" should not exist
