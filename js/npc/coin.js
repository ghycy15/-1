import Animation from '../base/animation'
import DataBus from '../databus'

const COIN_IMG_SRC = 'images/coin.jpg'
const COIN_WIDTH = 40
const COIN_HEIGHT = 40

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Coin extends Animation {
  constructor() {
    super(COIN_IMG_SRC, COIN_WIDTH, COIN_HEIGHT)

    this.initExplosionAnimation()
    this.isCleared = false
  }

  init(speed) {
    this.x = window.innerWidth + this.width
    this.y = window.innerHeight * 0.32 - this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {

  }

  // 每一帧更新敌人位置
  update() {
    this.x -= this[__.speed]

    // 对象回收
    if (this.x < 0 - this.width) {
      databus.removeCoin(this)
    }
  }
}
