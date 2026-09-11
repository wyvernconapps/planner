# WyvernCon Schedule — v2 Spec

**Status:** draft, open for edits
**v1 shipped:** Dragon Con 2026, wyvernconapps.github.io/planner
**Target:** post-con build, no deadline

---

## Idea inbox

Raw notes, captured as said. Nothing here is designed yet.

- App users can mark a panel as full, so people know not to meet them there.
- Mind ya business mode: privately bookmark things you're interested in or want
  to attend, without sharing them.
- A map showing people's locations, and a map of the locations of the events
  you're interested in.
- A five-point interest slider, neutral in the middle:

  | Value | Means |
  | --- | --- |
  | -2 | Not interested at all — don't show this again unless I unhide it |
  | -1 | Not this time |
  | 0 | Neutral |
  | +1 | Interested |
  | +2 | Want to go really bad |

  Plus a separate "locked in" marker — a target or similar — to say this is my
  plan rather than my wishlist. That is a second axis, not a sixth point on the
  slider: something can be a +2 you have not committed to.

  Needs a key somewhere explaining what the levels mean.

  For anything locked in at +2, My Con should block out line-waiting time as
  well as the panel itself.
- Custom events people add themselves, like a dinner reservation somewhere.
- A "beacon" you switch on when you want to hang out but have nothing specific
  in mind, and a separate one for let's get food together.
- Group cosplay coordination as a year-round reason to open the app: schedule
  group building days, and post "does anyone have X material" requests.
  Coordination only — not build tracking, budgets or materials databases,
  which is what the dedicated cosplay apps already do.
- The same request idea works mid-con, in real time: "does anyone have a
  safety pin", "next time you're back in the room can you grab some drinks".
  Same structure as the material requests — a standing ask with an answer
  attached, not a chat message that scrolls away.
- A way to say you're winding down, and to find people to walk back or share
  an Uber home with.
- Generalise the dog trip planner. Cats, other pets, and any other reason
  someone has to leave the con and come back — the arithmetic is the same,
  only the label is dog-specific.
- Let people mark where they parked somewhere other than the six hotels — a
  street, a deck, a lot. The current setting only offers con venues.
- A countdown for when a parking meter runs out.
- The request system (grab something from the room, does anyone have a safety
  pin) is really a small ticketing system — open ask, claimed by someone,
  closed. Worth building it generic enough to lift out as a separate app for
  Cospl-AID, the cosplay repair table.
- An offer beacon, the mirror of a request: "I'm running to the store, does
  anyone need anything?" Same ticket, opened from the other end — one person
  offering, several people claiming.
- Requests and offers need urgency. Wig cap glue before a costume contest is
  a different thing from a beer next time you happen to be up at the room.
  Probably a deadline rather than a priority label — "I need this by 6pm" is
  actionable in a way "high priority" is not, and it lets the list sort and
  expire itself.
- Directions between locked-in events, with a toggle for maximising indoor
  time. The skybridges make an indoor route possible between most of the
  hotels; it is usually longer than going outside. Needs route data the app
  does not have yet — v1 only knows hotel-to-hotel estimates, not paths.
- A minimise-stairs toggle alongside it. Same route data, different weighting,
  and the one with the widest reach — it matters for mobility aids, knees,
  strollers, heavy or restrictive costumes, and anyone hauling a prop. Worth
  treating as accessibility rather than a preference.
- Passive markers for which food places have short or long lines.
- **Cross-cutting: reporting must cost almost nothing, in both directions.**
  Room-full, panel queues and food lines all rest on someone saying so. Two
  separate constraints:
  - **Input burden.** Asking too much of the person reporting kills it. Should
    be one tap from where they already are, never a form.
  - **Display.** Busy / not-busy markers need to sit quietly in the UI. They
    are context while you scan, not alerts.

  Note this is a friends-first feature, and that changes the incentives.
  Anonymous crowdsourcing skews negative because only the annoyed report.
  Within a group of friends people volunteer good finds too — "no line at
  Krispy Kreme, go now" is a normal thing to tell your people. So a positive
  signal is not a corrective bolted on, it is half the point.

---

## Post-con additions

Queued post-con; decisions locked by Lauren. #2 and #3 shipped in **1.13**; #1 (Breaks)
is designed and is the **next build** — a full refactor of the trip subsystem (the
settings panel is hard-wired to two windows today, so it needs a dynamic rebuild,
plus per-break travel and the confirm/skip card states).

