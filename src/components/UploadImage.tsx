import React from "react";
// Uncomment one of the following import options:
import { Image } from "@nextui-org/react";
import { LiaTimesSolid } from "react-icons/lia";

function UploadImage({
  file,
  setFile,
}: {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    // Add more supported types as needed
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert(
        "Invalid file type. Only images, videos, audios, and PDFs are allowed."
      );
    }
  };

  return (
    <>
      <div className="flex justify-center w-full flex-col space-y-3 font-bold">
        {file ? (
          <div className="w-full h-48 border-2 border-gray-300 border-dashed rounded-lg relative">
            <Image
              src={URL.createObjectURL(file)}
              className="w-full h-full"
              classNames={{ img: "object-cover" }}
              removeWrapper
            />
            <button
              className="absolute top-3 right-3 z-10 rounded-full border-2 p-1 bg-black/10 hover:bg-black/30"
              type="button"
              onClick={() => {
                setFile(null);
              }}
            >
              <LiaTimesSolid className="text-white font-semibold" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <h1 className="text-sm dark:text-gray-400 mb-2">
                Project's Image
              </h1>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              required
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </>
  );
}

export default UploadImage;
