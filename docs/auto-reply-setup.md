# Auto-Reply Setup for listings@funeralhomedirectories.com

## Option 1: Google Workspace Vacation Responder

1. Sign into Gmail as listings@funeralhomedirectories.com
2. Go to Settings (gear icon) > See all settings
3. Scroll to "Vacation responder" section
4. Turn ON vacation responder
5. Subject: "Evermore Directory - Automated Response"
6. Message body:

```
Thank you for reaching out to Evermore Directory.

For funeral homes: Manage your listing and subscription at evermorepro.com. For billing questions use the Manage Billing link in your dashboard.

For families: Your inquiry was sent directly to the funeral home. Please call them directly using the phone number on their listing page if you need an immediate response.

This inbox is not monitored. Please use self-service resources above.
```

7. Check "Send a response to people outside my organization"
8. Save Changes

## Option 2: GHL Automation (Recommended)

1. In GHL go to Automations > Create Workflow
2. Trigger: "Inbound Email" to listings@funeralhomedirectories.com
3. Action: Send Email
   - To: {{contact.email}}
   - From: listings@funeralhomedirectories.com
   - Subject: Evermore Directory - Automated Response
   - Body: (same as above)
4. Publish the workflow

## Auto-Reply Text (copy-paste ready)

Thank you for reaching out to Evermore Directory.

For funeral homes: Manage your listing and subscription at evermorepro.com. For billing questions use the Manage Billing link in your dashboard.

For families: Your inquiry was sent directly to the funeral home. Please call them directly using the phone number on their listing page if you need an immediate response.

This inbox is not monitored. Please use self-service resources above.
