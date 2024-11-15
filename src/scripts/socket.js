import CONSTANTS from "./constants.js";
import API from "./api.js";
import Logger from "./lib/Logger.js";

export let externalActorViewerSocket;
export function registerSocket() {
    Logger.debug("Registered externalActorViewerSocket");
    if (externalActorViewerSocket) {
        return externalActorViewerSocket;
    }

    externalActorViewerSocket = socketlib.registerModule(CONSTANTS.MODULE_ID);

    // TODO something ???
    // externalActorViewerSocket.register("requestEvent", (...args) => API.requestEventArr(...args));
    // externalActorViewerSocket.register("setNoteRevealed", (...args) => API.setNoteRevealedArr(...args));

    game.modules.get(CONSTANTS.MODULE_ID).socket = externalActorViewerSocket;
    return externalActorViewerSocket;
}
