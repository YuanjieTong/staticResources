function successAlert(prompt) {
    alert(prompt,"#217d19")
}
function errorAlert(prompt) {
    alert(prompt,"#f34e68")
}

function alert(prompt, color) {
    const alertSuccessEle = document.createElement("div")
    alertSuccessEle.innerText = prompt
    // css样式
    alertSuccessEle.style.position = "fixed"
    alertSuccessEle.style.backgroundColor = color
    alertSuccessEle.style.color = "white"
    alertSuccessEle.style.fontSize = "14px"
    alertSuccessEle.style.padding = "8px 12px"
    alertSuccessEle.style.top = "0"
    alertSuccessEle.style.left = "50%"
    alertSuccessEle.style.transform = "translate(-50%, 30px)"
    alertSuccessEle.style.borderRadius = "5px"
    alertSuccessEle.style.fontFamily = "Helvetica, sans-serif"
    alertSuccessEle.style.transition = ".3s"
    alertSuccessEle.style.visibility = "hidden"
    alertSuccessEle.style.opacity = "0"
    alertSuccessEle.style.zIndex = "2000"

    document.body.appendChild(alertSuccessEle)

    setTimeout(() => {
        alertSuccessEle.style.visibility = "visible"
        alertSuccessEle.style.transform = "translate(-50%, 50px)"
        alertSuccessEle.style.opacity = ".9"
    })

    // 定时器2s后删除
    setTimeout(() => {
        alertSuccessEle.style.visibility = "hidden"
        alertSuccessEle.style.transform = "translate(-50%, 40px)"
        alertSuccessEle.style.opacity = "0"
        setTimeout(() => {
            document.body.removeChild(alertSuccessEle)
        },300)
    }, 1000)
}