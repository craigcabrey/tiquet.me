'use strict';

function cookiesToObject() {
  return document.cookie.split(';').map(
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

var cookieObject = cookiesToObject();

if (typeof cookieObject === 'object') {
  if (cookieObject.hasOwnProperty('access_token')) {
    var accessToken = cookieObject.access_token;
    localStorage.setItem('$LoopBack$accessTokenId', accessToken);
  }

  if (cookieObject.hasOwnProperty('userId')) {
    var userId = cookieObject.userId;
    localStorage.setItem('$LoopBack$currentUserId', userId);
  }
}
