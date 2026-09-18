import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, Sparkles } from 'lucide-react';

export function CameraCaptureModal({ isOpen, onClose, onCapture }) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' ou 'environment'
  const [isStarting, setIsStarting] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Parar trilhas da câmera
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Iniciar a câmera
  const startCamera = useCallback(async () => {
    stopStream();
    setError(null);
    setIsStarting(true);
    setCapturedImage(null);
    setCapturedBlob(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Acesso à câmera não suportado neste navegador.');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Permissão de acesso à câmera negada. Por favor, permita o acesso nas configurações do seu navegador.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('Nenhuma câmera encontrada no seu dispositivo.');
      } else {
        setError('Não foi possível iniciar a câmera: ' + (err.message || 'Erro desconhecido.'));
      }
    } finally {
      setIsStarting(false);
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  // Alternar entre câmera frontal e traseira
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Capturar foto do vídeo
  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Se estiver usando câmera frontal, espelha a imagem para ficar natural
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          setCapturedImage(previewUrl);
          setCapturedBlob(blob);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  // Tirar outra foto
  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  };

  // Confirmar e salvar a foto capturada
  const handleConfirm = () => {
    if (!capturedBlob) return;

    // Converte o blob em um arquivo do tipo File
    const filename = `foto_camera_${Date.now()}.jpg`;
    const file = new File([capturedBlob], filename, { type: 'image/jpeg' });

    onCapture(file);
    handleClose();
  };

  const handleClose = () => {
    stopStream();
    setCapturedImage(null);
    setCapturedBlob(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '1.5rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-2xl)'
        }}
      >
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--senai-blue-50)',
              color: 'var(--senai-blue-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--senai-blue-900)', margin: 0 }}>
                Capturar Foto do Aluno
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Posicione o aluno no centro para melhor enquadramento
              </p>
            </div>
          </div>

          <button onClick={handleClose} className="btn-icon btn-ghost" title="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Mensagem de Erro de Permissão */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Erro na Câmera:</strong>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem' }}>{error}</p>
              <button
                type="button"
                onClick={startCamera}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Área da Câmera / Prévia */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          backgroundColor: '#0f172a',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isStarting && !error && (
            <div style={{ color: '#ffffff', textAlign: 'center', fontSize: '0.875rem' }}>
              <RefreshCw size={28} className="spin" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
              <p>Iniciando câmera...</p>
            </div>
          )}

          {/* Vídeo ao vivo */}
          {!capturedImage && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                display: isStarting || error ? 'none' : 'block'
              }}
            />
          )}

          {/* Foto capturada (congelada) */}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Foto Capturada"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}

          {/* Guia oval para enquadramento facial (Carômetro) */}
          {!capturedImage && !error && !isStarting && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '55%',
              height: '75%',
              border: '2px dashed rgba(255, 255, 255, 0.65)',
              borderRadius: '50%',
              pointerEvents: 'none',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.25)'
            }}>
              <span style={{
                position: 'absolute',
                bottom: '-28px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 600,
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap'
              }}>
                Rosto do Aluno
              </span>
            </div>
          )}

          {/* Botão de Trocar Câmera (Frontal / Traseira) */}
          {!capturedImage && !error && !isStarting && (
            <button
              type="button"
              onClick={handleToggleFacingMode}
              className="btn btn-secondary btn-sm"
              title="Trocar Câmera"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                color: '#ffffff',
                border: 'none',
                backdropFilter: 'blur(4px)',
                padding: '0.375rem 0.625rem',
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <RefreshCw size={13} />
              <span>{facingMode === 'user' ? 'Câmera Traseira' : 'Câmera Frontal'}</span>
            </button>
          )}

          {/* Canvas oculto para capturar os frames em alta resolução */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Controles da Câmera */}
        <div style={{
          marginTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {!capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
                style={{ flex: '1 1 auto' }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleTakePhoto}
                disabled={Boolean(error) || isStarting}
                className="btn btn-primary"
                style={{
                  flex: '2 1 auto',
                  height: '46px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9375rem'
                }}
              >
                <Camera size={18} />
                <span>Capturar Foto</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="btn btn-secondary"
                style={{ flex: '1 1 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
              >
                <RefreshCw size={16} />
                <span>Tirar Outra</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="btn btn-primary"
                style={{
                  flex: '2 1 auto',
                  height: '46px',
                  backgroundColor: 'var(--senai-green-600)',
                  borderColor: 'var(--senai-green-600)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9375rem'
                }}
              >
                <Check size={18} />
                <span>Usar Esta Foto</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
