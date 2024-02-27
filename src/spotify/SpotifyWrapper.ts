import { PlaylistItem, Track } from "../common/Interfaces";
import { SongInformation } from "./SongInformation";
import {
    getCodeVerifier,
    getLastURL,
    setCodeVerifier,
    setExpiryTime,
    setUserRefreshToken,
    setUserToken,
    setLastURL,
    getUserToken,
    getUserRefreshToken,
    getExpiryTime,
    getPlaylistID,
    setCode,
    setPlaylistID,
    getLoggingStatus,
    setLoggingStatus,
    getClientToken,
    getSecretToken,
    getPlaylistName,
    resetPreferences,
    getRedirectURI,
} from "../common/Storage";
import {
    generateRandomString,
    getChallenge,
    time,
    existKeys,
    isSpotify,
    isInvalidClient,
} from "../common/Utils";

/**
 * Some macros for better code readability.
 */
const authURL = new URL("https://accounts.spotify.com/authorize");
const scope = [
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
].join(" ");

/**
 * Creates a new instance of a Spotify
 * Wrapper that is used to send requests to
 * Spotify easily.
 */
export class SpotifyWrapper {
    /**
     * Creates a new SpotifyWrapper.
     */
    constructor() {}

    /**
     * Returns the ID of the given song if it found, null otherwise.
     * @param info: The SongInformation object to use to
     * retrieve data from the Spotify's API.
     */
    getSongId = async (info: SongInformation): Promise<string | null> => {
        // get the client's token
        const secretToken = await this.getToken();

        // if it was not retrieved, abort
        if (secretToken === null) return null;

        // create the query for the artist and song wanted
        const query = encodeURIComponent(
            `track:${info.name} artist:${info.artist}`
        );

        // send the request to the Spotify's API
        const result = await fetch(
            `https://api.spotify.com/v1/search?q=${query}&type=track`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${secretToken}`,
                },
            }
        );

        // retrieve the data and return the first value
        const data = await result.json();

        // make sure the expected fields exist
        if (!existKeys(data, ["tracks"])) return null;
        if (!existKeys(data.tracks, ["items"])) return null;
        if (data.tracks.items.length === 0) return null;
        if (!existKeys(data.tracks.items[0], ["id"])) return null;

        // return the first track
        return data.tracks.items[0].id;
    };

    /**
     * Initializes the SpotifyWrapper.
     * @returns True if it was successful, false otherwise.
     */
    init = async (): Promise<boolean> => {
        // if the current URL is the spotify website
        if (isSpotify()) {
            // if the client ID is wrong,
            // reset everything
            if (isInvalidClient()) {
                await resetPreferences();
                await setLoggingStatus(false);
            }
            return false;
        }

        // get logging status
        const loggingStatus = await getLoggingStatus();
        if (loggingStatus === null || loggingStatus == false) return false;

        // get the user's token if it has been stored
        // previously
        const userToken = await getUserToken();

        // otherwise go through the long authentification
        // process
        if (userToken === null) {
            const result = await this.login();
            if (!result) return result;
        }

        // get the playlist ID
        const result = await this.playlistID();
        if (result === null) return false;

        return true;
    };

    /**
     * Requests the user to log in their account
     * and to grant us permission to modify their
     * account.
     */
    login = async (): Promise<boolean> => {
        // prompt the user with the spotify login
        // if he is not on the redirect URI
        if (!(await this.onRedirectUri())) {
            this.requestAuthorization();
            return true;
        }

        // otherwise, the user has already been prompted with
        // the login screen and now should have tried to log
        // in
        else {
            // check that they accepted the request
            // and if they did, redirect them towards the
            // last URL they were on
            const result = await this.handleAuthorization();
            if (!result) return false;
            window.location.replace(await getLastURL());
            await setLoggingStatus(false);
        }
        return true;
    };

    /**
     * Handles the authorization request phase where
     * a token allowing us to control the spotify
     * account of the user is retrieved.
     */
    requestAuthorization = async (): Promise<void> => {
        // make sure that a client ID is set
        const clientToken = await getClientToken();
        if (clientToken === null) return;

        // generate a code verifier for the request
        const codeVerifier = generateRandomString(64);

        // store the code verifier
        await setCodeVerifier(codeVerifier);

        // generate a challenge for the request
        const challenge = await getChallenge(codeVerifier);

        // generate the parameters for the incoming
        // request
        var params = {
            client_id: clientToken,
            response_type: "code",
            redirect_uri: await getRedirectURI(),
            scope: scope,
            code_challenge_method: "S256",
            code_challenge: challenge,
        };

        // store the current URL before the redirect
        // so we can redirect the user back here
        // afterwards
        await setLastURL(window.location.href);

        // send the request and redirect the user
        // towards the Spotify's identification page
        authURL.search = new URLSearchParams(params).toString();
        window.location.href = authURL.toString();
    };

    /**
     * After requesting the authorization, if the user
     * has been redirected to the redirect URI, we can
     * handle the code received (if any), and request
     * a token to modify the account of the user.
     * @returns True if the user authorized the connection,
     * false otherwise.
     */
    handleAuthorization = async (): Promise<boolean> => {
        // get the code received after the user has
        // authorized the app to access their account
        // (or not)
        // if 'code=' does not appear in the URL,
        // the user declined the request
        if (!window.location.href.includes("code=")) return false;

        // make sure that a client ID is set
        const clientToken = await getClientToken();
        if (clientToken === null) return;

        // otherwise the code is the first parameter
        const code = window.location.href.split("=")[1];

        // if no code was found, the user has not yet
        // granted any authorization
        if (code === null) return false;

        // retrieve the code verifier to request a token
        const codeVerifier = await getCodeVerifier();

        // if no code verifier was found, well something
        // went awfully wrong at this point
        if (codeVerifier === null) return false;

        // generate the payload request to ask for the
        // token
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientToken,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: await getRedirectURI(),
                code_verifier: codeVerifier,
            }),
        };

        await setCode(code);

        // send the request and get the response
        const body = await fetch(
            new URL("https://accounts.spotify.com/api/token"),
            payload
        );
        const response = await body.json();

        // make sure that the token has the correct fields
        if (
            !existKeys(response, [
                "access_token",
                "expires_in",
                "refresh_token",
            ])
        )
            return false;

        // retrieve the interesting attributes and store them
        await setUserToken(response["access_token"]);
        await setExpiryTime(response["expires_in"] + time());
        await setUserRefreshToken(response["refresh_token"]);
        return true;
    };

    /**
     * Refreshes the user's token if required.
     * @returns True if the token was successfully
     * refreshed (or still valid), false otherwise.
     */
    refreshUserToken = async (): Promise<boolean> => {
        // make sure that a client ID is set
        const clientToken = await getClientToken();
        if (clientToken === null) return;

        // get the refresh token if it exists
        const refreshToken = await getUserRefreshToken();

        // if it does not exist, abort
        if (refreshToken === null) return false;

        // if the token is still valid, do nothing
        if (await this.isRefreshTokenValid()) return true;

        // otherwise, we have to refresh the token
        // set the payload request
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: clientToken,
            }),
        };

        // send the request and get the response
        const body = await fetch(
            new URL("https://accounts.spotify.com/api/token"),
            payload
        );
        const response = await body.json();

        // make sure that the token has the correct fields
        if (
            !existKeys(response, [
                "access_token",
                "expires_in",
                "refresh_token",
            ])
        )
            return false;

        // retrieve the interesting attributes and store them
        await setUserToken(response["access_token"]);
        await setExpiryTime(response["expires_in"] + time());
        await setUserRefreshToken(response["refresh_token"]);
        return true;
    };

    /**
     * Returns whether the user's token is still valid.
     * @returns True if the user's token is still valid,
     * false otherwise.
     */
    isRefreshTokenValid = async (): Promise<boolean> => {
        // get its expiry date if it exists
        const expiryDate = await getExpiryTime();

        // if it does not exist, then the token is not valid
        if (expiryDate === null) return false;

        // otherwise, test if the expiry date has been passed
        return time() - expiryDate < 0;
    };

    /**
     * Returns the secret token.
     * @returns The secret token of the client if it
     * was retrieved, null otherwise.
     */
    getToken = async (): Promise<string | null> => {
        // make sure that a client ID is set
        const clientToken = await getClientToken();
        if (clientToken === null) return;

        // make sure that a client secret is set
        const secretToken = await getSecretToken();
        if (clientToken === null) return;

        // the request to send to retrieve the token
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${clientToken}&client_secret=${secretToken}`,
        });

