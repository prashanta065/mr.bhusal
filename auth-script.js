// Authentication System JavaScript

// Utility functions
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  const inputElement = document.getElementById(elementId.replace("Error", ""))

  if (errorElement && inputElement) {
    errorElement.textContent = message
    errorElement.classList.add("show")
    inputElement.classList.add("error")
  }
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId)
  const inputElement = document.getElementById(elementId.replace("Error", ""))

  if (errorElement && inputElement) {
    errorElement.textContent = ""
    errorElement.classList.remove("show")
    inputElement.classList.remove("error")
  }
}

function clearAllErrors(errorIds) {
  errorIds.forEach((id) => clearError(id))
}

function setLoading(buttonId, spinnerId, isLoading) {
  const button = document.getElementById(buttonId)
  const spinner = document.getElementById(spinnerId)

  if (button) {
    if (isLoading) {
      button.classList.add("loading")
      button.disabled = true
    } else {
      button.classList.remove("loading")
      button.disabled = false
    }
  }

  if (spinner) {
    spinner.style.display = isLoading ? "block" : "none"
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  return password.length >= 6
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// Avatar upload functionality
function initAvatarUpload() {
  const avatarUpload = document.getElementById("avatarUpload")
  const avatarInput = document.getElementById("avatarInput")
  const avatarPreview = document.getElementById("avatarPreview")

  if (avatarUpload && avatarInput) {
    avatarUpload.addEventListener("click", () => {
      avatarInput.click()
    })

    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          showError("avatarError", "File size must be less than 5MB")
          return
        }

        if (!file.type.startsWith("image/")) {
          showError("avatarError", "Please select a valid image file")
          return
        }

        clearError("avatarError")

        const reader = new FileReader()
        reader.onload = (e) => {
          const avatarImg = document.getElementById("avatarImg")
          const avatarPlaceholder = avatarPreview.querySelector(".avatar-placeholder")

          if (avatarImg && avatarPlaceholder) {
            avatarImg.src = e.target.result
            avatarImg.style.display = "block"
            avatarPlaceholder.style.display = "none"
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

// Google OAuth simulation
function handleGoogleAuth() {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const mockGoogleUser = {
        id: "google_" + Date.now(),
        fullName: "John Doe",
        username: "johndoe_google",
        email: "john.doe@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      }
      resolve(mockGoogleUser)
    }, 1500)
  })
}

function initGoogleAuth() {
  // Simulate Google OAuth (in real implementation, use Google Identity Services)
  window.handleGoogleAuth = handleGoogleAuth
}

// Signup page functionality
function initializeSignupPage() {
  initSignupPage()
}

function initSignupPage() {
  const signupForm = document.getElementById("signupForm")
  const googleSignupBtn = document.getElementById("googleSignup")

  initAvatarUpload()
  initGoogleAuth()

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const fullName = document.getElementById("fullName").value.trim()
      const username = document.getElementById("username").value.trim()
      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value
      const avatarInput = document.getElementById("avatarInput")

      const errorIds = ["fullNameError", "usernameError", "emailError", "passwordError", "avatarError"]
      clearAllErrors(errorIds)

      let hasErrors = false

      // Validation
      if (!fullName || fullName.length < 2) {
        showError("fullNameError", "Full name must be at least 2 characters")
        hasErrors = true
      }

      if (!validateUsername(username)) {
        showError("usernameError", "Username must be 3-20 characters, letters, numbers, and underscores only")
        hasErrors = true
      }

      if (!validateEmail(email)) {
        showError("emailError", "Please enter a valid email address")
        hasErrors = true
      }

      if (!validatePassword(password)) {
        showError("passwordError", "Password must be at least 6 characters")
        hasErrors = true
      }

      if (hasErrors) return

      const signupBtn = document.getElementById("signupBtn")
      const signupSpinner = document.getElementById("signupSpinner")

      if (signupBtn && signupSpinner) {
        signupBtn.classList.add("loading")
        signupBtn.disabled = true
        signupSpinner.style.display = "block"
      }

      // Simulate API call
      setTimeout(() => {
        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const userExists = existingUsers.some((user) => user.email === email || user.username === username)

        if (userExists) {
          if (existingUsers.some((user) => user.email === email)) {
            showError("emailError", "An account with this email already exists")
          }
          if (existingUsers.some((user) => user.username === username)) {
            showError("usernameError", "This username is already taken")
          }

          if (signupBtn && signupSpinner) {
            signupBtn.classList.remove("loading")
            signupBtn.disabled = false
            signupSpinner.style.display = "none"
          }
          return
        }

        let avatarData = null
        if (avatarInput.files[0]) {
          const reader = new FileReader()
          reader.onload = (e) => {
            avatarData = e.target.result
            saveUser()
          }
          reader.readAsDataURL(avatarInput.files[0])
        } else {
          saveUser()
        }

        function saveUser() {
          const newUser = {
            id: Date.now().toString(),
            fullName,
            username,
            email,
            password, // In real app, this would be hashed
            avatar: avatarData,
            createdAt: new Date().toISOString(),
          }

          existingUsers.push(newUser)
          localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

          if (signupBtn && signupSpinner) {
            signupBtn.classList.remove("loading")
            signupBtn.disabled = false
            signupSpinner.style.display = "none"
          }

          // Redirect to login page
          window.location.href = "login.html"
        }
      }, 1500)
    })
  }

  if (googleSignupBtn) {
    googleSignupBtn.addEventListener("click", async () => {
      googleSignupBtn.classList.add("loading")
      googleSignupBtn.disabled = true

      try {
        const googleUser = await window.handleGoogleAuth()

        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const userExists = existingUsers.some((user) => user.email === googleUser.email)

        if (!userExists) {
          existingUsers.push({
            ...googleUser,
            createdAt: new Date().toISOString(),
          })
          localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))
        }

        setUserData(googleUser)

        window.location.href = "index.html"
      } catch (error) {
        console.error("Google signup failed:", error)
      } finally {
        googleSignupBtn.classList.remove("loading")
        googleSignupBtn.disabled = false
      }
    })
  }
}

