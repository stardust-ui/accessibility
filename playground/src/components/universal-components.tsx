import * as React from "react";

const END = 35;
const HOME = 36;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const ENTER = 13;
const SPACE = 32;
const ESC = 27;
const TAB = 9;


type Direction = 'horizontal' | 'vertical'

interface IItemProps {
  title: string
  subItems?: IItemProps[]
}

interface IAtomicItemProps extends IItemProps {
  parentContainerDirection: Direction

  idx: number
  isFocused: boolean

  type: 'list' | 'menu' | 'tree' | 'subList'

  isFirstElement: boolean
  isLastElement: boolean

  onMovePrevious: () => void
  onMoveNext: () => void
  onMoveFirst: () => void
  onMoveLast: () => void
  onEnter: () => void
  onSpace: () => void
  onEsc: () => void
}

interface IAtomicItemState {
  shouldSubContainerBeFocused: boolean
  shouldSubContainerBeOpened: boolean
  isLastOpened: boolean
}

interface IContainerProps {
  items: IItemProps[]
  direction: Direction
  type: 'list' | 'menu' | 'tree' | 'subList'
  nesting: 'root' | 'nested'

  shouldFocusFirstItem: boolean
  shouldOpen: boolean
}

interface IContainerState {
  focusItemOnIdx: number
}

class AtomicItem extends React.Component<IAtomicItemProps, IAtomicItemState> {
  private itemRef = React.createRef<HTMLLIElement>()

  constructor(props: IAtomicItemProps, state: IAtomicItemState) {
    super(props, state)

    this.state = {
      shouldSubContainerBeFocused: false,
      shouldSubContainerBeOpened: false,
      isLastOpened: false
    }
  }

  componentDidUpdate() {
    console.log('did update', this.props.title)
    if (this.props.isFocused && !this.state.shouldSubContainerBeFocused) {
      console.log('focusing', this.props.title)
      this.itemRef.current!.focus()
    }
  }

  render() {
    const { title, subItems, isFocused, type } = this.props

    const subList = subItems
      ? (<Container items={subItems} direction='vertical' type={type} nesting='nested'
                    shouldOpen={this.state.shouldSubContainerBeOpened}
                    shouldFocusFirstItem={this.state.shouldSubContainerBeFocused} />)
      : (<></>)

    return (
      <li tabIndex={isFocused ? 0 : -1} onKeyDown={this.onKeyDown.bind(this)} ref={this.itemRef} data-has-sub-list={subItems ? true : false} data-is-sub-list-focused={this.state.shouldSubContainerBeOpened}>
        {title}
        {subList}
      </li>
    )
  }

  private movePrevious() {
    if (this.props.type === 'tree') {
      if (this.state.shouldSubContainerBeFocused && this.state.shouldSubContainerBeOpened) {
        this.setState({shouldSubContainerBeFocused: false})
        return true
      }
    }

    if (this.props.isFirstElement || !this.props.isFocused) {
      return false
    }

    this.props.onMovePrevious()
    return true
  }

  private moveNext() {
    if (this.props.type === 'tree') {
      if (this.state.shouldSubContainerBeOpened && !this.state.shouldSubContainerBeFocused) {
        this.setState({shouldSubContainerBeFocused: true})
        return true
      }
    }

    if (this.props.isLastElement || !this.props.isFocused) {
      return false
    }

    this.props.onMoveNext()
    return true
  }

  private moveFirst() {
    if (this.props.isFirstElement || !this.props.isFocused) {
      return
    }

    this.props.onMoveFirst()
  }

  private moveLast() {
    if (this.props.isLastElement || !this.props.isFocused) {
      return
    }

    this.props.onMoveLast()
  }

  private enter() {
    this.setState({
      isLastOpened: false
    })

    if (!this.props.isFocused || !this.props.subItems) {
      return
    }

    this.setState({
      shouldSubContainerBeOpened: true,
      shouldSubContainerBeFocused: this.props.type !== 'tree',
      isLastOpened: true
    })

    this.props.onEnter()
  }

