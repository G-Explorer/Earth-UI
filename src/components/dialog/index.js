import React from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'
import * as type from '../_utils/type'
import Dialog from './Dialog'
import DialogBody from './DialogBody'
import DialogButtons from './DialogButtons'
import DialogHeader from './DialogHeader'

let render = props => {
  const container = document.createElement('div')

  let isOpen = false
  const messageQueue = []
  const handleClose = () => {
    isOpen = false
    const head = messageQueue[0] && messageQueue.shift()
    head && render(head)
  }

  render = nextProps => {
    props = Object.assign({}, props, nextProps)
    const { open, backdrop, lock, type, message, options, accpetLabel, cancelLabel } = props
    if (isOpen && open) {
      return messageQueue.push(props)
    }
    isOpen = open
    ReactDOM.render((
      <Dialog open={isOpen} backdrop={backdrop} lock={lock}>
        <DialogHeader type={type} icon={options?.icon} />
        <DialogBody>
          <div
            className={`${prefixCls}-dialog__body-markdown`}
            dangerouslySetInnerHTML={{ __html: marked(message) }}
          />
        </DialogBody>
        <DialogButtons focused={options?.focused} onClose={handleClose} accpetLabel={accpetLabel} cancelLabel={cancelLabel} {...options} />
      </Dialog>
    ), container)
    props.open || handleClose()
  }
  render()
}

const getDialogParams = args => {
  const stringArray = []
  let options = { focused: 'cancel' }
  Array.from(args).forEach(v => {
    type.isString(v) && stringArray.push(v)
    type.isObject(v) && Object.assign(options, v)
  })
  return {
    message: stringArray[0] || 'Dialog message must be provided.',
    accpetLabel: stringArray[1] || 'OK',
    cancelLabel: stringArray[2] || 'CANCEL',
    options
  }
}

const dialog = {
  confirm () {
    const { message, accpetLabel, cancelLabel, options } = getDialogParams(arguments)
    render({
      message,
      accpetLabel,
      cancelLabel,
      options,
      type: 'confirm',
      backdrop: true,
      lock: true,
      open: true
    })
  },
  warning () {
    const { message, accpetLabel, cancelLabel, options } = getDialogParams(arguments)
    render({
      message,
      accpetLabel,
      cancelLabel,
      options,
      type: 'warning',
      backdrop: true,
      lock: true,
      open: true
    })
  },
  danger () {
    const { message, accpetLabel, cancelLabel, options } = getDialogParams(arguments)
    render({
      message,
      accpetLabel,
      cancelLabel,
      options,
      type: 'danger',
      backdrop: true,
      lock: true,
      open: true
    })
  },
  close () {
    render({ open: false })
  }
}

export default dialog
