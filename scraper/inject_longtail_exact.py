import json
import os

SITE_DIR = r"d:\Antigravity Project\store-catalog\website\site"
BLOG_JSON = os.path.join(SITE_DIR, "blog", "blog.json")

with open(BLOG_JSON, encoding="utf-8") as f:
    blogs = json.load(f)

# Ensure exact phrases in blog posts
phrase_map = {
    "tv-price-in-nepal-2026": [
        "Android TV price Nepal starts from Rs 24,500 with official Google TV interface.",
        "Rechargeable TV price Nepal and low wattage inverter-friendly TVs available for power-outage protection.",
        "Join Electronic Center is the leading Electronics shop Samakhusi Chowk, Tokha Road Kathmandu."
    ],
    "refrigerator-price-nepal-2026": [
        "190L fridge price Nepal starts from Rs 22,900 for Himstar and Whirlpool direct-cool models.",
        "220L fridge price Nepal ranges from Rs 32,500 to Rs 48,000 for Samsung and Whirlpool frost-free refrigerators.",
        "Best fridge under Rs 50,000 Nepal includes Whirlpool 263L Triple Door and Samsung 246L Inverter."
    ],
    "washing-machine-price-nepal-2026": [
        "7kg washing machine price Nepal starts from Rs 21,500 for semi-automatic and Rs 36,000 for fully automatic.",
        "8kg washing machine price Nepal starts from Rs 42,500 with steam allergy sanitization.",
        "Washing machine for load shedding Nepal features low starting voltage and auto-restart memory cycle.",
        "Best washing machine under Rs 40,000 Nepal includes Skyworth 7.5kg top-load and Videocon semi-automatic."
    ]
}

for b in blogs:
    slug = b.get("slug")
    if slug in phrase_map:
        additions = "\n\n### Extended Buyer Pricing & FAQ\n" + "\n".join(f"- **{p.split(' ')[0]}**: {p}" for p in phrase_map[slug])
        b["content"] = b.get("content", "") + additions

with open(BLOG_JSON, "w", encoding="utf-8") as f:
    json.dump(blogs, f, indent=2, ensure_ascii=False)

print("Injected exact long-tail phrases into blog posts.")
