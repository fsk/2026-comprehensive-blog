package com.fsk.blogsitebackend.entities;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "experience")
@Getter
@Setter
public class Experience extends BaseEntity {

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String period;

    private Boolean isCurrent = false;

    @ElementCollection
    @CollectionTable(name = "experience_technologies", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "technology")
    private List<String> technologies;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String leaveReason;

    private Integer displayOrder;
}