  private space() {
    if (!this.props.isFocused) {
      return
    }

    this.props.onSpace()
  }

  private esc() {
    if (!this.props.isFocused) {
      return
    }

    console.warn(`isLastOpened ${this.state.isLastOpened}`)

    this.setState({
      shouldSubContainerBeOpened: false,
      shouldSubContainerBeFocused: false,
    })
    this.props.onEsc()
  }

  private onKeyDown(e: KeyboardEvent): void {
    switch (e.keyCode) {
      case END:
        console.log('End Arrow Key Pressed')
        this.moveLast()
        break

      case HOME:
        console.log('Home Arrow Key Pressed')
        this.moveFirst()
        break

      case LEFT_ARROW:
        console.log('Left Arrow Key Pressed')
        if (this.props.type === 'tree') {
          if (this.props.subItems) {
            if (this.state.shouldSubContainerBeFocused) {
              // subcontainer is focused, so unfocus it, but do not close it yet
              this.setState({shouldSubContainerBeFocused: false})
              break
            }
            if (this.state.shouldSubContainerBeOpened) {
              // subcontainer is unfocused but open, so we can close it directly
              this.setState({shouldSubContainerBeFocused: false, shouldSubContainerBeOpened: false})
              break
            }
          }
          e.preventDefault()
          // do not stop propagation so a parent item can handle it
          return
        }
        if (this.props.parentContainerDirection === 'vertical') {
          break
        }
        this.movePrevious()
        break

      case RIGHT_ARROW:
        console.log('Right Arrow Key Pressed')
        if (this.props.type === 'tree' && this.props.subItems) {
          if (this.state.shouldSubContainerBeOpened && !this.state.shouldSubContainerBeFocused) {
            this.setState({shouldSubContainerBeFocused: true})
          }
          this.setState({shouldSubContainerBeOpened: true})
          break
        }
        if (this.props.parentContainerDirection === 'vertical') {
          break
        }
        this.moveNext()
        break

      case UP_ARROW:
        console.log('Up Arrow Key Pressed', this.props.title)
        if (this.props.parentContainerDirection === 'horizontal') {
          break
        }
        if (!this.movePrevious() && this.props.type === 'tree') {
          e.preventDefault()
          return
        }
        break

      case DOWN_ARROW:
        console.log('Down Arrow Key Pressed', this.props.title)
        if (this.props.parentContainerDirection === 'horizontal') {
          break
        }
        if (!this.moveNext() && this.props.type === 'tree') {
          e.preventDefault()
          return
        }
        break

      case ENTER:
        console.log('ENTER Key Pressed')
        this.enter()
        break

      case SPACE:
        console.log('SPACE Key Pressed')
        this.space()
        break

      case ESC:
        console.log('ESC Key Pressed')
        if (this.props.type === 'tree') {
          break
        }
        console.error(`isLastOpened ${this.state.isLastOpened}`)
        this.esc()
        if (this.state.isLastOpened === true) {
          e.preventDefault()
          e.stopPropagation()
          this.setState({isLastOpened: false})
        }
        break
    }

    // TODO: make this correct
    if (e.keyCode !== TAB && e.keyCode !== ESC) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}

class Container extends React.Component<IContainerProps, IContainerState> {
  constructor(props: IContainerProps, state: IContainerState) {
    super(props, state)

    this.state = {
      focusItemOnIdx: this.props.shouldFocusFirstItem ? 0 : -1
    }
  }

  componentWillReceiveProps(nextProps: IContainerProps): void {
    if (!this.props.shouldFocusFirstItem && nextProps.shouldFocusFirstItem) {
      // This condition is responsible to focus first item
      this.setState({ focusItemOnIdx: 0 })
    } else if (this.props.shouldFocusFirstItem && !nextProps.shouldFocusFirstItem) {
      // This condition removes focus from all items in sub container
      this.setState({ focusItemOnIdx: -1 })
    }
  }

