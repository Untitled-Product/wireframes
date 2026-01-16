# Authentication Flow (K-001)

Legends DXP kimlik doğrulama akışı - Sadece cep telefonu + OTP ile giriş.

```mermaid
flowchart TD
    subgraph AUTH["Authentication"]
        START(("Başla")) --> LOGIN["Login Sayfası<br/><small>Telefon girişi</small>"]
        LOGIN --> ENTER["Cep telefonu gir"]
        ENTER --> CHECK{"Telefon<br/>kayıtlı?"}
    end

    subgraph OTP["OTP Verification"]
        CHECK -->|Evet| SEND_OTP[/"POST /auth/otp/send<br/><small>SMS gönder</small>"/]
        SEND_OTP --> OTP_PAGE["OTP Doğrulama<br/><small>6 haneli kod</small>"]
        OTP_PAGE --> VERIFY[/"POST /auth/otp/verify"/]
        VERIFY --> VALID{"OTP<br/>doğru?"}
    end

    subgraph SESSION["Session Management"]
        VALID -->|Evet| CREATE["Session oluştur<br/><small>JWT token</small>"]
        CREATE --> DASHBOARD["Dashboard<br/><small>Rol bazlı menü</small>"]
        DASHBOARD --> END_OK(("Tamam"))
    end

    CHECK -->|Hayır| REGISTER["Kayıt Sayfası<br/><small>Yeni kullanıcı</small>"]

    VALID -->|Hayır| ERROR["Hata göster<br/><small>Max 3 deneme</small>"]
    ERROR --> RETRY{"Tekrar<br/>dene?"}
    RETRY -->|Evet| OTP_PAGE
    RETRY -->|Hayır| LOGIN

    style START fill:#22c55e,stroke:#16a34a,color:#fff
    style END_OK fill:#22c55e,stroke:#16a34a,color:#fff
    style LOGIN fill:#ccfbf1,stroke:#0d9488
    style OTP_PAGE fill:#ccfbf1,stroke:#0d9488
    style DASHBOARD fill:#ccfbf1,stroke:#0d9488
    style REGISTER fill:#ccfbf1,stroke:#0d9488
    style CHECK fill:#fef3c7,stroke:#d97706
    style VALID fill:#fef3c7,stroke:#d97706
    style RETRY fill:#fef3c7,stroke:#d97706
    style SEND_OTP fill:#fef3c7,stroke:#d97706
    style VERIFY fill:#fef3c7,stroke:#d97706
    style ERROR fill:#fee2e2,stroke:#ef4444
```

## Notlar

- E-posta ile giriş YOK (K-001)
- Şifre sistemi YOK (K-001)
- Max 3 OTP deneme hakkı, sonra geçici kilitlenme
