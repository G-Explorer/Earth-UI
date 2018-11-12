import {navigate} from '@reach/router'
import HeaderBar from 'earth-ui/lib/HeaderBar'
import Icon from 'earth-ui/lib/Icon'
import {Nav, NavItem, NavItemGroup, SubNav} from 'earth-ui/lib/Nav'
import {Tab, TabList, Tabs} from 'earth-ui/lib/Tabs'
import PropTypes from 'prop-types'
import React from 'react'
import {Layout, LayoutContent, LayoutSidebar} from 'widgets/Layout'
import Scrollbar from 'widgets/Scrollbar'
import components from './components.json'
import './index.less'

const getTabsByComponentName = (components, componentName) => {
  for (let c of components) {
    if (c.name === componentName) {
      return c.tabs
    }
    if (c.components) {
      const tabs = getTabsByComponentName(c.components, componentName)
      if (tabs) return tabs
    }
  }
}

function renderNavBottom () {
  return <div className="components__navbar-bottom">
    <div className="components__navbar-bottom-image">
      <img className="components__navbar-bottom-image-icon" src="/svg/avatarPlaceholder.svg" alt="MOTUS" />
    </div>
    <div className="components__navbar-bottom-user">
      <span className="components__navbar-bottom-user-name">KIMI GAO</span><span
        className="components__navbar-bottom-user-company">Earthui Corp.</span></div>
    <div className="components__navbar-bottom-logout">
      <Icon type="logout" className="components__navbar-bottom-logout-icon" />
    </div>
    <div className="components__navbar-bottom-settings">
      <Icon type="settings" className="components__navbar-bottom-settings-icon" />
    </div>
  </div>
}

class Components extends React.Component {
  constructor (props) {
    super()
    this.componentsMap = {}
    this.state = {
      open: false
    }
  }

  toggle (open) {
    this.setState({ open })
  }

  switchRoute (route) {
    if (route) {
      navigate(`/${route}`)
    }
  }

  handleItemClick = props => {
    this.toggle(false)
    this.switchRoute(props.id)
  }

  handleTabClick = doc => {
    this.switchRoute(doc)
  }

  renderTitle (docName) {
    const nameBeforeSlash = docName.split('/')[0]
    const nameAfterSlash = (docName.includes('components/') || docName.includes('start/')) ? docName.split('/')[1] : docName
    const componentName = (nameBeforeSlash === 'components' ? nameAfterSlash : nameBeforeSlash).split('-')[0]
    const component = this.componentsMap[componentName]
    const { name = '', cn = '' } = component || {}
    const title = name === 'intro' ? 'Earth UI' : `${name} ${cn}`
    const tabs = getTabsByComponentName(components, name)
    return (
      <HeaderBar
        className="components__title"
        icon="/svg/appLogo.svg"
        title={title}
      >
        {!!tabs && (
          <Tabs activeKey={nameAfterSlash}>
            <TabList>
              {!!tabs.length && tabs.map(tab => <Tab activeKey={tab.doc}
                onClick={() => this.handleTabClick(`${nameBeforeSlash}/${tab.doc}`)}>{tab.label}</Tab>)}
            </TabList>
          </Tabs>
        )}
      </HeaderBar>
    )
  }

  renderNavItem (item, position, path) {
    this.componentsMap[item.name] = item
    if (position === 'outside') {
      const id = item.tabs ? `${item.path}/${item.tabs[0].doc}` : item.name
      return (
        <NavItem id={id} title={item.cn} icon={`/svg/icons.svg#${item.icon}`} />
      )
    }
    const nameAfterSlash = (item.tabs && item.tabs.length && item.tabs[0].doc) || item.name
    const id = path ? `${path}/${nameAfterSlash}` : nameAfterSlash
    return (
      <NavItem id={id}>
        <span>{item.name}</span><span className="chinese">{item.cn}</span>
      </NavItem>
    )
  }

  renderNavItemGroup (itemGroup) {
    return (
      <NavItemGroup title={itemGroup.group}>
        {itemGroup.components.map(component => this.renderNavItem(component))}
      </NavItemGroup>
    )
  }

  render () {
    const { open } = this.state
    let {children, '*': childComponentPath} = this.props
    return (
      <div className="components">
        <Layout open={open} onToggle={open => this.toggle(open)}>
          <LayoutSidebar>
            <div className="components__navbar-top">
              <div className="components__navbar-top-logo">
                <span>EARTHUi</span>
              </div>
              <div className="components__navbar-top-close">
                <Icon type="close" />
              </div>
            </div>
            <Scrollbar className="components__navbar-scrollbar">
              <Nav
                collapsed
                selectedId={childComponentPath}
                onItemClick={this.handleItemClick}
                width={320}
                indent={20}
                className="components__navbar-menu"
              >
                {components.map(item => {
                  if (!item.components) {
                    return this.renderNavItem(item, 'outside')
                  }
                  return (
                    <SubNav title={item.cn} defaultOpen={item.defaultOpen} icon={`/svg/icons.svg#${item.icon}`}>
                      {item.components.map(itemGroup => {
                        if (itemGroup.group) {
                          return this.renderNavItemGroup(itemGroup)
                        }
                        return this.renderNavItem(itemGroup, 'inside', item.path)
                      })}
                    </SubNav>
                  )
                })}
              </Nav>
            </Scrollbar>
            {renderNavBottom()}
          </LayoutSidebar>
          <LayoutContent>
            {childComponentPath && this.renderTitle(childComponentPath)}
            <div className="components__content-wrapper">
              <div className="components__content">{children}</div>
            </div>
          </LayoutContent>
        </Layout>
      </div>
    )
  }
}

Components.propTypes = {
  children: PropTypes.node,
  '*': PropTypes.string
}

export default Components
