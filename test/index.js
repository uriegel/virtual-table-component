import '../src/index.js'

const tableView = document.getElementById("virtual-table") 
tableView.setStylesheet("styles/tableview.css")
const fill = document.getElementById("fill")

tableView.setColumns([
    { text: "Name", sort: onTextSort }, 
    { text: "Date" }, 
    { text: "Size", isRightAligned: true, sort: onSizeSort }, 
])

tableView.addEventListener("create-rowitem", evt => {
    const template = document.getElementById('item')
    const tr = template.content.cloneNode(true).firstElementChild
    evt.detail.tr = tr
})
tableView.addEventListener("measure-rowitem", evt => {
    const tr = evt.detail.tr
    const img = tr.querySelector('#img')
    const sp = tr.querySelector('#text')
    sp.textContent = 'Measuring...'
})
tableView.addEventListener("render-rowitem", evt => {
    const tr = evt.detail.tr
    if (evt.detail.item == "Item with index: 10")
        tr.classList.add("hidden") 
    else
        tr.classList.remove("hidden") 
    const number = evt.detail.item.name.slice(-1)
    const img = tr.querySelector('#img')
    img.src = `image/icon${number}`
    const sp = tr.querySelector('#text')
    sp.textContent = evt.detail.item.name
    const element2 = tr.querySelector('#item2')
    element2.textContent = evt.detail.item.date
    const element3 = tr.querySelector('#item3')
    element3.textContent = `${evt.detail.item.index}`
})

fill.onclick = () => {
    tableView.setItems(Array.from({ length: 70_000 }, (value, index) => ({
        name: `Item with index: ${index}`,
        date: "12/7/2026 14:18",
        index: index
    })))
    tableView.focus()
}

tableView.addEventListener("process-selected", evt => {
    console.log("Process", evt.detail.pos)
})

function onTextSort() {
    console.log("On text sort")
}

function onSizeSort() {
    console.log("On size sort")
}

tableView.focus()