package com.fsk.blogsitebackend.dto.tag;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String hexColorCode;
    private Boolean isActive;
}
