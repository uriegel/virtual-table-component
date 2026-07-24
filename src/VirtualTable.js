// TODO WebserverLight with website request
// TODO mouse select
// TODO Resizing
// TODO mouse scrolling 
// TODO Scrollbar web component to scroll through this list
// TODO Slot to render a new cell in the program with recycling

export class VirtualTable extends HTMLElement {

    constructor() {
        super()
        this.itemHeight = 0
        this.currentPosition = 0
        this.offset = 0
        this.visualItemsCount = 0
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
            this.measure()

        while (this.tableBody.lastElementChild) 
            this.tableBody.removeChild(this.tableBody.lastElementChild)

        const count = this.getVisualItems()

        items
            .filter((_, idx) => idx <= count)
            .forEach((item, idx) => {
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
        this.itemHeight = tr.offsetHeight
        this.visualItemsCount = this.getVisualItems()
    }

    getVisualItems() {
        return Math.floor(this.main.clientHeight / this.itemHeight)
    }

    onResize() {
        console.log("Resized", this.main.clientHeight, this.visualItemsCount)
    }

    onKeyDown(evt) {
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
        else if (evt.key == "PageDown") {
            evt.preventDefault()
            evt.stopPropagation()
            this.checkPosition(this.currentPosition + this.visualItemsCount - 1)
        }
        else if (evt.key == "PageUp") {
            evt.preventDefault()
            evt.stopPropagation()
            this.checkPosition(this.currentPosition - this.visualItemsCount + 1)
        }
        else if (evt.key == "End") {
            evt.preventDefault()
            evt.stopPropagation()
            this.checkPosition(this.items.length - 1)
        }
        else if (evt.key == "Home") {
            evt.preventDefault()
            evt.stopPropagation()
            this.checkPosition(0)
        }
    }

    checkPosition(newPos) {
        const up = newPos < this.currentPosition
        newPos = up ? Math.max(newPos, 0) : Math.min(newPos, this.items.length - 1)
        const delta =this.scrollIntoView(newPos, up)
        const elements = Array.from(this.tableBody.children) 
        const element = elements[this.currentPosition - this.offset]
        if (element)
            element.classList.remove("isCurrent")
        const newElement = elements[newPos - this.offset]
        newElement.classList.add("isCurrent")
        this.currentPosition = newPos
    }

    scrollIntoView(newPos, up) {
        if (!up) {
            const offset = newPos - this.offset - this.visualItemsCount + 1
            if (offset >= 0) {
                const elements = Array.from(this.tableBody.children) 
                for (let i = 0; i < offset; i++) { 
                    const recycled = this.tableBody.firstElementChild
                    recycled.remove()
                    recycled.classList.remove("isCurrent")
                    recycled.firstChild.textContent = this.items[this.offset + this.visualItemsCount + 1 + i] 
                    this.tableBody.appendChild(recycled)
                }

                this.offset += offset
                return offset
            }
        } else {
            const offset = newPos - this.offset
            if (offset < 0) {
                const elements = Array.from(this.tableBody.children) 
                if (newPos >= 0) {
                    for (let i = 0; i < -offset; i++) {
                        const recycled = this.tableBody.lastElementChild
                        recycled.remove()
                        recycled.classList.remove("isCurrent")
                        recycled.firstChild.textContent = this.items[this.offset - 1 - i]
                        this.tableBody.insertBefore(recycled, this.tableBody.firstElementChild)
                    }
                }
                this.offset += offset
                return offset
            }
        }
        return 0
    }
}

customElements.define("virtual-table", VirtualTable)