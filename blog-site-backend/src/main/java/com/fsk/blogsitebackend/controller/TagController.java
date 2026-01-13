package com.fsk.blogsitebackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.service.TagService;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    
    private final TagService tagService;


    
}
