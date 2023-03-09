function getParentElement(element, expectedParent) {
  while (element.parentElement) {
    if (element.parentElement.matches(expectedParent)) {
      return element.parentElement;
    }

    element = element.parentElement;
  }
}

export default getParentElement;
