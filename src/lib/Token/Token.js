import Either from 'data.either';
import R from 'ramda';

const splitStr = R.curry((flag, str) => str.split(flag)[1]);

class Token {
  static getPayload() {
    return Token.getToken()
      .map(splitStr('.'))
      .chain(Token.urlBase64Decode)
      .map(JSON.parse);
  }

  // urlBase64Decode :: String -> Either(String)
  static urlBase64Decode(str) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        /* eslint new-cap:0 */
        return Either.Left('Illegal base64url string!');
    }

    /* eslint new-cap:0 */
    return Either.Right(window.atob(output));
  }

  static getToken() {
    return Either.fromNullable(localStorage.getItem('token'));
  }

  static setToken(str) {
    localStorage.setItem('token', str);
  }

  static deleteToken() {
    localStorage.removeItem('token');
  }
}

export
default Token;
