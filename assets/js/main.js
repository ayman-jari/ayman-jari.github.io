/*==================== MENU MOBILE ====================*/
const navList = document.getElementById('nav-menu')
const navToggle = document.getElementById('nav-toggle')
const navOverlay = document.getElementById('nav-overlay')

function openMenu() {
    navList.classList.add('show-menu')
    navOverlay.classList.add('is-visible')
    navToggle.classList.add('is-active')
}

function closeMenu() {
    navList.classList.remove('show-menu')
    navOverlay.classList.remove('is-visible')
    navToggle.classList.remove('is-active')
}

if (navToggle) navToggle.addEventListener('click', () => navList.classList.contains('show-menu') ? closeMenu() : openMenu())
if (navOverlay) navOverlay.addEventListener('click', closeMenu)

document.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', closeMenu))

/*==================== PARCOURS ====================*/
const tabs = document.querySelectorAll('[data-target]'),
    tabContenus = document.querySelectorAll('[data-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target)
        tabContenus.forEach(tc => tc.classList.remove('parcours__actif'))
        target.classList.add('parcours__actif')
        tabs.forEach(t => t.classList.remove('parcours__actif'))
        tab.classList.add('parcours__actif')
    })
})

/*==================== PROJET MODALS ====================*/

/*==================== SCROLL ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset
    sections.forEach(current => {
        const sectionTop = current.offsetTop - 50
        const sectionId = current.getAttribute('id')
        const link = document.querySelector('.nav__list a[href*=' + sectionId + ']')
        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + current.offsetHeight) {
                link.classList.add('active-link')
            } else {
                link.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== BACKGROUND HEADER ====================*/
function scrollHeader() {
    const header = document.getElementById('header')
    header.classList.toggle('scroll-header', window.scrollY >= 80)
}
window.addEventListener('scroll', scrollHeader)

/*==================== SCROLL UP ====================*/
function scrollUp() {
    const btn = document.getElementById('scroll-up')
    if (btn) btn.classList.toggle('show-scroll', window.scrollY >= 560)
}
window.addEventListener('scroll', scrollUp)

/*==================== CONTACT FORM ====================*/
emailjs.init('X2_5zxAQMVGPmPODW')

const contactForm = document.getElementById('contact-form')
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault()
        emailjs.sendForm('service_7ekam99', 'template_o67ppxs', contactForm)
            .then(() => {
                alert('Message envoyé ! Je vous répondrai dès que possible.')
                contactForm.reset()
            })
            .catch(() => alert('Erreur lors de l\'envoi, réessayez.'))
    })
}

/*==================== DARK / LIGHT THEME ====================*/
const themeCheckbox = document.getElementById('theme-bouton')
const darkTheme = 'dark-theme'

if (localStorage.getItem('selected-theme') === 'dark') {
    document.body.classList.add(darkTheme)
    if (themeCheckbox) themeCheckbox.checked = true
}

if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
        const isDark = themeCheckbox.checked
        document.body.classList.toggle(darkTheme, isDark)
        localStorage.setItem('selected-theme', isDark ? 'dark' : 'light')
    })
}

/*==================== FILTRES & RECHERCHE PROJETS ====================*/
; (function () {
    const searchInput = document.getElementById('projets-search')
    const cartes = document.querySelectorAll('.projet__carte[data-search]')
    const videMsg = document.getElementById('projets-vide')
    const filtresBtns = document.querySelectorAll('#filtres-type .filtre__btn')

    const LANG_MAP = {
        'lang-C': c => /\bC\b/.test(c.dataset.lang || '') && !(c.dataset.lang || '').includes('OCaml'),
        'lang-Python': c => (c.dataset.lang || '').includes('Python'),
        'lang-Web': c => ['JavaScript', 'TypeScript', 'PHP'].some(l => (c.dataset.lang || '').includes(l)),
        'lang-Java': c => (c.dataset.lang || '').includes('Java') && !(c.dataset.lang || '').includes('JavaScript'),
    }

    let activeFilter = 'tous'
    let searchTerm = ''

    function filterProjects() {
        let visible = 0
        cartes.forEach(carte => {
            const types = carte.dataset.type || ''
            let matchFilter
            if (activeFilter === 'tous') matchFilter = true
            else if (LANG_MAP[activeFilter]) matchFilter = LANG_MAP[activeFilter](carte)
            else matchFilter = types.split(' ').includes(activeFilter)

            const matchSearch = !searchTerm || (carte.dataset.search || '').toLowerCase().includes(searchTerm)

            if (matchFilter && matchSearch) { carte.classList.remove('hidden'); visible++ }
            else { carte.classList.add('hidden') }
        })
        if (videMsg) videMsg.style.display = visible === 0 ? 'block' : 'none'
    }

    filtresBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtresBtns.forEach(b => b.classList.remove('actif'))
            btn.classList.add('actif')
            activeFilter = btn.dataset.type
            filterProjects()
        })
    })

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchTerm = searchInput.value.trim().toLowerCase()
            filterProjects()
        })
    }

    function closeAllModals() {
        document.querySelectorAll('.projet__modal.modal-actif').forEach(m => m.classList.remove('modal-actif'))
    }

    cartes.forEach(carte => {
        const modalId = carte.dataset.opensModal
        if (!modalId) return
        const modal = document.getElementById(modalId)
        if (!modal) return
        carte.addEventListener('click', e => {
            if (e.target.closest('a')) return
            closeAllModals()
            modal.classList.add('modal-actif')
        })
    })

    document.querySelectorAll('.projet__modal').forEach(modal => {
        modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('modal-actif') })
        const closeBtn = modal.querySelector('.projet__modal-close')
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('modal-actif'))
    })
})()

