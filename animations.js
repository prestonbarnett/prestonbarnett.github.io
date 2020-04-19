var controller = new ScrollMagic.Controller();

function init_home_animations() {
  var t1 = new TimelineMax();

  t1.from(".contact-me", .2, {y: 50}, 0);
  t1.from(".social-media", .75, {autoAlpha: 1}).to(".social-media", .75, {autoAlpha: 0});

  var scene = new ScrollMagic.Scene({triggerElement: ".contact-me", offset: -$(window).height()*.5, ".contact-me": .7})
  // .addIndicators({
  //   colorTrigger: "white",
  //   colorStart: "white",
  //   colorEnd: "white",
  //   indent: 5
  // })
  .setTween(t1)
  .setClassToggle(".contact-me", "visible")
  .addTo(controller);

  $('.fade-in').each(function() {

      var currentStrong = this;

      var t1 = new TimelineMax();

      t1.to(currentStrong, 0, {css:{className:'+=visible'}}, 0).from(currentStrong, .2, {y: 50}, 0);

      var scene = new ScrollMagic.Scene({triggerElement: currentStrong, offset: -$(window).height()*.2, triggerHook: .7}).setTween(t1).addTo(controller);
  });
  $("#learn_more").click(function() {
      $("html, body").animate({ scrollTop: $("#stage").offset().top - 100 }, 1000);
  });
}