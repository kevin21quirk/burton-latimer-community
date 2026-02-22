import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find admin user
  const adminUser = await prisma.user.findFirst({
    where: { 
      isAdmin: true 
    }
  });

  if (!adminUser) {
    console.error('Admin user not found. Please create an admin user first.');
    console.error('Run: npx tsx scripts/create-admin-account.ts');
    process.exit(1);
  }

  console.log(`Deleting existing posts and creating platform guide posts...`);
  console.log(`Admin user: ${adminUser.email}`);

  // Delete all existing posts by this admin user
  await prisma.post.deleteMany({
    where: { userId: adminUser.id }
  });

  console.log('✅ Deleted existing posts');

  // Helper function to get date X days ago
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };

  // POST 1 — Welcome & Platform Overview
  await prisma.post.create({
    data: {
      content: `# Welcome to Latimer Community! 🏘️

**Your local digital hub for connection, support, and community engagement**

Latimer Community is a dedicated social platform designed specifically for Burton Latimer residents, local businesses, and charities. We're here to strengthen community bonds, facilitate mutual support, and create meaningful connections.

## 🎯 What Makes Us Different?

Unlike generic social media platforms, Latimer Community is:

• **Local-focused** - Connect only with people in your area
• **Purpose-built** - Designed for community support and engagement
• **Safe & moderated** - Dedicated team ensuring member safety
• **Privacy-first** - Your data stays within our community
• **Accessible** - Easy to use for all ages and abilities

## 👥 Who Can Join?

• **Individuals** - Connect with neighbours, ask for help, share experiences
• **Charities** - Reach those in need, organize support, find volunteers
• **Businesses** - Promote services, engage with local customers

## 🚀 Getting Started

1. **Create your profile** - Tell us a bit about yourself
2. **Explore the feed** - See what's happening in your community
3. **Make connections** - Send connection requests to neighbours
4. **Join groups** - Find people with similar interests
5. **Post updates** - Share news, photos, or ask questions

**Ready to get involved? Let's build a stronger community together!** 💙`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200'],
      createdAt: daysAgo(10),
    }
  });

  // POST 2 — How to Create Your Profile
  await prisma.post.create({
    data: {
      content: `# Setting Up Your Profile 👤

**Make a great first impression with a complete profile**

Your profile is how other community members get to know you. Here's how to make it shine!

## 📝 Profile Basics

### For Individuals:
• **Name** - Your first and last name
• **Profile photo** - A friendly, clear photo of yourself
• **Bio** - Tell us about your interests and what brings you to the community
• **Interests** - Select topics you care about (helps us suggest connections)

### For Businesses:
• **Company name** - Your business name
• **Logo** - Your business logo or professional image
• **Description** - What services you offer
• **Website** - Link to your business website

### For Charities:
• **Charity name** - Your organisation's name
• **Charity number** - Your registered charity number
• **Mission** - What your charity does and who you help

## 🎨 Profile Tips

✅ **Use a clear photo** - Friendly faces get more connections
✅ **Be authentic** - Share genuine information about yourself
✅ **Add interests** - Helps us connect you with like-minded people
✅ **Keep it updated** - Update your profile as things change

## 🔒 Privacy Settings

You control what information is visible:
• Choose what appears on your public profile
• Manage who can send you messages
• Control connection request settings

## 📍 How to Edit Your Profile

1. Click on your profile picture (top right)
2. Select **"My Profile"**
3. Click **"Edit Profile"**
4. Update your information
5. Click **"Save Changes"**

**A complete profile helps you make meaningful connections!** 🌟`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200'],
      createdAt: daysAgo(9),
    }
  });

  // POST 3 — How to Post & Share Updates
  await prisma.post.create({
    data: {
      content: `# Sharing Posts & Updates 📝

**Connect with your community by sharing updates, photos, and thoughts**

Posts are the heart of Latimer Community. Here's everything you need to know about creating engaging content!

## ✍️ Creating a Post

### Step-by-Step:
1. Go to your **Dashboard**
2. Find the **"What's on your mind?"** box at the top
3. Type your message
4. Add photos if you'd like (optional)
5. Choose post type (General, Help Request, Business Ad, or Event)
6. Click **"Post"**

## 📸 Adding Photos

• Click the **image icon** in the post box
• Select up to 4 photos from your device
• Photos appear in a nice grid layout
• Great for sharing community events, before/after photos, or business promotions

## 💡 What to Post About

### Great Post Ideas:
• **Community news** - Local events, road closures, weather warnings
• **Recommendations** - Great local businesses or services
• **Questions** - Ask for advice or recommendations
• **Celebrations** - Share good news with your neighbours
• **Photos** - Beautiful local scenes, community events
• **Help requests** - Ask for assistance (more on this in another post!)

### Example Posts:
*"Does anyone know a good plumber in Burton Latimer? Need help with a leaky tap!"*

*"Beautiful sunset over the park this evening! 🌅 [photo]"*

*"The community centre is hosting a coffee morning this Saturday 10am-12pm. All welcome!"*

## 🎯 Post Types Explained

• **General** - Everyday updates and conversations
• **Help Request** - When you need assistance
• **Business Ad** - Promote your business or services
• **Event** - Share upcoming community events

## 👍 Engaging with Posts

• **Like** - Show appreciation with a heart
• **Comment** - Join the conversation
• **Share** - Coming soon!

## ⚠️ Posting Guidelines

✅ Be respectful and kind
✅ Keep it relevant to Burton Latimer
✅ No spam or excessive self-promotion
✅ Respect others' privacy
❌ No harassment or hate speech
❌ No scams or misleading information

**Your posts help build a vibrant, connected community!** 🌟`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=1200'],
      createdAt: daysAgo(8),
    }
  });

  // POST 4 — How to Connect with Others
  await prisma.post.create({
    data: {
      content: `# Connecting with Neighbours 🤝

**Build your local network by connecting with people in your community**

Connections are how you build relationships on Latimer Community. Here's how it works!

## 🔍 Finding People to Connect With

### Discover Page
1. Click **"Discover"** in the navigation
2. Browse people, businesses, and charities
3. Filter by interests to find like-minded neighbours
4. See who shares your hobbies and passions

### Search
• Use the search bar to find specific people
• Search by name, business, or charity
• View their profile before connecting

## 📬 Sending Connection Requests

### How to Connect:
1. Visit someone's profile
2. Click **"Connect"** button
3. Add a personal message (optional but recommended!)
4. Wait for them to accept

### Good Connection Messages:
*"Hi! I noticed we both love gardening. Would love to connect and share tips!"*

*"Hello neighbour! I live on the same street and thought it would be nice to connect."*

*"I saw your post about the community centre. I volunteer there too!"*

## ✅ Accepting Connection Requests

When someone wants to connect with you:
1. You'll receive a notification
2. View their profile to learn about them
3. Click **"Accept"** or **"Decline"**
4. Once accepted, you can message each other

## 💬 Benefits of Connecting

Once connected, you can:
• Send direct messages
• See each other's posts more prominently
• Offer and request help more easily
• Build genuine community relationships

## 🌟 Connection Tips

✅ **Connect with neighbours** - People who live nearby
✅ **Find shared interests** - Connect over hobbies
✅ **Support local businesses** - Connect with shops and services
✅ **Join community groups** - Meet people with similar goals
✅ **Be genuine** - Real connections matter most

## 🔒 Privacy & Safety

• You control who you connect with
• You can remove connections anytime
• Block users if needed
• Report suspicious behaviour

## 📊 Your Network

View your connections:
1. Go to **"Contacts"** page
2. See all your connections
3. Message them directly
4. Manage your network

**Strong connections make a strong community!** 💙`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200'],
      createdAt: daysAgo(7),
    }
  });

  // POST 5 — How to Use Messaging
  await prisma.post.create({
    data: {
      content: `# Using the Messaging System 💬

**Stay in touch with your community through private messages**

Our messaging system makes it easy to have private conversations with your connections.

## 📱 Accessing Messages

1. Click **"Messages"** in the navigation
2. See all your conversations in one place
3. Click on a conversation to open it
4. Type and send messages instantly

## ✉️ Starting a New Conversation

### Method 1: From Messages Page
1. Go to **Messages**
2. Click **"New Message"** or the search icon
3. Search for a connected user
4. Start typing your message

### Method 2: From a Profile
1. Visit someone's profile
2. Click **"Message"** button
3. Start your conversation

## 💡 Messaging Best Practices

### When Requesting Help:
*"Hi! I saw you offered to help with shopping. Would you be available this Thursday morning?"*

### When Offering Help:
*"Hello! I noticed your post about needing gardening help. I'd be happy to assist. When would suit you?"*

### General Conversations:
*"Thanks for the recommendation! I tried that café and it was lovely."*

## 🔔 Notifications

You'll be notified when:
• Someone sends you a message
• You receive a reply
• Someone accepts your connection request

## 🛡️ Safety in Messaging

✅ **Keep it on the platform** - Don't share personal details too quickly
✅ **Be respectful** - Treat others with kindness
✅ **Report issues** - Use the report button if needed
✅ **Block if necessary** - You can block users anytime
❌ **Never share** - Bank details, passwords, or sensitive info

## 📋 Message Features

• **Real-time messaging** - Instant delivery
• **Read receipts** - See when messages are read
• **Search conversations** - Find old messages easily
• **Archive chats** - Keep your inbox organized

## 🤝 Messaging Etiquette

✅ Be polite and friendly
✅ Respond in a reasonable timeframe
✅ Keep messages relevant
✅ Respect people's time
❌ Don't spam
❌ Don't send unsolicited business promotions

## 🔍 Finding Your Messages

• **Unread messages** appear at the top
• **Search bar** helps find specific conversations
• **Archive** old conversations to declutter

**Messages help turn online connections into real friendships!** 🌟`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1200'],
      createdAt: daysAgo(6),
    }
  });

  // POST 6 — How to Join & Create Groups
  await prisma.post.create({
    data: {
      content: `# Community Groups 👥

**Find your tribe and connect with people who share your interests**

Groups are where communities within the community form. Join existing groups or create your own!

## 🔍 Finding Groups

### Browse Groups:
1. Click **"Community Groups"** in navigation
2. See all available groups
3. Filter by interest or topic
4. Click on a group to learn more

### Popular Group Types:
• **Hobbies** - Gardening, crafts, photography, book clubs
• **Sports** - Walking groups, cycling, fitness
• **Support** - Parents, carers, mental health
• **Local interests** - History, environment, community projects
• **Age groups** - Young families, retirees, students

## 🚪 Joining a Group

### Public Groups:
1. Click on the group
2. Click **"Join Group"**
3. You're in! Start participating

### Private Groups:
1. Click on the group
2. Click **"Request to Join"**
3. Wait for admin approval
4. You'll be notified when accepted

## ✨ Creating Your Own Group

### Step-by-Step:
1. Go to **Community Groups**
2. Click **"Create Group"**
3. Fill in the details:
   - **Group name** - Clear and descriptive
   - **Description** - What the group is about
   - **Group image** - Eye-catching photo
   - **Privacy** - Public or Private
   - **Interests** - Help people find your group

### Example Groups:
*"Burton Latimer Gardeners - Share tips, seeds, and green-fingered advice!"*

*"Local History Enthusiasts - Discover and preserve our town's heritage"*

*"Parent & Toddler Meetups - Coffee, chat, and playdates for young families"*

## 📝 Group Features

• **Group posts** - Share content with members only
• **Events** - Organize meetups and activities
• **Discussions** - Have focused conversations
• **Member directory** - See who's in your group

## 👑 Group Admin Responsibilities

If you create a group, you can:
• Approve join requests (for private groups)
• Moderate posts and comments
• Remove members if necessary
• Set group rules and guidelines
• Pin important posts

## 💡 Making Your Group Successful

✅ **Post regularly** - Keep the group active
✅ **Welcome new members** - Make people feel included
✅ **Organize events** - Online or in-person meetups
✅ **Set clear rules** - Keep discussions respectful
✅ **Engage members** - Ask questions, start discussions

## 🎯 Group Etiquette

✅ Stay on topic
✅ Be respectful of different opinions
✅ Support other members
✅ Follow group rules
❌ No spam or self-promotion (unless allowed)
❌ No harassment or negativity

## 🌟 Example Group Activities

• **Weekly challenges** - Photo contests, recipe sharing
• **Meetups** - Coffee mornings, walks, workshops
• **Resource sharing** - Tips, recommendations, advice
• **Collaborative projects** - Community gardens, fundraisers

**Groups turn interests into friendships!** 🤝`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200'],
      createdAt: daysAgo(5),
    }
  });

  // POST 7 — How to Request & Offer Help
  await prisma.post.create({
    data: {
      content: `# Requesting & Offering Help 🤝

**The heart of our community - supporting each other through life's challenges**

Latimer Community makes it easy to ask for help when you need it and offer help when you can.

## 🆘 Requesting Help

### How to Create a Help Request:
1. Go to **"Help & Support"** section
2. Click **"Request Help"**
3. Choose a category:
   - Shopping assistance
   - Transportation
   - Companionship
   - Home tasks
   - Technology help
   - Other
4. Describe what you need clearly
5. Submit your request

### Writing a Good Help Request:

**Be Specific:**
❌ *"Need help with shopping"*
✅ *"Need help with weekly Tesco shop on Thursday mornings, approximately 1 hour"*

**Include Details:**
• What you need help with
• When you need it
• How long it might take
• Any special requirements

### Example Requests:
*"Looking for someone to help me set up my new smartphone. Need about 1 hour of patient guidance. Happy to provide tea and biscuits!"*

*"Recovering from surgery and need help with light housework once a week for the next month. Can cover any costs."*

## 💙 Offering Help

### How to Offer Help:
1. Browse help requests on the **Dashboard** or **Help & Support** page
2. Click on a request that interests you
3. Click **"Offer Help"** or comment on the post
4. Message the person to arrange details

### What You Can Offer:

**Time:**
• Weekly check-in calls
• Companionship visits
• Shopping assistance
• Dog walking

**Skills:**
• IT help
• Gardening
• DIY tasks
• Tutoring

**Resources:**
• Transport to appointments
• Lending tools or equipment
• Sharing knowledge

## 🛡️ Staying Safe

### For Help Seekers:
✅ Meet in public places first
✅ Tell someone where you're going
✅ Check ID if someone comes to your home
✅ Use platform messaging initially
✅ Trust your instincts

### For Help Givers:
✅ Verify the person's identity
✅ Set clear boundaries
✅ Don't commit to more than you can handle
✅ Report any concerns
✅ Stay within your capabilities

## 📋 Help Request Categories

### Common Requests:
• **Shopping** - Weekly groceries, pharmacy runs
• **Transport** - Doctor appointments, errands
• **Companionship** - Regular visits, phone calls
• **Technology** - Computer help, smartphone setup
• **Garden** - Light weeding, lawn mowing
• **Home tasks** - Small repairs, decorating

## 💡 Tips for Successful Help Exchanges

**Communication:**
• Be clear about expectations
• Confirm times and dates
• Update if plans change
• Say thank you!

**Boundaries:**
• Don't feel obligated to say yes
• It's okay to decline
• Set time limits
• Know your capabilities

## 🌟 Building Trust

• Start with small requests
• Meet in public first
• Get to know each other
• Build relationships gradually
• Leave reviews/feedback (coming soon!)

## ⚠️ What We Don't Allow

❌ Requests for money or loans
❌ Anything illegal or dangerous
❌ Excessive or unreasonable demands
❌ Anything that makes you uncomfortable

**Together, we can create a community where no one has to struggle alone!** 💛`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200'],
      createdAt: daysAgo(4),
    }
  });

  // POST 8 — How to Use Discover Feature
  await prisma.post.create({
    data: {
      content: `# Discovering Your Community 🔍

**Find people, businesses, and organisations that match your interests**

The Discover page helps you explore everything Burton Latimer has to offer!

## 🎯 What You Can Discover

### People:
• Neighbours with similar interests
• Potential friends and connections
• People who share your hobbies
• Community volunteers

### Businesses:
• Local shops and services
• Tradespeople and professionals
• Restaurants and cafés
• Home services

### Charities:
• Local support organisations
• Volunteer opportunities
• Community projects
• Fundraising initiatives

## 🔍 Using the Discover Page

### Step-by-Step:
1. Click **"Discover Community"** in navigation
2. Browse the three tabs:
   - **People** - Individual community members
   - **Businesses** - Local companies
   - **Charities** - Non-profit organisations
3. Use the **search bar** to find specific interests
4. Click on profiles to learn more
5. Send connection requests

## 🏷️ Interest-Based Discovery

### How It Works:
• Select interests when you create your profile
• The platform suggests people with matching interests
• Filter by specific interests to find your tribe

### Popular Interests:
• Gardening & nature
• Arts & crafts
• Sports & fitness
• Reading & book clubs
• Cooking & baking
• Local history
• Photography
• Walking & hiking
• Music & entertainment
• Volunteering

## 💼 Finding Local Businesses

### What You'll Find:
• **Services** - Plumbers, electricians, cleaners
• **Retail** - Shops, boutiques, markets
• **Food & Drink** - Restaurants, cafés, takeaways
• **Health & Wellness** - Gyms, therapists, beauty
• **Professional Services** - Accountants, solicitors

### Supporting Local:
• Read business profiles
• See what services they offer
• Connect to stay updated
• Share recommendations
• Leave reviews (coming soon!)

## 🤝 Discovering Charities

### Local Organisations:
• Find charities working in your area
• Learn about their missions
• Discover volunteer opportunities
• See how you can help
• Connect to stay informed

## 📊 Recommendation Algorithm

We suggest connections based on:
• Shared interests
• Geographic proximity
• Mutual connections
• Activity and engagement
• Profile completeness

## 💡 Discovery Tips

✅ **Complete your profile** - Better matches
✅ **Add multiple interests** - More connections
✅ **Be open-minded** - Try new connections
✅ **Engage actively** - Like and comment
✅ **Update regularly** - Keep interests current

## 🌟 Making the Most of Discovery

### Daily Habits:
• Check Discover page regularly
• Send 2-3 connection requests per week
• Respond to requests promptly
• Engage with new connections
• Share interesting profiles

### Building Your Network:
1. Start with people nearby
2. Connect based on shared interests
3. Engage with their content
4. Build genuine relationships
5. Support local businesses

**Discovery is the first step to building a vibrant local network!** 🌟`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200'],
      createdAt: daysAgo(3),
    }
  });

  // POST 9 — Platform Safety & Reporting
  await prisma.post.create({
    data: {
      content: `# Staying Safe on Latimer Community 🛡️

**Your safety is our top priority - here's how we keep the community secure**

We've built multiple layers of protection to ensure Latimer Community remains a safe, trustworthy space.

## 🔒 Our Safety Features

### Moderation Team:
• Dedicated moderators review reports
• 24-hour response time for concerns
• Proactive monitoring of content
• Swift action against violations

### Verification:
• Email verification required
• Profile authenticity checks
• Business registration verification
• Charity number validation

### Privacy Controls:
• Control who sees your information
• Manage connection requests
• Block unwanted users
• Report suspicious behaviour

## 🚨 How to Report Concerns

### Reporting is Easy:
1. Click the **three dots** (⋮) on any post or message
2. Select **"Report"**
3. Choose the reason:
   - Harassment or bullying
   - Spam or scam
   - Inappropriate content
   - Impersonation
   - Other concerns
4. Add details (optional)
5. Submit

### What Happens Next:
• Your report is received immediately
• Our team reviews within 24 hours
• Appropriate action is taken
• You're updated on the outcome
• Your report remains confidential

## ⚠️ Common Safety Concerns

### Scams & Fraud:
🚩 Requests for money or bank details
🚩 Too-good-to-be-true offers
🚩 Pressure to act quickly
🚩 Requests for personal information

**What to Do:**
• Don't engage
• Report immediately
• Block the user
• Warn others if appropriate

### Harassment:
🚩 Repeated unwanted contact
🚩 Threatening messages
🚩 Personal attacks
🚩 Discriminatory behaviour

**What to Do:**
• Block the user immediately
• Report the behaviour
• Save evidence (screenshots)
• Contact us if urgent

### Suspicious Profiles:
🚩 Fake photos (reverse image search)
🚩 Incomplete information
🚩 Too many connection requests
🚩 Inconsistent details

**What to Do:**
• Don't connect
• Report the profile
• Warn friends if needed

## 🛡️ Protecting Yourself

### Personal Information:
❌ Don't share your full address publicly
❌ Don't share bank details
❌ Don't share passwords
❌ Don't share sensitive documents
✅ Use platform messaging initially
✅ Meet in public places first
✅ Tell someone where you're going
✅ Trust your instincts

### Meeting in Person:
✅ **First meeting** - Always in public
✅ **Tell someone** - Where you're going
✅ **Take your phone** - Keep it charged
✅ **Stay sober** - Keep your wits about you
✅ **Trust instincts** - Leave if uncomfortable

## 👤 Account Security

### Protect Your Account:
✅ Use a strong, unique password
✅ Don't share your login details
✅ Log out on shared devices
✅ Review login activity regularly
✅ Update password periodically

### If Your Account is Compromised:
1. Change your password immediately
2. Review recent activity
3. Contact our support team
4. Check for unauthorized posts
5. Notify your connections if needed

## 🚫 What We Don't Tolerate

**Zero Tolerance For:**
• Harassment or bullying
• Hate speech or discrimination
• Scams or fraud
• Impersonation
• Spam or excessive self-promotion
• Inappropriate content
• Threats or violence
• Exploitation of vulnerable people

**Consequences:**
• Warning (first offense)
• Temporary suspension
• Permanent ban
• Reporting to authorities (serious cases)

## 📞 Emergency Contacts

### If You're in Danger:
• **Call 999** - Police emergency
• **Call 101** - Police non-emergency
• **Call 0808 2000 247** - Victim Support

### Platform Support:
• **Email:** safeguarding@latimercommunity.com
• **Report button** - On any post or message
• **Contact form** - In settings

## 💙 Community Responsibility

**We All Play a Part:**
• Report suspicious behaviour
• Look out for vulnerable members
• Follow community guidelines
• Be kind and respectful
• Support each other

**Together, we create a safe community for everyone!** 🌟`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200'],
      createdAt: daysAgo(2),
    }
  });

  // POST 10 — Tips for Businesses
  await prisma.post.create({
    data: {
      content: `# Guide for Local Businesses 💼

**How to make the most of Latimer Community for your business**

Welcome, local businesses! Here's how to use our platform to connect with customers and grow your presence.

## 🎯 Why Join as a Business?

### Benefits:
• **Direct access** to local customers
• **Build trust** through community engagement
• **Free promotion** to Burton Latimer residents
• **Customer relationships** beyond transactions
• **Community reputation** that drives referrals

## 📝 Setting Up Your Business Profile

### Essential Information:
✅ **Company name** - Clear and recognizable
✅ **Logo** - Professional, high-quality image
✅ **Description** - What you do and what makes you special
✅ **Services** - List what you offer
✅ **Contact info** - Phone, email, website
✅ **Opening hours** - When customers can reach you
✅ **Location** - Where you're based

### Profile Tips:
• Use professional photos
• Write in a friendly, approachable tone
• Highlight what makes you unique
• Include customer testimonials (with permission)
• Keep information up to date

## 📢 Posting as a Business

### What to Post:

**Promotions & Offers:**
*"Spring Sale! 20% off all garden services this month. Book now!"*

**New Products/Services:**
*"Exciting news! We're now offering evening appointments for busy professionals."*

**Behind the Scenes:**
*"Meet the team! Here's Sarah, our lead designer with 15 years of experience."*

**Customer Success Stories:**
*"Thrilled to help the Johnson family with their kitchen renovation. See the before and after!"*

**Community Involvement:**
*"We're proud sponsors of the Burton Latimer Youth Football team!"*

**Tips & Advice:**
*"Top 5 tips for maintaining your boiler this winter - from our expert engineers."*

## 🤝 Engaging with the Community

### Best Practices:
✅ **Respond promptly** to comments and messages
✅ **Be helpful** - Answer questions even if they don't lead to sales
✅ **Share expertise** - Provide free value and tips
✅ **Support others** - Engage with community posts
✅ **Be authentic** - Show the human side of your business

### Don't:
❌ Spam with constant promotions
❌ Ignore customer questions
❌ Be overly salesy
❌ Badmouth competitors
❌ Post irrelevant content

## 💡 Marketing Ideas

### Regular Content:
• **Monday Motivation** - Inspirational quotes
• **Tip Tuesday** - Industry advice
• **Behind the Scenes** - Show your process
• **Customer Spotlight** - Feature happy customers
• **Friday Offers** - Weekend specials

### Seasonal Content:
• Holiday promotions
• Seasonal tips
• Weather-related advice
• Local events sponsorship

## 🌟 Building Trust

### How to Establish Credibility:
• Complete your profile fully
• Post regularly (2-3 times per week)
• Respond to all inquiries
• Share customer testimonials
• Show your expertise
• Be transparent about pricing
• Offer excellent service

### Verification:
• Verify your business registration
• Add your business address
• Link to your website
• Show certifications/accreditations

## 📊 Measuring Success

### Track Your Growth:
• Connection requests received
• Post engagement (likes, comments)
• Message inquiries
• Profile views
• Conversion to customers

### Adjust Your Strategy:
• Post when your audience is active
• Share content that gets engagement
• Respond to what customers want
• Test different types of posts

## 🎁 Special Offers for Community Members

### Ideas:
• **First-time discount** - "10% off for new Latimer Community members"
• **Loyalty rewards** - "Refer a friend and both get 15% off"
• **Community days** - "Every Tuesday, 20% off for platform members"
• **Elderly discounts** - "Special rates for residents 70+"

## 🤝 Networking with Other Businesses

### Collaboration Opportunities:
• Cross-promote complementary businesses
• Joint events or promotions
• Referral partnerships
• Community projects
• Business networking groups

## ⚠️ Business Guidelines

### Remember:
✅ Be honest and transparent
✅ Deliver on promises
✅ Respect customer privacy
✅ Follow advertising standards
✅ Maintain professionalism
❌ No false claims
❌ No pressure tactics
❌ No spam

## 📞 Business Support

Need help? Contact us:
• **Email:** business@latimercommunity.com
• **Business resources** - Coming soon
• **Advertising options** - Premium features in development

**Let's grow your business while strengthening our community!** 🚀`,
      userId: adminUser.id,
      images: ['https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200'],
      createdAt: daysAgo(1),
    }
  });

  console.log('✅ Successfully created all platform guide posts!');
  console.log('\nPost Summary:');
  console.log('- 10 comprehensive platform guide posts');
  console.log('- Each post includes relevant images');
  console.log('- Covers all major platform features');
  console.log('- Includes practical examples and tips');
}

main()
  .catch((e) => {
    console.error('Error creating platform guide posts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
