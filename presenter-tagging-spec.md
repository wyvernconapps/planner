# WyvernCon Presenter & Panelist Tagging Specification

**Version:** 1.0  
**Date:** 2026-09-14  
**Status:** Validated through three human calibration rounds  
**Purpose:** Shared instructions for ChatGPT, Claude, coding agents, build scripts, and future WyvernCon data-processing tools.

---

## 1. Core Architecture

Presenter tagging has **two distinct layers**:

1. **Event-level signal** — answers: **Why is this person especially relevant on this event?**
2. **Presenter-profile classification** — answers: **What kind of work does this person do overall?**

Do not collapse these layers into one badge system.

Example:

```text
Professional novelist on a writing panel
Event card: PRO
Profile: CREATOR
Specific role in data/details: novelist / author
```

```text
Professional actor on an acting-technique panel
Event card: PRO
Profile: PERFORMER
Specific role in data/details: actor
```

The event card should stay compact. The presenter profile can preserve more detail.

---

## 2. Event-Level Signals

The normal event-card system should use **one primary signal per presenter**.

Allowed event-level signals:

```text
PRO
MODERATOR
PRO/MODERATOR
GUEST OF HONOR
FEATURED GUEST
```

Other official Dragon Con status labels may also be preserved in data when supported by the source, but they are not automatically shown on every event.

A presenter may also have **no badge at all**.

The deliberate combined exception is:

```text
PRO/MODERATOR
```

when both professional relevance and moderator responsibility matter.

---

## 3. PRO

### Definition

`PRO` means:

> **This person's professional work or professional training is meaningfully relevant to the subject of this specific event.**

`PRO` does **not** mean:

- this person merely has a job;
- this person is famous;
- this person is an official Dragon Con guest;
- this person has an unrelated degree or license;
- this person is a deeply knowledgeable fan;
- this person should always display a professional badge on every appearance.

`PRO` is **event-contextual**, not permanent.

### Positive examples

A professional novelist discussing writing craft:

```text
Event card: PRO
Profile: CREATOR
```

A professional actor discussing acting technique:

```text
Event card: PRO
Profile: PERFORMER
```

A professional illustrator discussing illustration technique:

```text
Event card: PRO
Profile: CREATOR
```

An aerospace engineer discussing spacecraft design:

```text
Event card: PRO
Profile/details: ENGINEER
```

A linguistics professor discussing constructed languages:

```text
Event card: PRO
Profile/details: linguist / professor
```

A professional historian discussing medieval armor:

```text
Event card: PRO
```

A doctorate, professional license, or formal credential is **not required**. Relevant professional experience is enough.

A professional fantasy novelist discussing worldbuilding:

```text
Event card: PRO
Profile: CREATOR
```

### Negative examples

A professional actor on a Star Wars lore panel as a fan:

```text
Event card: no profession/relevance badge
Profile: PERFORMER
```

The acting career is true but irrelevant to this event.

An aerospace engineer playing Star Trek trivia:

```text
Event card: no profession/relevance badge
Profile/details: ENGINEER
```

A professional fantasy novelist discussing Tolkien lore as a fan:

```text
Event card: no PRO
Profile: CREATOR
```

Professional fantasy writing is not automatically relevant enough to a fandom-lore discussion.

A longtime fan with deep knowledge but no professional connection:

```text
Event card: no PRO
```

Deep fandom expertise can be valuable without being professional authority.

---

## 4. MODERATOR

`MODERATOR` is an **event role**, not a profession.

If a knowledgeable fan is explicitly moderating:

```text
Event card: MODERATOR
```

If a relevant professional is also moderating:

```text
Event card: PRO/MODERATOR
Profile: CREATOR and/or PERFORMER as applicable
```

Do not replace the person's profile category with `MODERATOR`.

---

## 5. Official Dragon Con Status

Official billing/status is separate from profession and profile categories.

Examples include:

- Guest of Honor
- Featured Guest
- Spotlight Guest
- other official Dragon Con guest designations

Always preserve official status in the underlying presenter data.

### 5.1 Guest of Honor

Guest of Honor status has high display priority.

Example: an officially billed Artist Guest of Honor appearing on an art panel:

```text
Event card: GUEST OF HONOR
Profile/details: ARTIST GUEST OF HONOR
Profile category: CREATOR
```

Guest of Honor status outweighs `PRO` and ordinary profession-role badges on the event card.

### 5.2 Featured Guest

When a Featured Guest appears on an event directly connected to their professional work:

