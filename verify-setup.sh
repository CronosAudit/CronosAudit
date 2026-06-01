#!/usr/bin/env bash

# Display the summary
cat PIPELINES_SUMMARY.txt

# Count files
echo ""
echo "📂 Verificando arquivos criados..."
echo ""

files_count=0

# GitHub Workflows
if [ -d ".github/workflows" ]; then
  workflow_files=$(ls -1 .github/workflows/ 2>/dev/null | grep -c ".*")
  echo "✅ .github/workflows/ - $workflow_files arquivos"
  ((files_count+=workflow_files))
fi

# Scripts
if [ -d "scripts" ]; then
  script_files=$(ls -1 scripts/ 2>/dev/null | grep -c ".*")
  echo "✅ scripts/ - $script_files arquivos"
  ((files_count+=script_files))
fi

# Root files
root_files=0
[ -f "Dockerfile" ] && echo "✅ Dockerfile" && ((root_files++))
[ -f ".dockerignore" ] && echo "✅ .dockerignore" && ((root_files++))
[ -f "docker-compose.yml" ] && echo "✅ docker-compose.yml" && ((root_files++))
[ -f "nginx.conf" ] && echo "✅ nginx.conf" && ((root_files++))
[ -f "azure-pipelines.yml" ] && echo "✅ azure-pipelines.yml" && ((root_files++))
[ -f ".env.example" ] && echo "✅ .env.example" && ((root_files++))

# Documentation
doc_files=0
[ -f "README_PIPELINES.md" ] && echo "✅ README_PIPELINES.md" && ((doc_files++))
[ -f "QUICK_START.md" ] && echo "✅ QUICK_START.md" && ((doc_files++))
[ -f "PIPELINES.md" ] && echo "✅ PIPELINES.md" && ((doc_files++))
[ -f "DEPLOYMENT.md" ] && echo "✅ DEPLOYMENT.md" && ((doc_files++))
[ -f "ARCHITECTURE.md" ] && echo "✅ ARCHITECTURE.md" && ((doc_files++))
[ -f "PIPELINES_SUMMARY.txt" ] && echo "✅ PIPELINES_SUMMARY.txt" && ((doc_files++))

# API files
if [ -f "app/api/health/route.ts" ]; then
  echo "✅ app/api/health/route.ts"
  ((files_count++))
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 Total de arquivos criados: $(($files_count + $root_files + $doc_files))"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🎯 Próximo passo: Leia QUICK_START.md"
echo "⏱️  Tempo de setup: ~15 minutos"
echo ""
