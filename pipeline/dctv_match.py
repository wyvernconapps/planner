import pathlib as _pl
HERE = _pl.Path(__file__).parent
import json, re, difflib
from datetime import datetime, timedelta

RAW = """Thursday
5:30PM|The Late Show Episode 0
6:00PM|DCTV FanFlix
7:00PM|Dragon Con Wrestling
10:30PM|DCTV FanFlix
11:30PM|Dragon Con Wrestling *Rebroadcast*
2:30AM|Page to Stage Costume Contest *Rebroadcast*
Friday
8:00AM|DCTV FanFlix
9:00AM|The Late Show
10:00AM|Resident Alien: Visitors from Patience, CO
11:30AM|Star Trek Lower Decks Q&A
1:00PM|The Rookie Cast
2:30PM|The Boys Guests: Life in Vought World
4:00PM|The Amazing Digital Circus
5:30PM|Battlestar Galactica: A Galaxy of Stars
7:00PM|Hades II Guests *Rebroadcast*
8:30PM|Friday Night Costuming Contest
11:30PM|The Cybertronic Spree
1:00AM|Troublemaker Film
3:00AM|Fatal Future
Saturday
8:00AM|DCTV FanFlix
9:00AM|The Late Show
10:00AM|26th Annual Dragon Con Parade
11:30AM|Castle Cast
1:00PM|Secrets of Nevermore: Wednesday Cast
2:30PM|Long May She Reign: An Hour with Lena Headey
4:00PM|Resident Alien: Alien? Guests Among Us
5:30PM|Return to Purgatory: Wynonna Earp Cast *Rebroadcast*
6:30PM|Land of the Lost Cast: Six Decades of a Routine Expedition *Rebroadcast*
7:30PM|Star Trek Enterprise Q&A *Rebroadcast*
8:30PM|Improvised Dungeons & Dragons - LIVE! *Rebroadcast*
9:30PM|Atlanta Radio Theater Co. Presents: The Call of C'thulhu *Rebroadcast*
11:00PM|The Cults of Dragon Con Costume Contest *Rebroadcast*
12:30AM|Dragon's Cup: Knightly Mass Combat *Rebroadcast*
2:00AM|Dragon's Cup: Dragon Battles *Rebroadcast*
4:00AM|Fatal Future
Sunday
8:00AM|DCTV FanFlix
9:00AM|The Late Show
10:00AM|Q&A with the Amazing Sean Astin!
11:30AM|Resident Alien Guests: Funny Bones Are Universal
1:00PM|Firefly: One More Heist
2:30PM|Stargate: SG-1: Taking This Loop off
3:30PM|You Want a Killer Hillbilly? - An Hour With Tyler Labine *Rebroadcast*
5:00PM|X-Men '97 Cast *Rebroadcast*
6:00PM|The Hunt Is On: A Yellowjackets Cast Panel *Rebroadcast*
7:00PM|New Achievement! A Dungeon Crawler Carl panel with Matt Dinniman & Jeff Hays! *Rebroadcast*
8:30PM|Dragon Con Masquerade
11:00PM|Dragon Con Masquerade *Rebroadcast*
1:30AM|Cruxshadows
3:00AM|Vision Vogue Fashion Show *Rebroadcast*
Monday
8:00AM|Magical Monday Morning Music Hour
9:00AM|The Late Show
10:00AM|An Hour with Literary Guest of Honor Timothy Zahn *Rebroadcast*
11:00AM|An Hour with Star Wars' Bo-Katan *Rebroadcast*
12:00PM|Edgewood Avenue: An Improvised Variety Show - PUPPET SHOW *Rebroadcast*
1:00PM|Smallville Class Reunion *Rebroadcast*
2:00PM|Q&A with the Amazing Sean Astin! *Rebroadcast*"""

DAY_BASE = {'Thursday':1440,'Friday':2880,'Saturday':4320,'Sunday':5760,'Monday':7200}

def to_min(t):
    m = re.match(r'(\d+):(\d+)(AM|PM)', t)
    h, mi, ap = int(m.group(1)), int(m.group(2)), m.group(3)
    if ap == 'PM' and h != 12: h += 12
    if ap == 'AM' and h == 12: h = 0
    return h*60 + mi

