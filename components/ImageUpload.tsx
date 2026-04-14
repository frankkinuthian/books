"use client";

import {
  Image as IKImage,
  ImageKitProvider,
  upload,
  type UploadResponse,
  Video as IKVideo,
} from "@imagekit/next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import NextImage from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { token, expire, signature };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const ImageUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: unknown) => {
    console.log(error);

    toast({
      title: `${type} upload failed`,
      description: `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = (res: UploadResponse) => {
    const nextFilePath = res.filePath ?? null;
    const uploadLabel = type === "video" ? "Video" : "Image";

    setFile({ filePath: nextFilePath });
    onFileChange(nextFilePath ?? "");

    toast({
      title: `${uploadLabel} uploaded successfully`,
      description: `${nextFilePath ?? "File"} uploaded successfully!`,
    });
  };

  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File size too large",
          description: "Please upload a file that is less than 20MB in size",
          variant: "destructive",
        });

        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File size too large",
          description: "Please upload a file that is less than 50MB in size",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!onValidate(selectedFile)) {
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);

      const { token, expire, signature } = await authenticator();

      const response = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        publicKey,
        token,
        expire,
        signature,
        folder,
        useUniqueFileName: true,
        onProgress: (progressEvent) => {
          const total = progressEvent.total ?? selectedFile.size;
          const percent = Math.round((progressEvent.loaded / total) * 100);
          setProgress(percent);
        },
      });

      onSuccess(response);
    } catch (error) {
      onError(error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
        }}
        disabled={isUploading}
      >
        <NextImage
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        {file.filePath && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
      </button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file.filePath &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath}
            src={file.filePath}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            src={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default ImageUpload;
