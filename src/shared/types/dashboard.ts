export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  activeRentals: number;
  overdueRentals: number;
  totalItems: number;
  availableItems: number;
  popularItems: { name: string; count: number }[];
  recentActivities: {
    type: string;
    message: string;
    time: string;
    status: "info" | "warning" | "error" | "success";
  }[];
}

export type ActiveTab =
  | "overview"
  | "notices"
  | "events"
  | "rentals"
  | "lockboxes"
  | "items";

export interface PhotoModal {
  isOpen: boolean;
  imageUrl: string;
  title: string;
}
