import { useRef } from 'react';
import { Printer, X, QrCode, Package, ArrowRight } from 'lucide-react';
import StatusBadge from '../agent/StatusBadge';

export function ParcelLabelModal({ parcel, shipment, company, onClose }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Étiquette Colis ${parcel?.trackingNumber || parcel?.trackingCode}</title>
          <style>
            @page { size: 100mm 150mm; margin: 0; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 12px; color: #1e293b; background: #fff; }
            .label-box { border: 3px solid #0f172a; padding: 12px; border-radius: 8px; max-width: 380px; margin: 0 auto; box-sizing: border-box; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #94a3b8; padding-bottom: 8px; margin-bottom: 10px; }
            .company { font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
            .tracking { font-family: monospace; font-size: 20px; font-weight: bold; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; }
            .route-banner { background: #0f172a; color: #fff; text-align: center; padding: 8px; border-radius: 6px; font-size: 18px; font-weight: bold; margin-bottom: 12px; }
            .grid { display: flex; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
            .col { flex: 1; font-size: 12px; }
            .col strong { display: block; font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
            .barcode-area { text-align: center; margin-top: 10px; border-top: 2px dashed #94a3b8; padding-top: 10px; }
            .barcode-bars { display: inline-flex; height: 50px; gap: 2px; align-items: flex-end; }
            .bar { background: #0f172a; width: 3px; }
            .bar.thin { width: 1px; }
            .bar.wide { width: 5px; }
            @media print {
              .no-print { display: none !important; }
              .label-box { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const tracking = parcel?.trackingNumber || parcel?.trackingCode || 'LP-2026-0000';
  const senderName = shipment?.senderName || shipment?.sender?.name || parcel?.senderName || '—';
  const receiverName = shipment?.receiverName || shipment?.recipient?.name || parcel?.receiverName || '—';
  const receiverPhone = shipment?.receiverPhone || shipment?.recipient?.phone || parcel?.receiverPhone || '—';
  const origin = shipment?.originCity || parcel?.originCity || 'Origine';
  const dest = shipment?.destinationCity || parcel?.destinationCity || 'Destination';

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Package size={20} />
              Étiquette Colis Thermique — {tracking}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Fermer" />
          </div>

          <div className="modal-body p-4 bg-light">
            <div ref={printRef}>
              <div className="label-box">
                <div className="header">
                  <div className="company">{company?.name || 'LOGISTICPRO'}</div>
                  <div className="tracking">{tracking}</div>
                </div>

                <div className="route-banner">
                  {origin.toUpperCase()} ➔ {dest.toUpperCase()}
                </div>

                <div className="grid">
                  <div className="col">
                    <strong>Expéditeur</strong>
                    <div>{senderName}</div>
                  </div>
                  <div className="col">
                    <strong>Destinataire</strong>
                    <div style={{ fontWeight: 'bold' }}>{receiverName}</div>
                    <div>{receiverPhone}</div>
                  </div>
                </div>

                <div className="grid">
                  <div className="col">
                    <strong>Catégorie</strong>
                    <div>{parcel?.category || 'Standard'}</div>
                  </div>
                  <div className="col">
                    <strong>Poids & Dim.</strong>
                    <div>{parcel?.weight || 0} kg</div>
                    {parcel?.length > 0 && <small className="text-muted">{parcel.length}x{parcel.width}x{parcel.height} cm</small>}
                  </div>
                  <div className="col">
                    <strong>Réf. Expédition</strong>
                    <div>{shipment?.reference || shipment?.shipmentNumber || '—'}</div>
                  </div>
                </div>

                <div className="barcode-area">
                  <div className="barcode-bars">
                    {[3, 1, 5, 2, 1, 4, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 5, 2, 1, 3, 4, 2, 1, 5, 3].map((w, i) => (
                      <div key={i} className={`bar ${w === 1 ? 'thin' : w === 5 ? 'wide' : ''}`} style={{ height: `${35 + (i % 3) * 5}px` }} />
                    ))}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold', marginTop: 4 }}>
                    *{tracking}*
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Fermer
            </button>
            <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={handlePrint}>
              <Printer size={16} /> Imprimer l'Étiquette (100x150 mm)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParcelLabelModal;
