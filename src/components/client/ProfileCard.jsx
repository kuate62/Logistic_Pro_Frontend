import { Mail, Phone, MapPin, Building2, Calendar, Edit3 } from 'lucide-react';

export function ProfileCard({ client, formatDate }) {
  if (!client) return null;

  const initials = `${client.firstName?.[0] || ''}${client.lastName?.[0] || ''}`;

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', margin: '0 auto 14px',
        background: 'linear-gradient(135deg, var(--color-primary), #4F46E5)',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, fontWeight: 700,
      }}>
        {initials}
      </div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>
        {client.firstName} {client.lastName}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          <Mail size={14} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} /> {client.email}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          <Phone size={14} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} /> {client.phone}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          <MapPin size={14} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} /> {client.city}
        </div>
        {client.company && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-secondary)' }}>
            <Building2 size={14} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} /> {typeof client.company === 'string' ? client.company : client.company?.name || ''}
          </div>
        )}
        {client.memberSince && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-secondary)' }}>
            <Calendar size={14} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} /> Membre depuis {formatDate ? formatDate(client.memberSince) : ''}
          </div>
        )}
      </div>
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16,
        padding: '10px 20px', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)', background: 'white',
        fontSize: 13, fontWeight: 600, color: 'var(--color-primary)',
        cursor: 'pointer', fontFamily: 'var(--font-family)',
        transition: 'all 150ms',
      }}
        type="button"
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-light)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'white'; }}
      >
        <Edit3 size={14} /> Modifier mon profil
      </button>
    </div>
  );
}

export default ProfileCard;
