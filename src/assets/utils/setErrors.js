import getParentElement from "./getParentElement";

function setErrors(errors, element, parentSelector, errorSelector) {
  let parent = getParentElement(element, parentSelector || ".form-control");
  let errorMess = parent.querySelector(errorSelector || ".error-mess");

  if (parent) {
    if (errors) {
      if (errors.required) {
        parent.classList.add("invalid");
        errorMess && (errorMess.innerText = "Trường này là bắt buộc");
      }
      if (errors.email) {
        parent.classList.add("invalid");
        errorMess && (errorMess.innerText = "Email không hợp lệ");
      }
    } else {
      parent.classList.remove("invalid");
      errorMess && (errorMess.innerText = "");
    }
  }
}

export default setErrors;
