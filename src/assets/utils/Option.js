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

    this.timeoutId = setTimeout(() => {
      this.notify.classList.remove(this.type);
      this.root.classList.remove("active");
      doAfter();
    }, 3500);
  }

  complete() {
    this.notify.classList.remove(this.type);
    clearTimeout(this.timeoutId);
  }

  agree(onAgree = () => {}) {
    const agree = this.notify.querySelector(".agree");

    agree.addEventListener("click", () => {
      onAgree();
      this.complete();
    });
  }

  cancel(onCancel = () => {}) {
    const cancel = this.notify.querySelector(".cancel");

    cancel.addEventListener("click", () => {
      onCancel();
      this.complete();
    });
  }

  save(onSave = () => {}) {
    const save = this.notify.querySelector(".save");

    save.addEventListener("click", () => {
      onSave();
      this.complete();
    });
  }
}

export default Option;
