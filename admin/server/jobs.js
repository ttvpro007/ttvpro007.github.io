/**
 * Long-running admin tasks (build, publish). A job collects its log so the UI
 * can poll GET /jobs/:id; only one job runs at a time.
 */
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const jobs = new Map();
let running = null;

export const getJob = (id) => jobs.get(id);

export function startJob(kind, fn) {
  if (running) throw Object.assign(new Error(`A ${jobs.get(running).kind} is already running`), { status: 409 });
  const id = randomUUID();
  const job = { id, kind, status: 'running', log: '', startedAt: Date.now() };
  jobs.set(id, job);
  running = id;
  const log = (text) => { job.log += text; };
  fn(log)
    .then(() => { job.status = 'done'; })
    .catch((err) => { job.status = 'failed'; log(`\n❌ ${err.message}\n`); })
    .finally(() => { running = null; job.finishedAt = Date.now(); });
  return id;
}

/** Run a command without a shell (arguments are never interpreted). Rejects on non-zero exit. */
export function run(cmd, args, log) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' } });
    let out = '';
    // eslint-disable-next-line no-control-regex -- strip terminal color codes from tool output
    const onData = (d) => { const text = d.toString().replace(/\x1b\[[0-9;]*m/g, ''); out += text; log?.(text); };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve({ out }) : reject(new Error(`${cmd} ${args[0]} exited with code ${code}`))));
  });
}
