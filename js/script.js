// === Systemtext Loader importieren ===
import { t } from '../local_sys_txt/index.js';
import { boot } from './app/boot.js';
boot();
/* === PROFILE OPTIONS & FIELD META (from USER_PROFILE.md) === */

/** Whitelist for system language (UI select) */
export const SYSTEM_LANG_CODES = ['en','de','es','fr','it'];

/** Label-Maps / Enums (keys = storage values) */
export const PROFILE_OPTIONS = {
  gender: {
    m: 'Male',
    f: 'Female',
    nonbinary: 'Non-binary',
    prefer_not_to_say: 'Prefer not to say',
  },
  intent: {
    expectations: {
      deep_connection: 'Deep connection',
      meaningful_conversations: 'Meaningful conversations',
      personal_growth: 'Personal growth',
      mainly_fun: 'Mainly fun',
      professional_mentorship: 'Professional mentorship',
      advice: 'Advice',
      create_community: 'Create a community',
      just_checking: 'Just checking',
    },
    conversation_goals: {
      deepen_understanding: 'Deepen understanding',
      explore_new_perspectives: 'Explore new perspectives',
      build_empathy: 'Build empathy',
      practice_language: 'Practice language',
      gain_advice: 'Gain advice',
      develop_self_awareness: 'Develop self-awareness',
      enjoy_casual_talk: 'Enjoy casual talk',
    },
    values_and_beliefs: {
      loyalty_trust: 'Loyalty & Trust',
      honest_open_comm: 'Honest & Open Communication',
      humor_playfulness: 'Sense of Humor & Playfulness',
      intellectual_stimulation: 'Intellectual Stimulation & Deep Conversations',
      cultural_curiosity: 'Cultural Curiosity & Openness to Diversity',
      personal_growth_ambition: 'Personal Growth & Ambition',
      spontaneity_adventure: 'Spontaneity & Adventure',
    },
    topics_to_avoid: {
      politics: 'Political debates',
      religion: 'Religious or spiritual topics',
      polarizing: 'Controversial / polarizing topics',
      toxic_behavior: 'Trolling or toxic behavior',
      conspiracy: 'Conspiracy theories',
      unverified_health: 'Unverified health & wellness claims',
    },
  },
  behavior: {
    social_energy: {
      social_events_new_people: 'Attending social events and engaging with new people',
      small_close_group: 'Spending time with a small, close-knit group',
      solitary_creative_work: 'Engaging in solitary activities such as reading, writing, or artistic work',
      lead_conversations: 'I enjoy leading conversations and bringing people together',
      prefer_listening_value_add: 'I prefer listening and contributing only when I have something valuable to add',
      overwhelmed_large_pref_1to1: 'I find large discussions overwhelming and prefer one-on-one conversations',
    },
    communication_style: {
      open_direct: 'Open and direct',
      more_structured: 'More structured',
      casual_quick: 'Casual & quick',
      selective_engagement: 'Selective engagement',
    },
    conflict_response: {
      direct_resolution: 'I address the issue directly and seek an immediate resolution',
      reflective_delayed: 'I take time to process my thoughts before engaging in discussion',
      avoidant: 'I tend to avoid confrontation and hope the issue resolves itself over time',
    },
    support_style: {
      practical_problem_solving: 'By offering practical advice and problem-solving strategies',
      empathetic_listening: 'By listening empathetically and validating their emotions',
      humor_distraction: 'By creating a distraction through humor or activities',
    },
    decision_style: {
      structured: 'Structured / methodical',
      adaptive: 'Adaptive / flexible',
      impulsive: 'Impulsive / spontaneous',
    },
    // sliders (1–5) with helper labels
    assertiveness_level_scale: {
      1: 'Very reserved',
      2: '',
      3: 'Moderate',
      4: '',
      5: 'Very assertive',
    },
  },
  emotional: {
    emotional_needs: {
      availability_trust: 'Emotional availability and deep trust',
      shared_interests_experiences: 'Mutual interests and shared experiences',
      consistency_reliability: 'Consistency and reliability in communication',
    },
    maintenance_style: {
      regular_deep_checkins: 'Regular check-ins and deep conversations',
      spontaneous_connection: 'Spontaneous interactions whenever possible',
      intermittent_but_reliable: 'Intermittent contact but always available when needed',
    },
    emotional_regulation: {
      calm: 'Remains calm under stress',
      sensitive: 'Easily affected but recovers fast',
      volatile: 'Strong emotional swings',
    },
    // sliders (1–5)
    empathy_depth_scale: {
      1: 'Low emotional resonance',
      2: '',
      3: 'Balanced empathy',
      4: '',
      5: 'Highly empathetic',
    },
    stress_tolerance_scale: {
      1: 'Low tolerance',
      2: '',
      3: 'Moderate resilience',
      4: '',
      5: 'Highly resilient',
    },
  },
  interests: {
    shared_lifestyle_type: {
      creative_intellectual: 'Engaging in intellectual discussions or creative projects',
      adventurous_exploratory: 'Exploring new places and trying adventurous activities',
      relaxed_playful: 'Relaxing in familiar settings and having lighthearted fun',
    },
  },
};

/** Field meta for renderer (control type, required, storage path, options) */
export const PROFILE_FIELDS = [
  // — Identity
  { key:'user_name', type:'text', required:true,  path:'profile.identity.user_name' },
  { key:'gender', type:'radio', required:true,    path:'profile.identity.gender', options:'gender' },
  { key:'birthday', type:'date', required:true,   path:'profile.identity.birthday' },
  { key:'age', type:'number-readonly', required:false, path:'profile.identity.age', derivedFrom:'birthday' },
  { key:'avatar_picture', type:'file-url', required:false, path:'profile.identity.avatar_picture' },
  { key:'system_language', type:'select', required:false,  path:'profile.system.language', options:'@SYSTEM_LANG_CODES' },

  // — Intent
  { key:'expectations', type:'checkbox-group', required:true, path:'profile.intent.expectations', options:'intent.expectations' },
  { key:'biography', type:'textarea', required:false, path:'profile.intent.biography', maxLength:800 },
  { key:'conversation_goals', type:'checkbox-group', required:true, path:'profile.intent.conversation_goals', options:'intent.conversation_goals' },
  { key:'values_and_beliefs', type:'checkbox-group', required:true, path:'profile.intent.values_and_beliefs', options:'intent.values_and_beliefs' },
  { key:'topics_to_avoid', type:'checkbox-group', required:false, path:'profile.intent.topics_to_avoid', options:'intent.topics_to_avoid' },

  // — Behavior
  { key:'social_energy', type:'checkbox-group', required:true, path:'profile.behavior.social_energy', options:'behavior.social_energy' },
  { key:'communication_style', type:'checkbox-group', required:true, path:'profile.behavior.communication_style', options:'behavior.communication_style' },
  { key:'conflict_response', type:'radio', required:false, path:'profile.behavior.conflict_response', options:'behavior.conflict_response' },
  { key:'support_style', type:'radio', required:false, path:'profile.behavior.support_style', options:'behavior.support_style' },
  { key:'assertiveness_level', type:'range-1-5', required:true, path:'profile.behavior.assertiveness_level', labels:'behavior.assertiveness_level_scale' },
  { key:'decision_style', type:'radio', required:true, path:'profile.behavior.decision_style', options:'behavior.decision_style' },

  // — Emotional
  { key:'emotional_needs', type:'checkbox-group', required:true, path:'profile.emotional.emotional_needs', options:'emotional.emotional_needs' },
  { key:'maintenance_style', type:'checkbox-group', required:true, path:'profile.emotional.maintenance_style', options:'emotional.maintenance_style' },
  { key:'emotional_regulation', type:'radio', required:true, path:'profile.emotional.emotional_regulation', options:'emotional.emotional_regulation' },
  { key:'empathy_depth', type:'range-1-5', required:true, path:'profile.emotional.empathy_depth', labels:'emotional.empathy_depth_scale' },
  { key:'stress_tolerance', type:'range-1-5', required:true, path:'profile.emotional.stress_tolerance', labels:'emotional.stress_tolerance_scale' },

  // — Interests
  { key:'shared_lifestyle_type', type:'checkbox-group', required:true, path:'profile.interests.shared_lifestyle_type', options:'interests.shared_lifestyle_type' },
  { key:'interests', type:'tags', required:true, path:'profile.interests.interests' },
];

/** Helper: resolve option group by dotted key or special token */
export function getOptions(mapKey) {
  if (!mapKey) return null;
  if (mapKey === '@SYSTEM_LANG_CODES') return SYSTEM_LANG_CODES;
  const parts = mapKey.split('.');
  let ref = PROFILE_OPTIONS;
  for (const p of parts) {
    if (ref && Object.prototype.hasOwnProperty.call(ref, p)) ref = ref[p];
    else return null;
  }
  return ref;
}
// — Expose for profiles page (global access)
window.PROFILE_FIELDS = PROFILE_FIELDS;
window.getProfileOptions = getOptions;