**1. Trips generalized to "Breaks." — _next build._** The dog/pet trip planner becomes a general
"Breaks" planner. A break has a **type** (🍽️ meal, 🐾 pet, 😴 rest, errand), a
time **window**, a **duration**, and a **travel on/off** toggle — on = round-trip
plus parking-hotel awareness (the old pet run); off = on-site (a meal at the con),
zero travel. Meals get breakfast / lunch / dinner windows. The app **suggests** the
cheapest slot in each window; you confirm. Break cards have three states: **clear**
(quiet one-liner), **costs you** (expands with the picks you'd miss + *Take it here /
Try another time / Skip today*), **locked in** (a solid block conflict math respects).
The dog planner is now the "Pet" preset.

**2. Landing tab. — _shipped 1.13._** App opens on **My Con when you have picks, else Now** — never a
blank screen for first-timers, and keeps the off-con time-travel demo useful.

**3. "Things to sort out" → per-day cards. — _shipped 1.13._** The decisions list splits into one card
per con day with a count badge; the current/next day is expanded, the rest collapsed.
A break that clashes with picks surfaces as a card in that day's list, tying #1 and #3
together.

## What people complain about in the official app

From App Store and Play Store reviews. Mostly 2021 and earlier, and a 2024
reviewer notes it "has gotten much better over the past couple of years" and
praises the maps and filters — so this is context, not a competitor teardown.

**Sharing and friends**
- "It makes it a chore to share your schedule with friends, and every year you
  have to recreate your friends list from scratch."
- Reinstalling makes you "show up multiple times in your friend's contact list."
- "It's not obvious and rather counterintuitive that friends aren't added at
  the friends panel, but the attendees tab on the main page."

**Data loss**
- "If you delete and reinstall, you have to completely redo everything
  including your schedule because there's no persistent storage of your profile
  off your device."

**Schedule bugs**
- "Events that cross midnight appear on the agenda, but not the schedule. The
  schedule is the default, which is frustrating."

**Performance**
- Crashes, multi-second freezes mid-scroll, 207 MB install.
- "Where's my paper schedule? Doesn't require wifi or data and only crashes if
  you drop it in a puddle."

**What they praise**
- The maps, and the event filters.

### Where v1 already answers these

- **Midnight** — events key to start time and day headers follow, so panels
  running to 3:30am stay on the right day.
- **Sharing** — a link, no account, no attendee tab.
- **Offline** — one file, loads once, needs nothing after.

### What to do about the rest

1. **Per-friend hide toggle.** Right now "Remove Eric" is the only option:
   destructive, and undoing it needs a re-import. That is the same trap the
   official app falls into.
2. **A friend list that survives the year.** The complaint is not that sharing
   is hard once, it is that it evaporates annually. v1 links are keyed to 2026
   event IDs and will break the same way. A list that holds *people* rather
   than picks is a real differentiator.
3. **Lead with offline when pitching it.** Not "I made a schedule app" —
   everyone has one. "It works in the Hilton basement and it is 470KB."

---

## What v1 is

A single self-contained HTML file, ~470 KB, with the whole panel schedule
baked in. No server, no accounts, no network needed after first load.

Four tabs: **Now**, **Browse**, **Grid**, **My Con**. Picks are keyed to each
event's own ID and stored in the browser. Rooms carry real floors read off the
venue maps. Panels carry role badges from the Program Book's guest lists.
There's a dog-trip planner, DCTV air times, repeat-session detection, and a
share link that moves picks between devices.

Everything in v1 works offline and belongs to one person.

---

## The v2 premise

Four requested features:

1. **QR codes** for fast friend-adding and social sharing
2. **A network diagram** of who is friends with whom
3. **Cosplay photos** attached to a planned wearing schedule
4. **Crowdsourced "this room is full"** reports, so people know not to try

Three of the four cannot be done without a backend, and together they change
what kind of data this app holds. The fourth changes something else again —
see below.

---

## The structural finding

> v1 shares by link, and every device holds only what its owner imported.
> That was fine for "here are my picks." It cannot express "who else is
> connected to whom," and it cannot carry images.

