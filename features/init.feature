Feature: I can create a new slideshow
  In order to make an awesome slideshow
  I want to create the slideshow directory
  with everything i need

  Scenario: Can init a new slideshow
    Given there is no directory named "slideshow"
    When I successfully run `conman init slideshow`
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
    And the directory "slideshow/js" should contain all the conman JavaScript files and support libs
    And a directory named "slideshow/css" should exist
    And the directory "slideshow/css" should contain all the conman CSS files and support stylesheets
    And the output should contain "Your slideshow is ready, run conman build to build it"
