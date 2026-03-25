package com.project.smart_campus_operationhub.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "asset", schema = "campus")
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "type")
    private String type;

    @ColumnDefault("'ACTIVE'")
    @Lob
    @Column(name = "status")
    private String status;

    @Column(name = "capacity")
    private Integer capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(name = "start_datetime")
    private Instant startDatetime;

    @Column(name = "end_datetime")
    private Instant endDatetime;

    @OneToMany(mappedBy = "asset")
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "asset")
    private Set<Ticket> tickets = new HashSet<>();


}