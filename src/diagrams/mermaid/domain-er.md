# Domain Model - Entity Relationship

Legends DXP multi-tenant platform entity relationships

```mermaid
erDiagram
    TENANT ||--o{ USER : "has many"
    TENANT ||--o{ EVENT : "has many"
    TENANT ||--o{ PRODUCT : "has many"
    TENANT ||--o{ ORDER : "has many"
    TENANT ||--o{ CUSTOMER : "has many"
    TENANT ||--o{ CAMPAIGN : "has many"

    USER ||--o{ PERMISSION : "has many"

    EVENT ||--o{ PRODUCT : "has many"
    PRODUCT ||--o{ SESSION : "has many"

    CUSTOMER ||--o{ ORDER : "places"
    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER ||--o{ PAYMENT : "paid by"

    PRODUCT ||--o{ ORDER_ITEM : "in"
    SESSION ||--o{ ORDER_ITEM : "booked for"

    TENANT {
        uuid id PK
        string slug UK
        string name
        string domain
        enum status
        datetime created_at
    }

    USER {
        uuid id PK
        uuid tenant_id FK
        string phone UK
        string email
        string name
        enum role
        enum status
    }

    PERMISSION {
        uuid id PK
        uuid user_id FK
        string category
        string action
        boolean granted
    }

    EVENT {
        uuid id PK
        uuid tenant_id FK
        string slug
        json name
        datetime start_date
        datetime end_date
        enum status
    }

    PRODUCT {
        uuid id PK
        uuid tenant_id FK
        uuid event_id FK
        enum type
        string slug
        json name
        decimal price
    }

    SESSION {
        uuid id PK
        uuid product_id FK
        datetime start_time
        datetime end_time
        int capacity
        int booked
    }

    ORDER {
        uuid id PK
        uuid tenant_id FK
        uuid customer_id FK
        string order_number
        enum status
        decimal total
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        uuid session_id FK
        int quantity
        decimal unit_price
    }

    PAYMENT {
        uuid id PK
        uuid order_id FK
        decimal amount
        enum method
        enum status
        string provider_ref
    }

    CUSTOMER {
        uuid id PK
        uuid tenant_id FK
        string phone
        string email
        string name
        boolean is_guest
    }

    CAMPAIGN {
        uuid id PK
        uuid tenant_id FK
        string code
        enum discount_type
        decimal discount_value
        datetime valid_from
        datetime valid_until
    }
```

## Entity Grupları

| Grup | Entity'ler |
|------|-----------|
| **Auth & Authorization** | User, Permission |
| **Product Catalog** | Event, Product, Session |
| **Commerce** | Order, OrderItem, Payment, Customer, Campaign |
