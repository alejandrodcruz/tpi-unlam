package com.tpi.server.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InitialEndPointController {

    @RequestMapping("/HelloTpiFinal")
    public String initialEndPoint() {
        return "Hello tpi final";
    }
}