rows, day, prev, wrapped = [], None, -1, False
for line in RAW.splitlines():
    if line in DAY_BASE:
        day, prev, wrapped = line, -1, False
        continue
    t, title = line.split('|', 1)
    mins = to_min(t)
    # a time earlier than the previous one has crossed midnight - and once a
    # day block has crossed, everything after it stays on the next date
    if mins < prev: wrapped = True
    prev = mins
    base = DAY_BASE[day] + (1440 if wrapped else 0)
    rebroadcast = '*Rebroadcast*' in title
    title = title.replace('*Rebroadcast*', '').strip()
    rows.append({'day': day, 'start': base + mins, 'title': title, 'rebroadcast': rebroadcast})

# things that are DCTV's own programming, not convention panels
OWN = re.compile(r'^(DCTV FanFlix|The Late Show|Fatal Future|Troublemaker Film|'
                 r'Magical Monday Morning Music Hour)', re.I)

d = json.load(open(HERE / 'data.json'))   # FULL set - DCTV airs some
                                               # panels my track filter drops
EV = d['events']
EPOCH = datetime.fromisoformat(d['epoch'])
T, S, DU, HOT, LOC, EID = 0, 1, 2, 3, 4, 8

def norm(s):
    s = s.lower()
    s = re.sub(r'[^a-z0-9 ]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

titles = [(norm(e[T]), i) for i, e in enumerate(EV)]
def clock(m):
    t = EPOCH + timedelta(minutes=m); h = t.hour % 12 or 12
    return f"{t:%a} {h}:{t.minute:02d}{'am' if t.hour < 12 else 'pm'}"

matched = unmatched = own = 0
air = {}
print(f"{'DCTV AIRS':<18} {'KIND':<12} {'TITLE':<46} MATCHED PANEL")
print('-'*130)
for r in rows:
    if OWN.match(r['title']):
        own += 1
        continue
    n = norm(r['title'])
    cands = [(difflib.SequenceMatcher(None, n, tn).ratio(), i) for tn, i in titles]
    cands = [c for c in cands if c[0] >= 0.75]
    kind = 'rebroadcast' if r['rebroadcast'] else 'live'
    if cands:
        top = max(c[0] for c in cands)
        pool = [i for sc, i in cands if sc >= top - 0.02]
        # the CSV repeats some panels; pick the airing's actual source. Live means
        # the same slot; a rebroadcast means the most recent one already finished.
        if r['rebroadcast']:
            past = [i for i in pool if EV[i][S] <= r['start']]
            best = max(past, key=lambda i: EV[i][S]) if past else min(pool, key=lambda i: EV[i][S])
        else:
            best = min(pool, key=lambda i: abs(EV[i][S] - r['start']))
        matched += 1
        e = EV[best]
        delta = r['start'] - e[S]
        note = 'same time' if abs(delta) <= 30 else f'+{delta//60}h later'
        air.setdefault(e[EID], {'live': False, 'airs': []})
        if not r['rebroadcast'] and abs(delta) <= 30: air[e[EID]]['live'] = True
        else: air[e[EID]]['airs'].append(r['start'])
        print(f"{clock(r['start']):<18} {kind:<12} {r['title'][:44]:<46} "
              f"{clock(e[S])} {d['hotels'][e[HOT]]} [{note}]")
    else:
        unmatched += 1
        print(f"{clock(r['start']):<18} {kind:<12} {r['title'][:44]:<46} -- no panel match")

print(f"\nDCTV slots: {len(rows)} | own programming: {own} | "
      f"matched to a panel: {matched} | unmatched: {unmatched}")
print(f"live airings matched: {sum(1 for r in rows if not r['rebroadcast'])} total live slots")

json.dump(air, open(HERE / 'dctv.json','w'))
live_ids = [k for k,v in air.items() if v['live']]
print(f"\nDistinct panels DCTV airs LIVE      : {len(live_ids)}")
print(f"Distinct panels with a later replay : {sum(1 for v in air.values() if v['airs'])}")
print(f"Total distinct panels on DCTV       : {len(air)}")
