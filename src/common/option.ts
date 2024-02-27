import {
    getClientToken,
    getPlaylistName,
    getRedirectURI,
    getSecretToken,
    resetData,
    resetPreferences,
    setClientToken,
    setPlaylistName,
    setRedirectURI,
    setSecretToken,
} from "./Storage";

document.querySelector("#idButton").addEventListener("click", async () => {
    const element: HTMLInputElement = document.querySelector("#clientId");
    await setClientToken(element.value);
    const button: HTMLButtonElement = document.querySelector("#idButton");
    button.innerHTML = `Save (set)`;
});

document.querySelector("#secretButton").addEventListener("click", async () => {
    const element: HTMLInputElement = document.querySelector("#clientSecret");
    await setSecretToken(element.value);
    const button: HTMLButtonElement = document.querySelector("#secretButton");
    button.innerHTML = `Save (set)`;
});

document
    .querySelector("#playlistButton")
    .addEventListener("click", async () => {
        const element: HTMLInputElement =
            document.querySelector("#playlistName");
        await setPlaylistName(element.value);
        const button: HTMLButtonElement =
            document.querySelector("#playlistButton");
        button.innerHTML = `Save (set)`;
    });

document
    .querySelector("#redirectButton")
    .addEventListener("click", async () => {
        const element: HTMLInputElement =
            document.querySelector("#redirectURI");
        await setRedirectURI(element.value);
        const button: HTMLButtonElement =
            document.querySelector("#redirectButton");
        button.innerHTML = `Save (set)`;
    });

document.querySelector("#resetButton").addEventListener("click", async () => {
    await resetPreferences();
    await resetData();
    await updateSetSaveButtons();
});

const _updateHelper = async (id: string, value: string): Promise<void> => {
    let text = "";
    if (value !== null) text = " (set)";
    const button: HTMLButtonElement = document.querySelector(id);
    button.innerHTML = `Save${text}`;
};

const updateSetSaveButtons = async (): Promise<void> => {
    await _updateHelper("#idButton", await getClientToken());
    await _updateHelper("#secretButton", await getSecretToken());
    await _updateHelper("#playlistButton", await getPlaylistName());
    await _updateHelper("#redirectButton", await getRedirectURI());
};

updateSetSaveButtons();
