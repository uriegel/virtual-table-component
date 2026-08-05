import { loadStylesheet } from "./index.js"

export class VirtualTable extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.shadow = this.attachShadow({ mode: "open" })
        this.root = document.createElement("div")

        this.root.textContent = "Das ist jetzt eine neue Typescript Komponente"

        this.root.id = "root"
        this.root.setAttribute("tabindex", "0")
        this.shadow.appendChild(this.root)

        const rootStyle = await loadStylesheet(new URL("./styles/root.css", import.meta.url))
        document.head.appendChild(rootStyle)

        var style = await loadStylesheet(new URL("./styles/VirtualTable.css", import.meta.url))
        this.shadow.append(style)
    }

    private shadow: ShadowRoot | undefined
    private root: HTMLDivElement | undefined
}

customElements.define("virtual-table", VirtualTable)