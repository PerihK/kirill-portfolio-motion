# Brief handoff to Telegram

The result step's primary action opens `https://t.me/KiriwPerih?text=...`. Its draft is the current editable brief, encoded with `encodeURIComponent`, rather than a fixed greeting or a share link with a chat picker.

The link updates when a brief is generated, when the visitor edits the result, and immediately before activation. An empty result keeps the visitor on the page and focuses the editor. The result editor accepts at most 4000 UTF-16 units; generated answers are below this limit. Copying and downloading remain optional alternatives.

No server or Telegram credentials are required. The visitor controls opening Telegram and sending the resulting message. Browser QA verifies recipient, full round-trip text, reserved characters, newlines, emoji, edited results, regeneration and empty input; actual draft display is handled by the installed Telegram client.

Reference: https://core.telegram.org/api/links#public-username-links
