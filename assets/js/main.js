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

/*==================== PROJET MODALS (géré dans le bloc filtres) ====================*/

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
const contactForm = document.getElementById('contact-form')
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault()
        alert('Merci pour votre message ! Je vous répondrai dès que possible.')
        contactForm.reset()
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
(function () {
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

    // Filtres type
    filtresType.forEach(btn => {
        btn.addEventListener('click', () => {
            filtresType.forEach(b => b.classList.remove('actif'))
            btn.classList.add('actif')
            activeType = btn.dataset.type
            filterProjects()
        })
    })

    // Filtres langue
    filtresLang.forEach(btn => {
        btn.addEventListener('click', () => {
            filtresLang.forEach(b => b.classList.remove('actif'))
            btn.classList.add('actif')
            activeLang = btn.dataset.lang
            filterProjects()
        })
    })

    // Recherche
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchTerm = searchInput.value.trim().toLowerCase()
            filterProjects()
        })
    }

    // Modals : les modals sont HORS des cartes (dans le body)
    // Carte → ouvrir la modal correspondante via data-opens-modal
    function closeAllModals() {
        document.querySelectorAll('.projet__modal.modal-actif').forEach(m => m.classList.remove('modal-actif'))
    }

    cartes.forEach(carte => {
        const modalId = carte.dataset.opensModal
        if (!modalId) return
        const modal = document.getElementById(modalId)
        if (!modal) return

        // Clic carte → ouvrir (ignorer si clic sur lien)
        carte.addEventListener('click', e => {
            if (e.target.closest('a')) return
            closeAllModals()
            modal.classList.add('modal-actif')
        })
    })

    // Fermer via fond ou bouton close — pour toutes les modals
    document.querySelectorAll('.projet__modal').forEach(modal => {
        // Fond
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('modal-actif')
        })
        // Bouton close
        const closeBtn = modal.querySelector('.projet__modal-close')
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('modal-actif'))
    })
})()
