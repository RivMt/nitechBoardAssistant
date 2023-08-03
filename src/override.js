const classIframe = "nsb-viewer-content"

/// Override `f_open` in webpage
function f_open(width, height, target, next, option) {
    // Cancel timeout called from `detail`
    const dummy = setTimeout(() => {}, 1)
    for(let i=0; i < 2; i++) {
        clearTimeout(dummy-i)
    }
    // Generate URI (copied from webpage)
    let	uri= document.form1.action
        +	"?uri="			+ document.form1.uri.value
        +	"&next_uri="	+ next;
    if (option !== "") {
        uri	= uri + "&" + option;
    }

    const iframe = document.querySelector("." + classIframe)
    if (iframe === null) {
        console.error("Disable the extension to read article")
        return
    }
    iframe.setAttribute("src", uri)
    return window
}

/// Override `resCheckRead` in article webpage
function resCheckRead() {}