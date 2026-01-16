# Order State Machine

Sipariş durumu geçişleri - Order lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: Sepet oluşturuldu

    Created --> PendingPayment: checkout

    PendingPayment --> Processing: pay
    PendingPayment --> Cancelled: timeout/cancel

    Processing --> Paid: success
    Processing --> PaymentFailed: fail

    PaymentFailed --> PendingPayment: retry
    PaymentFailed --> Cancelled: abandon

    Paid --> Confirmed: confirm
    Paid --> Refunded: refund

    Confirmed --> Ready: prepare
    Confirmed --> Refunded: refund

    Ready --> Completed: deliver

    Completed --> [*]
    Cancelled --> [*]
    Refunded --> [*]

    state PendingPayment {
        direction LR
        [*] --> WaitingCard
        WaitingCard --> CardEntered
    }

    note right of Created
        Kullanıcı sepete ürün ekledi
    end note

    note right of PendingPayment
        Ödeme zaman aşımı: 15 dakika
    end note

    note right of Refunded
        İade: sadece ödeme sonrası,
        teslimden önce
    end note
```

## State Açıklamaları

| State | Açıklama |
|-------|----------|
| **Created** | Sepet oluşturuldu |
| **PendingPayment** | Ödeme bekleniyor |
| **Processing** | Ödeme işleniyor |
| **Paid** | Ödeme tamamlandı |
| **Confirmed** | Sipariş onaylandı |
| **Ready** | Hazırlandı |
| **Completed** | Teslim edildi (Final) |
| **PaymentFailed** | Ödeme başarısız |
| **Cancelled** | İptal edildi (Final) |
| **Refunded** | İade edildi (Final) |

## Transitions

| From | To | Trigger |
|------|----|---------|
| Created | PendingPayment | checkout |
| PendingPayment | Processing | pay |
| Processing | Paid | success |
| Processing | PaymentFailed | fail |
| Paid | Confirmed | confirm |
| Confirmed | Ready | prepare |
| Ready | Completed | deliver |
