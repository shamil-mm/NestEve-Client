export interface IMonthlyRevenue {
  month: number;
  amount: number;
}

export interface IDailyBooking {
  day: string|number;
  count: number;
}

export interface IEventsByCategory {
  [category: string]: number;
}

export interface IAdminDashboardResponse {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: IMonthlyRevenue[];
  eventsByCategory: IEventsByCategory;
  dailyBookings: IDailyBooking[];
}

export interface IPieChartItem {
  name: string;
  value: number;
  color: string;
}

export interface ISalesChartItem {
  month: number;
  value: number;
}

export interface ITrafficChartItem {
  day: string;
  value: number;
}
export interface IDashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
}