| Feature | Needs a server? | Why |
| --- | --- | --- |
| QR: add a friend | No | A short payload — name plus a handle — fits a scannable code |
| QR: share a schedule | **Yes** | 170 picks is a 1,583-char URL = a 117×117 module QR. Phones scan ~40×40 comfortably. Needs a short code pointing at stored data |
| Network diagram | **Yes** | Your app cannot know Eric is friends with Sarah unless something tells it. Transitive links would leak Eric's contacts to everyone he shares with |
| Cosplay photos | **Yes** | localStorage caps ~5 MB and base64 inflates images by a third. A weekend of costumes will not fit |
| Room-full reports | **Yes** | A report is only useful to people who are not you, within minutes of being made |

### Room-full reports are a different kind of feature

Everything in v1, and features 1–3 above, are either **static schedule data**
or **your own state**. A room-full report is neither: it is one user changing
what a stranger sees. That brings in three problems the app has never had.

**Staleness.** "Full" is true for perhaps twenty minutes. A report must attach
to a specific session at a specific time, not to the panel, and must decay
fast enough that a stale report never reads as current. Show the age of the
report, always.

**Abuse.** Marking the good panels full to shorten your own queue is trivial
and untraceable. This is the first feature with an incentive to lie. Mitigations
worth considering: require several independent reports before showing anything,
weight by account age, rate-limit per person, and never let a single report
change what others see.

**Reporting bias.** People report when they are turned away, not when they walk
straight in. Reports will skew toward "full" and the absence of a report means
nothing. The UI must not read an empty state as "there is room."

**Binary is the wrong signal.** The Quick Start Guide's line policy means large
ballrooms clear between panels and queues form up to an hour early — so what
matters is usually the *line*, not the room. A useful report is a queue state:

| State | Means | Useful when |
| --- | --- | --- |
| Line forming | A queue has started | 30–60 min before a ballroom panel |
| Line long | Queue past the point where you would likely get in | Before you walk over |
| At capacity | People being turned away | During the panel |
| Walked right in | No queue | Counters the reporting bias above |

That last row matters. Without a positive signal the feature only ever tells
you bad news, and the absence of news is unreadable.

**The social framing.** Lauren's phrasing was "so people know not to meet them
there," which points somewhere more specific than a public capacity feed: a
report attached to *a friend's plan*. If a friend is at a panel and it is at
capacity, the useful message is "Lauren got in, but do not try to join her" —
which needs no strangers and no trust model at all. Worth deciding whether
this is a **friends-only signal** or a **public feed**, because they are very
different products.

### The QR sizing constraint, measured

| Picks | URL length | QR version | Modules |
| --- | --- | --- | --- |
| 10 | 143 | ~10 | 57×57 |
| 30 | 323 | ~10 | 57×57 |
| 80 | 773 | ~20 | 97×97 |
| 170 | 1,583 | ~25 | 117×117 |

Lauren carried 170 picks at Dragon Con 2026. A whole-schedule QR is not
viable at that size.

**Decision: two separate QR codes, never one.** These are different acts with
different audiences and must not be confused:

| QR | Carries | Who scans it |
| --- | --- | --- |
| **Social** | Name and cosplay socials. Nothing else. | A stranger who liked your costume |
| **Schedule** | A short code resolving to your picks | Someone you already know |

Handing a stranger who admired your costume a link to your social media is a
normal, friendly thing. Handing them a timetable of where you will physically
be for the next four days is not, and a single QR that does both makes that
mistake easy and irreversible. Keep them visually distinct as well as
technically separate, so nobody shows the wrong one in a corridor.

---

## Privacy comes first, not last

This is the first work item, before any code.

v1 shared picks. v2 would share **photographs of a person, a timetable of
where they will physically be, and a map of their social connections** —
potentially broadcast via a QR on social media. That is a materially
different object from a bingo card, and it is much harder to take back once
people have opted in.

Questions the model has to answer:

- **Granularity.** Can someone see your full schedule, only your must-sees,
  only that you are busy, or only your name?
- **Directionality.** Is friendship mutual, or can someone follow you
  without consent?
- **Graph visibility.** Does the diagram show edges you are not part of?
  Seeing that two of your friends know each other is a real disclosure.
- **Photos.** Friends-only by default? Can they be pulled once shared?
- **Revocation.** What happens to a schedule already scanned from a QR?
- **Minors.** Dragon Con has attendees under 18. Location plus photo plus a
  public QR is the highest-risk combination in this whole document.
- **Deletion.** What does "delete my account" actually remove, and from whose
  devices?

**Default position for the draft:** nothing is public. Sharing is per-person
and mutual. The graph shows only edges you are part of. Photos are
friends-only. Anything broadcast — a social QR — carries name and handle
only, never a schedule.

