# WyvernCon Event Type Tagging Specification

**Version:** 1.0  
**Status:** Validated through three human-labeling rounds using real Dragon Con 2026 schedule events  
**Purpose:** Shared instructions for classifying WyvernCon events by primary attendee experience.

---

## 1. Core principle

Classify an event by answering:

> **What is the attendee primarily doing during this event?**

Do **not** classify from title keywords alone.

Examples:
- A panel about performances is still `PANEL`.
- A dance class is `WORKSHOP`.
- A live dance demonstration is `PERFORMANCE`.
- A social dance session can be `ACTIVITY`.
- An event with “Party” in the title can still be `ACTIVITY` or `OPERATIONAL`.
- An event with “Workshop” in the title can still be `PANEL`.
- A room setup for a party is `OPERATIONAL`, not `PARTY`.

WyvernCon should display **one compact primary event-type tag**.

---

## 2. Canonical event-type tags

Use exactly one of these six tags:

| Tag | Primary attendee role | Definition |
|---|---|---|
| `PANEL` | Listener / discussant | Primarily listening to discussion, presentation, Q&A, explanation, or knowledge transfer |
| `WORKSHOP` | Learner-doer | Actively learning through guided practice, making, or coached participation |
| `PERFORMANCE` | Audience member | Primarily watching or listening to entertainment, a staged presentation, screening, reading, concert, or demonstration |
| `PARTY` | Socializer | Primarily celebrating, mingling, dancing freely, lounging, or socializing |
| `ACTIVITY` | Participant | Attendees actively do, create, play, sing, compete, contribute, meet around a purpose, or otherwise generate the experience |
| `OPERATIONAL` | User of a function/service | Check-in, setup, registration, judging, access, amenity, signing, or another functional process supporting the con rather than content programming |

### UI rule

Display **one primary type tag only**.

Do not stack `PANEL + PERFORMANCE`, `PARTY + ACTIVITY`, etc. when one primary attendee experience can reasonably be chosen.

Other properties belong in separate metadata systems, such as extra fee, DCTV, repeats, queue risk, age restrictions, registration requirements, accessibility, and presenter roles.

---

## 3. Decision order

Use this sequence when an event is ambiguous.

### Step 1 — Is it primarily a function, service, administrative step, or supporting process?
Examples: setup, room closure, check-in, registration, pre-judging, wristbanding, a functional amenity, signing/service interaction.

**If yes → `OPERATIONAL`**

### Step 2 — Are attendees actively learning through guided practice or making?
The attendee should be expected to practice, build, draw, dance, sew, create, manipulate tools/materials, or receive hands-on guidance.

**If yes → `WORKSHOP`**

### Step 3 — Are attendees themselves doing the central thing?
Examples: karaoke, trivia, open filk, collaborative creation, contests, tournaments, auctions, audience feedback sessions, purposeful meetups, participatory dancing.

**If yes → `ACTIVITY`**

### Step 4 — Is the audience primarily watching or listening to presented entertainment?
Examples: concerts, theatrical shows, staged readings, screenings, shadowcasts, live demonstrations, variety shows.

**If yes → `PERFORMANCE`**

### Step 5 — Is the main purpose free-form socializing, celebration, dancing, mingling, or atmosphere?

**If yes → `PARTY`**

### Step 6 — Is the main purpose information, discussion, presentation, Q&A, or explanation?

**If yes → `PANEL`**

`PANEL` is the normal fallback for informational programming when there is no stronger evidence for another category.

---

## 4. PANEL

Use `PANEL` when attendees primarily listen, discuss, hear a presentation, participate through Q&A, or learn about a topic without hands-on practice.

> **Talking about how to do something does not make it a workshop.**

Gold-standard examples:
- An Hour with The Cruxshadows: Discussion & Q&A
- Puppetry and Burlesque
- Is NASA Still “NASA”?
- How to Build an Underwater Robot
- Cat Herding; or, So You Want to Host a Group Cosplay Photoshoot
- Historical Etiquette Demo: How to Mend Clothes
- Mission Briefing: MSFM Track Orientation
- Masterclass: Writing a Cozy Mystery
- Dragon Con Newbies Discussion with Q&A
- Learn to Read Hangul

Strong positive evidence: discussion, Q&A, panel, presentation, overview, tips and tricks, explains/discusses, history of, introduction to, orientation, “topics include…”

