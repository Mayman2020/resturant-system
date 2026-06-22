package com.restaurantmanagement.modules.reports.controller;
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
}
