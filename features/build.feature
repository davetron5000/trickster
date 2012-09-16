Feature: I can build my slideshow
  In order to view my slideshow
  I must build it from the presentation source
  so I have the HTML good to go.

  Scenario: Can build a slidehsow
    Given a slideshow in "test_slideshow"
    When I cd to "test_slideshow"
    And I successfully run `trickster build`
    Then a file named "index.html" should exist

  Scenario: Can build a slideshow that uses sass
    Given a slideshow in "test_slideshow" that uses sass
    When I cd to "test_slideshow"
    And I successfully run `trickster build`
    Then a file named "index.html" should exist
    And a file named "css/styles.css" should exist

