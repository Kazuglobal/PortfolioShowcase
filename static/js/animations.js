document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Project Card Animation
    const projectCard = document.querySelector('.project-card');
    if (projectCard) {
        gsap.from(projectCard, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: projectCard,
                start: "top bottom-=100",
                end: "top center",
                toggleActions: "play none none reverse"
            }
        });
    }

    // Project Image Hover Effect
    const projectImages = document.querySelectorAll('.project-image');
    projectImages.forEach(container => {
        const img = container.querySelector('img');

        container.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        container.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // 3D Camera Movement
    if (window.threeScene) {
        ScrollTrigger.create({
            trigger: ".about-wrapper",
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                gsap.to(window.threeScene.camera.position, {
                    z: 5 + (self.progress * 2),
                    duration: 0.5
                });
            }
        });
    }

    // ページ遷移アニメーションの改善
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', e => {
            if (link.hostname === window.location.hostname) {
                e.preventDefault();
                const href = link.getAttribute('href');

                gsap.to('.about-overlay', {
                    opacity: 0,
                    y: -50,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => window.location.href = href
                });
            }
        });
    });
});