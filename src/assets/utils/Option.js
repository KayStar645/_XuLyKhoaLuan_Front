class Option {
  constructor(optionSelector) {
    this.root = document.querySelector(optionSelector);
    this.notify = this.root.querySelector(".form-notify");
    this.type = "info";
    this.timeoutId = 0;
  }

  show(type = "info", doAfter = () => {}) {
    this.type = type;
    this.notify.classList.add(this.type);
    this.root.classList.add("active");

    this.timeoutId = setTimeout(() => {
      this.notify.classList.remove(this.type);
      this.complete();
      doAfter();
    }, 3500);
  }

  complete() {
    this.notify.classList.remove(this.type);
    this.root.classList.remove("active");
    clearTimeout(this.timeoutId);
  }

  agree(onAgree = () => {}) {
    const agree = this.notify.querySelector(".agree");

    if (!agree.clickEventAttached) {
      agree.addEventListener("click", () => {
        onAgree();
        this.complete();
      });

      agree.clickEventAttached = true;
    }
  }

  cancel(onCancel = () => {}) {
    const cancel = this.notify.querySelector(".cancel");

    if (!cancel.clickEventAttached) {
      cancel.addEventListener("click", () => {
        onCancel();
        this.complete();
      });

      cancel.clickEventAttached = true;
    }
  }

  save(onSave = () => {}) {
    const save = this.notify.querySelector(".save");

    if (!save.clickEventAttached) {
      save.addEventListener("click", () => {
        onSave();
        this.complete();
      });

      save.clickEventAttached = true;
    }
  }
}

export default Option;
