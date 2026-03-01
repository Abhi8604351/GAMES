import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-fx-service',
    standalone: true,
    imports: [CommonModule],
    template: ''
})
export class FxService {
    private audioContext: AudioContext | null = null;

    constructor() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    playSelect() { this.playTone(440, 0.1, 'sine'); }
    playSuccess() { this.playTone(880, 0.2, 'square'); }
    playError() { this.playTone(110, 0.3, 'sawtooth'); }
    playMove() { this.playTone(330, 0.05, 'triangle'); }

    private playTone(freq: number, duration: number, type: OscillatorType) {
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }
}
