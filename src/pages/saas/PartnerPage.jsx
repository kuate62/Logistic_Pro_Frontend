import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  ArrowRight, Building2, ChartColumn, ChevronLeft, ChevronRight, CircleCheck,
  ClipboardList, Globe, Headset, Layers, LoaderCircle, Mail, Navigation,
  Package, Rocket, Search, Settings, Smartphone, Truck,
} from 'lucide-react';
import { usePartnerApplication } from '../../hooks/usePartnerApplication';
import { useAuth } from '../../hooks/useAuth';
import {
  PARTNER_AGENCY_COUNT_OPTIONS, PARTNER_BENEFITS, PARTNER_COUNTRIES,
  PARTNER_EMPLOYEE_COUNT_OPTIONS, PARTNER_MANAGER_ROLES, PARTNER_REGIONS,
  PARTNER_SOURCES, PARTNER_STATUSES, PARTNER_STEPS,
} from '../../data/mockPartnerData';
import './PartnerPage.css';

const STEPS = [
  { label: 'Entreprise', title: 'Informations sur votre entreprise' },
  { label: 'Responsable', title: 'Responsable du dossier' },
  { label: 'Compléments', title: 'Compléments d\'information' },
];

const STEP_FIELDS = [
  ['companyName', 'companySigle', 'rccm', 'contribuable', 'phone', 'email', 'website', 'address', 'city', 'region', 'country'],
  ['managerLastName', 'managerFirstName', 'managerPhone', 'managerEmail', 'managerRole'],
  ['agencyCount', 'employeeCount', 'description', 'source'],
];

const schema = z.object({
  companyName: z.string().min(2, 'Le nom de l\'entreprise est requis'),
  companySigle: z.string().max(20).optional(),
  rccm: z.string().min(3, 'Le numéro RCCM est requis'),
  contribuable: z.string().max(30).optional(),
  phone: z.string().regex(/^[0-9+\s-]{9,}$/, 'Numéro de téléphone invalide'),
  email: z.email('Adresse e-mail invalide'),
  website: z.string().url('Adresse de site web invalide').or(z.literal('')),
  address: z.string().min(3, 'L\'adresse est requise'),
  city: z.string().min(2, 'La ville est requise'),
  region: z.string().min(1, 'Sélectionnez une région'),
  country: z.string().min(1, 'Sélectionnez un pays'),
  managerLastName: z.string().min(2, 'Le nom est requis'),
  managerFirstName: z.string().min(2, 'Le prénom est requis'),
  managerPhone: z.string().regex(/^[0-9+\s-]{9,}$/, 'Numéro de téléphone invalide'),
  managerEmail: z.email('Adresse e-mail invalide'),
  managerRole: z.string().min(1, 'Sélectionnez une fonction'),
  agencyCount: z.string().min(1, 'Sélectionnez le nombre d\'agences'),
  employeeCount: z.string().min(1, 'Sélectionnez le nombre d\'employés'),
  description: z.string().min(20, 'Décrivez votre entreprise en au moins 20 caractères'),
  source: z.string().min(1, 'Sélectionnez une réponse'),
});

const defaultValues = Object.fromEntries(
  [...new Set(STEP_FIELDS.flat())].map((field) => [field, '']),
);

const BENEFIT_ICONS = [Globe, Navigation, Layers, Smartphone, ChartColumn, Headset];
const HOW_ICONS = [ClipboardList, Search, CircleCheck, Settings, Rocket];

function Field({ label, htmlFor, required, error, hint, children }) {
  return (
    <div className="pp-form__field">
      <label className="pp-form__label" htmlFor={htmlFor}>
        {label} {required && <span className="pp-form__required">*</span>}
      </label>
      {children}
      {error ? (
        <span className="pp-form__error" role="alert">{error}</span>
      ) : hint ? (
        <span className="pp-form__hint">{hint}</span>
      ) : null}
    </div>
  );
}

