document.addEventListener("DOMContentLoaded", () => {
  bindSwiper(".banner", { isTimer: true, isLoopDisable: false })
  const list = document.querySelectorAll(".title-list")
  for (let i = 0; i < list.length; i++) {
    str = `.title-list-${i}`
    bindSwiper(str, { slidesPerView: 6, gap: 20 })
  }

})
