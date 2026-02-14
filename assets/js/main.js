/*==================== MENU MOBILE ====================*/
const navList    = document.getElementById('nav-menu')
const navToggle  = document.getElementById('nav-toggle')
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

if (navToggle)  navToggle.addEventListener('click', () => navList.classList.contains('show-menu') ? closeMenu() : openMenu())
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
        const sectionId  = current.getAttribute('id')
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
;(function () {
    const searchInput  = document.getElementById('projets-search')
    const cartes       = document.querySelectorAll('.projet__carte[data-search]')
    const videMsg      = document.getElementById('projets-vide')
    const filtresType  = document.querySelectorAll('#filtres-type .filtre__btn')
    const filtresLang  = document.querySelectorAll('#filtres-lang .filtre__btn')

    let activeType = 'tous'
    let activeLang = 'tous'
    let searchTerm = ''

    function filterProjects() {
        let visible = 0
        cartes.forEach(carte => {
            const types  = carte.dataset.type  || ''
            const langs  = carte.dataset.lang  || ''
            const search = carte.dataset.search || ''
            const matchType   = activeType === 'tous' || types.includes(activeType)
            const matchLang   = activeLang === 'tous' || langs.toLowerCase().includes(activeLang.toLowerCase())
            const matchSearch = searchTerm === '' || search.toLowerCase().includes(searchTerm)
            if (matchType && matchLang && matchSearch) {
                carte.classList.remove('hidden')
                visible++
            } else {
                carte.classList.add('hidden')
            }
        })
        if (videMsg) videMsg.style.display = visible === 0 ? 'block' : 'none'
    }

    filtresType.forEach(btn => {
        btn.addEventListener('click', () => {
            filtresType.forEach(b => b.classList.remove('actif'))
            btn.classList.add('actif')
            activeType = btn.dataset.type
            filterProjects()
        })
    })

    filtresLang.forEach(btn => {
        btn.addEventListener('click', () => {
            filtresLang.forEach(b => b.classList.remove('actif'))
            btn.classList.add('actif')
            activeLang = btn.dataset.lang
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
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('modal-actif')
        })
        const closeBtn = modal.querySelector('.projet__modal-close')
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('modal-actif'))
    })
})()

/*==================== MENTIONS LÉGALES ====================*/
const mentionsModal = document.getElementById('mentions-modal')
const mentionsBtn   = document.getElementById('mentions-btn')
const mentionsClose = document.getElementById('mentions-close')

if (mentionsBtn)   mentionsBtn.addEventListener('click', () => mentionsModal.classList.add('modal-actif'))
if (mentionsClose) mentionsClose.addEventListener('click', () => mentionsModal.classList.remove('modal-actif'))
if (mentionsModal) mentionsModal.addEventListener('click', e => {
    if (e.target === mentionsModal) mentionsModal.classList.remove('modal-actif')
})
