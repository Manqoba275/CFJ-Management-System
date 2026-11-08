// Runs the browser-only website demo. These local records are separate from the Oracle profile service.
/* CFJ local app state key: all demo data is stored in the browser for offline use. */
// Demo records contain JSON values only; this also supports older Android WebViews.
function cloneDemoData(value) { return JSON.parse(JSON.stringify(value)); }
const STORAGE_KEY = "cfj_multi_page_working_app";

/* The current month is used to decide whether a member has paid and can view manuals. */
const currentMonth = new Date().toISOString().slice(0, 7);
const today = new Date().toISOString().slice(0, 10);

/* Seed data gives the lecturer working accounts and sample records immediately. */
const seed = {
  session: null,
  users: [
    { id: "U-ADMIN", role: "admin", email: "admin@cfjfit.co.za", password: "admin123", name: "CFJ Admin" },
    { id: "U-STAFF", role: "staff", email: "staff@cfjfit.co.za", password: "staff123", name: "CFJ Staff", active: true },
    { id: "U-1001", role: "member", email: "anele@cfjfit.co.za", password: "member123", memberId: "M-1001", name: "Anele Mokoena" }
  ],
  members: [
    { id: "M-1001", userId: "U-1001", name: "Anele Mokoena", email: "anele@cfjfit.co.za", phone: "+27 71 222 1001", goal: "Build strength", goals: ["Build strength"], body: "Mesomorph", medical: "Shoulder mobility focus", measurements: "82kg, waist 84cm", workout: "Strength", intensity: "Medium", notifications: true, time: "17:30", joined: "2026-05-01", photo: "" },
    { id: "M-1002", userId: null, name: "Zama Dlamini", email: "zama@cfjfit.co.za", phone: "+27 72 333 1002", goal: "Muscle tone", body: "Ectomorph", medical: "", measurements: "64kg", workout: "Mixed", intensity: "Medium", notifications: false, time: "17:30", joined: "2026-05-04", photo: "" },
    { id: "M-1003", userId: null, name: "Neo Patel", email: "neo@cfjfit.co.za", phone: "+27 73 444 1003", goal: "Endurance", body: "Mesomorph", medical: "", measurements: "76kg", workout: "Cardio", intensity: "High", notifications: true, time: "06:00", joined: "2026-05-07", photo: "" }
  ],
  classes: [
    { id: "C-1", name: "Strength Anatomy", type: "Strength", trainer: "Lindiwe Jacobs", date: today, time: "17:30", spaces: 4 },
    { id: "C-2", name: "HIIT Conditioning", type: "Cardio", trainer: "Thabo Nkosi", date: today, time: "06:00", spaces: 6 },
    { id: "C-3", name: "Mobility Reset", type: "Mobility", trainer: "Mia Naidoo", date: today, time: "18:30", spaces: 2 }
  ],
  trainers: [
    { id: "T-1", name: "Lindiwe Jacobs", specialisation: "Strength", language: "English", rating: 4.9, availability: "Mon, Wed, Fri", bio: "Strength coach focused on posture, progressive overload, and safe lifting technique." },
    { id: "T-2", name: "Thabo Nkosi", specialisation: "HIIT", language: "Zulu", rating: 4.7, availability: "Tue, Thu", bio: "Conditioning coach for stamina, weight loss, and high-energy circuits." },
    { id: "T-3", name: "Mia Naidoo", specialisation: "Mobility", language: "Venda", rating: 4.8, availability: "Sat, Sun", bio: "Mobility coach for recovery, flexibility, and injury prevention." }
  ],
  payments: [
    { id: "P-1", memberId: "M-1001", month: currentMonth, amount: 450, method: "Online", channel: "Email", date: today, confirmation: "Email sent to anele@cfjfit.co.za confirming R450 membership payment." }
  ],
  bookings: [],
  trainingLog: [],
  attendance: [],
  trainerRequests: [],
  trainerReviews: [],
  friendConnections: []
};

/* Original training plans use the supplied anatomy/workout images as visual references. */
const manuals = [
  { id: "strength-chest", goal: "Build strength", area: "Chest", title: "Chest Strength Foundation", image: "assets/training/chest-workout.jpg", illustration: "assets/training/illustrations/chest.svg", duration: "35 min", level: "Foundation", equipment: "Bench or clear floor space; optional light dumbbells", steps: ["Warm up with easy arm circles and wall press-ups for 5 minutes.", "Choose a comfortable chest press or incline push-up and complete 3 sets of 6 to 8 reps.", "Keep wrists stacked over elbows and lower with control.", "Rest 75 to 90 seconds between sets, breathing normally.", "Finish with gentle chest and shoulder mobility; stop for sharp pain."] },
  { id: "strength-back", goal: "Build strength", area: "Back", title: "Back Pulling Strength", image: "assets/training/back-workout.jpg", illustration: "assets/training/illustrations/back.svg", duration: "35 min", level: "Foundation", equipment: "Resistance band or cable row; optional light dumbbells", steps: ["Warm up with relaxed shoulder rolls and very light rows for 5 minutes.", "Complete 3 sets of 8 to 10 band or cable rows, keeping the torso steady.", "Add 2 sets of 8 light hip hinges only if the movement feels comfortable.", "Rest 60 to 90 seconds and keep every repetition smooth.", "Cool down with gentle upper-back movement; do not force a stretch."] },
  { id: "strength-legs", goal: "Build strength", area: "Legs", title: "Lower-body Strength Basics", image: "assets/training/leg-workout.jpg", illustration: "assets/training/illustrations/legs.svg", duration: "35 min", level: "Foundation", equipment: "Stable chair or bench; optional light weights", steps: ["Warm up with an easy walk and supported sit-to-stands for 5 minutes.", "Complete 3 sets of 8 chair squats, using a chair for support if needed.", "Complete 2 sets of 8 supported hip hinges with a neutral back.", "Rest 60 to 90 seconds and keep the movement pain-free.", "Finish with a relaxed walk; increase load only when your form stays steady."] },
  { id: "strength-arms", goal: "Build strength", area: "Arms", title: "Arms and Shoulder Control", image: "assets/training/arm-workout.jpg", illustration: "assets/training/illustrations/arms.svg", duration: "30 min", level: "Foundation", equipment: "Light dumbbells or resistance band", steps: ["Warm up shoulders and elbows with comfortable unloaded movements.", "Complete 2 to 3 sets of 8 to 10 light curls and band press-downs.", "Keep elbows close to your sides and avoid swinging the weights.", "Rest 60 seconds between exercises and reduce the load if form changes.", "Finish with gentle arm movement; avoid painful overhead positions."] },
  { id: "weight-loss-legs", goal: "Weight loss", area: "Legs", title: "Low-impact Leg Circuit", image: "assets/training/leg-workout.jpg", illustration: "assets/training/illustrations/legs.svg", duration: "25 min", level: "All levels", equipment: "Stable chair and open floor space", steps: ["Warm up with an easy walk or marching in place for 5 minutes.", "Cycle through 8 chair squats, 8 supported step-backs per side, and 30 seconds of easy marching.", "Repeat for 2 to 4 rounds at a pace that lets you speak in short sentences.", "Rest whenever needed and use the chair for balance.", "Cool down with slow walking; progress by adding time gradually, not by rushing."] },
  { id: "weight-loss-core", goal: "Weight loss", area: "Core", title: "Core and Cardio Intervals", image: "assets/training/core-workout.jpg", illustration: "assets/training/illustrations/core.svg", duration: "20 min", level: "All levels", equipment: "Mat or clear floor space", steps: ["Warm up with easy walking and comfortable trunk rotations for 5 minutes.", "Alternate 20 seconds of standing marches with 20 seconds of rest for 6 rounds.", "Add 2 sets of 6 controlled dead-bug repetitions per side if comfortable.", "Keep breathing; choose standing options if getting to the floor is difficult.", "Cool down gradually. Exercise supports wellbeing but does not guarantee weight loss."] },
  { id: "tone-legs", goal: "Muscle tone", area: "Legs", title: "Leg Control and Balance", image: "assets/training/leg-workout.jpg", illustration: "assets/training/illustrations/legs.svg", duration: "30 min", level: "Foundation", equipment: "Stable chair; optional light dumbbells", steps: ["Warm up with an easy walk and supported heel raises for 5 minutes.", "Complete 3 sets of 10 sit-to-stands at a steady pace.", "Complete 2 sets of 10 supported calf raises, pausing briefly at the top.", "Rest 45 to 75 seconds and keep a stable support within reach.", "When all reps feel controlled, add one or two repetitions before adding load."] },
  { id: "tone-chest", goal: "Muscle tone", area: "Chest", title: "Upper-body Push Session", image: "assets/training/chest-workout.jpg", illustration: "assets/training/illustrations/chest.svg", duration: "30 min", level: "Foundation", equipment: "Wall or bench; optional light dumbbells", steps: ["Warm up with wall press-ups and relaxed shoulder movement for 5 minutes.", "Complete 3 sets of 8 to 12 wall or incline press-ups at a comfortable angle.", "Add 2 sets of 10 light chest presses only if you have safe equipment.", "Rest 45 to 75 seconds and use a range that feels controlled.", "Cool down with easy shoulder motion; gradual practice matters more than fatigue."] },
  { id: "tone-arms", goal: "Muscle tone", area: "Arms", title: "Arms and Upper-body Basics", image: "assets/training/arm-workout.jpg", illustration: "assets/training/illustrations/arms.svg", duration: "25 min", level: "Foundation", equipment: "Light dumbbells or resistance band", steps: ["Warm up with easy arm swings and shoulder rolls for 5 minutes.", "Complete 2 sets of 10 light curls and 2 sets of 10 band pull-aparts.", "Keep the movements smooth and stop each set before your form slips.", "Rest about 45 to 60 seconds between sets.", "Increase repetitions gradually; no single routine can guarantee a specific appearance."] },
  { id: "endurance-core", goal: "Endurance", area: "Core", title: "Core Stability for Endurance", image: "assets/training/core-workout.jpg", illustration: "assets/training/illustrations/core.svg", duration: "25 min", level: "Foundation", equipment: "Mat or stable chair", steps: ["Warm up with 5 minutes of easy walking and relaxed breathing.", "Complete 2 sets of 6 bird-dogs per side, moving slowly.", "Add 3 rounds of 20 seconds of standing marches with 20 seconds of rest.", "Keep breathing throughout and use a chair-supported option if needed.", "Build duration a few minutes at a time while keeping the movement comfortable."] },
  { id: "endurance-back", goal: "Endurance", area: "Back", title: "Back Endurance and Posture", image: "assets/training/back-workout.jpg", illustration: "assets/training/illustrations/back.svg", duration: "25 min", level: "Foundation", equipment: "Light resistance band", steps: ["Warm up with relaxed shoulder movement and an easy walk for 5 minutes.", "Complete 2 to 3 sets of 12 light band rows with controlled returns.", "Add 2 sets of 8 wall slides only through a comfortable range.", "Rest 45 to 60 seconds and keep shoulders relaxed rather than shrugged.", "Finish with easy walking. Stop and seek qualified advice if symptoms arise."] }
];