        // retrieve the data
        const data = await result.json();

        // if no access token exists, return false
        if (!("access_token" in data)) return null;

        // otherwise update the client's token
        return data["access_token"];
    };

    /**
     * Returns the ID of the Playlist to modify.
     * @returns The ID of the Playlist to modify, if
     * it is found, null otherwise.
     */
    playlistID = async (): Promise<string | null> => {
        // make sure that the playlist name is set
        const playlistName = await getPlaylistName();
        if (playlistName === null) return null;

        // get the playlist's ID if it is stored
        const id = await getPlaylistID();
        if (id !== null) return id;

        // otherwise retrieve it and store it
        // get the user's token
        const token = await this.userToken();
        if (token === null) return null;

        // range in the playlist list
        const limit = 50;
        let offset = 0;

        // iterate over every of the user's playlist
        while (true) {
            // send the request to the Spotify's API
            const result = await fetch(
                `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // retrieve the data
            const data = await result.json();

            // make sure that something valid has been returned
            if (!existKeys(data, ["items"])) return null;

            // get the list of Playlist
            const items: Array<PlaylistItem> = data["items"];
            for (const item of items) {
                if (item.name === playlistName) {
                    await setPlaylistID(item.id);
                    return item.id;
                }
            }

            // if the playlist was not found, try the next range
            // if the array returned did not have the limit size
            // then the playlist was not found at all
            if (items.length < limit) break;

            // otherwise increase the offset
            offset += limit;
        }

        // return the first track
        return null;
    };

    /**
     * Returns the list of all tracks in the playlist.
     */
    getAllTracks = async (): Promise<Array<Track>> => {
        // get the playlist's ID if it is stored
        const id = await this.playlistID();
        if (id === null) return [];

        // otherwise retrieve it and store it
        // get the user's token
        const token = await this.userToken();
        if (token === null) return [];

        // range in the playlist list
        const limit = 50;
        let offset = 0;

        // the final list of tracks
        let tracks: Array<Track> = [];

        // iterate over every of the user's playlist
        while (true) {
            // send the request to the Spotify's API
            const result = await fetch(
                `https://api.spotify.com/v1/playlists/${id}/tracks?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // retrieve the data
            const data = await result.json();

            // make sure that something valid has been returned
            if (!existKeys(data, ["items"])) break;

            // get the list of Playlist
            tracks = tracks.concat(data["items"]);

            // if the playlist was not found, try the next range
            // if the array returned did not have the limit size
            // then the playlist was not found at all
            if (data["items"].length < limit) break;

            // otherwise increase the offset
            offset += limit;
        }

        // return the first track
        return tracks;
    };

    /**
     * Returns the username of the current user.
     * @returns The username of the current user if it
     * is found, null otherwise.
     */
    getDisplayName = async (): Promise<string | null> => {
        // get the user's token
        const token = await this.userToken();
        if (token === null) return null;

        // send the request to the Spotify's API
        const result = await fetch(`https://api.spotify.com/v1/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // retrieve the data and return the first value
        const data = await result.json();

        // make sure the expected fields exist
        if (!existKeys(data, ["display_name"])) return null;

        // return the first track
        return data.display_name;
    };

    /**
     * Returns the user's token.
     */
    userToken = async (): Promise<string | null> => {
        // make sure that the user's token is still
        // valid
        const result = await this.refreshUserToken();
        if (!result) return null;

        // get the user's token
        const token = await getUserToken();
        return token;
    };

    /**
     * Adds the given song to the playlist.
     * @param info The information about the song to add.
     * @returns True if it was successfully added, false otherwise.
     */
    addTrackToPlaylist = async (info: SongInformation): Promise<boolean> => {
        // check that the given song is not already in the
        // playlist
        if (await this.isInPlaylist(info)) return true;

        // get the ID of the playlist
        const playlistID = await this.playlistID();
        if (playlistID === null) return false;

        // get the ID of the song
        const songID = await this.getSongId(info);
        if (songID === null) return false;

        // get the user's token
        const token = await this.userToken();
        if (token === null) return null;

        // set the payload request
        const payload = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const query = encodeURIComponent(`spotify:track:${songID}`);

        // send the request and get the response
        const body = await fetch(
            new URL(
                `https://api.spotify.com/v1/playlists/${playlistID}/tracks?uris=${query}`
            ),
            payload
        );
        const response = await body.json();
        if (!existKeys(response, ["ok"])) return false;
        return response["ok"];
    };

    /**
     * Removes the given song to the playlist.
     * @param info The information about the song to remove.
     * @returns True if it was successfully removed, false otherwise.
     */
    removeTrackToPlaylist = async (info: SongInformation): Promise<boolean> => {
        // check that the given song is not already in the
        // playlist
        if (!(await this.isInPlaylist(info))) return true;

        // get the ID of the playlist
        const playlistID = await this.playlistID();
        if (playlistID === null) return false;

        // get the ID of the song
        const songID = await this.getSongId(info);
        if (songID === null) return false;

        // get the user's token
        const token = await this.userToken();
        if (token === null) return null;

        // set the payload request
        const payload = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tracks: [
                    {
                        uri: `spotify:track:${songID}`,
                    },
                ],
            }),
        };

        // send the request and get the response
        const body = await fetch(
            new URL(
                `https://api.spotify.com/v1/playlists/${playlistID}/tracks`
            ),
            payload
        );
        const response = await body.json();
        if (!existKeys(response, ["ok"])) return false;
        return response["ok"];
    };

    isInPlaylist = async (info: SongInformation): Promise<boolean> => {
        // get every song in the playlist
        const tracks = await this.getAllTracks();

        // get the ID of the given track
        const givenID = await this.getSongId(info);

        // for every track, check if their id
        // is equal to the id of the given track
        for (const track of tracks) {
            if (track.track.id === givenID) return true;
        }
        return false;
    };

    /**
     * Returns whether the current URL is the redirect URI.
     * @returns Whether the current URL the page is on is
     * the redirect URI to use after requesting authorization
     * from the user.
     */
    onRedirectUri = async (): Promise<boolean> => {
        return window.location.href.startsWith(await getRedirectURI());
    };
}
