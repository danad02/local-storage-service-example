import { createContext } from "react";

export class LocalStorageService {
  constructor(
    private onErrorInternal: (error: Error) => void = (error) => {
      throw error;
    }
  ) {}

  /**
   * Get item from local storage.
   *
   * @param key - key of the item in local storage
   * @param defaultValue - returned if the item is not found in local storage
   * @return - value of the item (the value will be parsed using JSON.parse) or default value
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    let value: T | undefined = defaultValue;
    const item = localStorage.getItem(key);

    if (item !== null) {
      try {
        value = JSON.parse(item);
      } catch (error) {
        this.onErrorInternal(error);
      }
    }

    return value;
  }

  /**
   * Set item to local storage. Do observe that any metadata will be removed.
   * When retrieving data, you get an object with the key-value pairs, so any object with behaviour needs to be rebuilt.
   *
   * @param key - key of the item in local storage
   * @param value - value of item to be set (the value will be stringified using JSON.stringify)
   */
  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      this.onErrorInternal(error);
    }
  }

  /**
   * Remove item from local storage.
   *
   * @param key - key of the item in local storage
   */
  remove(key: string) {
    localStorage.removeItem(key);
  }
}

export const LocalStorageContext = createContext<LocalStorageService>(
  new LocalStorageService()
);