/* === Konfiguration === */
const WEBHOOK_URL = "https://hook.us2.make.com/781xg3rx7ku6hvjr98dk23u7ebtuax8i";

/* === State === */
let users = []; // [{id,name,language,color,chatbox,input}]
let conversationHistory = []; // [{sender, message}]
const lastSentByUser = {}; // { [senderId]: last message text }
const colors = ["red","blue","green","orange","purple","teal","brown","pink","olive","cyan"];
let chatUIStarted = false; // zeigt an, dass die Frame-Deck-Ansicht aktiv ist

// === Conversation Flow (global, erweiterbar) ===
const chatFlow = {
  mode: "idle",                 // "idle" | "intro" | "open"
  currentIntroIndex: -1,
  currentIntroUserId: null,
  introDeadlineTs: null,        // reserved for later features
  introTimerId: null,           // reserved for later features
  graceTimerId: null,           // NEU (Grace)
  countdownIntervalId: null,    // NEU (sichtbarer Countdown)
  phase: null                   // "grace" | "countdown" | null
};

// === Per-User Runtime State ===
const userState = {}; // { [userId]: { mode, canType, typing, probablyIdle, introStatus, introMessageSent } }

/* === Helpers === */
const qs = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);
function setMain(t){ const el = byId("mainDiv"); if (el) el.textContent = t; }
function setStatus(t, isErr=false){
  const el = byId("status");
  if (!el) return;
  el.textContent = t;
  el.className = isErr ? "err" : "ok";
}
function safeOn(el, evt, fn){
  if (!el){ console.warn(`[init] Missing element for ${evt}`); return; }
  el.addEventListener(evt, fn);
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

// Einmalige Chat-ID pro Seitenladung
window.__chatId = window.__chatId || `chat_${Date.now()}_${Math.floor(Math.random()*1e4)}`;

/* === UI Init === */
window.addEventListener("DOMContentLoaded", () => {
  console.log("[init] DOM ready");
  // EARLY GUARD: index.html erkennen
  const isPrototypePage =
    !!document.getElementById('framesRow') ||
    !!document.getElementById('btnOwnerCta');
  if (!isPrototypePage) {
    console.debug('[init] skipping prototype UI init (not on index.html)');
    return; // stop running prototype-specific binding on profiles.html
  }

  // === InitLoader Hooks (pro Chatfenster) ===
  document.addEventListener("app:init:start", () => { showInitForAllUsers(); });
  document.addEventListener("app:init:ready", () => { hideInitForAllUsers(); });

  safeOn(byId("addUser"), "click", addUserSection);
  safeOn(byId("startChat"), "click", startChat);

  // Delegation: Save-/Done-Buttons
  const usersContainer = byId("users-container");
  if (usersContainer){
    usersContainer.addEventListener("click", (e) => {
      const btn = e.target;
      if (!(btn instanceof HTMLElement)) return;

      if (btn.id && btn.id.endsWith("-save")) {
        const id = btn.id.replace("-save", "");
        saveUser(id);
        return;
      }

      if (btn.id && btn.id.endsWith("-done")) {
        const id = btn.id.replace("-done", "");
        const st = userState[id] || {};
        if (chatFlow.mode === "intro" && id === chatFlow.currentIntroUserId) {
          // Während Netzwerk-Lock: queue'n
          if (st.pendingNetwork) {
            st.queuedAdvance = true;
            const b = byId(`${id}-done`);
            if (b) { b.disabled = true; b.title = "queued until the last message is delivered"; }
            return;
          }
          // Normalpfad: erst nach erster Intro-Nachricht
          if (st.introMessageSent) {
            advanceIntro(id, "done");
          } else {
            appendMessage(id, "Please share a brief intro first.", "moderator");
          }
        }
        return;
      }
    });
  } else {
    console.warn("[init] #users-container not found");
  }
  
  /* === Global Click Delegation for Done/Next in device frames === */
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn || !btn.id || !btn.id.endsWith('-done')) return;

    ev.preventDefault();
    const id = btn.id.slice(0, -5); // "...-done" entfernen

    // Nur der aktuelle Sprecher in der Intro-Phase darf weitergeben
    if (chatFlow.mode !== 'intro' || chatFlow.currentIntroUserId !== id) return;

    const st = userState[id] || {};
    // Falls gerade ein Netzrequest in-flight ist → Queue & Button sperren
    if (st.pendingNetwork) {
      st.queuedAdvance = true;
      btn.disabled = true;
      btn.title = 'queued until the last message is delivered';
      userState[id] = st;
      return;
    }

    // Weitergabe erst NACH der ersten Intro-Nachricht
    if (st.introMessageSent) {
      advanceIntro(id, 'done');
    } else {
      appendMessage(id, 'Please share a brief intro first.', 'moderator');
    }
  }, true); // capture=true, damit Klicks in dynamischen Frames zuverlässig ankommen

  // NEU: Separater Container für die iPhone-Frames (unterhalb des User-Bereichs)
  (() => {
    const usersWrap = byId("users-container");
    if (!usersWrap) return;
    if (!byId("frames-container")) {
      const frameWrap = document.createElement("div");
      frameWrap.id = "frames-container";
      frameWrap.className = "frames-container";
      // direkt nach dem users-container einfügen
      usersWrap.parentNode.insertBefore(frameWrap, usersWrap.nextSibling);
    }
  })();
  
  setMain("Bereit.");
  setStatus("Noch keine Requests gesendet.");
});

/* === Intro UI Helpers (styles & inline system hints) === */

// Add/remove active/inactive styles and tab styling around inputs & Done/Next button
function applyIntroInputStyles(activeUserId) {
  users.forEach(u => {
    const inp = byId(`${u.id}-input`);
    const btn = byId(`${u.id}-done`);
    if (!inp || !btn) return;

    const isActive = (u.id === activeUserId);

    // Input stylings
    inp.classList.toggle('input-active', isActive);
    inp.classList.toggle('input-inactive', !isActive);

    // Button styling (tab look) + visibility (shown only for active)
    btn.classList.toggle('tab-done', isActive);
    btn.style.display = isActive ? 'inline-block' : 'none';
  });
}

// Remove any previous system hint lines we added
function clearIntroHints() {
  document.querySelectorAll('.sys-hint--active, .sys-hint--others, .hairline--light, .hairline--dark')
    .forEach(el => el.remove());
}

// Render hint lines: light-blue for active user, dark-blue for others (localized)
function renderIntroHints(activeUserId) {
  clearIntroHints();

  const active = users.find(u => u.id === activeUserId);
  if (!active) return;

  // Active user's chat: light-blue hint
  const activeBox = byId(`${active.id}-chatbox`);
  if (activeBox) {
    const hintWrap = document.createElement('div');
    hintWrap.className = 'hairline--light';
    const hint = document.createElement('div');
    hint.className = 'sys-hint--active';
    hint.textContent = t(active.language, 'intro.hint.active');
    hintWrap.appendChild(hint);
    activeBox.appendChild(hintWrap);
    activeBox.scrollTop = activeBox.scrollHeight;
  }

  // Other users: dark-blue hint lines
  users.forEach(u => {
    if (u.id === activeUserId) return;
    const box = byId(`${u.id}-chatbox`);
    if (!box) return;
    const wrap = document.createElement('div');
    wrap.className = 'hairline--dark';
    const hint = document.createElement('div');
    hint.className = 'sys-hint--others';
    hint.textContent = t(u.language, 'intro.hint.others', { name: active.name });
    wrap.appendChild(hint);
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
  });
}

/* === UI Building === */
function addUserSection() {
  const container = byId("users-container");
  if (!container){ console.error("[addUserSection] container missing"); return; }

  const userId = `user${String.fromCharCode(65 + users.length)}`;
  const color = colors[users.length % colors.length];

  const wrap = document.createElement("div");
  wrap.className = "user-section";
  wrap.id = `${userId}-section`;
  wrap.innerHTML = `
    <div id="${userId}-inputs">
      <input type="text" id="${userId}-name" placeholder="Name" />
      <select id="${userId}-lang">
        <option value="de">Deutsch</option>
        <option value="es">Spanisch</option>
        <option value="en">Englisch</option>
        <option value="fr">Französisch</option>
        <option value="it">Italienisch</option>
      </select>
      <button id="${userId}-save">Speichern</button>
    </div>

    <div id="${userId}-display" class="name-display"></div>
  `;
  container.appendChild(wrap);

  const user = {
    id: userId,
    name: "",
    language: "",
    color,
    chatbox: byId(`${userId}-chatbox`),
    input: byId(`${userId}-input`)
  };
  users.push(user);

  // Enter auf Name-Feld = speichern
  const nameInput = byId(`${userId}-name`);
  if (nameInput){
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveUser(userId);
    });
  }

  // Chat schon gestartet? → sofort Frame erzeugen
  if (chatUIStarted) createFrameForUser(user);
}

