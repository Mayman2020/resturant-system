package com.restaurantmanagement.modules.kitchen.service;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class KitchenBroadcastService {
    private final SimpMessagingTemplate messagingTemplate;
    public void broadcastOrderUpdate(Long branchId) {
        messagingTemplate.convertAndSend("/topic/kitchen/" + branchId, "refresh");
    }
}
