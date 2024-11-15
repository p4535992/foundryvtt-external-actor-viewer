/* ------------------------------------ */
/* Other Hooks							*/
/* ------------------------------------ */
import API from "./scripts/api.js";
import CONSTANTS from "./scripts/constants.js";
import { registerSettings } from "./scripts/settings.js";
import { registerSocket } from "./scripts/socket.js";
import Logger from "./scripts/lib/Logger.js";

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", function () {
    Logger.log(" init " + CONSTANTS.MODULE_ID);
    registerSettings();

    Hooks.once("socketlib.ready", registerSocket);
});
/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
    game.modules.get(CONSTANTS.MODULE_ID).api = API;

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */

Hooks.once("ready", function () {
    if (!game.modules.get("lib-wrapper")?.active && game.user?.isGM) {
        let word = "install and activate";
        if (game.modules.get("lib-wrapper")) word = "activate";
        throw Logger.error(`Requires the 'libWrapper' module. Please ${word} it.`);
    }
    if (!game.modules.get("socketlib")?.active && game.user?.isGM) {
        let word = "install and activate";
        if (game.modules.get("socketlib")) word = "activate";
        throw Logger.error(`Requires the 'socketlib' module. Please ${word} it.`);
    }
});