// === Frame-Factory: Erzeugt und montiert einen iPhone-Frame für einen User ===
function createFrameForUser(u) {
  const userSection = byId(`${u.id}-section`);
  if (!userSection) {
    console.warn("[createFrameForUser] user-section missing for", u.id);
    return;
  }

  // Falls Frame schon existiert → nicht doppeln
  if (byId(`${u.id}-frame`)) return;

  // Frame-Gerüst
  const frame = document.createElement("div");
  frame.className = "device-frame";
  frame.id = `${u.id}-frame`;
  frame.setAttribute("data-user", u.id);
// === User-Header (Name + optional Owner-Badge) ===
const header = document.createElement("div");
header.className = "phone_header";

const nameSpan = document.createElement("span");
nameSpan.className = "title";

// (CC) wieder anzeigen
const cc = (u.language || "en").toUpperCase();
nameSpan.textContent = `${u.name} (${cc})`;

// Falls Chat-Owner, Badge anhängen (Promise-basiert, lint-clean)
import('./state/chatMeta.js')
  .then((ChatMeta) => ChatMeta.getOwnerId?.())
  .then((ownerId) => {
    // einfache Heuristik: erster User = Owner oder Vergleich per ID
    if (ownerId && (u.id === 'userA' || ownerId === u.id)) {
      const badge = document.createElement('span');
      badge.className = 'owner-badge';
      badge.textContent = 'Chat Owner';
      nameSpan.appendChild(badge);
    }
  })
  .catch((err) => console.warn('[createFrameForUser] owner check failed:', err));

header.appendChild(nameSpan);
frame.appendChild(header);

  // iPhone-Bild
  const img = document.createElement("img");
  img.className = "iphone";
  img.src = "chat_img/phone_frame.png";
  img.alt = "Device frame";
  img.width = 278;
  img.height = 573;

  // Screen (sichtbarer Display-Bereich 263x503)
  const screen = document.createElement("div");
  screen.className = "screen";
  screen.id = `${u.id}-screen`;
  screen.setAttribute("data-w", "263");
  screen.setAttribute("data-h", "503");

  // Chatbox + Zubehör
  const chatbox = document.createElement("div");
  chatbox.className = "chatbox";
  chatbox.id = `${u.id}-chatbox`;

  const countdown = document.createElement("div");
  countdown.className = "intro-countdown";
  countdown.id = `${u.id}-countdown`;
  countdown.style.display = "none";

  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.id = `${u.id}-typing`;
  typing.style.display = "none";
  typing.style.fontSize = "12px";
  typing.style.color = "#666";
  typing.style.margin = "4px 0";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "message-input";
  input.id = `${u.id}-input`;
  input.placeholder = "Nachricht eingeben";

  const doneBtn = document.createElement("button");
  doneBtn.className = "done-next";
  doneBtn.id = `${u.id}-done`;
  doneBtn.textContent = "Done / Next";
  doneBtn.style.display = "none";

  // Hierarchie montieren
  screen.appendChild(chatbox);
  screen.appendChild(countdown);
  screen.appendChild(typing);
  screen.appendChild(input);
  screen.appendChild(doneBtn);
  // === Header (zentrierter Name + optionaler Owner-Badge) ===
  const headerBar = document.createElement('div');
  headerBar.className = 'device-header';
  headerBar.style.cssText = [
    'padding:8px 10px',
    'background:#f8fafc',
    'border-bottom:1px solid #e5e7eb',
    'text-align:center',
    'font:13px/1.2 system-ui,Segoe UI,Roboto,Arial,sans-serif'
  ].join(';');

  const titleLine = document.createElement('span');
  titleLine.className = 'title';
  titleLine.style.fontWeight = '600';
  titleLine.textContent = u.name || 'User';

  headerBar.appendChild(titleLine);

  // Owner-Badge asynchron nachziehen (kein Layoutsprung in der Höhe)
  (async () => {
    try {
      const ChatMeta = await import('./state/chatMeta.js');
      const ownerId = await ChatMeta.getOwnerId();
      if (ownerId && ownerId === u.id) {
        const badge = document.createElement('span');
        badge.className = 'owner-badge';
        badge.textContent = 'chat owner';
        // Abstand minimal, ohne Blocksprung
        badge.style.marginLeft = '6px';
        titleLine.appendChild(badge);
      }
    } catch {}
  })();

  // Header vor dem Screen einhängen
  frame.appendChild(headerBar);
  frame.appendChild(img);
  frame.appendChild(screen);
  const mountRow = document.getElementById('framesRow');
  (mountRow || userSection).appendChild(frame);

  // Referenzen im User-Objekt aktualisieren
  u.chatbox = chatbox;
  u.input = input;

  // Events (Enter senden, Typing-Indikator)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleMessage(u);
  });
  input.addEventListener("input", () => {
    if (chatFlow.mode === "intro" && chatFlow.currentIntroUserId === u.id) {
      resetIntroTimerFor(u.id);
    }
  });
  input.addEventListener("input", () => {
    setTyping(u.id, true);
    clearTimeout(typingTimers[u.id]);
    typingTimers[u.id] = setTimeout(() => setTyping(u.id, false), 800);
  });
  input.addEventListener("blur", () => {
    setTyping(u.id, false);
    clearTimeout(typingTimers[u.id]);
  });
}

function saveUser(id) {
  const nameEl = byId(`${id}-name`);
  const langEl = byId(`${id}-lang`);
  if (!nameEl || !langEl) { console.warn("[saveUser] inputs missing for", id); return; }

  const name = nameEl.value.trim();
  const language = langEl.value;
  if (!name) return;

  const u = users.find(x => x.id === id);
  if (!u){ console.error("[saveUser] user not found", id); return; }
  u.name = name;
  u.language = language;

  const disp = byId(`${id}-display`);
  if (disp) disp.textContent = `${name} (${language})`;
  if (nameEl) nameEl.style.display = "none";
  if (langEl) langEl.style.display = "none";
  const saveBtn = byId(`${id}-save`);
  if (saveBtn) saveBtn.style.display = "none";

  // Eingabefeld aktivieren
  const input = byId(`${id}-input`);
  if (input){
    input.style.display = "block";
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleMessage(u);
    });
    // Tipp-Reset auf Grace
    input.addEventListener("input", () => {
      if (chatFlow.mode === "intro" && chatFlow.currentIntroUserId === u.id) {
        resetIntroTimerFor(u.id);
      }
    });
    // Typing-Indikator
    input.addEventListener("input", () => {
      setTyping(u.id, true);
      clearTimeout(typingTimers[u.id]);
      typingTimers[u.id] = setTimeout(() => setTyping(u.id, false), 800);
    });
    input.addEventListener("blur", () => {
      setTyping(u.id, false);
      clearTimeout(typingTimers[u.id]);
    });
  }

  const startBtn = byId("startChat");
  if (startBtn && users.length > 0 && users.every(x => x.name)) startBtn.disabled = false;

  // NEW(S-1b): update top "Start chat" button state (requires ≥2 saved users)
  if (typeof window.updateStartChatState === 'function') window.updateStartChatState();
}

function startChat() {
  const startBtn = byId("startChat");
  if (startBtn) startBtn.disabled = true;
  chatUIStarted = true;

  // iPhone-Frames/Chatfenster sichtbar
  document.querySelectorAll(".user-section").forEach(sec => {
    sec.style.display = "block";
  });

  setMain("Chat wird initialisiert …");
  setStatus("Init gestartet.");

  // Frames für alle aktuellen Nutzer erzeugen (falls nicht vorhanden)
  users.forEach(u => createFrameForUser(u));
  users.forEach(u => {
    if (u.input){
      u.input.style.display = "block";
    }
  });

  // Init-Sequenz pro Chatfenster starten
  document.dispatchEvent(new Event("app:init:start"));
  showInitForAllUsers();
  triggerInitialModeration(); // erste Systemnachricht
}

