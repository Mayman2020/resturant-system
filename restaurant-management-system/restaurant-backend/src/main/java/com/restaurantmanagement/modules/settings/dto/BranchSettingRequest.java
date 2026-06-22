package com.restaurantmanagement.modules.settings.dto;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data public class BranchSettingRequest {
    @NotNull private Long branchId; @NotBlank private String settingKey; private String settingValue;
}
