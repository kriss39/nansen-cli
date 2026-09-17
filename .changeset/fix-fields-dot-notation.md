---
"nansen-cli": patch
---

fix `--fields` nested dot notation so paths such as `data.results` and `data.results.token_symbol` select the intended branch without changing existing leaf-field filtering.