// mode: "own" | "other" | "moderator"
function appendMessage(chatUserId, message, mode = "other", fromUserId = null) {
  const chatUser = users.find(x => x.id === chatUserId);
  if (!chatUser || !chatUser.chatbox) return;

  const wrap = document.createElement("div");
  wrap.className = `message ${mode}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (mode === "moderator") {
    const icon = document.createElement("img");
    icon.className = "vye-icon";
    icon.alt = "Vye";
    wrap.appendChild(icon);
    icon.style.display = "block";
    icon.addEventListener("load", () => { icon.style.display = "block"; });
    icon.src = "chat_img/vye_icon.png?v=1";
    bubble.innerHTML = `<span class="sender moderator-label">Vye (Moderator):</span> ${escapeHtml(message)}`;
  } else if (mode === "own") {
    bubble.textContent = message;
  } else {
    const sender = users.find(x => x.id === fromUserId);
    const senderName = sender?.name || "User";
    const senderColor = sender?.color || "#333";
    bubble.innerHTML = `<span class="sender" style="color:${senderColor};font-weight:bold;">${escapeHtml(senderName)}:</span> ${escapeHtml(message)}`;
  }

  wrap.appendChild(bubble);
  chatUser.chatbox.appendChild(wrap);
  chatUser.chatbox.scrollTop = chatUser.chatbox.scrollHeight;
}

// === Per-Chat Init Loader (in jeder User-Chatbox) ===
function createInitNode(lang = "en") {
  const wrap = document.createElement("div");
  wrap.className = "chat-init";
  wrap.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "align-items:center",
    "justify-content:center",
    "gap:8px",
    "width:100%",
    "min-height:100%",
    "text-align:center",
    "margin:0",
    "opacity:.92"
  ].join(";");

  const pic = document.createElement("picture");
  const img = document.createElement("img");
  img.alt = "Vye loading";
  img.width = 76;
  img.style.width = "auto";
  img.loading = "eager";
  img.decoding = "async";
  img.style.display = "none";

  const CANDIDATE_WEBP = ["assets/vye_init_loader_v4b.webp", "chat_img/vye_init_loader_v4b.webp"];
  const CANDIDATE_GIF  = ["assets/vye_init_loader_v4b.gif",  "chat_img/vye_init_loader_v4b.gif"];

  function preload(src) {
    return new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(true);
      probe.onerror = () => resolve(false);
      probe.src = src + "?v=" + Date.now();
    });
  }

  async function pickAndShow() {
    for (const webp of CANDIDATE_WEBP) {
      if (await preload(webp)) {
        const sWebp = document.createElement("source");
        sWebp.type = "image/webp";
        sWebp.srcset = webp + "?v=" + Date.now();
        pic.appendChild(sWebp);

        let chosenGif = null;
        for (const gif of CANDIDATE_GIF) {
          if (await preload(gif)) { chosenGif = gif; break; }
        }
        img.src = (chosenGif || CANDIDATE_GIF[0]) + "?v=" + Date.now();
        img.style.display = "block";
        return;
      }
    }
    for (const gif of CANDIDATE_GIF) {
      if (await preload(gif)) {
        img.src = gif + "?v=" + Date.now();
        img.style.display = "block";
        return;
      }
    }
    img.remove();
  }
  pickAndShow();

  pic.appendChild(img);

  const br = document.createElement("br");
  const text = document.createElement("div");
  text.className = "system-msg";
  text.style.color = "#666";
  text.textContent = t(lang, "init.initializing");

  wrap.appendChild(pic);
  wrap.appendChild(br);
  wrap.appendChild(text);

  return wrap;
}

function showInitForAllUsers() {
  users.forEach(u => {
    const box = byId(`${u.id}-chatbox`);
    if (!box) return;
    box.classList.add("loading");
    box.querySelectorAll(".chat-init").forEach(n => n.remove());
    const node = createInitNode(u.language || "en");
    box.appendChild(node);
    box.scrollTop = box.scrollHeight;
  });
}

function hideInitForAllUsers() {
  users.forEach(u => {
    const box = byId(`${u.id}-chatbox`);
    if (!box) return;
    box.querySelectorAll(".chat-init").forEach(n => n.remove());
  });
}

/* === Payload Builder (dein dokumentiertes Schema) === */
function buildBaseEnvelope(parentId) {
  return {
    chat_id: window.__chatId,
    timestamp: new Date().toISOString(),
    session_status: "active",
    moderation_stage: "introduction",
    users: users.map(u => ({
      user_id: u.id,
      name: u.name,
      language: u.language,
      preferences: { topics: [], formality_level: "informal" }
    })),
    conversation: [],
    moderation: {
      language_matching: true,
      moderation_tone: "neutral",
      translation_logic: "dual",
      contextual_suggestions: true,
      auto_topic_switch: false
    },
    triggers: {
      on_inactivity: 300,
      user_requests_topic_change: true,
      user_asks_ai: true
    },
    parent_ID: parentId
  };
}

/* === Network === */
async function postToMake(payload) {
  let res;
  try{
    res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (netErr){
    setMain("Netzwerkfehler.");
    setStatus(String(netErr), true);
    console.error("[postToMake] network error:", netErr);
    throw netErr;
  }
  const text = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, body: text };
}

/* === Flows === */
async function triggerInitialModeration() {
  const envelope = buildBaseEnvelope("mod");
  envelope.conversation = [{ message_content: "", translated_content: [] }];

  try {
    setMain("Sende Initial-Moderation …");
    const result = await postToMake(envelope);
    if (!result.ok) {
      setMain("Fehler bei Moderation.");
      setStatus(`HTTP ${result.status}\n${result.body||"(kein Body)"}`, true);
      console.error("[triggerInitialModeration] HTTP error:", result);
      return;
    }
    handleResponse(result.body, /*senderId*/ null);
  } catch (e) {
    // bereits geloggt
  }
}

async function handleMessage(sender) {
  const message = sender.input?.value?.trim();
  if (!message) return;
  sender.input.value = "";

  // Enter-Send zählt nicht als 'input' → Timer manuell zurücksetzen
  if (chatFlow.mode === "intro" && sender.id === chatFlow.currentIntroUserId) {
    resetIntroTimerFor(sender.id);
  }

  // Intro-Mode: "/done" nur nach erster Intro-Nachricht erlaubt
  if (chatFlow.mode === "intro" && sender.id === chatFlow.currentIntroUserId && message.toLowerCase() === "/done") {
    const st = userState[sender.id];
    if (st && st.introMessageSent) {
      advanceIntro(sender.id, "done");
    } else {
      appendMessage(sender.id, "Please share a brief intro first, then press Done.", "moderator");
    }
    return;
  }

  appendMessage(sender.id, message, "own");
  conversationHistory.push({ sender: sender.id, message });
  lastSentByUser[sender.id] = message; // local fallback

  // Markiere: erste Intro-Nachricht gesendet → Button aktivieren
  if (chatFlow.mode === "intro" && sender.id === chatFlow.currentIntroUserId) {
    if (!userState[sender.id]) {
      userState[sender.id] = {
        mode: "speaker",
        canType: true,
        typing: false,
        probablyIdle: false,
        introStatus: "pending",
        introMessageSent: false,
        pendingNetwork: false,
        queuedAdvance: false
      };
    }

  // Erste Intro-Nachricht → freigeben
  userState[sender.id].introMessageSent = true;

  const doneBtn = byId(`${sender.id}-done`);
  if (doneBtn) {
    doneBtn.disabled = false;
    doneBtn.style.opacity = "1";
    doneBtn.style.pointerEvents = "auto";
    doneBtn.title = "Click to finish your intro";
  }
}

  // Lock while network in flight (only for active intro speaker)
  if (chatFlow.mode === "intro" && sender.id === chatFlow.currentIntroUserId) {
    const st = userState[sender.id] || (userState[sender.id] = {});
    st.pendingNetwork = true;
    st.queuedAdvance = false;
    const btn = byId(`${sender.id}-done`);
    if (btn) { btn.disabled = true; btn.title = "sending…"; }
  }

  const envelope = buildBaseEnvelope("mess");
  envelope.sender_id = sender.id; // make sender explicit for Make/LLM
  envelope.receivers = users.filter(u => u.id !== sender.id).map(u => u.id);
  envelope.conversation = [{ message_content: message, translated_content: [] }];

  try {
    setMain("Sende Nachricht …");
    const result = await postToMake(envelope);
    if (!result.ok) {
      setMain("Fehler beim Senden.");
      setStatus(`HTTP ${result.status}\n${result.body||"(kein Body)"}`, true);
      console.error("[handleMessage] HTTP error:", result);
      return;
    }
    handleResponse(result.body, sender.id);
  } catch (e) {
    // bereits geloggt
  }
}

/* === Response Handling (erwartet translations[]) === */
function handleResponse(rawBody, senderId) {
  const cleaned = (rawBody || "").trim();
  if (!cleaned) {
    setStatus("OK, leerer Body (Make-Webhook). Prüfe Execution-History in Make.");
    setMain("Gesendet.");
    return;
  }

  let data;
  try { data = JSON.parse(cleaned); }
  catch (e){
    setStatus("Antwort ist kein JSON:\n"+cleaned, true);
    setMain("Antwortfehler.");
    console.error("[handleResponse] parse error:", e, cleaned);
    return;
  }

  console.log("[handleResponse] data:", data);
  setMain("Gesendet.");
  setStatus("OK: Antwort empfangen.");

  // === Receiver-driven rendering for user messages ===
  if (senderId) {
    const byRid = new Map();
    if (Array.isArray(data.translations)) {
      data.translations.forEach(t => {
        if (!t || typeof t.receiver !== "string") return;
        const rid = t.receiver.trim();
        const msg = (typeof t.message === "string") ? t.message.trim() : "";
        byRid.set(rid, msg);
      });
    }
    const expected = users.map(u => u.id).filter(id => id !== senderId);

    expected.forEach(rid => {
      const msg = (byRid.get(rid) || "").trim();
      if (msg.length > 0) {
        appendMessage(rid, msg, "other", senderId);
      } else if (lastSentByUser[senderId]) {
        appendMessage(rid, lastSentByUser[senderId], "other", senderId);
      }
    });

    // unlock + queued Done
    const st = userState[senderId];
    if (st) {
      st.pendingNetwork = false;
      const btn = byId(`${senderId}-done`);
      if (btn) { btn.disabled = false; btn.title = ""; }
      if (st.queuedAdvance) {
        st.queuedAdvance = false;
        advanceIntro(senderId, "queued");
      }
    }
    return;
  }

  // === Moderator-greetings (senderId == null) ===
  data.translations.forEach(t => {
    if (!t || typeof t.receiver !== "string") return;
    const rid = t.receiver.trim();
    const msg = (typeof t.message === "string") ? t.message.trim() : "";
    appendMessage(rid, msg, "moderator");
  });

  document.dispatchEvent(new Event("app:init:ready"));

  // Start intro mode right after first greeting
  if (chatFlow.mode === "idle" && users.length > 0) {
    startIntroMode(users[0].id);
  }
}

/* === Intro Flow Helpers === */
function startIntroMode(firstUserId) {
  chatFlow.mode = "intro";
  chatFlow.currentIntroUserId = firstUserId;
  chatFlow.currentIntroIndex = 0;

  // Per-User-Zustand initialisieren
  users.forEach((u, idx) => {
    userState[u.id] = {
      mode: idx === 0 ? "speaker" : "queued",
      canType: idx === 0,
      typing: false,
      probablyIdle: false,
      introStatus: "pending",
      introMessageSent: false,
      pendingNetwork: false,
      queuedAdvance: false
    };
  });

  // UI: nur erster Sprecher aktiv + Done/Next sichtbar aber disabled
  users.forEach((u, idx) => {
    const inp = byId(`${u.id}-input`);
    if (inp){
      const isActive = (idx === 0);
      inp.disabled = !isActive;
      inp.placeholder = isActive ? `${u.name}'s intro` : "";
    }
    const btn = byId(`${u.id}-done`);
    if (btn){
      const isActive = (idx === 0);
      btn.style.display = isActive ? "inline-block" : "none";
      btn.disabled = true; // erst nach erster Intro-Nachricht aktiv
    }
  });

  updateTypingAccess();
  startGracePhaseFor(firstUserId);

  applyIntroInputStyles(firstUserId);
  renderIntroHints(firstUserId);
}

