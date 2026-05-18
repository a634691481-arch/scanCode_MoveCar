<script setup>
  import { useLocale, useTheme } from '@/uni_modules/uview-pro'

  const { darkMode, themes, currentTheme } = useTheme()

  const { currentLocale } = useLocale()

  const currentThemeName = computed(() => currentTheme.value?.name)
  // const currentLocaleName = computed(() => currentLocale.value?.name)
</script>

<template>
  <u-config-provider :dark-mode="darkMode" :themes="themes" :current-theme="currentThemeName">
    <!-- #ifdef MP-WEIXIN -->
    <KuRootView />

    <!-- #endif -->
    <!-- #ifdef H5 -->
    <slot />
    <!-- #endif -->
    <u-toast global />
  </u-config-provider>
</template>

<style lang="scss"></style>
