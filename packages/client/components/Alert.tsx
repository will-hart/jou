import * as React from 'react'

export enum AlertType {
  Notice,
  Error,
  Info,
  Success,
  Warning,
}

const generateAlertStyle = (color: string) =>
  `bg-${color}-200 border-${color}-500 text-${color}-700`

const alertStyle = {
  [AlertType.Notice]: generateAlertStyle('gray'),
  [AlertType.Error]: generateAlertStyle('red'),
  [AlertType.Info]: generateAlertStyle('blue'),
  [AlertType.Success]: generateAlertStyle('green'),
  [AlertType.Warning]: generateAlertStyle('orange'),
}

const Alert = ({
  type,
  children,
  className,
}: {
  children: React.ReactNode
  type: AlertType
  className?: string
}) => (
  <div
    className={
      `border-l-8 p-4 my-4 shadow-md rounded ${alertStyle[type]} ` + className
    }
    role="alert"
  >
    {children}
  </div>
)

export default Alert