```text
Event card: FEATURED GUEST
Profile: CREATOR / PERFORMER as appropriate
```

The official status can outrank a generic `PRO` signal.

### 5.3 Spotlight Guest and similar status

Official guest status does **not automatically force a badge onto every event**.

Example: a Spotlight Guest appears on an unrelated fandom discussion:

```text
Event card: no badge
Profile: preserve Spotlight Guest status
```

The relevance rule still applies.

### 5.4 Official guest with unknown profession

If the source reliably establishes official guest status but does not establish a profession:

- preserve and show the official guest status;
- leave profession/profile categories blank;
- do not infer a profession from event titles or tracks.

This is a fallback for incomplete data, not permission to guess.

---

## 6. Presenter Profile Categories

The compact profile taxonomy uses two broad creative categories:

```text
CREATOR
PERFORMER
```

A person may have:

- `CREATOR` only;
- `PERFORMER` only;
- `CREATOR + PERFORMER`;
- neither.

These are broad UI categories, not replacements for the underlying source occupation data.

---

## 7. CREATOR

Use `CREATOR` for people whose work primarily involves **making authored, designed, or produced creative work**.

Examples include:

- authors;
- novelists;
- screenwriters;
- visual artists;
- illustrators;
- designers;
- costume designers / costumers;
- filmmakers;
- directors;
- game designers;
- podcasters;
- YouTubers;
- digital content creators;
- other people who design or author creative works.

Examples:

```text
novelist -> CREATOR
illustrator -> CREATOR
screenwriter -> CREATOR
costume designer -> CREATOR
game designer -> CREATOR
```

Specific source roles should still be preserved.

---

## 8. PERFORMER

Use `PERFORMER` for people whose work primarily involves **performing for an audience or camera**.

Examples include:

- actors;
- voice actors;
- musicians;
- singers;
- dancers;
- comedians;
- stage performers;
- puppeteers;
- narrators;
- similar live, recorded, or screen performers.

Examples:

```text
actor -> PERFORMER
voice actor -> PERFORMER
musician -> PERFORMER
stand-up comedian -> PERFORMER
professional dancer -> PERFORMER
```

Specific occupation data should still be preserved.

---

## 9. People Who Are Both

A presenter can legitimately be both:

```text
CREATOR + PERFORMER
```

Examples:

### Singer-songwriter

They write original music and perform it.

```text
Profile: CREATOR + PERFORMER
```

### Actor who also writes and directs films

```text
Profile: CREATOR + PERFORMER
```

### Professional cosplayer who constructs costumes and models/performs in them

```text
Profile: CREATOR + PERFORMER
```

Do not force one permanent dominant category.

---

## 10. Preserve Specific Occupations

Even when the UI uses broad categories, retain source-supported specific professions.

Examples:

```text
author
novelist
screenwriter
illustrator
artist
actor
voice actor
musician
engineer
historian
professor
costumer
director
game designer
comedian
dancer
```

Recommended model:

```json
{
  "name": "Example Person",
  "specific_roles": ["actor", "writer", "director"],
  "profile_categories": ["CREATOR", "PERFORMER"]
}
```

The broad categories are derived UI metadata.

They should **not destroy or overwrite** the source roles.

---

## 11. Professions Outside CREATOR / PERFORMER

Not every profession should be forced into a broad creative category.

Examples:

```text
engineer
therapist
professor
historian
lawyer
scientist
physician
linguist
```

Preserve the real occupation in profile/details.

Example:

```text
Event: spacecraft engineering panel
Card: PRO
Profile/details: ENGINEER
```

Do not invent a broad category merely to avoid a blank category field.

---

## 12. Event Context Determines Card Display

The same presenter can receive different event-card treatment on different events.

Example person:

```text
Profile:
CREATOR + PERFORMER
Specific roles:
actor, writer, director
```

On an acting-technique panel:

```text
Event signal: PRO
```

On a screenwriting panel:

```text
Event signal: PRO
```

On unrelated trivia:

```text
Event signal: none
```

Their profile does not change.

The event context changes only what, if anything, is surfaced on that event.

---

## 13. Groups and Organizations

A group may be treated as a presenter entity when the schedule lists the group rather than individual members.

Example: a professional band discussing its own music:

```text
Event card: PRO
Profile/entity category: PERFORMER
Specific entity type: band
```

Do not require expanding a group into individual members before tagging it.

The same principle can apply to theatre companies and similar performer groups.

---

## 14. Unknown or Unsupported Roles

