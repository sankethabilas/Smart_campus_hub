package com.project.smart_campus_operationhub.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "location", schema = "campus")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "name")
    private String name;

    @Size(max = 100)
    @Column(name = "building_name")
    private String buildingName;

    @Column(name = "floor_no")
    private Integer floorNo;


}