const ci = require('miniprogram-ci')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { spawn } = require('child_process')
const chalk = require('chalk')
const ora = require('ora')
const boxen = require('boxen')
const figures = require('figures')

const ROOT = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(ROOT, 'manifest.json')
const PROJECT_PATH = path.join(ROOT, 'unpackage/dist/build/mp-weixin')

// ====== 上传配置（可在此调整）======
const UPLOAD_CONFIG = {
  // 编译设置
  setting: {
    es6: true, // 开启ES6转ES5
    es7: false,
    minify: true, // 压缩代码
    minifyJS: true, // 压缩JS
    minifyWXML: true, // 压缩wxml
    minifyWXSS: true, // 压缩wxss
    codeProtect: false, // 代码保护
    autoPrefixWXSS: true, // 自动补全wxss前缀
  },
  // 上传后设为体验版
  setExperience: true,
  // 机器人编号（1-30，用于区分不同上传渠道）
  robot: 1,
  // 上传线程数
  threads: 8,
}

// ====== 工具函数 ======

function stripJsonComments(str) {
  let result = '',
    inString = false,
    inComment = false,
    commentType = ''
  for (let i = 0; i < str.length; i++) {
    const c = str[i],
      n = str[i + 1]
    if (!inComment && c === '"' && (i === 0 || str[i - 1] !== '\\')) {
      inString = !inString
    }
    if (inString) {
      result += c
      continue
    }
    if (!inComment && c === '/' && n === '/') {
      inComment = true
      commentType = 'single'
      i++
      continue
    }
    if (!inComment && c === '/' && n === '*') {
      inComment = true
      commentType = 'multi'
      i++
      continue
    }
    if (inComment && commentType === 'single' && (c === '\n' || c === '\r')) {
      inComment = false
      result += c
      continue
    }
    if (inComment && commentType === 'multi' && c === '*' && n === '/') {
      inComment = false
      i++
      continue
    }
    if (!inComment) result += c
  }
  return result
}

function readManifest() {
  return JSON.parse(stripJsonComments(fs.readFileSync(MANIFEST_PATH, 'utf-8')))
}

function getConfig() {
  const manifest = readManifest()
  return {
    appid: manifest['mp-weixin'] && manifest['mp-weixin'].appid,
    version: manifest.versionName || '1.0.0',
    versionCode: manifest.versionCode || 1,
  }
}

function bumpVersion(ver) {
  const parts = ver.split('.')
  parts[parts.length - 1] = String(Number(parts[parts.length - 1]) + 1)
  return parts.join('.')
}

function updateManifestVersion(newVersion, newCode) {
  let raw = fs.readFileSync(MANIFEST_PATH, 'utf-8')
  raw = raw.replace(/"versionName"\s*:\s*"[^"]*"/, `"versionName" : "${newVersion}"`)
  raw = raw.replace(/"versionCode"\s*:\s*\d+/, `"versionCode" : ${newCode}`)
  fs.writeFileSync(MANIFEST_PATH, raw, 'utf-8')
}

function getHBuilderXCli() {
  if (process.platform === 'win32') {
    const candidates = [
      path.join(os.homedir(), 'AppData/Local/Programs/HBuilderX/cli.exe'),
      'C:/Program Files/HBuilderX/cli.exe',
      'D:/HBuilderX/cli.exe',
    ]
    for (const p of candidates) {
      if (fs.existsSync(p)) return p
    }
  } else {
    const macPath = '/Applications/HBuilderX.app/Contents/MacOS/cli'
    if (fs.existsSync(macPath)) return macPath
  }
  return null
}

function runCommand(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts })
    child.on('close', code => (code === 0 ? resolve() : reject(new Error(`exit code ${code}`))))
    child.on('error', reject)
  })
}

function fatal(msg) {
  console.log(`\n  ${chalk.red(figures.cross)} ${chalk.red.bold('ERROR')} ${msg}\n`)
  process.exit(1)
}

function warn(msg) {
  console.log(`  ${chalk.yellow(figures.warning)} ${chalk.yellow(msg)}`)
}

function info(label, value) {
  console.log(`  ${chalk.gray(label)}  ${chalk.white(value)}`)
}

// ====== 主流程 ======

