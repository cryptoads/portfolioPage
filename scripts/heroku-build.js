const { spawnSync } = require('child_process');

const result = spawnSync(
  process.execPath,
  ['--openssl-legacy-provider', require.resolve('react-scripts/scripts/build')],
  { stdio: 'inherit' }
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status || 0);
