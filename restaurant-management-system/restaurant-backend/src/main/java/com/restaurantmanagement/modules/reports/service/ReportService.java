package com.restaurantmanagement.modules.reports.service;
import com.restaurantmanagement.modules.branches.entity.Branch;
import com.restaurantmanagement.modules.branches.repository.BranchRepository;
import com.restaurantmanagement.modules.delivery.repository.DeliveryOrderRepository;
import com.restaurantmanagement.modules.inventory.repository.InventoryItemRepository;
import com.restaurantmanagement.modules.orders.entity.OrderEntity;
import com.restaurantmanagement.modules.orders.entity.OrderStatus;
import com.restaurantmanagement.modules.orders.repository.OrderItemRepository;
import com.restaurantmanagement.modules.orders.repository.OrderRepository;
import com.restaurantmanagement.modules.reports.dto.*;
import com.restaurantmanagement.modules.users.entity.RoleType;
import com.restaurantmanagement.modules.users.entity.User;
import com.restaurantmanagement.modules.users.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
@Service @RequiredArgsConstructor
public class ReportService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final InventoryItemRepository inventoryItemRepository;
    @PersistenceContext private EntityManager em;

    public SalesReportResponse dailySales(Long branchId, LocalDate date) {
        LocalDateTime from = date.atStartOfDay();
        LocalDateTime to = date.atTime(LocalTime.MAX);
        return buildSales(branchId, from, to, "daily:" + date);
    }

    public SalesReportResponse monthlySales(Long branchId, int year, int month) {
        LocalDateTime from = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime to = from.plusMonths(1).minusSeconds(1);
        return buildSales(branchId, from, to, "monthly:" + year + "-" + month);
    }

    private SalesReportResponse buildSales(Long branchId, LocalDateTime from, LocalDateTime to, String period) {
        long count = orderRepository.countByBranchAndPeriod(branchId, from, to);
        BigDecimal total = orderRepository.sumCompletedSales(branchId, from, to);
        if (total == null) total = BigDecimal.ZERO;
        return SalesReportResponse.builder().branchId(branchId).period(period).orderCount(count).totalSales(total).build();
    }

    public List<TopItemResponse> topItems(Long branchId, LocalDate from, LocalDate to, int limit) {
        List<Object[]> rows = orderItemRepository.topItems(branchId, from.atStartOfDay(), to.atTime(LocalTime.MAX), PageRequest.of(0, limit));
        List<TopItemResponse> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(TopItemResponse.builder().itemName((String) row[0]).quantitySold(((Number) row[1]).longValue()).build());
        }
        return result;
    }

    public List<BranchPerformanceResponse> branchPerformance(LocalDate from, LocalDate to) {
        List<BranchPerformanceResponse> list = new ArrayList<>();
        for (Branch b : branchRepository.findAll()) {
            long orders = orderRepository.countByBranchAndPeriod(b.getId(), from.atStartOfDay(), to.atTime(LocalTime.MAX));
            BigDecimal sales = orderRepository.sumCompletedSales(b.getId(), from.atStartOfDay(), to.atTime(LocalTime.MAX));
            if (sales == null) sales = BigDecimal.ZERO;
            list.add(BranchPerformanceResponse.builder().branchId(b.getId()).branchName(b.getName()).orders(orders).sales(sales).build());
        }
        return list;
    }

    @SuppressWarnings("unchecked")
    public List<BusyHourResponse> busiestHours(Long branchId, LocalDate from, LocalDate to) {
        List<Object[]> rows = em.createNativeQuery(
                "SELECT EXTRACT(HOUR FROM created_at) AS hr, COUNT(*) FROM restaurant_mgmt.orders " +
                "WHERE branch_id = :branchId AND created_at BETWEEN :from AND :to GROUP BY hr ORDER BY COUNT(*) DESC")
                .setParameter("branchId", branchId).setParameter("from", from.atStartOfDay()).setParameter("to", to.atTime(LocalTime.MAX))
                .getResultList();
        List<BusyHourResponse> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(BusyHourResponse.builder().hour(((Number) row[0]).intValue()).orderCount(((Number) row[1]).longValue()).build());
        }
        return result;
    }

    public List<StaffPerformanceResponse> waiterPerformance(Long branchId, LocalDate from, LocalDate to) {
        return staffPerformance(branchId, from, to, RoleType.WAITER);
    }

    public List<StaffPerformanceResponse> kitchenPerformance(Long branchId, LocalDate from, LocalDate to) {
        return staffPerformance(branchId, from, to, RoleType.KITCHEN_STAFF);
    }

    public List<StaffPerformanceResponse> deliveryPerformance(Long branchId, LocalDate from, LocalDate to) {
        return staffPerformance(branchId, from, to, RoleType.DELIVERY_DRIVER);
    }

    private List<StaffPerformanceResponse> staffPerformance(Long branchId, LocalDate from, LocalDate to, RoleType role) {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRoleType() == role && (branchId == null || branchId.equals(u.getBranchId()))).toList();
        List<StaffPerformanceResponse> result = new ArrayList<>();
        for (User u : users) {
            long count = orderRepository.findAll().stream()
                    .filter(o -> o.getBranchId().equals(branchId != null ? branchId : o.getBranchId()))
                    .filter(o -> !o.getCreatedAt().isBefore(from.atStartOfDay()) && !o.getCreatedAt().isAfter(to.atTime(LocalTime.MAX)))
                    .filter(o -> u.getId().equals(o.getWaiterId())).count();
            result.add(StaffPerformanceResponse.builder().staffId(u.getId()).staffName(u.getFullName())
                    .role(role.name()).ordersHandled(count).build());
        }
        return result;
    }

    public ProfitMarginResponse profitMargins(Long branchId, LocalDate from, LocalDate to) {
        BigDecimal revenue = orderRepository.sumCompletedSales(branchId, from.atStartOfDay(), to.atTime(LocalTime.MAX));
        if (revenue == null) revenue = BigDecimal.ZERO;
        BigDecimal cost = inventoryItemRepository.findByBranchId(branchId).stream()
                .map(i -> i.getCostPerUnit().multiply(i.getCurrentStock()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal margin = revenue.subtract(cost);
        BigDecimal pct = revenue.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO :
                margin.multiply(BigDecimal.valueOf(100)).divide(revenue, 2, RoundingMode.HALF_UP);
        return ProfitMarginResponse.builder().revenue(revenue).estimatedCost(cost).margin(margin).marginPercent(pct).build();
    }
}
