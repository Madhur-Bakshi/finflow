package com.finflow.fraudservice.repository;

import com.finflow.fraudservice.entity.FraudAlert;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FraudAlertRepository
        extends MongoRepository<FraudAlert, String> {
}