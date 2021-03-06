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

export interface IListProps {
  items: IListItemProps[];
  direction: 'horizontal' | 'vertical'
}

export interface IListItemProps {
  title: string;
  idx?: number;
  isActive?: boolean;
  isFirstItem?: boolean;
  isLastItem?: boolean;
  subList?: IListProps
}

export class ListItem extends React.Component<IListItemProps> {
  render(): JSX.Element {
    const { title, idx, isFirstItem, isLastItem, isActive } = this.props;

    const children = this.props.subList ? (<List items={this.props.subList.items} direction={this.props.subList.direction} />) : (<></>);

    return (
      <li tabIndex={isActive ? 0 : -1} data-list-item={idx} data-first-item={isFirstItem} data-last-item={isLastItem}>
        {title}
        {children}
      </li>
    )
  }
}

export class List extends React.Component<IListProps> {

  private onKeyDown(e: KeyboardEvent): void {

    const current = ((e.target || e.srcElement) as HTMLElement);
    const ul = current.parentElement!

    const currentIdx = +(current.getAttribute('data-list-item')!);

    switch (e.keyCode) {
      case END:
        console.log('End Arrow Key Pressed')
        current.tabIndex = -1

        const last = ul.lastChild as HTMLElement;
        last.focus()
        last.tabIndex = 0
        break;

      case HOME:
        console.log('Home Arrow Key Pressed')
        current.tabIndex = -1

        const first = ul.firstChild as HTMLElement;
        first.focus()
        first.tabIndex = 0;
        break;
      case LEFT_ARROW:
        console.log('Left Arrow Key Pressed')
        if (this.props.direction === 'vertical' || (currentIdx == 0)) {
          break;
        }

        current.tabIndex = -1

        const prev = current.previousElementSibling as HTMLElement;
        prev.focus()
        prev.tabIndex = 0;

        break;
      case RIGHT_ARROW:
        console.log('Right Arrow Key Pressed')
        if (this.props.direction === 'vertical' || (currentIdx === (this.props.items.length - 1))) {
          break;
        }

        current.tabIndex = -1

        const next = current.nextElementSibling as HTMLElement;
        next.focus()
        next.tabIndex = 0;

        break;
      case UP_ARROW:
        console.log('Up Arrow Key Pressed')
        if (this.props.direction === 'horizontal' || (currentIdx == 0)) {
          break;
        }

        current.tabIndex = -1

        const prevUp = current.previousElementSibling as HTMLElement;
        prevUp.focus()
        prevUp.tabIndex = 0;

        break;
      case DOWN_ARROW:
        console.log('Down Arrow Key Pressed')
        if (this.props.direction === 'horizontal' || (currentIdx === (this.props.items.length - 1))) {
          break;
        }

        current.tabIndex = -1

        const nextBottom = current.nextElementSibling as HTMLElement;
        nextBottom.focus()
        nextBottom.tabIndex = 0;

        break;
    }

    if (e.keyCode !== 9) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const items = this.props.items.map((item, idx) => {
      return (<ListItem key={idx} title={item.title} idx={idx} isActive={idx === 0} isFirstItem={idx === 0} isLastItem={idx === (this.props.items.length - 1)} subList={item.subList} />)
    });

    const className = this.props.direction === 'horizontal' ? 'horizontal-list' : 'vertical-list'

    return (
      <ul onKeyDown={this.onKeyDown.bind(this)} className={className}>
        {items}
      </ul>
    );
  }
}

export interface IMenuProps {
  items: IMenuItemProps[];
}

export interface IMenuItemProps {
  title: string;
  subMenu?: IMenuItemProps[]
}

