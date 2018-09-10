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

type OnMoveOuter = (shouldPropagateToRoot: boolean) => void

interface IItemProps {
  title: string
  subItems?: IItemProps[]
}

interface IAtomicItem {}

interface IAtomicItemProps<TParent> extends IItemProps {
  parentRef: React.RefObject<TParent>

  isFocused: boolean

  isFirstElement: boolean
  isLastElement: boolean

  onMovePrevious: () => void
  onMoveNext: () => void
  onMoveFirst: () => void
  onMoveLast: () => void

  onMoveOuter?: OnMoveOuter
}

interface IAtomicItemState {
  isSubListFocused: boolean
}

interface IContainer {
  moveInner: () => void
}

interface IContainerProps {
  items: IItemProps[]
  direction: 'horizontal' | 'vertical'
  type: 'list' | 'menu' | 'tree' | 'subList'
  nesting: 'root' | 'nested'
  isFocused?: boolean

  onMoveOuter?: OnMoveOuter
}

interface IContainerState {
  activeItemIdx: number
}

class AtomicItem<TParent> extends React.Component<IAtomicItemProps<TParent>, IAtomicItemState> implements IAtomicItem {
  private itemRef = React.createRef<HTMLLIElement>()
  private subListRef = React.createRef<Container>()

  constructor(props: IAtomicItemProps<TParent>, state: IAtomicItemState) {
    super(props, state)

    this.state = {
      isSubListFocused: false
    }
  }

  private shouldFocus() {
    return this.props.isFocused && !this.state.isSubListFocused
  }

  componentDidUpdate() {
    if (this.shouldFocus()) {
      this.itemRef.current!.focus()
    }
  }

  render() {
    const { title, subItems } = this.props

    const subList = subItems
      ? (<>
          &nbsp;
          <span>&bull;&bull;&bull;</span>
          <Container
            ref={this.subListRef}
            items={subItems}
            direction='vertical'
            type='subList'
            nesting='nested'
            isFocused={this.state.isSubListFocused}
            onMoveOuter={this.moveFromInner.bind(this)}
          />
        </>)
      : (<></>)

    return (
      <li tabIndex={this.shouldFocus() ? 0 : -1} onKeyDown={this.onKeyDown.bind(this)} ref={this.itemRef} data-has-sub-list={subItems ? true : false}>
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

  private moveInner() {
    if (!this.props.subItems || this.props.subItems.length <= 0) {
      return
    }

    this.setState({
      isSubListFocused: true,
    })
    this.subListRef.current!.moveInner()
  }

  private moveFromInner(shouldPropagateToRoot: boolean) {
    if (!this.props.subItems || this.props.subItems.length <= 0) {
      return
    }

    this.setState({
      isSubListFocused: false,
    })

    if (shouldPropagateToRoot && this.props.onMoveOuter) {
      this.props.onMoveOuter(true)
    }
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
        this.movePrevious()
        break

      case RIGHT_ARROW:
        console.log('Right Arrow Key Pressed')
        this.moveNext()
        break

      case UP_ARROW:
        console.log('Up Arrow Key Pressed')
        this.movePrevious()
        break

      case DOWN_ARROW:
        console.log('Down Arrow Key Pressed')
        this.moveNext()
        break

      case ENTER:
        console.log('ENTER Key Pressed')
        if (this.props.onMoveOuter) {
          this.props.onMoveOuter(true)
        }
        break

      case SPACE:
        console.log('SPACE Key Pressed')
        this.moveInner()
        break

      case ESC:
        console.log('ESC Key Pressed')
        if (this.props.onMoveOuter) {
          this.props.onMoveOuter(false)
        }
        break
    }

    // TODO: make this correct
    if (e.keyCode !== 9) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}

class Container extends React.Component<IContainerProps, IContainerState> implements IContainer {
  private parentRef = React.createRef<HTMLUListElement>()

  constructor(props: IContainerProps, state: IContainerState) {
    super(props, state)

    this.state = {
      activeItemIdx: 0
    }
  }

  public moveInner() {
    // TODO: is it really fine if this is empty? :-)
  }

  render() {
    const { items, direction, type, nesting } = this.props

    if (nesting === 'root') {
      return (
        <ul className={`${type} ${direction}`} ref={this.parentRef} data-top-level>
          {this.buildItems(items)}
        </ul>
      )
    } else {
      return (
        <ul ref={this.parentRef} data-sub-list={this.props.isFocused ? 'open' : 'closed'}>
          {this.buildItems(items)}
        </ul>
      )
    }
  }

  private buildItems(items: IItemProps[]) {
    return items.map((item, idx) => {
      return (
        <AtomicItem key={idx} title={item.title} subItems={item.subItems}
          parentRef={this.parentRef}

          isFocused={idx === this.state.activeItemIdx}
          isFirstElement={idx === 0}
          isLastElement={idx === items.length - 1}

          onMovePrevious={this.movePrevious.bind(this)}
          onMoveNext={this.moveNext.bind(this)}
          onMoveFirst={this.moveFirst.bind(this)}
          onMoveLast={this.moveLast.bind(this)}

          onMoveOuter={this.moveOuter.bind(this)}
        />
      )
    })
  }

  private movePrevious(): void {
    this.setState({activeItemIdx: this.state.activeItemIdx - 1})

    console.log('movePrevious() - active index changed:'+ this.state.activeItemIdx)
  }

  private moveNext(): void {
    this.setState({activeItemIdx: this.state.activeItemIdx + 1})

    console.log('moveNext() - active index changed:'+ this.state.activeItemIdx)
  }

  private moveFirst(): void {
    this.setState({activeItemIdx: 0})

    console.log('moveFirst() - active index changed:'+ this.state.activeItemIdx)
  }

  private moveLast(): void {
    this.setState({activeItemIdx: this.props.items.length - 1})

    console.log('moveLast() - active index changed:'+ this.state.activeItemIdx)
  }

  private moveOuter(shouldPropagateToRoot: boolean): void {
    if (this.props.onMoveOuter) {
      this.props.onMoveOuter(shouldPropagateToRoot)
    }

    console.log('moveOutside()')
  }
}

/** -------------------------------------------------------
 *                    Accessible List
 ** -------------------------------------------------------*/
export interface IAccListProps {
  items: IItemProps[]
  direction: 'horizontal' | 'vertical'
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
  direction: 'horizontal' | 'vertical'
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
