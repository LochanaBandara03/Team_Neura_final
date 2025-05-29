$ErrorActionPreference = "Stop"

# Define paths
$frontendPath = "c:\Users\locha\Desktop\Gen_AI_projects\ai_powered_disaster_Team_Neura\frontend"
$backendPath = "c:\Users\locha\Desktop\Gen_AI_projects\ai_powered_disaster_Team_Neura\backend"

# Function to display colorful messages
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Display welcome message
Clear-Host
Write-ColorOutput "Green" "`n🚀 Starting SafeBridge application...`n"
Write-ColorOutput "Cyan" "Frontend: http://localhost:3000"
Write-ColorOutput "Cyan" "Backend:  http://localhost:3001`n"

# Check if Python is installed
try {
    python --version
    Write-ColorOutput "Green" "✓ Python is installed"
} catch {
    Write-ColorOutput "Red" "❌ Python is not installed or not in PATH! Please install Python 3.7 or later."
    exit 1
}

# Check if Node.js is installed
try {
    node --version
    Write-ColorOutput "Green" "✓ Node.js is installed"
} catch {
    Write-ColorOutput "Red" "❌ Node.js is not installed or not in PATH! Please install Node.js 18 or later."
    exit 1
}

# Start backend in a new window
Write-ColorOutput "Yellow" "`n▶ Starting Flask backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; pip install -r requirements.txt; python app.py" -WindowStyle Normal

# Give backend a moment to start
Start-Sleep -Seconds 3

# Start frontend in a new window
Write-ColorOutput "Yellow" "▶ Starting Next.js frontend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm install; npm run dev" -WindowStyle Normal

Write-ColorOutput "Green" "`n✓ Servers starting... Please wait a moment for them to be ready.`n"
Write-ColorOutput "Cyan" "You can access the application at: http://localhost:3000"

Write-ColorOutput "Green" "`n✅ Application started successfully!"
Write-ColorOutput "Magenta" "ℹ️ Open http://localhost:3000 in your browser"
Write-ColorOutput "DarkGray" "Press Ctrl+C to stop the script (the server windows will remain open)"
