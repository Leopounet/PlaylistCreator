/**
 * A playlist item returned by Spotify's API.
 * In fact, there are many more fields, but I
 * only use those.
 * @var name: The name of the playlist.
 * @var id: The id of the playlist.
 */
export interface PlaylistItem {
    name: string;
    id: string;
}

/**
 * A track returned by Spotify's API.
 * In fact, there are many more fields, but I
 * only use those.
 * @var id: The id of the track.
 */
export interface Track {
    track: {
        id: string;
    };
}

/** A command to redirect towards the options. */
export const redirectOptionsCommand = "redirect-options-command";

/**
 * A command sent to the background script.
 * @var cmd: A unique string used to tell
 * the background script what to do.
 */
export interface BackgroundScriptCommand {
    cmd: string;
}
