const { spawnSync } = require('node:child_process')
const path = require('node:path')

const hbuilderxCli = 'D:\\software\\HBuilderX\\cli.exe'
const project = path.resolve(__dirname, '..', '..')

const command = process.argv[2]

const commandArgs = {
  open: ['project', 'open', '--path', project],
  'app-resource': ['publish', 'app-android', '--type', 'appResource', '--project', project],
  'pack-android': [
    'pack',
    '--project',
    project,
    '--platform',
    'android',
    '--iscustom',
    'false',
    '--safemode',
    'true',
    '--sourceMap',
    'false',
    '--isconfusion',
    'false',
    '--splashads',
    'false',
    '--rpads',
    'false',
    '--unimpads',
    'false',
    '--android.packagename',
    'com.zhangsir.occ',
    '--android.androidpacktype',
    '3'
  ]
}

if (!command || !commandArgs[command]) {
  console.error('Usage: node scripts/hbuilderx/hbx-cli.cjs <open|app-resource|pack-android>')
  process.exit(1)
}

const result = spawnSync(hbuilderxCli, commandArgs[command], {
  stdio: 'inherit',
  shell: false
})

process.exit(result.status ?? 1)
