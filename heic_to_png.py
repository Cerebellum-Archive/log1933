import os
import pyheif
from PIL import Image

def convert_heic_to_png(heic_file_path, png_file_path):
    # Read the HEIC file
    heif_file = pyheif.read(heic_file_path)
    
    # Convert to PIL Image
    image = Image.frombytes(
        heif_file.mode,
        heif_file.size,
        heif_file.data,
        "raw",
        heif_file.mode,
        heif_file.stride,
    )
    
    # Save as PNG
    image.save(png_file_path, format="PNG")
    print(f"Converted {heic_file_path} to {png_file_path}")

def batch_convert_heic_to_png(subdir_1, subdir_2):
    # Ensure the output directory exists
    if not os.path.exists(subdir_2):
        os.makedirs(subdir_2)

    # Iterate through all files in subdir_1
    for root, dirs, files in os.walk(subdir_1):
        for file in files:
            if file.lower().endswith('.heic'):
                heic_file_path = os.path.join(root, file)
                png_file_name = os.path.splitext(file)[0] + '.png'
                png_file_path = os.path.join(subdir_2, png_file_name)
                
                # Convert and save the image
                convert_heic_to_png(heic_file_path, png_file_path)

# Example usage
subdir_1 = 'heic'
subdir_2 = 'png'
batch_convert_heic_to_png(subdir_1, subdir_2)