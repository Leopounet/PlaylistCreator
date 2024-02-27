import { SpotifyWrapper } from "../spotify/SpotifyWrapper";

/**
 * Abstract representation of an APi to communicate
 * with a blind test website.
 */
export class AbstractWebsiteAPI {
    // SpotifyWrapper to communicate with their
    // API easily
    spotifyWrapper: SpotifyWrapper;

    /**
     * Creates a new AbstractWebsiteAPI.
     */
    constructor() {
        this.spotifyWrapper = new SpotifyWrapper();
    }

    /**
     * Initialized the Spotify's API.
     */
    init = async (): Promise<void> => {
        await this.spotifyWrapper.init();
    };

    /**
     * Changes the page accordingly so that songs
     * can be added via buttons or other means.
     */
    changePage = (): void => {
        throw new Error("Please use a non abstract class!");
    };
}
