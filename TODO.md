# TODO — Conversational UI patterns

Candidate XDS components for conversational AI. New components go in `src/components/xds/`; follow [CONTEXT.md](CONTEXT.md) §10.

Before input

[Done] Capability intro ([HAX G1](https://www.microsoft.com/en-us/haxtoolkit/library/guideline,pattern/3/) · [HAX 1A](https://www.microsoft.com/en-us/haxtoolkit/pattern/g1-a-introductory-blurb/) · [Shape of AI](https://www.shapeof.ai/patterns/cta)): A short empty-state pattern that explains what the assistant can and cannot do, with sample starting points. It helps set accurate expectations before the first prompt.

Context chips ([Shape of AI: References](https://www.shapeof.ai/patterns/references) · [Shape of AI: Attachments](https://www.shapeof.ai/patterns/attachments)): Removable chips that show active context such as selected files, records, or workspace scope. This is especially useful when the assistant is embedded inside another product.
While composing

Mention/command picker ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/prompt-input)): A popover for @ mentions and / commands with keyboard navigation. It's broadly reusable, but it's tightly coupled to InitialCta, so it may fit best as a composer extension.

Prompt rewrite preview ([Shape of AI](https://www.shapeof.ai/patterns/prompt-enhancer)): Shows a suggested clearer prompt that the user can accept, edit, or ignore. This is more optional, but useful where prompt quality strongly affects results.

During a response

[Done] Response status ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/reasoning)): A lightweight indicator for short waits when a full StreamOfThought would be too much, such as "Searching" or "Drafting." It could share status vocabulary with StreamOfThought.

[Done] Tool result card ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/tool) · [Shape of AI](https://www.shapeof.ai/patterns/footprints)): A compact summary of a tool action and its result, with expandable details. It would separate "what the assistant did" from both reasoning and the final answer.

[Done] Confirmation prompt ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/confirmation) · [Shape of AI](https://www.shapeof.ai/patterns/verification) · [HAX G16](https://www.microsoft.com/en-us/haxtoolkit/library/guideline,pattern/18/)): A focused approval for one risky action, such as sending, deleting, or purchasing. ActionPlan is better for multi-step plans; this would cover single actions.

In the answer

Answer sections: Lightweight structure for summaries, details, caveats, and next steps. It would standardize long answers without forcing a rigid layout.

[Done] Confidence and limitation notice ([Shape of AI](https://www.shapeof.ai/patterns/caveat) · [HAX G2](https://www.microsoft.com/en-us/haxtoolkit/library/guideline,pattern/4/) · [HAX 2D](https://www.microsoft.com/en-us/haxtoolkit/pattern/g2-d-provide-low-performance-alerts/)): A small, consistent way to mark uncertainty, stale data, or missing permissions. Present it as a factual limitation rather than a vague confidence score.

Response variants ([Shape of AI: Variations](https://www.shapeof.ai/patterns/variations) · [Shape of AI: Regenerate](https://www.shapeof.ai/patterns/regenerate) · [AI Elements](https://ui.shadcn.com/docs/ai-elements/base/message)): Lets users compare multiple drafts or switch between regenerated versions. This is useful for writing, but less universal than the other answer patterns.

After the answer

Feedback capture ([HAX G15](https://www.microsoft.com/en-us/haxtoolkit/library/guideline,pattern/17/) · [AI Elements](https://ui.shadcn.com/docs/ai-elements/base/message)): A reusable like/dislike flow with optional reasons and comments. The chatbot example already has this behavior, so extracting it would be natural.

Saved outcome: A quick confirmation when an answer is saved, exported, or added to another tool. Add it only if XDS needs this kind of cross-product workflow.

Trust and control

[Done] Privacy notice ([Shape of AI: Data ownership](https://www.shapeof.ai/patterns/data-ownership) · [Shape of AI: Consent](https://www.shapeof.ai/patterns/consent)): Inline disclosure for data use, retention, or external sharing. InitialCta has a disclaimer, but a richer version would help with policy-specific contexts.

[Done] Permission request ([Shape of AI: Consent](https://www.shapeof.ai/patterns/consent) · [Shape of AI: Connectors](https://www.shapeof.ai/patterns/connectors)): Explains why the assistant needs access, what it will access, and how to continue without granting access.

---

2.0 Conversation structure

★ Message turn ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/message) · [Shape of AI](https://www.shapeof.ai/patterns/avatar)): The container for one user or assistant message, with role, avatar, timestamp and an actions slot. Most other patterns sit inside it.
★ Message actions ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/message) · [Shape of AI](https://www.shapeof.ai/patterns/regenerate)): Copy, regenerate, edit, share and read aloud. Copy and regenerate could be shown on hover, with the rest in an overflow menu.
★ Jump to latest ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/chat)): A floating button that appears when the user scrolls up while a reply is streaming. It can show a "new messages" indicator.
Turn separators: Dividers for dates, a new session or "context was reset" points.
While composing

★ Stop/cancel generation ([Shape of AI](https://www.shapeof.ai/patterns/controls) · [AI Elements](https://ui.shadcn.com/docs/ai-elements/base/prompt-input)): The send button turns into a stop button while a response is generating. Every chat needs this, and it might belong inside InitialCta.
★ Edit and resend ([Shape of AI](https://www.shapeof.ai/patterns/branches)): Lets the user edit a past prompt and fork the conversation from that point. It pairs with Response variants.
Ask about selection ([Shape of AI](https://www.shapeof.ai/patterns/inline-action)): The user selects text in an answer and asks a follow-up, which quotes that text into the composer.
Voice input state: Shows listening, transcribing and error states for dictation.
Mode/model selector ([Shape of AI: Modes](https://www.shapeof.ai/patterns/modes) · [Shape of AI: Model management](https://www.shapeof.ai/patterns/model-management) · [AI Elements](https://ui.shadcn.com/docs/ai-elements/base/model-selector)): A compact picker in the composer, for example "Fast / Thorough" or a source scope.
During a response

★ Streaming text ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/message)): The text cursor or caret while text arrives, plus screen-reader announcements so assistive technology users hear new content.
★ Clarifying question ([Shape of AI](https://www.shapeof.ai/patterns/follow-up)): The assistant asks the user to pick between interpretations using structured options instead of free text. It differs from Suggestions because it blocks the answer until the user chooses.
Inline form (slot filling) ([Shape of AI](https://www.shapeof.ai/patterns/templates)): Asks for structured missing details such as a date range, recipient or amount before the assistant continues.
Background task ([AI Elements: Queue](https://ui.shadcn.com/docs/ai-elements/base/queue) · [AI Elements: Task](https://ui.shadcn.com/docs/ai-elements/base/task)): A long-running job the user can leave and get notified about when it finishes, with progress and a cancel option.
In the answer

★ Code block ([shadcn Code Block](https://ui.shadcn.com/docs/components/base/code-block)): Language label, copy button, wrap toggle and optional "insert/apply".
★ Data table ([Carbon](https://www.carbondesignsystem.com/building-blocks/core/components/data-table)): A table that can be sorted, copied or exported, sized to fit inside a message.
Artifact/canvas preview ([Shape of AI](https://www.shapeof.ai/patterns/shared-vision)): A generated document, code or design shown as a card that opens in a side panel (Sheet) for viewing and editing.
Inline entity card: A rich preview of a referenced record, person or file. It's richer than a citation.
Errors and edge states

★ Response error ([HAX G9](https://www.microsoft.com/en-us/haxtoolkit/library/guideline,pattern/11/)): Failed, timed-out or interrupted responses, with retry and any partial answer kept.
★ Refusal/blocked content ([Shape of AI](https://www.shapeof.ai/patterns/caveat)): Explains that the assistant can't help with a request and offers alternatives. It's different from Limitation notice, which covers uncertainty.
Usage/quota notice ([AI Elements](https://ui.shadcn.com/docs/ai-elements/base/context) · [Shape of AI](https://www.shapeof.ai/patterns/cost-estimates)): Rate limit, token or context-window limit, with a reset time or upgrade path.
Offline/degraded mode ([HAX 2D](https://www.microsoft.com/en-us/haxtoolkit/pattern/g2-d-provide-low-performance-alerts/)): Explains reduced functionality when tools or sources are unavailable.
Trust, memory and control

★ AI-generated label ([Carbon](https://carbondesignsystem.com/components/ai-label/guidelines/) · [Shape of AI](https://www.shapeof.ai/patterns/disclosure) · [NN/g](https://www.nngroup.com/articles/disclose-ai-paced/)): A small, consistent badge for AI-authored content, especially once it's copied or saved somewhere else.
Memory indicator ([Shape of AI: Memory](https://www.shapeof.ai/patterns/memory) · [Shape of AI: Incognito](https://www.shapeof.ai/patterns/incognito-mode) · [HAX G12](https://www.microsoft.com/en-us/haxtoolkit/library/guideline,pattern/14/)): Shows "Assistant remembered X" with view, edit and forget controls. It also covers persistent context across sessions.
Human handoff: Escalation to a person, showing queue or status and passing along a summary of the conversation.
Undo action ([HAX G9](https://www.microsoft.com/en-us/haxtoolkit/library/guideline,pattern/11/)): A short-lived undo after the assistant takes an action. It complements Confirmation prompt: confirm before risky actions, undo after low-risk ones.
Navigation

Conversation history ([HAX G12](https://www.microsoft.com/en-us/haxtoolkit/library/guideline,pattern/14/)): A thread list with search, rename, delete and pin, plus a "New chat" action.