package com.fsk.blogsitebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialMediaResponse {
    private UUID id;
    private String name;
    private String url;
    private String iconName;
    private Integer displayOrder;
    private Boolean isActive;
}
