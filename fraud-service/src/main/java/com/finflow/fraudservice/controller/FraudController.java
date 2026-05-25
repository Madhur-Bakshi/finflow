package com.finflow.fraudservice.controller;

import com.finflow.fraudservice.dto.Transaction;
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

    @PostMapping("/analyze")
    public void checkFraud(
            @RequestBody Transaction transaction
    ) {

        String riskLevel;
        String reason;

        if (transaction.getAmount() >= 1000000) {

            riskLevel = "CRITICAL";
            reason = "Extremely high transaction amount";

        } else if (transaction.getAmount() >= 300000) {

            riskLevel = "HIGH";
            reason = "High transaction amount";

        } else if (transaction.getAmount() >= 100000) {

            riskLevel = "MEDIUM";
            reason = "Moderately high transaction amount";

        } else {

            return;
        }

        FraudAlert fraudAlert = FraudAlert.builder()
                .userId(transaction.getUserId())
                .merchant(transaction.getMerchant())
                .amount(transaction.getAmount())
                .category(transaction.getCategory())
                .reason(reason)
                .riskLevel(riskLevel)
                .timestamp(transaction.getTimestamp())
                .build();

        repository.save(fraudAlert);
    }
}