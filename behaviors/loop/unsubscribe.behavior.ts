import { behavior, effect, example, fact, step } from "esbehavior";
import { equalTo, expect, is } from "great-expectations";
import { container, withInitialValue } from "@src/index.js";
import { Container } from "@src/loop.js";
import { testSubscriberContext } from "./helpers/testSubscriberContext.js";

interface BasicUnsubscribeContext {
  numberContainer: Container<number>
}

export default behavior("unsubscribe from state", [
  example(testSubscriberContext<BasicUnsubscribeContext>())
    .description("a subscriber unsubscribes")
    .script({
      suppose: [
        fact("there is a container", (context) => {
          context.setState({
            numberContainer: container(withInitialValue(0))
          })
        }),
        fact("there is a subscriber", (context) => {
          context.subscribeTo(context.state.numberContainer, "sub-one")
        }),
        fact("there is another subscriber", (context) => {
          context.subscribeTo(context.state.numberContainer, "sub-two")
        })
      ],
      perform: [
        step("the first subscriber unsubscribes", (context) => {
          context.unsubscribe("sub-one")
        }),
        step("the container value is updated", (context) => {
          context.write(context.state.numberContainer, 27)
        })
      ],
      observe: [
        effect("the first subscriber only ever received the initial value", (context) => {
          expect(context.valuesReceivedBy("sub-one"), is(equalTo([
            0
          ])))
        }),
        effect("the second subscriber received the update", (context) => {
          expect(context.valuesReceivedBy("sub-two"), is(equalTo([
            0,
            27
          ])))
        })
      ]
    })
])
