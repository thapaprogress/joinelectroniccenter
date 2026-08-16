import re, pathlib

SITE = pathlib.Path(r"D:\Antigravity Project\store-catalog\website\site")

GA_ID = "G-JYNYWLHKZJ"
GSC_TOKEN = "eN_w_K_cmJ3DwzAIVwAXQ4dtziGlorjbp03BR3TeAYI"
BING_TOKEN = "132FD1EBFB4DC860368794F461320DB9"

BLOCK = f"""<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', '{GA_ID}');
</script>
<meta name="google-site-verification" content="{GSC_TOKEN}">
<meta name="msvalidate.01" content="{BING_TOKEN}">
</head>"""

count = 0
for f in sorted(SITE.glob("*.html")):
    s = f.read_text(encoding="utf-8")
    
    # Remove older tags
    s = re.sub(r"<!--\s*Analytics.*?-->.*?gtag\('config'.*?</script>", "", s, flags=re.DOTALL)
    s = re.sub(r"<!-- Google tag \(gtag\.js\).*?</script>", "", s, flags=re.DOTALL)
    s = re.sub(r"<meta name=\"google-site-verification\" content=\"[^\"]*\">", "", s)
    s = re.sub(r"<meta name=\"msvalidate\.01\" content=\"[^\"]*\">", "", s)
    s = re.sub(r"<script async src=\"https://www.googletagmanager.com/gtag/js\?id=[^\"]+\"></script>\s*<script>.*?</script>", "", s, flags=re.DOTALL)
    
    if "</head>" in s:
        s = s.replace("</head>", BLOCK, 1)
        f.write_text(s, encoding="utf-8")
        count += 1

print(f"Injected GA4 ({GA_ID}) + GSC ({GSC_TOKEN}) + Bing ({BING_TOKEN}) into {count} pages.")