import '../src/index.js'

const tableView = document.getElementById("virtual-table") 
const fill = document.getElementById("fill")

fill.onclick = () => {
    tableView.setItems(Array.from({ length: 70 }, (value, index) => `Eintrag Numero: ${index}`))
    tableView.focus()
}

tableView.focus()