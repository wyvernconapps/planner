import pathlib as _pl
HERE = _pl.Path(__file__).parent
import json, re, collections

g = json.load(open(HERE / 'guests.json'))
bios = g['bios']
key = lambda n: re.sub(r'[^a-z]', '', n.lower())

# Order matters: the first match wins, so the more specific descriptions of a
# person come before the catch-alls. Drawn from how the Program Book actually
# writes these bios, not from an abstract taxonomy.
ROLES = [
 ('actor', r"\b(actor|actress|voice[- ]?(of|actor|acting)|portray(ed|ing|s)|starring|"
           r"starred|episodes of|(his|her|their) role as|roles? (as|on|in)|cast to play|"
           r"appeared in|plays? multiple characters|breakthrough role|"
           r"best known for (his|her|their) (television|film|screen|starring))"),
 ('author', r"\b(author|novelist|bestselling|has (written|published)|wrote (the|two|\d)|"
            r"writes? (science fiction|fantasy|horror|urban fantasy|romance|epic|bold|"
            r"humorous|romantic|comics)|\d+ novels|novels?,|short fiction|"
            r"published \d+|Nebula|Hugo)"),
 ('artist', r"\b(illustrator|cartoonist|penciller|inker|comic ?book artist|comic artist|"
            r"cover art|concept art|painter|sculptor|paintings|visual storyteller|"
            r"tattoo|silkscreen|is an artist|graphic designer|art for)"),
 ('musician', r"\b(musician|vocalist|singer|songwriter|composer|guitarist|drummer|"
              r"filk|ukulele|band\b|music hour|songwrit|album|catalog of)"),
 ('costumer', r"\b(costume|cosplay|fursuit|prop builder|prop, |puppet|puppetry|"
              r"makeup (fx|effects)|creature (creation|artist)|specialty costumer)"),
 ('creator', r"\b(showrunner|producer|director|screenwriter|filmmaker|animator|"
             r"game design|creator of|co-creator|creator/|streamer|podcast|youtube|"
             r"content creator|webcomic|web series)"),
 ('scientist', r"\b(Dr\.|scientist|astronomer|astrophysicist|physicist|entomologist|"
               r"zoologist|neuroscientist|microbiologist|anthropologist|chemist|"
               r"professor|NASA|JPL|PhD|Ph\.D|researcher|astro|epidemiolog|"
               r"public health|biomedical)"),   # 'mad scientists' is guarded below
 ('expert', r"\b(attorney|lawyer|counsel|policy analyst|security|cryptograph|"
            r"technologist|nurse|physician|therapist|psychotherapist|educator|"
            r"historian|analyst|engineer)"),
 ('performer', r"\b(magician|mentalist|improviser|host|stunt|wrestler|"
               r"burlesque|dancer|storyteller|entertain)"),
 ('writer', r"\b(writer|journalist|editor|essayist|blogger)"),
]

# These bios name the primary role first - "Sean Astin is an actor, director,
# producer" - so the earliest match wins, not the most frequent. Counting hits
# made him a creator on two words against one.
NOISE = re.compile(r'mad scientists?|rocket scientist|sci-?fi channel', re.I)
roles = {}
for k, b in bios.items():
    clean = NOISE.sub(' ', b)
    best, at = None, len(clean) + 1
    for role, pat in ROLES:
        m = re.search(pat, clean, re.I)
        if m and m.start() < at:
            best, at = role, m.start()
    if best:
        roles[k] = best

c = collections.Counter(roles.values())
print('roles:', dict(c.most_common()))
print('still unmatched:', len(bios) - len(roles), 'of', len(bios))

tier = {}
for t in ['professionals', 'featured', 'spotlight']:
    for n in g[t]:
        tier[key(n)] = t

# what the badge should say for a person: their role, and how they are billed
out = {}
for n in g['spotlight'] + g['featured'] + g['professionals']:
    k = key(n)
    # no role rather than the word "guest", which says nothing - the billing
    # already covers that
    out[k] = {'n': n.title(), 'r': roles.get(k, ''), 't': tier[k]}
    # Guests of Honor are billed by their actual title, which outranks the tier
    if k in g.get('honors', {}):
        out[k]['h'] = g['honors'][k]

print()
for r in ['actor', 'author', 'artist', 'musician', 'costumer', 'creator', 'scientist']:
    who = [v['n'] for v in out.values() if v['r'] == r and v['t'] == 'spotlight'][:4]
    who2 = [v['n'] for v in out.values() if v['r'] == r and v['t'] == 'featured'][:3]
    print(f'  {r:10s} spotlight: {", ".join(who) or "-"}')
    print(f'  {"":10s} featured : {", ".join(who2) or "-"}')

json.dump(out, open(HERE / 'roles.json', 'w'))
print('\nwrote roles for', len(out), 'people')
