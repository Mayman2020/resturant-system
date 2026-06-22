package com.restaurantmanagement.modules.settings.service;
import com.restaurantmanagement.modules.settings.dto.*;
import com.restaurantmanagement.modules.settings.entity.BranchSetting;
import com.restaurantmanagement.modules.settings.repository.BranchSettingRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor
public class SettingsService {
    private final BranchSettingRepository settingRepository;
    private final AppMessages appMessages;
    public List<BranchSettingResponse> list(Long branchId) {
        return settingRepository.findByBranchId(branchId).stream().map(this::toResponse).toList();
    }
    @Transactional public BranchSettingResponse upsert(BranchSettingRequest req) {
        BranchSetting s = settingRepository.findByBranchIdAndSettingKey(req.getBranchId(), req.getSettingKey())
                .orElse(BranchSetting.builder().branchId(req.getBranchId()).settingKey(req.getSettingKey()).build());
        s.setSettingValue(req.getSettingValue());
        return toResponse(settingRepository.save(s));
    }
    @Transactional public void delete(Long id) {
        settingRepository.deleteById(id);
    }
    private BranchSettingResponse toResponse(BranchSetting s) {
        return BranchSettingResponse.builder().id(s.getId()).branchId(s.getBranchId())
                .settingKey(s.getSettingKey()).settingValue(s.getSettingValue()).build();
    }
}
