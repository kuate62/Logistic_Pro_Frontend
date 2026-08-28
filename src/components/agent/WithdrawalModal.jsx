import { useState } from 'react';
import { Handshake, X, Check, CreditCard, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import agentService from '../../api/agentService';

export function WithdrawalModal({ parcel, user, onClose, onSuccess }) {
  const [recipientName, setRecipientName] = useState(
    parcel?.destinataire?.name || parcel?.receiverName || ''
  );
  const [idNumber, setIdNumber] = useState('');
  const [note, setNote] = useState('');
  const [collectPayment, setCollectPayment] = useState(
    parcel?.shipment?.paymentStatus === 'pending'
  );
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  const pendingAmount = parcel?.shipment?.totalAmount || parcel?.totalAmount || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      toast.error('Le nom du destinataire est requis');
      return;
    }

    setLoading(true);
    try {
      await agentService.validateWithdrawal(parcel.id, {
        recipientName: recipientName.trim(),
        idNumber: idNumber.trim(),
        note: note.trim(),
        agentName: user ? `${user.firstName || user.firstname || ''} ${user.lastName || user.lastname || ''}`.trim() : 'Agent Retrait',
        collectPayment,
        shipmentId: parcel.shipmentId || parcel.shipment?.id,
        companyId: user?.companyId,
        agencyId: user?.agencyId,
        amount: pendingAmount,
        paymentMethod,
      });

      toast.success(`Colis ${parcel.trackingNumber} marqué comme remis avec succès !`);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la validation du retrait');
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
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Handshake size={20} />
              Validation du Retrait — {parcel?.trackingNumber}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Fermer" />
          </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="alert alert-light border mb-3">
                  <div className="row g-2 text-sm">
                    <div className="col-6"><strong>Colis :</strong> {parcel?.category} ({parcel?.weight} kg)</div>
                    <div className="col-6"><strong>Destination :</strong> {parcel?.destinationCity || parcel?.destination}</div>
                    <div className="col-12"><strong>Expéditeur :</strong> {parcel?.senderName || parcel?.expediteur?.name || '—'}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Nom du destinataire / Retirant *</label>
                  <div className="input-group">
                    <span className="input-group-text"><UserCheck size={16} /></span>
                    <input
                      type="text"
                      className="form-control"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nom complet de la personne retirant le colis"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">N° Pièce d'identité (CNI / Passeport)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Ex: CNI 102938475"
                  />
                </div>

                {parcel?.shipment?.paymentStatus === 'pending' && (
                  <div className="p-3 border rounded bg-warning bg-opacity-10 mb-3">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="collectPaymentSwitch"
                        checked={collectPayment}
                        onChange={(e) => setCollectPayment(e.target.checked)}
                      />
                      <label className="form-check-label fw-bold text-dark" htmlFor="collectPaymentSwitch">
                        Encaisser le règlement au retrait ({pendingAmount.toLocaleString('fr-FR')} FCFA)
                      </label>
                    </div>

                    {collectPayment && (
                      <div className="mt-2">
                        <label className="form-label small fw-bold">Mode de règlement</label>
                        <select
                          className="form-select form-select-sm"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option value="cash">Espèces</option>
                          <option value="mobile_money">Mobile Money</option>
                          <option value="card">Carte Bancaire</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-2">
                  <label className="form-label fw-bold">Note / Remarque (optionnel)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Observation particulière..."
                  />
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-success d-flex align-items-center gap-2" disabled={loading}>
                  {loading ? 'Validation en cours...' : <><Check size={16} /> Confirmer la remise</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default WithdrawalModal;
