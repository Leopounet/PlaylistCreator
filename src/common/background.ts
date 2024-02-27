// background-script.js

import { BackgroundScriptCommand, redirectOptionsCommand } from "./Interfaces";

/**
 * Command dispatcher.
 */
browser.runtime.onMessage.addListener(
    async (message: BackgroundScriptCommand) => {
        if (message.cmd === redirectOptionsCommand) await openOptions();
    }
);

/**
 * Opens the option's page.
 */
const openOptions = async (): Promise<void> => {
    await browser.runtime.openOptionsPage();
};
