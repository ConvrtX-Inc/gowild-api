export interface SocialInterface {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified?: 'true' | 'false' | boolean;
}
