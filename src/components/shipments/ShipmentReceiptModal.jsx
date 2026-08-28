import { useRef } from 'react';
import { Printer, X, FileText, CheckCircle2, Building2 } from 'lucide-react';

export function ShipmentReceiptModal({ shipment, company, onClose }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bordereau d'Expédition ${shipment?.reference || shipment?.shipmentNumber}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; color: #0f172a; background: #fff; line-height: 1.4; }
            .receipt-box { padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 800px; margin: 0 auto; }
            .top-bar { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px; }
            .company-name { font-size: 22px; font-weight: bold; color: #0284c7; }
            .doc-title { font-size: 18px; font-weight: bold; text-align: right; text-transform: uppercase; }
            .ref-num { font-family: monospace; font-size: 16px; color: #475569; }
            .addresses { display: flex; gap: 20px; margin-bottom: 20px; }
            .addr-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 13px; }
            .addr-card h4 { margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
            .addr-card p { margin: 2px 0; font-weight: 500; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; color: #475569; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
            .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
            .totals-table { width: 280px; font-size: 13px; }
            .totals-table tr td:first-child { text-align: left; color: #64748b; }
            .totals-table tr td:last-child { text-align: right; font-weight: bold; }
            .totals-table tr.total-row td { font-size: 16px; color: #0284c7; border-top: 2px solid #0284c7; padding-top: 6px; }
            .footer-notes { border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 11px; color: #64748b; text-align: center; }
            @media print {
              .no-print { display: none !important; }
              .receipt-box { border: none; padding: 0; }
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

  const reference = shipment?.reference || shipment?.shipmentNumber || 'EXP-2026-0000';
  const senderName = shipment?.senderName || shipment?.expediteur?.name || shipment?.sender?.name || '—';
  const senderPhone = shipment?.senderPhone || shipment?.expediteur?.phone || shipment?.sender?.phone || '—';
  const receiverName = shipment?.receiverName || shipment?.destinataire?.name || shipment?.recipient?.name || '—';
  const receiverPhone = shipment?.receiverPhone || shipment?.destinataire?.phone || shipment?.recipient?.phone || '—';
  const origin = shipment?.originAgencyName || shipment?.originCity || shipment?.origin || 'Origine';
  const dest = shipment?.destinationAgencyName || shipment?.destinationCity || shipment?.destination || 'Destination';
  const packages = shipment?.parcels || shipment?.packages || [];
  const totalAmount = shipment?.totalAmount || shipment?.transportAmount || 0;
  const paidAmount = shipment?.paidAmount || 0;
  const remainingAmount = Math.max(0, totalAmount - paidAmount);

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <FileText size={20} />
              Bordereau / Reçu Client — {reference}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Fermer" />
          </div>

            <div className="modal-body p-4 bg-light">
              <div ref={printRef}>
                <div className="receipt-box bg-white">
                  <div className="top-bar">
                    <div>
                      <div className="company-name">{company?.name || 'LOGISTICPRO TRANSPORT'}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{company?.city || 'Cameroun'} · {company?.phone || ''}</div>
                    </div>
                    <div>
                      <div className="doc-title">Bordereau d'Expédition</div>
                      <div className="ref-num">{reference}</div>
                      <div style={{ fontSize: 11, color: '#64748b', textAlign: 'right' }}>
                        Date: {new Date(shipment?.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  <div className="addresses">
                    <div className="addr-card">
                      <h4>Expéditeur (Départ)</h4>
                      <p><strong>Nom:</strong> {senderName}</p>
                      <p><strong>Téléphone:</strong> {senderPhone}</p>
                      <p><strong>Agence départ:</strong> {origin}</p>
                    </div>
                    <div className="addr-card">
                      <h4>Destinataire (Arrivée)</h4>
                      <p><strong>Nom:</strong> {receiverName}</p>
                      <p><strong>Téléphone:</strong> {receiverPhone}</p>
                      <p><strong>Agence destination:</strong> {dest}</p>
                    </div>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>N° Colis / Suivi</th>
                        <th>Catégorie / Description</th>
                        <th>Poids</th>
                        <th>Valeur Déclarée</th>
                        <th style={{ textAlign: 'right' }}>Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.length === 0 ? (
                        <tr><td colSpan="5" style={{ textStyle: 'italic', textAlign: 'center' }}>1 colis enregistré</td></tr>
                      ) : (
                        packages.map((p, i) => (
                          <tr key={i}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{p.trackingNumber || p.trackingCode || `LP-${i + 1}`}</td>
                            <td>{p.category || 'Standard'} {p.label ? `(${p.label})` : ''}</td>
                            <td>{p.weight || 0} kg</td>
                            <td>{(p.declaredValue || 0).toLocaleString('fr-FR')} FCFA</td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                              {(p.totalAmount || p.transportAmount || totalAmount / (packages.length || 1)).toLocaleString('fr-FR')} FCFA
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <div className="totals">
                    <table className="totals-table">
                      <tbody>
                        <tr>
                          <td>Montant Total:</td>
                          <td>{totalAmount.toLocaleString('fr-FR')} FCFA</td>
                        </tr>
                        <tr>
                          <td>Montant Payé:</td>
                          <td style={{ color: '#16a34a' }}>{paidAmount.toLocaleString('fr-FR')} FCFA</td>
                        </tr>
                        {remainingAmount > 0 && (
                          <tr>
                            <td>Reste à Payer au retrait:</td>
                            <td style={{ color: '#dc2626' }}>{remainingAmount.toLocaleString('fr-FR')} FCFA</td>
                          </tr>
                        )}
                        <tr className="total-row">
                          <td>Net à Payer:</td>
                          <td>{totalAmount.toLocaleString('fr-FR')} FCFA</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="footer-notes">
                    Merci d'avoir choisi {company?.name || 'LogisticPro'} pour vos envois. Présentez la référence {reference} ou le reçu lors du retrait.
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-white">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Fermer
              </button>
              <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={handlePrint}>
                <Printer size={16} /> Imprimer le Bordereau / Reçu (A4)
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ShipmentReceiptModal;
