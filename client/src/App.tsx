import React, { useState } from "react";
import { Upload, FileText, ShoppingCart, CreditCard, Eye, Loader2 } from "lucide-react";
import { uploadReceipt, processOcrUrl } from "./api";
import { ReceiptResult, OcrResult } from "./types";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [userId, setUserId] = useState("testuser");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReceiptResult | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "results">("upload");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      alert("Please select a file and enter user ID");
      return;
    }

    setLoading(true);
    console.log("🚀 Starting upload...", { fileName: selectedFile.name, userId });

    try {
      // Test with a simple fetch first
      console.log("🧪 Testing simple fetch...");
      const testResponse = await fetch("http://localhost:5000/api/health");
      const testData = await testResponse.json();
      console.log("🧪 Test fetch result:", testData);

      console.log("📡 Making API call to upload receipt...");
      const result = await uploadReceipt(selectedFile, userId);
      console.log("✅ Upload successful!", result);
      setResult(result);
      setActiveTab("results");
    } catch (error: any) {
      console.error("❌ Upload error:", error);

      if (error.message.includes("timed out")) {
        alert(
          "Upload is taking longer than expected. The receipt is being processed in the background. Please check your receipt history in a few moments."
        );
      } else {
        alert(`Upload failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOcrUrl = async () => {
    if (!imageUrl || !userId) {
      alert("Please enter image URL and user ID");
      return;
    }

    setLoading(true);
    try {
      const result = await processOcrUrl(imageUrl, userId);
      setOcrResult(result);
      setActiveTab("results");
    } catch (error) {
      console.error("OCR error:", error);
      alert("OCR processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Tesseract OCR</h1>
            <p className="text-gray-600">Upload receipt images and test OCR processing with product matching</p>
          </div>

          {/* User ID Input */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Test User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter user ID"
            />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "upload"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Upload className="inline-block w-4 h-4 mr-2" />
                  Upload File
                </button>
                <button
                  onClick={() => setActiveTab("url")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "url"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Eye className="inline-block w-4 h-4 mr-2" />
                  Image URL
                </button>
                <button
                  onClick={() => setActiveTab("results")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "results"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  Results
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Upload Tab */}
              {activeTab === "upload" && (
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">Upload a receipt image</span>
                        <span className="mt-1 block text-sm text-gray-500">PNG, JPG, JPEG, or WebP up to 10MB</span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </div>
                    {selectedFile && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || loading}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                          Processing OCR (this may take up to 2 minutes)...
                        </>
                      ) : (
                        "Upload & Process"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* URL Tab */}
              {activeTab === "url" && (
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://example.com/receipt.jpg"
                      />
                    </div>
                    <button
                      onClick={handleOcrUrl}
                      disabled={!imageUrl || loading}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                          Processing...
                        </>
                      ) : (
                        "Process OCR"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Results Tab */}
              {activeTab === "results" && (
                <div>
                  {result && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Upload Successful!</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-green-700">Store:</span>
                            <p className="text-green-600">{result.receipt.store.name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Total Amount:</span>
                            <p className="text-green-600">₱{result.receipt.totalAmount}</p>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Points Earned:</span>
                            <p className="text-green-600">{result.points.earned}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">OCR Results</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Confidence:</span> {result.ocr.confidence}%
                          </div>
                          <div>
                            <span className="font-medium">Processing Time:</span> {result.ocr.processingTime}ms
                          </div>
                          <div>
                            <span className="font-medium">Total Items Detected:</span> {result.ocr.items.length}
                          </div>
                          <div>
                            <span className="font-medium">✅ Fully Matched:</span>{" "}
                            {result.ocr.items.filter((item: any) => item.matched).length}
                          </div>
                          <div>
                            <span className="font-medium">🎯 Pattern Only:</span>{" "}
                            {
                              result.ocr.items.filter(
                                (item: any) => !item.matched && item.specificProduct && item.specificProduct.matched
                              ).length
                            }
                          </div>
                          <div>
                            <span className="font-medium">❌ No Match:</span>{" "}
                            {
                              result.ocr.items.filter(
                                (item: any) => !item.matched && (!item.specificProduct || !item.specificProduct.matched)
                              ).length
                            }
                          </div>
                        </div>
                      </div>

                      {/* All Products with Match Status Indicators */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">📋 All Detected Products</h4>
                        <div className="space-y-3">
                          {result.ocr.items.map((item: any, index: number) => {
                            // Determine the match status and styling
                            let statusColor = "gray";
                            let statusIcon = "❌";
                            let statusText = "No Pattern Match";
                            let statusDescription = "Not in approved product patterns";

                            if (item.matched) {
                              // Full match (pattern + database)
                              statusColor = "green";
                              statusIcon = "✅";
                              statusText = "Fully Matched";
                              statusDescription = "Pattern matched + database verified";
                            } else if (item.specificProduct && item.specificProduct.matched) {
                              // Pattern match only (no database)
                              statusColor = "yellow";
                              statusIcon = "🎯";
                              statusText = "Pattern Matched Only";
                              statusDescription = "Matched pattern but not in database";
                            }

                            const bgColor =
                              statusColor === "green"
                                ? "bg-green-50"
                                : statusColor === "yellow"
                                ? "bg-yellow-50"
                                : "bg-gray-50";
                            const borderColor =
                              statusColor === "green"
                                ? "border-green-200"
                                : statusColor === "yellow"
                                ? "border-yellow-200"
                                : "border-gray-200";
                            const textColor =
                              statusColor === "green"
                                ? "text-green-800"
                                : statusColor === "yellow"
                                ? "text-yellow-800"
                                : "text-gray-600";

                            return (
                              <div
                                key={index}
                                className={`flex justify-between items-center p-3 rounded border ${bgColor} ${borderColor}`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{statusIcon}</span>
                                    <p className={`font-medium ${textColor}`}>{item.name}</p>
                                  </div>
                                  <p
                                    className={`text-sm ${
                                      textColor === "text-green-800"
                                        ? "text-green-600"
                                        : textColor === "text-yellow-800"
                                        ? "text-yellow-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {statusDescription}
                                  </p>
                                  {item.specificProduct && (
                                    <p className="text-sm text-blue-600 mt-1">
                                      🎯 Pattern: {item.specificProduct.name} ({item.specificProduct.pattern})
                                    </p>
                                  )}
                                  {item.matchedProduct && (
                                    <p className="text-sm text-green-600 mt-1">
                                      ✅ Product: {item.matchedProduct.name} ({item.matchedProduct.brand})
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <p className={`font-medium ${textColor}`}>₱{item.totalPrice}</p>
                                  {item.points > 0 && <p className="text-sm text-green-600">+{item.points} pts</p>}
                                  <p
                                    className={`text-xs ${
                                      textColor === "text-green-800"
                                        ? "text-green-600"
                                        : textColor === "text-yellow-800"
                                        ? "text-yellow-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {statusText}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <h5 className="font-medium text-blue-800 mb-2">📊 Match Status Legend</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">✅</span>
                              <span className="text-blue-700">Fully Matched</span>
                              <span className="text-blue-500">(Pattern + Database)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎯</span>
                              <span className="text-blue-700">Pattern Only</span>
                              <span className="text-blue-500">(Pattern matched, no database)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">❌</span>
                              <span className="text-blue-700">No Match</span>
                              <span className="text-blue-500">(Not in approved patterns)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {ocrResult && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">OCR Processing Complete</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-blue-700">Store:</span>
                            <p className="text-blue-600">{ocrResult.store.name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700">Total Amount:</span>
                            <p className="text-blue-600">₱{ocrResult.ocr.totals.total}</p>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700">Potential Points:</span>
                            <p className="text-blue-600">{ocrResult.points.potential}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">OCR Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Confidence:</span> {ocrResult.ocr.confidence}%
                          </div>
                          <div>
                            <span className="font-medium">Processing Time:</span> {ocrResult.ocr.processingTime}ms
                          </div>
                          <div>
                            <span className="font-medium">Total Items Detected:</span> {ocrResult.ocr.items.length}
                          </div>
                          <div>
                            <span className="font-medium">✅ Fully Matched:</span>{" "}
                            {ocrResult.ocr.items.filter((item: any) => item.matched).length}
                          </div>
                          <div>
                            <span className="font-medium">🎯 Pattern Only:</span>{" "}
                            {
                              ocrResult.ocr.items.filter(
                                (item: any) => !item.matched && item.specificProduct && item.specificProduct.matched
                              ).length
                            }
                          </div>
                          <div>
                            <span className="font-medium">❌ No Match:</span>{" "}
                            {
                              ocrResult.ocr.items.filter(
                                (item: any) => !item.matched && (!item.specificProduct || !item.specificProduct.matched)
                              ).length
                            }
                          </div>
                        </div>
                      </div>

                      {/* All Products with Match Status Indicators */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">📋 All Detected Products</h4>
                        <div className="space-y-3">
                          {ocrResult.ocr.items.map((item: any, index: number) => {
                            // Determine the match status and styling
                            let statusColor = "gray";
                            let statusIcon = "❌";
                            let statusText = "No Pattern Match";
                            let statusDescription = "Not in approved product patterns";

                            if (item.matched) {
                              // Full match (pattern + database)
                              statusColor = "green";
                              statusIcon = "✅";
                              statusText = "Fully Matched";
                              statusDescription = "Pattern matched + database verified";
                            } else if (item.specificProduct && item.specificProduct.matched) {
                              // Pattern match only (no database)
                              statusColor = "yellow";
                              statusIcon = "🎯";
                              statusText = "Pattern Matched Only";
                              statusDescription = "Matched pattern but not in database";
                            }

                            const bgColor =
                              statusColor === "green"
                                ? "bg-green-50"
                                : statusColor === "yellow"
                                ? "bg-yellow-50"
                                : "bg-gray-50";
                            const borderColor =
                              statusColor === "green"
                                ? "border-green-200"
                                : statusColor === "yellow"
                                ? "border-yellow-200"
                                : "border-gray-200";
                            const textColor =
                              statusColor === "green"
                                ? "text-green-800"
                                : statusColor === "yellow"
                                ? "text-yellow-800"
                                : "text-gray-600";

                            return (
                              <div
                                key={index}
                                className={`flex justify-between items-center p-3 rounded border ${bgColor} ${borderColor}`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{statusIcon}</span>
                                    <p className={`font-medium ${textColor}`}>{item.name}</p>
                                  </div>
                                  <p
                                    className={`text-sm ${
                                      textColor === "text-green-800"
                                        ? "text-green-600"
                                        : textColor === "text-yellow-800"
                                        ? "text-yellow-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {statusDescription}
                                  </p>
                                  {item.specificProduct && (
                                    <p className="text-sm text-blue-600 mt-1">
                                      🎯 Pattern: {item.specificProduct.name} ({item.specificProduct.pattern})
                                    </p>
                                  )}
                                  {item.matchedProduct && (
                                    <p className="text-sm text-green-600 mt-1">
                                      ✅ Product: {item.matchedProduct.name} ({item.matchedProduct.brand})
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <p className={`font-medium ${textColor}`}>₱{item.totalPrice}</p>
                                  {item.points > 0 && <p className="text-sm text-green-600">+{item.points} pts</p>}
                                  <p
                                    className={`text-xs ${
                                      textColor === "text-green-800"
                                        ? "text-green-600"
                                        : textColor === "text-yellow-800"
                                        ? "text-yellow-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {statusText}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <h5 className="font-medium text-blue-800 mb-2">📊 Match Status Legend</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">✅</span>
                              <span className="text-blue-700">Fully Matched</span>
                              <span className="text-blue-500">(Pattern + Database)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎯</span>
                              <span className="text-blue-700">Pattern Only</span>
                              <span className="text-blue-500">(Pattern matched, no database)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">❌</span>
                              <span className="text-blue-700">No Match</span>
                              <span className="text-blue-500">(Not in approved patterns)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Debug Section - Show Raw OCR Data */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-800 mb-3">🔍 Debug: Raw OCR Data</h4>
                        <div className="space-y-2 text-sm">
                          <div className="mb-3">
                            <span className="font-medium text-yellow-700">Total Items:</span>{" "}
                            {ocrResult.ocr.items.length}
                          </div>
                          {ocrResult.ocr.items.map((item: any, index: number) => (
                            <div key={index} className="p-3 border border-yellow-200 rounded bg-white">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-900">Item {index + 1}:</p>
                                  <p className="text-sm text-gray-600">Name: "{item.name}"</p>
                                  <p className="text-sm text-gray-600">Price: ₱{item.totalPrice}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Match Status:</p>
                                  <p className={`text-sm ${item.matched ? "text-green-600" : "text-red-600"}`}>
                                    Matched: {item.matched ? "✅ YES" : "❌ NO"}
                                  </p>
                                  <p className="text-sm text-gray-600">Points: {item.points}</p>
                                  {item.matchedProduct && (
                                    <p className="text-sm text-green-600">Product: {item.matchedProduct.name}</p>
                                  )}
                                </div>
                              </div>
                              {/* Show full item object for debugging */}
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs text-yellow-600 font-medium">
                                  Show Full Item Data
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                  {JSON.stringify(item, null, 2)}
                                </pre>
                              </details>
                            </div>
                          ))}
                        </div>
                      </div>

                      {ocrResult.ocr.items.filter((item: any) => !item.matched).length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-700 mb-3">
                            🚫 Filtered Out Items (Not in Product Patterns)
                          </h4>
                          <div className="space-y-2">
                            {ocrResult.ocr.items
                              .filter((item: any) => !item.matched)
                              .map((item: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 text-gray-500"
                                >
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-400">Not in approved product patterns</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">₱{item.totalPrice}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-700">
                              💡 These items were detected by OCR but filtered out because they don't match any specific
                              product patterns. Only products listed in the product patterns are returned.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!result && !ocrResult && (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>No results to display. Upload a receipt or process an image URL first.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
