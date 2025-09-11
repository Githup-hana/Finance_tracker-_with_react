import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Interface für User
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema Definition
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email ist erforderlich'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Bitte geben Sie eine gültige Email-Adresse ein'
    ]
  },
  password: {
    type: String,
    required: [true, 'Passwort ist erforderlich'],
    minlength: [6, 'Passwort muss mindestens 6 Zeichen haben']
  },
  firstName: {
    type: String,
    required: [true, 'Vorname ist erforderlich'],
    trim: true,
    maxlength: [50, 'Vorname darf maximal 50 Zeichen haben']
  },
  lastName: {
    type: String,
    required: [true, 'Nachname ist erforderlich'],
    trim: true,
    maxlength: [50, 'Nachname darf maximal 50 Zeichen haben']
  }
}, {
  timestamps: true, // Automatische createdAt und updatedAt Felder
  versionKey: false // __v Feld entfernen
});

// Passwort vor Ausgabe ausblenden
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Model Export
export const User = mongoose.model<IUser>('User', userSchema);
