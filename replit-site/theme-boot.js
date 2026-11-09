/**
 * Runs before React mounts: stamps the saved (or system-preferred) theme onto
 * <html> so the very first painted frame is already the right colour. Kept
 * dependency-free and synchronous on purpose — anything async would paint the
 * default theme first and flash.
 *
 * Reads the same cookies the app writes, and respects consent the same way: no
 * `madrigal_consent=accepted`, no stored theme, so a user who declined is not
 * quietly themed from a cookie the app has promised not to keep.
 */
(function () {
  try {
    function cookie(name) {
      var parts = document.cookie.split(';');
      for (var i = 0; i < parts.length; i++) {
        var eq = parts[i].indexOf('=');
        if (eq === -1) continue;
        if (parts[i].slice(0, eq).trim() !== name) continue;
        try {
          return decodeURIComponent(parts[i].slice(eq + 1).trim());
        } catch (error) {
          return null;
        }
      }
      return null;
    }

    var stored = cookie('madrigal_consent') === 'accepted' ? cookie('madrigal_theme') : null;
    var prefersDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (error) {
    // Defensive: light is a safe floor if anything above is unavailable.
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