function stopIntroTimers(){
  if (chatFlow.graceTimerId){ clearTimeout(chatFlow.graceTimerId); chatFlow.graceTimerId = null; }
  if (chatFlow.countdownIntervalId){ clearInterval(chatFlow.countdownIntervalId); chatFlow.countdownIntervalId = null; }
  const currId = chatFlow.currentIntroUserId;
  if (currId){
    const cd = byId(`${currId}-countdown`);
    if (cd){ cd.style.display = "none"; cd.textContent = ""; }
  }
  chatFlow.phase = null;
}

function startGracePhaseFor(userId){
  stopIntroTimers();
  chatFlow.phase = "grace";
  const cd = byId(`${userId}-countdown`);
  if (cd){ cd.style.display = "none"; cd.textContent = ""; }
  chatFlow.graceTimerId = setTimeout(() => {
    startVisibleCountdownFor(userId);
  }, 10000);
}

function startVisibleCountdownFor(userId){
  stopIntroTimers();
  chatFlow.phase = "countdown";
  let seconds = 10;

  const user = users.find(u => u.id === userId);
  const lang = user?.language || 'en';

  const cd = byId(`${userId}-countdown`);
  if (cd){
    cd.style.display = "block";
    cd.textContent = t(lang, "intro.countdown.prompt", { secs: seconds });
  }

  chatFlow.countdownIntervalId = setInterval(() => {
    seconds--;
    if (cd){
      if (seconds > 0){
        cd.textContent = t(lang, "intro.countdown.prompt", { secs: seconds });
      } else {
        cd.style.display = "none";
        cd.textContent = "";
      }
    }
    if (seconds <= 0){
      stopIntroTimers();
      if (userState[userId]) userState[userId].probablyIdle = true;
      advanceIntro(userId, "timeout");
    }
  }, 1000);
}

function resetIntroTimerFor(userId) {
  if (chatFlow.mode !== "intro" || chatFlow.currentIntroUserId !== userId) return;
  stopIntroTimers();
  startGracePhaseFor(userId);
}

// EINHEITLICHER Handover (verschmolzen)
function advanceIntro(finishedUserId, reason) {
  if (chatFlow.mode !== "intro" || finishedUserId !== chatFlow.currentIntroUserId) return;

  stopIntroTimers();

  const finished = users.find(u => u.id === finishedUserId);
  if (finished) {
    if (!userState[finished.id]) userState[finished.id] = {};
    userState[finished.id].introStatus = (reason === "timeout") ? "timeout" : "done";
    userState[finished.id].mode = "free";
    userState[finished.id].canType = false;

    const finishedInput = byId(`${finished.id}-input`);
    if (finishedInput){ finishedInput.disabled = true; finishedInput.placeholder = ""; }
    const finishedBtn = byId(`${finished.id}-done`);
    if (finishedBtn){ finishedBtn.style.display = "none"; }
  }

  const idx = users.findIndex(u => u.id === finishedUserId);
  const next = users[idx + 1];
  chatFlow.currentIntroIndex = idx + 1;

  if (!next) {
    const anyoneIdle = users.some(u => userState[u.id]?.probablyIdle);
    if (anyoneIdle) {
      users.forEach(u => {
        appendMessage(u.id, t(u.language || 'en', "intro.idle.summary"), "moderator");
      });
    }
    chatFlow.mode = "idle"; // oder "open"
    chatFlow.currentIntroUserId = null;
    setMain("Intro phase complete.");
    setStatus("All intros finished.");
    clearIntroHints();
    return;
  }

  chatFlow.currentIntroUserId = next.id;

  // Moderator-Ansage (lokal)
  users.forEach(u => {
    let msg;
    switch (u.language) {
      case "de": msg = `Jetzt ist ${next.name} dran mit der Vorstellung.`; break;
      case "es": msg = `Ahora es el turno de ${next.name} para presentarse.`; break;
      case "fr": msg = `C’est au tour de ${next.name} de se présenter.`; break;
      case "it": msg = `Ora è il turno di ${next.name} di presentarsi.`; break;
      default:   msg = `Now it’s ${next.name}’s turn to introduce.`; break;
    }
    appendMessage(u.id, msg, "moderator");
  });

  users.forEach(u => {
    if (!userState[u.id]) userState[u.id] = { mode:"queued", canType:false, typing:false, probablyIdle:false, introStatus:"pending", introMessageSent:false };

    const isNext = (u.id === next.id);
    if (isNext){
      userState[u.id].mode = "speaker";
      userState[u.id].canType = true;
    } else if (u.id !== finishedUserId) {
      userState[u.id].mode = (userState[u.id].introStatus === "done") ? "free" : "queued";
      userState[u.id].canType = false;
    }

    const inp = byId(`${u.id}-input`);
    if (inp){
      inp.disabled = !isNext;
      inp.placeholder = isNext ? `${u.name}'s intro` : "";
    }
    const btn = byId(`${u.id}-done`);
    if (btn){
      btn.style.display = isNext ? "inline-block" : "none";
      btn.disabled = true; // bis erste Intro-Message
    }
  });

  updateTypingAccess();
  startGracePhaseFor(next.id);
}

function updateTypingAccess() {
  users.forEach(u => {
    if (!u.input) return;
    const active = (u.id === chatFlow.currentIntroUserId);

    u.input.disabled = !active;
    u.input.placeholder = active ? `${u.name}'s intro` : "";

    const doneBtn = byId(`${u.id}-done`);
    if (doneBtn) doneBtn.style.display = active ? "block" : "none";
  });

  if (chatFlow.currentIntroUserId) {
    applyIntroInputStyles(chatFlow.currentIntroUserId);
    renderIntroHints(chatFlow.currentIntroUserId);
  }
}

