package com.restaurantmanagement.modules.delivery.service;
import com.restaurantmanagement.modules.delivery.dto.*;
import com.restaurantmanagement.modules.delivery.entity.DeliveryOrder;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import com.restaurantmanagement.modules.delivery.mapper.DeliveryMapper;
import com.restaurantmanagement.modules.delivery.repository.DeliveryOrderRepository;
import com.restaurantmanagement.modules.orders.repository.OrderRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal; import java.time.LocalDateTime; import java.util.List; import java.util.Set;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryOrderRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final AppMessages appMessages;
    public List<DeliveryResponse> list(DeliveryStatus status, Long branchId) {
        List<DeliveryOrder> deliveries = status != null ? deliveryRepository.findByStatus(status) : deliveryRepository.findAll();
        if (branchId != null) {
            Set<Long> orderIds = orderRepository.findByBranchIdOrderByCreatedAtDesc(branchId).stream()
                    .map(o -> o.getId()).collect(Collectors.toSet());
            deliveries = deliveries.stream().filter(d -> orderIds.contains(d.getOrderId())).toList();
        }
        return deliveries.stream().map(DeliveryMapper::toResponse).toList();
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
}
