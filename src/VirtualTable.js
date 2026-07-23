// TODO measure one item when itemheight == 0
// TODO table without spaces
// TODO html list in the web component ~ 100 items in an array
// TODO Keyboard control and mouse scrolling, add items above and remove items below
// TODO Scrollbar web component to scroll through this list
// TODO Slot to render a new cell in the program with recycling

// TODO WebserverLight with website request

export class VirtualTable extends HTMLElement {

    constructor() {
        super()
    }
    
    connectedCallback() {
        this.shadow = this.attachShadow({ mode: "open" })
        this.main = document.createElement("div")
        this.main.style.overflow = "hidden"
        this.main.style.position = "absolute"
        this.main.style.width = "100%"
        this.main.style.height = "100%"
        this.table = document.createElement("table")
        this.tableBody = document.createElement("tbody")
        this.table.appendChild(this.tableBody)
        this.main.appendChild(this.table)
        this.shadow.appendChild(this.main)
    }

    setItems(items) {

        this.measure()

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

    measure() {
        const tr = document.createElement("tr")
        const td = document.createElement("td")
        td.textContent = "item"
        tr.appendChild(td)
        this.tableBody.appendChild(tr)
        const height = tr.offsetHeight
        const bodyHeight = this.main.clientHeight
        console.log(height, bodyHeight, bodyHeight/height)
    }
}

customElements.define("virtual-table", VirtualTable)