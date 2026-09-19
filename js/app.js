/**
 * 🌴 ORU DATE? — Shared Application Engine & Physics
 * -------------------------------------------------------------
 * 1. Floating Romantic Particles (Canvas)
 * 2. Playful Web Audio Synth (Pop, Boing, Chimes)
 * 3. The Un-rejectable Runaway "No" Button Physics
 * 4. Toast & Helper Utilities
 */

const APP = {
  soundEnabled: true,
  audioCtx: null,

  init() {
    this.setupAudio();
    this.initCanvasHearts();
    this.setupSoundToggle();
    this.setupRunawayButton();
  },

  // Initialize Web Audio Synth for cute sound effects (Zero external MP3 dependencies)
  setupAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      // Lazy init on first user interaction to satisfy browser policies
      const unlockAudio = () => {
        if (!this.audioCtx) {
          this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      };
      document.addEventListener('click', unlockAudio);
      document.addEventListener('touchstart', unlockAudio);
    }
  },

  // Play synthetic pleasant sound (chime, pop, bounce)
  playSound(type = 'chime') {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'chime') {
        // Romantic sweet dual chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'boing') {
        // Playful cartoon spring when 'No' runs away
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'celebrate') {
        // Grand celebratory arpeggio
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          const noteTime = now + (i * 0.08);
          noteOsc.frequency.setValueAtTime(freq, noteTime);
          noteGain.gain.setValueAtTime(0.18, noteTime);
          noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
          noteOsc.start(noteTime);
          noteOsc.stop(noteTime + 0.35);
        });
      }
    } catch (e) {
      // Audio context might be restricted before gesture; fail silently
    }
  },

  // Setup Sound Toggle in Navbar
  setupSoundToggle() {
    const btn = document.getElementById('soundToggleBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      btn.innerHTML = this.soundEnabled ? '🔔 Sound: ON' : '🔕 Sound: OFF';
      this.showToast(this.soundEnabled ? 'Audio effects enabled 🎵' : 'Muted 🔕');
    });
  },

  // Floating Romantic Hearts Particle Engine
  initCanvasHearts() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#ff4d6d', '#ff758f', '#f6c453', '#ffd166', '#ffffff'];

    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 6,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHeart: Math.random() > 0.4
      });
    }

    function drawHeart(x, y, size, color, opacity) {
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
      ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        if (p.isHeart) {
          drawHeart(p.x, p.y, p.size, p.color, p.opacity);
        } else {
          // Soft glowing sparkle
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      requestAnimationFrame(render);
    }

    render();
  },

  // =========================================================================
  // THE UN-REJECTABLE RUNAWAY "NO" BUTTON (Runs when mouse approaches!)
  // =========================================================================
  setupRunawayButton() {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const banterBubble = document.getElementById('banterBubble');

    if (!noBtn) return;

    let escapeCount = 0;
    let yesScale = 1.0;
    let lastEvasionTime = 0;

    const phrases = (window.DATE_CONFIG && window.DATE_CONFIG.evasionPhrases) || [
      "No? Athu nadakkilla! 😜",
      "Ayyada, angane ippo vendennu vekkanda! 😂",
      "Scene aanu tto, No option illa! 🙅‍♀️",
      "Njan vidaan udheshichittilla! 🏃‍♂️💨",
      "Munnar-il kondu povaam, Yes para! 🍃",
      "Kalyanam onnum alla, just oru date! 🙈",
      "Chaya & Parippuvada medichu tharaam! ☕",
      "Avale nokkikke, No parayan nokkunnu! 🤭",
      "Click cheyyan pattillallo he he! 🚀",
      "Yes mathram aanu valid option! 💖"
    ];

    const runAway = (cursorX, cursorY) => {
      const now = Date.now();
      if (now - lastEvasionTime < 160) return; // Cooldown to ensure fluid, non-jittery flight
      lastEvasionTime = now;

      escapeCount++;
      this.playSound('boing');

      // 1. Pick playful phrase
      const randomPhrase = phrases[escapeCount % phrases.length];
      noBtn.textContent = randomPhrase;

      if (banterBubble) {
        banterBubble.textContent = `😏 "${randomPhrase}"`;
        banterBubble.style.opacity = '1';
      }

      // 2. Grow the YES button bigger and pulse with glow!
      if (yesBtn) {
        yesScale = Math.min(yesScale + 0.1, 1.85);
        yesBtn.style.transform = `scale(${yesScale})`;
        yesBtn.style.boxShadow = `0 0 ${20 + escapeCount * 5}px rgba(255, 77, 109, 0.85)`;
      }

      // 3. Move the NO button away safely within the screen
      const margin = 40;
      const btnW = noBtn.offsetWidth || 160;
      const btnH = noBtn.offsetHeight || 52;
      const maxX = window.innerWidth - btnW - margin;
      const maxY = window.innerHeight - btnH - margin;

      let newX, newY;

      // If we know the approaching cursor position, flee away from it
      if (typeof cursorX === 'number' && typeof cursorY === 'number') {
        const onRight = cursorX > window.innerWidth / 2;
        const onBottom = cursorY > window.innerHeight / 2;

        const targetMinX = onRight ? margin : Math.floor(window.innerWidth / 2);
        const targetMaxX = onRight ? Math.floor(window.innerWidth / 2 - btnW) : maxX;
        const targetMinY = onBottom ? 90 : Math.floor(window.innerHeight / 2);
        const targetMaxY = onBottom ? Math.floor(window.innerHeight / 2 - btnH) : maxY;

        const safeMinX = Math.min(targetMinX, targetMaxX);
        const safeMaxX = Math.max(targetMinX, targetMaxX);
        const safeMinY = Math.min(targetMinY, targetMaxY);
        const safeMaxY = Math.max(targetMinY, targetMaxY);

        newX = Math.floor(Math.random() * (safeMaxX - safeMinX + 1)) + safeMinX;
        newY = Math.floor(Math.random() * (safeMaxY - safeMinY + 1)) + safeMinY;
      } else {
        newX = Math.max(margin, Math.floor(Math.random() * maxX));
        newY = Math.max(90, Math.floor(Math.random() * maxY));
      }

      newX = Math.max(margin, Math.min(newX, maxX));
      newY = Math.max(90, Math.min(newY, maxY));

      noBtn.style.position = 'fixed';
      noBtn.style.left = `${newX}px`;
      noBtn.style.top = `${newY}px`;
      noBtn.style.zIndex = '999';
    };

    // PROXIMITY DETECTION: Run when mouse/cursor approaches!
    const PROXIMITY_THRESHOLD = 140; // Detection radius in pixels

    const checkProximity = (clientX, clientY) => {
      const rect = noBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);

      if (distance < PROXIMITY_THRESHOLD) {
        runAway(clientX, clientY);
      }
    };

    // Listen to mouse moving anywhere on the page
    document.addEventListener('mousemove', (e) => {
      checkProximity(e.clientX, e.clientY);
    });

    // Also support touch approaching or swiping on mobile
    document.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        checkProximity(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        checkProximity(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Fallback direct interactions
    noBtn.addEventListener('mouseenter', (e) => runAway(e.clientX, e.clientY));
    noBtn.addEventListener('mouseover', (e) => runAway(e.clientX, e.clientY));
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      runAway();
      this.showToast("Ayyada! No parayaan permission illa! 🤭");
    });

    // When YES is clicked:
    if (yesBtn) {
      yesBtn.addEventListener('click', () => {
        this.playSound('celebrate');
      });
    }
  },

  // Toast Notification helper
  showToast(message) {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastMsg';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
};

// Auto initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  APP.init();
});

window.APP = APP;
