export const apiBaseUrl = (function () {
  if (process.env.TIMELINE_USEDEVAPI) {
    console.log('process.env.TIMELINE_USEDEVAPI is set, use dev api server!');
    return 'http://localhost:5000';
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Production mode!');
    return 'https://api.crupest.xyz';
  } else {
    console.log('Development mode!');
    return 'http://localhost:5000';
  }
})();
