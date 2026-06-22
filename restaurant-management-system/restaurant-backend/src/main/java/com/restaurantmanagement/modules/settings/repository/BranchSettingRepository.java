package com.restaurantmanagement.modules.settings.repository;

import com.restaurantmanagement.modules.settings.entity.BranchSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchSettingRepository extends JpaRepository<BranchSetting, Long> {
    List<BranchSetting> findByBranchId(Long branchId);
    Optional<BranchSetting> findByBranchIdAndSettingKey(Long branchId, String settingKey);
}
