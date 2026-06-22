package com.restaurantmanagement.modules.billing.service;
import com.restaurantmanagement.modules.billing.dto.ReceiptResponse;
import com.restaurantmanagement.modules.billing.entity.Receipt;
import com.restaurantmanagement.modules.billing.mapper.ReceiptMapper;
import com.restaurantmanagement.modules.billing.repository.ReceiptRepository;
import com.restaurantmanagement.modules.orders.entity.OrderEntity;
import com.restaurantmanagement.modules.orders.repository.OrderRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime; import java.util.List;
@Service @RequiredArgsConstructor
public class BillingService {
    private final ReceiptRepository receiptRepository;
    private final OrderRepository orderRepository;
    private final AppMessages appMessages;
    public List<ReceiptResponse> list() {
        return receiptRepository.findAll().stream().map(ReceiptMapper::toResponse).toList();
    }
    public ReceiptResponse getById(Long id) {
        return ReceiptMapper.toResponse(receiptRepository.findById(id)
                .orElseThrow(() -> AppException.notFound(appMessages.get("receipt.not_found"))));
    }
    @Transactional public ReceiptResponse generate(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> AppException.notFound(appMessages.get("order.not_found")));
        Receipt receipt = Receipt.builder().orderId(orderId).receiptNumber("RCP-" + System.currentTimeMillis())
                .subtotal(order.getSubtotal()).taxAmount(order.getTaxAmount()).serviceCharge(order.getServiceCharge())
                .tipAmount(order.getTipAmount()).discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount()).printedAt(LocalDateTime.now()).build();
        return ReceiptMapper.toResponse(receiptRepository.save(receipt));
    }
}
