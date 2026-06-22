package com.restaurantmanagement.modules.branches.mapper;

import com.restaurantmanagement.modules.branches.dto.BranchResponse;
import com.restaurantmanagement.modules.branches.entity.Branch;

public final class BranchMapper {
    private BranchMapper() {}

    public static BranchResponse toResponse(Branch branch) {
        return BranchResponse.builder()
                .id(branch.getId())
                .name(branch.getName())
                .code(branch.getCode())
                .address(branch.getAddress())
                .phone(branch.getPhone())
                .email(branch.getEmail())
                .timezone(branch.getTimezone())
                .taxRate(branch.getTaxRate())
                .serviceCharge(branch.getServiceCharge())
                .active(branch.isActive())
                .build();
    }
}
