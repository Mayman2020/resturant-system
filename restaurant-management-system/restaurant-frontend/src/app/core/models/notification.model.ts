export interface NotificationItem {
  id: number;
  titleKey: string;
  bodyKey: string;
  varsJson?: string;
  read: boolean;
  createdAt: string;
  referenceType?: string;
  referenceId?: number;
}
