import { Context } from "esbehavior";
import { State } from "../../src/state";
import { TestLoop } from "./testLoop";

export function testSubscriberContext<S>(): Context<TestSubscriberContext<S>> {
  return {
    init: () => new TestSubscriberContext<S>()
  }
}

export class TestSubscriberContext<S> extends TestLoop<S> {
  private subscribers: Map<string, Array<any>> = new Map()

  subscribeTo<T>(state: State<T>, name: string) {
    state.onChange((updatedValue) => {
      const values = this.subscribers.get(name)
      if (values === undefined) {
        this.subscribers.set(name, [updatedValue])
      } else {
        values.push(updatedValue)
      }
    })
  }

  valuesReceivedBy(name: string): Array<any> {
    return this.subscribers.get(name) ?? []
  }
}