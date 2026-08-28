import { useEffect, useState } from 'react';
import { ArrowLeft, Edit, XCircle, Archive, Package, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShipment, useShipmentForm } from '../../hooks/useShipment';
import { SHIPMENT_STATUS_FLOW, SHIPMENT_STATUS_LABELS } from '../../config/constants';
import ShipmentSkeleton from '../../components/clients/ClientSkeleton';
import ShipmentStatus from '../../components/shipments/ShipmentStatus';
import ShipmentWeightIndicator from '../../components/shipments/ShipmentWeightIndicator';
import ShipmentPriceSummary from '../../components/shipments/ShipmentPriceSummary';
import ShipmentTimeline from '../../components/shipments/ShipmentTimeline';
import ShipmentReceiptModal from '../../components/shipments/ShipmentReceiptModal';
import ParcelLabelModal from '../../components/shipments/ParcelLabelModal';
import { useAuth } from '../../hooks/useAuth';

const TABS = [
  { key: 'info', label: 'Informations' },
  { key: 'packages', label: 'Colis' },
  { key: 'history', label: 'Historique' },
];

export default function ShipmentDetailPage() {
  const { companyId } = useAuth();
  const { id } = useParams();
  const { shipment, loading, history, fetch, fetchHistory, clearSelected } = useShipment();
  const { cancel, archive, updateStatus } = useShipmentForm();
  const [activeTab, setActiveTab] = useState('info');
  const [nextStatus, setNextStatus] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedLabelParcel, setSelectedLabelParcel] = useState(null);

  useEffect(() => { fetch(id); return () => clearSelected(); }, [id, fetch, clearSelected]);
  useEffect(() => { if (activeTab === 'history') fetchHistory(id); }, [activeTab, id, fetchHistory]);

  const canChangeStatus = !['cancelled', 'delivered'].includes(shipment?.status);
  const currentIdx = shipment ? SHIPMENT_STATUS_FLOW.indexOf(shipment.status) : -1;
  const flowOptions = currentIdx >= 0 ? SHIPMENT_STATUS_FLOW.slice(currentIdx) : [];
  const effectiveNextStatus = flowOptions.includes(nextStatus) ? nextStatus : (flowOptions[0] || '');

  if (loading.detail || !shipment) return <ShipmentSkeleton />;

  const handleCancel = async () => {
    if (window.confirm('Annuler cette expédition ?')) {
      try { await cancel(id); toast.success('Expédition annulée'); fetch(id); } catch { toast.error('Erreur'); }
    }
  };

  const handleArchive = async () => {
    if (window.confirm('Archiver cette expédition ?')) {
      try { await archive(id); toast.success('Expédition archivée'); fetch(id); } catch { toast.error('Erreur'); }
    }
  };

  const handleStatusChange = async () => {
    if (!effectiveNextStatus || effectiveNextStatus === shipment.status) return;
    if (window.confirm(`Passer cette expédition au statut « ${SHIPMENT_STATUS_LABELS[effectiveNextStatus] || effectiveNextStatus} » ?`)) {
      try { await updateStatus(id, effectiveNextStatus); toast.success('Statut mis à jour'); fetch(id); } catch { toast.error('Erreur'); }
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/shipments" className="btn btn-outline-secondary btn-sm rounded-pill"><ArrowLeft size={16} /></Link>
        <div className="flex-grow-1">
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Truck size={22} className="text-primary" /> {shipment.shipmentNumber || shipment.reference}
          </h4>
          <div className="d-flex align-items-center gap-2">
            <ShipmentStatus status={shipment.status} />
            <span className="text-muted small">{new Date(shipment.createdAt).toLocaleString('fr-FR')}</span>
          </div>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={() => setShowReceiptModal(true)}
          >
            <FileText size={14} /> Reçu Client
          </button>
          {canChangeStatus && flowOptions.length > 1 && (
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" value={effectiveNextStatus} onChange={(e) => setNextStatus(e.target.value)}>
                {flowOptions.map((s) => <option key={s} value={s}>{SHIPMENT_STATUS_LABELS[s] || s}</option>)}
              </select>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleStatusChange} disabled={loading.status || effectiveNextStatus === shipment.status}>
                {loading.status ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          )}
          {['draft', 'pending'].includes(shipment.status) && (
            <>
              <Link to={`/shipments/${id}/edit`} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"><Edit size={14} /> Modifier</Link>
              <button type="button" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onClick={handleCancel}><XCircle size={14} /> Annuler</button>
            </>
          )}
          {shipment.status === 'delivered' && (
            <button type="button" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={handleArchive}><Archive size={14} /> Archiver</button>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        {TABS.map((tab) => (
          <li key={tab.key} className="nav-item">
            <button type="button" className={`nav-link ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
          </li>
        ))}
      </ul>

      {activeTab === 'info' && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h6 className="fw-semibold mb-3">Informations générales</h6>
              <div className="row g-3 small">
                <div className="col-md-6">
                  <div className="text-muted mb-1">Expéditeur</div>
                  <div className="fw-medium">{shipment.senderName}</div>
                  <div>{shipment.senderPhone}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted mb-1">Destinataire</div>
                  <div className="fw-medium">{shipment.receiverName}</div>
                  <div>{shipment.receiverPhone}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted mb-1">Trajet</div>
                  <div className="fw-medium">{shipment.originAgencyName} ({shipment.originCity})</div>
                  <div>→ {shipment.destinationAgencyName} ({shipment.destinationCity})</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted mb-1">Agent</div>
                  <div className="fw-medium">{shipment.agentName}</div>
                </div>
                {shipment.observation && (
                  <div className="col-12"><div className="text-muted mb-1">Observation</div><div className="fst-italic">"{shipment.observation}"</div></div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mb-3">
              <ShipmentWeightIndicator currentWeight={shipment.totalWeight} maxWeight={shipment.maxWeight} />
            </div>
            <ShipmentPriceSummary packages={shipment.packages || []} maxWeight={shipment.maxWeight} />
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="bg-white rounded-3 shadow-sm p-4">
          <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2"><Package size={16} /> Colis ({shipment.packageCount})</h6>
          {(shipment.packages || []).length === 0 ? (
            <div className="text-muted small text-center py-4">Aucun colis</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr><th>#</th><th>Libellé</th><th>Catégorie</th><th>Poids</th><th>Dimensions</th><th>Valeur</th><th>Fragile</th><th>Assuré</th><th>Montant</th></tr>
                </thead>
                <tbody>
                  {shipment.packages.map((p, idx) => (
                    <tr key={p.id || idx}>
                      <td className="small">{idx + 1}</td>
                      <td className="small fw-medium">{p.label}</td>
                      <td className="small">{p.category}</td>
                      <td className="small">{p.weight} kg</td>
                      <td className="small text-muted">{p.length}×{p.width}×{p.height}</td>
                      <td className="small">{(p.declaredValue || 0).toLocaleString('fr-FR')} FCFA</td>
                      <td className="small">{p.fragile ? '🔋 Oui' : '—'}</td>
                      <td className="small">{p.insured ? '🛡️ Oui' : '—'}</td>
                      <td className="small fw-medium">{(p.totalAmount || 0).toLocaleString('fr-FR')} FCFA</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark text-xs d-flex align-items-center gap-1"
                          onClick={() => setSelectedLabelParcel(p)}
                        >
                          <Printer size={12} /> Étiquette
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && <ShipmentTimeline history={history} loading={loading.history} />}

      {showReceiptModal && (
        <ShipmentReceiptModal
          shipment={shipment}
          company={{ id: companyId }}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {selectedLabelParcel && (
        <ParcelLabelModal
          parcel={selectedLabelParcel}
          shipment={shipment}
          company={{ id: companyId }}
          onClose={() => setSelectedLabelParcel(null)}
        />
      )}
    </div>
  );
}
