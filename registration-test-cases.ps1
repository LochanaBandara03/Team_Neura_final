# Test Registration Flow Script for SafeBridge

# This script outlines test cases to verify the complete registration flow works
# properly with different role selections.

$GREEN = [char]27 + "[32m"
$YELLOW = [char]27 + "[33m"
$RED = [char]27 + "[31m"
$BLUE = [char]27 + "[36m"
$RESET = [char]27 + "[0m"

function Write-Heading {
    param([string]$Text)
    Write-Host "`n$BLUE$Text$RESET" -ForegroundColor Cyan
    Write-Host "$BLUE$('-' * $Text.Length)$RESET" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Text)
    Write-Host "$GREEN[*]$RESET $Text"
}

function Write-TestCase {
    param([string]$Text)
    Write-Host "$YELLOW[TEST CASE]$RESET $Text"
}

function Write-ExpectedResult {
    param([string]$Text)
    Write-Host "$BLUE[EXPECTED]$RESET $Text"
}

Write-Heading "SafeBridge Registration Flow Test Script"
Write-Host "This script guides you through testing the complete registration flow of the SafeBridge platform."

Write-Step "First, make sure both the frontend and backend servers are running."
Write-Host "If they are not running, execute the start-app.ps1 script in a different terminal window."

Write-Heading "Test Case 1: Person in Need Registration"
Write-TestCase "Register as a Person in Need"
Write-Host "`nSteps to follow:"

Write-Step "1. Navigate to http://localhost:3000/register"
Write-Step "2. Complete Step 1: Account"
Write-Host "   - Enter a full name (e.g., 'Jane Doe')"
Write-Host "   - Enter an email address (e.g., 'janedoe@example.com')"
Write-Host "   - Enter a password (at least 8 characters)"
Write-Host "   - Confirm the password"
Write-Host "   - Click 'Continue'"

Write-Step "3. Complete Step 2: Role & Location"
Write-Host "   - Verify 'Person in Need' is selected by default"
Write-Host "   - Enter a location (e.g., 'New York, NY, USA')"
Write-Host "   - Accept the Terms of Service"
Write-Host "   - Click 'Continue'"

Write-Step "4. Notice that for 'Person in Need', Step 3 should be skipped"
Write-Host "   - You should be registered and redirected to the dashboard directly"

Write-ExpectedResult "You should be logged in and redirected to the dashboard without being asked for experience or specialties."

Write-Heading "Test Case 2: First Responder Registration"
Write-TestCase "Register as a First Responder"
Write-Host "`nSteps to follow:"

Write-Step "1. Navigate to http://localhost:3000/register (you may need to sign out first)"
Write-Step "2. Complete Step 1: Account"
Write-Host "   - Enter a full name (e.g., 'John Medic')"
Write-Host "   - Enter an email address (e.g., 'johnmedic@example.com')"
Write-Host "   - Enter a password (at least 8 characters)"
Write-Host "   - Confirm the password"
Write-Host "   - Click 'Continue'"

Write-Step "3. Complete Step 2: Role & Location"
Write-Host "   - Select 'First Responder'"
Write-Host "   - Enter a location (e.g., 'Boston, MA, USA')"
Write-Host "   - Accept the Terms of Service"
Write-Host "   - Click 'Continue'"

Write-Step "4. Complete Step 3: Experience & Specialties"
Write-Host "   - Enter some relevant experience"
Write-Host "   - Test validation by trying to submit without selecting specialties"
Write-Host "   - Select at least one specialty"
Write-Host "   - Test validation by trying to submit without selecting availability"
Write-Host "   - Select an availability option"
Write-Host "   - Click 'Complete Registration'"

Write-ExpectedResult "You should be logged in and redirected to the dashboard."

Write-Heading "Test Case 3: Volunteer Registration"
Write-TestCase "Register as a Volunteer"
Write-Host "`nSteps to follow:"

Write-Step "1. Navigate to http://localhost:3000/register (you may need to sign out first)"
Write-Step "2. Complete Step 1: Account"
Write-Host "   - Enter a full name (e.g., 'Alex Helper')"
Write-Host "   - Enter an email address (e.g., 'alexhelper@example.com')"
Write-Host "   - Enter a password (at least 8 characters)"
Write-Host "   - Confirm the password"
Write-Host "   - Click 'Continue'"

Write-Step "3. Complete Step 2: Role & Location"
Write-Host "   - Select 'Volunteer'"
Write-Host "   - Enter a location (e.g., 'Chicago, IL, USA')"
Write-Host "   - Accept the Terms of Service"
Write-Host "   - Click 'Continue'"

Write-Step "4. Complete Step 3: Experience & Specialties"
Write-Host "   - Enter some relevant experience"
Write-Host "   - Select multiple specialties (at least 2-3)"
Write-Host "   - Select an availability option"
Write-Host "   - Click 'Complete Registration'"

Write-ExpectedResult "You should be logged in and redirected to the dashboard."

Write-Heading "Test Case 4: Form Validation Tests"
Write-TestCase "Test validation errors for all form steps"
Write-Host "`nSteps to follow:"

Write-Step "1. Navigate to http://localhost:3000/register (you may need to sign out first)"
Write-Step "2. Test Step 1 Validation:"
Write-Host "   - Try to continue without filling in any fields"
Write-Host "   - Try entering an invalid email format"
Write-Host "   - Try entering a short password (less than 8 characters)"
Write-Host "   - Try entering non-matching passwords"

Write-Step "3. Complete Step 1 properly and continue to Step 2"
Write-Step "4. Test Step 2 Validation:"
Write-Host "   - Try to continue without entering a location"
Write-Host "   - Try to continue without accepting the Terms of Service"

Write-Step "5. Complete Step 2 properly and continue to Step 3"
Write-Step "6. Test Step 3 Validation (as First Responder or Volunteer):"
Write-Host "   - Try to complete registration without entering any experience"
Write-Host "   - Try to complete registration without selecting specialties"
Write-Host "   - Try to complete registration without selecting availability"

Write-ExpectedResult "The form should display appropriate error messages for each validation failure."

Write-Heading "Successful Completion"
Write-Host "If all test cases pass, the registration flow works as expected!"
Write-Host "You should verify that users with different roles see appropriate dashboard content after logging in."

Write-Step "To continue testing, try logging in with the accounts you just created."
Write-Host "The credentials should work immediately since accounts are stored in memory by the backend."
