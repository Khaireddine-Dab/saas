#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Color replacement mappings
replacements = {
    r'\btext-neutral-900\b': 'text-foreground',
    r'\btext-neutral-700\b': 'text-muted-foreground',
    r'\btext-neutral-600\b': 'text-muted-foreground',
    r'\btext-neutral-500\b': 'text-muted-foreground',
    r'\btext-neutral-400\b': 'text-muted-foreground',
    r'\bbg-neutral-50\b': 'bg-muted',
    r'\bbg-neutral-100\b': 'bg-muted',
    r'\bborder-neutral-200\b': 'border-border',
    r'\bborder-neutral-100\b': 'border-border',
    r'\bhover:bg-neutral-50\b': 'hover:bg-muted/50',
    r'\bhover:bg-neutral-100\b': 'hover:bg-muted/50',
    r'\bhover:border-neutral-300\b': 'hover:border-primary',
    r'\btext-gray-600\b': 'text-muted-foreground',
    r'\btext-gray-700\b': 'text-muted-foreground',
    r'\btext-gray-800\b': 'text-foreground',
    r'\btext-gray-900\b': 'text-foreground',
    r'\bbg-gray-50\b': 'bg-muted',
    r'\bbg-gray-100\b': 'bg-muted',
    r'\bbg-gray-200\b': 'bg-muted',
}

# Color scheme replacements for status badges
status_replacements = {
    "bg-red-100 text-red-800": "bg-red-500/20 text-red-400",
    "bg-yellow-100 text-yellow-800": "bg-yellow-500/20 text-yellow-400",
    "bg-green-100 text-green-800": "bg-green-500/20 text-green-400",
    "bg-blue-100 text-blue-800": "bg-primary/20 text-primary",
    "bg-orange-100 text-orange-800": "bg-orange-500/20 text-orange-400",
    "bg-purple-100 text-purple-800": "bg-purple-500/20 text-purple-400",
    "bg-cyan-100 text-cyan-800": "bg-cyan-500/20 text-cyan-400",
    "text-red-600": "text-red-400",
    "text-yellow-600": "text-yellow-400",
    "text-green-600": "text-green-400",
    "text-blue-600": "text-primary",
    "text-orange-600": "text-orange-400",
    "text-purple-600": "text-purple-400",
}

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Apply replacements
        for pattern, replacement in replacements.items():
            content = re.sub(pattern, replacement, content)
        
        for pattern, replacement in status_replacements.items():
            content = content.replace(pattern, replacement)
        
        # Only write if changes were made
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
    
    # Target directories
    target_dirs = [
        project_root / 'app' / 'dashboard',
        project_root / 'components',
        project_root / 'hooks',
    ]
    
    files_fixed = 0
    
    for target_dir in target_dirs:
        if not target_dir.exists():
            continue
        
        for filepath in target_dir.rglob('*.tsx'):
            if fix_file(filepath):
                files_fixed += 1
                print(f"✓ Fixed: {filepath.relative_to(project_root)}")
    
    print(f"\n[v0] Dark theme fixes completed! Fixed {files_fixed} files.")
    return 0

if __name__ == '__main__':
    exit(main())
