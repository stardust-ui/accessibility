# Contributing
All development related to accessibility is currently happening in the [Stardust react](https://github.com/stardust-ui/react) repository. To contribute, create a pull request in that repository.

# ARIA conformance
In general, components need to conform to the [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/). These practices are evaluated to achieve best possible user experience with supported browser/screen reader combinations.

# Components and Behaviors
There are two areas that come together to achieve accessibility:
* Components - implemented for each supported framwork (currently React), when rendered, need to be [semantically correct](https://en.wikipedia.org/wiki/Semantic_HTML)
* Behaviors - framework independent, intended to add ARIA roles, ARIA attributes and keyboard handling on top of the components. In the future, behaviors development will move from the [Stardust react](https://github.com/stardust-ui/react) repo to [Stardust accessibility](https://github.com/stardust-ui/accessibility) repo.

# Testing
Every change needs to be tested for following use cases:

- keyboard navigation (without screen reader)
- screen reader narration when using virtual cursor navigation
- screen reader narration when not using virtual cursor navigation

## Test automation
It is estimated that test automation can discover around 30% of accessibility issues.
Components need to be unit-tested using [axe-core](https://www.deque.com/axe/). Using other test automation tools is also being considered.

## Required client / screen reader combinations for manual tests
- Windows/Chrome - JAWS
- Windows/Edge - Narrator
- Windows/Firefox - NVDA
- Windows/Chrome - VoiceOver