let state = normalizeState(loadState());
const page = document.body.dataset.page;
const toast = document.querySelector(".toast");
let foundationSession = null;
let foundationRestTimer = null;
let mobilitySession = null;
let mobilityTimer = null;
const mobilityExercises = [
  { name: "March and arm swings", focus: "Warm up · whole body", image: "assets/training/standing-mobility.jpg", alt: "At-home mobility warm-up on an exercise mat", cue: "March gently in place. Let your arms swing naturally and keep the steps easy." },
  { name: "Shoulder rolls", focus: "Shoulders · standing", image: "assets/training/mobility-standing-flow.jpg", alt: "Standing stretch on a yoga mat", cue: "Roll both shoulders up, back and down. Make slow, comfortable circles with your arms." },
  { name: "Standing side reach", focus: "Sides · standing", image: "assets/training/mobility-full-body.jpg", alt: "Full-body stretch at home on a mat", cue: "Reach one arm overhead and lean gently to the other side. Switch sides without forcing the range." },
  { name: "Cat and cow", focus: "Spine · hands and knees", image: "assets/training/floor-mobility.jpg", alt: "Floor-based mobility stretch at home", cue: "On hands and knees, gently round your back, then let your chest open. Move with your breath." },
  { name: "Thread the needle", focus: "Upper back · both sides", image: "assets/training/mobility-floor-stretch.jpg", alt: "Floor stretch on a mat", cue: "From hands and knees, slide one arm under your body. Return to centre and switch halfway through." },
  { name: "Hip flexor rocks", focus: "Hips · both sides", image: "assets/training/gentle-home-stretch.jpg", alt: "Gentle hip mobility stretch at home", cue: "In a supported half-kneeling position, gently shift your hips forward and back. Switch sides halfway through; use a chair for balance." },
  { name: "Seated hamstring hinge", focus: "Back of legs · seated", image: "assets/training/seated-mobility.jpg", alt: "Seated stretch on an exercise mat", cue: "Sit tall with one leg comfortably extended. Hinge slightly from the hips, then switch sides halfway through." },
  { name: "Ankle rocks", focus: "Ankles · wall support", image: "assets/training/hamstring-mobility.jpg", alt: "Gentle lower-body mobility stretch", cue: "With a wall or chair for support, move one knee gently forward over your toes while keeping the heel down. Switch sides halfway through." }
];
const foundationMovements = [
  { name: "Sit to stand", area: "Legs · stable chair", image: "assets/training/leg-workout.jpg", steps: "Sit near the front of a stable chair with feet flat. Lean forward slightly, stand under control, then slowly sit back down. Keep the chair against a wall." },
  { name: "Wall press-up", area: "Chest · wall", image: "assets/training/chest-workout.jpg", steps: "Face a wall with palms at chest height. Bend your elbows to bring your chest towards the wall, then press away smoothly. Keep your body aligned and breathe." },
  { name: "Supported calf raise", area: "Lower legs · chair support", image: "assets/training/leg-workout.jpg", steps: "Stand tall while holding a stable chair. Lift your heels while keeping your toes grounded, then lower slowly. Use the support for balance and avoid bouncing." }
];

document.addEventListener("DOMContentLoaded", init);

function init() {
  /* Shared startup tasks run on every page. */
  validateSession();
  if (!enforceRoleAccess()) return;
  setupTheme();
  setupRoleNavigation();
  setupFooter();
  setupRevealAnimation();
  updateSessionLink();
  renderOverviewMetrics();

  /* Page-specific controllers keep each HTML page focused and readable. */
  if (["login", "member-login", "staff-login", "admin-login"].includes(page)) setupLoginPage();
  if (page === "members") setupMembersPage();
  if (page === "operations") setupOperationsPage();
  if (page === "staff") setupStaffPage();
  if (page === "library") setupLibraryPage();
  if (page === "marathon") setupMarathonPage();
  if (page === "reports") setupReportsPage();
}

// These redirects guide the demo UI. Real data access must still be checked by the API.
function enforceRoleAccess() {
  const requiredRole = { members: 'member', operations: 'member', staff: 'staff', reports: 'admin' }[page];
  if (requiredRole && state.session?.role !== requiredRole) {
    location.replace(`${requiredRole}-login.html`);
    return false;
  }
  /* Admins only use admin pages; members and public users cannot use admin reports. */
  const memberPages = ["members", "operations"];
  if (state.session?.role === "admin" && memberPages.includes(page)) {
    location.href = "reports.html";
    return false;
  }
  if (state.session?.role === "admin" && !["overview", "demo-info", "reports", "login", "admin-login", "marathon"].includes(page)) {
    location.href = "reports.html";
    return false;
  }
  if (state.session?.role === "staff" && !["overview", "demo-info", "staff", "login", "staff-login", "marathon"].includes(page)) {
    location.href = "staff.html";
    return false;
  }
  if (page === "staff" && state.session?.role !== "staff") {
    location.href = "login.html";
    return false;
  }
  if (page === "reports" && state.session?.role !== "admin") {
    document.body.classList.remove("admin-active");
  }
  return true;
}

