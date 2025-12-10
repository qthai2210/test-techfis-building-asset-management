import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { ensureUploadDir } from './fileUpload';

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    // Default uploads folder
    let uploadDir = 'public/uploads/';

    switch (true) {
      // -------- FARMER TRAINING FILES --------
      // ---------------------------------------
      case req.originalUrl.includes('/farmer-training-document-file'):
        uploadDir = 'public/uploads/farmer-training/document/';
        break;

      case req.originalUrl.includes('/farmer-training-plan-file'):
        uploadDir = 'public/uploads/farmer-training/plan/';
        break;

      case req.originalUrl.includes('/farmer-training-report-file'):
        uploadDir = 'public/uploads/farmer-training/report/';
        break;

      // -------- ICS TRAINING FILES -------
      // -----------------------------------
      case req.originalUrl.includes('/ics-training-document-file'):
        uploadDir = 'public/uploads/ics-training/document/';
        break;

      case req.originalUrl.includes('/ics-training-plan-file'):
        uploadDir = 'public/uploads/ics-training/plan/';
        break;

      case req.originalUrl.includes('/ics-training-report-file'):
        uploadDir = 'public/uploads/ics-training/report/';
        break;

      case req.originalUrl.includes('/ics-training-course-participant/upload-certificate'):
        uploadDir = 'public/uploads/ics-training/certificate/';
        break;

      // -------- FARM MAP FILES --------
      // --------------------------------
      case req.originalUrl.includes('/project-map-file'):
        uploadDir = 'public/uploads/farm-map/project/';
        break;

      case req.originalUrl.includes('/farmer-map-file'):
        uploadDir = 'public/uploads/farm-map/farmer/';
        break;

      // -------- AGREEMENT FILES --------
      // ---------------------------------
      case req.originalUrl.includes('/field-officer-agreement-file'):
        uploadDir = 'public/uploads/agreement/field-officer/';
        break;

      case req.originalUrl.includes('/internal-auditor-agreement-file'):
        uploadDir = 'public/uploads/agreement/internal-auditor/';
        break;

      // -------- FARMER FILES --------
      // ------------------------------
      case req.originalUrl.includes('/farmer-application-file'):
        uploadDir = 'public/uploads/farmer/application/';
        break;

      case req.originalUrl.includes('/farmer-contract-file'):
        uploadDir = 'public/uploads/farmer/contract/';
        break;

      case req.originalUrl.includes('/farmer-land-use-right-certificate-file'):
        uploadDir = 'public/uploads/farmer/land-use-right-certificate/';
        break;

      case req.originalUrl.includes('/memorandum-of-understanding-file'):
        uploadDir = 'public/uploads/farmer/memorandum-of-understanding/';
        break;

      case req.originalUrl.includes('/farmer/upload/front-identity-card'):
        uploadDir = 'public/uploads/farmer/front-identity-card/';
        break;

      case req.originalUrl.includes('/farmer/upload/back-identity-card'):
        uploadDir = 'public/uploads/farmer/back-identity-card/';
        break;

      // -------- PRODUCT STORAGE FILES --------
      // ---------------------------------------
      case req.originalUrl.includes('/product-storage-process-file'):
        uploadDir = 'public/uploads/product-storage/process/';
        break;

      case req.originalUrl.includes('/product-storage-plan-file'):
        uploadDir = 'public/uploads/product-storage/plan/';
        break;

      case req.originalUrl.includes('/product-storage-report-file'):
        uploadDir = 'public/uploads/product-storage/report/';
        break;

      // -------- LABEL PROFILE --------
      // -------------------------------
      case req.originalUrl.includes('/label-sample-file'):
        uploadDir = 'public/uploads/label-profile/sample/';
        break;

      case req.originalUrl.includes('/assessment-label-file'):
        uploadDir = 'public/uploads/label-profile/assessment/';
        break;

      // -------- MANUAL FILES --------
      // ------------------------------
      case req.originalUrl.includes('/jas-manual-file'):
        uploadDir = 'public/uploads/manual/JAS/';
        break;

      case req.originalUrl.includes('/ics-manual-file'):
        uploadDir = 'public/uploads/manual/ICS/';
        break;

      // -------- ORGANIC CERTIFICATE FILES --------
      // -------------------------------------------
      case req.originalUrl.includes('/organic-application-form-file'):
        uploadDir = 'public/uploads/organic-certificate/application-form/';
        break;

      case req.originalUrl.includes('/organic-invoice-file'):
        uploadDir = 'public/uploads/organic-certificate/invoice/';
        break;

      case req.originalUrl.includes('/organic-certificate-file'):
        uploadDir = 'public/uploads/organic-certificate/certificate/';
        break;

      // -------- ICS APPOINTMENT DECISION FILES - SIGNATURE --------
      // ------------------------------------------------
      case req.originalUrl.includes('/ics-appointment-decision-file'):
        uploadDir = 'public/uploads/ics/appointment-decision/ics-team/';
        break;

      case req.originalUrl.includes('/ics-head-appointment-decision-file'):
        uploadDir = 'public/uploads/ics/appointment-decision/ics-head/';
        break;

      case req.originalUrl.includes('/ics-internal-inspector-appointment-decision-file'):
        uploadDir = 'public/uploads/ics/appointment-decision/internal-inspector/';
        break;

      case req.originalUrl.includes('/ics-internal-evaluator-appointment-decision-file'):
        uploadDir = 'public/uploads/ics/appointment-decision/internal-evaluator/';
        break;

      case req.originalUrl.includes('/ics-quality-manager-appointment-decision-file'):
        uploadDir = 'public/uploads/ics/appointment-decision/quality-manager/';
        break;

      case req.originalUrl.includes('/ics-office-appointment-decision-file'):
        uploadDir = 'public/uploads/ics/appointment-decision/ics-office/';
        break;

      case req.originalUrl.includes('/ics-professional-certificate-file'):
        uploadDir = 'public/uploads/ics/professional-certificate/';
        break;

      case req.originalUrl.includes('/ics-member/signature-file/upload'):
        uploadDir = 'public/uploads/ics/member-signature/';
        break;

      // -------- LOCAL AUTHORITY CONFIRMATION FILES --------
      // ----------------------------------------------------
      case req.originalUrl.includes('/local-authority-confirmation-file'):
        uploadDir = 'public/uploads/local-authority-confirmation/';
        break;

      // -------- STATEMENT FILES --------
      // ---------------------------------
      case req.originalUrl.includes('/statement-file'):
        uploadDir = 'public/uploads/statement/';
        break;

      // -------- INTERNAL ASSESSMENT FILES --------
      // ----------------------------------------------
      case req.originalUrl.includes(
        '/internal-assessment-survey-form/farmer-signature-file/upload',
      ):
        uploadDir = 'public/uploads/internal-assessment/farmer-signature/';
        break;

      case req.originalUrl.includes('/internal-assessment-plan-file'):
        uploadDir = 'public/uploads/internal-assessment/plan/';
        break;

      case req.originalUrl.includes('/internal-assessment-report-file'):
        uploadDir = 'public/uploads/internal-assessment/report/';
        break;

      // -------- OTHERS --------
      // ------------------------
      default:
        uploadDir = 'public/uploads/others/';
    }

    ensureUploadDir(uploadDir.replace('public/uploads/', ''));
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: any) => {
    // Use original file name with a timestamp to prevent collisions
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

export default upload;
