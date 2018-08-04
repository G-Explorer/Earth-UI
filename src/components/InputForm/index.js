import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import './index.less'

class InputForm extends Component {
  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.string,
    save: PropTypes.func,
    onChange: PropTypes.func,
    hasbutton: PropTypes.bool
  }

  static defaultProps = {
    label: '',
    content: '',
    placeholder: ''
  }

  constructor (props) {
    super(props)
    let state = {
      showEdit: true,
      inputProps: {
        readOnly: 'readOnly'
      },
      content: this.props.content,
      name: this.props.name
    }
    if (!props.hasbutton) state.inputProps.readOnly = ''
    this.state = state
  }

  _edit () {
    this.setState({
      showEdit: false,
      inputProps: {}
    })
    this.contentInput.focus()
  }

  _handleChange (e) {
    this.setState({
      content: e.target.value
    })
    this.props.onChange(e.target.value)
  }

  _save () {
    this.props.save(this.state.name, this.state.content)
    this.setState({
      showEdit: true,
      inputProps: {
        readOnly: 'readOnly'
      }
    })
  }

  _cancel () {
    this.setState({
      showEdit: true,
      inputProps: {
        readOnly: 'readOnly'
      }
    })
    this.setState({
      content: this.props.content
    })
  }

  render () {
    let { label, name, hasbutton, placeholder, type } = this.props
    const inputForm = cx({
      'earthui-input-form': this.state.showEdit && hasbutton,
      'earthui-input-form_active': !this.state.showEdit && hasbutton,
      'earthui-input-form_nobutton': !hasbutton
    })
    const buttonEdit = cx({
      'earthui-input-form__btn': !this.state.showEdit,
      'earthui-input-form__btn_active': this.state.showEdit
    })
    const buttonSave = cx({
      'earthui-input-form__btn': this.state.showEdit,
      'earthui-input-form__btn_active': !this.state.showEdit
    })
    const buttonCancel = cx({
      'earthui-input-form__btn-cancel': this.state.showEdit,
      'earthui-input-form__btn-cancel_active': !this.state.showEdit
    })
    return (
      <div className={inputForm}>
        <span className="earthui-input-form__label">{label}</span>
        <input value={this.state.content}
          className="earthui-input-form__content"
          onChange={(e) => this._handleChange(e)}
          ref={ref => (this.contentInput = ref)}
          {...this.state.inputProps}
          name={name}
          placeholder={placeholder}
          type={type}
          autoComplete="off"
        />
        {hasbutton &&
          <span>
            <span className={buttonEdit} onClick={() => this._edit()}>修改</span>
            <span>
              <span className={buttonCancel} onClick={() => this._cancel()}>取消</span>
              <span className={buttonSave} onClick={() => this._save()}>保存</span>
            </span>
          </span>
        }
      </div>
    )
  }
}

export default InputForm
