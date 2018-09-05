import * as React from "react";

// const END = 35;
// const HOME = 36;
// const LEFT_ARROW = 37;
// const UP_ARROW = 38;
// const RIGHT_ARROW = 39;
// const DOWN_ARROW = 40;
// const ENTER = 13;
// const SPACE = 32;
// const ESC = 27;

interface IUniversalItemProps {
  title: string
  subItems?: IUniversalItemProps[]
}

interface IUniversalListProps {
  items: IUniversalItemProps[]
  direction: 'horizontal' | 'vertical'
  type: 'list' | 'menu' | 'tree' | 'subList'
  nesting: 'root' | 'nested'
}

const buildItems = (items: IUniversalItemProps[]) => {
  return items.map((item, idx) => (<UniversalItem key={idx} title={item.title} subItems={item.subItems} />))
}

class UniversalItem extends React.Component<IUniversalItemProps> {
  render() {
    const { title, subItems } = this.props

    const subList = subItems
      ? (<UniversalList items={subItems} direction='vertical' type='subList' nesting='nested' />)
      : (<></>)

    const hasSubList = subItems ? 'has-sub-list' : ''

    return (
      <li {...hasSubList}>
        {title}
        {subList}
      </li>
    )
  }
}

class UniversalList extends React.Component<IUniversalListProps> {
  render() {
    const { items, direction, type, nesting } = this.props

    if (nesting === 'root') {
      return (
        <ul className={`${type} ${direction}`} data-top-level>
          {buildItems(items)}
        </ul>
      )
    } else {
      return (
        <ul data-sub-list>
          {buildItems(items)}
        </ul>
      )
    }
  }
}

export interface IAccListProps {
  items: IUniversalItemProps[]
  direction: 'horizontal' | 'vertical'
}

export interface IAccMenuProps {
  items: IUniversalItemProps[]
  direction: 'horizontal' | 'vertical'
}

export interface IAccTreeProps {
  items: IUniversalItemProps[]
}

export class AccessibleList extends React.Component<IAccListProps> {
  render() {
    const { items, direction } = this.props

    return (<UniversalList type='list' items={items} direction={direction} nesting='root' />)
  }
}

export class AccessibleMenu extends React.Component<IAccMenuProps> {
  render() {
    const { items, direction } = this.props

    return (<UniversalList type='menu' items={items} direction={direction} nesting='root' />)
  }
}

export class AccessibleTree extends React.Component<IAccTreeProps> {
  render() {
    const { items } = this.props

    return (<UniversalList type='menu' items={items} direction='vertical' nesting='root' />)
  }
}