document.addEventListener('mousedown', (e) => {
    const tag = e.target.tagName;
    const isEditable = e.target.isContentEditable;
    if (!['INPUT', 'TEXTAREA'].includes(tag) && !isEditable) {
        if (document.activeElement && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            document.activeElement.blur();
        }
    }
});

/*==================== FOND ÉTOILÉ ANIMÉ ====================*/
; (function () {
    const canvas = document.getElementById('stars-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W, H, stars = [], animId

    const STAR_COUNT = 250      // était 180
    const MAX_RADIUS = 3.0      // était 2.2
    const MIN_RADIUS = 0.6      // était 0.4
    const SPEED_MIN = 0.06     // un poil plus lent = plus visible
    const SPEED_MAX = 0.28

    function rand(min, max) { return Math.random() * (max - min) + min }

    function createStar(randomY = true) {
        const r = rand(MIN_RADIUS, MAX_RADIUS)
        return {
            x: rand(0, W),
            y: randomY ? rand(0, H) : -r * 2,
            r,
            opacity: rand(0.55, 1.0),   // était rand(0.25, 0.85)
            speed: rand(SPEED_MIN, SPEED_MAX) * (r / MAX_RADIUS * 0.6 + 0.4),
            drift: rand(-0.04, 0.04),
            twinkle: rand(0, Math.PI * 2),
            twinkleSpeed: rand(0.008, 0.025),
        }
    }

    function resize() {
        W = canvas.width = window.innerWidth
        H = canvas.height = window.innerHeight
    }

    function init() {
        resize()
        stars = Array.from({ length: STAR_COUNT }, () => createStar(true))
    }

    function draw() {
        ctx.clearRect(0, 0, W, H)
        for (const s of stars) {
            s.twinkle += s.twinkleSpeed
            const opacityFactor = 0.7 + 0.3 * Math.sin(s.twinkle)
            const finalOpacity = s.opacity * opacityFactor

            ctx.beginPath()
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
            const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r)
            g.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity})`)       // était 200,220,255
            g.addColorStop(1, `rgba(220, 235, 255, ${finalOpacity * 0.15})`) // était rgba à 0
            ctx.fillStyle = g
            ctx.fill()

            s.y += s.speed
            s.x += s.drift

            if (s.y > H + s.r * 2) { Object.assign(s, createStar(false)); s.x = rand(0, W) }
            if (s.x < -s.r * 4) s.x = W + s.r
            if (s.x > W + s.r * 4) s.x = -s.r
        }
        animId = requestAnimationFrame(draw)
    }

    function start() { if (animId) return; draw() }
    function stop() { if (animId) { cancelAnimationFrame(animId); animId = null } ctx.clearRect(0, 0, W, H) }

    function syncWithTheme() {
        document.body.classList.contains('dark-theme') ? start() : stop()
    }

    init()
    syncWithTheme()

    window.addEventListener('resize', () => {
        resize()
        stars.forEach(s => { if (s.x > W) s.x = rand(0, W) })
    })

    const observer = new MutationObserver(syncWithTheme)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
})()

/*==================== MENTIONS LÉGALES ====================*/
const mentionsModal = document.getElementById('mentions-modal')
const mentionsBtn = document.getElementById('mentions-btn')
const mentionsClose = document.getElementById('mentions-close')

if (mentionsBtn) mentionsBtn.addEventListener('click', () => mentionsModal.classList.add('modal-actif'))
if (mentionsClose) mentionsClose.addEventListener('click', () => mentionsModal.classList.remove('modal-actif'))
if (mentionsModal) mentionsModal.addEventListener('click', e => {
    if (e.target === mentionsModal) mentionsModal.classList.remove('modal-actif')
})