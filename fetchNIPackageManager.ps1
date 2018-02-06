
New-Item -Name DownloadCache -ItemType directory | Out-Null

if (!(Test-Path DownloadCache\NIPackageManager17.5.exe)) {
    $ProgressPreferenceOld = $ProgressPreference;
    $ProgressPreference = "SilentlyContinue";
    Invoke-WebRequest -Uri http://ftp.ni.com/support/softlib/AST/NIPM/NIPackageManager17.5.exe -OutFile DownloadCache\NIPackageManager17.5.exe;
    $ProgressPreference = $ProgressPreferenceOld;
}

.\DownloadCache\NIPackageManager17.5.exe /Q
