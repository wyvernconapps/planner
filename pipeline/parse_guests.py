import pathlib as _pl
HERE = _pl.Path(__file__).parent
import re, json, subprocess

SRC = str(HERE / 'inputs' / '2026ProgramBook.pdf')
txt = subprocess.run(['pdftotext', '-layout', SRC, '-'],
                     capture_output=True, text=True).stdout
pages = txt.split('\f')

# every presenter the schedule actually names, used to vet one-word entries
key = lambda n: re.sub(r'[^a-z]', '', n.lower())
SCHED = set()
for _e in json.load(open(HERE / 'data-slim.json'))['events']:
    for _n in (_e[6] or '').split(','):
        if _n.strip():
            SCHED.add(key(_n.strip()))
print('pages:', len(pages))

def section_pages(header, after=5):
    """pages carrying this running head. `after` skips the contents page,
    which lists every section name."""
    return [i for i, p in enumerate(pages)
            if i >= after and header.lower() in p.lower()]

spot = section_pages('Who to See: Spotlight Guests')
feat = section_pages('Who to See: Featured Guests')
prof = [i for i in section_pages('Attending Professionals') if i > max(feat)]
print('spotlight pages     :', spot[0], '-', spot[-1], f'({len(spot)})')
print('featured guest pages:', feat[0], '-', feat[-1], f'({len(feat)})')
print('attending pro pages :', prof[0], '-', prof[-1], f'({len(prof)})')

# A name line is short, in caps, and 2+ tokens. Bios are sentence case, so
# they never match. Allow initials, periods, hyphens, apostrophes, accents.
NAME = re.compile(r"^[A-ZÀ-Ý][A-ZÀ-Ý0-9'’\.\-]*(?: [A-ZÀ-Ý][A-ZÀ-Ý0-9'’\.\-]*){0,4}$")
SKIP = re.compile(r'^(WHO TO SEE|DRAGON CON|GUEST OF HONOR|FEATURED GUESTS|'
                  r'ATTENDING PROFESSIONALS|VENDOR|THE |AND |OR )', re.I)

def entries_on(page):
    """(name, bio) per column. Names are ALL CAPS; the sentence-case lines
    beneath them are the bio, which is where the role is stated."""
    cols = {}
    for raw in page.split('\n'):
        pos = 0
        for cell in re.split(r'(\s{3,})', raw):
            if cell.strip() and not cell.startswith('   '):
                cols.setdefault(pos // 40, []).append(cell.strip())
            pos += len(cell)
    out = []
    for _, lines in sorted(cols.items()):
        cur, bio = None, []
        for c in lines:
            c2 = c.rstrip('.')
            isname = (len(c2) <= 42 and not SKIP.match(c2) and NAME.match(c2)
                      and not c2.isdigit())
            if isname:
                toks = c2.split()
                multi = sum(len(t.replace('.', '')) > 1 for t in toks) >= 2
                if multi or (len(toks) == 1 and len(c2) >= 5 and key(c2) in SCHED):
                    if cur: out.append((cur, ' '.join(bio)))
                    cur, bio = c2, []
                    continue
            if cur: bio.append(c)
        if cur: out.append((cur, ' '.join(bio)))
    return out

def names_on(page):
    out = []
    for raw in page.split('\n'):
        # two columns: split on a run of 3+ spaces and test each side
        for cell in re.split(r'\s{3,}', raw.strip()):
            c = cell.strip().rstrip('.')
            if not c or len(c) > 42:
                continue
            if SKIP.match(c):
                continue
            if NAME.match(c) and not c.isdigit():
                # a real name has at least one token longer than one character
                toks = c.split()
                multi = sum(len(t.replace('.', '')) > 1 for t in toks) >= 2
                # single-name performers (Banachek, Voltaire) are real but a
                # bare capitalised word is also how headings look - so accept
                # one-word names only when the schedule lists them as a
                # presenter, which no stray heading will be
                if multi or (len(toks) == 1 and len(c) >= 5 and key(c) in SCHED):
                    out.append(c)
    return out

# Guests of Honor sit on their own page with a title line above the name,
# not in the alphabetical run - so the parser above misses them entirely.
# They are the top billing, so they cannot be dropped.
GOH = {}
goh_pat = re.compile(
    r'^\s*((?:Artist|Literary|Literature|Media|Music|Special|Comic)[A-Za-z ]*'
    r'Guest of Honor)\s*\n\s*([A-Z][A-Za-z\.\'\- ]+?)\s*\n((?:[^\n]+\n){1,8})', re.M)
for pg in pages:
    for m in goh_pat.finditer(pg):
        title, name = m.group(1).strip(), m.group(2).strip()
        bio = re.sub(r'\s+', ' ', m.group(3)).strip()
        # the bio opens by restating the billing; drop it so the role words lead
        bio = re.sub(r"^Dragon Con.s 20\d\d [A-Za-z ]*Guest of Honor ", '', bio)
        if 2 <= len(name.split()) <= 4:
            GOH[key(name)] = {'name': name, 'title': title, 'bio': bio[:400]}
print('guests of honor:', ', '.join(f"{v['name']} ({v['title']})" for v in GOH.values()))

BIOS = {}
def collect(idxs):
    got = []
    for i in idxs:
        for n, bio in entries_on(pages[i]):
            got.append(n)
            if bio and key(n) not in BIOS:
                BIOS[key(n)] = re.sub(r'\s+', ' ', bio)[:400]
    return got
spotlight     = collect(spot)
featured      = collect(feat)
professionals = collect(prof)

def tidy(seq):
    seen, out = set(), []
    for n in seq:
        k = re.sub(r'[^A-Z]', '', n.upper())
        if k and k not in seen:
            seen.add(k)
            out.append(n)
    return out

spotlight, featured, professionals = tidy(spotlight), tidy(featured), tidy(professionals)
# tiers are exclusive, highest wins
sk = {re.sub(r'[^A-Z]', '', n.upper()) for n in spotlight}
featured = [n for n in featured if re.sub(r'[^A-Z]', '', n.upper()) not in sk]
fk = sk | {re.sub(r'[^A-Z]', '', n.upper()) for n in featured}
professionals = [n for n in professionals if re.sub(r'[^A-Z]', '', n.upper()) not in fk]

print(f'\nSPOTLIGHT GUESTS     : {len(spotlight)}')
print('  ', ', '.join(spotlight[:10]))
print(f'FEATURED GUESTS      : {len(featured)}')
print('  ', ', '.join(featured[:10]))
print(f'ATTENDING PROFESSIONALS: {len(professionals)}')
print('  ', ', '.join(professionals[:10]))

print(f'\nbios captured: {len(BIOS)}')
for n in list(BIOS)[:3]:
    print('   ', BIOS[n][:96])
for k, v in GOH.items():
    BIOS.setdefault(k, v['bio'])
    if not any(key(n) == k for n in spotlight):
        spotlight.append(v['name'].upper())
json.dump({'spotlight': spotlight, 'featured': featured,
           'professionals': professionals, 'bios': BIOS,
           'honors': {k: v['title'] for k, v in GOH.items()}},
          open(HERE / 'guests.json', 'w'))
