#!/usr/bin/env python3
"""Build the iPhone/PC web version (index.html) from the Android app source (../fmn/index.html).
Usage: python3 tools/apk2web.py /path/to/fmn/index.html index.html"""
import re,sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
head='<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon-192.png">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="apple-mobile-web-app-title" content="FMN">\n'
# Leaflet is shipped in lib/ (works offline from the first start); CDN only as a fallback
s,n1=re.subn(r'(<link rel="stylesheet" href="lib/leaflet\.css"[^>]*>)\n',lambda m:m.group(1)+'\n'+head,s,count=1)
assert n1==1,'css link not found'
sw="<script>if('serviceWorker' in navigator&&location.protocol==='https:'&&!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()))navigator.serviceWorker.register('sw.js').catch(()=>{});</script>\n"
i=s.rindex('</body>'); s=s[:i]+sw+s[i:]
open(dst,'w',encoding='utf-8').write(s)
print('ok',len(s))
