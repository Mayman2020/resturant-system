package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class BusyHourResponse { private int hour; private long orderCount; }
