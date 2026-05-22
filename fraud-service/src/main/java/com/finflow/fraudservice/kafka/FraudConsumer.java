package com.finflow.fraudservice.kafka;

import com.finflow.fraudservice.dto.Transaction;
import com.finflow.fraudservice.entity.FraudAlert;
import com.finflow.fraudservice.repository.FraudAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FraudConsumer {

    private final FraudAlertRepository repository;

    @KafkaListener(
            topics = "transactions",
            groupId = "fraud-group"
    )
    public void consume(Transaction transaction) {

        System.out.println(
                "Received Transaction: "
                        + transaction.getMerchant()
                        + " | Amount: "
                        + transaction.getAmount()
        );

        if (transaction.getAmount() > 50000) {

            System.out.println(
                    "FRAUD ALERT: Suspicious Transaction Detected!"
            );

            FraudAlert fraudAlert = FraudAlert.builder()
                    .userId(transaction.getUserId())
                    .merchant(transaction.getMerchant())
                    .amount(transaction.getAmount())
                    .category(transaction.getCategory())
                    .reason("High transaction amount")
                    .riskLevel("HIGH")
                    .timestamp(transaction.getTimestamp())
                    .build();

            repository.save(fraudAlert);

            System.out.println(
                    "Fraud alert saved to MongoDB!"
            );
        }
    }
}