/* AI Assistant JavaScript */
;(() => {
  /* ---------- UI Elements ---------- */
  const fab = document.getElementById("aiFab")
  const overlay = document.getElementById("aiOverlay")
  const modal = document.getElementById("aiModal")
  const closeBtn = document.getElementById("aiClose")
  const chat = document.getElementById("chat")
  const input = document.getElementById("input")
  const sendBtn = document.getElementById("sendBtn")
  const micBtn = document.getElementById("micBtn")
  const voiceToggle = document.getElementById("voiceToggle")
  const suggestionsWrap = document.getElementById("suggestions")
  const dragHandle = document.getElementById("dragHandle") // Added for modal drag handle

  let currentLanguage = "en" // 'en' for English, 'ne' for Nepali
  const autoDetectLanguage = true

  /* ---------- Modal Controls ---------- */
  const openModal = () => {
    overlay.style.display = "block"
    modal.style.display = "flex"
    input.focus()
  }

  const closeModal = () => {
    overlay.style.display = "none"
    modal.style.display = "none"
  }

  closeBtn.onclick = closeModal
  overlay.onclick = closeModal

  /* ---------- Enhanced Drag Functionality ---------- */
  ;(() => {
    let isDragging = false
    let startX = 0
    let startY = 0
    let initialX = 0
    let initialY = 0
    let hasMoved = false

    // Make entire FAB draggable
    fab.addEventListener("mousedown", (e) => {
      isDragging = true
      hasMoved = false
      startX = e.clientX
      startY = e.clientY
      const rect = fab.getBoundingClientRect()
      initialX = rect.left
      initialY = rect.top
      fab.style.cursor = "grabbing"
      e.preventDefault()
    })

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      // Mark as moved if dragged more than 5px
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved = true
      }

      const newX = initialX + deltaX
      const newY = initialY + deltaY

      // Keep button within viewport bounds with padding
      const padding = 10
      const maxX = window.innerWidth - fab.offsetWidth - padding
      const maxY = window.innerHeight - fab.offsetHeight - padding

      const boundedX = Math.max(padding, Math.min(newX, maxX))
      const boundedY = Math.max(padding, Math.min(newY, maxY))

      fab.style.left = boundedX + "px"
      fab.style.top = boundedY + "px"
      fab.style.right = "auto"
      fab.style.bottom = "auto"
    })

    document.addEventListener("mouseup", (e) => {
      if (isDragging) {
        // Only open modal if it was a click (not a drag)
        if (!hasMoved) {
          setTimeout(() => openModal(), 100) // Small delay to prevent conflicts
        }
      }
      isDragging = false
      hasMoved = false
      fab.style.cursor = "grab"
    })

    // Touch support for mobile
    fab.addEventListener("touchstart", (e) => {
      const touch = e.touches[0]
      isDragging = true
      hasMoved = false
      startX = touch.clientX
      startY = touch.clientY
      const rect = fab.getBoundingClientRect()
      initialX = rect.left
      initialY = rect.top
      e.preventDefault()
    })

    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return
      e.preventDefault()

      const touch = e.touches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved = true
      }

      const newX = initialX + deltaX
      const newY = initialY + deltaY

      const padding = 10
      const maxX = window.innerWidth - fab.offsetWidth - padding
      const maxY = window.innerHeight - fab.offsetHeight - padding

      const boundedX = Math.max(padding, Math.min(newX, maxX))
      const boundedY = Math.max(padding, Math.min(newY, maxY))

      fab.style.left = boundedX + "px"
      fab.style.top = boundedY + "px"
      fab.style.right = "auto"
      fab.style.bottom = "auto"
    })

    document.addEventListener("touchend", (e) => {
      if (isDragging && !hasMoved) {
        setTimeout(() => openModal(), 100)
      }
      isDragging = false
      hasMoved = false
    })
  })()

  /* ---------- Enhanced Modal Drag Functionality ---------- */
  ;(() => {
    const handle = dragHandle // Use header as drag handle
    let isDrag = false,
      sx = 0,
      sy = 0,
      ox = 0,
      oy = 0

    handle.addEventListener("mousedown", (e) => {
      // Only allow dragging from header area, not buttons
      if (e.target.closest(".ai-actions")) return

      isDrag = true
      sx = e.clientX
      sy = e.clientY
      const r = modal.getBoundingClientRect()
      ox = r.left
      oy = r.top
      modal.style.cursor = "grabbing"
      handle.style.cursor = "grabbing"
      e.preventDefault()
    })

    document.addEventListener("mousemove", (e) => {
      if (!isDrag) return
      const dx = e.clientX - sx,
        dy = e.clientY - sy

      const newX = ox + dx
      const newY = oy + dy

      // Keep modal within viewport bounds
      const padding = 20
      const maxX = window.innerWidth - modal.offsetWidth - padding
      const maxY = window.innerHeight - modal.offsetHeight - padding

      const boundedX = Math.max(padding, Math.min(newX, maxX))
      const boundedY = Math.max(padding, Math.min(newY, maxY))

      modal.style.left = boundedX + "px"
      modal.style.top = boundedY + "px"
      modal.style.transform = "translate(0,0)"
      modal.style.right = "auto"
      modal.style.bottom = "auto"
    })

    document.addEventListener("mouseup", () => {
      isDrag = false
      modal.style.cursor = "default"
      handle.style.cursor = "move"
    })
  })()

  /* ---------- Enhanced Knowledge Base with Nepali Support ---------- */
  const KB = {
    en: {
      about: [
        "Hello! I'm Prashanta Bhusal, a passionate and innovative developer dedicated to crafting modern digital experiences.",
        "I specialize in web design, graphics, and AI-based solutions.",
        "I'm a creative developer offering web design, graphics, and AI-based solutions.",
        "I'm also an active member of Hack Club Butwal, building modern and impactful digital experiences.",
        "I love clean code and creative visuals, bringing ideas to life with precision and flair.",
      ],
      education: [
        "Hansapur Public English Boarding School — Nursery to Grade 8 (2070 BS – 2080 BS).",
        "Active in AI & IT; Class Captain (Grade 7 & 8); Completed Grade 8 with Best Result.",
        "Kalika Manavgyan Secondary School — Grade 9–10, specialization: Computer Engineering.",
        "Learning DBMS, Web Development, AI basics.",
        "Treasurer of Hack Club Butwal; Participated in Tech Fairs.",
      ],
      projects: [
        { title: "Logo Designs", desc: "Clean, memorable brand marks and visual identity packs." },
        { title: "Marketing Banners", desc: "High-converting banner sets for campaigns and social." },
        { title: "Presentations", desc: "Professional, story-driven presentations for education/business." },
        { title: "Business Cards", desc: "Minimal and premium visiting cards with print-ready files." },
        { title: "Flyers", desc: "Eye-catching promo flyers for events and brands." },
        { title: "Certificates", desc: "Elegant certificates with proper layout and typography." },
        { title: "Web Development", desc: "Modern, responsive websites with clean code and user experience focus." },
        { title: "AI Solutions", desc: "AI-based automation and intelligent solutions for businesses." },
      ],
      skills: {
        "Graphic Designing": [
          "Visual communication, composition, and clarity.",
          "Tools: Canva, Photoshop, Figma, Adobe Illustrator.",
          "Branding & Logo Design, Color Theory",
        ],
        "Web Development": [
          "Modern, responsive websites with clean code.",
          "HTML5 & CSS3, JavaScript (ES6+), Git & GitHub, Responsive Design",
          "Frontend frameworks and modern development practices",
        ],
        "Presentation Making": [
          "Education & business presentations.",
          "Microsoft PowerPoint, Google Slides, Canva, Slide Design Principles, Data Visualization",
        ],
        "AI & Automation": [
          "Leverage AI tools & automation for productivity.",
          "ChatGPT & GPT APIs (concepts), Data Analysis",
          "AI-based solutions and intelligent automation systems",
        ],
        Programming: [
          "Problem solving & building applications.",
          "JavaScript, OOP, Data Structures & Algorithms, Version Control (Git), Debugging & Testing",
        ],
        "Communication & Teamwork": [
          "Interpersonal collaboration skills.",
          "Active Listening, Presentation Skills, Conflict Resolution, Collaboration Tools, Remote Team Coordination",
        ],
      },
      services: [
        "Web Design & Development",
        "Graphics & Branding (Logos, Banners, Flyers, Cards, Certificates)",
        "Presentation Design",
        "AI-Automation Consulting",
        "Front-end Prototyping (Figma → Code)",
        "Digital Marketing Materials",
        "Custom AI Solutions",
      ],
      contact: {
        email: "www.prashantabhusal@gmail.com",
        phone: "+977 9766654639",
        location: "Malarani-07, Arghakhanchi, Nepal",
        linkedin: "linkedin.com/in/prashantabhusal",
        website: "misterbhusal.vercel.app",
        hours: ["Mon–Fri: 4:00 AM – 7:00 AM & 8:00 PM – 10:00 PM", "Sat: 10:00 AM – 3:00 PM", "Sun: Closed"],
      },
    },
    ne: {
      about: [
        "नमस्कार! म प्रशान्त भुसाल हुँ, आधुनिक डिजिटल अनुभवहरू सिर्जना गर्न समर्पित एक भावुक र नवाचारी विकासकर्ता।",
        "म वेब डिजाइन, ग्राफिक्स, र AI-आधारित समाधानहरूमा विशेषज्ञता राख्छु।",
        "म एक रचनात्मक विकासकर्ता हुँ जसले वेब डिजाइन, ग्राफिक्स, र AI-आधारित समाधानहरू प्रदान गर्छु।",
        "म ह्याक क्लब बुटवलको सक्रिय सदस्य पनि हुँ, आधुनिक र प्रभावकारी डिजिटल अनुभवहरू निर्माण गर्दै।",
        "मलाई सफा कोड र रचनात्मक दृश्यहरू मन पर्छ, विचारहरूलाई सटीकता र कलाकारिताका साथ जीवन्त बनाउँदै।",
      ],
      education: [
        "हंसापुर पब्लिक इङ्ग्लिश बोर्डिङ स्कूल — नर्सरी देखि कक्षा ८ (२०७० बि.स. – २०८० बि.स.)।",
        "AI र IT मा सक्रिय; कक्षा कप्तान (कक्षा ७ र ८); उत्कृष्ट परिणामका साथ कक्षा ८ पूरा।",
        "कालिका मानवज्ञान माध्यमिक विद्यालय — कक्षा ९–१०, विशेषज्ञता: कम्प्युटर इन्जिनियरिङ।",
        "DBMS, वेब विकास, AI आधारभूत कुराहरू सिक्दै।",
        "ह्याक क्लब बुटवलको कोषाध्यक्ष; प्राविधिक मेलाहरूमा सहभागिता।",
      ],
      projects: [
        { title: "लोगो डिजाइनहरू", desc: "सफा, स्मरणीय ब्रान्ड चिन्हहरू र दृश्य पहिचान प्याकेजहरू।" },
        { title: "मार्केटिङ ब्यानरहरू", desc: "अभियान र सामाजिक सञ्जालका लागि उच्च-रूपान्तरण ब्यानर सेटहरू।" },
        { title: "प्रस्तुतीकरणहरू", desc: "शिक्षा/व्यवसायका लागि व्यावसायिक, कथा-संचालित प्रस्तुतीकरणहरू।" },
        { title: "व्यापारिक कार्डहरू", desc: "प्रिन्ट-तयार फाइलहरूसहित न्यूनतम र प्रिमियम भिजिटिङ कार्डहरू।" },
        { title: "फ्लायरहरू", desc: "घटना र ब्रान्डहरूका लागि आकर्षक प्रचार फ्लायरहरू।" },
        { title: "प्रमाणपत्रहरू", desc: "उचित लेआउट र टाइपोग्राफीसहित सुन्दर प्रमाणपत्रहरू।" },
        { title: "वेब विकास", desc: "सफा कोड र प्रयोगकर्ता अनुभवमा केन्द्रित आधुनिक, उत्तरदायी वेबसाइटहरू।" },
        { title: "AI समाधानहरू", desc: "व्यवसायहरूका लागि AI-आधारित स्वचालन र बुद्धिमान समाधानहरू।" },
      ],
      skills: {
        "ग्राफिक डिजाइनिङ": [
          "दृश्य संचार, संरचना, र स्पष्टता।",
          "उपकरणहरू: Canva, Photoshop, Figma, Adobe Illustrator।",
          "ब्रान्डिङ र लोगो डिजाइन, रङ सिद्धान्त",
        ],
        "वेब विकास": [
          "सफा कोडसहित आधुनिक, उत्तरदायी वेबसाइटहरू।",
          "HTML5 र CSS3, JavaScript (ES6+), Git र GitHub, उत्तरदायी डिजाइन",
          "फ्रन्टएन्ड फ्रेमवर्कहरू र आधुनिक विकास अभ्यासहरू",
        ],
        "प्रस्तुतीकरण निर्माण": [
          "शिक्षा र व्यापारिक प्रस्तुतीकरणहरू।",
          "Microsoft PowerPoint, Google Slides, Canva, स्लाइड डिजाइन सिद्धान्तहरू, डेटा दृश्यीकरण",
        ],
        "AI र स्वचालन": [
          "उत्पादकताका लागि AI उपकरणहरू र स्वचालनको उपयोग।",
          "ChatGPT र GPT APIs (अवधारणाहरू), डेटा विश्लेषण",
          "AI-आधारित समाधानहरू र बुद्धिमान स्वचालन प्रणालीहरू",
        ],
        प्रोग्रामिङ: [
          "समस्या समाधान र अनुप्रयोगहरू निर्माण।",
          "JavaScript, OOP, डेटा संरचना र एल्गोरिदमहरू, संस्करण नियन्त्रण (Git), डिबगिङ र परीक्षण",
        ],
        "संचार र टोली कार्य": [
          "अन्तरव्यक्तिगत सहयोग सीपहरू।",
          "सक्रिय सुनाइ, प्रस्तुतीकरण सीपहरू, द्वन्द्व समाधान, सहयोग उपकरणहरू, रिमोट टोली समन्वय",
        ],
      },
      services: [
        "वेब डिजाइन र विकास",
        "ग्राफिक्स र ब्रान्डिङ (लोगो, ब्यानर, फ्लायर, कार्ड, प्रमाणपत्र)",
        "प्रस्तुतीकरण डिजाइन",
        "AI-स्वचालन परामर्श",
        "फ्रन्ट-एन्ड प्रोटोटाइपिङ (Figma → कोड)",
        "डिजिटल मार्केटिङ सामग्री",
        "कस्टम AI समाधानहरू",
      ],
      contact: {
        email: "www.prashantabhusal@gmail.com",
        phone: "+977 9766654639",
        location: "मलरानी-०७, अर्घाखाँची, नेपाल",
        linkedin: "linkedin.com/in/prashantabhusal",
        website: "misterbhusal.vercel.app",
        hours: ["सोम–शुक्र: बिहान ४:०० – ७:०० र बेलुका ८:०० – १०:००", "शनि: बिहान १०:०० – दिउँसो ३:००", "आइत: बन्द"],
      },
    },
  }

  function detectLanguage(text) {
    if (!autoDetectLanguage) return currentLanguage

    const devanagariPattern = /[अ-ह]/
    const nepaliWords = ["के", "छ", "हो", "गर्छ", "भन", "देखाउ", "बारे", "कसरी", "कहाँ", "कति", "किन", "कुन"]
    const englishWords = ["what", "how", "where", "when", "why", "who", "show", "tell", "about", "contact"]

    if (devanagariPattern.test(text)) return "ne"

    const lowerText = text.toLowerCase()
    const nepaliCount = nepaliWords.filter((word) => lowerText.includes(word)).length
    const englishCount = englishWords.filter((word) => lowerText.includes(word)).length

    return nepaliCount > englishCount ? "ne" : "en"
  }

  /* Flattened corpus for fuzzy search with language support */
  function getCorpus(lang = "en") {
    const kb = KB[lang]
    return [
      ...kb.about,
      ...kb.education,
      ...kb.projects.map((p) => `${p.title}: ${p.desc}`),
      ...Object.entries(kb.skills).flatMap(([k, arr]) => [k, ...arr]),
      ...kb.services,
      `Email: ${kb.contact.email}`,
      `Phone: ${kb.contact.phone}`,
      `LinkedIn: ${kb.contact.linkedin}`,
      `Location: ${kb.contact.location}`,
      `Website: ${kb.contact.website}`,
      ...kb.contact.hours.map((h) => `Hours: ${h}`),
    ]
  }

  /* ---------- Suggestion Chips with Language Support ---------- */
  const suggestions = {
    en: [
      "Who is Prashanta?",
      "Show skills",
      "Show projects",
      "Education details",
      "What services do you offer?",
      "How to contact you?",
      "Working hours?",
    ],
    ne: [
      "प्रशान्त को हुन्?",
      "सीपहरू देखाउनुहोस्",
      "परियोजनाहरू देखाउनुहोस्",
      "शिक्षाको विवरण",
      "तपाईं के सेवाहरू प्रदान गर्नुहुन्छ?",
      "कसरी सम्पर्क गर्ने?",
      "काम गर्ने समय?",
    ],
  }

  function renderSuggestions(lang = currentLanguage, list = null) {
    const suggestionList = list || suggestions[lang] || suggestions.en
    suggestionsWrap.innerHTML = ""
    suggestionList.forEach((txt) => {
      const chip = document.createElement("button")
      chip.className = "chip"
      chip.innerText = txt
      chip.onclick = () => sendUser(txt)
      suggestionsWrap.appendChild(chip)
    })
  }

  /* ---------- Chat Helpers ---------- */
  function addMsg(text, who = "bot", asHTML = false) {
    const div = document.createElement("div")
    div.className = `msg ${who}`
    if (asHTML) div.innerHTML = text
    else div.textContent = text
    chat.appendChild(div)
    chat.scrollTop = chat.scrollHeight
  }

  function addTyping() {
    const row = document.createElement("div")
    row.className = "typing"
    row.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>'
    chat.appendChild(row)
    chat.scrollTop = chat.scrollHeight
    return () => row.remove()
  }

  /* ---------- Answer Builders with Language Support ---------- */
  const kw = (s, arr) => arr.some((k) => s.includes(k))

  function htmlTags(items) {
    return items.map((i) => `<span class="tag">${i}</span>`).join("")
  }

  function answerAbout(lang = "en") {
    const kb = KB[lang]
    const title = lang === "ne" ? "प्रशान्त भुसालको बारेमा" : "About Prashanta Bhusal"
    return `<div class="card"><strong>${title}</strong><div style="margin-top:8px;color:#374151">
      ${kb.about.map((p) => `<p style="margin:6px 0">${p}</p>`).join("")}
    </div></div>`
  }

  function answerSkills(lang = "en") {
    const kb = KB[lang]
    const sections = Object.entries(kb.skills).map(
      ([title, lines]) => `
      <div class="card">
        <strong>${title}</strong>
        <div style="margin-top:8px;color:#374151">
          ${lines.map((l) => `<p style="margin:4px 0">${l}</p>`).join("")}
        </div>
      </div>
    `,
    )
    return `<div class="grid">${sections.join("")}</div>`
  }

  function answerProjects(lang = "en") {
    const kb = KB[lang]
    const cards = kb.projects.map(
      (p) => `
      <div class="card">
        <strong>${p.title}</strong>
        <p style="margin:6px 0;color:#374151">${p.desc}</p>
      </div>
    `,
    )
    return `<div class="grid">${cards.join("")}</div>`
  }

  function answerEducation(lang = "en") {
    const kb = KB[lang]
    const title = lang === "ne" ? "शैक्षिक पृष्ठभूमि" : "Education Background"
    return `<div class="card"><strong>${title}</strong>
      <div style="margin-top:8px;color:#374151">
        ${kb.education.map((e) => `<p style="margin:6px 0">${e}</p>`).join("")}
      </div>
    </div>`
  }

  function answerServices(lang = "en") {
    const kb = KB[lang]
    const title = lang === "ne" ? "प्रदान गरिएका सेवाहरू" : "Services Offered"
    return `<div class="card"><strong>${title}</strong><div style="margin-top:8px">${htmlTags(kb.services)}</div></div>`
  }

  function answerContact(lang = "en") {
    const kb = KB[lang]
    const titles =
      lang === "ne"
        ? { contact: "सम्पर्क जानकारी", hours: "काम गर्ने समय" }
        : { contact: "Contact Information", hours: "Working Hours" }

    return `<div class="grid">
      <div class="card"><strong>${titles.contact}</strong>
        <p style="margin:6px 0">📧 Email: <a href="mailto:${kb.contact.email}" style="color:#6366f1">${kb.contact.email}</a></p>
        <p style="margin:6px 0">📱 Phone: <a href="tel:${kb.contact.phone}" style="color:#6366f1">${kb.contact.phone}</a></p>
        <p style="margin:6px 0">💼 LinkedIn: <a href="https://${kb.contact.linkedin}" target="_blank" style="color:#6366f1">${kb.contact.linkedin}</a></p>
        <p style="margin:6px 0">🌐 Website: <a href="https://${kb.contact.website}" target="_blank" style="color:#6366f1">${kb.contact.website}</a></p>
        <p style="margin:6px 0">📍 Location: ${kb.contact.location}</p>
      </div>
      <div class="card"><strong>${titles.hours}</strong>
        <div style="margin-top:8px;color:#374151">
          ${kb.contact.hours.map((h) => `<p style="margin:4px 0">⏰ ${h}</p>`).join("")}
        </div>
      </div>
    </div>`
  }

  /* ---------- Enhanced AI Response System with Language Support ---------- */
  function generateGeneralResponse(query, lang = "en") {
    const responses = {
      en: [
        "I'm here to help you learn more about Prashanta Bhusal and his work. Feel free to ask about his skills, projects, education, or services!",
        "That's an interesting question! While I specialize in information about Prashanta, I can tell you about his expertise in web development, graphics, and AI solutions.",
        "I'd be happy to help! I have comprehensive information about Prashanta's background, skills, projects, and services. What would you like to know?",
        "Great question! I'm designed to provide detailed information about Prashanta Bhusal's professional background and capabilities. Try asking about his skills or projects!",
      ],
      ne: [
        "म तपाईंलाई प्रशान्त भुसाल र उहाँको कामको बारेमा जान्न मद्दत गर्न यहाँ छु। उहाँका सीपहरू, परियोजनाहरू, शिक्षा, वा सेवाहरूको बारेमा सोध्न नहिचकिचाउनुहोस्!",
        "त्यो एक रोचक प्रश्न हो! जबकि म प्रशान्तको जानकारीमा विशेषज्ञ छु, म तपाईंलाई वेब विकास, ग्राफिक्स, र AI समाधानहरूमा उहाँको विशेषज्ञताको बारेमा बताउन सक्छु।",
        "म मद्दत गर्न खुसी हुनेछु! मसँग प्रशान्तको पृष्ठभूमि, सीपहरू, परियोजनाहरू, र सेवाहरूको बारेमा विस्तृत जानकारी छ। तपाईं के जान्न चाहनुहुन्छ?",
        "उत्कृष्ट प्रश्न! म प्रशान्त भुसालको व्यावसायिक पृष्ठभूमि र क्षमताहरूको बारेमा विस्तृत जानकारी प्रदान गर्न डिजाइन गरिएको छु। उहाँका सीपहरू वा परियोजनाहरूको बारेमा सोध्ने प्रयास गर्नुहोस्!",
      ],
    }
    const langResponses = responses[lang] || responses.en
    return langResponses[Math.floor(Math.random() * langResponses.length)]
  }

  /* ---------- Fuzzy Search with Language Support ---------- */
  function sim(a, b) {
    const ta = a
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
    const tb = b
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
    const setA = new Set(ta),
      setB = new Set(tb)
    let inter = 0
    setA.forEach((t) => {
      if (setB.has(t)) inter++
    })
    const jacc = inter / Math.max(1, setA.size + setB.size - inter)
    return jacc
  }

  function bestCorpus(q, lang = "en") {
    let best = { s: "", score: 0 }
    const corpus = getCorpus(lang)
    corpus.forEach((s) => {
      const score = sim(q, s)
      if (score > best.score) best = { s, score }
    })
    return best.score >= 0.15 ? best.s : null
  }

  /* ---------- Route Queries with Language Support ---------- */
  function route(q) {
    const detectedLang = detectLanguage(q)
    currentLanguage = detectedLang
    const s = q.toLowerCase()

    // English keywords
    const aboutKeywords = ["who are you", "who is prashanta", "about", "bio", "yourself", "introduce"]
    const skillKeywords = ["skill", "skills", "stack", "tech", "tools", "expertise", "abilities"]
    const projectKeywords = ["project", "work", "portfolio", "examples", "showcase"]
    const educationKeywords = ["educat", "school", "grade", "study", "academic", "qualification"]
    const serviceKeywords = ["service", "offer", "what do you do", "can you do", "provide"]
    const contactKeywords = [
      "contact",
      "email",
      "phone",
      "linkedin",
      "website",
      "location",
      "address",
      "hours",
      "time",
      "schedule",
      "reach",
    ]

    // Nepali keywords
    const aboutKeywordsNe = ["को हुन्", "बारे", "परिचय", "तपाईं को"]
    const skillKeywordsNe = ["सीप", "क्षमता", "प्राविधिक", "उपकरण"]
    const projectKeywordsNe = ["परियोजना", "काम", "पोर्टफोलियो", "उदाहरण"]
    const educationKeywordsNe = ["शिक्षा", "स्कूल", "अध्ययन", "योग्यता"]
    const serviceKeywordsNe = ["सेवा", "प्रदान", "के गर्छ", "के गर्नुहुन्छ"]
    const contactKeywordsNe = ["सम्पर्क", "इमेल", "फोन", "ठेगाना", "समय"]

    if (kw(s, [...aboutKeywords, ...aboutKeywordsNe])) return { html: answerAbout(detectedLang) }
    if (kw(s, [...skillKeywords, ...skillKeywordsNe])) return { html: answerSkills(detectedLang) }
    if (kw(s, [...projectKeywords, ...projectKeywordsNe])) return { html: answerProjects(detectedLang) }
    if (kw(s, [...educationKeywords, ...educationKeywordsNe])) return { html: answerEducation(detectedLang) }
    if (kw(s, [...serviceKeywords, ...serviceKeywordsNe])) return { html: answerServices(detectedLang) }
    if (kw(s, [...contactKeywords, ...contactKeywordsNe])) return { html: answerContact(detectedLang) }

    const hit = bestCorpus(s, detectedLang)
    if (hit) {
      const title = detectedLang === "ne" ? "यहाँ मैले फेला पारेको छु:" : "Here's what I found:"
      return {
        html: `<div class="card"><strong>${title}</strong><p style="margin-top:8px;color:#374151">${hit}</p></div>`,
      }
    }

    // General AI response for any other questions
    const generalResponse = generateGeneralResponse(s, detectedLang)
    const helpText = detectedLang === "ne" ? "म तपाईंलाई यी कुराहरूमा मद्दत गर्न सक्छु:" : "I can help you with:"
    const helpItems =
      detectedLang === "ne"
        ? "• प्रशान्त र उहाँको पृष्ठभूमि<br>• सीपहरू र प्राविधिक विशेषज्ञता<br>• परियोजनाहरू र पोर्टफोलियो<br>• शिक्षा र योग्यताहरू<br>• प्रदान गरिएका सेवाहरू<br>• सम्पर्क जानकारी र काम गर्ने समय"
        : "• About Prashanta & his background<br>• Skills & technical expertise<br>• Projects & portfolio<br>• Education & qualifications<br>• Services offered<br>• Contact information & working hours"

    return {
      html: `<div class="card"><strong>${detectedLang === "ne" ? "नमस्कार!" : "Hello!"}</strong><p style="margin-top:8px;color:#374151">${generalResponse}</p><div style="margin-top:12px"><strong>${helpText}</strong><br>${helpItems}</div></div>`,
    }
  }

  /* ---------- Enhanced Voice Features with Improved Quality ---------- */
  let voiceEnabled = true
  let isListening = false

  if (voiceToggle) {
    voiceToggle.onclick = () => {
      voiceEnabled = !voiceEnabled
      voiceToggle.style.background = voiceEnabled ? "#6366f1" : "#6b7280"
      voiceToggle.style.color = "white"
    }
  }

  function pickVoice(lang = "en") {
    const list = window.speechSynthesis.getVoices()
    if (!list.length) return null

    // Quality indicators for better voice selection
    const qualityIndicators = ["neural", "natural", "premium", "enhanced", "online", "cloud"]
    const maleIndicators = ["male", "man", "david", "mark", "ryan", "brian"]
    const femaleIndicators = ["female", "woman", "aria", "zira", "samantha", "karen", "susan"]

    function getVoiceQuality(voice) {
      let score = 0
      const name = voice.name.toLowerCase()

      // Prioritize neural/natural voices
      if (qualityIndicators.some((indicator) => name.includes(indicator))) score += 10

      // Prefer local voices over remote for better performance
      if (voice.localService) score += 5

      // Gender preference (slightly prefer female for assistant)
      if (femaleIndicators.some((indicator) => name.includes(indicator))) score += 2

      return score
    }

    if (lang === "ne") {
      // Enhanced Nepali voice selection
      const nepaliVoices = list.filter((v) => {
        const name = v.name.toLowerCase()
        const lang = v.lang.toLowerCase()
        return (
          lang.includes("ne") ||
          lang.includes("nepal") ||
          name.includes("nepali") ||
          // High-quality Hindi voices that work well for Nepali
          (lang.includes("hi") && (name.includes("neural") || name.includes("natural") || name.includes("premium")))
        )
      })

      if (nepaliVoices.length) {
        // Sort by quality and return the best
        nepaliVoices.sort((a, b) => getVoiceQuality(b) - getVoiceQuality(a))
        return nepaliVoices[0]
      }

      // Fallback to best Hindi voice
      const hindiVoices = list.filter((v) => v.lang.toLowerCase().includes("hi"))
      if (hindiVoices.length) {
        hindiVoices.sort((a, b) => getVoiceQuality(b) - getVoiceQuality(a))
        return hindiVoices[0]
      }
    }

    // Enhanced English voice selection
    const preferredEnglishVoices = [
      // Premium/Neural voices (highest priority)
      "Microsoft Aria Online (Natural)",
      "Google UK English Female",
      "Google US English",
      "Microsoft Zira Desktop",
      "Microsoft David Desktop",
      // Fallback voices
      "Alex",
      "Samantha",
      "Karen",
      "Susan",
    ]

    // Try preferred voices first
    for (const preferred of preferredEnglishVoices) {
      const voice = list.find((v) => v.name.includes(preferred))
      if (voice) return voice
    }

    // Get all English voices and sort by quality
    const englishVoices = list.filter(
      (v) =>
        v.lang.toLowerCase().includes("en") ||
        v.lang.toLowerCase().includes("us") ||
        v.lang.toLowerCase().includes("gb"),
    )

    if (englishVoices.length) {
      englishVoices.sort((a, b) => getVoiceQuality(b) - getVoiceQuality(a))
      return englishVoices[0]
    }

    // Final fallback
    return list[0]
  }

  function speak(text, isVoiceTriggered = false, lang = "en") {
    if (!voiceEnabled || !("speechSynthesis" in window) || !isVoiceTriggered) return

    window.speechSynthesis.cancel() // Stop any ongoing speech

    // Enhanced text cleaning for better pronunciation
    const clean = text
      .replace(/<[^>]+>/g, " ") // Remove HTML tags
      .replace(/[📧📱💼🌐📍⏰]/gu, "") // Remove emojis
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/([.!?])\s*([A-Z])/g, "$1 $2") // Add space after punctuation
      .trim()

    // Smart text chunking for natural pauses
    const sentences = clean.split(/(?<=[.?!।])\s+/g).filter(Boolean)
    let currentIndex = 0

    const speakNext = () => {
      if (currentIndex >= sentences.length) return

      const sentence = sentences[currentIndex]
      const utterance = new SpeechSynthesisUtterance(sentence)

      // Get the best voice for the language
      const selectedVoice = pickVoice(lang)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      // Enhanced language and voice parameters
      if (lang === "ne") {
        utterance.lang = "ne-NP"
        utterance.rate = 0.75 // Slower for better Nepali pronunciation
        utterance.pitch = 1.1 // Slightly higher pitch for clarity
        utterance.volume = 0.9
      } else {
        utterance.lang = "en-US"
        utterance.rate = 0.85 // Natural speaking pace
        utterance.pitch = 1.0 // Natural pitch
        utterance.volume = 0.9
      }

      // Add natural pauses between sentences
      utterance.onstart = () => {
        console.log(`[v0] Speaking: "${sentence.substring(0, 50)}..."`)
      }

      utterance.onend = () => {
        currentIndex++
        // Add a small pause between sentences for naturalness
        setTimeout(() => speakNext(), 200)
      }

      utterance.onerror = (event) => {
        console.log(`[v0] Speech error: ${event.error}`)
        currentIndex++
        setTimeout(() => speakNext(), 100)
      }

      // Speak the current sentence
      window.speechSynthesis.speak(utterance)
    }

    // Ensure voices are loaded before speaking
    if (!window.speechSynthesis.getVoices().length) {
      window.speechSynthesis.onvoiceschanged = () => {
        setTimeout(() => speakNext(), 100) // Small delay for voice loading
      }
    } else {
      speakNext()
    }
  }

  /* Enhanced Speech-to-text with Nepali support */
  let recognizer = null
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (SpeechRecognition) {
    recognizer = new SpeechRecognition()
    recognizer.continuous = false
    recognizer.interimResults = false
    recognizer.lang = "en-US" // Default to English

    const updateMicButton = () => {
      const langIndicator = micBtn.querySelector(".lang-indicator")
      if (langIndicator) {
        langIndicator.textContent = recognizer.lang === "ne-NP" ? "🇳🇵" : "🇺🇸"
      }
    }

    micBtn.onclick = () => {
      if (isListening) {
        recognizer.stop()
        return
      }

      try {
        // Cycle between languages
        const languages = ["en-US", "ne-NP"]
        const currentIndex = languages.indexOf(recognizer.lang)
        recognizer.lang = languages[(currentIndex + 1) % languages.length]

        updateMicButton()
        recognizer.start()
        isListening = true
        micBtn.style.background = "#ef4444"
      } catch (error) {
        console.log("[v0] Speech recognition error:", error)
        alert("Voice input not available. Please try again.")
      }
    }

    recognizer.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      sendUser(transcript, true) // Pass true to indicate voice input
      isListening = false
      micBtn.style.background = "#6366f1"
      updateMicButton()
    }

    recognizer.onerror = (e) => {
      console.log("[v0] Speech recognition error:", e.error)
      isListening = false
      micBtn.style.background = "#6366f1"
      updateMicButton()
      if (e.error !== "aborted") {
        const errorMsg =
          recognizer.lang === "ne-NP"
            ? "आवाज पहिचान असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।"
            : "Voice recognition failed. Please try again."
        alert(errorMsg)
      }
    }

    recognizer.onend = () => {
      isListening = false
      micBtn.style.background = "#6366f1"
      updateMicButton()
    }

    // Initialize mic button
    updateMicButton()
  } else {
    micBtn.onclick = () => alert("Voice input not supported in this browser.")
  }

  /* ---------- Send & Flow ---------- */
  function sendUser(text, isVoiceInput = false) {
    if (!text) return
    addMsg(text, "user")
    input.value = ""
    const stopTyping = addTyping()

    setTimeout(() => {
      stopTyping()
      const { html } = route(text)
      addMsg(html, "bot", true)

      if (isVoiceInput) {
        speak(html, true, currentLanguage)
      }

      const suggestionLang = currentLanguage
      if (/skill|सीप/i.test(text))
        renderSuggestions(
          suggestionLang,
          suggestionLang === "ne"
            ? ["परियोजनाहरू देखाउनुहोस्", "शिक्षाको विवरण", "के सेवाहरू प्रदान गर्नुहुन्छ?", "कसरी सम्पर्क गर्ने?"]
            : ["Show projects", "Education details", "What services do you offer?", "How to contact you?"],
        )
      else if (/project|work|परियोजना|काम/i.test(text))
        renderSuggestions(
          suggestionLang,
          suggestionLang === "ne"
            ? ["सीपहरू देखाउनुहोस्", "शिक्षाको विवरण", "सम्पर्क जानकारी", "काम गर्ने समय?"]
            : ["Show skills", "Education details", "Contact info", "Working hours?"],
        )
      else if (/educat|school|शिक्षा|स्कूल/i.test(text))
        renderSuggestions(
          suggestionLang,
          suggestionLang === "ne"
            ? ["सीपहरू देखाउनुहोस्", "परियोजनाहरू देखाउनुहोस्", "सम्पर्क जानकारी", "काम गर्ने समय?"]
            : ["Show skills", "Show projects", "Contact info", "Working hours?"],
        )
      else if (/service|offer|सेवा|प्रदान/i.test(text))
        renderSuggestions(
          suggestionLang,
          suggestionLang === "ne"
            ? ["परियोजनाहरू देखाउनुहोस्", "सीपहरू देखाउनुहोस्", "सम्पर्क जानकारी"]
            : ["Show projects", "Show skills", "Contact info"],
        )
      else if (/contact|email|phone|linkedin|hours|time|schedule|सम्पर्क|इमेल|फोन|समय/i.test(text))
        renderSuggestions(
          suggestionLang,
          suggestionLang === "ne"
            ? ["काम गर्ने समय?", "सेवाहरू देखाउनुहोस्", "परियोजनाहरू देखाउनुहोस्"]
            : ["Working hours?", "Show services", "Show projects"],
        )
      else renderSuggestions(suggestionLang)
    }, 800)
  }

  sendBtn.onclick = () => sendUser(input.value.trim())
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendUser(input.value.trim())
  })

  /* ---------- Initialize ---------- */a
  renderSuggestions()

  console.log("[v0] Enhanced AI Assistant with advanced features initialized successfully")
})()
const fab = document.querySelector('.ai-fab');

let isDragging = false;
let offsetX, offsetY;

fab.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - fab.getBoundingClientRect().left;
  offsetY = e.clientY - fab.getBoundingClientRect().top;
  fab.style.transition = "none"; // disable smooth animation while dragging
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    fab.style.left = e.clientX - offsetX + "px";
    fab.style.top = e.clientY - offsetY + "px";
    fab.style.transform = "translate(0, 0)"; // reset centering transform after move
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  fab.style.transition = "all 0.2s ease"; // re-enable animation
});

