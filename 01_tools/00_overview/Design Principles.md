---
type: instructions
subject: design-principles
for: [human, ai]
visibility: local
---
# Design Principles

**These are the four commitments the packet was built on.** They double as the tagging vocabulary for the `02_activity/` log. When you make a structural change to your system, tag it with the principle it serves. Over time you can ask *"what have I done in service of Provide an Exit this quarter?"*

You are welcome to keep these as-is, replace them with your own, or evolve them. They are starting commitments, not law.

---

## The four principles

### 1. Make harm legible.

You cannot organize against what you cannot see. You cannot fix what is invisible and deniable. Modern systems are designed to keep harm abstract. The algorithm doesn't have a face. The supply chain has no address. The policy effect is statistical, not human.

The first act of any system worth building is to restore the feedback loop. Make the harm visible to the people it affects. Make it nameable. Make it countable.

This is not pessimism. It is the precondition for everything else.

**In practice:** any project that surfaces a hidden cost, names a stakeholder who was rendered invisible, or produces an artifact that lets a community see something it could not see before serves this principle.

---

### 2. Provide an exit.

Participation without exit is coercion. It just has better branding.

Real exit is not "you can always delete your account." Real exit means you take what matters with you. Your data. Your relationships. Your community's norms and harm records. Exit that leaves you empty-handed is not exit. It is eviction.

**In practice:** the packet itself was built on this. Content stays as portable markdown. No lock-in to the packet, your AI, or the cloud. Your notes never leave your folder unless you ship the output. Any project that preserves its participants' ability to leave with what they brought (and what they made) serves this principle.

---

### 3. Design for sufficiency.

Growth is not the goal. Completion is.

Sufficiency means building in endpoints. Defining what enough looks like before you start. Designing cycles that complete: where value is distributed, rest is structural, and the next cycle begins from a place of having, not from manufactured scarcity.

Sufficiency also means starting with what is already here. The people in front of you. The resources already present. At roughly 150 people (Dunbar scale), trust is functional. Reputation is the currency. Harm is nameable because the person harmed has a face. You do not skip to scale. You start where trust is real, prove the thing works, and connect outward from there.

**In practice:** projects that name their stopping condition, design for the audience already present, or distribute value rather than accumulate it serve this principle. The packet is one stylesheet's worth of tokens, one script for the pipeline, one HTML file per output. Nothing optimized for scale it does not need.

---

### 4. Scale out, not up.

Every merger in the history of the commons has eventually produced a lord.

Scaling up means consolidation: more power at the center, more dependencies flowing inward, more decisions made by fewer people. It feels like growth. It produces hierarchy. The commons becomes a company. The network becomes a platform.

Scaling out means federation: sovereign cells connecting laterally, sharing protocols not ownership, maintaining the ability to disconnect without collapsing. It is slower. It is harder to fund. It produces resilience instead of efficiency, and resilience is what actually survives.

The question to ask of any growing system: is power concentrating or distributing? If it is concentrating, the direction is wrong regardless of the mission.

**In practice:** the packet is designed to be installed by anyone, in any folder, without a central service. Anyone can fork it. No one owns the network of installations. Any project that shares protocols rather than ownership, that lets sovereign nodes federate without reporting upward, serves this principle.

---

## Using these principles

When you write `02_activity/` entries, tag the change with the principle(s) it serves. Suggested format:

```markdown
---
type: activity
date: YYYY-MM-DD
principles: [legibility, exit]
---
```

The four tag slugs:
- `legibility` (Make harm legible)
- `exit` (Provide an exit)
- `sufficiency` (Design for sufficiency)
- `federation` (Scale out, not up)

---

## Replacing or extending these principles

If your project has different principles, replace this file with your own. The packet does not require these specific four; it requires *some* coherent commitments that the rest of your work can be tagged against.

The pattern that matters: principles are short, named in active voice, evaluable (you can ask "did this serve principle X?"), and refer back to a single canonical doc rather than scattering across project hubs.
