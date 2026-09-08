import { ILecturePhotoNote } from '../types';

export interface StorageSettings {
  provider: 'imgbb' | 'cloudinary' | 'local';
  imgbbApiKey?: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
}

const STORAGE_SETTINGS_KEY = 'focusflow_photo_notes_storage_settings';
export const DEFAULT_IMGBB_API_KEY = 'ed86c0670b1ddd59683dc5d95ecf7556';

export function getStorageSettings(): StorageSettings {
  try {
    const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.imgbbApiKey && parsed.provider === 'imgbb') {
        parsed.imgbbApiKey = DEFAULT_IMGBB_API_KEY;
      }
      return parsed;
    }
  } catch {}
  return {
    provider: 'imgbb',
    imgbbApiKey: DEFAULT_IMGBB_API_KEY,
  };
}

export function saveStorageSettings(settings: StorageSettings): void {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save photo notes storage settings:', e);
  }
}

/**
 * Client-side high-quality image compressor using HTML Canvas.
 * Shrinks 10MB+ phone camera photos down to ~100-300KB while keeping text crisp and sharp for handwritten math/notes.
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<{ dataUrl: string; sizeKB: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;

        // Maintain aspect ratio while bounding inside maxWidth/maxHeight
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        // Fill white background in case of transparent PNG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as crisp JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxBytes = Math.round((dataUrl.length - 22) * 3 / 4);
        const sizeKB = Math.round(approxBytes / 1024);

        resolve({
          dataUrl,
          sizeKB,
          width,
          height,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload to ImgBB using free API key
 */
export async function uploadToImgBB(base64DataUrl: string, apiKey: string): Promise<string> {
  const cleanBase64 = base64DataUrl.replace(/^data:image\/\w+;base64,/, '');
  const formData = new FormData();
  formData.append('image', cleanBase64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`ImgBB upload failed (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  if (json && json.data && json.data.url) {
    return json.data.url;
  }
  throw new Error('ImgBB did not return an image URL');
}

/**
 * Upload to Cloudinary using unsigned upload preset
 */
export async function uploadToCloudinary(
  base64DataUrl: string,
  cloudName: string,
  uploadPreset: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', base64DataUrl);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const json = await res.json();
  if (json && json.secure_url) {
    return json.secure_url;
  }
  throw new Error('Cloudinary did not return a secure URL');
}

/**
 * Main upload pipeline: compresses first, then uploads to cloud (if key exists) or saves compressed base64.
 */
export async function processAndUploadPhotoNote(
  file: File,
  videoId: string,
  title?: string
): Promise<ILecturePhotoNote> {
  // Step 1: Compress on client side
  const compressed = await compressImage(file, 1920, 1920, 0.85);

  const settings = getStorageSettings();
  let finalImageUrl = compressed.dataUrl;

  // Step 2: Try Cloud upload if configured
  if (settings.provider === 'imgbb' && settings.imgbbApiKey?.trim()) {
    try {
      finalImageUrl = await uploadToImgBB(compressed.dataUrl, settings.imgbbApiKey.trim());
    } catch (e) {
      console.warn('ImgBB upload error, falling back to local compressed data URL:', e);
    }
  } else if (
    settings.provider === 'cloudinary' &&
    settings.cloudinaryCloudName?.trim() &&
    settings.cloudinaryUploadPreset?.trim()
  ) {
    try {
      finalImageUrl = await uploadToCloudinary(
        compressed.dataUrl,
        settings.cloudinaryCloudName.trim(),
        settings.cloudinaryUploadPreset.trim()
      );
    } catch (e) {
      console.warn('Cloudinary upload error, falling back to local compressed data URL:', e);
    }
  }

  const noteId = `photo-${videoId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  return {
    id: noteId,
    videoId,
    imageUrl: finalImageUrl,
    title: title || file.name.replace(/\.[^/.]+$/, ''),
    createdAt: Date.now(),
    fileSize: `${compressed.sizeKB} KB`,
  };
}
