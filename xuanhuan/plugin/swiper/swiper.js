function initReq(req = {}) {
  if (req.isTimer === undefined) {
    req.isTimer = false
  }
  if (req.timeout === undefined) {
    req.timeout = 5000
  }
  if (req.activeIndex === undefined) {
    req.activeIndex = 0
  }
  if (req.isLoopDisable === undefined) {
    req.isLoopDisable = true
  }
  if (req.isStick === undefined) {
    req.isStick = true
  }
  if (req.slidesPerView === undefined) {
    req.slidesPerView = 1
  }
  if (req.gap === undefined) {
    req.gap = 0
  }
}

/**
 * 
 * @param {css选择器} selector 
 * @param {是否禁用循环} isLoopDisable 
 * @param {是否开启定时器轮播} isTimer 
 * @param {轮播时间} timeout 
 * @param {默认激活的索引从0开始} activeIndex 
 * @param {拖动元素后是否} isStick
 * @param {一页有几个元素} slidesPerView
 */
function bindSwiper(selector = "", req = {}) {
  initReq(req)

  const swiper = document.querySelector(`${selector}.swiper `)
  const wrapper = document.querySelector(`${selector}.swiper .swiper-wrapper`)
  const nextBth = document.querySelector(`${selector}.swiper .swiper-button-next`)
  const prevBth = document.querySelector(`${selector}.swiper .swiper-button-prev`)
  const pagination = document.querySelector(`${selector}.swiper .swiper-pagination`)
  // 每次翻页宽度
  const pageTurnWidth = wrapper.offsetWidth + req.gap
  // 每页内容宽度
  const pageWidth = wrapper.offsetWidth
  const slides = wrapper.children
  for (let i = 0; i < wrapper.children.length; i++) {
    wrapper.children[i].style.width = `${(pageWidth - req.gap * slides.len) / req.slidesPerView}px`
    wrapper.children[i].style.marginRight = `${req.gap}px`
  }

  // 创建wrapper中子元素个数的li元素到pagination
  for (let i = 0; i < wrapper.children.length / req.slidesPerView; i++) {
    const li = document.createElement("li")
    li.dataset.id = i
    pagination.appendChild(li)
  }
  const lis = pagination.children
  lis[req.activeIndex].classList.add("active")
  // 默认内容位置
  setDur0()
  wrapper.transform = `translate3d(${-req.activeIndex * pageTurnWidth}px,0px,0px)`

  // 最小translate值
  const minTranslateX = -(lis.length - 1) * pageTurnWidth
  const maxTranslateX = 0

  // 点击分页器事件
  if (pagination) {
    pagination.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        changeActive(+e.target.dataset.id)
      }
    })
  }

  // 下一页
  if (nextBth) {
    nextBth.addEventListener("click", () => {
      nextOrPrev()
    })
  }

  // 上一页
  if (prevBth) {
    prevBth.addEventListener("click", () => {
      nextOrPrev(false)
    })
  }


  // 下一页或上一页
  function nextOrPrev(isNext = true) {
    // 旧的active
    const oldActive = document.querySelector(`${selector}.swiper .swiper-pagination .active`)

    let oldActiveIndex = +(oldActive.dataset.id)
    let newActiveIndex
    // 如果禁用loop，那么在最前面或最后面的时候再次不反应
    if (req.isLoopDisable
      && ((isNext && oldActiveIndex >= lis.length - 1)
        || (!isNext && oldActiveIndex <= 0))) {
      return
    }
    // true下一页false上一页
    if (isNext) {
      newActiveIndex = oldActiveIndex < lis.length - 1 ? ++oldActiveIndex : 0
    } else {
      newActiveIndex = oldActiveIndex > 0 ? --oldActiveIndex : lis.length - 1
    }

    wrapper.style.transitionDuration = ".3s"
    // 改变active
    changeActive(newActiveIndex)
  }

  function changeActive(newActiveIndex, isChangeContent = true) {
    newActiveIndex = +newActiveIndex
    if (req.isLoopDisable) {
      //最后一页的话置下一页为不可点击
      if (nextBth) {
        if (newActiveIndex === lis.length - 1) {
          nextBth.disabled = true
        } else {
          nextBth.disabled = false
        }
      }
      //第一页的话置上一页为不可点击
      if (prevBth) {
        if (newActiveIndex === 0) {
          prevBth.disabled = true
        } else {
          prevBth.disabled = false
        }
      }
    }
    //删除旧的
    const oldActive = document.querySelector(`${selector}.swiper .swiper-pagination .active`)
    oldActive.classList.remove("active")
    // 内容切换 分页器和内容
    lis[newActiveIndex].classList.add("active")
    if (isChangeContent) {
      wrapper.style.transform = `translate3d(${-newActiveIndex * pageTurnWidth}px, 0px, 0px)`
    }
  }

  // 开启了才有定时任务
  if (req.isTimer) {
    let timerId
    // 自动任务
    timerId = setInterval(() => {
      nextOrPrev()
    }, req.timeout);

    //移动进入关闭自动任务
    swiper.addEventListener("mouseenter", () => {
      clearInterval(timerId)
    })

    //移动进入开启自动任务
    swiper.addEventListener("mouseleave", () => {
      timerId = setInterval(() => {
        nextOrPrev()
      }, req.timeout);
    })
  }

  // 动画超出，结束后回弹
  wrapper.addEventListener("transitionend", () => {
    overBack()
  })
  wrapper.addEventListener("transitionend", () => {
    wrapper.style.transitionDuration = ""
    wrapper.style.ransitionDelay = ""
    wrapper.style.transitionTimingFunction = ""
  })

  function setDur0() {
    wrapper.style.transitionDuration = "0ms"
    wrapper.style.ransitionDelay = "0ms"
  }


  // 左键按住拖动
  let isDown = false
  let downpageX
  let downTranslateX
  let downTime
  let clickPreventDefault
  // 实时pageX
  let nowPageX
  // 实时TranslateX
  let nowTransX

  // 阻止a标签跳转事件
  wrapper.addEventListener("click", function preventDefault(e) {
    if (clickPreventDefault) {
      e.preventDefault()
    }
  }, true)

  function downFn(e) {
    // 阻止冒泡
    e.preventDefault()
    // 每次点击先关闭点击关闭默认事件
    clickPreventDefault = false
    // 记录时间，用于快速滚动时，哪怕滚动一点点也翻页
    downTime = Date.now()
    isDown = true
    // 一个电脑端 一个手机端
    downpageX = e.pageX || e.targetTouches[0].pageX
    nowPageX = downpageX
    // 获取点击时候的translateX
    downTranslateX = getWrapperTransX()
    nowTransX = downTranslateX
    // 设置动画过渡时间为0ms，不然按住滚动的时候也会有延迟动画
    setDur0()
  }

  function getWrapperTransX() {
    return wrapper.style.transform ? +wrapper.style.transform.match(/-?\d+(\.\d+)?/g)[1] : 0
  }

  function moveFn(e) {
    if (!isDown) return
    // 如果有移动就阻止点击事件（防止a标签跳转等）
    clickPreventDefault = true

    nowPageX = e.pageX || e.targetTouches[0].pageX
    const willChangeTransX = nowPageX - downpageX
    let newtranslateX = downTranslateX + willChangeTransX
    // 如果超出最大值，超出部门每次只移动1/5
    if (newtranslateX < minTranslateX) {
      newtranslateX = minTranslateX + (newtranslateX - minTranslateX) / 5
    }
    if (newtranslateX > maxTranslateX) {
      newtranslateX = newtranslateX / 5
    }
    wrapper.style.transform = `translate3d(${newtranslateX}px,0px,0px)`
    nowTransX = newtranslateX
  }

  function upFn() {
    //修改标识符
    isDown = false
    //拖动超出弹回
    overBack()
    //粘连
    stick()
    //如果没有粘连，滑动
    smooth()
  }

  function smooth() {
    if (!req.isStick) {
      let newtranslateX
      // 计算点击到放开总偏移量
      offsetTransX = nowPageX - downpageX
      // 根据事件将偏移量放大倍数加上去
      if (Date.now() - downTime < 200) {
        newtranslateX = nowTransX + offsetTransX * 4
        // 如果超出范围，超出部分/10
        if (newtranslateX < minTranslateX) {
          newtranslateX = minTranslateX
            + (Math.abs(newtranslateX - minTranslateX) / 10 > 100 ? 100 : (newtranslateX - minTranslateX) / 10)
        }
        if (newtranslateX > maxTranslateX) {
          newtranslateX = maxTranslateX
            + (Math.abs(newtranslateX - maxTranslateX) / 10 > 100 ? 100 : (newtranslateX - maxTranslateX) / 10)
        }
        wrapper.style.transitionDuration = ".8s"
        wrapper.style.transitionTimingFunction = "ease-out"
        wrapper.style.transform = `translate3d(${newtranslateX}px,0px,0px)`
      }
    }
  }

  function stick() {
    if (req.isStick) {
      const nowTransX = getWrapperTransX()
      // 超出范围不处理
      if (nowTransX < minTranslateX || nowTransX > maxTranslateX) return

      // 时间小于0.5s 且移动范围小于一个宽度大于5px的时候
      if (Date.now() - downTime < 200
        && Math.abs(nowPageX - downpageX) < pageTurnWidth
        && Math.abs(nowPageX - downpageX) > 3
      ) {
        // 判断是否为向左滑,是的话+1
        if (downpageX - nowPageX > 0) {
          nextOrPrev()
        }
        // 判断是否为向右边滑,是的话-1
        if (downpageX - nowPageX < 0) {
          nextOrPrev(false)
        }
      }
      // 否则根据距离四舍五入
      else {
        let index = -nowTransX / pageTurnWidth
        if (index % 1 != 0) {
          // 时间长，则四舍五入
          const fIndex = Math.floor(index)
          index = index % 1 >= 0.5 ? fIndex + 1 : fIndex
        }
        changeActive(index)
      }
    }
  }

  // 超出回弹
  function overBack() {
    const nowTransX = getWrapperTransX()
    let newtranslateX
    if (nowTransX < minTranslateX) {
      newtranslateX = minTranslateX
    }
    if (nowTransX > maxTranslateX) {
      newtranslateX = 0
    }
    wrapper.style.transform = `translate3d(${newtranslateX}px,0px,0px)`
    wrapper.style.transitionDuration = "0.2s"
  }


  // 注册PC端点击拖拽事件
  swiper.addEventListener("mousedown", downFn, true)
  document.addEventListener("mousemove", moveFn)
  document.addEventListener("mouseup", upFn)

  // 注册M端滑动事件 { passive: false }是一个优化，告诉浏览器该事件会调用preventDefault()来阻止默认事件
  swiper.addEventListener("touchstart", downFn, { passive: false })
  window.addEventListener("touchmove", moveFn)
  window.addEventListener("touchend", upFn)


} 