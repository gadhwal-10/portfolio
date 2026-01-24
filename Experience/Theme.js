import { EventEmitter } from "events";

export default class Theme extends EventEmitter {
  constructor() {
    super();
    this.theme = "dark";
    document.body.classList.add("dark-theme");
  }
}