If a presenter is named but the available source does not reliably establish their profession:

```text
Show the name.
Do not guess a profession.
Do not infer from the event track.
Do not infer from neighboring panelists.
Do not infer from the event title.
```

A presenter may legitimately have:

```text
name + no role badge
```

This is preferable to incorrect metadata.

---

## 15. Knowledgeable Fans

Do not create a `FAN` profession badge merely because a person is knowledgeable.

If they have no relevant professional connection and are not moderating:

```text
Show their name with no badge.
```

If they are moderating:

```text
MODERATOR
```

Their expertise can still be evident from biography/details.

---

## 16. Card Density

Normal rule:

> **One primary presenter signal per presenter on an event card.**

Allowed combined exception:

```text
PRO/MODERATOR
```

Avoid badge combinations such as:

```text
PRO + CREATOR + PERFORMER + FEATURED + MODERATOR
```

That information belongs in deeper details, not a compact event card.

---

## 17. Event-Card Signal Priority

Recommended priority order:

### 1. Guest of Honor

If relevant to the appearance:

```text
GUEST OF HONOR
```

This outranks `PRO`.

### 2. Other meaningful official billing

For example:

```text
FEATURED GUEST
```

when the status meaningfully explains why the person is appearing.

### 3. PRO/MODERATOR

When both professional relevance and moderator responsibility apply.

### 4. MODERATOR

When moderation is the person's meaningful event role and `PRO` does not apply.

### 5. PRO

When relevant professional experience is the key reason the person matters on this event.

### 6. No badge

When none of the above applies.

Official status should still be preserved in presenter/profile data even when it is not the event-card signal.

---

## 18. Important Distinction: Status vs Relevance

A fact can be true about a person without deserving space on this event card.

Examples:

```text
They are an actor.
They are a Featured Guest.
They are an engineer.
They are a creator.
```

The event card is not a mini résumé.

Ask:

> **Which single signal best explains why this person matters on this particular event?**

If the answer is “none of these,” show no badge.

---

## 19. Recommended Data Model

Example:

```json
{
  "name": "Example Person",
  "entity_type": "person",
  "specific_roles": ["actor", "writer", "director"],
  "profile_categories": ["CREATOR", "PERFORMER"],
  "official_status": {
    "type": "featured_guest",
    "display": "Featured Guest"
  },
  "events": {
    "event-id-1": {
      "signal": "PRO",
      "reason": "Professional screenwriting experience is directly relevant."
    },
    "event-id-2": {
      "signal": null,
      "reason": "Appearing as a fan; professional background is not relevant."
    }
  }
}
```

For a professional moderator:

```json
{
  "signal": "PRO/MODERATOR"
}
```

For an unknown presenter:

```json
{
  "name": "Example Presenter",
  "specific_roles": [],
  "profile_categories": [],
  "official_status": null
}
```

Do not populate missing data through inference.

---

## 20. Recommended Classification Process

For each presenter on each event:

### Step 1 — Preserve source facts

Collect only supported information:

- name;
- specific professions/roles;
- official Dragon Con billing;
- moderator status;
- group/entity type;
- biography;
- event title/description;
- relationship to event subject.

### Step 2 — Build profile categories

Derive:

```text
CREATOR
PERFORMER
```

when supported.

Preserve specific occupations separately.

### Step 3 — Determine event relevance

Ask:

> Is this person's professional work or training meaningfully relevant to this event?

If yes:

```text
PRO
```

unless a higher-priority official/event-role signal applies.

### Step 4 — Check moderator status

If moderator + PRO:

```text
PRO/MODERATOR
```

If moderator without PRO:

```text
MODERATOR
```

### Step 5 — Check official-status priority

Guest of Honor or meaningful Featured Guest status may replace a generic `PRO` signal on the compact event card.

### Step 6 — Otherwise show no badge

Do not force every presenter to have one.

---

## 21. AI Classifier Instructions

