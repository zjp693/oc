const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..', '..')
const configPath = path.join(__dirname, 'local-android.config.json')
const command = process.argv[2] || 'check'

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function resolveFromRoot(value) {
  if (!value) return ''
  return path.isAbsolute(value) ? value : path.resolve(root, value)
}

function exists(file) {
  return fs.existsSync(file)
}

function status(label, ok, details = '') {
  const mark = ok ? 'OK ' : 'MISS'
  console.log(`[${mark}] ${label}${details ? ` - ${details}` : ''}`)
}

function run(exe, args, options = {}) {
  const result = spawnSync(exe, args, {
    cwd: root,
    stdio: options.capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
    shell: false,
    env: {
      ...process.env,
      JAVA_HOME: cfg.javaHome,
      ANDROID_HOME: cfg.androidSdk,
      ANDROID_SDK_ROOT: cfg.androidSdk,
      PATH: [
        path.join(cfg.javaHome, 'bin'),
        path.join(cfg.androidSdk, 'platform-tools'),
        process.env.PATH
      ].join(path.delimiter)
    }
  })

  if (options.capture) {
    return `${result.stdout || ''}${result.stderr || ''}`.trim()
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function findArg(name) {
  const prefix = `--${name}=`
  const arg = process.argv.find((item) => item.startsWith(prefix))
  return arg ? arg.slice(prefix.length) : ''
}

function getAndroidProject() {
  const fromArg = findArg('project')
  const project = fromArg || process.env.HBX_ANDROID_PROJECT || cfg.offlineProject
  return resolveFromRoot(project)
}

function getAppModule(androidProject) {
  const preferred = path.join(androidProject, cfg.appModule)
  if (exists(path.join(preferred, 'build.gradle')) || exists(path.join(preferred, 'build.gradle.kts'))) {
    return cfg.appModule
  }

  if (!exists(androidProject)) return cfg.appModule

  const candidates = fs.readdirSync(androidProject, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => {
      const dir = path.join(androidProject, name)
      const hasBuild = exists(path.join(dir, 'build.gradle')) || exists(path.join(dir, 'build.gradle.kts'))
      const hasManifest = exists(path.join(dir, 'src', 'main', 'AndroidManifest.xml'))
      return hasBuild && hasManifest
    })

  return candidates.find((name) => name === 'app') || candidates.find((name) => name === 'simpleDemo') || candidates[0] || cfg.appModule
}

function getAppResourceDir() {
  return path.join(root, 'unpackage', 'resources', cfg.appId)
}

function getAssetsAppsDir(androidProject, appModule) {
  return path.join(androidProject, appModule, 'src', 'main', 'assets', 'apps')
}

function getControlXml(androidProject, appModule) {
  return path.join(androidProject, appModule, 'src', 'main', 'assets', 'data', 'dcloud_control.xml')
}

function check() {
  const androidProject = getAndroidProject()
  const appModule = getAppModule(androidProject)
  const appResourceDir = getAppResourceDir()
  const localProperties = path.join(androidProject, 'local.properties')
  const controlXml = getControlXml(androidProject, appModule)
  const manifest = path.join(androidProject, appModule, 'src', 'main', 'AndroidManifest.xml')
  const appBuildGradle = path.join(androidProject, appModule, 'build.gradle')

  console.log(`Project: ${root}`)
  status('HBuilderX CLI', exists(cfg.hbuilderxCli), cfg.hbuilderxCli)
  if (exists(cfg.hbuilderxCli)) {
    const version = run(cfg.hbuilderxCli, ['--version'], { capture: true })
    if (version) console.log(`      HBuilderX: ${version.replace(/\x1b\[[0-9;]*m/g, '')}`)
  }

  status('Android SDK', exists(cfg.androidSdk), cfg.androidSdk)
  status('Android Studio JBR', exists(path.join(cfg.javaHome, 'bin', 'java.exe')), cfg.javaHome)
  if (exists(path.join(cfg.javaHome, 'bin', 'java.exe'))) {
    const javaVersion = run(path.join(cfg.javaHome, 'bin', 'java.exe'), ['-version'], { capture: true }).split(/\r?\n/)[0]
    if (javaVersion) console.log(`      Java: ${javaVersion}`)
  }

  status('DCloud app resource', exists(path.join(appResourceDir, 'www')), appResourceDir)
  status('DCloud Android offline project', exists(androidProject), androidProject)
  status('Android app module', exists(appBuildGradle), `${appModule} | ${appBuildGradle}`)
  status('local.properties', exists(localProperties), localProperties)
  status('dcloud_control.xml', exists(controlXml), controlXml)
  status('AndroidManifest.xml', exists(manifest), manifest)
  status('Debug keystore', exists(resolveFromRoot(cfg.debugKeystore)), `${resolveFromRoot(cfg.debugKeystore)} | SHA1 ${cfg.debugKeystoreSha1}`)

  if (!exists(androidProject)) {
    console.log('')
    console.log('Next: unzip DCloud Android offline SDK 5.07.2026041006, then copy its HBuilder-Integrate-AS folder to:')
    console.log(`      ${androidProject}`)
  }
}

function writeLocalProperties(androidProject) {
  const file = path.join(androidProject, 'local.properties')
  const escapedSdk = cfg.androidSdk.replace(/\\/g, '\\\\')
  fs.writeFileSync(file, `sdk.dir=${escapedSdk}\n`, 'utf8')
  console.log(`Wrote ${file}`)
}

function updateControlXml(androidProject, appModule) {
  const file = getControlXml(androidProject, appModule)
  if (!exists(file)) {
    console.warn(`Skipped dcloud_control.xml update; file not found: ${file}`)
    return
  }

  let text = fs.readFileSync(file, 'utf8')
  const original = text

  text = text.replace(/appid="[^"]*"/, `appid="${cfg.appId}"`)
  text = text.replace(/<app>\s*[^<]*\s*<\/app>/, `<app>${cfg.appId}</app>`)

  if (text !== original) {
    fs.writeFileSync(file, text, 'utf8')
    console.log(`Updated appid in ${file}`)
  } else {
    console.warn(`Could not auto-update appid in ${file}; please set it to ${cfg.appId}`)
  }
}

function copyAppResources(androidProject, appModule) {
  const source = getAppResourceDir()
  const target = path.join(getAssetsAppsDir(androidProject, appModule), cfg.appId)

  if (!exists(path.join(source, 'www'))) {
    throw new Error(`App resource is missing. Run npm run hbx:app-resource first. Expected: ${source}`)
  }

  fs.rmSync(target, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.cpSync(source, target, { recursive: true })
  console.log(`Copied ${source}`)
  console.log(`    to ${target}`)
}

function prepare() {
  const androidProject = getAndroidProject()
  const appModule = getAppModule(androidProject)

  if (!exists(androidProject)) {
    console.error(`DCloud Android offline project not found: ${androidProject}`)
    console.error('Copy HBuilder-Integrate-AS from the DCloud Android offline SDK there, or pass --project=D:\\path\\to\\HBuilder-Integrate-AS')
    process.exit(1)
  }

  run(process.execPath, [path.join(__dirname, 'hbx-cli.cjs'), 'app-resource'])
  writeLocalProperties(androidProject)
  copyAppResources(androidProject, appModule)
  updateControlXml(androidProject, appModule)

  console.log('')
  console.log(`Android module: ${appModule}`)
  console.log('Prepare complete. Open the Android project in Android Studio and set dcloud_appkey in AndroidManifest.xml before building.')
}

const cfg = readJson(configPath)
cfg.hbuilderxCli = resolveFromRoot(cfg.hbuilderxCli)
cfg.androidSdk = resolveFromRoot(cfg.androidSdk)
cfg.javaHome = resolveFromRoot(cfg.javaHome)

if (command === 'check') {
  check()
} else if (command === 'prepare') {
  prepare()
} else {
  console.error('Usage: node scripts/hbuilderx/local-android.cjs <check|prepare> [--project=D:\\path\\to\\HBuilder-Integrate-AS]')
  process.exit(1)
}
