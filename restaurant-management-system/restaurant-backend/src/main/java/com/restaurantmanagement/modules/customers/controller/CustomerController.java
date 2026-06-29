package com.restaurantmanagement.modules.customers.controller;
import com.restaurantmanagement.modules.customers.dto.*;
import com.restaurantmanagement.modules.customers.service.CustomerService;
import com.restaurantmanagement.modules.permission.annotation.RequiresPermission;
import com.restaurantmanagement.shared.response.ApiResponse;
import com.restaurantmanagement.shared.response.PageResponse;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page; import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/customers") @RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;
    @GetMapping @RequiresPermission(module = "customers", action = "view")
    public ResponseEntity<ApiResponse<PageResponse<CustomerResponse>>> list(@RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(customerService.list(q, pageable))));
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
}
