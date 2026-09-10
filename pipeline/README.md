# Build pipeline

Everything needed to rebuild `index.html` from a Dragon Con schedule export.
Without this, the only artefact is the built file — one 320,000-character line
of base64 that cannot sensibly be edited by hand.

**`shell.html` is the source. `index.html` is generated.** Edit the first,
never the second.

---

## Requirements

Python 3 and Node 18+. Nothing to install — no packages, no build tools.

## Inputs

Put these in the same folder:

| File | Where it comes from |
| --- | --- |
| `Dragoncon_2026_-_Events.csv` | Export from the official Dragon Con app |
| `2026ProgramBook.pdf` | readme.dragoncon.org, Download button |

`poppler-utils` is needed for the PDF steps (`pdftotext`).

## Running it

Four steps, in order. Each writes a file the next one reads.

```
python3 build_data.py
```
Reads the CSV. Normalises room names, derives floors from the venue maps
encoded in `shell.html`, converts times to minute offsets, assigns each event
a stable 8-character ID from its EventId. Writes `data.json`.

```
python3 dctv_match.py
```
Matches the DCTV broadcast schedule (hardcoded in the script — paste in the
new year's from dragoncon.tv) against panel titles. Writes `dctv.json`.

```
python3 parse_guests.py && python3 derive_roles.py
```
Pulls the Spotlight Guests, Featured Guests, Attending Professionals and
Guests of Honor out of the Program Book, then derives each person's role from
their own bio. Writes `guests.json` and `roles.json`.

```
node build_slim.js
```
Drops the tracks nobody wants (vendor halls, photo ops, signings, gaming
signups), computes room tiers, detects repeat sessions, attaches guest roles.
Writes `data-slim.json`.

```
python3 assemble.py
```
Gzips and base64s the payload into `shell.html`, writes `index.html`.

## Testing

**Run these before shipping anything.** `node --check` only parses — it will
happily report success on code that throws the moment the page opens. Four
crashes shipped that way before this harness existed.

```
cd tests
node final.js     # 26 checks: data, all four views, interactions, sync
node audit.js     # fires every control in every view
node t18.js       # every view renders, with and without picks and filters
```

`domshim.js` is a minimal DOM that reads its element list **out of the real
`index.html`**. That matters: an earlier version invented elements from a
hardcoded list and let a reference to a non-existent element through, which
shipped as a blank screen.

The numbered suites cover specific features — repeats, trips, friends, sorting,
tiers, the star cycle. Run them all after any change that touches shared code:

```
for t in t*.js; do node $t; done
```

## Where the data comes from

| What | Source |
| --- | --- |
| Panels, times, rooms, presenters | Dragon Con app CSV export |
| Room floors | Dragon Con venue maps (screenshots, in `venue-maps/`) |
| Guest names and roles | 2026 Program Book |
| Room policy, courtesy bus | 2026 Quick Start Guide |
| Broadcast times | dragoncon.tv streaming schedule |
| Walk times between hotels | Estimates. Never measured. See `WALK` in `shell.html` |

## Doing this again next year

The per-year work is:

1. New CSV export
2. New Program Book — `parse_guests.py` keys off the running heads
   ("Who to See: Featured Guests"), so it should survive a redesign, but check
   the page ranges it reports
3. New DCTV schedule pasted into `dctv_match.py`
4. New venue maps if rooms moved — floors are hardcoded in `FLOOR_MAP`
   in `shell.html`, read off the maps by hand

The guest-list parse found 713 of 825 presenters in 2026. The rest were bands,
theatre companies, and people confirmed after the book went to print.
