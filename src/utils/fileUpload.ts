import fs from 'fs';
import path from 'path';

/**
 * Ensure upload directory exists
 * @param folder - Relative path to folder from public/uploads
 */
export function ensureUploadDir(folder: string): void {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

/**
 * Delete a file from uploads
 * @param filePath - Relative path to file from public/uploads
 */
export function deleteUploadFile(filePath: string): boolean {
  const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error deleting file:', err);
    return false;
  }
}

/**
 * Get file size in bytes
 * @param filePath - Relative path to file from public/uploads
 */
export function getFileSize(filePath: string): number | null {
  const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath);
  
  try {
    const stats = fs.statSync(fullPath);
    return stats.size;
  } catch (err) {
    console.error('Error getting file size:', err);
    return null;
  }
}
