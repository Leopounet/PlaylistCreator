import { WhatTheTuneAPI } from "../whatthetune/WhatTheTuneAPI.js";
import { AbstractWebsiteAPI } from "./AbstractWebsiteAPI.js";

const main = async (): Promise<void> => {
    const api: AbstractWebsiteAPI = new WhatTheTuneAPI();
    await api.init();
    api.changePage();
};

main();