function setupRoleNavigation() {
  /* Navigation changes by role so members never see the Reports page. */
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const role = state.session?.role || "public";
  const links = [
    ["Home", "index.html", true],
    ["Programmes", "programmes.html", role === "public"],
    ["Training", "training.html", role === "public"],
    ["Memberships", "memberships.html", role === "public"],
    ["Join Marathon", "marathon.html", true],
    ["Members", "members.html", role === "member"],
    ["Operations", "operations.html", role === "member"],
    ["Staff", "staff.html", role === "staff"],
    ["Library", "library.html", role !== "staff" && role !== "admin"],
    ["Reports", "reports.html", role === "admin"]
  ];
  nav.innerHTML = links.filter(([, , visible]) => visible).map(([label, href]) => {
    const path = location.pathname.toLowerCase();
    const isHome = href === "index.html" && (path === "/" || path.endsWith("/index.html"));
    const active = isHome || path.endsWith(href.toLowerCase()) ? "active" : "";
    return `<a class="${active}" href="${href}">${label}</a>`;
  }).join("");
}

function setupFooter() {
  /* Footer uses copyright/legal/community links instead of duplicating main navigation. */
  document.querySelectorAll(".site-footer").forEach((footer) => {
    const role = state.session?.role || "public";
    const aboutLinks = role === "admin"
      ? `<a href="reports.html">Admin Reports</a>`
      : role === "staff"
        ? `<a href="staff.html">Staff Desk</a>`
        : `<a href="programmes.html">Programmes</a><a href="training.html">Training plans</a><a href="memberships.html">Membership options</a><a href="login.html">Demo sign in</a>`;
    const communityLinks = role === "staff" || role === "admin"
      ? `<a href="login.html" data-footer-logout="true">Logout</a>`
      : `<a href="members.html">Member area</a><a href="help.html">App help</a>`;
    footer.innerHTML = `
      <div class="footer-brand">
        <img src="assets/cfj-blue-logo.png" alt="CFJ Lifestyle Fitness logo">
        <p>Team Forge · School project, 2026. An independent demonstration; not CFJ's official booking service.</p>
      </div>
      <div class="footer-column">
        <h3>About</h3>
        ${aboutLinks}
      </div>
      <div class="footer-column">
        <h3>About this demo</h3>
        <a href="demo-info.html">Privacy, accounts & payments</a>
        <a href="help.html">Help and instructions</a>
      </div>
      <div class="footer-column">
        <h3>Useful links</h3>
        ${communityLinks}
      </div>
    `;
    footer.querySelectorAll("[data-footer-logout]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        state.session = null;
        saveState();
        location.href = "login.html";
      });
    });
  });
}

function setupTheme() {
  const root = document.documentElement;
  const key = "cfj_visual_theme";
  const saved = localStorage.getItem(key);
  const apply = (theme) => {
    root.dataset.theme = theme;
    const button = document.querySelector(".theme-toggle");
    if (button) {
      const next = theme === "dark" ? "light" : "dark";
      button.textContent = next === "light" ? "☀ Light theme" : "● Dark theme";
      button.setAttribute("aria-label", `Switch to ${next} theme`);
      button.setAttribute("aria-pressed", String(theme === "light"));
    }
  };
  apply(saved === "dark" ? "dark" : "light");
  const header = document.querySelector(".topbar");
  if (!header || header.querySelector(".theme-toggle")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-toggle";
  button.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(key, next);
    apply(next);
  });
  const login = header.querySelector(".nav-login");
  header.insertBefore(button, login || null);
  apply(root.dataset.theme);
}

function loadState() {
  /* If saved data is damaged, the app safely returns to seed data. */
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || cloneDemoData(seed);
  } catch {
    return cloneDemoData(seed);
  }
}

// Repair damaged saved collections while keeping valid records, including deliberately empty lists.
function normalizeState(savedState) {
  /* Older saved browser data is upgraded when new fields are added to the app. */
  const upgraded = { ...cloneDemoData(seed), ...savedState };
  // Integrates the reviewed recovery fix from PR #2 (cec0207).
  // Preserve valid records while repairing damaged saved collections.
  for (const [key, fallback] of Object.entries(seed)) {
    if (!Array.isArray(fallback)) continue;
    upgraded[key] = Array.isArray(upgraded[key])
      ? upgraded[key].filter((record) => record !== null && typeof record === "object" && !Array.isArray(record))
      : cloneDemoData(fallback);
  }
  seed.users.forEach((seedUser) => {
    if (!upgraded.users.some((user) => user.id === seedUser.id || user.email === seedUser.email)) {
      upgraded.users.push(seedUser);
    }
  });
  upgraded.members = upgraded.members.map((member) => ({
    body: "Mesomorph",
    medical: "",
    measurements: "",
    workout: "Mixed",
    intensity: "Medium",
    notifications: true,
    photo: "",
    ...member
  })).map((member) => ({ ...member, goals: member.goals?.length ? member.goals : [member.goal].filter(Boolean) }));
  upgraded.users = upgraded.users.map((user) => ({ active: true, ...user }));
  upgraded.classes = upgraded.classes.map((fitnessClass) => ({ date: today, ...fitnessClass }));
  upgraded.trainers = upgraded.trainers.map((trainer) => ({ language: "English", bio: "Certified CFJ trainer.", ...trainer }));
  upgraded.payments = upgraded.payments.map((payment) => ({ method: "Online", ...payment }));
  upgraded.trainerReviews = upgraded.trainerReviews || [];
  return upgraded;
}

function saveState() {
  /* Every working function calls this so data remains after refresh. */
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function validateSession() {
  /* If a staff account is removed by admin, its saved login is cleared. */
  if (!state.session?.userId) return;
  const user = state.users.find((item) => item.id === state.session.userId);
  if (!user || user.active === false) {
    state.session = null;
    saveState();
    if (page !== "login") location.href = "login.html";
  }
}

function setupRevealAnimation() {
  /* Small animation used across pages for the polished app feel. */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function updateSessionLink() {
  /* The login button becomes a working logout button after any user signs in. */
  const link = document.querySelector("#sessionLink") || document.querySelector(".nav-login");
  if (!link) return;
  if (!state.session) return;
  link.textContent = "Logout";
  link.href = "login.html";
  link.addEventListener("click", (event) => {
    event.preventDefault();
    state.session = null;
    saveState();
    location.href = "login.html";
  });
}

function setupLoginPage() {
  /* Role buttons now link to separate role login pages. This fallback supports old buttons if present. */
  document.querySelectorAll("[data-auth-panel]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".auth-switch-form").forEach((form) => form.classList.remove("active-auth-form"));
      document.querySelector(`#${button.dataset.authPanel}`).classList.add("active-auth-form");
    });
  });

  /* Member login authenticates against local demo users. */
  document.querySelector("#memberLoginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = getValue("#memberLoginEmail").toLowerCase();
    const password = getValue("#memberLoginPassword");
    const user = state.users.find((item) => item.role === "member" && item.email === email && item.password === password);
    if (!user) return showToast("Member login failed. Check email and password.");
    state.session = { role: "member", userId: user.id, memberId: user.memberId };
    saveState();
    location.href = "members.html";
  });

  /* Signup creates a user account and a linked member record. */
  document.querySelector("#signupForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = getValue("#signupEmail").toLowerCase();
    if (state.users.some((user) => user.email === email)) return showToast("That email already has an account.");

    const userId = createId("U", state.users);
    const memberId = createId("M", state.members);
    const member = {
      id: memberId,
      userId,
      name: getValue("#signupName"),
      email,
      phone: getValue("#signupPhone") || "No phone captured",
      goal: getValue("#signupGoal"),
      goals: [getValue("#signupGoal")],
      body: getValue("#signupBody"),
      medical: getValue("#signupMedical"),
      measurements: "",
      workout: "Mixed",
      intensity: "Medium",
      notifications: true,
      photo: "",
      time: getValue("#signupTime") || "17:30",
      joined: today
    };

    state.users.push({ id: userId, role: "member", email, password: getValue("#signupPassword"), memberId, name: member.name });
    state.members.push(member);
    state.session = { role: "member", userId, memberId };
    saveState();
    location.href = "members.html";
  });

  /* Admin login opens the reports page where management can view member/payment data. */
  document.querySelector("#staffLoginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = getValue("#staffEmail").toLowerCase();
    const password = getValue("#staffPassword");
    const staff = state.users.find((item) => item.role === "staff" && item.email === email && item.password === password && item.active !== false);
    if (!staff) return showToast("Staff login failed or staff account was removed.");
    state.session = { role: "staff", userId: staff.id };
    saveState();
    location.href = "staff.html";
  });

  document.querySelector("#adminLoginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = getValue("#adminEmail").toLowerCase();
    const password = getValue("#adminPassword");
    const admin = state.users.find((item) => item.role === "admin" && item.email === email && item.password === password);
    if (!admin) return showToast("Admin login failed.");
    state.session = { role: "admin", userId: admin.id };
    saveState();
    location.href = "reports.html";
  });
}

