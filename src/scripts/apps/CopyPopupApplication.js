import CONSTANTS from "../constants";

export class CopyPopupApplication extends Application {
    constructor(url, options = {}) {
        super(options);

        this.url = url;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "copyPopup",
            title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.actorUrl`),
            template: `modules/${CONSTANTS.MODULE_ID}/templates/copyPopup.html`,
            classes: ["copy-url-window"],
            resizable: false,
        });
    }

    getData() {
        return {
            url: this.url,
        };
    }

    /**
     * @param  {JQuery} html
     */
    activateListeners(html) {
        super.activateListeners(html);

        html.find(".close").on("click", () => {
            this.close();
        });
        html.find(".sendToApp").on("click", () => {
            Object.assign(document.createElement("a"), {
                target: "_blank",
                href: game.settings.get(CONSTANTS.MODULE_ID, "systemSite") + "?" + this.url,
            }).click();
        });
        html.find(".copyButton").on("click", () => {
            copyToClipboard(this.url);
        });
    }
}
