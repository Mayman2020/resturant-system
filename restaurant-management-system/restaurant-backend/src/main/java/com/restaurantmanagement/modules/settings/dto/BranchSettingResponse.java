package com.restaurantmanagement.modules.settings.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class BranchSettingResponse {
    private Long id; private Long branchId; private String settingKey; private String settingValue;
}
