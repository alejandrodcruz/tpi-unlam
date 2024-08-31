package com.tpi.server.infrastructure.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InitialEndPointController {

    @RequestMapping("/HelloTpiFinal")
    public String initialEndPoint() {
        return "Hello Tpi Final";
    }

    @RequestMapping("/")
    public String tesOKEndPoint() {
        String key = "Spring esta UP";
        return key;
    }
}