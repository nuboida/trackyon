export const Token = 'token';
export const User = 'user';
export const Company = 'company';

export function tokenGetter(): string | null {
  return sessionStorage.getItem(Token);
}
