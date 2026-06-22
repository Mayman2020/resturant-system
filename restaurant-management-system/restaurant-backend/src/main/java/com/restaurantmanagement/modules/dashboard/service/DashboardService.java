package com.restaurantmanagement.modules.dashboard.service;
import com.restaurantmanagement.modules.customers.repository.CustomerRepository;
import com.restaurantmanagement.modules.dashboard.dto.DashboardSummaryResponse;
import com.restaurantmanagement.modules.inventory.repository.InventoryItemRepository;
import com.restaurantmanagement.modules.orders.entity.OrderStatus;
import com.restaurantmanagement.modules.orders.repository.OrderRepository;
import com.restaurantmanagement.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@Service @RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final InventoryItemRepository inventoryRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    public DashboardSummaryResponse summary(Long branchId) {
        LocalDate today = LocalDate.now();
        long todayOrders = orderRepository.countByBranchAndPeriod(branchId, today.atStartOfDay(), today.atTime(LocalTime.MAX));
        BigDecimal todaySales = orderRepository.sumCompletedSales(branchId, today.atStartOfDay(), today.atTime(LocalTime.MAX));
        if (todaySales == null) todaySales = BigDecimal.ZERO;
        long active = orderRepository.findByBranchIdAndStatusIn(branchId,
                List.of(OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY)).size();
        long lowStock = inventoryRepository.findLowStockByBranchId(branchId).size();
        long customers = customerRepository.count();
        long staff = userRepository.countByBranchIdAndActiveTrue(branchId);
        return DashboardSummaryResponse.builder().branchId(branchId).todayOrders(todayOrders).todaySales(todaySales)
                .activeOrders(active).lowStockItems(lowStock).totalCustomers(customers).staffCount(staff).build();
    }
}
