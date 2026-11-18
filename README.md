# Liver volumetry calculator

A static browser tool for entering body measurements and liver/tumor volumes and displaying the existing BMI, BSA and liver-volume calculations. Open `index.html` locally or serve this directory with `python3 -m http.server 8000`.

The calculator accepts known remnant volume or a resection-volume input. Finite positive body measurements and valid total/tumor/remnant relationships are required. Invalid input clears prior results; a new calculation invalidates pending animation frames so an old result cannot reappear after reset.

## Technical check

```bash
node tests/check_calculator.cjs index.html
```

This synthetic DOM check covers two valid modes, twelve invalid-input cases and stale animation reset. It checks software behavior only; it does not establish clinical validity of the existing equations or interpretation thresholds. The repair preserves those equations and thresholds.
