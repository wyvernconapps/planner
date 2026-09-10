import pathlib as _pl
HERE = _pl.Path(__file__).parent
import csv, json, re
from datetime import datetime

SRC = str(HERE / 'inputs' / 'Dragoncon_2026_-_Events__1_.csv')
EPOCH = datetime(2026, 9, 2, 0, 0)  # Wed 00:00, con starts Wed/Thu

def hotel(loc):
    l = loc.strip()
    if l.startswith('O Other Marriott') or l.startswith('Marriott'):
        return 'MAR'
    if l.startswith('O Other Hyatt') or l.startswith('Hyatt'):
        return 'HYA'
    if l.startswith('Hilton'):
        return 'HIL'
    if l.startswith('Westin') or l.startswith('Peachtree Plaza'):
        return 'WES'
    if l.startswith('Courtland Grand'):
        return 'CG'
    if l.startswith('Mart'):
        return 'AMART'
    if l.startswith('Streaming'):
        return 'ONLINE'
    if l.startswith('Hardy'):
        return 'PARK'
    return 'OFF'

def room(loc, h):
    l = loc.strip()
    l = re.sub(r'^(O Other |O |Other )', '', l)
    for pre in ('Marriott', 'Hyatt', 'Hilton', 'Westin', 'Courtland Grand',
                'Mart2', 'Mart Building', 'Mart'):
        if l.startswith(pre):
            return l[len(pre):].strip(' ,') or pre
    if h == 'ONLINE':
        m = re.search(r'(https?://\S+)', l)
        return 'Twitch stream'
    return l

def mins(s):
    try:
        return int((datetime.strptime(s.strip(), '%m/%d/%Y %H:%M:%S') - EPOCH).total_seconds() // 60)
    except Exception:
        return None

rows = list(csv.DictReader(open(SRC, encoding='utf-8-sig')))

tracks, locs, hotels = [], [], []
def idx(lst, v):
    if v not in lst:
        lst.append(v)
    return lst.index(v)

events = []
skipped = 0
for r in rows:
    s, e = mins(r['StartDate']), mins(r['EndDate'])
    if s is None:
        skipped += 1
        continue
    if e is None or e <= s:
        e = s + 60
    h = hotel(r['Location'])
    desc = (r['Description'] or '').strip()
    desc = re.sub(r'\s+', ' ', desc)
    if len(desc) > 600:
        desc = desc[:597].rstrip() + '...'
    events.append([
        r['Title'].strip(),
        s, e - s,
        idx(hotels, h),
        idx(locs, room(r['Location'], h)),
        idx(tracks, (r['TrackName'] or 'Other').strip()),
        re.sub(r'\s+', ' ', (r['Presenters'] or '').strip()),
        desc,
        r['EventId'].strip().replace('-', '')[-8:],   # stable key, collision-free
    ])

events.sort(key=lambda x: (x[1], x[0]))

payload = {
    'epoch': EPOCH.isoformat(),
    'hotels': hotels,
    'locs': locs,
    'tracks': tracks,
    'events': events,
}

out = json.dumps(payload, separators=(',', ':'), ensure_ascii=False)
open(HERE / 'data.json', 'w', encoding='utf-8').write(out)
print('events:', len(events), 'skipped:', skipped)
print('tracks:', len(tracks), 'rooms:', len(locs), 'hotels:', hotels)
print('payload KB:', len(out.encode()) // 1024)
