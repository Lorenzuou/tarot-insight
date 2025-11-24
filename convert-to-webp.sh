#!/bin/bash
# Converter imagens PNG para WebP

cd public/cards

# Verificar se cwebp está instalado
if ! command -v cwebp &> /dev/null; then
    echo "Instalando webp..."
    sudo apt-get update && sudo apt-get install -y webp
fi

# Converter todos os PNGs para WebP
for file in *.png; do
    if [ -f "$file" ]; then
        filename="${file%.png}"
        echo "Convertendo $file para $filename.webp..."
        cwebp -q 85 "$file" -o "$filename.webp"
    fi
done

echo "Conversão concluída!"
