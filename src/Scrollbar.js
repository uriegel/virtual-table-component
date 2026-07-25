const minScrollbarGripSize = 20

export class Scrollbar extends HTMLElement {

    constructor() {
        super()
        this.count = 0
        this.displayCount = 0
        this.range = 1
        this.gripHeight = 0
    }
    
    connectedCallback() {
        this.id = "scrollbar"
        this.main = document.createElement("div")
        this.main.id = "grip"
        this.appendChild(this.main)

        const style = document.createElement('style')
        style.textContent = `
            #scrollbar {
                width: var(--vtc-scrollbar-width);
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
            }
            #grip {
                position: absolute;
                border-radius: var(--vtc-scrollbar-grip-radius);
                background-color: var(--vtc-scrollbar-grip-color);
                width: var(--vtc-scrollbar-grip-width);
                right: var(--vtc-scrollbar-grip-right);
                transition: background-color 0.5s, width 0.5s;    
            }
            #grip:active {
                background-color: var(--vtc-scrollbar-grip-active-color);
                width: calc(100% - var(--vtc-scrollbar-grip-right));
                transition: background-color 0s;
            }
            #scrollbar:hover #grip {
                width: calc(100% - var(--vtc-scrollbar-grip-right));
            }`

        this.appendChild(style)        
    }

    setHeight(headerHeight) {
        this.style.setProperty('height', `calc(100% - ${headerHeight}px)`);
    }

    setCount(val) {
        this.count = val
        this.range = this.setRange()
        this.gripHeight = this.getGripHeight()
    }

    setDisplayCount(val) {
        this.displayCount = val
        this.range = this.setRange()
        this.gripHeight = this.getGripHeight()
    }

    setRange() {
        return Math.max(0, this.count - this.displayCount)
    } 

    getGripHeight() {
        const height = Math.max(this.offsetHeight * (this.displayCount / this.count || 1), minScrollbarGripSize)
        this.main.style.setProperty('height', `${height}px`)
        return height
    }
    // getScrollbarGripTop() {
    //     return (this.offsetHeight - gripHeight) * (scrollPosition / this.range) 
    // } 

}

customElements.define("scroll-bar", Scrollbar)