export class Menu extends React.Component<IMenuProps> {
  private onKeyDown(e: KeyboardEvent): void {

    const current = ((e.target || e.srcElement) as HTMLElement);
    const ul = current.parentElement!.parentElement!
    const li = current.parentElement!

    const isSubMenu = ul.getAttribute('data-sub-menu');
    const currentActiveMenuItem = this.parentElement.current!.querySelector('li > div[aria-expanded="true"]') as HTMLElement;

    switch (e.keyCode) {
      case END:
        console.log('End Arrow Key Pressed')
        current.tabIndex = -1

        const last = ul.lastChild!.firstChild as HTMLElement;
        last.focus()
        last.tabIndex = 0
        break;
      case HOME:
        console.log('Home Arrow Key Pressed')
        current.tabIndex = -1

        const first = ul.firstChild!.firstChild as HTMLElement;
        first.focus()
        first.tabIndex = 0;
        break;
      case LEFT_ARROW:
        console.log('Left Arrow Key Pressed')
        if (isSubMenu || (current === ul.firstChild!.firstChild as HTMLElement)) {
          if (isSubMenu) {
            this.closeSubMenu(currentActiveMenuItem)
            currentActiveMenuItem.focus()
            currentActiveMenuItem.tabIndex = 0;
          }
          break;
        }

        this.closeSubMenu(current)
        current.tabIndex = -1

        const prev = li.previousElementSibling!.firstChild as HTMLElement;
        prev.focus()
        prev.tabIndex = 0;

        break;
      case RIGHT_ARROW:
        console.log('Right Arrow Key Pressed')
        if (isSubMenu || (current === ul.lastChild!.firstChild as HTMLElement)) {
          if (isSubMenu) {
            this.closeSubMenu(currentActiveMenuItem)
            currentActiveMenuItem.focus()
            currentActiveMenuItem.tabIndex = 0;
          }
          break;
        }

        this.closeSubMenu(current)

        current.tabIndex = -1

        const next = li.nextElementSibling!.firstChild as HTMLElement;
        next.focus()
        next.tabIndex = 0;
        break;

      case UP_ARROW:
        console.log('Up Arrow Key Pressed')
        if (!isSubMenu || (current === ul.firstChild!.firstChild as HTMLElement)) {
          break;
        }

        current.tabIndex = -1

        const prevUp = li.previousElementSibling!.firstChild as HTMLElement;
        prevUp.focus()
        prevUp.tabIndex = 0;

        break;
      case DOWN_ARROW:
        console.log('Down Arrow Key Pressed')
        if (!isSubMenu || (current === ul.lastChild!.firstChild as HTMLElement)) {
          break;
        }

        current.tabIndex = -1

        const nextBottom = li.nextElementSibling!.firstChild as HTMLElement;
        nextBottom.focus()
        nextBottom.tabIndex = 0;

        break;
      case ENTER:
      case SPACE:
        console.log('ENTER or SPACE Key Pressed')
        this.toggleSubMenu(current);
        this.focusFirstItem(current);
        break;
      case ESC:
        console.log('ESC Key Pressed')
        this.closeSubMenu(currentActiveMenuItem)

        currentActiveMenuItem.focus()
        currentActiveMenuItem.tabIndex = 0;
        break;
    }

    if (e.keyCode !== 9) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  private onMenuItemClick(e: KeyboardEvent): void {
    const menuItem = (e.target || e.srcElement) as HTMLElement;

    this.toggleSubMenu(menuItem);

    e.preventDefault();
  }

  private toggleSubMenu(menuItem: HTMLElement) {
    if (!this.hasPopup(menuItem)) {
      return;
    }

    var currState = menuItem.getAttribute("aria-expanded");
    var nextState = currState === "false" ? "true" : "false";
    menuItem.setAttribute("aria-expanded", nextState);
  }

  private focusFirstItem(menuItem: HTMLElement) {
    if (!this.hasPopup(menuItem)) {
      return;
    }

    const firstItem = (menuItem.nextElementSibling as HTMLElement).firstChild!.firstChild! as HTMLElement
    firstItem.focus();
  }

  private closeSubMenu(menuItem: HTMLElement) {
    if (!this.hasPopup(menuItem)) {
      return;
    }

    menuItem.setAttribute("aria-expanded", "false");
  }

  private hasPopup(element: HTMLElement) {
    return element.nextElementSibling && element.nextElementSibling.getAttribute('role') === 'menu';
  }

  private buildMenuItem(menuItem: IMenuItemProps, idx: number): JSX.Element {
    let item = (<div data-idx={idx} role="menuitem" aria-expanded="false" aria-label={menuItem.title} tabIndex={idx === 0 ? 0 : -1} >{menuItem.title}</div>)

    return (
      <li key={idx} role="presentation" onClick={this.onMenuItemClick.bind(this)}>
        {item}
        {this.buildSubMenu(menuItem)}
      </li>
    )
  }

  private buildSubMenu(parentMenuItem: IMenuItemProps): JSX.Element {
    if (!parentMenuItem.subMenu) {
      return (<></>);
    }

    const subMenu = parentMenuItem.subMenu.map((item, idx) => this.buildMenuItem(item, idx));

    return (<ul className='vertical-list' role="menu" aria-label={parentMenuItem.title} data-sub-menu>{subMenu}</ul>)
  }

  public parentElement = React.createRef<HTMLUListElement>();

  render() {
    const menu = this.props.items.map((item, idx) => this.buildMenuItem(item, idx));

    return (
      <ul ref={this.parentElement} onKeyDown={this.onKeyDown.bind(this)} className='app-menu horizontal-list' role="menubar" aria-label="Settings" data-top-level>
        {menu}
      </ul>
    )
  }
}

export class MenuEx extends React.Component<IListProps> {
  render() {
    return (<List items={this.props.items} direction={this.props.direction} />)
  }
}

export class TreeEx extends React.Component<IListProps> {
  render() {
    return (<List items={this.props.items} direction={this.props.direction} />)
  }
}
