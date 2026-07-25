import '../src/index.js'

const tableView = document.getElementById("virtual-table") 
const fill = document.getElementById("fill")

tableView.addEventListener("create-rowitem", evt => {
    const tr = document.createElement("tr")
    const td = document.createElement("td")
    td.id = "td"
    tr.appendChild(td)
    evt.detail.tr = tr
})
tableView.addEventListener("render-rowitem", evt => {
    const tr = evt.detail.tr
    const td = tr.querySelector('#td')
    td.textContent = `Das muss so sein: ${evt.detail.item}`
})

fill.onclick = () => {
    tableView.setItems(Array.from({ length: 7 }, (value, index) => `Eintrag Numero: ${index}`))
    tableView.focus()
}

tableView.focus()