import os
import pyheif
from PIL import Image
import img2pdf
import re

# Set the directory containing the HEIC files
heic_dir = 'heic'

# Directory to save the converted PNG files
converted_dir = os.path.join(heic_dir, 'converted_images')
os.makedirs(converted_dir, exist_ok=True)

# Get a list of all HEIC files in the directory
heic_files = [f for f in os.listdir(heic_dir) if f.lower().endswith('.heic')]

# Sort the HEIC files based on the numeric part of the filename
heic_files.sort(key=lambda f: int(re.search(r'(\d+)', f).group(1)))

# Convert HEIC to PNG and store paths to the converted images
converted_files = []
for file in heic_files:
    heic_path = os.path.join(heic_dir, file)
    print(f"Processing file: {heic_path}")
    try:
        heif_file = pyheif.read(heic_path)
        image = Image.frombytes(
            heif_file.mode,
            heif_file.size,
            heif_file.data,
            "raw",
            heif_file.mode,
            heif_file.stride,
        )
        # Convert to RGB to ensure compatibility
        if image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info):
            image = image.convert('RGB')
        
        # Save as PNG or JPEG
        converted_file = os.path.join(converted_dir, os.path.splitext(file)[0] + '.png')
        image.save(converted_file, "PNG")
        converted_files.append(converted_file)
    except Exception as e:
        print(f"Error processing file {heic_path}: {e}")

# Set the output PDF path
output_pdf_path = 'EKG_1933_v4.pdf'

# Convert the processed PNG files to a PDF
try:
    with open(output_pdf_path, "wb") as f:
        f.write(img2pdf.convert(converted_files))
    print(f"PDF created successfully and saved as {output_pdf_path}")
except Exception as e:
    print(f"Error creating PDF: {e}")

# Clean up: Optionally remove the converted images if not needed
for file in converted_files:
    os.remove(file)