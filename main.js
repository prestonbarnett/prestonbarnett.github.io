function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

function pageTransition() {
    var tl = gsap.timeline();

    tl.to(".loading-screen", {
        duration: 1.2,
        width: "105%",
        left: "0%",
        ease: "Expo.easeInOut",
    });

    tl.to(".loading-screen", {
        duration: 1,
        width: "100%",
        left: "100%",
        ease: "Expo.easeInOut",
        delay: 0.3,
    });
    tl.set(".loading-screen", { left: "-100%" });
}

function contentAnimation() {
    var tl = gsap.timeline();
    tl.from(".animate-this", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 0.2 });
}

$(document).ready(function() {
    barba.init({
        cacheIgnore: ['index.html'],

        sync: true,

        transitions: [
            {
                async leave(data) {
                    const done = this.async();

                    pageTransition();
                    await delay(1000);
                    done();
                },

                async enter(data) {
                    contentAnimation();
                },

                async once(data) {
                    contentAnimation();
                },
            },
        ],
        views: [{
            namespace: 'home_section',
            async beforeEnter(data) {
                var tl = gsap.timeline();

                tl.to("#terrain-canvas", { duration: 1, opacity: 0.2 });

                init_home_listen();
                init_home_animations();

              $("html, body").animate({ scrollTop: scroll_home }, 1000);
            }, async beforeLeave(data) {
                var tl = gsap.timeline();

                tl.to("#terrain-canvas", { duration: 1, opacity: 0 });

                scroll_home = window.scrollY
                document.removeEventListener('mousemove', onDocumentMouseMove); 
                window.removeEventListener( 'resize', onWindowResize);
                window.removeEventListener('scroll', getScrollPercent);
                console.log(scroll_home)   
            }
          }]
    });
});