---

## Shape: two modes, one spine

The app is used four days a year and then not for three hundred and sixty.
Those are different products sharing a backend, not one product with a quiet
season.

### What differs

**During con** is time-critical, location-critical, one-handed, on bad signal,
and everything is "now" or "next two hours".

**Between cons** is asynchronous, at home on wifi, longer sessions, months of
lead time. Nothing is urgent.

### What is shared, and must not be built twice

- **The friend graph.** Same people, same trust settings, both modes.
- **Requests and offers.** "Does anyone have a safety pin" and "does anyone
  have EVA foam" are the same object — open, claimed, closed. Only the
  urgency and the location context differ.
- **Your profile.** Name, socials QR, privacy settings.

### The tabs

The same slot holds the equivalent thing in each mode, so the app does not
feel like two apps wearing one icon.

Each slot keeps the same **purpose** in both modes. Only the content changes.
A tab that means one thing in September and something else in March teaches
people twice and is trusted neither time.

| Slot | Purpose | During con | Between cons |
| --- | --- | --- | --- |
| 1 | What is happening | **Now** — what's on, what's near, live requests | **Home** — countdown, guest announcements, recent crew activity |
| 2 | What is scheduled | **Schedule** — Browse and Grid as a view toggle | **Schedule** — deadlines and build days (see below) |
| 3 | What is mine | **My Con** — my plan, conflicts, trips home, parking | **Mine** — my builds, my deadlines, my badge and hotel status |
| 4 | Who is with me | **Crew** — friends, map, beacons, walking back | **Crew** — friends, build coordination, group cosplay |

**Crew and Schedule never move and never change meaning.** Those are the two
people will reach for without looking, and they are the two that carry the
relationship between the modes.

Folding Grid into Schedule frees a slot and is honest: the Grid is a way of
looking at the schedule, not a separate destination.

### Workshop is the between-cons schedule

This is the piece that makes the off-season mode worth opening. Between cons
the calendar is not empty — it is full of deadlines:

- **Badge price tiers.** Dragon Con raises the price at announced dates.
- **Hotel room block release.** The hotel hunger games: blocks sell out in
  minutes, and people set alarms for it.
- **Membership transfer and refund deadlines.**
- **Group build days**, scheduled with your crew.
- **Material order lead times** — the last date to order fabric and still
  finish.
- **Costume contest registration**, travel booking, time off work.

Some of these are personal, some are shared with the group, and **some are
published facts** — badge tiers and room block dates are announced by the con.
That last category ships with the app the same way the panel schedule does,
which means the off-season mode has real content before any user adds
anything.

### Two things to get right

**The mode switch must be automatic but always overridable.** People plan next
year's group cosplay *during* the con — that is when everyone is together and
inspired. If con mode hides the Workshop, it is hidden at the best moment for
using it.

**Crew stays one tab with one meaning: who is with me and what are they
doing.** During con that answers "where is everyone right now"; between cons
it answers "what is everyone building". Same question, different timescale.
The risk to watch is the map and beacons making it feel like a live-tracking
tab in September and a contact list in March — the fix is that both modes
lead with the same thing, which is people and what they have said they are
doing.

---

## Pulling the schedule data yourself

Right now the data path is manual: Max Schilling (u/maxschilling on r/dragoncon)
pulls the Dragon Con schedule, shares it as a Google Sheet, and we export that
to CSV and feed it to the build. A v2 goal is to close that loop so the app can
refresh its own data — which means learning to pull it directly.

**Where the data lives.** Dragon Con's official app is built on the **Core-apps**
platform; the web version is at `app.core-apps.com/dragoncon26` (the year in the
slug will change). All the schedule data flows through Core-apps' backend.

**Two ways to get it, per Max:**

1. **Scrape the rendered web app** — walk the pages at `app.core-apps.com` and
   parse the HTML. Works, but slow: Max reported it took over an hour to run,
   which is too slow to keep current during con.
2. **Pull the database the way the mobile app does** *(the good one)* — the
   Core-apps mobile app downloads its whole schedule database from a backend
   endpoint on launch, then parses it locally. Hit that same endpoint directly
   and you get the full dataset in seconds, ready to parse. This is what Max
   switched to for 2026, and why he can keep the sheet updated live.

**How to find that endpoint solo (next year):**

