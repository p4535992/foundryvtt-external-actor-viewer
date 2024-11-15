import API from "../scripts/api";
import CONSTANTS from "../scripts/constants";

Hooks.on("init", () => {
    if (game.system.id === "dnd5e") {
        Hooks.on("actorViewerGenerate", () => {
            // TODO Rewrite everything
            let actors = {};
            /*
            const compatMode = game.settings.get(CONSTANTS.MODULE_ID, "compatMode");
            let actors = {};
            game.actors.forEach((actor) => {
                let items = [];

                if (!compatMode) {
                    if (game.user.isGM) {
                        actor.setFlag(
                            CONSTANTS.MODULE_ID,
                            "disableExperience",
                            game.settings.get("dnd5e", "disableExperienceTracking"),
                        );
                        actor.setFlag(
                            CONSTANTS.MODULE_ID,
                            "currencyWeight",
                            game.settings.get("dnd5e", "currencyWeight"),
                        );
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
            */

            // create json file
            API.createActorsFile(actors);
            API.createWorldsFile();
            // set application button url
            game.settings.set(
                CONSTANTS.MODULE_ID,
                "systemSite",
                "https://ardittristan.github.io/VTTExternalActorSites/dnd5e/",
            );

            return false;
        });
    }
});
