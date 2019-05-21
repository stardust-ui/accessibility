# Contributing
All development related to accessibility is currently happening in the [Stardust react](https://github.com/stardust-ui/react) repository. To contribute, create a pull request in that repository.

# ARIA conformance
In general, components need to conform to the [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/). These practices are evaluated to achieve best possible user experience with supported browser/screen reader combinations.

# Components and Behaviors
There are two areas that come together to achieve accessibility:
* Components - implemented for each supported framwork (currently React), when rendered, need to be [semantically correct](https://en.wikipedia.org/wiki/Semantic_HTML)
* Behaviors - framework independent, intended to add ARIA roles, ARIA attributes and keyboard handling on top of the components based on their type and state. In the future, behaviors development will move from the [Stardust react](https://github.com/stardust-ui/react) repo to [Stardust accessibility](https://github.com/stardust-ui/accessibility) repo.

# Accessibility requirements

## Keyboard navigation
- All elements that are interactive need to be focusable using keyboard keys (TAB/Shift+Tab or arrow keys)
- Focused element need to be highlighted if it was focused by keyboard
- Focus should never go to the ``<body>`` element
- User needs to be able to move focus at any time, focus should not be be 'stuck' on one element
- In RTL mode, left arrow key moves the focus to the next focusable element, right arrow key moves the focus to the previous focusable element within the focus zone.

## Focus
- Whenever possible, focus should land only on elements that have concrete implicit or explicit ARIA role (`<button />`, `role='button'`, `role='menuitem'`, ....)
- Make sure the onClick event handlers are handled on focusable elements with implicit or explicit ARIA role and not on their parent/child elements
- Be careful when reacting on focus or on hover - screen readers do not have concept of hovering and not always focus elements, so there needs to be another way for the screen reader users to interact with such elements. For example showing popups on focus or on hover needs to be justified 

## Screen readers
User needs to be able to interact with the application using:
- screen reader with virtual cursor navigation
- screen reader witout virtual cursor navigation

All requirements for keyboard navigation are valid in both of these screen reader use cases. User needs to be able to understand which element is focused and how he can interact with it just based on the information provided by the screen reader.

Following combinations of clients and screen readers is supported/required:
- Windows/Chrome - JAWS
- Windows/Edge - Narrator
- Windows/Firefox - NVDA
- macOS/Chrome - VoiceOver


## Contrast
- There has to be sufficient contrast between background and foreground of the component (text, icon...) in all component states and themes.

## Zoom
- Elements need to be rendered correctly when zoomed up to 200%

# Testing
Every change needs to be tested for following use cases mentioned above.

## Test automation
It is estimated that test automation can discover around 30% of accessibility issues.
Components need to be unit-tested using [axe-core](https://www.deque.com/axe/). Using other test automation tools is also being considered.

## Manual testing
Manual testing with all supported client/screen reader combinations is required.
