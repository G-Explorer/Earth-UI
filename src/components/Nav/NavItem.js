import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Icon from '../Icon'

class NavItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  setActiveState (props) {
    const active = this.context.nav.state.selectedId === props.id
    this.setState({ active })
  }

  componentWillMount () {
    this.setActiveState(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.setActiveState(nextProps)
  }

  handleClick = e => {
    this.props.onClick && this.props.onClick(e)
    this.context.nav.handleItemClick(this.props, e)
  }

  render () {
    const { active } = this.state
    const { children, className, icon, title, indent, ...other } = this.props

    const NavItemIcon = /\//.test(icon) ? (
      <Icon className={`${prefixCls}-nav__item-icon`} src={icon} />
    ) : (
      <Icon type={icon} className={`${prefixCls}-nav__item-icon`} />
    )

    return (
      <li
        onClick={this.handleClick}
        className={cx(
          `${prefixCls}-nav__item`,
          {
            [`${prefixCls}-nav__item--active`]: active
          },
          className
        )}
        {...other}
      >
        <div className={`${prefixCls}-nav_item-title`}>
          {NavItemIcon}
          <span>
            {title}
            {children}
          </span>
        </div>
      </li>
    )
  }
}

NavItem.contextTypes = {
  nav: PropTypes.object
}

NavItem.propTypes = {
  children: PropTypes.node,

  className: PropTypes.string,

  indent: PropTypes.number,

  // id of navigation item
  id: PropTypes.string.isRequired,

  // 导航项标题，可以是文本字符串，也可以是 React 元素
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  // 点击导航项调用此函数
  onClick: PropTypes.func,

  // 导航项图标，参考 Icon 组件 type 属性
  icon: PropTypes.string
}

export default NavItem
