# Admin Setup Guide

## Overview

Burton Latimer Connect includes a full admin dashboard that gives you complete control over the platform.

## Making Yourself an Admin

After registering your account, you need to grant yourself admin privileges:

### Step 1: Register Your Account
1. Go to `/register` and create your account
2. Complete the registration form with your details
3. Login to verify your account works

### Step 2: Grant Admin Access
Run the following command with your registered email:

```bash
npx tsx scripts/make-admin.ts your-email@example.com
```

Example:
```bash
npx tsx scripts/make-admin.ts kevin@example.com
```

You should see:
```
✅ Successfully made kevin@example.com an admin!
🔐 Kevin Quirk now has full admin access
📍 Visit /admin to access the admin dashboard
```

## Accessing the Admin Dashboard

Once you're an admin, visit: **`/admin`**

## Admin Capabilities

### User Management
- **View all users** - See complete list of registered users
- **Delete users** - Remove users from the platform
- **Grant/revoke admin** - Make other users admins or remove admin privileges
- **View user details** - Email, account type, registration date

### Post Management
- **View all posts** - Monitor all content on the platform
- **Delete posts** - Remove inappropriate or unwanted posts
- **View engagement** - See likes and comments count
- **Filter by type** - GENERAL, HELP_REQUEST, BUSINESS_AD, EVENT

### Group Management
- **View all groups** - See all community groups
- **Delete groups** - Remove groups from the platform
- **View group stats** - Member count, post count
- **Monitor activity** - Track group creation dates

### Platform Statistics
The dashboard shows real-time stats:
- Total Users
- Total Posts
- Total Groups
- Total Messages

## Security

- Only users with `isAdmin: true` in the database can access `/admin`
- Non-admin users are automatically redirected to login
- Admins cannot delete their own account
- All admin actions are permanent and cannot be undone

## Best Practices

1. **Be careful with deletions** - All delete actions are permanent
2. **Grant admin sparingly** - Only trusted users should have admin access
3. **Monitor regularly** - Check the admin dashboard frequently for inappropriate content
4. **Keep your account secure** - Use a strong password for your admin account

## Troubleshooting

### "Unauthorized" when accessing /admin
- Make sure you've run the `make-admin.ts` script with your email
- Verify you're logged in with the correct account
- Check that your email matches exactly (case-sensitive)

### Can't delete a user
- You cannot delete your own admin account
- Make sure you're logged in as an admin

### Database errors
- Ensure your `DATABASE_URL` is correctly set in `.env`
- Run `npx prisma db push` to sync the schema
- Run `npx prisma generate` to regenerate the Prisma Client

## Admin Navigation

From the admin dashboard, you can:
- Click "Back to Platform" to return to the main dashboard
- Use the tabs to switch between Users, Posts, and Groups
- All changes refresh the page automatically

## Future Enhancements

Planned admin features:
- Analytics and reporting
- Bulk actions
- User suspension (temporary ban)
- Content moderation queue
- Email notifications for admin actions
