import { redirectOptionsCommand } from "../common/Interfaces";
import { SongInformation } from "../spotify/SongInformation";
import { SpotifyWrapper } from "../spotify/SpotifyWrapper";
import {
    arePreferencesSet,
    getClientToken,
    getPlaylistID,
    getPlaylistName,
    getSecretToken,
    resetData,
    setLoggingStatus,
} from "../common/Storage";
import {
    addButtonClassName,
    loginButtonClassName,
    logoutButtonClassName,
    removeButtonClassName,
} from "./WhatTheTuneStyles";

/**
 * Creates a new button to add a song to a spotify
 * playlist for the What The Tune website.
 * @param info The information about the song to add.
 * @param spotifyWrapper The spotify wrapper to use.
 * @returns The button to add a new song.
 */
export const addButton = (
    info: SongInformation,
    spotifyWrapper: SpotifyWrapper
): HTMLButtonElement => {
    const addButton = document.createElement("button");
    addButton.classList.add(addButtonClassName);
    addButton.innerHTML = "+";
    addButton.addEventListener("click", () => {
        spotifyWrapper.addTrackToPlaylist(info);
    });
    return addButton;
};

/**
 * Creates a new button to remove a song from a
 * spotify playlist for the What The Tune website.
 * @param info The information about the song to remove.
 * @param spotifyWrapper The spotify wrapper to use.
 * @returns The button to remove a new song.
 */
export const removeButton = (
    info: SongInformation,
    spotifyWrapper: SpotifyWrapper
): HTMLButtonElement => {
    const removeButton = document.createElement("button");
    removeButton.classList.add(removeButtonClassName);
    removeButton.innerHTML = "-";
    removeButton.addEventListener("click", () => {
        spotifyWrapper.removeTrackToPlaylist(info);
    });
    return removeButton;
};

/**
 * Creates a new button to log into the user's
 * Spotify's account for the What The Tune website.
 * @param spotifyWrapper The spotify wrapper to use.
 * @returns The button to login.
 */
export const loginButton = async (
    spotifyWrapper: SpotifyWrapper
): Promise<HTMLButtonElement> => {
    // Create a button element
    const loginButton = document.createElement("button");
    // Set button text
    loginButton.innerText = "Log in Spotify";

    // Add a click event listener to the button
    loginButton.addEventListener("click", async () => {
        // if the options have no been set, redirect
        // towards options
        if (!(await arePreferencesSet())) {
            browser.runtime.sendMessage({ cmd: redirectOptionsCommand });
            return;
        }
        // set the logging status to true so that
        // on page reload, the init method triggers
        // the redirect if needed
        await setLoggingStatus(true);
        await spotifyWrapper.init();
    });
    loginButton.classList.add(loginButtonClassName);
    return loginButton;
};

/**
 * Creates a new button to log out of the user's
 * Spotify's account for the What The Tune website.
 * @param spotifyWrapper The spotify wrapper to use.
 * @returns The button to logout.
 */
export const logoutButton = async (
    spotifyWrapper: SpotifyWrapper
): Promise<HTMLButtonElement> => {
    // Create a button element
    const logoutButton = document.createElement("button");
    // Set button text
    logoutButton.innerText = `Log out (${await spotifyWrapper.getDisplayName()})`;

    // Add a click event listener to the button
    logoutButton.addEventListener("click", async () => {
        await resetData();
        logoutButton.replaceWith(await loginButton(spotifyWrapper));
    });
    logoutButton.classList.add(logoutButtonClassName);

    return logoutButton;
};
