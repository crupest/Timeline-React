export const apiBaseUrl = (function() {
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode!');
    return 'https://api.crupest.xyz';
  } else {
    console.log('Development mode!');
    return 'http://localhost:5000';
  }
})();
