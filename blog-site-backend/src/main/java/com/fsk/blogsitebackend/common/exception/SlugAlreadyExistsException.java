package com.fsk.blogsitebackend.common.exception;

import lombok.Getter;

@Getter
public class SlugAlreadyExistsException extends RuntimeException {

    private final String slug;

    public SlugAlreadyExistsException(String slug) {
        super(String.format("Slug already exists: '%s'", slug));
        this.slug = slug;
    }
}
