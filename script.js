/**
 * SÀI GÒN TRAVEL (2026 EDITION) - MASTER INTERACTIVITY SCRIPT
 * Features:
 * - Scroll progress bar
 * - Hero carousel smooth auto-cycle
 * - Navbar sticky & active spy on scroll
 * - Mobile responsive drawer menu
 * - Smooth scroll with header offset
 * - Stat counter on view
 * - Gallery Category Filtering
 * - Fullscreen Lightbox Modal with Next/Prev/Keyboard controls
 * - Interactive FAQ Accordion
 * - Synthesized Chill Ambient Audio Engine (Web Audio API - no external file required)
 * - Planner Form interactive submission simulation
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. SCROLL PROGRESS BAR & NAVBAR SCROLL BEHAVIOR
       ========================================================== */
    const progressBar = document.getElementById('scrollProgressBar');
    const navbar = document.getElementById('mainNavbar');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('header[id], section[id]');

    function onScrollHandler() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (docHeight > 0) ? (scrollTop / docHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }

        // Navbar appearance
        if (scrollTop > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollTop > 450) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active navigation link highlighting
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 140;
            const secHeight = sec.offsetHeight;
            if (scrollTop >= secTop && scrollTop < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSectionId) {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', onScrollHandler, { passive: true });
    onScrollHandler();

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================
       2. MOBILE NAVIGATION MENU
       ========================================================== */
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile menu on item click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    /* ==========================================================
       3. HERO CAROUSEL ROTATION
       ========================================================== */
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    if (heroSlides.length > 1) {
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 6000);
    }

    /* ==========================================================
       4. ANIMATED STAT COUNTER
       ========================================================== */
    const statElements = document.querySelectorAll('.stat-value');
    let counterStarted = false;

    function runCounters() {
        statElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-count'), 10) || 0;
            const duration = 2000;
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    const statsRow = document.querySelector('.hero-stats-row');
    if (statsRow) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counterStarted) {
                counterStarted = true;
                runCounters();
            }
        }, { threshold: 0.3 });

        statsObserver.observe(statsRow);
    }

    /* ==========================================================
       5. GALLERY FILTER TABS
       ========================================================== */
    const filterBtns = document.querySelectorAll('.filter-tab-btn');
    const galleryCells = document.querySelectorAll('.gallery-cell');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryCells.forEach(cell => {
                const category = cell.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    cell.classList.remove('hidden');
                } else {
                    cell.classList.add('hidden');
                }
            });
        });
    });

    /* ==========================================================
       6. LIGHTBOX MODAL WITH FULL CONTROLS
       ========================================================== */
    const lightboxModal = document.getElementById('imageLightboxModal');
    const lightboxImg = document.getElementById('lightboxActiveImg');
    const lightboxCaption = document.getElementById('lightboxCaptionText');
    const lightboxIndex = document.getElementById('lightboxIndexTag');
    const lightboxClose = document.getElementById('lightboxCloseBtn');
    const lightboxPrev = document.getElementById('lightboxPrevBtn');
    const lightboxNext = document.getElementById('lightboxNextBtn');

    // Collect all zoomable photos
    let allPhotos = [];
    let currentPhotoIdx = 0;

    function buildPhotoPool() {
        allPhotos = [];
        // From curated photo items
        document.querySelectorAll('.curated-photo-item').forEach(item => {
            const img = item.querySelector('img');
            const nameEl = item.querySelector('.spot-name');
            const descEl = item.querySelector('.spot-desc');
            const caption = (nameEl ? nameEl.textContent : '') + (descEl ? ' — ' + descEl.textContent : '');
            if (img) {
                allPhotos.push({
                    src: img.getAttribute('src') || img.src,
                    caption: caption || img.alt
                });
            }
        });

        // From gallery masonry items
        document.querySelectorAll('.gallery-cell .gallery-frame').forEach(frame => {
            const img = frame.querySelector('img');
            const h4 = frame.querySelector('h4');
            const p = frame.querySelector('p');
            const caption = (h4 ? h4.textContent : '') + (p ? ' — ' + p.textContent : '');
            if (img) {
                allPhotos.push({
                    src: img.getAttribute('src') || img.src,
                    caption: caption || img.alt
                });
            }
        });
    }

    buildPhotoPool();

    window.openLightbox = function(imageSrc, captionText) {
        if (!lightboxModal) return;

        // Find index in pool or default
        const foundIndex = allPhotos.findIndex(item => item.src === imageSrc || item.src.endsWith(imageSrc) || imageSrc.endsWith(item.src));
        currentPhotoIdx = (foundIndex !== -1) ? foundIndex : 0;

        updateLightboxContent(imageSrc, captionText);
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    function updateLightboxContent(src, caption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || '';
        lightboxIndex.textContent = (currentPhotoIdx + 1) + ' / ' + (allPhotos.length || 1);
    }

    function showNextPhoto() {
        if (allPhotos.length === 0) return;
        currentPhotoIdx = (currentPhotoIdx + 1) % allPhotos.length;
        const item = allPhotos[currentPhotoIdx];
        updateLightboxContent(item.src, item.caption);
    }

    function showPrevPhoto() {
        if (allPhotos.length === 0) return;
        currentPhotoIdx = (currentPhotoIdx - 1 + allPhotos.length) % allPhotos.length;
        const item = allPhotos[currentPhotoIdx];
        updateLightboxContent(item.src, item.caption);
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);

    // Close on background click
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation (Esc, ArrowLeft, ArrowRight)
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextPhoto();
        if (e.key === 'ArrowLeft') showPrevPhoto();
    });

    /* ==========================================================
       7. FAQ ACCORDION INTERACTIVITY
       ========================================================== */
    const faqCards = document.querySelectorAll('.faq-card');

    faqCards.forEach(card => {
        const header = card.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            faqCards.forEach(c => c.classList.remove('active'));
            if (!isActive) {
                card.classList.add('active');
            }
        });
    });

    /* ==========================================================
       8. TRIP PLANNER FORM VALIDATION & SIMULATION
       ========================================================== */
    const plannerForm = document.getElementById('travelPlannerForm');
    const submitBtn = document.getElementById('btnSubmitPlan');

    if (plannerForm) {
        plannerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();

            if (!name || !email) {
                alert('Vui lòng điền họ tên và email để nhận cẩm nang.');
                return;
            }

            // Button loading animation
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang tạo cẩm nang PDF...';

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Đã gửi vào Email của bạn thành công!';
                submitBtn.style.background = '#27ae60';
                submitBtn.style.color = '#fff';

                setTimeout(() => {
                    alert(`Cảm ơn bạn ${name}! Cẩm nang du lịch độc quyền "Khám Phá Sài Gòn Quận 1" đã được gửi tự động tới email: ${email}. Hãy kiểm tra hộp thư nhé!`);
                    plannerForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                }, 1200);
            }, 1800);
        });
    }

    /* ==========================================================
       9. AMBIENT AUDIO ENGINE (WEB AUDIO API SYNTHESIZER)
       Generates soothing, peaceful ambient musical chords
       mimicking a calm river breeze and Saigon sunset chill vibes.
       No external audio files needed!
       ========================================================== */
    const audioWidget = document.getElementById('audioWidget');
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioIcon = document.getElementById('audioIcon');
    let audioCtx = null;
    let isPlayingAudio = false;
    let synthNodes = [];
    let chordTimer = null;

    // Pentatonic soothing frequencies (F, G, A, C, D)
    const chords = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [130.81, 164.81, 196.00, 246.94]  // Cmaj7
    ];
    let currentChordIdx = 0;

    function initAudioEngine() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playWarmChord(freqArray) {
        if (!audioCtx || !isPlayingAudio) return;

        // Clean previous voices gently
        const now = audioCtx.currentTime;

        freqArray.forEach(freq => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Subtle gentle envelope (slow attack, long smooth release)
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.025, now + 1.2);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 5.2);
        });
    }

    function toggleAmbientSound() {
        initAudioEngine();

        if (isPlayingAudio) {
            isPlayingAudio = false;
            clearInterval(chordTimer);
            audioWidget.classList.remove('playing');
            audioIcon.className = 'fas fa-volume-xmark';
        } else {
            isPlayingAudio = true;
            audioWidget.classList.add('playing');
            audioIcon.className = 'fas fa-volume-high';

            // Play immediately then loop chords every 4.8s
            playWarmChord(chords[currentChordIdx]);
            chordTimer = setInterval(() => {
                currentChordIdx = (currentChordIdx + 1) % chords.length;
                playWarmChord(chords[currentChordIdx]);
            }, 4800);
        }
    }

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', toggleAmbientSound);
    }
});

    /* ==========================================================
       10. INTERACTIVE PASSPORT STAMP COLLECTOR & STICKER SOUNDS
       ========================================================== */
    const collectedStamps = new Set();
    const stampsCountEl = document.getElementById('stampsCollectedCount');

    window.collectPassportStamp = function(stampId) {
        const stampBox = document.getElementById(stampId);
        if (!stampBox) return;

        if (!collectedStamps.has(stampId)) {
            collectedStamps.add(stampId);
            stampBox.classList.add('stamped');
            const triggerBtn = stampBox.querySelector('.stamp-btn-trigger');
            if (triggerBtn) {
                triggerBtn.innerHTML = '<i class="fas fa-check"></i> Đã đóng dấu!';
            }

            // Play mechanical stamp sound
            playStampSound();

            // Spawn celebration particles
            spawnStampConfetti(stampBox);

            if (stampsCountEl) {
                stampsCountEl.textContent = collectedStamps.size;
            }

            if (collectedStamps.size === 3) {
                setTimeout(() => {
                    alert('🎉 TUYỆT VỜI! Bạn đã thu thập trọn vẹn 3 con dấu thông hành Sài Gòn: Bến Bạch Đằng, Phố Nguyễn Huệ & Bưu Điện Trung Tâm! Đừng quên nhận cẩm nang PDF miễn phí ở bên dưới nhé!');
                }, 600);
            }
        }
    };

    function playStampSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.22);
        } catch(e) {}
    }

    function spawnStampConfetti(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        for (let i = 0; i < 18; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 8 + 6;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 80) + 'px';
            particle.style.top = (rect.top + rect.height / 2 + (Math.random() - 0.5) * 80) + 'px';
            particle.style.background = (Math.random() > 0.5) ? '#f5d77f' : '#e74c3c';
            particle.style.position = 'fixed';
            particle.style.zIndex = '99999';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.boxShadow = '0 0 10px #d4af37';
            particle.style.transition = 'all 0.8s ease-out';
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.style.transform = `translate(${(Math.random() - 0.5) * 160}px, ${(Math.random() - 0.5) * 160 - 40}px) scale(0)`;
                particle.style.opacity = '0';
            }, 20);

            setTimeout(() => {
                particle.remove();
            }, 850);
        }
    }
