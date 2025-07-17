import os
import re
import img2pdf
from PIL import Image

# Set the directory containing the JPEG files
jpeg_dir = 'jpeg'

# Get a list of all JPEG files in the directory
jpeg_files = [f for f in os.listdir(jpeg_dir) if f.lower().endswith('.jpg') or f.lower().endswith('.jpeg')]

# Sort the JPEG files based on the numeric part of the filename
jpeg_files.sort(key=lambda f: int(re.search(r'(\d+)', f).group(1)))

# Print sorted file names for debugging
print("JPEG files to be processed:", jpeg_files)

# Test each file to ensure it opens correctly
for file in jpeg_files:
    img_path = os.path.join(jpeg_dir, file)
    print(f"Processing file: {img_path}")
    # try:
    #     img = Image.open(img_path)
    #     img.show()  # Open the image to check if it's loading correctly
    # except Exception as e:
    #     print(f"Error opening image {img_path}: {e}")

# Set the output PDF path
output_pdf_path = 'hiecai'

# Convert the sorted JPEG files to a PDF
try:
    with open(output_pdf_path, "wb") as f:
        f.write(img2pdf.convert([os.path.join(jpeg_dir, file) for file in jpeg_files]))
    print(f"PDF created successfully and saved as {output_pdf_path}")
except Exception as e:
    print(f"Error creating PDF: {e}")