function setupMembersPage() {
  /* Members page requires member login for payments and confirmations. */
  const member = getCurrentMember();
  fillMonthOptions("#paymentMonth");
  if (!member) {
    renderLoggedOutMember();
    return;
  }
  renderMemberProfile(member);
  fillProfileForm(member);
  renderMemberPayments(member.id);

  document.querySelector("#memberPaymentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    recordPayment(member.id, Number(getValue("#paymentAmount")), getValue("#paymentMonth"), getValue("#paymentChannel"));
    renderMemberProfile(member);
    renderMemberPayments(member.id);
    renderOverviewMetrics();
  });

  document.querySelector("#profileEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    updateProfile(member);
  });

  document.querySelector("#editPhoto").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      member.photo = reader.result;
      saveState();
      renderMemberProfile(member);
      showToast("Profile picture updated.");
    };
    reader.readAsDataURL(file);
  });

  document.querySelector("#logoutButton").addEventListener("click", () => {
    state.session = null;
    saveState();
    location.href = "login.html";
  });
}

function setupOperationsPage() {
  /* Operations require member login because actions belong to a member record. */
  const member = getCurrentMember();
  setValue("#classDate", today);
  setValue("#trainerDate", today);
  setValue("#trainerTime", member?.time || "17:30");
  setValue("#attendanceMemberId", member?.id || "");
  renderClasses(member);
  renderBookingList(member);
  renderTrainers(member);
  renderFriends(member);
  document.querySelector("#classFilter").addEventListener("change", () => renderClasses(member));
  document.querySelector("#classDate").addEventListener("change", () => renderClasses(member));
  document.querySelector("#instructorFilter").addEventListener("change", () => renderClasses(member));
  document.querySelector("#trainerFilter").addEventListener("change", () => renderTrainers(member));
  document.querySelector("#trainerLanguage").addEventListener("change", () => renderTrainers(member));
  document.querySelector("#trainerRating").addEventListener("change", () => renderTrainers(member));
  document.querySelector("#checkInButton").addEventListener("click", () => {
    const attendanceMember = findMemberByInput(getValue("#attendanceMemberId")) || member;
    if (!attendanceMember) return showToast("Please log in or enter a valid member ID before checking in.");
    state.attendance.push({ id: createId("A", state.attendance), memberId: attendanceMember.id, date: today, time: new Date().toTimeString().slice(0, 5), status: "Checked in" });
    saveState();
    showToast(`Check-in recorded for ${attendanceMember.name}.`);
  });
  document.querySelector("#qrScanButton").addEventListener("click", () => {
    if (member) setValue("#attendanceMemberId", member.id);
    showToast("QR scan simulated. Member ID captured.");
  });
  document.querySelector("#checkOutButton").addEventListener("click", () => {
    const attendanceMember = findMemberByInput(getValue("#attendanceMemberId")) || member;
    if (!attendanceMember) return showToast("Enter a valid member ID before checking out.");
    state.attendance.push({ id: createId("A", state.attendance), memberId: attendanceMember.id, date: today, time: new Date().toTimeString().slice(0, 5), status: "Checked out" });
    saveState();
    showToast(`Checkout recorded for ${attendanceMember.name}.`);
  });
}

function setupStaffPage() {
  /* Staff page is limited to attendance and payment desk tasks. */
  setValue("#staffAttendanceDate", today);
  setValue("#staffAttendanceTime", new Date().toTimeString().slice(0, 5));
  setValue("#staffPaymentDate", today);
  renderStaffRecords();
  document.querySelector("#staffRecordSearch").addEventListener("input", renderStaffRecords);
  document.querySelector("#staffAttendanceForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const attendanceMember = findMemberByInput(getValue("#staffAttendanceMember"));
    if (!attendanceMember) return showToast("Attendance failed: member not found.");
    state.attendance.push({ id: createId("A", state.attendance), memberId: attendanceMember.id, date: getValue("#staffAttendanceDate") || today, time: getValue("#staffAttendanceTime") || "00:00", status: "Manual staff entry" });
    saveState();
    renderStaffRecords();
    showToast(`Attendance recorded for ${attendanceMember.name}.`);
  });
  document.querySelector("#staffPaymentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const paymentMember = findMemberByInput(getValue("#staffPaymentMember"));
    if (!paymentMember) return showToast("Payment failed: member not found.");
    recordPayment(paymentMember.id, Number(getValue("#staffPaymentAmount")), (getValue("#staffPaymentDate") || today).slice(0, 7), "Email", getValue("#staffPaymentMethod"), true);
    renderStaffRecords();
  });
}

function setupLibraryPage() {
  /* The library shows locked messaging until the current month has been paid. */
  const member = getCurrentMember();
  renderLibraryGoalForm(member);
  renderManuals(member);
  document.querySelector("#guideGoal").addEventListener("change", () => renderManuals(member));
  document.querySelector("#guideArea").addEventListener("change", () => renderManuals(member));
  document.querySelector("#libraryGoalForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!member) {
      location.href = "login.html";
      return;
    }
  const selected = [...document.querySelectorAll('[name="libraryGoals"]:checked')].map((input) => input.value);
    if (!selected.length) return showToast("Select at least one goal.");
    member.goals = selected;
    member.goal = selected[0];
    saveState();
    renderManuals(member);
    showToast("Training goals saved.");
  });
  document.querySelector(".modal-close").addEventListener("click", () => document.querySelector("#manualModal").close());
  document.querySelector("#startFoundations").addEventListener("click", startFoundationSession);
  renderMobilityExercises();
  document.querySelector("#startMobility").addEventListener("click", startMobilitySession);
  document.querySelector("#playMobilityVideo").addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/Cf5htJ0VA1k?autoplay=1&rel=0";
    frame.title = "10-minute follow-along mobility flow";
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    document.querySelector("#playMobilityVideo").replaceWith(frame);
  });
  renderTrainingHistory(member);
}

function renderMobilityExercises() {
  const target = document.querySelector("#mobilityExercises");
  if (!target) return;
  target.innerHTML = mobilityExercises.map((exercise, index) => `
    <article class="mobility-exercise">
      <img src="${exercise.image}" alt="${exercise.alt}" loading="lazy">
      <div class="mobility-exercise-copy">
        <p class="eyebrow">${String(index + 1).padStart(2, "0")} · 1:15</p>
        <h3>${exercise.name}</h3>
        <p class="manual-meta">${exercise.focus}</p>
        <p>${exercise.cue}</p>
      </div>
    </article>`).join("");
}

