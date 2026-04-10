import os
import requests
import zipfile

def download_file(url, dest_path):
    print(f"Downloading {url} to {dest_path}...")
    response = requests.get(url, stream=True)
    with open(dest_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    print("Download complete.")

def extract_zip(zip_path, extract_to):
    print(f"Extracting {zip_path} to {extract_to}...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    print("Extraction complete.")

if __name__ == "__main__":
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Note: RAVDESS and IEMOCAP require manual agreements/downloads sometimes.
    # Below is a sample placeholder URL. You should replace this with the actual links
    # or manually place datasets into the /datasets/ directory.
    print("Data Pipeline Initialization")
    print(f"Please place IEMOCAP and RAVDESS raw datasets into: {DATA_DIR}")
    print("You can manually run pre-processing from here once datasets are acquired.")
