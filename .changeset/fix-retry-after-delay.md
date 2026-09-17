---
"nansen-cli": patch
---

honor server `Retry-After` delays even when they exceed the client's exponential-backoff cap, for both seconds and HTTP-date forms.
