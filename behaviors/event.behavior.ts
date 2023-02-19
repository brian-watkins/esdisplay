import { behavior, effect, example, fact, step } from "esbehavior";
import { State, writeMessage } from "../src/loop";
import { testAppContext } from "./helpers/testApp";
import * as View from "../src/display"
import { expect, is, stringContaining } from "great-expectations";
import { container, state, withDerivedValue, withInitialValue } from "../src";

interface ClickCounterState {
  clickCounterView: State<View.View>
}

export default behavior("view events", [
  example(testAppContext<ClickCounterState>())
    .description("counting clicks with local state")
    .script({
      suppose: [
        fact("there is a view that depends on click count", (context) => {
          const clickCount = container(withInitialValue(0))

          const clickCounterView = state(withDerivedValue((get) => {
            return View.div([], [
              View.button([
                View.onClick(writeMessage(clickCount, get(clickCount) + 1))
              ], ["Click me!"]),
              View.p([View.data("click-count")], [
                `You've clicked the button ${get(clickCount)} times!`
              ])
            ])
          }))

          context.setState({
            clickCounterView
          })

          context.setView(View.div([], [
            View.h1([], ["This is the click counter!"]),
            View.viewGenerator(context.state.clickCounterView)
          ]))

          context.start()
        })
      ],
      perform: [
        step("the button is clicked three times", (context) => {
          context.display.elementMatching("button").click()
          context.display.elementMatching("button").click()
          context.display.elementMatching("button").click()
        })
      ],
      observe: [
        effect("the click counter is updated", (context) => {
          const counterText = context.display.elementMatching("[data-click-count]").text()
          expect(counterText, is(stringContaining("3 times")))
        })
      ]
    })
])