const codeKey = "userCode";
const codeVerifierKey = "codeVerifier";
const userTokenKey = "userTokenKey";
const expiryTimeKey = "expiryTime";
const userRefreshTokenKey = "userRefreshToken";
const lastURLKey = "lastURL";
const clientTokenKey = "clientToken";
const clientSecretKey = "clientSecret";
const playlistNameKey = "playlistName";
const playlistIDKey = "playlistIDKey";
const isLoggingKey = "isLoggingKey";
const debugKey = "debug";
const redirectURIKey = "redirectURI";

/**
 * Returns a value locally stored, if it has previously
 * been stored, null otherwise.
 * @param key: The name of the value to get.
 * @returns The value if it exists, null otherwise.
 */
const genericGetter = async (key: string): Promise<any | null> => {
    // try to get the object containing the value
    const result = await browser.storage.local.get(key);

    // if the object is empty, no value has been saved yet
    // so return null
    if (Object.keys(result).length === 0) return null;
    return result[key];
};

/**
 * Returns a valued locally stored, if it has previously
 * been stored, null otherwise.
 * @param value: The name of the value to get.
 * @returns The value if it exists, null otherwise.
 */
const genericSetter = async (key: string, value: any): Promise<void> => {
    // sets the value bound to the key in the local storage
    browser.storage.local.set({ [key]: value });
};

/**
 * Returns the code stored in the local storage corresponding
 * to the code retrieved from requesting an authorization
 * to modify the user's Spotify's account.
 * @returns The code if it exists, null otherwise.
 */
export const getCode = async (): Promise<string | null> => {
    return genericGetter(codeKey);
};

/**
 * Returns the code verifier stored in the local storage
 * corresponding to the code verifier supplied when requesting an
 * authorization to modify the user's Spotify's account.
 * @returns The code verifier if it exists, null otherwise.
 */
export const getCodeVerifier = async (): Promise<string | null> => {
    return genericGetter(codeVerifierKey);
};

/**
 * Returns the user's token allowing us to modify their
 * Spotify's account.
 * @returns The user's token if it exists, null otherwise.
 */
export const getUserToken = async (): Promise<string | null> => {
    return genericGetter(userTokenKey);
};

/**
 * Returns the time at which the last token will expire.
 * @returns The expiry time if it exists, null otherwise.
 */
export const getExpiryTime = async (): Promise<number | null> => {
    return genericGetter(expiryTimeKey);
};

/**
 * Returns the user's refresh token.
 * @returns The user's token if it exists, null otherwise.
 */
export const getUserRefreshToken = async (): Promise<string | null> => {
    return genericGetter(userRefreshTokenKey);
};

/**
 * Returns the user's last URL.
 * @returns The user's last url if it exists, null otherwise.
 */
export const getLastURL = async (): Promise<string | null> => {
    return genericGetter(lastURLKey);
};

/**
 * Returns the client's token.
 * @returns The client's token if it exists, null otherwise.
 */
export const getClientToken = async (): Promise<string | null> => {
    return genericGetter(clientTokenKey);
};

/**
 * Returns the client's secret token.
 * @returns The client's secret token if it exists, null otherwise.
 */
export const getSecretToken = async (): Promise<string | null> => {
    return genericGetter(clientSecretKey);
};

/**
 * Returns the playlist to modify name..
 * @returns The playlist to modify name if it exists, null otherwise.
 */
export const getPlaylistName = async (): Promise<string | null> => {
    return genericGetter(playlistNameKey);
};

/**
 * Returns the playlist to modify's ID.
 * @returns The playlist's ID if it exists, null otherwise.
 */
export const getPlaylistID = async (): Promise<string | null> => {
    return genericGetter(playlistIDKey);
};

/**
 * Returns whether the user is logging in.
 * @returns The logging status if it exists, null otherwise.
 */
export const getLoggingStatus = async (): Promise<boolean | null> => {
    return genericGetter(isLoggingKey);
};

/**
 * Returns whether debug mode is on.
 * @returns Whether debug mode is on (might be null).
 */
export const getDebug = async (): Promise<boolean | null> => {
    return genericGetter(debugKey);
};

/**
 * Returns the redirect URI to use for the Spotify's
 * authentification (PKCE).
 * @returns The redirect URI if it is set, null otherwise.
 */
