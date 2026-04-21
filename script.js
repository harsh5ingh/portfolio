const profile = {
  name: "Harsh Kumar",
  qualification: "Harsh Kumar is pursuing B.Tech from LNCT&S, Bhopal in Computer Science Engineering, Cyber Security branch. He is currently in 4th semester / 2nd year.",
  skills: "Skills: C++, JavaScript, HTML, CSS, Python, SQL, MySQL, Docker, Kubernetes, Burp Suite, Blender 3D, GitHub, and GitLab.",
  learning: "Currently learning DSA, bug bounty, TryHackMe, and What The Hack.",
  contact: "Email: harrshdev52@gmail.com | Phone: +91 9456321455 | GitHub: github.com/harshsingh | LinkedIn: linkedin.com/in/harshsingh",
  projects: "Current project focus: bug bounty notes, TryHackMe labs, and Python security scripts."
};

const body = document.body;
const themeToggle = document.querySelector("#themeToggle");
const canvas = document.querySelector("#matrix");
const ctx = canvas.getContext("2d");
const chatWindow = document.querySelector("#chatWindow");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const connectForm = document.querySelector("#connectForm");
const year = document.querySelector("#year");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const pageLoader = document.querySelector("#pageLoader");
const scrollProgress = document.querySelector("#scrollProgress");

year.textContent = new Date().getFullYear();

function localAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes("qual") || q.includes("college") || q.includes("education") || q.includes("semester") || q.includes("year")) return profile.qualification;
  if (q.includes("skill") || q.includes("tech") || q.includes("stack")) return profile.skills;
  if (q.includes("learn") || q.includes("bug") || q.includes("tryhackme") || q.includes("hack")) return profile.learning;
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("mobile") || q.includes("github") || q.includes("linkedin")) return profile.contact;
  if (q.includes("project") || q.includes("work")) return profile.projects;
  return "You can ask about qualification, skills, learning, projects, contact, or GitHub.";
}

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `chat-message ${type}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function askAssistant(question) {
  addMessage(question, "user");
  chatInput.value = "";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    if (!res.ok) throw new Error("API unavailable");
    const data = await res.json();
    addMessage(data.answer || localAnswer(question), "bot");
  } catch {
    addMessage(localAnswer(question), "bot");
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (question) askAssistant(question);
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => askAssistant(button.dataset.question));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

themeToggle.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  body.dataset.theme = nextTheme;
  themeToggle.textContent = nextTheme === "dark" ? "Light" : "Dark";
  localStorage.setItem("theme", nextTheme);
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === "dark" ? "Light" : "Dark";
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    pageLoader.classList.add("loaded");
  }, 550);
});

connectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#senderName").value.trim();
  const message = document.querySelector("#senderMessage").value.trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const bodyText = encodeURIComponent(`${message}\n\nFrom: ${name}`);
  window.location.href = `mailto:harrshdev52@gmail.com?subject=${subject}&body=${bodyText}`;
});

let columns = [];
const glyphs = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&<>[]{}";
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  columns = Array.from({ length: Math.ceil(window.innerWidth / 18) }, () => ({ y: Math.random() * window.innerHeight, speed: 1 + Math.random() * 2.4 }));
}
function drawMatrix() {
  const isLight = body.dataset.theme === "light";
  ctx.fillStyle = isLight ? "rgba(246,251,249,.14)" : "rgba(4,17,15,.16)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.font = "14px Consolas, monospace";
  columns.forEach((column, index) => {
    ctx.fillStyle = Math.random() > 0.985 ? "#50d6ff" : "#42f5a7";
    ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], index * 18, column.y);
    column.y += column.speed * 12;
    if (column.y > window.innerHeight + 40) column.y = -40;
  });
  requestAnimationFrame(drawMatrix);
}

function updateScrollMotion() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  body.style.setProperty("--scroll-shift", `${Math.min(window.scrollY * 0.025, 24)}px`);
}

const revealItems = [
  ...document.querySelectorAll(".section, .metrics, .skill-card, .project-card, .connect-form")
];

revealItems.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", updateScrollMotion, { passive: true });
resizeCanvas();
drawMatrix();
updateScrollMotion();
