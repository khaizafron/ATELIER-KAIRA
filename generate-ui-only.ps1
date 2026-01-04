# ======================================
# XIMY VAULT - UI FILES GENERATOR ONLY
# ======================================

$ROOT = "ximy-vault"
$UI_PATH = Join-Path $ROOT "src/components/ui"

# Ensure UI directory exists
if (!(Test-Path $UI_PATH)) {
    New-Item -ItemType Directory -Path $UI_PATH -Force | Out-Null
}

# UI files list
$uiFiles = @(
"accordion.tsx",
"alert-dialog.tsx",
"alert.tsx",
"aspect-ratio.tsx",
"avatar.tsx",
"badge.tsx",
"breadcrumb.tsx",
"button-group.tsx",
"button.tsx",
"calendar.tsx",
"card.tsx",
"carousel.tsx",
"chart.tsx",
"checkbox.tsx",
"collapsible.tsx",
"command.tsx",
"context-menu.tsx",
"dialog.tsx",
"drawer.tsx",
"dropdown-menu.tsx",
"empty.tsx",
"field.tsx",
"form.tsx",
"hover-card.tsx",
"input-group.tsx",
"input-otp.tsx",
"input.tsx",
"item.tsx",
"kbd.tsx",
"label.tsx",
"menubar.tsx",
"navigation-menu.tsx",
"pagination.tsx",
"popover.tsx",
"progress.tsx",
"radio-group.tsx",
"resizable.tsx",
"scroll-area.tsx",
"select.tsx",
"separator.tsx",
"sheet.tsx",
"sidebar.tsx",
"skeleton.tsx",
"slider.tsx",
"sonner.tsx",
"spinner.tsx",
"switch.tsx",
"table.tsx",
"tabs.tsx",
"textarea.tsx",
"toggle-group.tsx",
"toggle.tsx",
"tooltip.tsx"
)

# Create UI files
foreach ($file in $uiFiles) {
    $path = Join-Path $UI_PATH $file
    if (!(Test-Path $path)) {
        New-Item -ItemType File -Path $path -Force | Out-Null
    }
}

# Verify
Write-Host ""
Write-Host "UI components generated successfully:"
Write-Host ""
Get-ChildItem $UI_PATH | Select-Object Name
