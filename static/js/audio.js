// Simple background music generator using Tone.js
class BackgroundMusic {
    constructor() {
        this.synth = null;
        this.isPlaying = false;
    }

    async init() {
        await Tone.start();
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        
        // Create a simple melody pattern
        const melody = ['C4', 'E4', 'G4', 'B4'];
        const duration = '4n';
        
        // Create a sequence that will play the melody
        this.sequence = new Tone.Sequence((time, note) => {
            this.synth.triggerAttackRelease(note, duration, time);
        }, melody, '4n');

        // Set volume
        this.synth.volume.value = -20;
    }

    async start() {
        if (!this.isPlaying) {
            await this.init();
            Tone.Transport.start();
            this.sequence.start(0);
            this.isPlaying = true;
        }
    }

    stop() {
        if (this.isPlaying) {
            this.sequence.stop();
            Tone.Transport.stop();
            this.isPlaying = false;
        }
    }
}

// Export for use in other files
window.BackgroundMusic = BackgroundMusic;