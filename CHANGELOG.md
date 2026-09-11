# Changelog

WyvernCon Schedule — an unofficial Dragon Con 2026 planner.
Single self-contained HTML file, no build step, no server.

Versions 1.0–1.8 map to the nine GitHub Pages deployments made **during** the
con (4–7 September); 1.9 onward is post-con polish. The early con commits carry
no messages, so which upload carried which change is reconstructed from the
build history rather than recorded at the time — corrections welcome. The
footer build stamp is the ground truth for which build a file actually is.

---

## 1.12.1 — a cute, honest credit

- Footer notes the app was vibe-coded by Lauren with Claude (best witch Claudia
  and technomancer Codie, trained in the Anthropic arts). No functional change.

## 1.12 — off-con demo mode + tighter footer

- Between cons (when the real clock falls outside the schedule), the app now
  **time-travels to Friday 12:00 pm** so Now, Grid, and the trip planner show
  live data instead of an empty screen — with a banner reading "Time Traveling
  for Testing Purposes". During the con, real time is used and the banner is hidden.
- Footer copy trimmed for redundancy (same meaning, fewer words).

## 1.11.2 — credit the data source in the footer

- The footer now credits **Max Schilling** (u/maxschilling on r/dragoncon), who
  pulls the Dragon Con schedule each year and shares it publicly — the data this
  app reshapes. No functional change; the data payload is identical to 1.11.1.

## 1.11.1 — Featuring / Other tags, checks & crosses

- `Kind` filter split into **Featuring** (who is on the panel) and **Other
  tags** (extra fee, parties) — "Kind" was doing two unrelated jobs
- Filter chips show a ✓ when included and a ✕ when excluded, so state reads in
  night mode, greyscale, and for colour-blind users
- Hidden Featuring chips dim and strike through like track chips already did
- All filter panels share one open/close handler, so opening one closes the others

## 1.11 — multi-day filter, extra-fee tag, Browse running section

- Day chips are multi-select — "I'm only here Friday to Sunday" is three taps —
  and Browse opens on the current day of the con
- Extra-fee workshops and events are tagged and filterable
- Browse gets the same collapsible **already-running** section as Now
- Outside the con, views fall back to the busiest day rather than the first

## 1.10.3 — fix My Con crash and stale chip fade

- A trip departing before its day began produced a weekday with no entry in the
  day-name table; every lookup on it threw and left My Con blank. Day names are
  now total and trips cannot depart before their day starts
- Removed a scroll fade left on the chip rows after they were changed to wrap

## 1.10.2 — fix blank screen, pins on hotel chips

- Removed a reference to a non-existent element that threw at startup and left
  the whole page blank (the test harness had been inventing that element)
- Distance sort puts a 📍 on each hotel chip instead of repeating the list
- Hotels ordered geographically: Courtland, Hilton, Marriott, Hyatt, Westin, AmericasMart

## 1.10.1 — all hotels visible without scrolling

- Hotel chips wrap instead of scrolling; dropping the colour dot and moving the
  colour to the chip border fit nine chips in two lines rather than three

## 1.10 — tracks and kind filter the same way

- Track chips are now plain show/hide like Kind, dropping the three-state
  follow cycle that had no visible effect
- Both panels get **Show all / Hide all**, so isolating one track takes two taps
- The tracks you leave visible now feed the trip planner's interest weighting

## 1.9.3 — tidier hotel filter

- Hardy Ivy Park and Offsite share one **Other** chip; Courtland Grand shortens
  to Courtland. Rows still name the real venue; only the filter groups them

## 1.9.2 — day filter no longer hides Saturday

- Day chips wrap instead of scrolling, so Saturday and Sunday (the busiest days)
  are visible rather than cut off the right edge; the hotel row fades at the edge

## 1.9.1 — friend names no longer duplicate

- A shared link with a trailing space in the sender's name created a second
  friend entry instead of replacing it. Names now compare on a normalised key
  ignoring case, spacing and punctuation

## 1.9 — picks obey filter and sort

- **Your next picks** on Now respects the active filter and sort instead of a
  fixed order, and reports how many picks the filters are hiding
