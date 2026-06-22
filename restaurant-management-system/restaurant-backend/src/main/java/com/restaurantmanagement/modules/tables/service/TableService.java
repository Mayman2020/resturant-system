package com.restaurantmanagement.modules.tables.service;

import com.restaurantmanagement.modules.tables.dto.ReservationRequest;
import com.restaurantmanagement.modules.tables.dto.TableRequest;
import com.restaurantmanagement.modules.tables.dto.TableResponse;
import com.restaurantmanagement.modules.tables.dto.ReservationResponse;
import com.restaurantmanagement.modules.tables.entity.RestaurantTable;
import com.restaurantmanagement.modules.tables.entity.TableReservation;
import com.restaurantmanagement.modules.tables.entity.TableStatus;
import com.restaurantmanagement.modules.tables.mapper.TableMapper;
import com.restaurantmanagement.modules.tables.repository.RestaurantTableRepository;
import com.restaurantmanagement.modules.tables.repository.TableReservationRepository;
import com.restaurantmanagement.shared.exception.AppException;
import com.restaurantmanagement.shared.i18n.AppMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class TableService {
    private final RestaurantTableRepository tableRepository;
    private final TableReservationRepository reservationRepository;
    private final AppMessages appMessages;

    public List<TableResponse> getAll(Long branchId) {
        List<RestaurantTable> list = branchId != null ? tableRepository.findByBranchId(branchId) : tableRepository.findAll();
        return list.stream().map(TableMapper::toResponse).toList();
    }
    public TableResponse getById(Long id) { return TableMapper.toResponse(find(id)); }

    @Transactional
    public TableResponse create(TableRequest req) {
        RestaurantTable t = RestaurantTable.builder()
                .branchId(req.getBranchId()).tableNumber(req.getTableNumber())
                .seatingType(req.getSeatingType())
                .capacity(req.getCapacity() != null ? req.getCapacity() : 4)
                .status(req.getStatus() != null ? req.getStatus() : TableStatus.AVAILABLE)
                .qrCode(req.getQrCode()).active(req.getActive() == null || req.getActive()).build();
        return TableMapper.toResponse(tableRepository.save(t));
    }

    @Transactional
    public TableResponse update(Long id, TableRequest req) {
        RestaurantTable t = find(id);
        t.setBranchId(req.getBranchId()); t.setTableNumber(req.getTableNumber());
        t.setSeatingType(req.getSeatingType());
        if (req.getCapacity() != null) t.setCapacity(req.getCapacity());
        if (req.getStatus() != null) t.setStatus(req.getStatus());
        t.setQrCode(req.getQrCode());
        if (req.getActive() != null) t.setActive(req.getActive());
        return TableMapper.toResponse(tableRepository.save(t));
    }

    @Transactional public void delete(Long id) { tableRepository.delete(find(id)); }

    public List<ReservationResponse> getReservations(Long branchId) {
        List<TableReservation> reservations = reservationRepository.findAll();
        if (branchId != null) {
            List<Long> tableIds = tableRepository.findByBranchId(branchId).stream().map(RestaurantTable::getId).toList();
            reservations = reservations.stream().filter(r -> tableIds.contains(r.getTableId())).toList();
        }
        return reservations.stream().map(this::toReservationResponse).toList();
    }

    @Transactional
    public ReservationResponse createReservation(ReservationRequest req) {
        RestaurantTable table = find(req.getTableId());
        TableReservation reservation = TableReservation.builder()
                .tableId(req.getTableId())
                .customerName(req.getCustomerName())
                .customerPhone(req.getCustomerPhone())
                .partySize(req.getPartySize())
                .reservedAt(req.getReservedAt())
                .status(req.getStatus() != null ? req.getStatus() : "CONFIRMED")
                .notes(req.getNotes())
                .build();
        table.setStatus(TableStatus.RESERVED);
        tableRepository.save(table);
        return toReservationResponse(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationResponse updateReservation(Long id, ReservationRequest req) {
        TableReservation reservation = findReservation(id);
        if (req.getTableId() != null && !req.getTableId().equals(reservation.getTableId())) {
            freeTableIfReserved(reservation.getTableId());
            RestaurantTable newTable = find(req.getTableId());
            newTable.setStatus(TableStatus.RESERVED);
            tableRepository.save(newTable);
            reservation.setTableId(req.getTableId());
        }
        reservation.setCustomerName(req.getCustomerName());
        reservation.setCustomerPhone(req.getCustomerPhone());
        reservation.setPartySize(req.getPartySize());
        reservation.setReservedAt(req.getReservedAt());
        if (req.getStatus() != null) reservation.setStatus(req.getStatus());
        reservation.setNotes(req.getNotes());
        return toReservationResponse(reservationRepository.save(reservation));
    }

    @Transactional
    public void cancelReservation(Long id) {
        TableReservation reservation = findReservation(id);
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
        freeTableIfReserved(reservation.getTableId());
    }

    private ReservationResponse toReservationResponse(TableReservation r) {
        return ReservationResponse.builder()
                .id(r.getId()).tableId(r.getTableId()).customerName(r.getCustomerName())
                .customerPhone(r.getCustomerPhone()).partySize(r.getPartySize())
                .reservedAt(r.getReservedAt()).status(r.getStatus()).notes(r.getNotes()).build();
    }

    private TableReservation findReservation(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Reservation not found"));
    }

    private void freeTableIfReserved(Long tableId) {
        tableRepository.findById(tableId).ifPresent(table -> {
            if (table.getStatus() == TableStatus.RESERVED) {
                table.setStatus(TableStatus.AVAILABLE);
                tableRepository.save(table);
            }
        });
    }

    private RestaurantTable find(Long id) {
        return tableRepository.findById(id).orElseThrow(() -> AppException.notFound(appMessages.get("table.not_found")));
    }
}
