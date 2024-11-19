import { safeStorage } from "electron";
import { promises as fs } from "fs";
import path from "path";
import { app } from "electron";

interface TokenStorage {
  [key: string]: string; // key is the identifier, value is the encrypted token
}

export default class AuthManager {
  private static readonly TOKENS_FILE = "auth_tokens.enc";
  private static readonly tokensPath = path.join(
    app.getPath("userData"),
    AuthManager.TOKENS_FILE
  );

  /**
   * Saves an encrypted token to the file system
   * @param token The token to encrypt and save
   * @param identifier A unique identifier for the token
   */
  static async saveToken(token: string, identifier: string): Promise<void> {
    try {
      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error("System encryption is not available");
      }

      const encrypted = safeStorage.encryptString(token);
      const tokens = await this.getAllTokens();
      tokens[identifier] = Buffer.from(encrypted).toString("base64");

      await fs.writeFile(this.tokensPath, JSON.stringify(tokens));
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  }

  /**
   * Retrieves and decrypts a specific token from the file system
   * @param identifier The identifier of the token to retrieve
   * @returns The decrypted token or null if not found
   */
  static async getToken(identifier: string): Promise<string | null> {
    try {
      const tokens = await this.getAllTokens();
      const encryptedToken = tokens[identifier];

      if (!encryptedToken) {
        return null;
      }

      const buffer = Buffer.from(encryptedToken, "base64");
      return safeStorage.decryptString(buffer);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Removes a specific token from the file system
   * @param identifier The identifier of the token to remove
   */
  static async removeToken(identifier: string): Promise<void> {
    try {
      const tokens = await this.getAllTokens();
      delete tokens[identifier];
      await fs.writeFile(this.tokensPath, JSON.stringify(tokens));
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  }

  /**
   * Checks if a specific token exists
   * @param identifier The identifier of the token to check
   * @returns boolean indicating if the token exists
   */
  static async hasToken(identifier: string): Promise<boolean> {
    const tokens = await this.getAllTokens();
    return identifier in tokens;
  }

  /**
   * Gets all stored token identifiers
   * @returns Array of token identifiers
   */
  static async getTokenIdentifiers(): Promise<string[]> {
    const tokens = await this.getAllTokens();
    return Object.keys(tokens);
  }

  /**
   * Removes all tokens from the file system
   */
  static async removeAllTokens(): Promise<void> {
    try {
      await fs.writeFile(this.tokensPath, JSON.stringify({}));
    } catch (error) {
      console.error("Error removing all tokens:", error);
      throw error;
    }
  }

  /**
   * Private helper method to get all tokens
   * @returns Object containing all tokens
   */
  private static async getAllTokens(): Promise<TokenStorage> {
    try {
      const exists = await fs
        .access(this.tokensPath)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        return {};
      }

      const data = await fs.readFile(this.tokensPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading tokens:", error);
      return {};
    }
  }
}