- Open `app.core-apps.com/dragoncon<YY>` in a desktop browser with DevTools →
  Network open, and reload. Look for the request that returns the bulk schedule
  (often a single DB or JSON bundle, not one call per event) — filter by size,
  it's the big one.
- Or inspect the mobile app's traffic (a proxy like mitmproxy/Charles) to see
  the sync request it makes on first launch.
- Replay that request directly, save the response, and parse it into the CSV
  shape `build_data.py` expects (Title, StartDate, EndDate, Location, TrackName,
  Presenters, Description, EventId).

**Credit:** this whole approach is Max Schilling's; he does the hard part of
pulling and cleaning the data every year. Anything automated here should keep
crediting him, and ideally check with him before hammering the Core-apps
endpoint — being a good citizen of the community he's building.

## Proposed build order

Each stage should be useful on its own, so the project can stop at any point.

**1. Privacy model.** Written down and agreed before any code. Output is a
short document, not a feature.

**2. Backend.** Supabase — free tier, Postgres, realtime built in, and already
the noted choice for Upkeep's cloud sync, so it is one pattern across two
projects rather than two things to learn. v1's storage already sits behind a
swappable adapter, which is the shape this wants.

**3. Short-code QR.** A person gets a short handle. The QR carries the handle,
not the schedule. Scanning sends a friend request. Small enough to scan off a
phone screen, and it stops being a schedule broadcast.

**4. Cosplay photos.** Upload a costume photo, attach it to a day or a time
range. Compressed client-side before upload. Friends see what you will be
wearing and when — genuinely useful for finding each other.

**5. Room-full reports, friends-only first.** Ship as a signal between people
who already share schedules. That version needs no trust model, no abuse
mitigation, and no minimum report count, because you know who is telling you.
Only widen it to a public feed if the friends-only version proves useful.

**6. Network diagram.** Last, because it needs everything above working and
is the most privacy-sensitive to get right.

---

## Open questions

- **Does the schedule still work offline?** v1's strongest property is that it
  needs no network. A backend must not break that — sync should be additive,
  with the local copy remaining authoritative for your own picks.
- **Do friends need accounts?** Requiring a login before someone can see your
  schedule is a real barrier in a hallway.
- **Is this still one HTML file?** Photos and a backend probably end that. If
  so, v2 is a React/Vite build on Netlify rather than a single artifact.
- **Does it stay Dragon Con specific?** A generic con planner is a much bigger
  product with a much bigger content problem.
- **What happens to the guest data?** The Program Book parse is per-year work.
  Worth scripting properly if this recurs annually.
- **Is a room-full report anonymous?** Saying a room is full also says you are
  standing in it. Attributed reports are more trustworthy and less private.
- **Does a report cost anything to make?** A single tap invites noise; three
  taps means nobody reports. This trade decides whether the feature has data.

---

## Room capacity research

Done post-con to test whether the inferred room tiers should be replaced with
published numbers. Short answer: mostly no, but the sources are worth keeping.

### How the inference actually scored

59 rooms in the schedule have a published capacity. Judged against a
400-seat line for "headline room", the track-sharing heuristic gets **55 of 59
right — 94%**. That is far better than a first look at Hilton-only data
suggested, and it is not worth replacing wholesale.

The four it gets wrong:

| Room | Inferred tier | Published seats | Problem |
| --- | --- | --- | --- |
| Hilton Galleria 2-3 | 3 | 450 | Big room, dedicated to one track, so it reads as small |
| Courtland Atlanta 1-2 | 3 | 400 | Same |
| Hyatt Hanover C-E | 1 | 340 | Main Programming room that is smaller than it looks |
| Hyatt Regency V | 1 | 250 | Genuinely small; pinned tier 1 from the venue map |

The pattern: the heuristic measures **how Dragon Con books a room**, not how
big it is. A large room dedicated to one track all weekend looks small to it.
Fixing those four by hand is cheaper than rebuilding the system.

### Sources, by hotel

| Hotel | Source | Coverage |
| --- | --- | --- |
| Hilton Atlanta | Own capacity chart PDF (`assets.hiltonstatic.com`) | Complete — every room. Scanned, so OCR is patchy; verify individual numbers |
| Hyatt Regency | NFA convention floorplan PDF (`nfaonline.org`) | Complete — theatre, classroom and banquet per room, all four levels |
| Marriott Marquis | The Vendry venue page | Complete per-room, but **seated capacity, not theatre** |
| Westin Peachtree | Marriott meeting-space page + The Vendry | Ballrooms and Chastain/Augusta; some gaps |
| Courtland Grand | courtlandgrandhotel.com + The Vendry | Ballrooms only; Athens, Augusta and Macon not found |
| AmericasMart | Not researched | Vendor space, excluded from the app anyway |

