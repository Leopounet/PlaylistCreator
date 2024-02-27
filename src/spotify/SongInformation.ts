import { urlify } from "../common/Utils";

/**
 * Class that represents information that can
 * be gathered about a song.
 */
export class SongInformation {
    // The song information that can be gathered
    name: string;
    artist: string;

    /**
     * Creates a new SongInformation object.
     * @param element: A song element in which data can
     * be found. If the element does not have a valid
     * format (i.e: is not a Song Element), an Error is
     * raised.
     */
    constructor(name: string, artist: string) {
        this.name = urlify(name);
        this.artist = urlify(artist);
    }
}
