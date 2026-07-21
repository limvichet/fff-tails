<template>
  <slot />
</template>

<style>
/* 1. GLOBAL PRINT FONTS & RESET */


:root {
  --page-width: 210mm;
  --page-padding: 13mm;
}

/* Ensure background colors print */
* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5; /* Light grey background for screen preview */
  font-family: "KrasarRegular", Arial, sans-serif !important;
  font-size: 11pt;
}

/* 2. THE PAGE WRAPPER (Paper Simulation) */
.page {
  width: var(--page-width);
  /* min-height: 297mm; /* Standard A4 height */
  min-height: 260mm; /* Standard A4 height */
  padding: var(--page-padding) var(--page-padding) 0 var(--page-padding);
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

/* 4. REUSABLE UTILITIES (Shared across all print pages) */
.row { display: flex; align-items: center;}
.start {align-items: start !important;}
.end {align-items: end !important;}
.between {justify-content: space-between;}
.around {justify-content: space-around;}
.right { text-align: right; }
.left { text-align: left; }
.center { text-align: center; }
.mb { margin-bottom: 10px; }
.mt { margin-top: 10px; }
.ml { margin-left: 10px; }
.mr { margin-right: 10px; }
.pl {padding-left: 5px;}
.v-space { height: 90px; }
.l-space { padding-left: 220px; }
.bold { font-weight: 700;}
.justify { text-align: justify !important; }

.loading {
  padding-top: 20px;
  text-align: center;
}

.col-1 { width: 10%; }
.col-2 { width: 20%; }
.col-3 { width: 25%; }
.col-4 { width: 33.33%; }
.col-8 { width: 66.66%; }
.col-10 { width: 80%; }
.logo { width: 60px; height: 60px; opacity: .9; object-fit: contain; }

h1, h2, h4 {font-family: "Muol", Arial, sans-serif !important;}
h6 {font-family: "Muol", Arial, sans-serif !important; font-size: 11px !important; margin-top: 4px;}
h1 { font-size: 13pt;}
h2 { font-size: 12pt;}
h3 { font-size: 11pt; font-weight: 700;}
h4 { font-size: 10pt;}
p { line-height: 1.6; font-size: 12pt !important;}
.fs-10 { font-size: 10pt !important;}
.fs-11 { font-size: 11pt !important;}
.fs-12 { font-size: 12pt !important;}
.fs-13 { font-size: 13pt !important;}
.color-blue { color: blue;}
.inden { text-indent: 40px;}
.inden-- { text-indent: -40px;}
.margin-l-40 { margin-left: 40px;}
.margin-l-80 { margin-left: 80px;}
.muol {font-family: "Muol", Arial, sans-serif !important;}
.tacteng {
  font-family: "tacteng", Arial, sans-serif !important;
  font-size: 16pt;
  line-height: 1.4;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th { font-weight: 900; }
td { font-size: 13px;}
table td, table th {
  padding: 5px 4px;
  border-bottom: 1px solid #ddd;
}
.border-all td, .border-all th {
  border: 1px solid #000;
}

/* 3. PRINT SPECIFIC RULES */
@media (prefers-color-scheme: dark) {
  .page {
    background: black;
    color: white;
  }
}

@media print {
  @page {
    size: A4;
    margin-bottom: var(--page-padding);
    color: #000;
  }

  body {
    background-color: white;
  }

  .page {
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    width: 100%;
    height: auto;
  }

  .no-print {
    display: none !important;
  }

  /* Prevent elements from breaking mid-content */
  footer, tfoot, .note, .table tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}


</style>