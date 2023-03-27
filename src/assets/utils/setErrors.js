import getParentElement from "./getParentElement";

function setErrors(errors, element, parentSelector, errorSelector) {
  let parent = getParentElement(element, parentSelector || ".form-control");
  let errorMess = parent.querySelector(errorSelector || ".error-mess");

  if (parent) {
    if (errors) {
      parent.classList.add("invalid");

      if (errors.required) {
        errorMess && (errorMess.innerText = "Trường này là bắt buộc");
      }
      if (errors.email) {
        errorMess && (errorMess.innerText = "Email không hợp lệ");
      }

      if (errors.min) {
        console.log(errors.min);
        errorMess &&
          (errorMess.innerText = `Số lượng tối thiểu phải lớn ${
            errors.min.min - 1
          }`);
      }

      if (errors.smallerDay) {
        errorMess &&
          (errorMess.innerText = "Ngày kết thúc phải lớn hơn ngày bắt đầu");
      }
    } else {
      parent.classList.remove("invalid");
      errorMess && (errorMess.innerText = "");
    }
  }
}

export default setErrors;