Hyatt's own capacity chart PDF blocks automated fetching. The NFA floorplan is
the same data, republished by a convention that used the venue.

### Numbers found

Theatre capacity unless marked. Marriott figures are seated capacity.

**Marriott Marquis** — Atrium Ballroom 2,500 (25,005 sq ft) · Marquis Ballroom
2,220 (22,273) · International Hall 1,860 (28,281) · Imperial Ballroom 1,330
(13,343) · A601+A602 480 · M103-M105 275 · A704 260 · A706 260 · L401-L403 190 ·
A707 160 · M301 155 · A703 150 · M302-M303 110 · A708 105

**Hyatt Regency** — Centennial Ballroom 3,200 (29,000 sq ft, divides in four) ·
Centennial I 700 · Centennial II/III/IV 700 each · Regency Ballroom 1,320
(17,000) · Regency VI+VII 1,050 · Regency VII 700 · Regency VI 500 · Regency V
250 · International Ballroom 1,000 (9,150) · International North 460 ·
International South 430 · Hanover Hall 975 (10,104) · Hanover C-E 340 ·
Hanover F+G 230 · Hanover A+B 195 · Embassy Hall 800 (7,225) · Embassy C 160 ·
Embassy D 160 · Embassy A/B/E/F 120 each · Embassy G 58 · Embassy H 50 ·
Grand Hall 39,000 sq ft exhibit · Grand Hall A/C/D 110 each · Grand Hall B 90 ·
Chicago 210 · Learning Center 88 · Piedmont 130 · Inman 120 · Spring 120 ·
Kennesaw 90 · Techwood 85 · Roswell 80 · Vinings 70 · Marietta 65 · Lenox 70 ·
University 60 · Williams 20

**Hilton Atlanta** — Galleria Exhibit Hall 38,976 sq ft · Grand Ballroom 1,914
(19,575) · Salon 1,656 (17,000) · Salon East/West 828 each · Grand East 702 ·
Grand West 702 · Galleria 2-3 450 · Crystal Ballroom 400 · 204-207 350 ·
208-211 340 · 301-304 310 · Galleria 5 300 · 212-214 280 · Galleria 4 272 ·
Galleria 2 270 · Galleria 6-7 260 · 309-312 260 · Galleria 6 144 · Galleria 3
130 · 313-314 130 · Galleria 7 120 · 404-405 115

**Westin Peachtree** — Peachtree Ballroom 2,030 (15,012 sq ft) · Augusta
Ballroom 1,100 (11,476) · Savannah Ballroom 760 (6,491) · Peachtree C 750 ·
Peachtree D 750 · Augusta Room 500 · Chastain Room 300 · Chastain H-I-J ~250 ·
Chastain D/E/F ~120-210 · Augusta CC RM 5 215 · Ansley 1-8 35 each

**Courtland Grand** — Grand Ballroom 1,600 (15,080 sq ft) · Capitol Ballroom
1,050 theatre (9,590) · Georgia Hall 12,303 sq ft · Atlanta Ballroom 400
(4,160, divides into five) · conference rooms 600 sq ft each

### Source URLs

Keep these — the parse is per-year work and these are the pages that worked.

| What | URL |
| --- | --- |
| Hilton capacity chart (complete, scanned) | `assets.hiltonstatic.com/images/v1710162644/dx/wp/atlahhh-hilton-atlanta/media-library/ATLAH_Capacity_Chart_1_FINAL-ua/ATLAH_Capacity_Chart_1_FINAL-ua.pdf` |
| Hyatt full floorplan + capacities | `nfaonline.org/docs/default-source/convention-documents/2025-convention/hyatt-regency-atlanta_floorplan.pdf` |
| Hyatt own chart (**blocks scraping**) | `assets.hyatt.com/content/dam/hyatt/hyattdam/documents/2019/10/28/1412/Hyatt-Regency-Atlanta-Capacity-Chart-English.pdf` |
| Marriott per-room (seated, not theatre) | `thevendry.com/venue/5662/atlanta-marriott-marquis-atlanta-ga` |
| Marriott headline ballrooms (theatre) | `businesstravelnews.com/Hotels/Atlanta/Atlanta-Marriott-Marquis/Meetings-Events-p50610331` |
| Westin meeting spaces | `marriott.com/hotels/event-planning/business-meeting/atlpl-the-westin-peachtree-plaza-atlanta` |
| Westin per-room | `thevendry.com/venue/28068/the-westin-peachtree-plaza-atlanta-atlanta-ga` |
| Courtland Grand venues | `courtlandgrandhotel.com/conferences-meetings/venues/` |
| Dragon Con program book (Flipsnack, needs manual download) | `readme.dragoncon.org/2026programbook` |

