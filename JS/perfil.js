let currentTheme = localStorage.getItem("theme") || "light"
document.documentElement.setAttribute("data-theme", currentTheme)

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light"
  document.documentElement.setAttribute("data-theme", currentTheme)
  localStorage.setItem("theme", currentTheme)

  const themeToggle = document.getElementById("themeToggle")
  const icon = themeToggle.querySelector("i")

  if (currentTheme === "dark") {
    icon.className = "fas fa-sun"
    themeToggle.setAttribute("title", "Modo claro")
  } else {
    icon.className = "fas fa-moon"
    themeToggle.setAttribute("title", "Modo escuro")
  }

  // Add smooth transition effect
  document.body.style.transition = "all 0.3s ease"
  setTimeout(() => {
    document.body.style.transition = ""
  }, 300)
}

function hideLoadingScreen() {
  const loadingOverlay = document.getElementById("loadingOverlay")
  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.classList.add("hidden")
    }, 1000)
  }
}

function initializeNavigation() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        // Remove active class from all links
        document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
        // Add active class to clicked link
        this.classList.add("active")

        // Smooth scroll to target
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

function animateCounter(element, target, duration = 2000) {
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 16)
}

function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animate statistics when they come into view
        if (entry.target.classList.contains("stats-section")) {
          const statNumbers = entry.target.querySelectorAll(".stat-content h3")
          statNumbers.forEach((stat) => {
            const target = Number.parseInt(stat.textContent)
            if (!isNaN(target)) {
              animateCounter(stat, target)
            }
          })
        }

        // Add animation class to sections
        entry.target.classList.add("animate-in")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe all sections
  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section)
  })
}

function initializeLevelSystem() {
  // Animate XP bar
  const xpProgress = document.querySelector(".xp-progress")
  if (xpProgress) {
    setTimeout(() => {
      xpProgress.style.width = "75%"
    }, 500)
  }

  // Add hover effects to milestones
  document.querySelectorAll(".milestone").forEach((milestone) => {
    milestone.addEventListener("mouseenter", () => {
      if (!milestone.classList.contains("locked")) {
        milestone.style.transform = "translateY(-5px) scale(1.02)"
      }
    })

    milestone.addEventListener("mouseleave", () => {
      milestone.style.transform = "translateY(0) scale(1)"
    })
  })

  // Add click effects to rewards
  document.querySelectorAll(".reward-item.unlocked").forEach((reward) => {
    reward.addEventListener("click", () => {
      reward.style.transform = "scale(0.95)"
      setTimeout(() => {
        reward.style.transform = "scale(1)"
      }, 150)
    })
  })
}

function initializeStatsFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
      // Add active class to clicked button
      this.classList.add("active")

      // Add animation to stats cards
      document.querySelectorAll(".stat-card").forEach((card, index) => {
        card.style.opacity = "0"
        card.style.transform = "translateY(20px)"

        setTimeout(() => {
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        }, index * 100)
      })
    })
  })
}

function initializeMediaGallery() {
  document.querySelectorAll(".media-image").forEach((image) => {
    image.addEventListener("click", () => {
      createLightbox(image.src, image.alt)
    })
  })

  // Video play button functionality
  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...'
      setTimeout(() => {
        btn.innerHTML = "▶ Assistir"
        alert("Funcionalidade de vídeo em desenvolvimento!")
      }, 1000)
    })
  })
}

function createLightbox(src, alt) {
  const lightbox = document.createElement("div")
  lightbox.className = "lightbox"
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="${src}" alt="${alt}">
      <button class="lightbox-close">&times;</button>
    </div>
  `

  // Add lightbox styles
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `

  const content = lightbox.querySelector(".lightbox-content")
  content.style.cssText = `
    position: relative;
    max-width: 90%;
    max-height: 90%;
  `

  const img = lightbox.querySelector("img")
  img.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
  `

  const closeBtn = lightbox.querySelector(".lightbox-close")
  closeBtn.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
  `

  document.body.appendChild(lightbox)

  // Animate in
  setTimeout(() => {
    lightbox.style.opacity = "1"
  }, 10)

  // Close functionality
  const closeLightbox = () => {
    lightbox.style.opacity = "0"
    setTimeout(() => {
      document.body.removeChild(lightbox)
    }, 300)
  }

  closeBtn.addEventListener("click", closeLightbox)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Close with Escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeLightbox()
      document.removeEventListener("keydown", handleEscape)
    }
  }
  document.addEventListener("keydown", handleEscape)
}

function initializeScrollEffects() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const header = document.querySelector(".header")

    if (scrolled > 100) {
      header.style.background = "rgba(248, 250, 252, 0.95)"
      header.style.backdropFilter = "blur(20px)"
    } else {
      header.style.background = "var(--bg-cards)"
      header.style.backdropFilter = "blur(10px)"
    }

    // Update active navigation based on scroll position
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-link")

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect()
      if (rect.top <= 100 && rect.bottom >= 100) {
        navLinks.forEach((link) => link.classList.remove("active"))
        if (navLinks[index]) {
          navLinks[index].classList.add("active")
        }
      }
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    const icon = themeToggle.querySelector("i")
    if (currentTheme === "dark") {
      icon.className = "fas fa-sun"
      themeToggle.setAttribute("title", "Modo claro")
    } else {
      icon.className = "fas fa-moon"
      themeToggle.setAttribute("title", "Modo escuro")
    }
    themeToggle.addEventListener("click", toggleTheme)
  }

  // Initialize all components
  hideLoadingScreen()
  initializeNavigation()
  initializeAnimations()
  initializeLevelSystem()
  initializeStatsFilters()
  initializeMediaGallery()
  initializeScrollEffects()

  console.log("Perfil da atleta initialized successfully!")
})

const additionalStyles = `
  .animate-in {
    animation: slideInUp 0.8s ease forwards;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .stat-card {
    transition: all 0.3s ease;
  }
  
  .milestone {
    transition: all 0.3s ease;
  }
  
  .reward-item {
    transition: all 0.3s ease;
  }
`

// Inject additional styles
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)
