import { useState } from 'react';
import { CheckCircle, Printer, FileText, Package, ArrowRight, Plus } from 'lucide-react';
import ShipmentReceiptModal from './ShipmentReceiptModal';
import ParcelLabelModal from './ParcelLabelModal';

export function ShipmentSuccessModal({ shipment, company, onClose, onNewShipment }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedLabelParcel, setSelectedLabelParcel] = useState(null);

  const packages = shipment?.parcels || shipment?.packages || [];

  return (
    <>
      <div
        className="modal show d-block"
        tabIndex="-1"
        style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1050 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-success text-white text-center d-block py-3">
              <CheckCircle size={44} className="mb-2" />
              <h5 className="modal-title fw-bold">Expédition Créée avec Succès !</h5>
              <div className="text-white-50 text-sm">Référence : {shipment?.reference || shipment?.shipmentNumber}</div>
            </div>

            <div className="modal-body p-4">
              <div className="alert alert-light border mb-3">
                <div className="row g-2 text-sm">
                  <div className="col-6"><strong>Expéditeur :</strong> {shipment?.senderName || '—'}</div>
                  <div className="col-6"><strong>Destinataire :</strong> {shipment?.receiverName || '—'}</div>
                  <div className="col-6"><strong>Trajet :</strong> {shipment?.originCity} ➔ {shipment?.destinationCity}</div>
                  <div className="col-6"><strong>Total :</strong> {(shipment?.totalAmount || 0).toLocaleString('fr-FR')} FCFA</div>
                </div>
              </div>

              <h6 className="fw-bold mb-2">Imprimer les documents du guichet :</h6>
              <div className="d-grid gap-2 mb-3">
                <button
                  className="btn btn-outline-primary d-flex align-items-center justify-content-between p-2"
                  onClick={() => setShowReceipt(true)}
                >
                  <span className="d-flex align-items-center gap-2">
                    <FileText size={18} /> Bordereau / Reçu Client
                  </span>
                  <Printer size={16} />
                </button>

                {packages.map((pkg, idx) => (
                  <button
                    key={idx}
                    className="btn btn-outline-dark d-flex align-items-center justify-content-between p-2"
                    onClick={() => setSelectedLabelParcel(pkg)}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <Package size={18} /> Étiquette Colis N° {pkg.trackingNumber || pkg.trackingCode || idx + 1}
                    </span>
                    <Printer size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer bg-light d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-success d-flex align-items-center gap-1"
                onClick={onNewShipment}
              >
                <Plus size={16} /> Nouvelle Expédition
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Terminer
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReceipt && (
        <ShipmentReceiptModal
          shipment={shipment}
          company={company}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {selectedLabelParcel && (
        <ParcelLabelModal
          parcel={selectedLabelParcel}
          shipment={shipment}
          company={company}
          onClose={() => setSelectedLabelParcel(null)}
        />
      )}
    </>
  );
}

export default ShipmentSuccessModal;
