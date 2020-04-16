import { useEffect, useRef, useReducer } from 'react'
import {
  ICardLocationData,
  Transform,
  ICardBounds,
  getTransformForSection,
  getTransformStyle,
  LayoutSection,
} from '@jou/demo'

import { useSpring, config, to as interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { FullGestureState } from 'react-use-gesture/dist/types'

export interface IDraggableLayoutState {
  style: { [key: string]: string }
  isMoving: boolean
  isDragging: boolean
  fromTransform: Transform
  xysr: number[]
}

const getDeltaArray = (
  x: number,
  y: number,
  scaleDelta: number,
  tx?: Transform
) => {
  return [x, y, (tx?.scale || 1) + scaleDelta, tx?.rotation || 0]
}

const repositionElement = (
  state: IDraggableLayoutState,
  tx: Transform
): IDraggableLayoutState => {
  if (!tx) {
    console.log('No transform in reposition, exiting')
    return state
  }

  const newDelta = getDeltaArray(0, 0, 0, tx) // state.fromTransform

  return {
    ...state,
    fromTransform: tx,
    style: tx.toBaseStyle(),
    xysr: newDelta,
  }
}

const resetReducer = (
  state: IDraggableLayoutState,
  tx: Transform
): IDraggableLayoutState => {
  return {
    ...state,
    fromTransform: tx,
    style: tx.toBaseStyle(),
    xysr: getDeltaArray(0, 0, 0, tx),
  }
}

const onDrag = (
  state: IDraggableLayoutState,
  payload: { delta: number[]; isDragging: boolean }
): IDraggableLayoutState => ({
  ...state,
  xysr: payload.delta,
  isDragging: payload.isDragging,
  isMoving: true,
})

const draggableReducer = (
  state: IDraggableLayoutState,
  action: {
    type: 'RESET' | 'ON_DRAG' | 'REPOSITION' | 'ON_REST' | 'SET_DRAG'
    payload?: unknown
  }
): IDraggableLayoutState => {
  switch (action.type) {
    case 'RESET':
      return resetReducer(state, action.payload as Transform)
    case 'ON_DRAG':
      return onDrag(
        state,
        action.payload as { delta: number[]; isDragging: boolean }
      )
    case 'REPOSITION':
      return repositionElement(state, action.payload as Transform)
    case 'ON_REST':
      return { ...state, isMoving: state.isDragging }
    default:
      throw new Error()
  }
}

/**
 * A hook which provides a transform and draggable bindings (using react-use-gestrue /
 * react-spring) to a rendered object. It also responds to changes in location.
 */
const useDraggableLayout = (
  location: ICardLocationData,
  bounds: ICardBounds,
  cardId: string,
  onClick?: () => void
) => {
  const [state, dispatch] = useReducer(draggableReducer, {
    style: null,
    isMoving: false,
    isDragging: false,
    fromTransform: null,
    xysr: [0, 0, 1, location.sec === LayoutSection.OPPONENT_HAND ? 180 : 0],
  } as IDraggableLayoutState)

  const oldLocation = useRef<ICardLocationData>()
  const oldBounds = useRef<ICardBounds>()

  // create a spring that uses the fromTransform as the anchor point
  const [{ tx }, setSpringProps] = useSpring(() => ({
    tx: state.xysr,
    from: { tx: [0, 0, 1, 0] },
    imediate: false,
    onRest: () => {
      dispatch({ type: 'ON_REST' })
    },
  }))

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

    dispatch({
      type: 'REPOSITION',
      payload: getTransformForSection(bounds, location),
    })
  }, [bounds, location, cardId])

  const bindGesture = useGesture({
    onDrag: ({ down, elapsedTime, movement }: FullGestureState<'drag'>) => {
      dispatch({
        type: 'ON_DRAG',
        payload: {
          isDragging: down,
          delta: down
            ? [...movement, 1.5, state.fromTransform.rotation]
            : [0, 0, 1, state.fromTransform.rotation],
        },
      })

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
    },
  })

  const { style, isMoving, isDragging, xysr } = state

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setSpringProps({
      tx: xysr,
      from: { tx: xysr },
      immediate: isDragging,
      config: config.stiff,
    })
  }, [isDragging, state.fromTransform, xysr, setSpringProps])

  return {
    readyToDraw: !!state.fromTransform,
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
