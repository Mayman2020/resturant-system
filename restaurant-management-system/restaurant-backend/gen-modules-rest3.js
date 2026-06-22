const fs = require('fs');
const path = require('path');
const BASE = path.join('d:', 'Apps Work', 'My Apps', 'resturant system', 'restaurant-management-system', 'restaurant-backend', 'src', 'main', 'java', 'com', 'restaurantmanagement');
function w(rel, content) {
  const full = path.join(BASE, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n', 'utf8');
  console.log('Wrote', rel);
}

// Customers
w('modules/customers/dto/CustomerRequest.java', `package com.restaurantmanagement.modules.customers.dto;
import jakarta.validation.constraints.NotBlank; import lombok.Data;
@Data public class CustomerRequest {
    @NotBlank private String fullName; private String email; private String phone; private String address;
    private String loyaltyTier; private Boolean active;
}`);
w('modules/customers/dto/CustomerResponse.java', `package com.restaurantmanagement.modules.customers.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class CustomerResponse {
    private Long id; private String fullName; private String email; private String phone;
    private String address; private String loyaltyTier; private boolean active;
}`);
w('modules/customers/mapper/CustomerMapper.java', `package com.restaurantmanagement.modules.customers.mapper;
import com.restaurantmanagement.modules.customers.dto.CustomerResponse;
import com.restaurantmanagement.modules.customers.entity.Customer;
public final class CustomerMapper {
    private CustomerMapper() {}
    public static CustomerResponse toResponse(Customer c) {
        return CustomerResponse.builder().id(c.getId()).fullName(c.getFullName()).email(c.getEmail())
                .phone(c.getPhone()).address(c.getAddress()).loyaltyTier(c.getLoyaltyTier()).active(c.isActive()).build();
    }
}`);
w('modules/customers/service/CustomerService.java', `package com.restaurantmanagement.modules.customers.service;
import com.restaurantmanagement.modules.customers.dto.*;
import com.restaurantmanagement.modules.customers.entity.Customer;
import com.restaurantmanagement.modules.customers.mapper.CustomerMapper;
import com.restaurantmanagement.modules.customers.repository.CustomerRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page; import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final AppMessages appMessages;
    public Page<CustomerResponse> list(String q, Pageable pageable) {
        return customerRepository.search(q, pageable).map(CustomerMapper::toResponse);
    }
    public CustomerResponse getById(Long id) { return CustomerMapper.toResponse(find(id)); }
    @Transactional public CustomerResponse create(CustomerRequest req) {
        Customer c = Customer.builder().fullName(req.getFullName()).email(req.getEmail()).phone(req.getPhone())
                .address(req.getAddress()).loyaltyTier(req.getLoyaltyTier() != null ? req.getLoyaltyTier() : "STANDARD")
                .active(req.getActive() == null || req.getActive()).build();
        return CustomerMapper.toResponse(customerRepository.save(c));
    }
    @Transactional public CustomerResponse update(Long id, CustomerRequest req) {
        Customer c = find(id);
        c.setFullName(req.getFullName()); c.setEmail(req.getEmail()); c.setPhone(req.getPhone());
        c.setAddress(req.getAddress());
        if (req.getLoyaltyTier() != null) c.setLoyaltyTier(req.getLoyaltyTier());
        if (req.getActive() != null) c.setActive(req.getActive());
        return CustomerMapper.toResponse(customerRepository.save(c));
    }
    @Transactional public void delete(Long id) { customerRepository.delete(find(id)); }
    private Customer find(Long id) {
        return customerRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("customer.not_found")));
    }
}`);
w('modules/customers/controller/CustomerController.java', `package com.restaurantmanagement.modules.customers.controller;
import com.restaurantmanagement.modules.customers.dto.*;
import com.restaurantmanagement.modules.customers.service.CustomerService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page; import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/customers") @RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;
    @GetMapping @RequiresPermission(module = "customers", action = "view")
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> list(@RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.list(q, pageable)));
    }
    @GetMapping("/{id}") @RequiresPermission(module = "customers", action = "view")
    public ResponseEntity<ApiResponse<CustomerResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.getById(id)));
    }
    @PostMapping @RequiresPermission(module = "customers", action = "create")
    public ResponseEntity<ApiResponse<CustomerResponse>> create(@Valid @RequestBody CustomerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(customerService.create(req)));
    }
    @PutMapping("/{id}") @RequiresPermission(module = "customers", action = "edit")
    public ResponseEntity<ApiResponse<CustomerResponse>> update(@PathVariable Long id, @Valid @RequestBody CustomerRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.update(id, req)));
    }
    @DeleteMapping("/{id}") @RequiresPermission(module = "customers", action = "delete")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        customerService.delete(id); return ResponseEntity.ok(ApiResponse.ok(null));
    }
}`);

// Delivery
w('modules/delivery/dto/DeliveryRequest.java', `package com.restaurantmanagement.modules.delivery.dto;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data; import java.math.BigDecimal;
@Data public class DeliveryRequest {
    @NotNull private Long orderId; @NotBlank private String deliveryAddress;
    private BigDecimal deliveryFee; private Integer estimatedMinutes;
}`);
w('modules/delivery/dto/AssignDriverRequest.java', `package com.restaurantmanagement.modules.delivery.dto;
import jakarta.validation.constraints.NotNull; import lombok.Data;
@Data public class AssignDriverRequest { @NotNull private Long driverId; }`);
w('modules/delivery/dto/DeliveryStatusRequest.java', `package com.restaurantmanagement.modules.delivery.dto;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import jakarta.validation.constraints.NotNull; import lombok.Data;
@Data public class DeliveryStatusRequest { @NotNull private DeliveryStatus status; }`);
w('modules/delivery/dto/DeliveryResponse.java', `package com.restaurantmanagement.modules.delivery.dto;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data @Builder public class DeliveryResponse {
    private Long id; private Long orderId; private Long driverId; private String deliveryAddress;
    private BigDecimal deliveryFee; private Integer estimatedMinutes; private DeliveryStatus status;
    private LocalDateTime assignedAt; private LocalDateTime deliveredAt;
}`);
w('modules/delivery/mapper/DeliveryMapper.java', `package com.restaurantmanagement.modules.delivery.mapper;
import com.restaurantmanagement.modules.delivery.dto.DeliveryResponse;
import com.restaurantmanagement.modules.delivery.entity.DeliveryOrder;
public final class DeliveryMapper {
    private DeliveryMapper() {}
    public static DeliveryResponse toResponse(DeliveryOrder d) {
        return DeliveryResponse.builder().id(d.getId()).orderId(d.getOrderId()).driverId(d.getDriverId())
                .deliveryAddress(d.getDeliveryAddress()).deliveryFee(d.getDeliveryFee())
                .estimatedMinutes(d.getEstimatedMinutes()).status(d.getStatus())
                .assignedAt(d.getAssignedAt()).deliveredAt(d.getDeliveredAt()).build();
    }
}`);
w('modules/delivery/service/DeliveryService.java', `package com.restaurantmanagement.modules.delivery.service;
import com.restaurantmanagement.modules.delivery.dto.*;
import com.restaurantmanagement.modules.delivery.entity.DeliveryOrder;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import com.restaurantmanagement.modules.delivery.mapper.DeliveryMapper;
import com.restaurantmanagement.modules.delivery.repository.DeliveryOrderRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal; import java.time.LocalDateTime; import java.util.List;
@Service @RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryOrderRepository deliveryRepository;
    private final AppMessages appMessages;
    public List<DeliveryResponse> list(DeliveryStatus status) {
        return (status != null ? deliveryRepository.findByStatus(status) : deliveryRepository.findAll())
                .stream().map(DeliveryMapper::toResponse).toList();
    }
    public DeliveryResponse getByOrderId(Long orderId) {
        return DeliveryMapper.toResponse(deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> AppException.notFound(appMessages.get("delivery.not_found"))));
    }
    @Transactional public DeliveryResponse create(DeliveryRequest req) {
        if (deliveryRepository.findByOrderId(req.getOrderId()).isPresent()) {
            throw AppException.conflict("Delivery already exists for order");
        }
        DeliveryOrder d = DeliveryOrder.builder().orderId(req.getOrderId()).deliveryAddress(req.getDeliveryAddress())
                .deliveryFee(req.getDeliveryFee() != null ? req.getDeliveryFee() : BigDecimal.ZERO)
                .estimatedMinutes(req.getEstimatedMinutes()).status(DeliveryStatus.PENDING).build();
        return DeliveryMapper.toResponse(deliveryRepository.save(d));
    }
    @Transactional public DeliveryResponse assignDriver(Long id, AssignDriverRequest req) {
        DeliveryOrder d = find(id);
        d.setDriverId(req.getDriverId());
        d.setStatus(DeliveryStatus.ASSIGNED);
        d.setAssignedAt(LocalDateTime.now());
        return DeliveryMapper.toResponse(deliveryRepository.save(d));
    }
    @Transactional public DeliveryResponse updateStatus(Long id, DeliveryStatusRequest req) {
        DeliveryOrder d = find(id);
        d.setStatus(req.getStatus());
        if (req.getStatus() == DeliveryStatus.DELIVERED) d.setDeliveredAt(LocalDateTime.now());
        return DeliveryMapper.toResponse(deliveryRepository.save(d));
    }
    private DeliveryOrder find(Long id) {
        return deliveryRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("delivery.not_found")));
    }
}`);
w('modules/delivery/controller/DeliveryController.java', `package com.restaurantmanagement.modules.delivery.controller;
import com.restaurantmanagement.modules.delivery.dto.*;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import com.restaurantmanagement.modules.delivery.service.DeliveryService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/delivery") @RequiredArgsConstructor
public class DeliveryController {
    private final DeliveryService deliveryService;
    @GetMapping @RequiresPermission(module = "delivery", action = "view")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> list(@RequestParam(required = false) DeliveryStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(deliveryService.list(status)));
    }
    @GetMapping("/order/{orderId}") @RequiresPermission(module = "delivery", action = "view")
    public ResponseEntity<ApiResponse<DeliveryResponse>> byOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(deliveryService.getByOrderId(orderId)));
    }
    @PostMapping @RequiresPermission(module = "delivery", action = "create")
    public ResponseEntity<ApiResponse<DeliveryResponse>> create(@Valid @RequestBody DeliveryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(deliveryService.create(req)));
    }
    @PatchMapping("/{id}/assign") @RequiresPermission(module = "delivery", action = "edit")
    public ResponseEntity<ApiResponse<DeliveryResponse>> assign(@PathVariable Long id, @Valid @RequestBody AssignDriverRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(deliveryService.assignDriver(id, req)));
    }
    @PatchMapping("/{id}/status") @RequiresPermission(module = "delivery", action = "edit")
    public ResponseEntity<ApiResponse<DeliveryResponse>> status(@PathVariable Long id, @Valid @RequestBody DeliveryStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(deliveryService.updateStatus(id, req)));
    }
}`);

// Loyalty
w('modules/loyalty/dto/LoyaltyPointsResponse.java', `package com.restaurantmanagement.modules.loyalty.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class LoyaltyPointsResponse {
    private Long id; private Long customerId; private Integer points; private String tier; private Integer lifetimePoints;
}`);
w('modules/loyalty/dto/AdjustPointsRequest.java', `package com.restaurantmanagement.modules.loyalty.dto;
import jakarta.validation.constraints.NotNull; import lombok.Data;
@Data public class AdjustPointsRequest { @NotNull private Integer points; private String tier; }`);
w('modules/loyalty/dto/CouponRequest.java', `package com.restaurantmanagement.modules.loyalty.dto;
import com.restaurantmanagement.modules.loyalty.entity.DiscountType;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data public class CouponRequest {
    @NotBlank private String code; private String description; @NotNull private DiscountType discountType;
    @NotNull private BigDecimal discountValue; private BigDecimal minOrder; private Integer maxUses;
    private LocalDateTime validFrom; private LocalDateTime validUntil; private Boolean active;
}`);
w('modules/loyalty/dto/CouponResponse.java', `package com.restaurantmanagement.modules.loyalty.dto;
import com.restaurantmanagement.modules.loyalty.entity.DiscountType;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data @Builder public class CouponResponse {
    private Long id; private String code; private String description; private DiscountType discountType;
    private BigDecimal discountValue; private BigDecimal minOrder; private Integer maxUses; private Integer usedCount;
    private LocalDateTime validFrom; private LocalDateTime validUntil; private boolean active;
}`);
w('modules/loyalty/mapper/LoyaltyMapper.java', `package com.restaurantmanagement.modules.loyalty.mapper;
import com.restaurantmanagement.modules.loyalty.dto.*;
import com.restaurantmanagement.modules.loyalty.entity.*;
public final class LoyaltyMapper {
    private LoyaltyMapper() {}
    public static LoyaltyPointsResponse toPoints(LoyaltyPoints p) {
        return LoyaltyPointsResponse.builder().id(p.getId()).customerId(p.getCustomerId())
                .points(p.getPoints()).tier(p.getTier()).lifetimePoints(p.getLifetimePoints()).build();
    }
    public static CouponResponse toCoupon(Coupon c) {
        return CouponResponse.builder().id(c.getId()).code(c.getCode()).description(c.getDescription())
                .discountType(c.getDiscountType()).discountValue(c.getDiscountValue()).minOrder(c.getMinOrder())
                .maxUses(c.getMaxUses()).usedCount(c.getUsedCount()).validFrom(c.getValidFrom())
                .validUntil(c.getValidUntil()).active(c.isActive()).build();
    }
}`);
w('modules/loyalty/service/LoyaltyService.java', `package com.restaurantmanagement.modules.loyalty.service;
import com.restaurantmanagement.modules.loyalty.dto.*;
import com.restaurantmanagement.modules.loyalty.entity.*;
import com.restaurantmanagement.modules.loyalty.mapper.LoyaltyMapper;
import com.restaurantmanagement.modules.loyalty.repository.*;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor
public class LoyaltyService {
    private final LoyaltyPointsRepository loyaltyRepository;
    private final CouponRepository couponRepository;
    private final AppMessages appMessages;
    public LoyaltyPointsResponse getPoints(Long customerId) {
        return LoyaltyMapper.toPoints(loyaltyRepository.findByCustomerId(customerId)
                .orElseThrow(() -> AppException.notFound(appMessages.get("loyalty.not_found"))));
    }
    @Transactional public LoyaltyPointsResponse adjustPoints(Long customerId, AdjustPointsRequest req) {
        LoyaltyPoints lp = loyaltyRepository.findByCustomerId(customerId).orElseGet(() ->
                LoyaltyPoints.builder().customerId(customerId).points(0).lifetimePoints(0).build());
        lp.setPoints(lp.getPoints() + req.getPoints());
        if (req.getPoints() > 0) lp.setLifetimePoints(lp.getLifetimePoints() + req.getPoints());
        if (req.getTier() != null) lp.setTier(req.getTier());
        return LoyaltyMapper.toPoints(loyaltyRepository.save(lp));
    }
    public List<CouponResponse> listCoupons() {
        return couponRepository.findAll().stream().map(LoyaltyMapper::toCoupon).toList();
    }
    @Transactional public CouponResponse createCoupon(CouponRequest req) {
        Coupon c = Coupon.builder().code(req.getCode()).description(req.getDescription())
                .discountType(req.getDiscountType()).discountValue(req.getDiscountValue())
                .minOrder(req.getMinOrder() != null ? req.getMinOrder() : java.math.BigDecimal.ZERO)
                .maxUses(req.getMaxUses()).validFrom(req.getValidFrom()).validUntil(req.getValidUntil())
                .active(req.getActive() == null || req.getActive()).build();
        return LoyaltyMapper.toCoupon(couponRepository.save(c));
    }
}`);
w('modules/loyalty/controller/LoyaltyController.java', `package com.restaurantmanagement.modules.loyalty.controller;
import com.restaurantmanagement.modules.loyalty.dto.*;
import com.restaurantmanagement.modules.loyalty.service.LoyaltyService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/loyalty") @RequiredArgsConstructor
public class LoyaltyController {
    private final LoyaltyService loyaltyService;
    @GetMapping("/customers/{customerId}/points") @RequiresPermission(module = "loyalty", action = "view")
    public ResponseEntity<ApiResponse<LoyaltyPointsResponse>> getPoints(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.ok(loyaltyService.getPoints(customerId)));
    }
    @PostMapping("/customers/{customerId}/points") @RequiresPermission(module = "loyalty", action = "edit")
    public ResponseEntity<ApiResponse<LoyaltyPointsResponse>> adjust(@PathVariable Long customerId, @Valid @RequestBody AdjustPointsRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(loyaltyService.adjustPoints(customerId, req)));
    }
    @GetMapping("/coupons") @RequiresPermission(module = "loyalty", action = "view")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> coupons() {
        return ResponseEntity.ok(ApiResponse.ok(loyaltyService.listCoupons()));
    }
    @PostMapping("/coupons") @RequiresPermission(module = "loyalty", action = "create")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@Valid @RequestBody CouponRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(loyaltyService.createCoupon(req)));
    }
}`);

console.log('Customers, Delivery, Loyalty done');
