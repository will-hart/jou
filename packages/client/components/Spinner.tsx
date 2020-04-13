import * as React from 'react'

const Spinner = ({ light, small }: SpinnerProps) => (
  <div
    className={
      (light ? 'lds-ring-light' : 'lds-ring') + (small ? ' small' : '')
    }
  >
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
)

export interface SpinnerProps {
  light?: boolean
  small?: boolean
}

export default Spinner
