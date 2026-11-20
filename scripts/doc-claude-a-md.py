import json, sys, xml.etree.ElementTree as ET
t = open(sys.argv[1]).read()
d = json.loads(t[t.find('{'):t.rfind('}') + 1])
raiz = ET.fromstring(d['data']['xml'])

def linea(el):
    out = ''
    for c in el:
        tag = c.tag
        if tag == 'text':
            txt = ''.join(c.itertext())
            fmt = [x.tag for x in c]
            link = c.find('link')
            if link is not None and link.get('href'):
                txt = f"[{txt}]({link.get('href')})"
            if c.find('bold') is not None or (link is not None and link.find('bold') is not None):
                txt = f"**{txt}**" if txt.strip() else txt
            if c.find('code') is not None:
                txt = f"`{txt}`"
            out += txt
        elif tag == 'date':
            out += c.get('value', '')
        elif tag == 'mention':
            out += c.get('name', '')
        elif tag == 'paragraph':
            out += linea(c)
    return out.replace('****', '')

def bloque(el, nivel=0):
    tag = el.tag
    if tag == 'paragraph':
        h = el.get('heading')
        txt = linea(el)
        return ('#' * int(h) + ' ' + txt if h else txt) + '\n\n'
    if tag == 'list':
        res = ''
        for n, li in enumerate(el.findall('listItem'), 1):
            marca = f'{n}.' if el.get('kind') == 'ordered' else '-'
            partes = list(li)
            primera = linea(partes[0]) if partes and partes[0].tag == 'paragraph' else ''
            res += '    ' * nivel + f'{marca} {primera}\n'
            for p in partes[1:]:
                if p.tag == 'list':
                    res += bloque(p, nivel + 1)
                else:
                    res += '    ' * (nivel + 1) + linea(p) + '\n'
        return res + ('\n' if nivel == 0 else '')
    if tag == 'table':
        filas = []
        for r in el.findall('row'):
            filas.append([' '.join(linea(p) for p in cell if p.tag == 'paragraph').replace('|', '/') for cell in r.findall('cell')])
        if not filas:
            return ''
        res = '| ' + ' | '.join(filas[0]) + ' |\n| ' + ' | '.join('---' for _ in filas[0]) + ' |\n'
        for f in filas[1:]:
            res += '| ' + ' | '.join(f) + ' |\n'
        return res + '\n'
    return ''

print(''.join(bloque(b) for b in raiz).strip())
