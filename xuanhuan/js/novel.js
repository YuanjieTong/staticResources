document.addEventListener("DOMContentLoaded", () => {
    // 时间格式化
    const timeSpans = document.querySelectorAll(".chapter-ol li a span")
    timeSpans.forEach(element => {
        const unixMill = element.innerText + "000"
        const date = new Date(parseInt(unixMill))
        element.innerText = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDay()}`
    });

    // 切换Chapters和About
    const navActive = document.querySelector(".tab-nav .active")
    const navLine = document.querySelector(".tab-nav .line")
    const tabContents = document.querySelectorAll(".tab-content")
    navLine.style.width = `${navActive.clientWidth}px`
    navLine.style.left = `${navActive.offsetLeft}px`

    const tabNav = document.querySelector(".tab-nav")
    tabNav.addEventListener("click", (e) => {
        if (e.target.className.includes("opt")) {
            const oldActive = document.querySelector(".tab-nav .active")
            // 如果点的是已经激活的直接返回
            if (oldActive === e.target) return
            // 修改nav样式
            oldActive.classList.remove("active")
            e.target.classList.add("active")
            navLine.style.width = `${e.target.clientWidth}px`
            navLine.style.left = `${e.target.offsetLeft}px`

            //修改内容
            const activeId = e.target.dataset.id

            const oldActiveTabContent = document.querySelector(".tab-content.active")
            //如果点的是已经激活的，直接返回
            if (oldActiveTabContent === tabContents[activeId]) return
            //去掉旧的active
            oldActiveTabContent.classList.remove("active")
            //设置新的active
            tabContents[activeId].classList.add("active")
        }
    })
})