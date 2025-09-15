// Form Elements
const form = document.getElementById("registrationForm")
const progressFill = document.getElementById("progressFill")
const submitBtn = document.getElementById("submitBtn")
const btnLoader = document.getElementById("btnLoader")
const successModal = document.getElementById("successModal")

// Input Elements
const inputs = {
  nome: document.getElementById("nome"),
  email: document.getElementById("email"),
  dataNascimento: document.getElementById("dataNascimento"),
  cpf: document.getElementById("cpf"),
  telefone: document.getElementById("telefone"),
  usuario: document.getElementById("usuario"),
  senha: document.getElementById("senha"),
  confirmarSenha: document.getElementById("confirmarSenha"),
}

// Error Elements
const errors = {
  nome: document.getElementById("nomeError"),
  email: document.getElementById("emailError"),
  dataNascimento: document.getElementById("dataNascimentoError"),
  cpf: document.getElementById("cpfError"),
  telefone: document.getElementById("telefoneError"),
  usuario: document.getElementById("usuarioError"),
  senha: document.getElementById("senhaError"),
  confirmarSenha: document.getElementById("confirmarSenhaError"),
}

// Password Elements
const passwordToggle = document.getElementById("passwordToggle")
const confirmPasswordToggle = document.getElementById("confirmPasswordToggle")
const strengthFill = document.getElementById("strengthFill")
const strengthText = document.getElementById("strengthText")

// Validation Rules
const validationRules = {
  nome: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    message: "Nome deve conter apenas letras e ter pelo menos 2 caracteres",
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Digite um e-mail válido",
  },
  dataNascimento: {
    required: true,
    custom: (value) => {
      const today = new Date()
      const birthDate = new Date(value)
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 13 && age <= 100
    },
    message: "Idade deve estar entre 13 e 100 anos",
  },
  cpf: {
    required: true,
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    custom: validateCPF,
    message: "CPF inválido",
  },
  telefone: {
    required: true,
    pattern: /^$$\d{2}$$\s\d{4,5}-\d{4}$/,
    message: "Telefone deve estar no formato (00) 00000-0000",
  },
  usuario: {
    required: true,
    minLength: 3,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: "Nome de usuário deve ter pelo menos 3 caracteres e conter apenas letras, números e _",
  },
  senha: {
    required: true,
    minLength: 8,
    custom: (value) => {
      const hasUpper = /[A-Z]/.test(value)
      const hasLower = /[a-z]/.test(value)
      const hasNumber = /\d/.test(value)
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
      return hasUpper && hasLower && hasNumber && hasSpecial
    },
    message: "Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo",
  },
  confirmarSenha: {
    required: true,
    custom: (value) => value === inputs.senha.value,
    message: "Senhas não coincidem",
  },
}

// CPF Validation Function
function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "")

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cpf.charAt(10))) return false

  return true
}

// Input Formatting
function formatCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

function formatPhone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
    .replace(/(-\d{4})\d+?$/, "$1")
}

// Input Event Listeners
inputs.cpf.addEventListener("input", (e) => {
  e.target.value = formatCPF(e.target.value)
  validateField("cpf")
})

inputs.telefone.addEventListener("input", (e) => {
  e.target.value = formatPhone(e.target.value)
  validateField("telefone")
})

// Password Strength Checker
function checkPasswordStrength(password) {
  let strength = 0
  let feedback = ""

  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

  strengthFill.className = "strength-fill"

  switch (strength) {
    case 0:
    case 1:
      strengthFill.classList.add("weak")
      feedback = "Muito fraca"
      break
    case 2:
      strengthFill.classList.add("weak")
      feedback = "Fraca"
      break
    case 3:
      strengthFill.classList.add("fair")
      feedback = "Razoável"
      break
    case 4:
      strengthFill.classList.add("good")
      feedback = "Boa"
      break
    case 5:
      strengthFill.classList.add("strong")
      feedback = "Muito forte"
      break
  }

  strengthText.textContent = feedback
  return strength
}

inputs.senha.addEventListener("input", (e) => {
  checkPasswordStrength(e.target.value)
  validateField("senha")
  if (inputs.confirmarSenha.value) {
    validateField("confirmarSenha")
  }
})

inputs.confirmarSenha.addEventListener("input", () => {
  validateField("confirmarSenha")
})

