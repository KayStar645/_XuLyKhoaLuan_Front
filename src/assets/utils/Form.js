import { FormBuilder, FormGroup } from "@angular/forms";
import setErrors from "./setErrors";

class Form {
  constructor(rules = {}) {
    let fb = new FormBuilder();
    this.form = FormGroup;
    this.form = fb.group(rules);
    this.controls = this.form.controls;
  }

  validate(formSelector) {
    let formElement = document.querySelector(formSelector);
    
    for (let i = 0; i < formElement.length; i++) {
      const element = formElement[i];
      let controlName = element.getAttribute("formControlName");

      if (this.controls.hasOwnProperty(controlName)) {
        // set value
        this.controls[controlName].setValue(element.value);

        // validate
        let errors = this.controls[controlName].errors;
        setErrors(errors, element);
      }
    }
  }

  inputBlur(e) {
    let controlName = e.target.getAttribute("formControlName");

    if (this.controls.hasOwnProperty(controlName)) {
      let errors = this.controls[controlName].errors;

      setErrors(errors, e.target);
    }
  }
}

export default Form;
