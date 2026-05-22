package com.finflow.fraudservice.controller;

import com.finflow.fraudservice.entity.FraudAlert;
import com.finflow.fraudservice.repository.FraudAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fraud")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FraudController {

    private final FraudAlertRepository repository;

    @GetMapping
    public List<FraudAlert> getAllFrauds() {
        return repository.findAll();
    }
}