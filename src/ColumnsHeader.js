export class ColumnsHeader {
    constructor(tableHeadRow) {
        this.tableHeadRow = tableHeadRow
        this.tableHeadRow.addEventListener("mousemove", evt => this.onMouseMove(evt))
        this.tableHeadRow.addEventListener("mousedown", evt => this.onMouseDown(evt))
        this.columnsCount = 0
    }

    setColumnCount(count) { this.columnsCount = count }

    onMouseMove(evt) {
        const element = evt.target.tagName == "TH" ? evt.target : evt.target.parentElement?.parentElement
        const thWidth = element.clientWidth + element.clientLeft
        const mouseX = evt.offsetX + element.clientLeft
        const trRect = element.parentElement?.getBoundingClientRect()
        const absoluteRight = trRect.width + trRect.x                
        let dr = 
            (mouseX < 3 || mouseX > thWidth - 4) 
            && (evt.pageX - trRect.x > 4)
            && (evt.pageX < absoluteRight - 4)
        if (dr && evt.target.tagName != "TH") {
            const first = evt.target.style.flexGrow == "1"
            if (first && mouseX > thWidth - 4 || !first && mouseX < 3)
                dr = false
        }
        this.draggingReady = dr
        document.body.style.cursor = dr ? 'ew-resize' : 'auto'
    }

    onMouseDown(evt) {
        if (!this.draggingReady) 
            return
        this.dragging = true
        const th = evt.target
        const mouseX = evt.offsetX + th.clientLeft
        const dragleft = mouseX < 3

        const startDragPosition = evt.pageX
        const targetColumn = th.closest("th")

        const currentHeader = dragleft ? targetColumn?.previousElementSibling : targetColumn
        if (!currentHeader)
            return
        const nextHeader = currentHeader.nextElementSibling
        if (!nextHeader)
            return

        const currentLeftWidth = currentHeader?.offsetWidth
        const sumWidth = currentLeftWidth + nextHeader?.offsetWidth

        const onmove = (evt) => {
            document.body.style.cursor = 'ew-resize'
            let diff = evt.pageX - startDragPosition
            if (currentLeftWidth + diff < 15)
                diff = 15 - currentLeftWidth
            else if (diff > sumWidth - currentLeftWidth - 15)
                diff = sumWidth - currentLeftWidth - 15

            const getCombinedWidth = (column, nextColumn) => {
                const firstWidth = 
                    column.style.width
                    ? parseFloat(column.style.width.substring(0, column.style.width.length - 1))
                    : 100 / this.columnsCount
                const secondWidth = 
                    nextColumn.style.width
                    ? parseFloat(nextColumn.style.width.substring(0, nextColumn.style.width.length - 1))
                    : 100 / this.columnsCount
                return firstWidth + secondWidth
            }                        

            const combinedWidth = getCombinedWidth(currentHeader, nextHeader)

            let leftWidth = currentLeftWidth + diff
            let rightWidth = sumWidth - currentLeftWidth - diff
            const factor = combinedWidth / sumWidth
            leftWidth = leftWidth * factor
            rightWidth = rightWidth * factor

            currentHeader.style.width = leftWidth + '%'
            nextHeader.style.width = rightWidth + '%'
            evt.preventDefault()
        }

        const onup = (evt) => {
            
            const preventClickOnResetting = () => setTimeout(() => dragging.current = false)
            
            const getWidths = () => {
                const ths = Array.from(targetColumn.parentElement.children)
                return ths.map(th => 
                    th.style.width 
                        ? parseFloat(th.style.width.substring(0, th.style.width.length - 1))
                        : 100 / columns.length
                )
            }

            window.removeEventListener('mousemove', onmove)
            window.removeEventListener('mouseup', onup)
            document.body.style.cursor = 'auto'
            //setColumnWidths(getWidths())
            preventClickOnResetting()
            evt.preventDefault()
            evt.stopPropagation()
        }

        window.addEventListener('mousemove', onmove)
        window.addEventListener('mouseup', onup)
        evt.preventDefault()
        evt.stopPropagation()
    }
}