// Theme Toggle
const themeToggle = document.getElementById("themeToggle")
const body = document.body

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem("theme") || "light"
if (currentTheme === "dark") {
  body.setAttribute("data-theme", "dark")
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
}

themeToggle.addEventListener("click", () => {
  const isDark = body.getAttribute("data-theme") === "dark"

  if (isDark) {
    body.removeAttribute("data-theme")
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    localStorage.setItem("theme", "light")
  } else {
    body.setAttribute("data-theme", "dark")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    localStorage.setItem("theme", "dark")
  }
})

// User state management
let isLoggedIn = false
let currentUser = null

// Check for saved user session
function checkUserSession() {
  const savedUser = localStorage.getItem("currentUser")
  const savedLoginState = localStorage.getItem("isLoggedIn")

  if (savedUser && savedLoginState === "true") {
    isLoggedIn = true
    currentUser = JSON.parse(savedUser)
    updateUIForLoggedInUser()
  } else {
    updateUIForGuestUser()
  }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  const dropdownUserName = document.getElementById("dropdownUserName")
  const dropdownUserHandle = document.getElementById("dropdownUserHandle")
  const dropdownAvatar = document.querySelector(".dropdown-avatar")
  const composerAvatar = document.getElementById("composerAvatar")
  const profileNavText = document.getElementById("profileNavText")

  // Update avatars and user info
  if (currentUser) {
    dropdownAvatar.src = currentUser.avatar
    if (composerAvatar) composerAvatar.src = currentUser.avatar
    dropdownUserName.textContent = currentUser.name
    dropdownUserHandle.textContent = `@${currentUser.username}`
    profileNavText.textContent = currentUser.name
  }

  // Show/hide menu items for logged in user
  document.getElementById("profileMenuItem").classList.remove("hidden")
  document.getElementById("settingsMenuItem").classList.remove("hidden")
  document.getElementById("logoutDivider").classList.remove("hidden")
  document.getElementById("logoutMenuItem").classList.remove("hidden")
  document.getElementById("loginMenuItem").classList.add("hidden")
}

// Update UI for guest user
function updateUIForGuestUser() {
  const dropdownUserName = document.getElementById("dropdownUserName")
  const dropdownUserHandle = document.getElementById("dropdownUserHandle")
  const dropdownAvatar = document.querySelector(".dropdown-avatar")
  const composerAvatar = document.getElementById("composerAvatar")
  const profileNavText = document.getElementById("profileNavText")

  // Reset to default
  dropdownAvatar.src = "/placeholder.svg?height=40&width=40"
  if (composerAvatar) composerAvatar.src = "/placeholder.svg?height=40&width=40"
  dropdownUserName.textContent = "Visitante"
  dropdownUserHandle.textContent = "@visitante"
  profileNavText.textContent = "Perfil"

  // Show/hide menu items for guest user
  document.getElementById("profileMenuItem").classList.add("hidden")
  document.getElementById("settingsMenuItem").classList.add("hidden")
  document.getElementById("logoutDivider").classList.add("hidden")
  document.getElementById("logoutMenuItem").classList.add("hidden")
  document.getElementById("loginMenuItem").classList.remove("hidden")
}

// Custom Toast Notification System
class ToastManager {
  constructor() {
    this.container = this.createContainer()
    this.toasts = new Map()
    this.toastId = 0
  }

  createContainer() {
    let container = document.getElementById("toast-container")
    if (!container) {
      container = document.createElement("div")
      container.id = "toast-container"
      container.className = "toast-container"
      document.body.appendChild(container)
    }
    return container
  }

