package com.booking.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "workspaces")
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable;

    @Column(nullable = false)
    private String location;
}