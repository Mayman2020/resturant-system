package com.restaurantmanagement.modules.customers.service;
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
}