Dragon Con's own venue maps are saved alongside this file in `venue-maps/`,
one PNG per hotel plus both AmericasMart buildings. Those are the source for
every floor assignment in the app, and they are not available as anything but
screenshots from the con's app.

### Capacities still missing

32 of 91 rooms. Ordered by how many panels each actually hosts, so the gaps
that matter are at the top of each list.

**Marriott Marquis** — 1 of 14 missing
- Skyline South, 10th Floor (1 panel)

**Hyatt Regency** — 1 of 23 missing
- Concourse (30 panels) — a pre-function area, so it may have no rated capacity

**Hilton Atlanta** — 11 of 25 missing
- 209-211 (31) · 302-304 (28) · Galleria 1 (28) · **Galleria 8 (18, tier 1)** ·
  301 (7) · 307 (7) · 306 (6) · 3rd floor outside deck (6) · 305 (3) · 308 (3) ·
  315 (2)
- The chart lists most of these under combined names like `301-302-303`, so the
  singles are probably derivable by subtraction. Galleria 8 is the one worth
  chasing since the app calls it a headline room.

**Westin Peachtree** — 5 of 12 missing
- Augusta C (40) · Peachtree 1-2 (26) · Augusta D (10) · Overlook (5) ·
  Savannah Ballroom B/C (1)

**Courtland Grand** — 5 of 8 missing, the worst-covered hotel
- Athens (37) · Macon (30) · Augusta (24) · Atlanta 3-4 (14) ·
  Pool and Courtyard (1)
- These are the second-floor salons. Their site publishes ballrooms only.
  Would need the hotel's own capacity chart, or an ask.

**AmericasMart** — 3 of 3 missing
- 204J (20) · 203BC (19) · 203A (13) — the Comics Programming rooms.
  Not researched; AmericasMart publishes exhibit space, not meeting rooms.

**Not applicable** — Offsite venues (Joystick Gamebar, Center for Puppetry
Arts, Georgia Aquarium, the Parade, 200 Peachtree) and the Twitch stream.

Priority if this gets picked up: **Courtland Grand's second floor** (91 panels
across three unrated rooms) and **Hilton Galleria 8** (mislabelled tier 1 with
no number to check it against).

### What to do with this

1. **Do not replace the tier system.** 94% is good enough, and the published
   numbers do not cover every room in the schedule.
2. **Hand-correct the four known misranks** — a small override table, the same
   pattern already used for floors from the venue maps.
3. **Consider showing the number** on tier-1 rooms where it is known. "Ballroom,
   seats about 1,300" is more useful than a tier badge, and it makes the
   queue-time warning concrete.
4. **Watch the units.** Marriott figures are seated, not theatre — do not mix
   them into a single scale without noting it.

---

## Carried over from v1

Known gaps, not yet fixed:

- **Walk times are estimates**, never measured. The Marriott and Hyatt numbers
  are the shakiest since both connect at one specific level.
- **The Video Gaming track may still hide real panels.** "Hades II Guests" was
  a guest panel filed under gaming and only survived because DCTV aired it.
  There are likely others.
- **80 of 795 guest bios yield no role**, so those show billing only.
- **Tony DiTerlizzi is badged AUTHOR** but billed Artist Guest of Honor — his
  bio leads with "author and illustrator" and the rule takes the first role.
- **112 of 825 presenters match no guest list** — bands, theatre companies,
  and people confirmed after the book went to print.
- **Room size tiers are inferred** from how many tracks share a room, not from
  published capacities. The hotels publish real square footage; Hyatt's chart
  blocks scraping.

---

## Changelog

See `CHANGELOG.md` in the repo — nine versions, 1.0 through 1.8, matching the
nine GitHub Pages deployments. Next build is 1.9.
