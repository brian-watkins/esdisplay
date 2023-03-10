import { attributesModule, classModule, eventListenersModule, init, propsModule } from "snabbdom";
import { Loop, LoopMessage } from "../loop.js";
import { View } from "./view.js";

export class Display {
  private appRoot: HTMLElement | undefined

  constructor(private loop: Loop, private view: View) {}

  mount(element: HTMLElement) {
    this.appRoot = element
    const mountPoint = document.createElement("div")
    this.appRoot.appendChild(mountPoint)

    this.appRoot.addEventListener("displayMessage", (evt) => {
      const displayMessageEvent = evt as CustomEvent<LoopMessage<any>>
      this.loop.dispatch(displayMessageEvent.detail)
    })

    const patch = init([
      propsModule,
      attributesModule,
      classModule,
      eventListenersModule
    ])

    patch(mountPoint, this.view)
  }

  destroy() {
    if (this.appRoot) {
      this.appRoot.childNodes.forEach(node => node.remove())
      this.appRoot = undefined
    }
  }
}