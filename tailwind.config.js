const path = require('path')

const resolve = p => {
  return path.resolve(__dirname, p)
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // 注意此处，一定要 `path.resolve` 一下, 传入绝对路径
  // 你要有其他目录，比如 components，也必须在这里，添加一下
  content: [
    './index.html',
    './uni_modules/vk-uview-ui/components/**/*.{html,js,ts,jsx,tsx,vue}',
    './pages/**/*.{html,js,ts,jsx,tsx,vue}',
    './components/**/*.{html,js,ts,jsx,tsx,vue}',
  ].map(resolve),
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-disabled': 'var(--color-primary-disabled)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        'theme-text': 'var(--text-color)',
        'theme-text-grey': 'var(--text-color-grey)',
        'theme-bg': 'var(--bg-color)',
        'theme-bg-grey': 'var(--bg-color-grey)',
        'theme-border': 'var(--border-color)',
      },
    },
  },
  corePlugins: {
    // 跨多端可以 h5 开启，小程序关闭
    preflight: true,
  },
}
