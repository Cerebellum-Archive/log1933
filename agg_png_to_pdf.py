import os
import re
import img2pdf
from PIL import Image

# Set the directory containing the PNG files
png_dir = 'png'

# Get a list of all PNG files in the directory
png_files = [f for f in os.listdir(png_dir) if f.lower().endswith('.png')]

# Sort the PNG files based on the numeric part of the filename
png_files.sort(key=lambda f: int(re.search(r'(\d+)', f).group(1)))

# Print sorted file names for debugging
print("PNG files to be processed:", png_files)

# Convert each PNG file to RGB and ensure it's correctly processed
processed_files = []
for file in png_files:
    img_path = os.path.join(png_dir, file)
    print(f"Processing file: {img_path}")
    try:
        img = Image.open(img_path)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGB')
            # Save the converted image temporarily
            converted_path = os.path.join(png_dir, f"converted_{file}")
            img.save(converted_path)
            processed_files.append(converted_path)
        else:
            processed_files.append(img_path)
    except Exception as e:
        print(f"Error processing image {img_path}: {e}")

# Set the output PDF path
output_pdf_path = 'PNG_Aggregated.pdf'

# Convert the processed PNG files to a PDF
try:
    with open(output_pdf_path, "wb") as f:
        f.write(img2pdf.convert(processed_files))
    print(f"PDF created successfully and saved as {output_pdf_path}")
except Exception as e:
    print(f"Error creating PDF: {e}")

# Optionally, clean up the temporary converted files
for file in processed_files:
    if "converted_" in file:
        os.remove(file)