async function main() {
  // 标题
  console.log()
  console.log(
    boxen(chalk.green.bold(' WeChat MiniProgram Uploader '), {
      padding: { left: 2, right: 2, top: 0, bottom: 0 },
      borderColor: 'green',
      borderStyle: 'round',
    }),
  )
  console.log()

  const { appid, version, versionCode } = getConfig()

  if (!appid) fatal('manifest.json 中未找到 mp-weixin.appid')

  const KEY_PATH = path.resolve(__dirname, `private/private.${appid}.key`)
  if (!fs.existsSync(KEY_PATH)) {
    fatal(`密钥文件不存在\n  ${chalk.gray('请放入:')} scripts/private/private.${appid}.key`)
  }

  const desc = process.argv[2] || `v${version} ${new Date().toLocaleString('zh-CN')}`
  const skipBuild = process.argv.includes('--skip-build')

  // Step 1: 构建
  if (!skipBuild) {
    const buildSpinner = ora({ text: chalk.cyan('构建微信小程序...'), prefixText: '  ' }).start()
    const hxCli = getHBuilderXCli()
    if (hxCli) {
      const projectName = path.basename(ROOT)
      // 备份 manifest.json（HBuilderX CLI 构建时会修改源文件，如清空 appid）
      const manifestBackup = fs.readFileSync(MANIFEST_PATH, 'utf-8')
      try {
        buildSpinner.stop()
        await runCommand(hxCli, ['publish', '--platform', 'mp-weixin', '--project', projectName])
        console.log(`  ${chalk.green(figures.tick)} ${chalk.green('构建完成')}`)
      } catch {
        buildSpinner.stop()
        warn('HBuilderX CLI 构建失败，尝试使用已有构建产物...')
      }
      // 恢复 manifest.json，防止 HBuilderX 修改源文件
      fs.writeFileSync(MANIFEST_PATH, manifestBackup, 'utf-8')
    } else {
      buildSpinner.stop()
      warn('未找到 HBuilderX CLI，跳过自动构建')
      console.log(chalk.gray('    请先在 HBuilderX 中手动执行「发行 → 小程序-微信」'))
    }
  } else {
    console.log(`  ${chalk.gray(figures.arrowRight)} ${chalk.gray('跳过构建 (--skip-build)')}`)
  }

  if (!fs.existsSync(PROJECT_PATH)) {
    fatal(`构建产物不存在\n  ${chalk.gray('请先在 HBuilderX 中执行「发行 → 小程序-微信」构建')}`)
  }

  // Step 2: 上传
  console.log()
  console.log(
    boxen(
      [
        `${chalk.bold('AppID')}   ${chalk.cyan(appid)}`,
        `${chalk.bold('版本')}    ${chalk.cyan(version)}`,
        `${chalk.bold('描述')}    ${chalk.white(desc)}`,
      ].join('\n'),
      {
        padding: { left: 1, right: 1, top: 0, bottom: 0 },
        borderColor: 'cyan',
        borderStyle: 'round',
        title: '上传信息',
        titleAlignment: 'left',
      },
    ),
  )
  console.log()

  const uploadSpinner = ora({ text: chalk.cyan('正在上传体验版...'), prefixText: '  ' }).start()

  const project = new ci.Project({
    appid,
    type: 'miniProgram',
    projectPath: PROJECT_PATH,
    privateKeyPath: KEY_PATH,
    ignores: ['node_modules/**/*'],
  })

  try {
    await ci.upload({
      project,
      version,
      desc,
      ...UPLOAD_CONFIG,
    })
    uploadSpinner.succeed(chalk.green('上传成功'))
  } catch (err) {
    uploadSpinner.fail(chalk.red('上传失败'))
    fatal(err.message || String(err))
  }

  // Step 3: 版本号自增
  const newVersion = bumpVersion(version)
  const newCode = versionCode + 1
  updateManifestVersion(newVersion, newCode)

  // 结果
  console.log()
  console.log(
    boxen(
      [
        `${chalk.green(figures.tick)} ${chalk.green.bold('上传成功')}`,
        '',
        `${chalk.gray('当前版本')}  ${chalk.white.bold(version)}`,
        `${chalk.gray('下次版本')}  ${chalk.cyan.bold(newVersion)} ${chalk.gray('(已自动更新)')}`,
        `${chalk.gray('描述信息')}  ${chalk.white(desc)}`,
      ].join('\n'),
      { padding: 1, borderColor: 'green', borderStyle: 'round' },
    ),
  )
  console.log()
}

main()
