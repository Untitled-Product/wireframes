# Admin Hierarchy Flow (K-003)

3 katmanlı yönetici hiyerarşisi - Super Admin → Tenant Admin → Editor

```mermaid
flowchart TB
    subgraph SUPER["SUPER ADMIN <small>(System Level - Legends DXP Platform)</small>"]
        SA_LOGIN(("SA<br/>Giriş")) --> SA_DASH["Platform Dashboard<br/><small>Tüm tenant'lar</small>"]
        SA_DASH --> TENANT_CRUD["Tenant CRUD<br/><small>Oluştur/Düzenle/Sil</small>"]
        TENANT_CRUD --> CREATE_TA["Tenant Admin Oluştur"]
        CREATE_TA --> SYSTEM_DB[("system_db<br/><small>Merkezi</small>")]
    end

    subgraph TENANT["TENANT ADMIN <small>(Project Level - örn: Tersane Nick)</small>"]
        TA_LOGIN(("TA<br/>Giriş")) --> TA_DASH["Tenant Dashboard<br/><small>Kendi tenant'ı</small>"]
        TA_DASH --> EDITOR_MGT["Editor Yönetimi<br/><small>Kullanıcı listesi</small>"]
        EDITOR_MGT --> CREATE_ED["Editor Oluştur<br/><small>Checkbox yetkiler</small>"]
        CREATE_ED --> ASSIGN_PERM["Yetki Ata<br/><small>Granüler (K-002)</small>"]
        ASSIGN_PERM --> TENANT_DB[("tenant_xxx_db<br/><small>Tenant başına ayrı</small>")]
    end

    subgraph EDITOR["EDITOR <small>(User Level - Granüler yetkiler)</small>"]
        ED_LOGIN(("E<br/>Giriş")) --> ED_DASH["Editor Dashboard<br/><small>Yetki bazlı menü</small>"]
        ED_DASH --> CHECK_PERM{"Yetki<br/>var mı?"}
        CHECK_PERM -->|Evet| ACCESS["Modüle Eriş<br/><small>Store/CMS/Kampanya</small>"]
        CHECK_PERM -->|Hayır| DENIED["Erişim Engeli<br/><small>403 Forbidden</small>"]
        ACCESS --> END_ED(("Bitti"))
    end

    CREATE_TA -.->|Davet SMS| TA_LOGIN
    ASSIGN_PERM -.->|Davet SMS| ED_LOGIN

    style SA_LOGIN fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style TA_LOGIN fill:#3b82f6,stroke:#2563eb,color:#fff
    style ED_LOGIN fill:#0d9488,stroke:#0f766e,color:#fff
    style END_ED fill:#22c55e,stroke:#16a34a,color:#fff
    style SYSTEM_DB fill:#dbeafe,stroke:#2563eb
    style TENANT_DB fill:#dbeafe,stroke:#2563eb
    style CHECK_PERM fill:#fef3c7,stroke:#d97706
    style DENIED fill:#fee2e2,stroke:#ef4444
```

## Veritabanı İzolasyonu

| DB | İçerik |
|----|--------|
| `system_db` | Super Admin, Tenant kayıtları, platform config |
| `tenant_xxx_db` | Her tenant için ayrı (Tenant Admin + Editor + tenant verileri) |

## Kısıtlamalar

- Tenant Admin: Diğer tenant'lara erişim YOK
- Editor: Başka kullanıcı oluşturma yetkisi YOK