export const getRedirectURI = async (): Promise<string | null> => {
    return genericGetter(redirectURIKey);
};

/**
 * Stores the code in the local storage corresponding
 * to the code retrieved from requesting an authorization
 * to modify the user's Spotify's account.
 * @param code: The code to store.
 */
export const setCode = async (code: string): Promise<void> => {
    genericSetter(codeKey, code);
};

/**
 * Stores the code verifier in the local storage
 * corresponding to the code verifier supplied when requesting an
 * authorization to modify the user's Spotify's account.
 * @param codeVerifier: The code verifier to store.
 */
export const setCodeVerifier = async (codeVerifier: string): Promise<void> => {
    genericSetter(codeVerifierKey, codeVerifier);
};

/**
 * Stores the user's token allowing us to modify their
 * Spotify's account.
 * @param userToken: The code to store.
 */
export const setUserToken = async (userToken: string): Promise<void> => {
    genericSetter(userTokenKey, userToken);
};

/**
 * Sets the time at which the last token will expire.
 * @param expiryTime: The expiry time to store.
 */
export const setExpiryTime = async (expiryTime: number): Promise<void> => {
    genericSetter(expiryTimeKey, expiryTime);
};

/**
 * Stores the user's refresh token.
 * @param userRefreshToken: The user's refresh token to store.
 */
export const setUserRefreshToken = async (
    userRefreshToken: string
): Promise<void> => {
    genericSetter(userRefreshTokenKey, userRefreshToken);
};

/**
 * Stores the user's last URL.
 * @param lastURL: The user's last url to store.
 */
export const setLastURL = async (lastURL: string): Promise<void> => {
    return genericSetter(lastURLKey, lastURL);
};

/**
 * Stores the client's token.
 * @param token: The client's token to store.
 */
export const setClientToken = async (token: string): Promise<void> => {
    return genericSetter(clientTokenKey, token);
};

/**
 * Stores the client's secret token.
 * @param token: The client's secret token to store.
 */
export const setSecretToken = async (token: string): Promise<void> => {
    return genericSetter(clientSecretKey, token);
};

/**
 * Stores the playlist to modify name..
 * @param name: The playlist to modify name's to store.
 */
export const setPlaylistName = async (name: string): Promise<void> => {
    return genericSetter(playlistNameKey, name);
};

/**
 * Stores the playlist to modify's ID.
 * @param playlistID: The playlist's ID to store.
 */
export const setPlaylistID = async (playlistID: string): Promise<void> => {
    return genericSetter(playlistIDKey, playlistID);
};

/**
 * Stores whether the user is logging in.
 * @param loggingStatus: The logging status to store.
 */
export const setLoggingStatus = async (
    loggingStatus: boolean
): Promise<void> => {
    return genericSetter(isLoggingKey, loggingStatus);
};

/**
 * Stores whether debug mode is on.
 * @var state: The state of debug mode.
 */
export const setDebug = async (mode: boolean): Promise<void> => {
    return genericSetter(debugKey, mode);
};

/**
 * Returns the redirect URI to use for the Spotify's
 * authentification (PKCE).
 * @returns The redirect URI if it is set, null otherwise.
 */
export const setRedirectURI = async (redirectURI: string): Promise<void> => {
    return genericSetter(redirectURIKey, redirectURI);
};

/**
 * Resets all user related data.
 */
export const resetData = async (): Promise<void> => {
    await setCode(null);
    await setCodeVerifier(null);
    await setUserToken(null);
    await setExpiryTime(null);
    await setUserRefreshToken(null);
    await setPlaylistID(null);
    await setLoggingStatus(null);
};

/**
 * Resets user's preferences.
 */
export const resetPreferences = async (): Promise<void> => {
    await setClientToken(null);
    await setSecretToken(null);
    await setPlaylistName(null);
    await setRedirectURI(null);
};

/**
 * Checks if all the user's preferences are set.
 */
export const arePreferencesSet = async (): Promise<boolean> => {
    if ((await getClientToken()) === null) return false;
    if ((await getSecretToken()) === null) return false;
    if ((await getPlaylistName()) === null) return false;
    if ((await getRedirectURI()) === null) return false;
    return true;
};
