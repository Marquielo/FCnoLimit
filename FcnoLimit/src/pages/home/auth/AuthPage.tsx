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
  logoApple,
  personCircleOutline,
  footballSharp,
  trophySharp
} from 'ionicons/icons';
import './AuthPage.css';
import NavBar from '../../../components/NavBar';
import { useHistory } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const history = useHistory();
  
  console.log("Renderizando AuthPage");
  
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

  // Agregar estados para los errores de inicio de sesión
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');

  // Agregar estados para validación de campos obligatorios
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Agregar estado para los términos de servicio
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  // Agregar estos estados para el manejo de roles
  const [selectedRole, setSelectedRole] = useState('persona_natural');
  const [roleError, setRoleError] = useState('');

  // Modifica cómo obtienes la URL de la API para forzar el valor correcto
  const apiBaseUrl = 'https://fcnolimit-back.onrender.com';
  console.log("API URL base fija:", apiBaseUrl);

  // Asegúrate de que no haya caracteres problemáticos en la URL
  const cleanApiUrl = apiBaseUrl.toString().replace(/^=/, '');
  console.log("URL limpia a usar en las peticiones:", cleanApiUrl);

  // Función para probar la conexión a la base de datos
  const testDbConnection = async () => {
    try {
      const response = await fetch('https://fcnolimit-back.onrender.com/api/dbtest');
      const data = await response.json();
      console.log('Conexión a la base de datos:', data);
      return data;
    } catch (error) {
      console.error('Error al probar la conexión a la base de datos:', error);
      return null;
    }
  };

  // Ejecutar la prueba al cargar el componente
  useEffect(() => {
    testDbConnection();
  }, []);

  // Elimina Google SignIn simulado y su botón funcional
  // Si quieres dejar el botón, puedes deshabilitarlo así:
  const handleGoogleSignIn = () => {
    setError('Inicio de sesión con Google no disponible.');
  };

  // Función para validar email de inicio de sesión
  const validateLoginEmail = (email: string) => {
    if (!email || email.trim() === '') {
      setLoginEmailError('Error, campo obligatorio.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
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

  // Modificar la función de inicio de sesión para incluir validación
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
      console.log("Iniciando proceso de login");
      present({ message: 'Iniciando sesión...' });

      // Construir la URL cuidadosamente - sin /api/ si no es necesario según tu backend
      const loginUrl = 'https://fcnolimit-back.onrender.com/api/usuarios/login';
      console.log("URL completa para login:", loginUrl);
      
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contraseña: password }),
      });

      console.log("Respuesta recibida, status:", res.status);
      
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      dismiss();
      if (!res.ok) throw new Error(data.error || 'Error de autenticación');
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.user));
      history.push('/inicio'); // <--- Usa el router en vez de window.location.href
    } catch (err: any) {
      dismiss();
      setError(err.message === 'Failed to fetch'
        ? 'No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.'
        : err.message || 'Correo o contraseña incorrectos');
    }
  };

  // Función mejorada para validar email
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailValid(false);
      setEmailError('Error, campo obligatorio.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      setEmailValid(false);
      setEmailError('Error, formato de email inválido.');
      return false;
    }
    
    setEmailValid(true);
    setEmailError('');
    return true;
  };

  // Función mejorada para validar contraseña
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordValid(false);
      setPasswordError('Error, campo obligatorio.');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordValid(false);
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    
    // Validar que contenga mayúsculas y minúsculas
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setPasswordValid(false);
      setPasswordError('La contraseña debe contener al menos una letra mayúscula y una minúscula.');
      return false;
    }
    
    setPasswordValid(true);
    setPasswordError('');
    return true;
  };

  // Función mejorada para verificar coincidencia de contraseñas
  const validatePasswords = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      setPasswordsMatch(false);
      return false;
    }
    
    const doMatch = password === confirmPassword;
    setPasswordsMatch(doMatch);
    return doMatch;
  };
  
  // Función para validar nombre
  const validateName = (name: string) => {
    if (!name || name.trim() === '') {
      setNameError('Error, campo obligatorio.');
      return false;
    }
    setNameError('');
    return true;
  };
  
  // Modificar el manejador del nombre para validarlo
  const handleNameChange = (value: string) => {
    setRegisterName(value);
    // Validamos solo si ya tenía un error o si el campo se dejó vacío después de escribir
    if (nameError || !value) {
      validateName(value);
    }
  };

  // Modificar las funciones para validar
  const handleRegisterPasswordChange = (value: string) => {
    setRegisterPassword(value);
    // Validamos solo si ya tenía un error o si hay suficiente texto para validar
    if (passwordError || value.length >= 6) {
      validatePassword(value);
    }
    if (registerConfirmPassword) {
      validatePasswords(value, registerConfirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setRegisterConfirmPassword(value);
    if (value) {
      validatePasswords(registerPassword, value);
    }
  };

  const handleEmailChange = (value: string) => {
    setRegisterEmail(value);
    // Validamos solo si ya tenía un error o si hay un @ en el email
    if (emailError || value.includes('@')) {
      validateEmail(value);
    }
  };

  // Función para validar términos de servicio
  const validateTerms = (agreed: boolean) => {
    if (!agreed) {
      setTermsError('Error, campo obligatorio.');
      return false;
    }
    setTermsError('');
    return true;
  };

  // Manejador para el cambio en el checkbox de términos
  const handleTermsChange = (checked: boolean) => {
    setAgreeToTerms(checked);
    if (checked) {
      setTermsError('');
    }
  };

  // Agregar esta función para validar que se haya seleccionado un rol
  const validateRole = (role: string) => {
    if (!role) {
      setRoleError('Error, debes seleccionar un tipo de usuario.');
      return false;
    }
    setRoleError('');
    return true;
  };

  // Modificar la función de registro para incluir el rol seleccionado
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    
    // Validar todos los campos incluyendo el rol
    const isNameValid = validateName(registerName);
    const isEmailValid = validateEmail(registerEmail);
    const isPasswordValid = validatePassword(registerPassword);
    const doPasswordsMatch = validatePasswords(registerPassword, registerConfirmPassword);
    const didAgreeToTerms = validateTerms(agreeToTerms);
    const isRoleValid = validateRole(selectedRole);
    
    // Si algún campo no es válido, no continuar
    if (!isNameValid || !isEmailValid || !isPasswordValid || 
        !doPasswordsMatch || !didAgreeToTerms || !isRoleValid) {
      setRegisterError('Por favor, completa correctamente todos los campos.');
      return;
    }
    
    try {
      present({ message: 'Creando cuenta...' });
      const res = await fetch('https://fcnolimit-back.onrender.com/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_completo: registerName || registerEmail.split('@')[0],
          correo: registerEmail,
          contraseña: registerPassword,
          rol: selectedRole // Usar el rol seleccionado
        })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      dismiss();
      
      // Manejar específicamente el error de correo duplicado
      if (!res.ok) {
        // Verificar si el error está relacionado con correo duplicado
        if (data.error && (
          data.error.includes('duplicate key') || 
          data.error.includes('correo_key') || 
          data.error.includes('ya existe') ||
          data.error.includes('already exists')
        )) {
          setEmailValid(false);
          setEmailError('Error, este correo electrónico ya está registrado.');
          setRegisterError('El correo electrónico ya está registrado. Por favor, utiliza otro o inicia sesión.');
          return;
        }
        
        // Para otros errores
        throw new Error(data.error || 'Error al registrar');
      }
      
      setRegisterSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      setShowLogin(true);
    } catch (err: any) {
      dismiss();
      setRegisterError(err.message === 'Failed to fetch'
        ? 'No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.'
        : err.message || 'Error al registrar');
    }
  };

  // Añadir este efecto para asegurar que se deshabilita la validación nativa
  useEffect(() => {
    // Deshabilitar validación nativa en todos los inputs
    const inputs = document.querySelectorAll('input, ion-input');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        input.setAttribute('novalidate', 'true');
        input.removeAttribute('required');
      }
    });
    
    // Asegurar que los formularios tienen noValidate
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.setAttribute('novalidate', 'true');
    });
  }, []);

  return (
    <IonPage className="auth-page">
      <NavBar />
      <IonContent scrollY={true} className="ion-padding">
        <IonGrid className="auth-grid">
          <IonRow>
            {/* Columna izquierda - Con logo y fondo de fútbol */}
            <IonCol size="12" sizeSm="7" sizeMd="7" sizeXl="4" className="left-column">
              <div className="football-bg"></div>
              <div className="left-container">
                <div className="logo-container">
                  <IonIcon icon={footballOutline} className="logo-icon" />
                  <div className="logo-text">
                    FCnoLim<span className="logo-text-highlight">it</span>
                  </div>
                </div>
                
                <h1 className="left-title">¿No tienes una cuenta?</h1>
                <p className="left-description">
                  Únete a la mejor plataforma de fútbol amateur y descubre nuevas oportunidades para tu pasión deportiva.
                </p>
                <IonButton 
                  className="sign-up-button" 
                  expand="block" 
                  fill="outline"
                  onClick={() => setShowLogin(false)}
                >
                  REGÍSTRATE
                </IonButton>
              </div>
            </IonCol>
            
            {/* Columna derecha - Formulario rediseñado */}
            <IonCol size="12" sizeSm="7" sizeMd="7" sizeXl="8" className="right-column">
              <div className="form-container">
                {showLogin ? (
                  <>
                    <h2 className="form-title">Iniciar Sesión</h2>
                    <form onSubmit={handleLogin} className="auth-form" noValidate>
                      {/* Botones de login social */}
                      <div className="social-buttons">
                        <IonButton 
                          fill="clear" 
                          className="social-button google"
                          onClick={handleGoogleSignIn}
                          type="button"
                          disabled
                        >
                          <IonIcon icon={logoGoogle}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button facebook" disabled>
                          <IonIcon icon={logoFacebook}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button apple" disabled>
                          <IonIcon icon={logoApple}></IonIcon>
                        </IonButton>
                      </div>
                      
                      {/* Separador */}
                      <div className="separator">o</div>
                      
                      {/* Campo de Email con validación */}
                      <div className="field-container">
                        <div className="field-label">Email</div>
                        <IonItem className={`custom-input ${loginEmailError ? 'has-error' : ''}`} lines="full">
                          <IonInput
                            className="custom-input-field"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onIonChange={e => handleLoginEmailChange(e.detail.value!)}
                            onIonBlur={() => validateLoginEmail(email)}
                            required={false}
                            autocomplete="off"
                            clearInput={false}
                            mode="ios"
                          ></IonInput>
                        </IonItem>
                        {loginEmailError && (
                          <div className="validation-message">{loginEmailError}</div>
                        )}
                      </div>
                      
                      {/* Campo de Password con botón para mostrar/ocultar y validación */}
                      <div className="field-container">
                        <div className="field-label">Contraseña</div>
                        <div className="password-container">
                          <IonItem className={`custom-input ${loginPasswordError ? 'has-error' : ''}`}>
                            <IonInput
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Contraseña"
                              value={password}
                              onIonChange={e => handleLoginPasswordChange(e.detail.value!)}
                              onIonBlur={() => validateLoginPassword(password)}
                              required={false}
                              className="custom-input-field"
                            ></IonInput>
                          </IonItem>
                          <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline}></IonIcon>
                          </button>
                        </div>
                        {loginPasswordError && (
                          <div className="validation-message">{loginPasswordError}</div>
                        )}
                      </div>
                      
                      <div className="forgot-password">
                        <a href="#">¿Olvidaste tu contraseña?</a>
                      </div>
                      
                      {error && <div className="error-message">{error}</div>}
                      
                      <IonButton expand="block" type="submit" className="submit-button">
                        Iniciar Sesión
                      </IonButton>
                      
                      <div className="auth-footer">
                        <p>
                          ¿Nuevo en FCnoLimit? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowLogin(false);
                          }}>Crear cuenta</a>
                        </p>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                  <div className="crear-cuenta">
                    <h2 className="form-title">
                      Crear Cuen<span>ta</span>
                    </h2>
                    <form onSubmit={handleRegister} className="auth-form" noValidate>
                      {/* Botones de registro social */}
                      <div className="social-buttons">
                        <div className="social-button-container">
                          <IonButton 
                            fill="clear" 
                            className="social-button google"
                            onClick={handleGoogleSignIn}
                            type="button"
                            disabled
                          >
                            <IonIcon icon={logoGoogle}></IonIcon>
                          </IonButton>
                        </div>
                        <div className="social-button-container">
                          <IonButton fill="clear" className="social-button facebook" disabled>
                            <IonIcon icon={logoFacebook}></IonIcon>
                          </IonButton>
                        </div>
                        <div className="social-button-container">
                          <IonButton fill="clear" className="social-button apple" disabled>
                            <IonIcon icon={logoApple}></IonIcon>
                          </IonButton>
                        </div>
                      </div>
                      
                      {/* Separador */}
                      <div className="separator">o</div>
                      
                      {/* Formulario en formato 2x2 */}
                      <div className="form-grid">
                        {/* Campo de Nombre */}
                        <div className="form-grid-item">
                          <div className="field-label">Nombre</div>
                          <IonItem className={`custom-input ${nameError ? 'has-error' : ''}`}>
                            <IonInput
                              type="text"
                              placeholder="Nombre"
                              value={registerName}
                              onIonChange={e => handleNameChange(e.detail.value!)}
                              required={false}
                              className="custom-input-field"
                            ></IonInput>
                          </IonItem>
                          {nameError && (
                            <div className="validation-message">{nameError}</div>
                          )}
                        </div>
                        
                        {/* Campo de Email */}
                        <div className="form-grid-item">
                          <div className="field-label">Email</div>
                          <IonItem className={`custom-input ${emailError ? 'has-error' : ''}`}>
                            <IonInput
                              type="email"
                              placeholder="Email"
                              value={registerEmail}
                              onIonChange={e => handleEmailChange(e.detail.value!)}
                              onIonBlur={() => validateEmail(registerEmail)}
                              required={false}
                              autocomplete="off"
                              className="custom-input-field"
                            ></IonInput>
                          </IonItem>
                          {emailError && (
                            <div className="validation-message">{emailError}</div>
                          )}
                        </div>
                        
                        {/* Campo de Contraseña */}
                        <div className="form-grid-item">
                          <div className="field-label">Contraseña</div>
                          <div className="password-container">
                            <IonItem className={`custom-input ${passwordError ? 'has-error' : ''}`}>
                              <IonInput
                                type={showRegisterPassword ? 'text' : 'password'}
                                placeholder="Contraseña"
                                value={registerPassword}
                                onIonChange={e => handleRegisterPasswordChange(e.detail.value!)}
                                required={false}
                                className="custom-input-field"
                              ></IonInput>
                            </IonItem>
                            <button 
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              tabIndex={-1}
                            >
                              <IonIcon icon={showRegisterPassword ? eyeOutline : eyeOffOutline}></IonIcon>
                            </button>
                          </div>
                          {passwordError && (
                            <div className="validation-message">{passwordError}</div>
                          )}
                        </div>
                        
                        {/* Campo de Confirmar Contraseña */}
                        <div className="form-grid-item">
                          <div className="field-label">Confirmar Contraseña</div>
                          <div className="password-container">
                            <IonItem className={`custom-input ${!passwordsMatch && registerConfirmPassword ? 'has-error' : ''}`}>
                              <IonInput
                                type={showRegisterConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirmar Contraseña"
                                value={registerConfirmPassword}
                                onIonChange={e => handleConfirmPasswordChange(e.detail.value!)}
                                required={false}
                                className="custom-input-field"
                              ></IonInput>
                            </IonItem>
                            <button 
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                              tabIndex={-1}
                            >
                              <IonIcon icon={showRegisterConfirmPassword ? eyeOutline : eyeOffOutline}></IonIcon>
                            </button>
                          </div>
                          {!passwordsMatch && registerConfirmPassword && (
                            <div className="validation-message">Error, las contraseñas no coinciden.</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Selector de tipo de usuario simplificado */}
                      <div className="role-selection-container">
                        <div className="field-label">Tipo de Usuario</div>
                        <div className="role-options">
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
                              <div className="role-name">Perfil</div>
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
                  </div>
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

export default AuthPage;