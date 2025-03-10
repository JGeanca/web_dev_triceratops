import { orderService } from '../services/orderService';
import { useQuery } from '@tanstack/react-query';

export const useOrders = (userId) => {
  return useQuery({
    queryKey: ['userOrders', userId],
    queryFn: () => orderService.fetchOrders({ id: userId }),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });
};

export const useOrderById = (orderId, userId) => {
  return useQuery({
    queryKey: ['userOrder', orderId, userId],
    queryFn: () => orderService.fetchOrdersById({ orderId, id: userId }),
    staleTime: 1000 * 60 * 5,
    enabled: !!orderId && !!userId,
  });
};
