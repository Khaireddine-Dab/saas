#!/usr/bin/env python3
import os
import re
from pathlib import Path

def fix_file_colors(filepath):
    """Fix all neutral/gray colors in a file for dark theme."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Text color replacements
        replacements = [
            (r'\btext-neutral-900\b', 'text-foreground'),
            (r'\btext-neutral-700\b', 'text-muted-foreground'),
            (r'\btext-neutral-600\b', 'text-muted-foreground'),
            (r'\btext-neutral-500\b', 'text-muted-foreground'),
            (r'\btext-neutral-400\b', 'text-muted-foreground'),
            (r'\btext-gray-900\b', 'text-foreground'),
            (r'\btext-gray-800\b', 'text-foreground'),
            (r'\btext-gray-700\b', 'text-muted-foreground'),
            (r'\btext-gray-600\b', 'text-muted-foreground'),
            # Background replacements
            (r'\bbg-neutral-50\b', 'bg-muted'),
            (r'\bbg-neutral-100\b', 'bg-muted'),
            (r'\bbg-gray-50\b', 'bg-muted'),
            (r'\bbg-gray-100\b', 'bg-muted'),
            (r'\bbg-gray-200\b', 'bg-muted'),
            # Border replacements
            (r'\bborder-neutral-200\b', 'border-border'),
            (r'\bborder-neutral-100\b', 'border-border'),
            (r'\bborder-gray-200\b', 'border-border'),
            # Hover states
            (r'\bhover:bg-neutral-50\b', 'hover:bg-muted/50'),
            (r'\bhover:bg-gray-50\b', 'hover:bg-muted/50'),
            (r'\bhover:border-gray-300\b', 'hover:border-primary'),
        ]
        
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    project_root = Path('/vercel/share/v0-project')
    
    # Files remaining that still need fixes
    remaining_files = [
        'app/dashboard/support/chat/page.tsx',
        'app/dashboard/reports/orders/page.tsx',
        'app/dashboard/payments/subscriptions/page.tsx',
        'app/dashboard/payments/refunds/page.tsx',
        'app/dashboard/notifications/page.tsx',
        'app/dashboard/merchants/payouts/page.tsx',
        'app/dashboard/merchants/onboarding/page.tsx',
        'app/dashboard/marketing/notifications/page.tsx',
        'app/dashboard/drivers/page.tsx',
        'app/dashboard/dispatcher/vehicles/page.tsx',
        'app/dashboard/dispatcher/pricing/page.tsx',
        'app/dashboard/coupons/campaigns/page.tsx',
        'app/dashboard/admin/tax-reports/page.tsx',
        'app/dashboard/banners/page.tsx',
        'app/dashboard/admin/roles/page.tsx',
        'app/dashboard/cms-pages/page.tsx',
        'app/dashboard/admin/categories/page.tsx',
    ]
    
    files_fixed = 0
    for relative_path in remaining_files:
        filepath = project_root / relative_path
        if filepath.exists():
            if fix_file_colors(filepath):
                files_fixed += 1
                print(f"✓ Fixed: {relative_path}")
        else:
            print(f"✗ Not found: {relative_path}")
    
    print(f"\n[v0] Dark theme fixes completed! Fixed {files_fixed} files.")
    return 0

if __name__ == '__main__':
    exit(main())
