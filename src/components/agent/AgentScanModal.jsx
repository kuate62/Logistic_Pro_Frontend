import { useState } from 'react';
import { QrCode, Search, Package, ArrowRight, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import agentService from '../../api/agentService';
import StatusBadge from './StatusBadge';

export function AgentScanModal({ user, onClose, onSelectParcel }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const parcel = await agentService.searchParcelByTracking(trackingNumber.trim());
      setResult(parcel);
    } catch (err) {
      setError(err.message || 'Colis non trouvé');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <QrCode size={20} />
              Recherche & Scanner de Code-barres / QR Code
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Fermer" />
          </div>

            <div className="modal-body p-4">
              <form onSubmit={handleSearch} className="mb-3">
                <label className="form-label fw-bold">Numéro de Suivi ou Référence (LP-xxxx / EXP-xxxx)</label>
                <div className="input-group">
                  <span className="input-group-text"><Search size={16} /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Saisissez ou flashez le code..."
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    autoFocus
                  />
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Recherche...' : 'Chercher'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="card border-primary shadow-sm mt-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="card-title fw-bold text-primary mb-1 d-flex align-items-center gap-2">
                          <Package size={18} /> {result.trackingNumber}
                        </h6>
                        <span className="text-muted small">Catégorie: {result.category} · Poids: {result.weight} kg</span>
                      </div>
                      <StatusBadge status={result.status} />
                    </div>

                    <div className="border-top pt-2 mt-2 text-sm">
                      <div><strong>Expéditeur:</strong> {result.senderName || result.expediteur?.name || '—'}</div>
                      <div><strong>Destinataire:</strong> {result.receiverName || result.destinataire?.name || '—'}</div>
                      <div><strong>Destination:</strong> {result.destinationCity || result.destination}</div>
                    </div>

                    <div className="mt-3 d-flex justify-content-end gap-2">
                      {onSelectParcel && (
                        <button
                          className="btn btn-sm btn-success d-flex align-items-center gap-1"
                          onClick={() => {
                            onSelectParcel(result);
                            onClose();
                          }}
                        >
                          Sélectionner <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default AgentScanModal;
