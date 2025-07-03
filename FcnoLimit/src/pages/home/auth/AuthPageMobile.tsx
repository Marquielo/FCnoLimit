import { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonItem, 
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  useIonLoading
} from '@ionic/react';
import { 
  footballOutline, 
  eyeOutline, 
  eyeOffOutline,
  logoGoogle,
  logoFacebook,
  logoApple
} from 'ionicons/icons';
import './AuthPage.css';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { googleAuthService } from '../../../services/googleAuthService';

const AuthPageMobile: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();
  
  console.log("Renderizando AuthPageMobile");
  
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [present, dismiss] = useIonLoading();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  // Estados para los errores de inicio de sesión
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');

  // Estados para validación de campos obligatorios
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Estado para los términos de servicio
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  // Estados para el manejo de roles
  const [selectedRole, setSelectedRole] = useState('persona_natural');
  const [roleError, setRoleError] = useState('');

  // Función para Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setError('');
      present({ message: 'Conectando con Google...' });
      
      const result = await googleAuthService.loginComplete();
      console.log("🔐 Resultado de Google Sign In:", result);
      
      if (result.user) {
        console.log("✅ Google Sign In exitoso:", result.user);
        
        // Guardar los tokens de autenticación
        if (result.accessToken && result.refreshToken) {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem('tokenExpiresAt', (Date.now() + (result.expiresIn * 1000)).toString());
          localStorage.setItem('usuario', JSON.stringify(result.user));
          console.log('🔒 Autenticado con refresh tokens');
        } else if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('usuario', JSON.stringify(result.user));
          console.log('🔒 Autenticado con token legacy');
        }
        
        console.log("👤 Usuario autenticado:", result.user);
        dismiss();
        
        // Redireccionar según el rol del usuario
        switch (result.user.rol) {
          case 'jugador':
            history.push('/jugador/perfil');
            break;
          case 'entrenador':
            history.push('/entrenador/perfil');
            break;
          case 'persona_natural':
          default:
            history.push('/inicio');
            break;
        }
      } else {
        dismiss();
        setError('Error al conectar con Google');
      }
    } catch (error: any) {
      dismiss();
      console.error("❌ Error en Google Sign In:", error);
      setError(error.message || 'Error al conectar con Google');
    }
  };

  // Función para validar email de inicio de sesión
  const validateLoginEmail = (email: string) => {
    if (!email || email.trim() === '') {
      setLoginEmailError('Error, campo obligatorio.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoginEmailError('Error, formato de email inválido.');
      return false;
    }
    
    setLoginEmailError('');
    return true;
  };
  
  // Función para validar contraseña de inicio de sesión
  const validateLoginPassword = (password: string) => {
    if (!password || password.trim() === '') {
      setLoginPasswordError('Error, campo obligatorio.');
      return false;
    }
    
    setLoginPasswordError('');
    return true;
  };
  
  // Manejadores para los campos de inicio de sesión
  const handleLoginEmailChange = (value: string) => {
    setEmail(value);
    if (loginEmailError || !value) {
      validateLoginEmail(value);
    }
  };
  
  const handleLoginPasswordChange = (value: string) => {
    setPassword(value);
    if (loginPasswordError || !value) {
      validateLoginPassword(value);
    }
  };

  // Función de inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar los campos primero
    const isEmailValid = validateLoginEmail(email);
    const isPasswordValid = validateLoginPassword(password);
    
    // Si algún campo no es válido, no continuar
    if (!isEmailValid || !isPasswordValid) {
      setError('Por favor, completa correctamente todos los campos.');
      return;
    }
    
    try {
      console.log("Iniciando proceso de login con hook useAuth");
      present({ message: 'Iniciando sesión...' });
      
      // Usar el hook de autenticación con parámetros correctos
      const result = await login(email, password);
      
      dismiss();
      
      if (result && result.user) {
        console.log("✅ LOGIN EXITOSO:", result.user);
        
        // Redireccionar según el rol del usuario
        switch (result.user.rol) {
          case 'jugador':
            history.push('/jugador/perfil');
            break;
          case 'entrenador':
            history.push('/entrenador/perfil');
            break;
          case 'persona_natural':
          default:
            history.push('/inicio');
            break;
        }
      } else {
        setError('Error al iniciar sesión');
      }
    } catch (err: any) {
      dismiss();
      console.error("❌ Error en login:", err);
      setError(err.message === 'Failed to fetch'
        ? 'No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.'
        : err.message || 'Error al iniciar sesión');
    }
  };

  // Validación en tiempo real para las contraseñas
  useEffect(() => {
    if (registerPassword && registerConfirmPassword) {
      setPasswordsMatch(registerPassword === registerConfirmPassword);
    }
  }, [registerPassword, registerConfirmPassword]);

  // Validación de términos
  const handleTermsChange = (checked: boolean) => {
    setAgreeToTerms(checked);
    if (termsError && checked) {
      setTermsError('');
    }
  };

  // Validaciones para registro
  const validateName = (name: string) => {
    if (!name || name.trim() === '') {
      setNameError('Error, campo obligatorio.');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (email: string) => {
    if (!email || email.trim() === '') {
      setEmailError('Error, campo obligatorio.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Error, formato de email inválido.');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password || password.trim() === '') {
      setPasswordError('Error, campo obligatorio.');
      setPasswordValid(false);
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Error, la contraseña debe tener al menos 6 caracteres.');
      setPasswordValid(false);
      return false;
    }
    
    setPasswordError('');
    setPasswordValid(true);
    return true;
  };

  // Manejadores para los campos de registro
  const handleNameChange = (value: string) => {
    setRegisterName(value);
    if (nameError || !value) {
      validateName(value);
    }
  };

  const handleEmailChange = (value: string) => {
    setRegisterEmail(value);
    if (emailError || !value) {
      validateEmail(value);
    }
  };

  const handlePasswordChange = (value: string) => {
    setRegisterPassword(value);
    if (passwordError || !value) {
      validatePassword(value);
    }
  };

  // Función de registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    
    // Validar todos los campos
    const isNameValid = validateName(registerName);
    const isEmailValid = validateEmail(registerEmail);
    const isPasswordValid = validatePassword(registerPassword);
    
    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      setRegisterError('Por favor, completa correctamente todos los campos obligatorios.');
      return;
    }
    
    if (!passwordsMatch) {
      setRegisterError('Las contraseñas no coinciden.');
      return;
    }
    
    if (!agreeToTerms) {
      setTermsError('Debes aceptar los términos de servicio.');
      setRegisterError('Debes aceptar los términos de servicio.');
      return;
    }
    
    try {
      present({ message: 'Creando cuenta...' });
      
      const response = await fetch('https://fcnolimit-back.onrender.com/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_completo: registerName || registerEmail.split('@')[0],
          correo: registerEmail,
          contraseña: registerPassword,
          rol: selectedRole
        })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        dismiss();
        // Manejar error de correo duplicado
        if (data.error && (
          data.error.includes('duplicate key') || 
          data.error.includes('correo_key') || 
          data.error.includes('ya existe') ||
          data.error.includes('already exists')
        )) {
          setEmailError('Error, este correo electrónico ya está registrado.');
          setRegisterError('El correo electrónico ya está registrado. Por favor, utiliza otro o inicia sesión.');
          return;
        }
        
        throw new Error(data.error || 'Error al registrar');
      }
      
      // Registro exitoso - ahora iniciamos sesión automáticamente
      try {
        const loginRes = await fetch('https://fcnolimit-back.onrender.com/api/usuarios/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            correo: registerEmail, 
            contraseña: registerPassword 
          })
        });
        
        const loginData = await loginRes.json();
        
        if (!loginRes.ok) throw new Error('No se pudo iniciar sesión automáticamente');
        
        // Guardar datos de sesión
        if (loginData.accessToken && loginData.refreshToken) {
          localStorage.setItem('accessToken', loginData.accessToken);
          localStorage.setItem('refreshToken', loginData.refreshToken);
          localStorage.setItem('usuario', JSON.stringify(loginData.user));
          localStorage.setItem('tokenExpiresAt', (Date.now() + (loginData.expiresIn * 1000)).toString());
          console.log('🔒 Registro exitoso con refresh tokens');
        } else {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('usuario', JSON.stringify(loginData.user));
          console.log('🔒 Registro exitoso con token legacy');
        }
        
        console.log("🔐 REGISTRO EXITOSO: Usuario registrado y autenticado como:", selectedRole.toUpperCase());
        console.log("👤 Datos del usuario:", loginData.user);

        dismiss();
        
        // Redireccionar según el rol seleccionado
        switch (selectedRole) {
          case 'jugador':
            history.push('/jugador/perfil');
            break;
          case 'entrenador':
            history.push('/entrenador/perfil');
            break;
          case 'persona_natural':
          default:
            history.push('/inicio');
            break;
        }
      } catch (loginErr) {
        dismiss();
        // Si falla el inicio de sesión automático, mostramos mensaje de éxito y pedimos login manual
        setRegisterSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
        setShowLogin(true);
      }
      
    } catch (err: any) {
      dismiss();
      setRegisterError(err.message === 'Failed to fetch'
        ? 'No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.'
        : err.message || 'Error al registrar');
    }
  };

  // Efecto para deshabilitar validación nativa
  useEffect(() => {
    const inputs = document.querySelectorAll('input, ion-input');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        input.setAttribute('novalidate', 'true');
        input.removeAttribute('required');
      }
    });
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.setAttribute('novalidate', 'true');
    });
  }, []);

  // Verificar si ya hay una sesión activa
  useEffect(() => {
    const userJSON = localStorage.getItem('usuario');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const legacyToken = localStorage.getItem('token');
    
    if (userJSON && (accessToken || legacyToken)) {
      try {
        const userData = JSON.parse(userJSON);
        
        if (accessToken && refreshToken) {
          console.log("👤 Usuario ya autenticado con refresh tokens:", userData.rol.toUpperCase());
          const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
          if (tokenExpiresAt) {
            const expirationTime = parseInt(tokenExpiresAt);
            const timeUntilExpiry = expirationTime - Date.now();
            const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
            console.log(`🕒 Access token expira en ${minutesUntilExpiry} minutos`);
          }
        } else if (legacyToken) {
          console.log("👤 Usuario ya autenticado con token legacy:", userData.rol.toUpperCase());
        }
        
        console.log("👤 Datos del usuario:", userData);
      } catch (error) {
        console.error("Error al leer datos de usuario del localStorage:", error);
      }
    } else {
      console.log("🔒 No hay sesión de usuario activa");
    }
  }, []);

  return (
    <IonPage className="auth-page mobile-auth-page">
      <IonContent 
        scrollY={false} 
        scrollX={false}
        className="ion-padding mobile-auth-content"
        forceOverscroll={false}
      >
        <IonGrid className="auth-grid mobile-auth-grid">
          <IonRow>
            {/* Columna única para formulario en móvil */}
            <IonCol size="12" className="mobile-column">
              {/* Formulario */}
              <div className="form-container mobile-form">
                {showLogin ? (
                  <>
                    <h2 className="form-title">Iniciar Sesión</h2>
                    <form onSubmit={handleLogin} className="auth-form" noValidate>
                      {/* Botones de login social */}
                      <div className="social-buttons">
                        <IonButton 
                          className="social-button google" 
                          fill="solid" 
                          shape="round"
                          onClick={handleGoogleSignIn}
                        >
                          <IonIcon icon={logoGoogle} />
                        </IonButton>
                        <IonButton 
                          className="social-button facebook" 
                          fill="solid" 
                          shape="round"
                          disabled
                        >
                          <IonIcon icon={logoFacebook} />
                        </IonButton>
                        <IonButton 
                          className="social-button apple" 
                          fill="solid" 
                          shape="round"
                          disabled
                        >
                          <IonIcon icon={logoApple} />
                        </IonButton>
                      </div>
                      
                      <div className="separator">
                        <span>o continúa con email</span>
                      </div>
                      
                      {/* Campo de email */}
                      <div className="field-container">
                        <label className="field-label">Correo electrónico *</label>
                        <IonItem className={`custom-input ${loginEmailError ? 'has-error' : ''}`} lines="none">
                          <IonInput
                            type="email"
                            value={email}
                            onIonChange={e => handleLoginEmailChange(e.detail.value!)}
                            placeholder="tu@email.com"
                            clearInput
                          />
                        </IonItem>
                        {loginEmailError && (
                          <div className="validation-message">{loginEmailError}</div>
                        )}
                      </div>
                      
                      {/* Campo de contraseña */}
                      <div className="field-container">
                        <label className="field-label">Contraseña *</label>
                        <IonItem className={`custom-input ${loginPasswordError ? 'has-error' : ''}`} lines="none">
                          <IonInput
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onIonChange={e => handleLoginPasswordChange(e.detail.value!)}
                            placeholder="Tu contraseña"
                          />
                          <IonButton 
                            fill="clear" 
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                          </IonButton>
                        </IonItem>
                        {loginPasswordError && (
                          <div className="validation-message">{loginPasswordError}</div>
                        )}
                      </div>
                      
                      {/* Mensaje de error general */}
                      {error && <div className="error-message">{error}</div>}
                      
                      {/* Botón de login */}
                      <IonButton expand="block" type="submit" className="submit-button">
                        INICIAR SESIÓN
                      </IonButton>
                      
                      <div className="auth-footer">
                        <p>
                          ¿No tienes una cuenta? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowLogin(false);
                          }}>Crear cuenta</a>
                        </p>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <h2 className="form-title">Crear Cuenta</h2>
                    <form onSubmit={handleRegister} className="auth-form" noValidate>
                      {/* Botones de registro social */}
                      <div className="social-buttons">
                        <IonButton 
                          className="social-button google" 
                          fill="solid" 
                          shape="round"
                          onClick={handleGoogleSignIn}
                        >
                          <IonIcon icon={logoGoogle} />
                        </IonButton>
                        <IonButton 
                          className="social-button facebook" 
                          fill="solid" 
                          shape="round"
                          disabled
                        >
                          <IonIcon icon={logoFacebook} />
                        </IonButton>
                        <IonButton 
                          className="social-button apple" 
                          fill="solid" 
                          shape="round"
                          disabled
                        >
                          <IonIcon icon={logoApple} />
                        </IonButton>
                      </div>
                      
                      <div className="separator">
                        <span>o regístrate con email</span>
                      </div>
                      
                      {/* Campo de nombre */}
                      <div className="field-container">
                        <label className="field-label">Nombre completo *</label>
                        <IonItem className={`custom-input ${nameError ? 'has-error' : ''}`} lines="none">
                          <IonInput
                            type="text"
                            value={registerName}
                            onIonChange={e => handleNameChange(e.detail.value!)}
                            placeholder="Tu nombre completo"
                            clearInput
                          />
                        </IonItem>
                        {nameError && (
                          <div className="validation-message">{nameError}</div>
                        )}
                      </div>
                      
                      {/* Campo de email */}
                      <div className="field-container">
                        <label className="field-label">Correo electrónico *</label>
                        <IonItem className={`custom-input ${emailError ? 'has-error' : ''}`} lines="none">
                          <IonInput
                            type="email"
                            value={registerEmail}
                            onIonChange={e => handleEmailChange(e.detail.value!)}
                            placeholder="tu@email.com"
                            clearInput
                          />
                        </IonItem>
                        {emailError && (
                          <div className="validation-message">{emailError}</div>
                        )}
                      </div>
                      
                      {/* Campo de contraseña */}
                      <div className="field-container">
                        <label className="field-label">Contraseña *</label>
                        <IonItem className={`custom-input ${passwordError ? 'has-error' : ''}`} lines="none">
                          <IonInput
                            type={showRegisterPassword ? 'text' : 'password'}
                            value={registerPassword}
                            onIonChange={e => handlePasswordChange(e.detail.value!)}
                            placeholder="Mínimo 6 caracteres"
                          />
                          <IonButton 
                            fill="clear" 
                            size="small"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          >
                            <IonIcon icon={showRegisterPassword ? eyeOffOutline : eyeOutline} />
                          </IonButton>
                        </IonItem>
                        {passwordError && (
                          <div className="validation-message">{passwordError}</div>
                        )}
                      </div>
                      
                      {/* Campo de confirmar contraseña */}
                      <div className="field-container">
                        <label className="field-label">Confirmar contraseña *</label>
                        <IonItem className={`custom-input ${!passwordsMatch ? 'has-error' : ''}`} lines="none">
                          <IonInput
                            type={showRegisterConfirmPassword ? 'text' : 'password'}
                            value={registerConfirmPassword}
                            onIonChange={e => setRegisterConfirmPassword(e.detail.value!)}
                            placeholder="Confirma tu contraseña"
                          />
                          <IonButton 
                            fill="clear" 
                            size="small"
                            onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                          >
                            <IonIcon icon={showRegisterConfirmPassword ? eyeOffOutline : eyeOutline} />
                          </IonButton>
                        </IonItem>
                        {!passwordsMatch && registerConfirmPassword && (
                          <div className="validation-message">Las contraseñas no coinciden</div>
                        )}
                      </div>
                      
                      {/* Selección de rol */}
                      <div className="field-container">
                        <label className="field-label">¿Qué tipo de usuario eres? *</label>
                        <div className="role-selection">
                          <div 
                            className={`role-option ${selectedRole === 'persona_natural' ? 'selected' : ''}`}
                            onClick={() => setSelectedRole('persona_natural')}
                          >
                            <input 
                              type="radio" 
                              id="role-persona" 
                              name="role" 
                              value="persona_natural" 
                              checked={selectedRole === 'persona_natural'} 
                              onChange={() => setSelectedRole('persona_natural')}
                            />
                            <label htmlFor="role-persona">
                              <div className="role-name">Aficionado</div>
                              <div className="role-description">
                                Solo quiero ver contenido y estadísticas
                              </div>
                            </label>
                          </div>
                          
                          <div 
                            className={`role-option ${selectedRole === 'jugador' ? 'selected' : ''}`}
                            onClick={() => setSelectedRole('jugador')}
                          >
                            <input 
                              type="radio" 
                              id="role-jugador" 
                              name="role" 
                              value="jugador" 
                              checked={selectedRole === 'jugador'} 
                              onChange={() => setSelectedRole('jugador')}
                            />
                            <label htmlFor="role-jugador">
                              <div className="role-name">Jugador</div>
                              <div className="role-description">
                                Crea tu perfil deportivo y conéctate con equipos
                              </div>
                            </label>
                          </div>
                          
                          <div 
                            className={`role-option ${selectedRole === 'entrenador' ? 'selected' : ''}`}
                            onClick={() => setSelectedRole('entrenador')}
                          >
                            <input 
                              type="radio" 
                              id="role-entrenador" 
                              name="role" 
                              value="entrenador" 
                              checked={selectedRole === 'entrenador'} 
                              onChange={() => setSelectedRole('entrenador')}
                            />
                            <label htmlFor="role-entrenador">
                              <div className="role-name">Entrenador</div>
                              <div className="role-description">
                                Gestiona tu equipo y desarrolla el talento
                              </div>
                            </label>
                          </div>
                        </div>
                        {roleError && (
                          <div className="validation-message">{roleError}</div>
                        )}
                      </div>
                      
                      {/* Checkbox para aceptar términos y condiciones */}
                      <div className="terms-container">
                        <IonItem className={`custom-checkbox ${termsError ? 'has-error' : ''}`} lines="none">
                          <input 
                            type="checkbox" 
                            id="terms-checkbox" 
                            checked={agreeToTerms} 
                            onChange={(e) => handleTermsChange(e.target.checked)}
                            className="terms-checkbox" 
                          />
                          <label htmlFor="terms-checkbox" className="terms-label">
                            Estoy de acuerdo con los <a href="#" className="terms-link">Términos de servicio</a>.
                          </label>
                        </IonItem>
                        {termsError && (
                          <div className="validation-message">{termsError}</div>
                        )}
                      </div>
                      
                      {/* Mensaje de error general */}
                      {registerError && <div className="error-message">{registerError}</div>}
                      {registerSuccess && <div className="success-message">{registerSuccess}</div>}
                      
                      {/* Botón de registro */}
                      <IonButton expand="block" type="submit" className="submit-button">
                        CREAR CUENTA
                      </IonButton>
                      
                      <div className="auth-footer">
                        <p>
                          ¿Ya tienes una cuenta? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowLogin(true);
                          }}>Iniciar Sesión</a>
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AuthPageMobile;