import { copyToClipboard, createActorsFile, createWorldsFile } from "../module.js";

const API = {
    createActorsFile(actors) {
        createActorsFile(actors);
    },

    createWorldsFile() {
        createWorldsFile();
    },

    copyToClipboard(text) {
        copyToClipboard(text);
    },
};
export default API;
