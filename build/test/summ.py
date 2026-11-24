import json,sys
w=0
for line in open(sys.argv[1]):
    if not line.startswith('{'):print(line[:300]);continue
    j=line[:line.rfind('}')+1];r=json.loads(j)
    if 'err' in r:print('ERR',r['err'][:300]);continue
    w+=r['won']
    print(f"{r['id']:11} {'WIN ' if r['won'] else 'LOSS'} {r['wave']:2}/{r['total']:2} lives {r['lives']:3}/{r['maxLives']} tw={r['towers']:2} lost={r['lost']:3} leak={r['leaked']:3} {r['secs']:5}s boss={r['boss']} | {r['dmg'][:90]}")
print('wins',w)
