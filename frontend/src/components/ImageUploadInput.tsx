import { useRef, useState } from 'react';
import { uploadService, type UploadTipo } from '@/services/uploadService';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  tipo: UploadTipo;
  urlLabel?: string;
}

export function ImageUploadInput({
  label,
  value,
  onChange,
  tipo,
  urlLabel = 'URL DA IMAGEM',
}: ImageUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadService.enviarImagem(file, tipo);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="md:col-span-2 space-y-3">
      <label className="text-sm font-medium text-gray-600">{label}</label>

      {value && (
        <img
          src={value}
          alt="Pre-visualizacao"
          className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-200"
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
        />
        {uploading && <span className="text-sm text-gray-500">A enviar...</span>}
      </div>

      <div>
        <label className="text-xs text-gray-500">{urlLabel} (ou cole um link externo)</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ou /uploads/..."
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
    </div>
  );
}
