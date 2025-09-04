/**
 * OCR Error Corrections
 * Handles common OCR mistakes and text improvements
 */

const OCR_CORRECTIONS = {
  // Common OCR character mistakes
  characterMistakes: [
    // REMOVED: Bidirectional corrections are dangerous and destroy correct text
    // Only use targeted, specific corrections in wordMistakes instead
  ],

  // Common word mistakes in receipts - SAFE, targeted corrections only
  wordMistakes: [
    // Cash variations
    { from: /\bcast\b/i, to: "CASH" },
    { from: /\bcaste\b/i, to: "CASH" },
    { from: /\bcass\b/i, to: "CASH" },
    { from: /\bcassh\b/i, to: "CASH" },

    // Product

    // Amount/payment corrections (with word boundaries for safety)
    { from: /\bamouut\b/i, to: "AMOUNT" },
    { from: /\bamout\b/i, to: "AMOUNT" },
    { from: /\bteder\b/i, to: "TENDERED" },
    { from: /\bpaymeut\b/i, to: "PAYMENT" },
    { from: /paymet/i, to: "PAYMENT" },
    { from: /receipt/i, to: "RECEIPT" },
    { from: /receit/i, to: "RECEIPT" },
    { from: /mercurv/i, to: "MERCURY" },
    { from: /mercurv/i, to: "MERCURY" },
    { from: /druq/i, to: "DRUG" },
    { from: /druq/i, to: "DRUG" },
  ],

  // Volume unit corrections
  volumeCorrections: [
    { from: /\.dkg/i, to: ".4kg" },
    { from: /\.d\s*kg/i, to: ".4kg" },
    { from: /\.d\s*ml/i, to: ".4ml" },
    { from: /\.d\s*l/i, to: ".4l" },
    { from: /\.d\s*g/i, to: ".4g" },
    { from: /kq/i, to: "kg" },
    { from: /ml/i, to: "ml" },
    { from: /l/i, to: "l" },
    { from: /q/i, to: "g" },
    { from: /pack/i, to: "pack" },
  ],

  // Price corrections
  priceCorrections: [
  { from: /150\.007/i, to: "1150.00" },
  { from: /1150(?!\.\d+)/i, to: "1150.00" }, // only plain 1150
  { from: /(\d+)\.(\d{2})\d*/g, to: "$1.$2" }, // trim after 2 decimals
  { from: /(\d+),(\d{3})/g, to: "$1$2" }, // remove commas
  { from: /₱\s*(\d+)/i, to: "$1" }, // remove peso symbol
  { from: /PHP\s*(\d+)/i, to: "$1" } // remove PHP text
  ],


  // Store name corrections
  storeCorrections: [
    { from: /^\s*eroury\s+drug\s*$/i, to: "MERCURY DRUG" },
    { from: /NRORY/i, to: "MERCURY" },
    { from: /JRY\s+DRUG/i, to: "MERCURY DRUG" },
    // { from: /[h|m]?ercury\s+d?rug/gi, to: "MERCURY DRUG" },
    { from: /\b(?:h|m)?ercury\s+d?rug\b/gi, to: "MERCURY DRUG" }, 
    { from: /Shera\s+Yor\s+Naglro/gi, to: "MERCURY DRUG" },
    { from: /NERO\s+DRUG/gi, to: "MERCURY DRUG" },
    { from: /MERCURV\s+DRUQ/i, to: "MERCURY DRUG" },
    { from: /MERCURV\s+DRUG/i, to: "MERCURY DRUG" },
    { from: /MERCURY\s+DRUQ/i, to: "MERCURY DRUG" },
    { from: /^MERCURY\s+DRUG$/i, to: "MERCURY DRUG" },
    { from: /SM\s+HVPERMARKET/i, to: "SM HYPERMARKET" },
    { from: /SM\s+SUPERMARKET/i, to: "SM SUPERMARKET" },
    { from: /ROBINSONS\s+MALL/i, to: "ROBINSONS MALL" },
    { from: /@\s*RElDmore/gi, to: "SAVEMORE" },
    { from: /@\s*RElDmore/gi, to: "SAVEMORE" },
    { from: /\(\@\s*rob;\s*in:\s*<0\.\s*Br\s*Easgniatie/gi, to: "ROBINSONS SUPERMARKET" },
    { from: /rob;\s*in:\s*<0\.\s*Br\s*Easgniatie/gi, to: "ROBINSONS SUPERMARKET" },
    { from: /PUREGOLD/i, to: "PUREGOLD" },
    { from: /R[uo]regald/i, to: "PUREGOLD" },
    { from: /SAVEMORE/i, to: "SAVEMORE" },
    { from: /7-ELEVEN/i, to: "7-ELEVEN" },
  ],

  // Product name corrections
  productCorrections: [
    { from: /^\d+\s+BONAKID\s*P-?S\s*3\+\s*2\.4(?:[gq9])?$/i, to: "BONAKID P-S 3+ 2.4g" },
    { from: /BBRAND\s+JR\s+2\.dkg/i, to: "BBRAND JR 2.4kg" },
    { from: /BBRAND\s+JR\s+2\.4kq/i, to: "BBRAND JR 2.4kg" },
    { from: /barand\s+jr/i, to: "BBRAND JR" },
    { from: /^BEARBRANDI00$/i, to: "BEAR BRAND 300g" },
    {
      from: /45000\s*a\s*RTIFIED/i,
      to: "BEAR BRAND FORTIFIED",
    },
    {
      from: /NESCAFE\s+GOLD\s+29/i,
      to: "NESCAFE GOLD 2g",
    },
    {
      from: /BEAR\s+B\s+FORT24000/i,
      to: "BEAR B FORT2400g",
    },
    { from: /BEAR\s+BIECRTEA0/i, to: "BEAR B FORT840g" },
    { from: /BEAR\s+8\s+FORTI000/i, to: "BEAR B FORT300g"},
    { from: /^BEAR\s*BRAND\s*(?:I00|l00|100)$/i, to: "BEAR BRAND 300g" },
    { from: /^BEARBRAND(?:I00|l00|100)$/i, to: "BEAR BRAND 300g" },
    
    { from: /WIDO3HPRE-51\s*6KG/i, to: "NIDO3+PRE-S1.6KG" },
    { from: /MIO034PRE-S7./i, to: "NIDO3+PRE-S2.4KG" },
  ],
};

// Text preprocessing rules
const TEXT_PREPROCESSING = {
  // Remove common OCR artifacts
  removeArtifacts: [
    /[^\w\s\.\-\(\)\d₱,]/g, // Remove special characters except allowed ones
    /\s+/g, // Normalize whitespace
    /^\s+|\s+$/g, // Trim whitespace
  ],

  // Normalize common variations
  normalizeVariations: [
    { from: /₱/g, to: "PHP" }, // Peso symbol to PHP
    { from: /PHP\s+/g, to: "PHP" }, // Normalize PHP spacing
    { from: /\.{2,}/g, to: "." }, // Multiple dots to single
    { from: /-{2,}/g, to: "-" }, // Multiple dashes to single
  ],
};

// Confidence scoring for corrections
const CORRECTION_CONFIDENCE = {
  high: 0.9, // Very likely correction
  medium: 0.7, // Probable correction
  low: 0.5, // Possible correction
};

module.exports = {
  OCR_CORRECTIONS,
  TEXT_PREPROCESSING,
  CORRECTION_CONFIDENCE,
};
