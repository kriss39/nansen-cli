---
"nansen-cli": patch
---

fix profiler chain defaults so balance and counterparties-batch keep their cross-chain `all` defaults while other profiler endpoints retain `ethereum`, and ENS names continue to resolve without an explicit `--chain`.
