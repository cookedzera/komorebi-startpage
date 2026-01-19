class AmbientPlayer extends Component {
    soundMenuOpen = false;
    currentSound = null;
    currentAudio = null;
    effectsContainer = null;
    animationFrameId = null;
    particles = [];
    lastSpawnTime = 0;

    sounds = [
        { id: 'rain', name: 'Rain', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 2v4M8 2v4M12 2v4M20 10l-2 4M16 10l-2 4M12 10l-2 4M8 10l-2 4M4 10l-2 4"/></svg>`, src: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce99.mp3' },
        { id: 'sparkle', name: 'Sparkle', icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14 9L23 11L14 13L12 22L10 13L1 11L10 9L12 0Z"/></svg>`, src: 'src/assets/sparkle.mp3' }
    ];

    constructor() {
        super();
    }

    imports() {
        return [this.resources.fonts.roboto];
    }

    style() {
        // Get active tab's colors for glow effect
        const activeTabIndex = parseInt(localStorage.lastVisitedTab || '0');
        // Safely access inline CONFIG if available, otherwise default
        const activeTab = (typeof CONFIG !== 'undefined' && CONFIG.tabs && CONFIG.tabs[activeTabIndex])
            ? CONFIG.tabs[activeTabIndex]
            : {};
        const accent = activeTab.accent || '#a9b665';
        const container = activeTab.containerColor || '#2a2b26';

        return `
            :host {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none;
                z-index: 99;
                --theme-accent: ${accent};
                --theme-container: ${container};
            }

            .ambient-ui {
                position: absolute;
                top: 15px; 
                right: 25px;
                pointer-events: auto;
                z-index: 101;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            .ambient-btn {
                background: transparent;
                border: none;
                width: 32px;
                height: 32px;
                color: rgba(232, 224, 213, 0.4);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                border-radius: 8px;
            }

            .ambient-btn:hover {
                transform: scale(1.15) rotate(5deg);
                background: rgba(255, 255, 255, 0.08);
                color: var(--theme-accent);
                box-shadow: 0 0 15px -5px var(--theme-accent);
                filter: drop-shadow(0 0 5px var(--theme-accent));
            }

            .ambient-btn.playing {
                color: var(--theme-accent);
            }

            .ambient-btn svg { width: 20px; height: 20px; }
            
            @keyframes pulse {
                0%, 100% { 
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(169, 182, 101, 0.4);
                }
                50% { 
                    transform: scale(1.1);
                    box-shadow: 0 0 0 10px rgba(169, 182, 101, 0);
                }
            }

            .sound-menu {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 5px;
                opacity: 0;
                visibility: hidden;
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding: 4px;
                background: var(--theme-container, rgba(42, 43, 38, 0.95));
                border: 1px solid rgba(169, 182, 101, 0.15);
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                transform: translateY(-5px);
                transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
                min-width: 90px;
                will-change: opacity, transform;
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
            }

            .sound-menu.open {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .sound-opt {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px 10px;
                background: transparent;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                color: rgba(232, 224, 213, 0.5);
                transition: all 0.2s ease;
                font: 500 10px 'Roboto', sans-serif;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                text-align: left;
                width: 100%;
                box-sizing: border-box;
            }

            .sound-opt:hover {
                background: rgba(255, 255, 255, 0.08);
                color: var(--theme-accent);
            }

            .sound-opt.active {
                color: var(--theme-accent);
                background: rgba(169, 182, 101, 0.1);
            }

            .sound-opt svg { width: 12px; height: 12px; }

            .stop-btn {
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                margin-top: 2px;
                color: rgba(231, 111, 81, 0.6);
            }
            .stop-btn:hover { color: #e76f51; background: rgba(231, 111, 81, 0.1); }
            
            #effects-layer {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                pointer-events: none;
                z-index: 0;
                overflow: hidden;
            }

            .rain-drop {
                position: absolute;
                background: linear-gradient(to bottom, 
                    rgba(200, 220, 255, 0), 
                    rgba(200, 220, 255, 0.5),
                    rgba(200, 220, 255, 0.3));
                width: 1.5px; 
                height: 60px; 
                top: -80px;
                border-radius: 0 0 2px 2px;
                will-change: transform;
                transform: translateZ(0);
            }

            .sakura-petal {
                position: absolute;
                width: 12px; height: 12px; 
                top: -30px;
                border-radius: 100% 0 100% 0;
                opacity: 0;
                will-change: transform;
                transform: translateZ(0);
                animation: sakura-anim 8s ease-in-out forwards;
            }
            
            .sparkle {
                position: absolute;
                width: 4px; height: 4px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent);
                border-radius: 50%;
                top: -10px;
                opacity: 0;
                will-change: transform;
                animation: sparkle-anim 4s ease-out forwards;
            }
            
            .landed-petal {
                position: absolute;
                bottom: 5px;
                width: 10px; height: 8px;
                border-radius: 100% 0 100% 0;
                opacity: 0.6;
                transform: rotate(90deg);
                animation: land-anim 0.5s ease-out forwards;
            }
            
            .rain-splash {
                position: absolute;
                bottom: 0;
                width: 8px;
                height: 3px;
                background: radial-gradient(ellipse, rgba(180, 200, 255, 0.6), transparent);
                border-radius: 50%;
                opacity: 0;
                animation: splash-anim 0.4s ease-out forwards;
            }
            
            /* Water level at bottom */
            .water-level {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0px;
                background: linear-gradient(to top, 
                    rgba(100, 140, 200, 0.15),
                    rgba(120, 160, 220, 0.08),
                    transparent);
                transition: height 2s ease-out;
                pointer-events: none;
            }

            @keyframes rain-anim {
                to { transform: translateY(calc(100vh + 80px)); }
            }
            
            @keyframes splash-anim {
                0% { transform: scale(0.5); opacity: 0.8; }
                100% { transform: scale(2.5); opacity: 0; }
            }
            
            @keyframes sakura-anim {
                0% { 
                    transform: translateY(-5vh) translateX(0) rotate(0deg);
                    opacity: 0;
                }
                5% { 
                    opacity: 0.85;
                }
                15% { 
                    transform: translateY(12vh) translateX(1.5vw) rotate(45deg);
                }
                30% { 
                    transform: translateY(27vh) translateX(-1vw) rotate(100deg);
                }
                45% { 
                    transform: translateY(42vh) translateX(2vw) rotate(160deg);
                }
                60% { 
                    transform: translateY(57vh) translateX(0vw) rotate(220deg);
                }
                75% { 
                    transform: translateY(72vh) translateX(1.5vw) rotate(280deg);
                }
                90% { 
                    transform: translateY(87vh) translateX(-0.5vw) rotate(340deg);
                    opacity: 0.7;
                }
                100% { 
                    transform: translateY(100vh) translateX(1vw) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes sparkle-anim {
                0% { 
                    transform: translateY(0) scale(0);
                    opacity: 0;
                }
                20% { 
                    transform: translateY(15vh) scale(1);
                    opacity: 1;
                }
                50% { opacity: 0.6; }
                100% { 
                    transform: translateY(80vh) scale(0.3);
                    opacity: 0;
                }
            }
            
            @keyframes land-anim {
                0% { opacity: 0; transform: rotate(45deg) scale(0.5); }
                100% { opacity: 0.5; transform: rotate(90deg) scale(1); }
            }
        `;
    }

    template() {
        const musicIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;

        return `
            <div id="effects-layer"></div>
            <div class="ambient-ui">
                <button class="ambient-btn" id="ambient-btn" title="Ambient Sounds">
                    ${musicIcon}
                </button>
                <div class="sound-menu" id="sound-menu">
                    ${this.sounds.map(s => `
                        <button class="sound-opt" data-sound="${s.id}">
                            ${s.icon}
                            <span>${s.name}</span>
                        </button>
                    `).join('')}
                    <button class="sound-opt stop-btn" data-sound="stop">
                        <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                        <span>Stop</span>
                    </button>
                </div>
            </div>
            <audio id="ambient-audio" loop preload="auto"></audio>
        `;
    }

    initAudio() {
        this.currentAudio = this.shadow.getElementById('ambient-audio');
        if (this.currentAudio) this.currentAudio.volume = 0.5;
        this.effectsContainer = this.shadow.getElementById('effects-layer');
    }

    toggleMenu(e) {
        if (e) e.stopPropagation();
        this.soundMenuOpen = !this.soundMenuOpen;
        this.shadow.getElementById('sound-menu')?.classList.toggle('open', this.soundMenuOpen);
    }

    playSound(soundId) {
        if (!this.currentAudio) return;
        const sound = this.sounds.find(s => s.id === soundId);
        if (!sound) return;

        const previousSound = this.currentSound;

        // If switching effects, do a smooth crossfade
        if (previousSound && previousSound !== soundId) {
            this.crossfadeToEffect(soundId, sound.src);
        } else {
            // Fresh start
            this.currentAudio.pause();
            this.currentAudio.src = sound.src;
            this.currentAudio.volume = 0.5;
            this.currentAudio.play().catch(() => { });

            this.currentSound = soundId;
            this.updateUI();
            this.startEffects(soundId);

            // Save to localStorage for persistence
            localStorage.setItem('ambientSound', soundId);
        }
    }

    crossfadeToEffect(newSoundId, newSrc) {
        // Fade out current audio
        const fadeOutInterval = setInterval(() => {
            if (this.currentAudio && this.currentAudio.volume > 0.1) {
                this.currentAudio.volume -= 0.05;
            } else {
                clearInterval(fadeOutInterval);

                // Fade out visual effects
                if (this.effectsContainer) {
                    const elements = this.effectsContainer.children;
                    Array.from(elements).forEach(el => {
                        el.style.transition = 'opacity 0.8s ease';
                        el.style.opacity = '0';
                    });
                }

                // After visual fade, switch to new effect
                setTimeout(() => {
                    // Clear old effects
                    if (this.animationFrameId) {
                        cancelAnimationFrame(this.animationFrameId);
                        this.animationFrameId = null;
                    }
                    if (this.effectsContainer) this.effectsContainer.innerHTML = '';
                    this.waterLevel = null;
                    this.currentWaterHeight = 0;

                    // Start new audio with fade in
                    this.currentAudio.src = newSrc;
                    this.currentAudio.volume = 0;
                    this.currentAudio.play().catch(() => { });

                    // Fade in audio
                    const fadeInInterval = setInterval(() => {
                        if (this.currentAudio && this.currentAudio.volume < 0.5) {
                            this.currentAudio.volume += 0.05;
                        } else {
                            clearInterval(fadeInInterval);
                        }
                    }, 50);

                    // Start new effect
                    this.currentSound = newSoundId;
                    this.updateUI();
                    this.startEffects(newSoundId);
                }, 800);
            }
        }, 50);
    }

    stopSound() {
        if (!this.currentAudio) return;

        const wasRain = this.currentSound === 'rain';

        // Fade audio volume
        const fadeAudio = () => {
            if (this.currentAudio && this.currentAudio.volume > 0.1) {
                this.currentAudio.volume -= 0.1;
                setTimeout(fadeAudio, 100);
            } else if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.src = '';
                this.currentAudio.volume = 0.5; // Reset for next play
            }
        };

        fadeAudio();
        this.currentSound = null;
        this.updateUI();

        // Clear from localStorage so it won't auto-resume
        localStorage.removeItem('ambientSound');

        // Use graceful fadeout for rain, instant for others
        if (wasRain) {
            this.fadeOutEffects();
        } else {
            this.stopEffects();
        }
    }

    updateUI() {
        const btn = this.shadow.getElementById('ambient-btn');
        const opts = this.shadow.querySelectorAll('.sound-opt');

        btn?.classList.toggle('playing', !!this.currentSound);
        opts.forEach(opt => opt.classList.toggle('active', opt.dataset.sound === this.currentSound));
    }

    handleClick(e) {
        const opt = e.target.closest('.sound-opt');
        if (!opt) return;

        const soundId = opt.dataset.sound;
        if (soundId === 'stop' || soundId === this.currentSound) {
            this.stopSound();
        } else {
            this.playSound(soundId);
        }
        this.toggleMenu();
    }

    stopEffects() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.particles = [];
        this.waterLevel = null;
        this.currentWaterHeight = 0;
        if (this.effectsContainer) this.effectsContainer.innerHTML = '';
    }

    startEffects(type) {
        this.stopEffects();
        this.lastSpawnTime = 0;
        this.effectStartTime = performance.now();
        this.isStopping = false;

        const animate = (timestamp) => {
            if (!this.currentSound && !this.isStopping) return;

            // Calculate elapsed time for ramping
            const elapsed = timestamp - this.effectStartTime;

            let spawnInterval;
            if (type === 'rain') {
                // Gradual ramp-up: starts slow (200ms), reaches full speed (40ms) over 3 seconds
                const rampDuration = 3000;
                const minInterval = 40;
                const maxInterval = 200;

                if (this.isStopping) {
                    // Slow down when stopping
                    spawnInterval = maxInterval * 2;
                } else if (elapsed < rampDuration) {
                    // Ramping up
                    const progress = elapsed / rampDuration;
                    spawnInterval = maxInterval - (progress * (maxInterval - minInterval));
                } else {
                    // Full intensity
                    spawnInterval = minInterval;
                }
            } else {
                // Sakura: gentle ramp
                spawnInterval = 400;
            }

            if (timestamp - this.lastSpawnTime > spawnInterval) {
                this.lastSpawnTime = timestamp;
                if (type === 'rain') {
                    this.createRainDrop();
                } else if (type === 'sparkle') {
                    this.createSakuraPetal();
                }
            }

            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    // Graceful stop with fade out
    fadeOutEffects() {
        this.isStopping = true;

        // Let existing drops finish, stop spawning new ones quickly
        setTimeout(() => {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            // Fade out remaining elements
            if (this.effectsContainer) {
                const elements = this.effectsContainer.querySelectorAll('.rain-drop, .rain-splash');
                elements.forEach(el => {
                    el.style.transition = 'opacity 0.5s ease';
                    el.style.opacity = '0';
                });

                // Clear after fade
                setTimeout(() => {
                    this.particles = [];
                    this.waterLevel = null;
                    this.currentWaterHeight = 0;
                    if (this.effectsContainer) this.effectsContainer.innerHTML = '';
                    this.isStopping = false;
                }, 600);
            }
        }, 1500); // Let rain slow for 1.5s before stopping
    }

    createRainDrop() {
        if (!this.effectsContainer) return;

        // Limit particles for performance
        const maxParticles = 80;
        const drops = this.effectsContainer.querySelectorAll('.rain-drop');
        if (drops.length >= maxParticles) return;

        const drop = document.createElement('div');
        drop.className = 'rain-drop';

        const left = Math.random() * 100;
        // Natural variation: 0.8s to 2s (faster rain)
        const duration = Math.random() * 1.2 + 0.8;
        // Visible opacity (0.4 to 0.8)
        const opacity = Math.random() * 0.4 + 0.4;
        // Randomize height for variety (40-80px)
        const height = Math.random() * 40 + 40;

        drop.style.cssText = `left:${left}vw;opacity:${opacity};height:${height}px;animation:rain-anim ${duration}s linear forwards`;

        this.effectsContainer.appendChild(drop);

        // Create splash when drop lands
        drop.addEventListener('animationend', () => {
            this.createSplash(left);
            drop.remove();

            // Slowly increase water level (very slowly)
            this.increaseWaterLevel();
        }, { once: true });
    }

    createSplash(leftPos) {
        if (!this.effectsContainer) return;

        // Limit splashes for performance
        const splashes = this.effectsContainer.querySelectorAll('.rain-splash');
        if (splashes.length >= 15) return;

        const splash = document.createElement('div');
        splash.className = 'rain-splash';
        splash.style.left = `${leftPos}vw`;

        this.effectsContainer.appendChild(splash);
        splash.addEventListener('animationend', () => splash.remove(), { once: true });
    }

    increaseWaterLevel() {
        if (!this.waterLevel) {
            // Create water level element if it doesn't exist
            this.waterLevel = this.effectsContainer.querySelector('.water-level');
            if (!this.waterLevel) {
                this.waterLevel = document.createElement('div');
                this.waterLevel.className = 'water-level';
                this.effectsContainer.appendChild(this.waterLevel);
            }
            this.currentWaterHeight = 0;
        }

        // Very slowly increase (max 30px height)
        if (this.currentWaterHeight < 30) {
            this.currentWaterHeight += 0.05; // Super slow
            this.waterLevel.style.height = `${this.currentWaterHeight}px`;
        }
    }

    createSakuraPetal() {
        if (!this.effectsContainer) return;

        // Allow more particles for magical feel
        const petals = this.effectsContainer.querySelectorAll('.sakura-petal');
        if (petals.length >= 25) return;

        const petal = document.createElement('div');
        petal.className = 'sakura-petal';

        const left = Math.random() * 100;
        const size = Math.random() * 4 + 8; // 8-12px (more realistic)
        const duration = Math.random() * 6 + 10; // 10-16s

        // Realistic sakura petal colors (no glow, natural look)
        const colors = [
            '#FFB7C5', // Classic sakura pink
            '#FADADD', // Pale blush
            '#FFC0CB', // Soft pink
            '#FFE4E9', // Almost white with pink tint
            '#F8C8D4', // Dusty rose
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.cssText = `
            left:${left}vw;
            width:${size}px;
            height:${size}px;
            background: ${color};
            box-shadow: inset 1px 1px 2px rgba(255,255,255,0.5), inset -1px -1px 2px rgba(200,150,160,0.2);
            animation: sakura-anim ${duration}s linear forwards;
            animation-delay: ${Math.random() * 1}s;
        `;

        this.effectsContainer.appendChild(petal);

        // Create sparkle particle occasionally (30% chance)
        if (Math.random() < 0.3) {
            this.createSparkle(left);
        }

        // When petal lands, create a landed petal at bottom
        petal.addEventListener('animationend', () => {
            this.createLandedPetal(left, color);
            petal.remove();
        }, { once: true });
    }

    createSparkle(leftPos) {
        if (!this.effectsContainer) return;

        const sparkles = this.effectsContainer.querySelectorAll('.sparkle');
        if (sparkles.length >= 10) return;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        const offsetX = (Math.random() - 0.5) * 10; // Random offset from petal
        sparkle.style.cssText = `
            left: calc(${leftPos}vw + ${offsetX}px);
            animation-duration: ${Math.random() * 2 + 3}s;
        `;

        this.effectsContainer.appendChild(sparkle);
        sparkle.addEventListener('animationend', () => sparkle.remove(), { once: true });
    }

    createLandedPetal(leftPos, color) {
        if (!this.effectsContainer) return;

        // Limit landed petals for performance
        const landed = this.effectsContainer.querySelectorAll('.landed-petal');
        if (landed.length >= 15) {
            // Remove oldest landed petal
            landed[0]?.remove();
        }

        const landedPetal = document.createElement('div');
        landedPetal.className = 'landed-petal';
        landedPetal.style.cssText = `
            left: ${leftPos}vw;
            background: ${color};
            filter: drop-shadow(0 0 2px rgba(255, 192, 203, 0.3));
        `;

        this.effectsContainer.appendChild(landedPetal);

        // Fade out after some time
        setTimeout(() => {
            landedPetal.style.transition = 'opacity 3s ease';
            landedPetal.style.opacity = '0';
            setTimeout(() => landedPetal.remove(), 3000);
        }, 5000);
    }

    setEvents() {
        this.shadow.getElementById('ambient-btn')?.addEventListener('click', e => this.toggleMenu(e));
        this.shadow.getElementById('sound-menu')?.addEventListener('click', e => this.handleClick(e));
        document.addEventListener('click', () => { if (this.soundMenuOpen) this.toggleMenu(); });

        // Use document events for global settings state
        document.addEventListener('settingsOpened', () => {
            this.isPaused = true;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        });

        document.addEventListener('settingsClosed', () => {
            this.isPaused = false;
            // Only resume if sound was playing
            if (this.currentSound) {
                this.startEffects(this.currentSound);
            }
        });
    }

    connectedCallback() {
        this.isPaused = false;
        this.render().then(() => {
            this.initAudio();
            this.setEvents();

            // Auto-resume saved ambient sound
            const savedSound = localStorage.getItem('ambientSound');
            if (savedSound) {
                // Start effects immediately (always works)
                setTimeout(() => {
                    this.currentSound = savedSound;
                    this.updateUI();
                    this.startEffects(savedSound);

                    // Try to play audio (may be blocked by browser)
                    const sound = this.sounds.find(s => s.id === savedSound);
                    if (sound && this.currentAudio) {
                        this.currentAudio.src = sound.src;
                        this.currentAudio.volume = 0.5;

                        this.currentAudio.play().catch(() => {
                            // Audio blocked - wait for user interaction
                            this.pendingAudioPlay = true;

                            // Pulse the music icon to indicate click needed
                            const btn = this.shadow.getElementById('ambient-btn');
                            if (btn) btn.style.animation = 'pulse 1.5s infinite';

                            // Resume audio on first user interaction
                            const resumeAudio = () => {
                                if (this.pendingAudioPlay && this.currentAudio) {
                                    this.currentAudio.play().catch(() => { });
                                    this.pendingAudioPlay = false;

                                    // Remove pulse animation
                                    const btn = this.shadow.getElementById('ambient-btn');
                                    if (btn) btn.style.animation = '';
                                }
                                document.removeEventListener('click', resumeAudio);
                                document.removeEventListener('keydown', resumeAudio);
                            };

                            document.addEventListener('click', resumeAudio, { once: true });
                            document.addEventListener('keydown', resumeAudio, { once: true });
                        });
                    }
                }, 500);
            }
        });
    }
}

customElements.define('ambient-player', AmbientPlayer);
