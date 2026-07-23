export class VirtualTable extends HTMLElement {

    constructor() {
        super()
    }
    
    connectedCallback() {
        this.shadow = this.attachShadow({ mode: "open" })
        const main = document.createElement("div")
        main.style.overflow = "hidden"
        main.style.position = "absolute"
        main.style.width = "100%"
        main.style.height = "100%"
        this.table = document.createElement("table")
        this.tableBody = document.createElement("tbody")
        this.table.appendChild(this.tableBody)
        main.appendChild(this.table)
        this.shadow.appendChild(main)
    }

    setItems(items) {
        while (this.tableBody.lastElementChild) 
            this.tableBody.removeChild(this.tableBody.lastElementChild)

        items.forEach(item => {
            const tr = document.createElement("tr")
            const td = document.createElement("td")
            td.textContent = item
            tr.appendChild(td)
            this.tableBody.appendChild(tr)
        })
    }
}

customElements.define("virtual-table", VirtualTable)