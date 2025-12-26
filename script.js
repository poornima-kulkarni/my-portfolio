// ===================================
// Navigation Functionality
// ===================================

const navbar = document.getElementById("navbar")
const menuToggle = document.getElementById("menuToggle")
const navMenu = document.getElementById("navMenu")
const navLinks = document.querySelectorAll(".nav-link")

// Sticky navbar on scroll
let lastScroll = 0

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  // Add shadow when scrolled
  if (currentScroll > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  lastScroll = currentScroll
})

// Mobile menu toggle
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active")
  navMenu.classList.toggle("active")
  document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "auto"
})

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active")
    navMenu.classList.remove("active")
    document.body.style.overflow = "auto"
  })
})

// Active link highlighting based on scroll position
function setActiveLink() {
  const sections = document.querySelectorAll("section")
  const scrollPosition = window.pageYOffset + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

window.addEventListener("scroll", setActiveLink)

// ===================================
// Smooth Scroll for Navigation Links
// ===================================

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 70 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe all section elements for fade-in animation
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(20px)"
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(section)
  })
})

// ===================================
// Skills Progress Bar Animation
// ===================================

const skillsSection = document.querySelector(".skills")
let skillsAnimated = false

const animateSkills = () => {
  const skillBars = document.querySelectorAll(".skill-progress")

  skillBars.forEach((bar) => {
    const width = bar.style.width
    bar.style.width = "0"

    setTimeout(() => {
      bar.style.width = width
    }, 100)
  })

  skillsAnimated = true
}

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !skillsAnimated) {
        animateSkills()
      }
    })
  },
  { threshold: 0.3 },
)

if (skillsSection) {
  skillsObserver.observe(skillsSection)
}

// ===================================
// Contact Form Validation & Submission
// ===================================

const contactForm = document.getElementById("contactForm")
const formInputs = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  subject: document.getElementById("subject"),
  message: document.getElementById("message"),
}
const formErrors = {
  name: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  subject: document.getElementById("subjectError"),
  message: document.getElementById("messageError"),
}
const formSuccess = document.getElementById("formSuccess")

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validation functions
function validateName(name) {
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long"
  }
  return ""
}

function validateEmail(email) {
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address"
  }
  return ""
}

function validateSubject(subject) {
  if (subject.trim().length < 3) {
    return "Subject must be at least 3 characters long"
  }
  return ""
}

function validateMessage(message) {
  if (message.trim().length < 10) {
    return "Message must be at least 10 characters long"
  }
  return ""
}

// Real-time validation
formInputs.name.addEventListener("blur", () => {
  const error = validateName(formInputs.name.value)
  formErrors.name.textContent = error
  formInputs.name.style.borderColor = error ? "#ef4444" : ""
})

formInputs.email.addEventListener("blur", () => {
  const error = validateEmail(formInputs.email.value)
  formErrors.email.textContent = error
  formInputs.email.style.borderColor = error ? "#ef4444" : ""
})

formInputs.subject.addEventListener("blur", () => {
  const error = validateSubject(formInputs.subject.value)
  formErrors.subject.textContent = error
  formInputs.subject.style.borderColor = error ? "#ef4444" : ""
})

formInputs.message.addEventListener("blur", () => {
  const error = validateMessage(formInputs.message.value)
  formErrors.message.textContent = error
  formInputs.message.style.borderColor = error ? "#ef4444" : ""
})

// Clear error on input
Object.keys(formInputs).forEach((key) => {
  formInputs[key].addEventListener("input", () => {
    formErrors[key].textContent = ""
    formInputs[key].style.borderColor = ""
  })
})

// Form submission
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Validate all fields
  const errors = {
    name: validateName(formInputs.name.value),
    email: validateEmail(formInputs.email.value),
    subject: validateSubject(formInputs.subject.value),
    message: validateMessage(formInputs.message.value),
  }

  // Display errors
  let hasErrors = false
  Object.keys(errors).forEach((key) => {
    if (errors[key]) {
      formErrors[key].textContent = errors[key]
      formInputs[key].style.borderColor = "#ef4444"
      hasErrors = true
    }
  })

  // If no errors, submit form (simulated)
  if (!hasErrors) {
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]')
    const originalText = submitButton.textContent
    submitButton.textContent = "Sending..."
    submitButton.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Show success message
      formSuccess.classList.add("show")

      // Reset form
      contactForm.reset()
      submitButton.textContent = originalText
      submitButton.disabled = false

      // Hide success message after 5 seconds
      setTimeout(() => {
        formSuccess.classList.remove("show")
      }, 5000)

      // In a real application, you would send the data to a server here:
      // const formData = {
      //     name: formInputs.name.value,
      //     email: formInputs.email.value,
      //     subject: formInputs.subject.value,
      //     message: formInputs.message.value
      // };
      // fetch('/api/contact', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(formData)
      // });
    }, 1500)
  }
})

// ===================================
// Dynamic Year in Footer
// ===================================

const yearElement = document.querySelector(".footer-content p")
if (yearElement) {
  const currentYear = new Date().getFullYear()
  yearElement.textContent = `© ${currentYear} Poornima Kulkarni. All rights reserved.`
}

// ===================================
// Scroll to Top Button (Optional Enhancement)
// ===================================

// Create scroll to top button dynamically
const scrollTopBtn = document.createElement("button")
scrollTopBtn.innerHTML = "↑"
scrollTopBtn.className = "scroll-top-btn"
scrollTopBtn.setAttribute("aria-label", "Scroll to top")
document.body.appendChild(scrollTopBtn)

// Add styles for scroll to top button
const scrollTopStyles = `
    .scroll-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-lg);
        z-index: 999;
    }
    
    .scroll-top-btn.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .scroll-top-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-3px);
    }
    
    @media (max-width: 768px) {
        .scroll-top-btn {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
    }
`

const styleSheet = document.createElement("style")
styleSheet.textContent = scrollTopStyles
document.head.appendChild(styleSheet)

// Show/hide scroll to top button
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add("visible")
  } else {
    scrollTopBtn.classList.remove("visible")
  }
})

// Scroll to top functionality
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// ===================================
// Project Card Hover Effects Enhancement
// ===================================

const projectCards = document.querySelectorAll(".project-card")

projectCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)"
  })
})

// ===================================
// Console Welcome Message
// ===================================

console.log("%c👋 Welcome to my portfolio!", "color: #2563eb; font-size: 20px; font-weight: bold;")
console.log("%cInterested in the code? Check out the repository!", "color: #64748b; font-size: 14px;")