Strong negative evidence: hands-on making/practice, audience performance/competition, staged entertainment, setup/check-in/registration.

---

## 5. WORKSHOP

Use `WORKSHOP` when attendees are **learning by doing** through active, guided practice or making.

> `PANEL` = learn by listening.  
> `WORKSHOP` = learn by doing.

A title containing “Workshop,” “Class,” or “Masterclass” is not sufficient by itself.

Gold-standard examples:
- Fusion Fan Dance Class
- Discussion & Workshop: Memento Mori, Victorian Mourning Jewelry
- Intro to Belly Dance Class
- The Sound Lab Workshop: Let's Make Some Noise
- Kids Create: Drawing with Corinne Roberts
- Workshop: Make Your Own Dragon Tail
- Workshop: Body Double Doubletake
- Leather Three-Tiered Arm Bracer

Counterexample: **Workshop – Recording on a Budget** was classified as `PANEL` because the description primarily described topics the presenter would cover rather than active participant practice.

Supporting but non-defining evidence: extra fee, advanced registration, limited seats/materials, supplies provided, take-home object.

---

## 6. PERFORMANCE

Use `PERFORMANCE` when attendees primarily watch or listen to a presented experience.

Includes concerts, theatrical/comedy shows, shadowcasts, staged readings, table reads, dance demonstrations, live painting demonstrations, screenings, variety shows, and professionally presented entertainment.

A performance does **not** need to be live. A screening can still be `PERFORMANCE` because the attendee's role is passive audience consumption.

Gold-standard examples:
- Lion Dance Demonstration
- Rocky Horror Picture Show with LDOD – LIVE!
- Punchline Martial-Arts Supershow
- Classic Cartoon Table Reads
- Friday Morning Doctor Who Screening
- Live Painting with Steve Rude
- Concert – Tom Smith
- Black Nerd Reads – LIVE!
- Edgewood Avenue: An Improvised Variety Show

Reading rule:
- Black Nerd Reads – LIVE! → `PERFORMANCE`
- Afterall Reading with Discussion and Q&A → `PANEL`

Demonstration rule:
- watch a lion dance → `PERFORMANCE`
- watch a live painting demo → `PERFORMANCE`
- informational mending explanation → `PANEL`
- robotics demos + test drives + participation → may be `ACTIVITY`

---

## 7. PARTY

Use `PARTY` narrowly when the primary purpose is celebration, free-form socializing, mingling, nightlife, a DJ/lounge environment, a ball, or dancing as social atmosphere rather than a prescribed activity.

Gold-standard examples:
- Welcome Home Dance & Countdown!
- Gatsby & Daisy Champagne Ball
- Doctor Who Ball
- Cartoon Bebop Lounge with Live DJ
- Spectrum: The Rainbow Flag Party
- Dragon Con Kick-Off Celebration: From Juke Joints to Hip Hop Dance!

> **The word “party” is weak evidence.**

Counterexamples:
- Silent Reading Party → `ACTIVITY`
- Paint & Chill: The Dragon Con Art Party → `ACTIVITY`
- Bunny Hutch Party – Age Verification & Wristbanding → `OPERATIONAL`

Party vs Activity:
- free-form DJ dance party → `PARTY`
- social dancing focused on specific styles → `ACTIVITY`
- meetup around a defined community/purpose → usually `ACTIVITY`
- karaoke → `ACTIVITY`

---

## 8. ACTIVITY

Use `ACTIVITY` when attendees themselves create or perform the central experience.

Typical forms include games, trivia, karaoke, open mic/open filk, collaborative creation, participatory dancing, contests, tournaments, auctions, attendee feedback sessions, purposeful meetups, meet-and-greets, group doing/creating, and participant-centered parade events.

> **Participation must be central, not incidental.**

A panel can contain audience questions and remain `PANEL`. A performance can include limited interaction and remain `PERFORMANCE`.

Gold-standard examples:
- Filk Track – Lessons Learned
- Silent Reading Party
- Paint & Chill: The Dragon Con Art Party
- Eurovision Karaoke
- Instafilk
- Unique Instruments Meetup
- Annual Dragon Con Tea Duel
- FIRST Robotics Demo — leaning
- Queerios Meetup — leaning
- Social Dancing on The Concourse — leaning
- Open Filk — leaning
- Dragon Con Main Charity Auction
- Kids Meet & Greet with Bluey
- Family Fort-Building Contest
- Venture Bros. Trivia
- Annual Dragon Con Parade

