package com.finflow.transactionservice.kafka;

import com.finflow.transactionservice.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionProducer {

    private final KafkaTemplate<String, Transaction> kafkaTemplate;

    public void publishTransaction(Transaction transaction) {
        kafkaTemplate.send("transactions", transaction);
    }
}