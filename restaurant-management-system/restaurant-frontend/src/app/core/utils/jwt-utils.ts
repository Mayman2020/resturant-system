export class JwtUtils {
  static decode(token: string): Record<string, unknown> | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
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
