import arData from "./translations/ar.json"
import enData from "./translations/en.json"

const translations = { ar: arData, en: enData }

// Default language is English (LTR) unless the visitor previously chose otherwise.
let currentLang = localStorage.getItem("language") || "en"
let currentTheme = localStorage.getItem("theme") || "dark"

/* ------------------------------------------------------------------ */
/* Translations                                                        */
/* ------------------------------------------------------------------ */
function getTranslation(key, lang) {
  const keys = key.split(".")
  let value = translations[lang]
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k]
    } else {
      return key
    }
  }
  return value
}

function updateContent(lang) {
  // Simple text nodes
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key")
    const translation = getTranslation(key, lang)
    if (typeof translation !== "string") return
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = translation
    } else {
      el.textContent = translation
    }
  })

  // List blocks (e.g. experience tasks)
  document.querySelectorAll("[data-list]").forEach((ul) => {
    const key = ul.getAttribute("data-list")
    const items = getTranslation(key, lang)
    if (!Array.isArray(items)) return
    ul.innerHTML = ""
    items.forEach((text, i) => {
      const li = document.createElement("li")
      li.textContent = text
      li.style.setProperty("--li-i", i)
      ul.appendChild(li)
    })
  })

  // Document title
  document.title = getTranslation("meta.title", lang)
}

function applyLanguage(lang, animate = false) {
  const html = document.documentElement
  if (lang === "en") {
    html.setAttribute("lang", "en")
    html.setAttribute("dir", "ltr")
    document.querySelector(".lang-text").textContent = "ع"
  } else {
    html.setAttribute("lang", "ar")
    html.setAttribute("dir", "rtl")
    document.querySelector(".lang-text").textContent = "EN"
  }

  if (animate) {
    document.body.classList.add("lang-switching")
    setTimeout(() => {
      updateContent(lang)
      document.body.classList.remove("lang-switching")
    }, 220)
  } else {
    updateContent(lang)
  }
}

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */
function applyTheme(theme) {
  document.body.classList.toggle("light-mode", theme === "light")
}

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme)
  applyLanguage(currentLang)

  initLoader()
  initThemeToggle()
  initLangToggle()
  initNav()
  initSmoothScroll()
  initScrollEffects()
  initReveal()
  initTilt()
  initCursorGlow()
  initHeroParallax()
  initCVModal()
  initContactForm()
})

/* Loader */
function initLoader() {
  const loader = document.getElementById("loader")
  if (!loader) return
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 450)
  })
  // Fallback
  setTimeout(() => loader.classList.add("hidden"), 1600)
}

/* Theme toggle */
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle")
  themeToggle.addEventListener("click", () => {
    currentTheme = document.body.classList.contains("light-mode") ? "dark" : "light"
    applyTheme(currentTheme)
    localStorage.setItem("theme", currentTheme)
  })
}

/* Language toggle */
function initLangToggle() {
  const langToggle = document.getElementById("lang-toggle")
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar"
    applyLanguage(currentLang, true)
    localStorage.setItem("language", currentLang)
  })
}

/* Mobile nav */
function initNav() {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const setBars = (open) => {
    const s = navToggle.querySelectorAll("span")
    if (open) {
      s[0].style.transform = "rotate(45deg) translate(5px, 5px)"
      s[1].style.opacity = "0"
      s[2].style.transform = "rotate(-45deg) translate(6px, -6px)"
    } else {
      s[0].style.transform = "none"
      s[1].style.opacity = "1"
      s[2].style.transform = "none"
    }
  }
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    setBars(navMenu.classList.contains("active"))
  })
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      setBars(false)
    })
  })
}

/* Smooth scroll */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href !== "#" && href.startsWith("#")) {
        const target = document.querySelector(href)
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    })
  })
}