/* === Typing indicators (helpers) === */
const typingTimers = {}; // { [userId]: number }

function setTyping(userId, isTyping){
  if (!userState[userId]) {
    userState[userId] = { mode:"queued", canType:false, typing:false, probablyIdle:false, introStatus:"pending", introMessageSent:false };
  }
  userState[userId].typing = !!isTyping;
  renderTypingIndicators();
}

/* ===========================================================
   TYPING INDICATORS (viewer-localized)
   =========================================================== */
function renderTypingIndicators(){
  users.forEach(viewer => {
    const el = byId(`${viewer.id}-typing`);
    if (!el) return;

    const typers = users
      .filter(u => userState[u.id]?.typing && u.id !== viewer.id)
      .map(u => u.name);

    if (typers.length === 0){
      el.style.display = "none";
      el.textContent = "";
      return;
    }

    const lang = viewer.language || 'en';
    let text = "";

    if (typers.length === 1) {
      text = t(lang, "typing.single", { name: typers[0] });
    } else if (typers.length === 2) {
      text = t(lang, "typing.double", { name1: typers[0], name2: typers[1] });
    } else {
      text = t(lang, "typing.multi");
    }

    el.style.display = "block";
    el.textContent = text;
  });
}

// Expose für index.html Preset-Script
window.addUserSection = addUserSection;
window.saveUser = saveUser;
window.createFrameForUser = createFrameForUser;
window.users = users;

/* === PATCH I-3 (deprecated) — replaced by I-3a panel === */
// (Intentionally left blank. Old dropdown logic removed to avoid hiding the CTA button.)

/* === PATCH I-3a: Owner-Selection Panel under CTA (index.html only) — Lint-clean === */
(async function initOwnerPanel() {
  const ctaBtn = document.getElementById('btnOwnerCta');
  const ownerArea = document.getElementById('ownerSelectArea'); // Panel-Container
  const ownerSummary = document.getElementById('ownerSummary');
  const framesRow = document.getElementById('framesRow');

  if (!ctaBtn || !ownerArea || !ownerSummary || !framesRow) return; // nur auf index.html

  // Owner-Hinweis ausblenden
  ownerSummary.style.display = 'none';
  ownerSummary.textContent = '';
  ownerSummary.classList.remove('small');
  
  // Dynamische Imports, um doppelte Top-Level-Imports zu vermeiden
  const ProfileStore = await import('./state/profileStore.js');
  const ChatMeta = await import('./state/chatMeta.js');

  // --- state ---
  let panelOpen = false;
  let pendingOwnerId = null;
  let pendingOwnerProfile = null;

  // Helper: CC aus language (Fallback)
  const getCC = (p) => (p?.profile?.system?.language || 'en').toUpperCase();

  // Helper: Button visuell auf "Select" (grün + >) schalten oder zurücksetzen
  function setCtaModeSelect(active) {
    const plusEl = ctaBtn.querySelector('.plus');
    if (!plusEl) return;

    if (active) {
      ctaBtn.style.background = '#10b981'; // green-500
      ctaBtn.style.border = 'none';
      ctaBtn.style.color = '#fff';
      plusEl.textContent = '›'; // typografischer Pfeil

      if (ctaBtn.lastChild && ctaBtn.lastChild.nodeType === 3) {
        ctaBtn.lastChild.nodeValue = ' Select';
      } else {
        ctaBtn.appendChild(document.createTextNode(' Select'));
      }
    } else {
      ctaBtn.style.background = '#2563eb'; // blue-600
      ctaBtn.style.border = 'none';
      ctaBtn.style.color = '#fff';
      plusEl.textContent = '+';

      if (ctaBtn.lastChild && ctaBtn.lastChild.nodeType === 3) {
        ctaBtn.lastChild.nodeValue = ' Select chat owner';
      } else {
        ctaBtn.appendChild(document.createTextNode(' Select chat owner'));
      }
    }
  }

  // Helper: Panel (Liste) rendern
  // Helper: Panel (Liste) rendern – EXAKT unter CTA, schwebend
async function renderPanel() {
  // Geometrie des CTA-Buttons + seines Row-Containers
  const ctaRect  = ctaBtn.getBoundingClientRect();
  const rowEl    = ctaBtn.closest('.cta-row');
  const rowRect  = rowEl ? rowEl.getBoundingClientRect() : { left: 0, top: 0 };
  const scrollY  = window.scrollY || document.documentElement.scrollTop;
  const scrollX  = window.scrollX || document.documentElement.scrollLeft;

  // Container vorbereiten (floating)
  ownerArea.innerHTML = '';
  ownerArea.style.display = 'block';
  // Floating-Panel: über CTA-Button positionieren
  const rect = ctaBtn.getBoundingClientRect();
  ownerArea.classList.add('floating-panel');
  ownerArea.style.position = 'absolute';
  ownerArea.style.left = rect.left + 'px';
  ownerArea.style.top = rect.bottom + window.scrollY + 'px';
  ownerArea.style.width = rect.width + 'px';
  ownerArea.style.zIndex = '9999';
  ownerArea.classList.add('floating-panel');


  // EXAKTE Position direkt unter dem Button (innerhalb .cta-row)
  ownerArea.style.left = (ctaRect.left - rowRect.left + scrollX) + 'px';
  ownerArea.style.top  = (ctaRect.bottom - rowRect.top + scrollY + 4) + 'px';

  // Box mit Button-Breite
  const box = document.createElement('div');
  box.style.width = Math.round(ctaRect.width) + 'px';
  box.style.maxHeight = '200px';
  box.style.overflowY = 'auto';
  box.style.border = '1px solid #e5e7eb';
  box.style.borderRadius = '8px';
  box.style.background = '#fff';
  box.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';

  const list = document.createElement('div');
  list.setAttribute('role', 'list');

  // Profile laden
  let profiles = await ProfileStore.getAll();
  
  
  // Fallback: falls ProfileStore leer ist → aus localStorage.chat_injected_profiles mappen
  try {
    if (!profiles || profiles.length === 0) {
      const raw = localStorage.getItem('chat_injected_profiles');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          profiles = arr
            .map(obj => ({
              id: obj?.profile_id || obj?.id || '',
              name: obj?.profile?.identity?.user_name || obj?.name || 'User',
              profile: {
                system: {
                  // bevorzugt system.language, sonst identity.language, sonst 'en'
                  language:
                    obj?.profile?.system?.language ||
                    obj?.profile?.identity?.language ||
                    'en'
                }
              }
            }))
            .filter(p => p.id);
        }
      }
    }
  } catch (e) {
    console.warn('[OwnerSelect] fallback from localStorage failed:', e);
  }
  if (!profiles.length) {
    const empty = document.createElement('div');
    empty.textContent = 'No profiles yet.';
    empty.style.font = '13px system-ui,Segoe UI,Roboto,Arial,sans-serif';
    empty.style.color = '#6b7280';
    empty.style.padding = '10px';
    box.appendChild(empty);
  } else {
    profiles.forEach((p, idx) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.setAttribute('role', 'listitem');
      item.style.display = 'block';
      item.style.width = '100%';
      item.style.textAlign = 'left';
      item.style.background = 'transparent';
      item.style.border = 'none';
      item.style.margin = '0';
      item.style.padding = '10px 12px';
      item.style.cursor = 'pointer';
      item.style.font = '14px system-ui,Segoe UI,Roboto,Arial,sans-serif';
      item.style.color = '#111';
      item.textContent = `${p.name} (${getCC(p)})`;
      if (idx > 0) item.style.borderTop = '1px solid #e5e7eb';

      // Referenz + Hover/Select
      item.dataset.pid = p.id;

      item.addEventListener('mouseenter', () => {
        if (item.dataset.selected === 'true') return;
        item.style.background = '#2563eb';
        item.style.color = '#fff';
      });
      item.addEventListener('mouseleave', () => {
        if (item.dataset.selected === 'true') return;
        item.style.background = 'transparent';
        item.style.color = '#111';
      });

      // Auswahl (persistente Markierung + CTA wird grün)
      item.addEventListener('click', () => {
        pendingOwnerId = p.id;
        pendingOwnerProfile = p;

        list.querySelectorAll('[data-selected="true"]').forEach(el => {
          el.dataset.selected = 'false';
          el.style.background = 'transparent';
          el.style.color = '#111';
        });

        item.dataset.selected = 'true';
        item.style.background = '#000';
        item.style.color = '#fff';

        setCtaModeSelect(true);
      });

      list.appendChild(item);
    });
  }

  box.appendChild(list);
  ownerArea.appendChild(box);
}

  // Helper: Panel schließen + Button zurücksetzen
  function closePanelReset() {
    ownerArea.style.display = 'none';
    ownerArea.innerHTML = '';
    panelOpen = false;
    pendingOwnerId = null;
    pendingOwnerProfile = null;
    ownerSummary.textContent = 'No owner selected yet.';
    ownerSummary.classList.add('small');
    setCtaModeSelect(false);
  }

