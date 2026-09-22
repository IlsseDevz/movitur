# ============================================================
# Arranca o backend MoviTur carregando as variaveis de ambiente
# do ficheiro local movitur.env (se existir).
# Uso:  ./run-backend.ps1
# ============================================================
$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot "movitur.env"
if (Test-Path $envFile) {
    Write-Host "A carregar credenciais de movitur.env..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $idx = $line.IndexOf("=")
            $key = $line.Substring(0, $idx).Trim()
            $value = $line.Substring($idx + 1).Trim()
            if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host ("  {0} definido" -f $key) -ForegroundColor DarkGray
        }
    }
} else {
    Write-Host "Aviso: movitur.env nao encontrado." -ForegroundColor Yellow
    Write-Host "Os emails NAO serao enviados (apenas registados no log)." -ForegroundColor Yellow
    Write-Host "Copie movitur.env.example para movitur.env e preencha as credenciais." -ForegroundColor Yellow
}

# Localiza o Maven: primeiro no PATH, depois no caminho conhecido.
$mvnCmd = "mvn"
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    $mvnCmd = "C:\Users\USER\Downloads\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd"
}

Write-Host "A arrancar o backend (mvn -o spring-boot:run)..." -ForegroundColor Cyan
& $mvnCmd -o spring-boot:run
