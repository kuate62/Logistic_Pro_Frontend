import { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthCard, AuthHeader, AuthFooter } from '../../components/auth';
import { FormField, EmailInput, PasswordInput, LoadingButton, FormError } from '../../components/form';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import useAuthStore from '../../store/useAuthStore';
import { getHomePath } from '../../utils/homePath';
import { loginSchema } from '../../helpers/validation';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const emailRef = useRef(null);

  const {
    values,
    errors,
    submitError,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setValue,
  } = useForm({
    schema: loginSchema,
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    onSubmit: async (values) => {
      return await login({ email: values.email, password: values.password });
    },
  });

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onSubmit = async (e) => {
    try {
      const result = await handleSubmit(e);
      if (result) {
        toast.success('Connexion réussie ! Bienvenue.');
        const { user } = useAuthStore.getState();
        const from = location.state?.from?.pathname;
        const targetPath = from && from !== '/login' ? from : getHomePath(user);
        navigate(targetPath, { replace: true });
      }
    } catch {
      toast.error('Identifiants incorrects.');
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Connexion"
        subtitle="Accédez à votre espace LogisticPro"
      />

      <FormError message={submitError} />

      <form onSubmit={onSubmit} noValidate className="lp-login-form">
        <FormField label="Email" error={errors.email} required>
          <EmailInput
            ref={emailRef}
            placeholder="exemple@email.com"
            autoComplete="email"
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...getFieldProps('email')}
          />
        </FormField>

        <FormField label="Mot de passe" error={errors.password} required>
          <PasswordInput
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...getFieldProps('password')}
          />
        </FormField>

        <div className="lp-login-form__options">
          <label className="lp-login-form__checkbox">
            <input
              type="checkbox"
              name="remember"
              className="lp-login-form__checkbox-input"
              checked={values.remember || false}
              onChange={(e) => setValue('remember', e.target.checked)}
            />
            <span className="lp-login-form__checkbox-custom" />
            <span className="lp-login-form__checkbox-label">Se souvenir de moi</span>
          </label>
          <Link to="/forgot-password" className="lp-login-form__forgot">
            Mot de passe oublié ?
          </Link>
        </div>

        <LoadingButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          loadingText="Connexion en cours..."
        >
          Se connecter
        </LoadingButton>
      </form>

      <AuthFooter>
        Pas encore de compte ?{' '}
        <Link to="/register">Créer un compte</Link>
      </AuthFooter>
    </AuthCard>
  );
}

export default LoginPage;