// Helper: Owner-Frame rendern (sauber über dem Phone-Frame, ohne Layout-Verschiebung)
function renderOwnerFrame(profile) {
  // existierenden Owner-Frame entfernen
  const prev = framesRow.querySelector('.phone_frame[data-role="owner"]');
  if (prev) prev.remove();

  // Umrahmung für den Owner (Container im Flex-Row)
  const frame = document.createElement('div');
  frame.className = 'phone_frame';
  frame.dataset.role = 'owner';

  // Header: Name + Badge + (change)
  const header = document.createElement('div');
  header.className = 'phone_header';

  const title = document.createElement('span');
  title.className = 'title';
  // nur Name + (CC), kein "Owner:"-Präfix
  title.textContent = `${profile.name} (${getCC(profile)})`;

  const badge = document.createElement('span');
  badge.className = 'owner-badge';
  badge.textContent = 'Chat Owner';

  const change = document.createElement('a');
  change.href = '#';
  change.className = 'mini-link';
  change.dataset.action = 'change-owner';
  change.textContent = '(change)';

  change.addEventListener('click', (e) => {
    e.preventDefault();
    // zurück in Auswahlmodus
    ownerSummary.textContent = 'No owner selected yet.';
    ownerSummary.classList.add('small');
    setCtaModeSelect(false);
    panelOpen = false; // erzwinge Re-Open beim nächsten Klick
    ctaBtn.click();
  });

  // Reihenfolge: Titel → Badge → (change)
  header.appendChild(title);
  header.appendChild(badge);
  header.appendChild(change);

  // Body: Platzhalter, echte Chat-UI wird von Legacy-Flow erzeugt
  const body = document.createElement('div');
  body.className = 'phone_body';
  body.style.minHeight = '420px';
  body.style.padding = '10px';
  body.style.font = '13px system-ui,Segoe UI,Roboto,Arial,sans-serif';
  body.style.color = '#6b7280';
  body.textContent = 'Chat frame placeholder (existing flow stays as-is).';

  // Zusammenbauen & einhängen (Owner zuerst)
  frame.appendChild(header);
  frame.appendChild(body);
  framesRow.prepend(frame);
}

  // --- Event: CTA Button ---
  ctaBtn.addEventListener('click', async () => {
    // Wenn bereits eine pending Auswahl vorliegt → grüner Button = Confirm
    if (pendingOwnerId && pendingOwnerProfile) {
      try {
        const ProfileStore = await import('./state/profileStore.js');
        const ChatMeta = await import('./state/chatMeta.js');

        await ChatMeta.setOwnerId(pendingOwnerId);

        // downstream: Add-User aktivieren
        try {
          document.dispatchEvent(new CustomEvent('owner:changed', { detail: { owner_id: pendingOwnerId } }));
        } catch {}

        // Panel schließen
        ownerArea.style.display = 'none';
        ownerArea.innerHTML = '';
        panelOpen = false;

        // CTA ausblenden
        ctaBtn.style.display = 'none';

        // sicherstellen, dass der Legacy-Container existiert
        let uc = document.getElementById('users-container');
        if (!uc) {
          uc = document.createElement('div');
          uc.id = 'users-container';
          uc.style.display = 'none';
          const fr = document.getElementById('framesRow');
          if (fr && fr.parentNode) {
            fr.parentNode.insertBefore(uc, fr); // vor Frames-Row einhängen
          } else {
            document.body.appendChild(uc);
          }
        }
        // Sichtbar machen, damit Frames angezeigt werden
        uc.style.display = 'block';

        // === ALTES UI verwenden: regulären User erzeugen ===
        if (typeof window.addUserSection === 'function') {
          window.addUserSection();
        }

        // letzten (neu erzeugten) User ermitteln
        const uArr = (typeof window.users !== 'undefined' && Array.isArray(window.users)) ? window.users : (typeof users !== 'undefined' ? users : []);
        const u = uArr.length ? uArr[uArr.length - 1] : null;

        if (u) {
          // Name/Lang setzen und speichern
          const nameEl = document.getElementById(`${u.id}-name`);
          const langEl = document.getElementById(`${u.id}-lang`);
          if (nameEl) nameEl.value = pendingOwnerProfile.name || 'Owner';
          if (langEl) {
            const cc = (pendingOwnerProfile.profile?.system?.language || 'en').toLowerCase();
            const allowed = ['de','en','es','fr','it'];
            langEl.value = allowed.includes(cc) ? cc : 'en';
          }
          if (typeof window.saveUser === 'function') {
            window.saveUser(u.id);
          } else if (typeof saveUser === 'function') {
            saveUser(u.id);
          }

          // echten Frame rendern
          if (typeof window.createFrameForUser === 'function') {
            window.createFrameForUser(u);
          } else if (typeof createFrameForUser === 'function') {
            createFrameForUser(u);
          }
        } else {
          // Fallback: Minimalframe (sollte normal nicht nötig sein)
          renderOwnerFrame(pendingOwnerProfile);
        }

      } catch (err) {
        console.error('[OwnerSelect] confirm failed:', err);
      }
      return;
    }

    // Andernfalls: Panel auf/zu klappen
    if (!panelOpen) {
      await renderPanel();
      panelOpen = true;
    } else {
      ownerArea.style.display = 'none';
      ownerArea.innerHTML = '';
      panelOpen = false;
      if (!pendingOwnerId) setCtaModeSelect(false);
    }
  });

  // Falls Owner schon gesetzt war (Persistenz), beim Laden UI sofort zeigen
  try {
    const ownerId = await ChatMeta.getOwnerId();
    if (ownerId) {
      const all = await ProfileStore.getAll();
      const owner = all.find(p => p.id === ownerId);
      if (owner) {
        ownerSummary.textContent = `Owner: ${owner.name} (${getCC(owner)})`;
        ownerSummary.classList.remove('small');
        renderOwnerFrame(owner);
      }
    }
  } catch (err) {
    console.warn('[OwnerSelect] init load failed:', err);
  }
})();

