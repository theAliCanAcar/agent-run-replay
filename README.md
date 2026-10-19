# Agent Run Replay

Ordered event journal with pure replay without re-running tools.

Standalone ES module. No npm install required. Works in **Node.js 20+** and modern browsers (serve over HTTP for browser demos).

## Install / import

Copy the files into your project, or clone this repository:

```js
import { createRunReplay } from './agent-run-replay.js';
const run=createRunReplay();
run.append('VERIFY',{passed:false});
run.append('RETRY',{attempt:2});
run.append('VERIFY',{passed:true});
console.log(run.replay((last,event)=>
  event.type==='VERIFY' ? event.payload.passed : last,false));
```

## Use cases

### 1. Reconstruct a failed agent run

- **Scenario:** A workflow passes after a repair but the first attempt needs investigation.
- **Outcome:** Replay recorded events into a summary without executing the tools again.

### 2. Build an incident timeline

- **Scenario:** A reviewer needs to know what happened before a bad deployment.
- **Outcome:** Inspect ordered tool results, verification events, and retries.

## Exports

- `createRunReplay`
- `demoRunReplay`

## Notes

- Keep API keys and secrets out of this module and out of browser storage.
- Treat verification callbacks, ledger writers, and permission checks as trusted application code.
- This library is intentional local reliability plumbing, not a claim of cryptographic attestation unless stated in the source comments.

## License

MIT
