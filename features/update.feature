Feature: I can update my slideshow after I upgrade conman
  Since the slideshow is self-contained
  I need a way to get the latest features of conman

  Scenario: Can update a slidehsow
    Given a slideshow in "test_slideshow"
    And the JS files and CSS files in "test_slideshow" are out-of-date
    When I cd to "test_slideshow"
    And I successfully run `conman update`
    Then the JS files and CSS files in "test_slideshow" should be up-to-date
    But "css/styles.css" in "test_slideshow" should not have been touched
