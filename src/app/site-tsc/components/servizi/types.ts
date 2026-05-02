export type ServiceStatus = 'available' | 'maintenance' | 'unavailable';

export interface PaymentMethod {
  id: string;
  name: string;
  icon_name: string;
  enabled: boolean;
}

export interface QuickService {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  color_class: string;
  status: ServiceStatus;
  sort_order: number;
  accepted_methods: PaymentMethod[];
}