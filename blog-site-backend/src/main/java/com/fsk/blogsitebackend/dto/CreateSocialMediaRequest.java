package com.fsk.blogsitebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSocialMediaRequest {
    private String name;
    private String url;
    private String iconName;
    private Integer displayOrder;
}
