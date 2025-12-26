#!/bin/bash
#
# Safe Migration Script
# Automaticky vytvoří zálohu před aplikací migrací
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Safe Migration ===${NC}"
echo ""

# 1. Zobrazit pending migrace
echo -e "${YELLOW}Pending migrations:${NC}"
cd "$PROJECT_DIR"
npx supabase migration list 2>/dev/null | grep -E "^\s*(local|remote)" || echo "  (none or error listing)"
echo ""

# 2. Zeptat se uživatele
echo -e "${YELLOW}This will:${NC}"
echo "  1. Create a backup of current database"
echo "  2. Apply pending migrations using 'supabase migration up'"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

# 3. Vytvořit zálohu
echo ""
echo -e "${YELLOW}Creating backup...${NC}"
"$SCRIPT_DIR/backup.sh"

# 4. Aplikovat migrace
echo ""
echo -e "${YELLOW}Applying migrations...${NC}"
cd "$PROJECT_DIR"
npx supabase migration up

echo ""
echo -e "${GREEN}=== Migration Complete ===${NC}"
echo ""
echo "If something went wrong, restore from the backup created above."
