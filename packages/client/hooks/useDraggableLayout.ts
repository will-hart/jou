import { useState, useEffect, useRef, useCallback } from 'react'
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
  const fromTransform = useRef<Transform>(
    bounds && location ? getTransformForSection(bounds, location) : null
  )
  const toTransform = useRef<Transform>(fromTransform.current)

  const oldLocation = useRef<ICardLocationData>()
  const oldBounds = useRef<ICardBounds>()

  // declare state variables
  const [state, setState] = useState<IDraggableLayoutState>({
    isMoving: false,
    isDragging: false,
    style: fromTransform.current?.toBaseStyle() || {
      top: '0px',
      left: '0px',
      width: '0px',
      height: '0px',
    },
  })

  const { isMoving, style } = state

  // create a spring that uses the fromTransform as the anchor point
  const [{ tx }, setSpringProps] = useSpring(() => ({
    tx: toTransform.current.getTransformArray(),
    from: { tx: fromTransform.current.getTransformArray() },
    imediate: false,
    onRest: () => {
      // hide drag effects
      setState((prev) => ({ ...prev, isMoving: false || state.isDragging }))
    },
  }))

  const setFromTransform = useCallback(
    (val: Transform) => {
      fromTransform.current = val
      setState((prev) => ({
        ...prev,
        style: fromTransform.current.toBaseStyle(),
      }))
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSpringProps({
        from: { tx: fromTransform.current.getTransformArray() },
      })
    },
    [setSpringProps]
  )

  // when the transform changes (due to new bounds / location), update the animation targets
  useEffect(() => {
    if (
      oldLocation.current &&
      oldLocation.current.sec === location.sec &&
      oldLocation.current.idx === location.idx &&
      oldLocation.current.totIdx === location.totIdx &&
      oldBounds &&
      oldBounds.current.x === bounds.x &&
      oldBounds.current.y === bounds.y &&
      oldBounds.current.height === bounds.height &&
      oldBounds.current.width === bounds.width
    ) {
      // ugly but skips a lot of uneventful updates (especially due to initial SSR)
      return
    }

    oldLocation.current = location
    oldBounds.current = bounds

    setFromTransform(getTransformForSection(bounds, location))

    // animate to the new location
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setSpringProps({
      tx: fromTransform.current.getTransformArray(),
    })
    console.log(
      'changed',
      toTransform.current.getTransformArray(),
      fromTransform.current.getTransformArray()
    )
  }, [location, bounds, setFromTransform, setSpringProps, isMoving])

  const bindGesture = useGesture({
    onDrag: ({ down, elapsedTime, movement }: FullGestureState<'drag'>) => {
      setState((prev) => ({ ...prev, isMoving: true, isDragging: down }))

      // check if we should click
      if (!down) {
        if (
          movement[1] < -150 ||
          (elapsedTime < 300 &&
            Math.abs(movement[0]) + Math.abs(movement[1]) < 20)
        ) {
          onClick && onClick()
        }
      }

      toTransform.current.delta = down ? [...movement, 0.5] : [0, 0, 0]

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSpringProps({
        tx: toTransform.current.getTransformArray(),
        immediate: down,
        config: config.stiff,
      })
    },
  })

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
