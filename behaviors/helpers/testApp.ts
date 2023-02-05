import { Context } from "esbehavior"
import { Display } from "../../src/display"
import * as View from "../../src/view"
import { TestDisplay } from "./testDisplay"
import { TestLoop } from "./testLoop"

export function testAppContext<T>(): Context<TestApp<T>> {
  return {
    init: () => new TestApp<T>(),
    teardown: (testApp) => testApp.destroy()
  }
}

export class TestApp<S> extends TestLoop<S> {
  private view: View.View | undefined
  private appDisplay: Display | undefined

  setView(view: View.View) {
    this.view = view
  }

  start() {
    this.appDisplay = new Display(this.loop, this.view!)
    this.appDisplay.mount(document.querySelector("#test-display")!)
  }

  destroy() {
    if (this.appDisplay) {
      this.appDisplay.destroy()
      this.appDisplay = undefined
    }
  }

  get display(): TestDisplay {
    return new TestDisplay()
  }
}