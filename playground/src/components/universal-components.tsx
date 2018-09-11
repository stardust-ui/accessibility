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


type Direction = 'horizontal' | 'vertical'

interface IItemProps {
  title: string
  subItems?: IItemProps[]
}

interface IAtomicItemProps<TParent> extends IItemProps {
  parentRef: React.RefObject<TParent>
  parentDirection: Direction

  idx: number
  isFocused: boolean

  isFirstElement: boolean
  isLastElement: boolean

  onMovePrevious: () => void
  onMoveNext: () => void
  onMoveFirst: () => void
  onMoveLast: () => void
  onEnter: (state: IAtomicItemState) => void
  onSpace: () => void
  onEsc: () => void
}

interface IAtomicItemState {
  shouldFocusSubContainer: boolean
}

interface IContainerProps {
  items: IItemProps[]
  direction: Direction
  type: 'list' | 'menu' | 'tree' | 'subList'
  nesting: 'root' | 'nested'
  shouldFocusFirstItem?: boolean
}

interface IContainerState {
  activeItemIdx: number
}

class AtomicItem<TParent> extends React.Component<IAtomicItemProps<TParent>, IAtomicItemState> {
  private itemRef = React.createRef<HTMLLIElement>()

  constructor(props: IAtomicItemProps<TParent>, state: IAtomicItemState) {
    super(props, state)

    this.state = { shouldFocusSubContainer: false }
  }

  componentDidUpdate() {
    if (this.props.isFocused && !this.state.shouldFocusSubContainer) {
      this.itemRef.current!.focus()
    }
  }

  render() {
    const { title, subItems, isFocused } = this.props

    const subList = subItems
      ? (<Container items={subItems} direction='vertical' type='subList' nesting='nested' shouldFocusFirstItem={this.state.shouldFocusSubContainer} />)
      : (<></>)

    return (
      <li tabIndex={isFocused ? 0 : -1} onKeyDown={this.onKeyDown.bind(this)} ref={this.itemRef} data-has-sub-list={subItems ? true : false}>
        {title}
        {subList}
      </li>
    )
  }

  private movePrevious() {
    if (this.props.isFirstElement || !this.props.isFocused) {
      return
    }

    this.props.onMovePrevious()
  }

  private moveNext() {
    if (this.props.isLastElement || !this.props.isFocused) {
      return
    }

    this.props.onMoveNext()
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
    if (!this.props.isFocused) {
      return
    }

    this.setState({shouldFocusSubContainer: true})

    this.props.onEnter(this.state)
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
        if (this.props.parentDirection === 'vertical') {
          break
        }
        this.movePrevious()
        break

      case RIGHT_ARROW:
        console.log('Right Arrow Key Pressed')
        if (this.props.parentDirection === 'vertical') {
          break
        }
        this.moveNext()
        break

      case UP_ARROW:
        console.log('Up Arrow Key Pressed')
        if (this.props.parentDirection === 'horizontal') {
          break
        }
        this.movePrevious()
        break

      case DOWN_ARROW:
        console.log('Down Arrow Key Pressed')
        if (this.props.parentDirection === 'horizontal') {
          break
        }
        this.moveNext()
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
        this.esc()
        break
    }

    // TODO: make this correct
    if (e.keyCode !== 9) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}

class Container extends React.Component<IContainerProps, IContainerState> {
  private parentRef = React.createRef<HTMLUListElement>()

  constructor(props: IContainerProps, state: IContainerState) {
    super(props, state)

    this.state = {
      activeItemIdx: this.props.nesting === 'root' ? 0 : -1
    }
  }

  componentWillReceiveProps(nextProps: IContainerProps): void {
    if (!this.props.shouldFocusFirstItem && nextProps.shouldFocusFirstItem === true) {
      this.setState({ activeItemIdx: 0 })
    }
  }

  render() {
    const { direction, type, nesting } = this.props

    const itemsToRender = this.buildItems(this.props.items)

    if (nesting === 'root') {
      return (
        <ul className={`${type} ${direction}`} ref={this.parentRef} data-top-level>
          {itemsToRender}
        </ul>
      )
    } else {
      return (
        <ul ref={this.parentRef} data-sub-list>
          {itemsToRender}
        </ul>
      )
    }
  }

  private buildItems(items: IItemProps[]) {
    return items.map((item, idx) => {
      return (
        <AtomicItem key={idx} title={item.title} subItems={item.subItems}
          parentRef={this.parentRef}
          parentDirection={this.props.direction}

          idx={idx}

          isFocused={(idx === this.state.activeItemIdx)}
          isFirstElement={idx === 0}
          isLastElement={idx === items.length - 1}

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
    this.setState({activeItemIdx: this.state.activeItemIdx - 1})

    console.log('movePrevious() - active index changed: ' + this.state.activeItemIdx)
  }

  private moveNext(): void {
    this.setState({activeItemIdx: this.state.activeItemIdx + 1})

    console.log('moveNext() - active index changed: ' + this.state.activeItemIdx)
  }

  private moveFirst(): void {
    this.setState({activeItemIdx: 0})

    console.log('moveFirst() - active index changed: ' + this.state.activeItemIdx)
  }

  private moveLast(): void {
    this.setState({activeItemIdx: this.props.items.length - 1})

    console.log('moveLast() - active index changed: ' + this.state.activeItemIdx)
  }

  private enter(): void {
    console.log('enter()')
  }

  private space(): void {
    console.log('space()')
  }

  private esc(): void {
    this.parentRef.current!.focus()

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

    return (<Container type='list' items={items} direction={direction} nesting='root' />)
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

    return (<Container type='menu' items={items} direction={direction} nesting='root' />)
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

    return (<Container type='tree' items={items} direction='vertical' nesting='root' />)
  }
}
