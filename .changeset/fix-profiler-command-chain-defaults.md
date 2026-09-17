---
"nansen-cli": patch
---

Restore each profiler subcommand's own chain default instead of applying the balance command's `all` default to every profiler request, and keep ENS resolution working when `--chain` is omitted.
