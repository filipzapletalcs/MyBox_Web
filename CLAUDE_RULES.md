# Pravidla pro Claude - MyBox.eco projekt

## KRITICKÁ PRAVIDLA - NIKDY NEPORUŠUJ

### 1. NIKDY nespouštěj destruktivní databázové příkazy
- **ZAKÁZÁNO**: `supabase db reset`
- **ZAKÁZÁNO**: `DROP TABLE`, `DROP SCHEMA`, `TRUNCATE` bez explicitního potvrzení
- **ZAKÁZÁNO**: `DELETE FROM` na celé tabulky

### 2. Pro aplikaci migrací VŽDY používej
```bash
# Správný způsob - aplikuje jen nové migrace
supabase migration up

# Nebo přímo SQL pro jednu migraci
docker exec supabase_db_mybox-eco psql -U postgres -d postgres -f /path/to/migration.sql
```

### 3. NIKDY nemaž data bez explicitního potvrzení uživatele
- Před každým DELETE/TRUNCATE se ZEPTEJ uživatele
- Ukaž CO přesně bude smazáno
- Počkej na explicitní "ano" nebo "yes"

### 4. Před mazáním médií/souborů VŽDY zkontroluj
- `storage-backup/` složku
- `public/` složku
- Supabase storage buckety
- Původní backup soubory

### 5. Záloha před rizikovými operacemi
Před jakoukoli operací, která může změnit data:
```bash
cd /Users/filipzapletal/MyBox_Web_26/mybox-eco
./scripts/backup.sh
```

## Lokální Supabase prostředí

- **DB kontejner**: `supabase_db_mybox-eco`
- **Storage kontejner**: `supabase_storage_mybox-eco`
- **URL**: `http://127.0.0.1:54321`
- **Studio**: `http://127.0.0.1:54323`

## Důležité složky

- `/backups/` - zálohy databáze a storage
- `/storage-backup/` - starší záloha storage souborů
- `/public/images/` - statické obrázky (fallback)

## Příkazy pro bezpečnou práci

```bash
# Zobrazit stav migrací
supabase migration list

# Aplikovat nové migrace (BEZPEČNÉ)
supabase migration up

# Vytvořit novou migraci
supabase migration new nazev_migrace

# Záloha před změnami
./scripts/backup.sh

# Obnova ze zálohy
./scripts/restore.sh backup_name
```