/* === PATCH I-4: Add-User panel + duplicate guard (step 1/3) === */
(function initAddUserPanel() {
  const ctaRow = document.querySelector('.cta-row');
  const framesRow = document.getElementById('framesRow');
  if (!ctaRow || !framesRow) return; // nur auf index.html

  // State: ausgewählte Profile (Owner + hinzugefügte Teilnehmer)
  const selectedProfileIds = new Set();

  // dynamische Module erst laden, wenn nötig
  let ProfileStoreMod = null;
  async function PS() {
    if (!ProfileStoreMod) ProfileStoreMod = await import('./state/profileStore.js');
    return ProfileStoreMod;
  }

  // Hilfsfunktionen
  const getCC = (p) => (p?.profile?.system?.language || 'en').toUpperCase();

  // Button + Panel on-demand erzeugen
  let addBtn = null;
  let panelWrap = null;
  let panelOpen = false;
  let pendingProfile = null;

  function ensureAddBtn() {
    if (addBtn) return addBtn;
    addBtn = document.createElement('button');
    addBtn.id = 'btnAddUser';
    addBtn.type = 'button';
    addBtn.className = 'btn-primary';
    addBtn.style.marginLeft = '8px';
    addBtn.innerHTML = `<span class="plus">+</span> Add user`;
    ctaRow.appendChild(addBtn);
    return addBtn;
  }

  function ensurePanel() {
    if (panelWrap) return panelWrap;
    panelWrap = document.createElement('div');
    panelWrap.id = 'userSelectArea';
    panelWrap.style.display = 'none';
    panelWrap.style.padding = '0 12px 12px';
    ctaRow.appendChild(panelWrap);
    return panelWrap;
  }

  function setAddBtnModeSelect(active) {
    const plusEl = addBtn.querySelector('.plus');
    if (!plusEl) return;
    if (active) {
      addBtn.style.background = '#10b981'; // green
      plusEl.textContent = '›';
      const txt = ' Add';
      if (addBtn.lastChild && addBtn.lastChild.nodeType === 3) {
        addBtn.lastChild.nodeValue = txt;
      } else {
        addBtn.appendChild(document.createTextNode(txt));
      }
    } else {
      addBtn.style.background = '#2563eb'; // blue
      plusEl.textContent = '+';
      const txt = ' Add user';
      if (addBtn.lastChild && addBtn.lastChild.nodeType === 3) {
        addBtn.lastChild.nodeValue = txt;
      } else {
        addBtn.appendChild(document.createTextNode(txt));
      }
    }
  }

  async function renderUserPanel() {
  // Geometrie des Add-Buttons + Row-Container
  const rect   = addBtn.getBoundingClientRect();
  const rowEl  = addBtn.closest('.cta-row');
  const rowRect = rowEl ? rowEl.getBoundingClientRect() : { left: 0, top: 0 };
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const scrollX = window.scrollX || document.documentElement.scrollLeft;

  const { getAll } = await PS();
  let all = await getAll();

  // Fallback: wenn Store leer → aus localStorage.chat_injected_profiles mappen
  if (!all || all.length === 0) {
    try {
      const raw = localStorage.getItem('chat_injected_profiles');
      const arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr) && arr.length) {
        all = arr
          .map(obj => ({
            id: obj?.profile_id || obj?.id || '',
            name: obj?.profile?.identity?.user_name || obj?.name || 'User',
            profile: {
              system: {
                language:
                  obj?.profile?.system?.language ||
                  obj?.profile?.identity?.language ||
                  'en'
              }
            }
          }))
          .filter(p => p.id);
      }
    } catch (e) {
      console.warn('[AddUser] fallback from localStorage failed:', e);
    }
  }
  const candidates = all.filter(p => !selectedProfileIds.has(p.id));

  panelWrap = ensurePanel();
  panelWrap.innerHTML = '';
  panelWrap.style.display = 'block';
  // Floating-Panel über Add-User-Button positionieren
  // Floating-Panel über Add-User-Button positionieren (relativ zur .cta-row)
  panelWrap.className = 'floating-panel';
  panelWrap.style.display = 'block';
  panelWrap.style.position = 'absolute';
  panelWrap.style.zIndex = '9999';
  panelWrap.style.left = (rect.left - rowRect.left + scrollX) + 'px';
  panelWrap.style.top  = (rect.bottom - rowRect.top + scrollY + 4) + 'px';
  panelWrap.style.width = Math.round(rect.width) + 'px';

  // Box mit Button-Breite
  const box = document.createElement('div');
  box.style.width = Math.round(rect.width) + 'px';
  box.style.maxHeight = '200px';
  box.style.overflowY = 'auto';
  box.style.border = '1px solid #e5e7eb';
  box.style.borderRadius = '8px';
  box.style.background = '#fff';
  box.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';

  const list = document.createElement('div');
  list.setAttribute('role', 'list');

  if (!candidates.length) {
    const empty = document.createElement('div');
    empty.textContent = 'No more profiles available.';
    empty.style.font = '13px system-ui,Segoe UI,Roboto,Arial,sans-serif';
    empty.style.color = '#6b7280';
    empty.style.padding = '10px';
    box.appendChild(empty);
  } else {
    candidates.forEach((p, idx) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.setAttribute('role', 'listitem');
      item.style.display = 'block';
      item.style.width = '100%';
      item.style.textAlign = 'left';
      item.style.background = 'transparent';
      item.style.border = 'none';
      item.style.margin = '0';
      item.style.padding = '10px 12px';
      item.style.cursor = 'pointer';
      item.style.font = '14px system-ui,Segoe UI,Roboto,Arial,sans-serif';
      item.style.color = '#111';
      item.textContent = `${p.name} (${getCC(p)})`;
      if (idx > 0) item.style.borderTop = '1px solid #e5e7eb';

      item.dataset.pid = p.id;

      item.addEventListener('mouseenter', () => {
        if (item.dataset.selected === 'true') return;
        item.style.background = '#2563eb';
        item.style.color = '#fff';
      });
      item.addEventListener('mouseleave', () => {
        if (item.dataset.selected === 'true') return;
        item.style.background = 'transparent';
        item.style.color = '#111';
      });

      // Persistente Auswahl + Button wechselt zu grün „› Add“
      item.addEventListener('click', () => {
        pendingProfile = p;

        list.querySelectorAll('[data-selected="true"]').forEach(el => {
          el.dataset.selected = 'false';
          el.style.background = 'transparent';
          el.style.color = '#111';
        });

        item.dataset.selected = 'true';
        item.style.background = '#000';
        item.style.color = '#fff';

        setAddBtnModeSelect(true);
      });

      list.appendChild(item);
    });
  }

  box.appendChild(list);
  panelWrap.appendChild(box);
}

  // Confirm/Add action
  async function confirmAddSelected() {
    if (!pendingProfile) return;

    // ensure users-container is visible
    const uc = document.getElementById('users-container');
    if (uc) uc.style.display = 'block';

    // 1) Legacy-User-Section hinzufügen
    if (typeof window.addUserSection === 'function') {
      window.addUserSection();
    }

    // 2) letzten User ermitteln
    const uArr = (typeof window.users !== 'undefined' && Array.isArray(window.users)) ? window.users : (typeof users !== 'undefined' ? users : []);
    const u = uArr.length ? uArr[uArr.length - 1] : null;

    if (u) {
      // 3) Name/Lang setzen und speichern
      const nameEl = document.getElementById(`${u.id}-name`);
      const langEl = document.getElementById(`${u.id}-lang`);
      if (nameEl) nameEl.value = pendingProfile.name || 'User';
      if (langEl) {
        const cc = (pendingProfile.profile?.system?.language || 'en').toLowerCase();
        const allowed = ['de','en','es','fr','it'];
        langEl.value = allowed.includes(cc) ? cc : 'en';
      }
      if (typeof window.saveUser === 'function') {
        window.saveUser(u.id);
      } else if (typeof saveUser === 'function') {
        saveUser(u.id);
      }

      // 4) Frame erzeugen
      if (typeof window.createFrameForUser === 'function') {
        window.createFrameForUser(u);
      } else if (typeof createFrameForUser === 'function') {
        createFrameForUser(u);
      }

      // 5) Duplikat-Sperre aktualisieren
      selectedProfileIds.add(pendingProfile.id);

      // 6) Start-Chat-Button ggf. aktivieren
      if (typeof window.updateStartChatState === 'function') window.updateStartChatState();
    }

    // Panel schließen + Button zurücksetzen
    if (panelWrap) { panelWrap.style.display = 'none'; panelWrap.innerHTML = ''; }
    panelOpen = false;
    pendingProfile = null;
    setAddBtnModeSelect(false);
  }

  // Button-Click
  function bindAddBtn() {
    addBtn.addEventListener('click', async () => {
      if (pendingProfile) {
        await confirmAddSelected();
        return;
      }
      if (!panelOpen) {
        await renderUserPanel();
        panelOpen = true;
      } else {
        if (panelWrap) { panelWrap.style.display = 'none'; panelWrap.innerHTML = ''; }
        panelOpen = false;
        pendingProfile = null;
        setAddBtnModeSelect(false);
      }
    });
  }

  // Owner gesetzt → Add-User aktivieren + Owner in Duplikatsperre aufnehmen
  document.addEventListener('owner:changed', (e) => {
    const ownerId = e?.detail?.owner_id;
    if (ownerId) selectedProfileIds.add(ownerId);
    ensureAddBtn();
    bindAddBtn();
  }, { once: true });
})();

/* === PATCH S-1b: Start chat button state & lock === */
(function initStartChatControl(){
  const btn = document.getElementById('btnStartChatTop');
  const ctaOwner = document.getElementById('btnOwnerCta');
  const ownerPanel = document.getElementById('ownerSelectArea');
  if (!btn) return; // nur auf index.html

  // Chat-Lock (keine Änderungen mehr nach Start)
  window.__chatLocked = false;

  // Globale State-Update-Funktion (≥2 gespeicherte Nutzer nötig)
  window.updateStartChatState = function() {
    try {
      const arr = (window.users && Array.isArray(window.users)) ? window.users : (typeof users !== 'undefined' ? users : []);
      const readyCount = arr.filter(u => u && u.name && u.name.trim().length > 0).length;
      const ready = readyCount >= 2;
      btn.disabled = !ready || window.__chatLocked;
    } catch(e) {
      // noop
    }
  };

  // Klick: Chat starten → UI sperren + bestehenden Flow starten
  btn.addEventListener('click', () => {
    if (btn.disabled || window.__chatLocked) return;
    window.__chatLocked = true;
    btn.disabled = true;

    // Owner-/Add-UI sperren
    if (ctaOwner) ctaOwner.style.display = 'none';
    if (ownerPanel) { ownerPanel.style.display = 'none'; ownerPanel.innerHTML = ''; }

    const addBtn = document.getElementById('btnAddUser');
    const userPanel = document.getElementById('userSelectArea');
    if (addBtn) addBtn.style.display = 'none';
    if (userPanel) { userPanel.style.display = 'none'; userPanel.innerHTML = ''; }

    // bestehenden Chat-Flow starten
    if (typeof window.startChat === 'function') window.startChat();
    else if (typeof startChat === 'function') startChat();

    // re-evaluate ui
    if (typeof window.updateStartChatState === 'function') window.updateStartChatState();
  });

  // Initialer Zustand
  window.updateStartChatState();
})();