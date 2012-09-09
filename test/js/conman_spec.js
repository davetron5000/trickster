describe("Conman",function() {
  beforeEach(function() {
    document.location.hash = "";
  });
  it("has a reasonable initial state", function() {
    Conman = ConmanLoader(ConmanDefaultConfig,{});
    expect(Conman.currentSlide).toBe(0);
    expect(Conman.totalSlides).toBe(1);
  });
});
