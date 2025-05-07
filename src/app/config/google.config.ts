import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const googleAuthConfig = {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('753077454520-cflv3bp6pqaa3lelhue97d3bdde4qalt.apps.googleusercontent.com'),
      },
    ],
  } as SocialAuthServiceConfig,
};