// Login page functionality
function initializeLoginPage() {
  initLoginPage()
}

function initLoginPage() {
  const loginForm = document.getElementById("loginForm")
  const googleLoginBtn = document.getElementById("googleLogin")
  const forgotPasswordLink = document.getElementById("forgotPasswordLink")
  const forgotPasswordModal = document.getElementById("forgotPasswordModal")
  const closeForgotModal = document.getElementById("closeForgotModal")
  const sendResetBtn = document.getElementById("sendResetBtn")

  initGoogleAuth()

  if (forgotPasswordLink && forgotPasswordModal) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault()
      forgotPasswordModal.style.display = "flex"
    })
  }

  if (closeForgotModal && forgotPasswordModal) {
    closeForgotModal.addEventListener("click", () => {
      forgotPasswordModal.style.display = "none"
    })
  }

  if (forgotPasswordModal) {
    forgotPasswordModal.addEventListener("click", (e) => {
      if (e.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = "none"
      }
    })
  }

  if (sendResetBtn) {
    sendResetBtn.addEventListener("click", () => {
      const forgotEmail = document.getElementById("forgotEmail").value.trim()

      clearError("forgotEmailError")

      if (!validateEmail(forgotEmail)) {
        showError("forgotEmailError", "Please enter a valid email address")
        return
      }

      const resetSpinner = document.getElementById("resetSpinner")
      sendResetBtn.classList.add("loading")
      sendResetBtn.disabled = true
      resetSpinner.style.display = "flex"

      // Simulate sending reset email
      setTimeout(() => {
        sendResetBtn.classList.remove("loading")
        sendResetBtn.disabled = false
        resetSpinner.style.display = "none"

        alert("Password reset link sent to your email!")
        forgotPasswordModal.style.display = "none"
        document.getElementById("forgotEmail").value = ""
      }, 2000)
    })
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("loginEmail").value.trim()
      const password = document.getElementById("loginPassword").value
      const rememberMe = document.getElementById("rememberMe").checked

      const errorIds = ["loginEmailError", "loginPasswordError"]
      clearAllErrors(errorIds)

      let hasErrors = false

      if (!validateEmail(email)) {
        showError("loginEmailError", "Please enter a valid email address")
        hasErrors = true
      }

      if (!password) {
        showError("loginPasswordError", "Password is required")
        hasErrors = true
      }

      if (hasErrors) return

      const loginBtn = document.getElementById("loginBtn")
      const loginSpinner = document.getElementById("loginSpinner")

      if (loginBtn && loginSpinner) {
        loginBtn.classList.add("loading")
        loginBtn.disabled = true
        loginSpinner.style.display = "flex"
      }

      // Simulate API call
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const user = registeredUsers.find((u) => u.email === email && u.password === password)

        if (!user) {
          showError("loginEmailError", "Invalid email or password")
          showError("loginPasswordError", "Invalid email or password")

          if (loginBtn && loginSpinner) {
            loginBtn.classList.remove("loading")
            loginBtn.disabled = false
            loginSpinner.style.display = "none"
          }
          return
        }

        setUserData(user)

        if (rememberMe) {
          localStorage.setItem("rememberLogin", "true")
        }

        if (loginBtn && loginSpinner) {
          loginBtn.classList.remove("loading")
          loginBtn.disabled = false
          loginSpinner.style.display = "none"
        }

        window.location.href = "index.html"
      }, 1500)
    })
  }

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      googleLoginBtn.classList.add("loading")
      googleLoginBtn.disabled = true

      try {
        const googleUser = await window.handleGoogleAuth()

        setUserData(googleUser)

        window.location.href = "index.html"
      } catch (error) {
        console.error("Google login failed:", error)
      } finally {
        googleLoginBtn.classList.remove("loading")
        googleLoginBtn.disabled = false
      }
    })
  }
}

function setUserData(userData) {
  localStorage.setItem("isLoggedIn", "true")
  localStorage.setItem("loggedIn", "true")
  localStorage.setItem("currentUser", JSON.stringify(userData))
  localStorage.setItem("avatarUrl", userData.avatar || "https://via.placeholder.com/40")
  localStorage.setItem("userName", userData.fullName || userData.name || "User")
  localStorage.setItem("userEmail", userData.email || "")
}

// Initialize based on current page
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const errorId = input.id + "Error"
      clearError(errorId)
    })
  })

  const currentPage = window.location.pathname.split("/").pop()
  if (currentPage === "signup.html") {
    initializeSignupPage()
  } else if (currentPage === "login.html") {
    initializeLoginPage()
  }
})
