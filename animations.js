var controller = new ScrollMagic.Controller();

// var scene = new ScrollMagic.Scene({
//   triggerElement: "#stage",
//   triggerHook: .7
// })
// .addIndicators({
//   colorTrigger: "white",
//   colorStart: "white",
//   colorEnd: "white",
//   indent: 5
// })
// .setTween(t1)
// .addTo(controller);


$('.fade-in').each(function() {

    var currentStrong = this;

    console.log(this)

    var t1 = new TimelineMax();

    t1.to(currentStrong, 0, {css:{className:'+=visible'}}, 0).from(currentStrong, .2, {y: 50}, 0);
    // t1.to(".line1", 1, {scaleY:3.5}, 0).to(".line1", .75, {rotation: 60}, .5).to(".line1", 0, {css:{className:'+=visible'}}, 0);
    // t1.to(".line2", 1, {scaleY:3.5}, 0).to(".line2", .75, {rotation: -60}, .5).to(".line2", 0, {css:{className:'+=visible'}}, 0);

    var scene = new ScrollMagic.Scene({triggerElement: currentStrong, offset: -$(window).height()*.2, triggerHook: .7})
        // .addIndicators({
        //   colorTrigger: "white",
        //   colorStart: "white",
        //   colorEnd: "white",
        //   indent: 5
        // })
        .setTween(t1)
        .addTo(controller);
});