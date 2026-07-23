// TODO scrollintoview in checkPosition, add items above and remove items below
// TODO PageUp PageDown
// TODO Home End
// TODO mouse scrolling 
// TODO Resizing
// TODO Scrollbar web component to scroll through this list
// TODO Slot to render a new cell in the program with recycling

// TODO WebserverLight with website request

export class VirtualTable extends HTMLElement {

    constructor() {
        super()
        this.itemHeight = 0
        this.currentPosition = 0
        this.offset = 0
    }
    
    connectedCallback() {
        this.shadow = this.attachShadow({ mode: "open" })
        this.main = document.createElement("div")
        this.main.id = "root"
        this.main.setAttribute("tabindex", "0")
        this.main.addEventListener("keydown", evt => this.onKeyDown(evt))
        this.table = document.createElement("table")
        this.tableBody = document.createElement("tbody")
        this.table.appendChild(this.tableBody)
        this.main.appendChild(this.table)
        this.shadow.appendChild(this.main)
        this.setAttribute("tabindex", "0")
        this.addEventListener("focus", () => this.main.focus())

        const resizeObserver = new ResizeObserver(() => this.onResize())
        resizeObserver.observe(this.main)

        const style = document.createElement('style')
        style.textContent = `
            #root {
                overflow: hidden;
                position: absolute;
                width: 100%;
                height: 100%;
                outline: none;
            }
            table {
                border-spacing: 0px;
                table-layout: fixed;
                width: 100%;        
            }
            tr.isCurrent {
                outline-color: red;
                outline-width: 1px;
                outline-style: solid;
                outline-offset: -1px;    
            }`
            

        this.shadow.appendChild(style)
    }

    setItems(items) {
        this.items = items
        if (this.itemHeight == 0)
            this.itemHeight = this.measure()

        while (this.tableBody.lastElementChild) 
            this.tableBody.removeChild(this.tableBody.lastElementChild)

        items.forEach((item, idx) => {
            const tr = document.createElement("tr")
            if (idx == this.currentPosition)
                tr.classList.add("isCurrent")
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
        const itemHeight = tr.offsetHeight
        const bodyHeight = this.main.clientHeight
        console.log(itemHeight, bodyHeight, bodyHeight / itemHeight)
        return itemHeight
    }

    onResize() {
        console.log("Resized", this.main.clientHeight, Math.floor(this.main.clientHeight / this.itemHeight))
    }

    onKeyDown(evt) {
        console.log(evt.key)
        if (evt.key == "ArrowDown") {
            evt.preventDefault()
            evt.stopPropagation()
            this.checkPosition(this.currentPosition + 1)
        }
        else if (evt.key == "ArrowUp") {
            evt.preventDefault()
            evt.stopPropagation()
            this.checkPosition(this.currentPosition - 1)
        }
    }

    checkPosition(newPos) {
        const up = newPos > this.currentPosition
        newPos = up ? Math.min(newPos, this.items.length - 1) : Math.max(newPos, 0)
        const elements = Array.from(this.tableBody.children) 
        const element = elements[this.currentPosition]
        if (element)
            element.classList.remove("isCurrent")
        const newElement = elements[newPos]
        newElement.classList.add("isCurrent")
        this.currentPosition = newPos
    }
}

customElements.define("virtual-table", VirtualTable)