// Utilidad para reproducir sonidos de alerta en el sistema

// Sonido de alerta generado por Web Audio API (no requiere archivos externos)
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API no disponible');
      return null;
    }
  }
  return audioContext;
};

// Sonido de campana/alerta para nuevo pedido
export const playNewOrderSound = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Reanudar contexto si está suspendido (requiere interacción del usuario)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  try {
    const now = ctx.currentTime;

    // Crear oscilador para tono de campana
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Frecuencias de campana (Do-Mi-Sol)
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5

    oscillator.type = 'sine';

    // Envelope de volumen
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.2);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

    oscillator.start(now);
    oscillator.stop(now + 0.4);
  } catch (err) {
    console.warn('Error reproduciendo sonido:', err);
  }
};

// Sonido corto de confirmación (para acciones completadas)
export const playSuccessSound = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  try {
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Tono ascendente corto
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.linearRampToValueAtTime(600, now + 0.1);

    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } catch (err) {
    console.warn('Error reproduciendo sonido:', err);
  }
};
