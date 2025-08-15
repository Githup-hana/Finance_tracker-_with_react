  export type Transaction = {
    Kategorie: "Gehalt" | "Miete" | "Investitionen" | "Lebensmittel" | "Shopping" | "Freizeit" | "Sonstiges";
    amount: number;
    Transaktionstyp: "income" | "expense";
    date?: string;
  };


