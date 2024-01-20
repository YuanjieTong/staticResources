document.addEventListener("DOMContentLoaded", () => {
    // 为了防止某个地方有冒泡中断，就不使用代理
    const aList = document.querySelectorAll("a.need-login");
    // 阻止默认
    aList.forEach(ele => {
        ele.addEventListener("click",(e) => {
            e.preventDefault()
        })
    })
})