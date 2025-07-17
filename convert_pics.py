import os
import pytesseract
from PIL import Image

# Set the directories
jpeg_dir = 'jpeg'
text_dir = 'text_from_jpeg'

# Get list of all jpeg files
jpeg_files = [f for f in os.listdir(jpeg_dir) if f.endswith('.jpg')]
print(jpeg_files)
# Loop through each file
for file in jpeg_files:
    # Define the path to the image file
    file_path = os.path.join(jpeg_dir, file)
    
    # Open and convert the image file
    try:
        image = Image.open(file_path)
        image = image.convert('RGB')
        image.save("converted_image.png", "PNG")
    except IOError:
        print(f"Unable to open image file {file_path}. Check the file format.")
        continue

    # Use pytesseract to extract text
    text = pytesseract.image_to_string(Image.open("converted_image.png"))
    
    # Create a .txt filename
    txt_file = os.path.join(text_dir, os.path.splitext(file)[0] + '.txt')
    
    # Write the text to a new file
    with open(txt_file, 'w') as f:
        f.write(text)