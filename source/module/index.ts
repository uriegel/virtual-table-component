export * from './VirtualTable.js'

export async function loadStylesheet(cssUrl: URL) {
    const res = await fetch(cssUrl)
    const cssText = await res.text()
    // Create style element
    const style = document.createElement('style')
    style.textContent = cssText
    // Append style to shadow root
    return style
}
 