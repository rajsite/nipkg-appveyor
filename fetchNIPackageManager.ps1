
New-Item -Name DownloadCache -ItemType directory | Out-Null

if (!(Test-Path DownloadCache\NIPackageManager17.5.exe)) {
    $ProgressPreferenceOld = $ProgressPreference;
    $ProgressPreference = "SilentlyContinue";
    Invoke-WebRequest -Uri http://ftp.ni.com/support/softlib/AST/NIPM/NIPackageManager17.5.exe -OutFile DownloadCache\NIPackageManager17.5.exe;
    $ProgressPreference = $ProgressPreferenceOld;
}

Remove-Item NIPackageManagerCache -Recurse -Force -ErrorAction SilentlyContinue -ErrorVariable err
Write-Output $err

7z x .\DownloadCache\NIPackageManager17.5.exe -oNIPackageManagerCache
