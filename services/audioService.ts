class AudioService {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: Map<string, { oscs: OscillatorNode[], gains: GainNode[] }> = new Map();

  constructor() {
    // Defer initialization
  }

  private initContext() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContextClass();
      
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.4;
      this.masterGain.connect(this.context.destination);
    }
  }

  public async resumeContext() {
    this.initContext();
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  public startChord(id: string, frequencies: number[]) {
    this.initContext();
    if (!this.context || !this.masterGain) return;

    // Prevent double triggering if key is held or multiple inputs occur
    if (this.activeNodes.has(id)) return;

    const now = this.context.currentTime;
    const attack = 0.05;
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    frequencies.forEach((freq) => {
      if (!this.context || !this.masterGain) return;

      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Attack envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1.0 / frequencies.length, now + attack);
      // Note: We do not schedule release here; we wait for stopChord

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);

      oscs.push(osc);
      gains.push(gain);
    });

    this.activeNodes.set(id, { oscs, gains });
  }

  public stopChord(id: string) {
    const nodes = this.activeNodes.get(id);
    if (!nodes || !this.context) return;

    const now = this.context.currentTime;
    const release = 1.5; // Natural sustain length

    nodes.gains.forEach((gain) => {
      // Cancel any ongoing ramps (like attack) to prevent popping
      gain.gain.cancelScheduledValues(now);
      // Set current value explicitly to ramp from
      gain.gain.setValueAtTime(gain.gain.value, now);
      // Exponential fade out
      gain.gain.exponentialRampToValueAtTime(0.001, now + release);
    });

    nodes.oscs.forEach((osc) => {
      osc.stop(now + release + 0.1); // Stop after fade out
    });

    // Remove from active list so we can trigger again
    this.activeNodes.delete(id);
  }
}

export const audioService = new AudioService();