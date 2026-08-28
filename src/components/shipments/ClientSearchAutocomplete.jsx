import { useState, useMemo } from 'react';
import { Search, UserPlus, Phone, UserCheck, Check, Plus } from 'lucide-react';
import { clientsService } from '../../api/clientsService';
import toast from 'react-hot-toast';

export function ClientSearchAutocomplete({ clients, selectedClientId, onSelectClient, onClientCreated, companyId, label }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClient, setNewClient] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', address: '' });
  const [creating, setCreating] = useState(false);

  const selectedClient = useMemo(() => {
    return clients.find((c) => String(c.id) === String(selectedClientId)) || null;
  }, [clients, selectedClientId]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients.slice(0, 10);
    const q = searchTerm.toLowerCase();
    return clients.filter((c) => {
      const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || email.includes(q);
    }).slice(0, 10);
  }, [clients, searchTerm]);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClient.firstName.trim() || !newClient.phone.trim()) {
      toast.error('Le prénom et le téléphone sont requis');
      return;
    }

    setCreating(true);
    try {
      const created = await clientsService.create(companyId, {
        firstName: newClient.firstName.trim(),
        lastName: newClient.lastName.trim(),
        email: newClient.email?.trim() || null,
        phone: newClient.phone.trim(),
        city: newClient.city.trim(),
        address: newClient.address.trim(),
      });

      toast.success(`Client ${created.firstName} ${created.lastName} créé !`);
      onClientCreated?.(created);
      onSelectClient(created);
      setShowCreateModal(false);
      setNewClient({ firstName: '', lastName: '', email: '', phone: '', city: '', address: '' });
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la création du client');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="client-autocomplete-container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label small fw-bold mb-0">{label} *</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-success py-0 px-2 text-xs d-flex align-items-center gap-1"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={12} /> Nouveau client
        </button>
      </div>

      {selectedClient ? (
        <div className="p-3 border rounded-3 bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <UserCheck className="text-success" size={20} />
            <div>
              <div className="fw-bold text-dark">{selectedClient.firstName} {selectedClient.lastName}</div>
              <div className="text-muted small d-flex align-items-center gap-1">
                <Phone size={12} /> {selectedClient.phone} {selectedClient.city ? `· ${selectedClient.city}` : ''}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-muted text-decoration-none"
            onClick={() => onSelectClient(null)}
          >
            Changer
          </button>
        </div>
      ) : (
        <div>
          <div className="input-group input-group-sm mb-2">
            <span className="input-group-text"><Search size={14} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Saisissez un nom ou numéro de téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-3 p-2 bg-white" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {filteredClients.length === 0 ? (
              <div className="text-center text-muted p-2 small">
                Aucun client trouvé. <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setShowCreateModal(true)}>Créer "{searchTerm}"</button>
              </div>
            ) : (
              filteredClients.map((c) => (
                <div
                  key={c.id}
                  className="p-2 border-bottom hover-bg-light cursor-pointer rounded d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectClient(c)}
                >
                  <div>
                    <div className="fw-semibold small">{c.firstName} {c.lastName}</div>
                    <div className="text-muted text-xs">{c.phone} {c.city ? `· ${c.city}` : ''}</div>
                  </div>
                  <span className="btn btn-sm btn-light text-xs">Choisir</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Quick Create Client Modal */}
      {showCreateModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1070 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-success text-white py-3">
                <h6 className="modal-title m-0 d-flex align-items-center gap-2 fw-bold">
                  <UserPlus size={18} /> Nouveau Client Rapide
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)} />
              </div>
              <form onSubmit={handleCreateClient}>
                <div className="modal-body p-3">
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold">Prénom *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newClient.firstName}
                        onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold">Nom</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newClient.lastName}
                        onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold">Téléphone *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="+237 6..."
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        placeholder="client@exemple.com"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold">Ville</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Douala, Yaoundé..."
                        value={newClient.city}
                        onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold">Adresse</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Quartier / Rue..."
                        value={newClient.address}
                        onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer py-2 bg-light">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowCreateModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-sm btn-success" disabled={creating}>
                    {creating ? 'Création...' : 'Créer et Sélectionner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientSearchAutocomplete;
