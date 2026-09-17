/**
 * Utilitário de compressão de imagens via Canvas no navegador
 * Converte imagens para WebP, redimensiona para tamanho de perfil e thumbnail
 */

/**
 * Carrega um arquivo de imagem como elemento HTMLImageElement
 * @param {File|Blob} file 
 * @returns {Promise<HTMLImageElement>}
 */
function carregarImagem(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Erro ao carregar a imagem.'));
    };
    img.src = url;
  });
}

/**
 * Redimensiona e comprime uma imagem para WebP
 * @param {HTMLImageElement} img 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @param {number} quality 
 * @returns {Promise<Blob>}
 */
function redimensionarEComprimir(img, maxWidth, maxHeight, quality = 0.85) {
  return new Promise((resolve, reject) => {
    let width = img.width;
    let height = img.height;

    // Manter proporção
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fundo branco caso haja transparência
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Erro na conversão para WebP.'));
        }
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Processa uma imagem selecionada pelo usuário:
 * Gera versão otimizada de perfil (800x1000, WebP) e thumbnail (300x400, WebP)
 * @param {File} file 
 * @returns {Promise<{ perfilBlob: Blob, thumbBlob: Blob, perfilUrl: string, thumbUrl: string, originalName: string }>}
 */
export async function processarFotoAluno(file) {
  const img = await carregarImagem(file);

  // 1. Perfil: max 800x1000, qualidade 82% (~100-200KB)
  const perfilBlob = await redimensionarEComprimir(img, 800, 1000, 0.82);

  // 2. Thumbnail: max 300x400, qualidade 75% (~20-45KB)
  const thumbBlob = await redimensionarEComprimir(img, 300, 400, 0.75);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const timestamp = Date.now();

  const perfilFile = new File([perfilBlob], `${baseName}_${timestamp}.webp`, { type: 'image/webp' });
  const thumbFile = new File([thumbBlob], `${baseName}_${timestamp}_thumb.webp`, { type: 'image/webp' });

  return {
    perfilBlob,
    thumbBlob,
    perfilFile,
    thumbFile,
    perfilPreviewUrl: URL.createObjectURL(perfilBlob),
    thumbPreviewUrl: URL.createObjectURL(thumbBlob),
    originalName: file.name
  };
}
