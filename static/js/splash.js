document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.querySelector('.splash-screen');
    const mainContent = document.querySelector('.main-content');
    const backgroundMusic = new BackgroundMusic();
    let hasInteracted = false;

    // Function to start the experience
    const startExperience = async () => {
        if (!hasInteracted) {
            hasInteracted = true;

            try {
                // Start background music
                await backgroundMusic.start();
                console.log('Music started playing');
            } catch (error) {
                console.error('Audio playback failed:', error);
            }

            // Check if we have a redirect URL in the hash
            const hash = window.location.hash;
            if (hash === '#events') {
                window.location.href = '/events';
                return;
            }

            // Hide splash screen with animation
            gsap.to(splashScreen, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    splashScreen.style.display = 'none';
                    mainContent.style.display = 'block';

                    // Fade in main content
                    gsap.to(mainContent, {
                        opacity: 1,
                        duration: 1
                    });

                    // Initialize Three.js scene
                    if (window.ThreeScene) {
                        new ThreeScene();
                    }
                }
            });
        }
    };

    // Start experience on click
    splashScreen.addEventListener('click', startExperience);
    // Also start on spacebar or enter key
    document.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.code === 'Enter') && !hasInteracted) {
            startExperience();
        }
    });

    // Add sound toggle with 'M' key
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm' && hasInteracted) {
            if (backgroundMusic.isPlaying) {
                backgroundMusic.stop();
            } else {
                backgroundMusic.start();
            }
        }
    });
});