export interface MyAppConfig {
    oidc: {
        clientId: '0oagcdq9h6n2MFysG5d7',
        issuer: 'https://dev-47514590.okta.com/oauth2/default',
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    }
}