function startMobilitySession() {
  if (mobilityTimer) clearInterval(mobilityTimer);
  mobilitySession = { movement: 0, remaining: 75, paused: false };
  paintMobilitySession();
  mobilityTimer = setInterval(() => {
    if (!mobilitySession || mobilitySession.paused) return;
    mobilitySession.remaining--;
    if (mobilitySession.remaining <= 0) {
      mobilitySession.movement++;
      if (mobilitySession.movement >= mobilityExercises.length) {
        finishMobilitySession();
        return;
      }
      mobilitySession.remaining = 75;
      paintMobilitySession();
      return;
    }
    const clock = document.querySelector("#mobilityClock");
    if (clock) clock.textContent = formatMobilityTime(mobilitySession.remaining);
  }, 1000);
}

function formatMobilityTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function paintMobilitySession() {
  const target = document.querySelector("#mobilitySession");
  if (!target || !mobilitySession) return;
  const exercise = mobilityExercises[mobilitySession.movement];
  target.innerHTML = `
    <div class="mobility-active-card">
      <img src="${exercise.image}" alt="${exercise.alt}">
      <div>
        <p class="eyebrow">Move ${mobilitySession.movement + 1} of ${mobilityExercises.length} · ${exercise.focus}</p>
        <h3>${exercise.name}</h3>
        <p>${exercise.cue}</p>
        <p class="mobility-clock" id="mobilityClock" role="timer" aria-live="off">${formatMobilityTime(mobilitySession.remaining)}</p>
        <div class="hero-actions"><button class="primary-button" id="mobilityPause" type="button">Pause</button><button class="ghost-button" id="mobilityLeave" type="button">End session</button></div>
      </div>
    </div>`;
  target.querySelector("#mobilityPause").addEventListener("click", () => {
    mobilitySession.paused = !mobilitySession.paused;
    target.querySelector("#mobilityPause").textContent = mobilitySession.paused ? "Resume" : "Pause";
  });
  target.querySelector("#mobilityLeave").addEventListener("click", () => {
    if (mobilityTimer) clearInterval(mobilityTimer);
    mobilityTimer = null;
    mobilitySession = null;
    target.innerHTML = `<p class="muted">Session ended. Start again whenever you are ready.</p>`;
  });
}

function finishMobilitySession() {
  if (mobilityTimer) clearInterval(mobilityTimer);
  mobilityTimer = null;
  mobilitySession = null;
  const member = getCurrentMember();
  state.trainingLog.push({ id: createId("TR", state.trainingLog), memberId: member?.id || null, title: "At-home mobility · 10 min", date: today, type: "mobility" });
  saveState();
  document.querySelector("#mobilitySession").innerHTML = `<div class="mobility-complete"><p class="eyebrow">10 minutes complete</p><h3>Nice work. You made time to move.</h3><p>Your mobility session is saved on this device.</p></div>`;
  renderTrainingHistory(member);
  showToast("At-home mobility session saved.");
}

function startFoundationSession() {
  if (foundationRestTimer) clearInterval(foundationRestTimer);
  foundationSession = { movement: 0, set: 0, rest: 0 };
  paintFoundationSession();
}

function paintFoundationSession() {
  const target = document.querySelector("#foundationSession");
  if (!target || !foundationSession) return;
  if (foundationSession.movement >= foundationMovements.length) {
    if (foundationRestTimer) clearInterval(foundationRestTimer);
    foundationRestTimer = null;
    const member = getCurrentMember();
    state.trainingLog.push({ id: createId("TR", state.trainingLog), memberId: member?.id || null, title: "Everyday foundations", date: today, type: "foundation" });
    saveState();
    foundationSession = null;
    target.innerHTML = `<h3>Session complete</h3><p>Nice work. Your free foundation session is saved on this device.</p>`;
    renderTrainingHistory(member);
    showToast("Foundation session saved on this device.");
    return;
  }
  const movement = foundationMovements[foundationSession.movement];
  target.innerHTML = `
    <p class="eyebrow">Movement ${foundationSession.movement + 1} of ${foundationMovements.length}</p>
    <h3>${movement.name}</h3>
    <p class="muted">${movement.area} · Set ${foundationSession.set + 1} of 2 · 5 comfortable repetitions</p>
    <img src="${movement.image}" alt="Training reference for ${movement.area}">
    <p>${movement.steps}</p>
    <p id="foundationRest" role="status" aria-live="polite">${foundationSession.rest ? `Rest · ${foundationSession.rest}s remaining` : "Take extra rest whenever you need it."}</p>
    <div class="hero-actions"><button class="primary-button" id="foundationSet" type="button" ${foundationSession.rest ? "disabled" : ""}>Set complete</button>${foundationSession.rest ? `<button class="ghost-button" id="foundationSkip" type="button">Continue now</button>` : ""}<button class="ghost-button" id="foundationLeave" type="button">Leave session</button></div>`;
  target.querySelector("#foundationSet").addEventListener("click", () => {
    if (foundationSession.rest) return;
    foundationSession.set++;
    if (foundationSession.set >= 2) {
      foundationSession.set = 0;
      foundationSession.movement++;
      paintFoundationSession();
      return;
    }
    foundationSession.rest = 60;
    paintFoundationSession();
    foundationRestTimer = setInterval(() => {
      foundationSession.rest--;
      if (foundationSession.rest <= 0) {
        clearInterval(foundationRestTimer);
        foundationRestTimer = null;
        foundationSession.rest = 0;
      }
      paintFoundationSession();
    }, 1000);
  });
  target.querySelector("#foundationSkip")?.addEventListener("click", () => {
    if (foundationRestTimer) clearInterval(foundationRestTimer);
    foundationRestTimer = null;
    foundationSession.rest = 0;
    paintFoundationSession();
  });
  target.querySelector("#foundationLeave").addEventListener("click", () => {
    if (foundationRestTimer) clearInterval(foundationRestTimer);
    foundationRestTimer = null;
    foundationSession = null;
    target.innerHTML = `<p class="muted">Session paused. Completed sessions remain saved.</p>`;
  });
}

function setupMarathonPage() {
  /* Date picker updates the marathon event countdown. */
  const input = document.querySelector("#marathonDate");
  input.min = today;
  input.addEventListener("change", updateMarathonCountdown);
  updateMarathonCountdown();
}

function setupReportsPage() {
  /* Admin report data is visible only after admin login. */
  const isAdmin = state.session?.role === "admin";
  document.body.classList.toggle("admin-active", isAdmin);
  if (!isAdmin) return;
  setValue("#reportStart", `${currentMonth}-01`);
  setValue("#reportEnd", today);
  renderAdminReports();
  renderStaffTable();
  document.querySelector("#exportReport").addEventListener("click", exportAdminReport);
  document.querySelector("#applyReportFilter").addEventListener("click", renderAdminReports);
  document.querySelector("#reportMemberFilter").addEventListener("input", renderAdminReports);
  document.querySelector("#addStaffForm").addEventListener("submit", addStaffMember);
}

function renderOverviewMetrics() {
  /* Overview metrics appear on the home page and report page cards. */
  setText("#metricMembers", state.members.length);
  setText("#metricPayments", state.payments.length);
  setText("#metricClasses", state.classes.length);
  setText("#metricRevenue", `R${totalRevenue()}`);
}

function renderLoggedOutMember() {
  /* Friendly empty state for users who open Members without logging in. */
  setText("#profileInitials", "CF");
  setText("#profileName", "Please log in");
  setText("#profileMeta", "Members must log in to pay and view confirmations.");
  document.querySelector("#profileDetails").innerHTML = `<li><a class="primary-button" href="login.html">Login / Signup</a></li>`;
  document.querySelector("#memberPaymentForm").querySelectorAll("input, select, button").forEach((input) => input.disabled = true);
  document.querySelector("#profileEditForm").querySelectorAll("input, select, button").forEach((input) => input.disabled = true);
  document.querySelector("#memberPaymentTable").innerHTML = `<tr><td colspan="4">Log in to view payment history.</td></tr>`;
}

