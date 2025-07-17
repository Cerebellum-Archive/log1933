import os
import pytesseract
from PIL import Image

# Set the directories
png_dir = 'png'  # Update directory name
text_dir = 'text_from_png'

# Get list of all png files
png_files = [f for f in os.listdir(png_dir) if f.lower().endswith('.png')]

# Ensure the text directory exists
if not os.path.exists(text_dir):
    os.makedirs(text_dir)

# Loop through each file
for file in png_files:
    # Define the path to the image file
    file_path = os.path.join(png_dir, file)
    
    # Open the image file
    try:
        image = Image.open(file_path)
    except IOError:
        print(f"Unable to open image file {file_path}. Check the file format.")
        continue

    # Use pytesseract to extract text directly from the PNG image
    text = pytesseract.image_to_string(image)
    
    # Create a .txt filename
    txt_file = os.path.join(text_dir, os.path.splitext(file)[0] + '.txt')
    
    # Write the text to a new file
    with open(txt_file, 'w') as f:
        f.write(text)

    print(f"Text extracted and saved to {txt_file}")