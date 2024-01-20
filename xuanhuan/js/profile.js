document.addEventListener("DOMContentLoaded", () => {
    const username = document.querySelector("#username");
    const email = document.querySelector("#email")
    const btn = document.querySelector(".btn button")
    const form = document.querySelector(".profile-form")

    username.addEventListener("keyup", inputChange)
    email.addEventListener("keyup", inputChange)
    username.addEventListener("blur", inputCheck)
    email.addEventListener("blur", inputCheck)

    // 如果存在alarm，禁用按钮，禁用提交
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        if (document.querySelector(".profile-form .alarm")) {
            btn.disabled = true
        }
        // 发起http请求
        const http = new XMLHttpRequest();
        const url = location.href
        http.open("put", url, true)
        http.setRequestHeader('content-type', "application/json")
        http.onload = function () {
            if (http.status === 200) {
                successAlert("Changes have benn saved")
                e.target.querySelectorAll(".right").forEach(ele => {
                    ele.classList.remove("right")
                })
                btn.disabled = true

                const userinfo = JSON.parse(http.response)
                username.dataset.old = userinfo.Username
                email.dataset.old = userinfo.Email
            } else {
                errorAlert(http.response)
            }
        }
        http.send(JSON.stringify({Username: username.value, Email: email.value}))
    })

    // 校验与old是否相等，相等禁用，不相等可以提交
    function inputChange(e) {
        if (username.value === username.dataset.old && email.value === email.dataset.old) {
            btn.disabled = true
            return
        }

        btn.disabled = false

        // 只有存在了right或者alarm后才校验
        if (!e.target.classList.contains("right") && !e.target.classList.contains("alarm")) {
            return;
        }

        // 如果输对了去掉告警并success
        const regex = new RegExp(e.target.dataset.pattern)
        if (regex.test(e.target.value)) {
            btn.disabled = false

            e.target.classList.add("right")
            e.target.classList.remove("alarm")

            const spanEle = e.target.parentElement.querySelector("span")
            if (spanEle) {
                e.target.parentElement.removeChild(spanEle)
            }
            return;
        }

        // 如果没有匹配，去掉right
        if (e.target.classList.contains("right")) {
            btn.disabled = true

            e.target.classList.remove("right")
            e.target.classList.add("alarm")

            // 如果有了就不加span了
            if (e.target.parentElement.querySelector("span")) {
                return
            }

            const spanEle = document.createElement("span");
            spanEle.innerText = e.target.dataset.alarm
            e.target.parentElement.appendChild(spanEle)
        }

    }

    function inputCheck(e) {
        if (username.value === username.dataset.old && email.value === email.dataset.old) {
            btn.disabled = true
            return
        }
        const regex = new RegExp(e.target.dataset.pattern)
        // 正则校验, 匹配了就去掉告警
        if (regex.test(e.target.value)) {
            btn.disabled = false

            e.target.classList.remove("alarm")

            const spanEle = e.target.parentElement.querySelector("span")
            if (spanEle) {
                e.target.parentElement.removeChild(spanEle)
            }
            return;
        }

        // 正则校验没有匹配， 增加告警
        btn.disabled = true
        e.target.classList.add("alarm")

        // 如果有了就不加span了
        if (e.target.parentElement.querySelector("span")) {
            return
        }
        const spanEle = document.createElement("span");
        spanEle.innerText = e.target.dataset.alarm
        e.target.parentElement.appendChild(spanEle)

    }
})