function renderMemberProfile(member) {
  /* Profile summary uses live member and payment data. */
  const paidThisMonth = hasPaid(member.id, currentMonth);
  const picture = document.querySelector("#profilePicture");
  if (picture) {
    picture.style.backgroundImage = member.photo ? `url("${member.photo}")` : "";
    picture.classList.toggle("has-photo", Boolean(member.photo));
  }
  setText("#profileInitials", initials(member.name));
  setText("#profileName", member.name);
  setText("#profileMeta", `${member.goal} | Joined ${member.joined}`);
  document.querySelector("#profileDetails").innerHTML = `
    <li><b>Email:</b> ${member.email}</li>
    <li><b>Phone:</b> ${member.phone}</li>
    <li><b>Body type:</b> ${member.body}</li>
    <li><b>Measurements:</b> ${member.measurements || "Not captured"}</li>
    <li><b>Medical notes:</b> ${member.medical || "None"}</li>
    <li><b>Preferences:</b> ${member.workout} | ${member.intensity} intensity | ${member.notifications ? "notifications on" : "notifications off"}</li>
    <li><b>Preferred time:</b> ${member.time}</li>
    <li><b>This month:</b> ${paidThisMonth ? "Paid - training manual unlocked" : "Not paid - manual locked"}</li>
  `;
}

function fillProfileForm(member) {
  /* The edit form is pre-filled so members can change existing data. */
  setValue("#editName", member.name);
  setValue("#editPhone", member.phone);
  setValue("#editGoal", member.goal);
  setValue("#editBody", member.body);
  setValue("#editMeasurements", member.measurements);
  setValue("#editMedical", member.medical);
  setValue("#editWorkout", member.workout);
  setValue("#editTime", member.time);
  setValue("#editIntensity", member.intensity);
  document.querySelector("#editNotifications").checked = Boolean(member.notifications);
}

function updateProfile(member) {
  /* Saves profile, goal, body measurements, notes, and notification preferences. */
  member.name = getValue("#editName");
  member.phone = getValue("#editPhone");
  member.goal = getValue("#editGoal");
  member.body = getValue("#editBody");
  member.measurements = getValue("#editMeasurements");
  member.medical = getValue("#editMedical");
  member.workout = getValue("#editWorkout");
  member.time = getValue("#editTime");
  member.intensity = getValue("#editIntensity");
  member.notifications = document.querySelector("#editNotifications").checked;
  saveState();
  renderMemberProfile(member);
  showToast("Profile and preferences saved.");
}

function renderMemberPayments(memberId) {
  /* Payment table includes confirmation SMS/email text for proof of workflow. */
  const rows = state.payments.filter((payment) => payment.memberId === memberId).reverse();
  document.querySelector("#memberPaymentTable").innerHTML = rows.length ? rows.map((payment) => `
    <tr>
      <td>${payment.month}</td>
      <td>R${payment.amount}</td>
      <td>${payment.channel}</td>
      <td>${payment.confirmation}</td>
    </tr>
  `).join("") : `<tr><td colspan="4">No payments recorded yet.</td></tr>`;
}

function renderLibraryGoalForm(member) {
  /* New members can choose goals directly on the Library page. */
  const form = document.querySelector("#libraryGoalForm");
  if (!form) return;
  form.querySelectorAll('[name="libraryGoals"]').forEach((input) => {
    input.checked = Boolean(member?.goals?.includes(input.value));
  });
}

function renderStaffRecords() {
  /* Staff can filter recent payment and attendance actions without seeing admin reports. */
  const query = getValue("#staffRecordSearch").toLowerCase();
  const rows = [
    ...state.attendance.map((item) => ({ type: "Attendance", memberId: item.memberId, date: item.date, details: `${item.status || "Visit"} at ${item.time}` })),
    ...state.payments.map((item) => ({ type: "Payment", memberId: item.memberId, date: item.date, details: `R${item.amount} via ${item.method}` }))
  ].filter((item) => {
    const member = getMember(item.memberId);
    return !query || [member?.name, member?.id, member?.email].join(" ").toLowerCase().includes(query);
  }).slice(-12).reverse();

  document.querySelector("#staffRecordTable").innerHTML = rows.length ? rows.map((item) => {
    const member = getMember(item.memberId);
    return `<tr><td>${item.type}</td><td>${member?.name || "Unknown"}</td><td>${item.date}</td><td>${item.details}</td></tr>`;
  }).join("") : `<tr><td colspan="4">No staff records match the filter.</td></tr>`;
}

function updateMarathonCountdown() {
  /* Shows time remaining once a marathon date is selected. */
  const output = document.querySelector("#marathonCountdown");
  const selected = getValue("#marathonDate");
  if (!selected) {
    output.textContent = "Select a date to see the event countdown.";
    return;
  }
  const start = new Date(`${selected}T06:00:00`);
  const diff = start - new Date();
  if (diff <= 0) {
    output.textContent = "The selected marathon date has started or passed.";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  output.textContent = `${days} day${days === 1 ? "" : "s"} and ${hours} hour${hours === 1 ? "" : "s"} until the 06:00 start.`;
}

// Show the current browser demo places; these are not live reservations at the gym.
function renderClasses(member) {
  /* Booking reduces spaces; if full, the member joins a waitlist instead. */
  const list = document.querySelector("#classList");
  const filter = getValue("#classFilter");
  const instructor = getValue("#instructorFilter");
  const date = getValue("#classDate");
  const classes = state.classes.filter((item) => {
    const typeMatch = filter === "All classes" || item.type === filter;
    const instructorMatch = instructor === "All instructors" || item.trainer === instructor;
    const dateMatch = !date || item.date === date;
    return typeMatch && instructorMatch && dateMatch;
  });
  list.innerHTML = classes.map((item) => `
    <button class="class-row" data-class="${item.id}" type="button">
      <span><b>${item.name}</b><small>${item.date} | ${item.time} | ${item.trainer} | ${item.type} | ${item.spaces > 0 ? `${item.spaces} spaces` : "waitlist"}</small></span>
      <strong>${item.spaces > 0 ? "Book" : "Waitlist"}</strong>
    </button>
  `).join("") || `<p class="muted">No classes match those filters.</p>`;

  list.querySelectorAll("[data-class]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!member) return showToast("Please log in as a member before booking.");
      const fitnessClass = state.classes.find((item) => item.id === button.dataset.class);
      const status = fitnessClass.spaces > 0 ? "Booked" : "Waitlist";
      if (state.bookings.some((booking) => booking.memberId === member.id && booking.classId === fitnessClass.id)) return showToast("You already requested this class.");
      if (fitnessClass.spaces > 0) fitnessClass.spaces -= 1;
      state.bookings.push({ id: createId("B", state.bookings), memberId: member.id, classId: fitnessClass.id, status, date: today });
      saveState();
      renderClasses(member);
      renderBookingList(member);
      showToast(`${status}: ${fitnessClass.name}`);
    });
  });
}

function renderBookingList(member) {
  /* Members can view and cancel their own bookings. */
  const list = document.querySelector("#bookingList");
  if (!member) {
    list.innerHTML = `<p class="muted">Log in to view upcoming and previous bookings.</p>`;
    return;
  }
  const bookings = state.bookings.filter((booking) => booking.memberId === member.id);
  list.innerHTML = bookings.length ? bookings.map((booking) => {
    const fitnessClass = state.classes.find((item) => item.id === booking.classId);
    return `
      <article class="directory-card">
        <strong>${fitnessClass?.name || "Class removed"}</strong>
        <span>${booking.status} | ${booking.date} | ${fitnessClass?.trainer || "Instructor"}</span>
        <button class="ghost-button mini-button" data-cancel-booking="${booking.id}" type="button">Cancel</button>
      </article>
    `;
  }).join("") : `<p class="muted">No class bookings yet.</p>`;

  document.querySelectorAll("[data-cancel-booking]").forEach((button) => {
    button.addEventListener("click", () => {
      const booking = state.bookings.find((item) => item.id === button.dataset.cancelBooking);
      const fitnessClass = state.classes.find((item) => item.id === booking?.classId);
      if (fitnessClass && booking?.status === "Booked") fitnessClass.spaces += 1;
      state.bookings = state.bookings.filter((item) => item.id !== button.dataset.cancelBooking);
      saveState();
      renderClasses(member);
      renderBookingList(member);
      showToast("Booking cancelled.");
    });
  });
}

