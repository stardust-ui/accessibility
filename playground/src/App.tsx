import * as React from 'react';
import './App.css';
import { List, Menu, MenuEx, IListProps, TreeEx } from "./components/components";

class App extends React.Component {
  public render() {

    const listItems1 = [{title: 'item 1'}, {title: 'item 2'}, {title: 'item 3'}, {title: 'item 4'}]
    const listItems2 = [{title: 'item 1'}, {title: 'item 2'}, {title: 'item 3'}, {title: 'item 4'}, {title: 'item 5'}, {title: 'item 6'}]
    const listItems3 = [{title: 'item 1'}, {title: 'item 2'}]

    const menuItems = [{
      title: 'File',
      subMenu: [{ title: 'New' }, { title: 'Open' }, { title: 'Print' }]
    }, {
      title: 'Edit',
      subMenu: [{ title: 'Undo' }, { title: 'Redo' }, { title: 'Cut' }, { title: 'Copy' }, { title: 'Paste' }]
    }, {
      title: 'Format',
      subMenu: [{ title: 'Font' }, { title: 'Text' }, { title: 'Color' }]
    }, {
      title: 'View',
      subMenu: [{ title: '100%' }, { title: 'Zoom In' }, { title: 'Zoom Out' }]
    }, {
      title: 'Help'
    }]

    const menuItemsEx: IListProps = {
      items: [{
        title: 'File',
        subList: {
          items: [{ title: 'New' }, { title: 'Open' }, { title: 'Print' }],
          direction: 'vertical'
        }
      }, {
        title: 'Edit',
        subList: {
          items: [{ title: 'Undo' }, { title: 'Redo' }, { title: 'Cut' }, { title: 'Copy' }, { title: 'Paste' }],
          direction: 'vertical'
        }
      }, {
        title: 'Format',
        subList: {
          items: [{ title: 'Font' }, { title: 'Text' }, { title: 'Color' }],
          direction: 'vertical'
        }
      }, {
        title: 'View',
        subList: {
          items: [{ title: '100%' }, { title: 'Zoom In' }, { title: 'Zoom Out' }],
          direction: 'vertical'
        }
      }, {
        title: 'Help'
      }],
      direction: 'horizontal'
    }

    const treeItemsEx: IListProps = {
      items: [{
        title: 'File',
        subList: {
          items: [{ title: 'New' }, { title: 'Open' }, { title: 'Print' }],
          direction: 'vertical'
        }
      }, {
        title: 'Edit',
        subList: {
          items: [{ title: 'Undo' }, { title: 'Redo' }, { title: 'Cut' }, { title: 'Copy' }, { title: 'Paste' }],
          direction: 'vertical'
        }
      }, {
        title: 'Format',
        subList: {
          items: [{ title: 'Font' }, { title: 'Text' }, { title: 'Color' }],
          direction: 'vertical'
        }
      }, {
        title: 'View',
        subList: {
          items: [{ title: '100%' }, { title: 'Zoom In' }, { title: 'Zoom Out' }],
          direction: 'vertical'
        }
      }, {
        title: 'Help'
      }],
      direction: 'vertical'
    }


    return (
      <>
        <h1>Menu Example</h1>
        <div>
          <Menu items={menuItems} />
          <MenuEx items={menuItemsEx.items} direction={menuItemsEx.direction} />
        </div>

        <h1>Tree Example</h1>
        <div>
          {/* <Tree items={menuItems} /> */}
          <TreeEx items={treeItemsEx.items} direction={treeItemsEx.direction} />
        </div>

        <h1>Lists Example</h1>
        <div>
          <List items={listItems1} direction='vertical' />
          <List items={listItems2} direction='vertical' />
          <List items={listItems3} direction='vertical' />
          <List items={listItems2} direction='horizontal' />
        </div>
      </>
    )
  }
}

export default App;
