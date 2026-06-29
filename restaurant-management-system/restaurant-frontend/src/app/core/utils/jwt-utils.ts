export class JwtUtils {
  static decode(token: string): Record<string, unknown> | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      return JSON.parse(atob(padded));
    } catch { return null; }
  }
  static isExpired(token: string): boolean {
    const d = this.decode(token);
    if (!d || typeof d['exp'] !== 'number') return true;
    return (d['exp'] as number) * 1000 < Date.now();
  }
  static getRole(token: string): string | null {
    const d = this.decode(token);
    if (!d) return null;
    const roles = d['roles'] as string[] | undefined;
    if (Array.isArray(roles) && roles.length) return roles[0];
    return (d['role'] as string) ?? null;
  }
}
