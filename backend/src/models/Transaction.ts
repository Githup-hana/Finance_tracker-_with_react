import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  Kategorie: string;
  amount: number;
  Transaktionstyp: 'income' | 'expense';
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Kategorie: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  Transaktionstyp: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index für bessere Performance
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, Transaktionstyp: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
