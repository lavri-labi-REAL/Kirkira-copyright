Write-Host "Scanning Git history for large files..."

# Find all files > 100MB in the entire Git history
git rev-list --objects --all |
    git cat-file --batch-check="%(objecttype) %(objectname) %(objectsize) %(rest)" |
    ForEach-Object {
        $parts = $_.Split(" ")
        $type = $parts[0]
        if ($type -eq "blob") {
            $size = [int64]$parts[2]
            if ($size -gt 100MB) {
                $hash = $parts[1]
                $path = $parts[3..($parts.Length-1)] -join " "
                Write-Host "Large file found: $path ($size bytes)"
                "$hash $path" | Out-File -Append large_files.txt
            }
        }
    }

if (!(Test-Path "large_files.txt")) {
    Write-Host "No large files found. Nothing to clean."
    exit
}

Write-Host "Cleaning Git history..."

# Path to git-filter-repo
$filterRepo = "$env:USERPROFILE\AppData\Roaming\Python\Python314\Scripts\git-filter-repo.exe"

if (!(Test-Path $filterRepo)) {
    Write-Host "git-filter-repo not found. Installing..."
    pip install git-filter-repo
}

# Remove all large files from history
& $filterRepo --paths-from-file large_files.txt --invert-paths

Write-Host "Cleanup complete."
Write-Host "Run: git push origin --force"
