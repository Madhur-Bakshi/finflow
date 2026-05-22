package com.finflow.fraudservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "fraud_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudAlert {

    @Id
    private String id;

    private String userId;

    private String merchant;

    private Double amount;

    private String category;

    private String reason;

    private String riskLevel;

    private LocalDateTime timestamp;
}