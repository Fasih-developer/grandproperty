document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
});

function header(){
    document.addEventListener("DOMContentLoaded", () => {
    const menuOpen = document.getElementById("menu-open");
    const menuClose = document.getElementById("menu-close");
    const mobileMenu = document.getElementById("mobile-menu");

    const menuTl = gsap.timeline({ paused: true, reversed: true });

    menuTl.to(mobileMenu, {
        right: 0,
        duration: 0.6,
        ease: "expo.out"
    });

    menuTl.from(".mobile-nav__link", {
        x: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out"
    }, "-=0.3");

    menuOpen.addEventListener("click", () => menuTl.play());
    menuClose.addEventListener("click", () => menuTl.reverse());

    // Auto-close on link click
    document.querySelectorAll(".mobile-nav__link").forEach(link => {
        link.addEventListener("click", () => menuTl.reverse());
    });
});
}

function hero() {
    const images = gsap.utils.toArray(".hero__image");

    if (!images.length) return;

    // Keep only the first image visible initially.
    gsap.set(images, { opacity: 0 });
    gsap.set(images[0], { opacity: 1 });

    // Hero entrance animations.
    const heroTl = gsap.timeline();

    heroTl.to(".hero__bg", {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut"
    })

    .to(".hero__title", {
        opacity: 1,
        y: -20,
        duration: 1,
        ease: "power3.out"
    }, "-=0.5")

    .to(".hero__description", {
        opacity: 1,
        y: -10,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6")

    .to(".hero__actions", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.4");

    // Continuous image crossfade slideshow.
    const slideshowTl = gsap.timeline({
        repeat: -1,
        paused: true
    });

    images.forEach((image, index) => {
        const nextImage = images[(index + 1) % images.length];

        slideshowTl
            .to(nextImage, {
                opacity: 1,
                duration: 1.5,
                ease: "power2.inOut"
            }, "+=1")

            .to(image, {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            }, "<");
    });

    // Start slideshow after the entrance animation.
    heroTl.add(() => slideshowTl.play());

    // Preserve the existing scroll parallax effect.
    gsap.fromTo(images,
        { yPercent: 0 },
        {
            yPercent: 50,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero__wrapper",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        }
    );
}

function choose() {

    const featureTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".features",
            start: "top 85%",
        }
    });

    // Title reveal
    featureTl.from(".features__title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    // Cards reveal
    featureTl.to(".feature-card", {
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        clearProps: "transform"
    }, "-=0.4");

    // Start slider after cards have appeared
    featureTl.call(() => {
        startFeatureSlider();
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const testimonialSwiper = new Swiper(".testimonials-swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    speed: 550,
    grabCursor: true,
    navigation: {
      nextEl: "#testiNext",
      prevEl: "#testiPrev",
    },
  });
});

function startFeatureSlider() {

    const track = document.querySelector(".features__track");
    const cards = [...track.querySelectorAll(".feature-card")];

    if (!track || !cards.length) return;

    // Duplicate the cards for a seamless infinite loop
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add("feature-card-clone");
        track.appendChild(clone);
    });

    const originalCardsWidth = cards.reduce((total, card) => {
        return total + card.offsetWidth;
    }, 0);

    const gap = parseFloat(getComputedStyle(track).gap);

    const loopDistance =
        originalCardsWidth + (gap * cards.length);

    // Slow continuous movement
    const sliderAnimation = gsap.to(track, {
        x: -loopDistance,
        duration: 45,
        ease: "none",
        repeat: -1
    });

    // Pause when hovering over the slider
    const slider = document.querySelector(".features__slider");

    slider.addEventListener("mouseenter", () => {
        sliderAnimation.pause();
    });

    slider.addEventListener("mouseleave", () => {
        sliderAnimation.resume();
    });
}
function stats(){
const statsSection = document.querySelector(".stats");
const counters = document.querySelectorAll(".stat-item__number");

const statsTl = gsap.timeline({
    scrollTrigger: {
        trigger: statsSection,
        start: "top 85%",
    }
});

counters.forEach((counter, index) => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const suffix = counter.getAttribute("data-suffix") || "";
    const isDecimal = counter.getAttribute("data-type") === "decimal";

    // Create an object to animate the value
    const obj = { value: 0 };

    statsTl.to(obj, {
        value: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
            // Update text based on type (integer or decimal)
            if (isDecimal) {
                counter.innerText = obj.value.toFixed(1) + suffix;
            } else {
                counter.innerText = Math.floor(obj.value) + suffix;
            }
        }
    }, index * 0.2); // This creates the "mid-way start" cycle (0.2s delay between starts)
});
}
function marquee(){
    // Add to script.js
const tickerSection = document.querySelector('.scrolling-text');

const tickerEntryTl = gsap.timeline({
    scrollTrigger: {
        trigger: tickerSection,
        start: "top 90%", // Triggers when section enters viewport
    }
});

    tickerEntryTl
    // 1. Reveal section instantly to stop blinking
    .to(tickerSection, { 
        autoAlpha: 1, 
        duration: 0.1 
    })
    // 3. Text fades and slides up mid-way through top border animation
    .from(".marquee-content span", { 
        opacity: 0, 
        y: 20,
        duration: 0.8, 
        stagger: {
            each: 0.05,
            from: "start"
        },
        ease: "power3.out"
    }, 0.4)
}
function slider(){
    document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Swiper
    const swiper = new Swiper('.services-swiper', {
        loop: true,
        speed: 600,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false, 
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            0: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
        }
    });

    // 2. GSAP Loading Animation
    const servicesSection = document.querySelector('.services-slider');

    const servicesTl = gsap.timeline({
        scrollTrigger: {
            trigger: servicesSection,
            start: "top 80%", // Slightly earlier to ensure smooth load
        }
    });

    servicesTl
        // Instantly make the section visible (resolves the blink/FOUC)
        .set(servicesSection, { autoAlpha: 1 })
        
        // Heading
        .from(".section-header__title", {
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: "power2.out"
        })
        // Line
        .from(".section-header__line", {
            width: 0,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.2")
        // Cards
        .from(".service-card", {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: {
                each: 0.1,
                from: "start"
            },
            ease: "back.out(1.2)",
            clearProps: "transform" // FIX: Strips GSAP inline styles so CSS hover works again
        }, "-=0.2")
        // CTA Button
        .from(".services-slider__cta", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "transform"
        }, "<");
});


}
function review(){
    // 1. Mobile-Only Swiper Logic
let testimonialSwiper;

const initTestimonialSwiper = () => {
    if (window.innerWidth <= 768) {
        // If mobile and Swiper isn't initialized yet, start it up
        if (!testimonialSwiper) {
            testimonialSwiper = new Swiper('.testimonials-swiper', {
                effect: 'fade', // Smooth cross-fade
                fadeEffect: {
                    crossFade: true
                },
                loop: true,
                autoHeight: true, // Adjusts height if reviews are different lengths
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                speed: 800 // Smooth transition speed
            });
        }
    } else {
        // If desktop and Swiper is running, kill it so the CSS Grid takes over
        if (testimonialSwiper) {
            testimonialSwiper.destroy(true, true);
            testimonialSwiper = undefined;
        }
    }
};

// Run on load and listen for screen resizing
initTestimonialSwiper();
window.addEventListener('resize', initTestimonialSwiper);


// 2. GSAP Loading Animation
const testSection = document.querySelector('.testimonials');

const testTl = gsap.timeline({
    scrollTrigger: {
        trigger: testSection,
        start: "top 80%",
    }
});

testTl
    // Instant reveal to kill FOUC
    .set(testSection, { autoAlpha: 1 })
    
    // Heading Fades down
    .from(".testimonials__title", {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out"
    })
    
    // Subtext Fades up mid-way
    .from(".testimonials__desc", {
        opacity: 0,
        y: 15,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.3")
    
    // Cards pop up with stagger
    .from(".testimonial-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: {
            each: 0.15,
            from: "start"
        },
        ease: "back.out(1.2)",
        clearProps: "transform" // Critical: Returns hover control to CSS
    }, "-=0.2");
}
function services_page(){
    const servicesPage = document.querySelector('.services-page');

if (servicesPage) { 
    gsap.set(servicesPage, { autoAlpha: 1 });

    // 2. Animate Header Elements
    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".services-page__header",
            start: "top 85%"
        }
    });

    headerTl
        .from(".services-page__title", {
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: "power3.out"
        })
        .from([".services-page__desc", ".services-page__line"], {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4");

    gsap.from(".services-page__cta", {
        scrollTrigger: {
            trigger: ".services-page__cta",
            start: "top 90%"
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "transform"
    });
}
document.addEventListener("DOMContentLoaded", () => {
    // Find all service cards with stacked images
    const imageContainers = document.querySelectorAll('.service-card__img-container');

    // Toggle the swap class every 3 seconds
    setInterval(() => {
        imageContainers.forEach(container => {
            // Check if it actually has two images before trying to swap
            if (container.children.length > 1) {
                container.classList.toggle('swap-active');
            }
        });
    }, 3000);
});
}
function contact(){
    // Add inside your DOMContentLoaded listener

const contactPage = document.querySelector('.contact-page');

if (contactPage) {
    // 1. Force reveal instantly to kill FOUC
    gsap.set(contactPage, { autoAlpha: 1 });

    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: contactPage,
            start: "top 85%"
        }
    });

    contactTl
        // 2. Animate Header Text (All fade)
        .from(".contact-page__title", {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        })
        .from(".contact-page__desc", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
        }, "-=0.6")
        .from(".contact-page__line", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
        }, "-=0.6")
        
        // 3. Form Wrapper fades in
        .from(".contact-form__wrapper", {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut"
        }, "-=0.4")
        
        // 4. Input Fields fade in rapidly
        .from(".contact-form__group", {
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power1.inOut"
        }, "-=0.8")
        
        // 5. Button fades in
        .from(".contact-form__submit-wrapper", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
        }, "-=0.2");
}
}
function privacy_policy(){
    // Add inside your DOMContentLoaded listener

const privacyPage = document.querySelector('.privacy-page');

if (privacyPage) {
    // 1. Instantly reveal the section wrapper
    gsap.set(privacyPage, { autoAlpha: 1 });

    const privacyTl = gsap.timeline({
        scrollTrigger: {
            trigger: privacyPage,
            start: "top 85%"
        }
    });

    privacyTl
        // 2. Pure fade in for header
        .from(".privacy-page__header", {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut"
        })
        
        // 3. Pure fade in for the main white container
        .from(".privacy-page__content", {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        }, "-=0.6")

        // 4. Staggered fade in for each paragraph/section inside
        .from(".privacy-block", {
            opacity: 0,
            duration: 0.8,
            stagger: 0.15, // Gently fades them in one after another
            ease: "power2.inOut"
        }, "-=0.4");
}
}
function about_us(){
    // Add inside your DOMContentLoaded listener

const aboutPage = document.querySelector('.about-page');

if (aboutPage) {
    // 1. Force the section to become visible BEFORE the animation starts
    gsap.set(aboutPage, { autoAlpha: 1 });

    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: aboutPage,
            start: "top 85%" // Triggers when the section is 15% into the screen
        }
    });

    aboutTl
        // 2. Animate the NEW Main Header (ABOUT US)
        .from(".about-page__top-title", {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: "power2.out"
        })
        .from(".about-page__line", {
            width: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4")

        // 3. Animate Top Intro Text
        .from(".about-page__intro", {
            opacity: 0,
            y: 30, // Fades UP
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.2")
        
        // 4. Animate the Question Heading
        .from(".about-page__title", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5") 
        
        // 5. Animate the Bottom Text
        .from(".about-page__desc", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5")
        
        // 6. Image Reveal (Fades in AND scales down to normal size)
        .fromTo(".about-page__image", 
            {
                opacity: 0,
                scale: 1.08 
            },
            {
                opacity: 1,
                scale: 1, 
                duration: 1.2,
                ease: "power3.out",
                clearProps: "all" // Cleans up GSAP inline styles after it finishes
            }, 
            "-=0.4"
        );
}
}
function coming_soon(){
    const comingSoon = document.querySelector('.coming-soon');
    if (comingSoon) {
        gsap.set(comingSoon, { autoAlpha: 1 });
        gsap.from(".coming-soon__content > *", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });
    }
}
header();
hero();
choose();
stats();
marquee();
slider();
review();
services_page();
contact();
privacy_policy();
about_us();
coming_soon();