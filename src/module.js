/* ------------------------------------ */
/* Other Hooks							*/
/* ------------------------------------ */
import API from "./scripts/api.js";
import CONSTANTS from "./scripts/constants.js";
import { registerSettings } from "./scripts/settings.js";
import { registerSocket } from "./scripts/socket.js";
import Logger from "./scripts/lib/Logger.js";
import { CopyPopupApplication } from "./scripts/apps/CopyPopupApplication.js";
import SilentFilePicker from "./scripts/libs/customFilepickers/foundryFilePicker.js";
import SilentForgeFilePicker from "./scripts/libs/customFilepickers/forgeFilePicker";

let filePath = window.location.href.replace("/game", "");

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
Hooks.once("setup", async function () {
    game.modules.get(CONSTANTS.MODULE_ID).api = API;

    await FilePicker.createDirectory("data", "actorAPI", {}).catch(() => {});

    const hookNotExecuted = Hooks.call("actorViewerGenerate");

    if (hookNotExecuted) {
        Logger.warn("No settings found for this system.");

        let actors = {};
        game.actors.forEach((actor) => {
            const compatMode = game.settings.get(CONSTANTS.MODULE_ID, "compatMode");
            let items = [];

            if (!compatMode) {
                if (game.user.isGM) {
                    actor.setFlag(
                        CONSTANTS.MODULE_ID,
                        "classLabels",
                        actor.itemTypes.class.map((c) => c.name).join(", "),
                    );
                }

                actor.items.forEach((item) => {
                    if (game.user.isGM) {
                        item.setFlag(CONSTANTS.MODULE_ID, "labels", item.labels);
                    }
                    items.push(item.data);
                });
            }

            actors[actor.id] = JSON.parse(JSON.stringify(actor.data));
            if (!compatMode) {
                actors[actor.id].items = JSON.parse(JSON.stringify(items));
            }
        });

        // create json files
        API.createActorsFile(actors);
        API.createWorldsFile();
        // set application button url
        game.settings.set(CONSTANTS.MODULE_ID, "systemSite", "https://ardittristan.github.io/VTTExternalActorSite/");
    }
});

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

Hooks.on("renderActorSheet", (sheet, html) => {
    jQuery('<a class="character-id"><i class="fas fa-link"></i>Get id</a>').insertAfter(html.find(".window-title"));

    html.find(".character-id").on("click", () => {
        if (filePath.includes("https://")) {
            let stringUrlActor = filePath + sheet.actor.id;
            new CopyPopupApplication(stringUrlActor).render(true);
        } else {
            let stringUrlWorld = `${window.location.href.replace("/game", "")}/actorAPI/${game.world.data.name}-actors.json${sheet.actor.id}`;
            new CopyPopupApplication(stringUrlWorld).render(true);
        }
    });
});

/** ======================================================================== */

/**
 * @param  {String} fileName
 * @param  {String} worldName
 * @param  {String} content
 */
export async function createJsonFile(fileName, content) {
    const file = new File([content], fileName, { type: "application/json", lastModified: Date.now() });

    let response = await upload("data", "actorAPI", file, {});
    filePath = response.path;

    Logger.log(response);
}

export function copyToClipboard(text) {
    const listener = function (ev) {
        ev.preventDefault();
        ev.clipboardData.setData("text/plain", text);
    };
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
    ui.notifications.info(game.i18n.localize("actorViewer.copied"));
}
/**
 * @param  {Actor[]} actors
 */
export function createActorsFile(actors) {
    let fileActorJson = `${game.world.data.name}-actors.json`;
    createJsonFile(fileActorJson, JSON.stringify(actors));
}

/**
 * Create or update the worlds.json file
 */
export function createWorldsFile() {
    let worlds = [];
    const world = { name: game.world.data.name, title: game.world.data.title, system: game.world.data.system };
    Logger.debug("Checking for existing worlds.json", world);
    let urlWorldJson = `${window.location.href.replace("/game", "")}/actorAPI/worlds.json`;
    Logger.debug("Fetch existing worlds.json", urlWorldJson);

    fetch(urlWorldJson)
        .then((response) => response.json())
        .then((data) => {
            Logger.debug("Existing worlds.json data", data);
            worlds = data;
            if (!worlds.some((w) => w.name === game.world.data.name)) {
                worlds.push(world);
                Logger.debug("Writing data to worlds.json", worlds);
                createJsonFile("worlds.json", JSON.stringify(worlds));
            }
        })
        .catch(() => {
            Logger.debug("Creating worlds.json");
            worlds.push(world);
            Logger.debug("Writing data to existing worlds.json", worlds);
            createJsonFile("worlds.json", JSON.stringify(worlds));
        });
}

/**
 * @type {FilePicker.upload}
 *
 * @returns {Promise}
 */
async function upload(source, path, file, options) {
    if (typeof ForgeVTT_FilePicker !== "undefined") {
        // const SilentForgeFilePicker = (await import("./customFilepickers/forgeFilePicker.js")).default;
        return await SilentForgeFilePicker.upload(source, path, file, options);
    } else {
        return await SilentFilePicker.upload(source, path, file, options);
    }
}
