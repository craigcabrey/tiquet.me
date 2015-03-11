function cookiesToObject() {
  document.cookie.split(';').map(
    function(keyValueString) {
      return keyValueString.trim().split('=');
    }
  ).reduce( 
    function(cookieObject, keyValuePair) {
      cookieObject[keyValuePair[0]] = keyValuePair[1];
      return cookieObject;
    },
    {}
  );
}

cookieObject = cookiesToObject();

if (cookieObject.hasOwnProperty('access_token')) {
  accessToken = cookieObject['access_token'];
  localStorage.setItem('$LoopBack$accessTokenId', accessToken);
}

if (cookieObject.hasOwnProperty('userId')) {
  userId = cookieObject['userId'];
  localStorage.setItem('$LoopBack$currentUserId', userId);
}
