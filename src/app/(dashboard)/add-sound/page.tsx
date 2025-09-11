"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import DashboardHeader from "../components/dashboard-header";
import {
  useGetAllAudiosQuery,
  useCreateAudioMutation,
  useDeleteAudioMutation,
  useUpdateAudioMutation,
} from "@/store/api/audioApi";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

// TypeScript interfaces
interface AudioFile {
  id: string;
  file: File | null;
  name: string;
  duration: number;
  size: number;
  url: string;
  uploadedAt: Date;
}

interface AudioPlayerProps {
  audioFile: AudioFile;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newName: string) => void;
}

interface ApiError {
  status: number;
  data: {
    success: boolean;
    message: string;
    error?: unknown;
  };
}

// Audio Player Component
const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioFile,
  onDelete,
  onUpdate,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(audioFile.duration);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(audioFile.name);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setCurrentTime(0);
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [audioFile.url]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, []);

  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== audioFile.name) {
      onUpdate(audioFile.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(audioFile.name);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <audio
        ref={audioRef}
        src={audioFile.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnd}
        preload="metadata"
      />

      {/* File Info Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-900 truncate">
                {audioFile.name}
              </h3>
              <p className="text-sm text-gray-500">
                {formatTime(duration)} • {(audioFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Edit name"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(audioFile.id)}
            className="p-1 text-red-400 hover:text-red-600 rounded"
            title="Delete audio"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, #e5e7eb ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// File Upload Component
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isUploading,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFileSelect]
  );

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file.");
      return;
    }

    // Create audio element to check duration
    const audio = document.createElement("audio");
    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      window.URL.revokeObjectURL(audio.src);
      if (audio.duration > 60) {
        toast.error("Audio duration must not exceed 1 minute.");
        return;
      }
      onFileSelect(file);
    };

    audio.onerror = () => {
      window.URL.revokeObjectURL(audio.src);
      toast.error("Invalid audio file.");
    };

    audio.src = URL.createObjectURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />

      <div className="space-y-4">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <div>
          <p className="text-lg font-medium text-gray-900">
            {isUploading ? "Uploading..." : "Drop your audio file here"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse (max 1 minute duration)
          </p>
        </div>

        <div className="text-xs text-gray-400">
          Supported formats: MP3, WAV, OGG, M4A
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function AudioPage() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data: audiosResponse, refetch } = useGetAllAudiosQuery({});
  const [createAudio] = useCreateAudioMutation();
  const [deleteAudio] = useDeleteAudioMutation();
  const [updateAudio] = useUpdateAudioMutation();


  const audioFile = audiosResponse?.data?.[0]
    ? {
        id: audiosResponse.data[0]._id, 
        file: null,
        name: audiosResponse.data[0].title || "Audio File",
        duration: 0,
        size: audiosResponse.data[0].fileSize || 0,
        url: getImageUrl(audiosResponse.data[0].audioFile),
        uploadedAt: new Date(audiosResponse.data[0].createdAt),
      }
    : null;


  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError("");

      try {
        // Get audio duration first
        const audio = document.createElement("audio");
        audio.preload = "metadata";

        const duration = await new Promise<number>((resolve, reject) => {
          audio.onloadedmetadata = () => {
            window.URL.revokeObjectURL(audio.src);
            resolve(audio.duration);
          };
          audio.onerror = () => {
            window.URL.revokeObjectURL(audio.src);
            reject(new Error("Invalid audio file"));
          };
          audio.src = URL.createObjectURL(file);
        });

        const formData = new FormData();
        formData.append("audioFile", file);
        formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
        formData.append("fileSize", file.size.toString()); 
        formData.append("duration", duration.toString()); 
        formData.append("status", "active");

        const result = await createAudio(formData).unwrap();

        if (result.success) {
          toast.success("Audio uploaded successfully");
          refetch();
        }
      } catch (error) {
        let errorMessage = "Failed to upload audio file. Please try again.";

        if (error && typeof error === "object") {
          const apiError = error as ApiError;
          if (apiError.data?.message) {
            errorMessage = apiError.data.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error uploading audio file:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [createAudio, refetch]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        toast.error("Invalid audio ID");
        return;
      }

      deleteAudio(id)
        .unwrap()
        .then(() => {
          toast.success("Audio deleted successfully");
          refetch();
        })
        .catch((error: unknown) => {
          let errorMessage = "Failed to delete audio";

          if (error && typeof error === "object") {
            const apiError = error as ApiError;
            if (apiError.data?.message) {
              errorMessage = apiError.data.message;
            }
          }

          toast.error(errorMessage);
          console.error("Error deleting audio:", error);
        });
    },
    [deleteAudio, refetch]
  );

  const handleUpdate = useCallback(
    (id: string, newName: string) => {
      if (!id) {
        toast.error("Invalid audio ID");
        return;
      }

      const formData = new FormData();
      formData.append("title", newName);

      updateAudio({ id, data: formData })
        .unwrap()
        .then(() => {
          toast.success("Audio updated successfully");
          refetch();
        })
        .catch((error: unknown) => {
          let errorMessage = "Failed to update audio";

          if (error && typeof error === "object") {
            const apiError = error as ApiError;
            if (apiError.data?.message) {
              errorMessage = apiError.data.message;
            }
          }

          toast.error(errorMessage);
          console.error("Error updating audio:", error);
        });
    },
    [updateAudio, refetch]
  );

  return (
    <div>
      <DashboardHeader title="Add a sound for your app" />
      <div className="p-2 md:p-6 border border-primary/30 rounded-2xl">
        <div className="max-w-2xl mx-auto space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!audioFile && (
            <FileUpload
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
            />
          )}

          {audioFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Audio File
                </h3>
                <span className="text-sm text-gray-500">
                  Uploaded {audioFile.uploadedAt.toLocaleString()}
                </span>
              </div>

              <AudioPlayer
                audioFile={audioFile}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
