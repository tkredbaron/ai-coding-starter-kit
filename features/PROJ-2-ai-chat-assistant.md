# PROJ-2: AI Chat Assistant (local LLM)

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- PROJ-1: User Accounts & Login (local) — chats are private per user, so a logged-in user session is required before the chat can be used.

## User Stories
- As a team member, I want to ask the AI assistant questions in a familiar chat interface and see the answer appear word by word as it is generated, so that I get useful responses quickly without waiting for the full answer.
- As a team member, I want my chat history to be private and organized into multiple conversations that I can create, rename, delete, and switch between, so that I can keep different topics separate and return to earlier discussions.
- As a team member, I want the assistant to remember what was said earlier in the current conversation, so that I can ask follow-up questions without repeating context.
- As a German-speaking office worker, I want the assistant to answer in German by default, so that I can use it for everyday work without switching languages or asking for German explicitly.
- As a team member, I want to stop a running answer that is going in the wrong direction, so that I do not have to wait for an unhelpful response to finish before asking again.
- As a KMU owner, I want clear, understandable feedback when the local AI is unavailable or fully occupied by colleagues, so that my team knows the system is busy rather than broken and no one assumes their data left the building.

## Acceptance Criteria
- [ ] A logged-in user can type a message into a chat input, send it, and receive an AI-generated answer from the local model; the answer streams into the chat view incrementally (not only after completion).
- [ ] The first visible token of a response appears within 5 seconds of sending the message under normal load (no other generation running).
- [ ] The assistant answers in German by default, including when the user's prompt is short or ambiguous; if the user explicitly writes or requests another language (e.g. English), the assistant follows that request.
- [ ] Each user sees only their own conversations; no user can view, open, or modify another user's conversations or messages, including via direct links.
- [ ] A user can create a new conversation, switch between existing conversations, rename a conversation, and delete a conversation (with a confirmation step before deletion); deleted conversations and their messages are no longer accessible.
- [ ] Within a conversation, the assistant takes prior messages of that same conversation into account, so follow-up questions like "Fasse das kürzer zusammen" refer correctly to the previous exchange.
- [ ] Conversation history persists across logout/login and browser restarts; reopening a conversation shows all prior messages in correct order.
- [ ] While a response is streaming, a visible stop/cancel control is available; activating it halts generation promptly, keeps the partial answer in the conversation, and lets the user immediately send a new message.
- [ ] If the local LLM service (Ollama) is unreachable, the user sees a clear German-language error message explaining that the local AI service is not available, and the user's typed prompt is not lost (it remains in the input or can be resent with one action).
- [ ] If the server is already handling its maximum number of concurrent generations, additional requests are not silently dropped: the user is informed (e.g. waiting/queue notice in German) and the request either starts automatically once capacity is free or can be retried without retyping.

## Edge Cases
- **Ollama is down or the model is not loaded:** What happens when a user sends a prompt while the LLM runtime is stopped, crashed, or still loading the model into memory? The user must get an understandable German error/notice (not a technical stack trace or endless spinner), and their prompt must not be lost.
- **Several users send prompts simultaneously:** The Mac mini can only serve a few concurrent generations. Requests beyond capacity must be queued or rejected with clear feedback, must not corrupt or interleave other users' streams, and no user's prompt or answer may appear in another user's chat.
- **Very long conversation exceeding the model's context window:** When a conversation grows beyond what the ~7–8B model can take as context, the assistant must still respond sensibly (e.g. using only the most recent portion of the history) without crashing or producing an empty answer; ideally the user is informed that very old messages may no longer be considered.
- **User deletes the conversation (or logs out / closes the tab) while a response is streaming:** The in-flight generation must be terminated or safely discarded; no orphaned answer may be written into a deleted conversation or shown to the user afterwards, and server resources must be freed.
- **Connection interruption mid-stream (e.g. Wi-Fi drop on the client):** The partial answer received so far should remain visible after reconnect/reload as part of the stored conversation, and the user must be able to continue chatting without a stuck "generating" state.
- **Empty, whitespace-only, or extremely long single prompt:** Empty/whitespace messages cannot be sent (send action disabled or rejected with a hint); a single prompt longer than the accepted input limit is rejected with a clear German message stating the limit, rather than being silently truncated.

## Technical Requirements (optional)
- Performance: first token of a response visible within 5 seconds under normal load; streaming remains fluid enough to read along on the Mac mini M4 (16 GB).
- Security/Privacy: authentication required for all chat functionality; conversations strictly isolated per user; all prompts, responses, and history stored exclusively on the local Mac mini; zero outbound network calls containing user content (fully functional offline).
- Concurrency: graceful behavior with 2–15 LAN users, of which only a small number can generate simultaneously; clear user feedback instead of timeouts when capacity is exhausted.
- Language: UI labels, system messages, and error messages in German; assistant answers in German by default with English supported on request.
- Browser Support: current versions of Chrome, Firefox, Safari, and Edge on desktop; responsive layout usable on tablets.

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
