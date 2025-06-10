// Games page functionality
document.addEventListener("DOMContentLoaded", () => {
    // Initialize theme
    const currentTheme = localStorage.getItem("theme") || "light"
    if (currentTheme === "dark") {
      document.body.setAttribute("data-theme", "dark")
      const themeToggle = document.getElementById("themeToggle")
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }
  
    // Theme toggle
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = document.body.getAttribute("data-theme") === "dark"
  
        if (isDark) {
          document.body.removeAttribute("data-theme")
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
          localStorage.setItem("theme", "light")
        } else {
          document.body.setAttribute("data-theme", "dark")
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
          localStorage.setItem("theme", "dark")
        }
      })
    }
  
    // Check user session
    let isLoggedIn = false
    let currentUser = null
  
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
  
    function updateUIForLoggedInUser() {
      const dropdownUserName = document.getElementById("dropdownUserName")
      const dropdownUserHandle = document.getElementById("dropdownUserHandle")
      const dropdownAvatar = document.querySelector(".dropdown-avatar")
      const profileNavText = document.getElementById("profileNavText")
  
      if (currentUser) {
        if (dropdownAvatar) dropdownAvatar.src = currentUser.avatar
        if (dropdownUserName) dropdownUserName.textContent = currentUser.name
        if (dropdownUserHandle) dropdownUserHandle.textContent = `@${currentUser.username}`
        if (profileNavText) profileNavText.textContent = currentUser.name
      }
  
      // Show/hide menu items
      const profileMenuItem = document.getElementById("profileMenuItem")
      const settingsMenuItem = document.getElementById("settingsMenuItem")
      const logoutDivider = document.getElementById("logoutDivider")
      const logoutMenuItem = document.getElementById("logoutMenuItem")
      const loginMenuItem = document.getElementById("loginMenuItem")
  
      if (profileMenuItem) profileMenuItem.classList.remove("hidden")
      if (settingsMenuItem) settingsMenuItem.classList.remove("hidden")
      if (logoutDivider) logoutDivider.classList.remove("hidden")
      if (logoutMenuItem) logoutMenuItem.classList.remove("hidden")
      if (loginMenuItem) loginMenuItem.classList.add("hidden")
    }
  
    function updateUIForGuestUser() {
      const dropdownUserName = document.getElementById("dropdownUserName")
      const dropdownUserHandle = document.getElementById("dropdownUserHandle")
      const dropdownAvatar = document.querySelector(".dropdown-avatar")
      const profileNavText = document.getElementById("profileNavText")
  
      if (dropdownAvatar) dropdownAvatar.src = "/placeholder.svg?height=40&width=40"
      if (dropdownUserName) dropdownUserName.textContent = "Visitante"
      if (dropdownUserHandle) dropdownUserHandle.textContent = "@visitante"
      if (profileNavText) profileNavText.textContent = "Perfil"
  
      // Show/hide menu items
      const profileMenuItem = document.getElementById("profileMenuItem")
      const settingsMenuItem = document.getElementById("settingsMenuItem")
      const logoutDivider = document.getElementById("logoutDivider")
      const logoutMenuItem = document.getElementById("logoutMenuItem")
      const loginMenuItem = document.getElementById("loginMenuItem")
  
      if (profileMenuItem) profileMenuItem.classList.add("hidden")
      if (settingsMenuItem) settingsMenuItem.classList.add("hidden")
      if (logoutDivider) logoutDivider.classList.add("hidden")
      if (logoutMenuItem) logoutMenuItem.classList.add("hidden")
      if (loginMenuItem) loginMenuItem.classList.remove("hidden")
    }
  
    // Check user session on page load
    checkUserSession()
  
    // Simple notification system
    function showNotification(message, type = "info") {
      const alertClass = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"
      alert(`${alertClass} ${message}`)
    }
  
    // Navigation system
    function navigateToPage(page) {
      const loadingOverlay = document.getElementById("loadingOverlay")
      if (loadingOverlay) loadingOverlay.classList.add("active")
  
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
        if (loadingOverlay) loadingOverlay.classList.remove("active")
      }, 300)
    }
  
    function openSearchModal() {
      const searchModal = document.getElementById("searchModal")
      if (searchModal) searchModal.classList.add("active")
    }
  
    function openNotificationsPage() {
      const notificationsPage = document.getElementById("notificationsPage")
      if (notificationsPage) {
        notificationsPage.classList.add("active")
      }
    }
  
    function closeNotificationsPage() {
      const notificationsPage = document.getElementById("notificationsPage")
      if (notificationsPage) {
        notificationsPage.classList.remove("active")
      }
    }
  
    function openMessagesModal() {
      const messagesModal = document.getElementById("messagesModal")
      if (messagesModal) messagesModal.classList.add("active")
    }
  
    function openProfileAuthModal() {
      const profileAuthModal = document.getElementById("profileAuthModal")
      if (profileAuthModal) profileAuthModal.classList.add("active")
    }
  
    function closeProfileAuthModal() {
      const profileAuthModal = document.getElementById("profileAuthModal")
      if (profileAuthModal) profileAuthModal.classList.remove("active")
    }
  
    function logout() {
      isLoggedIn = false
      currentUser = null
      localStorage.removeItem("currentUser")
      localStorage.removeItem("isLoggedIn")
      updateUIForGuestUser()
      showNotification("Você saiu da sua conta com sucesso!", "success")
    }
  
    // Navbar functionality (excluding profile)
    const navLinks = document.querySelectorAll(".nav-link:not([data-page='profile'])")
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const page = link.getAttribute("data-page")
  
        navLinks.forEach((l) => l.classList.remove("active"))
        link.classList.add("active")
  
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
    const dropdownItems = [
      { id: "profileMenuItem", action: () => (window.location.href = "perfil.html") },
      { id: "loginMenuItem", action: () => (window.location.href = "cadastro.html") },
      { id: "settingsMenuItem", action: () => navigateToPage("settings") },
    ]
  
    dropdownItems.forEach(({ id, action }) => {
      const item = document.getElementById(id)
      if (item) {
        item.addEventListener("click", (e) => {
          e.preventDefault()
          if (profileDropdown) profileDropdown.classList.remove("active")
          action()
        })
      }
    })
  
    const logoutMenuItem = document.getElementById("logoutMenuItem")
    if (logoutMenuItem) {
      logoutMenuItem.addEventListener("click", (e) => {
        e.preventDefault()
        if (profileDropdown) profileDropdown.classList.remove("active")
        logout()
      })
    }
  
    // Logo click
    const logo = document.querySelector(".logo")
    if (logo) {
      logo.addEventListener("click", () => navigateToPage("home"))
    }
  
    // Filter functionality
    const filterTabs = document.querySelectorAll(".filter-tab")
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        filterTabs.forEach((t) => t.classList.remove("active"))
        tab.classList.add("active")
  
        const filter = tab.dataset.filter
        filterGames(filter)
      })
    })
  
    function filterGames(filter) {
      const gameCards = document.querySelectorAll(".game-card")
      const noGamesMessage = document.querySelector(".no-games-message")
      let visibleCount = 0
  
      gameCards.forEach((card) => {
        let shouldShow = true
  
        switch (filter) {
          case "today":
            const todayText = card.querySelector(".game-info-item span").textContent
            shouldShow = todayText.includes("Hoje")
            break
          case "week":
            shouldShow = true // For demo, show all
            break
          case "my-games":
            if (!isLoggedIn) {
              showNotification("Você precisa estar logado para ver seus jogos!", "error")
              filterTabs[0].click() // Reset to "All" tab
              return
            }
            shouldShow = false // For demo, show none
            break
          default:
            shouldShow = true
        }
  
        if (shouldShow) {
          card.classList.remove("hidden")
          visibleCount++
        } else {
          card.classList.add("hidden")
        }
      })
  
      if (noGamesMessage) {
        if (visibleCount === 0) {
          noGamesMessage.classList.remove("hidden")
        } else {
          noGamesMessage.classList.add("hidden")
        }
      }
    }
  
    // Game actions
    const gameActions = document.querySelectorAll("[data-action]")
    gameActions.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation()
        const action = button.getAttribute("data-action")
        const gameCard = button.closest(".game-card")
        const gameId = gameCard?.getAttribute("data-game-id")
  
        if (action === "join" || action === "waitlist") {
          if (!isLoggedIn) {
            showNotification("Você precisa estar logado para participar de jogos!", "error")
            openProfileAuthModal()
            return
          }
  
          if (action === "join") {
            button.innerHTML = '<i class="fas fa-check"></i> Inscrita'
            button.classList.remove("primary")
            button.classList.add("joined")
            showNotification("Você se inscreveu no jogo!", "success")
          } else {
            showNotification("Você foi adicionada à lista de espera!", "info")
          }
        } else if (action === "share") {
          showNotification("Link do jogo copiado!", "info")
        }
      })
    })
  
    // Create game modal - TOTALMENTE CORRIGIDO
    const createGameBtn = document.getElementById("createGameBtn")
    const createGameModal = document.getElementById("createGameModal")
    const closeCreateGameModal = document.getElementById("closeCreateGameModal")
    const cancelCreateGame = document.getElementById("cancelCreateGame")

    console.log("Inicializando botão Criar Jogo...") // Debug

    if (createGameBtn) {
      console.log("Botão Criar Jogo encontrado") // Debug

      createGameBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        console.log("Botão Criar Jogo clicado!") // Debug
        console.log("Status de login:", isLoggedIn) // Debug

        if (!isLoggedIn) {
          console.log("Usuário não logado, abrindo modal de login") // Debug
          showNotification("Você precisa estar logado para criar um jogo!", "error")
          openProfileAuthModal()
          return
        }

        console.log("Usuário logado, abrindo modal de criar jogo") // Debug
        if (createGameModal) {
          createGameModal.classList.add("active")
          console.log("Modal de criar jogo ativado") // Debug
        } else {
          console.log("Modal de criar jogo não encontrado!") // Debug
        }
      })
    } else {
      console.log("Botão Criar Jogo NÃO encontrado!") // Debug
    }

    if (closeCreateGameModal) {
      closeCreateGameModal.addEventListener("click", (e) => {
        e.preventDefault()
        if (createGameModal) {
          createGameModal.classList.remove("active")
        }
      })
    }

    if (cancelCreateGame) {
      cancelCreateGame.addEventListener("click", (e) => {
        e.preventDefault()
        if (createGameModal) {
          createGameModal.classList.remove("active")
        }
      })
    }
  
    // Create game form
    const createGameForm = document.getElementById("createGameForm")
    if (createGameForm) {
      createGameForm.addEventListener("submit", (e) => {
        e.preventDefault()
        showNotification("Jogo criado com sucesso!", "success")
        if (createGameModal) createGameModal.classList.remove("active")
      })
    }
  
    // Modal close functionality
    const modals = [
      { modal: "searchModal", close: "searchClose" },
      { modal: "messagesModal", close: "messagesClose" },
      { modal: "profileAuthModal", close: "authModalClose" },
      { modal: "createGameModal", close: "closeCreateGameModal" },
    ]
  
    modals.forEach(({ modal, close }) => {
      const modalElement = document.getElementById(modal)
      const closeButton = document.getElementById(close)
  
      if (closeButton && modalElement) {
        closeButton.addEventListener("click", () => {
          modalElement.classList.remove("active")
        })
      }
  
      if (modalElement) {
        modalElement.addEventListener("click", (e) => {
          if (e.target === modalElement) {
            modalElement.classList.remove("active")
          }
        })
      }
    })
  
    // Form submissions - APENAS LOGIN (SEM CADASTRO)
    const loginForm = document.getElementById("loginForm")

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        console.log("Formulário de login enviado") // Debug

        // Simular dados do usuário após login
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

        console.log("Login realizado, usuário:", currentUser) // Debug
      })
    } else {
      console.log("Formulário de login não encontrado!") // Debug
    }
  
    // Auth modal simplificado - apenas login
    // Não há mais abas, apenas o formulário de login
  
    // Notifications tab functionality
    function switchNotificationTab(tabType) {
      const tabs = document.querySelectorAll(".notification-tab")
      const items = document.querySelectorAll(".notification-item")
  
      // Update active tab
      tabs.forEach((tab) => tab.classList.remove("active"))
      document.querySelector(`[data-tab="${tabType}"]`)?.classList.add("active")
  
      // Filter notifications
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
      // Update active conversation
      const conversations = document.querySelectorAll(".conversation-item")
      conversations.forEach((conv) => conv.classList.remove("active"))
      conversationElement.classList.add("active")
  
      // Get conversation data
      const avatar = conversationElement.querySelector(".conversation-avatar").src
      const name = conversationElement.querySelector(".conversation-name").textContent
      const isOnline = Math.random() > 0.5
  
      // Update chat header
      const chatAvatar = document.querySelector(".chat-avatar")
      const chatName = document.querySelector(".chat-name")
      const chatStatus = document.querySelector(".chat-status")
  
      if (chatAvatar) chatAvatar.src = avatar
      if (chatName) chatName.textContent = name
      if (chatStatus) chatStatus.textContent = isOnline ? "Online" : "Offline"
  
      // Load messages for this conversation
      loadConversationMessages(name)
  
      // Remove unread badge
      const unreadBadge = conversationElement.querySelector(".unread-badge")
      if (unreadBadge) {
        unreadBadge.remove()
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
        ],
        Formiga: [
          { type: "received", text: "Vamos marcar aquele treino?", time: "13:20" },
          { type: "sent", text: "Claro! Que tal amanhã às 16h?", time: "13:25" },
        ],
      }
  
      const messages = messageTemplates[contactName] || [
        { type: "received", text: "Olá! Como você está?", time: "10:00" },
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
  
    // Load more games
    const loadMoreBtn = document.getElementById("loadMoreBtn")
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        showNotification("Carregando mais jogos...", "info")
      })
    }
  })
  