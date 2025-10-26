const translations = {}
let currentLang = localStorage.getItem("language") || "ar"
let currentTheme = localStorage.getItem("theme") || "light"

async function loadTranslations() {
    try {
        const arResponse = await fetch("translations/ar.json")
        const enResponse = await fetch("translations/en.json")
        translations.ar = await arResponse.json()
        translations.en = await enResponse.json()
    } catch (error) {
        console.error("Error loading translations:", error)
    }
}

function getTranslation(key, lang) {
    const keys = key.split(".")
    let value = translations[lang]
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k]
        } else {
            return key
        }
    }
    return value
}

function updateContent(lang) {
    const elements = document.querySelectorAll("[data-key]")
    elements.forEach((el) => {
        const key = el.getAttribute("data-key")
        const translation = getTranslation(key, lang)
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = translation
        } else {
            el.textContent = translation
        }
    })

    const legacyElements = document.querySelectorAll("[data-ar][data-en]")
    legacyElements.forEach((el) => {
        if (!el.hasAttribute("data-key")) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = el.getAttribute(`data-${lang}`)
            } else {
                el.textContent = el.getAttribute(`data-${lang}`)
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", async() => {
    await loadTranslations()

    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode")
    }

    if (currentLang === "en") {
        switchLanguage("en")
    } else {
        updateContent("ar")
    }

    initCVModal()
})

const themeToggle = document.getElementById("theme-toggle")
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light"
    localStorage.setItem("theme", currentTheme)
})

const langToggle = document.getElementById("lang-toggle")
const langText = document.querySelector(".lang-text")

langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar"
    switchLanguage(currentLang)
    localStorage.setItem("language", currentLang)
})

function switchLanguage(lang) {
    const html = document.documentElement

    if (lang === "en") {
        html.setAttribute("lang", "en")
        html.setAttribute("dir", "ltr")
        langText.textContent = "ع"
    } else {
        html.setAttribute("lang", "ar")
        html.setAttribute("dir", "rtl")
        langText.textContent = "EN"
    }

    updateContent(lang)
}

function initCVModal() {
    const cvModal = document.getElementById("cv-modal")
    const cvIframe = document.getElementById("cv-iframe")
    const viewCvBtn = document.getElementById("view-cv-btn")
    const viewCvHero = document.getElementById("view-cv-hero")
    const closeModal = document.getElementById("cv-modal-close")
    const downloadCv = document.getElementById("download-cv")

    const cvPath = "cv/Shaimaa_Dwedar_CV.pdf"

    const openModal = (e) => {
        e.preventDefault()
        cvModal.classList.add("active")
        cvIframe.src = cvPath
        document.body.style.overflow = "hidden"
    }

    if (viewCvBtn) viewCvBtn.addEventListener("click", openModal)
    if (viewCvHero) viewCvHero.addEventListener("click", openModal)

    const closeModalFunc = () => {
        cvModal.classList.remove("active")
        cvIframe.src = ""
        document.body.style.overflow = "auto"
    }

    if (closeModal) closeModal.addEventListener("click", closeModalFunc)

    cvModal.addEventListener("click", (e) => {
        if (e.target === cvModal) {
            closeModalFunc()
        }
    })

    if (downloadCv) {
        downloadCv.href = cvPath
        downloadCv.download = "Shaimaa_Dwedar_CV.pdf"
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && cvModal.classList.contains("active")) {
            closeModalFunc()
        }
    })
}

const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")

    const spans = navToggle.querySelectorAll("span")
    if (navMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
    } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
    }
})

const navLinks = document.querySelectorAll(".nav-link")
navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        const spans = navToggle.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
    })
})

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
        const href = this.getAttribute("href")
        if (href !== "#" && href.startsWith("#")) {
            e.preventDefault()
            const target = document.querySelector(href)
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        }
    })
})

const nav = document.getElementById("nav")
let lastScroll = 0

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset

    if (currentScroll > 100) {
        nav.classList.add("scrolled")
    } else {
        nav.classList.remove("scrolled")
    }

    lastScroll = currentScroll
})

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
        }
    })
}, observerOptions)

const sections = document.querySelectorAll("section")
sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(30px)"
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(section)
})

const cards = document.querySelectorAll(".project-card, .skill-category, .education-card, .timeline-item")
cards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(card)
})

const contactForm = document.getElementById("contact-form")
contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value

    const successMessage = getTranslation("contact.form.success", currentLang)
        .replace("{name}", name)
        .replace("{email}", email)

    alert(successMessage)

    contactForm.reset()
})

window.addEventListener("scroll", () => {
    let current = ""
    sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id")
        }
    })

    navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active")
        }
    })
})

window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroContent = document.querySelector(".hero-content")
    const heroImage = document.querySelector(".hero-image")

    if (heroContent && heroImage && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`
        heroImage.style.transform = `translateY(${scrolled * 0.2}px)`
    }
})

const skillItems = document.querySelectorAll(".skill-item")
skillItems.forEach((item) => {
    item.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-5px) scale(1.05)"
    })

    item.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0) scale(1)"
    })
})