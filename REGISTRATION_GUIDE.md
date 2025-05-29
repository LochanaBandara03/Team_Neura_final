# SafeBridge Registration Flow Guide

## Overview

The SafeBridge platform offers a sophisticated multi-step registration process tailored to different user roles. This document provides a visual guide to the registration process and explains what to expect at each step.

## Registration Steps

The registration process consists of up to three steps, depending on the user's role:

1. **Account Creation**: Basic user information and credentials
2. **Role & Location Selection**: Role selection and geographic location
3. **Experience & Specialties**: Additional information for responders and volunteers

## Step 1: Account Creation

All users, regardless of role, must complete this step to create their account.

### Required Information:
- **Full Name**: Your complete name
- **Email Address**: A valid email address (used for login)
- **Password**: Must be at least 8 characters long
- **Password Confirmation**: Must match the password

### Validation Rules:
- All fields are required
- Email must be in a valid format
- Password must be at least 8 characters
- Password and confirmation must match

## Step 2: Role & Location Selection

This step determines what type of user you are registering as and collects location information.

### Role Options:

1. **Person in Need**: Individuals who might require assistance during emergencies
2. **First Responder**: Professionally trained emergency responders
3. **Volunteer**: People who can provide assistance but aren't professional responders

### Required Information:
- **Role Selection**: Choose one of the three roles
- **Location**: Your city, state/province, and country
- **Terms Acceptance**: You must agree to the Terms of Service and Privacy Policy

### Validation Rules:
- Location is required
- Terms of Service must be accepted

## Step 3: Experience & Specialties

This step is only required for First Responders and Volunteers. Persons in Need skip this step and are directed to the dashboard after step 2.

### Required Information:
- **Experience Description**: Relevant training, certifications, or experience
- **Specialties**: Areas of expertise (medical, search & rescue, etc.)
- **Availability**: When you can be available to respond

### Available Specialties:
- Medical
- Search & Rescue
- Firefighting
- Communication
- Logistics
- Transportation
- Mental Health
- Childcare
- Elder Care
- Technical (Electricity/Water/Gas)
- Foreign Languages
- Food Distribution

### Validation Rules:
- Experience description is required (minimum 10 characters)
- At least one specialty must be selected
- Availability selection is required

## Registration Completion

After completing all required steps, you will be automatically logged in and redirected to the dashboard appropriate for your role.

## Testing the Registration Flow

To thoroughly test the multi-step registration process, use the provided test scripts:

```powershell
# Basic test instructions and server startup
.\test-registration-flow.ps1

# Detailed test cases and instructions
.\registration-test-cases.ps1
```

These scripts provide comprehensive guidance for testing different user roles and validation scenarios.

## Troubleshooting

If you encounter issues during registration:

1. Check for validation error messages
2. Ensure both frontend and backend servers are running
3. Check browser console for errors (F12)
4. Try using a different browser
5. Verify your internet connection

For persistent issues, contact the development team with details about the problem and any error messages you received.
