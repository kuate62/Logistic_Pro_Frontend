import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShipmentWizard, useShipmentForm } from '../../hooks/useShipment';
import ShipmentStepper from '../../components/shipments/ShipmentStepper';
import ShipmentWeightIndicator from '../../components/shipments/ShipmentWeightIndicator';
import ShipmentPriceSummary from '../../components/shipments/ShipmentPriceSummary';
import ShipmentPackageForm from '../../components/shipments/ShipmentPackageForm';
import ClientSearchAutocomplete from '../../components/shipments/ClientSearchAutocomplete';
import ShipmentSuccessModal from '../../components/shipments/ShipmentSuccessModal';
import { clientsService } from '../../api/clientsService';
import { agenciesService } from '../../api/agenciesService';
import { routesService } from '../../api/routesService';
import { useAuth } from '../../hooks/useAuth';

export default function ShipmentCreatePage() {
  const { companyId } = useAuth();
  const navigate = useNavigate();
  const { wizard, setWizard, setWizardStep, resetWizard, addWizardPackage, updateWizardPackage, removeWizardPackage, getWizardTotals } = useShipmentWizard();
  const { create } = useShipmentForm();
  const [submitting, setSubmitting] = useState(false);
  const [createdShipment, setCreatedShipment] = useState(null);

  const totals = getWizardTotals();
  const step = wizard.step;

  const [clients, setClients] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [matchingRoutes, setMatchingRoutes] = useState([]);

  const loadData = async () => {
    try {
      const [c, a] = await Promise.all([
        clientsService.list(companyId, { limit: 100 }),
        agenciesService.list(companyId, { limit: 100 }),
      ]);
      setClients(c.data || []);
      setAgencies(a.data || []);
    } catch (err) {
      console.log('Error loading wizard data:', err.message);
    }
  };

  useEffect(() => {
    if (companyId) loadData();
  }, [companyId]);

  useEffect(() => {
    if (companyId && wizard.originAgencyId && wizard.destinationAgencyId) {
      routesService.getAll(companyId, {
        filters: {
          originAgencyId: wizard.originAgencyId,
          destinationAgencyId: wizard.destinationAgencyId,
        },
      }).then((res) => {
        const routes = res.data || [];
        setMatchingRoutes(routes);
        if (routes.length > 0) {
          const mainRoute = routes[0];
          setWizard({ routeId: mainRoute.id, routeName: mainRoute.name });
        }
      }).catch(() => setMatchingRoutes([]));
    }
  }, [companyId, wizard.originAgencyId, wizard.destinationAgencyId]);

  const ensureData = () => { if (clients.length === 0 || agencies.length === 0) loadData(); };

  const nextStep = () => {
    if (step === 1 && !wizard.senderId) { toast.error('Sélectionnez un expéditeur'); return; }
    if (step === 2 && !wizard.receiverId) { toast.error('Sélectionnez un destinataire'); return; }
    if (step === 3 && (!wizard.originAgencyId || !wizard.destinationAgencyId)) { toast.error('Sélectionnez les agences de départ et destination'); return; }
    setWizardStep(step + 1);
    ensureData();
  };

  const prevStep = () => { setWizardStep(step - 1); };

  const handleSubmit = async () => {
    if (totals.packageCount === 0) { toast.error('Ajoutez au moins un colis'); return; }
    setSubmitting(true);
    try {
      const shipment = await create({
        senderId: wizard.senderId, senderName: wizard.senderName, senderPhone: wizard.senderPhone,
        receiverId: wizard.receiverId, receiverName: wizard.receiverName, receiverPhone: wizard.receiverPhone,
        originAgencyId: wizard.originAgencyId, originAgencyName: wizard.originAgencyName, originCity: wizard.originCity,
        destinationAgencyId: wizard.destinationAgencyId, destinationAgencyName: wizard.destinationAgencyName, destinationCity: wizard.destinationCity,
        routeId: wizard.routeId || null, routeName: wizard.routeName || '', maxWeight: wizard.maxWeight,
        packages: wizard.packages, observation: wizard.observation,
        totalAmount: totals.totalAmount, paidAmount: 0,
      });

      toast.success(`Expédition ${shipment.shipmentNumber || shipment.reference} créée`);
      setCreatedShipment(shipment);
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const selectClient = (field, clientObj) => {
    if (!clientObj) {
      setWizard({ [field + 'Id']: '', [field + 'Name']: '', [field + 'Phone']: '' });
      return;
    }
    setWizard({
      [field + 'Id']: clientObj.id,
      [field + 'Name']: `${clientObj.firstName || ''} ${clientObj.lastName || ''}`.trim(),
      [field + 'Phone']: clientObj.phone || '',
    });
  };

  const handleClientCreated = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const selectAgency = (prefix, agencyId) => {
    const a = agencies.find((ag) => String(ag.id) === String(agencyId));
    if (a) setWizard({ [prefix + 'AgencyId']: a.id, [prefix + 'AgencyName']: a.name, [prefix + 'City']: a.city || '' });
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/shipments" className="btn btn-outline-secondary btn-sm rounded-pill"><ArrowLeft size={16} /></Link>
        <div>
          <h4 className="fw-bold text-dark mb-1">Nouvelle expédition</h4>
          <p className="text-muted mb-0 small">Wizard de création d'expédition</p>
        </div>
      </div>

      <ShipmentStepper currentStep={step} />

      <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
        {step === 1 && (
          <div>
            <h6 className="fw-semibold mb-3">Étape 1 — Expéditeur</h6>
            <p className="text-muted small mb-3">Recherchez par nom/téléphone ou créez rapidement l'expéditeur.</p>
            <ClientSearchAutocomplete
              clients={clients}
              selectedClientId={wizard.senderId}
              onSelectClient={(c) => selectClient('sender', c)}
              onClientCreated={handleClientCreated}
              companyId={companyId}
              label="Client expéditeur"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h6 className="fw-semibold mb-3">Étape 2 — Destinataire</h6>
            <p className="text-muted small mb-3">Recherchez par nom/téléphone ou créez rapidement le destinataire.</p>
            <ClientSearchAutocomplete
              clients={clients}
              selectedClientId={wizard.receiverId}
              onSelectClient={(c) => selectClient('receiver', c)}
              onClientCreated={handleClientCreated}
              companyId={companyId}
              label="Client destinataire"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h6 className="fw-semibold mb-3">Étape 3 — Informations de transport</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Agence de départ *</label>
                <select className="form-select" value={wizard.originAgencyId} onChange={(e) => selectAgency('origin', e.target.value)} onFocus={ensureData}>
                  <option value="">Sélectionner l'agence de départ</option>
                  {agencies.map((a) => <option key={a.id} value={a.id}>{a.name} — {a.city}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Agence de destination *</label>
                <select className="form-select" value={wizard.destinationAgencyId} onChange={(e) => selectAgency('destination', e.target.value)} onFocus={ensureData}>
                  <option value="">Sélectionner l'agence d'arrivée</option>
                  {agencies.map((a) => <option key={a.id} value={a.id}>{a.name} — {a.city}</option>)}
                </select>
              </div>
              {matchingRoutes.length > 0 && (
                <div className="col-12">
                  <div className="p-2 border rounded bg-info bg-opacity-10 small">
                    <strong>Route de transport associée :</strong> {matchingRoutes[0].name} ({matchingRoutes[0].distance} km · Durée estimée : {matchingRoutes[0].estimatedDuration}h)
                  </div>
                </div>
              )}
              <div className="col-md-4">
                <label className="form-label small">Poids max autorisé (kg)</label>
                <input type="number" className="form-control" value={wizard.maxWeight} onChange={(e) => setWizard({ maxWeight: parseFloat(e.target.value) || 100 })} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h6 className="fw-semibold mb-3">Étape 4 — Ajout des colis</h6>
            <div className="mb-3">
              <ShipmentWeightIndicator currentWeight={totals.totalWeight} maxWeight={totals.maxWeight} />
            </div>
            <ShipmentPackageForm packages={wizard.packages} maxWeight={totals.maxWeight} currentWeight={totals.totalWeight} onAdd={addWizardPackage} onUpdate={updateWizardPackage} onRemove={removeWizardPackage} />
          </div>
        )}

        {step === 5 && (
          <div>
            <h6 className="fw-semibold mb-3">Étape 5 — Récapitulatif</h6>
            <div className="row g-4">
              <div className="col-md-8">
                <div className="bg-light rounded-3 p-3 mb-3">
                  <div className="row g-3 small">
                    <div className="col-6"><strong>Expéditeur:</strong> {wizard.senderName}<br /><span className="text-muted">{wizard.senderPhone}</span></div>
                    <div className="col-6"><strong>Destinataire:</strong> {wizard.receiverName}<br /><span className="text-muted">{wizard.receiverPhone}</span></div>
                    <div className="col-6"><strong>Départ:</strong> {wizard.originAgencyName} ({wizard.originCity})</div>
                    <div className="col-6"><strong>Destination:</strong> {wizard.destinationAgencyName} ({wizard.destinationCity})</div>
                  </div>
                </div>
                {wizard.packages.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-sm small mb-0">
                      <thead><tr><th>#</th><th>Libellé</th><th>Catégorie</th><th>Poids</th><th>Montant</th></tr></thead>
                      <tbody>
                        {wizard.packages.map((p, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{p.label}</td>
                            <td>{p.category}</td>
                            <td>{p.weight} kg</td>
                            <td className="fw-bold">{(p.totalAmount || 0).toLocaleString('fr-FR')} FCFA</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <ShipmentPriceSummary packages={wizard.packages} maxWeight={totals.maxWeight} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between">
        <div>
          {step > 1 && <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-1" onClick={prevStep}><ArrowLeft size={14} /> Précédent</button>}
        </div>
        <div>
          {step < 5 ? (
            <button type="button" className="btn btn-primary d-flex align-items-center gap-1" onClick={nextStep}>Suivant <ArrowRight size={14} /></button>
          ) : (
            <button type="button" className="btn btn-success d-flex align-items-center gap-1" onClick={handleSubmit} disabled={submitting}>
              <Send size={14} /> {submitting ? 'Envoi...' : 'Confirmer l\'expédition'}
            </button>
          )}
        </div>
      </div>

      {createdShipment && (
        <ShipmentSuccessModal
          shipment={createdShipment}
          company={{ id: companyId }}
          onClose={() => {
            setCreatedShipment(null);
            resetWizard();
            navigate('/shipments');
          }}
          onNewShipment={() => {
            setCreatedShipment(null);
            resetWizard();
            setWizardStep(1);
          }}
        />
      )}
    </div>
  );
}
