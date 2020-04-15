import { useState, useEffect } from 'react'
import {
  ICardLocationData,
  Transform,
  ICardBounds,
  getTransformForSection,
  getTransformStyle,
} from '@jou/demo'

import { useSpring, config, to as interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { FullGestureState } from 'react-use-gesture/dist/types'

export interface IDraggableLayoutState {
  style: { [key: string]: string }
  isMoving: boolean
  isDragging: boolean
  target: { x: number; y: number }
}

/**
 * A hook which provides a transform and draggable bindings (using react-use-gestrue /
 * react-spring) to a rendered object. It also responds to changes in location.
 */
const useDraggableLayout = (
  location: ICardLocationData,
  bounds: ICardBounds,
  onClick?: () => void
) => {
  // store transforms
  const [fromTransform, setFromTransform] = useState<Transform | null>(
    bounds && location ? getTransformForSection(bounds, location) : null
  )
  const [toTransform, setToTransform] = useState<Transform | null>(null)

  // declare state variables
  const [state, setState] = useState<IDraggableLayoutState>({
    isMoving: false,
    isDragging: false,
    style: fromTransform?.toBaseStyle() || {
      top: '0px',
      left: '0px',
      width: '0px',
      height: '0px',
    },
    target: null,
  })

  useEffect(() => {
    // the transform has changed, set the new animation targets
    // if there is already a from location, then this is a new location
    if (state.isMoving) {
      setToTransform(getTransformForSection(bounds, location))
    } else {
      setFromTransform(getTransformForSection(bounds, location))
    }
  }, [location, bounds, state.isMoving])

  // create a spring that uses the fromTransform as the anchor point
  const [{ tx }, setSpringProps] = useSpring(() => ({
    tx: fromTransform.getTransformArray(),
    imediate: false,
    onRest: () => {
      // hide drag effects
      setState((prev) => ({ ...prev, isMoving: false || state.isDragging }))

      // store the new location if we are moving the card permanently
      if (toTransform) {
        setFromTransform(toTransform)
        setToTransform(null)
      }
    },
  }))

  // when the transforms change, update the base style
  useEffect(() => {
    setState((prev) => ({ ...prev, style: fromTransform.toBaseStyle() }))
  }, [fromTransform])

  const bindGesture = useGesture({
    onDrag: ({ down, elapsedTime, movement }: FullGestureState<'drag'>) => {
      fromTransform.delta = down ? [...movement, 0.5] : [0, 0, 0]

      setState((prev) => ({ ...prev, isDragging: down }))

      // check if we should click
      if (!down) {
        if (movement[1] < -150) {
          onClick && onClick()
        } else if (
          elapsedTime < 300 &&
          Math.abs(movement[0]) + Math.abs(movement[1]) < 20
        ) {
          onClick && onClick()
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSpringProps({
        tx: fromTransform.getTransformArray(),
        immediate: down,
        config: config.stiff,
      })
    },
  })

  const { isMoving, style } = state

  return {
    style,
    isMoving,
    gestureBindings: bindGesture,
    transformStyle: () =>
      interpolate(tx, (x: number, y: number, scale: number, rotation: number) =>
        getTransformStyle(x, y, scale, rotation)
      ),
  }
}

export default useDraggableLayout