/* Nav scroll state, active link + scroll progress */
function initScrollEffects() {
  const nav = document.getElementById("nav")
  const progress = document.getElementById("scroll-progress")
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  const onScroll = () => {
    const y = window.pageYOffset
    nav.classList.toggle("scrolled", y > 60)

    const h = document.documentElement.scrollHeight - window.innerHeight
    progress.style.width = `${(y / h) * 100}%`

    let current = ""
    sections.forEach((section) => {
      if (y >= section.offsetTop - 220) current = section.getAttribute("id")
    })
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`)
    })
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
}

/* Reveal on scroll with stagger */
function initReveal() {
  const els = document.querySelectorAll(".reveal")
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent group
          const parent = entry.target.parentElement
          const group = parent ? [...parent.querySelectorAll(":scope > .reveal")] : [entry.target]
          const idx = group.indexOf(entry.target)
          entry.target.style.transitionDelay = `${Math.max(0, idx) * 80}ms`
          entry.target.classList.add("in-view")
          obs.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  )
  els.forEach((el) => observer.observe(el))

  // Safety: reveal anything still hidden after a while
  setTimeout(() => els.forEach((el) => el.classList.add("in-view")), 2500)
}

/* 3D tilt for project cards */
function initTilt() {
  const cards = document.querySelectorAll("[data-tilt]")
  const isTouch = window.matchMedia("(hover: none)").matches
  if (isTouch) return
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const rx = (py - 0.5) * -10
      const ry = (px - 0.5) * 12
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`
      card.style.setProperty("--mx", `${px * 100}%`)
      card.style.setProperty("--my", `${py * 100}%`)
    })
    card.addEventListener("mouseleave", () => {
      card.style.transform = ""
    })
  })
}

/* Cursor glow */
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow")
  if (!glow || window.matchMedia("(hover: none)").matches) return
  let raf = null
  window.addEventListener("mousemove", (e) => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      raf = null
    })
  })
}

/* Hero parallax */
function initHeroParallax() {
  const content = document.querySelector(".hero-content")
  const visual = document.querySelector(".hero-visual")
  window.addEventListener(
    "scroll",
    () => {
      const y = window.pageYOffset
      if (y < window.innerHeight && content && visual) {
        content.style.transform = `translateY(${y * 0.18}px)`
        visual.style.transform = `translateY(${y * 0.32}px)`
      }
    },
    { passive: true },
  )
}

/* CV modal */
function initCVModal() {
  const cvModal = document.getElementById("cv-modal")
  const cvIframe = document.getElementById("cv-iframe")
  const viewCvBtn = document.getElementById("view-cv-btn")
  const viewCvHero = document.getElementById("view-cv-hero")
  const closeBtn = document.getElementById("cv-modal-close")
  const downloadCv = document.getElementById("download-cv")
  const cvPath = "/cv/Shaimaa_Dwedar.pdf"

  const open = (e) => {
    e.preventDefault()
    cvModal.classList.add("active")
    cvIframe.src = cvPath
    document.body.style.overflow = "hidden"
  }
  const close = () => {
    cvModal.classList.remove("active")
    cvIframe.src = ""
    document.body.style.overflow = ""
  }

  if (viewCvBtn) viewCvBtn.addEventListener("click", open)
  if (viewCvHero) viewCvHero.addEventListener("click", open)
  if (closeBtn) closeBtn.addEventListener("click", close)
  cvModal.addEventListener("click", (e) => {
    if (e.target === cvModal) close()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cvModal.classList.contains("active")) close()
  })
  if (downloadCv) {
    downloadCv.href = cvPath
    downloadCv.download = "Shaimaa_Dwedar.pdf"
  }
}

/* Contact form -> WhatsApp */
function initContactForm() {
  const form = document.getElementById("contact-form")
  if (!form) return
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value
    const phoneNumber = "972594608763"
    const text = `Hi, I'm ${name}\nEmail: ${email}\nMessage:\n${message}`
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    const successMessage = getTranslation("contact.form.success", currentLang)
      .replace("{name}", name)
      .replace("{email}", email)
    alert(successMessage)
    window.open(whatsappURL, "_blank")
    form.reset()
  })
}