// Password Toggle Functionality
function togglePassword(input, toggle) {
  const type = input.getAttribute("type") === "password" ? "text" : "password"
  input.setAttribute("type", type)

  const eyeIcon = toggle.querySelector(".eye-icon")
  if (type === "text") {
    eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `
  } else {
    eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `
  }
}

passwordToggle.addEventListener("click", () => {
  togglePassword(inputs.senha, passwordToggle)
})

confirmPasswordToggle.addEventListener("click", () => {
  togglePassword(inputs.confirmarSenha, confirmPasswordToggle)
})

// Field Validation
function validateField(fieldName) {
  const input = inputs[fieldName]
  const error = errors[fieldName]
  const rule = validationRules[fieldName]
  const value = input.value.trim()

  let isValid = true
  let errorMessage = ""

  // Required check
  if (rule.required && !value) {
    isValid = false
    errorMessage = "Este campo é obrigatório"
  }

  // Min length check
  if (isValid && rule.minLength && value.length < rule.minLength) {
    isValid = false
    errorMessage = rule.message
  }

  // Pattern check
  if (isValid && rule.pattern && !rule.pattern.test(value)) {
    isValid = false
    errorMessage = rule.message
  }

  // Custom validation
  if (isValid && rule.custom && !rule.custom(value)) {
    isValid = false
    errorMessage = rule.message
  }

  // Update UI
  input.classList.remove("error", "success")
  error.classList.remove("show")

  if (value) {
    if (isValid) {
      input.classList.add("success")
    } else {
      input.classList.add("error")
      error.textContent = errorMessage
      error.classList.add("show")
    }
  }

  updateProgress()
  return isValid
}

// Progress Bar Update
function updateProgress() {
  const totalFields = Object.keys(inputs).length
  let validFields = 0

  Object.keys(inputs).forEach((fieldName) => {
    const input = inputs[fieldName]
    if (input.value.trim() && input.classList.contains("success")) {
      validFields++
    }
  })

  const progress = (validFields / totalFields) * 100
  progressFill.style.width = `${progress}%`
}

// Add validation to all inputs
Object.keys(inputs).forEach((fieldName) => {
  const input = inputs[fieldName]

  input.addEventListener("blur", () => {
    validateField(fieldName)
  })

  input.addEventListener("input", () => {
    if (input.classList.contains("error")) {
      validateField(fieldName)
    }
  })
})

// Form Submission
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Validate all fields
  let isFormValid = true
  Object.keys(inputs).forEach((fieldName) => {
    if (!validateField(fieldName)) {
      isFormValid = false
    }
  })

  if (!isFormValid) {
    // Scroll to first error
    const firstError = form.querySelector(".error")
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    return
  }

  // Show loading state
  submitBtn.classList.add("loading")
  submitBtn.disabled = true

  // Simulate API call
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Show success modal
    successModal.classList.add("show")

    // Reset form
    form.reset()
    progressFill.style.width = "0%"
    strengthFill.className = "strength-fill"
    strengthText.textContent = "Digite uma senha"

    // Remove all validation classes
    Object.values(inputs).forEach((input) => {
      input.classList.remove("error", "success")
    })

    Object.values(errors).forEach((error) => {
      error.classList.remove("show")
    })
  } catch (error) {
    alert("Erro ao realizar cadastro. Tente novamente.")
  } finally {
    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
  }
})

// Reset Button
form.addEventListener("reset", () => {
  setTimeout(() => {
    progressFill.style.width = "0%"
    strengthFill.className = "strength-fill"
    strengthText.textContent = "Digite uma senha"

    Object.values(inputs).forEach((input) => {
      input.classList.remove("error", "success")
    })

    Object.values(errors).forEach((error) => {
      error.classList.remove("show")
    })
  }, 10)
})

// Modal Functions
function closeModal() {
  successModal.classList.remove("show")
}

// Close modal when clicking outside
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    closeModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && successModal.classList.contains("show")) {
    closeModal()
  }
})

// Floating Labels Animation
Object.values(inputs).forEach((input) => {
  input.addEventListener("focus", () => {
    input.parentElement.classList.add("focused")
  })

  input.addEventListener("blur", () => {
    if (!input.value) {
      input.parentElement.classList.remove("focused")
    }
  })
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Set max date for birth date (13 years ago)
  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())
  inputs.dataNascimento.max = maxDate.toISOString().split("T")[0]

  // Set min date for birth date (100 years ago)
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
  inputs.dataNascimento.min = minDate.toISOString().split("T")[0]
})
