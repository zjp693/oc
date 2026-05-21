const { spawnSync } = require('node:child_process')
const path = require('node:path')

const hbuilderxCli = 'D:\\software\\HBuilderX\\cli.exe'
const project = path.resolve(__dirname, '..', '..')

const command = process.argv[2]
const passthroughArgs = process.argv.slice(3)

const androidPackBaseArgs = [
  'pack',
  '--project',
  project,
  '--platform',
  'android',
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

const commandArgs = {
  open: ['project', 'open', '--path', project],
  devices: ['devices', 'list', '--platform', 'android'],
  'app-resource': ['publish', 'app-android', '--type', 'appResource', '--project', project],
  'pack-android': [
    ...androidPackBaseArgs,
    '--iscustom',
    'false'
  ],
  'pack-android-custom': [
    ...androidPackBaseArgs,
    '--iscustom',
    'true'
  ],
  'run-android': [
    'launch',
    'app-android',
    '--project',
    project,
    '--playground',
    'standard',
    '--native-log',
    'true'
  ],
  'run-android-custom': [
    'launch',
    'app-android',
    '--project',
    project,
    '--playground',
    'custom',
    '--native-log',
    'true'
  ],
  'logcat-android': [
    'logcat',
    'app-android',
    '--project',
    project,
    '--mode',
    'full'
  ]
}

if (!command || !commandArgs[command]) {
  console.error('Usage: node scripts/hbuilderx/hbx-cli.cjs <open|devices|app-resource|pack-android|pack-android-custom|run-android|run-android-custom|logcat-android> [extra HBuilderX CLI args]')
  process.exit(1)
}

const result = spawnSync(hbuilderxCli, [...commandArgs[command], ...passthroughArgs], {
  stdio: 'inherit',
  shell: false
})

process.exit(result.status ?? 1)
