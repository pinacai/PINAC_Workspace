import { safeStorage } from "electron";
import { promises as fs } from "fs";
import path from "path";
import { app } from "electron";

export default class AuthManager {
  private static readonly TOKEN_FILE = "auth_token.enc";
  private static readonly tokenPath = path.join(
    app.getPath("userData"),
    AuthManager.TOKEN_FILE
  );

  /**
   * Saves an encrypted token to the file system
   * @param token The token to encrypt and save
   */
  static async saveToken(token: string): Promise<void> {
    try {
      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error("System encryption is not available");
      }

      const encrypted = safeStorage.encryptString(token);
      const buffer = Buffer.from(encrypted);

      await fs.writeFile(this.tokenPath, buffer);
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  }

  /**
   * Retrieves and decrypts the token from the file system
   * @returns The decrypted token or null if not found
   */
  static async getToken(): Promise<string | null> {
    try {
      const exists = await fs
        .access(this.tokenPath)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        return null;
      }

      const buffer = await fs.readFile(this.tokenPath);
      return safeStorage.decryptString(buffer);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Removes the token file from the file system
   */
  static async removeToken(): Promise<void> {
    try {
      const exists = await fs
        .access(this.tokenPath)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        await fs.unlink(this.tokenPath);
      }
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  }

  /**
   * Checks if a token exists
   * @returns boolean indicating if a token exists
   */
  static async hasToken(): Promise<boolean> {
    try {
      await fs.access(this.tokenPath);
      return true;
    } catch {
      return false;
    }
  }
}
