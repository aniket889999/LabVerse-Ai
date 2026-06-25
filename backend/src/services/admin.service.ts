import prisma from '../config/prisma.js';
import { BookingStatus, RequestType } from '@prisma/client';

export interface AdminBookingFilters {
  status?: BookingStatus;
  requestType?: RequestType;
  search?: string;
}

export const getAdminBookings = async (filters: AdminBookingFilters) => {
  const where: any = {};
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  if (filters.requestType) {
    where.requestType = filters.requestType;
  }
  
  if (filters.search) {
    where.OR = [
      { requesterName: { contains: filters.search, mode: 'insensitive' } },
      { requesterEmail: { contains: filters.search, mode: 'insensitive' } },
      { organizationName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.booking.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      lab: { select: { id: true, name: true } }
    }
  });
};

export const updateBookingStatus = async (id: string, status: BookingStatus) => {
  return prisma.booking.update({
    where: { id },
    data: { status },
    include: {
      lab: { select: { name: true } }
    }
  });
};

export const getAdminAnalyticsSummary = async () => {
  const [
    totalBookings,
    pendingBookings,
    approvedBookings,
    totalEvents,
    labViews,
    projectViews,
    recentBookings
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'APPROVED' } }),
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({ where: { eventType: 'LAB_VIEW' } }),
    prisma.analyticsEvent.count({ where: { eventType: 'PROJECT_VIEW' } }),
    prisma.booking.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
  ]);

  return {
    metrics: {
      totalBookings,
      pendingBookings,
      approvedBookings,
      totalEvents,
      labViews,
      projectViews
    },
    recentBookings
  };
};
