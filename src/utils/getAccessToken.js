export const getAccessToken = () => {
  // Om Spotify skickar tillbaka via hash
  const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
  const accessTokenFromHash = hashParams.get('access_token');

  // Om Spotify skickar tillbaka via query params (?code= eller ?access_token=)
  const queryParams = new URLSearchParams(window.location.search);
  const accessTokenFromQuery = queryParams.get('access_token');

  return accessTokenFromHash || accessTokenFromQuery;
};
