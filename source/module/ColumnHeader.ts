type Column = {
    text: string
    subColumn: string
    isRightAligned: boolean
    sortable: boolean
    dragging: boolean
}

type SortParam = {
    index: number,
    subColumn: boolean
    descending: boolean
}

export class ColumnsHeader {
    constructor(tableHeadRow: HTMLTableSectionElement, sort: ()=>void, onColumnWidthChange: ()=>void) {
        this.tableHeadRow = tableHeadRow
        this.tableHeadRow.addEventListener("mousemove", evt => this.onMouseMove(evt))
        this.tableHeadRow.addEventListener("mousedown", evt => this.onMouseDown(evt))
        this.sortIndex = -1
        this.sortDescending = true // to initial turn to false
        this.sort = sort
        this.onColumnWidthChange = onColumnWidthChange
        this.columns = []
        this.draggingReady = false
        this.dragging = false
        this.subColumn = false
    }

    setColumns(columns: Column[]) {
        this.columns = columns
        while (this.tableHeadRow.lastElementChild as HTMLTableCaptionElement)
            this.tableHeadRow.removeChild(this.tableHeadRow.lastElementChild as HTMLTableCaptionElement)
        columns.forEach((item, idx) => {
            const th = document.createElement("th")
            th.onclick = evt => this.onColumnClick(idx, evt)
            if (item.subColumn) {
                const div = document.createElement("div") 
                div.classList.add("subColumns")
                const col = document.createElement("span") 
                col.textContent = item.text
                col.classList.add("subColumnName")
                div.appendChild(col)
                const subcol = document.createElement("span") 
                subcol.textContent = item.subColumn
                subcol.classList.add("subColumn")
                div.appendChild(subcol)
                th.appendChild(div)
            } else 
                th.textContent = item.text
            if (item.isRightAligned)
                th.classList.add("rightAligned")
            else
                th.classList.remove("rightAligned")
            if (item.sortable)
                th.classList.add("sortable")
            this.tableHeadRow.appendChild(th)
        })
    }

    setWidths(widths: number[]) {
        const ths = Array.from(this.tableHeadRow.children) as HTMLTableSectionElement[]
        ths.forEach((th, idx) => th.style.width = `${widths[idx]}%`)
    }

    isRightAligned(idx: number) { return this.columns[idx]?.isRightAligned }

    private onMouseMove(evt: MouseEvent) {
        const target = evt.target as HTMLElement;
        const element = target.tagName == "TH" ? target : target.parentElement?.parentElement
        const thWidth = (element?.clientWidth || 0) + (element?.clientLeft || 0)
        const mouseX = evt.offsetX + (element?.clientLeft || 0)
        const trRect = element?.parentElement?.getBoundingClientRect()
        const absoluteRight = trRect ? trRect.width + trRect.x : 0
        let dr = 
            (mouseX < 3 || mouseX > thWidth - 4) 
            && (evt.pageX - trRect!.x > 4)
            && (evt.pageX < absoluteRight - 4)
        if (dr && target.tagName != "TH") {
            const first = target.style.flexGrow == "1"
            if (first && mouseX > thWidth - 4 || !first && mouseX < 3)
                dr = false
        }
        this.draggingReady = dr
        document.body.style.cursor = dr ? 'ew-resize' : 'auto'
    }

    private onMouseDown(evt: MouseEvent) {
        if (!this.draggingReady) 
            return
        this.dragging = true
        const th = evt.target as HTMLElement
        const mouseX = evt.offsetX + (th?.clientLeft || 0)
        const dragleft = mouseX < 3

        const startDragPosition = evt.pageX
        const targetColumn = th.closest("th")

        const currentHeader = dragleft ? targetColumn?.previousElementSibling as HTMLTableCellElement : targetColumn
        if (!currentHeader)
            return
        const nextHeader = currentHeader.nextElementSibling as HTMLTableCellElement
        if (!nextHeader)
            return

        const currentLeftWidth = currentHeader?.offsetWidth
        const sumWidth = currentLeftWidth + nextHeader?.offsetWidth

        const onmove = (evt: MouseEvent) => {
            document.body.style.cursor = 'ew-resize'
            let diff = evt.pageX - startDragPosition
            if (currentLeftWidth + diff < 15)
                diff = 15 - currentLeftWidth
            else if (diff > sumWidth - currentLeftWidth - 15)
                diff = sumWidth - currentLeftWidth - 15

            const getCombinedWidth = (column: HTMLTableCellElement, nextColumn: HTMLTableCellElement) => {
                const firstWidth = 
                    column.style.width
                    ? parseFloat(column.style.width.substring(0, column.style.width.length - 1))
                    : 100 / this.columns.length
                const secondWidth = 
                    nextColumn.style.width
                    ? parseFloat(nextColumn.style.width.substring(0, nextColumn.style.width.length - 1))
                    : 100 / this.columns.length
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

        const onup = (evt: MouseEvent) => {
            
            const preventClickOnResetting = () => setTimeout(() => this.dragging = false)
            
            const getWidths = () => {
                const ths = Array.from(this.tableHeadRow.children) as HTMLTableCaptionElement[]
                return ths.map(th => 
                    th.style.width 
                        ? parseFloat(th.style.width.substring(0, th.style.width.length - 1))
                        : 100 / this.columns.length
                )
            }

            window.removeEventListener('mousemove', onmove)
            window.removeEventListener('mouseup', onup)
            document.body.style.cursor = 'auto'
            if (this.onColumnWidthChange)
                this.onColumnWidthChange(getWidths())
            preventClickOnResetting()
            evt.preventDefault()
            evt.stopPropagation()
        }

        window.addEventListener('mousemove', onmove)
        window.addEventListener('mouseup', onup)
        evt.preventDefault()
        evt.stopPropagation()
    }

    private onColumnClick(idx: number, evt: PointerEvent) {
        if (this.dragging)
            return
        if (this.columns[idx]?.sortable) {
            const ths = Array.from(this.tableHeadRow.children) as HTMLElement[]
            if (this.sortIndex != -1) {
                if (!this.columns[this.sortIndex]?.subColumn)
                    ths[this.sortIndex]?.classList.remove(this.sortDescending ? "sortDescending" : "sortAscending")
                else {
                    if (this.subColumn)
                        (ths[this.sortIndex]?.firstChild as HTMLElement).lastElementChild?.classList.remove(this.sortDescending ? "sortDescending" : "sortAscending")
                    else
                        ((ths[this.sortIndex]?.firstChild as HTMLElement).firstChild as HTMLElement)?.classList.remove(this.sortDescending ? "sortDescending" : "sortAscending")
                }
            }
            this.sortDescending = !this.sortDescending
            this.subColumn = false
            if (!this.columns[idx].subColumn)
                ths[idx]?.classList.add(this.sortDescending ? "sortDescending" : "sortAscending")
            else {
                const target =evt.target as HTMLElement
                if (target.classList.contains("subColumn")) {
                    this.subColumn = true
                    target.classList.add(this.sortDescending ? "sortDescending" : "sortAscending")
                } else 
                    target.classList.add(this.sortDescending ? "sortDescending" : "sortAscending")
            }
            
            if (this.sort)
                this.sort({
                    index: idx,
                    subColumn: this.subColumn,
                    descending: this.sortDescending
                })
            this.sortIndex = idx
        }
    }

    private tableHeadRow: HTMLTableSectionElement
    private sortIndex: number
    private sortDescending: boolean
    private sort: (param: SortParam) => void
    private onColumnWidthChange: (cb: Number[])=>void
    private columns: Column[]
    private draggingReady: boolean
    private dragging: boolean
    private subColumn: boolean
}