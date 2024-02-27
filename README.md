# PlaylistCreator

This is a Mozilla Firefox extension that can be used to
modify some websites (see [Supported websites](#supported-websites))
in order to add utilities that can be used to add
songs to a pre-defined Spotify playlist.

**Developers**: Make sure to change the API keys in the Makefile
if you intend to package the extension via the Makefile.

## Requirements

-   A Spotify account (see [Account](#account))
-   At least one playlist on that account
-   [A Spotify application](https://developer.spotify.com/dashboard) (see [Application](#application))
-   A valid redirect URI (see [Redirect URI](#redirect-uri))

### Account

An account is obviously required to interact with the
extension. The account does not have to be premium,
though some interactions with the Spotify API
are impossible for free users.

An account can be created [here](https://www.spotify.com/fr/signup).

### Application

An Application is required to allow calls to the Spotify
API. An application can be created [here](https://developer.spotify.com/dashboard/create).
Note that the application may be limited if the creator
does not have a premium Spotify account. Once the application
has been created, take notes of the Client ID, Client Secret and
Redirect URI (more on that [here](#redirect-uri)).

### Redirect URI

In order to log into the user's Spotify account, at some point
a valid redirect URI is required (_note: maybe I am not well versed
enough with localhost-related stuff_). If you have a Github account,
something like `https://username.github.io/redirectcallback` will
easily do the trick.

## Installing

Once all the [requirements](#requirements) are set, the extension can be
installed (multiple people can use the same client ID, client secret
playlist name and redirect URI if you trust each other, in this case
only one person has to perform the requirements).

To install the extension first download the
[latest release](https://github.com/Leopounet/PlaylistCreator/releases/tag/v1.0.0)
(this should be a .xpi file).
Once it has been downloaded, head to the extension manager on Firefox (go to the
**about:addons** url).On this page,
click the cog in the top right corner, and select **Install Add-on from file...**,
finally pick the downloaded .xpi file and _voilà_, the extension is up and
running.

## Usage

Once the extension is installed, head to one of the supported
websites. There should be a button or something allowing
you to register a Spotify account. With no prior setup, this
should redirect you to the extensions' settings. Head to the
**preferences** tab, there should be at least four main options
to set :

-   Client ID: The client ID generated previously
-   Client Secret: The client secret generated previously
-   Playlist Name: The name of the playlist the extension will modify
-   Redirect URI: The redirect URI specified in the Spotify application

Make sure to set all of the fields correctly otherwise the
extension might misbehave and it might be difficult to debug.

Finally, head to one of the [supported websites](#supported-websites)
and you should be able to log into your Spotify account. Once this is
done the extension should be working as intended. Note that you don't
have to stay actually logged into your Spotify account on the browser
(you can logout or switch to another account). As long as the log in
has been done once, unless logging out on one of the supported websites,
the extension will keep on working.

## Limitations

Here are a list of limitations that I know about.

### Collaborative playlists

Collaborative playlist can only be modified by their creator when it
through the Spotify's API. This is due to security concerns about bots
being able to quite literally nuke any public collaborative playlist.

## Supported websites

-   [What The Tune](https://whatthetune.com/)
