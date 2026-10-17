---
title: "What I learned building an AI fact-checker"
date: 2026-10-17
description: "Four lessons from my thesis on AI agents and official data."
---

For my thesis I built a system that checks claims about the economy against official data from Eurostat and the Bank of Spain. I built it twice, as a team of AI agents and as a single agent, to see which works better.

## Let the model read, let code count

The model understands the question and writes the answer. Fetching the data and doing the math is plain code. That way every answer traces back to a real number.

## More agents isn't automatically better

The single agent was more accurate. The multi-agent version was faster and much easier to debug. It's a trade-off, not an upgrade.

## Measure each step, not just the result

Checking each step on its own showed me where the errors started. That told me what to change in the architecture, and the second version was much better.

## Good data doesn't guarantee a good answer

Official data doesn't stop a model from misreading it. So every answer shows the numbers behind it.
