# Hi Stranger! Developer Implementation Guidelines (Code-Level)
_Version: 2025.10.15 — Patch 3_  
_Last updated: 15 Oct 2025_  
_Notes: Technical coding standards and implementation practices._  
_Complements:_ [`DEV_COLLAB_GUIDE.md`](../AI_briefs/DEV_COLLAB_GUIDE.md) — procedural and collaboration rules.

---

### 🧩 1. Core Principles
- **One patch at a time.** Never batch unrelated changes.  
- **No code without approval.** Always explain intent before writing code.  
- **No redundant overwrites.** Modify only what’s necessary.  
- **Structure and readability first.** Clear indentation, clear logic.  
- **No emojis, no filler comments.** Technical clarity only.  
- **Avoid duplication.** Check for overlapping logic or patches before writing new code.  
- **Regular code reviews.** Especially before deploying major builds.  
- **Session alignment.** Verify that your local or current code matches the active OpenAI session memory; if uncertain, proactively request sync (“Hey, we’ve been working on this for a while — please confirm the current state”).  
- **Explicit step labeling.** Each working phase must include:  
  `Step X(.x) of Y, Patch A — part X of Y.`  
- **Multi-patch operations.** If a patch affects multiple areas:  
  1. Provide a complete overview of all steps.  
  2. Wait for explicit “SUPER GO” before starting.  
  3. After each sub-patch, await a “Go” before proceeding to the next.

---

### 💬 2. Commenting Standards
Each section must have a **header block** and, where required, short **inline notes**.

```css
/* ### SECTION TITLE ###
   Short, functional description:
   what happens here, why it exists,
   and what UI/logic it affects. */
```

- **Language:** always English  
- **Consistency:** same format across JS, CSS, HTML  
- **Inline comments:** only for crucial logic, max one line  
- **No repetition:** do not restate obvious code behavior  

---

### ⚙️ 3. Coding Standards
**JavaScript**  
- Functions start with a verb (`initUI`, `handleSend`, `applyIntroInputStyles`).  
- Each major block is isolated in a named section (`/* === Intro Flow === */`).  
- Never inline logic that can be modularized.  

**CSS**  
- Each logical group has one clearly delimited section.  
- No duplicate selectors.  
- All visual constants (colors, spacing, timing) in descriptive form.  

**HTML**  
- Minimal inline style usage (only dynamic or test-related).  
- Structural comments mirror script/CSS sections.  

---

### 🧱 4. Workflow
1. **Brief** – describe change or feature.  
2. **Approval** – wait for explicit “Go”.  
3. **Patch** – implement one change block only.  
4. **Test** – verify frontend + Make/OpenAI response.  
5. **Commit** – mark as “Done” in log.  

---

### 🧭 5. File Structure Reference
The full, regularly updated repository structure is maintained in:  
[`/docs/pages/SCRIPT_ARCHITECTURE.md`](../SCRIPT_ARCHITECTURE.md)

Refer to that document for detailed folder hierarchy, build-relevant modules,  
and file-to-function mappings.

---

### 🧩 6. Integration Principles
- **Make/OpenAI calls:** deterministic JSON only, never free text.  
- **Translation logic:** one pass per receiver; fallback on missing output.  
- **Moderation logic:** triggered only on `parent_ID = "mod"`.  
- **KV/local sync:** automatically runs before moderation triggers.  
- **Message rendering:** must respect original sequence and timing locks.  

---

### 🔒 7. Testing & Debug
- Use `console.debug()` wrapper for all network and AI responses.  
- Do not leave raw `console.log()` calls.  
- Enable `DEBUG=true` only for local dev sessions.