# GitHub, as far as this project needs it

Written for the WyvernCon planner: one HTML file, one person, a web browser.
Most GitHub tutorials teach branches and pull requests, which exist so several
people can change the same code without treading on each other. You are one
person with one file. You can skip all of it.

---

## The mental model

**A repository is a folder that remembers.** That is the whole idea. Every
time you save into it, it keeps the previous state as well, forever, with a
note about what changed. Nothing is ever overwritten — it is added to.

Your repo is `wyvernconapps/planner`. It holds two files: `index.html`, which
is the app, and `README.md`, which is the description GitHub shows underneath.

**A commit is one save, with a note.** Not a file — a moment. "The repo looked
like *this* at 9:14pm on Sunday, and here is why." Every commit has a short
identifier called a SHA, like `923a869`, which is how you refer to that exact
moment later.

When you use **Add file → Upload files**, GitHub makes a commit for you. That
is why every entry in your history says "Add files via upload" — that is just
the default message it fills in when you leave the box alone.

**The commit box has two fields.** The top one is the summary, which is what
shows in the history list. The bigger one below is the description. If your
message ends up in the description with "Add files via upload" still on top,
the summary field was left at its default.

---

## What you have set up

### GitHub Pages

Pages takes a folder in your repo and serves it as a website. Yours serves the
root of `main` at **wyvernconapps.github.io/planner**.

The name `index.html` matters: web servers hand over the file called
`index.html` when someone asks for a folder. Call it anything else and the
bare URL gives a 404.

Every push triggers a rebuild, which is what the **Deployments** list records.
Nine deployments means nine times the site was rebuilt and republished.

### What Pages does not do

It serves files. It cannot run code on a server, hold a database, or keep
anything shared between visitors. Everything your app does happens in the
visitor's browser — which is why picks are stored per device and why the v2
features need a backend.

---

## The bit you have not used yet: getting an old version back

This is what the history is actually *for*, and it is worth doing once before
you need it.

1. Open `index.html` in the repo
2. Click **History** (the clock icon, top right of the file view)
3. Pick any earlier commit
4. You are now looking at the file exactly as it was then
5. **Raw** gives you that version to download

So when a build breaks something, you do not have to remember what changed or
ask me to rebuild it. The working version is still sitting there. This is the
single practical reason a repo beats a folder of files called
`index-final-v2-REAL.html`.

---

## Releases and tags

A **tag** is a permanent label on one commit: `v1.9` points at `923a869`
forever. A **release** is a tag plus a title and notes, shown on its own page.

Yours says "0 tags" and "No releases published" because you have not made any.
Worth starting, for two reasons:

- **Releases are editable after the fact.** Commit messages are not — fixing
  one means rewriting history, which is a bad trade for a typo.
- They give the version a home that is not a markdown file you have to
  remember to update.

To make one: **Create a new release** on the repo home page → choose a tag like
`v1.9` → title it → paste the notes → publish.

---

## What you are deliberately not using

| Thing | What it is for | Why you can ignore it |
| --- | --- | --- |
| Branches | Working on a change without disturbing the live version | You have one file and test by looking at it |
| Pull requests | Proposing and reviewing changes before merging | Nobody to review |
| Forks | Copying someone else's repo to work on your own version | Not collaborating |
| Issues | A to-do list attached to the repo | Your v2 spec does this already |
| Actions | Running scripts automatically on push | Nothing to build — the file is already built |

If the project grows a second person, branches and pull requests are the first
things to learn. Until then they are ceremony.

---

## When the web interface stops being enough

You would want git proper — the command-line tool GitHub is built on — when:

- You need to **fix a commit message**, which needs `git commit --amend`
- You want to **tag old commits** retroactively
- You are uploading **several files at once**, repeatedly
- You want a **local copy** of the whole history

None of those apply yet. Uploading one file through the browser is a
completely legitimate way to use GitHub, and it is what you have been doing.

Worth knowing: **Codie has a shell and can run git directly.** If you ever
need history rewritten or tags applied, that is the surface for it, and it is
the same division of labour you already use — I produce the file, Codie
executes.

---

## The habit worth keeping

Three things, each about ten seconds:

1. **Write the summary line** in the top field, not just the description
2. **Say what changed and why**, not what you did — "picks obey filter and
   sort" rather than "updated index.html"
3. **Cut a release** when the version number changes

The point of all three is the same: in six months you will want to know why
something is the way it is, and the only record will be what you wrote at the
time.

---

## Going further

GitHub's own material, if you want the fuller picture:

- **GitHub for Beginners** — `github.blog/tag/github-for-beginners/`
- **Get started docs** — `docs.github.com/en/get-started`
- **Hello World tutorial** — `docs.github.com/en/get-started/start-your-journey/hello-world`,
  which explicitly needs no coding or command line, though it does teach the
  branch-and-pull-request workflow you are not using

Read them for context rather than instruction. The workflow above is the one
this project actually needs.