Meetup rule: a meetup is usually `ACTIVITY` when its purpose is bringing a specific group together around a defined connection.

Competition rule: use `ACTIVITY` when attendee entrants compete or create the competitive content. If participation is selected/curated and general attendees mainly watch, `PERFORMANCE` may be more appropriate.

Participation-access test:
> Can an ordinary attendee reasonably participate in the central action, or is the general attendee primarily watching selected performers?

If participation is explicit/open → favor `ACTIVITY`.  
If participation is selected/curated and general attendees mainly watch → favor `PERFORMANCE`.

---

## 9. OPERATIONAL

Use `OPERATIONAL` when the scheduled item primarily serves a functional purpose rather than content programming.

This category is broader than staff-only setup. It can include attendee-facing functions such as check-in, registration, age verification, wristbanding, pre-judging, setup/teardown, room closure, safety inspection, required administrative steps, a functional con amenity, a transactional signing/service, or other logistics enabling the convention or another event to run.

Gold-standard examples:
- Setup for Dance – Room Closed
- Bunny Hutch Party – Age Verification & Wristbanding
- Muscle Nerdz Showdown Pre-Judging
- Robot Battles – Makers Check-in
- Doctor Who Costume Contest Pre-Judging
- Cults of Dragon Con Costume Contest Registration
- Auction Debrief – Room Closed
- Bunny Hutch Contest Pre-Judging
- Headless Lounge
- Special Signing – Matt Dinniman and Jeff Hays! — provisional/leaning

> **Publicly accessible does not automatically mean programming.**

Strong operational language should usually override subject words referring to the event it supports:
- “Party – Age Verification” → `OPERATIONAL`
- “Contest Pre-Judging” → `OPERATIONAL`
- “Robot Battles Check-in” → `OPERATIONAL`

---

## 10. High-value boundary rules

### Informational vs hands-on
Are attendees expected to practice/make/do the skill during the session?
- No → usually `PANEL`
- Yes, with instruction → `WORKSHOP`

### Performance vs activity
Who performs the central action?
- presenters/performers while audience watches → `PERFORMANCE`
- attendees themselves → `ACTIVITY`

### Party vs activity
Is free-form socializing/celebrating the point, or is there a defined thing attendees are there to do?
- atmosphere/celebration/mingling → `PARTY`
- defined participatory purpose → `ACTIVITY`

### Panel vs performance
Is the performance itself the content, or is performance being discussed/analyzed?
- discussion/analysis/knowledge transfer → `PANEL`
- presented entertainment/demonstration → `PERFORMANCE`

### Activity vs operational
Is participation the entertainment/content, or is the attendee completing a function/service?
- content-producing participation → `ACTIVITY`
- registration, access, service, amenity, signing, setup, logistics → `OPERATIONAL`

---

## 11. Title-keyword policy

Do **not** use direct mappings such as:

```text
party -> PARTY
workshop -> WORKSHOP
performance -> PERFORMANCE
music -> PERFORMANCE
demo -> PERFORMANCE
meetup -> PARTY
```

### High-reliability operational signals
Strong evidence, especially when confirmed by the description:
- room closed
- setup
- teardown
- check-in
- registration
- wristbanding
- pre-judging

### Medium-reliability signals
Require description confirmation:
- workshop
- class
- concert
- screening
- Q&A
- panel

### Low-reliability/context-dependent signals
Never use alone:
- party
- meetup
- social
- demo
- show
- masterclass
- reading
- contest
- ball
- dance
- live
- music

---

## 12. Confidence and human review

The visible app only needs the primary tag. Internally, an automated classifier should also produce confidence and review metadata.

Example:

```json
{
  "format": "ACTIVITY",
  "confidence": "medium",
  "runner_up": "PERFORMANCE",
  "reason": "Audience participation is encouraged, but it is unclear whether all attendees can perform.",
  "review_needed": true
}
```

Use high confidence when attendee role is explicit and unambiguous; medium when two formats are genuinely plausible; low when the description does not provide enough information.

Low-confidence cases should go to manual review rather than being “fixed” with stronger keyword heuristics.

---

## 13. Recommended event data model

Do not mix event formats with presenter professions in one catch-all tag list.

```json
{
  "event_format": "PANEL",
  "event_traits": ["PAID"],
  "classification": {
    "confidence": "high",
    "reason": "Attendees primarily listen to a discussion and Q&A.",
    "review_needed": false
  }
}
```

