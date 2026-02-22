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

  console.log(`Creating posts as admin user: ${adminUser.email}`);

  // Helper function to get date X days ago
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };

  // POST SET 1 — WELCOME & SAFETY (4 POSTS)
  
  // Post 1 — Welcome Post
  await prisma.post.create({
    data: {
      content: `# Welcome to Latimer Community 🏘️

We're delighted to welcome you to Latimer Community - a safe, supportive platform designed to bring together individuals, local businesses, and charities across Burton Latimer.

**Our Purpose:**
This platform exists to strengthen our community bonds, support those who need help, and celebrate the wonderful diversity of people and organisations in our area.

**What You Can Do Here:**
• Connect with neighbours and make new friends
• Request or offer help to those in need
• Discover local businesses and services
• Join community groups based on your interests
• Share updates, photos, and local news

**Our Commitment:**
We're dedicated to maintaining a safe, respectful, and kind environment for everyone. Every member deserves to feel welcomed and valued.

**Let's Build Something Special Together**
Whether you're here to connect, support others, or grow your business, we're glad you're part of our community.

Stay safe, be kind, and let's make Burton Latimer an even better place to live! 💛`,
      userId: adminUser.id,
      createdAt: daysAgo(7),
    }
  });

  // Post 2 — How to Ask for Help
  await prisma.post.create({
    data: {
      content: `# How to Request Help Safely 🤝

Asking for help is a sign of strength, not weakness. Here's how to do it safely on our platform:

**Creating a Help Request:**
1. Navigate to the Help & Support section
2. Click "Request Help"
3. Describe what you need clearly
4. Choose the appropriate category
5. Submit your request

**Keeping Yourself Safe:**
✓ **Never share** your full address publicly - wait until you've connected with someone trustworthy
✓ **Keep personal details private** - don't share bank details, passwords, or sensitive information
✓ **Use platform messaging** - keep all communication within the platform initially
✓ **Meet in public places** first if meeting in person
✓ **Trust your instincts** - if something feels wrong, it probably is

**If You Have Concerns:**
• Use the "Report" button on any post or message
• Contact our moderation team immediately
• Block users who make you uncomfortable

**Remember:** Genuine helpers will never pressure you, ask for money upfront, or request sensitive personal information.

Your safety is our priority. If you're unsure about anything, please reach out to us. 🛡️`,
      userId: adminUser.id,
      createdAt: daysAgo(6),
    }
  });

  // Post 3 — Community Guidelines
  await prisma.post.create({
    data: {
      content: `# Community Guidelines 📋

To keep Latimer Community a safe and welcoming space for everyone, we ask all members to follow these guidelines:

**Be Respectful**
• Treat everyone with kindness and courtesy
• Respect different opinions and perspectives
• Use appropriate language at all times

**No Harassment or Bullying**
• Zero tolerance for threatening behaviour
• No personal attacks or insults
• Respect people's privacy and boundaries

**No Scams or Fraud**
• Don't use the platform for fraudulent activities
• Never ask for money, bank details, or passwords
• Report suspicious behaviour immediately

**No Discrimination**
• Everyone is welcome regardless of age, race, religion, gender, sexuality, or disability
• Discriminatory language or behaviour will result in immediate removal

**Protect Vulnerable Members**
• Be especially mindful when interacting with elderly or vulnerable community members
• Never take advantage of someone's trust
• Report any concerns about exploitation

**Report Concerns**
If you see something that concerns you:
• Click the "Report" button on posts or messages
• Contact our moderation team
• We review all reports promptly and take appropriate action

**Consequences:**
Violations may result in:
- Warning
- Temporary suspension
- Permanent ban
- Reporting to authorities (for serious violations)

Let's work together to keep our community safe and supportive! 💙`,
      userId: adminUser.id,
      createdAt: daysAgo(5),
    }
  });

  // Post 4 — Safeguarding Commitment
  await prisma.post.create({
    data: {
      content: `# Our Commitment to Keeping the Community Safe 🛡️

At Latimer Community, safeguarding our members - especially vulnerable individuals - is our highest priority.

**Our Moderation Process:**
• All reported content is reviewed within 24 hours
• Trained moderators assess each case carefully
• We take swift action against violations
• Regular platform monitoring for suspicious activity

**Reporting Tools:**
You have multiple ways to report concerns:
• Report button on every post and message
• Direct contact with moderation team
• Anonymous reporting available
• Emergency contact for urgent safeguarding issues

**Zero Tolerance Policy:**
We have zero tolerance for:
• Abuse, harassment, or threatening behaviour
• Scams, fraud, or exploitation
• Discrimination of any kind
• Inappropriate content involving minors
• Attempts to harm vulnerable individuals

**What Happens When You Report:**
1. Your report is received immediately
2. Our team reviews the content/behaviour
3. We investigate thoroughly
4. Appropriate action is taken (warning, suspension, or ban)
5. Serious cases are reported to relevant authorities
6. You're updated on the outcome (where appropriate)

**Working with Authorities:**
We cooperate fully with:
• Local police
• Social services
• Safeguarding boards
• Other relevant agencies

**Your Role:**
Help us keep everyone safe by:
• Reporting suspicious behaviour
• Looking out for vulnerable neighbours
• Following our community guidelines
• Being a positive, supportive member

**Contact Us:**
If you have safeguarding concerns, contact us immediately:
• Use the in-platform reporting system
• Email: safeguarding@latimercommunity.com
• For emergencies: Call 999

Together, we can build a community where everyone feels safe and supported. 💛`,
      userId: adminUser.id,
      createdAt: daysAgo(4),
    }
  });

  // POST SET 2 — SAMPLE HELP REQUESTS (with #ExamplePost tag)
  
  await prisma.post.create({
    data: {
      content: `**⚠️ This is an example of how a help request might look. #ExamplePost**

# Seeking Friendly Companionship ☕

Hello everyone,

I'm an 82-year-old lady living alone in Burton Latimer. My family lives quite far away, and I'd love to have someone to chat with over a cup of tea once or twice a week.

I enjoy talking about gardening, local history, and watching quiz shows. If you have an hour to spare and fancy a chat, I'd be so grateful for the company.

**What I'm looking for:**
• A friendly face for regular visits
• Someone to chat with over tea and biscuits
• Perhaps help with the occasional crossword puzzle!

If you're interested, please send me a message. Thank you for reading. 💐`,
      userId: adminUser.id,
      createdAt: daysAgo(3),
    }
  });

  await prisma.post.create({
    data: {
      content: `**⚠️ This is an example of how a help request might look. #ExamplePost**

# Help with Weekly Shopping 🛒

Hi neighbours,

I'm recovering from a hip operation and finding it difficult to get to the shops. I'm looking for someone who could help me with my weekly shopping trip to Tesco.

**What I need:**
• Help once a week (preferably Thursday mornings)
• Assistance getting to and from the shop
• Someone to help carry shopping bags
• Duration: About 1-2 hours

I can cover petrol costs and would be so grateful for the help during my recovery period (approximately 6-8 weeks).

Thank you for considering! 🙏`,
      userId: adminUser.id,
      createdAt: daysAgo(3),
    }
  });

  await prisma.post.create({
    data: {
      content: `**⚠️ This is an example of how a help request might look. #ExamplePost**

# Information About Food Support 🍲

Hello,

I'm going through a difficult time financially and wondering if anyone knows about local food banks or community support services in Burton Latimer?

I'm not asking for direct help, just information about:
• Local food banks and their opening times
• Community meal programmes
• Where to access emergency food support
• Any other relevant local services

Any information would be greatly appreciated. Thank you.`,
      userId: adminUser.id,
      createdAt: daysAgo(2),
    }
  });

  await prisma.post.create({
    data: {
      content: `**⚠️ This is an example of how a help request might look. #ExamplePost**

# Signposting for Financial Advice 💷

Hi everyone,

I'm facing some unexpected financial difficulties and need guidance on where to get proper advice. I'm NOT asking for money - just information about:

• Free debt advice services
• Citizens Advice Bureau contact details
• Benefits advice services
• Local support organisations

If anyone knows about legitimate services that could help, I'd be grateful for the information.

Thank you for understanding. 🙏`,
      userId: adminUser.id,
      createdAt: daysAgo(2),
    }
  });

  await prisma.post.create({
    data: {
      content: `**⚠️ This is an example of how a help request might look. #ExamplePost**

# Volunteer Needed for Light Gardening 🌱

Hello kind neighbours,

I'm an elderly gentleman who loves my garden but can no longer manage the heavier tasks. I'm looking for a volunteer who could help with:

• Light weeding (about once a fortnight)
• Cutting back overgrown plants
• General tidying
• Maybe 2-3 hours every couple of weeks

I can provide all tools and refreshments. It's not a big garden, but it means the world to me to keep it looking nice.

If you enjoy gardening and have some spare time, I'd be so grateful! 🌻`,
      userId: adminUser.id,
      createdAt: daysAgo(1),
    }
  });

  // POST SET 3 — SAMPLE OFFERS OF HELP
  
  await prisma.post.create({
    data: {
      content: `# Offering Weekly Check-In Calls 📞

Hello everyone,

I'm a local volunteer with some free time, and I'd like to offer regular phone check-ins for anyone who might be feeling isolated or lonely.

**What I'm offering:**
• Weekly phone calls (15-30 minutes)
• A friendly chat about anything you like
• Someone to listen and share a laugh with
• Completely free - just want to help

I'm DBS checked and have experience volunteering with Age UK. If you or someone you know would benefit from a regular friendly call, please get in touch!

Let's keep our community connected. 💙`,
      userId: adminUser.id,
      createdAt: daysAgo(1),
    }
  });

  await prisma.post.create({
    data: {
      content: `# Offering Transport to Medical Appointments 🚗

Hi neighbours,

I'm a retired teacher with a clean driving licence and some spare time. I'd like to offer free transport to medical appointments for anyone who needs it.

**What I can offer:**
• Lifts to GP appointments, hospital visits, pharmacy trips
• Help getting in and out of the car
• Assistance at the appointment if needed
• Flexible with timing

**About me:**
• DBS checked
• Patient and friendly
• Reliable car with easy access
• Happy to help anyone in need

If you need help getting to medical appointments, please message me. No charge - just happy to help our community! 🙏`,
      userId: adminUser.id,
      createdAt: daysAgo(1),
    }
  });

  await prisma.post.create({
    data: {
      content: `# Special Discount for Elderly Residents 🏪

Hello Burton Latimer community,

I run a local handyman business and want to give back to our wonderful community. I'm offering a 30% discount on all services for residents aged 70+.

**Services include:**
• Small repairs around the home
• Flat-pack furniture assembly
• Picture hanging and odd jobs
• Garden maintenance
• No job too small!

**Why I'm doing this:**
My late grandmother struggled to find affordable help with home repairs, and I want to make sure our elderly residents don't face the same challenges.

**Fully insured and DBS checked.** References available.

If you or someone you know could benefit, please get in touch! 🔧`,
      userId: adminUser.id,
      createdAt: daysAgo(1),
    }
  });

  await prisma.post.create({
    data: {
      content: `# Offering Basic IT Help 💻

Hi everyone!

I'm a local IT professional offering free basic computer and smartphone help for anyone who needs it.

**I can help with:**
• Setting up email accounts
• Using video calls (Zoom, WhatsApp, etc.)
• Online banking safely
• Social media basics
• Smartphone tips and tricks
• Staying safe online

**Sessions:**
• Free 1-hour sessions
• At your home or local library
• Patient and friendly approach
• No question is too simple!

Technology shouldn't be a barrier to staying connected. If you need help, please reach out! 📱`,
      userId: adminUser.id,
      createdAt: daysAgo(1),
    }
  });

  // POST SET 4 — LOCAL INFORMATION POSTS
  
  await prisma.post.create({
    data: {
      content: `# How to Find Local Food Support 🍽️

**Important Community Information**

If you or someone you know needs food support, here are local resources:

**Burton Latimer Food Bank**
• Location: Community Centre, High Street
• Opening: Tuesdays & Thursdays, 10am-12pm
• Referral needed (contact Citizens Advice)
• Phone: [Local number]

**Kettering Food Bank**
• Serves wider area including Burton Latimer
• Multiple distribution points
• Website: ketteringfoodbank.org.uk

**How to Get a Referral:**
• Citizens Advice: 0808 278 7810
• Your GP surgery
• Social services
• Local churches

**Emergency Support:**
• Call 0808 278 7810 for urgent help
• Salvation Army: Emergency food parcels

**No Judgement, Just Support**
Everyone faces difficult times. These services exist to help - please use them if you need to.

For more information, visit your local library or contact Citizens Advice. 💙`,
      userId: adminUser.id,
      createdAt: daysAgo(0),
    }
  });

  await prisma.post.create({
    data: {
      content: `# Where to Get Free Financial Advice 💷

**Important: Legitimate Free Services**

Facing financial difficulties? Here's where to get FREE, trustworthy advice:

**Citizens Advice Bureau**
• Free, confidential, impartial advice
• Help with debt, benefits, housing
• Phone: 0808 278 7810
• Website: citizensadvice.org.uk

**StepChange Debt Charity**
• Free debt advice
• Phone: 0800 138 1111
• Online advice available
• Website: stepchange.org

**National Debtline**
• Free confidential advice
• Phone: 0808 808 4000
• Webchat available

**MoneyHelper (Government Service)**
• Free financial guidance
• Phone: 0800 138 7777
• Website: moneyhelper.org.uk

**⚠️ Warning Signs of Scams:**
• Anyone asking for upfront fees
• Promises of "quick fixes"
• Pressure to sign immediately
• Requests for bank details via text/email

**Legitimate services are always FREE and never pressure you.**

If you're struggling, please reach out to these trusted organisations. 🙏`,
      userId: adminUser.id,
      createdAt: daysAgo(0),
    }
  });

  await prisma.post.create({
    data: {
      content: `# Importance of Checking ID Before Accepting Help 🆔

**Staying Safe When Accepting Help**

When someone offers to help you, especially with tasks in your home, it's important to verify who they are:

**Always Check:**
✓ Ask for photo ID (driving licence or passport)
✓ Verify their business registration (if applicable)
✓ Check they have proper insurance
✓ Ask for references from other customers
✓ Look for online reviews

**For Tradespeople:**
✓ Check they're registered (Gas Safe, NICEIC, etc.)
✓ Get written quotes
✓ Never pay full amount upfront
✓ Get a receipt for any payment

**For Volunteers:**
✓ Confirm they're from a legitimate organisation
✓ Check if they're DBS checked
✓ Contact the organisation to verify
✓ Trust your instincts

**Red Flags:**
🚩 Refuses to show ID
🚩 Pressures you to decide quickly
🚩 Asks for payment upfront
🚩 Wants to come inside immediately
🚩 Makes you feel uncomfortable

**Remember:**
• Genuine helpers won't mind showing ID
• It's okay to say no if you're unsure
• You can ask them to come back another time
• Contact the organisation directly to verify

**If Something Feels Wrong:**
• Don't let them in
• Call a family member or friend
• Contact the police on 101 (or 999 if urgent)
• Report to Trading Standards: 0808 223 1133

Your safety comes first. Never feel pressured to accept help if you're uncomfortable. 🛡️`,
      userId: adminUser.id,
      createdAt: daysAgo(0),
    }
  });

  await prisma.post.create({
    data: {
      content: `# Staying Safe When Meeting Someone for the First Time 🤝

**Safety Guidelines for First Meetings**

Whether you're meeting someone to receive help, offer help, or just make a new friend, follow these safety guidelines:

**Before Meeting:**
✓ Tell a friend or family member where you're going
✓ Share the person's name and contact details
✓ Agree on a specific time and place
✓ Keep all communication on the platform initially

**Choose a Safe Location:**
✓ Meet in a public place (café, library, community centre)
✓ Choose somewhere busy with other people around
✓ Pick a place you know well
✓ Avoid isolated areas

**During the Meeting:**
✓ Take your mobile phone (fully charged)
✓ Don't share your home address initially
✓ Keep personal belongings secure
✓ Trust your instincts - if something feels wrong, leave

**For Home Visits:**
Only after you've met in public and feel comfortable:
✓ Have someone else present if possible
✓ Keep the door open
✓ Don't let them access private areas
✓ Have your phone nearby

**Red Flags:**
🚩 Wants to meet at your home immediately
🚩 Refuses to meet in public first
🚩 Pressures you to share personal information
🚩 Makes you feel uncomfortable or unsafe
🚩 Asks for money or bank details

**For Vulnerable Individuals:**
• Ask a friend or family member to accompany you
• Inform your GP or social worker
• Use a trusted intermediary service
• Contact Age UK for advice: 0800 678 1602

**Remember:**
• Taking precautions doesn't mean you're being rude
• Genuine people will understand and respect your safety concerns
• It's always okay to change your mind
• Your safety is more important than being polite

**If You Feel Unsafe:**
• Leave immediately
• Call 999 if you're in danger
• Report concerns on the platform
• Contact local police: 101

Stay safe and trust your instincts! 💙`,
      userId: adminUser.id,
      createdAt: daysAgo(0),
    }
  });

  console.log('✅ Successfully created all sample posts!');
  console.log('\nPost Summary:');
  console.log('- 4 Welcome & Safety posts');
  console.log('- 5 Sample Help Request posts (marked with #ExamplePost)');
  console.log('- 4 Sample Offer of Help posts');
  console.log('- 4 Local Information posts');
  console.log('\nTotal: 17 posts created');
}

main()
  .catch((e) => {
    console.error('Error creating sample posts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
