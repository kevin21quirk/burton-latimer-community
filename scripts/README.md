# Database Scripts

## Reset Database

This script clears all data from the database while keeping the schema intact.

### Usage

```bash
npx tsx scripts/reset-database.ts
```

### What it does

The script will delete all data from the following tables in order:
1. Likes
2. Comments
3. Posts
4. Messages
5. Group Members
6. Groups
7. Follows
8. Users

### Warning

⚠️ **This action is irreversible!** All data will be permanently deleted.

Make sure you want to clear the database before running this script.

### After Reset

After running the reset script, your database will be completely clean and ready for production use. You can then:
- Register new users through the registration page
- Create fresh posts, groups, and messages
- Build your community from scratch
