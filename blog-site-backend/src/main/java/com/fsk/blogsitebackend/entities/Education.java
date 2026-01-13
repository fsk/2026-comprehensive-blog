package com.fsk.blogsitebackend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "education")
@Getter
@Setter
public class Education extends BaseEntity {

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String degree;

    private String faculty;

    private String department;

    @Column(nullable = false)
    private String period;

    private String status;

    @Column(length = 1000)
    private String thesis;

    private String gpa;
}
