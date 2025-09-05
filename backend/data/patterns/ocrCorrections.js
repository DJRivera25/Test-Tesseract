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

    { from: /coe\s*0\s*5/i, to: "CHANGE DUE" },
    { from: /tat\s+exes\s+sale/i, to: "Vat Exempt Sale" },
    { from: /CUNEATE\s*5/i, to: "VALID FOR FIVE YEARS" },
    { from: /\b(?:g\s*)?(?:Re\s*|Refe|Reie|Rei|Refr|Refe?r)\s*r?ence\b/i, to: "REFERENCE" },
    { from: /.*eM-PAY\s*DETAILS.*/i, to: "eM-PAY DETAILS" },
    { from: /.*Vat\s+Bxasot\s+Sale.*$/i, to: "VAT EXEMPT SALE" },

    // Product
    { from: /\bFavou?red\b/i, to: "FLAVOURED" },
    { from: /\bFlavo[u]?red\b/i, to: "FLAVOURED" },

    // Common word mistakes for Milk
    { from: /\bSilk\b/i, to: "MILK" },
    { from: /\bMik\b/i, to: "MILK" },
    { from: /\bMlk\b/i, to: "MILK" },

    { from: /(\d+)\s*m\b/i, to: "$1ml" },
    { from: /\bpack\b/gi, to: "Pack" },

    // Common word mistakes for BEAR
    { from: /\bHEAR\b/i, to: "BEAR" },
    { from: /\bBEAR B?\b/i, to: "BEAR" },
    { from: /\bBEAR BRNAD\b/i, to: "BEAR BRAND" },
    { from: /\bBEAR BRAI[D]?\b/i, to: "BEAR BRAND" },
    { from: /\bBER BRAND\b/i, to: "BEAR BRAND" },
    { from: /\bBEAR B FORT\b/i, to: "BEAR BRAND FORTIFIED" },
    { from: /\bBEAR B FORT24000\b/i, to: "BEAR BRAND FORT2400G" },
    { from: /\bBEAR BIECRTEA0\b/i, to: "BEAR BRAND FORT840G" },
    { from: /BEAR\s*BRANC/i, to: "BEAR BRAND" },
    {
      from: /BEAR(?=[A-Z])/g, // Ensures space after BEAR if missing
      to: "BEAR ",
    },

    // Common word mistakes for BRAND
    { from: /\bRAID\b/i, to: " BRAND " },
    { from: /\bBRNAD\b/i, to: " BRAND " },
    { from: /\bBRN\b/i, to: " BRAND " },
    { from: /\bBRND\b/i, to: " BRAND " },
    { from: /\bB R A N D\b/i, to: " BRAND " },
    { from: /\bB RND\b/i, to: " BRAND " },
    { from: /\bBRAID\b/gi, to: "BRAND " },

    // Common word mistakes for POWDERED
    { from: /\bPIVOERED\b/i, to: "POWDERED " },
    { from: /\bPOWDRED\b/i, to: "POWDERED " },
    { from: /\bPOWDRD\b/i, to: "POWDERED " },
    { from: /\bPOWDRED\b/i, to: "POWDERED " },
    { from: /\bPOWDERE?D\b/i, to: "POWDERED " },
    { from: /\bP0WDERED\b/i, to: "POWDERED " },

    // Common word mistakes for MILO
    { from: /\bHILO\b/i, to: "MILO" },
    { from: /\bBILO\b/i, to: "MILO" },
    { from: /\bNILO\b/i, to: "MILO" },
    { from: /\bM1LO\b/i, to: "MILO" },
    { from: /\bMILO\b/i, to: "MILO" },
    { from: /^.*?(MILO.*)/i, to: "$1" }, // remove leading words before milo

    // Common word mistakes for DRINK
    { from: /\bDRI\b/i, to: "DRINK" },
    { from: /\bDRNK\b/i, to: "DRINK" },
    { from: /\bRNK\b/i, to: "DRINK" },
    { from: /\bDR1NK\b/i, to: "DRINK" },
    { from: /\bDRlNK\b/i, to: "DRINK" },

    { from: /\b(lamon|lmn|emon|lmon)\b/gi, to: "LEMON" }, // Common word mistakes for LEMON

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
    { from: /\bToL\b/i, to: "TOTAL" },
    { from: /\bCHG\b/i, to: "CHANGE" },
    { from: /\bfnount\s+die\b/i, to: "AMOUNT DUE" },
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
    { from: /(\d{2,})6G\b/i, to: "$1G" },
  ],

  // Price corrections
  priceCorrections: [
    { from: /150\.007/i, to: "1150.00" },
    { from: /1150(?!\.\d+)/i, to: "1150.00" }, // only plain 1150
    { from: /(\d+)\.(\d{2})\d*/g, to: "$1.$2" }, // trim after 2 decimals
    { from: /(\d+),(\d{3})/g, to: "$1$2" }, // remove commas
    { from: /₱\s*(\d+)/i, to: "$1" }, // remove peso symbol
    { from: /PHP\s*(\d+)/i, to: "$1" }, // remove PHP text
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
    // Nestle store corrections
    { from: /Nest\s+store/i, to: "NESTLE STORE" },
    { from: /\(GED\s+Nestl[eé]\s+Store/i, to: "NESTLE STORE" },
    { from: /NESTLE\s+PH/i, to: "NESTLE PH" },
    { from: /este\s*pi/i, to: "NESTLE PH" },
    { from: /\[GE\s+Nestl[eé]\s+Store\./i, to: "NESTLE STORE" },
    { from: /Soria/i, to: "SM Supermarket SM City" },
    { from: /!Save\s*Ey\s*Low\s*Price/i, to: "O! SAVE EVERYDAY LOW PRICE" },
    { from: /@ Robinsons\s+ga\s+gyi/i, to: "ROBINSONS EASYMART" },
    { from: /Robinsons\s+ga\s+gyi/i, to: "ROBINSONS EASYMART" },
    { from: /\[?Neste\s+Official\s+Store/i, to: "NESTLE OFFICIAL STORE" },
    { from: /le\s*ii,/i, to: "NESTLE STORE" },

    // SM Supermarket corrections
    { from: /SM\s*AURA/i, to: "SM SUPERMARKET" },
    { from: /S\s*comm[e|er|or]+ce\s*(bc|be|inc)?/i, to: "SCommerce Philippines, Inc." },
    { from: /(altu[rn]as?|wus)\s+sup(e|ai|ei|er|ar)[a-z]*.*corp/i, to: "ALTURAS SUPERMARKET CORP." },
    { from: /s.*arket.*hyper[mn]/i, to: "SM HYPERMARKET" },
    { from: /M\s*HYPERM/gi, to: "SM SUPERMARKET" },
    { from: /^K2(\s*(IRD GROUP THE\.?|GROUP))?$/i, to: "K2 DRUG GROUP INC." },
    { from: /^EE\s+(Nestlé\s+Store)/i, to: "$1" },
    { from: /SM\s+SUPERM\b/i, to: "SM SUPERMARKET" },
    { from: /.{2}\s*Nestlé\s+Store/i, to: "NESTLÉ STORE" },
    { from: /Rl\s*THER\s*\(0/i, to: "DURIAN TRADERS OPC" },
    { from: /.*Nestlé\s+Store\.?/i, to: "NESTLÉ STORE" },
    { from: /EHOUSE\s+ClUB,\s*INC/i, to: "CSI WAREHOUSE CLUB, INC" },
    { from: /[:#\s]*SMs?UPERMARKET/i, to: "SM SUPERMARKET" },
    { from: /(EVERWIN\s+MART)/i, to: "EVERWIN MART" },
    { from: /.*Nestlé\s+Store/i, to: "NESTLÉ STORE" },
    { from: /neste\s*pH/i, to: "NESTLE PH" },
    { from: /pureg[a|o]ld\s*price\s*cl[ui][b|k][\s,]*1?[k|c]?\]?/i, to: "PUREGOLD PRICE CLUB INC." },
    { from: /Sa\s+Mercury\s+Dr[\s\S]*Sanat\s+Fo\.?/i, to: "MERCURY DRUG" },
    { from: /.*vercury\s*Dra.*/i, to: "MERCURY DRUG" },
    { from: /.*Nest\w*/gi, to: "NESTLE" },
    { from: /pureg[ao]ld/gi, to: "PUREGOLD" },
    { from: /puregeld/gi, to: "PUREGOLD" },
    { from: /pureg0ld/gi, to: "PUREGOLD" },
    { from: /puregcld/gi, to: "PUREGOLD" },
    { from: /puregld/gi, to: "PUREGOLD" },
    { from: /puregld/gi, to: "PUREGOLD" },

    { from: /\bfrist\b/i, to: "PRICE" },
    { from: /\bcl[b|d]\b/i, to: "CLUB" },
    {
      from: /\bWART\s+SUPERMARKET\b/i,
      to: "WALTERMART SUPERMARKET",
    },
    {
      from: /.*\b(WART|WALTER|WALTERMART)\b.*\bSUPERMARKET\b.*/i,
      to: "WALTERMART SUPERMARKET",
    },
    { from: /\bSM\s+(SUPERMARKET|HYPERMARKET|AURA)\b/i, to: (match, p1) => `SM ${p1.toUpperCase()}` },
    {
      from: /.*\b(WART|WALTER|WALTERMART)\b.*\bSUPER\b.*/i,
      to: "WALTERMART SUPERMARKET",
    },
    {
      from: /.*\bwaltermart\b.*/i,
      to: "WALTERMART SUPERMARKET",
    },
  ],

  // Product name corrections
  productCorrections: [
    {
      from: /BBRAND\s+JR\s+2\.dkg/i,
      to: "BBRAND JR 2.4kg",
    },
    {
      from: /BBRAND\s+JR\s+2\.4kq/i,
      to: "BBRAND JR 2.4kg",
    },
    {
      from: /barand\s+jr/i,
      to: "BBRAND JR",
    },
    {
      from: /45000\s*a\s*RTIFIED/i,
      to: "BEAR BRAND FORTIFIED",
    },
    {
      from: /a\s+Bear\s+Brand\s+Fortified\s+Powdered\s+Milk\s+Drink\s*2\.\./i,
      to: "Bear Brand Fortified Powdered Milk Drink 2 ",
    },
    {
      from: /NESCAFE\s+GOLD\s+29/i,
      to: "NESCAFE GOLD 2g",
    },
    {
      from: /BEAR\s+B\s+FORT24000/i,
      to: "BEAR B FORT2400g",
    },
    {
      from: /BEAR\s+BIECRTEA0/i,
      to: "BEAR B FORT840g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*33g/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /B3AR\s*BR@ND\s*ADULT\s*PLU5\s*33g/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /BEARBRAND\s*ADULT\s*PLU5\s*33g/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLu5\s*33g/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLUS\s*33G/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUSS\s*33g/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLUS\s*3O3g/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /BEAR\s*BR@ND\s*ADULT\s*PLUS\s*33g/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUZ\s*33g/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLU5\s*33G/i,
      to: "BEAR BRAND ADULT PLUS 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*300g/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLU5\s*3O0g/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /BEARBRAND\s*ADULT\s*PLUS\s*300G/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLu5\s*3OOg/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLUS\s*3O0G/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUSS\s*300g/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUZ\s*300g/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /BEAR\s*BR@ND\s*ADULT\s*PLUS\s*300g/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLU5\s*3OOg/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*3OOG/i,
      to: "BEAR BRAND ADULT PLUS 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*COFFEE\s*33g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLU5\s*COFFEE\s*33g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /BEARBRAND\s*ADULT\s*PLUS\s*COFEE\s*33G/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*COFFEE\s*3O3g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLU5\s*COFEE\s*33g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /BEAR\s*BR@ND\s*ADULT\s*PLU5\s*COFFEE\s*33g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUSS\s*COFFEE\s*33g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*COFFEE\s*33G/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLU5\s*C0FFEE\s*33g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLU5\s*COFEE\s*3O3g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 33g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*COFFEE\s*300g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLU5\s*COFFEE\s*3O0g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /BEARBRAND\s*ADULT\s*PLUS\s*COFEE\s*300G/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLU5\s*COFFEE\s*3OOg/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*COFFEE\s*3O0G/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /BEAR\s*BR@ND\s*ADULT\s*PLU5\s*COFFEE\s*300g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUSS\s*COFFEE\s*300g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLU5\s*C0FFEE\s*300g/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLUS\s*COFEE\s*3OOg/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*COFFEE\s*3OOG/i,
      to: "BEAR BRAND ADULT PLUS COFFEE 300g",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUS\s*600G/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLU5\s*600g/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /BEARBRAND\s*ADULT\s*PLUS\s*6OOG/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLU5\s*6O0g/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLUSS\s*600G/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /BEAR\s*BR@ND\s*ADULT\s*PLU5\s*600G/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLU5\s*6OOg/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLUSS\s*6OOg/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /B3AR\s*BRAND\s*ADULT\s*PLU5\s*6OOg/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /BEAR\s*BRAND\s*ADULT\s*PLU5\s*6O0G/i,
      to: "BEAR BRAND ADULT PLUS 600G",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*300g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDRD\s*M1LK\s*300g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /BEARBRAND\s*FORTIFIED\s*POWDERED\s*M1LK\s*3O0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /BEAR\s*BR@ND\s*FORTIFIED\s*POWDRD\s*MILK\s*300G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /B3AR\s*BRAND\s*FORTIFIED\s*POWDERD\s*M1LK\s*300G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*3OOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MI1K\s*300g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /B3AR\s*BRAND\s*FORTIFIED\s*POWDERED\s*M1LK\s*3O0G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*3OOG/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /B3AR\s*BR@ND\s*FORTIFIED\s*POWDERED\s*MI1K\s*300g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 300g",
    },
    {
      from: /BEAR\s*BRAND\s*POWDERED\s*MILK\s*CHOCO\s*840g/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /B3AR\s*BRAND\s*POWDRD\s*MILK\s*CH0CO\s*840G/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /BEARBRAND\s*POWDERED\s*M1LK\s*CHOCO\s*840g/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /BEAR\s*BRAND\s*POWDERED\s*M1LK\s*CH0CO\s*840g/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /B3AR\s*BRAND\s*POWDERED\s*MILK\s*CHOCO\s*84Og/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /BEAR\s*BRAND\s*POWDRD\s*MILK\s*CHOCO\s*840g/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /BEAR\s*BRAND\s*POWDERED\s*M1LK\s*CH0C0\s*840G/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /B3AR\s*BRAND\s*POWDERED\s*MILK\s*CH0C0\s*840g/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /BEAR\s*BRAND\s*POWDERED\s*MILK\s*CHOCO\s*84Oq/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /B3AR\s*BRAND\s*POWDRD\s*MILK\s*CHOCO\s*84Og/i,
      to: "BEAR BRAND POWDERED MILK CHOCO 840g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*840g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERD\s*M1LK\s*840G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /BEARBRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*84Og/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*840g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /B3AR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*840g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERD\s*MILK\s*84Og/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*84Oq/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*840G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*84Og/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERD\s*M1LK\s*840g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 840g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*1210g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDRD\s*M1LK\s*1210G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /BEARBRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*1210g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*12I0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /B3AR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*12IOG/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*12l0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*12LOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*12IOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*12I0G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDRD\s*MILK\s*1210g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1210g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*680g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDRD\s*M1LK\s*680G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /BEARBRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*68Og/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*6B0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /B3AR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*68Oq/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*680q/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*6O0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*6BOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*6B0G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERD\s*MILK\s*680g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 680g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*1500g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDRD\s*M1LK\s*15O0G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /BEARBRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*150Og/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*1500q/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*15OOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*1500q/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERD\s*M1LK\s*1500G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*15O0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*1500g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*15OOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 1500g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*2000g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDRD\s*M1LK\s*2000G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /BEARBRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*20OOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*2O0Og/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*2000q/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*2OO0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERD\s*M1LK\s*2000g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*2000G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*20O0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*20OOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*2400g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDRD\s*M1LK\s*2400G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /BEARBRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*24OOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*2O0Og/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*24O0g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*24O0G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*2400q/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERD\s*M1LK\s*2400g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*24OOg/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*24O0G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2400g",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*POWDERED\s*MILK\s*33g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDRD\s*M1LK\s*33G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /BEARBRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*33g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*3O3g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*3O3G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*33q/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*33Q/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERD\s*M1LK\s*33g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*M1LK\s*33G/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*POWDERED\s*MILK\s*33q/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 33g",
    },
    {
      from: /BEAR\s*BRAND\s*STERILIZED\s*200ML/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /B3AR\s*BRAND\s*STERIL1ZED\s*200M1/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /BEARBRAND\s*STERILIZED\s*2O0ML/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /BEAR\s*BRAND\s*STERIL1ZED\s*200ML/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /B3AR\s*BRAND\s*STERILIZED\s*2OOmL/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /BEAR\s*BRAND\s*STERILIZED\s*200mL/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /BEAR\s*BRAND\s*STERIL1ZED\s*2O0ML/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /B3AR\s*BRAND\s*STERILIZED\s*200M1/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /BEAR\s*BRAND\s*STERILIZED\s*200Ml/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /BEAR\s*BRAND\s*STERIL1ZED\s*2OOmL/i,
      to: "BEAR BRAND STERILIZED 200ML",
    },
    {
      from: /BEAR\s*BRAND\s*STERILIZED\s*UHT\s*MILK\s*1L/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /B3AR\s*BRAND\s*STERIL1ZED\s*UHT\s*M1LK\s*1L/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /BEARBRAND\s*STERILIZED\s*UHT\s*MILK\s*1l/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /BEAR\s*BRAND\s*STERIL1ZED\s*UHT\s*MILK\s*1L/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /B3AR\s*BRAND\s*STERILIZED\s*UHT\s*M1LK\s*1l/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /BEAR\s*BRAND\s*STERILIZED\s*UHT\s*MILK\s*1I/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /BEAR\s*BRAND\s*STERIL1ZED\s*UHT\s*M1LK\s*1I/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /B3AR\s*BRAND\s*STERILIZED\s*UHT\s*MILK\s*1l/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /BEAR\s*BRAND\s*STERIL1ZED\s*UHT\s*MILK\s*1L/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /BEAR\s*BRAND\s*STERIL1ZED\s*UHT\s*MILK\s*1l/i,
      to: "BEAR BRAND Sterilized UHT Milk 1L",
    },
    {
      from: /BEAR\s*BRAND\s*FORTIFIED\s*READY-TO-DRINK\s*110ML/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*READY-TO-DR1NK\s*110M1/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /BEARBRAND\s*F0RTIFIED\s*READY-TO-DRINK\s*11OML/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*READY-TO-DRINK\s*110mL/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*READY-TO-DRINK\s*11OMl/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*READY-TO-DRINK\s*110Ml/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*READY-TO-DR1NK\s*110Ml/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /B3AR\s*BRAND\s*F0RTIFIED\s*READY-TO-DR1NK\s*11OMl/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*READY-TO-DRINK\s*110Ml/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /BEAR\s*BRAND\s*F0RTIFIED\s*READY-TO-DR1NK\s*110ML/i,
      to: "BEAR BRAND FORTIFIED READY-TO-DRINK 110ML",
    },
    {
      from: /Nestle\s*Fresh\s*Milk\s*Hi[-\s]?Calcium\s*1L/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /N3stle\s*Fr3sh\s*M1lk\s*Hi[-\s]?Calci0m\s*1L/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /Nestle\s*Fr3sh\s*Milk\s*Hi-Calciumm\s*1l/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /N3stle\s*Fresh\s*M1lk\s*Hi-Calci0m\s*1l/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /Nest1e\s*Fr3sh\s*Milk\s*Hi[-\s]?Calciumm\s*1L/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /N3stle\s*Fr3sh\s*M1lk\s*Hi-Calciumm\s*1L/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /Nestle\s*Fr3sh\s*Milk\s*Hi[-\s]?Calcium\s*1l/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /N3stle\s*Fresh\s*M1lk\s*Hi-Calciumm\s*1L/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /Nestle\s*Fr3sh\s*M1lk\s*Hi[-\s]?Calciumm\s*1L/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /N3stle\s*Fr3sh\s*M1lk\s*Hi-Calcium\s*1l/i,
      to: "Nestle Fresh Milk Hi-Calcium 1L",
    },
    {
      from: /Nestle\s*All[-\s]?Purpose\s*Cream\s*125ml/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /N3stle\s*All[-\s]?Purp0se\s*Creem\s*1 25m1/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /Nestle\s*All - Purp0se\s*Creem\s*125 M L/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /N3stle\s*All-Purpose\s*Cr3am\s*1 2 5 ml/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /Nest1e\s*All[-\s]?Purpose\s*Cr3em\s*125m1/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /N3 stle\s*All[-\s]?Purp0se\s*Cr3am\s*125 ML/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /Nestle\s*All-Purp0se\s*Cr eam\s*125m1/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /N3stle\s*All-Purpose\s*Creem\s*1 2 5 m l/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /Nestle\s*All[-\s]?Purpose\s*Cr3am\s*1 25Ml/i,
      to: "Nestle All-Purpose Cream 125ml",
    },
    {
      from: /N3stle\s*All-Purp0se\s*Cr eam\s*125ml/i,
      to: "Nestle All-Purpose Cream 125ml",
    },

    {
      from: /MAGGI\s*Oyster\s*Sauce\s*300ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sauce\s*300 m1/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyster\s*Sa uce\s*300ML/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sauce\s*3O0ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyster\s*Sauce\s*3 0 0 ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sa uce\s*300Ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyst er\s*Sauce\s*300ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /M4GGI\s*Oyster\s*Sauce\s*3OOml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyst3r\s*Sauce\s*3O0Ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oys ter\s*Sauce\s*300 mL/i,
      to: "MAGGI Oyster Sauce 300ml",
    },

    {
      from: /MAGGI\s*Oyster\s*Sauce\s*300ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sauce\s*300ml\s*P ack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyster\s*Sauce\s*300ml\s*Pack\s*0f\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sauce\s*3O0ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyst er\s*Sauce\s*300ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyster\s*Sauce\s*3 0 0ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /M4GGI\s*Oyster\s*Sauce\s*300ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyst3r\s*Sauce\s*300ml\s*Pack\s*0f\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyster\s*Sa uce\s*300ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /M4GGI\s*Oyst er\s*Sauce\s*3OOml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },

    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Calamans1\s*130ml\s*P ack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130 m1\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*130ml\s*Pack\s*0f\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamans i\s*130ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*1 3 0ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*130 mL\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*1 30ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*130ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },

    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*130 m1/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*1 3 0ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ML/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Calamans1\s*130ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130 mL/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamans i\s*130ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*1 3 0 m l/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130 m1/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130m1/i,
      to: "MAGGI Savor Calamansi 130ml",
    },

    {
      from: /MAGGI\s*Oyster\s*Sauce\s*300ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sauce\s*300 m1/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyst er\s*Sauce\s*3OOml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyster\s*Sa uce\s*300ML/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sauce\s*3O0ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyst er\s*Sauce\s*300ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /M4GGI\s*Oyster\s*Sauce\s*300Ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyst3r\s*Sa uce\s*300ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /MAGGI\s*Oyster\s*Sauce\s*3 0 0 ml/i,
      to: "MAGGI Oyster Sauce 300ml",
    },
    {
      from: /M4GGI\s*Oyst er\s*Sauce\s*300 mL/i,
      to: "MAGGI Oyster Sauce 300ml",
    },

    {
      from: /MAGGI\s*Oyster\s*Sauce\s*300ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sauce\s*300 m1\s*Pack\s*0f\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyst er\s*Sauce\s*3OOml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyster\s*Sa uce\s*300ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /M4GGI\s*Oyst3r\s*Sauce\s*3O0ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyster\s*Sauce\s*3 0 0ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyst er\s*Sauce\s*300ml\s*Pack\s*0f\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /M4GGI\s*Oyster\s*Sauce\s*300ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyst3r\s*Sa uce\s*300ml\s*Pack\s*0f\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },
    {
      from: /MAGGI\s*Oyst er\s*Sauce\s*3OOml\s*Pack\s*of\s*2/i,
      to: "MAGGI Oyster Sauce 300ml Pack of 2",
    },

    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Calamans1\s*130 m1\s*Pack\s*0f\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130 mL\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamans i\s*130ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*1 3 0ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml\s*Pack\s*0f\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*1 3 0 m l\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*130 m1\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml\s*Pack\s*of\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml\s*Pack\s*0f\s*2/i,
      to: "MAGGI Savor Calamansi 130ml Pack of 2",
    },

    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*1 3 0ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamans1\s*130 m1/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ML/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*130 mL/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamans i\s*130ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*1 3 0 m l/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Calamansi\s*130ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130ml/i,
      to: "MAGGI Savor Calamansi 130ml",
    },
    {
      from: /MAGGI\s*Savor\s*Calamansi\s*130m1/i,
      to: "MAGGI Savor Calamansi 130ml",
    },

    {
      from: /Maggi\s*Savor\s*Classic\s*Liquid\s*Seasoning\s*130ml/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Classic\s*Liquid\s*Seas0ning\s*130 m1/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Classic\s*L1quid\s*Seasoning\s*130ml/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Classic\s*Liquid\s*Seas0ning\s*130ML/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Classic\s*Liquid\s*Seasoning\s*130 mL/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Clas sic\s*Liquid\s*Seasoning\s*130ml/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Classic\s*Liquid\s*Seas0ning\s*1 3 0 ml/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Classic\s*Liquid\s*Seasoning\s*130ml/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Classic\s*Liquid\s*Seasoning\s*130 m1/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Classic\s*Liquid\s*Seasoning\s*130ML/i,
      to: "Maggi Savor Classic Liquid Seasoning 130ml",
    },

    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /M4GGI\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granuls\s*8g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*AllinOne\s*Seasoning\s*Granules\s*8g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granuls\s*8g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /M4GGI\s*Magic\s*Sarap\s*AllinOne\s*Seasoning\s*Granules\s*8 g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granuls\s*8 g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /M4GGI\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8 g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*AllinOne\s*Seasoning\s*Granules\s*8g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /M4GGI\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8g/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8g\s*Pack\s*of\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /M4GGI\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8 g\s*Pack\s*0f\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*AllinOne\s*Seasoning\s*Granules\s*8g\s*Pack\s*of\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8g\s*Pack\s*of\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /M4GGI\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8g\s*P ack\s*of\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8g\s*Pack\s*0f\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*AllinOne\s*Seasoning\s*Granules\s*8g\s*Pack\s*of\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /M4GGI\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8 g\s*Pack\s*of\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8 g\s*Pack\s*0f\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },
    {
      from: /Maggi\s*Magic\s*Sarap\s*All[-\s]?in[-\s]?One\s*Seasoning\s*Granules\s*8g\s*Pack\s*of\s*16/i,
      to: "Maggi Magic Sarap All-in-One Seasoning Granules 8g - Pack of 16",
    },

    {
      from: /Maggi\s*Savor\s*Chilimansi\s*Liquid\s*Seasoning\s*130ml\s*Pack\s*of\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Chilimansi\s*Liquid\s*Seas0ning\s*130 m1\s*Pack\s*0f\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /Maggi\s*Savor\s*Chili[m]ansi\s*Liquid\s*Seasoning\s*130ml\s*Pack\s*of\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seasoning\s*130ml\s*Pack\s*of\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*130ml\s*Pack\s*of\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /Maggi\s*Savor\s*Chili[m]ansi\s*Liquid\s*Seasoning\s*130 mL\s*Pack\s*0f\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*130ml\s*Pack\s*of\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /M4GGI\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*1 3 0 m l\s*Pack\s*of\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /Maggi\s*Savor\s*Chili[m]ansi\s*Liquid\s*Seasoning\s*130 m1\s*Pack\s*of\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seasoning\s*130ml\s*Pack\s*0f\s*2/i,
      to: "Maggi Savor Chilimansi Liquid Seasoning 130ml - Pack of 2",
    },

    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seasoning\s*130ml/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*130 m1/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seasoning\s*130ML/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*1 3 0 m l/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Chili\s*Liquid\s*Seasoning\s*130ml/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*130 mL/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seasoning\s*130 m1/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /M4GGI\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*130ml/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*130ml/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },
    {
      from: /Maggi\s*Savor\s*Chili\s*Liquid\s*Seas0ning\s*130 mL/i,
      to: "Maggi Savor Chili Liquid Seasoning 130ml",
    },

    {
      from: /Maggi\s*Magic\s*Chicken\s*All\s*Around\s*Broth\s*Cube\s*10g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },
    {
      from: /M4GGI\s*Magic\s*Chicken\s*All\s*Around\s*Broth\s*Cube\s*1 0g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },
    {
      from: /Maggi\s*Magic\s*Chicken\s*All\s*Around\s*Broth\s*Cub3\s*10g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },
    {
      from: /Maggi\s*Magic\s*Ch1cken\s*All\s*Around\s*Broth\s*Cube\s*10 g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },
    {
      from: /M4GGI\s*Magic\s*Chicken\s*All\s*Around\s*Broth\s*Cub3\s*10g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },
    {
      from: /Maggi\s*Magic\s*Chicken\s*All\s*Around\s*Broth\s*Cube\s*1 0 g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },
    {
      from: /Maggi\s*Magic\s*Ch1cken\s*All\s*Around\s*Broth\s*Cube\s*10g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },
    {
      from: /M4GGI\s*Magic\s*Chicken\s*All\s*Around\s*Broth\s*Cube\s*10 g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },
    {
      from: /Maggi\s*Magic\s*Chicken\s*All\s*Around\s*Broth\s*Cub3\s*10g/i,
      to: "Maggi Magic Chicken All Around Broth Cube 10g",
    },

    {
      from: /WIDO3HPRE-51\s*6KG/i,
      to: "NIDO3+PRE-S1.6KG",
    },
    {
      from: /MIO034PRE-S7./i,
      to: "NIDO3+PRE-S2.4KG",
    },
    {
      from: /MAGIC\s+SAP\s+Bog\s*v/i,
      to: "MAGIC SARAP 55G",
    },
    {
      from: /MILO\s+CHOCO\s+WALT\s*24GK12'S\s*PRICE\s*OFF"?/i,
      to: "MILO CHOCO MALT 24GX12'S PRICE OFF",
    },
    {
      from: /NESCAFE\s+DECAF\s*206/i,
      to: "NESCAFE DECAF 20G",
    },
    {
      from: /MILO\s+ACTIVEGO/i,
      to: "MILO ACTIVE-GO",
    },
    {
      from: /NESTLE\s+KOKOCRUNCH/i,
      to: "NESTLE KOKO KRUNCH",
    },
    {
      from: /=\s*Nescafe\s+Classi\s+Instant\s+Coffe\s*19\.\./i,
      to: "NESCAFE CLASSIC INSTANT COFFEE",
    },
    {
      from: /MILO\s+Powdered\s+Choco\s+Malt\s+Milk\s+Drink/i,
      to: "MILO POWDERED CHOCO MALT MILK DRINK",
    },
    {
      from: /\[55\s+of\s+ororsarms\s+caro\./i,
      to: "MILO POWDERED CHOCO MALT MILK DRINK",
    },
    {
      from: /BearBrandChSW/i,
      to: "Bear Brand Choco Swak",
    },
    {
      from: /SZ\s+Neko\s+NutrSnx\s+Strasberry-\s*Carrot\s+Mik\s+Din/i,
      to: "NIDO NUTRISNAX STRAWBERRY-CARROT MILK DRINK",
    },
    {
      from: /LS\s+NDO\s+urriSnax\s+Stawberry\s+Carrot\s*&\s*Banana/i,
      to: "NIDO NUTRISNAX STRAWBERRY CARROT & BANANA",
    },
    {
      from: /Koko\s+Krunch\s+Breakfast\s+Cereal\s*15g\s*-\s*pack\s+of/i,
      to: "KOKO KRUNCH BREAKFAST CEREAL 15G - PACK OF CEREAL",
    },
    {
      from: /es\)\s*kooks\s*pri/i,
      to: "NESTLE Koko450g",
    },
    {
      from: /ole\s*Orr\s*Ze\s*el\s*y/i,
      to: "CHOCOLATE DRINK CHUCKIE 110ML",
    },
    {
      from: /MILO\s+ACTIV-?GO\s+WINNER\s*24G/i,
      to: "MILO ACTIV-GO WINNER 24G",
    },
    {
      from: /MILO\s+CEREAL\s*20G/i,
      to: "MILO CEREAL 20G",
    },
    {
      from: /NESTLE\s+KOKOKRUNCH\s*15G/i,
      to: "NESTLE KOKOKRUNCH 15G",
    },
    {
      from: /NESTLE\s+CHUCKIE\s*110ML/i,
      to: "NESTLE CHUCKIE 110ML",
    },
    {
      from: /BEAR\s+B\s+FORT2000g/i,
      to: "BEAR BRAND FORTIFIED POWDERED MILK 2000G",
    },
    {
      from: /4800361410892\s*BBRAN\s*N\s*3/i,
      to: "BEAR BRAND WITH IRON 300G",
    },
    {
      from: /oe\s*fri\s*ba/i,
      to: "CHUCKIE BAON 110ML",
    },
    {
      from: /TL\s*\|/i,
      to: "MILO ACTIV-GO",
    },
    {
      from: /MILO\s+ACTIV\s*GO/i,
      to: "MILO ACTIV-GO",
    },
    {
      from: /CHCKIE\s*180M/i,
      to: "NESTLE CHUCKIE 180ML",
    },
    {
      from: /pe\s*BEAR\s+BRAND\s+Fortified/i,
      to: "BEAR BRAND FORTIFIED",
    },
    {
      from: /NESTLE\s+CFEEMTE\s*80G/i,
      to: "NESTLE COFFEE MATE 80G",
    },
    {
      from: /BB\s+FRTFD\s+PHD\s+H\/IRN\s+SHK33G/i,
      to: "BB FRTFD PWD W/IRN SWK33G",
    },
    {
      from: /NESCAFE\s+CLSC\s+CFEE\s+RFL\s*206/i,
      to: "NESCAFE CLSC COFFEE RFL 20G",
    },
    {
      from: /wi\s*Ea/i,
      to: "POWDERED MILK BEAR BRAND 840G",
    },
    {
      from: /CHCKIE\s*180M/i,
      to: "CHUCKIE 180ML",
    },
    {
      from: /CHUKIE\s*180ML/i,
      to: "CHUCKIE 180ML",
    },
    {
      from: /CHUCHIE\s*180ML/i,
      to: "CHUCKIE 180ML",
    },
    {
      from: /CHUCKY\s*180M/i,
      to: "CHUCKIE 180ML",
    },
    {
      from: /BEAR\s*BRND\s*150G/i,
      to: "BEAR BRAND 150G",
    },
    {
      from: /BER\s*BRAND\s*150G/i,
      to: "BEAR BRAND 150G",
    },
    {
      from: /BEARBRAND\s*150/i,
      to: "BEAR BRAND 150G",
    },
    {
      from: /BRAND\s*BEAR\s*150G/i,
      to: "BEAR BRAND 150G",
    },
    {
      from: /ENR\s*3\s*HILO'?C\s*¥\s*pogago/i,
      to: "MILO C M PDR 300G",
    },
    {
      from: /MILO\s*C\s*M\s*PDRO*300/i,
      to: "MILO C M PDR 300G",
    },
    {
      from: /MILO\s*CMP\s*300G/i,
      to: "MILO C M PDR 300G",
    },
    {
      from: /MILO\s*C\s*M\s*POWDER\s*300/i,
      to: "MILO C M PDR 300G",
    },
    {
      from: /MILO\s*C\s*M\s*PDR\s*30O/i,
      to: "MILO C M PDR 300G",
    },
    {
      from: /MILO\s*C\s*M\s*PRD\s*300G/i,
      to: "MILO C M PDR 300G",
    },
    {
      from: /MILO\s*CM\s*PD\s*300/i,
      to: "MILO C M PDR 300G",
    },
    {
      from: /MILO\s*C\s*M\s*P0W\s*300/i,
      to: "MILO C M PDR 300G",
    },
    {
      from: /§\s*BRAND\s*INST\s*335/i,
      to: "BEAR BRAND INSTANT 33G",
    },
    {
      from: /BEAR\s*BRND\s*INST\s*33/i,
      to: "BEAR BRAND INSTANT 33G",
    },
    {
      from: /BEAR\s*BRAN\s*INSTA\s*33/i,
      to: "BEAR BRAND INSTANT 33G",
    },
    {
      from: /BRND\s*INST\s*33/i,
      to: "BEAR BRAND INSTANT 33G",
    },
    {
      from: /BEAR\s*INSTANT\s*335/i,
      to: "BEAR BRAND INSTANT 33G",
    },
    {
      from: /NESCAFE\s*CLS\s*20/i,
      to: "NESCAFE CLS 20G",
    },
    {
      from: /NESCAFE\s*CLAS\s*20/i,
      to: "NESCAFE CLS 20G",
    },
    {
      from: /NESCAF\s*CLS\s*20/i,
      to: "NESCAFE CLS 20G",
    },
    {
      from: /NESCAFE\s*C\s*20/i,
      to: "NESCAFE CLS 20G",
    },
    {
      from: /NESCAFEE\s*CLS\s*20/i,
      to: "NESCAFE CLS 20G",
    },
    {
      from: /NIDO\s*3\+\s*1/i,
      to: "NIDO 3+ 1.2KG",
    },
    {
      from: /Nido®\s*3\+\s*Powdered\s*Milk.*1\.2/i,
      to: "NIDO 3+ 1.2KG",
    },
    {
      from: /NIDO\s*3\+\s*PDR.*1\.2/i,
      to: "NIDO 3+ 1.2KG",
    },
    {
      from: /Powdered\s*Milk\s*Drink.*1\.6/i,
      to: "NIDO 3+ 1.6KG",
    },
    {
      from: /Nido®\s*3\+.*1\.6/i,
      to: "NIDO 3+ 1.6KG",
    },
    {
      from: /NIDO\s*3\+.*1600/i,
      to: "NIDO 3+ 1.6KG",
    },
    {
      from: /Nido®\s*3\+.*2kg/i,
      to: "NIDO 3+ 2KG",
    },
    {
      from: /NIDO\s*3\+\s*PDR.*2000/i,
      to: "NIDO 3+ 2KG",
    },
    {
      from: /NIDO\s*ADV.*3\+.*2kg/i,
      to: "NIDO 3+ 2KG",
    },
    {
      from: /NIDO®?\s*3\+.*2\.4/i,
      to: "NIDO 3+ 2.4KG",
    },
    {
      from: /Nido\s*3\+.*2400/i,
      to: "NIDO 3+ 2.4KG",
    },
    {
      from: /Nido®\s*3\+.*4kg/i,
      to: "NIDO 3+ 4KG",
    },
    {
      from: /NIDO\s*3\+.*2kg\s*x\s*2/i,
      to: "NIDO 3+ 4KG",
    },
    {
      from: /NIDO®?\s*3\+.*4\.8kg/i,
      to: "NIDO 3+ 4.8KG",
    },
    {
      from: /NIDO\s*3\+.*1600.*3/i,
      to: "NIDO 3+ 4.8KG",
    },
    {
      from: /Nido®\s*3\+.*6kg/i,
      to: "NIDO 3+ 6KG",
    },
    {
      from: /NIDO\s*3\+.*2000.*3/i,
      to: "NIDO 3+ 6KG",
    },
    {
      from: /Nido®\s*3\+.*7\.2kg/i,
      to: "NIDO 3+ 7.2KG",
    },
    {
      from: /NIDO\s*3\+.*2400.*3/i,
      to: "NIDO 3+ 7.2KG",
    },
    {
      from: /NIDO\s*5\+.*1\.2/i,
      to: "NIDO 5+ 1.2KG",
    },
    {
      from: /Nido®\s*5\+.*1\.2/i,
      to: "NIDO 5+ 1.2KG",
    },
    {
      from: /NIDO\s*5\+.*1200/i,
      to: "NIDO 5+ 1.2KG",
    },
    {
      from: /NIDO\s*5\+.*2kg/i,
      to: "NIDO 5+ 2KG",
    },
    {
      from: /Nido®\s*5\+.*2000/i,
      to: "NIDO 5+ 2KG",
    },
    {
      from: /Nido®\s*5\+.*4kg/i,
      to: "NIDO 5+ 4KG",
    },
    {
      from: /NIDO\s*5\+.*2kg\s*x\s*2/i,
      to: "NIDO 5+ 4KG",
    },
    {
      from: /CHCKIE.*1L/i,
      to: "CHUCKIE CHOCOLATE-FLAVOURED MILK 1L",
    },
    {
      from: /CHUCKY.*1L/i,
      to: "CHUCKIE CHOCOLATE-FLAVOURED MILK 1L",
    },
    {
      from: /Chockie.*1000ml/i,
      to: "CHUCKIE CHOCOLATE-FLAVOURED MILK 1L",
    },
    {
      from: /Chuckie\s*Chocolate.*1000/i,
      to: "CHUCKIE CHOCOLATE-FLAVOURED MILK 1L",
    },
    {
      from: /CHCKIE.*110/i,
      to: "CHUCKIE CHOCOLATE MILK 110ML",
    },
    {
      from: /Chucke.*110/i,
      to: "CHUCKIE CHOCOLATE MILK 110ML",
    },
    {
      from: /Chokie.*110ml/i,
      to: "CHUCKIE CHOCOLATE MILK 110ML",
    },
    {
      from: /Chuckie\s*Choco.*110/i,
      to: "CHUCKIE CHOCOLATE MILK 110ML",
    },
    {
      from: /CHCKIE.*180/i,
      to: "CHUCKIE CHOCOLATE MILK 180ML",
    },
    {
      from: /Chukie.*180/i,
      to: "CHUCKIE CHOCOLATE MILK 180ML",
    },
    {
      from: /Chocky.*180ml/i,
      to: "CHUCKIE CHOCOLATE MILK 180ML",
    },
    {
      from: /Chuckie\s*Choco.*180/i,
      to: "CHUCKIE CHOCOLATE MILK 180ML",
    },
    {
      from: /B0NKiD\s*PRESCHL\s*MLK\s*3\+\s*1\.2kq/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.2kg",
    },
    {
      from: /BONKID\s*PRSCHL\s*MK\s*3\+\s*12kg/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.2kg",
    },
    {
      from: /B0N4KD\s*PR3SCH00L\s*M1LK\s*3\+\s*1\.2/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.2kg",
    },
    {
      from: /BONNK1D\s*PRE-SKUL\s*ML1C\s*3\+\s*12/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.2kg",
    },
    {
      from: /BONAQD\s*PRSHCOL\s*MLK\s*3\+\s*1_2/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.2kg",
    },
    {
      from: /BONK1D\s*PRESC0OL\s*MLIK\s*3\+\s*24kg/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 2.4kg",
    },
    {
      from: /B0NAKD\s*PR-SCHOL\s*M1LK\s*3\+\s*2\.4g/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 2.4kg",
    },
    {
      from: /BON4K1D\s*PRE-SCHL\s*MLQ\s*3\+\s*2-4/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 2.4kg",
    },
    {
      from: /BONNKD\s*PRSCHL\s*MILC\s*3\+\s*2o4/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 2.4kg",
    },
    {
      from: /B0NK!D\s*PRSCOL\s*MLK\s*3\+\s*2.4k9/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 2.4kg",
    },
    {
      from: /BONKD\s*PRESCHOO\s*MLC\s*3\+\s*35og/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 350g",
    },
    {
      from: /BONNKD\s*PRSC0OL\s*MIK\s*3\+\s*3S0/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 350g",
    },
    {
      from: /B0N4K1D\s*PRESKL\s*MLQ\s*3\+\s*350/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 350g",
    },
    {
      from: /BONKID\s*PRSCHUL\s*M1LK\s*3\+\s*3-50/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 350g",
    },
    {
      from: /BONQK1D\s*PRSCOL\s*MLK\s*3\+\s*35g/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 350g",
    },
    {
      from: /BONK!D\s*PRE\s*SKOOL\s*MLK\s*3\+\s*16kg/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.6kg",
    },
    {
      from: /B0NAKD\s*PRSCL\s*M1LK\s*3\+\s*1\.6/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.6kg",
    },
    {
      from: /BONNKD\s*PRSHCOL\s*ML1C\s*3\+\s*16/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.6kg",
    },
    {
      from: /BON4KD\s*PRESC0OL\s*MILK\s*3\+\s*1-6/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.6kg",
    },
    {
      from: /BONK1D\s*PRSCL\s*MLQ\s*3\+\s*16kg/i,
      to: "BONAKID PRE-SCHOOL MILK 3+ 1.6kg",
    },
    {
      from: /BONNNA\s*MATRNAL\s*MLIK\s*VNL\s*350/i,
      to: "BONINA MATERNAL MILK VANILLA 350g",
    },
    {
      from: /BONINA\s*MTRNL\s*MK\s*VANILA\s*35og/i,
      to: "BONINA MATERNAL MILK VANILLA 350g",
    },
    {
      from: /BONlN4\s*MTRNLL\s*M1LK\s*VANLLA\s*350/i,
      to: "BONINA MATERNAL MILK VANILLA 350g",
    },
    {
      from: /BONENA\s*MATRL\s*MLC\s*VNILA\s*3-50/i,
      to: "BONINA MATERNAL MILK VANILLA 350g",
    },
    {
      from: /B0NINA\s*MATERNL\s*MK\s*VNL\s*350g/i,
      to: "BONINA MATERNAL MILK VANILLA 350g",
    },
    {
      from: /PR0MlL\s*F0R\s*3\+\s*6009/i,
      to: "PROMIL FOUR 3+ 600g",
    },
    {
      from: /PR0Ml\s*FUR\s*3\+\s*6ooG/i,
      to: "PROMIL FOUR 3+ 600g",
    },
    {
      from: /P0M!L\s*FOR\s*3\+\s*6O0/i,
      to: "PROMIL FOUR 3+ 600g",
    },
    {
      from: /PR0MlL\s*F0VR\s*3\+\s*60g/i,
      to: "PROMIL FOUR 3+ 600g",
    },
    {
      from: /PqRMIL\s*F0UR\s*3\+\s*600/i,
      to: "PROMIL FOUR 3+ 600g",
    },
    {
      from: /PROM1L\s*F0R\s*3\+\s*1\.2k9/i,
      to: "PROMIL FOUR 3+ 1.2kg",
    },
    {
      from: /P0MlL\s*FOUR\s*3\+\s*12kg/i,
      to: "PROMIL FOUR 3+ 1.2kg",
    },
    {
      from: /PR0MIL\s*F0UR\s*3\+\s*1_2/i,
      to: "PROMIL FOUR 3+ 1.2kg",
    },
    {
      from: /PROMiL\s*FUOR\s*3\+\s*12/i,
      to: "PROMIL FOUR 3+ 1.2kg",
    },
    {
      from: /PR0Ml\s*F0R\s*3\+\s*1\.2K/i,
      to: "PROMIL FOUR 3+ 1.2kg",
    },
    {
      from: /P0RMIL\s*F0UR\s*3\+\s*18kg/i,
      to: "PROMIL FOUR 3+ 1.8kg",
    },
    {
      from: /PR0M!L\s*F0R\s*3\+\s*1-8/i,
      to: "PROMIL FOUR 3+ 1.8kg",
    },
    {
      from: /PR0Ml\s*FOUR\s*3\+\s*1\.8/i,
      to: "PROMIL FOUR 3+ 1.8kg",
    },
    {
      from: /PR0MlL\s*FUR\s*3\+\s*18/i,
      to: "PROMIL FOUR 3+ 1.8kg",
    },
    {
      from: /PROMiL\s*F0R\s*3\+\s*1O8/i,
      to: "PROMIL FOUR 3+ 1.8kg",
    },
    {
      from: /PROM1L\s*F0R\s*3\+\s*24kg/i,
      to: "PROMIL FOUR 3+ 2.4kg",
    },
    {
      from: /P0Ml\s*FOUR\s*3\+\s*2\.4/i,
      to: "PROMIL FOUR 3+ 2.4kg",
    },
    {
      from: /PR0Ml\s*F0VR\s*3\+\s*2-4/i,
      to: "PROMIL FOUR 3+ 2.4kg",
    },
    {
      from: /PqRMIL\s*FUOR\s*3\+\s*24/i,
      to: "PROMIL FOUR 3+ 2.4kg",
    },
    {
      from: /PR0M!L\s*FOR\s*3\+\s*24kg/i,
      to: "PROMIL FOUR 3+ 2.4kg",
    },
    {
      from: /PROM1L\s*G0LD\s*F0R\s*3\+\s*1\.2kg/i,
      to: "PROMIL GOLD FOUR 3+ 1.2kg",
    },
    {
      from: /P0MlL\s*GLD\s*FOUR\s*3\+\s*12/i,
      to: "PROMIL GOLD FOUR 3+ 1.2kg",
    },
    {
      from: /PR0Ml\s*GOLD\s*FUR\s*3\+\s*1_2/i,
      to: "PROMIL GOLD FOUR 3+ 1.2kg",
    },
    {
      from: /PR0MIL\s*G0LD\s*F0VR\s*3\+\s*12/i,
      to: "PROMIL GOLD FOUR 3+ 1.2kg",
    },
    {
      from: /PR0Ml\s*GL0D\s*F0R\s*3\+\s*12kg/i,
      to: "PROMIL GOLD FOUR 3+ 1.2kg",
    },
    {
      from: /PR0MIL\s*GL0D\s*F0R\s*3\+\s*18kg/i,
      to: "PROMIL GOLD FOUR 3+ 1.8kg",
    },
    {
      from: /PROM1L\s*GOLD\s*F0UR\s*3\+\s*1\.8/i,
      to: "PROMIL GOLD FOUR 3+ 1.8kg",
    },
    {
      from: /P0MlL\s*G0LD\s*F0R\s*3\+\s*1-8/i,
      to: "PROMIL GOLD FOUR 3+ 1.8kg",
    },
    {
      from: /PR0Ml\s*GOLD\s*FUR\s*3\+\s*18/i,
      to: "PROMIL GOLD FOUR 3+ 1.8kg",
    },
    {
      from: /PqRMIL\s*GLD\s*F0R\s*3\+\s*108/i,
      to: "PROMIL GOLD FOUR 3+ 1.8kg",
    },
    {
      from: /PR0MlL\s*G0LD\s*F0UR\s*3\+\s*24kg/i,
      to: "PROMIL GOLD FOUR 3+ 2.4kg",
    },
    {
      from: /PROMiL\s*GOLD\s*F0R\s*3\+\s*2\.4/i,
      to: "PROMIL GOLD FOUR 3+ 2.4kg",
    },
    {
      from: /PR0MIL\s*GL0D\s*F0VR\s*3\+\s*24/i,
      to: "PROMIL GOLD FOUR 3+ 2.4kg",
    },
    {
      from: /P0Ml\s*GOLD\s*FUR\s*3\+\s*24/i,
      to: "PROMIL GOLD FOUR 3+ 2.4kg",
    },
    {
      from: /PR0Ml\s*GL0D\s*F0R\s*3\+\s*2O4/i,
      to: "PROMIL GOLD FOUR 3+ 2.4kg",
    },
    {
      from: /GR?B?R\s*Apl?sauce\s*Bby\s*F[0o]d\s*80?/i,
      to: "GERBER Applesauce Baby Food 80g",
    },
    {
      from: /G3R?B?ER\s*Appl?sauc[e]?\s*BbyFd?\s*8[Oo]g/i,
      to: "GERBER Applesauce Baby Food 80g",
    },
    {
      from: /GER[8B]ER\s*Apl?Sauce\s*Babee?\s*F[o0]od\s*80q/i,
      to: "GERBER Applesauce Baby Food 80g",
    },
    {
      from: /GERBER\s*ApplSauc\s*Baby\s*Fd\s*8O/i,
      to: "GERBER Applesauce Baby Food 80g",
    },
    {
      from: /GEBER\s*AplSauce\s*Babi\s*F00d\s*80g/i,
      to: "GERBER Applesauce Baby Food 80g",
    },
    {
      from: /GRB3R\s*Aple\s*Sauce\s*BabyFo0d\s*80/i,
      to: "GERBER Applesauce Baby Food 80g",
    },
    {
      from: /GERB3R\s*Applsauce\s*Bby\s*Fod\s*8Og/i,
      to: "GERBER Applesauce Baby Food 80g",
    },
    {
      from: /GR?B?R\s*Bn?a\s*Pree\s*Bby\s*F[0o]od\s*80?/i,
      to: "GERBER Banana Puree Baby Food 80g",
    },
    {
      from: /GER[8B]ER\s*Banana\s*Pure\s*Babee?\s*F[o0]od\s*8[Oo]g/i,
      to: "GERBER Banana Puree Baby Food 80g",
    },
    {
      from: /GEBER\s*Bnna\s*Pure\s*Bby\s*F0od\s*80q/i,
      to: "GERBER Banana Puree Baby Food 80g",
    },
    {
      from: /GRB3R\s*Bananna\s*Püre\s*BbyFd\s*80g/i,
      to: "GERBER Banana Puree Baby Food 80g",
    },
    {
      from: /GERBR\s*Banana\s*Pur\s*Babi\s*Fd\s*8O/i,
      to: "GERBER Banana Puree Baby Food 80g",
    },
    {
      from: /GERB3R\s*Bnna\s*Puree\s*Bby\s*Fo0d\s*80g/i,
      to: "GERBER Banana Puree Baby Food 80g",
    },
    {
      from: /G3RBER\s*Ban\s*Puree\s*BabyFud\s*8Og/i,
      to: "GERBER Banana Puree Baby Food 80g",
    },
    {
      from: /GR?B?R\s*Car[0o]t\s*Pree\s*Bby\s*F[0o]od\s*80?/i,
      to: "GERBER Carrot Puree Baby Food 80g",
    },
    {
      from: /GER[8B]ER\s*Carrot\s*Pure\s*BabeeFo0d\s*8Og/i,
      to: "GERBER Carrot Puree Baby Food 80g",
    },
    {
      from: /GERB3R\s*Carot\s*Puree\s*BbyFd\s*80g/i,
      to: "GERBER Carrot Puree Baby Food 80g",
    },
    {
      from: /G3RBER\s*Carr0t\s*Püre\s*Babi\s*F00d\s*80q/i,
      to: "GERBER Carrot Puree Baby Food 80g",
    },
    {
      from: /GRB3R\s*Carrot\s*Pur\s*Bby\s*Fo0d\s*8O/i,
      to: "GERBER Carrot Puree Baby Food 80g",
    },
    {
      from: /GEBER\s*Car0\s*Puree\s*BabyFo0d\s*80g/i,
      to: "GERBER Carrot Puree Baby Food 80g",
    },
    {
      from: /GERBR\s*Carot\s*Pree\s*Bby\s*Fd\s*8Og/i,
      to: "GERBER Carrot Puree Baby Food 80g",
    },
    {
      from: /GER[8B]?R\s*Sq?uash\s*Pree\s*Bby\s*F[o0]od\s*80?/i,
      to: "GERBER Squash Puree Baby Food 80g",
    },
    {
      from: /G3R?B?ER\s*Sq[ua]+sh\s*Puree\s*BbyFd?\s*8[Oo]g/i,
      to: "GERBER Squash Puree Baby Food 80g",
    },
    {
      from: /GERB3R\s*Squash\s*Pur\s*Babee\s*Fo0d\s*80q/i,
      to: "GERBER Squash Puree Baby Food 80g",
    },
    {
      from: /GRBR\s*Sqash\s*Pure\s*Bby\s*Fo0d\s*80g/i,
      to: "GERBER Squash Puree Baby Food 80g",
    },
    {
      from: /GEBER\s*Sqush\s*Püre\s*Babi\s*F00d\s*8O/i,
      to: "GERBER Squash Puree Baby Food 80g",
    },
    {
      from: /GERBR\s*Sqsh\s*Pure\s*Bby\s*Fo0d\s*80g/i,
      to: "GERBER Squash Puree Baby Food 80g",
    },
    {
      from: /GRB3R\s*Squash\s*Pree\s*BabyFo0d\s*8Og/i,
      to: "GERBER Squash Puree Baby Food 80g",
    },
    {
      from: /GR?B?R\s*Bn?a\s*Strawberr[yie]+\s*Bby\s*F[o0]od\s*130?/i,
      to: "GERBER Banana Strawberry Baby Food 130g",
    },
    {
      from: /GER[8B]ER\s*Ban[a]?na\s*Strawb[ae]*rry\s*BabyFd?\s*13[0o]g/i,
      to: "GERBER Banana Strawberry Baby Food 130g",
    },
    {
      from: /G3RBER\s*Ban\s*Strawbery\s*BabyFd\s*130q/i,
      to: "GERBER Banana Strawberry Baby Food 130g",
    },
    {
      from: /GERB3R\s*Banana\s*Strwbrry\s*Bby\s*Fd\s*13O/i,
      to: "GERBER Banana Strawberry Baby Food 130g",
    },
    {
      from: /GRB3R\s*Bnna\s*Strawberee\s*BabyFo0d\s*130g/i,
      to: "GERBER Banana Strawberry Baby Food 130g",
    },
    {
      from: /GERBR\s*Banan\s*Strwbery\s*Babi\s*F00d\s*13Og/i,
      to: "GERBER Banana Strawberry Baby Food 130g",
    },
    {
      from: /GEBER\s*Bnna\s*Strwbrr\s*BabeeFo0d\s*130g/i,
      to: "GERBER Banana Strawberry Baby Food 130g",
    },
    {
      from: /GR?B?R\s*Mix[e]?\s*Veg(?:etable|tabl)\s*Puree\s*Bby\s*F[o0]od\s*125?/i,
      to: "GERBER Mixed Vegetable Puree Baby Food 125g",
    },
    {
      from: /G3RBER\s*Mix\s*Veg\s*Pree\s*BabyFd?\s*12Sg/i,
      to: "GERBER Mixed Vegetable Puree Baby Food 125g",
    },
    {
      from: /GER[8B]ER\s*Mix\s*Vegtbl\s*Püre\s*Babi\s*F0od\s*125q/i,
      to: "GERBER Mixed Vegetable Puree Baby Food 125g",
    },
    {
      from: /GERBR\s*Mxd\s*Vgetable\s*Puree\s*Bby\s*Fd\s*125g/i,
      to: "GERBER Mixed Vegetable Puree Baby Food 125g",
    },
    {
      from: /GEBER\s*Mixd\s*Veg\s*Pur\s*BabeeFo0d\s*12Og/i,
      to: "GERBER Mixed Vegetable Puree Baby Food 125g",
    },
    {
      from: /GRB3R\s*Mix\s*Vegtbl\s*Pree\s*BabyFo0d\s*125g/i,
      to: "GERBER Mixed Vegetable Puree Baby Food 125g",
    },
    {
      from: /CER[8B]LAC\s*Mix[e3]d?\s*Veg(?:etable|tbl)?\s*&\s*Soya\s*Infant\s*Cereal\s*120?/i,
      to: "CERELAC Mixed Vegetable & Soya Infant Cereal 120g",
    },
    {
      from: /CERELAC\s*Mx\s*Vegtbl\s*&\s*Soya\s*Infnt\s*Cere[ae]l\s*120g/i,
      to: "CERELAC Mixed Vegetable & Soya Infant Cereal 120g",
    },
    {
      from: /CERELAC\s*Mi[xk]\s*Veg & S0ya\s*Infant\s*Cereall?\s*120g/i,
      to: "CERELAC Mixed Vegetable & Soya Infant Cereal 120g",
    },
    {
      from: /CER[8B]LAC\s*Wheat\s*Bann?a\s*(?:and|&)\s*Milk\s*Infnt\s*Cereal\s*120?/i,
      to: "CERELAC Wheat Banana and Milk Infant Cereal 120g",
    },
    {
      from: /CERELAC\s*Whe@t\s*Banana\s*&\s*Mi1k\s*Infant\s*Cereal\s*120g/i,
      to: "CERELAC Wheat Banana and Milk Infant Cereal 120g",
    },
    {
      from: /CERELAC\s*Wht\s*Bann?\s*Milk\s*Infnt\s*Cere@l\s*120g/i,
      to: "CERELAC Wheat Banana and Milk Infant Cereal 120g",
    },
    {
      from: /CER[8B]LAC\s*R1ce\s*&\s*S0ya\s*Infant\s*Cereal\s*120?/i,
      to: "CERELAC Rice & Soya Infant Cereal 120g",
    },
    {
      from: /CERELAC\s*Rice\s*and\s*Soya\s*Infnt\s*Cereal\s*120g/i,
      to: "CERELAC Rice & Soya Infant Cereal 120g",
    },
    {
      from: /CERELAC\s*R1ce\s*&\s*Soya\s*Infant\s*C3real\s*120g/i,
      to: "CERELAC Rice & Soya Infant Cereal 120g",
    },
    {
      from: /CER[8B]LAC\s*Mix[e3]d?\s*Fruit[s]?\s*&\s*Soya\s*Infant\s*Cereal\s*120?/i,
      to: "CERELAC Mixed Fruits & Soya Infant Cereal 120g",
    },
    {
      from: /CERELAC\s*Mx\s*Fru1t[s]?\s*&\s*Soya\s*Infnt\s*Cereal\s*120g/i,
      to: "CERELAC Mixed Fruits & Soya Infant Cereal 120g",
    },
    {
      from: /CERELAC\s*Mixd\s*Frui@s\s*&\s*S0ya\s*Infant\s*Cere@l\s*120g/i,
      to: "CERELAC Mixed Fruits & Soya Infant Cereal 120g",
    },
    {
      from: /CER[8B]LAC\s*Wheat\s*Bann?a\s*&\s*Milk\s*Infnt\s*Cereal\s*250?/i,
      to: "CERELAC Wheat Banana & Milk Infant Cereal 250g",
    },
    {
      from: /CERELAC\s*Whe@t\s*Banana\s*&\s*Mi1k\s*Infant\s*Cereal\s*250g/i,
      to: "CERELAC Wheat Banana & Milk Infant Cereal 250g",
    },
    {
      from: /CERELAC\s*Wht\s*Bann?\s*Milk\s*Infnt\s*Cere@l\s*250g/i,
      to: "CERELAC Wheat Banana & Milk Infant Cereal 250g",
    },
    {
      from: /CER[8B]LAC\s*R1ce\s*&\s*S0ya\s*Infant\s*Cereal\s*250?/i,
      to: "CERELAC Rice & Soya Infant Cereal 250g",
    },
    {
      from: /CERELAC\s*Rice\s*and\s*Soya\s*Infnt\s*Cereal\s*250g/i,
      to: "CERELAC Rice & Soya Infant Cereal 250g",
    },
    {
      from: /CERELAC\s*R1ce\s*&\s*Soya\s*Infant\s*C3real\s*250g/i,
      to: "CERELAC Rice & Soya Infant Cereal 250g",
    },
    {
      from: /CER[8B]LAC\s*Homestyle\s*Meal[s]?\s*Rice\s*and\s*Chicken\s*Porridge\s*200?/i,
      to: "CERELAC Homestyle Meals Rice and Chicken Porridge 200g",
    },
    {
      from: /CERELAC\s*Homestyle\s*Meals\s*R1ce\s*Ch1cken\s*Porridge\s*200g/i,
      to: "CERELAC Homestyle Meals Rice and Chicken Porridge 200g",
    },
    {
      from: /CER[8B]LAC\s*Homestyle\s*Meal[s]?\s*Rice\s*and\s*Veggies\s*Porridge\s*200?/i,
      to: "CERELAC Homestyle Meals Rice and Veggies Porridge 200g",
    },
    {
      from: /CERELAC\s*Homestyle\s*Meals\s*R1ce\s*Veggies\s*Porridge\s*200g/i,
      to: "CERELAC Homestyle Meals Rice and Veggies Porridge 200g",
    },
    {
      from: /CER[8B]LAC\s*Nutripuffs\s*Strawberry\s*Infant\s*Snack\s*50g/i,
      to: "CERELAC Nutripuffs Strawberry Infant Snack 50g - Pack of 2",
    },
    {
      from: /CERELAC\s*Nutripuffs\s*Strawberry\s*Infnt\s*Snack\s*50g/i,
      to: "CERELAC Nutripuffs Strawberry Infant Snack 50g - Pack of 2",
    },
    {
      from: /CERELAC\s*Nutripuff[s]?\s*Strawb3rry\s*Infant\s*Snack\s*50g/i,
      to: "CERELAC Nutripuffs Strawberry Infant Snack 50g - Pack of 2",
    },
    {
      from: /NAN[8B]KID\s*OptiPro\s*Four\s*Powdered\s*Milk\s*For\s*Children\s*Above\s*3\s*Years\s*Old\s*1[.,]?3kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 1.3kg",
    },
    {
      from: /Nankid\s*OptiPro\s*4\s*Powdered\s*Milk\s*4Children\s*Above\s*3Y?ears\s*Old\s*1[.,]?3kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 1.3kg",
    },
    {
      from: /NAN[kK]ID\s*OptiPr0\s*Four\s*P0wdered\s*Milk\s*Children\s*Above\s*3\s*Years\s*0ld\s*1[.,]?3kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 1.3kg",
    },
    {
      from: /NAN[8B]KID\s*OptiPro\s*Four\s*Powdered\s*Milk\s*For\s*Children\s*Above\s*3\s*Years\s*Old\s*2[.,]?4kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 2.4kg",
    },
    {
      from: /Nankid\s*OptiPr0\s*Four\s*Powdered\s*Milk\s*4Children\s*Above\s*3Y?ears\s*0ld\s*2[.,]?4kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 2.4kg",
    },
    {
      from: /NANKID\s*OptiPro\s*4\s*P0wdered\s*Milk\s*Children\s*Above\s*3\s*Y?ears\s*Old\s*2[.,]?4kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 2.4kg",
    },
    {
      from: /NANKID\s*OptiPro\s*Four\s*P0wdered\s*Milk\s*Children\s*Above\s*3\s*Years\s*Old\s*4[.,]?8kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 4.8kg [2.4kg x 2]",
    },
    {
      from: /Nankid\s*OptiPr0\s*4\s*Powdered\s*Milk\s*4Children\s*Above\s*3Y?ears\s*Old\s*4[.,]?8kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 4.8kg [2.4kg x 2]",
    },
    {
      from: /NANKID\s*OptiPro\s*Four\s*Powdered\s*Milk\s*Children\s*Above\s*3\s*Years\s*Old\s*5[.,]?2kg/i,
      to: "NANKID® OPTIPRO® Four Powdered Milk For Children Above 3 Years Old 5.2kg [1.3kg x 4]",
    },
    {
      from: /Nankid\s*OptiPr0\s*4\s*Powdered\s*Milk\s*4Children\s*Above\s*3Y?ears\s*Old\s*5[.,]?2kg/i,
      to: "NANKID® OPTIPRO® Four Powdered Milk For Children Above 3 Years Old 5.2kg [1.3kg x 4]",
    },
    {
      from: /NANKID\s*OptiPro\s*Four\s*Powdered\s*Milk\s*Children\s*Above\s*3\s*Years\s*Old\s*7[.,]?2kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 7.2kg [2.4kg x 3]",
    },
    {
      from: /Nankid\s*OptiPr0\s*4\s*P0wdered\s*Milk\s*4Children\s*Above\s*3Y?ears\s*Old\s*7[.,]?2kg/i,
      to: "NANKID® OptiPro® Four Powdered Milk For Children Above 3 Years Old 7.2kg [2.4kg x 3]",
    },
    {
      from: /NANKID\s*InfiniPr0\s*HA\s*Four\s*Powdered\s*Milk\s*Children\s*Above\s*3\s*Years\s*Old\s*800g/i,
      to: "NANKID® InfiniPro® HA Four Powdered Milk For Children Above 3 Years Old 800g",
    },
    {
      from: /Nankid\s*InfiniPr0\s*HA\s*4\s*Powdered\s*Milk\s*4Children\s*Above\s*3Y?ears\s*0ld\s*800g/i,
      to: "NANKID® InfiniPro® HA Four Powdered Milk For Children Above 3 Years Old 800g",
    },
    {
      from: /NAN[8B]KID\s*InfiniPro\s*HA\s*Four\s*P0wdered\s*Milk\s*Children\s*Above\s*3\s*Years\s*Old\s*800g/i,
      to: "NANKID® InfiniPro® HA Four Powdered Milk For Children Above 3 Years Old 800g",
    },
    {
      from: /ASCENDA\s*KID\s*3-7Y\s*POWDERED\s*MILK\s*400g/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 400g",
    },
    {
      from: /ASCENDA\s*K1D\s*3-7Y\s*P0wdered\s*Mi1k\s*400g/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 400g",
    },
    {
      from: /ASCENDA\s*KID\s*3-7\s*Y\s*Powdrd\s*Milk\s*400g/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 400g",
    },
    {
      from: /ASC[8B]NDA\s*KID\s*3-7Y\s*P0wdrd\s*Mi1k\s*400g/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 400g",
    },
    {
      from: /ASCENDA\s*KID\s*3-7Y\s*P0wdered\s*M1lk\s*400g/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 400g",
    },
    {
      from: /ASCENDA\s*KID\s*3-7Y\s*POWDERED\s*MILK\s*1[.,]?6Kg/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 1.6Kg",
    },
    {
      from: /ASCENDA\s*K1D\s*3-7Y\s*P0wdered\s*Mi1k\s*1[.,]?6kg/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 1.6Kg",
    },
    {
      from: /ASCENDA\s*KID\s*3-7\s*Y\s*Powdrd\s*Milk\s*1[.,]?6kg/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 1.6Kg",
    },
    {
      from: /ASC[8B]NDA\s*KID\s*3-7Y\s*P0wdrd\s*Mi1k\s*1[.,]?6kg/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 1.6Kg",
    },
    {
      from: /ASCENDA\s*KID\s*3-7Y\s*P0wdered\s*M1lk\s*1[.,]?6kg/i,
      to: "ASCENDA KID 3-7Y POWDERED MILK 1.6Kg",
    },
    {
      from: /KitKat\s*2F\s*Original\s*17g\s*x\s*6/i,
      to: "KitKat 2F Original 17g x 6",
    },
    {
      from: /K1tKat\s*2F\s*Origina1\s*17g\s*x\s*6/i,
      to: "KitKat 2F Original 17g x 6",
    },
    {
      from: /KitKat\s*2-F\s*Original\s*17g\s*x\s*6/i,
      to: "KitKat 2F Original 17g x 6",
    },
    {
      from: /KitKat\s*2F\s*Or1ginal\s*17g\s*x\s*6/i,
      to: "KitKat 2F Original 17g x 6",
    },
    {
      from: /KitKat\s*2F\s*Original\s*17g/i,
      to: "KitKat 2F Original 17g",
    },
    {
      from: /K1tKat\s*2F\s*Origina1\s*17g/i,
      to: "KitKat 2F Original 17g",
    },
    {
      from: /KitKat\s*4[-]?Finger\s*Milk\s*Chocolate\s*Bar\s*35g/i,
      to: "KitKat 4-Finger Milk Chocolate Bar 35g",
    },
    {
      from: /K1tKat\s*4F\s*Milk\s*Ch0colate\s*Bar\s*35g/i,
      to: "KitKat 4-Finger Milk Chocolate Bar 35g",
    },
    {
      from: /KITKAT\s*Milk\s*Chocolate\s*4[-]?Finger\s*35g\s*Pack\s*of\s*4/i,
      to: "KITKAT Milk Chocolate 4-Finger 35g - Pack of 4",
    },
    {
      from: /K1TKAT\s*Milk\s*Choco\s*4F\s*35g\s*Pack\s*of\s*4/i,
      to: "KITKAT Milk Chocolate 4-Finger 35g - Pack of 4",
    },
    {
      from: /KitKat\s*Minis\s*9g\s*Pack\s*of\s*8/i,
      to: "KitKat Minis 9g - Pack of 8",
    },
    {
      from: /K1tKat\s*Minis\s*9g\s*-?\s*Pack\s*of\s*8/i,
      to: "KitKat Minis 9g - Pack of 8",
    },
    {
      from: /KitKat\s*Minis\s*9g/i,
      to: "KitKat Minis 9g",
    },
    {
      from: /K1tKat\s*Minis\s*9g/i,
      to: "KitKat Minis 9g",
    },
    {
      from: /KitKat\s*Fine\s*Dark\s*Chocolate\s*41[.,]?5g/i,
      to: "KitKat Fine Dark Chocolate 41.5g",
    },
    {
      from: /K1tKat\s*Fine\s*Dark\s*Choco\s*41\.5g/i,
      to: "KitKat Fine Dark Chocolate 41.5g",
    },
    {
      from: /KitKat\s*2F\s*Original\s*20G/i,
      to: "KitKat 2F Original 20G",
    },
    {
      from: /K1tKat\s*2F\s*Origina1\s*20G/i,
      to: "KitKat 2F Original 20G",
    },
    {
      from: /KitKat\s*4F\s*35G/i,
      to: "KitKat 4F 35G",
    },
    {
      from: /K1tKat\s*4F\s*35G/i,
      to: "KitKat 4F 35G",
    },
    {
      from: /KitKat\s*Minis\s*200G/i,
      to: "KitKat Minis 200G",
    },
    {
      from: /K1tKat\s*Minis\s*200G/i,
      to: "KitKat Minis 200G",
    },
    {
      from: /KitKat\s*Chunky\s*38G/i,
      to: "KitKat Chunky 38G",
    },
    {
      from: /K1tKat\s*Chunky\s*38G/i,
      to: "KitKat Chunky 38G",
    },
    {
      from: /KitKat\s*Dark\s*Chocolate\s*45G/i,
      to: "KitKat Dark Chocolate 45G",
    },
    {
      from: /K1tKat\s*Dark\s*Choco\s*45G/i,
      to: "KitKat Dark Chocolate 45G",
    },
    {
      from: /KitKat\s*Bites\s*40G/i,
      to: "KitKat Bites 40G",
    },
    {
      from: /K1tKat\s*B1tes\s*40G/i,
      to: "KitKat Bites 40G",
    },
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
    { from: /BEAR\s+8\s+FORTI000/i, to: "BEAR B FORT300g" },
    { from: /^BEAR\s*BRAND\s*(?:I00|l00|100)$/i, to: "BEAR BRAND 300g" },
    { from: /^BEARBRAND(?:I00|l00|100)$/i, to: "BEAR BRAND 300g" },

    { from: /WIDO3HPRE-51\s*6KG/i, to: "NIDO3+PRE-S1.6KG" },
    { from: /MIO034PRE-S7./i, to: "NIDO3+PRE-S2.4KG" },
    { from: /Milo\s*Act\s*ive\s*Golk?a/i, to: "MiloActiveGo1kg" },
    { from: /BEAR\s+BRANC(\s+PDR\s+MILK\s+\d+G)?/i, to: "BEAR BRAND$1" },
    { from: /Nestle\s*Chuckie\?+/i, to: "NestleChuckie" },
    { from: /^\+\s*/, to: "" },
    { from: /^7\s+(Bear\s+Brand\s+Fortified\s+Powdered\s+Milk\s+Drink\s+\d+(?:kg|g))/i, to: "$1" },

    {
      from: /3\s*Mo\s*roe\s*Tae\s*Sa\s*owed\s*Croce\s*Mak\s*lk\s*Ok\s*(\d+)\.?\s*packt\s*(\d+)/i,
      to: "Milo Zero Added Table Sugar Powdered Choco Malt Milk Drink $1g - Pack of $2",
    },
    {
      from: /(Milo Zero Added Table Sugar Powdered Choco Malt Milk Drink \d+g - Pack of \d+).*/i,
      to: "$1",
    },
    { from: /ils\s+etn\s+ma/i, to: "Milo ActiveGo 139.50" },
    { from: /Eto\s*10\s*2/i, to: "Ecobag" },
    {
      from: /ear\s+Bnd\s+orfed\s+Powdered\s+Mik\s*1/i,
      to: "Bear Brand Fortified Powdered Milk Drink 840g 347",
    },
    {
      from: /a\s+Mio\s+Powdered\s+Ghoco\s+Mal\s+Milk\s+Dink/i,
      to: "Milo Powdered Choco Malk Milk Drink 220",
    },
    { from: /BEAR\s*B50\s*:\s*ag/i, to: "BEAR BRAND POWDER IRON 33G 10 964.00" },
    { from: /B\s*BRAND\s+Mi[l|I]+\s*ha/i, to: "B BRAND MILK W/ IRON 33G 16 177.60" },
    {
      from: /H[I|1]L[O0]\s+ACT[I|1]GEN\s+E\s+S[CH]{1,2}ET\s*\d{1,3}[,]?/i,
      to: "MILO ACTIGEN E SACHET 22G(24G) 12 x 8.95 107.40",
    },
    {
      from: /M[I|1]L[O0]\s+ACT[I|1]V[-\s]*[G6][O0]?\s+WINNER\s+T[WVy]+\s+P[CcKkFfI1l]+/i,
      to: "MILO ACTIV-GO WINNER TWN PCK",
    },
    {
      from: /MILO ACTIV-60 WINNER Ty Fi/i,
      to: "MILO ACTIV-GO WINNER TWN PCK 48G 8 x 17.00 136.00",
    },
    {
      from: /=?\s*Buy\s+Nestea\s+Cleanse\s+Lemon\s+Cucumbe\.?/i,
      to: "Nestea Cleanse Lemon Cucumber 1box 860",
    },
    { from: /NILO\s+REF\s+3000\s*&\s*¢/i, to: "MILO REF 300G 97.00" },
    {
      from: /Li0kepLe\s*20g\s*\|\s*METRE.*71,40/i,
      to: "NESTEA APPLE 20G 74.40",
    },
    {
      from: /ha\s*eChuckiel10\s*no\s*3/i,
      to: "NestleChuckie110 14.50",
    },
    {
      from: /NESTLE\s+KokoCrunch\s*El\s*oo\s*2\.00\s*i/i,
      to: "NESTLE KokoCrunch 2 x 14.75 27",
    },
    {
      from: /BEAR\s+BRAND\s+ADULT\s+PLUS\s+MILK\s*300[60Oo]/i,
      to: "BEAR BRAND ADULT PLUS MILK 300G 1 133.75",
    },
    {
      from: /.*BEAR\s+BRAND\s+FCM\s*(\d+)[0Oo]/i,
      to: "BEAR BRAND FCM $1G",
    },
    {
      from: /NIDO\s*JR\s*\.?\s*mlKZ\.?\s*dk\s*1384(?:\.0*7)?/i,
      to: "NIDO JR. MILK 2.4kg 1384.00",
    },
    { from: /BEAR\s*BRAI[D]\s+FORTIFIED\s*i?/gi, to: "BEAR BRAND FORTIFIED" },
    { from: /BEAR\s*BRAND\s+FORTIF\s+(\d+)\s*i?/gi, to: "BEAR BRAND FORTIFIED $1G" },
    {
      from: /^.*?MILO\s*Ready[- ]to[- ]Drink[\s\S]*?(\d+)\s*m[\s\S]*/gi,
      to: "MILO Ready to Drink (RTD) $1 ml",
    },
    {
      from: /.*BRR?AND\s+I-?TRON\s*(\d+)/gi,
      to: "BBRAND W-IRON $1G",
    },
    {
      from: /(\d+)6G\b/gi,
      to: "$1G",
    },

    { from: /.*M[I1]LO/i, to: "MILO" }, // Remove leading characters before MILO
    { from: /Ready[-\s]*to[-\s]*Drin[kc]/i, to: "RTO" },
    { from: /Ready[-\s]*to[-\s]*Drink/i, to: "RTO" },
    {
      from: /(\d+)6G\b/gi,
      to: "$1G",
    },
    {
      from: /\bBEAR[R]?[A]?[I]?[D]?\b/i,
      to: "BEAR BRAND",
    },
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
