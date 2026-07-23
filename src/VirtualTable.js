export class VirtualTable extends HTMLElement {
    constructor() {
        super()
    }
    
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" })

        const div = document.createElement("div")
        div.textContent = "Hallo, ich bin eine Web-Komponente"
        shadow.appendChild(div)
    }
}

customElements.define("virtual-table", VirtualTable)