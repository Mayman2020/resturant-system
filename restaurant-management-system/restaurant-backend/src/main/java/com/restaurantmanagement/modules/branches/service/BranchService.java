package com.restaurantmanagement.modules.branches.service;

import com.restaurantmanagement.modules.branches.dto.BranchRequest;
import com.restaurantmanagement.modules.branches.dto.BranchResponse;
import com.restaurantmanagement.modules.branches.entity.Branch;
import com.restaurantmanagement.modules.branches.mapper.BranchMapper;
import com.restaurantmanagement.modules.branches.repository.BranchRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final AppMessages appMessages;

    public List<BranchResponse> getAll() {
        return branchRepository.findAll().stream().map(BranchMapper::toResponse).toList();
    }

    public BranchResponse getById(Long id) {
        return BranchMapper.toResponse(find(id));
    }

    @Transactional
    public BranchResponse create(BranchRequest request) {
        if (branchRepository.existsByCode(request.getCode())) {
            throw AppException.conflict("Branch code already exists");
        }
        Branch branch = Branch.builder()
                .name(request.getName())
                .code(request.getCode())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .timezone(request.getTimezone() != null ? request.getTimezone() : "UTC")
                .taxRate(request.getTaxRate() != null ? request.getTaxRate() : BigDecimal.ZERO)
                .serviceCharge(request.getServiceCharge() != null ? request.getServiceCharge() : BigDecimal.ZERO)
                .active(request.getActive() == null || request.getActive())
                .build();
        return BranchMapper.toResponse(branchRepository.save(branch));
    }

    @Transactional
    public BranchResponse update(Long id, BranchRequest request) {
        Branch branch = find(id);
        if (!branch.getCode().equals(request.getCode()) && branchRepository.existsByCode(request.getCode())) {
            throw AppException.conflict("Branch code already exists");
        }
        branch.setName(request.getName());
        branch.setCode(request.getCode());
        branch.setAddress(request.getAddress());
        branch.setPhone(request.getPhone());
        branch.setEmail(request.getEmail());
        if (request.getTimezone() != null) branch.setTimezone(request.getTimezone());
        if (request.getTaxRate() != null) branch.setTaxRate(request.getTaxRate());
        if (request.getServiceCharge() != null) branch.setServiceCharge(request.getServiceCharge());
        if (request.getActive() != null) branch.setActive(request.getActive());
        return BranchMapper.toResponse(branchRepository.save(branch));
    }

    @Transactional
    public void delete(Long id) {
        branchRepository.delete(find(id));
    }

    private Branch find(Long id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> AppException.notFound(appMessages.get("branch.not_found")));
    }
}
