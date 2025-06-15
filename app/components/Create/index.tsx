"use client";

import { useCallback, useState, useEffect } from "react";
import { uploadImageToPinata, uploadJsonToPinata } from "@/lib/pinata";
import { useAccount, useSimulateContract, useWriteContract } from 'wagmi'
import { createCoinCall } from "@zoralabs/coins-sdk"
// import { AICoinCreator } from "../AI/AICoinCreator"; 
import { Info, X } from "lucide-react"

type CreatePageProps = {
  setActiveTab: (tab: string) => void;
};

type MetadataProperty = {
  key: string;
  value: string;
};

export function CreatePage({ setActiveTab }: CreatePageProps) {

  const account = useAccount()
  const address = account?.address

  // Basic info
  const [title, setTitle] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coinParams, setCoinParams] = useState<any>(null) 
  const [showInfo, setShowInfo] = useState<boolean>(false)

  // Additional properties
  const [properties, setProperties] = useState<MetadataProperty[]>([
    { key: "category", value: "social" }
  ]);

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<0 | 1 | 2>(1); // Added step 0 for AI suggestions
  const [error, setError] = useState<string | null>(null);
  const [showAI, setShowAI] = useState<boolean>(false);
  // const [success, setSuccess] = useState<boolean>(false);

  console.log("coinParams: ", coinParams)

  const { data } = useSimulateContract({
    ...coinParams
  });

  console.log("simulate data:", data)

  const { status, writeContract } = useWriteContract()

  const success = status === "success"

  useEffect(() => {
    if (status && status === "success") {
      // Redirect to portfolio after success
      setTimeout(() => {
        setActiveTab("mycoins");
      }, 2000);
    }
  }, [status])

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

  const handleAddProperty = () => {
    setProperties([...properties, { key: "", value: "" }]);
  };

  const handlePropertyChange = (index: number, field: "key" | "value", value: string) => {
    const updatedProperties = [...properties];
    updatedProperties[index][field] = value;
    setProperties(updatedProperties);
  };

  const handleRemoveProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    if (!title || !symbol || !file) {
      setError("Please provide a title, symbol, and upload an image");
      return;
    }

    // Validate symbol (typically 3-4 uppercase letters)
    if (!/^[A-Z0-9]{1,10}$/.test(symbol)) {
      setError("Symbol should be 1-10 uppercase letters or numbers");
      return;
    }

    setError(null);
    setStep(2);
  };

  // const handleAISuggestionSelect = (suggestion: any) => {
  //   setTitle(suggestion.name);
  //   setSymbol(suggestion.symbol);
  //   setDescription(suggestion.description);
  //   setProperties([
  //     { key: "category", value: suggestion.category },
  //     { key: "trendScore", value: suggestion.trendScore.toString() },
  //     { key: "marketOpportunity", value: suggestion.marketOpportunity.toString() },
  //     ...suggestion.keyFeatures.map((feature: string, index: number) => ({
  //       key: `feature_${index + 1}`,
  //       value: feature
  //     }))
  //   ]);
  //   setStep(1); // Go to manual creation step with pre-filled data
  // };

  // const handleSkipAI = () => {
  //   setStep(1);
  //   setShowAI(false);
  // };

  const onCreate = useCallback(async () => {

    if (!address) {
      return
    }

    setLoading(true);
    setError(null);

    if (!file) {
      setError("No image file provided");
      return
    }

    try {

      const imageHash = await uploadImageToPinata(file)
      const jsonHash = await uploadJsonToPinata(
        title,
        description,
        imageHash,
        properties.reduce((obj, prop) => {
          if (prop.key && prop.value) {
            obj[prop.key] = prop.value;
          }
          return obj;
        }, {} as Record<string, string>)
      );

      // const imageUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${imageHash}`;
      const uri = `ipfs://${jsonHash}`;

      // Create configuration for wagmi
      const contractCallParams = await createCoinCall({
        name: title,
        symbol: symbol,
        uri,
        payoutRecipient: address,
      });

      setCoinParams(contractCallParams)

    } catch (err: any) {
      setError("Failed to create content coin. Please try again.");
    } finally {
      setLoading(false);
    }

  }, [title, symbol, description, file, properties, address])

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
        <div className="text-sm text-gray-500">Redirecting to portfolio page...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className=" z-10 bg-white border-b px-4 py-3 flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                className="flex items-center text-gray-600"
                onClick={() => {
                  if (step === 1) {
                    if (showAI) setStep(0);
                    else setActiveTab("discover");
                  } else {
                    setStep(1);
                  }
                }}
              >
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {step === 1 ? (showAI ? "Back to AI" : "Back") : "Previous Step"}
              </button>)}
            {/* {step === 0 && (<h1 className="text-xl font-bold">AI Coin Creator</h1>)} */}
            {step === 1 && (<h1 className="text-xl font-bold">Create Content Coin</h1>)}

          </div>
          <div className="flex items-center space-x-2">

            <button
              onClick={() => setShowInfo(true)}
              className="p-2 rounded-full bg-gray-100 text-gray-600"
            >
              <Info size={16} />
            </button>
          </div>

        </div>

      </div>

      <div className="flex-1 overflow-auto p-4 pb-20">
        {/* {step === 0 && (
          <div className="space-y-4">
            <AICoinCreator onSuggestionSelect={handleAISuggestionSelect} />
            
            <div className="text-center pt-6">
              <button
                onClick={handleSkipAI}
                className="text-gray-600 hover:text-gray-800 text-sm flex items-center justify-center mx-auto"
              >
                Skip AI suggestions and create manually
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )} */}

        {step > 0 && (
          <>
            {/* Step indicator */}
            <div className="flex items-center mb-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                }`}>
                {step === 1 ? '1' : '✓'}
              </div>
              <div className={`flex-1 h-1 mx-2 ${step === 1 ? 'bg-gray-300' : 'bg-green-500'
                }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
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
                {/* Basic coin information */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coin Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Horse"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., HORSE"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  />
                  <p className="mt-1 text-xs text-gray-500">1-10 uppercase letters or numbers</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Boundless energy"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* File upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image *
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
                        Click to upload image
                      </p>
                    </div>
                  )}

                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
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
                {/* Metadata properties */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium">Metadata Properties</h2>
                    <button
                      type="button"
                      className="text-blue-500 text-sm flex items-center"
                      onClick={handleAddProperty}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Property
                    </button>
                  </div>

                  <div className="space-y-3">
                    {properties.map((property, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Key"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={property.key}
                          onChange={(e) => handlePropertyChange(index, "key", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={property.value}
                          onChange={(e) => handlePropertyChange(index, "value", e.target.value)}
                        />
                        {/* Don't allow removing the first property (category) */}
                        {index > 0 && (
                          <button
                            type="button"
                            className="p-2 text-red-500 rounded-md hover:bg-red-50"
                            onClick={() => handleRemoveProperty(index)}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

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
                    <span className="text-gray-700">Symbol</span>
                    <span className="text-gray-900 font-medium">{symbol}</span>
                  </div>
                </div>

                {/* Metadata preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-medium">Metadata Preview</h2>
                    <span className="text-xs text-gray-500">Generated JSON</span>
                  </div>

                  <div className="bg-gray-900 text-green-400 p-3 rounded-md text-xs font-mono overflow-x-auto">
                    {JSON.stringify({
                      name: title,
                      description: description,
                      image: "ipfs://bafkreif...",
                      properties: properties.reduce((obj, prop) => {
                        if (prop.key && prop.value) {
                          obj[prop.key] = prop.value;
                        }
                        return obj;
                      }, {} as Record<string, string>)
                    }, null, 2)}
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-6">
                  <h2 className="font-medium mb-2">Coin Preview</h2>
                  <div className="border rounded-lg overflow-hidden">
                    {preview && (
                      <img
                        src={preview}
                        alt="Content preview"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{title || "Coin Name"}</h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{symbol || "SYM"}</span>
                      </div>
                      {description && (
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {!address && (
                  <button className="w-full py-3 rounded-lg font-medium cursor-default bg-gray-300 text-gray-500">
                    Wallet Not Connected
                  </button>
                )}

                {(address && !coinParams) && (
                  <button
                    className={`w-full py-3 rounded-lg font-medium ${loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    onClick={onCreate}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Preparing...
                      </span>
                    ) : (
                      "Save"
                    )}
                  </button>
                )}
                {(address && coinParams) && (
                  <button
                    className={`w-full py-3 rounded-lg font-medium ${status === "pending"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    onClick={() => writeContract(data!.request)}
                    disabled={status === "pending"}
                  >
                    {status === "pending" ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                )}

              </>
            )}
          </>
        )}
      </div>


      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">How it works</h3>
                <button onClick={() => setShowInfo(false)}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="  bg-blue-50 border border-blue-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 px-2">
                  <div className="text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>We allow users to easily create content coins on Base using Zora’s Coins Protocol, which automatically mints 1 billion tokens into circulation</li>
                      <li>You receive 1% (10 million tokens), and the rest is paired with ETH and listed on Uniswap V3</li>
                      <li>You earn fees every time your coin is traded</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowInfo(false)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}