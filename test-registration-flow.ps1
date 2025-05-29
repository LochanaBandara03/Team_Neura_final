# Test Registration Flow for SafeBridge
# This script starts both the frontend and backend services and provides test instructions

$GREEN = [char]27 + "[32m"
$YELLOW = [char]27 + "[33m"
$CYAN = [char]27 + "[36m"
$RESET = [char]27 + "[0m"

Write-Host "${CYAN}Starting SafeBridge services for testing the registration flow...${RESET}" -ForegroundColor Cyan

# Start Backend Server
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd $PSScriptRoot\backend; python app.py" -WindowStyle Normal

# Wait a moment for the backend to initialize
Start-Sleep -Seconds 3

# Start Frontend Server
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd $PSScriptRoot\frontend; npm run dev" -WindowStyle Normal

# Display test instructions
Write-Host "`n${GREEN}Both services are now running!${RESET}" -ForegroundColor Green
Write-Host "`n${YELLOW}====== REGISTRATION FLOW TEST INSTRUCTIONS ======${RESET}" -ForegroundColor Yellow
Write-Host "Please open your browser and navigate to: ${CYAN}http://localhost:3000/register${RESET}" -ForegroundColor White

Write-Host "`n${CYAN}Test scenarios to verify:${RESET}" -ForegroundColor Cyan
Write-Host "${GREEN}1. Person in Need registration${RESET}" -ForegroundColor Green
Write-Host "   - Complete basic information (steps 1 and 2)"
Write-Host "   - Verify only these two steps are required"
Write-Host "   - After step 2, you should be redirected to dashboard"

Write-Host "`n${GREEN}2. First Responder registration${RESET}" -ForegroundColor Green
Write-Host "   - Complete all three steps"
Write-Host "   - In step 3, verify that all fields are required:"
Write-Host "     * Experience description (minimum 10 characters)"
Write-Host "     * At least one specialty"
Write-Host "     * Availability selection"

Write-Host "`n${GREEN}3. Volunteer registration${RESET}" -ForegroundColor Green
Write-Host "   - Complete all three steps"
Write-Host "   - Similar requirements as First Responder"
Write-Host "   - Try selecting multiple specialties"

Write-Host "`n${GREEN}4. Form validation${RESET}" -ForegroundColor Green
Write-Host "   - Try submitting each form with missing information"
Write-Host "   - Verify appropriate error messages are shown"
Write-Host "   - Test password validation (8+ characters, matching confirmation)"
Write-Host "   - Test email format validation"

Write-Host "`n${YELLOW}For more detailed test cases, run:${RESET}" -ForegroundColor Yellow
Write-Host "${CYAN}.\registration-test-cases.ps1${RESET}" -ForegroundColor Cyan

Write-Host "`nVerify that after successful registration, you are redirected to the dashboard." -ForegroundColor White

Write-Host "`n${YELLOW}To stop the services, close the PowerShell windows or press Ctrl+C in each window.${RESET}" -ForegroundColor Yellow
Write-Host "${YELLOW}=======================================${RESET}" -ForegroundColor Yellow

# Keep the script running
Read-Host "`nPress Enter to exit this script (services will continue running)"