```text
You are classifying presenters/panelists for WyvernCon.

There are TWO layers:

1. Event-level signal:
   Why is this person especially relevant on THIS event?

2. Presenter-profile classification:
   What kind of work does this person do overall?

EVENT-LEVEL SIGNALS:
- PRO
- MODERATOR
- PRO/MODERATOR
- GUEST OF HONOR
- FEATURED GUEST
- no badge

PRO means:
The person's professional work or professional training is meaningfully relevant to the subject of this specific event.

Do NOT use PRO merely because:
- the person is employed;
- the person is famous;
- the person is an official Dragon Con guest;
- the person has an unrelated degree/license;
- the person is a knowledgeable fan.

MODERATOR is an event role.
Use PRO/MODERATOR when both apply.

Guest of Honor has high display priority and can replace a generic PRO badge.
Featured Guest may also replace PRO when the official status is the most meaningful compact signal.
Official status should always be preserved in underlying data even when it is not shown on the event card.

PROFILE CATEGORIES:
- CREATOR
- PERFORMER

CREATOR includes people who author/design/make creative work, such as:
authors, writers, visual artists, illustrators, designers, costumers, filmmakers, directors, game designers, podcasters, YouTubers, and similar creators.

PERFORMER includes people whose work involves performance, such as:
actors, voice actors, musicians, singers, dancers, comedians, stage performers, puppeteers, narrators, and similar performers.

A person can be both CREATOR + PERFORMER.

Not every profession belongs in CREATOR/PERFORMER.
Preserve specific occupations such as engineer, historian, professor, therapist, lawyer, physician, scientist, or linguist in profile/details.

Always preserve specific source-supported roles even when broad categories are used for UI.

EVENT CARD RULE:
Normally show only ONE primary signal per presenter.
The allowed combined exception is PRO/MODERATOR.

Do not show a profession/relevance badge when the person's professional background is irrelevant to the event.

If the source does not reliably establish a profession:
- show the person's name;
- leave profession/profile categories blank;
- never infer from track, event title, or neighboring presenters.

Knowledgeable fans do not receive PRO solely for fandom expertise.
If they moderate, use MODERATOR.
Otherwise their name can appear with no badge.

Suggested event signal priority:
1. GUEST OF HONOR
2. meaningful official featured status
3. PRO/MODERATOR
4. MODERATOR
5. PRO
6. no badge

For every classification return:
- specific_roles
- profile_categories
- official_status
- event_signal
- reason
- confidence
- review_needed
```

---

## 22. Gold-Standard Examples

| Scenario | Event signal | Profile |
|---|---|---|
| Professional novelist discussing writing craft | `PRO` | `CREATOR` |
| Professional actor discussing acting technique | `PRO` | `PERFORMER` |
| Illustrator discussing illustration technique | `PRO` | `CREATOR` |
| Engineer discussing spacecraft engineering | `PRO` | specific role `ENGINEER` |
| Same engineer playing fandom trivia | none | specific role `ENGINEER` |
| Singer-songwriter | context-dependent | `CREATOR + PERFORMER` |
| Actor/writer/director | context-dependent | `CREATOR + PERFORMER` |
| Professional cosplayer who builds and performs | context-dependent | `CREATOR + PERFORMER` |
| Professional creator moderating a relevant panel | `PRO/MODERATOR` | `CREATOR` |
| Knowledgeable fan moderating | `MODERATOR` | none required |
| Artist Guest of Honor on art panel | `GUEST OF HONOR` | `CREATOR`, preserve Artist GOH status |
| Featured Guest on profession-relevant panel | `FEATURED GUEST` | relevant profile category |
| Spotlight Guest on unrelated fandom panel | none | preserve status in profile |
| Professional band discussing its own music | `PRO` | `PERFORMER` |
| Named knowledgeable fan with no other role | none | none required |
| Guest with unknown profession | official status only | leave profession categories blank |

---

## 23. Validation Basis

This specification was developed through three rounds of user calibration focused on:

- multi-role presenters;
- official Dragon Con billing;
- event relevance;
- professional authority;
- broad vs narrow role categories;
- creators vs performers;
- moderators;
- groups/bands;
- unknown presenter data;
- compact event-card design;
- guest-status precedence.

The strongest validated principles are:

1. event relevance matters more than a person's permanent résumé;
2. `PRO` is contextual;
3. `CREATOR` and `PERFORMER` are broad profile categories;
4. specific source roles should still be preserved;
5. official Guest of Honor status has high display priority;
6. `MODERATOR` is an event role, not a profession;
7. one compact event signal is normally enough;
8. no badge is better than an unsupported guess.

---

## 24. Change-Control Principle

When adjusting presenter-tagging rules:

> Prefer rules that clarify the difference between event relevance and person identity rather than adding more permanent badge types.

If an unusual presenter does not fit the compact UI taxonomy:

- preserve their real occupation in profile/details;
- use `PRO` on events where that profession matters;
- do not create a new global badge unless it improves a meaningful class of presenters.

---

## End of specification
