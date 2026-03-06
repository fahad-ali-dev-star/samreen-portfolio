const { execSync } = require('child_process');

const port = process.argv[2] || '3001';

function unique(values) {
  return [...new Set(values)];
}

function getPidsOnWindows(targetPort) {
  try {
    const output = execSync(`netstat -ano -p tcp | findstr :${targetPort}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });

    const lines = output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => line.includes('LISTENING'));

    const pids = lines
      .map((line) => line.split(/\s+/).pop())
      .filter(Boolean)
      .map((pid) => parseInt(pid, 10))
      .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid);

    return unique(pids);
  } catch {
    return [];
  }
}

function stopStaleNodemonOnWindows() {
  try {
    const command = [
      'powershell',
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      '"Get-CimInstance Win32_Process | Where-Object { $_.Name -eq \'node.exe\' -and $_.CommandLine -like \'*nodemon*server.js*\' -and $_.CommandLine -like \'*portfolio-react*\' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"'
    ].join(' ');
    execSync(command, { stdio: 'ignore' });
  } catch {
    // Ignore if no stale nodemon process is found
  }
}

function getPidsOnUnix(targetPort) {
  try {
    const output = execSync(`lsof -ti tcp:${targetPort} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });

    const pids = output
      .split(/\r?\n/)
      .map((line) => parseInt(line.trim(), 10))
      .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid);

    return unique(pids);
  } catch {
    return [];
  }
}

function killPid(pid) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    } else {
      process.kill(pid, 'SIGTERM');
    }
    return true;
  } catch {
    return false;
  }
}

if (process.platform === 'win32') {
  stopStaleNodemonOnWindows();
}

const pids =
  process.platform === 'win32'
    ? getPidsOnWindows(port)
    : getPidsOnUnix(port);

if (pids.length === 0) {
  console.log(`[free-port] Port ${port} is already free.`);
  process.exit(0);
}

let killed = 0;
for (const pid of pids) {
  if (killPid(pid)) killed += 1;
}

if (killed > 0) {
  console.log(`[free-port] Freed port ${port} by stopping ${killed} process(es): ${pids.join(', ')}`);
} else {
  console.log(`[free-port] Found process(es) on port ${port} but could not stop them: ${pids.join(', ')}`);
}
