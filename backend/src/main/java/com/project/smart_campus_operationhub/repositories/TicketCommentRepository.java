package com.project.smart_campus_operationhub.repositories;

import com.project.smart_campus_operationhub.entities.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Integer> {
    List<TicketComment> findByTicketId(Integer ticketId);
}
