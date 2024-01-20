document.addEventListener("DOMContentLoaded", function () {
    // 搜索框函数
    searchFunc();
    // 登录函数
    loginFunc();
    // 是否已登录，并设置对应地址
    fetch("/api/isLogin")
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("server exception")
            }
        })
        .then((data) => {
            const bookmarksMenu = document.querySelector("ul a.bookmarks");
            if (data.isLogin) {
                bookmarksMenu.href = "/bookmark/history"
            } else {
                bookmarksMenu.addEventListener("click", (e) => {
                    e.preventDefault()
                    document.querySelector(".all-mask").classList.add("show")
                })
            }
        })
        .catch(err => {
            location.href = location.protocol + "//" + location.host + "/err"
        })

    // 搜索框函数
    function searchFunc() {
        // 渲染空搜索篮
        const popularNovelUrl = "/api/novel/findPopularNovel"
        searchAjaxAndRender(popularNovelUrl, "Popular searches")

        // 搜索栏
        const searchInput = document.querySelector(".search")
        const searchRes = document.querySelector(".search-result")
        const headerLeft = document.querySelector("header .left")
        const headerRight = document.querySelector("header .right")
        const headerW1000 = document.querySelector("header .w-1000")
        const searchMask = document.querySelector(".search-mask")
        searchInput.addEventListener("click", function () {
            headerLeft.style.width = "0"
            headerLeft.style.visibility = "hidden"
            headerRight.style.display = "none"
            headerW1000.style.justifyContent = "center"
            searchRes.style.transition = ".5s"
            searchRes.style.visibility = "visible"
            searchRes.style.width = "800px"
            searchMask.classList.add("show")
            searchInput.classList.add("active")
            // 获取下级元素
            if (!searchInput.parentElement.querySelector(".icon-close.active")) {
                const iconCloseEle = document.querySelector(".icon-close");
                iconCloseEle.classList.add("active")
                iconCloseEle.addEventListener("click", clearSearch)
            }
        })

        let searchTimer = null //定时器，过300ms才请求服务器
        let searchActiveNum = 0 //默认选择搜索出来的第一个
        searchInput.addEventListener("keyup", function (e) {
            const novelsAEles = searchRes.querySelectorAll("li a")

            if (e.key === "Escape") {
                clearSearch()
                return;
            }
            // 回车跳转页面
            if (e.key === "Enter") {
                if (searchActiveNum < 0) return
                if (searchActiveNum === 0) {
                    location.href = novelsAEles[0].href
                }
                location.href = novelsAEles[searchActiveNum - 1].href
            }

            // 如果按下
            if (e.key === "ArrowDown") {
                if (novelsAEles.length < 1) return;
                const resFcsA = searchRes.querySelector(".res-fcs")
                resFcsA && resFcsA.classList.remove("res-fcs")
                searchActiveNum++
                if (searchActiveNum > novelsAEles.length) searchActiveNum = 1
                novelsAEles[searchActiveNum - 1].classList.add("res-fcs")
                return;
            }

            // 如果按上
            if (e.key === "ArrowUp") {
                if (novelsAEles.length < 1) return;
                const resFcsA = searchRes.querySelector(".res-fcs")
                resFcsA && resFcsA.classList.remove("res-fcs")
                searchActiveNum--
                if (searchActiveNum < 1) searchActiveNum = novelsAEles.length
                novelsAEles[searchActiveNum - 1].classList.add("res-fcs")
                return;
            }

            // 每次输的时候都清空定时器
            searchTimer && clearTimeout(searchTimer)

            // 定时器（300ms后执行）
            searchTimer = setTimeout(searchRender, 300)

            // 如果不存在就转圈
            searchRes.querySelector(".loading")
            || (searchRes.innerHTML = `
          <div style="height: 200px; display: flex; justify-content: center; align-items: center">
            <div class="loading"></div>
          </div>`)
        })

        // 将空搜索存入防止重复请求
        let popularSearchHTMLStr = ""

        // 发起请求和渲染
        function searchRender() {
            // 选择置为0
            searchActiveNum = 0
            const searchValue = searchInput.value.trim()
            // 为空设置推荐
            if (!searchInput.value || searchValue.trim() === "") {
                if (popularSearchHTMLStr) {
                    searchRes.innerHTML = popularSearchHTMLStr
                    return;
                }
                const url = "/api/novel/findPopularNovel"
                searchAjaxAndRender(url, "Popular searches")
                return
            }

            const url = "/api/novel/findNovel/" + searchValue
            searchAjaxAndRender(url, "Suggested searches", searchValue)
        }

        // 发送ajax并渲染
        function searchAjaxAndRender(url, title, searchValue) {
            const http = new XMLHttpRequest();

            http.open("GET", url, true)
            http.onload = function () {
                if (http.status === 200) {
                    const novels = JSON.parse(http.response)
                    if (!novels.length) {
                        searchRes.innerHTML = ""
                        return
                    }
                    let searchResContent = `<h3>${title}</h3>`
                    searchResContent += '<ul>'
                    novels.forEach((novel) => {
                        let novelNameWrap = novel.Name
                        // 给搜索的字加颜色
                        if (searchValue) {
                            const startIndex = novel.Name.toLowerCase().indexOf(searchValue.toLowerCase())
                            const endIndex = startIndex + searchValue.length
                            novelNameWrap = novel.Name.substring(0, startIndex)
                                + "<strong>" + novel.Name.substring(startIndex, endIndex) + "</strong>"
                                + novel.Name.substring(endIndex, novel.Name.length)
                        }
                        searchResContent += `<li><a ${searchValue ? 'class="fz-16"' : ""} href="/novel/${novel.ID}">${novelNameWrap}</a></li>`
                    })
                    searchResContent += "</ul>"
                    searchRes.innerHTML = searchResContent
                    // 如果是
                    if (!popularSearchHTMLStr && !searchValue) {
                        popularSearchHTMLStr = searchResContent
                    }
                } else {
                    location.href = location.protocol + "//" + location.host + "/err"
                }
            }
            http.send()
        }

        // 清空
        searchMask.addEventListener("click", clearSearch)

        function clearSearch() {
            searchAjaxAndRender(popularNovelUrl, "Popular searches")
            headerLeft.removeAttribute("style")
            headerRight.removeAttribute("style")
            headerW1000.removeAttribute("style")
            searchRes.removeAttribute("style")
            searchMask.classList.remove("show")
            searchInput.classList.remove("active")
            searchInput.value = ""
            const closeSpan = document.querySelector(".icon-close")
            closeSpan.classList.remove("active")
        }
    }

    // 登录函数
    function loginFunc() {
        // 登录
        const loginBtn = document.querySelector(".login-btn")
        const allMask = document.querySelector(".all-mask")
        const loginWrapper = document.querySelector(".login-wrapper")
        const loginClose = document.querySelector(".login-wrapper .close")
        if (loginBtn) {
            loginBtn.addEventListener("click", addShow)
            loginClose.addEventListener("click", removeShow)
            allMask.addEventListener("click", removeShow)
            loginWrapper.addEventListener("click", stopPrn)

            function stopPrn(e) {
                e.stopPropagation()
            }

            function addShow(e) {
                e.preventDefault()
                allMask.classList.add("show")
            }

            function removeShow(e) {
                e.preventDefault()
                allMask.classList.remove("show")
            }

            //修改登录url
            const loginBthEles = document.querySelectorAll(".login-wrapper .tl-btn");
            loginBthEles.forEach(ele => {
                ele.href += "?redirectPath=" + location.pathname
            })
        }

        //修改登出url
        const signOut = document.querySelector(".picture-select .sinOut")
        if (signOut) {
            signOut.href += "?redirectPath=" + location.pathname
        }

        //用户点击弹出关闭事件
        const picture = document.querySelector(".picture")
        const pictureSelect = document.querySelector(".picture-select")
        if (picture) {
            picture.addEventListener("click", (e) => {
                e.preventDefault()
                // 阻止继续冒泡
                e.stopPropagation()
                if (pictureSelect.classList.contains("active")) {
                    pictureSelect.classList.remove("active")
                } else {
                    pictureSelect.classList.add("active")
                }
            })
            //点击外面
            const body = document.body;
            body.addEventListener("click", () => {
                pictureSelect.classList.remove("active")
            })
            //阻止内容自身冒泡
            pictureSelect.addEventListener("click", (e) => {
                e.stopPropagation()
            })
        }
    }

})