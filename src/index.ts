import * as queryStringUtil from 'query-string';

export class CognitoUtil {
  private domain: string;
  private clientId: string;
  private redirectUri: string;

  constructor(domain: string, clientId: string, redirectUri: string) {
    this.domain = domain;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
  }

  public getAuthorizeUri(
    identityProvider: string,
    responseType: string
  ): string {
    return `${this.domain}/oauth2/authorize?identity_provider=${identityProvider}&response_type=${responseType}&client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
  }

  public storeTokenFromQueryString(queryString: string): void {
    const parsedQueryObj = queryStringUtil.parse(queryString);
    const accessToken = parsedQueryObj.access_token as string;
    const idToken = parsedQueryObj.id_token as string;
    const expiresIn = parsedQueryObj.expires_in as string;

    if (accessToken == null || idToken == null || expiresIn == null) {
      throw new Error(
        'Error: Invalid query string (need to have parameters access_token, id_token and expires_in)'
      );
    }

    this.storeToken(accessToken, idToken, parseInt(expiresIn));
  }

  public storeToken(
    accessToken: string,
    idToken: string,
    expiresIn: number
  ): void {
    const localStorage = window.localStorage;
    const expiresAt = expiresIn * 1000 + new Date().getTime();

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('expiresAt', expiresAt.toString());
  }

  public isAuthenticated(): boolean {
    const expiresAt = window.localStorage.getItem('expiresAt');
    return expiresAt != null && new Date().getTime() < Number(expiresAt);
  }

  public getIdToken(): string | null {
    return this.isAuthenticated()
      ? window.localStorage.getItem('idToken')
      : null;
  }
}
