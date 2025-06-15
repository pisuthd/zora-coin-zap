import React, { useState } from 'react';
import { X, Brain, Shield } from 'lucide-react';
import { AISettings } from '@/lib/ai/claude-service';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export function AISettingsModal({ isOpen, onClose, settings, onSave }: AISettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
           
            <h2 className="text-xl font-bold">AI Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Recommendations Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Enable AI Analysis</span>
              <button
                onClick={() => setLocalSettings({
                  ...localSettings,
                  aiRecommendationsEnabled: !localSettings.aiRecommendationsEnabled
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.aiRecommendationsEnabled ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.aiRecommendationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Get AI-powered recommendations and risk analysis
            </p>
          </div>

          {localSettings.aiRecommendationsEnabled && (
            <>
              {/* Risk Tolerance */}
              <div className="space-y-3">
                <label className="  font-medium flex items-center space-x-2">
                  <Shield size={16} className="text-gray-600" />
                  <span>Risk Tolerance</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((risk) => (
                    <button
                      key={risk}
                      onClick={() => setLocalSettings({ ...localSettings, riskTolerance: risk })}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        localSettings.riskTolerance === risk
                          ? 'bg-purple-100 border-purple-500 text-purple-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
