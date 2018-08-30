# HTML_CodeSniffer + Machine Learning Image Analyzer

## Image Analyzer Web App

This branch introduces changes to enable image content comparison to match the actual description of image tags,
in favor of increasing the level of compliance against WCAG.
Specifically targeting Guideline G94 and showing a warning when there's a mismatch on an image's alt text and the
analyzed image content.

Changes on this branch:

- Changes to the main js plugin so it can be used server-side.
- Includes a web app that allows users to use HMTLCS to validate against WCAG 2.0 - AAA
- Uses Amazon Rekognition + Google Cloud Vision API to analyze images and compare ```<img>``` elements and their alt
  attribute against the actual content of the image.

## Pre-requisites

- Obtain Google Cloud Vision Credentials and:
    - `export GOOGLE_APPLICATION_CREDENTIALS={your-credentials-json-file}`

- Obtain Amazon Rekognition Credentials and:
    - `export AWS_ACCESS_KEY_ID={your-aws-access-key-id}`
    - `export AWS_SECRET_ACCESS_KEY={your-aws-secret-access-key}`

## Build

- `npm install`
- `grunt build-debug`

## Run Web App

- `node web.js`