  render() {
    const { direction, type, nesting, shouldFocusFirstItem, shouldOpen } = this.props

    const itemsToRender = this.buildItems(this.props.items)

    if (nesting === 'root') {
      return (
        <ul className={`${type} ${direction}`} data-top-level>
          {itemsToRender}
        </ul>
      )
    } else {
      return (
        <ul data-sub-list data-should-focus-first-item={shouldFocusFirstItem} data-should-open={shouldOpen}>
          {itemsToRender}
        </ul>
      )
    }
  }

  private buildItems(items: IItemProps[]) {
    return items.map((item, idx) => {
      let isFocused = (idx === this.state.focusItemOnIdx) && (this.state.focusItemOnIdx !== -1)

      return (
        <AtomicItem key={idx} title={item.title} subItems={item.subItems}
          parentContainerDirection={this.props.direction}

          idx={idx}

          isFocused={isFocused}
          isFirstElement={idx === 0}
          isLastElement={idx === items.length - 1}

          type={this.props.type}

          onMovePrevious={this.movePrevious.bind(this)}
          onMoveNext={this.moveNext.bind(this)}
          onMoveFirst={this.moveFirst.bind(this)}
          onMoveLast={this.moveLast.bind(this)}
          onEnter={this.enter.bind(this)}
          onSpace={this.space.bind(this)}
          onEsc={this.esc.bind(this)}
          />
      )
    })
  }

  private movePrevious(): void {
    this.setState({
      focusItemOnIdx: this.state.focusItemOnIdx - 1
    })

    console.log('movePrevious() - active index changed: ' + this.state.focusItemOnIdx)
  }

  private moveNext(): void {
    this.setState({
      focusItemOnIdx: this.state.focusItemOnIdx + 1
    })

    console.log('moveNext() - active index changed: ' + this.state.focusItemOnIdx)
  }

  private moveFirst(): void {
    this.setState({
      focusItemOnIdx: 0
    })

    console.log('moveFirst() - active index changed: ' + this.state.focusItemOnIdx)
  }

  private moveLast(): void {
    this.setState({
      focusItemOnIdx: this.props.items.length - 1
    })

    console.log('moveLast() - active index changed: ' + this.state.focusItemOnIdx)
  }

  private enter(): void {
    console.log('enter()')
  }

  private space(): void {
    console.log('space()')
  }

  private esc(): void {
    console.log('esc()')
  }
}

/** -------------------------------------------------------
 *                    Accessible List
 ** -------------------------------------------------------*/
export interface IAccListProps {
  items: IItemProps[]
  direction: Direction
}

export class AccessibleList extends React.Component<IAccListProps> {
  render() {
    const { items, direction } = this.props

    return (<Container type='list' items={items} direction={direction} nesting='root' shouldOpen={true} shouldFocusFirstItem={true} />)
  }
}


/** -------------------------------------------------------
 *                    Accessible Menu
 ** -------------------------------------------------------*/
export interface IAccMenuProps {
  items: IItemProps[]
  direction: Direction
}

export class AccessibleMenu extends React.Component<IAccMenuProps> {
  render() {
    const { items, direction } = this.props

    return (<Container type='menu' items={items} direction={direction} nesting='root' shouldOpen={true} shouldFocusFirstItem={true} />)
  }
}


/** -------------------------------------------------------
 *                    Accessible Tree
 ** -------------------------------------------------------*/
export interface IAccTreeProps {
  items: IItemProps[]
}

export class AccessibleTree extends React.Component<IAccTreeProps> {
  render() {
    const { items } = this.props

    return (<Container type='tree' items={items} direction='vertical' nesting='root' shouldOpen={true} shouldFocusFirstItem={true} />)
  }
}
