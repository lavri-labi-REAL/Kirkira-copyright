"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { documents } from "../../lib/api";
import { Upload, CheckCircle, Trash2, FileText, Loader } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  applicationId: string;
  document: {
    id: string;
    label: string;
    required: boolean;
    accepted_formats: string[];
    max_size_mb: number;
    description?: string;
    note?: string;
  };
  existingDocs: any[];
}

function mimeFromExt(ext: string): string {
  const map: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aiff: "audio/x-aiff",
    mp4: "video/mp4",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    tiff: "image/tiff",
    zip: "application/zip",
    txt: "text/plain",
    csv: "text/csv",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    json: "application/json",
    svg: "image/svg+xml",
  };
  return map[ext.toLowerCase()] || "*/*";
}

export function DocumentUploader({ applicationId, document: doc, existingDocs }: Props) {
  const existing = existingDocs?.find((d: any) => d.document_id === doc.id);
  const [uploaded, setUploaded] = useState<any>(existing || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const acceptMap = doc.accepted_formats.reduce(
    (acc, ext) => ({ ...acc, [mimeFromExt(ext)]: [`.${ext}`] }),
    {} as Record<string, string[]>
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > doc.max_size_mb * 1024 * 1024) {
        setError(`File exceeds ${doc.max_size_mb}MB limit`);
        return;
      }

      setUploading(true);
      setError("");
      try {
        const result = await documents.upload(
          applicationId,
          doc.id,
          doc.label,
          doc.id.replace(/-/g, "_"),
          file
        );
        setUploaded(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setUploading(false);
      }
    },
    [applicationId, doc]
  );

  const handleRemove = async () => {
    if (!uploaded) return;
    try {
      await documents.delete(applicationId, uploaded.id);
      setUploaded(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptMap,
    multiple: false,
    disabled: !!uploaded || uploading,
  });

  return (
    <div className={clsx(
      "border rounded-xl p-4 transition-colors",
      uploaded ? "border-green-200 bg-green-50/30" : "border-gray-200"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            {uploaded ? (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <FileText className={`w-4 h-4 flex-shrink-0 ${doc.required ? "text-[#1A237E]" : "text-gray-400"}`} />
            )}
            <span className="text-sm font-medium text-gray-900">{doc.label}</span>
            {!doc.required && (
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Optional</span>
            )}
          </div>
          {doc.description && (
            <p className="text-xs text-gray-500 ml-6">{doc.description}</p>
          )}
          {doc.note && (
            <p className="text-xs text-amber-600 ml-6 mt-0.5">{doc.note}</p>
          )}
          <p className="text-xs text-gray-400 ml-6 mt-0.5">
            {doc.accepted_formats.join(", ")} · Max {doc.max_size_mb}MB
          </p>
        </div>

        {uploaded ? (
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {uploaded ? (
        <div className="mt-3 flex items-center gap-2 bg-white border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-700 truncate">{uploaded.file_name}</span>
          <span className="text-xs text-gray-400 ml-auto">
            {(uploaded.size_bytes / 1024).toFixed(0)}KB
          </span>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={clsx(
            "mt-3 border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-[#1A237E] bg-[#E8EAF6]"
              : "border-gray-200 hover:border-[#1A237E]/50 hover:bg-gray-50",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-6 h-6 text-[#1A237E] animate-spin" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">
                {isDragActive ? "Drop file here" : "Drag & drop or click to upload"}
              </span>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
