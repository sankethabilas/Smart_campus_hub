package com.project.smart_campus_operationhub.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "notification", schema = "campus")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;

    @Size(max = 50)
    @Column(name = "type")
    private String type;

    @Size(max = 200)
    @Column(name = "title")
    private String title;

    @Lob
    @Column(name = "message")
    private String message;

    @Size(max = 50)
    @Column(name = "reference_type")
    private String referenceType;

    @Column(name = "reference_id")
    private Integer referenceId;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;


}