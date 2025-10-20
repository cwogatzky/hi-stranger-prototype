# CREATIVE_INPUT

## Design Purpose
Creative Input represents the **creative layer of interaction** in Hi Stranger.  
It captures all forms of **shared ideas, concepts, files, and inspirations** that emerge within conversations — from a short text idea to an uploaded artwork or reference link.  
It transforms the chat from a dialogue space into a **collaborative creation environment**.

### Why it exists
- **Idea Capture:** Enables users to share, store, and structure creative thoughts that appear naturally during conversation.  
- **Collaboration Memory:** Creates a shared knowledge base within a chat (e.g., brainstorming notes, concept sketches, voice notes).  
- **Moderation Awareness:** Allows Vye to identify, summarize, and reconnect creative threads (“You mentioned this idea earlier — want to develop it further?”).  
- **Cross-Session Continuity:** Creative inputs persist across sessions and can resurface later, enabling iterative idea development.  
- **Ideation Analytics:** Tracks creativity-related engagement and supports future features like group voting, clustering, and exporting to “Idea Boards.”

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Stores user-generated ideas and shared creative material |
| Analytical | Enables semantic linking, clustering, and voting |
| Adaptive | Lets moderation reuse and refer to prior creative threads |
| Collaborative | Builds continuity across participants and sessions |
| Experiential | Turns chats into living idea spaces |

---

## Overview
Represents any piece of user-generated content shared during a conversation — text, image, link, document, or idea entry.  
Used by moderation and analytics layers to enable reference, summarization, and reuse.

**Base Path:** `creative_input.*`  
**Links:**  
- `creative_input.chat_id` → `chat_meta.chat_id`  
- `creative_input.user_id` → `profile.identity.user_id`  
- `creative_input.message_id` → `logs.message_reference_id` (optional)

---

## Fields
- **input_id** (unique identifier)
- **chat_id** (foreign key → chat_meta.chat_id)
- **user_id** (foreign key → profile.identity.user_id)
- **message_id** (foreign key → logs.message_reference_id)
- **content_type** (enum: text / image / link / file / audio / video / concept)
- **content_body** (text or JSON; content payload)
- **content_language** (ISO)
- **summary_text** (AI-generated summary of content)
- **tags[]** (user-defined or AI-generated keywords)
- **related_inputs[]** (links to other creative_input items)
- **visibility** (enum: private / shared / published)
- **vote_score** (integer; sum of upvotes − downvotes)
- **voters[]** (list of user_ids)
- **cluster_id** (optional; semantic cluster reference)
- **attachment_url** (string; file or media URL)
- **created_at** (datetime; ISO)
- **updated_at** (datetime; ISO)
- **deleted_at** (datetime; optional)
- **version** (integer; readonly)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| input_id | hidden | string | ✓ | creative_input.input_id | — |
| chat_id | hidden | string | ✓ | creative_input.chat_id | — |
| user_id | hidden | string | ✓ | creative_input.user_id | — |
| message_id | hidden | string | — | creative_input.message_id | — |
| content_type | select | string | ✓ | creative_input.content_type | `text = "Text"<br>image = "Image"<br>link = "Link"<br>file = "File"<br>audio = "Audio"<br>video = "Video"<br>concept = "Concept"` |
| content_body | textarea / JSON editor | string / object | ✓ | creative_input.content_body | payload |
| content_language | select | string | — | creative_input.content_language | ISO |
| summary_text | textarea (readonly) | string | — | creative_input.summary_text | AI-generated summary |
| tags | tags | array<string> | — | creative_input.tags | free / AI-generated |
| related_inputs | token list | array<string> | — | creative_input.related_inputs | other input_ids |
| visibility | select | string | ✓ | creative_input.visibility | `private = "Private"<br>shared = "Shared"<br>published = "Published"` |
| vote_score | number (readonly) | integer | — | creative_input.vote_score | calculated |
| voters | token list | array<string> | — | creative_input.voters | user ids |
| cluster_id | hidden | string | — | creative_input.cluster_id | cluster reference |
| attachment_url | file/url | string | — | creative_input.attachment_url | asset URL |
| created_at | datetime (readonly) | string | ✓ | creative_input.created_at | ISO |
| updated_at | datetime (readonly) | string | — | creative_input.updated_at | ISO |
| deleted_at | datetime (readonly) | string | — | creative_input.deleted_at | ISO |
| version | number (readonly) | integer | — | creative_input.version | schema version |