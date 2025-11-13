import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';

interface FileUploaderProps {
  id: string;
  label: string;
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  initialFiles?: File[];
}

const FileUploader: React.FC<FileUploaderProps> = ({ id, label, onFilesChange, maxFiles = 4, initialFiles = [] }) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setFiles(initialFiles);

    const generatePreviews = async (filesToPreview: File[]) => {
        const previewPromises = filesToPreview.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
        try {
            const generatedPreviews = await Promise.all(previewPromises);
            setPreviews(generatedPreviews);
        } catch (err) {
            console.error("Error generating file previews:", err);
            setError("Erro ao gerar pré-visualização de um arquivo.");
        }
    };
    
    generatePreviews(initialFiles);

  }, [initialFiles]);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selectedFiles = Array.from(event.target.files || []);

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Você pode carregar no máximo ${maxFiles} arquivos.`);
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles);

    selectedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [files, maxFiles, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  }, [files, previews, onFilesChange]);

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 hover:border-cyan-500 transition-colors">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-slate-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12A2.25 2.25 0 0120.25 20.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
          </svg>
          <div className="mt-4 flex text-sm leading-6 text-slate-600">
            <label htmlFor={id} className="relative cursor-pointer rounded-md font-semibold text-cyan-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 focus-within:ring-offset-white hover:text-cyan-500">
              <span>Carregar arquivos</span>
              <input id={id} name={id} type="file" className="sr-only" multiple accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} disabled={files.length >= maxFiles} />
            </label>
            <p className="pl-1">ou arraste e solte</p>
          </div>
          <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF até 10MB</p>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img src={preview} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
              <button type="button" onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-red-600/70 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;