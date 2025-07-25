# Background Image Setup Instructions

## Aviation Sketch Background Image

The homepage has been updated to use the beautiful vintage aviation sketch as a background image.

### Required Action

**Save the aviation sketch image as:**
```
website/public/images/backgrounds/aviation-sketch.png
```

### Steps:
1. Save the uploaded aviation sketch image to your computer
2. Rename it to: `aviation-sketch.png`
3. Place it in the directory: `website/public/images/backgrounds/`
4. The image should be high resolution (at least 1920x1080) for best quality

### Current Implementation

The homepage now includes:

**Hero Section Background:**
- Aviation sketch at 20% opacity
- Sepia filter with warm brown tones to match vintage theme
- Gradient overlay for better text readability
- Vintage paper texture overlay for authentic feel

**Featured Quote Section:**
- Subtle aviation sketch at 5% opacity
- Creates thematic continuity throughout the page
- Maintains readability while adding visual interest

### Image Styling

The aviation sketch is styled with:
- **Sepia filter**: `sepia(100%) hue-rotate(25deg) saturate(0.8)`
- **Low opacity**: 20% for hero, 5% for quote section
- **Object-fit cover**: Ensures proper scaling across screen sizes
- **Warm gradient overlays**: Maintains vintage aesthetic

### Alternative Options

If the current opacity is too strong/weak, you can adjust:

**For stronger background:**
- Change `opacity-20` to `opacity-30`
- Change `opacity-5` to `opacity-10`

**For subtler background:**
- Change `opacity-20` to `opacity-15`
- Change `opacity-5` to `opacity-3`

### Quality Requirements

- **Format**: PNG (for sketches with transparency support)
- **Resolution**: Minimum 1920x1080, preferably 2560x1440
- **File size**: Optimize to under 1MB for web performance (PNG can be larger than JPG)
- **Color**: The sepia filter will automatically adjust colors to match the vintage theme

### Perfect Match

This aviation sketch is perfect because:
- **Historical accuracy**: Matches the 1930s era of Ernest's journey
- **Thematic relevance**: Aviation became Ernest's life passion after this trip
- **Artistic style**: Hand-drawn sketch aesthetic complements the vintage design
- **Visual hierarchy**: Subtle enough to not interfere with text readability
- **Emotional connection**: Evokes the romance of early aviation that Ernest would later write about

The sketch beautifully foreshadows Ernest's future career in aviation while maintaining the authentic 1930s atmosphere of the website. 