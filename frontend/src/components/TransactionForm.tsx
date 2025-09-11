import React, { useState } from 'react';
import { TransactionFormData } from '../types/transactions';
import LoadingSpinner from './ui/LoadingSpinner';
import { useNotification } from './ui/Notification';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<{ success: boolean; message?: string }>;
  initialData?: Partial<TransactionFormData>;
  isEditing?: boolean;
  onCancel?: () => void;
}

const CATEGORIES = {
  income: [
    'Gehalt',
    'Freelancing',
    'Investitionen',
    'Bonus',
    'Geschenk',
    'Sonstiges'
  ],
  expense: [
    'Miete',
    'Lebensmittel',
    'Transport',
    'Shopping',
    'Freizeit',
    'Gesundheit',
    'Bildung',
    'Versicherung',
    'Sonstiges'
  ]
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  onCancel
}) => {
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: initialData?.amount || '',
    category: initialData?.category || '',
    type: initialData?.type || 'expense',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    tags: initialData?.tags || []
  });

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});
  const [tagInput, setTagInput] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Betrag muss größer als 0 sein';
    }

    if (!formData.category) {
      newErrors.category = 'Kategorie ist erforderlich';
    }

    if (!formData.date) {
      newErrors.date = 'Datum ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Formular enthält Fehler', 'Bitte korrigieren Sie die markierten Felder.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        showSuccess(
          isEditing ? 'Transaktion aktualisiert' : 'Transaktion erstellt',
          result.message
        );
        if (!isEditing) {
          // Reset form after successful creation
          setFormData({
            amount: '',
            category: '',
            type: 'expense',
            description: '',
            date: new Date().toISOString().split('T')[0],
            tags: []
          });
        }
      } else {
        showError('Fehler', result.message || 'Ein Fehler ist aufgetreten');
      }
    } catch (error) {
      showError('Fehler', 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const currentCategories = CATEGORIES[formData.type];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Transaktion bearbeiten' : 'Neue Transaktion'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typ
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-green-600 font-medium">Einnahme</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-red-600 font-medium">Ausgabe</span>
            </label>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Betrag (€)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            required
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategorie
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Kategorie wählen</option>
            {currentCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datum
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beschreibung (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Zusätzliche Notizen..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional)
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tag hinzufügen..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Hinzufügen
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              disabled={isLoading}
            >
              Abbrechen
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              formData.type === 'income' 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" color="gray" />
                <span className="ml-2">Wird gespeichert...</span>
              </>
            ) : (
              isEditing ? 'Aktualisieren' : 'Erstellen'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
