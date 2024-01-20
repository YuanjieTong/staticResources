// const rotationImgs = ["../img/my_1.jpg", "../img/my_2.jpeg", "../img/my_3.jpg"]


// document.addEventListener("DOMContentLoaded", function () {
//   const rotationA = document.querySelector(".rotation a")
//   const rotationUL = document.querySelector(".rotation a ul")

//   // 点击跳转
//   rotationUL.addEventListener("click", function (e) {

//     if (e.target.tagName === "LI") {
//       //先更换图片
//       const dataID = +e.target.dataset.id
//       rotationA.style.backgroundImage = `url(${rotationImgs[dataID]})`

//       //清空旧的li active
//       const oldActive = document.querySelector(".rotation a ul .active")
//       oldActive.classList.remove("active")
//       //选中的active
//       e.target.classList.add("active")
//     }
//   })

//   // 定时任务
//   let timerId = setInterval(() => {
//     next()
//   }, 2000);

//   // 如果移入图片定时器停止
//   rotationA.addEventListener("mouseenter", function () {
//     clearInterval(timerId)
//   })

//   // 如果移出图片定时器开启
//   rotationA.addEventListener("mouseleave", function () {
//     timerId = setInterval(() => {
//       next()
//     }, 5000);
//   })

//   // 下一张
//   function next() {
//     // 找到active，获取dataId
//     const oldActive = document.querySelector(".rotation a ul .active")
//     const oldDataID = +oldActive.dataset.id
//     const newDataID = oldDataID < rotationImgs.length - 1 ? oldDataID + 1 : 0
//     // 清空旧的active
//     oldActive.classList.remove("active")
//     // 选中新的增加active
//     const newActive = document.querySelector(`.rotation a ul [data-id="${newDataID}"]`)
//     // 替换选中
//     newActive.classList.add("active")
//     //替换图片
//     rotationA.style.backgroundImage = `url(${rotationImgs[newDataID]})`
//   }
// })