function renderTrainers(member) {
  /* Trainer cards create request records for admin evidence. */
  const filter = getValue("#trainerFilter");
  const language = getValue("#trainerLanguage");
  const rating = getValue("#trainerRating");
  const trainers = state.trainers.filter((trainer) => {
    const specMatch = filter === "All trainers" || trainer.specialisation === filter;
    const languageMatch = language === "Any language" || trainer.language === language;
    const ratingMatch = rating === "Any rating" || trainer.rating >= Number(rating);
    return specMatch && languageMatch && ratingMatch;
  });
  document.querySelector("#trainerList").innerHTML = trainers.map((trainer) => `
    <article class="directory-card">
      <strong>${trainer.name}</strong>
      <span>${trainer.specialisation} | ${trainer.language} | ${trainer.rating} rating | ${trainer.availability}</span>
      <span>${trainer.bio}</span>
      <div class="button-row">
        <button class="ghost-button mini-button" data-profile-trainer="${trainer.id}" type="button">View Profile</button>
        <button class="ghost-button mini-button" data-message-trainer="${trainer.id}" type="button">Message</button>
        <button class="primary-button mini-button" data-trainer="${trainer.id}" type="button">Request Session</button>
        <button class="ghost-button mini-button" data-review-trainer="${trainer.id}" type="button">Rate</button>
      </div>
    </article>
  `).join("") || `<p class="muted">No trainers match those filters.</p>`;

  document.querySelectorAll("[data-trainer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!member) return showToast("Please log in as a member before requesting a trainer.");
      state.trainerRequests.push({ id: createId("TR", state.trainerRequests), memberId: member.id, trainerId: button.dataset.trainer, date: getValue("#trainerDate") || today, time: getValue("#trainerTime") || member.time, message: getValue("#trainerMessage"), type: "Session request" });
      saveState();
      showToast("Trainer request sent.");
    });
  });

  document.querySelectorAll("[data-message-trainer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!member) return showToast("Please log in as a member before messaging a trainer.");
      state.trainerRequests.push({ id: createId("TR", state.trainerRequests), memberId: member.id, trainerId: button.dataset.messageTrainer, date: today, time: getValue("#trainerTime") || member.time, message: getValue("#trainerMessage") || "Member requested contact.", type: "Message" });
      saveState();
      showToast("Trainer message saved.");
    });
  });

  document.querySelectorAll("[data-profile-trainer]").forEach((button) => {
    button.addEventListener("click", () => {
      const trainer = state.trainers.find((item) => item.id === button.dataset.profileTrainer);
      showToast(`${trainer.name}: ${trainer.bio}`);
    });
  });

  document.querySelectorAll("[data-review-trainer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!member) return showToast("Please log in as a member before rating a trainer.");
      state.trainerReviews.push({ id: createId("RV", state.trainerReviews), memberId: member.id, trainerId: button.dataset.reviewTrainer, stars: getValue("#trainerStars"), comment: getValue("#trainerReview"), date: today });
      saveState();
      showToast("Trainer review recorded.");
    });
  });
}

function renderFriends(member) {
  /* Friend matching compares member goals and training times. */
  const list = document.querySelector("#friendList");
  if (!member) {
    list.innerHTML = `<p class="muted">Log in to see goal and schedule matches.</p>`;
    return;
  }
  const matches = state.members.filter((item) => item.id !== member.id && (item.goal === member.goal || item.time === member.time));
  list.innerHTML = matches.length ? matches.map((match) => `
    <article class="directory-card">
      <strong>${match.name}</strong>
      <span>${match.goal} | ${match.time}</span>
      <button class="primary-button mini-button" data-friend="${match.id}" type="button">Connect</button>
    </article>
  `).join("") : `<p class="muted">No matching members yet.</p>`;

  document.querySelectorAll("[data-friend]").forEach((button) => {
    button.addEventListener("click", () => {
      state.friendConnections.push({ id: createId("F", state.friendConnections), memberId: member.id, friendId: button.dataset.friend, date: today });
      saveState();
      showToast("Friend request sent.");
    });
  });
}

