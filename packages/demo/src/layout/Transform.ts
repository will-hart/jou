const round = (num: number) => Math.round(num)
/**
 * A class for tracking transforms. Backing type needs to be an array to support react-spring
 *
 * Fields are [x, y, width, height, rotation, yOffset, scale]
 */
export class Transform {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scale: number
  delta: number[] // x, y, scale

  /**
   * Returns the transform with [x, y, scale, rotation]
   */
  getTransformArray = () => {
    return [
      this.delta[0],
      this.delta[1],
      this.scale + this.delta[2],
      this.rotation,
    ]
  }

  applyTransformAsNew(): Transform {
    const t = new Transform(this.width, this.height)
    t.x = this.x + this.delta[0]
    t.y = this.y + this.delta[1]
    t.rotation = this.rotation

    return t
  }

  constructor(width: number, height: number) {
    this.x = 0
    this.y = 0
    this.delta = [0, 0, 0]
    this.width = width
    this.height = height
    this.rotation = 0
    this.scale = 1
  }

  toBaseStyle() {
    return {
      top: `${round(this.y)}px`,
      left: `${round(this.x)}px`,
      width: `${round(this.width)}px`,
      height: `${round(this.height)}px`,
    }
  }
}

export const getTransformStyle = (
  x: number,
  y: number,
  scale: number,
  rotation: number
): string => {
  return `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateZ(${rotation}deg)`
}
