"use client";

import { useState } from "react";

type CreatePageProps = {
  setActiveTab: (tab: string) => void;
};

export function CreatePage({ setActiveTab }: CreatePageProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleNextStep = () => {
    if (!title || !file) {
      setError("Please provide both a title and upload an image");
      return;
    }
    
    setError(null);
    setStep(2);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock creation process - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Redirect to discover after showing success message
      setTimeout(() => {
        setActiveTab("discover");
      }, 3000);
    } catch (err) {
      setError("Failed to create content coin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Coin Created!</h2>
        <p className="text-gray-600 mb-4">Your content coin has been created successfully.</p>
        <div className="text-sm text-gray-500">Redirecting to discover page...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <button
          className="flex items-center text-gray-600"
          onClick={() => step === 1 ? setActiveTab("discover") : setStep(1)}
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {step === 1 ? "Back" : "Previous Step"}
        </button>
      </div>

      <h1 className="text-xl font-bold mb-4">Create Content Coin</h1>
      
      {/* Step indicator */}
      <div className="flex items-center mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step === 1 ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {step === 1 ? '1' : '✓'}
        </div>
        <div className={`flex-1 h-1 mx-2 ${
          step === 1 ? 'bg-gray-300' : 'bg-green-500'
        }`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          2
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {step === 1 && (
        <>
          {/* Basic information */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Give your content a name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your content"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* File upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Content *
            </label>
            
            {preview ? (
              <div className="relative mb-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-1 text-sm text-gray-600">
                  Click to upload image, video, or audio
                </p>
              </div>
            )}
            
            <input
              id="file-upload"
              type="file"
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            onClick={handleNextStep}
          >
            Next Step
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {/* Coin settings */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-medium mb-4">Coin Settings</h2>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Initial supply</span>
              <span className="text-gray-900 font-medium">1,000,000,000 coins</span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Creator allocation</span>
              <span className="text-gray-900 font-medium">10,000,000 coins (1%)</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Gas fee (estimated)</span>
              <span className="text-gray-900 font-medium">~0.0005 ETH</span>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <h2 className="font-medium mb-2">Preview</h2>
            <div className="border rounded-lg overflow-hidden">
              {preview && (
                <img
                  src={preview}
                  alt="Content preview"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-3">
                <h3 className="font-medium">{title}</h3>
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>
            </div>
          </div>

          <button
            className={`w-full py-3 rounded-lg font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Coin...
              </span>
            ) : (
              "Create Content Coin"
            )}
          </button>
        </>
      )}
    </div>
  );
}