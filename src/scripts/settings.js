import CONSTANTS from "./constants.js";

export const registerSettings = function () {
    game.settings.registerMenu(CONSTANTS.MODULE_ID, "resetAllSettings", {
        name: `${CONSTANTS.MODULE_ID}.settings.reset.name`,
        hint: `${CONSTANTS.MODULE_ID}.settings.reset.hint`,
        icon: "fas fa-coins",
        type: ResetSettingsDialog,
        restricted: true,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "debug", {
        name: `${CONSTANTS.MODULE_ID}.settings.debug.name`,
        hint: `${CONSTANTS.MODULE_ID}.settings.debug.hint`,
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });
};
class ResetSettingsDialog extends FormApplication {
    constructor(...args) {
        //@ts-ignore
        super(...args);
        //@ts-ignore
        return new Dialog({
            title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.title`),
            content:
                '<p style="margin-bottom:1rem;">' +
                game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.content`) +
                "</p>",
            buttons: {
                confirm: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.confirm`),
                    callback: async () => {
                        const worldSettings = game.settings.storage
                            ?.get("world")
                            ?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`));
                        for (let setting of worldSettings) {
                            console.log(`Reset setting '${setting.key}'`);
                            await setting.delete();
                        }
                        //window.location.reload();
                    },
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.cancel`),
                },
            },
            default: "cancel",
        });
    }
    async _updateObject(event, formData) {
        // do nothing
    }
}