- Interest sort breaks ties by location

## 1.8 — Sunday evening · deployment #9

- Panel badges name what people **do** — ACTOR, AUTHOR, ARTIST, MUSICIAN,
  COSTUMER, CREATOR, SCIENTIST, PERFORMER — from each guest's bio in the 2026
  Program Book, replacing the meaningless GUEST and CREATOR
- Expanding a row names who is on the panel and how the book bills them
- Guests of Honor parsed from their own page; they had been missing entirely
- Kind filter by role
- Group headings stick under the app bar instead of scrolling away
- Header hides on scroll down, returns on scroll up, jump-to-top button
- Your next picks obeys the active filter and sort

## 1.7 — Sunday afternoon · deployment #8

- **Already running** split from **Just started**, collapsible, ordered by how
  much of the event is left
- All-day drop-ins separated out of Now
- Neutral wording: nothing says "late"
- Watch a DCTV broadcast as a real event on your own timeline
- End times on every row
- Clear-filters button and All chips per category

## 1.6 — Friday evening · deployment #7

- **Trip planner**: two runs a day in configurable feeding windows, costed
  against your picks, Saturday parade blackout, parking-hotel awareness
- Rule an option out of a slot without unstarring it
- Move a pick to a later showing in one tap
- Three direct controls on My Con rows instead of a cycle that deleted things

## 1.5 — Friday evening · deployment #6

- Schedule rebuilt from the second export — John Billingsley off four panels,
  one new panel, character-encoding fixes
- Build stamp in the footer, so a cached page is obvious
- Repeat sessions detected
- Multi-hotel selection
- Sort control: Time, Interest, Place, Distance

## 1.4 — Friday · deployment #5

- **Friends**: import someone's link and it sits beside your picks rather than
  merging; shared panels carry their name
- My Con grouped by time slot instead of a flat list of clash warnings
- Ranked list of what actually needs deciding

## 1.3 — Friday · deployment #4

- Picks keyed to each event's own ID instead of its list position, which had
  been silently re-pointing them on every rebuild
- Three interest levels: none, interested (★), must see (🏆)
- Follow tracks as a fallback interest signal

## 1.2 — Friday · deployment #3

- **DCTV** air times matched by title against the published streaming schedule
- Hide past toggle
- Ballroom queue policy from the Quick Start Guide

## 1.1 — Friday · deployment #2

- Fixed Browse and My Con rendering nothing — two runtime errors that a syntax
  check could not catch
- Hotel filter shown on Now, where it had been applying invisibly

## 1.0 — Friday · deployment #1

First public build at wyvernconapps.github.io/planner.

- Four tabs: **Now**, **Browse**, **Grid**, **My Con**
- Grid lays rooms down the side and time across the top, both pinned
- Room floors read off Dragon Con's venue maps for all five hotels and both
  AmericasMart buildings
- Room size tiers inferred from how many tracks share a room
- Walk-time estimates between hotels with gap warnings
- Vendor halls, photo ops, signings and gaming signups dropped from the payload
- Payload gzipped and base64'd: full descriptions at about half the bytes
- Disclaimer, `noindex`, home-screen support
- Share link to move picks between devices

## Known gaps

Carried forward into v2 planning:

- Walk times are estimates, never measured
- Four room tiers are wrong against published capacities — Hilton Galleria 2-3,
  Courtland Atlanta 1-2, Hyatt Hanover C-E, Hyatt Regency V
- The Video Gaming track filter may still be hiding real guest panels
- 80 of 795 guest bios yield no role, so those show billing only
- 112 of 825 presenters match no guest list — bands, theatre companies, and
  people confirmed after the book went to print

## Sources

- Schedule: **Max Schilling's** community spreadsheet (u/maxschilling on
  r/dragoncon), exported to CSV — he pulls it from Dragon Con's Core-apps
  data feed and shares it publicly each year
- Floors: Dragon Con venue maps, screenshotted from the app
- Guest names and roles: 2026 Program Book
- Room policy and courtesy bus: 2026 Quick Start Guide
- Broadcast times: DCTV published streaming schedule
