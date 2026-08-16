import json
from pathlib import Path

BLOG_PATH = Path(r"d:\Antigravity Project\store-catalog\website\site\blog\blog.json")
CATALOG_PATH = Path(r"d:\Antigravity Project\store-catalog\website\site\data\catalog.json")

def enrich_blog_links():
    if not BLOG_PATH.exists():
        print("blog.json not found")
        return

    blog_data = json.load(open(BLOG_PATH, encoding="utf-8"))
    
    # Handle list vs dict structure
    posts = blog_data.get("posts", []) if isinstance(blog_data, dict) else blog_data

    link_maps = {
        "Skyworth": '<a href="brand.html?brand=Skyworth">Skyworth</a>',
        "Samsung": '<a href="brand.html?brand=Samsung">Samsung</a>',
        "Himstar": '<a href="brand.html?brand=Himstar">Himstar</a>',
        "Whirlpool": '<a href="brand.html?brand=Whirlpool">Whirlpool</a>',
        "AURA": '<a href="brand.html?brand=AURA">AURA</a>',
        "Panasonic": '<a href="brand.html?brand=Panasonic">Panasonic</a>',
        "Livpure": '<a href="brand.html?brand=Livpure">Livpure</a>',
        "Smart TV": '<a href="category.html?cat=Television">Smart TV</a>',
        "television": '<a href="category.html?cat=Television">television</a>',
        "refrigerator": '<a href="category.html?cat=Refrigerator">refrigerator</a>',
        "washing machine": '<a href="category.html?cat=Washing%20Machine">washing machine</a>',
        "air conditioner": '<a href="category.html?cat=Air%20Conditioner">air conditioner</a>',
        "air cooler": '<a href="category.html?cat=Air%20Cooler">air cooler</a>',
        "water purifier": '<a href="category.html?cat=Water%20Purifier">water purifier</a>',
        "exchange": '<a href="exchange.html">old appliance exchange</a>',
        "second-hand": '<a href="second-hand.html">second-hand clearance</a>',
        "EMI": '<a href="appliance-finder.html">0% EMI installment</a>',
    }

    updated_count = 0
    for post in posts:
        # Add related links section to each post if not already present
        slug = post.get("slug", "")
        category = post.get("category", "")

        sections = post.get("sections", [])
        has_nav_section = any("Shop related" in s.get("h", "") for s in sections)

        if not has_nav_section:
            related_items = [
                f'<a href="shop.html">Browse all 378+ appliances in shop &rarr;</a>',
                f'<a href="exchange.html">Exchange your old appliance for up to Rs. 8,000 cashback &rarr;</a>',
                f'<a href="appliance-finder.html">Calculate your 0% monthly EMI installment &rarr;</a>',
            ]
            if "tv" in slug or "television" in slug:
                related_items.insert(0, '<a href="category.html?cat=Television">View all 68+ LED & 4K UHD Smart TVs with official warranty</a>')
                related_items.insert(1, '<a href="brand.html?brand=Skyworth">Explore official Skyworth 32" to 65" Google TV models</a>')
            elif "refrigerator" in slug or "fridge" in slug:
                related_items.insert(0, '<a href="category.html?cat=Refrigerator">View 95+ single door, double door and side-by-side refrigerators</a>')
                related_items.insert(1, '<a href="brand.html?brand=Himstar">Shop Himstar inverter refrigerators with 10-year warranty</a>')
            elif "washing" in slug or "washer" in slug:
                related_items.insert(0, '<a href="category.html?cat=Washing%20Machine">Shop 50+ semi-auto, top-load and front-load washing machines</a>')
            elif "ac" in slug or "conditioner" in slug or "cooler" in slug:
                related_items.insert(0, '<a href="category.html?cat=Air%20Conditioner">Compare 1 Ton, 1.5 Ton and 2 Ton split inverter ACs</a>')

            sections.append({
                "h": "Shop related products & buying guides",
                "p": "Browse matching genuine appliances at Join Electronic Center (Samakhushi Chowk, Kathmandu) with free valley doorstep delivery, 0% EMI, and manufacturer warranty.",
                "list": related_items
            })
            updated_count += 1

    if isinstance(blog_data, dict):
        blog_data["posts"] = posts
        json.dump(blog_data, open(BLOG_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    else:
        json.dump(posts, open(BLOG_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    print(f"Enriched internal links across {len(posts)} blog posts ({updated_count} updated with internal equity lists).")

if __name__ == "__main__":
    enrich_blog_links()
