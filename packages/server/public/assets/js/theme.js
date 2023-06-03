void (function (window) {
  var dark = 'dark'
  var light = 'light'
  var defaultTheme = getDataTheme() || dark
  function setDataTheme(theme) {
    localStorage.setItem('theme', theme)
  }
  function getDataTheme() {
    return localStorage.getItem('theme')
  }
  function setTheme(theme) {
    if (!document.body.classList.contains(theme)) {
      document.body.classList.remove(dark)
      document.body.classList.remove(light)

      document.body.classList.add(theme)
    }
  }

  function isDark() {
    return document.body.classList.contains('dark')
  }

  function onSystemThemeChange(e) {
    var targetTheme = e.matches ? light : dark
    if (!document.body.classList.contains(targetTheme)) {
      setTheme(targetTheme)
      setDataTheme(targetTheme)
    }
  }

  function manualToggleTheme() {
    if (isDark()) {
      setTheme(light)
      setDataTheme(light)
      importMarkdownStyle(light)
      console.log(light)
    } else {
      setTheme(dark)
      setDataTheme(dark)
      importMarkdownStyle(dark)
      console.log(dark)
    }
  }

  function removeLinkByUrl(url) {
    console.log('link[href="' + url + '"]')
    const link = document.querySelector('link[href="' + url + '"]')
    console.log('link', link)
    if (link) {
      document.head.removeChild(link)
    }
  }

  function importMarkdownStyle(type) {
    if (!location.href.includes('/article/')) return
    let lightUrl = '/assets/styles/markdown/a11y.light.min.css'
    let darkUrl = '/assets/styles/markdown/a11y.dark.min.css'
    let url = lightUrl
    if (type === dark) {
      url = darkUrl
    }
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', url)
    document.head.appendChild(link)
    if (type === dark) {
      removeLinkByUrl(lightUrl)
    } else {
      removeLinkByUrl(darkUrl)
    }
  }

  window.addEventListener('load', function () {
    var theme = defaultTheme
    var lightTheme = window.matchMedia('(prefers-color-scheme: light)')
    if (lightTheme.matches === true) {
      theme = light
    }
    lightTheme.addEventListener('change', onSystemThemeChange)
    setTheme(theme)
    document.body.style.display = ''
    setDataTheme(theme)
    importMarkdownStyle(theme)

    const themeBtn = document.querySelector('#theme-btn')
    themeBtn.addEventListener('click', manualToggleTheme)
  })
})(window)
