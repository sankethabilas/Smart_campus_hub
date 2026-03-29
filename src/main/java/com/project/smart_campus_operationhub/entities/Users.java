package com.project.smart_campus_operationhub.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users", schema = "campus")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 150)
    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Size(max = 50)
    @Column(name = "role", nullable = false, length = 50)
    private String role;

    @Size(max = 255)
    @Column(name = "password")
    private String password;

    @Size(max = 50)
    @Column(name = "oauth_provider", length = 50)
    private String oauthProvider;

    @Size(max = 100)
    @Column(name = "oauth_provider_id", length = 100)
    private String oauthProviderId;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "users")
    private Set<Audit> audits = new HashSet<>();

    @OneToMany(mappedBy = "requestedBy")
    private Set<Booking> requestedBookings = new HashSet<>();

    @OneToMany(mappedBy = "reviewedBy")
    private Set<Booking> reviewedBookings = new HashSet<>();

    @OneToMany(mappedBy = "users")
    private Set<Notification> notifications = new HashSet<>();

    @OneToMany(mappedBy = "reportedBy")
    private Set<Ticket> reportedTickets = new HashSet<>();

    @OneToMany(mappedBy = "assignedTo")
    private Set<Ticket> assignedTickets = new HashSet<>();

    @OneToMany(mappedBy = "uploadedBy")
    private Set<TicketAttachment> ticketAttachments = new HashSet<>();

    @OneToMany(mappedBy = "commentedBy")
    private Set<TicketComment> ticketComments = new HashSet<>();


}