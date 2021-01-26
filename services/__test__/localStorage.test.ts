import { LocalStorageService } from "../localStorage";

const testKey = "testKey";
const testValue = "testValue";
const testError = Error("testError");

const getItem = jest.fn();
const setItem = jest.fn();
const removeItem = jest.fn();

describe("localStorage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem,
        setItem,
        removeItem,
      },
      writable: true,
    });
  });

  describe("set", () => {
    it("sets value", () => {
      const localStorageService = new LocalStorageService();
      localStorageService.set(testKey, testValue);

      expect(setItem).toBeCalledTimes(1);
      expect(setItem).toBeCalledWith(testKey, JSON.stringify(testValue));
    });

    it("swallows thrown error", () => {
      setItem.mockImplementation(() => {
        throw testError;
      });

      const localStorageService = new LocalStorageService(() => {});
      localStorageService.set(testKey, testValue);

      expect(setItem).toBeCalledTimes(1);
      expect(setItem).toBeCalledWith(testKey, JSON.stringify(testValue));
      expect(setItem).toThrowError(testError);
    });
  });

  describe("get", () => {
    it("gets value", () => {
      getItem.mockImplementation(() => JSON.stringify(testValue));

      const localStorageService = new LocalStorageService();
      const value = localStorageService.get(testKey);

      expect(getItem).toBeCalledTimes(1);
      expect(getItem).toBeCalledWith(testKey);
      expect(value).toBe(testValue);
    });

    it("gets default value", () => {
      const testDefaultValue = "testDefaultValue";
      getItem.mockImplementation(() => null);

      const localStorage = new LocalStorageService();
      const value = localStorage.get(testKey, testDefaultValue);

      expect(getItem).toBeCalledTimes(1);
      expect(getItem).toBeCalledWith(testKey);
      expect(value).toBe(testDefaultValue);
    });

    it("swallows thrown error", () => {
      getItem.mockImplementation(() => JSON.stringify(testValue));

      const spyJsonParse = jest.spyOn(JSON, "parse").mockImplementation(() => {
        throw testError;
      });

      const localStorageService = new LocalStorageService(() => {});
      const value = localStorageService.get(testKey);

      expect(getItem).toBeCalledTimes(1);
      expect(getItem).toBeCalledWith(testKey);
      expect(spyJsonParse).toThrow(testError);
      expect(value).toBe(undefined);
    });
  });

  describe("remove", () => {
    it("removes value", () => {
      const localStorageService = new LocalStorageService();
      localStorageService.remove(testKey);

      expect(removeItem).toBeCalledTimes(1);
      expect(removeItem).toBeCalledWith(testKey);
    });
  });
});
