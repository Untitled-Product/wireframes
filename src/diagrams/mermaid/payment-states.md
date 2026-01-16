# Payment State Machine

Ödeme durumu geçişleri - Payment lifecycle

```mermaid
stateDiagram-v2
    [*] --> Initiated: Ödeme başlatıldı

    Initiated --> Pending: submit

    Pending --> Processing: 3D Secure
    Pending --> Failed: reject

    Processing --> Authorized: authorize
    Processing --> Failed: error

    Authorized --> Captured: capture
    Authorized --> Cancelled: void

    Captured --> Settled: settle
    Captured --> RefundPending: refund request

    RefundPending --> Refunded: full refund
    RefundPending --> PartialRefund: partial

    PartialRefund --> RefundPending: more refund
    PartialRefund --> Refunded: complete

    Settled --> [*]
    Failed --> [*]
    Cancelled --> [*]
    Refunded --> [*]

    note right of Processing
        3D Secure: Tüm kartlar için zorunlu
    end note

    note right of Settled
        Settlement: T+1 banka günü
    end note
```

## State Açıklamaları

| State | Açıklama |
|-------|----------|
| **Initiated** | Ödeme başlatıldı |
| **Pending** | Onay bekleniyor |
| **Processing** | Banka işlemi (3D Secure) |
| **Authorized** | Yetkilendirildi |
| **Captured** | Tahsil edildi |
| **Settled** | Hesaba aktarıldı (Final) |
| **Failed** | Başarısız (Final) |
| **Cancelled** | İptal edildi (Final) |
| **RefundPending** | İade bekleniyor |
| **Refunded** | İade edildi (Final) |
| **PartialRefund** | Kısmi iade |

## Payment Flow

```
Initiated → Pending → Processing → Authorized → Captured → Settled
                ↓           ↓            ↓
             Failed      Failed      Cancelled
                                         ↓
                              RefundPending → Refunded
                                    ↓
                              PartialRefund
```
