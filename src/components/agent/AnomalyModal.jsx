import { useState } from 'react';
import { FileWarning, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import agentService from '../../api/agentService';

export function AnomalyModal({ parcel, user, onClose, onSuccess }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Veuillez préciser le motif du problème');
      return;
    }

    setLoading(true);
    try {
      await agentService.reportAnomaly(parcel.id, {
        reason: reason.trim(),
        agentName: user ? `${user.firstName || user.firstname || ''} ${user.lastName || user.lastname || ''}`.trim() : 'Agent Retrait',
      });

      toast.success(`Anomalie enregistrée sur le colis ${parcel.trackingNumber}`);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Erreur lors du signalement');
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
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <FileWarning size={20} />
              Signaler un problème — {parcel?.trackingNumber}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Fermer" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                <AlertTriangle size={20} />
                <span>Le statut du colis passera en <strong>Anomalie / Dommage</strong>.</span>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Motif ou Description du problème *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Emballage déchiré, contenu manquant, destinataire injoignable..."
                  required
                />
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                Annuler
              </button>
              <button type="submit" className="btn btn-danger d-flex align-items-center gap-2" disabled={loading}>
                {loading ? 'Enregistrement...' : <><FileWarning size={16} /> Signaler l'anomalie</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AnomalyModal;