function renderManuals(member) {
  /* Paid members see guides; unpaid or logged-out users see locked cards. */
  const paid = member && hasPaid(member.id, currentMonth);
  const status = document.querySelector("#guideStatus");
  status.className = `locked-guide ${paid ? "unlocked" : "locked"}`;
  status.innerHTML = paid
    ? `<h2>Paid training library unlocked</h2><p>${member.name}, your goal-based plans are open for ${currentMonth}. Completed sessions are saved on this device.</p><p class="muted">Demo access is based on the local payment record; no real payment is processed here.</p>`
    : `<h2>Paid training library locked</h2><p>Sign in as a member and record this month's membership payment to open the detailed plans. This prototype simulates payments; it does not collect money.</p><a class="primary-button" href="${member ? "members.html" : "login.html"}">${member ? "Open member payments" : "Login / Register"}</a>`;

  const selectedGoal = getValue("#guideGoal");
  const selectedArea = getValue("#guideArea");
  const selectedGoals = member?.goals?.length ? member.goals : [member?.goal].filter(Boolean);
  const visible = manuals.filter((manual) => {
    const goalMatch = selectedGoal === "My goal" ? true : manual.goal === selectedGoal;
    const areaMatch = selectedArea === "All areas" || manual.area === selectedArea;
    return goalMatch && areaMatch;
  }).sort((a, b) => {
    const aSelected = selectedGoals.includes(a.goal) ? 0 : 1;
    const bSelected = selectedGoals.includes(b.goal) ? 0 : 1;
    return aSelected - bSelected || a.goal.localeCompare(b.goal);
  });

  document.querySelector("#manualGrid").innerHTML = visible.map((manual, index) => `
    <article class="manual-card ${selectedGoals.includes(manual.goal) ? "selected-goal" : ""}">
      <img src="${manual.image}" alt="${manual.title}">
      <h3>${manual.title}</h3>
      <p>${manual.goal} | ${manual.area}${selectedGoals.includes(manual.goal) ? " | selected goal" : ""}</p>
      <p class="manual-meta">${manual.duration} · ${manual.level}</p>
      <button class="${paid ? "primary-button" : "ghost-button"} mini-button" data-manual="${index}" type="button">${paid ? "Open Guide" : "Locked"}</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-manual]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!member) {
        location.href = "login.html";
        return;
      }
      if (!paid) return showToast("Pay for the current month to unlock training manuals.");
      showManual(visible[Number(button.dataset.manual)]);
    });
  });
}

function renderTrainingHistory(member) {
  const target = document.querySelector("#trainingHistory");
  if (!target) return;
  const entries = member ? state.trainingLog.filter((entry) => entry.memberId === member.id).slice().reverse() : [];
  target.innerHTML = entries.length
    ? `<h2>Completed sessions</h2><ul>${entries.slice(0, 6).map((entry) => `<li>${entry.date} · ${entry.title}</li>`).join("")}</ul>`
    : `<h2>Completed sessions</h2><p class="muted">Completed paid-library sessions will appear here on this device.</p>`;
}

function renderAdminReports() {
  /* Admin totals show who has paid for the current month and total revenue. */
  const memberQuery = getValue("#reportMemberFilter").toLowerCase();
  const visibleMembers = state.members.filter((member) => [member.name, member.email, member.id].join(" ").toLowerCase().includes(memberQuery));
  const start = getValue("#reportStart");
  const end = getValue("#reportEnd");
  const visiblePayments = state.payments.filter((payment) => {
    const member = getMember(payment.memberId);
    const memberMatch = !memberQuery || [member?.name, member?.email, member?.id].join(" ").toLowerCase().includes(memberQuery);
    const startMatch = !start || payment.date >= start;
    const endMatch = !end || payment.date <= end;
    return memberMatch && startMatch && endMatch;
  });
  const paidCount = visibleMembers.filter((member) => hasPaid(member.id, currentMonth)).length;
  setText("#reportMembers", visibleMembers.length);
  setText("#reportPaid", paidCount);
  setText("#reportUnpaid", visibleMembers.length - paidCount);
  setText("#reportRevenue", `R${visiblePayments.reduce((sum, payment) => sum + Number(payment.amount), 0)}`);

  document.querySelector("#adminMemberTable").innerHTML = visibleMembers.map((member) => {
    const paidMonths = state.payments.filter((payment) => payment.memberId === member.id).map((payment) => payment.month);
    return `
      <tr>
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>${member.joined}</td>
        <td>${member.goal}</td>
        <td>${paidMonths.length ? paidMonths.join(", ") : "None"}</td>
        <td>${hasPaid(member.id, currentMonth) ? "Paid" : "Unpaid"}</td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6">No members match the filter.</td></tr>`;

  document.querySelector("#adminPaymentTable").innerHTML = visiblePayments.length ? visiblePayments.slice().reverse().map((payment) => {
    const member = getMember(payment.memberId);
    return `
      <tr>
        <td>${payment.date}</td>
        <td>${member?.name || "Unknown"}</td>
        <td>${payment.month}</td>
        <td>R${payment.amount}</td>
        <td>${payment.method}</td>
        <td>${payment.channel}</td>
        <td>${payment.confirmation}</td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="7">No payment records yet.</td></tr>`;

  renderInvoices(visibleMembers);
}

function renderInvoices(members) {
  /* Admin can mark a generated monthly invoice as paid. */
  document.querySelector("#invoiceTable").innerHTML = members.map((member) => {
    const paid = hasPaid(member.id, currentMonth);
    return `
      <tr>
        <td>INV-${member.id}-${currentMonth}</td>
        <td>${member.name}</td>
        <td>${currentMonth}</td>
        <td>${paid ? "Paid" : "Unpaid"}</td>
        <td>${paid ? "Complete" : `<button class="primary-button mini-button" data-mark-paid="${member.id}" type="button">Mark Paid</button>`}</td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll("[data-mark-paid]").forEach((button) => {
    button.addEventListener("click", () => {
      recordPayment(button.dataset.markPaid, 450, currentMonth, "Email");
      renderAdminReports();
    });
  });
}

function renderStaffTable() {
  /* Admin can add or remove staff users who have staff-page access. */
  const staffUsers = state.users.filter((user) => user.role === "staff");
  document.querySelector("#staffTable").innerHTML = staffUsers.length ? staffUsers.map((staff) => `
    <tr>
      <td>${staff.name}</td>
      <td>${staff.email}</td>
      <td>${staff.active === false ? "Removed" : "Active"}</td>
      <td>${staff.active === false ? "No access" : `<button class="ghost-button mini-button" data-remove-staff="${staff.id}" type="button">Remove</button>`}</td>
    </tr>
  `).join("") : `<tr><td colspan="4">No staff accounts yet.</td></tr>`;

  document.querySelectorAll("[data-remove-staff]").forEach((button) => {
    button.addEventListener("click", () => {
      const staff = state.users.find((user) => user.id === button.dataset.removeStaff);
      if (!staff) return;
      staff.active = false;
      saveState();
      renderStaffTable();
      showToast(`${staff.name} was removed from staff access.`);
    });
  });
}

function addStaffMember(event) {
  /* New staff credentials are created by admin and saved locally. */
  event.preventDefault();
  const email = getValue("#newStaffEmail").toLowerCase();
  if (state.users.some((user) => user.email === email && user.active !== false)) return showToast("That staff email already exists.");
  state.users.push({
    id: createId("U", state.users),
    role: "staff",
    name: getValue("#newStaffName"),
    email,
    password: getValue("#newStaffPassword"),
    active: true
  });
  saveState();
  document.querySelector("#addStaffForm").reset();
  renderStaffTable();
  showToast("Staff member added.");
}

// This records a simulated payment locally; it does not charge money or send a message.
function recordPayment(memberId, amount, month, channel, method = "Online", allowDuplicate = false) {
  /* Payment confirms the selected month and simulates the SMS/email notice. */
  if (!amount || amount <= 0) return showToast("Enter a valid payment amount.");
  const member = getMember(memberId);
  const existing = state.payments.find((payment) => payment.memberId === memberId && payment.month === month);
  if (existing && !allowDuplicate) return showToast(`${month} is already marked as paid.`);

  const destination = channel === "SMS" ? member.phone : member.email;
  const confirmation = `${channel} sent to ${destination} confirming R${amount} membership payment for ${month}.`;
  state.payments.push({ id: createId("P", state.payments), memberId, month, amount, method, channel, date: today, confirmation });
  saveState();
  showToast(confirmation);
}

function showManual(manual) {
  /* Modal gives the member practical instructions for the selected body area. */
  const member = getCurrentMember();
  if (!member || !hasPaid(member.id, currentMonth)) return showToast("The paid training library is locked until this month's membership payment is recorded.");
  document.querySelector("#manualModalContent").innerHTML = `
    <p class="eyebrow">${manual.goal} | ${manual.area}</p>
    <h2>${manual.title}</h2>
    <img class="manual-modal-image" src="${manual.image}" alt="${manual.title} exercise demonstration">
    <p><b>${manual.duration} · ${manual.level}</b></p>
    <p><b>Equipment:</b> ${manual.equipment}</p>
    <p>Use a comfortable pace and range of motion. This general guide is educational and does not replace individual advice from a qualified trainer or clinician.</p>
    <h3>Movement focus</h3>
    <img class="manual-modal-illustration" src="${manual.illustration}" alt="Vector movement focus illustration for ${manual.area.toLowerCase()} training">
    <ol>${manual.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
    <button class="primary-button" id="completeTraining" type="button">Record session complete</button>
  `;
  document.querySelector("#completeTraining").addEventListener("click", () => {
    const activeMember = getCurrentMember();
    if (!activeMember || !hasPaid(activeMember.id, currentMonth)) return showToast("Your current-month payment is required to record a paid training session.");
    state.trainingLog.push({ id: createId("TR", state.trainingLog), memberId: activeMember.id, manualId: manual.id, title: manual.title, date: today });
    saveState();
    renderTrainingHistory(activeMember);
    showToast("Training session saved on this device.");
  });
  document.querySelector("#manualModal").showModal();
}

function exportAdminReport() {
  /* Export lets the admin download current report data as evidence. */
  const report = { generatedAt: new Date().toISOString(), members: state.members, payments: state.payments };
  // The Android shell supplies an origin-restricted export channel and a document picker.
  if (window.cfjExport) { window.cfjExport.postMessage(JSON.stringify(report, null, 2)); return; }
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cfj-admin-report-${today}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Admin report exported.");
}

function fillMonthOptions(selector) {
  /* Members can pay for current and upcoming months. */
  const select = document.querySelector(selector);
  if (!select) return;
  const months = [0, 1, 2, 3, 4, 5].map((offset) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toISOString().slice(0, 7);
  });
  select.innerHTML = months.map((month) => `<option>${month}</option>`).join("");
}

function getCurrentMember() {
  /* Member-only pages use the current session's member record. */
  if (state.session?.role !== "member") return null;
  return getMember(state.session.memberId);
}

function getMember(id) {
  return state.members.find((member) => member.id === id);
}

function findMemberByInput(input) {
  /* Staff controls can search by member ID, full name, or email. */
  const query = input.trim().toLowerCase();
  if (!query) return null;
  return state.members.find((member) => {
    return member.id.toLowerCase() === query || member.name.toLowerCase().includes(query) || member.email.toLowerCase() === query;
  });
}

function hasPaid(memberId, month) {
  return state.payments.some((payment) => payment.memberId === memberId && payment.month === month);
}

function totalRevenue() {
  return state.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
}

function createId(prefix, collection) {
  /* IDs stay readable for reports and demos. */
  return `${prefix}-${String(collection.length + 1001).padStart(4, "0")}`;
}

function initials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function getValue(selector) {
  return document.querySelector(selector)?.value.trim() || "";
}

function setValue(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.value = value || "";
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}
