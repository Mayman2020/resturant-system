const fs = require('fs');
const path = require('path');
const BASE = path.join('d:', 'Apps Work', 'My Apps', 'resturant system', 'restaurant-management-system', 'restaurant-backend', 'src', 'main', 'java', 'com', 'restaurantmanagement');
function w(rel, content) {
  const full = path.join(BASE, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n', 'utf8');
  console.log('Wrote', rel);
}

w('modules/reports/dto/SalesReportResponse.java', `package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class SalesReportResponse {
    private Long branchId; private String period; private long orderCount; private BigDecimal totalSales;
}`);
w('modules/reports/dto/TopItemResponse.java', `package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class TopItemResponse { private String itemName; private Long quantitySold; }`);
w('modules/reports/dto/BusyHourResponse.java', `package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class BusyHourResponse { private int hour; private long orderCount; }`);
w('modules/reports/dto/StaffPerformanceResponse.java', `package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class StaffPerformanceResponse {
    private Long staffId; private String staffName; private String role; private long ordersHandled;
}`);
w('modules/reports/dto/ProfitMarginResponse.java', `package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class ProfitMarginResponse {
    private BigDecimal revenue; private BigDecimal estimatedCost; private BigDecimal margin; private BigDecimal marginPercent;
}`);
w('modules/reports/dto/BranchPerformanceResponse.java', `package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class BranchPerformanceResponse {
    private Long branchId; private String branchName; private long orders; private BigDecimal sales;
}`);

w('modules/reports/service/ReportService.java', `package com.restaurantmanagement.modules.reports.service;
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
}`);

w('modules/reports/controller/ReportController.java', `package com.restaurantmanagement.modules.reports.controller;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.modules.reports.dto.*;
import com.restaurantmanagement.modules.reports.service.ReportService;
import com.restaurantmanagement.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate; import java.util.List;
@RestController @RequestMapping("/reports") @RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    @GetMapping("/sales/daily") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<SalesReportResponse>> daily(@RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.dailySales(branchId, date)));
    }
    @GetMapping("/sales/monthly") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<SalesReportResponse>> monthly(@RequestParam Long branchId, @RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.monthlySales(branchId, year, month)));
    }
    @GetMapping("/top-items") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<List<TopItemResponse>>> topItems(@RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.topItems(branchId, from, to, limit)));
    }
    @GetMapping("/branch-performance") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<List<BranchPerformanceResponse>>> branchPerformance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.branchPerformance(from, to)));
    }
    @GetMapping("/busiest-hours") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<List<BusyHourResponse>>> busiestHours(@RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.busiestHours(branchId, from, to)));
    }
    @GetMapping("/performance/waiters") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<List<StaffPerformanceResponse>>> waiters(@RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.waiterPerformance(branchId, from, to)));
    }
    @GetMapping("/performance/kitchen") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<List<StaffPerformanceResponse>>> kitchen(@RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.kitchenPerformance(branchId, from, to)));
    }
    @GetMapping("/performance/delivery") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<List<StaffPerformanceResponse>>> delivery(@RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.deliveryPerformance(branchId, from, to)));
    }
    @GetMapping("/profit-margins") @RequiresPermission(module = "reports", action = "view")
    public ResponseEntity<ApiResponse<ProfitMarginResponse>> profit(@RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.profitMargins(branchId, from, to)));
    }
}`);

w('modules/dashboard/dto/DashboardSummaryResponse.java', `package com.restaurantmanagement.modules.dashboard.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class DashboardSummaryResponse {
    private Long branchId; private long todayOrders; private BigDecimal todaySales;
    private long activeOrders; private long lowStockItems; private long totalCustomers; private long staffCount;
}`);
w('modules/dashboard/service/DashboardService.java', `package com.restaurantmanagement.modules.dashboard.service;
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
}`);
w('modules/dashboard/controller/DashboardController.java', `package com.restaurantmanagement.modules.dashboard.controller;
import com.restaurantmanagement.modules.dashboard.dto.DashboardSummaryResponse;
import com.restaurantmanagement.modules.dashboard.service.DashboardService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/dashboard") @RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/summary") @RequiresPermission(module = "dashboard", action = "view")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> summary(@RequestParam Long branchId) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.summary(branchId)));
    }
}`);

console.log('Reports & Dashboard done');
