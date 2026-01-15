package com.fsk.blogsitebackend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsk.blogsitebackend.service.AssetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/assets")
@RequiredArgsConstructor
public class AssetController {
    
    private final AssetService assetService;
    
    
}
