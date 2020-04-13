import * as React from 'react'
import { Spinner } from '.'

const ConnectingSpinner = () => (
  <div className="flex flex-col justify-center items-center text-center text-white text-3xl font-bold p-12">
    <Spinner />
    <span> Connecting...</span>
  </div>
)

export default ConnectingSpinner
