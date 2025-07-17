import os
import openai
from PIL import Image
import pytesseract

# Retrieve the OpenAI API key from an environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def enhance_text_with_gpt(text):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that enhances OCR text."},
                {"role": "user", "content": f"Please enhance the following OCR text:\n\n{text}"}
            ]
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error during OpenAI API call: {e}")
        return text  # Return original text if API call fails

# Example OCR with Tesseract
def ocr_image(image_path):
    img = Image.open(image_path)
    raw_text = pytesseract.image_to_string(img)
    enhanced_text = enhance_text_with_gpt(raw_text)
    return enhanced_text

# Process all images in a directory
def process_directory(directory_path, output_directory):
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for filename in os.listdir(directory_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.heic', '.tiff', '.bmp', '.pdf')):
            print(f"Processing file: {filename}")
            image_path = os.path.join(directory_path, filename)
            enhanced_text = ocr_image(image_path)
            
            # Save the enhanced text to a file
            output_file = os.path.join(output_directory, f"{os.path.splitext(filename)[0]}.txt")
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(enhanced_text)
            print(f"Text saved to: {output_file}")

# Example usage
directory_path = 'path_to_your_image_directory'
output_directory = 'path_to_your_output_directory'
process_directory(directory_path, output_directory)