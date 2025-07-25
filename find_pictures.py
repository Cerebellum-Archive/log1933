
import json
from collections import defaultdict

# Load the JSON data (assuming it's saved in 'combined_logbook.json')
with open('combined_logbook.json', 'r') as f:
    data = json.load(f)

# Group entries by location
groups = defaultdict(list)
for entry in data['entries']:
    loc = entry.get('location') or 'Unknown'
    groups[loc].append(entry)

# Generate HTML with the described structure
html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Picture Archive - Original Highlights Page</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <!-- Simple CSS for basic carousel effect (no JS) -->
    <style>
        .quote-carousel { overflow: hidden; position: relative; }
        .quote-slides { display: flex; transition: transform 0.5s ease; }
        .quote-slide { flex: 0 0 100%; }
        /* For modals, we'd need JS; here using details/summary for popup-like */
    </style>
</head>
<body class="bg-yellow-50 font-serif">  <!-- Vintage paper effect -->
    <div class="max-w-6xl mx-auto py-8 space-y-16">
"""

for loc, entries in groups.items():
    dates = ', '.join(set(e.get('date_entry') or 'Unknown' for e in entries))
    images = list(set(img for e in entries for img in e.get('source_entries', [])))
    quotes = [e.get('content', '')[:200] + '...' for e in entries if e.get('content')]
    
    html += f"""
        <article class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 class="text-3xl lg:text-4xl font-bold mb-2">{loc}</h2>
            <p class="text-lg text-gray-600 mb-4">{dates}</p>
            
            <!-- Quote Carousel (simple multi-quote display; for full carousel, add JS) -->
            <div class="quote-carousel mb-6">
                <div class="quote-slides">
    """
    for quote in quotes:
        html += f'<blockquote class="quote-slide text-lg lg:text-xl italic text-gray-800 p-4">"{quote}"</blockquote>'
    
    html += """
                </div>
            </div>
            
            <!-- Historical Images Grid -->
            <div class="grid lg:grid-cols-5 gap-4 mb-6">
    """
    for img in images:
        html += f'<img src="{img}" alt="Historical image from {loc}" class="w-full h-auto rounded shadow" loading="lazy">'
    
    html += """
            </div>
            
            <!-- Modal-like for detailed entries (using details/summary) -->
            <details class="mt-4">
                <summary class="text-base font-semibold cursor-pointer">View Full Journal Details</summary>
                <div class="text-base mt-2 prose">
    """
    for e in entries:
        full_content = e.get('content', 'No content available.')
        html += f'<p>{full_content[:500]}...</p><hr>'
    
    html += """
                </div>
            </details>
        </article>
    """

html += """
    </div>
    <footer class="text-center text-sm text-gray-500 mt-8">
        Archived on: July 25, 2025
    </footer>
</body>
</html>
"""

# Write to file
with open('pic_archive.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Picture archive HTML generated as 'pic_archive.html'. Place image files in the same directory as the HTML for them to display.")
