import { AbstractWebsiteAPI } from "../common/AbstractWebsiteAPI";
import { SongInformation } from "../spotify/SongInformation";
import { getUserToken, setLoggingStatus } from "../common/Storage";
import {
    addButton,
    loginButton,
    logoutButton,
    removeButton,
} from "./WhatTheTuneButtons";
import {
    addButtonStyle,
    loginButtonClassName,
    loginButtonStyle,
    logoutButtonClassName,
    logoutButtonStyle,
    removeButtonStyle,
} from "./WhatTheTuneStyles";

/**
 * Concrete implementation of the AbstractWebsiteAPI
 * for the website What the Tune?!
 * https://whatthetune.com/
 */
export class WhatTheTuneAPI extends AbstractWebsiteAPI {
    /**
     * Creates a new AbstractWebsiteAPI.
     */
    constructor() {
        // init the API
        super();

        // load the styles to use in this document
        this.loadStyles();
    }

    /**
     * Changes the page accordingly so that songs
     * can be added via buttons or other means.
     */
    changePage = (): void => {
        // if the document is still loading, do nothing
        // otherwise add the login button or logout button
        if (document.readyState !== "loading") this._addLogin();
        else document.addEventListener("DOMContentLoaded", this._addLogin);

        // this is used to handle new songs that appear on the page
        // dynamically
        // when a new song is added, the given function is fired
        const observer = new MutationObserver(this.modifyPageOnNewSong);
        const observerOptions = { childList: true, subtree: true };
        observer.observe(document.body, observerOptions);
    };

    /**
     * This method handles things when a new song is
     * revealed.
     * @param mutationsList: This is the list of mutations
     * that happened since the last call.
     * @param observer: This is the Observer object.
     */
    modifyPageOnNewSong = (
        mutationsList: MutationRecord[],
        observer: MutationObserver
    ): void => {
        // Iterate over every newly added nodes
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node: Element) => {
                // during the game
                if (node.id && node.id.startsWith("song-")) {
                    this.injectButtons(node);
                }

                // after the game
                if (node.className && node.className.startsWith("song-list")) {
                    for (const child of node.children) {
                        this.injectButtons(child);
                    }
                }

                // look for a footer
                if (node.getElementsByClassName) {
                    var footer = node.getElementsByClassName("footer");
                    if (footer.length === 1) this._addLogin();
                }
            });
        });
    };

    /**
     * Injects the add and remove buttons in the given
     * element.
     * @param node The node to inject the buttons in.
     */
    injectButtons = (node: Element): void => {
        // Get the info about the song
        const info = this.getSongInfo(node);

        // It may be empty when joining in the middle of
        // a game, so skip those
        if (info.name === "" || info.artist === "") return;
        node.appendChild(addButton(info, this.spotifyWrapper));
        node.appendChild(removeButton(info, this.spotifyWrapper));
    };

    _addLogin = async () => {
        // if the current page is not the what the tune page, skip
        if (!window.location.href.startsWith("https://whatthetune.com/"))
            return;

        // get the footer element
        var footer = document.getElementsByClassName("footer");
        if (footer.length !== 1) return;

        // used to know if the user is logged in
        const token = await getUserToken();

        // the existing button
        var loginButtonVar: Element = null;
        var logoutButtonVar: Element = null;

        // try to locate an already existing login button
        var button = document.getElementsByClassName(loginButtonClassName);
        if (button.length !== 0) loginButtonVar = button[0];

        // try to locate an already existing logout button
        button = document.getElementsByClassName(logoutButtonClassName);
        if (button.length !== 0) logoutButtonVar = button[0];

        // create a new button if needed
        var newButton: HTMLButtonElement = null;

        // get the adequate button to display
        if (token === null && loginButtonVar === null)
            newButton = await loginButton(this.spotifyWrapper);
        else if (token !== null && logoutButtonVar === null)
            newButton = await logoutButton(this.spotifyWrapper);

        // if the new button is null, skip
        if (newButton === null) return;

        // if a previous button existed, remove it
        if (loginButtonVar !== null) loginButtonVar.remove();
        if (logoutButtonVar !== null) logoutButtonVar.remove();

        // insert the button
        const footerElement = footer[0];
        const child = footerElement.childNodes[1];
        footerElement.insertBefore(newButton, child);
    };

    /**
     * Returns the SongInformation corresponding to the
     * given element.
     * @param element: An element containing song's info.
     */
    getSongInfo = (element: Element): SongInformation => {
        // make sure that this element is indeed a song
        // on the what the tune website
        if (!element.id) throw new Error("Element is not a Song element!");
        if (!element.id.startsWith("song-"))
            throw new Error("Element is not a Song element!");

        // if it is, get the song's name and artist
        const name = element.querySelector('[class="name"]').innerHTML;
        const artist = element.querySelector('[class="artist"]').innerHTML;
        return new SongInformation(name, artist);
    };

    /**
     * Loads styles into the head of the current
     * document so they can be used in the rest of the code.
     */
    loadStyles = (): void => {
        document.head.appendChild(addButtonStyle());
        document.head.appendChild(removeButtonStyle());
        document.head.appendChild(loginButtonStyle());
        document.head.appendChild(logoutButtonStyle());
    };
}
