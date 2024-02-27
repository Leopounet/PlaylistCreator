export const generateRandomString = (length: number): string => {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

export const sha256 = async (plainText: string): Promise<ArrayBuffer> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    return window.crypto.subtle.digest("SHA-256", data);
};

export const base64encode = (input: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
};

export const getChallenge = async (codeVerifier: string): Promise<string> => {
    const result = await sha256(codeVerifier);
    return base64encode(result);
};

export const makeQuery = (object: Object): string => {
    const esc = encodeURIComponent;
    const query = Object.keys(object)
        .map((k) => `${esc(k)}=${esc(object[k])}`)
        .join("&");
    return query;
};

export const time = (): number => {
    return Math.floor(new Date().getTime() / 1000);
};

export const existKeys = (object: Object, keys: Array<string>): boolean => {
    for (const key of keys) {
        if (!(key in object)) return false;
    }
    return true;
};

export const urlify = (s: string): string => {
    const toRemove = ["'", "amp;", ",", '"', "#"];
    for (const element of toRemove) {
        s = s.replace(element, "");
    }
    return s;
};

export const isSpotify = (): boolean => {
    return window.location.href.startsWith("https://accounts.spotify.com/");
};

const invalidClientURL = "<body>INVALID_CLIENT: Invalid client</body>";

export const isInvalidClient = (): boolean => {
    return document.body.outerHTML === invalidClientURL;
};
