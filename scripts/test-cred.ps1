$tmp = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tmp, "protocol=https`nhost=github.com`n`n", [System.Text.Encoding]::ASCII)
$result = & cmd /c "git credential fill < `"$tmp`" 2>&1"
Remove-Item $tmp -ErrorAction SilentlyContinue
Write-Output "RESULT:"
Write-Output $result
