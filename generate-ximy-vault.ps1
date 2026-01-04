# ======================================
# XIMY VAULT FULL PROJECT GENERATOR
# SINGLE FILE - ASCII SAFE
# ======================================

$ROOT = "ximy-vault"

# ---------- FOLDERS ----------
$folders = @(
".orchids",
"public",

"src/app/(auth)/login",

"src/app/(public)/about",
"src/app/(public)/cart",
"src/app/(public)/collection/[slug]",
"src/app/(public)/contact",
"src/app/(public)/items/[slug]",
"src/app/(public)/visit-us",

"src/app/admin/dashboard",
"src/app/admin/items/[id]/edit",
"src/app/admin/items/new",
"src/app/admin/login",
"src/app/admin/reports/generate",

"src/app/api/admin/ai-insights",
"src/app/api/items/[id]",

"src/components/glass",
"src/components/ui",
"src/components/contexts",
"src/components/hooks",

"src/lib/hooks",
"src/lib/supabase"
)

foreach ($folder in $folders) {
    $path = Join-Path $ROOT $folder
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

# ---------- FILES ----------
$files = @(
".orchids/orchids.json",

"public/file.svg",
"public/globe.svg",
"public/next.svg",
"public/vercel.svg",
"public/window.svg",

"src/app/(auth)/login/page.tsx",

"src/app/(public)/about/page.tsx",
"src/app/(public)/cart/page.tsx",
"src/app/(public)/collection/[slug]/page.tsx",
"src/app/(public)/collection/ViewTracker.tsx",
"src/app/(public)/contact/page.tsx",
"src/app/(public)/items/[slug]/page.tsx",
"src/app/(public)/items/WhatsAppButton.tsx",
"src/app/(public)/visit-us/page.tsx",
"src/app/(public)/layout.tsx",
"src/app/(public)/page.tsx",

"src/app/admin/dashboard/dashboard-client.tsx",
"src/app/admin/dashboard/page.tsx",

"src/app/admin/items/[id]/edit/page.tsx",
"src/app/admin/items/new/page.tsx",
"src/app/admin/items/DeleteItemButton.tsx",
"src/app/admin/items/ItemForm.tsx",
"src/app/admin/items/page.tsx",

"src/app/admin/login/page.tsx",

"src/app/admin/reports/generate/page.tsx",
"src/app/admin/reports/generate/report-client.tsx",
"src/app/admin/reports/page.tsx",

"src/app/admin/layout.tsx",

"src/app/api/admin/ai-insights/route.ts",
"src/app/api/items/[id]/route.ts",
"src/app/api/items/route.ts",

"src/app/favicon.ico",
"src/app/global-error.tsx",
"src/app/globals.css",
"src/app/layout.tsx",
"src/app/page.tsx",

"src/components/glass/CartPopup.tsx",
"src/components/glass/GlassButton.tsx",
"src/components/glass/GlassCard.tsx",
"src/components/glass/GlassFooter.tsx",
"src/components/glass/GlassNavbar.tsx",
"src/components/glass/GlassSidebar.tsx",
"src/components/glass/index.ts",

"src/components/AddToCartButton.tsx",
"src/components/AIInsightsCard.tsx",
"src/components/ErrorReporter.tsx",
"src/components/ImageUpload.tsx",
"src/components/ItemCardWithCart.tsx",

"src/components/contexts/CartContext.tsx",
"src/components/hooks/use-mobile.ts",

"src/lib/hooks/use-mobile.tsx",
"src/lib/supabase/admin.ts",
"src/lib/supabase/client.ts",
"src/lib/supabase/server.ts",
"src/lib/supabase/types.ts",
"src/lib/supabase/utils.ts",

"src/middleware.ts",

".env.local",
".gitignore",
"bun.lock",
"components.json",
"eslint.config.mjs",
"next-env.d.ts",
"next.config.ts",
"package.json",
"package-lock.json",
"postcss.config.mjs"
)

foreach ($file in $files) {
    $path = Join-Path $ROOT $file
    if (!(Test-Path $path)) {
        New-Item -ItemType File -Path $path -Force | Out-Null
    }
}

# ---------- VERIFY ----------
Write-Host ""
Write-Host "Ximy Vault project structure generated successfully."
Write-Host ""
tree $ROOT /F