`event_format` should contain exactly one of:

```text
PANEL
WORKSHOP
PERFORMANCE
PARTY
ACTIVITY
OPERATIONAL
```

---

## 14. AI classifier instructions

```text
You are classifying Dragon Con schedule events for WyvernCon.

Assign exactly ONE primary event-format tag:

PANEL
WORKSHOP
PERFORMANCE
PARTY
ACTIVITY
OPERATIONAL

Core question:
"What is the attendee primarily doing during this event?"

Definitions:
- PANEL: primarily listening to discussion, presentation, Q&A, explanation, or knowledge transfer.
- WORKSHOP: actively learning through guided practice or making.
- PERFORMANCE: primarily watching/listening to entertainment, a staged presentation, screening, reading, concert, or demonstration.
- PARTY: primarily celebrating, mingling, dancing freely, lounging, or socializing.
- ACTIVITY: attendees actively do, create, play, sing, compete, contribute, meet around a purpose, or otherwise generate the experience.
- OPERATIONAL: check-in, registration, setup, judging, access, amenity, signing, or another functional process/service rather than content programming.

Decision order:
1. Functional service/logistics/admin? -> OPERATIONAL
2. Guided learning-by-doing? -> WORKSHOP
3. Attendees themselves do the central thing? -> ACTIVITY
4. Audience watches/listens to presented entertainment? -> PERFORMANCE
5. Free-form socializing/celebration is the purpose? -> PARTY
6. Otherwise informational discussion/presentation/Q&A? -> PANEL

Important:
- Do not classify from title keywords alone.
- "Workshop" does not guarantee WORKSHOP.
- "Party" does not guarantee PARTY.
- "Demo" does not guarantee PERFORMANCE.
- A panel about performance is PANEL.
- A dance class is WORKSHOP.
- A participatory music circle is ACTIVITY.
- A concert is PERFORMANCE.
- Party setup/check-in is OPERATIONAL.
- If uncertain, preserve the best tag but lower confidence and explain the competing interpretation.

Return:
format
confidence: high | medium | low
runner_up: another tag or null
reason: one concise sentence
review_needed: true | false
```

---

## 15. Gold-standard edge cases

| Event | Gold label | Why it matters |
|---|---|---|
| Workshop – Recording on a Budget | `PANEL` | “Workshop” title, but primarily informational |
| Historical Etiquette Demo: How to Mend Clothes | `PANEL` | “Demo” title, but informational |
| Masterclass: Writing a Cozy Mystery | `PANEL` | “Masterclass” does not imply hands-on practice |
| Fusion Fan Dance Class | `WORKSHOP` | Dance + active instruction |
| Lion Dance Demonstration | `PERFORMANCE` | Demonstration is presented to audience |
| Friday Morning Doctor Who Screening | `PERFORMANCE` | Performance category includes screenings |
| Silent Reading Party | `ACTIVITY` | “Party” title but defined group activity |
| Paint & Chill: The Dragon Con Art Party | `ACTIVITY` | “Party” title but attendees create art |
| Social Dancing on The Concourse | `ACTIVITY` | Structured participatory dancing rather than party atmosphere |
| Open Filk | `ACTIVITY` | Audience encouraged to perform |
| Spectrum: The Rainbow Flag Party | `PARTY` | Genuine DJ/social celebration |
| Bunny Hutch Party – Age Verification & Wristbanding | `OPERATIONAL` | Operational purpose overrides “Party” |
| Headless Lounge | `OPERATIONAL` | Functional attendee amenity, not programming |
| Doctor Who Costume Contest Pre-Judging | `OPERATIONAL` | Contest-support function rather than contest itself |
| Are You Afraid of the Con? – Campfire Story Contest | `PERFORMANCE` (leaning) | Participation access unclear; audience may mainly watch |
| FIRST Robotics Demo | `ACTIVITY` (leaning) | Demo plus test drives/get-involved participation |

---

## 16. Change-control principle

When changing classification rules:

> Prefer a rule that improves a meaningful class of events over an exception that only fixes one title.

If an event is truly unique, use an explicit override rather than distorting the general classifier.

```json
{
  "event_overrides": {
    "event-id": {
      "format": "PANEL",
      "reason": "Manual gold-standard correction"
    }
  }
}
```

---

## End of specification
