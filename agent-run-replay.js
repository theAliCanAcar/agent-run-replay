/** Ordered JSON event journal. Optional storage implements localStorage getItem/setItem. */
export function createRunReplay({ storage, storageKey = 'agent-run-replay', now = Date.now } = {}) {
  const clone = value => JSON.parse(JSON.stringify(value));
  let events = storage ? JSON.parse(storage.getItem(storageKey) || '[]') : [];
  if (!Array.isArray(events) || events.some((event, index) => event.sequence !== index + 1)) throw new Error('Invalid persisted event log');
  function save(next) { const copy = clone(next); storage?.setItem(storageKey, JSON.stringify(copy)); events = copy; }
  return {
    append(type, payload = {}) {
      if (typeof type !== 'string' || !type.trim()) throw new TypeError('Event type is required');
      const event = { sequence: events.length + 1, timestamp: now(), type, payload: clone(payload) };
      save([...events, event]); return clone(event);
    },
    list() { return clone(events); },
    /** Pure reconstruction: reducers never execute the original tools. */
    replay(reducer, initialState) { return clone(events).reduce(reducer, initialState); },
    clear() { save([]); },
  };
}

export function demoRunReplay() {
  const log = createRunReplay({ now: () => 1720000000000 });
  log.append('BUILD', { artifact: 'answer.txt' });
  log.append('VERIFY', { passed: false });
  log.append('RETRY', { attempt: 2 });
  log.append('VERIFY', { passed: true });
  return { events: log.list(), verification: log.replay((state, event) => event.type === 'VERIFY' ? event.payload.passed : state, false) };
}
