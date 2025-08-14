# Image Metadata Remover

Aplicativo web estático que remove metadados (EXIF/GPS/XMP/ICC) de imagens regravando-as via `<canvas>`. Todo o processamento ocorre localmente no navegador.

## Como usar
1. Faça upload de uma imagem usando o botão "Upload padrão" ou arraste/solte/cole (Ctrl/Cmd+V) a imagem na página.
2. Opcionalmente, utilize o botão "iPhone/iPad (força JPEG)" para evitar arquivos HEIC.
3. Escolha o formato de saída (manter formato, JPEG, PNG ou WebP) e ajuste a qualidade para JPEG/WebP.
4. Clique em "Processar (remover metadados)" para gerar a versão sem metadados.
5. Faça o download do arquivo limpo com sufixo `-sem-metadados`.

## Compatibilidade iOS
Para evitar o formato HEIC, utilize o botão "iPhone/iPad (força JPEG)" com `capture="environment"` que força a câmera a salvar em JPEG.

## Limitações
- GIF animado será convertido em imagem estática.
- Suporte limitado para HEIC/HEIF/TIFF. Utilize o botão iPhone/iPad ou converta antes.

## Publicação
1. Crie o repositório `<REPO_NAME>` no GitHub.
2. Execute:
   ```bash
   git init
   git add .
   git commit -m "feat: app remove metadados (client-side)"
   git branch -M main
   git remote add origin https://github.com/<user>/<REPO_NAME>.git
   git push -u origin main
   ```
3. A action `pages.yml` publicará automaticamente em **Settings → Pages** (Build and deployment: "GitHub Actions").
4. O app estará disponível em `https://<seu-usuario>.github.io/<REPO_NAME>/`.

Texto de privacidade: processamento offline; sem upload.
