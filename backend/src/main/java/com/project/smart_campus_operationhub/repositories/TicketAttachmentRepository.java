package com.project.smart_campus_operationhub.repositories;

import com.project.smart_campus_operationhub.entities.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Integer> {

    List<TicketAttachment> findByTicketId(Integer ticketId);

    long countByTicketId(Integer ticketId);
}
