/* ═══════════════════════════════════════
   BengaliVerse v2 — script.js
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar scroll ── */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ── Scroll-reveal with IntersectionObserver ── */
    const revealEls = document.querySelectorAll(
        '.stats-tag, .stats-heading, .stat-card, .brands-row, .section-tag, .highlight-card'
    );
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                setTimeout(() => el.classList.add('visible'), delay);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.18 });

    revealEls.forEach((el, i) => {
        if (el.classList.contains('stat-card') || el.classList.contains('highlight-card')) {
            el.dataset.delay = (i % 6) * 80;
        }
        revealObserver.observe(el);
    });

    /* ── Stat counter animation ── */
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        el.dataset.target = el.textContent.trim();
        el.textContent = '0';
    });
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const raw    = el.dataset.target;
                const suffix = raw.replace(/[0-9]/g, '');
                const target = parseInt(raw);
                let count = 0;
                const step  = Math.max(1, Math.ceil(target / 70));
                const timer = setInterval(() => {
                    count = Math.min(count + step, target);
                    el.textContent = count + suffix;
                    if (count >= target) clearInterval(timer);
                }, 22);
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => countObserver.observe(el));

    /* ── Carousel: arrows ── */
    const track   = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const SCROLL  = 364;

    nextBtn.addEventListener('click', () => track.scrollBy({ left:  SCROLL, behavior: 'smooth' }));
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -SCROLL, behavior: 'smooth' }));

    /* ── Carousel: mouse drag ── */
    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', e => {
        isDown = true; track.classList.add('dragging');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });
    document.addEventListener('mouseup',    () => { isDown = false; track.classList.remove('dragging'); });
    document.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.5;
    });

    /* ── Carousel: auto-scroll ── */
    const autoStep = () => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: SCROLL, behavior: 'smooth' });
        }
    };
    let autoTimer = setInterval(autoStep, 4200);
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', () => { autoTimer = setInterval(autoStep, 4200); });

    /* ── Parallax on hero bg ── */
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.04)`;
        }
    }, { passive: true });

    /* ── Tilt effect on stat cards ── */
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - .5;
            const y = (e.clientY - rect.top)  / rect.height - .5;
            card.style.transform = `translateY(-8px) scale(1.03) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    /* ── Ripple on liquid buttons ── */
    document.querySelectorAll('.btn-liquid').forEach(btn => {
        btn.addEventListener('click', e => {
            const rect   = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size   = Math.max(rect.width, rect.height) * 2;
            ripple.style.cssText = `
                position:absolute; border-radius:50%;
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top  - size/2}px;
                background:rgba(255,255,255,0.18);
                transform:scale(0); animation:rippleAnim .55s ease-out forwards;
                pointer-events:none;
            `;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ── Inject ripple keyframe ── */
    const style = document.createElement('style');
    style.textContent = `@keyframes rippleAnim { to { transform:scale(1); opacity:0; } }`;
    document.head.appendChild(style);

    /* ── Hero bg zoom on load ── */
    setTimeout(() => document.querySelector('.hero-bg')?.classList.add('loaded'), 100);

});
