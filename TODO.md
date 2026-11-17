# TODO — Conversational UI patterns

Candidate XDS components for conversational AI. New components go in `src/components/xds/`; follow [CONTEXT.md](CONTEXT.md) §10.

Before input

[Done] Capability intro: A short empty-state pattern that explains what the assistant can and cannot do, with sample starting points. It helps set accurate expectations before the first prompt.

Context chips: Removable chips that show active context such as selected files, records, or workspace scope. This is especially useful when the assistant is embedded inside another product.
While composing

Mention/command picker: A popover for @ mentions and / commands with keyboard navigation. It's broadly reusable, but it's tightly coupled to InitialCta, so it may fit best as a composer extension.

Prompt rewrite preview: Shows a suggested clearer prompt that the user can accept, edit, or ignore. This is more optional, but useful where prompt quality strongly affects results.

During a response

[Done] Response status: A lightweight indicator for short waits when a full StreamOfThought would be too much, such as "Searching" or "Drafting." It could share status vocabulary with StreamOfThought.

[Done] Tool result card: A compact summary of a tool action and its result, with expandable details. It would separate "what the assistant did" from both reasoning and the final answer.

[Done] Confirmation prompt: A focused approval for one risky action, such as sending, deleting, or purchasing. ActionPlan is better for multi-step plans; this would cover single actions.

In the answer

Answer sections: Lightweight structure for summaries, details, caveats, and next steps. It would standardize long answers without forcing a rigid layout.

Confidence and limitation notice: A small, consistent way to mark uncertainty, stale data, or missing permissions. Present it as a factual limitation rather than a vague confidence score.

Response variants: Lets users compare multiple drafts or switch between regenerated versions. This is useful for writing, but less universal than the other answer patterns.

After the answer

Feedback capture: A reusable like/dislike flow with optional reasons and comments. The chatbot example already has this behavior, so extracting it would be natural.

Saved outcome: A quick confirmation when an answer is saved, exported, or added to another tool. Add it only if XDS needs this kind of cross-product workflow.

Trust and control

Privacy notice: Inline disclosure for data use, retention, or external sharing. InitialCta has a disclaimer, but a richer version would help with policy-specific contexts.

Permission request: Explains why the assistant needs access, what it will access, and how to continue without granting access.