  show(message, type = "info", duration = 5000) {
    const id = ++this.toastId
    const toast = this.createToast(message, type, id)

    this.container.appendChild(toast)
    this.toasts.set(id, toast)

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show")
    })

    // Auto remove
    if (duration > 0) {
      const progressBar = toast.querySelector(".toast-progress")
      if (progressBar) {
        progressBar.style.width = "100%"
        progressBar.style.transitionDuration = `${duration}ms`

        setTimeout(() => {
          progressBar.style.width = "0%"
        }, 50)
      }

      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  }

  createToast(message, type, id) {
    const toast = document.createElement("div")
    toast.className = `toast ${type}`
    toast.dataset.toastId = id

    const icons = {
      success: "fas fa-check",
      error: "fas fa-times",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    }

    const titles = {
      success: "Sucesso",
      error: "Erro",
      warning: "Atenção",
      info: "Informação",
    }

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="${icons[type] || icons.info}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${titles[type] || titles.info}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="toastManager.remove(${id})">
        <i class="fas fa-times"></i>
      </button>
      <div class="toast-progress"></div>
    `

    return toast
  }

  remove(id) {
    const toast = this.toasts.get(id)
    if (toast) {
      toast.classList.add("hide")
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
        this.toasts.delete(id)
      }, 400)
    }
  }

  clear() {
    this.toasts.forEach((toast, id) => {
      this.remove(id)
    })
  }
}

// Initialize toast manager
const toastManager = new ToastManager()

// Replace the old showNotification function
function showNotification(message, type = "info") {
  toastManager.show(message, type)
}

// Navigation system
function navigateToPage(page) {
  showLoading()

  setTimeout(() => {
    switch (page) {
      case "home":
        window.location.href = "index.html"
        break
      case "explore":
        openSearchModal()
        break
      case "notifications":
        openNotificationsPage()
        break
      case "messages":
        openMessagesModal()
        break
      case "games":
        window.location.href = "jogos.html"
        break
      case "settings":
        showNotification("Página de Configurações em desenvolvimento!", "info")
        break
      default:
        showNotification("Página não encontrada!", "error")
    }
    hideLoading()
  }, 300)
}

// Search Modal functionality
function openSearchModal() {
  const searchModal = document.getElementById("searchModal")
  const searchInput = document.getElementById("searchInput")

  if (searchModal) {
    searchModal.classList.add("active")
    setTimeout(() => searchInput?.focus(), 300)
  }
}

function closeSearchModal() {
  const searchModal = document.getElementById("searchModal")
  const searchInput = document.getElementById("searchInput")
  const searchResults = document.getElementById("searchResults")

  if (searchModal) {
    searchModal.classList.remove("active")
    if (searchInput) searchInput.value = ""
    if (searchResults) searchResults.innerHTML = ""
  }
}

// Notifications functionality
function openNotificationsPage() {
  const notificationsPage = document.getElementById("notificationsPage")
  if (notificationsPage) {
    notificationsPage.classList.add("active")
    updateNotificationBadge(0)
  }
}

function closeNotificationsPage() {
  const notificationsPage = document.getElementById("notificationsPage")
  if (notificationsPage) {
    notificationsPage.classList.remove("active")
  }
}

function updateNotificationBadge(count) {
  const notificationBadge = document.getElementById("notificationBadge")
  if (notificationBadge) {
    if (count > 0) {
      notificationBadge.textContent = count
      notificationBadge.style.display = "flex"
    } else {
      notificationBadge.style.display = "none"
    }
  }
}

// Messages Modal functionality
function openMessagesModal() {
  const messagesModal = document.getElementById("messagesModal")
  if (messagesModal) {
    messagesModal.classList.add("active")
  }
}

function closeMessagesModal() {
  const messagesModal = document.getElementById("messagesModal")
  if (messagesModal) {
    messagesModal.classList.remove("active")
  }
}

// Profile Auth Modal functionality
function openProfileAuthModal() {
  const profileAuthModal = document.getElementById("profileAuthModal")
  if (profileAuthModal) {
    profileAuthModal.classList.add("active")
  }
}

function closeProfileAuthModal() {
  const profileAuthModal = document.getElementById("profileAuthModal")
  if (profileAuthModal) {
    profileAuthModal.classList.remove("active")
  }
}

// Loading overlay functions
function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay")
  if (loadingOverlay) {
    loadingOverlay.classList.add("active")
  }
}

function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay")
  if (loadingOverlay) {
    loadingOverlay.classList.remove("active")
  }
}

// Logout functionality
function logout() {
  isLoggedIn = false
  currentUser = null
  localStorage.removeItem("currentUser")
  localStorage.removeItem("isLoggedIn")

  updateUIForGuestUser()
  showNotification("Você saiu da sua conta com sucesso!", "success")
}

// Post interactions
function handlePostAction(button, action) {
  if (!isLoggedIn && (action === "like" || action === "comment" || action === "share")) {
    showNotification("Você precisa estar logado para interagir com posts!", "error")
    return
  }

  const countSpan = button.querySelector("span")
  const icon = button.querySelector("i")

  if (action === "like") {
    const currentCount = Number.parseInt(countSpan.textContent)

    if (button.classList.contains("liked")) {
      button.classList.remove("liked")
      icon.className = "far fa-heart"
      countSpan.textContent = currentCount - 1
    } else {
      button.classList.add("liked")
      icon.className = "fas fa-heart"
      countSpan.textContent = currentCount + 1
    }
  } else if (action === "share") {
    showNotification("Post compartilhado!", "success")
  }
}

// Game interactions
function handleGameAction(button, action, gameId) {
  if (!isLoggedIn && (action === "join" || action === "waitlist")) {
    showNotification("Você precisa estar logado para participar de jogos!", "error")
    openProfileAuthModal()
    return
  }

  if (action === "join") {
    button.innerHTML = '<i class="fas fa-check"></i> Inscrita'
    button.classList.remove("primary")
    button.classList.add("joined")
    showNotification("Você se inscreveu no jogo!", "success")
  } else if (action === "waitlist") {
    showNotification("Você foi adicionada à lista de espera!", "info")
  } else if (action === "share") {
    showNotification("Link do jogo copiado!", "info")
  }
}

// Post creation
function createPost() {
  const postInput = document.getElementById("postInput")
  const content = postInput?.value.trim()

  if (!content) return

  if (!isLoggedIn) {
    showNotification("Você precisa estar logado para publicar!", "error")
    return
  }

  showNotification("Post publicado com sucesso!", "success")
  postInput.value = ""
}

// Notifications tab functionality
function switchNotificationTab(tabType) {
  const tabs = document.querySelectorAll(".notification-tab")
  const items = document.querySelectorAll(".notification-item")

  tabs.forEach((tab) => tab.classList.remove("active"))
  document.querySelector(`[data-tab="${tabType}"]`)?.classList.add("active")

  items.forEach((item) => {
    const itemType = item.getAttribute("data-type")

    if (tabType === "all") {
      item.style.display = "flex"
    } else if (tabType === "mentions" && itemType === "mention") {
      item.style.display = "flex"
    } else if (tabType === "likes" && itemType === "like") {
      item.style.display = "flex"
    } else if (tabType === "follows" && itemType === "follow") {
      item.style.display = "flex"
    } else {
      item.style.display = "none"
    }
  })
}

// Messages conversation switching
function switchConversation(conversationElement) {
  const conversations = document.querySelectorAll(".conversation-item")
  conversations.forEach((conv) => conv.classList.remove("active"))
  conversationElement.classList.add("active")

  const avatar = conversationElement.querySelector(".conversation-avatar").src
  const name = conversationElement.querySelector(".conversation-name").textContent
  const isOnline = Math.random() > 0.5

  const chatAvatar = document.querySelector(".chat-avatar")
  const chatName = document.querySelector(".chat-name")
  const chatStatus = document.querySelector(".chat-status")

  if (chatAvatar) chatAvatar.src = avatar
  if (chatName) chatName.textContent = name
  if (chatStatus) chatStatus.textContent = isOnline ? "Online" : "Offline"

  loadConversationMessages(name)

  const unreadBadge = conversationElement.querySelector(".unread-badge")
  if (unreadBadge) {
    unreadBadge.remove()
    updateMessageBadge()
  }
}

function loadConversationMessages(contactName) {
  const chatMessages = document.getElementById("chatMessages")
  if (!chatMessages) return

  const messageTemplates = {
    "Marta Vieira": [
      { type: "received", text: "Oi! Vi seu post sobre o jogo de ontem", time: "14:30" },
      { type: "sent", text: "Oi Marta! Que jogo incrível mesmo! 🔥", time: "14:32" },
      { type: "received", text: "Obrigada pelo apoio! ⚽️", time: "14:35" },
      { type: "received", text: "O futebol feminino está crescendo muito!", time: "14:35" },
    ],
    Formiga: [
      { type: "received", text: "Vamos marcar aquele treino?", time: "13:20" },
      { type: "sent", text: "Claro! Que tal amanhã às 16h?", time: "13:25" },
      { type: "received", text: "Perfeito! Te vejo lá 💪", time: "13:26" },
    ],
    Passaabola: [
      { type: "received", text: "Nova matéria sobre o Brasileirão", time: "12:15" },
      { type: "received", text: "Gostaria de dar uma entrevista?", time: "12:16" },
      { type: "sent", text: "Seria uma honra! Quando podemos conversar?", time: "12:20" },
    ],
    "Gabi Portilho": [
      { type: "received", text: "Que jogo incrível hoje!", time: "11:30" },
      { type: "sent", text: "Você jogou muito bem! Parabéns! 👏", time: "11:35" },
      { type: "received", text: "Obrigada! Vamos treinar juntas em breve?", time: "11:40" },
    ],
  }

  const messages = messageTemplates[contactName] || [
    { type: "received", text: "Olá! Como você está?", time: "10:00" },
    { type: "sent", text: "Oi! Estou bem, e você?", time: "10:05" },
  ]

  chatMessages.innerHTML = ""

  messages.forEach((msg) => {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${msg.type}`

    if (msg.type === "received") {
      const avatar =
        document.querySelector(".conversation-item.active .conversation-avatar")?.src ||
        "/placeholder.svg?height=24&width=24"
      messageDiv.innerHTML = `
        <img src="${avatar}" alt="${contactName}" class="message-avatar">
        <div class="message-content">
          <p>${msg.text}</p>
          <span class="message-time">${msg.time}</span>
        </div>
      `
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${msg.text}</p>
          <span class="message-time">${msg.time}</span>
        </div>
      `
    }

    chatMessages.appendChild(messageDiv)
  })

  chatMessages.scrollTop = chatMessages.scrollHeight
}

function updateMessageBadge() {
  const unreadBadges = document.querySelectorAll(".unread-badge")
  const messageBadge = document.getElementById("messageBadge")

  if (messageBadge) {
    const totalUnread = unreadBadges.length
    if (totalUnread > 0) {
      messageBadge.textContent = totalUnread
      messageBadge.style.display = "flex"
    } else {
      messageBadge.style.display = "none"
    }
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Check user session on page load
  checkUserSession()

  // Navigation links (excluding profile)
  const navLinks = document.querySelectorAll(".nav-link:not([data-page='profile'])")
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const page = link.getAttribute("data-page")

      // Update active state
      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      // Navigate to page
      navigateToPage(page)
    })
  })

  // Profile dropdown functionality - CORRIGIDO
  const profileNavLink = document.getElementById("profileNavLink")
  const profileDropdown = document.getElementById("profileDropdown")

  if (profileNavLink && profileDropdown) {
    profileNavLink.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      // Sempre mostra/esconde o dropdown ao clicar no perfil
      profileDropdown.classList.toggle("active")
    })
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (profileDropdown && !profileDropdown.contains(e.target) && !profileNavLink?.contains(e.target)) {
      profileDropdown.classList.remove("active")
    }
  })

  // Dropdown menu items - CORRIGIDO
  const profileMenuItem = document.getElementById("profileMenuItem")
  const loginMenuItem = document.getElementById("loginMenuItem")
  const settingsMenuItem = document.getElementById("settingsMenuItem")
  const logoutMenuItem = document.getElementById("logoutMenuItem")

  if (profileMenuItem) {
    profileMenuItem.addEventListener("click", (e) => {
      e.preventDefault()
      profileDropdown?.classList.remove("active")
      // Redireciona para página do perfil quando logado
      window.location.href = "perfil.html"
    })
  }

  if (loginMenuItem) {
    loginMenuItem.addEventListener("click", (e) => {
      e.preventDefault()
      profileDropdown?.classList.remove("active")
      // Abre modal de autenticação quando deslogado
      openProfileAuthModal()
    })
  }

  if (settingsMenuItem) {
    settingsMenuItem.addEventListener("click", (e) => {
      e.preventDefault()
      profileDropdown?.classList.remove("active")
      navigateToPage("settings")
    })
  }

  if (logoutMenuItem) {
    logoutMenuItem.addEventListener("click", (e) => {
      e.preventDefault()
      profileDropdown?.classList.remove("active")
      logout()
    })
  }

  // Logo click - go to home
  const logo = document.querySelector(".logo")
  if (logo) {
    logo.addEventListener("click", () => {
      navigateToPage("home")
    })
  }

  // Modal close buttons
  const searchClose = document.getElementById("searchClose")
  const messagesClose = document.getElementById("messagesClose")
  const authModalClose = document.getElementById("authModalClose")

  if (searchClose) {
    searchClose.addEventListener("click", closeSearchModal)
  }

  if (messagesClose) {
    messagesClose.addEventListener("click", closeMessagesModal)
  }

  if (authModalClose) {
    authModalClose.addEventListener("click", closeProfileAuthModal)
  }

  // Modal background clicks
  const searchModal = document.getElementById("searchModal")
  const messagesModal = document.getElementById("messagesModal")
  const profileAuthModal = document.getElementById("profileAuthModal")

  if (searchModal) {
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) closeSearchModal()
    })
  }

  if (messagesModal) {
    messagesModal.addEventListener("click", (e) => {
      if (e.target === messagesModal) closeMessagesModal()
    })
  }

  if (profileAuthModal) {
    profileAuthModal.addEventListener("click", (e) => {
      if (e.target === profileAuthModal) closeProfileAuthModal()
    })
  }

  // Auth tabs functionality
  const authTabs = document.querySelectorAll(".auth-tab")
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      const tabType = tab.getAttribute("data-tab")
      if (tabType === "login") {
        loginForm?.classList.remove("hidden")
        registerForm?.classList.add("hidden")
      } else {
        loginForm?.classList.add("hidden")
        registerForm?.classList.remove("hidden")
      }
    })
  })

  // Form submissions
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const userData = {
        name: "Maria Silva",
        username: "maria_futfem",
        posts: 23,
        following: 156,
        followers: 89,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      isLoggedIn = true
      currentUser = userData
      localStorage.setItem("currentUser", JSON.stringify(userData))
      localStorage.setItem("isLoggedIn", "true")

      updateUIForLoggedInUser()
      closeProfileAuthModal()
      showNotification("Login realizado com sucesso! Bem-vinda!", "success")
    })
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const userData = {
        name: formData.get("name") || "Nova Usuária",
        username: formData.get("username") || "nova_usuario",
        posts: 0,
        following: 0,
        followers: 0,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      isLoggedIn = true
      currentUser = userData
      localStorage.setItem("currentUser", JSON.stringify(userData))
      localStorage.setItem("isLoggedIn", "true")

      updateUIForLoggedInUser()
      closeProfileAuthModal()
      showNotification("Conta criada com sucesso! Bem-vinda ao FutFem Social!", "success")
    })
  }

  // Post actions
  const postActions = document.querySelectorAll(".post-action")
  postActions.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action")
      handlePostAction(button, action)
    })
  })

  // Post creation
  const postBtn = document.getElementById("postBtn")
  if (postBtn) {
    postBtn.addEventListener("click", createPost)
  }

  // Auto-resize textarea
  const postInput = document.getElementById("postInput")
  if (postInput) {
    postInput.addEventListener("input", function () {
      this.style.height = "auto"
      this.style.height = this.scrollHeight + "px"
    })
  }

  // Game notifications
  const gameNotifyButtons = document.querySelectorAll(".game-notify")
  gameNotifyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!isLoggedIn) {
        showNotification("Você precisa estar logado para receber notificações!", "error")
        return
      }

      if (button.classList.contains("notified")) {
        button.innerHTML = '<i class="fas fa-bell"></i> Notificar-me'
        button.classList.remove("notified")
        showNotification("Notificação removida!", "info")
      } else {
        button.innerHTML = '<i class="fas fa-bell-slash"></i> Notificação ativa'
        button.classList.add("notified")
        showNotification("Você será notificado sobre este jogo!", "success")
      }
    })
  })

  // Notifications functionality
  const notificationsBackBtn = document.getElementById("notificationsBackBtn")
  const markAllReadBtn = document.getElementById("markAllReadBtn")

  if (notificationsBackBtn) {
    notificationsBackBtn.addEventListener("click", closeNotificationsPage)
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", () => {
      const unreadItems = document.querySelectorAll(".notification-item.unread")
      unreadItems.forEach((item) => {
        item.classList.remove("unread")
        const dot = item.querySelector(".notification-dot")
        if (dot) dot.remove()
      })
      showNotification("Todas as notificações foram marcadas como lidas", "success")
    })
  }

  // Notification tabs
  const notificationTabs = document.querySelectorAll(".notification-tab")
  notificationTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabType = tab.getAttribute("data-tab")
      switchNotificationTab(tabType)
    })
  })

  // Follow back buttons
  const followBackBtns = document.querySelectorAll(".follow-back-btn")
  followBackBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      if (btn.classList.contains("following")) {
        btn.textContent = "Seguir de volta"
        btn.classList.remove("following")
      } else {
        btn.textContent = "Seguindo"
        btn.classList.add("following")
      }
    })
  })

  // Conversation switching
  const conversationItems = document.querySelectorAll(".conversation-item")
  conversationItems.forEach((item) => {
    item.addEventListener("click", () => {
      switchConversation(item)
    })
  })

  // Initialize first conversation
  const firstConversation = document.querySelector(".conversation-item.active")
  if (firstConversation) {
    loadConversationMessages(firstConversation.querySelector(".conversation-name").textContent)
  }

  // Update message badge on load
  updateMessageBadge()
})

// Expose functions for external use
window.FutFemSocial = {
  logout,
  showNotification,
  navigateToPage,
  checkUserSession,
  isLoggedIn: () => isLoggedIn,
  getCurrentUser: () => currentUser,
  toastManager,
}
