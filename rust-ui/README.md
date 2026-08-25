# BurnCloud Rust UI

This subproject is the incremental Rust migration of the BurnCloud UI workbench.
The first migrated route is `GET /buyer/overview`.

## Run

From the `burncloud-ui` repository root:

```powershell
cargo run --manifest-path rust-ui/Cargo.toml
```

Open `http://127.0.0.1:3001/buyer/overview`.

Set a different port with `BURNCLOUD_UI_PORT`. The legacy React source remains in the
repository as the source for pages that have not yet been migrated.

## QA states

The page uses deterministic workbench data until backend APIs are connected. State
variants are available through `?state=`:

- `healthy` (default)
- `low`
- `critical`
- `exhausted`
- `empty`
- `partial`
- `unknown`
- `loading`

