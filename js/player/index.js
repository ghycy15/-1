import Sprite   from '../base/sprite'
import Bullet   from './bullet'
import DataBus  from '../databus'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH   = 80
const PLAYER_HEIGHT  = 80

let databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 8
    this.y = screenHeight * 0.72 - this.height //this.height + 30
    this.initY = this.y

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    this.bullets = []

    // 初始化事件监听
    this.initEvent()

    this.touchStartTime = null
    this.touchEndTime = null
    this.touchLength = null
    this.isMoving = false

    this.speed = 0
    this.a = 0

  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(   x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation  )
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if ( disX < 0 )
      disX = 0

    else if ( disX > screenWidth - this.width )
      disX = screenWidth - this.width

    if ( disY <= 0 )
      disY = 0

    else if ( disY > screenHeight - this.height )
      disY = screenHeight - this.height

    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()
      if (!this.isMoving) {
        this.touchStartTime = new Date()
        this.touched = true
      }
    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

      if (this.touched === true) {
        this.touchEndTime = new Date()
        this.touchLength = this.touchEndTime - this.touchStartTime
        this.touched = false
        this.isMoving = true

        this.a = (this.touchLength < 300 ? this.touchLength : 300) / 10
        this.speed = this.a
      }
    }).bind(this))
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    let bullet = databus.pool.getItemByClass('bullet', Bullet)

    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      10
    )

    databus.bullets.push(bullet)
  }


  update() {
    if (!this.isMoving) {
      return;
    }
    const currentTime = new Date()
    const timeDiff = currentTime - this.touchEndTime

    /*if (timeDiff < this.touchLength * 2) {
      offset = timeDiff / 2
    } else {
      offset = (this.touchLength - (timeDiff - this.touchLength * 2) / 2)
    }*/
    this.a -= 2
    this.speed += this.a 
    this.y = (screenHeight * 0.72 - this.height) - this.speed
    if (this.y > this.initY && currentTime !== this.touchEndTime) {
      this.isMoving = false
      this.y = this.initY
      return
    }
  }
}
