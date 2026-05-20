const ci = require('miniprogram-ci')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { spawn, execSync } = require('child_process')
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

// ====== 获取开发者名称 ======
function getDeveloperName() {
  // 优先级：Git用户名 > 系统用户名
  try {
    const gitName = execSync('git config user.name', { encoding: 'utf-8', cwd: ROOT }).trim()
    if (gitName) return gitName
  } catch {}
  try {
    return os.userInfo().username || 'developer'
  } catch {
    return 'developer'
  }
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

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

function getBuildStats(dir) {
  try {
    let totalSize = 0, fileCount = 0
    function walk(d) {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, entry.name)
        if (entry.isDirectory()) walk(p)
        else { totalSize += fs.statSync(p).size; fileCount++ }
      }
    }
    walk(dir)
    return { size: formatSize(totalSize), files: fileCount }
  } catch {
    return null
  }
}

function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8', cwd: ROOT }).trim()
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8', cwd: ROOT }).trim()
    const dirty = execSync('git status --porcelain', { encoding: 'utf-8', cwd: ROOT }).trim().length > 0
    return { branch, hash, dirty }
  } catch {
    return null
  }
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

  const developer = getDeveloperName()
  const skipBuild = process.argv.includes('--skip-build')
  const descArg = process.argv.find((arg, i) => i >= 2 && !arg.startsWith('--'))
  const desc = descArg || `${developer} 提交 v${version} ${new Date().toLocaleString('zh-CN')}`
  let hxCli = null

  // 打印项目信息
  const gitInfo = getGitInfo()
  const manifest = readManifest()
  console.log(
    boxen(
      [
        `${chalk.bold('项目')}      ${chalk.white(manifest.name || path.basename(ROOT))}`,
        `${chalk.bold('AppID')}     ${chalk.cyan(appid)}`,
        `${chalk.bold('版本')}      ${chalk.cyan(version)} ${chalk.gray(`(code: ${versionCode})`)}`,
        gitInfo
          ? `${chalk.bold('Git')}       ${chalk.white(gitInfo.branch)}@${chalk.gray(gitInfo.hash)}${gitInfo.dirty ? chalk.yellow(' (有未提交修改)') : ''}`
          : '',
        `${chalk.bold('开发者')}    ${chalk.cyan(developer)}`,
        `${chalk.bold('描述')}      ${chalk.white(desc)}`,
      ].filter(Boolean).join('\n'),
      {
        padding: { left: 1, right: 1, top: 0, bottom: 0 },
        borderColor: 'gray',
        borderStyle: 'round',
        dimBorder: true,
      },
    ),
  )
  console.log()

  // Step 1: 构建
  if (!skipBuild) {
    const buildSpinner = ora({ text: chalk.cyan('构建微信小程序...'), prefixText: '  ' }).start()
    hxCli = getHBuilderXCli()
    if (hxCli) {
      const projectName = path.basename(ROOT)
      // 备份 manifest.json（HBuilderX CLI 构建时会修改源文件，如清空 appid）
      const manifestBackup = fs.readFileSync(MANIFEST_PATH, 'utf-8')
      try {
        buildSpinner.stop()
        // 使用 publish mp-weixin 子命令 + 完整 CI 参数，编译后直接上传，不打开开发者工具
        await runCommand(hxCli, [
          'publish', 'mp-weixin',
          '--project', projectName,
          '--appid', appid,
          '--upload', 'true',
          '--version', version,
          '--privatekey', KEY_PATH,
          '--description', desc,
          '--robot', String(UPLOAD_CONFIG.robot),
        ])
        console.log(`  ${chalk.green(figures.tick)} ${chalk.green('构建并上传完成')}`)
      } catch {
        buildSpinner.stop()
        warn('HBuilderX CLI 构建/上传失败')
      } finally {
        // 恢复 manifest.json，防止 HBuilderX 修改源文件
        fs.writeFileSync(MANIFEST_PATH, manifestBackup, 'utf-8')
      }
    } else {
      buildSpinner.stop()
      warn('未找到 HBuilderX CLI，跳过自动构建')
      console.log(chalk.gray('    请先在 HBuilderX 中手动执行「发行 → 小程序-微信」'))
    }
  } else {
    console.log(`  ${chalk.gray(figures.arrowRight)} ${chalk.gray('跳过构建 (--skip-build)')}`)
  }

  // Step 2: 上传（兜底：如果 HBuilderX CLI 未直接上传，则用 miniprogram-ci）
  let uploaded = false
  if (skipBuild || !hxCli) {
    if (!fs.existsSync(PROJECT_PATH)) {
      fatal(`构建产物不存在\n  ${chalk.gray('请先在 HBuilderX 中执行「发行 → 小程序-微信」构建')}`)
    }

    console.log()
    console.log(
      boxen(
        [
          `${chalk.bold('AppID')}     ${chalk.cyan(appid)}`,
          `${chalk.bold('版本')}      ${chalk.cyan(version)}`,
          `${chalk.bold('开发者')}    ${chalk.cyan(developer)}`,
          `${chalk.bold('描述')}      ${chalk.white(desc)}`,
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
      uploaded = true
    } catch (err) {
      uploadSpinner.fail(chalk.red('上传失败'))
      fatal(err.message || String(err))
    }
  } else {
    uploaded = true
    console.log(`  ${chalk.green(figures.tick)} ${chalk.green('已通过 HBuilderX CLI 完成上传')}`)
  }

  // Step 3: 版本号自增
  const newVersion = bumpVersion(version)
  const newCode = versionCode + 1
  updateManifestVersion(newVersion, newCode)

  // 构建产物统计
  const buildStats = fs.existsSync(PROJECT_PATH) ? getBuildStats(PROJECT_PATH) : null

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
        buildStats
          ? `${chalk.gray('构建产物')}  ${chalk.white(buildStats.size)} / ${chalk.white(buildStats.files + ' 个文件')}`
          : '',
        `${chalk.gray('上传方式')}  ${chalk.white(hxCli ? 'HBuilderX CLI' : 'miniprogram-ci')}`,
        `${chalk.gray('体验版')}    ${chalk.cyan.underline('https://mp.weixin.qq.com')}`,
      ].filter(Boolean).join('\n'),
      { padding: 1, borderColor: 'green', borderStyle: 'round' },
    ),
  )
  console.log()
}

main()
