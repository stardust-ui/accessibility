# Accessibility Playground

This playground has been created to experiment with complex navigation patterns for different types of the hierarchical components. Such as:

* DropDown
* List
* Menu
* Tree

All the component examples show the simple one level navigation and few level nested navigation.

Components respect the following keys:

* **Tab/Shift+Tab** - to navigate next focusable element.
* **Arrow Keys** - to navigate up/down or left/right one item.
* **Home/End** - to navigate First/Last element in the current nested level.
* **Enter(Space)/Esc** - to Open/Close nested elements.

**Note:** navigation to an element means that the element will be focused.

After playing a lot with the different approaches under [components.tsx](src/components/components.tsx) I was able to identify the repeatable pattern, which has been better generalized and implemented in the [universal-components.tsx](src/components/universal-components.tsx).
I call this approach **Container/AtomicItem keyboard navigation pattern**. Which is based on the [Roving tabindex](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets#Managing_focus_inside_groups) technique.

## Container/AtomicItem keyboard navigation pattern

The pattern is simple, as container knows about its children, it can keep the state, what is focused and what should be focused next. Each children can be an Atomic Item or a Nested Container, which encapsulate in this case both types of the logic, Container and Atomic Item.

Having this pattern allows to have separate each hierarchical components into this two primitives and implement logic for both of them independent and in reusable way. All nested elements are just instances of the same pattern, which is used for the top level items.

## Build and start

To build this playground use yarn or npm, both works.

Install latest [nodejs](https://nodejs.org/en/download/) appropriate to your platform, which contains `npm` as a part of installation..

**_Optional_**: install [Yarn](https://yarnpkg.com/en/docs/install). If you installed Yarn, you can use yarn commands, and npm commands otherwise.

* `npm install` or `yarn install` - to install all necessary dependencies.
* `npm run build` or `yarn build` - to build the project.
* `npm run start` or `yarn start` - to run development server.

The development server listens on the [http://localhost:3000/](http://localhost:3000/), where you can explore the examples of different hierarchical elements and their navigation.

## Summary

This is ongoing work and playground, which might be broken for some scenarios or not fully implemented. Also we might found the pattern suitable for other components and we can add them too, or maybe we can find some additional/better pattern as well.
