#!/bin/bash

echo "🔒 KeyCV Security Audit with Snyk"
echo "=================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from backend directory."
    exit 1
fi

# Check authentication
echo "Checking Snyk authentication..."
if ! snyk auth status &>/dev/null; then
    echo "❌ Not authenticated with Snyk."
    echo "Run: snyk auth"
    exit 1
fi
echo "✅ Authenticated"
echo ""

# Run vulnerability test
echo "1️⃣  Testing for vulnerabilities..."
echo "-----------------------------------"
snyk test --severity-threshold=low

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ No vulnerabilities found!"
else
    echo ""
    echo "⚠️  Vulnerabilities detected. See above for details."
fi
echo ""

# Show upgradable packages
echo "2️⃣  Checking for available fixes..."
echo "-----------------------------------"
FIXES=$(snyk test --json 2>/dev/null | jq -r '.vulnerabilities[]? | select(.isUpgradable == true) | "\(.title): Upgrade \(.packageName) to \(.upgradePath[1] // "latest")"' 2>/dev/null)

if [ -z "$FIXES" ]; then
    echo "ℹ️  No automatic fixes available or all issues require manual intervention."
else
    echo "$FIXES"
fi
echo ""

# Monitor project
echo "3️⃣  Monitoring project on Snyk dashboard..."
echo "-----------------------------------"
snyk monitor --project-name="KeyCV-Backend"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Project monitored successfully!"
    echo "📊 View your dashboard at: https://app.snyk.io/"
fi
echo ""

# Generate JSON report
echo "4️⃣  Generating detailed JSON report..."
echo "-----------------------------------"
snyk test --json > snyk-report.json 2>/dev/null

if [ -f "snyk-report.json" ]; then
    CRITICAL=$(cat snyk-report.json | jq '[.vulnerabilities[]? | select(.severity == "critical")] | length' 2>/dev/null)
    HIGH=$(cat snyk-report.json | jq '[.vulnerabilities[]? | select(.severity == "high")] | length' 2>/dev/null)
    MEDIUM=$(cat snyk-report.json | jq '[.vulnerabilities[]? | select(.severity == "medium")] | length' 2>/dev/null)
    LOW=$(cat snyk-report.json | jq '[.vulnerabilities[]? | select(.severity == "low")] | length' 2>/dev/null)

    echo "✅ Report saved to: snyk-report.json"
    echo ""
    echo "📊 Summary:"
    echo "  🔴 Critical: ${CRITICAL:-0}"
    echo "  🟠 High:     ${HIGH:-0}"
    echo "  🟡 Medium:   ${MEDIUM:-0}"
    echo "  🔵 Low:      ${LOW:-0}"
else
    echo "⚠️  Could not generate JSON report"
fi
echo ""

echo "=================================="
echo "🏁 Security audit complete!"
echo "=================================="
