export class Scrollbar extends HTMLElement {

    constructor() {
        super()
    }
    
    connectedCallback() {
        this.main = document.createElement("div")
        this.id = "scrollbar"
        this.appendChild(this.main)

        const style = document.createElement('style')
        style.textContent = `
            #scrollbar {
                width: 16px;
                right: 0px;
                position: absolute;
                overflow: hidden;
                background-color: transparent;
                outline-width: 0px;
                outline-style: none;    
                -webkit-user-select: none;
                user-select: none;
                display: flex;
                flex-direction: column;
                transition: transform 0.3s, Opacity 0.3s;
                transform-origin: right top;
                bottom: 0px;    
            }`

        this.appendChild(style)        
    }

    setHeight(height) {
        this.height = height
        this.setAttribute("height", height)
    }
}

customElements.define("scroll-bar", Scrollbar)
