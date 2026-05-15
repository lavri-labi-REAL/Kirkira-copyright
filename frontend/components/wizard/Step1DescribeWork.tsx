"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { Select } from "../ui/Select";
import { classify } from "../../lib/api";
import { Sparkles, ChevronRight, AlertTriangle } from "lucide-react";
import categoriesData from "../../data/categories.json";

const CATEGORIES = (categoriesData as any).categories;

interface Props {
  application: any;
  onUpdate: (data: any) => Promise<void>;
  onNext: () => void;
}

export function Step1DescribeWork({ application, onUpdate, onNext }: Props) {
  const [description, setDescription] = useState(application.description || "");
  const [categoryId, setCategoryId] = useState(application.category_id || "");
  const [subcategoryId, setSubcategoryId] = useState(application.subcategory_id || "");
  const [classification, setClassification] = useState<any>(null);
  const [classifying, setClassifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = CATEGORIES.find((c: any) => c.id === categoryId);
  const subcategoryOptions = selectedCategory?.subcategories?.map((s: any) => ({
    value: s.id,
    label: s.label,
  })) || [];

  const handleClassify = async () => {
    if (!description.trim()) return;
    setClassifying(true);
    setError("");
    try {
      const result = await classify.work(description);
      setClassification(result);
      if (!result.is_uncertain) {
        setCategoryId(result.category_id);
        setSubcategoryId(result.subcategory_id);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setClassifying(false);
    }
  };

  const handleNext = async () => {
    if (!description || !categoryId || !subcategoryId) {
      setError("Please fill in a description and select category/subcategory.");
      return;
    }
    setSaving(true);
    try {
      await onUpdate({
        description,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        wizard_step: 2,
      });
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Describe Your Work</h2>
        <p className="text-gray-500 text-sm">
          Tell us about your creative work. Our solution will suggest the correct copyright category.
        </p>
      </div>

      {/* Description textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Describe your work <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] resize-none"
          rows={5}
          placeholder="E.g. I wrote a novel about a Nairobi detective navigating corruption, spanning 340 pages, in the literary fiction genre..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-400">{description.length}/2000 characters</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClassify}
            loading={classifying}
            disabled={!description.trim()}
          >
            <Sparkles className="w-4 h-4" />
            Classify
          </Button>
        </div>
      </div>

      {/* Classification Result */}
      {classification && (
        <div className={`rounded-lg border p-4 ${
          classification.is_uncertain
            ? "bg-amber-50 border-amber-200"
            : "bg-green-50 border-green-200"
        }`}>
          <div className="flex items-start gap-2">
            {classification.is_uncertain ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
            )}
            <div>
              {classification.is_uncertain ? (
                <p className="text-sm font-medium text-amber-800">
                  We are not sure — please choose manually
                </p>
              ) : (
                <p className="text-sm font-medium text-green-800">
                  Suggestion: {classification.subcategory_id}
                  <span className="ml-2 text-xs font-normal">
                    ({Math.round(classification.confidence * 100)}% confidence)
                  </span>
                </p>
              )}
              <p className="text-xs text-gray-600 mt-1">{classification.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Manual category selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Copyright Category"
          required
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(""); }}
          placeholder="Select category..."
          options={CATEGORIES.map((c: any) => ({ value: c.id, label: c.label }))}
        />
        <Select
          label="Subcategory"
          required
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          placeholder="Select subcategory..."
          options={subcategoryOptions}
          disabled={!categoryId}
        />
      </div>

      {selectedCategory && (
        <div className="bg-[#E8EAF6] rounded-lg p-3 text-sm text-[#1A237E]">
          <strong>{selectedCategory.label}:</strong> {selectedCategory.description}
        </div>
      )}

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex justify-end">
        <Button onClick={handleNext} loading={saving} disabled={!categoryId || !subcategoryId}>
          Next: Preview Requirements
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
