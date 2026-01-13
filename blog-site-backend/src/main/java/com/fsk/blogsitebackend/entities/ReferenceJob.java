package com.fsk.blogsitebackend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "references_job")
@Getter
@Setter
public class ReferenceJob extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String currentCompany;

    private String currentTitle;

    private String workedTogether;

    private String roleWhenWorked;
}