function HeroSection() {
  const stats = [
    { icon: Building2, value: '120+', label: 'Entreprises partenaires' },
    { icon: Truck, value: '350+', label: 'Agences connectées' },
    { icon: Package, value: '15+', label: 'Villes desservies' },
    { icon: Navigation, value: '10 000+', label: 'Colis suivis par mois' },
  ];

  return (
    <section className="pp-hero">
      <div className="pp-hero__bg" />
      <div className="pp-hero__inner">
        <span className="pp-hero__badge">Partenariat LogisticPro</span>
        <h1 className="pp-hero__title">
          Devenez partenaire et <span className="pp-hero__highlight">développez votre activité</span>
        </h1>
        <p className="pp-hero__subtitle">
          Rejoignez le réseau des entreprises de transport camerounaises et offrez à vos clients
          une expérience de suivi de colis moderne et sans friction.
        </p>
        <div className="pp-hero__stats">
          {stats.map((s) => (
            <div key={s.label} className="pp-hero__stat">
              <s.icon size={20} />
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="pp-hero__actions">
          <a href="#pp-application" className="pp-hero__btn pp-hero__btn--primary">
            Soumettre ma demande <ArrowRight size={16} />
          </a>
          <a href="#pp-plans" className="pp-hero__btn pp-hero__btn--outline">
            Voir les offres
          </a>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="pp-section">
      <div className="pp-section__container">
        <div className="pp-section__header">
          <span className="pp-section__tag">Pourquoi utiliser la plateforme ?</span>
          <h2 className="pp-section__title">Tout ce dont votre entreprise a besoin</h2>
          <p className="pp-section__subtitle">
            Des outils simples et puissants pour gérer vos colis, vos agences et vos clients.
          </p>
        </div>
        <div className="pp-benefits">
          {PARTNER_BENEFITS.map((b, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <div key={b.title} className="pp-benefit">
                <div className="pp-benefit__icon"><Icon size={22} /></div>
                <h3 className="pp-benefit__title">{b.title}</h3>
                <p className="pp-benefit__desc">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowSection() {
  return (
    <section className="pp-section pp-section--alt">
      <div className="pp-section__container">
        <div className="pp-section__header">
          <span className="pp-section__tag">Comment ça marche ?</span>
          <h2 className="pp-section__title">Rejoignez-nous en 5 étapes</h2>
          <p className="pp-section__subtitle">
            De la demande de partenariat au lancement de votre activité sur la plateforme.
          </p>
        </div>
        <div className="pp-how">
          {PARTNER_STEPS.map((s, i) => {
            const Icon = HOW_ICONS[i % HOW_ICONS.length];
            return (
              <div key={s.number} className="pp-how__item">
                <div className="pp-how__rail">
                  <div className="pp-how__icon"><Icon size={20} /></div>
                  {i < PARTNER_STEPS.length - 1 && <div className="pp-how__line" />}
                </div>
                <div className="pp-how__content">
                  <span className="pp-how__number">{s.number}</span>
                  <h3 className="pp-how__title">{s.title}</h3>
                  <p className="pp-how__desc">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PlansSection({ plans, loading, selectedPlan, onSelect }) {
  return (
    <section className="pp-section" id="pp-plans">
      <div className="pp-section__container">
        <div className="pp-section__header">
          <span className="pp-section__tag">Nos offres</span>
          <h2 className="pp-section__title">Choisissez votre formule d\'abonnement</h2>
          <p className="pp-section__subtitle">
            Des formules adaptées à la taille de votre entreprise. Sans engagement.
          </p>
        </div>

        {loading ? (
          <div className="pp-plans__loading">
            <LoaderCircle size={22} className="pp-spin" />
            Chargement des offres...
          </div>
        ) : (
          <div className="pp-plans">
            {plans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <div key={plan.id} className={`pp-plan${isSelected ? ' pp-plan--selected' : ''}`}>
                  <div className="pp-plan__header">
                    <h3 className="pp-plan__name">{plan.name}</h3>
                    <p className="pp-plan__desc">{plan.description}</p>
                  </div>
                  <div className="pp-plan__price">
                    <strong>{plan.price.toLocaleString('fr-FR')}</strong>
                    <span>FCFA / mois</span>
                  </div>
                  <ul className="pp-plan__features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <CircleCheck size={15} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`pp-plan__btn${isSelected ? ' pp-plan__btn--selected' : ''}`}
                    onClick={() => onSelect(plan)}
                  >
                    {isSelected ? <CircleCheck size={15} /> : null}
                    {isSelected ? 'Plan sélectionné' : 'Choisir ce plan'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ApplicationSection({ selectedPlan, loading, error, onSubmit }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  const {
    register, handleSubmit, trigger, reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      reset((prev) => ({
        ...prev,
        managerLastName: prev.managerLastName || user.lastname || user.lastName || '',
        managerFirstName: prev.managerFirstName || user.firstname || user.firstName || '',
        managerEmail: prev.managerEmail || user.email || '',
        managerPhone: prev.managerPhone || user.phone || '',
      }));
    }
  }, [user, reset]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrevious = () => setStep((s) => Math.max(s - 1, 0));

  const submitDisabled = !isValid || isSubmitting || loading;

  return (
    <section className="pp-section pp-section--alt" id="pp-application">
      <div className="pp-section__container">
        <div className="pp-section__header">
          <span className="pp-section__tag">Formulaire de partenariat</span>
          <h2 className="pp-section__title">Remplissez votre demande</h2>
          <p className="pp-section__subtitle">
            Tous les champs marqués d\'une * sont obligatoires. Vos données restent confidentielles.
          </p>
        </div>

        <div className="pp-form">
          <div className="pp-progress" role="tablist" aria-label="Étapes du formulaire">
            {STEPS.map((s, i) => (
              <div
                key={s.label}
                className={`pp-progress__item${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}
              >
                <span className="pp-progress__dot">
                  {i < step ? <CircleCheck size={14} /> : i + 1}
                </span>
                <span className="pp-progress__label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="pp-progress__bar">
            <div className="pp-progress__fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>

          <form className="pp-form__body" onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <div className="pp-form__banner" role="alert">{error}</div>
            )}

            <div className={`pp-form__step${step === 0 ? ' pp-form__step--active' : ''}`}>
              <div className="pp-form__grid">
                <Field label="Nom de l\'entreprise" htmlFor="companyName" required error={errors.companyName?.message}>
                  <input
                    id="companyName" type="text" className="pp-form__input"
                    placeholder="Ex : Cameroon Trans" {...register('companyName')}
                    aria-invalid={errors.companyName ? 'true' : undefined}
                  />
                </Field>
                <Field label="Sigle (optionnel)" htmlFor="companySigle" error={errors.companySigle?.message}>
                  <input
                    id="companySigle" type="text" className="pp-form__input"
                    placeholder="Ex : CT" {...register('companySigle')}
                  />
                </Field>
                <Field label="Numéro RCCM" htmlFor="rccm" required error={errors.rccm?.message}>
                  <input
                    id="rccm" type="text" className="pp-form__input"
                    placeholder="Ex : RC/DLA/2025/4567" {...register('rccm')}
                    aria-invalid={errors.rccm ? 'true' : undefined}
                  />
                </Field>
                <Field label="Numéro contribuable (optionnel)" htmlFor="contribuable" error={errors.contribuable?.message}>
                  <input
                    id="contribuable" type="text" className="pp-form__input"
                    placeholder="Ex : P000123456789A" {...register('contribuable')}
                  />
                </Field>
                <Field label="Téléphone" htmlFor="phone" required error={errors.phone?.message}>
                  <input
                    id="phone" type="tel" className="pp-form__input"
                    placeholder="+237 6 00 00 00 00" {...register('phone')}
                    aria-invalid={errors.phone ? 'true' : undefined}
                  />
                </Field>
                <Field label="E-mail professionnel" htmlFor="email" required error={errors.email?.message}>
                  <input
                    id="email" type="email" className="pp-form__input"
                    placeholder="contact@entreprise.cm" {...register('email')}
                    aria-invalid={errors.email ? 'true' : undefined}
                  />
                </Field>
                <Field label="Site web (optionnel)" htmlFor="website" error={errors.website?.message}>
                  <input
                    id="website" type="url" className="pp-form__input"
                    placeholder="https://www.entreprise.cm" {...register('website')}
                  />
                </Field>
                <Field label="Adresse" htmlFor="address" required error={errors.address?.message}>
                  <input
                    id="address" type="text" className="pp-form__input"
                    placeholder="Boulevard de la Liberté, Quartier Akwa" {...register('address')}
                    aria-invalid={errors.address ? 'true' : undefined}
                  />
                </Field>
                <Field label="Ville" htmlFor="city" required error={errors.city?.message}>
                  <input
                    id="city" type="text" className="pp-form__input"
                    placeholder="Ex : Douala" {...register('city')}
                    aria-invalid={errors.city ? 'true' : undefined}
                  />
                </Field>
                <Field label="Région" htmlFor="region" required error={errors.region?.message}>
                  <select
                    id="region" className="pp-form__input" {...register('region')}
                    aria-invalid={errors.region ? 'true' : undefined}
                  >
                    <option value="">Sélectionnez une région</option>
                    {PARTNER_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Pays" htmlFor="country" required error={errors.country?.message}>
                  <select
                    id="country" className="pp-form__input" {...register('country')}
                    aria-invalid={errors.country ? 'true' : undefined}
                  >
                    <option value="">Sélectionnez un pays</option>
                    {PARTNER_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className={`pp-form__step${step === 1 ? ' pp-form__step--active' : ''}`}>
              <div className="pp-form__grid">
                <Field label="Nom" htmlFor="managerLastName" required error={errors.managerLastName?.message}>
                  <input
                    id="managerLastName" type="text" className="pp-form__input"
                    placeholder="Ex : Fotso" {...register('managerLastName')}
                    aria-invalid={errors.managerLastName ? 'true' : undefined}
                  />
                </Field>
                <Field label="Prénom" htmlFor="managerFirstName" required error={errors.managerFirstName?.message}>
                  <input
                    id="managerFirstName" type="text" className="pp-form__input"
                    placeholder="Ex : Emmanuel" {...register('managerFirstName')}
                    aria-invalid={errors.managerFirstName ? 'true' : undefined}
                  />
                </Field>
                <Field label="Téléphone" htmlFor="managerPhone" required error={errors.managerPhone?.message}>
                  <input
                    id="managerPhone" type="tel" className="pp-form__input"
                    placeholder="+237 6 00 00 00 00" {...register('managerPhone')}
                    aria-invalid={errors.managerPhone ? 'true' : undefined}
                  />
                </Field>
                <Field label="E-mail" htmlFor="managerEmail" required error={errors.managerEmail?.message}>
                  <input
                    id="managerEmail" type="email" className="pp-form__input"
                    placeholder="emmanuel.fotso@entreprise.cm" {...register('managerEmail')}
                    aria-invalid={errors.managerEmail ? 'true' : undefined}
                  />
                </Field>
                <Field label="Fonction" htmlFor="managerRole" required error={errors.managerRole?.message}>
                  <select
                    id="managerRole" className="pp-form__input" {...register('managerRole')}
                    aria-invalid={errors.managerRole ? 'true' : undefined}
                  >
                    <option value="">Sélectionnez une fonction</option>
                    {PARTNER_MANAGER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className={`pp-form__step${step === 2 ? ' pp-form__step--active' : ''}`}>
              <div className="pp-form__grid">
                <Field label="Nombre d\'agences" htmlFor="agencyCount" required error={errors.agencyCount?.message}>
                  <select
                    id="agencyCount" className="pp-form__input" {...register('agencyCount')}
                    aria-invalid={errors.agencyCount ? 'true' : undefined}
                  >
                    <option value="">Sélectionnez le nombre d\'agences</option>
                    {PARTNER_AGENCY_COUNT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
                <Field label="Nombre d\'employés" htmlFor="employeeCount" required error={errors.employeeCount?.message}>
                  <select
                    id="employeeCount" className="pp-form__input" {...register('employeeCount')}
                    aria-invalid={errors.employeeCount ? 'true' : undefined}
                  >
                    <option value="">Sélectionnez le nombre d\'employés</option>
                    {PARTNER_EMPLOYEE_COUNT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
                <Field label="Comment avez-vous connu la plateforme ?" htmlFor="source" required error={errors.source?.message}>
                  <select
                    id="source" className="pp-form__input" {...register('source')}
                    aria-invalid={errors.source ? 'true' : undefined}
                  >
                    <option value="">Sélectionnez une réponse</option>
                    {PARTNER_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field
                  label="Présentation de votre entreprise"
                  htmlFor="description" required error={errors.description?.message}
                  hint="Décrivez votre activité, vos services et vos zones desservies (20 caractères minimum)."
                >
                  <textarea
                    id="description" className="pp-form__input pp-form__textarea" rows={4}
                    placeholder="Cameroon Trans est une entreprise de transport interurbain basée à Douala. Nous assurons des liaisons quotidiennes vers Yaoundé, Kribi et Bafoussam avec un parc de 15 véhicules..."
                    {...register('description')}
                    aria-invalid={errors.description ? 'true' : undefined}
                  />
                </Field>
              </div>
            </div>

            <div className="pp-form__plan">
              <span className="pp-form__plan-label">Formule sélectionnée</span>
              <strong>{selectedPlan ? selectedPlan.name : 'Starter (par défaut)'}</strong>
              {selectedPlan && (
                <span className="pp-form__plan-price">
                  {selectedPlan.price.toLocaleString('fr-FR')} FCFA / mois
                </span>
              )}
            </div>

            <div className="pp-form__actions">
              {step > 0 && (
                <button type="button" className="pp-btn pp-btn--ghost" onClick={handlePrevious}>
                  <ChevronLeft size={16} /> Retour
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" className="pp-btn pp-btn--primary" onClick={handleNext}>
                  Continuer <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" className="pp-btn pp-btn--primary" disabled={submitDisabled}>
                  {loading ? <LoaderCircle size={16} className="pp-spin" /> : <Mail size={16} />}
                  {loading ? 'Envoi en cours...' : 'Soumettre ma demande'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ConfirmationSection({ application, onReset }) {
  const status = PARTNER_STATUSES[application.status] || PARTNER_STATUSES.EN_ATTENTE_VALIDATION;

  return (
    <section className="pp-section pp-section--alt">
      <div className="pp-section__container">
        <div className="pp-confirm">
          <div className="pp-confirm__icon"><CircleCheck size={40} /></div>
          <span className={`pp-confirm__status pp-confirm__status--${status.color}`}>
            {status.label}
          </span>
          <h2 className="pp-confirm__title">Votre demande de partenariat a bien été enregistrée.</h2>
          <p className="pp-confirm__text">
            Merci de votre confiance ! Notre équipe examine votre dossier et vous recevrez un
            e-mail de confirmation à <strong>{application.contactEmail}</strong> dès que votre
            demande sera validée. Vous pourrez ensuite configurer votre espace et lancer votre activité.
          </p>

          <div className="pp-confirm__card">
            <div className="pp-confirm__row">
              <span>Numéro de référence</span>
              <strong>{application.reference}</strong>
            </div>
            <div className="pp-confirm__row">
              <span>Entreprise</span>
              <strong>{application.companyName}</strong>
            </div>
            <div className="pp-confirm__row">
              <span>Formule</span>
              <strong>{application.plan}</strong>
            </div>
            <div className="pp-confirm__row">
              <span>Date de soumission</span>
              <strong>{new Date(application.createdAt).toLocaleDateString('fr-FR')}</strong>
            </div>
          </div>

          <div className="pp-confirm__actions">
            <button type="button" className="pp-btn pp-btn--primary" onClick={onReset}>
              Soumettre une autre demande
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PartnerPage() {
  const {
    plans, plansLoading, selectedPlan, application, loading, error,
    selectPlan, submit, reset,
  } = usePartnerApplication();

  const handleSelectPlan = (plan) => {
    selectPlan(plan);
    const target = document.getElementById('pp-application');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (data) => {
    const app = await submit(data);
    if (app) {
      toast.success('Votre demande a bien été enregistrée.');
      document.getElementById('pp-application')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pp-page">
      <HeroSection />
      <WhySection />
      <HowSection />

      {application ? (
        <ConfirmationSection application={application} onReset={reset} />
      ) : (
        <>
          <PlansSection
            plans={plans}
            loading={plansLoading}
            selectedPlan={selectedPlan}
            onSelect={handleSelectPlan}
          />
          <ApplicationSection
            selectedPlan={selectedPlan}
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
          />
        </>
      )}

    </div>
  );
}
