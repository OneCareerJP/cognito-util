export class CognitoUtil {
  private domain: string;
  private clientId: string;
  private redirectUri: string;

  constructor(
    domain: string,
    clientId: string,
    redirectUri: string
  ) {
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
}
