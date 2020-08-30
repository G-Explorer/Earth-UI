import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import * as type from '../_utils/type';
import Dialog from './Dialog';
import DialogBody from './DialogBody';
import DialogButtons from './DialogButtons';
import DialogHeader from './DialogHeader';

class ClassicDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            isOpen: true,
        };
    }

    handleDialogClose = () => {
        this.setState({ isOpen: false });
        this.props?.onClose?.();
    };

    render() {
        const { backdrop, lock, type, options, acceptLabel, message, cancelLabel } = this.props;
        return (
            <div>
                {!!this.state.isOpen && (
                    <Dialog
                        type="dialog"
                        onClose={this.handleDialogClose}
                        backdrop={backdrop}
                        lock={lock}
                    >
                        <DialogHeader type={type} icon={options?.icon} />
                        <DialogBody>
                            <div
                                className={`${prefixCls}-dialog__body-markdown`}
                                dangerouslySetInnerHTML={{ __html: marked(message) }}
                            />
                        </DialogBody>
                        <DialogButtons
                            type={type}
                            acceptLabel={acceptLabel}
                            cancelLabel={cancelLabel}
                            {...options}
                        />
                    </Dialog>
                )}
            </div>
        );
    }
}

let render = (props) => {
    let isOpen = false;
    const messageQueue = [];
    const handleClose = () => {
        isOpen = false;
        const head = messageQueue[0] && messageQueue.shift();
        head && render(head);
    };
    render = (nextProps) => {
        props = Object.assign({}, props, nextProps, { onClose: handleClose });
        if (isOpen) {
            return messageQueue.push(props);
        }
        isOpen = true;
        const container = document.createElement('div');
        ReactDOM.render(<ClassicDialog {...props} />, container);
    };
    render();
};

const getDialogParams = (args) => {
    const stringArray = [];
    const options = {};
    Array.from(args).forEach((v) => {
        type.isString(v) && stringArray.push(v);
        type.isObject(v) && Object.assign(options, v);
    });
    return {
        message: stringArray[0] || 'Dialog message must be provided.',
        acceptLabel: stringArray[1] || 'OK',
        cancelLabel: stringArray[2] || 'CANCEL',
        options,
    };
};

const dialog = {
    confirm() {
        const { message, acceptLabel, cancelLabel, options } = getDialogParams(arguments);
        render({
            message,
            acceptLabel,
            cancelLabel,
            options,
            type: 'confirm',
            backdrop: true,
            lock: true,
            open: true,
        });
    },
    accept() {
        const { message, acceptLabel, cancelLabel, options } = getDialogParams(arguments);
        render({
            message,
            acceptLabel,
            cancelLabel,
            options,
            type: 'accept',
            backdrop: true,
            lock: true,
            open: true,
        });
    },
    warning() {
        const { message, acceptLabel, cancelLabel, options } = getDialogParams(arguments);
        render({
            message,
            acceptLabel,
            cancelLabel,
            options,
            type: 'warning',
            backdrop: true,
            lock: true,
            open: true,
        });
    },
    danger() {
        const { message, acceptLabel, cancelLabel, options } = getDialogParams(arguments);
        render({
            message,
            acceptLabel,
            cancelLabel,
            options,
            type: 'danger',
            backdrop: true,
            lock: true,
            open: true,
        });
    },
    close() {
        render({ open: false });
    },
};

export default dialog;
