import { FormBuilder, FormGroup } from "@angular/forms";
import getParentElement from "./getParentElement";
import setErrors from "./setErrors";

class Form {
  constructor(rules = {}) {
    let fb = new FormBuilder();
    this.form = FormGroup;
    this.form = fb.group(rules);
    this.controls = this.form.controls;
  }

  validate(formSelector) {
    let form = document.querySelector(formSelector);
    let formElement = form.querySelectorAll(".form-input");

    for (let i = 0; i < formElement.length; i++) {
      const element = formElement[i];
      let controlName = element.getAttribute("formControlName");

      if (this.controls.hasOwnProperty(controlName)) {
        let errors = this.controls[controlName].errors;

        setErrors(errors, element);
      }
    }
  }

  resetValidte(formSelector, except = {}) {
    let form = document.querySelector(formSelector);
    let formElement = form.querySelectorAll(".form-input");

    for (let i = 0; i < formElement.length; i++) {
      const element = formElement[i];
      const parent = getParentElement(element, ".form-control");

      parent && parent.classList.remove("invalid");
    }
  }

  resetForm(formSelector, except = []) {
    let form = document.querySelector(formSelector);
    let formElement = form.querySelectorAll(".form-input");

    for (let i = 0; i < formElement.length; i++) {
      const element = formElement[i];
      const parent = getParentElement(element, ".form-control");
      let controlName = element.getAttribute("formControlName");

      if (!except.includes(controlName)) {
        parent && parent.classList.remove("invalid");
        this.form.patchValue({
          [controlName]: "",
        });
      }
    }
  }

  inputBlur(e) {
    if (e.target) {
      let controlName = e.target.getAttribute("formControlName");

      if (this.controls.hasOwnProperty(controlName)) {
        let errors = this.controls[controlName].errors;

        setErrors(errors, e.target);
      }
    } else {
      console.log([e]);
    }
  }

  isHaveValue(except = []) {
    let check = false;

    Object.entries(this.form.value).forEach((value) => {
      if (!except.includes(value[0])) {
        if (value[1] && value[1] !== "") {
          check = true;
        }
      }
    });

    return check;
  }
}

export default Form;
