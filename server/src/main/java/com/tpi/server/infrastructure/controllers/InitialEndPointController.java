package com.tpi.server.infrastructure.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class InitialEndPointController {

    @RequestMapping("/")
    public String tesOKEndPoint() {
        String key = "Spring esta UP";
        return key;
    }
}