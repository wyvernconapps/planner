# WyvernCon Schedule

An unofficial **Dragon Con** schedule planner — one self-contained HTML file
that opens on your phone, works offline, and stores your picks on the device.
Live at **[wyvernconapps.github.io/planner](https://wyvernconapps.github.io/planner)**
(GitHub Pages serves `index.html` from the root of `main`).

> Unofficial fan project. Not affiliated with, endorsed by, or associated with
> Dragon Con. Rooms and times change during the convention — check the official
> grid for anything that matters.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | **The app** — the deployed, self-contained build. Generated; do not hand-edit. |
| `pipeline/shell.html` | **The source.** The app's real HTML/CSS/JS, with a `"__DATA__"` placeholder where the schedule payload gets injected. Edit this. |
| `pipeline/` | Build scripts, the schedule/guest data, and the test harness (`pipeline/README.md` has the details). |
| `pipeline/tests/` | Node test suites — run against the built `index.html`. |
| `venue-maps/` | The seven hotel floor-map screenshots that room floors are read from. |
| `CHANGELOG.md` | Version history, 1.0 → 1.11.1. |
| `github-guide.md` | Plain-language GitHub guide for this one-file, one-person project. |
| `wyverncon-v2-spec.md` | The post-con v2 plan and idea inbox. |

## Source vs. built

`index.html` is **generated** from `pipeline/shell.html` — it's one ~320,000
-character base64 line and cannot sensibly be edited by hand. Change the app by
editing `shell.html` (or the data), then rebuild.

## Rebuild the app

From `pipeline/`, the fast path (data already present) is the last step:

```bash
python assemble.py    # shell.html + data-slim.json -> ../index.html
```

A full rebuild from a fresh Dragon Con export needs the CSV and Program Book PDF
in `pipeline/inputs/` — see [pipeline/README.md](pipeline/README.md) for the
four upstream steps. Builds are byte-reproducible (the gzip mtime and OS byte
are pinned), so an unchanged app produces an identical file and git stays quiet.

## Test before you ship

```bash
cd pipeline/tests
node final.js      # data, all four views, interactions, sync
node audit.js      # fires every control in every view
for t in t*.js; do node "$t"; done
```

`node --check` only parses — it will pass code that throws the moment the page
opens. Run the suites above, which read the real built `index.html`.

## Deploy

Commit `index.html` (and whatever source produced it) and push to `main`;
GitHub Pages redeploys automatically. See `github-guide.md` for the details and
for recovering an older version.

## Versioning

Patch (`1.11.1`) = fixes/wording · Minor (`1.11`) = new capability · Major
(`2.0`) = saved picks won't survive, or a rebuild. Keep the commit summary under
50 characters with the detail in the body.
