describe("Trickster",function() {
  beforeEach(function() {
    document.location.hash = "";
  });
  it("has a reasonable initial state", function() {
    Trickster = TricksterLoader(TricksterDefaultConfig,{});
    expect(Trickster.currentSlide).toBe(0);
    expect(Trickster.totalSlides).toBe(1);
  });
});
